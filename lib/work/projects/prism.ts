import type { RichFlagshipRecord } from '../types';

export const prism: RichFlagshipRecord = {
  kind: 'flagship', slug: 'prism', name: 'Prism', category: 'developer-tools', publication: 'draft', order: 1,
  placements: ['work', 'case-study'], maturity: 'Developer preview', destination: '/work/prism',
  summary: 'A developer tool for inspecting an execution trace and its receipt. The public example will follow the original event order and distinguish the result from the cleanup claims that the receipt supports.',
  contribution: 'I build the trace workflow and the interface for inspecting its result.', related: ['agent-team'], caseStudy: { publication: 'draft' },
};
