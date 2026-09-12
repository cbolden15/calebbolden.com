import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorkFilters from '@/components/work/WorkFilters';
import showcaseStyles from '@/components/work/Showcase.module.css';
import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import { getCatalog } from '@/lib/work/catalog';
import type { ProjectCard } from '@/lib/work/public-content';

export const metadata: Metadata = {
  title: 'Work | Caleb Bolden',
  description: 'The systems I have built and run, the developer tools behind them, the tooling I publish as open source, and what I write about running an operation on AI.',
};

type WorkPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkPage({ searchParams }: WorkPageProps) {
  await searchParams;
  const allCatalog = getCatalog('all');
  const cards = [allCatalog.featured, ...allCatalog.rows].filter((card): card is ProjectCard => card !== null);
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <Header />
      <main className="chat-offset min-h-screen">
        <section className="graph-field py-12 lg:py-16" data-work-intro>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <p className="anno anno-blue mb-5">products and tools I&apos;ve built</p>
            <h1 className="type-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}>
              Work
            </h1>
            <p className="mt-5 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
              I build AI products for real operational work, along with tools for developing and running them. Explore a workflow, see the decisions behind it, and find out what each project does today.
            </p>
          </div>
        </section>

        <section className={`${showcaseStyles.surface} py-10 lg:py-12`} style={{ borderTop: '1px solid var(--color-hairline)' }} aria-labelledby="selected-work" data-work-surface>
          <div className={showcaseStyles.content} data-work-content>
            <p className="anno anno-blue mb-3">selected work</p>
            <h2 id="selected-work" className="type-display mb-7" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Built for real operations
            </h2>
            <WorkFilters cards={cards} />
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }} data-work-section="how-i-build">
          <div className="mx-auto w-[90%] max-w-[1200px]">
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
          </div>
        </section>

        {allCatalog.collection ? (
          <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }} data-work-section="open-source">
            <div className="mx-auto w-[90%] max-w-[1200px]">
              <p className="anno anno-blue mb-6">open source</p>
              <div className="corner-hover grid grid-cols-1 gap-3 border-y border-[var(--color-hairline)] py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                <div className="sm:col-span-4">
                  <h2 className="type-display text-2xl">{allCatalog.collection.name}</h2>
                </div>
                <div className="sm:col-span-8">
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                    {allCatalog.collection.summary}
                  </p>
                  <Link href={allCatalog.collection.destination} className="link-draw mt-4 inline-block" style={{ fontSize: 14.5, color: 'var(--color-blue)' }}>
                    Explore open source
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }} data-work-section="notes">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div className="mb-6 flex items-baseline justify-between gap-5">
              <p className="anno anno-blue">recent notes</p>
              <Link href="/blog" className="link-draw" style={{ fontSize: 14, color: 'var(--color-blue)' }}>
                All notes
              </Link>
            </div>
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              {posts.map(post => (
                <article key={post.slug} className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6" style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                  <time className="anno sm:col-span-2" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              ))}
            </div>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }} data-work-section="client-work">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:gap-6">
              <p className="anno anno-blue sm:col-span-2">client work</p>
              <div className="sm:col-span-8 sm:col-start-4">
                <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
                  Everything above is mine. Client work is a separate part of this practice. I publish a named client case study only after the engagement is complete and the client has approved what the page says.
                </p>
                <Link href="/results" className="link-draw mt-5 inline-block" style={{ fontSize: 14.5, color: 'var(--color-blue)' }}>
                  See how engagements are structured and what the founding-client offer includes
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ borderTop: '1px solid var(--color-hairline)' }} data-work-section="audit">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div className="max-w-2xl rounded-[2px] p-8 sm:p-10" style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-blue)' }}>
              <p className="anno anno-blue mb-4">Have a workflow like this?</p>
              <h2 className="type-display mb-5" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
                Start with the audit
              </h2>
              <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                Audits start at $750, fixed scope. Every engagement begins here. Two to three weeks inside your business, and you end up with a map, a scored shortlist, and one recommended pilot, whether or not you hire me to build it.
              </p>
              <div className="mt-7">
                <Link href="/contact" className="btn-ink btn-roll">
                  <span className="roll-box">
                    <span className="roll-a">Discuss a project</span>
                    <span className="roll-b" aria-hidden="true">Discuss a project</span>
                  </span>
                </Link>
              </div>
              <p className="mt-5" style={{ fontSize: 14, color: 'var(--color-ink-muted)' }}>
                Not ready to talk?{' '}
                <Link href="/tools/ai-readiness" className="link-draw" style={{ color: 'var(--color-blue)' }}>
                  Take the free AI readiness assessment
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
