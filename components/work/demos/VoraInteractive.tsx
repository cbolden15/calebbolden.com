'use client';

import { useReducer, useRef } from 'react';
import { initialVora, voraReducer, voraView, type VoraEvent, type VoraFixtureDTO } from '@/lib/work/demos/vora';
import styles from '../Showcase.module.css';

const stepLabels = { request: 'Request received', pending: 'Awaiting approval', approved: 'Approved', completed: 'Completed', rejected: 'Rejected', failed: 'Execution failed' };
const buttonClass = 'btn-hairline min-h-11 px-4 py-2 disabled:opacity-50';

export default function VoraInteractive({ fixture }: { fixture: VoraFixtureDTO }) {
  const [state, dispatch] = useReducer(voraReducer, initialVora);
  const status = useRef<HTMLHeadingElement>(null);
  const view = voraView(state, fixture);
  const act = (event: VoraEvent) => {
    dispatch(event);
    // The state heading persists when decision buttons disappear, preserving keyboard context.
    status.current?.focus({ preventScroll: true });
  };
  return (
    <section role="region" aria-label="Vora approval example" className="mt-7 border-t border-[var(--color-hairline)] pt-6">
      <fieldset>
        <legend className="anno anno-blue">Sample outcome</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {(['succeeds', 'fails'] as const).map(outcome => (
            <button key={outcome} type="button" className={buttonClass} aria-pressed={state.outcome === outcome}
              onClick={() => act({ type: 'set-outcome', outcome })}>{outcome === 'succeeds' ? 'Succeeds' : 'Fails'}</button>
          ))}
          <button type="button" className={buttonClass} onClick={() => act({ type: 'reset' })}>Reset</button>
        </div>
      </fieldset>
      <h3 ref={status} tabIndex={-1} className="type-display mt-6 text-2xl">{stepLabels[state.step]}</h3>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-3">{view.caption}</p>
      <div className={`${styles.workflow} mt-6`}>
        <section>
          <h4 className="anno anno-blue">Request · {view.sample.business}</h4>
          <p className="mt-3">{view.sample.customer}: {view.sample.request}</p>
          <p className="mt-3">{view.sample.action}</p>
        </section>
        <section>
          <h4 className="anno anno-blue">{state.step === 'request' || state.step === 'pending' ? 'Proposed action' : 'Decision and sample result'}</h4>
          {(state.step === 'request' || state.step === 'pending') && <>
            <p className="mt-3">Recipient: {view.sample.customer}</p>
            <blockquote className="mt-3 border-l-2 border-[var(--color-blue)] pl-4">{view.sample.message}</blockquote>
            <p className="mt-3">{view.sample.reason}</p>
          </>}
          {state.step === 'approved' && <p className="mt-3">Approval recorded for this example. Execution has not been shown.</p>}
          {state.step === 'rejected' && <p className="mt-3">Decision: rejected. No completed CRM activity.</p>}
          {view.error && <p className="mt-3">{view.error}</p>}
          {view.deliveryConfirmed && <>
            <p className="mt-3">{view.confirmation}</p>
            <p className="mt-3">{view.crmActivity}</p>
          </>}
        </section>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {state.step === 'request' && <button type="button" className="btn-ink min-h-11" onClick={() => act({ type: 'review' })}>Review proposed action</button>}
        {state.step === 'pending' && <>
          <button type="button" className="btn-ink min-h-11" onClick={() => act({ type: 'approve' })}>Approve example</button>
          <button type="button" className={buttonClass} onClick={() => act({ type: 'reject' })}>Reject example</button>
        </>}
        {state.step === 'approved' && <button type="button" className="btn-ink min-h-11" onClick={() => act({ type: 'show-result' })}>Show sample result</button>}
      </div>
    </section>
  );
}
