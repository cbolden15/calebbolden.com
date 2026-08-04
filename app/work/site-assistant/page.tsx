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
      media={
        <div>
          <video
            src="/video/assistant-demo.mp4"
            poster="/video/assistant-demo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full motion-reduce:hidden"
            style={{ border: '1px solid var(--color-hairline)', borderRadius: 2 }}
            aria-label="Screen recording of a test conversation with the site assistant: an HVAC owner asks about missed after-hours calls, and the agent explains voice agents that answer the phone, book appointments, and route emergency calls"
          />
          {/* Reduced-motion fallback: the final frame of the same conversation */}
          <img
            src="/video/assistant-demo-poster.jpg"
            alt="The end of a test conversation with the site assistant, showing its answer about voice agents that handle missed after-hours calls"
            className="hidden w-full motion-reduce:block"
            style={{ border: '1px solid var(--color-hairline)', borderRadius: 2 }}
          />
          <p className="anno mt-3">a test conversation with the live assistant, recorded in real time · nothing staged beyond the question</p>
        </div>
      }
    />
  );
}
