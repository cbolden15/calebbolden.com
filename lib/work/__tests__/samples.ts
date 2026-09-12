import { createHash } from 'node:crypto';
import { projectRecords } from '../catalog';
import type { EvidenceManifest } from '../evidence';
import type { DemoKind, RichFlagshipRecord } from '../types';

// Complete synthetic release data proves gates; it never changes authored publication.
export const fixtureBytes = (kind: string) => Buffer.from(JSON.stringify({ kind, scenarios: [{ id: 'sample', label: 'Sample', steps: ['Inspect'] }] }) + '\n');
export const sampleBytes = fixtureBytes('prism');
export const posterBytes = Buffer.from('synthetic raster bytes; decoder coverage belongs to the asset gate');
export const readSampleBytes = (path: string) => path.startsWith('public/') ? posterBytes : fixtureBytes(path.split('/').at(-1)!.replace('.json', ''));
const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
export const releaseManifest: EvidenceManifest = {
  version: 1,
  snapshots: ['vora', 'prism', 'agent-team', 'agent-config', 'control-center'].map(slug => ({
    id: `${slug}-sample`, approval: 'approved', derivation: 'contract-derived', checkedDate: '2026-09-11',
    disclosure: 'Purpose-written synthetic public test example.', version: 'test-1', sourceRevision: 'test-revision-1',
    fixtures: [{ path: `lib/work/fixtures/${slug}.json`, sha256: digest(fixtureBytes(slug)), mediaType: 'application/json', allowedFields: ['kind', 'scenarios', 'scenarios.id', 'scenarios.label', 'scenarios.steps'] }],
    media: [{ path: `public/work/${slug}/overview.webp`, sha256: digest(posterBytes), mediaType: 'image/webp', width: 1200, height: 800 }],
  })),
};

export function richRecord(slug: string): RichFlagshipRecord {
  const record = projectRecords.find(r => r.slug === slug);
  if (!record || record.kind !== 'flagship') throw new Error('Expected flagship');
  return {
    ...record, publication: 'published',
    caseStudy: {
      publication: 'published',
      story: {
        problem: 'A synthetic problem.', workflow: { introduction: 'Inspect the example.', walkthroughs: [{ id: 'sample', title: 'Sample', steps: ['Inspect', 'Finish'] }] },
        decisions: [{ constraint: 'Local state', choice: 'Explicit steps', consequence: 'Repeatable' }, { constraint: 'Public content', choice: 'Synthetic data', consequence: 'No private records' }],
        credits: ['Purpose-written sample'], limits: ['No operational claim'], about: `Synthetic ${slug} example.`,
      },
      evidence: [{ kind: 'image', snapshotId: `${slug}-sample`, src: `/work/${slug}/overview.webp`, alt: 'Synthetic overview', caption: 'Illustrative sample', width: 1200, height: 800 }],
      interaction: { kind: slug as DemoKind, snapshotId: `${slug}-sample`, label: 'Local simulation', caption: 'Nothing is sent.' },
    },
  };
}
export const releaseRecords = projectRecords.map(r => r.kind === 'flagship' ? richRecord(r.slug) : r);
