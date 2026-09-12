import Header from './Header';
import Footer from './Footer';
import Reveal from './Reveal';
import styles from './work/Showcase.module.css';
import CaseStudySections from './work/CaseStudySections';
import type { CaseStudyShell } from '@/lib/work/public-content';

// Shared template for /work/* detail pages. No hardcoded project data here;
// tasks 2-4 pass props for Vora, ChapterHQ, and the site assistant. Mirrors
// the section-band pattern from app/about/page.tsx and the status-marker /
// bordered-cell conventions from Proof.tsx and Footer.tsx.

interface TechBand {
  label: string;
  value: string;
}

interface LegacyWorkDetailProps {
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

interface RichWorkDetailProps {
  project: CaseStudyShell;
  demonstration: React.ReactNode;
  reloadHref: string;
}

type WorkDetailProps = LegacyWorkDetailProps | RichWorkDetailProps;

export default function WorkDetail(props: WorkDetailProps) {
  if ('project' in props) {
    return (
      <>
        <Header />
        <main className="chat-offset" data-showcase>
          <div className={styles.surface} data-showcase-surface>
            <CaseStudySections project={props.project} demonstration={props.demonstration} reloadHref={props.reloadHref} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const {
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
  } = props;

  return (
    <>
      <Header />
      <main className="chat-offset" data-showcase>
        <noscript><style>{'[data-showcase] .reveal, [data-showcase] .reveal > * { opacity: 1 !important; transform: none !important; animation: none !important; }'}</style></noscript>
        <div className={styles.surface} data-showcase-surface>
          <section className="graph-field graph-fade py-16 lg:py-24">
            <div className={styles.content}>
              <Reveal>
                <h1 className="type-display max-w-[16ch]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}>
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
            <div className={styles.content}>
              <Reveal>
                <div className={styles.row}>
                  <p className="anno anno-blue">what it is</p>
                  <div className="min-w-0">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>{whatItIs}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
            <div className={styles.content}>
              <Reveal>
                <div className={styles.row}>
                  <p className="anno anno-blue">who uses it</p>
                  <div className="min-w-0">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>{whoUsesIt}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
            <div className={styles.content}>
              <Reveal>
                <div className={styles.row}>
                  <p className="anno anno-blue">the ai inside</p>
                  <div className="min-w-0 space-y-6">
                    <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>{aiInside}</p>
                    <div
                      className={styles.bands}
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
            <div className={styles.content}>
              <Reveal>
                <div className={styles.row}>
                  <p className="anno anno-blue">the stack</p>
                  <div className="min-w-0">
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
              <div className={styles.content}>
                <Reveal>
                  <div className={styles.row}>
                    <p className="anno anno-blue">what it looks like</p>
                    <div className="min-w-0">{media}</div>
                  </div>
                </Reveal>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
