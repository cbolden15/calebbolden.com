import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Results | Caleb Bolden',
  description:
    'Case studies in four parts: the problem, the map, the build, and the numbers. The first entry is my own operation, labeled as exactly that.',
};

// Value stream of case 001's own week, drawn only from the prose in "the problem" below.
const vsmLanes = [
  { label: 'the phone', from: 'Call arrives', wait: 'waits until night', to: 'I return it' },
  { label: 'paperwork', from: 'PDF lands in email', wait: 'waits until Sunday', to: 'I type it in' },
  { label: 'build queue', from: 'Dev work', wait: 'waits behind both', to: 'I ship it' },
];

const numberRows = [
  {
    label: 'the phone',
    value: 'Measuring now: calls the voice agent answered last month, and how many of those became booked jobs.',
  },
  {
    label: 'documents',
    value: 'Measuring now: documents processed on arrival per week, and the share that still needed me to review them.',
  },
  {
    label: 'build queue',
    value: 'Measuring now: hours per week the overnight loops give back, measured against doing the same work by hand.',
  },
];

export default function ResultsPage() {
  return (
    <>
      <Header />
      <main className="chat-offset min-h-screen">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Results
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                What an engagement looks like from the inside: the problem, the map, what got built, and the numbers afterward. The first entry here is my own operation, labeled as exactly that.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">the format</p>
                <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    A page like this is usually logos and testimonials. I would rather show you the anatomy of an engagement. Four parts, same four every time: what was broken, what the map turned up, what got built, and what the numbers did afterward.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Today there is one entry and it is mine. I run my own companies on these systems, so that is the honest place to start, and it is marked as my own operation rather than dressed up as a client. Client studies go here as they land, with names attached and numbers I did not choose. One engagement is in progress now, and its write-up publishes when it wraps and the client has approved it.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <p className="anno anno-blue">case 001 · my own back office</p>
                <span
                  className="anno rounded-[2px] px-2 py-1"
                  style={{ background: 'var(--color-blue-wash)', color: 'var(--color-blue-deep)' }}
                >
                  my own operation, not a client
                </span>
              </div>
              <h2 className="type-display max-w-[22ch]" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                The phone, the paperwork, and the build queue
              </h2>
            </Reveal>

            <div className="mt-10" style={{ borderTop: '1px solid var(--color-hairline)' }}>
              <Reveal>
                <div
                  className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6"
                  style={{ borderBottom: '1px solid var(--color-hairline)' }}
                >
                  <p className="anno anno-blue sm:col-span-2">the problem</p>
                  <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      Three businesses, one person. Calls arrived while I was deep in code, and the ones I missed waited in a voicemail box I got to at night. Paperwork showed up as PDFs in email and went into the system by hand, usually on a Sunday. Development work queued behind whichever of those two was loudest that day.
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      None of it was hard. All of it was mine, and there was only one of me.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={70}>
                <div
                  className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6"
                  style={{ borderBottom: '1px solid var(--color-hairline)' }}
                >
                  <p className="anno anno-blue sm:col-span-2">the map</p>
                  <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      I mapped my own week the way I map a client's. Every recurring task, who touched it, and how long each one sat between hands.
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      The waiting was the cost, not the working. Returning a missed call is quick once I know about it. Noticing it was the slow part. The paperwork had the same shape: the typing was never the expensive bit, the pile waiting to be typed was. That reordered the list. The thing I automated first was not the thing that annoyed me most.
                    </p>
                    <div>
                      <p className="anno mb-4">my week, before any of it was automated</p>
                      <div className="overflow-x-auto pb-1">
                        <svg
                          role="img"
                          aria-label="A value stream map of my own week in three lanes. A call arrives and waits until night before I return it. A PDF lands in email and waits until Sunday before I type it in. Development work waits behind both before I ship it."
                          viewBox="0 0 580 236"
                          className="h-auto w-full"
                          style={{ minWidth: 520 }}
                        >
                          {vsmLanes.map((lane, i) => {
                            const top = 20 + i * 78;
                            const mid = top + 23;
                            return (
                              <g key={lane.label}>
                                <text className="anno" x={0} y={mid + 4} fill="var(--color-ink-faint)">
                                  {lane.label}
                                </text>
                                <rect
                                  x={92}
                                  y={top}
                                  width={160}
                                  height={46}
                                  rx="2"
                                  fill="var(--color-bg)"
                                  stroke="var(--color-blue)"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x={172}
                                  y={mid + 5}
                                  textAnchor="middle"
                                  fill="var(--color-ink)"
                                  style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}
                                >
                                  {lane.from}
                                </text>
                                <line
                                  x1={252}
                                  y1={mid}
                                  x2={405}
                                  y2={mid}
                                  stroke="var(--color-blue)"
                                  strokeWidth="1.5"
                                  strokeDasharray="2 4"
                                />
                                <path
                                  d={`M ${405} ${mid - 4} L ${412} ${mid} L ${405} ${mid + 4}`}
                                  fill="none"
                                  stroke="var(--color-blue)"
                                  strokeWidth="1.5"
                                />
                                <text className="anno" x={330} y={mid - 10} textAnchor="middle" fill="var(--color-blue)">
                                  {lane.wait}
                                </text>
                                <rect
                                  x={412}
                                  y={top}
                                  width={160}
                                  height={46}
                                  rx="2"
                                  fill="var(--color-bg)"
                                  stroke="var(--color-blue)"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x={492}
                                  y={mid + 5}
                                  textAnchor="middle"
                                  fill="var(--color-ink)"
                                  style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}
                                >
                                  {lane.to}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div
                  className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6"
                  style={{ borderBottom: '1px solid var(--color-hairline)' }}
                >
                  <p className="anno anno-blue sm:col-span-2">the build</p>
                  <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      Three builds, in the order the map put them.
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      The phone came first. A voice and messaging layer sits in front of the business. When a call is missed, an agent texts back within seconds, answers the usual questions, books the appointment, and routes an emergency straight to me. That layer is the same one that ships in Vora now.
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      Documents came second. They get processed on arrival: an agent reads each one, pulls the fields, and files it against the right record. I review the exceptions, not the whole stack.
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      The build queue came last. Agent loops run overnight on work I scope that afternoon, and I read the diffs in the morning and either merge them or send them back. The loops do not decide what gets built. That part stayed with me on purpose, and it is the same line I draw for clients.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={210}>
                <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6">
                  <p className="anno anno-blue sm:col-span-2">the numbers</p>
                  <div className="space-y-6 sm:col-span-8 sm:col-start-4">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      This is the part most consulting pages round up. I am instrumenting each of these out of the live system before I publish a figure, so the placeholders below stay visible until the real measurement exists.
                    </p>
                    <div
                      style={{ borderTop: '1px solid var(--color-hairline)', borderLeft: '1px solid var(--color-hairline)' }}
                    >
                      {numberRows.map((row) => (
                        <div
                          key={row.label}
                          className="p-4"
                          style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}
                        >
                          <div className="anno mb-1">{row.label}</div>
                          <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>{row.value}</div>
                        </div>
                      ))}
                    </div>
                    <p>
                      <span className="sticky-note anno px-3 py-2">measure before publishing</span>
                    </p>
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                      I ask clients for numbers they can defend. Putting an unsourced one on my own page would make that a harder ask.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">founding clients</p>
                <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                  <h2 className="type-display" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)' }}>
                    The first three
                  </h2>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    The audit starts at $750. Fixed scope: two to three weeks inside your business, a map of your two or three core workflows, a data-readiness check, a scored shortlist of what AI can actually pay for, and a 90-day plan. You keep all of it whether or not I build anything.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    The first three clients get that audit for $500 and first call on build slots.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Here is the trade, plainly. You get the discount and the front of the queue. I get to publish what happened on this page with your name on it and real figures: what it cost, what it returned, how long it took. If a number comes back weak, it goes up weak. You read the write-up before it publishes and anything you want out comes out, so we agree on what gets measured before I start rather than after.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Three slots. After those, the audit is $750 and the studies on this page already have names on them.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div
                className="max-w-2xl rounded-[2px] p-8 sm:p-10"
                style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}
              >
                <h2 className="type-display mb-5" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                  Take one of the three
                </h2>
                <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                  Tell me what your week looks like and where it jams. If the audit is the wrong first step for you, I will say so on the call and you will not have spent anything to find out.
                </p>
                <div className="mt-7">
                  <Link href="/contact" className="btn-ink btn-roll">
                    <span className="roll-box">
                      <span className="roll-a">Let's talk</span>
                      <span className="roll-b" aria-hidden="true">
                        Let's talk
                      </span>
                    </span>
                  </Link>
                </div>
                <p className="mt-5" style={{ fontSize: 14, color: 'var(--color-ink-muted)' }}>
                  Not ready to talk?{' '}
                  <Link href="/tools/ai-readiness" className="link-draw" style={{ color: 'var(--color-blue)' }}>
                    Take the free AI readiness assessment
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
