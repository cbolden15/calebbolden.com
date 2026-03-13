const steps = [
  {
    title: 'Discovery',
    desc: 'Chat with the AI assistant or jump on a call. I learn your business, your pain points, and where time is being wasted.',
  },
  {
    title: 'Blueprint',
    desc: 'I design which AI systems will save you the most time and money. You get a clear plan before anything is built.',
  },
  {
    title: 'Build & Ship',
    desc: 'I handle the entire build. You start seeing results from week one. No long onboarding, no learning curve.',
  },
];

export default function Process() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-[11px] font-bold uppercase tracking-[3px] text-[#60A5FA] mb-4">
          Process
        </div>
        <div
          className="text-[36px] font-extrabold mb-12"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}
        >
          Three steps. That&apos;s it.
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 relative">
              <div
                className="text-[64px] font-extrabold leading-none mb-2"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: 'rgba(37,99,235,0.08)',
                }}
              >
                {i + 1}
              </div>
              <h3
                className="text-[18px] font-bold mb-[6px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-[13px] text-[#9CA3AF] leading-[1.6]">{step.desc}</p>

              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute"
                  style={{
                    top: '32px',
                    right: '-28px',
                    width: '8px',
                    height: '1px',
                    background: 'rgba(37,99,235,0.15)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
