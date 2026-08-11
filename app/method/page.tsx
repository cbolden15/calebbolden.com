import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Assured AI: the method | Caleb Bolden',
  description:
    'My method for putting AI into a business without breaking it. Map the work, gate the risky parts, and keep checking the output after it ships.',
};

// The six phases, expanded from the homepage sequence. Same names, same order,
// more detail per phase. Durations match the engagement model.

const phases = [
  {
    title: 'Discover',
    time: '1 wk',
    what: 'Short interviews with you and the people who actually do the work. Where does the time really go, and which parts does everyone quietly hate?',
    get: 'A written picture of how the work moves today, in your words.',
  },
  {
    title: 'Map',
    time: '1 wk',
    what: 'One working session. Your core process goes up on the wall: every step, handoff, wait, and workaround. We also mark what data each step needs and whether you actually have it.',
    get: 'Your process, mapped and annotated. Most owners have never seen their business on one page before.',
  },
  {
    title: 'Prioritize',
    time: '3-4 days',
    what: 'Every automation idea gets scored on payoff, feasibility, data, and risk. Some steps get eliminated instead of automated, because automating a bad step just makes the bad thing happen faster.',
    get: 'A scored shortlist and a 90-day roadmap with one recommended pilot.',
  },
  {
    title: 'Pilot',
    time: '4-8 wks',
    what: 'I build the winner with one success metric and guardrails attached. Anything risky, like sending money, contacting customers, or deleting records, waits for your approval before it runs. When the AI hits something it does not recognize, it stops and brings in a person.',
    get: 'A working system measured against how the work went before it existed. We agree up front what scale, fix, or stop looks like.',
  },
  {
    title: 'Scale',
    time: '1-2 wks',
    what: 'Your team gets trained on the system, the runbook gets written, and ownership transfers to you.',
    get: 'A system your business runs without me.',
  },
  {
    title: 'Assure',
    time: 'monthly',
    what: 'The part most AI consultants skip. Every month I pull a sample of what the AI actually produced, score it against the standard we set in the pilot, and send you a one-page report. AI output drifts over time as your business and the models change. Checking is the only honest answer to that.',
    get: 'A monthly report with real numbers, and drift caught before your customers feel it.',
  },
];

const guarantees = [
  {
    label: 'gated',
    title: 'Nothing risky runs without your approval',
    desc: 'The systems I build are designed so they cannot take a dangerous action on their own. In my own products, billing fires only after success, so an agent has no path to charging a customer for work that failed. Your build gets the same kind of gates.',
  },
  {
    label: 'supervised',
    title: 'The AI knows when to stop',
    desc: 'When a system hits something it does not recognize, it stops and hands the situation to a person instead of guessing. Factories have worked this way for a century. Your AI should too.',
  },
  {
    label: 'checked',
    title: 'The output gets checked, with numbers',
    desc: 'I do not ask you to trust the AI. I sample its output every month and score it against a standard we agreed on. You see the score. If it slips, you know before your customers do.',
  },
];

const refusals = [
  'I will not automate a step that should not exist. Elimination comes before automation, every time.',
  'I will not quote you the scary industry statistics. Most of them have no source. Your numbers come from your own baseline, measured before anything gets built.',
  'I will not do big-bang launches. Every system runs in the background first, then on a small slice, then fully. Promotion is earned at each step.',
  'I will not sell you AI where a simple rule does the job cheaper.',
];

export default function MethodPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-4">the method</p>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Assured AI
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                My method for putting AI into a business without breaking it. Map the
                work, gate the risky parts, and keep checking the output after it
                ships. The discipline comes from lean process improvement. I have been
                applying it for twelve years, and it turns out AI is exactly the kind
                of unreliable process it was built to manage.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">why a method</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Most AI projects fail, and it is almost never because the AI was
                    not smart enough. They fail because someone automated a process
                    nobody understood, skipped measuring how the work went before, and
                    had no way to check the output after. AI does not fix a messy
                    process. It runs the mess faster.
                  </p>
                  <p className="mt-4" style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    So my method spends its energy on the process, not the model. The
                    short version: map it, gate it, check it.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h2 className="type-display mb-10" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                The six phases
              </h2>
            </Reveal>
            <ol className="list-none space-y-0">
              {phases.map((phase, i) => (
                <Reveal key={phase.title} delay={i * 80}>
                  <li
                    className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:gap-6"
                    style={{ borderTop: '1px solid var(--color-hairline)' }}
                  >
                    <div className="flex items-baseline gap-4 sm:col-span-3">
                      <span
                        aria-hidden="true"
                        className="text-[var(--color-blue)]"
                        style={{ fontFamily: 'var(--font-anno)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 500, lineHeight: 1 }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 650, color: 'var(--color-ink)' }}>
                          {phase.title}
                        </h3>
                        <span className="anno">{phase.time}</span>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-ink-muted)' }}>{phase.what}</p>
                    </div>
                    <div className="sm:col-span-3">
                      <p className="anno mb-1">you get</p>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>{phase.get}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={200}>
              <p className="mt-6" style={{ fontSize: 14, color: 'var(--color-ink-faint)' }}>
                Phases 1 to 3 are the audit. Phase 4 is the build sprint. Phase 5
                closes either one. Phase 6 is the assurance retainer, and it&apos;s
                optional: the system is yours either way.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h2 className="type-display mb-4" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                What &ldquo;assured&rdquo; means
              </h2>
              <p className="mb-10 max-w-lg" style={{ fontSize: 15, color: 'var(--color-ink-muted)' }}>
                Three promises, built into every system I ship. They are not policies.
                They are how the software is constructed.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {guarantees.map((g, i) => (
                <Reveal key={g.label} delay={100 + i * 100}>
                  <div
                    className="h-full rounded-[2px] p-6"
                    style={{ border: '1px solid var(--color-hairline)' }}
                  >
                    <p className="anno anno-blue mb-3">{g.label}</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 650, color: 'var(--color-ink)', marginBottom: 8 }}>
                      {g.title}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>{g.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">what I won&apos;t do</p>
                <ul className="list-none space-y-4 sm:col-span-8 sm:col-start-4">
                  {refusals.map((r) => (
                    <li key={r} className="flex items-start gap-3">
                      <svg
                        className="mt-1.5 shrink-0"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="var(--color-blue)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M2 2l8 8M10 2l-8 8" />
                      </svg>
                      <span style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">where this comes from</p>
                <div className="space-y-4 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    This is not a framework I read about. My own AI platform, Vora,
                    runs at 65 small businesses today, with these gates and checks
                    built in, because I needed them before I named them. And the
                    mapping discipline comes from a decade in enterprise financial
                    services and infrastructure, where I used the same approach to
                    cut delivery times by 29% before AI was part of the toolkit.
                  </p>
                  <Link
                    href="/how-i-build"
                    className="link-draw mt-2 inline-block"
                    style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
                  >
                    See how I build
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div
                className="max-w-2xl rounded-[2px] p-8 sm:p-10"
                style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
              >
                <h2 className="type-display mb-5" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                  Phase 1 starts with the audit
                </h2>
                <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                  Audits start at $750, fixed scope. Two to three weeks inside your
                  business, and you end up with the map, the scored shortlist, and one
                  recommended pilot, whether or not I build anything.
                </p>
                <div className="mt-7">
                  <Link href="/contact" className="btn-ink btn-roll">
                    <span className="roll-box">
                      <span className="roll-a">Let&apos;s talk</span>
                      <span className="roll-b" aria-hidden="true">Let&apos;s talk</span>
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
