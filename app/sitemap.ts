import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';

const BASE = 'https://calebbolden.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));
  return [
    { url: `${BASE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/services/web-development`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/seo`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/marketing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/resources`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/owners`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/operators`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/ai-readiness`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/revenue-leak`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/results`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work/vora`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/work/chapterhq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/work/site-assistant`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/work/open-source`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/how-i-build`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    ...posts,
  ];
}
