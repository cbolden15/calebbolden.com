import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

// Shared template for /work/* detail pages. No hardcoded project data here;
// tasks 2-4 pass props for Vora, ChapterHQ, and the site assistant. Mirrors
// the section-band pattern from app/about/page.tsx and the status-marker /
// bordered-cell conventions from Proof.tsx and Footer.tsx.

interface TechBand {
  label: string;
  value: string;
}

interface WorkDetailProps {
  name: string;
  status: 'live' | 'building' | 'running';
  whatItIs: string;
  whoUsesIt: string;
  aiInside: string;
  techBands: TechBand[];
  stackLine: string;
  href?: string | null;
  sheet: string;
  media?: React.ReactNode;
}

export default function WorkDetail({
  name,
  status,
  whatItIs,
  whoUsesIt,
  aiInside,
  techBands,
  stackLine,
  href,
  sheet,
  media,
}: WorkDetailProps) {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                {name}
              </h1>
              <div className="mt-5 flex items-baseline gap-5">
                <span className="inline-flex items-baseline gap-2">
                  {status === 'live' && <span className="pulse-dot" aria-hidden="true" />}
                  {status === 'running' && (
                    <span
                      className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                      style={{ background: 'var(--color-blue)' }}
                      aria-hidden="true"
                    />
                  )}
                  {status === 'building' && (
                    <span
                      className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                      style={{ border: '1.5px solid var(--color-blue)' }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="anno">{status}</span>
                </span>
                <span className="anno">{sheet}</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">what it is</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>{whatItIs}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">who uses it</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>{whoUsesIt}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">the ai inside</p>
                <div className="space-y-6 sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>{aiInside}</p>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4"
                    style={{ borderTop: '1px solid var(--color-hairline)', borderLeft: '1px solid var(--color-hairline)' }}
                  >
                    {techBands.map((band) => (
                      <div
                        key={band.label}
                        className="min-h-[72px] p-3"
                        style={{ borderRight: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}
                      >
                        <div className="anno">{band.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>{band.value}</div>
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
                <p className="anno anno-blue sm:col-span-2">the stack</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p className="anno">{stackLine}</p>
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw mt-5 inline-block transition-colors"
                      style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
                    >
                      Visit {name}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {media && (
          <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
            <div className="mx-auto w-[90%] max-w-[1200px]">
              <Reveal>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                  <p className="anno anno-blue sm:col-span-2">what it looks like</p>
                  <div className="sm:col-span-8 sm:col-start-4">{media}</div>
                </div>
              </Reveal>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
