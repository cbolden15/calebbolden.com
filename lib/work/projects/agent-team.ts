import type { ProjectRecord, RichFlagshipRecord } from '../types';
import { resolveDevelopmentProjectView } from '../publication';
import { projectMetadata } from '../public-content';

export const agentTeam: RichFlagshipRecord = {
  kind: 'flagship', slug: 'agent-team', name: 'Agent Team', category: 'developer-tools', publication: 'published', order: 2,
  placements: ["home","work","case-study","how-i-build"], maturity: 'Implemented', destination: '/work/agent-team',
  summary: 'A software agent workflow for planning, implementation, and review. Its example separates a successful run, a retry, and a blocked result, with the default automatic merge policy stated beside the steps.',
  contribution: 'I build the orchestration and review workflow around the participating agents.', related: ['prism', 'agent-config'],
  responsibility: {"label":"Review, retry, and blocked work","order":1,"snapshotId":"agent-team-portfolio-2026-09-12-v1","caption":"Portfolio simulation screenshot: a fictional successful run reaches Delivery through the represented default legacy automatic merge path. Merge and queue enforcement, sandboxing, and anomaly termination are off; hard caps are unset. The website performs no repository operation."},
  caseStudy: {
    publication: 'published',
    evidence: [{"kind":"image","snapshotId":"agent-team-portfolio-2026-09-12-v1","src":"/work/agent-team/overview.webp","alt":"Agent Team portfolio simulation at Delivery, showing fictional sample CI and automatic merge, with the default configuration expanded and enforcement settings off.","caption":"Portfolio simulation screenshot: a fictional successful run reaches Delivery through the represented default legacy automatic merge path. Merge and queue enforcement, sandboxing, and anomaly termination are off; hard caps are unset. The website performs no repository operation.","width":950,"height":925}],
    interaction: {"kind":"agent-team","snapshotId":"agent-team-portfolio-2026-09-12-v1","label":"Interactive simulation · sample data","caption":"Portfolio simulation screenshot: a fictional successful run reaches Delivery through the represented default legacy automatic merge path. Merge and queue enforcement, sandboxing, and anomaly termination are off; hard caps are unset. The website performs no repository operation."},
    story: {
      problem: 'A coding task can appear to move cleanly from assignment to merge while hiding the decisions that mattered. The implementation may have happened in an isolated workspace, reviewers may have received different prompt contexts, and QA may have needed another attempt. A security finding may also stop the work before a pull request exists. Without those boundaries, a green terminal label says little about why the task continued, retried, or stopped. This example keeps the five stages stable while exposing the role, decision, and sample artifact at each point.',
      workflow: {
        introduction: 'Choose one of three fictional runs, then inspect Task, Implementation, Reviews, QA, and Delivery. The stage names stay fixed across scenarios, while reachability and evidence change. Passes review and QA retry both end on the inspected default legacy automatic merge path with merge-policy enforcement disabled. Security block ends in Reviews because a separate security review rejects unsafe path handling. Selecting a later stage only changes the sample view; it does not execute an agent, open a pull request, run CI, or touch a repository.',
        walkthroughs: [
          {
            id: 'passes-review',
            title: 'Passes review',
            steps: [
              'Task accepts a bounded fictional retry-banner change and defines the checks that will decide it.',
              'Implementation makes one focused change in an isolated sample workspace.',
              'Reviews shows correctness and security reviews with separate, isolated prompt contexts. Both sample reviews pass without claiming provider or model diversity.',
              'QA passes the two fictional assertions on its first attempt.',
              'Delivery shows a fictional draft PR, green sample CI, and “Sample run complete · automatic merge.” Merge-policy enforcement is disabled, so this follows the inspected legacy path. The website performs no merge.',
            ],
          },
          {
            id: 'qa-retry',
            title: 'QA retry',
            steps: [
              'Task requires the first failed assertion to remain inspectable after a later pass.',
              'Implementation adds the initial attempt summary in an isolated sample workspace.',
              'Separate correctness and security review contexts both pass the fictional change into QA.',
              'QA attempt 1 fails because the prior failure marker disappears. A debugger changes replacement to append the next result, and attempt 2 passes. Both attempts remain visible.',
              'Delivery shows a fictional draft PR and green sample CI before the legacy automatic merge label. Merge-policy enforcement remains disabled, and no repository operation occurs.',
            ],
          },
          {
            id: 'security-block',
            title: 'Security block',
            steps: [
              'Task asks for a fictional branch label in a sample archive filename.',
              'Implementation constructs the filename in an isolated sample workspace.',
              'Correctness review passes the requested display behavior. In a separate prompt context, security review finds that parent-directory segments are not rejected and blocks the run.',
              'The terminal label is “Blocked by review.” This stop is a review decision before PR, not an enabled merge gate.',
              'QA and Delivery remain visible as Not reached. Direct selection, keyboard activation, and Next cannot bypass the blocked Reviews stage.',
            ],
          },
        ],
      },
      decisions: [
        { constraint: 'The same stage labels must explain successful, retried, and blocked work.', choice: 'Use one five-stage view with scenario-specific reachability and evidence, backed by a strict fixture rather than a generic workflow interpreter.', consequence: 'Visitors can compare the runs directly, and the blocked scenario keeps QA and Delivery visible without making them selectable.' },
        { constraint: 'A later success can make an earlier failure disappear from a simple status panel.', choice: 'Keep QA attempts as immutable fixture history and render both the failed assertion and the debugger change beside the passing retry.', consequence: 'The completed sample still explains why it retried and what changed between attempts.' },
        { constraint: 'A merge label can overstate the controls that made the decision.', choice: 'Place the inspected defaults beside each terminal decision and describe automatic merge as the legacy path with merge-policy enforcement disabled.', consequence: 'The sample does not imply an enforced queue, sandbox, anomaly stop, hard cap, or universal human approval.' },
      ],
      credits: [
        'My contribution is the orchestration and review workflow around the participating agents.',
        'The examples are purpose-written fictional runs. They are not production logs, real pull requests, or captured repository pipelines.',
      ],
      limits: [
        'Merge enforcement, queue enforcement, sandboxing, and anomaly termination are off in the represented default configuration. Hard caps are unset.',
        'The separate review contexts do not establish different providers or models. The browser performs no model calls, subprocesses, repository actions, approvals, or network requests for the demo.',
        'Budget termination, staged rollback, and operator-confirmation outcomes remain follow-on examples.',
      ],
      about: "Deterministic portfolio simulation with purpose-written fictional task, review, QA, pull-request, and CI artifacts, checked September 12, 2026. The overview image shows the local portfolio UI, not a captured repository pipeline. The fixture contains no production identifiers or replay data. “Implemented” describes the source-backed capability; it does not claim that the displayed defaults provide active isolation or that a deployment was verified.",
    },
  },
};

/** Route metadata and body come from the same resolved development/public view. */
export function resolveAgentTeamPage(record: ProjectRecord) {
  const view = resolveDevelopmentProjectView(record);
  if (view.kind === 'not-found') return { view, metadata: null };
  const metadata = view.kind === 'rich'
    ? projectMetadata(view.record)
    : view.kind === 'rich-draft' && view.body.story
      ? { title: 'Agent Team | Work | Caleb Bolden', description: view.body.story.about }
      : null;
  return { view, metadata };
}
