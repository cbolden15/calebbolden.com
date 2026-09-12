import { z } from 'zod';

export const publicTextSchema = z.string().min(1).refine(
  value => !/SYNTHETIC_PRIVATE_SENTINEL|\/Users\/|\/home\/|\b(?:localhost|[\w-]+\.internal)\b|\bsk-[A-Za-z0-9]{12,}/i.test(value),
  'Contains a private marker, local path, host, or token',
);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const categorySchema = z.enum(['products', 'developer-tools']);
export type Category = z.infer<typeof categorySchema>;
export type CategoryFilter = 'all' | Category;
export const placementSchema = z.enum(['home', 'work', 'case-study', 'how-i-build']);
export type Placement = z.infer<typeof placementSchema>;
export const demoKindSchema = z.enum(['vora', 'prism', 'agent-team', 'agent-config', 'control-center']);
export type DemoKind = z.infer<typeof demoKindSchema>;
export const knownRichRoutes = ['/work/vora', '/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center'] as const;
export const knownLegacyRoutes = ['/work/vora', '/work/chapterhq', '/work/site-assistant'] as const;
export type KnownRichRoute = typeof knownRichRoutes[number];
export type KnownLegacyRoute = typeof knownLegacyRoutes[number];
export const destinationSchema = z.enum([...knownRichRoutes, ...knownLegacyRoutes]);
export const collectionDestinationSchema = z.literal('/work/open-source');
export const publicLinkSchema = z.strictObject({
  label: publicTextSchema,
  href: z.url().refine(value => {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port &&
      !/^(localhost|\d[\d.]*)$|\.internal$|\.local$/.test(url.hostname);
  }, 'Requires a public HTTPS URL'),
});
export const rasterSourceSchema = z.string().regex(/^\/work\/[a-z0-9-]+\/[a-z0-9-]+\.(?:png|jpe?g|webp|avif)$/);
export const videoSourceSchema = z.string().regex(/^\/work\/[a-z0-9-]+\/[a-z0-9-]+\.(?:mp4|webm)$/);
export const fixturePathSchema = z.string().regex(/^lib\/work\/fixtures\/(?:vora|prism|agent-team|agent-config|control-center)\.json$/);
export const imageFields = {
  src: rasterSourceSchema, alt: publicTextSchema, caption: publicTextSchema,
  width: z.number().int().positive(), height: z.number().int().positive(),
};
export const publicMediaSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('image'), snapshotId: slugSchema, ...imageFields }),
  z.strictObject({
    kind: z.literal('video'), snapshotId: slugSchema, src: videoSourceSchema,
    poster: rasterSourceSchema, alt: publicTextSchema, caption: publicTextSchema,
    width: z.number().int().positive(), height: z.number().int().positive(), transcript: publicTextSchema,
    captions: z.array(z.strictObject({ start: z.number().nonnegative(), end: z.number().positive(), text: publicTextSchema })
      .refine(cue => cue.end > cue.start, 'Caption end must follow start')).min(1),
  }),
]);
export type PublicMedia = z.infer<typeof publicMediaSchema>;
const interactionFields = { snapshotId: slugSchema, label: publicTextSchema, caption: publicTextSchema };
export const publicInteractionSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('vora'), ...interactionFields }),
  z.strictObject({ kind: z.literal('prism'), ...interactionFields }),
  z.strictObject({ kind: z.literal('agent-team'), ...interactionFields }),
  z.strictObject({ kind: z.literal('agent-config'), ...interactionFields }),
  z.strictObject({ kind: z.literal('control-center'), ...interactionFields }),
]);
export type PublicInteraction = z.infer<typeof publicInteractionSchema>;
export const projectStorySchema = z.strictObject({
  problem: publicTextSchema,
  workflow: z.strictObject({ introduction: publicTextSchema, walkthroughs: z.array(z.strictObject({ id: slugSchema, title: publicTextSchema, steps: z.array(publicTextSchema).min(1) })).min(1) }),
  decisions: z.array(z.strictObject({ constraint: publicTextSchema, choice: publicTextSchema, consequence: publicTextSchema })).min(2).max(3),
  credits: z.array(publicTextSchema).min(1), limits: z.array(publicTextSchema).min(1), about: publicTextSchema,
});
export type ProjectStory = z.infer<typeof projectStorySchema>;
export const localFixtureReferenceSchema = z.strictObject({ kind: demoKindSchema, path: fixturePathSchema })
  .refine(value => value.path === `lib/work/fixtures/${value.kind}.json`, 'Fixture must belong to the selected demo');
export const draftCaseStudySchema = z.strictObject({ publication: z.literal('draft'), story: projectStorySchema.optional(), localFixture: localFixtureReferenceSchema.optional() });
export const publishedCaseStudySchema = z.strictObject({ publication: z.literal('published'), story: projectStorySchema, evidence: z.array(publicMediaSchema).min(1), interaction: publicInteractionSchema });
export type DraftCaseStudy = z.infer<typeof draftCaseStudySchema>;
export type PublishedCaseStudy = z.infer<typeof publishedCaseStudySchema>;
export const responsibilitySchema = z.strictObject({ label: publicTextSchema, order: z.number().int().nonnegative(), snapshotId: slugSchema, caption: publicTextSchema });
const commonFields = {
  slug: slugSchema, name: publicTextSchema, category: categorySchema, summary: publicTextSchema, contribution: publicTextSchema,
  related: z.array(slugSchema).max(2), publication: z.enum(['draft', 'published']),
  order: z.number().int().nonnegative(), links: z.array(publicLinkSchema).max(3).optional(),
};
export const flagshipRecordSchema = z.strictObject({
  kind: z.literal('flagship'), ...commonFields, slug: demoKindSchema,
  placements: z.array(placementSchema).min(1), maturity: z.enum(['Implemented', 'Prototype', 'Developer preview']),
  destination: z.enum(knownRichRoutes).optional(), legacyDestination: z.literal('/work/vora').optional(),
  caseStudy: z.discriminatedUnion('publication', [draftCaseStudySchema, publishedCaseStudySchema]).optional(), responsibility: responsibilitySchema.optional(),
});
export const legacySecondaryRecordSchema = z.strictObject({
  kind: z.literal('legacy-secondary'), ...commonFields, placements: z.array(z.enum(['home', 'work', 'case-study'])).min(1),
  legacyStatus: z.enum(['live', 'building', 'running', 'in development']), destination: z.enum(knownLegacyRoutes).optional(),
});
export const collectionRecordSchema = z.strictObject({
  kind: z.literal('collection'), ...commonFields, placements: z.array(z.enum(['home', 'work'])).min(1),
  legacyStatus: z.enum(['live', 'in development']), destination: collectionDestinationSchema,
});
export const homepageOnlyRecordSchema = z.strictObject({
  kind: z.literal('homepage-only'), ...commonFields, placements: z.array(z.literal('home')).length(1), legacyStatus: z.enum(['live', 'in development']),
});
export const projectRecordSchema = z.discriminatedUnion('kind', [flagshipRecordSchema, legacySecondaryRecordSchema, collectionRecordSchema, homepageOnlyRecordSchema]).superRefine((record, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (new Set(record.placements).size !== record.placements.length) fail('Duplicate placement');
  if (new Set(record.related).size !== record.related.length || record.related.includes(record.slug)) fail('Invalid related slugs');
  if (record.kind === 'flagship') {
    if (record.destination && record.destination !== `/work/${record.slug}`) fail('Destination must match its explicit route identity');
    if (record.legacyDestination && record.slug !== 'vora') fail('Only Vora has a retained legacy fallback');
    if (record.placements.includes('how-i-build') && !record.responsibility) fail('How I build requires responsibility');
    if (record.caseStudy?.publication === 'published') {
      if (!record.destination) fail('Published rich body requires a known route');
      if (record.caseStudy.interaction.kind !== record.slug) fail('Interaction must belong to this project');
    }
    if (record.caseStudy?.publication === 'draft' && record.caseStudy.localFixture && record.caseStudy.localFixture.kind !== record.slug) fail('Local fixture must belong to this project');
  }
  if (record.kind === 'legacy-secondary' && record.destination && record.destination !== `/work/${record.slug}`) fail('Legacy route identity mismatch');
  if (record.kind === 'legacy-secondary' && record.publication === 'published' && record.placements.some(p => p === 'work' || p === 'case-study') && !record.destination) fail('Published legacy placement requires a known route');
});
export type RichFlagshipRecord = z.infer<typeof flagshipRecordSchema>;
export type LegacySecondaryRecord = z.infer<typeof legacySecondaryRecordSchema>;
export type CollectionRecord = z.infer<typeof collectionRecordSchema>;
export type HomepageOnlyRecord = z.infer<typeof homepageOnlyRecordSchema>;
export type ProjectRecord = z.infer<typeof projectRecordSchema>;

// Public evidence contracts are pure so surface selectors can be used without Node imports.
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const checkedDateSchema = z.iso.date();
export const fixtureAssetSchema = z.strictObject({
  path: fixturePathSchema, sha256: sha256Schema, mediaType: z.literal('application/json'),
  allowedFields: z.array(z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*$/)).min(1),
});
export const mediaAssetSchema = z.strictObject({
  path: z.string().regex(/^public\/work\/[a-z0-9-]+\/[a-z0-9-]+\.(?:png|jpe?g|webp|avif|mp4|webm)$/),
  sha256: sha256Schema, mediaType: z.enum(['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']),
  width: z.number().int().positive(), height: z.number().int().positive(),
}).refine(asset => {
  const extensions: Record<string, string[]> = { 'image/png': ['png'], 'image/jpeg': ['jpg', 'jpeg'], 'image/webp': ['webp'], 'image/avif': ['avif'], 'video/mp4': ['mp4'], 'video/webm': ['webm'] };
  return extensions[asset.mediaType].includes(asset.path.split('.').at(-1)!);
}, 'Media extension and MIME must agree');
export const evidenceSnapshotSchema = z.strictObject({
  id: slugSchema, approval: z.literal('approved'), derivation: z.enum(['captured', 'illustrative', 'contract-derived']),
  checkedDate: checkedDateSchema, disclosure: publicTextSchema, version: publicTextSchema.optional(), sourceRevision: publicTextSchema.optional(),
  fixtures: z.array(fixtureAssetSchema).min(1), media: z.array(mediaAssetSchema).min(1),
});
export const evidenceManifestSchema = z.strictObject({ version: z.literal(1), snapshots: z.array(evidenceSnapshotSchema) }).superRefine((manifest, ctx) => {
  const ids = new Set<string>();
  const assets = new Map<string, string>();
  for (const snapshot of manifest.snapshots) {
    if (ids.has(snapshot.id)) ctx.addIssue({ code: 'custom', message: `Duplicate snapshot: ${snapshot.id}` });
    ids.add(snapshot.id);
    const localPaths = new Set<string>();
    for (const asset of [...snapshot.fixtures, ...snapshot.media]) {
      if (localPaths.has(asset.path)) ctx.addIssue({ code: 'custom', message: `Duplicate snapshot asset: ${asset.path}` });
      localPaths.add(asset.path);
      const previous = assets.get(asset.path);
      const signature = JSON.stringify(asset);
      if (previous && previous !== signature) ctx.addIssue({ code: 'custom', message: `Conflicting asset attestation: ${asset.path}` });
      assets.set(asset.path, signature);
    }
  }
});
export type EvidenceSnapshot = z.infer<typeof evidenceSnapshotSchema>;
export type EvidenceManifest = z.infer<typeof evidenceManifestSchema>;
export type ShowcaseAsset = z.infer<typeof fixtureAssetSchema> | z.infer<typeof mediaAssetSchema>;
export type ReadEvidenceBytes = (relativePath: string) => Uint8Array;
export const emptyEvidenceManifest: EvidenceManifest = { version: 1, snapshots: [] };

export function getApprovedSnapshot(manifest: EvidenceManifest, snapshotId: string): EvidenceSnapshot {
  const snapshot = manifest.snapshots.find(item => item.id === snapshotId);
  if (!snapshot) throw new Error(`Missing approved snapshot: ${snapshotId}`);
  return evidenceSnapshotSchema.parse(snapshot);
}

export const localSyntheticProvenanceSchema = z.strictObject({ kind: z.literal('local-synthetic'), label: z.literal('Local synthetic example. Unapproved for publication.') });
export const approvedProvenanceSchema = z.strictObject({
  kind: z.literal('approved'), id: slugSchema, derivation: z.enum(['captured', 'illustrative', 'contract-derived']),
  checkedDate: checkedDateSchema, disclosure: publicTextSchema, version: publicTextSchema.optional(), sourceRevision: publicTextSchema.optional(),
});
export const publicProvenanceSchema = z.discriminatedUnion('kind', [localSyntheticProvenanceSchema, approvedProvenanceSchema]);
export type PublicProvenance = z.infer<typeof publicProvenanceSchema>;

export function projectSnapshotMetadata(snapshot: EvidenceSnapshot): z.infer<typeof approvedProvenanceSchema> {
  return approvedProvenanceSchema.parse({ kind: 'approved', id: snapshot.id, derivation: snapshot.derivation, checkedDate: snapshot.checkedDate,
    disclosure: snapshot.disclosure, ...(snapshot.version ? { version: snapshot.version } : {}), ...(snapshot.sourceRevision ? { sourceRevision: snapshot.sourceRevision } : {}) });
}

/** Project owners supply a strict object schema, including strict nested objects. */
export function createFixtureSchema<K extends DemoKind, S extends z.ZodType<{ id: string }>>(kind: K, scenarioSchema: S) {
  return z.strictObject({ kind: z.literal(kind), scenarios: z.array(scenarioSchema).min(1) }).superRefine((fixture, ctx) => {
    const ids = fixture.scenarios.map(scenario => scenario.id);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'Duplicate scenario ID' });
  });
}
