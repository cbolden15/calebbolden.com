const rows = [
  {
    pain: 'Calls going to voicemail',
    painDesc: "You're with a client, three calls go unanswered. One was a $3K lead who booked with a competitor by lunch.",
    fix: 'AI picks up every call',
    fixDesc: 'Voice agent answers instantly, books the appointment, routes emergencies, handles FAQs. 24/7.',
    tag: 'AI Voice Agents',
  },
  {
    pain: 'Leads sitting for hours',
    painDesc: "Website forms pile up in your inbox. That hot lead from 8 AM? Still waiting at noon. They've moved on.",
    fix: '60-second follow-up',
    fixDesc: 'AI scores the lead, sends a personalized response, adds them to a nurture sequence. Automatically.',
    tag: 'Lead Capture + CRM',
  },
  {
    pain: 'Drowning in admin',
    painDesc: "An hour a day on invoices, calendar updates, data entry. It's the work you hate most and it never ends.",
    fix: 'Admin runs itself',
    fixDesc: 'Invoices auto-generate from completed jobs. Calendar syncs from the booking agent. Data entry eliminated.',
    tag: 'Workflow Automation',
  },
  {
    pain: "Marketing hasn't happened in weeks",
    painDesc: "You know you should post, send that newsletter, update the website. But you're too exhausted by 5 PM.",
    fix: 'Campaigns run while you sleep',
    fixDesc: 'AI posts to social, sends email/SMS campaigns, writes blog posts, handles SEO. You review over coffee.',
    tag: 'Marketing Engine',
  },
  {
    pain: "Can't afford to hire",
    painDesc: "You need a receptionist, a marketing person, someone to chase invoices. But payroll for three people isn't realistic.",
    fix: 'AI employees at 10% the cost',
    fixDesc: 'Virtual staff for front desk, social media, collections, customer service. They work 24/7 and never call in sick.',
    tag: 'AI Employees',
  },
  {
    pain: '47 unread emails every morning',
    painDesc: 'Urgent requests buried under spam. Client questions unanswered. You spend 45 minutes just sorting.',
    fix: 'Inbox triaged overnight',
    fixDesc: 'AI categorizes, auto-replies to common questions, flags what actually needs you. 3 items, not 47.',
    tag: 'Workflow Automation',
  },
];

export default function PainSolution() {
  return (
    <section id="services" style={{ padding: '80px 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-[11px] font-bold uppercase tracking-[3px] text-[#60A5FA] mb-4">
          What I Solve
        </div>
        <div
          className="text-[36px] md:text-[36px] font-extrabold mb-3"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}
        >
          Your problem. My system.
        </div>
        <div className="text-[15px] text-[#9CA3AF] mb-12 max-w-[520px]">
          Every row is a real pain point I&apos;ve eliminated for businesses like yours.
        </div>

        <div className="flex flex-col">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] items-center transition-colors duration-300 hover:bg-white/[0.01] md:hover:mx-[-24px] md:hover:px-6 hover:rounded-xl"
              style={{
                padding: '28px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                ...(i === 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : {}),
              }}
            >
              <div className="md:pr-6">
                <h3
                  className="text-[15px] font-bold mb-1"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FCA5A5' }}
                >
                  {row.pain}
                </h3>
                <p className="text-[13px] text-[#6B7280] leading-[1.5]">{row.painDesc}</p>
              </div>

              <div className="flex justify-center py-2 md:py-0 md:rotate-0 rotate-90">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="1.5"
                  opacity="0.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              <div className="md:pl-6">
                <h3
                  className="text-[15px] font-bold mb-1"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#86EFAC' }}
                >
                  {row.fix}
                </h3>
                <p className="text-[13px] text-[#9CA3AF] leading-[1.5]">{row.fixDesc}</p>
                <span
                  className="inline-block mt-[6px] text-[10px] font-semibold"
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(37,99,235,0.1)',
                    color: '#93C5FD',
                  }}
                >
                  {row.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
