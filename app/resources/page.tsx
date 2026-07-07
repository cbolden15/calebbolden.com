import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResourceGate from '@/components/ResourceGate';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Free tools and checklists for local businesses | Caleb Bolden',
  description: 'Two interactive tools and three printable checklists: AI readiness, revenue leaks, process mapping, website conversion, and local SEO.',
};

const resources = [
  {
    title: 'Is your business ready for AI?',
    detail: 'An 18-question scored self-assessment. Ten minutes, plain language, and you leave knowing what to do first at your score.',
    action: {
      type: 'link',
      href: '/tools/ai-readiness',
      label: 'Open the scorecard',
    },
  },
  {
    title: 'The revenue leak calculator',
    detail: 'Five numbers most owners never calculate: missed calls, slow quotes, no-shows, unanswered reviews, unused software. Live math, your figures.',
    action: {
      type: 'link',
      href: '/tools/revenue-leak',
      label: 'Open the calculator',
    },
  },
  {
    title: 'The one-hour process audit',
    detail: 'A printable worksheet that walks you through mapping one workflow, finding the waste, and pricing what it costs you weekly. Pen and paper, one hour.',
    action: {
      type: 'gate',
      file: '/downloads/one-hour-process-audit.pdf',
      magnet: 'process-audit-pdf',
    },
  },
  {
    title: 'The 20-point website checklist',
    detail: 'Does your site turn visitors into calls? Twenty items ordered by impact, each one actionable without code.',
    action: {
      type: 'gate',
      file: '/downloads/website-conversion-checklist.pdf',
      magnet: 'website-checklist-pdf',
    },
  },
  {
    title: 'Get found on Google',
    detail: 'The local SEO checklist: the one-time fixes first, then the weekly routine that does the compounding.',
    action: {
      type: 'gate',
      file: '/downloads/local-seo-checklist.pdf',
      magnet: 'local-seo-pdf',
    },
  },
] as const;

function RollLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-ink btn-roll">
      <span className="roll-box">
        <span className="roll-a">{label}</span>
        <span className="roll-b" aria-hidden="true">
          {label}
        </span>
      </span>
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <section className="graph-field graph-fade py-16 lg:py-24">
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <Reveal>
              <p className="anno anno-blue mb-5">free · no sales call required</p>
              <h1 className="type-display max-w-[14ch]" style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)' }}>
                Tools and checklists
              </h1>
              <p className="mt-6 max-w-xl" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                Everything here is the real first mile of my paid work, free. The tools run in your browser. The checklists are printable PDFs; leave an email and I will send new ones as I write them.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <div className="mx-auto w-[90%] max-w-[1200px]">
            <div>
              {resources.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div
                    className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-12 sm:items-center sm:gap-6"
                    style={{ borderTop: '1px solid var(--color-hairline)' }}
                  >
                    <h2
                      className="sm:col-span-3"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 650, color: 'var(--color-ink)' }}
                    >
                      {item.title}
                    </h2>
                    <p className="sm:col-span-6" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                      {item.detail}
                    </p>
                    <div className="flex sm:col-span-3 sm:justify-end">
                      {item.action.type === 'link' ? (
                        <RollLink href={item.action.href} label={item.action.label} />
                      ) : (
                        <ResourceGate file={item.action.file} magnet={item.action.magnet} />
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
