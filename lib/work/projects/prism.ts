import type { ProjectRecord, RichFlagshipRecord } from '../types';
import { resolveDevelopmentProjectView } from '../publication';
import { projectMetadata } from '../public-content';

export const prism: RichFlagshipRecord = {
  kind: 'flagship', slug: 'prism', name: 'Prism', category: 'developer-tools', publication: 'draft', order: 1,
  placements: ['work', 'case-study'], maturity: 'Developer preview', destination: '/work/prism',
  summary: 'A developer preview for bounded local agent execution, with an inspectable event trace, a contract-derived terminal run record, and fixed limits clearly separated from measured usage.',
  contribution: 'I build the trace workflow and the interface for inspecting its result.', related: ['agent-team'],
  links: [
    { label: 'Source at pinned commit', href: 'https://github.com/cbolden15/prism/commit/fcad9afece7a7c12395946f9dd3305de0250bc1c' },
    { label: 'Deterministic getting started', href: 'https://github.com/cbolden15/prism/blob/fcad9afece7a7c12395946f9dd3305de0250bc1c/docs/developer-preview/getting-started.md#deterministic-first-run' },
    { label: 'Attribution / NOTICE', href: 'https://github.com/cbolden15/prism/blob/fcad9afece7a7c12395946f9dd3305de0250bc1c/NOTICE' },
  ],
  caseStudy: {
    publication: 'draft',
    localFixture: { kind: 'prism', path: 'lib/work/fixtures/prism.json' },
    story: {
      problem: 'A local agent run can end with a short answer while leaving the important sequence hidden. A developer still needs to see which goal was accepted, which tool the provider requested, whether policy allowed that request, and how the run reached completion. Those stages must stay in order, and the record shown afterward must keep its evidence layers straight. A fixed limit is different from measured usage. A lower-level lifecycle assertion is different from a field persisted by the CLI. This example makes those boundaries readable without executing Prism in the browser.',
      workflow: {
        introduction: 'The example follows the successful deterministic bounded-coordinator sequence documented in Prism v0.1.0. Start with the fixed word-count prompt, move through the six public event identifiers, and inspect the result only after run.completed. At completion, the receipt panel shows an explicitly labeled v1 inspect-record excerpt. A separate disclosure describes lifecycle facts asserted by pinned source tests; it is not a captured receipt and does not prove a sandbox or container execution.',
        walkthroughs: [{
          id: 'successful-trace',
          title: 'Walk the contract-derived trace',
          steps: [
            'The unstarted frame shows the fixed prompt. Start example presents goal.accepted; no result or receipt is available.',
            'Next event advances through provider.tool-requested, policy.allowed, tool.completed, and provider.finalized. Previous event moves back one stage and clears anything that belongs to a later state.',
            'The sixth stage is run.completed. Only now does the result 3 words appear and Inspect receipt become available.',
            'The v1 inspect-record excerpt contains fixed limits of two provider turns and one tool call, plus terminal status completed and answer 3 words. It contains no persisted measured usage or cleanup field.',
            'Close receipt hides the excerpt. Reset returns to the unstarted prompt, with the terminal result and receipt removed.',
          ],
        }],
      },
      decisions: [
        { constraint: 'A trace is meaningful only in its authentic order.', choice: 'Store the six public event identifiers in a strict server-side fixture and let a bounded Prism-specific reducer move one position at a time.', consequence: 'The interaction cannot skip ahead, present a result early, or turn a source sequence into a generic workflow.' },
        { constraint: 'Prism exposes evidence at different layers.', choice: 'Keep the v1 CLI inspect-record excerpt separate from the lower-level lifecycle contract asserted by source tests.', consequence: 'Fixed limits are not mislabeled as measured usage, and lifecycle assertions are not presented as fields captured in the persisted run.' },
        { constraint: 'The browser must not become an execution surface.', choice: 'Project one validated fixture into a local state machine and render the complete walkthrough on the server.', consequence: 'The page can explain the bounded run without starting a process, contacting a provider, reading local run data, or claiming runtime assurance.' },
      ],
      credits: [
        'My contribution is the trace workflow and the interface for inspecting its result.',
        'The pinned NOTICE credits Vora Technologies, LLC. The public metadata does not establish a sole personal authorship claim.',
      ],
      limits: [
        'This is a contract-derived simulation from public source, not a recording or a live Prism run. No run ID, workspace, timestamp, process, host, container, or native execution was captured.',
        'The v1 record persists fixed limits but no measured usage or cleanup receipts. The lower-level lifecycle assertions are documented separately and do not prove sandboxing.',
        'Linux, KVM, QEMU, Firecracker, physical-X1 assurance, plugin digest approval, and ambient-authority experiments remain outside this example.',
      ],
      about: 'Contract-derived simulation from Prism v0.1.0 public source, checked September 11, 2026. GitHub marks release v0.1.0 immutable; its annotated tag resolves to pinned commit fcad9afece7a7c12395946f9dd3305de0250bc1c. The plan\'s publicRevision concept maps to the shared sourceRevision provenance field. This local fixture is unapproved for publication, has no reviewed poster or manifest snapshot, and contains no substituted runtime identifiers because none were captured.',
    },
  },
};

/** Route metadata and body come from the same resolved development/public view. */
export function resolvePrismPage(record: ProjectRecord) {
  const view = resolveDevelopmentProjectView(record);
  if (view.kind === 'not-found') return { view, metadata: null };
  const metadata = view.kind === 'rich'
    ? projectMetadata(view.record)
    : view.kind === 'rich-draft' && view.body.story
      ? { title: 'Prism | Work | Caleb Bolden', description: view.body.story.about }
      : null;
  return { view, metadata };
}
