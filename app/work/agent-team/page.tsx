import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import WorkDetail from '@/components/WorkDetail';
import { projectRecords, evidenceManifest } from '@/lib/work/catalog';
import { projectApprovedFixture, projectLocalFixture } from '@/lib/work/evidence';
import { agentTeamFixtureDTOSchema, agentTeamFixtureSchema, initialTeam, projectAgentTeamScenario, teamView } from '@/lib/work/demos/agent-team';
import { projectCaseStudyShell, projectDevelopmentCaseStudyShell } from '@/lib/work/public-content';
import { resolveAgentTeamPage } from '@/lib/work/projects/agent-team';

function routeRecord() {
  const record = projectRecords.find(project => project.slug === 'agent-team');
  if (!record) notFound();
  return record;
}

export function generateMetadata(): Metadata {
  return resolveAgentTeamPage(routeRecord()).metadata ?? {};
}

export default async function AgentTeamPage() {
  const record = routeRecord();
  const { view } = resolveAgentTeamPage(record);
  if (view.kind === 'not-found' || view.kind === 'legacy') notFound();
  const project = view.kind === 'rich'
    ? projectCaseStudyShell(record, evidenceManifest, projectRecords)
    : projectDevelopmentCaseStudyShell(record, projectRecords);
  if (!project) throw new Error('Agent Team rich view requires a complete story');

  const readBytes = (path: string) => readFileSync(join(process.cwd(), path));
  const selected = view.kind === 'rich'
    ? projectApprovedFixture({
        manifest: evidenceManifest,
        snapshotId: view.body.interaction.snapshotId,
        fixturePath: 'lib/work/fixtures/agent-team.json',
        schema: agentTeamFixtureSchema,
        projectScenario: projectAgentTeamScenario,
        readBytes,
      })
    : projectLocalFixture(
        readBytes('lib/work/fixtures/agent-team.json').toString(),
        agentTeamFixtureSchema,
        projectAgentTeamScenario,
        { manifest: evidenceManifest, readBytes },
      );
  const fixture = agentTeamFixtureDTOSchema.parse(selected);
  const first = teamView(initialTeam, fixture);
  const { default: AgentTeamDemo } = await import('@/components/work/demos/AgentTeamDemo');

  return <WorkDetail project={project} reloadHref="/work/agent-team" demonstration={
    <div className="p-5 text-[var(--color-ink)] sm:p-8" style={{ fontSize: 17, lineHeight: 1.65 }}>
      <p className="anno anno-blue">Sample run · deterministic simulation</p>
      <p className="mt-3">Fictional repository, task, review, QA, draft PR, and CI artifacts.</p>
      <p className="mt-3 text-sm">
        {fixture.provenance.kind === 'approved'
          ? `Public example checked ${fixture.provenance.checkedDate}. ${fixture.provenance.disclosure}`
          : `${fixture.provenance.label} Public evidence and poster review pending.`}
      </p>
      <p className="mt-3 text-sm">Role: orchestration and review workflow. Maturity: Implemented. The browser does not run agents, contact providers, change a repository, or merge code.</p>
      <section aria-label="Initial Agent Team example" className="mt-6 border-y border-[var(--color-hairline)] py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="anno anno-blue">Passes review · 1 of 5</p>
            <h3 className="type-display mt-2 text-2xl">{first.visibleStage.label}</h3>
          </div>
          <p className="anno">Text-based sample evidence</p>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><dt className="anno">Role</dt><dd className="mt-1">{first.visibleStage.role}</dd></div>
          <div><dt className="anno">Decision</dt><dd className="mt-1">{first.visibleStage.decision}</dd></div>
        </dl>
        <p className="mt-4 font-mono text-sm">{first.visibleStage.artifact}</p>
        <ol className="mt-5 grid gap-2 sm:grid-cols-5" aria-label="Five-stage reference">
          {first.scenario.stages.map((stage, index) => <li key={stage.id}><span className="anno mr-2">{String(index + 1).padStart(2, '0')}</span>{stage.label}</li>)}
        </ol>
        <p className="mt-5 text-sm">Default configuration: merge enforcement off; queue enforcement off; sandboxing off; anomaly termination off; hard caps unset.</p>
        <p className="mt-3 text-sm">This server-rendered reference stays available if the interactive controls cannot load. The complete Passes review, QA retry, and Security block walkthroughs remain below it.</p>
      </section>
      <AgentTeamDemo fixture={fixture} />
    </div>
  } />;
}
