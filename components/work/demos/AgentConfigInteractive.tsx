'use client';

import { useReducer } from 'react';
import {
  configReducer,
  configView,
  initialConfig,
  type AgentConfigFixtureDTO,
  type ConfigVariant,
} from '@/lib/work/demos/agent-config';
import styles from '../Showcase.module.css';

const buttonClass = 'btn-hairline min-h-11 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50';

function HighlightedOutput({ content, highlight }: { content: string; highlight: string }) {
  const index = content.indexOf(highlight);
  const before = content.slice(0, index);
  const after = content.slice(index + highlight.length);
  return <pre className="font-mono text-sm"><code>{before}<mark className="bg-amber-200 px-1 text-[var(--color-ink)]">{highlight}</mark>{after}</code></pre>;
}

function OutputPanel({ name, output }: {
  name: string;
  output: { variant: ConfigVariant; content: string; highlight: string; status: 'Current' | 'Out of date' };
}) {
  return (
    <section className="min-w-0 bg-[var(--color-ink)] p-5 text-[var(--color-surface)]" aria-label={`${name} illustrative output`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="font-mono text-xs uppercase tracking-widest">{name}</p><p className="mt-1 text-xs">{output.variant === 'brief' ? 'Brief' : 'Detailed'} output</p></div>
        <p className="font-mono text-xs uppercase tracking-widest">{output.status}</p>
      </div>
      <div className={`${styles.codePanel} mt-5`}><HighlightedOutput content={output.content} highlight={output.highlight} /></div>
    </section>
  );
}

export default function AgentConfigInteractive({ fixture }: { fixture: AgentConfigFixtureDTO }) {
  const [state, dispatch] = useReducer(configReducer, initialConfig);
  const view = configView(state, fixture);

  return (
    <section role="region" aria-label="Agent Config compiler example controls" className="mt-7 border-t border-[var(--color-hairline)] pt-6">
      <fieldset>
        <legend className="anno anno-blue">Choose shared fragment</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {fixture.scenarios.map(scenario => (
            <button
              type="button"
              key={scenario.id}
              aria-pressed={state.variant === scenario.id}
              className={state.variant === scenario.id ? 'btn-ink min-h-11' : buttonClass}
              onClick={() => dispatch({ type: 'variant', value: scenario.id })}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={buttonClass} disabled={state.stale} onClick={() => dispatch({ type: 'stale' })}>Show stale output</button>
        <button type="button" className={buttonClass} disabled={!state.stale} onClick={() => dispatch({ type: 'regenerate' })}>Regenerate example</button>
        <button type="button" className={buttonClass} onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>

      <p role="status" aria-live="polite" aria-atomic="true" className="mt-5 text-sm">
        {state.variant === 'brief' ? 'Brief' : 'Detailed'} selected. Claude Code {view.claudeCode.status}. Codex {view.codex.status}.
      </p>

      <div className={`${styles.decisions} mt-7`}>
        <section className="min-w-0 border border-[var(--color-hairline)] p-5" aria-label="Selected shared fragment">
          <p className="anno anno-blue">Shared fragment · {state.variant === 'brief' ? 'Brief' : 'Detailed'}</p>
          <h3 className="type-display mt-3 text-xl">{view.fragment.heading}</h3>
          <p className="mt-4">{view.fragment.content}</p>
        </section>
        <OutputPanel name="Claude Code" output={view.claudeCode} />
        <OutputPanel name="Codex" output={view.codex} />
      </div>
    </section>
  );
}
