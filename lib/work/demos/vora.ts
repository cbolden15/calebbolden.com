import { z } from 'zod';
import { createFixtureSchema, publicProvenanceSchema, publicTextSchema } from '../types';

const scenarioSchema = z.strictObject({
  id: z.literal('approval'), business: publicTextSchema, customer: publicTextSchema,
  request: publicTextSchema, action: publicTextSchema, reason: publicTextSchema, message: publicTextSchema,
  captions: z.strictObject({ request: publicTextSchema, pending: publicTextSchema, approved: publicTextSchema,
    completed: publicTextSchema, rejected: publicTextSchema, failed: publicTextSchema }),
  completion: z.strictObject({ confirmation: publicTextSchema, activity: publicTextSchema }), error: publicTextSchema,
});
export const voraFixtureSchema = createFixtureSchema('vora', scenarioSchema);
export const voraFixtureDTOSchema = voraFixtureSchema.extend({ provenance: publicProvenanceSchema });
export type VoraFixtureDTO = z.infer<typeof voraFixtureDTOSchema>;

export function projectVoraScenario(scenario: z.infer<typeof scenarioSchema>) {
  return { id: scenario.id, business: scenario.business, customer: scenario.customer, request: scenario.request,
    action: scenario.action, reason: scenario.reason, message: scenario.message,
    captions: { request: scenario.captions.request, pending: scenario.captions.pending, approved: scenario.captions.approved,
      completed: scenario.captions.completed, rejected: scenario.captions.rejected, failed: scenario.captions.failed },
    completion: { confirmation: scenario.completion.confirmation, activity: scenario.completion.activity }, error: scenario.error };
}

export interface VoraState {
  outcome: 'succeeds' | 'fails';
  step: 'request' | 'pending' | 'approved' | 'completed' | 'rejected' | 'failed';
}
export type VoraEvent = { type: 'review' | 'approve' | 'reject' | 'show-result' | 'reset' }
  | { type: 'set-outcome'; outcome: VoraState['outcome'] };
export const initialVora: VoraState = { outcome: 'succeeds', step: 'request' };

export function voraReducer(state: VoraState, event: VoraEvent): VoraState {
  switch (event.type) {
    case 'reset': return initialVora;
    case 'set-outcome': return { outcome: event.outcome, step: 'request' };
    case 'review': return state.step === 'request' ? { ...state, step: 'pending' } : state;
    case 'approve': return state.step === 'pending' ? { ...state, step: 'approved' } : state;
    case 'reject': return state.step === 'pending' ? { ...state, step: 'rejected' } : state;
    case 'show-result': return state.step === 'approved' ? { ...state, step: state.outcome === 'succeeds' ? 'completed' : 'failed' } : state;
  }
}

export function voraView(state: VoraState, fixture: VoraFixtureDTO) {
  const sample = fixture.scenarios[0];
  const deliveryConfirmed = state.step === 'completed' && state.outcome === 'succeeds';
  return { sample, caption: sample.captions[state.step], deliveryConfirmed,
    confirmation: deliveryConfirmed ? sample.completion.confirmation : null,
    crmActivity: deliveryConfirmed ? sample.completion.activity : null,
    error: state.step === 'failed' ? sample.error : null };
}
