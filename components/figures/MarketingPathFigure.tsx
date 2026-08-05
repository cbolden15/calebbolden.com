// Follow-up marketing: speed to first reply, then persistence. Generic
// teaching figure; depicts no specific engagement.
// Contract: stamp/draw-on-reveal elements render only inside a <Reveal> (.reveal.in ancestor). This figure relies on ServicePage's Reveal.

export default function MarketingPathFigure() {
  return (
    <div>
      <p className="anno mb-4">what happens to a lead after it arrives</p>
      <div className="overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label="The follow-up path: a lead comes in, gets a first reply, then follow-up repeats until they answer, then the job is booked. A dashed amber arrow shows the leak: a reply that comes a day late loses the lead to whoever answered first."
          viewBox="0 0 584 200"
          className="h-auto w-full"
          style={{ minWidth: 520 }}
        >
          {[
            { x: 8, label: 'lead comes in' },
            { x: 160, label: 'first reply' },
            { x: 312, label: 'follow-up' },
            { x: 464, label: 'booked' },
          ].map((b, i) => (
            <g key={b.label}>
              <rect
                className="stamp-on-reveal"
                style={{ ['--stamp-delay' as string]: `${i * 140}ms` }}
                x={b.x}
                y={92}
                width={112}
                height={46}
                rx="2"
                fill="var(--color-bg)"
                stroke="var(--color-blue)"
                strokeWidth="1.5"
              />
              <text x={b.x + 56} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>
                {b.label}
              </text>
            </g>
          ))}
          {[120, 272, 424].map((x, i) => (
            <g key={x}>
              <line className="draw-on-reveal" style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${160 + i * 140}ms` }} x1={x} y1={115} x2={x + 40} y2={115} stroke="var(--color-blue)" strokeWidth="1.5" />
              <path d={`M ${x + 33} 111 L ${x + 40} 115 L ${x + 33} 119`} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
            </g>
          ))}

          {/* follow-up repeats until they answer */}
          <path
            className="draw-on-reveal"
            style={{ ['--draw-len' as string]: 140, ['--draw-delay' as string]: '620ms' }}
            d="M 340 138 C 340 172, 396 172, 396 138"
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="1.5"
            strokeDasharray="2 4"
          />
          <text className="anno" x={368} y={188} textAnchor="middle" fill="var(--color-blue)">until they answer</text>

          {/* the leak: a slow first reply */}
          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '760ms', ['--ants-delay' as string]: '1.5s' }}
            d="M 216 92 C 216 34, 90 34, 68 88"
            fill="none"
            stroke="var(--color-sticky-edge)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text className="anno" x={150} y={26} textAnchor="middle" fill="var(--color-ink-faint)">a day late: they already hired</text>
        </svg>
      </div>
    </div>
  );
}
