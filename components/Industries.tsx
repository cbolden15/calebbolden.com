'use client';

const pills = [
  'Home Services',
  'Salon & Spa',
  'Fitness & Gym',
  'Healthcare',
  'Pet Services',
  'Property Management',
  'Interior Design',
  'Professional Services',
  'General',
];

export default function Industries() {
  return (
    <section id="industries" style={{ padding: '60px 0 80px' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-[11px] font-bold uppercase tracking-[3px] text-[#60A5FA] mb-4">
          Industries
        </div>
        <div
          className="text-[36px] font-extrabold mb-3"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}
        >
          Built for your business
        </div>
        <div className="text-[15px] text-[#9CA3AF] mb-12 max-w-[520px]">
          Industry-specific solutions, not generic templates.
        </div>

        <div className="flex flex-wrap gap-[10px]">
          {pills.map((pill, i) => (
            <div
              key={i}
              className="text-[14px] font-medium text-[#9CA3AF] cursor-default transition-all duration-300 hover:text-white"
              style={{
                padding: '10px 20px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(37,99,235,0.25)';
                el.style.background = 'rgba(37,99,235,0.06)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.background = 'transparent';
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
