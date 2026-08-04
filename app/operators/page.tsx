import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'The Workflow Brief: a weekly newsletter on workflow automation and AI readiness | Caleb Bolden',
  description:
    'One real workflow dissected per issue, templates included, for ops leaders deciding what to automate next. Free, weekly, unsubscribe anytime.',
};

const sections = [
  {
    heading: 'The manual-work tax',
    body: "Somewhere in your business, someone is copying numbers from one spreadsheet into another because the tools don't talk to each other. None of it shows up on a line in the P&L. It shows up as hours nobody has left over for anything else.",
  },
  {
    heading: "What's in the weekly issue",
    body: 'Each issue takes apart one real workflow: how it runs today, where the manual step actually sits, and what replacing it looks like. About half the issues ship with the template, so you can build it yourself before we ever talk.',
  },
  {
    heading: 'The even-month clinic',
    body: 'On even months I run a free 45-minute clinic and automate one real workflow live, start to finish. No slides, no pitch until the last five minutes.',
  },
] as const;

export default function OperatorsPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-5">free · weekly · unsubscribe anytime</p>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Stop paying the manual-work tax
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                The Workflow Brief is a weekly newsletter for ops leaders at growing SMBs deciding
                what to hand off to something that doesn&apos;t get tired of doing it.
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
                Get The Workflow Brief
              </h2>
              <p className="mt-3 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>
                One email a week. No funnel, no charge. Free, weekly, unsubscribe anytime.
              </p>
              <div className="mt-6">
                <NewsletterSignup list="operators" label="Get The Workflow Brief" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
