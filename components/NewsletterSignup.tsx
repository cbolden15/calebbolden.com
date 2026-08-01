'use client';

import type { FormEvent } from 'react';
import { useId, useState } from 'react';

type NewsletterSignupProps = {
  list: 'owners' | 'operators';
  label?: string;
};

type SignupState = 'idle' | 'busy' | 'done' | 'error';

export default function NewsletterSignup({ list, label = 'Subscribe' }: NewsletterSignupProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SignupState>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('busy');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, list }),
      });
      setState(response.ok ? 'done' : 'error');
    } catch (error) {
      console.error('[newsletter-signup]', error);
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-ink-muted)' }}>
        Check your inbox to confirm your subscription.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start"
      aria-busy={state === 'busy'}
    >
      <div className="min-w-0 flex-1">
        <label htmlFor={emailId} className="sr-only">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full min-w-0 rounded-[2px] px-3 py-2"
          style={{
            border: '1px solid var(--color-hairline)',
            fontSize: 14.5,
            color: 'var(--color-ink)',
            background: 'var(--color-bg)',
          }}
        />
        {state === 'error' && (
          <p role="alert" className="mt-2" style={{ fontSize: 13.5, color: 'var(--color-neg)' }}>
            That didn&apos;t work. Check the address and try again.
          </p>
        )}
      </div>
      <button type="submit" className="btn-ink btn-roll shrink-0" disabled={state === 'busy'}>
        <span className="roll-box">
          <span className="roll-a">{label}</span>
          <span className="roll-b" aria-hidden="true">
            {label}
          </span>
        </span>
      </button>
    </form>
  );
}
