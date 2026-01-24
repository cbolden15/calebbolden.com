import Link from 'next/link';

export default function BlogPreview() {
  const posts = [
    {
      slug: 'ai-agents-2026',
      category: 'AI Trends',
      date: 'January 15, 2026',
      title: 'The State of AI Agents in 2026',
      excerpt: 'Analyzing the shift from chatbots to autonomous agents and what it means for business automation...'
    },
    {
      slug: 'beyond-rpa',
      category: 'Automation',
      date: 'January 10, 2026',
      title: 'Beyond RPA: Next-Gen Workflows',
      excerpt: 'Why traditional RPA is dying and what intelligent automation looks like in practice...'
    },
    {
      slug: 'enterprise-blockchain',
      category: 'Blockchain',
      date: 'January 5, 2026',
      title: 'Enterprise Blockchain: Lessons Learned',
      excerpt: 'Three years at Blockdaemon taught me these hard truths about deploying blockchain in production...'
    }
  ];

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Latest Insights
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          Analysis, trends, and technical deep-dives
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                {post.date}
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
    </section>
  );
}
