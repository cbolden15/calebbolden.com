import type { RichFlagshipRecord } from '../types';

export const controlCenter: RichFlagshipRecord = {
  kind: 'flagship', slug: 'control-center', name: 'Control Center', category: 'developer-tools', publication: 'draft', order: 4,
  placements: ['work', 'case-study'], maturity: 'Prototype', destination: '/work/control-center',
  summary: 'A prototype view of runs, decisions, deployments, and spend using sample data. It explores how an operator could inspect a record and follow a run; deployment has not been verified.',
  contribution: 'I build the prototype views, with Homepage and Healthchecks credited for their contributions.', related: ['agent-team'], caseStudy: { publication: 'draft' },
};
