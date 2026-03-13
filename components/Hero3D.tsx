'use client';

export default function Hero3D() {
  return (
    <>
      <style>{`
        @keyframes orb-breathe {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes orb-secondary {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes float-main {
          0%, 100% { transform: rotateY(28deg) rotateX(-8deg) translateZ(40px) translateY(0); }
          50% { transform: rotateY(28deg) rotateX(-8deg) translateZ(40px) translateY(-14px); }
        }
        @keyframes float-stats {
          0%, 100% { transform: rotateY(-18deg) rotateX(12deg) translateZ(80px) translateY(0); }
          50% { transform: rotateY(-18deg) rotateX(12deg) translateZ(80px) translateY(-10px); }
        }
        @keyframes float-activity {
          0%, 100% { transform: rotateY(20deg) rotateX(14deg) translateZ(-20px) translateY(0); }
          50% { transform: rotateY(20deg) rotateX(14deg) translateZ(-20px) translateY(-16px); }
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 rgba(34,197,94,0); }
          50% { box-shadow: 0 0 12px rgba(34,197,94,0.3); }
        }
        @keyframes bar-grow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <section className="relative" style={{ padding: '120px 0 100px' }}>
        {/* Hero background glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '700px',
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, rgba(96,165,250,0.04) 40%, transparent 65%)',
          }}
        />

        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column: text */}
            <div>
              <div
                className="inline-flex items-center gap-2 mb-6"
                style={{
                  padding: '4px 4px 4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span className="text-[12px] text-[#9CA3AF]">AI Solutions Consultant</span>
                <span
                  className="text-[11px] font-semibold text-white"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: '#2563EB',
                  }}
                >
                  Available
                </span>
              </div>

              <h1
                className="text-4xl md:text-[48px] font-extrabold leading-[1.1] mb-5"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1.5px' }}
              >
                I automate the work{' '}
                <span className="text-[#60A5FA]">you shouldn&apos;t be doing</span>
              </h1>

              <p className="text-[16px] text-[#9CA3AF] mb-8 leading-[1.7]">
                Small businesses lose hours every day to tasks that AI can handle. I build the systems that give you that time back. Tell the chatbot about your business and see what&apos;s possible.
              </p>
            </div>

            {/* Right column: 3D dashboard scene */}
            <div
              className="relative h-[300px] md:h-[420px]"
              style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
            >
              {/* Bottom glow */}
              <div
                className="absolute"
                style={{
                  bottom: '-30px',
                  left: '5%',
                  right: '5%',
                  height: '80px',
                  background: 'radial-gradient(ellipse, rgba(37,99,235,0.25), transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />

              {/* Center orb glow */}
              <div
                className="absolute"
                style={{
                  top: '40%',
                  left: '45%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(37,99,235,0.2), rgba(96,165,250,0.05) 50%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(50px)',
                  zIndex: 0,
                  animation: 'orb-breathe 8s ease-in-out infinite',
                }}
              />

              {/* Secondary orb */}
              <div
                className="absolute"
                style={{
                  top: '20%',
                  right: '15%',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  zIndex: 0,
                  animation: 'orb-secondary 10s ease-in-out infinite',
                }}
              />

              {/* Main dashboard card */}
              <div
                className="absolute"
                style={{
                  width: '320px',
                  height: '250px',
                  top: '30px',
                  left: '10px',
                  background: 'rgba(10,15,30,0.8)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(96,165,250,0.12)',
                  borderRadius: '18px',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transformStyle: 'preserve-3d',
                  animation: 'float-main 6s ease-in-out infinite',
                  zIndex: 3,
                  padding: '24px',
                }}
              >
                <div className="flex justify-between items-center mb-5">
                  <div className="text-[13px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Dashboard</div>
                  <div
                    className="text-[10px] font-semibold"
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(34,197,94,0.15)',
                      color: '#4ADE80',
                      animation: 'badge-pulse 3s ease-in-out infinite',
                    }}
                  >
                    Live
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div
                      className="text-[24px] font-extrabold"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: '#93C5FD',
                        textShadow: '0 0 20px rgba(96,165,250,0.3)',
                      }}
                    >
                      47
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-[2px]">Calls Handled</div>
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-[24px] font-extrabold"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: '#93C5FD',
                        textShadow: '0 0 20px rgba(96,165,250,0.3)',
                      }}
                    >
                      12
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-[2px]">Leads Captured</div>
                  </div>
                </div>
                <div className="flex gap-1 items-end h-[56px]">
                  {[60, 80, 45, 95, 70, 85, 55].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[3px]"
                      style={{
                        height: `${h}%`,
                        background: 'linear-gradient(180deg, #60A5FA, #2563EB)',
                        boxShadow: '0 0 8px rgba(37,99,235,0.3)',
                        animation: `bar-grow 4s ease-in-out infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Stats card */}
              <div
                className="absolute hidden md:block"
                style={{
                  width: '210px',
                  height: '150px',
                  top: '0',
                  right: '0',
                  background: 'rgba(10,15,30,0.8)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(96,165,250,0.12)',
                  borderRadius: '18px',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transformStyle: 'preserve-3d',
                  animation: 'float-stats 5s ease-in-out infinite',
                  zIndex: 4,
                  padding: '20px',
                }}
              >
                {[
                  { color: '#60A5FA', shadow: 'rgba(96,165,250,0.6)', label: 'Automations', val: '50+' },
                  { color: '#4ADE80', shadow: 'rgba(74,222,128,0.6)', label: 'Industries', val: '9' },
                  { color: '#FBBF24', shadow: 'rgba(251,191,36,0.6)', label: 'Saved', val: '$2M+' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-[10px]" style={{ marginBottom: i < 2 ? '12px' : 0 }}>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: stat.color, boxShadow: `0 0 12px ${stat.shadow}` }}
                    />
                    <div className="flex-1 text-[11px] text-[#9CA3AF]">{stat.label}</div>
                    <div className="text-[13px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {stat.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity card */}
              <div
                className="absolute"
                style={{
                  width: '250px',
                  height: '170px',
                  bottom: '0',
                  left: '50px',
                  background: 'rgba(10,15,30,0.8)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(96,165,250,0.12)',
                  borderRadius: '18px',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  transformStyle: 'preserve-3d',
                  animation: 'float-activity 7s ease-in-out infinite',
                  zIndex: 2,
                  padding: '18px',
                }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#9CA3AF] mb-[14px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Live Activity
                </div>

                {[
                  {
                    bgColor: 'rgba(37,99,235,0.15)',
                    stroke: '#60A5FA',
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    ),
                    bold: 'Call answered',
                    text: ' for Dr. Smith',
                    time: '2m ago',
                  },
                  {
                    bgColor: 'rgba(34,197,94,0.15)',
                    stroke: '#4ADE80',
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    ),
                    bold: 'New lead',
                    text: ' from website',
                    time: '5m ago',
                  },
                  {
                    bgColor: 'rgba(168,85,247,0.15)',
                    stroke: '#C084FC',
                    icon: (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    bold: 'Email triaged',
                    text: ' as urgent',
                    time: '8m ago',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-[10px]" style={{ marginBottom: i < 2 ? '10px' : 0 }}>
                    <div
                      className="w-6 h-6 rounded-[6px] flex items-center justify-center"
                      style={{ background: item.bgColor }}
                    >
                      {item.icon}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF]">
                      <strong className="text-white font-semibold">{item.bold}</strong>
                      {item.text}
                    </div>
                    <div className="text-[9px] ml-auto whitespace-nowrap" style={{ color: 'rgba(156,163,175,0.5)' }}>
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
