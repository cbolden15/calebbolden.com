import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  centerReducer,
  centerView,
  controlCenterFixtureDTOSchema,
  controlCenterFixtureSchema,
  initialCenter,
  projectControlCenterScenario,
  type CenterFixtureDTO,
} from '../demos/control-center';
import { projectLocalFixture } from '../evidence';
import { controlCenter, resolveControlCenterPage } from '../projects/control-center';
import { projectDevelopmentCaseStudyShell } from '../public-content';
import { resolvePublicProjectView } from '../publication';

const deployment = {
  id: 'deployment-console',
  target: 'demo-console.example',
  sha: 'f1c7a2b',
  result: 'Recorded successfully',
  recordedAt: '2026-09-01T11:36:00Z',
  explanation: 'A fictional deployment record included only to demonstrate the read-only detail view.',
};

const spend = { label: 'Sample spend' as const, amount: '$18.40', period: 'This frozen example' };

const recentRun = (result: 'Succeeded' | 'Failed') => ({
  id: 'run-primary',
  name: 'Refresh demo index',
  host: 'worker-example-01',
  sourceType: 'Scheduled run',
  primary: true,
  stale: false,
  startedAt: '2026-09-01T11:48:00Z',
  updatedAt: '2026-09-01T11:52:00Z',
  startedSummary: 'The purpose-written sample run is in progress.',
  result: {
    status: result,
    finishedAt: '2026-09-01T11:58:00Z',
    summary: result === 'Succeeded'
      ? 'The sample index refresh finished successfully.'
      : 'The sample index refresh stopped after a fictional validation error.',
  },
});

const staleRun = {
  id: 'run-stale',
  name: 'Archive sample reports',
  host: 'worker-example-02',
  sourceType: 'Run wrapper',
  primary: false,
  stale: true,
  startedAt: '2026-09-01T10:20:00Z',
  updatedAt: '2026-09-01T10:42:00Z',
  startedSummary: 'No sample update has been recorded for more than 60 minutes.',
  result: null,
};

const decision = (resolved: boolean) => ({
  id: 'decision-retention',
  name: 'Keep sample reports for 30 days?',
  sourceType: 'Configuration review',
  createdAt: '2026-09-01T11:20:00Z',
  resolvedAt: resolved ? '2026-09-01T11:40:00Z' : null,
  explanation: resolved
    ? 'The fictional retention choice was resolved before the frozen example time.'
    : 'This fictional retention choice still needs an operator decision.',
});

export const syntheticCenterFixture: CenterFixtureDTO = {
  kind: 'control-center',
  scenarios: [
    {
      id: 'succeeds', label: 'Succeeds', frozenAt: '2026-09-01T12:00:00Z', staleAfterMinutes: 60,
      runs: [recentRun('Succeeded')], decisions: [decision(true)], spend, deployments: [deployment],
    },
    {
      id: 'fails', label: 'Fails', frozenAt: '2026-09-01T12:00:00Z', staleAfterMinutes: 60,
      runs: [recentRun('Failed'), staleRun], decisions: [decision(false)], spend, deployments: [deployment],
    },
  ],
  provenance: { kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' },
};

afterEach(() => vi.unstubAllEnvs());

describe('Control Center attention dashboard transitions', () => {
  it('derives the binding counts from the same supplied fixture', () => {
    const fixture = syntheticCenterFixture;
    expect(centerView(initialCenter, fixture).counts).toEqual({ runs: 1, decisions: 1 });
    const attention = centerReducer(initialCenter, { type: 'filter', value: 'attention' }, fixture);
    expect(centerView(attention, fixture).counts).toEqual({ runs: 0, decisions: 0 });
    const failStart = centerReducer(attention, { type: 'scenario', value: 'fails' }, fixture);
    expect(centerView(failStart, fixture).counts).toEqual({ runs: 1, decisions: 1 });
    expect(centerView(centerReducer(failStart, { type: 'show-result' }, fixture), fixture).counts).toEqual({ runs: 2, decisions: 1 });
    expect(centerReducer(failStart, { type: 'reset' }, fixture)).toEqual(initialCenter);
  });

  it('rejects unknown and filtered record selections', () => {
    const unknown = centerReducer(initialCenter, { type: 'select', value: { kind: 'run', id: 'missing' } }, syntheticCenterFixture);
    expect(unknown).toBe(initialCenter);
    const attention = centerReducer(initialCenter, { type: 'filter', value: 'attention' }, syntheticCenterFixture);
    expect(centerReducer(attention, { type: 'select', value: { kind: 'run', id: 'run-primary' } }, syntheticCenterFixture)).toBe(attention);
  });

  it('clears a resolved decision when Needs attention hides it', () => {
    const selected = centerReducer(initialCenter, { type: 'select', value: { kind: 'decision', id: 'decision-retention' } }, syntheticCenterFixture);
    expect(centerView(selected, syntheticCenterFixture).selected).toMatchObject({ kind: 'decision', id: 'decision-retention', resolved: true });
    const filtered = centerReducer(selected, { type: 'filter', value: 'attention' }, syntheticCenterFixture);
    expect(filtered.selected).toBeUndefined();
    expect(centerView(filtered, syntheticCenterFixture).selected).toBeNull();
  });

  it('preserves the filter, resets the phase, and selects the primary run only when visible', () => {
    const selectedDecision = centerReducer(initialCenter, { type: 'select', value: { kind: 'decision', id: 'decision-retention' } }, syntheticCenterFixture);
    const visible = centerReducer(selectedDecision, { type: 'scenario', value: 'fails' }, syntheticCenterFixture);
    expect(visible).toEqual({ scenario: 'fails', phase: 'started', filter: 'all', selected: { kind: 'run', id: 'run-primary' } });

    const attention = centerReducer(initialCenter, { type: 'filter', value: 'attention' }, syntheticCenterFixture);
    const hidden = centerReducer(attention, { type: 'scenario', value: 'fails' }, syntheticCenterFixture);
    expect(hidden).toEqual({ scenario: 'fails', phase: 'started', filter: 'attention' });
  });

  it('shows terminal status without changing fixture data and Reset clears every detail', () => {
    const failed = centerReducer({ ...initialCenter, scenario: 'fails' }, { type: 'show-result' }, syntheticCenterFixture);
    expect(centerView(failed, syntheticCenterFixture).runs.find(run => run.id === 'run-primary')?.status).toBe('Failed');
    expect(syntheticCenterFixture.scenarios[1].runs[0].result?.status).toBe('Failed');
    expect(centerReducer({ ...failed, selected: { kind: 'run', id: 'run-primary' } }, { type: 'reset' }, syntheticCenterFixture)).toEqual(initialCenter);
  });

  it('keeps sample spend and deployments unchanged while filtering and exposes frozen ages', () => {
    const all = centerView({ ...initialCenter, scenario: 'fails' }, syntheticCenterFixture);
    const attentionState = centerReducer({ ...initialCenter, scenario: 'fails' }, { type: 'filter', value: 'attention' }, syntheticCenterFixture);
    const attention = centerView(attentionState, syntheticCenterFixture);
    expect(attention.spend).toEqual(all.spend);
    expect(attention.deployments).toEqual(all.deployments);
    expect(attention.runs[0]).toMatchObject({ id: 'run-stale', age: '1 hr 18 min', stale: true });
    expect(attention.decisions[0].age).toBe('40 min');
  });

  it('selects a deployment as an unchanged read-only sample record', () => {
    const selected = centerReducer(initialCenter, { type: 'select', value: { kind: 'deployment', id: 'deployment-console' } }, syntheticCenterFixture);
    expect(centerView(selected, syntheticCenterFixture).selected).toEqual({
      kind: 'deployment', ...deployment, age: '24 min', readOnly: true,
    });
  });

  it('derives records from the explicitly supplied fixture', () => {
    const changed = structuredClone(syntheticCenterFixture);
    changed.scenarios[0].runs[0].name = 'Caller-supplied sample run';
    changed.scenarios[0].spend.amount = '$0.25';
    const view = centerView(initialCenter, changed);
    expect(view.runs[0].name).toBe('Caller-supplied sample run');
    expect(view.spend.amount).toBe('$0.25');
  });
});

describe('Control Center fixture and publication boundary', () => {
  it('accepts Succeeds and Fails in order and explicitly projects every public field', () => {
    const source = { kind: 'control-center' as const, scenarios: syntheticCenterFixture.scenarios };
    const parsed = controlCenterFixtureSchema.parse(source);
    expect(parsed.scenarios.map(projectControlCenterScenario)).toEqual(source.scenarios);
    expect(controlCenterFixtureDTOSchema.parse(syntheticCenterFixture)).toEqual(syntheticCenterFixture);
  });

  it('rejects wrong scenario order, inconsistent shared records, stale drift, and nested extras', () => {
    const source = { kind: 'control-center' as const, scenarios: syntheticCenterFixture.scenarios };
    const candidates: unknown[] = [
      { ...source, scenarios: [...source.scenarios].reverse() },
      { ...source, scenarios: [source.scenarios[0]] },
      { ...source, scenarios: [source.scenarios[0], { ...source.scenarios[1], spend: { ...spend, amount: '$99.00' } }] },
      { ...source, scenarios: [source.scenarios[0], { ...source.scenarios[1], runs: source.scenarios[1].runs.map(run => run.id === 'run-stale' ? { ...run, stale: false } : run) }] },
      { ...source, scenarios: [{ ...source.scenarios[0], privateHost: 'hidden' }, source.scenarios[1]] },
    ];
    for (const candidate of candidates) expect(controlCenterFixtureSchema.safeParse(candidate).success).toBe(false);
  });

  it('rejects internally consistent records that break attention counts or primary identity', () => {
    const [succeeds, fails] = syntheticCenterFixture.scenarios;
    const stalePrimary = {
      ...succeeds.runs[0],
      startedAt: '2026-09-01T10:40:00Z',
      updatedAt: '2026-09-01T10:50:00Z',
      stale: true,
    };
    const staleFailPrimary = {
      ...fails.runs[0],
      startedAt: '2026-09-01T10:40:00Z',
      updatedAt: '2026-09-01T10:50:00Z',
      stale: true,
    };
    const recentExtraRun = {
      ...fails.runs[1],
      startedAt: '2026-09-01T11:30:00Z',
      updatedAt: '2026-09-01T11:45:00Z',
      stale: false,
    };
    const differentPrimary = { ...fails.runs[0], id: 'run-different' };
    const candidates: unknown[] = [
      { kind: 'control-center', scenarios: [{ ...succeeds, runs: [stalePrimary] }, fails] },
      { kind: 'control-center', scenarios: [succeeds, { ...fails, runs: [staleFailPrimary, fails.runs[1]] }] },
      { kind: 'control-center', scenarios: [succeeds, { ...fails, runs: [fails.runs[0], recentExtraRun] }] },
      { kind: 'control-center', scenarios: [succeeds, { ...fails, runs: [differentPrimary, fails.runs[1]] }] },
    ];
    for (const candidate of candidates) expect(controlCenterFixtureSchema.safeParse(candidate).success).toBe(false);
  });

  it('projects one local fixture without approval metadata or unrelated fields', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const source = { kind: 'control-center' as const, scenarios: syntheticCenterFixture.scenarios };
    const projected = projectLocalFixture(JSON.stringify(source), controlCenterFixtureSchema, projectControlCenterScenario,
      { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() });
    expect(controlCenterFixtureDTOSchema.parse(projected)).toEqual(syntheticCenterFixture);
    expect(JSON.stringify(projected)).not.toMatch(/approval|checkedDate|sha256|sourceRevision|workspace|provider|customer/);
  });

  it('keeps the authored fixture illustrative, harmless, and server-only', () => {
    const source = readFileSync('lib/work/fixtures/control-center.json', 'utf8');
    const parsed = controlCenterFixtureSchema.parse(JSON.parse(source));
    expect(parsed.scenarios.map(item => item.id)).toEqual(['succeeds', 'fails']);
    expect(source).toMatch(/fictional deployment record/i);
    expect(source).not.toMatch(/https?:|@|\/Users\/|\/home\/|\.internal|localhost|sk-[A-Za-z0-9]+|"(?:runId|workspace|provider|model|customer|sourcePath)"\s*:/);
  });

  it('renders the authored draft only in development and returns production not-found', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const development = resolveControlCenterPage(controlCenter);
    expect(development.view.kind).toBe('rich-draft');
    expect(projectDevelopmentCaseStudyShell(controlCenter)?.developmentLabel).toBe('Local synthetic example. Unapproved for publication.');
    expect(development.metadata?.title).toBe('Control Center | Work | Caleb Bolden');
    vi.stubEnv('NODE_ENV', 'production');
    expect(resolveControlCenterPage(controlCenter)).toEqual({ view: { kind: 'not-found' }, metadata: null });
    expect(resolvePublicProjectView(controlCenter)).toEqual({ kind: 'not-found' });
  });
});
