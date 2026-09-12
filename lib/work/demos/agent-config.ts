import { z } from 'zod';
import { createFixtureSchema, publicProvenanceSchema, publicTextSchema } from '../types';

const configVariantSchema = z.enum(['brief', 'detailed']);
const outputSchema = z.strictObject({
  variant: configVariantSchema,
  content: publicTextSchema,
  highlight: publicTextSchema,
}).refine(output => output.content.includes(output.highlight), 'Highlighted excerpt must appear in the output');

const scenarioSchema = z.strictObject({
  id: configVariantSchema,
  label: z.enum(['Brief', 'Detailed']),
  fragment: z.strictObject({
    heading: publicTextSchema,
    content: publicTextSchema,
  }),
  outputs: z.strictObject({
    claudeCode: outputSchema,
    codex: outputSchema,
  }),
}).superRefine((scenario, ctx) => {
  const expectedLabel = scenario.id === 'brief' ? 'Brief' : 'Detailed';
  if (scenario.label !== expectedLabel) ctx.addIssue({ code: 'custom', message: 'Variant label does not match its ID' });
  if (scenario.outputs.claudeCode.variant !== scenario.id || scenario.outputs.codex.variant !== scenario.id) {
    ctx.addIssue({ code: 'custom', message: 'Generated output variant does not match its fragment' });
  }
});

export const agentConfigFixtureSchema = createFixtureSchema('agent-config', scenarioSchema).superRefine((fixture, ctx) => {
  const ids = fixture.scenarios.map(scenario => scenario.id);
  if (ids.length !== 2 || ids[0] !== 'brief' || ids[1] !== 'detailed') {
    ctx.addIssue({ code: 'custom', message: 'Agent Config fixture requires Brief and Detailed in order' });
  }
});
export const agentConfigFixtureDTOSchema = agentConfigFixtureSchema.extend({ provenance: publicProvenanceSchema });
export type AgentConfigFixtureDTO = z.infer<typeof agentConfigFixtureDTOSchema>;

export function projectAgentConfigScenario(scenario: z.infer<typeof scenarioSchema>) {
  return {
    id: scenario.id,
    label: scenario.label,
    fragment: {
      heading: scenario.fragment.heading,
      content: scenario.fragment.content,
    },
    outputs: {
      claudeCode: {
        variant: scenario.outputs.claudeCode.variant,
        content: scenario.outputs.claudeCode.content,
        highlight: scenario.outputs.claudeCode.highlight,
      },
      codex: {
        variant: scenario.outputs.codex.variant,
        content: scenario.outputs.codex.content,
        highlight: scenario.outputs.codex.highlight,
      },
    },
  };
}

export type ConfigVariant = z.infer<typeof configVariantSchema>;
export type ConfigState = { variant: ConfigVariant; stale: boolean };
export type ConfigEvent =
  | { type: 'variant'; value: ConfigVariant }
  | { type: 'stale' }
  | { type: 'regenerate' }
  | { type: 'reset' };

export const initialConfig: ConfigState = { variant: 'brief', stale: false };

export function configReducer(state: ConfigState, event: ConfigEvent): ConfigState {
  switch (event.type) {
    case 'variant':
      return event.value === state.variant && !state.stale ? state : { variant: event.value, stale: false };
    case 'stale':
      return state.stale ? state : { ...state, stale: true };
    case 'regenerate':
      return state.stale ? { ...state, stale: false } : state;
    case 'reset':
      return initialConfig;
  }
}

export function configView(state: ConfigState, fixture: AgentConfigFixtureDTO) {
  const selected = fixture.scenarios.find(scenario => scenario.id === state.variant);
  const opposite = fixture.scenarios.find(scenario => scenario.id !== state.variant);
  if (!selected || !opposite) throw new Error(`Missing Agent Config variant: ${state.variant}`);
  const codex = state.stale ? opposite.outputs.codex : selected.outputs.codex;
  return {
    fragment: selected.fragment,
    claudeCode: { ...selected.outputs.claudeCode, status: 'Current' as const },
    codex: { ...codex, status: state.stale ? 'Out of date' as const : 'Current' as const },
  };
}
