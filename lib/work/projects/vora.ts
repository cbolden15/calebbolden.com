import type { RichFlagshipRecord } from '../types';

export const vora: RichFlagshipRecord = {
  kind: 'flagship', slug: 'vora', name: 'Vora', category: 'products', publication: 'published', order: 0,
  placements: ['home', 'work', 'case-study'], maturity: 'Implemented', destination: '/work/vora', legacyDestination: '/work/vora',
  summary: 'An AI CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system. Approval requirements depend on the action and the configured policy.',
  contribution: 'I design and build the product, its agent tools, and the business workflows around them.',
  related: ['chapterhq', 'agent-team'], links: [{ label: 'Visit Vora', href: 'https://voratechnology.com' }],
};
