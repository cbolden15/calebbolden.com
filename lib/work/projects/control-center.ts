import type { ProjectRecord, RichFlagshipRecord } from '../types';
import { resolveDevelopmentProjectView } from '../publication';
import { projectMetadata } from '../public-content';

export const controlCenter: RichFlagshipRecord = {
  kind: 'flagship', slug: 'control-center', name: 'Control Center', category: 'developer-tools', publication: 'draft', order: 4,
  placements: ['work', 'case-study'], maturity: 'Prototype', destination: '/work/control-center',
  summary: 'An operations dashboard combining unattended runs, pending decisions, sample spend, and deployment records. This prototype example shows how an operator can find work that needs attention without implying verified deployment.',
  contribution: 'I built the aggregator, adapters, run wrapper, configuration, and visual composition, with Homepage and Healthchecks credited for their contributions.', related: ['agent-team'],
  caseStudy: {
    publication: 'draft',
    localFixture: { kind: 'control-center', path: 'lib/work/fixtures/control-center.json' },
    story: {
      problem: 'Unattended operations scatter useful signals across run histories, decision queues, cost summaries, and deployment records. An operator needs a compact way to see what changed, notice what needs attention, and inspect the record behind a count. A dashboard can easily overstate confidence, though: a fixture can look live, a static age can look current, and a deployment row can be mistaken for proof that the dashboard itself was deployed. This prototype makes those boundaries explicit while demonstrating the information hierarchy with deterministic sample data.',
      workflow: {
        introduction: 'The server frame starts with Succeeds, Started, and Show all. Scenario controls choose one of two fixed datasets, while Show sample run result moves only the primary run to its authored terminal state. Show all and Needs attention derive both lists and counts from the same selected dataset. Runs, decisions, and the deployment row open read-only details. Ages are calculated against September 1, 2026 at 12:00 UTC, and a run is stale after 60 minutes without an update. Reset restores the initial state. The portfolio interaction never queries an operations service or changes a record.',
        walkthroughs: [
          {
            id: 'successful-run',
            title: 'Inspect a successful sample run',
            steps: [
              'The initial server reference shows Succeeds and Started with one recent run, one resolved decision, the fixed sample-spend value, and one fictional deployment record.',
              'Choose Needs attention. Both visible counts become zero and each empty group says that no items need attention in this example. Spend and deployment totals stay unchanged.',
              'Return to Show all and select the resolved decision. Its descriptive source type, frozen age, resolution status, and short explanation open in a read-only detail panel.',
              'Select Show sample run result. The primary run moves from Started to Succeeded. No process runs, and the purpose-written source fixture remains unchanged.',
            ],
          },
          {
            id: 'failed-run',
            title: 'Find the failed and stale sample records',
            steps: [
              'Choose Fails. The primary run returns to Started. With Show all active it becomes the selected detail, while the dataset also contains one explicitly stale started run and one unresolved decision.',
              'Choose Needs attention. The recent primary run is hidden, so its detail clears. The stale run and unresolved decision remain, producing counts of one run and one decision.',
              'Select the unresolved decision to inspect its descriptive source and frozen age. There is no approve or reject control because this portfolio example is read-only.',
              'Select Show sample run result. The primary run becomes Failed and joins the stale run, so attention counts become two runs and one decision. The failure is an authored example, not a live operational result.',
              'Select the deployment row from either filter to see its fictional target, abbreviated SHA, recorded result, and sample explanation. This record is not evidence that Control Center is deployed.',
              'Select Reset. The dashboard returns to Succeeds, Started, Show all, and no open detail, without storage or URL state.',
            ],
          },
        ],
      },
      decisions: [
        { constraint: 'Filtering must not make headline counts disagree with the lists below them.', choice: 'Derive visible run and decision records first, then calculate both counts from those same arrays.', consequence: 'Show all and Needs attention stay internally consistent while sample spend and deployments remain independent of the filter.' },
        { constraint: 'Relative ages can imply a live feed when they continue changing.', choice: 'Store ISO timestamps in the fixture and calculate display ages against one visible frozen timestamp and a 60-minute stale rule.', consequence: 'Every walkthrough is repeatable, stale state is testable, and the page does not need a timer or background refresh.' },
        { constraint: 'The prototype must explain operational inspection without becoming an operations client.', choice: 'Project one strict sample fixture into a Control Center-specific reducer with named scenario, filter, selection, result, and Reset events.', consequence: 'The browser cannot start runs, make decisions, deploy software, fetch private services, or turn a fictional deployment row into an availability claim.' },
      ],
      credits: [
        'My contribution is the aggregator, adapters, run wrapper, configuration, and visual composition used to bring the prototype view together.',
        'Homepage and Healthchecks are credited as upstream projects whose ideas and capabilities informed parts of the dashboard.',
      ],
      limits: [
        'Implemented dashboard; deployment not verified. The maturity label Prototype describes this showcase accurately.',
        'Every run, decision, host, job name, timestamp, spend value, deployment target, SHA, and result is purpose-written sample data. None is a measured business outcome or production record.',
        'Needs attention is portfolio-demo behavior unless separately verified in the source product. The fixed service-down placeholder from the inspected source is omitted.',
        'The browser uses no timer, storage, API, WebSocket, EventSource, provider, messaging, deployment, repository, or process operation. A reviewed poster and evidence manifest entry are still pending.',
      ],
      about: 'Local sample fixture prepared for the Control Center case-study draft on September 11, 2026. The dashboard is frozen at September 1, 2026 at 12:00 UTC and marks a run stale after 60 minutes without an update. All records are fictional and were written for this public example. The fixture is not a capture, operational report, deployment verification, or publication approval.',
    },
  },
};

/** Route metadata and body come from the same resolved development/public view. */
export function resolveControlCenterPage(record: ProjectRecord) {
  const view = resolveDevelopmentProjectView(record);
  if (view.kind === 'not-found') return { view, metadata: null };
  const metadata = view.kind === 'rich'
    ? projectMetadata(view.record)
    : view.kind === 'rich-draft' && view.body.story
      ? { title: 'Control Center | Work | Caleb Bolden', description: view.body.story.about }
      : null;
  return { view, metadata };
}
