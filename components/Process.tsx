import Link from 'next/link';
import Reveal from './Reveal';

// The method, drawn in the same process-box vocabulary as the hero map.
// This is the one genuinely ordered sequence on the page, so it carries the
// numbers. Durations are the real spans from the engagement model.

const steps = [
  {
    title: 'Discover',
    time: '1 wk',
    desc: 'Short interviews with you and the people who actually do the work. Where does the time really go?',
  },
  {
    title: 'Map',
    time: '1 wk',
    desc: 'One working session. Your core process goes up on the wall: every step, handoff, and workaround.',
  },
  {
    title: 'Prioritize',
    time: '3-4 days',
    desc: 'Every automation idea gets scored on payoff, feasibility, data, and risk. Only the honest ones survive.',
  },
  {
    title: 'Pilot',
    time: '4-8 wks',
    desc: 'I build the winner with one success metric and guardrails attached: anything risky waits for your approval before it runs. We agree up front what scale, fix, or stop looks like.',
  },
  {
    title: 'Scale',
    time: '1-2 wks',
    desc: 'Your team gets trained, the runbook gets written, and the system becomes yours to keep.',
  },
  {
    title: 'Assure',
    time: 'monthly',
    desc: 'I keep checking the work. Every month I sample what the AI produced, score it against the standard we set, and send a one-page report. Drift gets caught before you feel it.',
  },
];

const connectorDelay = (i: number) => i * 220;
const phaseDelay = (i: number) => (i === 0 ? 120 : connectorDelay(i - 1) + 760);

export default function Process() {
  return (
    <section id="method" className="graph-field graph-fade py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display ink-fill mb-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
            <span className="ink-base">Map the work first. Then automate it.</span>
            <span className="ink-top" aria-hidden="true">Map the work first. Then automate it.</span>
          </h2>
          <p className="mb-14 max-w-xl" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            Most AI projects fail because they automate a process nobody understood.
            Mine start with lean process mapping, so the AI lands where it pays. I call
            the method <Link href="/method" className="link-draw" style={{ color: 'var(--color-blue)', fontWeight: 500 }}>Assured AI</Link>:
            map the work, gate the risky parts, and keep checking the output after it ships.
          </p>
        </Reveal>

        {/* The flow: boxes joined by connectors, exactly like the map on the wall */}
        <Reveal>
          <ol className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex lg:block">
                {/* Connector to the next box (desktop) */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-[-2px] top-[38px] hidden h-3 w-6 lg:block"
                  >
                    <svg viewBox="0 0 24 8" className="h-full w-full overflow-visible">
                      <line
                        className="draw-on-reveal"
                        style={{
                          ['--draw-len' as string]: '18',
                          ['--draw-delay' as string]: `${connectorDelay(i)}ms`,
                        }}
                        x1="0"
                        y1="4"
                        x2="18"
                        y2="4"
                        stroke="var(--color-blue)"
                        strokeWidth="1.5"
                      />
                      <line
                        className="ants opacity-0 transition-opacity duration-[250ms] [transition-delay:var(--flow-delay)] [.reveal.in_&]:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none"
                        style={{
                          ['--ants-delay' as string]: `${connectorDelay(i) + 760}ms`,
                          ['--flow-delay' as string]: `${connectorDelay(i) + 760}ms`,
                        }}
                        x1="0"
                        y1="4"
                        x2="18"
                        y2="4"
                        stroke="var(--color-blue)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <polygon
                        className="stamp-on-reveal"
                        style={{ ['--stamp-delay' as string]: `${connectorDelay(i) + 520}ms` }}
                        points="18,0 24,4 18,8"
                        fill="var(--color-blue)"
                      />
                    </svg>
                  </span>
                )}
                <div className="w-full lg:pr-6">
                  <div
                    className="h-full rounded-[2px] border-[1.5px] border-[var(--color-hairline)] bg-[var(--color-bg)] p-5 transition-colors duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:var(--phase-delay)] [.reveal.in_&]:border-[var(--color-blue)] motion-reduce:border-[var(--color-blue)] motion-reduce:transition-none"
                    style={{ ['--phase-delay' as string]: `${phaseDelay(i)}ms` }}
                  >
                    <span
                      aria-hidden="true"
                      className="stamp-on-reveal mb-4 block text-[var(--color-blue)] supports-[(-webkit-text-stroke:1px_var(--color-blue))]:text-transparent supports-[(-webkit-text-stroke:1px_var(--color-blue))]:[-webkit-text-stroke:1.5px_var(--color-blue)]"
                      style={{
                        ['--stamp-delay' as string]: `${phaseDelay(i)}ms`,
                        fontFamily: 'var(--font-anno)',
                        fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="mb-3 flex items-baseline justify-between gap-2">
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 650, color: 'var(--color-ink)' }}>
                        {step.title}
                      </h3>
                      <span
                        className="anno shrink-0 transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:var(--phase-delay)] [.reveal.in_&]:text-[var(--color-blue)] motion-reduce:text-[var(--color-blue)] motion-reduce:transition-none"
                        style={{ ['--phase-delay' as string]: `${phaseDelay(i)}ms` }}
                      >
                        {step.time}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={450}>
          <p className="mt-8" style={{ fontSize: 14, color: 'var(--color-ink-faint)' }}>
            Phases 1 to 3 are the audit. Phase 4 is the build sprint. Phase 5 closes
            either one. Phase 6 is the retainer, and it&apos;s optional: the system is
            yours either way.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
