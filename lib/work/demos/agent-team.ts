import { z } from 'zod';
import { createFixtureSchema, publicProvenanceSchema, publicTextSchema } from '../types';

const scenarioIdSchema = z.enum(['pass', 'retry', 'security']);
const stageIdSchema = z.enum(['task', 'implementation', 'reviews', 'qa', 'delivery']);

const stepSchema = z.strictObject({
  label: publicTextSchema,
  role: publicTextSchema,
  decision: publicTextSchema,
  artifact: publicTextSchema,
});

const stageSchema = z.strictObject({
  id: stageIdSchema,
  label: z.enum(['Task', 'Implementation', 'Reviews', 'QA', 'Delivery']),
  status: z.enum(['reached', 'not-reached']),
  role: publicTextSchema,
  decision: publicTextSchema,
  artifact: publicTextSchema,
  steps: z.array(stepSchema),
});

const attemptSchema = z.strictObject({
  attempt: z.number().int().positive(),
  outcome: z.enum(['failed', 'passed']),
  assertion: publicTextSchema,
  change: publicTextSchema,
});

const scenarioSchema = z.strictObject({
  id: scenarioIdSchema,
  label: publicTextSchema,
  summary: publicTextSchema,
  configuration: z.strictObject({
    mergeEnforcement: z.literal(false),
    queueEnforcement: z.literal(false),
    sandboxing: z.literal(false),
    anomalyTermination: z.literal(false),
    hardCaps: z.null(),
  }),
  terminal: z.strictObject({
    stageIndex: z.number().int().min(0).max(4),
    label: publicTextSchema,
    decision: publicTextSchema,
  }),
  stages: z.array(stageSchema).length(5),
  attemptHistory: z.array(attemptSchema),
}).superRefine((scenario, ctx) => {
  const expectedStageIds = ['task', 'implementation', 'reviews', 'qa', 'delivery'];
  const expectedLabels = ['Task', 'Implementation', 'Reviews', 'QA', 'Delivery'];
  const terminalStage = scenario.id === 'security' ? 2 : 4;
  const expectedStatuses = expectedStageIds.map((_, index) => index <= terminalStage ? 'reached' : 'not-reached');

  if (scenario.terminal.stageIndex !== terminalStage) ctx.addIssue({ code: 'custom', message: 'Terminal stage does not match the scenario' });
  if (scenario.stages.some((stage, index) => stage.id !== expectedStageIds[index] || stage.label !== expectedLabels[index])) {
    ctx.addIssue({ code: 'custom', message: 'Stages must use the fixed Task-to-Delivery order' });
  }
  if (scenario.stages.some((stage, index) => stage.status !== expectedStatuses[index])) {
    ctx.addIssue({ code: 'custom', message: 'Stage reachability does not match the scenario terminal' });
  }
  if (scenario.stages.some(stage => stage.status === 'reached' ? stage.steps.length < 1 : stage.steps.length !== 0)) {
    ctx.addIssue({ code: 'custom', message: 'Reached stages require details and unreached stages cannot contain run details' });
  }
  const outcomes = scenario.attemptHistory.map(attempt => attempt.outcome);
  if (scenario.id === 'retry' && (outcomes.length !== 2 || outcomes[0] !== 'failed' || outcomes[1] !== 'passed')) {
    ctx.addIssue({ code: 'custom', message: 'QA retry must retain failed and passed attempts' });
  }
  if (scenario.id !== 'retry' && outcomes.length !== 0) {
    ctx.addIssue({ code: 'custom', message: 'Only QA retry contains attempt history' });
  }
});

export const agentTeamFixtureSchema = createFixtureSchema('agent-team', scenarioSchema).superRefine((fixture, ctx) => {
  const ids = fixture.scenarios.map(scenario => scenario.id);
  if (ids.length !== 3 || ids.some((id, index) => id !== ['pass', 'retry', 'security'][index])) {
    ctx.addIssue({ code: 'custom', message: 'Agent Team fixture requires pass, retry, and security in order' });
  }
});
export const agentTeamFixtureDTOSchema = agentTeamFixtureSchema.extend({ provenance: publicProvenanceSchema });
export type AgentTeamFixtureDTO = z.infer<typeof agentTeamFixtureDTOSchema>;

export function projectAgentTeamScenario(scenario: z.infer<typeof scenarioSchema>) {
  return {
    id: scenario.id,
    label: scenario.label,
    summary: scenario.summary,
    configuration: {
      mergeEnforcement: scenario.configuration.mergeEnforcement,
      queueEnforcement: scenario.configuration.queueEnforcement,
      sandboxing: scenario.configuration.sandboxing,
      anomalyTermination: scenario.configuration.anomalyTermination,
      hardCaps: scenario.configuration.hardCaps,
    },
    terminal: {
      stageIndex: scenario.terminal.stageIndex,
      label: scenario.terminal.label,
      decision: scenario.terminal.decision,
    },
    stages: scenario.stages.map(stage => ({
      id: stage.id,
      label: stage.label,
      status: stage.status,
      role: stage.role,
      decision: stage.decision,
      artifact: stage.artifact,
      steps: stage.steps.map(step => ({
        label: step.label,
        role: step.role,
        decision: step.decision,
        artifact: step.artifact,
      })),
    })),
    attemptHistory: scenario.attemptHistory.map(attempt => ({
      attempt: attempt.attempt,
      outcome: attempt.outcome,
      assertion: attempt.assertion,
      change: attempt.change,
    })),
  };
}

export type TeamScenario = z.infer<typeof scenarioIdSchema>;
export type TeamState = { scenario: TeamScenario; stage: number; detailsOpen: boolean };
export type TeamEvent =
  | { type: 'scenario'; value: TeamScenario }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'select-stage'; index: number }
  | { type: 'toggle-details' }
  | { type: 'reset' };

export const initialTeam: TeamState = { scenario: 'pass', stage: 0, detailsOpen: false };

function lastReachableStage(scenario: TeamScenario) {
  return scenario === 'security' ? 2 : 4;
}

export function teamReducer(state: TeamState, event: TeamEvent): TeamState {
  switch (event.type) {
    case 'reset':
      return initialTeam;
    case 'scenario':
      return { scenario: event.value, stage: 0, detailsOpen: false };
    case 'next':
      return state.stage < lastReachableStage(state.scenario)
        ? { ...state, stage: state.stage + 1, detailsOpen: false }
        : state;
    case 'previous':
      return state.stage > 0 ? { ...state, stage: state.stage - 1, detailsOpen: false } : state;
    case 'select-stage':
      return Number.isInteger(event.index) && event.index >= 0 && event.index <= lastReachableStage(state.scenario)
        ? { ...state, stage: event.index, detailsOpen: false }
        : state;
    case 'toggle-details':
      return { ...state, detailsOpen: !state.detailsOpen };
  }
}

export function teamView(state: TeamState, fixture: AgentTeamFixtureDTO) {
  const scenario = fixture.scenarios.find(candidate => candidate.id === state.scenario);
  if (!scenario) throw new Error(`Missing Agent Team scenario: ${state.scenario}`);
  const atTerminal = state.stage === scenario.terminal.stageIndex;
  const attemptHistory = Object.freeze(scenario.attemptHistory.map(attempt => Object.freeze({ ...attempt })));
  return {
    scenario,
    visibleStage: scenario.stages[state.stage],
    reachableStages: scenario.stages.flatMap((stage, index) => stage.status === 'reached' ? [index] : []),
    terminalLabel: atTerminal ? scenario.terminal.label : null,
    terminalDecision: atTerminal ? scenario.terminal.decision : null,
    attemptHistory,
    disabled: {
      previous: state.stage === 0,
      next: state.stage === scenario.terminal.stageIndex,
    },
  };
}
