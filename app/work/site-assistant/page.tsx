import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

export const metadata: Metadata = {
  title: 'Site assistant | Work | Caleb Bolden',
  description: 'The chat assistant on this site is a live agent: it answers questions about the work and helps a visitor scope what AI could take off their plate.',
};

export default function SiteAssistantPage() {
  return (
    <WorkDetail
      name="Site assistant"
      status="live"
      sheet="work / site-assistant"
      whatItIs="The chat assistant in the corner of this site is a working agent, not a demo. It answers questions about what I build and helps a visitor think through where AI would pay in their own business."
      whoUsesIt="Anyone reading the site who would rather ask than dig. It is the same pattern I build for clients, running on my own site so you can try it before you buy it."
      aiInside="A model with a set of typed tools it can call: pull up a service, start the readiness scorecard, hand off to the audit funnel. The tools are defined with a schema so the model can only do what it is allowed to do, which is how these stay safe in production."
      techBands={[
        { label: 'model', value: 'Gemini via the Vercel AI SDK' },
        { label: 'tools', value: 'Zod-typed tool definitions in lib/chat' },
        { label: 'ui', value: 'React streaming chat, Next.js route handler' },
      ]}
      stackLine="Next.js · Vercel AI SDK · Gemini · Zod tools"
      href={null}
    />
  );
}
