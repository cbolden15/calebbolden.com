import Reveal from './Reveal';

// Audience index: a plain annotated line, not a pill wall. Deliberately not a
// vertical list (that's Vora's positioning) — two buckets that together cover
// every small business.

export default function Industries() {
  return (
    <section id="industries" className="py-14">
      <div
        className="mx-auto flex w-[90%] max-w-[1200px] flex-col gap-4 py-8 sm:flex-row sm:items-baseline sm:gap-10"
        style={{ borderTop: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}
      >
        <Reveal>
          <span className="anno shrink-0">built for</span>
        </Reveal>
        <Reveal delay={80}>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: 'var(--color-ink-muted)' }}>
            Small businesses of every kind. Service businesses that run on calls, crews, and
            schedules. Office and professional firms that run on clients, documents, and billing.
            <span style={{ color: 'var(--color-ink-faint)' }}>
              {' '}Any business where the owner does work a system should.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
