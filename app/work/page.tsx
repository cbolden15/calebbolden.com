import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';

export const metadata: Metadata = {
  title: 'Work | Caleb Bolden',
  description: 'The systems I have built and run (Vora, ChapterHQ, this site’s assistant), the tooling I publish as open source, and what I write about running an operation on AI.',
};

const systems = [
  {
    name: 'Vora',
    href: '/work/vora',
    desc: 'A CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.',
  },
  {
    name: 'ChapterHQ',
    href: '/work/chapterhq',
    desc: 'A management platform for clubs and nonprofits: members, dues, events, and an AI assistant that answers from the org’s own records.',
  },
  {
    name: 'Site assistant',
    href: '/work/site-assistant',
    desc: 'The chat agent running live in the corner of this site, answering questions from my own content.',
  },
];

export default function WorkPage() {
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <Header />
      <main className="chat-offset min-h-screen">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Work
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                The systems I have built and run, the code I publish, and how I build. I recommend what I have already shipped.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-6">systems</p>
            </Reveal>
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              {systems.map((s, i) => (
                <Reveal key={s.name} delay={i * 70}>
                  <div
                    className="corner-hover grid grid-cols-1 gap-2 py-6 transition-colors duration-200 hover:bg-surface sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    style={{ borderBottom: '1px solid var(--color-hairline)' }}
                  >
                    <h2
                      className="sm:col-span-3"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}
                    >
                      <Link href={s.href} className="link-draw transition-colors hover:text-blue">
                        {s.name}
                      </Link>
                    </h2>
                    <p className="sm:col-span-6" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                      {s.desc}
                    </p>
                    <div className="flex items-baseline gap-2 sm:col-span-3 sm:justify-end">
                      <span className="pulse-dot" aria-hidden="true" />
                      <span className="anno">live</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-6">open source</p>
            </Reveal>
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              <Reveal>
                <div
                  className="corner-hover grid grid-cols-1 gap-2 py-6 transition-colors duration-200 hover:bg-surface sm:grid-cols-12 sm:items-baseline sm:gap-6"
                  style={{ borderBottom: '1px solid var(--color-hairline)' }}
                >
                  <h2
                    className="sm:col-span-3"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}
                  >
                    <Link href="/work/open-source" className="link-draw transition-colors hover:text-blue">
                      Open source
                    </Link>
                  </h2>
                  <p className="sm:col-span-9" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                    Tooling I publish on GitHub.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
                <p className="anno anno-blue sm:col-span-2">how i build</p>
                <div className="sm:col-span-8 sm:col-start-4">
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                    How my own operation runs on AI, the tools I actually use, and where I still draw the line at a human.
                  </p>
                  <Link href="/how-i-build" className="link-draw mt-5 inline-block" style={{ fontSize: 14.5, color: 'var(--color-blue)' }}>
                    How my own operation runs on AI
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <div className="mb-6 flex items-baseline justify-between">
                <p className="anno anno-blue">notes</p>
                <Link href="/blog" className="link-draw" style={{ fontSize: 14, color: 'var(--color-blue)' }}>
                  All notes
                </Link>
              </div>
            </Reveal>
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 60}>
                  <article
                    className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    style={{ borderBottom: '1px solid var(--color-hairline)' }}
                  >
                    <time className="anno sm:col-span-2" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="anno sm:col-span-2">{post.category}</span>
                    <div className="sm:col-span-8">
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}>
                        <Link href={`/blog/${post.slug}`} className="link-draw transition-colors hover:text-blue">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-3 max-w-2xl" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
