'use client';

import Reveal from './Reveal';

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
  const flowPath = 'M 140 124 L 180 124 L 310 124 L 350 124 L 480 124 L 520 124';

  return (
    <svg
      viewBox="0 0 680 300"
      role="img"
      aria-label="A value stream map fragment: four process steps from incoming call to invoice, with a rework loop on quoting, a note that invoices wait four days, and a sticky note marking the follow-up step as the thing to automate."
      className="h-auto w-full"
    >
      {/* Flow pulse: painted first so the boxes occlude it as it passes through */}
      <circle
        className="flow-dot"
        cx="0"
        cy="0"
        r="2.5"
        fill="var(--color-blue)"
        style={{
          offsetPath: `path("${flowPath}")`,
          ['--flow-duration' as string]: '7s',
          ['--flow-delay' as string]: '2.6s',
        }}
      />

      {/* Connectors between boxes */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line
            className="draw-on-reveal"
            style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${500 + i * 180}ms` }}
            x1={boxes[i].x + bw}
            y1={96 + bh / 2}
            x2={boxes[i + 1].x}
            y2={96 + bh / 2}
            stroke="var(--color-blue)"
            strokeWidth="1.5"
          />
          <path
            className="stamp-on-reveal"
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
        <g
          key={b.label}
          className="group/process-box stamp-on-reveal cursor-crosshair"
          style={{ ['--stamp-delay' as string]: `${260 + i * 180}ms` }}
        >
          <rect
            className="transition-[fill,stroke-width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/process-box:fill-[var(--color-blue-wash)] group-hover/process-box:[stroke-width:2.5]"
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
            className="transition-[fill] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/process-box:fill-[var(--color-blue)]"
            x={b.x + bw / 2}
            y={b.y + bh / 2 + 4}
            textAnchor="middle"
            fill="var(--color-ink)"
            style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}
          >
            {b.label}
          </text>
        </g>
      ))}

      {/* Rework loop over "Quote written" */}
      <path
        className="stamp-on-reveal ants"
        style={{ ['--stamp-delay' as string]: '1100ms', ['--ants-delay' as string]: '2.2s' }}
        d="M 300 96 C 300 46, 200 46, 200 92"
        fill="none"
        stroke="var(--color-blue-deep)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text
        className="stamp-on-reveal anno anno-blue"
        style={{ ['--stamp-delay' as string]: '1350ms' }}
        x="250"
        y="38"
        textAnchor="middle"
      >
        rework ×2
      </text>

      {/* Dimension line under "Invoice sent": extension lines offset per drafting convention */}
      <g className="stamp-on-reveal" style={{ ['--stamp-delay' as string]: '1500ms' }}>
        <line x1={520} y1={160} x2={520} y2={186} stroke="var(--color-blue)" strokeWidth="1" />
        <line x1={650} y1={160} x2={650} y2={186} stroke="var(--color-blue)" strokeWidth="1" />
        <line x1={520} y1={180} x2={650} y2={180} stroke="var(--color-blue)" strokeWidth="1" />
        <text className="anno anno-blue" x={585} y={205} textAnchor="middle">
          waits 4 days
        </text>
      </g>

      {/* Sticky note on the gap between call and quote */}
      <g className="stamp-on-reveal" style={{ ['--stamp-delay' as string]: '1750ms' }} transform="rotate(-2 96 232)">
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
        className="draw-on-reveal"
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
    <section className="graph-field graph-fade relative overflow-hidden">
      <div className="mx-auto flex min-h-[86vh] w-[90%] max-w-[1280px] flex-col justify-center py-16 lg:py-20">
        {/* Headline: wall-scale, sits over the map's empty sky */}
        <h1
          className="type-display rise-in relative z-10"
          style={{
            fontSize: 'clamp(2.6rem, 5.4vw, 5.2rem)',
            maxWidth: '20ch',
            ['--rise-delay' as string]: '0ms',
          }}
        >
          I automate the work you shouldn&apos;t be doing
        </h1>

        {/* Second row: copy + CTAs left, the map big and bleeding right */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-6 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="relative z-10 lg:col-span-4">
            <p
              className="rise-in max-w-md"
              style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--color-ink-muted)', ['--rise-delay' as string]: '120ms' }}
            >
              I map how your business actually runs, then build AI where it pays.
              Process first, tools second.
            </p>
            <div className="rise-in mt-8 flex flex-wrap items-center gap-3" style={{ ['--rise-delay' as string]: '240ms' }}>
              <button onClick={openChat} className="btn-ink btn-roll">
                <span className="roll-box">
                  <span className="roll-a">Analyze my business</span>
                  <span className="roll-b" aria-hidden="true">Analyze my business</span>
                </span>
                <svg
                  className="arrow-settle ml-2 h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a href="#packages" className="btn-hairline btn-roll">
                <span className="roll-box">
                  <span className="roll-a">See the packages</span>
                  <span className="roll-b" aria-hidden="true">See the packages</span>
                </span>
              </a>
            </div>
          </div>

          {/* The map: the wall artifact at wall scale, tucked under the headline */}
          <Reveal className="lg:col-span-8 lg:-mr-[6%] lg:-mt-8" amount={0.08}>
            <HeroMap />
          </Reveal>
        </div>

        {/* Plotter stamp: quiet sheet metadata, bottom right of the wall */}
        <div className="rise-in mt-12 hidden justify-end lg:flex" style={{ ['--rise-delay' as string]: '400ms' }}>
          <span className="anno">quote-to-invoice · mapped from a real client · sheet 1</span>
        </div>
      </div>
    </section>
  );
}
