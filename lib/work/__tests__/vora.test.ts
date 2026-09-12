import { describe, expect, it } from 'vitest';
import { initialVora, voraReducer, voraView, voraFixtureSchema, projectVoraScenario, type VoraState, type VoraEvent, type VoraFixtureDTO } from '../demos/vora';

const content = {
  kind: 'vora' as const,
  scenarios: [{ id: 'approval' as const, business: 'Sample Workshop', customer: 'Customer B', request: 'Please arrange a visit.',
    action: 'Propose a follow-up', reason: 'This fictional policy requires a decision.', message: 'Which day suits you?',
    captions: { request: 'Request caption', pending: 'Pending caption', approved: 'Approved caption', completed: 'Completion caption', rejected: 'Rejection caption', failed: 'Failure caption' },
    completion: { confirmation: 'Fictional completion only', activity: 'Sample follow-up recorded' }, error: 'Simulated delivery unavailable' }],
};
const fixture: VoraFixtureDTO = { ...content, provenance: { kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' } };
const steps: VoraState['step'][] = ['request', 'pending', 'approved', 'completed', 'rejected', 'failed'];
const outcomes: VoraState['outcome'][] = ['succeeds', 'fails'];
const transitionEvents: VoraEvent[] = [{ type: 'review' }, { type: 'approve' }, { type: 'reject' }, { type: 'show-result' }];

describe('Vora approval transitions', () => {
  for (const outcome of outcomes) {
    it(`allows only named transitions, including repeated clicks (${outcome})`, () => {
      const allowed = { request: { review: 'pending' }, pending: { approve: 'approved', reject: 'rejected' }, approved: { 'show-result': outcome === 'succeeds' ? 'completed' : 'failed' }, completed: {}, rejected: {}, failed: {} };
      for (const step of steps) {
        const state: VoraState = { outcome, step };
        for (const event of transitionEvents) {
          const expected = (allowed[step] as Record<string, string>)[event.type];
          const result = voraReducer(state, event);
          if (expected) {
            expect(result).toEqual({ outcome, step: expected });
            expect(voraReducer(result, event)).toBe(result);
          } else expect(result).toBe(state);
        }
      }
    });
    it(`reset and either outcome selection clear every intermediate/terminal state (${outcome})`, () => {
      for (const step of steps) {
        const state: VoraState = { step, outcome };
        expect(voraReducer(state, { type: 'reset' })).toEqual(initialVora);
        for (const selected of outcomes) expect(voraReducer(state, { type: 'set-outcome', outcome: selected })).toEqual({ step: 'request', outcome: selected });
      }
    });
  }
  it('never presents delivery or completed CRM activity before successful completion', () => {
    for (const outcome of outcomes) for (const step of steps) {
      const view = voraView({ step, outcome }, fixture);
      expect(view.caption).toBe(content.scenarios[0].captions[step]);
      const delivered = step === 'completed' && outcome === 'succeeds';
      expect(view.deliveryConfirmed).toBe(delivered);
      expect(view.crmActivity).toBe(delivered ? content.scenarios[0].completion.activity : null);
    }
  });
  it('uses the supplied fixture for both result branches', () => {
    const pending = voraReducer(initialVora, { type: 'review' });
    const rejected = voraReducer(pending, { type: 'reject' });
    expect(voraReducer(rejected, { type: 'show-result' })).toBe(rejected);
    expect(voraReducer(pending, { type: 'show-result' })).toBe(pending);
    const approved = voraReducer(voraReducer(voraReducer(initialVora, { type: 'set-outcome', outcome: 'fails' }), { type: 'review' }), { type: 'approve' });
    const failed = voraReducer(approved, { type: 'show-result' });
    expect(failed.step).toBe('failed');
    expect(voraView(failed, fixture)).toMatchObject({ deliveryConfirmed: false, crmActivity: null, error: content.scenarios[0].error });
    expect(voraReducer(failed, { type: 'reset' })).toEqual(initialVora);
  });
});

describe('Vora fixture contract', () => {
  it('accepts a synthetic DTO and explicitly projects its public fields', () => {
    const parsed = voraFixtureSchema.parse(content);
    expect(parsed.scenarios.map(projectVoraScenario)).toEqual(content.scenarios);
  });
  it('rejects extra nested fields, private strings and unrelated scenarios', () => {
    const scenario = content.scenarios[0];
    for (const poisoned of [
      { ...content, internalNotes: 'extra' },
      { ...content, scenarios: [{ ...scenario, completion: { ...scenario.completion, raw: 'extra' } }] },
      { ...content, scenarios: [{ ...scenario, request: 'SYNTHETIC_PRIVATE_SENTINEL' }] },
      { ...content, scenarios: [{ ...scenario, id: 'unrelated' }] },
      { ...content, scenarios: [scenario, scenario] },
    ]) expect(voraFixtureSchema.safeParse(poisoned).success).toBe(false);
  });
});

import { afterEach, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { vora, resolveVoraPage } from '../projects/vora';
import { voraFixtureDTOSchema } from '../demos/vora';
import { projectApprovedFixture, projectLocalFixture } from '../evidence';
import { collectRequiredShowcaseAssets, getPublishedWorkPaths, resolvePublicProjectView } from '../publication';
import { projectCaseStudyShell, projectDevelopmentCaseStudyShell, projectProjectCard, projectRelatedLinks } from '../public-content';
import { richRecord, releaseManifest, readSampleBytes } from './samples';
import type { RichFlagshipRecord } from '../types';

afterEach(() => vi.unstubAllEnvs());

describe('Vora server projection and publication adapter', () => {
  it('keeps all production states and rollbacks on the same destination with atomic metadata/body/evidence selection', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const published = richRecord('vora');
    const legacy = { ...vora, caseStudy: undefined };
    const transitions = [legacy, vora, published, vora, published, legacy];
    const expected = ['legacy', 'rich-draft-with-legacy-fallback', 'rich-published', 'rich-draft-with-legacy-fallback', 'rich-published', 'legacy'];
    for (const [index, record] of transitions.entries()) {
      const { view, metadata } = resolveVoraPage(record);
      expect(view.kind).not.toBe('not-found');
      expect('state' in view && view.state).toBe(expected[index]);
      expect('destination' in view && view.destination).toBe('/work/vora');
      expect(getPublishedWorkPaths([record])).toEqual(['/work/vora']);
      expect(projectRelatedLinks({ ...richRecord('prism'), related: ['vora'] }, [record])).toEqual([{ slug: 'vora', name: 'Vora', destination: '/work/vora' }]);
      const shell = projectCaseStudyShell(record, releaseManifest);
      const card = projectProjectCard(record, releaseManifest);
      if (view.kind === 'rich') {
        expect(shell?.story).toEqual(view.body.story);
        expect(metadata?.description).toBe(view.body.story.about);
        expect(card?.poster?.src).toBe('/work/vora/overview.webp');
        expect(collectRequiredShowcaseAssets([record], releaseManifest).map(asset => asset.path)).toEqual(['lib/work/fixtures/vora.json', 'public/work/vora/overview.webp']);
      } else {
        expect(shell).toBeNull();
        expect(metadata).toEqual({ title: 'Vora | Work | Caleb Bolden', description: 'Vora is an AI CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.' });
        expect(card).not.toHaveProperty('poster');
        expect(collectRequiredShowcaseAssets([record], { version: 1, snapshots: [] })).toEqual([]);
        expect(JSON.stringify({ metadata, card })).not.toContain('Cedar Repair');
      }
    }
  });
  it('allows a labeled local draft with no approval manifest while production retains legacy', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const projected = projectLocalFixture(JSON.stringify(content), voraFixtureSchema, projectVoraScenario, { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() });
    expect(voraFixtureDTOSchema.parse(projected)).toEqual(fixture);
    expect(resolveVoraPage(vora).view.kind).toBe('rich-draft');
    expect(projectDevelopmentCaseStudyShell(vora)?.developmentLabel).toBe(fixture.provenance.kind === 'local-synthetic' && fixture.provenance.label);
    vi.stubEnv('NODE_ENV', 'production');
    expect(resolvePublicProjectView(vora)).toMatchObject({ kind: 'legacy', state: 'rich-draft-with-legacy-fallback' });
    expect(projectDevelopmentCaseStudyShell(vora)).toBeNull();
    expect(() => projectLocalFixture(JSON.stringify(content), voraFixtureSchema, projectVoraScenario, { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() })).toThrow(/development/i);
  });
  it('projects exactly the selected Vora fixture and rejects stale bytes or unapproved fields', () => {
    const bytes = Buffer.from(JSON.stringify(content));
    const snapshot = structuredClone(releaseManifest.snapshots.find(item => item.id === 'vora-sample')!);
    snapshot.fixtures[0].sha256 = createHash('sha256').update(bytes).digest('hex');
    const scenario = content.scenarios[0];
    snapshot.fixtures[0].allowedFields = ['kind', 'scenarios', ...Object.keys(scenario).map(key => `scenarios.${key}`),
      ...Object.keys(scenario.captions).map(key => `scenarios.captions.${key}`), 'scenarios.completion.confirmation', 'scenarios.completion.activity'];
    const options = { manifest: { version: 1, snapshots: [snapshot] }, snapshotId: snapshot.id, fixturePath: 'lib/work/fixtures/vora.json',
      schema: voraFixtureSchema, projectScenario: projectVoraScenario, readBytes: (path: string) => path.startsWith('public/') ? readSampleBytes(path) : bytes };
    const projected = voraFixtureDTOSchema.parse(projectApprovedFixture(options));
    expect(projected.scenarios).toEqual(content.scenarios);
    expect(projected.provenance.kind).toBe('approved');
    expect(JSON.stringify(projected)).not.toMatch(/sha256|allowedFields|prism|lib\/work\/fixtures/);
    expect(() => projectApprovedFixture({ ...options, readBytes: path => path.startsWith('public/') ? readSampleBytes(path) : Buffer.from(JSON.stringify(content).replace('Customer B', 'Customer C')) })).toThrow(/digest/i);
    snapshot.fixtures[0].allowedFields = ['kind', 'scenarios'];
    expect(() => projectApprovedFixture(options)).toThrow(/not approved/i);
  });
  it('validates authored synthetic content separately from approval and contains no remote identifiers', () => {
    const source = readFileSync('lib/work/fixtures/vora.json', 'utf8');
    expect(voraFixtureSchema.parse(JSON.parse(source)).scenarios[0].business).toBe('Cedar Repair');
    expect(source).not.toMatch(/https?:|@|\/Users\/|\.internal|sk-[A-Za-z0-9]+/);
    expect((vora as RichFlagshipRecord).caseStudy?.publication).toBe('draft');
  });
});
