import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'For bookkeepers, CPAs, and MSPs | Caleb Bolden',
  description:
    'What happens to a client you send me: a fixed-scope audit starting at $750, what you can promise on my behalf, and what I will not do with your client.',
};

const sections = [
  {
    heading: 'The audit, in plain terms',
    body: 'A client you send me starts where every client starts: a two to three week audit. I sit inside the business, map the two or three workflows carrying the most work, check whether the data is in any shape to automate, and score what AI could actually pay for. They walk out with a map, a scored shortlist, and a 90-day plan, and they keep all of it whether or not they hire me to build anything.',
  },
  {
    heading: 'What you can promise',
    body: 'Audits start at $750, fixed scope, so you can quote that number without checking with me first. Two to three weeks, a fixed deliverable, nothing on retainer behind it. One more thing you can say out loud on my behalf: if the map says AI will not pay, I say that instead.',
  },
  {
    heading: 'What I will not do',
    body: 'I stay in the lane you sent me for. I do not pitch your client on bookkeeping, tax, or IT work they already buy from you, and when they ask me about something that belongs to you, I point them back to you. Nothing about them appears on this site without their written permission. If the audit turns up a problem that is yours to fix rather than mine, I say so to both of you.',
  },
] as const;

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-5">for bookkeepers · cpas · msps · business bankers</p>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                What happens to a client you send me
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                You see process pain before anyone else does. Books that arrive as a shoebox, a
                folder of PDFs nobody has filed, a phone that rings out on a Tuesday night. If you
                point one of those clients at me, your name goes with them. So here is exactly what
                happens next.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
              {sections.map((s, i) => (
                <Reveal key={s.heading} delay={i * 60}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStretch: '115%',
                      fontWeight: 650,
                      fontSize: 19,
                      color: 'var(--color-ink)',
                    }}
                  >
                    {s.heading}
                  </h2>
                  <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-ink-muted)' }}>
                    {s.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">before you send anyone</p>
                <div className="space-y-5 sm:col-span-8 sm:col-start-4">
                  <h2 className="type-display" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)' }}>
                    Start with a conversation
                  </h2>
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    The low-risk way to test this is a call with me, not a referral. Tell me the kind
                    of client you work with and where their week jams up. I will tell you plainly
                    whether an audit would help them, or whether you would be handing them a bill for
                    a map they do not need.
                  </p>
                  <p>
                    <span className="sticky-note anno px-3 py-2">start with a conversation</span>
                  </p>
                  <div className="pt-1">
                    <Link href="/contact" className="btn-ink btn-roll">
                      <span className="roll-box">
                        <span className="roll-a">Let&apos;s talk</span>
                        <span className="roll-b" aria-hidden="true">
                          Let&apos;s talk
                        </span>
                      </span>
                    </Link>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-ink-muted)' }}>
                    Want to see the shape of the work first?{' '}
                    <Link href="/results" className="link-draw" style={{ color: 'var(--color-blue)' }}>
                      Read how an engagement is structured
                    </Link>
                  </p>
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
