import Reveal from './Reveal';

// Industry index: a plain annotated line, not a pill wall. The list reads like
// a drawing's reference key.

const industries = [
  'Home services',
  'Salon & spa',
  'Fitness',
  'Healthcare',
  'Pet services',
  'Property management',
  'Professional services',
];

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
            {industries.join(', ')}
            <span style={{ color: 'var(--color-ink-faint)' }}>
              {', '}and any business where the owner does work a system should.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
