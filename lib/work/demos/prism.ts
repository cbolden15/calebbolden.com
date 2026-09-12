import { z } from 'zod';
import { createFixtureSchema, publicProvenanceSchema, publicTextSchema } from '../types';

const eventSchema = z.strictObject({
  type: publicTextSchema,
  label: publicTextSchema,
  description: publicTextSchema,
});

const lifecycleAssertionSchema = z.strictObject({
  pluginId: publicTextSchema,
  confirmedAbsent: z.boolean(),
  cleanupErrors: z.array(publicTextSchema),
  exitCode: z.number().int().nullable(),
  oomKilled: z.boolean().nullable(),
});

const scenarioSchema = z.strictObject({
  id: z.literal('word-count'),
  prompt: publicTextSchema,
  events: z.array(eventSchema).length(6),
  result: publicTextSchema,
  receipt: z.strictObject({
    recordVersion: z.literal(1),
    limits: z.strictObject({ providerTurns: z.number().int().nonnegative(), toolCalls: z.number().int().nonnegative() }),
    terminal: z.strictObject({ status: z.literal('completed'), answer: publicTextSchema }),
  }),
  lifecycleContract: z.strictObject({
    label: publicTextSchema,
    plugins: z.array(lifecycleAssertionSchema).min(1),
  }),
});

export const prismFixtureSchema = createFixtureSchema('prism', scenarioSchema);
export const prismFixtureDTOSchema = prismFixtureSchema.extend({ provenance: publicProvenanceSchema });
export type PrismFixtureDTO = z.infer<typeof prismFixtureDTOSchema>;

export function projectPrismScenario(scenario: z.infer<typeof scenarioSchema>) {
  return {
    id: scenario.id,
    prompt: scenario.prompt,
    events: scenario.events.map(event => ({ type: event.type, label: event.label, description: event.description })),
    result: scenario.result,
    receipt: {
      recordVersion: scenario.receipt.recordVersion,
      limits: { providerTurns: scenario.receipt.limits.providerTurns, toolCalls: scenario.receipt.limits.toolCalls },
      terminal: { status: scenario.receipt.terminal.status, answer: scenario.receipt.terminal.answer },
    },
    lifecycleContract: {
      label: scenario.lifecycleContract.label,
      plugins: scenario.lifecycleContract.plugins.map(plugin => ({
        pluginId: plugin.pluginId,
        confirmedAbsent: plugin.confirmedAbsent,
        cleanupErrors: plugin.cleanupErrors.map(error => error),
        exitCode: plugin.exitCode,
        oomKilled: plugin.oomKilled,
      })),
    },
  };
}

export interface PrismState {
  eventIndex: number;
  receiptOpen: boolean;
}

export type PrismEvent = { type: 'start' | 'next' | 'previous' | 'inspect-receipt' | 'close-receipt' | 'reset' };

export const initialPrism: PrismState = { eventIndex: -1, receiptOpen: false };

export function prismReducer(state: PrismState, event: PrismEvent): PrismState {
  switch (event.type) {
    case 'reset':
      return initialPrism;
    case 'start':
      return state.eventIndex === -1 ? { eventIndex: 0, receiptOpen: false } : state;
    case 'next':
      return state.eventIndex >= 0 && state.eventIndex < 5
        ? { eventIndex: state.eventIndex + 1, receiptOpen: false }
        : state;
    case 'previous':
      return state.eventIndex > 0
        ? { eventIndex: state.eventIndex - 1, receiptOpen: false }
        : state;
    case 'inspect-receipt':
      return state.eventIndex === 5 && !state.receiptOpen ? { ...state, receiptOpen: true } : state;
    case 'close-receipt':
      return state.receiptOpen ? { ...state, receiptOpen: false } : state;
  }
}

export function prismView(state: PrismState, fixture: PrismFixtureDTO) {
  const scenario = fixture.scenarios[0];
  const completed = state.eventIndex === scenario.events.length - 1;
  return {
    scenario,
    activeEvent: state.eventIndex >= 0 ? scenario.events[state.eventIndex] : undefined,
    result: completed ? scenario.result : undefined,
    receipt: completed && state.receiptOpen ? scenario.receipt : undefined,
    receiptEligible: completed,
    disabled: {
      start: state.eventIndex >= 0,
      previous: state.eventIndex <= 0,
      next: state.eventIndex < 0 || completed,
      inspectReceipt: !completed || state.receiptOpen,
    },
  };
}
