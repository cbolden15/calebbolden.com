import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

export const metadata: Metadata = {
  title: 'ChapterHQ | Work | Caleb Bolden',
  description: "ChapterHQ runs clubs, chapters, and nonprofits: members, dues, events, and an AI assistant that answers from the org's own records.",
};

export default function ChapterHQPage() {
  return (
    <WorkDetail
      name="ChapterHQ"
      status="live"
      sheet="work / chapterhq"
      whatItIs="ChapterHQ is a management platform for clubs, chapters, and nonprofits. It tracks members, collects dues, runs events, and answers member questions from the organization's own records."
      whoUsesIt="Volunteer-run organizations where the person doing the admin also has a day job. The assistant takes the repeat questions so a board member does not have to."
      aiInside="Member records, bylaws, and past decisions are embedded into a vector store. When someone asks a question, the assistant retrieves the org's own documents and answers from them, so the answer is grounded in that chapter's reality, not a generic guess."
      techBands={[
        { label: 'app', value: 'Next.js, Postgres with pgvector' },
        { label: 'data', value: 'Drizzle migrations, vector embeddings for retrieval' },
        { label: 'realtime', value: 'Pusher' },
        { label: 'billing', value: 'Stripe' },
        { label: 'infra', value: 'Docker, shared Caddy, self-hosted on Hetzner' },
      ]}
      stackLine="Next.js · Postgres + pgvector · Drizzle · Pusher · Stripe · Docker"
      href="https://chapterhq.ai"
    />
  );
}
