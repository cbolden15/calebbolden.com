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
    heading: 'Who this is',
    body: [
      'This site is run by Caleb Bolden. Consulting and build work described here is provided through Vora Technologies LLC, a Texas limited liability company. This policy covers what calebbolden.com collects when you visit, use the free tools, chat with the assistant, or request a download.',
    ],
  },
  {
    heading: 'What this site collects',
    body: [
      'If you email me, fill out a lead-magnet form, or chat with the assistant, I receive what you choose to share: your name, email address, phone number if you give it, your website URL, and whatever you tell me about your business. The free tools (the AI readiness scorecard and the revenue leak calculator) run in your browser; your answers are not sent anywhere unless you request the results by email.',
      "Like most websites, the server keeps standard technical logs (IP address, pages requested, timestamps) for security and troubleshooting. This site does not currently run visitor analytics. A self-hosted, privacy-respecting analytics tool that does not build personal profiles is planned; if it goes live, this page will say so before it does.",
    ],
  },
  {
    heading: 'The AI chat assistant',
    body: [
      "The chat widget on this site is an AI system, not a person, even though it responds like one. It runs on a third-party AI model API (currently Google's Gemini) hosted outside this site. Whatever you type is sent to that provider to generate a response, along with the rest of the conversation. If you tell the assistant your name, email, phone number, or business details, that information is captured the same way a contact form would capture it, so I can follow up.",
      "Don't share anything in chat you wouldn't put in a web form: passwords, account numbers, medical or financial details, or anything else sensitive.",
    ],
  },
  {
    heading: 'How it gets used',
    body: [
      'To reply to you, send you what you asked for, and prepare for a conversation if you start one. Emails are delivered through Resend, an email service provider. Chat conversations pass through the AI model provider described above to generate responses.',
    ],
  },
  {
    heading: 'What this site does not do',
    body: [
      "I don't sell or rent your information. I don't share it with anyone except the service providers needed to run the site (email delivery, the AI model API). I don't run third-party advertising trackers, and nothing here follows you to other sites.",
    ],
  },
  {
    heading: 'Keeping and removing it',
    body: [
      "I keep correspondence and lead information as business records, generally for up to seven years, and sooner if it's no longer useful. If you want to know what I have on file or want it deleted, email me and I'll take care of it within a reasonable time, usually a few business days.",
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
                respond to you, and does not sell it. Effective August 22, 2026.
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
            <p className="mt-4 max-w-2xl" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-ink-faint)' }}>
              This page was prepared without attorney review and will be updated if counsel requires changes.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
