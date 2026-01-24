import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Blog | Caleb Bolden',
  description: 'Insights on AI automation, process improvement, and blockchain technology.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-400 mb-16">
            Insights on AI automation, process improvement, and blockchain technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl hover:border-primary-cyan hover:-translate-y-2 transition-all"
              >
                <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
                  {post.category}
                </span>
                <div className="text-sm text-gray-500 mb-4">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-cyan transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
