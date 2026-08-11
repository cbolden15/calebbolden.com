import Link from 'next/link';
import Reveal from './Reveal';
import TapedPrint, { PrintStrip } from './TapedPrint';
import auditMap from '@/public/images/audit-map-template.webp';
import auditScoring from '@/public/images/audit-scoring-template.webp';
import auditRoadmap from '@/public/images/audit-roadmap-template.webp';

// Offer ladder: audit featured with the sticky note (the one amber mark in
// this section), follow-ons as hairline panels. Audit price is published;
// sprint and retainer are quoted off the map.

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
    desc: 'The top item on your roadmap, built and wired into your real systems. An automation, a website that converts, search visibility, or follow-up marketing. One success metric, your team trained on it.',
    meta: '4-8 wks',
  },
  {
    name: 'Assurance retainer',
    desc: 'I stay on to check the work. Every month I sample what the AI produced, score it against the standard we set in the pilot, and send you a one-page report. Drift gets caught before you feel it, and you still get tuning and one new automation a month. Capacity is capped at a few clients at a time.',
    meta: 'monthly',
  },
];

const cardHoverClass =
  'group corner-hover hover:-translate-y-[3px] transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_8px_24px_oklch(0.48_0.1_210_/_0.10)] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

function DimensionReadout({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-5 top-5 flex -translate-y-1 items-center gap-1.5 opacity-0 transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
    >
      <svg width="14" height="6" viewBox="0 0 14 6" fill="none" aria-hidden="true">
        <path d="M1 3H13M1 2.5V3.5M13 2.5V3.5" stroke="var(--color-blue)" strokeWidth="1" />
      </svg>
      <span className="anno anno-blue">{label}</span>
    </div>
  );
}

export default function Packages() {
  return (
    <section id="packages" className="py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display mb-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
            Three ways to work with me
          </h2>
          <p className="mb-12 max-w-lg" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            Fixed scope, plain deliverables, and nothing gets built before the audit
            says it&apos;s worth building. Every engagement is a fixed fee, quoted before
            we start. No hourly billing, no surprise scope. If the scope changes once
            we&apos;re underway, that gets re-quoted and agreed before work continues.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured: the audit */}
          <Reveal className="lg:col-span-7">
            <div
              className={`${cardHoverClass} relative flex h-full flex-col rounded-[2px] p-7 sm:p-9`}
              style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
            >
              <DimensionReadout label={audit.meta} />
              <span className="sticky-note sticky-settle absolute -top-4 right-6 px-3 py-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
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

              <p className="mt-6" style={{ fontSize: 13.5, color: 'var(--color-ink-faint)' }}>
                Audits start at $750, fixed scope. You have the number before the call,
                and build pricing comes from what the map finds.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="anno anno-blue">{audit.meta}</span>
                <Link href="/contact" className="btn-ink btn-roll">
                  <span className="roll-box">
                    <span className="roll-a">Let&apos;s talk</span>
                    <span className="roll-b" aria-hidden="true">Let&apos;s talk</span>
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Follow-ons */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {followOns.map((pkg, i) => (
              <Reveal key={pkg.name} delay={100 + i * 100} className="flex-1">
                <div
                  className={`${cardHoverClass} relative flex h-full flex-col rounded-[2px] p-7`}
                  style={{ border: '1px solid var(--color-hairline)' }}
                >
                  <DimensionReadout label={pkg.meta} />
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

        <Reveal delay={150}>
          <div className="mt-14">
            <p className="anno anno-blue mb-5">what the audit produces</p>
            <PrintStrip>
              <TapedPrint
                className="min-w-[240px] snap-start sm:min-w-0"
                src={auditMap}
                alt="The blank value stream mapping sheet used in the audit workshop: lanes for each process step with wait-time and handoff fields"
                caption="the map"
                sizes="(max-width: 640px) 240px, 30vw"
              />
              <TapedPrint
                className="min-w-[240px] snap-start sm:min-w-0"
                src={auditScoring}
                alt="The blank opportunity scoring matrix: impact, feasibility, data readiness, and risk columns for each automation candidate"
                caption="the scored shortlist"
                sizes="(max-width: 640px) 240px, 30vw"
              />
              <TapedPrint
                className="min-w-[240px] snap-start sm:min-w-0"
                src={auditRoadmap}
                alt="The blank 90-day roadmap page: sequenced builds with an owner, a success metric, and a stop-or-scale checkpoint"
                caption="the 90-day roadmap"
                sizes="(max-width: 640px) 240px, 30vw"
              />
            </PrintStrip>
            <p className="mt-4" style={{ fontSize: 13.5, color: 'var(--color-ink-faint)' }}>
              The three templates your audit fills in. You keep all of them, whether or not I build anything.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-8" style={{ fontSize: 14, color: 'var(--color-ink-faint)' }}>
            The sprint and the retainer build on what the audit finds. That order is the point.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
