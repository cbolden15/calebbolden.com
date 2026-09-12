import { z } from 'zod';
import { createFixtureSchema, publicProvenanceSchema, publicTextSchema, slugSchema } from '../types';

const scenarioIdSchema = z.enum(['succeeds', 'fails']);
const runStatusSchema = z.enum(['Succeeded', 'Failed']);
const instantSchema = z.iso.datetime({ offset: true });

const runSchema = z.strictObject({
  id: slugSchema,
  name: publicTextSchema,
  host: publicTextSchema,
  sourceType: publicTextSchema,
  primary: z.boolean(),
  stale: z.boolean(),
  startedAt: instantSchema,
  updatedAt: instantSchema,
  startedSummary: publicTextSchema,
  result: z.strictObject({ status: runStatusSchema, finishedAt: instantSchema, summary: publicTextSchema }).nullable(),
});

const decisionSchema = z.strictObject({
  id: slugSchema,
  name: publicTextSchema,
  sourceType: publicTextSchema,
  createdAt: instantSchema,
  resolvedAt: instantSchema.nullable(),
  explanation: publicTextSchema,
});

const deploymentSchema = z.strictObject({
  id: slugSchema,
  target: publicTextSchema,
  sha: z.string().regex(/^[a-f0-9]{7}$/),
  result: publicTextSchema,
  recordedAt: instantSchema,
  explanation: publicTextSchema,
});

const spendSchema = z.strictObject({
  label: z.literal('Sample spend'),
  amount: publicTextSchema,
  period: publicTextSchema,
});

const scenarioSchema = z.strictObject({
  id: scenarioIdSchema,
  label: z.enum(['Succeeds', 'Fails']),
  frozenAt: z.literal('2026-09-01T12:00:00Z'),
  staleAfterMinutes: z.literal(60),
  runs: z.array(runSchema).min(1),
  decisions: z.array(decisionSchema).length(1),
  spend: spendSchema,
  deployments: z.array(deploymentSchema).length(1),
}).superRefine((scenario, ctx) => {
  const expectedLabel = scenario.id === 'succeeds' ? 'Succeeds' : 'Fails';
  if (scenario.label !== expectedLabel) ctx.addIssue({ code: 'custom', message: 'Scenario label does not match its ID' });
  if (scenario.runs.length !== (scenario.id === 'succeeds' ? 1 : 2)) {
    ctx.addIssue({ code: 'custom', message: 'Scenario run count does not match the authored example contract' });
  }
  const primaryRuns = scenario.runs.filter(run => run.primary);
  if (primaryRuns.length !== 1) ctx.addIssue({ code: 'custom', message: 'Scenario requires exactly one primary run' });
  if (primaryRuns[0]?.result?.status !== (scenario.id === 'succeeds' ? 'Succeeded' : 'Failed')) {
    ctx.addIssue({ code: 'custom', message: 'Primary run result does not match its scenario' });
  }
  const frozenTime = Date.parse(scenario.frozenAt);
  for (const run of scenario.runs) {
    const minutesSinceUpdate = (frozenTime - Date.parse(run.updatedAt)) / 60_000;
    if (run.stale !== (minutesSinceUpdate >= scenario.staleAfterMinutes)) {
      ctx.addIssue({ code: 'custom', message: `Run stale marker disagrees with the ${scenario.staleAfterMinutes}-minute rule` });
    }
    if (Date.parse(run.startedAt) > Date.parse(run.updatedAt) || Date.parse(run.updatedAt) > frozenTime) {
      ctx.addIssue({ code: 'custom', message: 'Run timestamps must be ordered before the frozen example time' });
    }
    if (run.primary !== Boolean(run.result)) ctx.addIssue({ code: 'custom', message: 'Only the primary run may define a terminal result' });
  }
  const decisionResolved = scenario.decisions[0]?.resolvedAt !== null;
  if (decisionResolved !== (scenario.id === 'succeeds')) {
    ctx.addIssue({ code: 'custom', message: 'Decision resolution must match the scenario' });
  }
});

export const controlCenterFixtureSchema = createFixtureSchema('control-center', scenarioSchema).superRefine((fixture, ctx) => {
  if (fixture.scenarios.length !== 2 || fixture.scenarios[0]?.id !== 'succeeds' || fixture.scenarios[1]?.id !== 'fails') {
    ctx.addIssue({ code: 'custom', message: 'Control Center fixture requires Succeeds and Fails in order' });
    return;
  }
  const [succeeds, fails] = fixture.scenarios;
  if (JSON.stringify(succeeds.spend) !== JSON.stringify(fails.spend) || JSON.stringify(succeeds.deployments) !== JSON.stringify(fails.deployments)) {
    ctx.addIssue({ code: 'custom', message: 'Sample spend and deployments must be identical across scenarios' });
  }
});

export const controlCenterFixtureDTOSchema = controlCenterFixtureSchema.extend({ provenance: publicProvenanceSchema });
export type CenterFixtureDTO = z.infer<typeof controlCenterFixtureDTOSchema>;
type CenterScenario = CenterFixtureDTO['scenarios'][number];

export function projectControlCenterScenario(scenario: z.infer<typeof scenarioSchema>): CenterScenario {
  return {
    id: scenario.id,
    label: scenario.label,
    frozenAt: scenario.frozenAt,
    staleAfterMinutes: scenario.staleAfterMinutes,
    runs: scenario.runs.map(run => ({
      id: run.id,
      name: run.name,
      host: run.host,
      sourceType: run.sourceType,
      primary: run.primary,
      stale: run.stale,
      startedAt: run.startedAt,
      updatedAt: run.updatedAt,
      startedSummary: run.startedSummary,
      result: run.result ? {
        status: run.result.status,
        finishedAt: run.result.finishedAt,
        summary: run.result.summary,
      } : null,
    })),
    decisions: scenario.decisions.map(decision => ({
      id: decision.id,
      name: decision.name,
      sourceType: decision.sourceType,
      createdAt: decision.createdAt,
      resolvedAt: decision.resolvedAt,
      explanation: decision.explanation,
    })),
    spend: {
      label: scenario.spend.label,
      amount: scenario.spend.amount,
      period: scenario.spend.period,
    },
    deployments: scenario.deployments.map(deployment => ({
      id: deployment.id,
      target: deployment.target,
      sha: deployment.sha,
      result: deployment.result,
      recordedAt: deployment.recordedAt,
      explanation: deployment.explanation,
    })),
  };
}

export type CenterScenarioId = z.infer<typeof scenarioIdSchema>;
export type CenterFilter = 'all' | 'attention';
export type CenterSelection = { kind: 'run' | 'decision' | 'deployment'; id: string };
export type CenterState = {
  scenario: CenterScenarioId;
  phase: 'started' | 'finished';
  filter: CenterFilter;
  selected?: CenterSelection;
};
export type CenterEvent =
  | { type: 'scenario'; value: CenterScenarioId }
  | { type: 'filter'; value: CenterFilter }
  | { type: 'select'; value: CenterSelection }
  | { type: 'show-result' }
  | { type: 'reset' };

export const initialCenter: CenterState = { scenario: 'succeeds', phase: 'started', filter: 'all' };

function scenarioFor(state: CenterState, fixture: CenterFixtureDTO) {
  const scenario = fixture.scenarios.find(item => item.id === state.scenario);
  if (!scenario) throw new Error(`Missing Control Center scenario: ${state.scenario}`);
  return scenario;
}

function ageFrom(frozenAt: string, instant: string) {
  const minutes = Math.max(0, Math.floor((Date.parse(frozenAt) - Date.parse(instant)) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

export function centerView(state: CenterState, fixture: CenterFixtureDTO) {
  const scenario = scenarioFor(state, fixture);
  const allRuns = scenario.runs.map(run => {
    const terminal = run.primary && state.phase === 'finished' ? run.result : null;
    return {
      kind: 'run' as const,
      id: run.id,
      name: run.name,
      host: run.host,
      sourceType: run.sourceType,
      primary: run.primary,
      stale: run.stale,
      status: terminal?.status ?? 'Started' as 'Started' | 'Succeeded' | 'Failed',
      age: ageFrom(scenario.frozenAt, terminal?.finishedAt ?? run.updatedAt),
      summary: terminal?.summary ?? run.startedSummary,
    };
  });
  const allDecisions = scenario.decisions.map(decision => ({
    kind: 'decision' as const,
    id: decision.id,
    name: decision.name,
    sourceType: decision.sourceType,
    age: ageFrom(scenario.frozenAt, decision.createdAt),
    resolved: decision.resolvedAt !== null,
    explanation: decision.explanation,
    readOnly: true as const,
  }));
  const deployments = scenario.deployments.map(deployment => ({
    kind: 'deployment' as const,
    id: deployment.id,
    target: deployment.target,
    sha: deployment.sha,
    result: deployment.result,
    recordedAt: deployment.recordedAt,
    explanation: deployment.explanation,
    age: ageFrom(scenario.frozenAt, deployment.recordedAt),
    readOnly: true as const,
  }));
  const runs = state.filter === 'attention'
    ? allRuns.filter(run => run.stale || run.status === 'Failed')
    : allRuns;
  const decisions = state.filter === 'attention'
    ? allDecisions.filter(decision => !decision.resolved)
    : allDecisions;
  const selected = state.selected?.kind === 'run'
    ? runs.find(run => run.id === state.selected?.id) ?? null
    : state.selected?.kind === 'decision'
      ? decisions.find(decision => decision.id === state.selected?.id) ?? null
      : state.selected?.kind === 'deployment'
        ? deployments.find(deployment => deployment.id === state.selected?.id) ?? null
        : null;
  return {
    scenario,
    runs,
    decisions,
    counts: { runs: runs.length, decisions: decisions.length },
    selected,
    spend: scenario.spend,
    deployments,
    frozenAt: scenario.frozenAt,
    staleAfterMinutes: scenario.staleAfterMinutes,
  };
}

function isSelectionVisible(state: CenterState, fixture: CenterFixtureDTO, selection: CenterSelection) {
  const view = centerView({ ...state, selected: selection }, fixture);
  return view.selected !== null;
}

export function centerReducer(state: CenterState, event: CenterEvent, fixture: CenterFixtureDTO): CenterState {
  switch (event.type) {
    case 'scenario': {
      const next: CenterState = { scenario: event.value, phase: 'started', filter: state.filter };
      const primary = scenarioFor(next, fixture).runs.find(run => run.primary);
      return primary && isSelectionVisible(next, fixture, { kind: 'run', id: primary.id })
        ? { ...next, selected: { kind: 'run', id: primary.id } }
        : next;
    }
    case 'filter': {
      const next: CenterState = { ...state, filter: event.value };
      return state.selected && !isSelectionVisible(next, fixture, state.selected)
        ? { scenario: next.scenario, phase: next.phase, filter: next.filter }
        : next;
    }
    case 'select':
      return isSelectionVisible(state, fixture, event.value) ? { ...state, selected: event.value } : state;
    case 'show-result': {
      if (state.phase === 'finished') return state;
      const next: CenterState = { ...state, phase: 'finished' };
      return state.selected && !isSelectionVisible(next, fixture, state.selected)
        ? { scenario: next.scenario, phase: next.phase, filter: next.filter }
        : next;
    }
    case 'reset':
      return initialCenter;
  }
}
