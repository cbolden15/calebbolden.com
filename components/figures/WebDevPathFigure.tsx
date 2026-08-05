// The path a customer takes to hire you, and where it leaks. Generic teaching
// figure in the site's drafting vocabulary; depicts no specific engagement.

const boxes = [
  { x: 8, label: 'they search' },
  { x: 160, label: 'your site' },
  { x: 312, label: 'call / form' },
  { x: 464, label: 'booked' },
];

export default function WebDevPathFigure() {
  return (
    <div>
      <p className="anno mb-4">the path a customer takes to hire you</p>
      <div className="overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label="The path from a customer searching, to your site, to a call or form, to a booked job. A dashed amber return arrow shows the leak: a slow or confusing site sends them back to the search results."
          viewBox="0 0 584 190"
          className="h-auto w-full"
          style={{ minWidth: 520 }}
        >
          {boxes.map((b, i) => (
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
              <text
                x={b.x + 56}
                y={120}
                textAnchor="middle"
                fill="var(--color-ink)"
                style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}
              >
                {b.label}
              </text>
            </g>
          ))}
          {[120, 272, 424].map((x, i) => (
            <g key={x}>
              <line
                className="draw-on-reveal"
                style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${160 + i * 140}ms` }}
                x1={x}
                y1={115}
                x2={x + 40}
                y2={115}
                stroke="var(--color-blue)"
                strokeWidth="1.5"
              />
              <path
                d={`M ${x + 33} 111 L ${x + 40} 115 L ${x + 33} 119`}
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="1.5"
              />
            </g>
          ))}
          {/* The leak: slow or unclear, back to the list */}
          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '700ms', ['--ants-delay' as string]: '1.4s' }}
            d="M 216 92 C 216 34, 90 34, 68 88"
            fill="none"
            stroke="var(--color-sticky-edge)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text className="anno" x={150} y={26} textAnchor="middle" fill="var(--color-ink-faint)">
            slow or unclear: back to the list
          </text>
          <text className="anno" x={140} y={168} fill="var(--color-ink-faint)">
            the site gets built where this path leaks
          </text>
        </svg>
      </div>
    </div>
  );
}
