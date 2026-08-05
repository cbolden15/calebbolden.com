import type { Metadata } from 'next';
import ServicePage, { type ServicePageContent } from '@/components/ServicePage';
import MarketingPathFigure from '@/components/figures/MarketingPathFigure';

export const metadata: Metadata = {
  title: 'Online marketing for small businesses | Caleb Bolden',
  description: 'Follow-up systems, campaigns, and ads that pay for themselves. Marketing built on your sales process, starting with the leads you already have.',
};

const content: ServicePageContent = {
  serviceType: 'Online marketing',
  h1: "Marketing that follows up so you don't have to",
  intro: 'Most local businesses do not need more leads. They need to stop losing the ones they have. I build the follow-up machine first: replies, reminders, reviews, reactivation. Then, if the numbers say so, we buy traffic.',
  method: 'The audit maps what happens to a lead after it arrives: who answers, how fast, what happens on a missed call, who follows up and when. Marketing gets built where leads leak, which is almost never where the ad budget goes.',
  figure: <MarketingPathFigure />,
  deliverables: [
    {
      title: 'Speed to lead',
      detail: 'Missed-call text-back and replies within minutes, around the clock.',
    },
    {
      title: 'Campaigns people open',
      detail: "Email and SMS timed to your customer's rhythm, not a content calendar.",
    },
    {
      title: 'Reviews on autopilot',
      detail: 'Requests timed to the moment the job wraps, routed to the platforms that matter.',
    },
    {
      title: 'Ads, last',
      detail: 'Paid traffic only after the follow-up holds, so every click has somewhere to land.',
    },
    {
      title: 'One honest dashboard',
      detail: 'What came in, what it cost, what it closed.',
    },
  ],
  proof: 'I built Vora, a CRM platform that runs exactly this machinery for service businesses. Yours gets the same engine.',
  cta: 'The audit shows where your leads leak before we spend a dollar on new ones.',
};

export default function MarketingPage() {
  return <ServicePage {...content} />;
}
