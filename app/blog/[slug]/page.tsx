import { getBlogPost, getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import BlogVsmFigure from '@/components/figures/BlogVsmFigure';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Caleb Bolden`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="chat-offset min-h-screen">
        <article>
          <section className="graph-field graph-fade py-16 lg:py-24">
            <div className="mx-auto w-[90%] max-w-[1200px]">
              <Link href="/blog" className="link-draw inline-block" style={{ fontSize: 14.5, color: 'var(--color-blue)' }}>
                Back to blog
              </Link>
              <header className="mt-10 max-w-3xl">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <span className="anno">{post.category}</span>
                  <time className="anno" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h1 className="type-display mt-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                  {post.title}
                </h1>
              </header>
            </div>
          </section>

          <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
            <div className="mx-auto w-[90%] max-w-[1200px]">
              <div className="prose-wall">
                <MDXRemote source={post.content} components={{ BlogVsmFigure }} />
              </div>

              <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 pt-8" style={{ borderTop: '1px solid var(--color-hairline)' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="anno">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
