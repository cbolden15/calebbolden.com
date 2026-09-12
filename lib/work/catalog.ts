// Server composition boundary. Client modules receive DTOs; they never import this catalog.
import reviewedManifest from '../../showcase-evidence.manifest.json';
import { evidenceManifestSchema, type EvidenceManifest } from './evidence';
import { resolvePublicProjectView } from './publication';
import {
  collectionLinkSchema,
  projectHomepageProof,
  projectMethodProjects,
  projectProjectCard,
  projectRelatedLinks,
  selectCatalog,
  type HomepageProof,
  type MethodProject,
  type RelatedProjectLink,
} from './public-content';
import { projectRecordSchema, type ProjectRecord } from './types';
import { vora } from './projects/vora';
import { prism } from './projects/prism';
import { agentTeam } from './projects/agent-team';
import { agentConfig } from './projects/agent-config';
import { controlCenter } from './projects/control-center';
import { chapterhq, siteAssistant, openSource, realEstateMaite } from './projects/secondary';

export const projectRecords: readonly ProjectRecord[] = [vora, prism, agentTeam, agentConfig, controlCenter, chapterhq, siteAssistant, openSource, realEstateMaite].map(record => projectRecordSchema.parse(record));
export const evidenceManifest = evidenceManifestSchema.parse(reviewedManifest);

export function getCatalog(category: unknown = 'all', records: readonly ProjectRecord[] = projectRecords, manifest: EvidenceManifest = evidenceManifest) {
  const cards = records.flatMap(record => {
    const card = projectProjectCard(record, manifest);
    return card ? [card] : [];
  });
  const collection = records.find(record => record.kind === 'collection' && record.publication === 'published' && record.placements.includes('work'));
  return { ...selectCatalog(cards, category), collection: collection?.kind === 'collection'
    ? collectionLinkSchema.parse({ name: collection.name, summary: collection.summary, destination: collection.destination }) : null };
}

export function getHomeProjects(
  records: readonly ProjectRecord[] = projectRecords,
  manifest: EvidenceManifest = evidenceManifest,
): HomepageProof[] {
  return [...records]
    .sort((a, b) => a.order - b.order)
    .flatMap(record => {
      const project = projectHomepageProof(record, manifest);
      return project ? [project] : [];
    });
}

export function getMethodProjects(
  records: readonly ProjectRecord[] = projectRecords,
  manifest: EvidenceManifest = evidenceManifest,
): MethodProject[] {
  return projectMethodProjects(records, manifest);
}

export function getRelatedProjects(
  slug: string,
  records: readonly ProjectRecord[] = projectRecords,
): RelatedProjectLink[] {
  const record = records.find(candidate => candidate.slug === slug);
  if (!record || !record.placements.some(placement => placement === 'case-study') || resolvePublicProjectView(record).kind === 'not-found') return [];
  const caseStudyRecords = records.filter(candidate => candidate.placements.some(placement => placement === 'case-study'));
  return projectRelatedLinks(record, caseStudyRecords).slice(0, 2);
}

export function getPublishedCaseStudyPaths(records: readonly ProjectRecord[] = projectRecords): string[] {
  const paths = records.flatMap(record => {
    if (!record.placements.some(placement => placement === 'case-study')) return [];
    const view = resolvePublicProjectView(record);
    return view.kind === 'not-found' ? [] : [view.destination];
  });
  return [...new Set(paths)];
}
