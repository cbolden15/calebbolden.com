import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Terms | Caleb Bolden',
  description: 'Terms of use for this site and its free tools.',
};

const sections = [
  {
    heading: 'What this site is',
    body: [
      'This site describes the consulting and build work I do, and offers free tools and downloads. Everything on it, including the chat assistant, is provided for general information only. Using the site, the tools, or the chat does not create a consulting engagement or any obligation on either side. Actual engagements are governed by a separate written agreement, a Master Service Agreement and Statement of Work, with Vora Technologies LLC, not by this page.',
    ],
  },
  {
    heading: 'The free tools',
    body: [
      'The AI readiness scorecard, the revenue leak calculator, and the chat assistant produce estimates and general suggestions based on what you enter. They are starting points for a conversation, not financial, legal, or professional advice, and no engagement is formed by using them. Decisions about your business remain yours.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      "Use this site the way it's meant to be used. Don't scrape it at scale, try to break or overload it, attempt to extract the chat assistant's underlying prompts or bypass its guardrails, or use the chat or contact forms to send spam, malware, or abusive content. I can block access for anyone who does.",
    ],
  },
  {
    heading: 'No warranty',
    body: [
      'The site and tools are provided as is. I work to keep the content accurate and the tools working, but I do not guarantee that everything is error free or that results from any estimate will match your outcome. To the extent the law allows, I am not liable for losses arising from use of this site or its tools.',
    ],
  },
  {
    heading: 'Content and links',
    body: [
      'The content and design of this site belong to Vora Technologies LLC. Cited statistics belong to their sources. Links to other sites are provided for convenience; I do not control what is on them.',
    ],
  },
  {
    heading: 'Changes and contact',
    body: [
      'These terms take effect when posted and may change as the site does; the date below is the current version. Questions: caleb@calebbolden.com. Effective August 22, 2026.',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Terms of use
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                The short version: the site and its tools are free to use, they give estimates
                rather than professional advice, and paid work runs on its own contract.
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
