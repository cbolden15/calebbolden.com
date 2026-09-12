import type { ProjectRecord, RichFlagshipRecord } from '../types';
import { resolveDevelopmentProjectView } from '../publication';
import { projectMetadata } from '../public-content';

export const vora: RichFlagshipRecord = {
  kind: 'flagship', slug: 'vora', name: 'Vora', category: 'products', publication: 'published', order: 0,
  placements: ['home', 'work', 'case-study'], maturity: 'Implemented', destination: '/work/vora', legacyDestination: '/work/vora',
  summary: 'An AI CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system. Approval requirements depend on the action and the configured policy.',
  contribution: 'I design and build the product, its agent tools, and the business workflows around them.',
  related: ['chapterhq', 'agent-team'], links: [{ label: 'Visit Vora', href: 'https://voratechnology.com' }],
  caseStudy: {
    publication: 'draft',
    localFixture: { kind: 'vora', path: 'lib/work/fixtures/vora.json' },
    story: {
      problem: 'A service business can receive a request before anyone is ready to act on it. A customer needs an answer, but a useful answer may depend on availability, the history of the job, or a decision from the owner. Putting an AI employee in that gap raises a practical question: what may it do on its own? A proposed message and a sent message are different things. The interface needs to make that distinction visible, including when a person rejects the proposal or an approved action fails. This example concentrates on that decision boundary inside a CRM workflow.',
      workflow: {
        introduction: 'Cedar Repair and Customer A are invented for this page. The request, proposed message, error and CRM activity are purpose-written samples. Choose an execution outcome, inspect the proposal, and record a decision. Approval permits the next step in the illustration; it does not guarantee that the selected sample execution succeeds. Changing the outcome restarts the request so a previous decision cannot carry into a different branch.',
        walkthroughs: [
          { id: 'rejection', title: 'Reject the proposed action', steps: [
            'Start at Request received with the fictional repair request. Select Review proposed action.',
            'At Awaiting approval, inspect the recipient, proposed follow-up and reason for review. Select Reject example.',
            'Rejected: No action taken in this example. There is no completed CRM activity. Reset returns to Request received with Succeeds selected.',
          ] },
          { id: 'success', title: 'Approve a successful sample result', steps: [
            'Select Succeeds, then Review proposed action.',
            'Select Approve example. The decision is Approved; there is no delivery confirmation yet.',
            'Select Show sample result. Completed shows an invented completion record and corresponding sample CRM activity. No real message is sent.',
            'Reset clears the decision and result and restores Request received with Succeeds selected.',
          ] },
          { id: 'failure', title: 'Approve a failed sample result', steps: [
            'Select Fails. The example restarts at Request received. Select Review proposed action, then Approve example.',
            'Select Show sample result. Execution failed: Action approved; sample execution failed. A fictional provider error appears without delivery confirmation or completed CRM activity.',
            'Reset clears the failure and restores Request received with Succeeds selected.',
          ] },
        ],
      },
      decisions: [
        { constraint: 'A decision is not an execution result.', choice: 'Represent request, pending approval, approval and execution as separate states. Rejection ends its branch; only approval can reach the sample result.', consequence: 'The visitor can inspect where permission is given and where execution may still fail. A failed outcome cannot inherit a successful CRM record.' },
        { constraint: 'Approval depends on the configured action.', choice: 'Keep this example conceptual until the exact supported action and its autonomy configuration have been checked. State the limitation beside the controls.', consequence: 'The illustration explains a workflow without promising that every Vora tool asks permission. It also avoids presenting a simulated follow-up as proof of a verified live delivery path.' },
        { constraint: 'A product explanation should survive a failed enhancement.', choice: 'Render the initial request and all three terminal walkthroughs on the server, then load the local interaction separately.', consequence: 'Readers can follow the decision even without JavaScript or a working interactive module. The native reload link stays available outside that module.' },
      ],
      credits: ['I design and build Vora, including the agent tools and their surrounding business workflows. The sample business, customer and conversation on this page are invented.'],
      limits: [
        'Approval is configuration-dependent, not universal. Some destructive tools can auto-execute under the autonomy policy. This proposed follow-up remains a conceptual example until its exact supported action is verified.',
        'Implemented describes the reviewed capability in source. It does not establish that every feature is enabled or that production availability was checked.',
        'This page does not call a model, contact a provider or write a CRM record. Voice and booking demonstrations require separate configuration checks and evidence.',
      ],
      about: 'This interactive simulation uses sample data to explain a proposed human approval boundary. The selected outcome is deterministic, and all delivery and CRM records are fictional. A reviewed overview poster and an evidence check remain publication dependencies. Any future recording requires an isolated environment with invented records and blocked, mocked or test-mode delivery. No live delivery claim is made for this example.',
    },
  },
};

/** Route metadata and body share one resolution, including the retained legacy description. */
export function resolveVoraPage(record: ProjectRecord) {
  const view = resolveDevelopmentProjectView(record);
  const metadata = view.kind === 'rich' ? projectMetadata(view.record)
    : view.kind === 'rich-draft' && view.body.story ? { title: 'Vora | Work | Caleb Bolden', description: view.body.story.about }
    : { title: 'Vora | Work | Caleb Bolden', description: 'Vora is an AI CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.' };
  return { view, metadata };
}
