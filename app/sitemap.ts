import type { MetadataRoute } from 'next';

const BASE = 'https://calebbolden.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/services/web-development`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/seo`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/marketing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.6 },
  ];
}
