import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { evidenceManifestSchema, validateEvidenceDigests } from '../evidence';
import { collectRequiredShowcaseAssets } from '../publication';
import { releaseManifest, releaseRecords, sampleBytes, readSampleBytes } from './samples';

describe('immutable evidence attestations', () => {
  it('accepts an empty foundation manifest and rejects nested poison and unsafe paths', () => {
    expect(evidenceManifestSchema.parse({ version: 1, snapshots: [] }).snapshots).toEqual([]);
    const snapshot = releaseManifest.snapshots[0];
    for (const path of ['public/work/../escape.webp', '/work/vora/a.webp', 'public/work/vora/a.svg', 'public/work/vora/a.html']) {
      expect(evidenceManifestSchema.safeParse({ version: 1, snapshots: [{ ...snapshot, media: [{ ...snapshot.media[0], path }] }] }).success).toBe(false);
    }
    expect(evidenceManifestSchema.safeParse({ version: 1, snapshots: [{ ...snapshot, fixtures: [{ ...snapshot.fixtures[0], privateNotes: 'SYNTHETIC_PRIVATE_SENTINEL' }] }] }).success).toBe(false);
    expect(evidenceManifestSchema.safeParse({ version: 1, snapshots: [snapshot, snapshot] }).success).toBe(false);
  });

  it('hashes exact fixture bytes and rejects schema-valid replacements under old attestation', () => {
    const readBytes = readSampleBytes;
    expect(() => validateEvidenceDigests(releaseManifest, readBytes)).not.toThrow();
    const replacement = Buffer.from(sampleBytes.toString().replace('Inspect', 'Review'));
    expect(JSON.parse(replacement.toString()).scenarios[0].steps).toEqual(['Review']);
    const readReplacement = (path: string) => path.startsWith('public/') ? readBytes(path) : Buffer.from(readBytes(path).toString().replace('Inspect', 'Review'));
    expect(() => validateEvidenceDigests(releaseManifest, readReplacement)).toThrow(/digest/i);
    const reviewedRevision = structuredClone(releaseManifest);
    for (const snapshot of reviewedRevision.snapshots) {
      snapshot.id += '-reviewed';
      snapshot.disclosure = 'Reviewed replacement synthetic content.';
      snapshot.fixtures[0].sha256 = createHash('sha256').update(readReplacement(snapshot.fixtures[0].path)).digest('hex');
    }
    expect(() => validateEvidenceDigests(reviewedRevision, readReplacement)).not.toThrow();
    expect(() => validateEvidenceDigests(releaseManifest, path => Buffer.concat([readBytes(path), Buffer.from('\n')]))).toThrow(/digest/i);
  });

  it('derives exactly the files used by resolved production views', () => {
    const assets = collectRequiredShowcaseAssets(releaseRecords, releaseManifest);
    expect(assets).toHaveLength(10);
    expect(assets.map(a => a.path)).toContain('public/work/prism/overview.webp');
    const rolledBack = releaseRecords.map(r => r.kind === 'flagship' ? { ...r, caseStudy: { publication: 'draft' as const }, publication: r.slug === 'vora' ? 'published' as const : 'draft' as const } : r);
    expect(collectRequiredShowcaseAssets(rolledBack, releaseManifest)).toEqual([]);
    // Recorded attestations remain binding even after a catalog rollback.
    expect(() => validateEvidenceDigests(releaseManifest, () => Buffer.from('changed'))).toThrow(/digest/i);
  });
});
