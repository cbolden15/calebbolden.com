import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Open source | Work | Caleb Bolden',
  description: 'Tooling I publish on GitHub. Small, sharp, agent-first.',
};

const repos = [
  {
    name: 'life-agent-mcp',
    desc: 'An MCP server exposing 38 Claude-ready tools over a FastMCP proxy pattern.',
    href: 'https://github.com/cbolden15/life-agent-mcp',
  },
  {
    name: 'youtube-transcript-workflow',
    desc: 'A map/reduce pipeline that turns captions into notes, with multiple backends.',
    href: 'https://github.com/cbolden15/youtube-transcript-workflow',
  },
  {
    name: 'claude-code-config-manager',
    desc: 'A single source of truth for Claude Code config across machines.',
    href: 'https://github.com/cbolden15/claude-code-config-manager',
  },
  {
    name: 'cli-printing-press',
    desc: 'A generator for CLIs built to be driven by AI agents first.',
    href: 'https://github.com/cbolden15/cli-printing-press',
  },
  {
    name: 'canton-traffic-calculator',
    desc: 'A cost estimator for running on the Canton Network.',
    href: 'https://github.com/cbolden15/canton-traffic-calculator',
  },
];

export default function OpenSourcePage() {
  return (
    <>
      <Header />
      <main className="chat-offset min-h-screen">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Open source
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                Tooling I publish on GitHub. Small, sharp, agent-first.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              {repos.map((repo, i) => (
                <Reveal key={repo.name} delay={i * 70}>
                  <div
                    className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    style={{ borderBottom: '1px solid var(--color-hairline)' }}
                  >
                    <h2
                      className="sm:col-span-3"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}
                    >
                      {repo.name}
                    </h2>
                    <p className="sm:col-span-6" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                      {repo.desc}
                    </p>
                    <div className="sm:col-span-3 sm:justify-self-end">
                      <a
                        href={repo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-draw transition-colors"
                        style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-blue)' }}
                      >
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={repos.length * 70 + 60}>
              <p className="mt-8" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink)' }}>
                <a
                  href="https://github.com/cbolden15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw transition-colors"
                  style={{ color: 'var(--color-blue)' }}
                >
                  All repos on GitHub
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
