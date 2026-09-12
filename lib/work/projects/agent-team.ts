import type { RichFlagshipRecord } from '../types';

export const agentTeam: RichFlagshipRecord = {
  kind: 'flagship', slug: 'agent-team', name: 'Agent Team', category: 'developer-tools', publication: 'draft', order: 2,
  placements: ['home', 'work', 'case-study'], maturity: 'Implemented', destination: '/work/agent-team',
  summary: 'A software agent workflow for planning, implementation, and review. Its example separates a successful run, a retry, and a blocked result, with the default automatic merge policy stated beside the steps.',
  contribution: 'I build the orchestration and review workflow around the participating agents.', related: ['prism', 'agent-config'], caseStudy: { publication: 'draft' },
};
