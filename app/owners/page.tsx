import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'The Missed Call: a weekly newsletter for service business owners | Caleb Bolden',
  description:
    'Field notes on missed-call math, audit findings, and install stories for owners of service businesses. Free, weekly, unsubscribe anytime.',
};

const sections = [
  {
    heading: 'The after-hours call problem',
    body: "A customer calls at 6:40 on a Tuesday because their water heater just went out. Nobody picks up, so they call the next name on the list, and that name wins the job. That's not a phone problem. It's a business you already built losing work it already earned.",
  },
  {
    heading: "What's in the weekly issue",
    body: 'Each issue is one thing pulled from real work, not theory: the missed-call math for a shop that finally ran the numbers, what an audit turned up when we counted answered calls against booked jobs, a story from an install that went sideways and what fixed it. No forecasts, no trend pieces. Just what happened and what to do differently next week.',
  },
  {
    heading: 'The monthly clinic',
    body: "Every other month I run a free 45-minute clinic. One real problem, worked through live from start to finish, no slides. There's no pitch until the last five minutes, and you're welcome to leave before that part starts.",
  },
] as const;

export default function OwnersPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-5">free · weekly · unsubscribe anytime</p>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Stop losing jobs you already earned
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                The Missed Call is a weekly newsletter for owners of service businesses: HVAC,
                plumbing, electrical, and anyone else who loses jobs to a phone that didn&apos;t
                get answered.
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
              <h2 className="type-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
                Get The Missed Call
              </h2>
              <p className="mt-3 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>
                One email a week. No funnel, no charge. Free, weekly, unsubscribe anytime.
              </p>
              <div className="mt-6">
                <NewsletterSignup list="owners" label="Get The Missed Call" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
