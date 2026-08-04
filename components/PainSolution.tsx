'use client';

import { useState } from 'react';
import Reveal from './Reveal';

// The waste log: each row is a pain point found in real businesses, opened to
// show the fix. Hairline-divided rows (working-wall direction), single-open
// accordion, mono tags name the system category.

const rows = [
  {
    pain: 'Calls going to voicemail',
    painDesc: "You're with a client, three calls go unanswered. One was a $3K lead who booked with a competitor by lunch.",
    fix: 'AI picks up every call',
    fixDesc: 'Voice agent answers instantly, books the appointment, routes emergencies, handles FAQs. 24/7.',
    tag: 'voice',
  },
  {
    pain: 'Leads sitting for hours',
    painDesc: "Website forms pile up in your inbox. That hot lead from 8 AM? Still waiting at noon. They've moved on.",
    fix: '60-second follow-up',
    fixDesc: 'AI scores the lead, sends a personalized response, adds them to a nurture sequence. Automatically.',
    tag: 'crm',
  },
  {
    pain: 'Drowning in admin',
    painDesc: "An hour a day on invoices, calendar updates, data entry. It's the work you hate most and it never ends.",
    fix: 'Admin runs itself',
    fixDesc: 'Invoices auto-generate from completed work. Calendar syncs from the booking agent. Data entry eliminated.',
    tag: 'workflow',
  },
  {
    pain: "Marketing hasn't happened in weeks",
    painDesc: "You know you should post, send that newsletter, update the website. But you're too exhausted by 5 PM.",
    fix: 'Campaigns run while you sleep',
    fixDesc: 'AI posts to social, sends email/SMS campaigns, writes blog posts, handles SEO. You review over coffee.',
    tag: 'marketing',
  },
  {
    pain: "Can't afford to hire",
    painDesc: "You need a receptionist, a marketing person, someone to chase invoices. But payroll for three people isn't realistic.",
    fix: 'Coverage without a new hire',
    fixDesc: 'Virtual staff for front desk, social media, collections, customer service. They work 24/7 and never call in sick.',
    tag: 'agents',
  },
  {
    pain: '47 unread emails every morning',
    painDesc: 'Urgent requests buried under spam. Client questions unanswered. You spend 45 minutes just sorting.',
    fix: 'Inbox triaged overnight',
    fixDesc: 'AI categorizes, auto-replies to common questions, flags what actually needs you. 3 items, not 47.',
    tag: 'workflow',
  },
  {
    pain: 'Documents pile up waiting to be processed',
    painDesc: 'Intake forms, contracts, and PDFs sit in a queue. Someone has to read each one, pull the fields, and file it. That someone is expensive and slow.',
    fix: 'Documents processed on arrival',
    fixDesc: 'An agent reads each document, extracts the fields, and files it to the right record. A person reviews the exceptions, not the whole stack.',
    tag: 'docs',
  },
  {
    pain: 'Client onboarding takes a week of back-and-forth',
    painDesc: 'Every new client means the same emails, the same forms, the same chasing for missing information. It stalls the work and it looks unpolished.',
    fix: 'Onboarding that runs itself',
    fixDesc: 'The system collects intake, checks it for gaps, chases what is missing, and sets up the account, so the first real conversation is about the work.',
    tag: 'workflow',
  },
  {
    pain: 'The answer is buried in old files',
    painDesc: 'A client asks a question and the answer is in a file from two years ago that nobody can find. So it gets re-answered from scratch, sometimes wrong.',
    fix: 'Answers from your own records',
    fixDesc: 'A knowledge assistant searches your documents and answers with the source attached, so the team stops re-deriving what the firm already knew.',
    tag: 'knowledge',
  },
];

export default function PainSolution() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* Statement */}
        <div className="lg:col-span-5">
          <Reveal>
            <h2 className="type-display mb-6" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
              Your problem. My system.
            </h2>
            <p className="max-w-md" style={{ fontSize: 16, color: 'var(--color-ink-muted)' }}>
              Every row comes from a real business. Open one to see the fix I build for it.
            </p>
          </Reveal>
        </div>

        {/* Waste log */}
        <div className="lg:col-span-7" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          {rows.map((row, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={row.pain} delay={i * 50}>
                <div style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:bg-[var(--color-surface)]"
                    aria-expanded={isOpen}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 18,
                        fontWeight: 600,
                        color: isOpen ? 'var(--color-blue)' : 'var(--color-ink)',
                      }}
                    >
                      {row.pain}
                    </span>
                    <span className="anno flex shrink-0 items-center gap-2">
                      {!isOpen && <span>{row.tag}</span>}
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 12 12"
                        className={`h-3 w-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                          isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                      >
                        <path d="M6 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`pb-6 transition-opacity duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:delay-0 motion-reduce:transition-none ${
                          isOpen ? 'opacity-100 delay-[80ms]' : 'opacity-0 delay-0'
                        }`}
                      >
                        <p className="max-w-xl" style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>
                          {row.painDesc}
                        </p>
                        <div
                          className="mt-4 max-w-xl rounded-[2px] p-4"
                          style={{ background: 'var(--color-blue-wash)' }}
                        >
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--color-blue-deep)', marginBottom: 4 }}>
                            {row.fix}
                          </h3>
                          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-ink-muted)' }}>
                            {row.fixDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
