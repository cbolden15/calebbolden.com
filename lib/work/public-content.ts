import { z } from 'zod';
import { approvedProvenanceSchema, emptyEvidenceManifest, evidenceManifestSchema, getApprovedSnapshot, projectSnapshotMetadata, type EvidenceManifest } from './types';
import { collectRequiredShowcaseAssets, resolveDevelopmentProjectView, resolvePublicProjectView } from './publication';
import { categorySchema, collectionDestinationSchema, destinationSchema, imageFields, projectRecordSchema, projectStorySchema, publicInteractionSchema, publicLinkSchema, publicMediaSchema, publicTextSchema, slugSchema, type CategoryFilter, type ProjectRecord, type ProjectStory, type PublicMedia } from './types';

export const publicProjectSchema = projectRecordSchema;
export const posterSchema = z.strictObject(imageFields);
const badgeSchema = z.enum(['Implemented', 'Prototype', 'Developer preview', 'live', 'building', 'running', 'in development']);
export const projectCardSchema = z.strictObject({
  slug: slugSchema, name: publicTextSchema, category: categorySchema, summary: publicTextSchema, contribution: publicTextSchema,
  badge: badgeSchema, order: z.number().int().nonnegative(), destination: destinationSchema, poster: posterSchema.optional(), links: z.array(publicLinkSchema).optional(),
});
export type ProjectCard = z.infer<typeof projectCardSchema>;
export const homepageProofSchema = z.strictObject({
  slug: slugSchema, name: publicTextSchema, summary: publicTextSchema, badge: badgeSchema,
  destination: z.union([destinationSchema, collectionDestinationSchema]).optional(), poster: posterSchema.optional(), links: z.array(publicLinkSchema).optional(),
});
export type HomepageProof = z.infer<typeof homepageProofSchema>;
export const relatedProjectLinkSchema = z.strictObject({ slug: slugSchema, name: publicTextSchema, destination: destinationSchema });
export type RelatedProjectLink = z.infer<typeof relatedProjectLinkSchema>;
export const methodProjectSchema = z.strictObject({
  slug: slugSchema, name: publicTextSchema, destination: destinationSchema, label: publicTextSchema,
  order: z.number().int().nonnegative(), caption: publicTextSchema, poster: posterSchema,
});
export type MethodProject = z.infer<typeof methodProjectSchema>;
export const caseStudyShellSchema = z.strictObject({
  publication: z.enum(['draft', 'published']), slug: slugSchema, name: publicTextSchema, summary: publicTextSchema,
  contribution: publicTextSchema, maturity: z.enum(['Implemented', 'Prototype', 'Developer preview']),
  destination: destinationSchema, story: projectStorySchema, evidence: z.array(publicMediaSchema),
  interaction: publicInteractionSchema.optional(), snapshots: z.array(approvedProvenanceSchema),
  related: z.array(relatedProjectLinkSchema).max(2), links: z.array(publicLinkSchema).optional(),
  developmentLabel: z.literal('Local synthetic example. Unapproved for publication.').optional(),
}).superRefine((shell, ctx) => {
  if (shell.publication === 'published' && (!shell.evidence.length || !shell.snapshots.length || !shell.interaction || shell.developmentLabel)) {
    ctx.addIssue({ code: 'custom', message: 'Published shell requires evidence and approved provenance' });
  }
  if (shell.publication === 'draft' && (!shell.developmentLabel || shell.snapshots.length || shell.evidence.length || shell.interaction)) {
    ctx.addIssue({ code: 'custom', message: 'Draft shell requires a label and placeholders without approval claims' });
  }
});
export type CaseStudyShell = z.infer<typeof caseStudyShellSchema>;
export const collectionLinkSchema = z.strictObject({ name: publicTextSchema, summary: publicTextSchema, destination: collectionDestinationSchema });
export type CollectionLink = z.infer<typeof collectionLinkSchema>;

function projectLinks(record: ProjectRecord) {
  return record.links?.map(link => ({ label: link.label, href: link.href }));
}
function badge(record: ProjectRecord) { return record.kind === 'flagship' ? record.maturity : record.legacyStatus; }
function projectPoster(media: PublicMedia) {
  return posterSchema.parse({ src: media.kind === 'image' ? media.src : media.poster, alt: media.alt, caption: media.caption, width: media.width, height: media.height });
}
function projectStory(story: ProjectStory): ProjectStory {
  return {
    problem: story.problem, workflow: { introduction: story.workflow.introduction, walkthroughs: story.workflow.walkthroughs.map(walkthrough => ({ id: walkthrough.id, title: walkthrough.title, steps: walkthrough.steps.map(step => step) })) },
    decisions: story.decisions.map(decision => ({ constraint: decision.constraint, choice: decision.choice, consequence: decision.consequence })),
    credits: story.credits.map(credit => credit), limits: story.limits.map(limit => limit), about: story.about,
  };
}
function projectMedia(media: PublicMedia): PublicMedia {
  if (media.kind === 'image') return { kind: 'image', snapshotId: media.snapshotId, src: media.src, alt: media.alt, caption: media.caption, width: media.width, height: media.height };
  return { kind: 'video', snapshotId: media.snapshotId, src: media.src, poster: media.poster, alt: media.alt, caption: media.caption, width: media.width, height: media.height,
    transcript: media.transcript, captions: media.captions.map(cue => ({ start: cue.start, end: cue.end, text: cue.text })) };
}

export function projectProjectCard(input: ProjectRecord, manifest: EvidenceManifest = emptyEvidenceManifest): ProjectCard | null {
  const view = resolvePublicProjectView(input);
  if (view.kind === 'not-found' || !view.record.placements.includes('work')) return null;
  const record = view.record;
  if (view.kind === 'rich') collectRequiredShowcaseAssets([record], manifest);
  return projectCardSchema.parse({ slug: record.slug, name: record.name, category: record.category, summary: record.summary,
    contribution: record.contribution, badge: badge(record), order: record.order, destination: view.destination,
    ...(view.kind === 'rich' ? { poster: projectPoster(view.body.evidence[0]) } : {}), ...(record.links ? { links: projectLinks(record) } : {}) });
}

export function projectHomepageProof(input: ProjectRecord, manifest: EvidenceManifest = emptyEvidenceManifest): HomepageProof | null {
  const record = projectRecordSchema.parse(input);
  if (record.publication !== 'published' || !record.placements.includes('home')) return null;
  const view = resolvePublicProjectView(record);
  if (record.kind === 'flagship' && view.kind === 'not-found') return null;
  if (view.kind === 'rich') collectRequiredShowcaseAssets([record], manifest);
  const destination = record.kind === 'collection' ? record.destination : view.kind === 'not-found' ? undefined : view.destination;
  return homepageProofSchema.parse({ slug: record.slug, name: record.name, summary: record.summary, badge: badge(record),
    ...(view.kind === 'rich' ? { poster: projectPoster(view.body.evidence[0]) } : {}),
    ...(destination ? { destination } : {}), ...(record.links ? { links: projectLinks(record) } : {}) });
}

export function projectRelatedLinks(input: ProjectRecord, records: readonly ProjectRecord[]): RelatedProjectLink[] {
  const record = projectRecordSchema.parse(input);
  return record.related.flatMap(slug => {
    const candidate = records.find(item => item.slug === slug);
    if (!candidate) return [];
    const view = resolvePublicProjectView(candidate);
    if (view.kind === 'not-found') return [];
    return [relatedProjectLinkSchema.parse({ slug: view.record.slug, name: view.record.name, destination: view.destination })];
  });
}

export function projectMethodProjects(records: readonly ProjectRecord[], manifest: EvidenceManifest): MethodProject[] {
  return records.flatMap(record => {
    const view = resolvePublicProjectView(record);
    if (view.kind !== 'rich' || !view.record.placements.includes('how-i-build') || !view.record.responsibility) return [];
    collectRequiredShowcaseAssets([record], manifest);
    const responsibility = view.record.responsibility;
    const evidence = view.body.evidence.find(media => media.snapshotId === responsibility.snapshotId)!;
    return [methodProjectSchema.parse({ slug: record.slug, name: record.name, destination: view.destination, label: responsibility.label,
      order: responsibility.order, caption: responsibility.caption, poster: projectPoster(evidence) })];
  }).sort((a, b) => a.order - b.order);
}

export function projectCaseStudyShell(input: ProjectRecord, inputManifest: EvidenceManifest, records: readonly ProjectRecord[] = []): CaseStudyShell | null {
  const view = resolvePublicProjectView(input);
  if (view.kind !== 'rich') return null;
  const manifest = evidenceManifestSchema.parse(inputManifest);
  collectRequiredShowcaseAssets([view.record], manifest);
  const { record, body } = view;
  const snapshotIds = [...new Set([body.interaction.snapshotId, ...body.evidence.map(media => media.snapshotId)])];
  return caseStudyShellSchema.parse({ publication: 'published', slug: record.slug, name: record.name, summary: record.summary, contribution: record.contribution,
    maturity: record.maturity, destination: view.destination, story: projectStory(body.story), evidence: body.evidence.map(projectMedia),
    interaction: { kind: body.interaction.kind, snapshotId: body.interaction.snapshotId, label: body.interaction.label, caption: body.interaction.caption },
    snapshots: snapshotIds.map(id => projectSnapshotMetadata(getApprovedSnapshot(manifest, id))), related: projectRelatedLinks(record, records),
    ...(record.links ? { links: projectLinks(record) } : {}) });
}

export function projectDevelopmentCaseStudyShell(input: ProjectRecord, records: readonly ProjectRecord[] = []): CaseStudyShell | null {
  const view = resolveDevelopmentProjectView(input);
  if (view.kind !== 'rich-draft' || !view.body.story || !view.record.destination) return null;
  const record = view.record;
  return caseStudyShellSchema.parse({ publication: 'draft', slug: record.slug, name: record.name, summary: record.summary, contribution: record.contribution,
    maturity: record.maturity, destination: record.destination, story: projectStory(view.body.story), evidence: [], snapshots: [], related: projectRelatedLinks(record, records), developmentLabel: view.label,
    ...(record.links ? { links: projectLinks(record) } : {}) });
}

export function projectMetadata(record: ProjectRecord): { title: string; description: string } | null {
  const view = resolvePublicProjectView(record);
  if (view.kind === 'not-found') return null;
  return { title: `${view.record.name} | Work | Caleb Bolden`, description: view.kind === 'rich' ? view.body.story.about : view.record.summary };
}

export function normalizeCategory(value: unknown): CategoryFilter {
  return value === 'products' || value === 'developer-tools' ? value : 'all';
}

/** Client-safe in behavior: accepts only validated card DTOs, never authored records. */
export function selectCatalog(cards: readonly ProjectCard[], value: unknown) {
  const category = normalizeCategory(value);
  const selected = cards.map(card => projectCardSchema.parse(card)).filter(card => category === 'all' || card.category === category).sort((a, b) => a.order - b.order);
  const featureSlug = category === 'developer-tools' ? 'prism' : 'vora';
  const featured = selected.find(card => card.slug === featureSlug) ?? null;
  return { category, featured, rows: selected.filter(card => card.slug !== featured?.slug), count: selected.length };
}
