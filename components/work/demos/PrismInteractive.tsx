'use client';

import { useReducer, useRef } from 'react';
import { initialPrism, prismReducer, prismView, type PrismEvent, type PrismFixtureDTO } from '@/lib/work/demos/prism';
import styles from '../Showcase.module.css';

const buttonClass = 'btn-hairline min-h-11 px-4 py-2 disabled:opacity-50';

export default function PrismInteractive({ fixture }: { fixture: PrismFixtureDTO }) {
  const [state, dispatch] = useReducer(prismReducer, initialPrism);
  const status = useRef<HTMLHeadingElement>(null);
  const view = prismView(state, fixture);
  const act = (event: PrismEvent) => {
    dispatch(event);
    status.current?.focus({ preventScroll: true });
  };
  const position = state.eventIndex >= 0 ? `${state.eventIndex + 1} of ${view.scenario.events.length}` : 'Not started';

  return (
    <section role="region" aria-label="Prism trace example" className="mt-7 border-t border-[var(--color-hairline)] pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="anno anno-blue">Successful deterministic bounded-coordinator sequence</p>
        <p className="anno">{position}</p>
      </div>
      <div className={`${styles.workflow} mt-5`}>
        <section className="min-w-0">
          <h3 className="anno anno-blue">Prompt</h3>
          <p className="mt-3 font-mono text-sm">{view.scenario.prompt}</p>
        </section>
        <section className="min-w-0">
          <h3 ref={status} tabIndex={-1} className="type-display text-2xl">
            {view.activeEvent ? view.activeEvent.label : 'Ready to start'}
          </h3>
          <p role="status" aria-live="polite" aria-atomic="true" className="mt-3">
            {view.activeEvent ? `${view.activeEvent.label}. ${view.activeEvent.description}` : 'The result and receipt stay hidden until the sixth event.'}
          </p>
          {view.activeEvent && <p className="mt-3 font-mono text-sm">{view.activeEvent.type}</p>}
        </section>
      </div>

      {view.result && (
        <section className="mt-6 border-y border-[var(--color-hairline)] py-5" aria-label="Prism result">
          <p className="anno anno-blue">Result</p>
          <p className="type-display mt-2 text-3xl">{view.result}</p>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {state.eventIndex < 0 && <button type="button" className="btn-ink min-h-11" onClick={() => act({ type: 'start' })}>Start example</button>}
        <button type="button" className={buttonClass} disabled={view.disabled.previous} onClick={() => act({ type: 'previous' })}>Previous event</button>
        <button type="button" className={buttonClass} disabled={view.disabled.next} onClick={() => act({ type: 'next' })}>Next event</button>
        <button type="button" className={buttonClass} onClick={() => act({ type: 'reset' })}>Reset</button>
        {view.receiptEligible && !state.receiptOpen && (
          <button type="button" className="btn-ink min-h-11" disabled={view.disabled.inspectReceipt} onClick={() => act({ type: 'inspect-receipt' })}>Inspect receipt</button>
        )}
      </div>

      {view.receipt && (
        <section className="mt-7 bg-[var(--color-ink)] p-5 text-[var(--color-surface)]" aria-labelledby="prism-receipt-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest">v{view.receipt.recordVersion} inspect-record excerpt</p>
              <h3 id="prism-receipt-title" className="type-display mt-2 text-2xl" style={{ color: 'var(--color-surface)' }}>Terminal receipt</h3>
            </div>
            <button type="button" className="min-h-11 rounded-md border border-current px-4 py-2" onClick={() => act({ type: 'close-receipt' })}>Close receipt</button>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><dt className="font-mono text-xs uppercase tracking-wider">Fixed limits</dt><dd className="mt-1">{view.receipt.limits.providerTurns} provider turns · {view.receipt.limits.toolCalls} tool call</dd></div>
            <div><dt className="font-mono text-xs uppercase tracking-wider">Terminal</dt><dd className="mt-1">{view.receipt.terminal.status} · {view.receipt.terminal.answer}</dd></div>
          </dl>
          <p className="mt-5 text-sm">This v1 record has no persisted measured usage and no cleanup or lifecycle-receipt field.</p>
          <details className="mt-5 border-t border-current pt-3">
            <summary className="cursor-pointer py-2">Lower-level lifecycle contract</summary>
            <p className="mt-2 text-sm">{view.scenario.lifecycleContract.label} This is separate contract evidence, not literal inspect output or captured execution.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              {view.scenario.lifecycleContract.plugins.map((plugin, index) => (
                <li key={`${plugin.pluginId}-${index}`}>{plugin.pluginId}: confirmed absent, zero cleanup errors, exit code {plugin.exitCode}, not OOM-killed.</li>
              ))}
            </ul>
          </details>
        </section>
      )}
    </section>
  );
}
