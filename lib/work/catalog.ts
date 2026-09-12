// Server composition boundary. Client modules receive DTOs; they never import this catalog.
import reviewedManifest from '../../showcase-evidence.manifest.json';
import { evidenceManifestSchema, type EvidenceManifest } from './evidence';
import { collectionLinkSchema, projectProjectCard, selectCatalog } from './public-content';
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
