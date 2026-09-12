import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import WorkDetail from '@/components/WorkDetail';
import { projectRecords, evidenceManifest } from '@/lib/work/catalog';
import { projectApprovedFixture, projectLocalFixture } from '@/lib/work/evidence';
import {
  centerView,
  controlCenterFixtureDTOSchema,
  controlCenterFixtureSchema,
  initialCenter,
  projectControlCenterScenario,
} from '@/lib/work/demos/control-center';
import { projectCaseStudyShell, projectDevelopmentCaseStudyShell } from '@/lib/work/public-content';
import { resolveControlCenterPage } from '@/lib/work/projects/control-center';

function routeRecord() {
  const record = projectRecords.find(project => project.slug === 'control-center');
  if (!record) notFound();
  return record;
}

export function generateMetadata(): Metadata {
  return resolveControlCenterPage(routeRecord()).metadata ?? {};
}

export default async function ControlCenterPage() {
  const record = routeRecord();
  const { view } = resolveControlCenterPage(record);
  if (view.kind === 'not-found' || view.kind === 'legacy') notFound();
  const project = view.kind === 'rich'
    ? projectCaseStudyShell(record, evidenceManifest, projectRecords)
    : projectDevelopmentCaseStudyShell(record, projectRecords);
  if (!project) throw new Error('Control Center rich view requires a complete story');

  const readBytes = (path: string) => readFileSync(join(process.cwd(), path));
  const selected = view.kind === 'rich'
    ? projectApprovedFixture({
        manifest: evidenceManifest,
        snapshotId: view.body.interaction.snapshotId,
        fixturePath: 'lib/work/fixtures/control-center.json',
        schema: controlCenterFixtureSchema,
        projectScenario: projectControlCenterScenario,
        readBytes,
      })
    : projectLocalFixture(
        readBytes('lib/work/fixtures/control-center.json').toString(),
        controlCenterFixtureSchema,
        projectControlCenterScenario,
        { manifest: evidenceManifest, readBytes },
      );
  const fixture = controlCenterFixtureDTOSchema.parse(selected);
  const first = centerView(initialCenter, fixture);
  const { default: ControlCenterDemo } = await import('@/components/work/demos/ControlCenterDemo');

  return <WorkDetail project={project} reloadHref="/work/control-center" demonstration={
    <div className="bg-[#0b1220] p-5 text-[#edf4ff] sm:p-8" style={{ fontSize: 17, lineHeight: 1.65 }}>
      <p className="font-mono text-xs uppercase tracking-widest text-sky-300">Dashboard example · sample data</p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div><h3 className="text-2xl font-semibold">Operator attention view</h3><p className="mt-2 max-w-[70ch] text-slate-300">A deterministic prototype for inspecting runs, decisions, sample spend, and a fictional deployment record.</p></div>
        <div className="rounded-md border border-amber-300/50 bg-amber-200/10 px-4 py-3 text-sm text-amber-100"><span className="font-medium">Prototype</span><br />Implemented dashboard; deployment not verified.</div>
      </div>
      <p className="mt-4 text-sm text-slate-300">
        {fixture.provenance.kind === 'approved'
          ? `Public example checked ${fixture.provenance.checkedDate}. ${fixture.provenance.disclosure}`
          : `${fixture.provenance.label} Public evidence and poster review pending.`}
      </p>
      <p className="mt-2 text-sm text-slate-300">Media: text-based sample fixture. Role: operator attention dashboard. Maturity: Prototype.</p>
      <p className="mt-2 text-sm text-slate-300">Limits: the browser does not query services, start runs, make decisions, deploy software, use storage, or open a live connection.</p>

      <section aria-label="Initial Control Center example" className="mt-6 border-y border-slate-700 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-mono text-xs uppercase tracking-widest text-sky-300">Succeeds · Started · Show all</p><h3 className="mt-2 text-xl font-semibold">Initial server reference</h3></div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Frozen 2026-09-01 12:00 UTC</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">Runs</p><p className="mt-2 text-2xl font-semibold">{first.counts.runs}</p></div>
          <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">Decisions</p><p className="mt-2 text-2xl font-semibold">{first.counts.decisions}</p></div>
          <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">{first.spend.label}</p><p className="mt-2 text-2xl font-semibold">{first.spend.amount}</p></div>
          <div className="rounded-md border border-slate-700 p-4"><p className="text-xs text-slate-400">Deployments</p><p className="mt-2 text-2xl font-semibold">{first.deployments.length}</p></div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-slate-700 bg-slate-900 p-4"><p className="font-medium">{first.runs[0].name}</p><p className="mt-2 text-xs text-slate-400">{first.runs[0].sourceType} · {first.runs[0].status} · {first.runs[0].age} old</p></div>
          <div className="rounded-md border border-slate-700 bg-slate-900 p-4"><p className="font-medium">{first.decisions[0].name}</p><p className="mt-2 text-xs text-slate-400">{first.decisions[0].sourceType} · Resolved · {first.decisions[0].age} old</p></div>
        </div>
        <p className="mt-5 text-sm text-slate-300">This frame stays available if the controls cannot load. The complete success, failure, attention-filter, detail, deployment, and Reset walkthrough remains below it.</p>
      </section>
      <ControlCenterDemo fixture={fixture} />
    </div>
  } />;
}
