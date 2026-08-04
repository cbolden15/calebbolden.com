import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'About | Caleb Bolden',
  description: "Builder first, consultant second. Payments and fintech background, lean process mapping, and live products: Vora, ChapterHQ, and this site's assistant.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Builder first, consultant second
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                I'm Caleb Bolden. I run Vora Technologies, and I help small businesses find the work a system should be doing, then I build that system.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">the background</p>
                <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    I came up through payments and fintech, working with US Bank, Elavon, and TSYS, then moved into product management in crypto infrastructure at Blockdaemon. Big companies are a masterclass in process: thousands of people moving work between them, and every improvement starts with someone mapping how the work moves today.
                  </p>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Along the way I picked up lean and six sigma the working way: value stream maps on real walls, timing real handoffs, sitting in the kaizen meetings where the map gets argued into the truth. That habit stuck harder than any job title.
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
                <p className="anno anno-blue sm:col-span-2">the products</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    Nights and weekends I built software, and the side projects became the main event. Vora is a CRM platform for service businesses. ChapterHQ runs clubs and nonprofits. The assistant in the corner of this site is one of those systems, live, not a demo reel. When I recommend something to a client, it is because I have already run it myself.
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
                <p className="anno anno-blue sm:col-span-2">the skills</p>
                <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    The inventory, tied to things I have actually shipped:
                  </p>
                  <div
                    className="grid grid-cols-2"
                    style={{ borderTop: '1px solid var(--color-hairline)', borderLeft: '1px solid var(--color-hairline)' }}
                  >
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div className="anno">ai / agents</div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>
                        agent systems, MCP servers, multi-model routing (Vora, this site's assistant)
                      </div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div className="anno">process</div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>
                        value stream mapping, lean and six sigma
                      </div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div className="anno">full stack</div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>
                        Next.js, SvelteKit, Postgres (this site, ChapterHQ)
                      </div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div className="anno">infra</div>
                    </div>
                    <div className="p-3" style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
                      <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>
                        Docker, self-hosted, Caddy, CI
                      </div>
                    </div>
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
                <p className="anno anno-blue sm:col-span-2">the method</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    AI made automation cheap. It did not make judgment cheap. Most AI projects fail because they automate a process nobody understood, so I refuse to skip the mapping step. Interviews first, a value stream on the wall, honest scoring, then one build with one success metric. If the map says AI will not pay, I say that instead.
                  </p>
                  <Link
                    href="/#method"
                    className="link-draw mt-5 inline-block"
                    style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
                  >
                    See the five phases
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
                <p className="mt-5" style={{ fontSize: 14, color: 'var(--color-ink-muted)' }}>
                  Not ready to talk?{' '}
                  <Link href="/tools/ai-readiness" className="link-draw" style={{ color: 'var(--color-blue)' }}>
                    Take the free AI readiness assessment
                  </Link>
                </p>
              </div>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-6">
              <a href="https://github.com/cbolden15" target="_blank" rel="noopener noreferrer" className="link-draw" style={{ fontSize: 14, color: 'var(--color-blue)' }}>GitHub</a>
              <a href="https://www.linkedin.com/in/calebbolden" target="_blank" rel="noopener noreferrer" className="link-draw" style={{ fontSize: 14, color: 'var(--color-blue)' }}>LinkedIn</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
