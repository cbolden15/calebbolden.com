import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import WorkDetail from '@/components/WorkDetail';
import { projectRecords, evidenceManifest } from '@/lib/work/catalog';
import { projectApprovedFixture, projectLocalFixture } from '@/lib/work/evidence';
import { initialPrism, prismFixtureDTOSchema, prismFixtureSchema, prismView, projectPrismScenario } from '@/lib/work/demos/prism';
import { projectCaseStudyShell, projectDevelopmentCaseStudyShell } from '@/lib/work/public-content';
import { resolvePrismPage } from '@/lib/work/projects/prism';

function routeRecord() {
  const record = projectRecords.find(project => project.slug === 'prism');
  if (!record) notFound();
  return record;
}

export function generateMetadata(): Metadata {
  return resolvePrismPage(routeRecord()).metadata ?? {};
}

export default async function PrismPage() {
  const record = routeRecord();
  const { view } = resolvePrismPage(record);
  if (view.kind === 'not-found' || view.kind === 'legacy') notFound();
  const project = view.kind === 'rich'
    ? projectCaseStudyShell(record, evidenceManifest, projectRecords)
    : projectDevelopmentCaseStudyShell(record, projectRecords);
  if (!project) throw new Error('Prism rich view requires a complete story');

  const readBytes = (path: string) => readFileSync(join(process.cwd(), path));
  const selected = view.kind === 'rich'
    ? projectApprovedFixture({
        manifest: evidenceManifest,
        snapshotId: view.body.interaction.snapshotId,
        fixturePath: 'lib/work/fixtures/prism.json',
        schema: prismFixtureSchema,
        projectScenario: projectPrismScenario,
        readBytes,
      })
    : projectLocalFixture(
        readBytes('lib/work/fixtures/prism.json').toString(),
        prismFixtureSchema,
        projectPrismScenario,
        { manifest: evidenceManifest, readBytes },
      );
  const fixture = prismFixtureDTOSchema.parse(selected);
  const first = prismView(initialPrism, fixture);
  const { default: PrismDemo } = await import('@/components/work/demos/PrismDemo');

  return <WorkDetail project={project} reloadHref="/work/prism" demonstration={
    <div className="p-5 text-[var(--color-ink)] sm:p-8" style={{ fontSize: 17, lineHeight: 1.65 }}>
      <p className="anno anno-blue">Deterministic simulation</p>
      <p className="mt-3">Contract-derived simulation from Prism v0.1.0 public source.</p>
      <p className="mt-3 text-sm">
        {fixture.provenance.kind === 'approved'
          ? `Public example checked ${fixture.provenance.checkedDate}. ${fixture.provenance.disclosure}`
          : `${fixture.provenance.label} Public evidence and poster review pending.`}
      </p>
      <p className="mt-3 text-sm">Playback in this browser does not execute Prism, start a subprocess, call a provider, or read a local run.</p>
      <section aria-label="Initial Prism example" className="mt-6 border-y border-[var(--color-hairline)] py-5">
        <h3 className="type-display text-xl">Initial example · Ready to start</h3>
        <p className="mt-3 font-mono text-sm">{first.scenario.prompt}</p>
        <p className="mt-3">The result and receipt remain hidden until the sixth event.</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Six-event reference">
          {first.scenario.events.map((event, index) => <li key={event.type}><span className="anno mr-2">{String(index + 1).padStart(2, '0')}</span>{event.label}</li>)}
        </ol>
        <p className="mt-4 text-sm">This server-rendered reference stays available if the interactive controls cannot load.</p>
      </section>
      <PrismDemo fixture={fixture} />
    </div>
  } />;
}
