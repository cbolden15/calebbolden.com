import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'How I build | Caleb Bolden',
  description: 'I run my own companies on the systems I recommend. The advice comes from a workflow I use every day, not a slide.',
};

const stackRows = [
  { label: 'primary env', value: 'Claude Code as the main development environment' },
  { label: 'parallelism', value: 'agent teams working in parallel on separate tasks' },
  { label: 'model routing', value: 'the right model for each task, not one model for everything' },
  { label: 'autonomous loops', value: 'jobs that keep shipping while I sleep, reviewed in the morning' },
];

export default function HowIBuildPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                How I build
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                I run my own companies on the systems I recommend. The advice comes from a workflow I use every day, not a slide.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">the operation</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    I do not recommend AI I have not run myself. My own dev work, my own back office, and the products above all run on the same kind of agents I build for clients. When something breaks, I have usually already hit that failure and fixed it.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">my stack in practice</p>
                <div className="space-y-6 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    None of this is exotic. It is a small set of habits, applied consistently, that add up to a lot more shipped work per week.
                  </p>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4"
                    style={{ borderTop: '1px solid var(--color-hairline)', borderLeft: '1px solid var(--color-hairline)' }}
                  >
                    {stackRows.map((row) => (
                      <div
                        key={row.label}
                        className="min-h-[72px] p-3"
                        style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}
                      >
                        <div className="anno">{row.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">what this means for clients</p>
                <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Two things. Speed: I ship in days what used to take weeks. And judgment: because I run these systems on my own revenue, I know where they break, so I can tell you where AI will not pay before you spend on it.
                  </p>
                  <Link
                    href="/work"
                    className="link-draw mt-5 inline-block"
                    style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
                  >
                    See the systems
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
                  Start with the audit
                </h2>
                <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                  The audit is where every engagement starts. Two to three weeks inside your business, and you end up with a map, a scored shortlist, and one recommended pilot, whether or not you hire me to build it.
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
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
