import type { Metadata } from 'next';
import ServicePage, { type ServicePageContent } from '@/components/ServicePage';
import WebDevPathFigure from '@/components/figures/WebDevPathFigure';

export const metadata: Metadata = {
  title: 'Website development for small businesses | Caleb Bolden',
  description: 'Websites built as working parts of your sales process, not brochures. Fast, measurable, and wired into your follow-up. For local small businesses.',
};

const content: ServicePageContent = {
  serviceType: 'Website development',
  h1: 'Your website is a step in your sales process',
  intro: "Most small-business sites are brochures. They look fine and do nothing. I build websites as working parts of the operation: they catch the customers you'd miss, book the jobs, and hand every lead to follow-up that happens.",
  method: 'Before I build a page, I map the path a customer takes to hire you: how they find you, what they check, where they hesitate, who they compare you against. The site gets built where that path leaks. It is the same process mapping that drives my AI work, applied to your storefront.',
  figure: <WebDevPathFigure />,
  deliverables: [
    {
      title: 'Fast by default',
      detail: 'Pages that load in under two seconds on a phone, because that is where your customers are.',
    },
    {
      title: 'Copy that answers',
      detail: 'Written around the questions customers ask before they hire you, in plain language.',
    },
    {
      title: 'Wired to your day',
      detail: 'Booking, quotes, and contact land in your phone and inbox, not in a form nobody checks.',
    },
    {
      title: 'An assistant, if it earns it',
      detail: 'The same kind of AI agent that runs on this site, added only when it pays for itself.',
    },
    {
      title: 'Numbers you can read',
      detail: 'Analytics reduced to what matters: visits, calls, bookings. Five minutes a week.',
    },
  ],
  proof: 'This site, Vora, and ChapterHQ are all my builds, running in production. The assistant in the corner is not a mockup.',
  cta: 'The audit maps how customers reach you today and where the site fits. If a new site is not the bottleneck, I will tell you what is.',
};

export default function WebDevelopmentPage() {
  return <ServicePage {...content} />;
}
