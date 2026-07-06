import Link from 'next/link';
import Reveal from './Reveal';

// Offer ladder: audit featured with the sticky note (the one amber mark in
// this section), follow-ons as hairline panels. No public pricing (quoted
// live, docs/consulting/launch-roadmap.md).

const audit = {
  name: 'Process & AI audit',
  desc: "Two to three weeks inside your business. I interview your team, map how the work really moves, and score where AI genuinely pays off (and where it doesn't).",
  deliverables: [
    'Your core process, mapped and annotated for automation',
    'A scored shortlist of AI opportunities, ranked by payoff and risk',
    'A 90-day roadmap and one recommended pilot',
  ],
  meta: '2-3 wks',
};

const followOns = [
  {
    name: 'Build sprint',
    desc: 'The top item on your roadmap, built and wired into your real systems. One automation, one success metric, your team trained on it.',
    meta: '4-8 wks',
  },
  {
    name: 'Fractional AI operator',
    desc: 'I stay on to run what we built: monitoring, tuning, and one new automation a month. Capacity is capped at a few clients at a time.',
    meta: 'monthly',
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display mb-4" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Three ways to work with me
          </h2>
          <p className="mb-12 max-w-lg" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            Fixed scope, plain deliverables, and nothing gets built before the audit
            says it&apos;s worth building.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured: the audit */}
          <Reveal className="lg:col-span-7">
            <div
              className="relative flex h-full flex-col rounded-[2px] p-7 sm:p-9"
              style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
            >
              <span className="sticky-note absolute -top-4 right-6 px-3 py-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                Start here
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 650, color: 'var(--color-ink)', marginBottom: 10 }}>
                {audit.name}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)', maxWidth: 480 }}>
                {audit.desc}
              </p>

              <ul className="mt-6 flex list-none flex-col gap-3">
                {audit.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="mt-1 shrink-0"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-blue)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-ink)' }}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <span className="anno anno-blue">{audit.meta}</span>
                <Link href="/contact" className="btn-ink">
                  Let&apos;s talk
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Follow-ons */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {followOns.map((pkg, i) => (
              <Reveal key={pkg.name} delay={100 + i * 100} className="flex-1">
                <div
                  className="flex h-full flex-col rounded-[2px] p-7"
                  style={{ border: '1px solid var(--color-hairline)' }}
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 650, color: 'var(--color-ink)', marginBottom: 8 }}>
                    {pkg.name}
                  </h3>
                  <p className="flex-1" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                    {pkg.desc}
                  </p>
                  <span className="anno mt-5">{pkg.meta}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <p className="mt-8" style={{ fontSize: 14, color: 'var(--color-ink-faint)' }}>
            The sprint and the retainer build on what the audit finds. That order is the point.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
