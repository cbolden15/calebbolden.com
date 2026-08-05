// A generic value stream map for the blog: short touches, long waits, one
// rework loop. Teaching figure only; depicts no specific engagement.
// Self-wraps in Reveal: MDX blog posts render with no ancestor Reveal, so this
// figure supplies its own .reveal.in trigger instead of relying on one.

import Reveal from '@/components/Reveal';

export default function BlogVsmFigure() {
  const boxes = [
    { x: 8, label: 'request arrives' },
    { x: 214, label: 'the work itself' },
    { x: 420, label: 'invoice goes out' },
  ];
  // Each wait runs box-edge to box-edge: 164→214 and 370→420 at y=115.
  const waits = [
    { from: 164, to: 214, label: 'waits two days' },
    { from: 370, to: 420, label: 'waits till friday' },
  ];
  return (
    <Reveal>
      <figure style={{ margin: '2.5rem 0' }}>
      <p className="anno mb-4">the shape of most back-office work: short touches, long waits</p>
      <div className="overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label="A value stream map of a typical request: it arrives, waits two days, gets twenty minutes of real work, waits until Friday, and the invoice goes out. A dashed amber loop from the invoice back to the work marks rework when information is missing."
          viewBox="0 0 584 200"
          className="h-auto w-full"
          style={{ minWidth: 520 }}
        >
          {boxes.map((b, i) => (
            <g key={b.label}>
              <rect
                className="stamp-on-reveal"
                style={{ ['--stamp-delay' as string]: `${i * 160}ms` }}
                x={b.x}
                y={92}
                width={156}
                height={46}
                rx="2"
                fill="var(--color-bg)"
                stroke="var(--color-blue)"
                strokeWidth="1.5"
              />
              <text x={b.x + 78} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>
                {b.label}
              </text>
            </g>
          ))}
          {waits.map((w, i) => (
            <g key={w.label}>
              <line
                className="draw-on-reveal"
                style={{ ['--draw-len' as string]: 50, ['--draw-delay' as string]: `${200 + i * 160}ms` }}
                x1={w.from}
                y1={115}
                x2={w.to}
                y2={115}
                stroke="var(--color-blue)"
                strokeWidth="1.5"
                strokeDasharray="2 4"
              />
              <path d={`M ${w.to - 7} 111 L ${w.to} 115 L ${w.to - 7} 119`} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
              <text className="anno" x={(w.from + w.to) / 2} y={84} textAnchor="middle" fill="var(--color-blue)">
                {w.label}
              </text>
            </g>
          ))}
          <text className="anno" x={292} y={158} textAnchor="middle" fill="var(--color-ink-faint)">
            twenty minutes of touch time, a week of calendar time
          </text>
          {/* rework: missing info sends it back */}
          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '700ms', ['--ants-delay' as string]: '1.5s' }}
            d="M 470 92 C 470 34, 320 34, 296 88"
            fill="none"
            stroke="var(--color-sticky-edge)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text className="anno" x={388} y={26} textAnchor="middle" fill="var(--color-ink-faint)">
            missing info: back for rework
          </text>
        </svg>
      </div>
      </figure>
    </Reveal>
  );
}
