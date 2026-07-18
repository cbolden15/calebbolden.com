import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpenChatButton from '@/components/OpenChatButton';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Contact | Caleb Bolden',
  description: 'Describe your business to the assistant, email me directly, or book a call.',
};

export default function ContactPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_URL;

  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Tell me what's eating your week
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                Every engagement starts the same way: you describe how the work moves, I tell you whether a system can take it. Pick whichever route suits you.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal delay={0}>
              <div
                className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:items-center sm:gap-6"
                style={{ borderTop: '1px solid var(--color-hairline)' }}
              >
                <p className="anno anno-blue sm:col-span-2">route 1 / fastest</p>
                <div className="sm:col-span-6">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}>
                    Describe your business to the assistant
                  </h2>
                  <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                    It maps the conversation before we ever get on a call, and it is a live sample of my work.
                  </p>
                </div>
                <div className="flex sm:col-span-4 sm:justify-end">
                  <OpenChatButton label="Open the assistant" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <div
                className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:items-center sm:gap-6"
                style={{ borderTop: '1px solid var(--color-hairline)' }}
              >
                <p className="anno anno-blue sm:col-span-2">route 2 / direct</p>
                <div className="sm:col-span-6">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}>
                    Email me
                  </h2>
                  <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                    I read everything myself. Two sentences about your business is plenty.
                  </p>
                </div>
                <div className="flex sm:col-span-4 sm:justify-end">
                  <a href="mailto:caleb@calebbolden.com" className="btn-hairline btn-roll max-w-full">
                    <span className="roll-box">
                      <span className="roll-a">caleb@calebbolden.com</span>
                      <span className="roll-b" aria-hidden="true">
                        caleb@calebbolden.com
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>

            {bookingUrl && (
              <Reveal delay={140}>
                <div
                  className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:items-center sm:gap-6"
                  style={{ borderTop: '1px solid var(--color-hairline)' }}
                >
                  <p className="anno anno-blue sm:col-span-2">route 3 / calendar</p>
                  <div className="sm:col-span-6">
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}>
                      Book a call
                    </h2>
                    <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                      Twenty minutes, no deck, no pitch. We talk through your process and what I would map first.
                    </p>
                  </div>
                  <div className="flex sm:col-span-4 sm:justify-end">
                    <a href={bookingUrl} target="_blank" rel="noopener" className="btn-hairline btn-roll">
                      <span className="roll-box">
                        <span className="roll-a">Pick a time</span>
                        <span className="roll-b" aria-hidden="true">
                          Pick a time
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
