// Hero canvas engine, ported verbatim from docs/design/hero-prototype-2026-07-14.html
// (the approved "map becomes the machine" prototype). Framework-free: this module
// owns the draw loop and reads scroll progress via an injected getProgress() callback
// instead of computing it from window.scrollY directly. See task-18-brief.md.

interface HeroNode {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  paperLabel: string;
  busy: number;
  counter?: boolean;
  dashed?: boolean;
  small?: boolean;
}

interface Col {
  x: number;
  label: string;
}

interface Edge {
  a: string;
  b: string;
  k: string;
  dashed?: boolean;
  pts: [number, number][];
  lens: number[];
  total: number;
}

interface Packet {
  route: string[];
  leg: number;
  t: number;
  speed: number;
  label: string;
  hold: number;
}

export function initHeroEngine(
  canvas: HTMLCanvasElement,
  getProgress: () => number
): { destroy: () => void } {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = innerWidth, H = innerHeight;
  const cv = canvas, ctx = cv.getContext('2d') as CanvasRenderingContext2D;

  /* ---------- shared pipeline geometry (identical in both worlds) ---------- */
  let nodes: Record<string, HeroNode>;
  let edges: Edge[];
  let cols: Col[];
  function buildGraph() {
    const right = W * 0.955, left = W * 0.42;
    const span = right - left;
    const cy = H * 0.52;
    const CW = Math.min(132, span * 0.20), CH = 42;
    cols = [
      { x: left + span * 0.00, label: '01 / INTAKE' },
      { x: left + span * 0.30, label: '02 / TRIAGE' },
      { x: left + span * 0.62, label: '03 / AGENTS' },
      { x: left + span * 1.00 - CW, label: '04 / DONE' },
    ];
    const N = (col: number, y: number, label: string, paperLabel: string, opts: Partial<HeroNode> = {}): HeroNode =>
      ({ x: cols[col].x, y: y - CH / 2, w: CW, h: CH, label, paperLabel, busy: -9, ...opts });
    nodes = {
      intake: N(0, cy,        'INTAKE',        'call comes in'),
      triage: N(1, cy,        'TRIAGE',        'front desk sorts'),
      voice:  N(2, cy - H * 0.16, 'VOICE AGENT',   'phone tag'),
      docs:   N(2, cy,        'DOCS AGENT',    'paperwork pile'),
      camp:   N(2, cy + H * 0.16, 'CAMPAIGN AGENT','marketing? later'),
      done:   N(3, cy,        'DONE',          'invoice sent', { counter: true }),
      memory: N(2, cy - H * 0.27, 'MEMORY',        'sticky notes', { dashed: true, small: true }),
    };
    nodes.memory.w = CW * 0.78; nodes.memory.h = 34;
    edges = ([
      ['intake', 'triage'], ['triage', 'voice'], ['triage', 'docs'], ['triage', 'camp'],
      ['voice', 'done'], ['docs', 'done'], ['camp', 'done'],
    ]).map(([a, b]): Edge => ({ a, b, k: a + '>' + b, pts: [], lens: [], total: 0 }));
    edges.push({ a: 'memory', b: 'voice', k: 'memory>voice', dashed: true, pts: [], lens: [], total: 0 });
    for (const e of edges) routeEdge(e);
  }
  function routeEdge(e: Edge) {
    const A = nodes[e.a], B = nodes[e.b];
    const ax = A.x + A.w, ay = A.y + A.h / 2;
    const bx = B.x,       by = B.y + B.h / 2;
    const midX = (ax + bx) / 2;
    e.pts = (Math.abs(ay - by) < 2) ? [[ax, ay], [bx, by]] : [[ax, ay], [midX, ay], [midX, by], [bx, by]];
    e.lens = []; e.total = 0;
    for (let i = 0; i < e.pts.length - 1; i++) {
      const L = Math.hypot(e.pts[i + 1][0] - e.pts[i][0], e.pts[i + 1][1] - e.pts[i][1]);
      e.lens.push(L); e.total += L;
    }
  }
  function pointOn(e: Edge, t: number): [number, number] {
    let d = t * e.total;
    for (let i = 0; i < e.lens.length; i++) {
      if (d <= e.lens[i] || i === e.lens.length - 1) {
        const f = e.lens[i] ? d / e.lens[i] : 0;
        const [x1, y1] = e.pts[i], [x2, y2] = e.pts[i + 1];
        return [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f];
      }
      d -= e.lens[i];
    }
    return e.pts[e.pts.length - 1];
  }
  function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    c.beginPath();
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }

  /* ---------- PAPER world (the process map) ---------- */
  function drawPaper(S: number, OX: number, OY: number) {
    // mat board + graph grid
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(58,110,150,0.09)';
    ctx.lineWidth = 1;
    const g = 32;
    for (let x = 0; x < W; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const inkCol = 'rgba(40,52,64,0.9)', blueCol = 'rgba(43,94,133,0.9)';
    // column headers
    ctx.font = `${9 * S}px "Martian Mono", monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(40,52,64,0.45)';
    for (const c of cols) ctx.fillText(c.label, c.x * S + OX, H * 0.155 * S + OY);

    // edges: thin ink w/ arrowheads
    for (const e of edges) {
      ctx.strokeStyle = 'rgba(40,52,64,0.5)';
      if (e.dashed) ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      e.pts.forEach(([px, py], i) => { const x = px * S + OX, y = py * S + OY; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke(); ctx.setLineDash([]);
      const [ex, ey] = e.pts[e.pts.length - 1];
      const axp = ex * S + OX, ayp = ey * S + OY;
      ctx.fillStyle = 'rgba(40,52,64,0.6)';
      ctx.beginPath(); ctx.moveTo(axp - 6, ayp - 3.5); ctx.lineTo(axp, ayp); ctx.lineTo(axp - 6, ayp + 3.5); ctx.closePath(); ctx.fill();
    }

    // nodes: drafting boxes, blue stroke, mono ink label
    for (const id of Object.keys(nodes)) {
      const nd = nodes[id];
      const x = nd.x * S + OX, y = nd.y * S + OY, w = nd.w * S, h = nd.h * S;
      rr(ctx, x, y, w, h, 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      if (nd.dashed) ctx.setLineDash([3, 4]);
      ctx.strokeStyle = blueCol; ctx.lineWidth = 1.4;
      ctx.stroke(); ctx.setLineDash([]);
      ctx.font = `${(nd.small ? 8.5 : 9.5) * S}px "Martian Mono", monospace`;
      ctx.fillStyle = inkCol; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(nd.paperLabel, x + w / 2, y + h / 2 + 0.5);
    }
    ctx.textBaseline = 'alphabetic';

    // pain annotations (the audit's red pen, in ink)
    ctx.font = `${9.5 * S}px "Martian Mono", monospace`;
    ctx.fillStyle = 'rgba(140,60,50,0.85)';
    ctx.textAlign = 'left';
    const iT = nodes.intake, tr = nodes.triage, dc = nodes.docs;
    ctx.fillText('waits 4 days', (iT.x + iT.w + 18) * S + OX, (iT.y - 8) * S + OY);
    ctx.fillText('rework ×2', (dc.x + dc.w * 0.2) * S + OX, (dc.y + dc.h + 22) * S + OY);
    // rework loop arrow under docs
    ctx.strokeStyle = 'rgba(140,60,50,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc((dc.x + dc.w * 0.1) * S + OX, (dc.y + dc.h + 10) * S + OY, 9 * S, 0.4, 5.4);
    ctx.stroke();

    // amber sticky
    const st = nodes.camp;
    const sx = (st.x + st.w + 26) * S + OX, sy = (st.y - 6) * S + OY;
    ctx.save();
    ctx.translate(sx, sy); ctx.rotate(-0.035);
    ctx.fillStyle = '#ecd193';
    ctx.fillRect(0, 0, 104 * S, 46 * S);
    ctx.fillStyle = 'rgba(180,140,50,0.5)';
    ctx.fillRect(0, 46 * S, 104 * S, 2.5);
    ctx.fillStyle = 'rgba(60,48,20,0.9)';
    ctx.font = `${8.5 * S}px "Martian Mono", monospace`;
    ctx.fillText('automate', 10 * S, 19 * S);
    ctx.fillText('this →', 10 * S, 33 * S);
    ctx.restore();
  }

  /* ---------- LIVE world (v7 corporate pipeline) ---------- */
  const JOBS = ['missed call', 'invoice #4118', 'estimate req', 'blog draft', 'dues run', 'intake form', 'review reply', 'booking'];
  const ROUTES = [
    ['intake>triage', 'triage>voice', 'voice>done'],
    ['intake>triage', 'triage>docs', 'docs>done'],
    ['intake>triage', 'triage>camp', 'camp>done'],
  ];
  let packets: Packet[] = [], doneCount = 0, spawnTimer = 0;
  const findEdge = (k: string): Edge => edges.find(e => e.k === k) as Edge;
  function spawn() {
    packets.push({
      route: ROUTES[Math.floor(Math.random() * ROUTES.length)],
      leg: 0, t: 0, speed: 0.005 + Math.random() * 0.002,
      label: JOBS[Math.floor(Math.random() * JOBS.length)], hold: 0,
    });
  }
  function drawLive(T: number, S: number, OX: number, OY: number, alive: boolean) {
    // dark bg
    const grad = ctx.createRadialGradient(W * 0.62, H * 0.45, 80, W * 0.62, H * 0.45, Math.max(W, H) * 0.75);
    grad.addColorStop(0, '#0a1220'); grad.addColorStop(1, '#05070c');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    // faint currents
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 16) {
        const y = H * (0.3 + i * 0.22) + Math.sin(x * 0.0016 + T * 0.1 + i * 2.1) * 44 + Math.sin(x * 0.0007 - T * 0.06 + i) * 66;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(110,150,200,${0.05 + i * 0.014})`;
      ctx.lineWidth = 40 - i * 12;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // column headers + lanes
    ctx.font = `${9 * S}px "Martian Mono", monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    for (const c of cols) {
      const x = c.x * S + OX;
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillText(c.label, x, H * 0.155 * S + OY);
      ctx.strokeStyle = 'rgba(150,200,250,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, H * 0.175 * S + OY); ctx.lineTo(x, H * 0.84 * S + OY); ctx.stroke();
    }
    // edges
    for (const e of edges) {
      ctx.strokeStyle = `rgba(130,180,235,${e.dashed ? 0.14 : 0.20})`;
      if (e.dashed) ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      e.pts.forEach(([px, py], i) => { const x = px * S + OX, y = py * S + OY; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke(); ctx.setLineDash([]);
      const [ex, ey] = e.pts[e.pts.length - 1];
      const axp = ex * S + OX, ayp = ey * S + OY;
      ctx.fillStyle = 'rgba(150,200,250,0.4)';
      ctx.beginPath(); ctx.moveTo(axp - 6, ayp - 3.5); ctx.lineTo(axp, ayp); ctx.lineTo(axp - 6, ayp + 3.5); ctx.closePath(); ctx.fill();
    }
    // packets
    if (alive && !reduced) {
      spawnTimer -= 1;
      if (spawnTimer <= 0 && packets.length < 5) { spawn(); spawnTimer = 110 + Math.random() * 130; }
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      if (p.hold > 0) { p.hold -= 1; }
      else {
        p.t += p.speed;
        if (p.t >= 1) {
          const e = findEdge(p.route[p.leg]);
          nodes[e.b].busy = T;
          p.leg++; p.t = 0;
          if (p.leg >= p.route.length) {
            doneCount++;
            document.getElementById('doneCount')!.textContent = String(doneCount).padStart(3, '0');
            packets.splice(i, 1); continue;
          }
          p.hold = 50;
        }
      }
      const e = findEdge(p.route[p.leg]);
      const [x, y] = pointOn(e, p.t);
      const sx2 = x * S + OX, sy2 = y * S + OY;
      ctx.save();
      ctx.shadowColor = 'rgba(180,220,255,1)'; ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(235,245,255,0.95)';
      ctx.beginPath(); ctx.arc(sx2, sy2, 2.2, 0, 7); ctx.fill();
      ctx.restore();
      ctx.font = '8.5px "Martian Mono", monospace';
      const tw = ctx.measureText(p.label).width;
      const chx = sx2 + 8, chy = sy2 - 16;
      ctx.fillStyle = 'rgba(10,18,30,0.75)';
      ctx.beginPath();
      ctx.roundRect ? (ctx.roundRect(chx - 4, chy - 8, tw + 8, 14, 3), ctx.fill()) : ctx.fillRect(chx - 4, chy - 8, tw + 8, 14);
      ctx.strokeStyle = 'rgba(150,200,250,0.25)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.fillStyle = 'rgba(200,228,255,0.8)';
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(p.label, chx, chy);
      ctx.textBaseline = 'alphabetic';
    }
    // cards
    for (const id of Object.keys(nodes)) {
      const nd = nodes[id];
      const x = nd.x * S + OX, y = nd.y * S + OY, w = nd.w * S, h = nd.h * S;
      const busyP = Math.min(1, Math.max(0, (T - nd.busy) / 0.85));
      const active = busyP < 1;
      const glow = active ? (1 - busyP) * 0.7 + 0.3 : 0;
      if (glow > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(120,180,240,0.85)'; ctx.shadowBlur = 18 * glow;
        rr(ctx, x, y, w, h, 6);
        ctx.strokeStyle = `rgba(160,205,250,${0.5 + glow * 0.5})`; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.restore();
      }
      rr(ctx, x, y, w, h, 6);
      ctx.fillStyle = 'rgba(255,255,255,0.045)'; ctx.fill();
      if (nd.dashed) ctx.setLineDash([3, 4]);
      ctx.strokeStyle = `rgba(150,200,250,${0.28 + (active ? glow * 0.5 : 0)})`; ctx.lineWidth = 1; ctx.stroke();
      ctx.setLineDash([]);
      const fs = (nd.small ? 8.5 : 9.5) * S;
      ctx.font = `${fs}px "Martian Mono", monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const dotX = x + 12 * S, cyy = y + h / 2;
      ctx.beginPath(); ctx.arc(dotX, cyy, 2.2, 0, 7);
      ctx.fillStyle = active ? 'rgba(160,220,255,1)' : (nd.counter ? 'rgba(237,217,183,0.9)' : 'rgba(120,170,220,0.55)');
      ctx.fill();
      ctx.fillStyle = active ? 'rgba(220,240,255,0.95)' : 'rgba(255,255,255,0.6)';
      ctx.fillText(nd.label, dotX + 10, cyy + 0.5);
      if (nd.counter) {
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(237,217,183,0.9)';
        ctx.fillText(String(doneCount).padStart(3, '0'), x + w - 10, cyy + 0.5);
      }
      if (active && !nd.counter) {
        const bw = (w - 20) * busyP;
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.fillRect(x + 10, y + h - 6, w - 20, 2);
        ctx.fillStyle = 'rgba(170,215,255,0.9)';
        ctx.fillRect(x + 10, y + h - 6, bw, 2);
      }
    }
    ctx.textBaseline = 'alphabetic';
  }

  /* ---------- orchestration: scan sweep converts paper → live ---------- */
  let smooth = 0;
  const paperC = document.getElementById('paperC') as HTMLElement;
  const liveC = document.getElementById('liveC') as HTMLElement;
  const readoutLine = document.getElementById('readoutLine') as HTMLElement;

  function size() {
    // Size the drawing surface to the canvas's own rendered box, not the
    // window: the hero lives inside the site's layout and its box can be
    // narrower than innerWidth (falls back to the window before first layout).
    const rect = cv.getBoundingClientRect();
    W = rect.width || innerWidth;
    H = rect.height || innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildGraph();
  }

  let rafId = 0;
  function frame(t: number) {
    const T = t * 0.001;
    const p = getProgress();
    smooth += (p - smooth) * 0.08;

    // sweep: 0.12→0.62 of scroll moves scan line 0→W (left to right)
    const sweep = Math.min(1, Math.max(0, (smooth - 0.12) / 0.5));
    const scanX = sweep * (W + 120) - 60;
    const alive = sweep > 0.55;

    // camera push only in live phase
    const push = Math.max(0, (smooth - 0.62) / 0.38);
    const S = 1 + push * 0.4;
    const OX = -W * 0.68 * (S - 1) - push * W * 0.04;
    const OY = -H * 0.52 * (S - 1) + push * H * 0.02;

    ctx.clearRect(0, 0, W, H);
    // live world clipped to left of scan
    if (sweep > 0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, Math.max(0, scanX), H); ctx.clip();
      drawLive(T, S, OX, OY, alive);
      ctx.restore();
    }
    // paper world clipped to right of scan
    if (sweep < 1) {
      ctx.save();
      ctx.beginPath(); ctx.rect(Math.max(0, scanX), 0, W - Math.max(0, scanX), H); ctx.clip();
      drawPaper(1, 0, 0);
      ctx.restore();
    }
    // scan line
    if (sweep > 0 && sweep < 1) {
      ctx.save();
      ctx.shadowColor = 'rgba(140,200,255,0.9)'; ctx.shadowBlur = 22;
      ctx.strokeStyle = 'rgba(190,225,255,0.9)';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, H); ctx.stroke();
      ctx.restore();
      ctx.font = '9px "Martian Mono", monospace';
      ctx.fillStyle = 'rgba(190,225,255,0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('AUDIT → BUILD', scanX + 10, H * 0.09);
    }

    // copy crossfade: paper cluster dies 0.10-0.28, live cluster lives 0.30-…, all copy fades near handoff
    const paperA = Math.max(0, 1 - Math.max(0, (smooth - 0.10)) / 0.18);
    const liveIn = Math.min(1, Math.max(0, (smooth - 0.30)) / 0.16);
    const endFade = Math.max(0, 1 - Math.max(0, (smooth - 0.78)) / 0.18);
    paperC.style.opacity = String(paperA);
    paperC.style.transform = `translateY(${-smooth * 30}px)`;
    liveC.style.opacity = String(liveIn * endFade);
    liveC.style.transform = `translateY(${(1 - liveIn) * 14 - push * 40}px)`;

    // stage class for DOM chrome
    document.body.classList.toggle('stage-dark', smooth > 0.2);
    readoutLine.textContent = smooth > 0.55 ? 'the map is running itself' : 'scroll · the audit becomes the build';

    if (!reduced) rafId = requestAnimationFrame(frame);
  }

  size(); addEventListener('resize', size);
  rafId = requestAnimationFrame(frame);
  if (reduced) {
    smooth = 0.5;
    rafId = requestAnimationFrame(() => frame(9000));
  }

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      removeEventListener('resize', size);
      // Drop the stage class so no global state lingers after the hero
      // unmounts (e.g. client-side navigation away from the homepage).
      document.body.classList.remove('stage-dark');
    },
  };
}
