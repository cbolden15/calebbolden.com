import type { CollectionRecord, HomepageOnlyRecord, LegacySecondaryRecord } from '../types';

export const chapterhq: LegacySecondaryRecord = {
  kind: 'legacy-secondary', slug: 'chapterhq', name: 'ChapterHQ', category: 'products', publication: 'published', order: 5,
  placements: ['home', 'work', 'case-study'], legacyStatus: 'live', destination: '/work/chapterhq',
  summary: 'A management platform for clubs and nonprofits: members, dues, events, and an AI assistant that answers from the org’s own records.',
  contribution: 'I design, build, and run the product.', related: ['vora'], links: [{ label: 'Visit ChapterHQ', href: 'https://chapterhq.ai' }],
};
export const siteAssistant: LegacySecondaryRecord = {
  kind: 'legacy-secondary', slug: 'site-assistant', name: 'Site assistant', category: 'products', publication: 'published', order: 6,
  placements: ['home', 'work', 'case-study'], legacyStatus: 'live', destination: '/work/site-assistant',
  summary: 'The chat agent running live in the corner of this site, answering questions from my own content.',
  contribution: 'I build the site assistant and its typed tools.', related: ['vora'],
};
export const openSource: CollectionRecord = {
  kind: 'collection', slug: 'open-source', name: 'Open source', category: 'developer-tools', publication: 'published', order: 7,
  placements: ['home', 'work'], legacyStatus: 'live', destination: '/work/open-source',
  summary: 'Tooling I publish on GitHub.', contribution: 'I publish and maintain these tools.', related: [],
};
export const realEstateMaite: HomepageOnlyRecord = {
  kind: 'homepage-only', slug: 'real-estate-maite', name: 'Real Estate Maite', category: 'products', publication: 'published', order: 8,
  placements: ['home'], legacyStatus: 'in development',
  summary: 'An AI operating system for real estate agents: a team of agents handling follow-up, listings, and paperwork over web and SMS.',
  contribution: 'I am developing the product and its agent workflows.', related: [],
};
