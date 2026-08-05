// Local search: the customer path runs through the map pack. Generic teaching
// figure; depicts no specific engagement.
// Contract: stamp/draw-on-reveal elements render only inside a <Reveal> (.reveal.in ancestor). This figure relies on ServicePage's Reveal.

export default function SeoPathFigure() {
  return (
    <div>
      <p className="anno mb-4">how local customers actually find you</p>
      <div className="overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label="The local search path: a customer searches, sees the map pack of three businesses, opens one profile, and calls. A dashed amber arrow shows the leak: businesses outside the top three are never seen."
          viewBox="0 0 584 190"
          className="h-auto w-full"
          style={{ minWidth: 520 }}
        >
          <rect className="stamp-on-reveal" x={8} y={92} width={112} height={46} rx="2" fill="var(--color-bg)" stroke="var(--color-blue)" strokeWidth="1.5" />
          <text x={64} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>they search</text>

          {/* the local pack: three stacked slots, yours highlighted */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className="stamp-on-reveal"
              style={{ ['--stamp-delay' as string]: `${140 + i * 90}ms` }}
              x={160}
              y={78 + i * 26}
              width={112}
              height={20}
              rx="2"
              fill={i === 1 ? 'var(--color-blue-wash)' : 'var(--color-bg)'}
              stroke="var(--color-blue)"
              strokeWidth={i === 1 ? 1.5 : 1}
            />
          ))}
          <text className="anno" x={216} y={66} textAnchor="middle" fill="var(--color-blue)">the local pack</text>
          <text x={216} y={118} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600 }}>your business</text>

          <rect className="stamp-on-reveal" style={{ ['--stamp-delay' as string]: '420ms' }} x={312} y={92} width={112} height={46} rx="2" fill="var(--color-bg)" stroke="var(--color-blue)" strokeWidth="1.5" />
          <text x={368} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>your profile</text>

          <rect className="stamp-on-reveal" style={{ ['--stamp-delay' as string]: '560ms' }} x={464} y={92} width={112} height={46} rx="2" fill="var(--color-bg)" stroke="var(--color-blue)" strokeWidth="1.5" />
          <text x={520} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>they call</text>

          {[120, 272, 424].map((x, i) => (
            <g key={x}>
              <line className="draw-on-reveal" style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${200 + i * 140}ms` }} x1={x} y1={115} x2={x + 40} y2={115} stroke="var(--color-blue)" strokeWidth="1.5" />
              <path d={`M ${x + 33} 111 L ${x + 40} 115 L ${x + 33} 119`} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
            </g>
          ))}

          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '760ms', ['--ants-delay' as string]: '1.5s' }}
            d="M 216 150 C 216 178, 90 178, 66 142"
            fill="none"
            stroke="var(--color-sticky-edge)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text className="anno" x={150} y={186} textAnchor="middle" fill="var(--color-ink-faint)">outside the top three: never seen</text>
        </svg>
      </div>
    </div>
  );
}
