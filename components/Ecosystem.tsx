'use client';

const spokes = [
  {
    className: 'spoke-1',
    pos: { top: '6%', left: '50%', transform: 'translateX(-50%)' },
    title: 'AI Voice Agents',
    desc: 'Answer every call, book appointments, handle FAQs',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93C5FD" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    className: 'spoke-2',
    pos: { top: '20%', right: '4%' },
    title: 'Lead Capture',
    desc: 'Instant scoring, nurture sequences, zero leads lost',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93C5FD" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    className: 'spoke-3',
    pos: { bottom: '20%', right: '4%' },
    title: 'Smart CRM',
    desc: 'Pipeline tracking, customer insights, auto follow-up',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93C5FD" strokeWidth="1.5">
        <path d="M21.21 15.89A10 10 0 118 2.83" />
        <path d="M22 12A10 10 0 0012 2v10z" />
      </svg>
    ),
  },
  {
    className: 'spoke-4',
    pos: { bottom: '6%', left: '50%', transform: 'translateX(-50%)' },
    title: 'Marketing Engine',
    desc: 'Email, SMS, social, SEO, content generation',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93C5FD" strokeWidth="1.5">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 010 14.14" />
        <path d="M15.54 8.46a5 5 0 010 7.07" />
      </svg>
    ),
  },
  {
    className: 'spoke-5',
    pos: { bottom: '20%', left: '4%' },
    title: 'AI Employees',
    desc: 'Front desk, support, collections, social posting',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93C5FD" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="3" />
        <path d="M7 11V8a5 5 0 0110 0v3" />
      </svg>
    ),
  },
  {
    className: 'spoke-6',
    pos: { top: '20%', left: '4%' },
    title: 'Workflow Automation',
    desc: 'Connect tools, automate processes, eliminate data entry',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#93C5FD" strokeWidth="1.5">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

export default function Ecosystem() {
  return (
    <>
      <style>{`
        @keyframes hub-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .ecosystem-spoke:hover .spoke-card-inner {
          border-color: rgba(37,99,235,0.3);
          background: rgba(37,99,235,0.08);
          box-shadow: 0 0 30px rgba(37,99,235,0.15);
        }
        .ecosystem-spoke:hover {
          transform: scale(1.08);
          z-index: 20;
        }
      `}</style>

      <section className="relative" style={{ padding: '100px 0' }}>
        {/* Background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent 60%)',
          }}
        />

        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-[11px] font-bold uppercase tracking-[3px] text-[#60A5FA] mb-4 text-center">
            Your AI Ecosystem
          </div>
          <div
            className="text-[36px] font-extrabold mb-3 text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}
          >
            Everything works together
          </div>
          <div className="text-[15px] text-[#9CA3AF] mb-12 max-w-[520px] mx-auto text-center">
            These aren&apos;t separate tools. They&apos;re one connected system that gets smarter as your business grows.
          </div>

          {/* Hub-spoke diagram */}
          <div className="relative w-full max-w-[900px] mx-auto hidden md:block" style={{ height: '700px' }}>
            {/* Orbit ring */}
            <div
              className="absolute rounded-full"
              style={{
                top: '50%',
                left: '50%',
                width: '360px',
                height: '360px',
                border: '1px solid rgba(37,99,235,0.06)',
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* SVG connections */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 900 700" style={{ zIndex: 1 }}>
              {/* Glow lines */}
              <line x1="450" y1="350" x2="450" y2="115" stroke="rgba(96,165,250,0.06)" strokeWidth="3" />
              <line x1="450" y1="350" x2="450" y2="115" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
              <line x1="450" y1="350" x2="740" y2="200" stroke="rgba(96,165,250,0.06)" strokeWidth="3" />
              <line x1="450" y1="350" x2="740" y2="200" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
              <line x1="450" y1="350" x2="740" y2="500" stroke="rgba(96,165,250,0.06)" strokeWidth="3" />
              <line x1="450" y1="350" x2="740" y2="500" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
              <line x1="450" y1="350" x2="450" y2="590" stroke="rgba(96,165,250,0.06)" strokeWidth="3" />
              <line x1="450" y1="350" x2="450" y2="590" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
              <line x1="450" y1="350" x2="160" y2="500" stroke="rgba(96,165,250,0.06)" strokeWidth="3" />
              <line x1="450" y1="350" x2="160" y2="500" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
              <line x1="450" y1="350" x2="160" y2="200" stroke="rgba(96,165,250,0.06)" strokeWidth="3" />
              <line x1="450" y1="350" x2="160" y2="200" stroke="rgba(37,99,235,0.12)" strokeWidth="1" />

              {/* Arc paths */}
              <path d="M 450 115 Q 600 150 740 200" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M 740 200 Q 760 350 740 500" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M 740 500 Q 600 560 450 590" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M 450 590 Q 300 560 160 500" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M 160 500 Q 140 350 160 200" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <path d="M 160 200 Q 300 150 450 115" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
            </svg>

            {/* Hub center */}
            <div
              className="absolute flex flex-col items-center justify-center"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(96,165,250,0.08))',
                border: '2px solid rgba(37,99,235,0.3)',
                zIndex: 10,
                boxShadow: '0 0 60px rgba(37,99,235,0.15), 0 0 120px rgba(37,99,235,0.05)',
              }}
            >
              {/* Pulse rings */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: '-20px',
                  border: '1px solid rgba(37,99,235,0.1)',
                  animation: 'hub-pulse 4s ease-out infinite',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  inset: '-40px',
                  border: '1px solid rgba(37,99,235,0.05)',
                  animation: 'hub-pulse 4s ease-out infinite 1s',
                }}
              />

              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-[10px]"
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                  boxShadow: '0 0 24px rgba(37,99,235,0.4)',
                }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="text-[13px] font-bold text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Your Business
              </div>
              <div className="text-[10px] text-[#9CA3AF] text-center mt-[2px]">AI-Powered</div>
            </div>

            {/* Spokes */}
            {spokes.map((spoke, i) => (
              <div
                key={i}
                className="absolute ecosystem-spoke cursor-default transition-all duration-300"
                style={{ ...spoke.pos, zIndex: 5 }}
              >
                <div
                  className="spoke-card-inner text-center transition-all duration-300"
                  style={{
                    background: 'rgba(10,15,30,0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '16px',
                    width: '150px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[10px] inline-flex items-center justify-center mb-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(96,165,250,0.05))',
                      border: '1px solid rgba(37,99,235,0.2)',
                    }}
                  >
                    {spoke.icon}
                  </div>
                  <h3 className="text-[12px] font-bold mb-[3px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {spoke.title}
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF] leading-[1.4]">{spoke.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked layout */}
          <div className="md:hidden flex flex-col items-center gap-4">
            {/* Hub */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(96,165,250,0.08))',
                border: '2px solid rgba(37,99,235,0.3)',
                boxShadow: '0 0 60px rgba(37,99,235,0.15)',
              }}
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-2"
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                  boxShadow: '0 0 24px rgba(37,99,235,0.4)',
                }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="text-[13px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Business</div>
              <div className="text-[10px] text-[#9CA3AF]">AI-Powered</div>
            </div>

            {/* Spoke cards stacked */}
            {spokes.map((spoke, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  background: 'rgba(10,15,30,0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  width: '150px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-[10px] inline-flex items-center justify-center mb-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(96,165,250,0.05))',
                    border: '1px solid rgba(37,99,235,0.2)',
                  }}
                >
                  {spoke.icon}
                </div>
                <h3 className="text-[12px] font-bold mb-[3px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {spoke.title}
                </h3>
                <p className="text-[10px] text-[#9CA3AF] leading-[1.4]">{spoke.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
