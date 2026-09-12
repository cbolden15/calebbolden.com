import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  agentTeamFixtureDTOSchema,
  agentTeamFixtureSchema,
  initialTeam,
  projectAgentTeamScenario,
  teamReducer,
  teamView,
  type AgentTeamFixtureDTO,
  type TeamState,
} from '../demos/agent-team';
import { projectLocalFixture } from '../evidence';
import { agentTeam, resolveAgentTeamPage } from '../projects/agent-team';
import { projectDevelopmentCaseStudyShell } from '../public-content';
import { resolvePublicProjectView } from '../publication';

const configuration = {
  mergeEnforcement: false,
  queueEnforcement: false,
  sandboxing: false,
  anomalyTermination: false,
  hardCaps: null,
} as const;

const stage = (
  id: 'task' | 'implementation' | 'reviews' | 'qa' | 'delivery',
  label: 'Task' | 'Implementation' | 'Reviews' | 'QA' | 'Delivery',
  status: 'reached' | 'not-reached' = 'reached',
) => ({
  id,
  label,
  status,
  role: `${label} role`,
  decision: status === 'reached' ? `${label} decision` : 'Not reached',
  artifact: status === 'reached' ? `${label} artifact excerpt` : 'No artifact was created.',
  steps: status === 'reached'
    ? [{ label: `${label} detail`, role: `${label} detail role`, decision: `${label} detail decision`, artifact: `${label} detail artifact` }]
    : [],
});

const pass: AgentTeamFixtureDTO['scenarios'][number] = {
  id: 'pass',
  label: 'Passes review',
  summary: 'A fictional task reaches delivery after separate review and QA.',
  configuration,
  terminal: { stageIndex: 4, label: 'Sample run complete · automatic merge.', decision: 'Green CI allows the legacy automatic merge path.' },
  stages: [stage('task', 'Task'), stage('implementation', 'Implementation'), stage('reviews', 'Reviews'), stage('qa', 'QA'), stage('delivery', 'Delivery')],
  attemptHistory: [],
};

const retry: AgentTeamFixtureDTO['scenarios'][number] = {
  ...pass,
  id: 'retry',
  label: 'QA retry',
  summary: 'A fictional assertion fails, a debugger changes the sample artifact, and QA passes on its second attempt.',
  attemptHistory: [
    { attempt: 1, outcome: 'failed', assertion: 'Expected the retry marker to remain visible.', change: 'Debugger retained the marker in the rendered summary.' },
    { attempt: 2, outcome: 'passed', assertion: 'The retry marker remains visible.', change: 'No further change.' },
  ],
};

const security: AgentTeamFixtureDTO['scenarios'][number] = {
  ...pass,
  id: 'security',
  label: 'Security block',
  summary: 'A fictional security review blocks the run before a draft PR exists.',
  terminal: { stageIndex: 2, label: 'Blocked by review.', decision: 'A review finding stops the sample before PR and merge.' },
  stages: [stage('task', 'Task'), stage('implementation', 'Implementation'), stage('reviews', 'Reviews'), stage('qa', 'QA', 'not-reached'), stage('delivery', 'Delivery', 'not-reached')],
  attemptHistory: [],
};

export const syntheticTeamFixture: AgentTeamFixtureDTO = {
  kind: 'agent-team',
  scenarios: [pass, retry, security],
  provenance: { kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' },
};

afterEach(() => vi.unstubAllEnvs());

describe('Agent Team run transitions', () => {
  it('starts at Pass and supports direct and keyboard-equivalent stage selection', () => {
    expect(initialTeam).toEqual({ scenario: 'pass', stage: 0, detailsOpen: false });
    const direct = teamReducer(initialTeam, { type: 'select-stage', index: 3 });
    expect(direct).toEqual({ scenario: 'pass', stage: 3, detailsOpen: false });
    expect(teamReducer(direct, { type: 'previous' }).stage).toBe(2);
    expect(teamReducer(direct, { type: 'next' }).stage).toBe(4);
  });

  it('clamps previous and next at the scenario ends and rejects invalid indices', () => {
    expect(teamReducer(initialTeam, { type: 'previous' })).toBe(initialTeam);
    const end: TeamState = { scenario: 'pass', stage: 4, detailsOpen: true };
    expect(teamReducer(end, { type: 'next' })).toBe(end);
    expect(teamReducer(end, { type: 'select-stage', index: -1 })).toBe(end);
    expect(teamReducer(end, { type: 'select-stage', index: 1.5 })).toBe(end);
    expect(teamReducer(end, { type: 'select-stage', index: 5 })).toBe(end);
  });

  it('resets stage and details when selecting any scenario, and Reset restores Pass/Task', () => {
    const open: TeamState = { scenario: 'pass', stage: 4, detailsOpen: true };
    for (const value of ['pass', 'retry', 'security'] as const) {
      expect(teamReducer(open, { type: 'scenario', value })).toEqual({ scenario: value, stage: 0, detailsOpen: false });
    }
    expect(teamReducer({ scenario: 'security', stage: 2, detailsOpen: true }, { type: 'reset' })).toEqual(initialTeam);
  });

  it('toggles details without changing the selected run or stage', () => {
    const open = teamReducer(initialTeam, { type: 'toggle-details' });
    expect(open).toEqual({ ...initialTeam, detailsOpen: true });
    expect(teamReducer(open, { type: 'toggle-details' })).toEqual(initialTeam);
  });

  it('keeps blocked stages visible and prevents direct, keyboard, and Next bypasses', () => {
    const blocked = teamReducer(initialTeam, { type: 'scenario', value: 'security' });
    expect(teamView(blocked, syntheticTeamFixture).reachableStages).toEqual([0, 1, 2]);
    expect(teamReducer(blocked, { type: 'select-stage', index: 4 })).toBe(blocked);
    const review = teamReducer(blocked, { type: 'select-stage', index: 2 });
    expect(teamReducer(review, { type: 'next' })).toBe(review);
    expect(teamView(review, syntheticTeamFixture)).toMatchObject({ terminalLabel: 'Blocked by review.' });
    expect(teamView(review, syntheticTeamFixture).scenario.stages.slice(3).map(item => item.status)).toEqual(['not-reached', 'not-reached']);
  });

  it('retains immutable retry history after success', () => {
    const selected = teamReducer(initialTeam, { type: 'scenario', value: 'retry' });
    const delivered = teamReducer(selected, { type: 'select-stage', index: 4 });
    const view = teamView(delivered, syntheticTeamFixture);
    expect(view.attemptHistory.map(attempt => attempt.outcome)).toEqual(['failed', 'passed']);
    expect(view.terminalLabel).toBe('Sample run complete · automatic merge.');
    expect(Object.isFrozen(view.attemptHistory)).toBe(true);
    expect(view.attemptHistory.every(Object.isFrozen)).toBe(true);
  });

  it('reads visible stage, terminal decisions, and reachability from the supplied fixture', () => {
    const qa = teamView({ scenario: 'pass', stage: 3, detailsOpen: false }, syntheticTeamFixture);
    expect(qa.visibleStage).toBe(pass.stages[3]);
    expect(qa.reachableStages).toEqual([0, 1, 2, 3, 4]);
    expect(qa.terminalLabel).toBeNull();
    expect(teamView({ scenario: 'pass', stage: 4, detailsOpen: false }, syntheticTeamFixture).terminalDecision)
      .toBe('Green CI allows the legacy automatic merge path.');
  });
});

describe('Agent Team fixture and publication boundary', () => {
  it('accepts exactly three strict scenarios and explicitly projects their public fields', () => {
    const source = { kind: 'agent-team' as const, scenarios: [pass, retry, security] };
    const parsed = agentTeamFixtureSchema.parse(source);
    expect(parsed.scenarios.map(projectAgentTeamScenario)).toEqual(source.scenarios);
    expect(agentTeamFixtureDTOSchema.parse(syntheticTeamFixture)).toEqual(syntheticTeamFixture);
  });

  it('rejects missing scenarios, nested extras, invalid stage order, private text, and a reachable blocked delivery', () => {
    const source = { kind: 'agent-team' as const, scenarios: [pass, retry, security] };
    const cases: unknown[] = [
      { ...source, scenarios: [pass, retry] },
      { ...source, scenarios: [{ ...pass, internal: 'extra' }, retry, security] },
      { ...source, scenarios: [{ ...pass, stages: [pass.stages[1], ...pass.stages.slice(1)] }, retry, security] },
      { ...source, scenarios: [{ ...pass, summary: 'Read /Users/example/private' }, retry, security] },
      { ...source, scenarios: [pass, retry, { ...security, stages: [...security.stages.slice(0, 4), stage('delivery', 'Delivery')] }] },
    ];
    for (const candidate of cases) expect(agentTeamFixtureSchema.safeParse(candidate).success).toBe(false);
  });

  it('projects the selected local fixture without approval metadata or unrelated fields', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const source = { kind: 'agent-team' as const, scenarios: [pass, retry, security] };
    const projected = projectLocalFixture(JSON.stringify(source), agentTeamFixtureSchema, projectAgentTeamScenario,
      { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() });
    expect(agentTeamFixtureDTOSchema.parse(projected)).toEqual(syntheticTeamFixture);
    expect(JSON.stringify(projected)).not.toMatch(/approval|checkedDate|sha256|repositoryUrl|runId|workspace|provider|model/);
  });

  it('keeps the authored fixture server-only, fictional, and aligned with the required defaults', () => {
    const source = readFileSync('lib/work/fixtures/agent-team.json', 'utf8');
    const parsed = agentTeamFixtureSchema.parse(JSON.parse(source));
    expect(parsed.scenarios.map(item => item.id)).toEqual(['pass', 'retry', 'security']);
    expect(parsed.scenarios[1].attemptHistory.map(item => item.outcome)).toEqual(['failed', 'passed']);
    expect(parsed.scenarios[2].terminal).toMatchObject({ stageIndex: 2, label: 'Blocked by review.' });
    for (const scenario of parsed.scenarios) expect(scenario.configuration).toEqual(configuration);
    expect(source).not.toMatch(/https?:|@|\/Users\/|\.internal|sk-[A-Za-z0-9]+|"(?:runId|workspace|provider|model|customer)"\s*:/);
  });

  it('renders the authored draft only in development and returns production not-found', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const development = resolveAgentTeamPage(agentTeam);
    expect(development.view.kind).toBe('rich-draft');
    expect(projectDevelopmentCaseStudyShell(agentTeam)?.developmentLabel).toBe('Local synthetic example. Unapproved for publication.');
    expect(development.metadata?.title).toBe('Agent Team | Work | Caleb Bolden');
    vi.stubEnv('NODE_ENV', 'production');
    expect(resolveAgentTeamPage(agentTeam)).toEqual({ view: { kind: 'not-found' }, metadata: null });
    expect(resolvePublicProjectView(agentTeam)).toEqual({ kind: 'not-found' });
  });
});
