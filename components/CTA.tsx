'use client';

import { useState } from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

// Closing move: the page's one drenched moment. The mat board flips to deep
// ink (the same material as the assistant panel) with white drafting lines,
// so the working wall reads at night. Email form hands off to the assistant.

function submit(e: React.FormEvent) {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  const emailInput = form.elements.namedItem('cta-email');
  const email = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : '';
  window.dispatchEvent(new CustomEvent('open-chat', { detail: { email } }));
}

// White-line graph field for the dark band only.
const darkGraph = {
  backgroundColor: 'var(--color-ink)',
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M0 .5H32M.5 0V32' fill='none' stroke='white' stroke-opacity='.05' stroke-width='1'/%3E%3C/svg%3E\")",
  backgroundSize: '32px 32px',
};

// The media frame: the method loop filmed (Higgsfield), with the drafted SVG
// as the reduced-motion state and the fallback if the video fails to load.
function MethodFigure() {
  const [videoFailed, setVideoFailed] = useState(false);
  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-[2px] p-8"
        style={{ border: '1px solid oklch(1 0 0 / 0.22)' }}
      >
        {!videoFailed && (
          <video
            className="absolute inset-0 hidden h-full w-full object-cover motion-safe:lg:block"
            src="/video/method-loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-label="Hands drawing a process flow map with a marker, then placing an amber sticky note"
            onError={() => setVideoFailed(true)}
          />
        )}
        <svg viewBox="0 0 360 180" className="h-auto w-full" aria-hidden="true">
          {/* Three steps drawn in white on the night wall */}
          {[20, 140, 260].map((x, i) => (
            <rect
              key={x}
              className="stamp-on-reveal"
              style={{ ['--stamp-delay' as string]: `${200 + i * 160}ms` }}
              x={x}
              y={64}
              width={80}
              height={44}
              rx="2"
              fill="none"
              stroke="oklch(1 0 0 / 0.85)"
              strokeWidth="1.5"
            />
          ))}
          {[100, 220].map((x, i) => (
            <line
              key={x}
              className="draw-on-reveal"
              style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${420 + i * 160}ms` }}
              x1={x}
              y1={86}
              x2={x + 40}
              y2={86}
              stroke="oklch(1 0 0 / 0.6)"
              strokeWidth="1.5"
            />
          ))}
          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '760ms', ['--ants-delay' as string]: '1.6s' }}
            d="M 240 64 C 240 24, 160 24, 160 60"
            fill="none"
            stroke="oklch(0.88 0.115 85 / 0.9)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text
            className="stamp-on-reveal anno"
            style={{ ['--stamp-delay' as string]: '900ms', fill: 'oklch(1 0 0 / 0.55)' }}
            x={200}
            y={148}
            textAnchor="middle"
          >
            map, score, automate
          </text>
        </svg>

        {/* Crop marks */}
        {[
          'left-2 top-2 border-l border-t',
          'right-2 top-2 border-r border-t',
          'bottom-2 left-2 border-b border-l',
          'bottom-2 right-2 border-b border-r',
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute h-3 w-3 ${pos}`}
            style={{ borderColor: 'oklch(1 0 0 / 0.45)' }}
          />
        ))}
      </div>

      <span className="sticky-note sticky-settle absolute -right-3 -top-4 px-3 py-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
        start here
      </span>

      <p className="anno mt-3" style={{ color: 'oklch(1 0 0 / 0.5)' }}>
        the method: map it, score it, then automate what pays
      </p>
    </div>
  );
}

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32" style={darkGraph}>
      <div className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal variant="stagger">
            <h2
              className="type-display mb-5"
              style={{ '--i': 0, fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', color: 'oklch(0.985 0.002 230)' } as React.CSSProperties}
            >
              What could AI handle for you?
            </h2>
            <p
              style={{
                '--i': 1,
                fontSize: 16.5,
                lineHeight: 1.65,
                color: 'oklch(0.82 0.015 230)',
                maxWidth: 480,
                marginBottom: 28,
              } as React.CSSProperties}
            >
              Tell the assistant about your business and get a plain-language
              breakdown of what&apos;s possible. It&apos;s a system I built, working
              right there in the corner.
            </p>

            <form
              onSubmit={submit}
              className="flex flex-wrap items-center gap-3"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <label htmlFor="cta-email" className="sr-only">
                Your email
              </label>
              <input
                id="cta-email"
                type="email"
                required
                placeholder="you@yourbusiness.com"
                className="min-w-[220px] flex-1 rounded-[6px] border border-[oklch(1_0_0_/_0.25)] bg-[oklch(1_0_0_/_0.06)] px-4 py-3 text-[14.5px] text-[oklch(0.985_0.002_230)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[oklch(1_0_0_/_0.45)] focus:border-[oklch(0.72_0.08_210)] focus:shadow-[0_0_0_3px_oklch(0.72_0.08_210_/_0.25)]"
              />
              <button
                type="submit"
                className="btn-roll inline-flex items-center justify-center rounded-[6px] bg-[oklch(0.985_0.002_230)] px-[22px] py-3 text-[15px] font-semibold text-[var(--color-ink)] transition-transform duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="roll-box">
                  <span className="roll-a">Analyze my business</span>
                  <span className="roll-b" aria-hidden="true">
                    Analyze my business
                  </span>
                </span>
              </button>
            </form>

            <p
              className="mt-6"
              style={{ '--i': 3, fontSize: 14.5, color: 'oklch(0.82 0.015 230)' } as React.CSSProperties}
            >
              Rather talk to me directly?{' '}
              <Link href="/contact" className="link-draw" style={{ color: 'oklch(0.9 0.03 210)' }}>
                Let&apos;s talk
              </Link>
              {' '}· or{' '}
              <Link href="/tools/ai-readiness" className="link-draw" style={{ color: 'oklch(0.9 0.03 210)' }}>
                take the free AI readiness assessment
              </Link>
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5" delay={150}>
          <MethodFigure />
        </Reveal>
      </div>
    </section>
  );
}
