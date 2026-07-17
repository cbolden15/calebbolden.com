import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Blog | Caleb Bolden',
  description: 'Notes on AI, automation, and mapping a business before you build.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="chat-offset min-h-screen">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <h1 className="type-display" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Blog
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                Notes on AI, automation, and mapping a business before you build
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
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
