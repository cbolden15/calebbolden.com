import type { RichFlagshipRecord } from '../types';

export const agentConfig: RichFlagshipRecord = {
  kind: 'flagship', slug: 'agent-config', name: 'Agent Config', category: 'developer-tools', publication: 'draft', order: 3,
  placements: ['work', 'case-study'], maturity: 'Implemented', destination: '/work/agent-config',
  summary: 'A shared configuration workflow that turns authored fragments into instructions for different coding tools. The example compares generated outputs and shows what becomes stale when a source fragment changes.',
  contribution: 'I maintain the shared fragments and generation workflow, with imported skills and hooks credited separately.', related: ['agent-team'], caseStudy: { publication: 'draft' },
};
