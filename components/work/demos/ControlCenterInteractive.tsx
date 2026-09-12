'use client';

import { useReducer } from 'react';
import {
  centerReducer,
  centerView,
  initialCenter,
  type CenterFixtureDTO,
  type CenterSelection,
} from '@/lib/work/demos/control-center';

const quietButton = 'min-h-11 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50';
const activeButton = 'min-h-11 rounded-md border border-sky-400 bg-sky-400 px-4 py-2 text-sm font-medium text-slate-950';
const recordButton = 'min-h-11 w-full rounded-md border border-slate-700 bg-slate-900 p-4 text-left text-slate-100 hover:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400';

type CenterView = ReturnType<typeof centerView>;

function EmptyGroup() {
  return <p className="rounded-md border border-dashed border-slate-700 p-4 text-sm text-slate-400">No items need attention in this example.</p>;
}

function DetailPanel({ selected }: { selected: CenterView['selected'] }) {
  if (!selected) {
    return <p className="rounded-md border border-dashed border-slate-700 p-5 text-sm text-slate-400">Select a visible run, decision, or deployment to inspect its sample record.</p>;
  }
  if (selected.kind === 'run') {
    return (
      <section className="rounded-md border border-slate-700 bg-slate-900 p-5" aria-label={`${selected.name} run detail`}>
        <p className="font-mono text-xs uppercase tracking-widest text-sky-300">Run detail · {selected.status}</p>
        <h4 className="mt-3 text-lg font-semibold">{selected.name}</h4>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-400">Source type</dt><dd className="mt-1">{selected.sourceType}</dd></div>
          <div><dt className="text-slate-400">Frozen age</dt><dd className="mt-1">{selected.age}</dd></div>
          <div><dt className="text-slate-400">Fictional host</dt><dd className="mt-1 font-mono">{selected.host}</dd></div>
          <div><dt className="text-slate-400">Attention</dt><dd className="mt-1">{selected.stale || selected.status === 'Failed' ? 'Needs attention' : 'No attention needed'}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-slate-300">{selected.summary}</p>
      </section>
    );
  }
  if (selected.kind === 'decision') {
    return (
      <section className="rounded-md border border-slate-700 bg-slate-900 p-5" aria-label={`${selected.name} decision detail`}>
        <p className="font-mono text-xs uppercase tracking-widest text-sky-300">Decision detail · read-only</p>
        <h4 className="mt-3 text-lg font-semibold">{selected.name}</h4>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-400">Source type</dt><dd className="mt-1">{selected.sourceType}</dd></div>
          <div><dt className="text-slate-400">Frozen age</dt><dd className="mt-1">{selected.age}</dd></div>
          <div><dt className="text-slate-400">Status</dt><dd className="mt-1">{selected.resolved ? 'Resolved' : 'Unresolved · needs attention'}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-slate-300">{selected.explanation}</p>
      </section>
    );
  }
  return (
    <section className="rounded-md border border-slate-700 bg-slate-900 p-5" aria-label={`${selected.target} deployment detail`}>
      <p className="font-mono text-xs uppercase tracking-widest text-sky-300">Deployment detail · read-only sample</p>
      <h4 className="mt-3 text-lg font-semibold">{selected.target}</h4>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-400">Fictional SHA</dt><dd className="mt-1 font-mono">{selected.sha}</dd></div>
        <div><dt className="text-slate-400">Frozen age</dt><dd className="mt-1">{selected.age}</dd></div>
        <div><dt className="text-slate-400">Recorded result</dt><dd className="mt-1">{selected.result}</dd></div>
      </dl>
      <p className="mt-4 text-sm text-slate-300">{selected.explanation}</p>
      <p className="mt-3 text-xs text-amber-200">This sample record is not evidence that Control Center itself is deployed.</p>
    </section>
  );
}

export default function ControlCenterInteractive({ fixture }: { fixture: CenterFixtureDTO }) {
  const [state, dispatch] = useReducer(
    (current: typeof initialCenter, event: Parameters<typeof centerReducer>[1]) => centerReducer(current, event, fixture),
    initialCenter,
  );
  const view = centerView(state, fixture);
  const select = (value: CenterSelection) => dispatch({ type: 'select', value });

  return (
    <section role="region" aria-label="Control Center sample dashboard controls" className="mt-7 border-t border-slate-700 pt-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-widest text-sky-300">Sample run scenario</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {fixture.scenarios.map(scenario => (
              <button key={scenario.id} type="button" aria-pressed={state.scenario === scenario.id}
                className={state.scenario === scenario.id ? activeButton : quietButton}
                onClick={() => dispatch({ type: 'scenario', value: scenario.id })}>{scenario.label}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-widest text-sky-300">Visible records</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" aria-pressed={state.filter === 'all'} className={state.filter === 'all' ? activeButton : quietButton}
              onClick={() => dispatch({ type: 'filter', value: 'all' })}>Show all</button>
            <button type="button" aria-pressed={state.filter === 'attention'} className={state.filter === 'attention' ? activeButton : quietButton}
              onClick={() => dispatch({ type: 'filter', value: 'attention' })}>Needs attention</button>
          </div>
        </fieldset>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={quietButton} disabled={state.phase === 'finished'} onClick={() => dispatch({ type: 'show-result' })}>Show sample run result</button>
        <button type="button" className={quietButton} onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 text-sm text-slate-300">
        {view.scenario.label}, {state.phase === 'started' ? 'Started' : 'sample result shown'}, {state.filter === 'all' ? 'Show all' : 'Needs attention'}: {view.counts.runs} {view.counts.runs === 1 ? 'run' : 'runs'} and {view.counts.decisions} {view.counts.decisions === 1 ? 'decision' : 'decisions'} visible.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Sample dashboard totals">
        <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">Runs</p><p className="mt-2 text-2xl font-semibold">{view.counts.runs}</p></div>
        <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">Decisions</p><p className="mt-2 text-2xl font-semibold">{view.counts.decisions}</p></div>
        <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">{view.spend.label}</p><p className="mt-2 text-2xl font-semibold">{view.spend.amount}</p><p className="mt-1 text-xs text-slate-400">{view.spend.period}</p></div>
        <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">Deployments</p><p className="mt-2 text-2xl font-semibold">{view.deployments.length}</p></div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="sample-runs-heading">
          <h3 id="sample-runs-heading" className="text-lg font-semibold">Runs <span className="font-mono text-sm text-slate-400">{view.counts.runs}</span></h3>
          <div className="mt-3 space-y-3">
            {view.runs.length ? view.runs.map(run => (
              <button key={run.id} type="button" className={recordButton} aria-pressed={state.selected?.kind === 'run' && state.selected.id === run.id}
                onClick={() => select({ kind: 'run', id: run.id })}>
                <span className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{run.name}</span><span className="font-mono text-xs text-sky-300">{run.status}{run.stale ? ' · Stale' : ''}</span></span>
                <span className="mt-2 block text-xs text-slate-400">{run.sourceType} · {run.age} old</span>
              </button>
            )) : <EmptyGroup />}
          </div>
        </section>
        <section aria-labelledby="sample-decisions-heading">
          <h3 id="sample-decisions-heading" className="text-lg font-semibold">Decisions <span className="font-mono text-sm text-slate-400">{view.counts.decisions}</span></h3>
          <div className="mt-3 space-y-3">
            {view.decisions.length ? view.decisions.map(decision => (
              <button key={decision.id} type="button" className={recordButton} aria-pressed={state.selected?.kind === 'decision' && state.selected.id === decision.id}
                onClick={() => select({ kind: 'decision', id: decision.id })}>
                <span className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{decision.name}</span><span className="font-mono text-xs text-sky-300">{decision.resolved ? 'Resolved' : 'Unresolved'}</span></span>
                <span className="mt-2 block text-xs text-slate-400">{decision.sourceType} · {decision.age} old</span>
              </button>
            )) : <EmptyGroup />}
          </div>
        </section>
      </div>

      <section aria-labelledby="sample-deployments-heading" className="mt-7">
        <h3 id="sample-deployments-heading" className="text-lg font-semibold">Deployment records <span className="font-mono text-sm text-slate-400">{view.deployments.length}</span></h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {view.deployments.map(deployment => (
            <button key={deployment.id} type="button" className={recordButton} aria-pressed={state.selected?.kind === 'deployment' && state.selected.id === deployment.id}
              onClick={() => select({ kind: 'deployment', id: deployment.id })}>
              <span className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{deployment.target}</span><span className="font-mono text-xs text-sky-300">{deployment.result}</span></span>
              <span className="mt-2 block text-xs text-slate-400">SHA {deployment.sha} · {deployment.age} old</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-7"><DetailPanel selected={view.selected} /></div>
      <p className="mt-5 text-xs leading-relaxed text-slate-400">
        Ages are frozen at September 1, 2026, 12:00 UTC. A run is stale after {view.staleAfterMinutes} minutes without an update. Needs attention is portfolio-demo behavior unless separately verified in the source product.
      </p>
    </section>
  );
}
