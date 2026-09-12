import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { caseStudyShellSchema, homepageProofSchema, methodProjectSchema, projectCardSchema, projectCaseStudyShell, projectDevelopmentCaseStudyShell, projectHomepageProof, projectMethodProjects, projectProjectCard, projectRelatedLinks, publicProjectSchema, relatedProjectLinkSchema } from '../public-content';
import { createFixtureSchema, projectLocalFixture, projectApprovedFixture } from '../evidence';
import { projectRecords } from '../catalog';
import { richRecord, releaseManifest, releaseRecords, sampleBytes, readSampleBytes } from './samples';

const sentinel = 'SYNTHETIC_PRIVATE_SENTINEL';
const scenarioSchema = z.strictObject({ id: z.string(), label: z.string(), steps: z.array(z.string()) });
const fixtureSchema = createFixtureSchema('prism', scenarioSchema);
const selectScenario = (scenario: z.infer<typeof scenarioSchema>) => ({ id: scenario.id, label: scenario.label, steps: scenario.steps.map(s => s) });
const emptyAttestation = { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() };
afterEach(() => vi.unstubAllEnvs());

describe('per-surface public projections', () => {
  it('rejects extra top-level and nested record/media fields', () => {
    const validPublicRecord = richRecord('prism');
    expect(publicProjectSchema.safeParse(validPublicRecord).success).toBe(true);
    expect(publicProjectSchema.safeParse({ ...validPublicRecord, internalNotes: sentinel }).success).toBe(false);
    if (validPublicRecord.caseStudy?.publication !== 'published') throw new Error('sample');
    expect(publicProjectSchema.safeParse({ ...validPublicRecord, caseStudy: { ...validPublicRecord.caseStudy, evidence: [{ ...validPublicRecord.caseStudy.evidence[0], internalNotes: sentinel }] } }).success).toBe(false);
  });

  it('cards, homepage, related and method props omit narratives and evidence internals', () => {
    const record = { ...richRecord('prism'), links: [{ label: 'Public source', href: 'https://example.com/prism' }] };
    const card = projectProjectCard(record, releaseManifest)!;
    expect(Object.keys(card).sort()).toEqual(['badge', 'category', 'contribution', 'destination', 'links', 'name', 'order', 'poster', 'slug', 'summary'].sort());
    expect(card.links).toEqual(record.links);
    expect(projectCardSchema.safeParse({ ...card, story: {} }).success).toBe(false);
    const home = projectHomepageProof(projectRecords.find(r => r.slug === 'real-estate-maite')!, releaseManifest)!;
    expect(home.destination).toBeUndefined();
    expect(homepageProofSchema.safeParse({ ...home, fixture: {} }).success).toBe(false);
    const related = projectRelatedLinks({ ...record, related: ['vora'] }, releaseRecords)[0];
    expect(relatedProjectLinkSchema.safeParse({ ...related, transcript: sentinel }).success).toBe(false);
    const method = projectMethodProjects([{ ...record, placements: ['work', 'case-study', 'how-i-build'], responsibility: { label: 'Trace execution', order: 1, snapshotId: 'prism-sample', caption: 'Inspect the trace' } }], releaseManifest)[0];
    expect(methodProjectSchema.safeParse({ ...method, digest: sentinel }).success).toBe(false);
    for (const dto of [card, home, related, method]) {
      expect(JSON.stringify(dto)).not.toMatch(/sha256|allowedFields|sourceRevision|fixture|walkthroughs|Synthetic prism example/);
    }
  });

  it('a detail shell contains exactly one narrative and rendered snapshot provenance', () => {
    const record = { ...richRecord('prism'), related: ['chapterhq', 'agent-team'] };
    const shell = projectCaseStudyShell(record, releaseManifest, projectRecords)!;
    expect(shell.story.about).toBe('Synthetic prism example.');
    expect(shell.snapshots[0]).toMatchObject({ id: 'prism-sample', checkedDate: '2026-09-11', sourceRevision: 'test-revision-1' });
    expect(shell.related).toEqual([{ slug: 'chapterhq', name: 'ChapterHQ', destination: '/work/chapterhq' }]);
    expect(Object.keys(shell.related[0]).sort()).toEqual(['destination', 'name', 'slug']);
    expect(JSON.stringify(shell)).not.toMatch(/sha256|allowedFields|lib\/work\/fixtures|Synthetic vora example/);
    expect(caseStudyShellSchema.safeParse({ ...shell, fixture: {} }).success).toBe(false);
    expect(caseStudyShellSchema.safeParse({ ...shell, related: [{ ...shell.related[0], story: {} }] }).success).toBe(false);
    expect(() => projectCaseStudyShell(richRecord('prism'), { version: 1, snapshots: [] })).toThrow();
  });

  it('projects only resolvable production related links into development shells', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const published = richRecord('prism');
    if (published.caseStudy?.publication !== 'published') throw new Error('sample');
    const draft = {
      ...published,
      publication: 'draft' as const,
      related: ['chapterhq', 'agent-team'],
      caseStudy: { publication: 'draft' as const, story: published.caseStudy.story },
    };
    expect(projectDevelopmentCaseStudyShell(draft, projectRecords)?.related)
      .toEqual([{ slug: 'chapterhq', name: 'ChapterHQ', destination: '/work/chapterhq' }]);
    expect(projectDevelopmentCaseStudyShell({ ...draft, related: ['missing'] }, projectRecords)?.related).toEqual([]);
  });

  it('homepage proof includes only an approved rich poster and omits it for other states', () => {
    const rich = richRecord('vora');
    const home = projectHomepageProof(rich, releaseManifest)!;
    expect(home.poster).toEqual({ src: '/work/vora/overview.webp', alt: 'Synthetic overview', caption: 'Illustrative sample', width: 1200, height: 800 });
    expect(JSON.stringify(home)).not.toMatch(/snapshotId|sha256|allowedFields|sourceRevision|walkthroughs|Synthetic vora example/);
    expect(homepageProofSchema.safeParse({ ...home, poster: { ...home.poster, snapshotId: 'vora-sample' } }).success).toBe(false);
    expect(() => projectHomepageProof(rich, { version: 1, snapshots: [] })).toThrow(/snapshot/i);
    const fallback = { ...rich, caseStudy: { publication: 'draft' as const } };
    expect(projectHomepageProof(fallback, releaseManifest)).not.toHaveProperty('poster');
    expect(projectHomepageProof({ ...rich, publication: 'draft' }, releaseManifest)).toBeNull();
    for (const slug of ['vora', 'chapterhq', 'real-estate-maite']) {
      expect(projectHomepageProof(projectRecords.find(record => record.slug === slug)!, releaseManifest)).not.toHaveProperty('poster');
    }
  });

  it('both fixture paths parse strict content and project only the selected project', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const content = JSON.stringify({ kind: 'prism', scenarios: [{ id: 'sample', label: 'Sample', steps: ['Inspect'] }, { id: 'other', label: 'Alternative scenario', steps: ['Other'] }] });
    const local = projectLocalFixture(content, fixtureSchema, selectScenario, emptyAttestation);
    expect(local.provenance).toEqual({ kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' });
    expect(local.scenarios.map(s => s.id)).toEqual(['sample', 'other']);
    const poisoned = JSON.stringify({ kind: 'prism', scenarios: [{ id: 'sample', label: 'Sample', steps: ['Inspect'], internalNotes: sentinel }] });
    expect(() => projectLocalFixture(poisoned, fixtureSchema, selectScenario, emptyAttestation)).toThrow();
    const readBytes = readSampleBytes;
    const approved = projectApprovedFixture({ manifest: releaseManifest, snapshotId: 'prism-sample', fixturePath: 'lib/work/fixtures/prism.json', schema: fixtureSchema, projectScenario: selectScenario, readBytes });
    expect(approved.provenance.kind).toBe('approved');
    expect(JSON.stringify(approved)).not.toMatch(/sha256|fixtures|allowedFields/);
    expect(() => projectApprovedFixture({ manifest: { ...releaseManifest, snapshots: [{ ...releaseManifest.snapshots[1], approval: 'local-synthetic' }] }, snapshotId: 'prism-sample', fixturePath: 'lib/work/fixtures/prism.json', schema: fixtureSchema, projectScenario: selectScenario, readBytes })).toThrow();
  });

  it('rejects overbroad projector output and development access from production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => projectLocalFixture(sampleBytes.toString(), fixtureSchema, s => ({ ...selectScenario(s), internalNotes: 'extra' }), emptyAttestation)).toThrow();
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => projectLocalFixture(sampleBytes.toString(), fixtureSchema, selectScenario, emptyAttestation)).toThrow(/development/i);
  });

  it('keeps all scenarios from one selected project while rejecting an unrelated fixture', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const selectedProject = { kind: 'prism', scenarios: [{ id: 'sample', label: 'Sample', steps: ['Inspect'] }, { id: 'alternative', label: 'Alternative', steps: ['Review'] }] };
    const result = projectLocalFixture(JSON.stringify(selectedProject), fixtureSchema, selectScenario, emptyAttestation);
    expect(result.scenarios.map(s => s.id)).toEqual(['sample', 'alternative']);
    expect(() => projectLocalFixture(JSON.stringify({ ...selectedProject, unrelatedFixture: { kind: 'vora', scenarios: [] } }), fixtureSchema, selectScenario, emptyAttestation)).toThrow();
    const bytes = Buffer.from(JSON.stringify(selectedProject));
    const snapshot = structuredClone(releaseManifest.snapshots[1]);
    snapshot.fixtures[0].sha256 = createHash('sha256').update(bytes).digest('hex');
    const options = { manifest: { version: 1, snapshots: [snapshot] }, snapshotId: 'prism-sample', fixturePath: 'lib/work/fixtures/prism.json', schema: fixtureSchema, projectScenario: selectScenario, readBytes: (path: string) => path.startsWith('public/') ? readSampleBytes(path) : bytes };
    expect(projectApprovedFixture(options).scenarios.map(s => s.id)).toEqual(['sample', 'alternative']);
    expect(() => projectApprovedFixture({ ...options, projectScenario: s => ({ ...selectScenario(s), unrelatedFixture: {} }) })).toThrow();
    snapshot.fixtures[0].allowedFields = ['kind', 'scenarios', 'scenarios.id'];
    expect(() => projectApprovedFixture(options)).toThrow(/not approved/i);
  });

  it('development cannot waive an existing attestation or change the attested source', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => projectLocalFixture(sampleBytes.toString(), fixtureSchema, selectScenario, { manifest: releaseManifest, readBytes: () => Buffer.from('changed') })).toThrow(/digest/i);
    expect(() => projectLocalFixture(sampleBytes.toString().replace('Inspect', 'Review'), fixtureSchema, selectScenario, { manifest: releaseManifest, readBytes: readSampleBytes })).toThrow(/digest/i);
  });

  it('checks schema-valid projected nested fields against the selected snapshot allowlist', () => {
    const extendedSchema = createFixtureSchema('prism', scenarioSchema.extend({
      annotation: z.strictObject({ text: z.string() }).optional(),
    }));
    const projectScenario = (scenario: z.infer<typeof scenarioSchema>) => ({
      ...selectScenario(scenario), annotation: { text: 'Optional displayed explanation.' },
    });
    const snapshot = structuredClone(releaseManifest.snapshots[1]);
    const options = { manifest: { version: 1, snapshots: [snapshot] }, snapshotId: snapshot.id,
      fixturePath: snapshot.fixtures[0].path, schema: extendedSchema, projectScenario, readBytes: readSampleBytes };
    expect(() => projectApprovedFixture(options)).toThrow(/not approved.*scenarios.annotation/i);
    snapshot.fixtures[0].allowedFields.push('scenarios.annotation');
    expect(() => projectApprovedFixture(options)).toThrow(/not approved.*scenarios.annotation.text/i);
    snapshot.fixtures[0].allowedFields.push('scenarios.annotation.text');
    expect(projectApprovedFixture(options).scenarios[0].annotation).toEqual({ text: 'Optional displayed explanation.' });
    expect(projectApprovedFixture(options).provenance.kind).toBe('approved');
  });
});
