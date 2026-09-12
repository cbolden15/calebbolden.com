import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { notFound } from 'next/navigation';
import { projectRecords, evidenceManifest } from '@/lib/work/catalog';
import { resolveVoraPage } from '@/lib/work/projects/vora';
import { projectCaseStudyShell, projectDevelopmentCaseStudyShell } from '@/lib/work/public-content';
import { projectApprovedFixture, projectLocalFixture } from '@/lib/work/evidence';
import { initialVora, voraView, voraFixtureSchema, voraFixtureDTOSchema, projectVoraScenario } from '@/lib/work/demos/vora';

function routeRecord() {
  const record = projectRecords.find(project => project.slug === 'vora');
  if (!record) notFound();
  return record;
}

export function generateMetadata(): Metadata {
  return resolveVoraPage(routeRecord()).metadata ?? {};
}

export default async function VoraPage() {
  const record = routeRecord();
  const { view } = resolveVoraPage(record);
  if (view.kind === 'not-found') notFound();
  if (view.kind === 'rich' || view.kind === 'rich-draft') {
    const project = view.kind === 'rich'
      ? projectCaseStudyShell(record, evidenceManifest, projectRecords)
      : projectDevelopmentCaseStudyShell(record, projectRecords);
    if (!project) throw new Error('Vora rich view requires a complete story');
    const readBytes = (path: string) => readFileSync(join(process.cwd(), path));
    const selected = view.kind === 'rich'
      ? projectApprovedFixture({ manifest: evidenceManifest, snapshotId: view.body.interaction.snapshotId,
        fixturePath: 'lib/work/fixtures/vora.json', schema: voraFixtureSchema, projectScenario: projectVoraScenario, readBytes })
      : projectLocalFixture(readBytes('lib/work/fixtures/vora.json').toString(), voraFixtureSchema, projectVoraScenario,
        { manifest: evidenceManifest, readBytes });
    const fixture = voraFixtureDTOSchema.parse(selected);
    const first = voraView(initialVora, fixture);
    const { default: VoraDemo } = await import('@/components/work/demos/VoraDemo');
    return <WorkDetail project={project} reloadHref={view.kind === 'rich' ? view.destination : '/work/vora'} demonstration={
      <div className="p-5 sm:p-8 text-[var(--color-ink)]" style={{ fontSize: 17, lineHeight: 1.65 }}>
        <p className="anno anno-blue">Interactive simulation · sample data</p>
        <p className="mt-3">Approval depends on the configured action. This follow-up is conceptual; its exact supported action has not been verified.</p>
        <p className="mt-3 text-sm">{fixture.provenance.kind === 'approved' ? `Public example checked ${fixture.provenance.checkedDate}. ${fixture.provenance.disclosure}` : `${fixture.provenance.label} Public evidence review pending.`}</p>
        {fixture.provenance.kind === 'local-synthetic' && <p className="mt-3 text-sm">Overview poster placeholder. Reviewed media is not available yet.</p>}
        <section aria-label="Initial Vora request" className="mt-6 border-y border-[var(--color-hairline)] py-5">
          <h3 className="type-display text-xl">Initial example · Request received</h3>
          <p className="mt-3">{first.sample.business} · {first.sample.customer}</p>
          <blockquote className="mt-3">{first.sample.request}</blockquote>
          <p className="mt-3">Proposed follow-up: {first.sample.action}</p>
          <p className="mt-3">{first.caption}</p>
          <p className="mt-3 text-sm">This reference frame stays at the beginning. Current decisions appear in the interactive example below.</p>
        </section>
        <VoraDemo fixture={fixture} />
      </div>
    } />;
  }

  return (
    <WorkDetail
      name="Vora"
      status="live"
      sheet="work / vora"
      whatItIs="Vora is a CRM platform for service businesses. It answers missed calls by text, follows up on new leads, runs campaigns, and handles scheduling, all in one place instead of five disconnected tools."
      whoUsesIt="Owners of service businesses (home services, clinics, studios) who lose revenue to calls that go unanswered and leads that sit. It runs for my own companies first, then for clients."
      aiInside="A voice and messaging layer sits in front of the business. When a call is missed, an agent texts back within seconds, qualifies the lead, and books the job. A campaign agent sends email and SMS on a schedule. Everything writes to one record so nothing gets dropped between steps."
      techBands={[
        { label: 'dashboard', value: 'SvelteKit, server routes, Postgres' },
        { label: 'agents', value: 'MCP server exposing business tools to the model' },
        { label: 'messaging', value: 'Twilio voice and SMS, Resend and SendGrid email' },
        { label: 'billing', value: 'Stripe' },
        { label: 'infra', value: 'Docker, shared Caddy, self-hosted on Hetzner' },
      ]}
      stackLine="SvelteKit · Postgres · MCP · Twilio · Stripe · Docker · Hetzner"
      href="https://voratechnology.com"
    />
  );
}
