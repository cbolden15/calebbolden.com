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
    desc: 'I build the winner with one success metric attached. We agree up front what scale, fix, or stop looks like.',
  },
  {
    title: 'Scale',
    time: '1-2 wks',
    desc: 'Your team gets trained, the runbook gets written, and the system becomes yours to keep.',
  },
];

export default function Process() {
  return (
    <section id="method" className="graph-field graph-fade py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display mb-4" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Map the work first. Then automate it.
          </h2>
          <p className="mb-14 max-w-xl" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            Most AI projects fail because they automate a process nobody understood.
            Mine start with lean process mapping, so the AI lands where it pays.
          </p>
        </Reveal>

        {/* The flow: boxes joined by connectors, exactly like the map on the wall */}
        <ol className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex lg:block">
              {/* Connector to the next box (desktop) */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-2px] top-[38px] hidden h-px w-6 lg:block"
                  style={{ background: 'var(--color-blue)' }}
                />
              )}
              <Reveal delay={i * 90} className="lg:pr-6">
                <div
                  className="h-full rounded-[2px] p-5"
                  style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
                >
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 650, color: 'var(--color-ink)' }}>
                      {i + 1}. {step.title}
                    </h3>
                    <span className="anno anno-blue shrink-0">{step.time}</span>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>{step.desc}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={450}>
          <p className="mt-8" style={{ fontSize: 14, color: 'var(--color-ink-faint)' }}>
            Phases 1 to 3 are the audit. Phase 4 is the build sprint. Phase 5 closes either one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
