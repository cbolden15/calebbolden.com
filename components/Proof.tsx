import Reveal from './Reveal';

// Spec-sheet proof: shipped products as divided rows with mono status labels.
// "live" is real semantic state (deployed products), not decoration. No
// invented metrics, no fake logos.

const products = [
  {
    name: 'Vora',
    desc: 'An AI-powered CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.',
    href: 'https://voratechnology.com',
    status: 'live',
  },
  {
    name: 'ChapterHQ',
    desc: "Management platform for clubs, chapters, and nonprofits: members, dues, events, and an AI assistant that answers from the org's own records.",
    href: 'https://chapterhq.ai',
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
];

export default function Proof() {
  return (
    <section id="work" className="py-20 lg:py-28">
      <div className="mx-auto w-[90%] max-w-[1200px]">
        <Reveal>
          <h2 className="type-display mb-4" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            The systems I recommend are ones I&apos;ve already shipped
          </h2>
          <p className="mb-10 max-w-lg" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
            I&apos;m a builder first. These are live products I designed, built, and run.
          </p>
        </Reveal>

        <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <div
                className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
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
                  <span className="anno">{p.status}</span>
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:underline"
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
