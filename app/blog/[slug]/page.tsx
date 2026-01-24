import { getBlogPost, getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="text-primary-cyan hover:underline mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="text-gray-400">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-cyan max-w-none">
            <MDXRemote source={post.content} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-primary-cyan/10">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-cyan/5 border border-primary-cyan/20 rounded-full text-xs text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
