'use client';

import type { FormEvent } from 'react';
import { useId, useState } from 'react';

type ResourceGateProps = {
  file: string;
  magnet: string;
  label?: string;
};

type GateState = 'idle' | 'form' | 'downloaded';

export default function ResourceGate({ file, magnet, label = 'Get the PDF' }: ResourceGateProps) {
  const emailId = useId();
  const [gateState, setGateState] = useState<GateState>('idle');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function downloadFile() {
    const anchor = document.createElement('a');
    anchor.href = file;
    anchor.download = file.split('/').pop() ?? '';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magnet, email }),
      });

      if (!response.ok) {
        console.error('[resource-gate]', response.status);
      }
    } catch (error) {
      console.error('[resource-gate]', error);
    } finally {
      downloadFile();
      setGateState('downloaded');
      setIsSubmitting(false);
    }
  }

  if (gateState === 'downloaded') {
    return (
      <div className="max-w-sm">
        <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-ink-muted)' }}>
          Downloading. It is also fine to print it and scribble on it; that is the point.
        </p>
        <a
          href={file}
          download
          className="link-draw mt-2 inline-block"
          style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
        >
          Download again
        </a>
      </div>
    );
  }

  if (gateState === 'form') {
    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:items-center sm:justify-end" aria-busy={isSubmitting}>
        <label htmlFor={emailId} className="sr-only">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          required
          placeholder="you@business.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-[2px] px-3 py-2"
          style={{
            border: '1px solid var(--color-hairline)',
            fontSize: 14.5,
            color: 'var(--color-ink)',
            background: 'var(--color-bg)',
          }}
        />
        <button type="submit" className="btn-ink btn-roll shrink-0" disabled={isSubmitting}>
          <span className="roll-box">
            <span className="roll-a">Email me + download</span>
            <span className="roll-b" aria-hidden="true">
              Email me + download
            </span>
          </span>
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      className="btn-hairline btn-roll"
      style={{ borderColor: 'var(--color-blue)', color: 'var(--color-blue)' }}
      onClick={() => setGateState('form')}
    >
      <span className="roll-box">
        <span className="roll-a">{label}</span>
        <span className="roll-b" aria-hidden="true">
          {label}
        </span>
      </span>
    </button>
  );
}
