'use client';

import Reveal from './Reveal';

// Closing move: a clean white panel on the graph field with a dotted leader
// pointing at the chat sidebar (the live demo). Email form hands off to the
// assistant, same as the hero CTA.

function submit(e: React.FormEvent) {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  const emailInput = form.elements.namedItem('cta-email');
  const email = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : '';
  window.dispatchEvent(new CustomEvent('open-chat', { detail: { email } }));
}

export default function CTA() {
  return (
    <section className="graph-field relative py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <div
            className="relative mx-auto max-w-2xl rounded-[2px] p-8 sm:p-12"
            style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
          >
            <h2 className="type-display mb-3" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              What could AI handle for you?
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--color-ink-muted)', maxWidth: 460, marginBottom: 24 }}>
              Tell the assistant about your business and get a plain-language
              breakdown of what&apos;s possible. It&apos;s a system I built, working
              right there in the corner.
            </p>

            <form onSubmit={submit} className="flex flex-wrap items-center gap-3">
              <label htmlFor="cta-email" className="sr-only">
                Your email
              </label>
              <input
                id="cta-email"
                type="email"
                required
                placeholder="you@yourbusiness.com"
                className="min-w-[220px] flex-1 rounded-[6px] outline-none"
                style={{
                  border: '1px solid var(--color-hairline)',
                  padding: '12px 16px',
                  fontSize: 14.5,
                  color: 'var(--color-ink)',
                  background: 'var(--color-bg)',
                }}
              />
              <button type="submit" className="btn-ink">
                Analyze my business
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
