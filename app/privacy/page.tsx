import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Privacy | Caleb Bolden',
  description: 'What this site collects, why, and what happens to it.',
};

const sections = [
  {
    heading: 'What this site collects',
    body: [
      'If you email me, use the chat assistant, or request a download, I receive what you choose to share: your email address, your website URL if you provide one, and whatever you tell me about your business. The free tools (the AI readiness scorecard and the revenue leak calculator) run in your browser; your answers are not sent anywhere unless you request the results by email.',
      'Like most websites, the server keeps standard technical logs (IP address, pages requested, timestamps) for security and troubleshooting. This site does not use analytics or advertising cookies. If that changes, this page will say so.',
    ],
  },
  {
    heading: 'How it gets used',
    body: [
      'To reply to you, send you what you asked for, and prepare for a conversation if you start one. Emails are delivered through Resend, an email service provider. Chat conversations pass through an AI model provider to generate responses.',
      'I do not sell or rent your information, and I do not share it with anyone except the service providers needed to run the site.',
    ],
  },
  {
    heading: 'Keeping and removing it',
    body: [
      'I keep correspondence and lead information for as long as it is useful for working together. If you want your information deleted, email me and I will remove it.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'Questions about any of this: caleb@calebbolden.com. This site is operated by Caleb Bolden; services are provided by Vora Technologies LLC.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Privacy
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                The short version: this site collects only what you choose to share, uses it to
                respond to you, and does not sell it. Last updated July 2026.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            {sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 70}>
                <div
                  className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:gap-6"
                  style={{ borderTop: '1px solid var(--color-hairline)' }}
                >
                  <h2
                    className="sm:col-span-4"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}
                  >
                    {s.heading}
                  </h2>
                  <div className="flex flex-col gap-4 sm:col-span-8">
                    {s.body.map((p) => (
                      <p key={p} className="max-w-2xl" style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-ink-muted)' }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
