import { evidenceManifestSchema, getApprovedSnapshot, type EvidenceManifest, type ShowcaseAsset } from './types';
import { projectRecordSchema, type KnownLegacyRoute, type KnownRichRoute, type LegacySecondaryRecord, type ProjectRecord, type PublishedCaseStudy, type RichFlagshipRecord } from './types';

export type PublicProjectView =
  | { kind: 'not-found' }
  | { kind: 'legacy'; state: 'legacy' | 'rich-draft-with-legacy-fallback'; record: RichFlagshipRecord | LegacySecondaryRecord; destination: KnownLegacyRoute }
  | { kind: 'rich'; state: 'rich-published'; record: RichFlagshipRecord; body: PublishedCaseStudy; destination: KnownRichRoute };

/** Structural resolution only. Build/route adapters must also validate graph and evidence bytes. */
export function resolvePublicProjectView(input: unknown): PublicProjectView {
  const record = projectRecordSchema.parse(input);
  if (record.publication !== 'published') return { kind: 'not-found' };
  if (record.kind === 'legacy-secondary' && record.destination) return { kind: 'legacy', state: 'legacy', record, destination: record.destination };
  if (record.kind !== 'flagship') return { kind: 'not-found' };
  if (record.caseStudy?.publication === 'published') {
    if (!record.destination) throw new Error(`Published rich project has no route: ${record.slug}`);
    return { kind: 'rich', state: 'rich-published', record, body: record.caseStudy, destination: record.destination };
  }
  if (record.legacyDestination) return { kind: 'legacy', state: record.caseStudy ? 'rich-draft-with-legacy-fallback' : 'legacy', record, destination: record.legacyDestination };
  return { kind: 'not-found' };
}

export function resolveDevelopmentProjectView(input: unknown) {
  const record = projectRecordSchema.parse(input);
  if (process.env.NODE_ENV === 'development' && record.kind === 'flagship' && record.caseStudy?.publication === 'draft') {
    return { kind: 'rich-draft' as const, record, body: record.caseStudy, label: 'Local synthetic example. Unapproved for publication.' as const };
  }
  return resolvePublicProjectView(record);
}

export function getPublishedWorkPaths(records: readonly ProjectRecord[]): (KnownLegacyRoute | KnownRichRoute)[] {
  const paths = records.flatMap(record => {
    if (!record.placements.some(p => p === 'work' || p === 'case-study')) return [];
    const view = resolvePublicProjectView(record);
    return view.kind === 'not-found' ? [] : [view.destination];
  });
  return [...new Set(paths)];
}

export function getPublishedCollectionPaths(records: readonly ProjectRecord[]): '/work/open-source'[] {
  return records.some(record => record.kind === 'collection' && record.publication === 'published') ? ['/work/open-source'] : [];
}

/** Exact relative fixture/media paths consumed by currently resolved public surfaces. No IO. */
export function collectRequiredShowcaseAssets(records: readonly ProjectRecord[], input: unknown): ShowcaseAsset[] {
  const manifest = evidenceManifestSchema.parse(input);
  const required = new Map<string, ShowcaseAsset>();
  for (const record of records) {
    const view = resolvePublicProjectView(record);
    if (view.kind !== 'rich') continue;
    const snapshot = getApprovedSnapshot(manifest, view.body.interaction.snapshotId);
    if (record.slug === 'prism' && (!snapshot.version || !snapshot.sourceRevision || snapshot.derivation === 'illustrative')) {
      throw new Error('Prism snapshot requires version, public revision, and captured or contract-derived provenance');
    }
    const fixture = snapshot.fixtures.find(asset => asset.path === `lib/work/fixtures/${record.slug}.json`);
    if (!fixture) throw new Error(`Snapshot has no matching fixture: ${record.slug}`);
    required.set(fixture.path, fixture);
    for (const media of view.body.evidence) {
      const mediaSnapshot = getApprovedSnapshot(manifest, media.snapshotId);
      const sources = media.kind === 'video' ? [media.src, media.poster] : [media.src];
      for (const source of sources) {
        const asset = mediaSnapshot.media.find(item => item.path === `public${source}`);
        if (!asset) throw new Error(`Snapshot does not approve media: ${source}`);
        if (asset.width !== media.width || asset.height !== media.height) throw new Error(`Media dimensions disagree: ${source}`);
        required.set(asset.path, asset);
      }
    }
    if (record.kind === 'flagship' && record.placements.includes('how-i-build') && record.responsibility) {
      getApprovedSnapshot(manifest, record.responsibility.snapshotId);
      if (!view.body.evidence.some(media => media.snapshotId === record.responsibility!.snapshotId)) throw new Error('Responsibility requires an evidence selection from this project');
    }
  }
  return [...required.values()].sort((a, b) => a.path.localeCompare(b.path));
}

/** Route inventory is observed filesystem state supplied by the build adapter, never an override. */
export function validateProjectGraph(records: readonly ProjectRecord[], manifest: EvidenceManifest, routePaths: readonly string[]): void {
  const parsed = records.map(record => projectRecordSchema.parse(record));
  const slugs = new Set(parsed.map(record => record.slug));
  if (slugs.size !== parsed.length) throw new Error('Duplicate project slug');
  const routes = new Set(routePaths);
  for (const record of parsed) {
    for (const related of record.related) if (!slugs.has(related)) throw new Error(`Unknown related project: ${related}`);
    if (record.publication !== 'published') continue;
    if (record.kind === 'collection') {
      if (!routes.has(record.destination)) throw new Error(`Missing collection route file: ${record.destination}`);
      continue;
    }
    if (!record.placements.some(p => p === 'work' || p === 'case-study' || p === 'how-i-build')) continue;
    const view = resolvePublicProjectView(record);
    if (view.kind === 'not-found') throw new Error(`Published placement has no resolved route: ${record.slug}`);
    if (!routes.has(view.destination)) throw new Error(`Missing project route file: ${view.destination}`);
  }
  collectRequiredShowcaseAssets(parsed, manifest);
}
