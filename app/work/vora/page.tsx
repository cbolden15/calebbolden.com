import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

export const metadata: Metadata = {
  title: 'Vora | Work | Caleb Bolden',
  description: 'Vora is an AI CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.',
};

export default function VoraPage() {
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
