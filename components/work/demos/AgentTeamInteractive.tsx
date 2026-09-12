'use client';

import { useReducer, useRef } from 'react';
import { initialTeam, teamReducer, teamView, type AgentTeamFixtureDTO, type TeamEvent } from '@/lib/work/demos/agent-team';
import styles from '../Showcase.module.css';

const buttonClass = 'btn-hairline min-h-11 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50';

function setting(value: boolean | null) {
  return value === null ? 'Unset' : value ? 'On' : 'Off';
}

export default function AgentTeamInteractive({ fixture }: { fixture: AgentTeamFixtureDTO }) {
  const [state, dispatch] = useReducer(teamReducer, initialTeam);
  const status = useRef<HTMLHeadingElement>(null);
  const view = teamView(state, fixture);
  const act = (event: TeamEvent) => {
    dispatch(event);
    status.current?.focus({ preventScroll: true });
  };

  return (
    <section role="region" aria-label="Agent Team sample run explorer" className="mt-7 border-t border-[var(--color-hairline)] pt-6">
      <fieldset>
        <legend className="anno anno-blue">Choose sample run</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {fixture.scenarios.map(scenario => (
            <button
              type="button"
              key={scenario.id}
              aria-pressed={state.scenario === scenario.id}
              className={state.scenario === scenario.id ? 'btn-ink min-h-11' : buttonClass}
              onClick={() => act({ type: 'scenario', value: scenario.id })}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="mt-4 max-w-[70ch]">{view.scenario.summary}</p>

      <ol className={`${styles.teamStages} mt-6 gap-2`} aria-label="Run stages">
        {view.scenario.stages.map((stage, index) => {
          const reachable = view.reachableStages.includes(index);
          return (
            <li key={stage.id}>
              <button
                type="button"
                className={`${buttonClass} ${styles.teamStage} h-full w-full text-left`}
                aria-current={state.stage === index ? 'step' : undefined}
                disabled={!reachable}
                onClick={() => act({ type: 'select-stage', index })}
              >
                <span className="anno block">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-1 block">{stage.label}</span>
                {!reachable && <span className="mt-1 block text-xs">Not reached</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <div className={`${styles.workflow} mt-7`}>
        <section className="min-w-0">
          <p className="anno anno-blue">{view.scenario.label} · {state.stage + 1} of 5</p>
          <h3 ref={status} tabIndex={-1} className="type-display mt-2 text-2xl">{view.visibleStage.label}</h3>
          <p role="status" aria-live="polite" aria-atomic="true" className="mt-3">
            {view.terminalLabel ?? `${view.visibleStage.label}. ${view.visibleStage.decision}`}
          </p>
          <dl className="mt-5 grid gap-4">
            <div><dt className="anno">Role</dt><dd className="mt-1">{view.visibleStage.role}</dd></div>
            <div><dt className="anno">Decision</dt><dd className="mt-1">{view.visibleStage.decision}</dd></div>
          </dl>
        </section>

        <section className="min-w-0 bg-[var(--color-ink)] p-5 text-[var(--color-surface)]" aria-label={`${view.visibleStage.label} artifact`}>
          <p className="font-mono text-xs uppercase tracking-widest">Fictional artifact excerpt</p>
          <div className={`${styles.codePanel} mt-4`}>
            <pre className="font-mono text-sm"><code>{view.visibleStage.artifact}</code></pre>
          </div>
          {view.terminalLabel && (
            <div className="mt-5 border-t border-current pt-4">
              <p className="type-display text-xl">{view.terminalLabel}</p>
              <p className="mt-2 text-sm">{view.terminalDecision}</p>
              {(state.scenario === 'pass' || state.scenario === 'retry') && <p className="mt-3 font-mono text-xs">Merge-policy enforcement: disabled</p>}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={buttonClass} disabled={view.disabled.previous} onClick={() => act({ type: 'previous' })}>Previous stage</button>
        <button type="button" className={buttonClass} disabled={view.disabled.next} onClick={() => act({ type: 'next' })}>Next stage</button>
        <button type="button" className={buttonClass} onClick={() => act({ type: 'toggle-details' })}>{state.detailsOpen ? 'Hide stage details' : 'Show stage details'}</button>
        <button type="button" className={buttonClass} onClick={() => act({ type: 'reset' })}>Reset</button>
      </div>

      {state.detailsOpen && (
        <section className="mt-6 border-y border-[var(--color-hairline)] py-5" aria-label={`${view.visibleStage.label} internal steps`}>
          <h3 className="type-display text-xl">Stage details</h3>
          <ol className="mt-4 grid gap-4">
            {view.visibleStage.steps.map((step, index) => (
              <li key={`${step.label}-${index}`} className={styles.row}>
                <div><p className="anno">{step.label}</p><p className="mt-2 text-sm">{step.role}</p></div>
                <div><p>{step.decision}</p><p className="mt-2 font-mono text-sm">{step.artifact}</p></div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {view.attemptHistory.length > 0 && (
        <section className="mt-7" aria-labelledby="attempt-history-title">
          <h3 id="attempt-history-title" className="type-display text-xl">Retained QA attempt history</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {view.attemptHistory.map(attempt => (
              <li key={attempt.attempt} className="border border-[var(--color-hairline)] p-4">
                <p className="anno">Attempt {attempt.attempt} · {attempt.outcome}</p>
                <p className="mt-3">{attempt.assertion}</p>
                <p className="mt-2 text-sm">Change: {attempt.change}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <details className="mt-7 border-t border-[var(--color-hairline)] pt-3">
        <summary className="cursor-pointer py-2">Sample configuration and limits</summary>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><dt className="anno">Merge enforcement</dt><dd>{setting(view.scenario.configuration.mergeEnforcement)}</dd></div>
          <div><dt className="anno">Queue enforcement</dt><dd>{setting(view.scenario.configuration.queueEnforcement)}</dd></div>
          <div><dt className="anno">Sandboxing</dt><dd>{setting(view.scenario.configuration.sandboxing)}</dd></div>
          <div><dt className="anno">Anomaly termination</dt><dd>{setting(view.scenario.configuration.anomalyTermination)}</dd></div>
          <div><dt className="anno">Hard caps</dt><dd>{setting(view.scenario.configuration.hardCaps)}</dd></div>
        </dl>
        <p className="mt-4 text-sm">The security sample stops on a review decision before PR. It does not show an enabled merge gate. No sample claims universal human approval or active sandboxing.</p>
      </details>
    </section>
  );
}
