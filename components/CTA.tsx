export default function CTA() {
  return (
    <section style={{ padding: '80px 0 120px', textAlign: 'center' }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(37,99,235,0.1), transparent)',
            border: '1px solid rgba(37,99,235,0.15)',
            borderRadius: '20px',
            padding: '64px 40px',
          }}
        >
          {/* Top light line */}
          <div
            className="absolute"
            style={{
              top: '-1px',
              left: '30%',
              right: '30%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #60A5FA, transparent)',
            }}
          />

          <h2
            className="text-[32px] font-extrabold mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}
          >
            What could AI handle for you?
          </h2>
          <p className="text-[15px] text-[#9CA3AF]">
            Tell the assistant about your business. Get a personalized breakdown of what&apos;s possible.
          </p>
        </div>
      </div>
    </section>
  );
}
