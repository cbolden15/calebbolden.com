import Link from 'next/link';
import Reveal from './Reveal';

// Spec-sheet proof: shipped products as divided rows with mono status labels.
// "live" is real semantic state (deployed products), not decoration. No
// invented metrics, no fake logos.

const products = [
  {
    name: 'Vora',
    desc: 'An AI-powered CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.',
    href: 'https://voratechnology.com',
    detail: '/work/vora',
    status: 'live',
  },
  {
    name: 'ChapterHQ',
    desc: "Management platform for clubs, chapters, and nonprofits: members, dues, events, and an AI assistant that answers from the org's own records.",
    href: 'https://chapterhq.ai',
    detail: '/work/chapterhq',
    status: 'live',
  },
  {
    name: 'Real Estate Maite',
    desc: 'An AI operating system for real estate agents: a team of agents handling follow-up, listings, and paperwork over web and SMS.',
    href: null,
    status: 'in development',
  },
  {
    name: 'Agent Team',
    desc: 'An autonomous crew of software agents that plans, writes, reviews, and ships code on its own infrastructure.',
    href: null,
    status: 'running',
  },
  {
    name: 'Open source',
    desc: 'Tooling I publish on GitHub.',
    href: null,
    detail: '/work/open-source',
    status: 'live',
  },
];

export default function Proof() {
  return (
    <section id="work" className="py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display mb-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
            The systems I recommend are ones I build and run
          </h2>
          <p className="mb-10 max-w-lg" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            I&apos;m a builder first. These are my own products, designed, built, and run day to day.
          </p>
        </Reveal>

        <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <div
                className="corner-hover grid grid-cols-1 gap-2 py-6 transition-colors duration-200 hover:bg-surface sm:grid-cols-12 sm:items-baseline sm:gap-6"
                style={{ borderBottom: '1px solid var(--color-hairline)' }}
              >
                <h3
                  className="sm:col-span-3"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}
                >
                  {p.name}
                </h3>
                <p className="sm:col-span-6" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                  {p.desc}
                </p>
                <div className="flex items-baseline gap-5 sm:col-span-3 sm:justify-end">
                  <span className="inline-flex items-baseline gap-2">
                    {p.status === 'live' && <span className="pulse-dot" aria-hidden="true" />}
                    {p.status === 'running' && (
                      <span
                        className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{ background: 'var(--color-blue)' }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="anno">{p.status}</span>
                  </span>
                  {p.detail && (
                    <Link
                      href={p.detail}
                      className="link-draw transition-colors"
                      style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-blue)' }}
                    >
                      Details
                    </Link>
                  )}
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw transition-colors"
                      style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-blue)' }}
                    >
                      Visit {p.name}
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink)' }}>
            The chat assistant on this site is one of these systems. Open it and ask
            what AI could take off your plate.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
