import type { ProjectRecord, RichFlagshipRecord } from '../types';
import { resolveDevelopmentProjectView } from '../publication';
import { projectMetadata } from '../public-content';

export const prism: RichFlagshipRecord = {
  kind: 'flagship', slug: 'prism', name: 'Prism', category: 'developer-tools', publication: 'published', order: 1,
  placements: ["home","work","case-study","how-i-build"], maturity: 'Developer preview', destination: '/work/prism',
  summary: 'A developer preview for bounded local agent execution, with an inspectable event trace, a contract-derived terminal run record, and fixed limits clearly separated from measured usage.',
  contribution: 'I build the trace workflow and the interface for inspecting its result.', related: ['agent-team'],
  links: [
    { label: 'Source at pinned commit', href: 'https://github.com/cbolden15/prism/commit/fcad9afece7a7c12395946f9dd3305de0250bc1c' },
    { label: 'Deterministic getting started', href: 'https://github.com/cbolden15/prism/blob/fcad9afece7a7c12395946f9dd3305de0250bc1c/docs/developer-preview/getting-started.md#deterministic-first-run' },
    { label: 'Attribution / NOTICE', href: 'https://github.com/cbolden15/prism/blob/fcad9afece7a7c12395946f9dd3305de0250bc1c/NOTICE' },
  ],
  responsibility: {"label":"Event trace and terminal record","order":3,"snapshotId":"prism-portfolio-2026-09-12-v1","caption":"Portfolio simulation screenshot derived from Prism v0.1.0 public source: run.completed, the result 3 words, and a v1 inspect-record excerpt with fixed limits. No Prism execution was captured; measured usage and cleanup receipts are absent from this CLI record."},
  caseStudy: {
    publication: 'published',
    evidence: [{"kind":"image","snapshotId":"prism-portfolio-2026-09-12-v1","src":"/work/prism/overview.webp","alt":"Prism portfolio simulation at event six of six, with the result 3 words and an inspect-record excerpt showing two provider turns, one tool call, and completed terminal status.","caption":"Portfolio simulation screenshot derived from Prism v0.1.0 public source: run.completed, the result 3 words, and a v1 inspect-record excerpt with fixed limits. No Prism execution was captured; measured usage and cleanup receipts are absent from this CLI record.","width":950,"height":657}],
    interaction: {"kind":"prism","snapshotId":"prism-portfolio-2026-09-12-v1","label":"Contract-derived simulation","caption":"Portfolio simulation screenshot derived from Prism v0.1.0 public source: run.completed, the result 3 words, and a v1 inspect-record excerpt with fixed limits. No Prism execution was captured; measured usage and cleanup receipts are absent from this CLI record."},
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
      about: "Contract-derived simulation from Prism v0.1.0 public source, checked September 12, 2026. GitHub marks release v0.1.0 immutable; its annotated tag resolves to pinned commit fcad9afece7a7c12395946f9dd3305de0250bc1c. The overview image shows this portfolio simulation. No Prism command was run and no runtime identifiers were captured or substituted. Fixed limits and terminal fields follow the public v1 record contract; lower-level lifecycle assertions are separate source-test facts, not captured inspect output.",
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
