import type { ProjectRecord, RichFlagshipRecord } from '../types';
import { resolveDevelopmentProjectView } from '../publication';
import { projectMetadata } from '../public-content';

export const agentConfig: RichFlagshipRecord = {
  kind: 'flagship', slug: 'agent-config', name: 'Agent Config', category: 'developer-tools', publication: 'draft', order: 3,
  placements: ['work', 'case-study'], maturity: 'Implemented', destination: '/work/agent-config',
  summary: 'A shared configuration workflow that turns authored fragments into instructions for different coding tools. The example compares generated outputs and shows what becomes stale when a source fragment changes.',
  contribution: 'I built and maintain the compiler, runtime, adapters, and integration that turn shared fragments into tool-specific instructions.', related: ['agent-team'],
  caseStudy: {
    publication: 'draft',
    localFixture: { kind: 'agent-config', path: 'lib/work/fixtures/agent-config.json' },
    story: {
      problem: 'Agent tools often need the same working rules in different instruction formats. Copying those rules by hand makes drift easy: one tool may receive a concise response policy while another keeps an older, more detailed version. The mismatch can be hard to notice because both files still look reasonable on their own. A useful compiler must keep shared intent in one place, adapt it to each tool, and make regeneration inspectable. This example focuses on that synchronization problem without exposing a private configuration or running the actual generation pipeline in the browser.',
      workflow: {
        introduction: 'Choose the purpose-written Brief or Detailed fragment. The shared fragment and both illustrative tool outputs update together, which represents a clean generation pass. Show stale output then keeps Claude Code aligned with the selected fragment while Codex displays the opposite fixture variant and an Out of date label. Regenerate example restores the matching Codex output. Reset returns to Brief with both outputs Current. These controls select fixed public examples; they do not edit files, calculate a source stamp, invoke the compiler, or inspect a local configuration.',
        walkthroughs: [
          {
            id: 'brief-to-detailed',
            title: 'Change the shared preference',
            steps: [
              'The server-rendered first frame starts with Brief selected. The shared fragment, Claude Code output, and Codex output all show the Brief example and both outputs read Current.',
              'Select Detailed. All three panels move to the Detailed fixture in one state change, and any previous stale state is cleared.',
              'Select Show stale output. The shared fragment and Claude Code stay Detailed, while Codex uses the Brief output and reads Out of date. The differing instruction is highlighted.',
              'Select Regenerate example. Codex returns to the Detailed output and reads Current. Repeating regeneration cannot move the example into another state.',
            ],
          },
          {
            id: 'detailed-to-brief',
            title: 'Check the opposite stale direction',
            steps: [
              'Select Brief from any state. The shared fragment and both outputs move to Brief, and stale state clears.',
              'Select Show stale output. Claude Code remains on Brief and Current, while Codex displays the Detailed fixture and reads Out of date.',
              'Select Reset. The example returns to Brief with both outputs Current. No setting is written to storage or added to the page URL.',
            ],
          },
        ],
      },
      decisions: [
        { constraint: 'The browser must explain configuration drift without becoming another compiler.', choice: 'Use two strict, server-projected variants and a small Agent Config-specific reducer that only selects fixture content.', consequence: 'The interaction stays deterministic and cannot read configuration files, accept arbitrary instructions, invoke generation, or invent a verified source stamp.' },
        { constraint: 'A stale example must show a real mismatch instead of changing a badge alone.', choice: 'Keep Claude Code on the selected variant and source Codex from the opposite fixture pair whenever stale state is active.', consequence: 'The fragment, output variant, highlighted excerpt, and Current or Out of date labels remain connected to the same supplied fixture.' },
        { constraint: 'Shared rules still need tool-specific formatting.', choice: 'Project separate Claude Code and Codex examples from each harmless shared fragment while keeping the source content server-only.', consequence: 'Visitors can compare adapters without receiving unrelated fixtures, private paths, compiler internals, or canonical configuration data.' },
      ],
      credits: [
        'My contribution is the compiler, runtime, tool adapters, and integration that assemble and deliver the generated instructions.',
        'Imported skills and hooks remain separate inputs with their own authorship and licenses. This showcase does not claim those projects as my work.',
      ],
      limits: [
        'The displayed fragments and outputs are purpose-written illustrations. They were not captured from the real compiler and carry no source stamp or publication approval.',
        'The example covers Brief, Detailed, stale Codex output, regeneration, and Reset. The review-finding funnel and dated session-continuity evidence remain outside this version.',
        'The browser makes no compiler, model, filesystem, repository, storage, messaging, or network call for the demonstration. A reviewed poster and evidence manifest entry are still pending.',
      ],
      about: 'Local fixture simulation prepared for the Agent Config case-study draft on September 11, 2026. Every fragment and output excerpt was written for this public example. No canonical configuration, private project source, compiler run, capture, digest, or approval record was used. The page labels the outputs Illustrative until separate evidence work produces reviewed sample bytes and a matching manifest attestation.',
    },
  },
};

/** Route metadata and body come from the same resolved development/public view. */
export function resolveAgentConfigPage(record: ProjectRecord) {
  const view = resolveDevelopmentProjectView(record);
  if (view.kind === 'not-found') return { view, metadata: null };
  const metadata = view.kind === 'rich'
    ? projectMetadata(view.record)
    : view.kind === 'rich-draft' && view.body.story
      ? { title: 'Agent Config | Work | Caleb Bolden', description: view.body.story.about }
      : null;
  return { view, metadata };
}
