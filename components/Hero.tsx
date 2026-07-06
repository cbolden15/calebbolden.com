'use client';

// The working wall hero: headline left, a live value-stream-map fragment right.
// The map is the brand artifact (DESIGN.md): process boxes drawn in blueprint
// blue, a rework loop, one dimension line quoting a real waste number, and an
// amber sticky marking the automation call. Strokes draw in like a marker;
// reduced motion renders everything instantly via globals.css overrides.

function openChat() {
  window.dispatchEvent(new Event('open-chat'));
}

// --- The map fragment -------------------------------------------------------
// A quote-to-invoice slice, the example used across the consulting materials.
// Box geometry is hand-laid on a 32px-friendly grid so it sits on the graph field.

function HeroMap() {
  const boxes = [
    { x: 10, y: 96, label: 'Call comes in' },
    { x: 180, y: 96, label: 'Quote written' },
    { x: 350, y: 96, label: 'Job done' },
    { x: 520, y: 96, label: 'Invoice sent' },
  ];
  const bw = 130;
  const bh = 56;

  return (
    <svg
      viewBox="0 0 680 300"
      role="img"
      aria-label="A value stream map fragment: four process steps from incoming call to invoice, with a rework loop on quoting, a note that invoices wait four days, and a sticky note marking the follow-up step as the thing to automate."
      className="h-auto w-full"
    >
      {/* Connectors between boxes */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line
            className="draw-line"
            style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${500 + i * 180}ms` }}
            x1={boxes[i].x + bw}
            y1={96 + bh / 2}
            x2={boxes[i + 1].x}
            y2={96 + bh / 2}
            stroke="var(--color-blue)"
            strokeWidth="1.5"
          />
          <path
            className="stamp-in"
            style={{ ['--stamp-delay' as string]: `${620 + i * 180}ms` }}
            d={`M ${boxes[i + 1].x - 7} ${96 + bh / 2 - 4} L ${boxes[i + 1].x} ${96 + bh / 2} L ${boxes[i + 1].x - 7} ${96 + bh / 2 + 4}`}
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Process boxes */}
      {boxes.map((b, i) => (
        <g key={b.label} className="stamp-in" style={{ ['--stamp-delay' as string]: `${260 + i * 180}ms` }}>
          <rect
            x={b.x}
            y={b.y}
            width={bw}
            height={bh}
            rx="2"
            fill="var(--color-bg)"
            stroke="var(--color-blue)"
            strokeWidth="1.5"
          />
          <text
            x={b.x + bw / 2}
            y={b.y + bh / 2 + 4}
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, fill: 'var(--color-ink)' }}
          >
            {b.label}
          </text>
        </g>
      ))}

      {/* Rework loop over "Quote written" */}
      <path
        className="draw-line"
        style={{ ['--draw-len' as string]: 220, ['--draw-delay' as string]: '1100ms' }}
        d="M 300 96 C 300 46, 200 46, 200 92"
        fill="none"
        stroke="var(--color-blue-deep)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text
        className="stamp-in anno anno-blue"
        style={{ ['--stamp-delay' as string]: '1350ms' }}
        x="250"
        y="38"
        textAnchor="middle"
      >
        rework ×2
      </text>

      {/* Dimension line under "Invoice sent": extension lines offset per drafting convention */}
      <g className="stamp-in" style={{ ['--stamp-delay' as string]: '1500ms' }}>
        <line x1={520} y1={160} x2={520} y2={186} stroke="var(--color-blue)" strokeWidth="1" />
        <line x1={650} y1={160} x2={650} y2={186} stroke="var(--color-blue)" strokeWidth="1" />
        <line x1={520} y1={180} x2={650} y2={180} stroke="var(--color-blue)" strokeWidth="1" />
        <text className="anno anno-blue" x={585} y={205} textAnchor="middle">
          waits 4 days
        </text>
      </g>

      {/* Sticky note on the gap between call and quote */}
      <g className="stamp-in" style={{ ['--stamp-delay' as string]: '1750ms' }} transform="rotate(-2 96 232)">
        <rect x={20} y={208} width={152} height={48} rx="2" fill="var(--color-sticky)" />
        <rect x={20} y={252} width={152} height={4} rx="2" fill="var(--color-sticky-edge)" />
        <text
          x={96}
          y={236}
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, fill: 'var(--color-ink)' }}
        >
          automate this
        </text>
      </g>
      <line
        className="draw-line"
        style={{ ['--draw-len' as string]: 70, ['--draw-delay' as string]: '1680ms' }}
        x1={100}
        y1={206}
        x2={120}
        y2={158}
        stroke="var(--color-sticky-edge)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

// --- Hero --------------------------------------------------------------------

export default function Hero() {
  return (
    <section className="graph-field graph-fade relative">
      <div className="mx-auto grid w-[90%] max-w-[1200px] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
        {/* Copy */}
        <div className="lg:col-span-7">
          <h1
            className="type-display rise-in"
            style={{ fontSize: 'clamp(2.1rem, 3.4vw, 3.1rem)', ['--rise-delay' as string]: '0ms' }}
          >
            I automate the work you shouldn&apos;t be doing
          </h1>
          <p
            className="rise-in mt-6 max-w-md"
            style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--color-ink-muted)', ['--rise-delay' as string]: '120ms' }}
          >
            I map how your business actually runs, then build AI where it pays.
            Process first, tools second.
          </p>
          <div className="rise-in mt-8 flex flex-wrap items-center gap-3" style={{ ['--rise-delay' as string]: '240ms' }}>
            <button onClick={openChat} className="btn-ink">
              Analyze my business
            </button>
            <a href="#packages" className="btn-hairline">
              See the packages
            </a>
          </div>
        </div>

        {/* The map */}
        <div className="lg:col-span-5">
          <HeroMap />
        </div>
      </div>
    </section>
  );
}
