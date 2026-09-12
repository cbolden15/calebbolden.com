import { createHash } from 'node:crypto';
import { z } from 'zod';
import { demoKindSchema, publicTextSchema, evidenceManifestSchema, getApprovedSnapshot, localSyntheticProvenanceSchema, projectSnapshotMetadata, type DemoKind, type ReadEvidenceBytes, type EvidenceManifest } from './types';
export { createFixtureSchema, evidenceManifestSchema, evidenceSnapshotSchema, fixtureAssetSchema, mediaAssetSchema, emptyEvidenceManifest, getApprovedSnapshot, localSyntheticProvenanceSchema, approvedProvenanceSchema, publicProvenanceSchema, projectSnapshotMetadata } from './types';
export type { EvidenceManifest, EvidenceSnapshot, ShowcaseAsset, ReadEvidenceBytes, PublicProvenance } from './types';

/** Read-only validation: every recorded attestation remains binding, even for a draft. */
export function validateEvidenceDigests(input: unknown, readBytes: ReadEvidenceBytes): EvidenceManifest {
  const manifest = evidenceManifestSchema.parse(input);
  for (const snapshot of manifest.snapshots) {
    for (const asset of [...snapshot.fixtures, ...snapshot.media]) {
      const actual = createHash('sha256').update(readBytes(asset.path)).digest('hex');
      if (actual !== asset.sha256) throw new Error(`Evidence digest mismatch: ${asset.path} (${snapshot.id})`);
    }
  }
  return manifest;
}

type FixtureContent = { kind: DemoKind; scenarios: { id: string }[] };
function parseFixture<T extends FixtureContent>(source: string, schema: z.ZodType<T>): T {
  // Content schemas remain authoritative; this scan adds rejection of known private markers.
  publicTextSchema.parse(source);
  const decoded: unknown = JSON.parse(source);
  publicTextSchema.parse(JSON.stringify(decoded));
  return schema.parse(decoded);
}
function projectFixtureContent<T extends FixtureContent, R>(content: T, schema: z.ZodType<T>, projectScenario: (scenario: T['scenarios'][number]) => R) {
  const projected = content.scenarios.map(projectScenario);
  const validated = schema.parse({ kind: content.kind, scenarios: projected });
  publicTextSchema.parse(JSON.stringify(projected));
  return { kind: demoKindSchema.parse(content.kind), scenarios: validated.scenarios as T['scenarios'] };
}

export function projectLocalFixture<T extends FixtureContent, R>(source: string, schema: z.ZodType<T>, projectScenario: (scenario: T['scenarios'][number]) => R,
  evidence: { manifest: unknown; readBytes: ReadEvidenceBytes }) {
  if (process.env.NODE_ENV !== 'development') throw new Error('Local synthetic fixtures are available only in development');
  const manifest = validateEvidenceDigests(evidence.manifest, evidence.readBytes);
  const content = parseFixture(source, schema);
  for (const snapshot of manifest.snapshots) {
    const attested = snapshot.fixtures.find(asset => asset.path === `lib/work/fixtures/${content.kind}.json`);
    if (attested && createHash('sha256').update(source).digest('hex') !== attested.sha256) throw new Error(`Evidence digest mismatch: ${attested.path}`);
  }
  const selected = projectFixtureContent(content, schema, projectScenario);
  return { kind: selected.kind, scenarios: selected.scenarios, provenance: localSyntheticProvenanceSchema.parse({ kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' }) };
}

function assertAllowedFields(value: unknown, allowed: Set<string>, prefix = ''): void {
  if (Array.isArray(value)) { for (const item of value) assertAllowedFields(item, allowed, prefix); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!allowed.has(path)) throw new Error(`Fixture field is not approved: ${path}`);
    assertAllowedFields(nested, allowed, path);
  }
}

export function projectApprovedFixture<T extends FixtureContent, R>(options: {
  manifest: unknown; snapshotId: string; fixturePath: string; schema: z.ZodType<T>;
  projectScenario: (scenario: T['scenarios'][number]) => R; readBytes: ReadEvidenceBytes;
}) {
  const manifest = validateEvidenceDigests(options.manifest, options.readBytes);
  const snapshot = getApprovedSnapshot(manifest, options.snapshotId);
  const asset = snapshot.fixtures.find(fixture => fixture.path === options.fixturePath);
  if (!asset) throw new Error('Fixture does not belong to approved snapshot');
  // Bind parsing to these exact bytes too, including readers whose contents change between calls.
  const bytes = options.readBytes(asset.path);
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`Evidence digest mismatch: ${asset.path}`);
  const content = parseFixture(Buffer.from(bytes).toString('utf8'), options.schema);
  if (asset.path !== `lib/work/fixtures/${content.kind}.json`) throw new Error('Fixture kind and approved path disagree');
  assertAllowedFields(content, new Set(asset.allowedFields));
  const selected = projectFixtureContent(content, options.schema, options.projectScenario);
  assertAllowedFields(selected, new Set(asset.allowedFields));
  return { kind: selected.kind, scenarios: selected.scenarios, provenance: projectSnapshotMetadata(snapshot) };
}
