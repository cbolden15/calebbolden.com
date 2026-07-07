'use client';

import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

type InputKey = 'm' | 'v' | 'w' | 'q' | 'v2' | 'n' | 'v3' | 'r' | 's';

type InputValues = Record<InputKey, string>;

const initialValues: InputValues = {
  m: '',
  v: '',
  w: '',
  q: '',
  v2: '',
  n: '',
  v3: '',
  r: '',
  s: '',
};

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

function parseValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function LeakBlock({
  number,
  title,
  evidence,
  children,
  result,
  note,
}: {
  number: string;
  title: string;
  evidence: string;
  children: ReactNode;
  result?: string;
  note?: string;
}) {
  return (
    <section
      className="grid grid-cols-1 gap-5 py-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start"
      style={{ borderTop: '1px solid var(--color-hairline)' }}
    >
      <div>
        <p className="anno anno-blue mb-3">leak {number}</p>
        <h2 className="type-display" style={{ fontSize: 'clamp(1.45rem, 2.2vw, 1.9rem)' }}>
          {title}
        </h2>
        <p className="mt-3 max-w-2xl" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
          {evidence}
        </p>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
        {result ? (
          <div className="mt-5">
            <p
              style={{
                fontFamily: 'var(--font-anno)',
                fontStretch: '87.5%',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: 0,
                color: 'var(--color-blue)',
              }}
            >
              {result}
            </p>
            {note ? (
              <p className="mt-2" style={{ fontSize: 13.5, color: 'var(--color-ink-faint)' }}>
                {note}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function NumberInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-ink)' }}>
        {label}
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[2px] border bg-white px-4 py-3 text-[14.5px] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-blue)]"
        style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-ink)' }}
      />
    </label>
  );
}

export default function RevenueLeakCalculator() {
  const [values, setValues] = useState<InputValues>(initialValues);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  function updateValue(key: InputKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const numbers = useMemo(() => {
    return {
      m: parseValue(values.m),
      v: parseValue(values.v),
      w: parseValue(values.w),
      q: parseValue(values.q),
      v2: parseValue(values.v2),
      n: parseValue(values.n),
      v3: parseValue(values.v3),
      r: parseValue(values.r),
      s: parseValue(values.s),
    };
  }, [values]);

  const missedCallLeak = numbers.m * 0.5 * 4.3 * numbers.v * (numbers.w / 100);
  const slowQuoteLeak = numbers.q * numbers.v2 * 0.25;
  const noShowLeak = numbers.n * numbers.v3 * 0.25;
  const softwareLeak = numbers.s;
  const total = missedCallLeak + slowQuoteLeak + noShowLeak + softwareLeak;
  const reviewStatus =
    values.r.trim() === '' ? null : numbers.r < 80 ? 'This leak is OPEN. Fixing it costs about 30 minutes a week.' : 'This leak is closed. Keep the streak.';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magnet: 'revenue-leak',
          email,
          payload: {
            inputs: values,
            results: {
              missedCallLeak,
              slowQuoteLeak,
              noShowLeak,
              reviewStatus,
              softwareLeak,
              total,
            },
          },
        }),
      });

      if (!response.ok) {
        console.error('Lead magnet capture failed:', response.status);
      }
    } catch (err) {
      console.error('Lead magnet capture failed:', err);
    } finally {
      setIsSending(false);
      setSent(true);
    }
  }

  return (
    <div>
      <div>
        <LeakBlock
          number="1"
          title="The calls nobody answers"
          evidence="An observational study of 85 small businesses found only 38% of inbound calls get answered live; most voicemail callers hang up and call the next business (PCN Missed Call Revenue Study, 2026)."
          result={`Missed-call leak: ${formatCurrency(missedCallLeak)} per month`}
          note="assumes half of missed calls were new business"
        >
          <NumberInput id="missed-calls" label="Calls missed per week" value={values.m} onChange={(value) => updateValue('m', value)} />
          <NumberInput id="job-value" label="Average job or sale value, $" value={values.v} onChange={(value) => updateValue('v', value)} />
          <NumberInput id="win-rate" label="Share of quoted jobs you win, %" value={values.w} onChange={(value) => updateValue('w', value)} />
        </LeakBlock>

        <LeakBlock
          number="2"
          title="The slow quote"
          evidence="Lead-response research has one consistent shape: reply in minutes and you reach almost everyone; reply tomorrow and much of the interest is gone. In the trades, the first detailed quote wins well over half of jobs, largely regardless of price."
          result={`Slow-quote leak: ${formatCurrency(slowQuoteLeak)} per month`}
          note="counts a quarter of the silence as speed, a conservative share"
        >
          <NumberInput id="quiet-quotes" label="Quotes that go quiet per month" value={values.q} onChange={(value) => updateValue('q', value)} />
          <NumberInput id="quiet-quote-value" label="Average value of those quotes, $" value={values.v2} onChange={(value) => updateValue('v2', value)} />
        </LeakBlock>

        <LeakBlock
          number="3"
          title="The no-shows"
          evidence="A five-year study covering 1.6 million appointments found automated reminders cut no-shows by 23%. A peer-reviewed study found SMS reminders brought no-shows down to 1.9%, the lowest of any channel tested."
          result={`No-show leak: ${formatCurrency(noShowLeak)} per month`}
          note="the share reminders would recover"
        >
          <NumberInput id="no-shows" label="No-shows per month" value={values.n} onChange={(value) => updateValue('n', value)} />
          <NumberInput id="kept-appointment-value" label="Average value of a kept appointment, $" value={values.v3} onChange={(value) => updateValue('v3', value)} />
        </LeakBlock>

        <LeakBlock
          number="4"
          title="The reviews you never answer"
          evidence="98% of consumers say the quality of a business's response to reviews influences whether they use that business (BrightLocal, 2024). Review signals are also one of the largest local ranking factors (Whitespark, 2026)."
          result={reviewStatus || undefined}
        >
          <NumberInput id="review-response-share" label="Share of your Google reviews you responded to, %" value={values.r} onChange={(value) => updateValue('r', value)} />
        </LeakBlock>

        <LeakBlock
          number="5"
          title="The software you pay for and don't use"
          evidence="Zylo's 2025 SaaS Management Index found 21% of paid software licenses go completely unused and another 45% underutilized. For a 15-person company that is commonly thousands of dollars a year."
          result={`Software leak: ${formatCurrency(softwareLeak)} per month, straight off the bottom line`}
        >
          <NumberInput id="unused-software" label="Monthly total of subscriptions nobody logged into for 60 days, $" value={values.s} onChange={(value) => updateValue('s', value)} />
        </LeakBlock>
      </div>

      <div className="mt-8 rounded-[2px] p-6 sm:p-8" style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}>
        <p className="anno anno-blue">sheet total</p>
        <p className="type-display mt-3" style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}>
          Monthly leak total: {formatCurrency(total)}
        </p>
        <p className="mt-4 max-w-2xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
          Two things are usually true about this number. It is bigger than you expected, and every line above is cheaper to fix than to keep.
        </p>

        {sent ? (
          <div className="mt-7">
            <p className="max-w-2xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink)' }}>
              Sent. Check your inbox in the next day or two; I write these myself. In the meantime, the one-hour process audit is the natural next step.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/resources" className="link-draw" style={{ fontSize: 14.5, color: 'var(--color-blue)' }}>
                Get the process audit
              </Link>
              <Link href="/contact" className="btn-ink btn-roll">
                <span className="roll-box">
                  <span className="roll-a">Or just talk to me</span>
                  <span className="roll-b" aria-hidden="true">
                    Or just talk to me
                  </span>
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7">
            <p className="mb-4 max-w-2xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
              Enter your email and I will reply with the two fixes I would start with for your numbers, specific tools and realistic prices, free.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="sr-only" htmlFor="revenue-email">
                Email
              </label>
              <input
                id="revenue-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@business.com"
                className="min-w-0 rounded-[2px] border bg-white px-4 py-3 text-[14.5px] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-blue)]"
                style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-ink)' }}
              />
              <button type="submit" className="btn-ink btn-roll disabled:cursor-wait disabled:opacity-55" disabled={isSending}>
                <span className="roll-box">
                  <span className="roll-a">Send me the fix list</span>
                  <span className="roll-b" aria-hidden="true">
                    Send me the fix list
                  </span>
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
