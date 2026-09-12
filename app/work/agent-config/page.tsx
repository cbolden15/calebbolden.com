import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import WorkDetail from '@/components/WorkDetail';
import styles from '@/components/work/Showcase.module.css';
import { projectRecords, evidenceManifest } from '@/lib/work/catalog';
import { projectApprovedFixture, projectLocalFixture } from '@/lib/work/evidence';
import {
  agentConfigFixtureDTOSchema,
  agentConfigFixtureSchema,
  configView,
  initialConfig,
  projectAgentConfigScenario,
  type ConfigVariant,
} from '@/lib/work/demos/agent-config';
import { projectCaseStudyShell, projectDevelopmentCaseStudyShell } from '@/lib/work/public-content';
import { resolveAgentConfigPage } from '@/lib/work/projects/agent-config';

function routeRecord() {
  const record = projectRecords.find(project => project.slug === 'agent-config');
  if (!record) notFound();
  return record;
}

export function generateMetadata(): Metadata {
  return resolveAgentConfigPage(routeRecord()).metadata ?? {};
}

function ServerOutput({ name, output }: {
  name: string;
  output: { variant: ConfigVariant; content: string; highlight: string; status: 'Current' | 'Out of date' };
}) {
  const [before, after] = output.content.split(output.highlight);
  return (
    <section className="min-w-0 bg-[var(--color-ink)] p-5 text-[var(--color-surface)]" aria-label={`${name} initial illustrative output`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="font-mono text-xs uppercase tracking-widest">{name}</p><p className="mt-1 text-xs">{output.variant === 'brief' ? 'Brief' : 'Detailed'} output</p></div>
        <p className="font-mono text-xs uppercase tracking-widest">{output.status}</p>
      </div>
      <div className={`${styles.codePanel} mt-5`}>
        <pre className="font-mono text-sm"><code>{before}<mark className="bg-amber-200 px-1 text-[var(--color-ink)]">{output.highlight}</mark>{after}</code></pre>
      </div>
    </section>
  );
}

export default async function AgentConfigPage() {
  const record = routeRecord();
  const { view } = resolveAgentConfigPage(record);
  if (view.kind === 'not-found' || view.kind === 'legacy') notFound();
  const project = view.kind === 'rich'
    ? projectCaseStudyShell(record, evidenceManifest, projectRecords)
    : projectDevelopmentCaseStudyShell(record, projectRecords);
  if (!project) throw new Error('Agent Config rich view requires a complete story');

  const readBytes = (path: string) => readFileSync(join(process.cwd(), path));
  const selected = view.kind === 'rich'
    ? projectApprovedFixture({
        manifest: evidenceManifest,
        snapshotId: view.body.interaction.snapshotId,
        fixturePath: 'lib/work/fixtures/agent-config.json',
        schema: agentConfigFixtureSchema,
        projectScenario: projectAgentConfigScenario,
        readBytes,
      })
    : projectLocalFixture(
        readBytes('lib/work/fixtures/agent-config.json').toString(),
        agentConfigFixtureSchema,
        projectAgentConfigScenario,
        { manifest: evidenceManifest, readBytes },
      );
  const fixture = agentConfigFixtureDTOSchema.parse(selected);
  const first = configView(initialConfig, fixture);
  const { default: AgentConfigDemo } = await import('@/components/work/demos/AgentConfigDemo');

  return <WorkDetail project={project} reloadHref="/work/agent-config" demonstration={
    <div className="p-5 text-[var(--color-ink)] sm:p-8" style={{ fontSize: 17, lineHeight: 1.65 }}>
      <p className="anno anno-blue">Compiler example · fixture simulation</p>
      <h3 className="type-display mt-3 text-2xl">Illustrative outputs</h3>
      <p className="mt-3 max-w-[70ch]">A harmless formatting preference rendered as purpose-written Brief and Detailed examples. No real compiler output or source stamp is shown.</p>
      <p className="mt-3 text-sm">
        {fixture.provenance.kind === 'approved'
          ? `Public example checked ${fixture.provenance.checkedDate}. ${fixture.provenance.disclosure}`
          : `${fixture.provenance.label} Public evidence and poster review pending.`}
      </p>
      <p className="mt-3 text-sm">Media: text-based illustrative fixture. Role: shared policy comparison. Maturity: Implemented.</p>
      <p className="mt-2 text-sm">Limits: this browser example does not read configuration, invoke a compiler or model, change a repository, use storage, or contact a service.</p>

      <section aria-label="Initial Agent Config example" className="mt-6 border-y border-[var(--color-hairline)] py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="anno anno-blue">Brief · initial server reference</p><h3 className="type-display mt-2 text-2xl">{first.fragment.heading}</h3></div>
          <p className="anno">Text-based sample evidence</p>
        </div>
        <div className={`${styles.decisions} mt-6`}>
          <section className="min-w-0 border border-[var(--color-hairline)] p-5" aria-label="Initial shared fragment">
            <p className="anno anno-blue">Shared fragment · Brief</p>
            <p className="mt-4">{first.fragment.content}</p>
          </section>
          <ServerOutput name="Claude Code" output={first.claudeCode} />
          <ServerOutput name="Codex" output={first.codex} />
        </div>
        <p className="mt-5 text-sm">Both illustrative outputs are Current. This frame stays available if the controls cannot load, and the complete Brief, Detailed, stale, regenerate, and Reset walkthrough remains below it.</p>
      </section>
      <AgentConfigDemo fixture={fixture} />
    </div>
  } />;
}
