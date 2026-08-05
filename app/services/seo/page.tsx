import type { Metadata } from 'next';
import ServicePage, { type ServicePageContent } from '@/components/ServicePage';
import SeoPathFigure from '@/components/figures/SeoPathFigure';

export const metadata: Metadata = {
  title: 'SEO for small businesses | Caleb Bolden',
  description: 'Search visibility built on how customers find and choose you. Local SEO, technical fixes, and content with measurable results. No subscription traps.',
};

const content: ServicePageContent = {
  serviceType: 'Search engine optimization',
  h1: 'Show up when your customers go looking',
  intro: 'SEO for a local business is not a mystery and not a monthly mystery invoice. It is a finite list of fixes and a steady publishing habit. I do the fixes, set up the habit, and show you the numbers.',
  method: 'The audit maps how customers find you today: search, referrals, reviews, word of mouth. SEO work starts where that map shows you losing people to competitors, not with a generic checklist.',
  figure: <SeoPathFigure />,
  deliverables: [
    {
      title: 'The technical pass',
      detail: 'Speed, mobile rendering, indexing, and structured data. Done once, done right.',
    },
    {
      title: 'Local presence',
      detail: 'Google Business Profile, review flow, and service-area pages that match how people search.',
    },
    {
      title: 'Content with a job',
      detail: 'Pages that answer real customer questions, mapped to what they search before hiring.',
    },
    {
      title: 'Three numbers monthly',
      detail: 'A report you can read in one minute: found, contacted, booked. No vanity charts.',
    },
  ],
  proof: 'I run this playbook on my own products and this site. You can check the work: search for it.',
  cta: 'The audit tells us whether search is your bottleneck. If it is not, I will say so and point the budget somewhere useful.',
};

export default function SeoPage() {
  return <ServicePage {...content} />;
}
