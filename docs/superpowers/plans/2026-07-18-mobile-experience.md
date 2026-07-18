# Mobile Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give mobile users the same quality experience as desktop: working hero choreography, full navigation, and clean rendering on every route.

**Architecture:** The hero canvas engine gains a layout-band parameter (desktop keeps its exact right-band composition; mobile composes the same map full-width into the bottom band under stacked copy), and the instrument restores scroll choreography on mobile with a 200vh track (static path becomes reduced-motion only). A new MobileNav client component adds a hamburger plus full-screen working-wall overlay below lg. FAB and footer get safe-area clearances, then a full route-by-route QA sweep at 375x812.

**Tech Stack:** Next.js 16 app router, React 19, TypeScript, Tailwind 4 + CSS variables (working-wall utility contract in app/globals.css), canvas 2D engine.

**Spec:** docs/superpowers/specs/2026-07-18-mobile-experience-design.md

## Global Constraints

- Repo root: /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b (branch claude/mobile-site-experience-f6de8b).
- Desktop (>= 768px canvas / lg header) must stay pixel-identical; every task verifies this explicitly.
- No test framework: verification is `npm run build` (type check) plus browser checks against the PRODUCTION server (`npm run build && npm start`) — never the dev server (recorded gotcha: dev cannot hot-reload this CSS; dev preview throttles rAF).
- Commits: conventional commits (`feat:`/`fix:`), message written to a scratchpad file and committed with `git commit -F <file>` — never heredocs (recorded gotcha).
- Reuse the existing token system (`var(--color-*)`, `anno`, `btn-ink`, `type-display`, `link-draw`, `graph-field`); do not introduce a parallel styling system.
- `prefers-reduced-motion: reduce` must always get the static single-viewport hero, on any viewport.
- Task order: Tasks 1–4 (hero) and Tasks 5–6 (nav/FAB) are independent of each other; Task 7 (QA sweep) runs last, after all of them.

---
## Part A: Hero: vertical recomposition for mobile

Scope: spec section "1. Hero: vertical recomposition" plus its share of "Error
handling" and "Testing and verification". Nav/FAB/QA are handled by another agent.

Repo root: `/Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b`
Scratchpad (for commit-message files): `/private/tmp/claude-501/-Users-calebbolden-Projects-calebbolden-com--claude-worktrees-mobile-site-experience-f6de8b/6dd38f05-ba93-46f9-803e-a149d0405e25/scratchpad`

Design constants chosen for the mobile band (all fractions of the canvas box W/H):
- Horizontal: `left = 0.05W`, `right = 0.95W` (5% side margins, full-width map).
- Vertical band: `cy = 0.71H`, rows at `cy ± 0.075H`, memory at `cy − 0.15H`,
  column headers at `0.50H`, live lanes `0.52H → 0.90H`. Map content lands
  ~y50%–82%, inside the spec's "roughly 48%–92%" bottom band.
- Box width on mobile: `cw = 0.18 * span` (guarantees the AGENTS→DONE columns
  don't overlap; the desktop `min(132, 0.20*span)` would collide at 375px).
- Label scale on mobile: `0.72` (column + node labels shrink to fit the band).
- Camera focal point on mobile: `(0.50W, 0.71H)` — the mobile map centre, so the
  live-phase zoom stays framed instead of pushing the map off-screen.

Desktop (>= 768px canvas width) returns the exact current numbers, so the desktop
render is pixel-identical.

---

### Task 1: Parameterize the engine layout into a band (desktop unchanged, mobile bottom-band composition)

**Files:**
- Modify: `components/hero/heroEngine.ts` (interfaces ~6–41; buildGraph 52–85; drawPaper 129–190; drawLive 229–237, 313; frame 370–371)

**Interfaces:**
- Consumes: nothing new (reads existing module-scoped `W`, `H`).
- Produces: a module-scoped `let layout: Layout` and `function computeLayout(): Layout`, set inside `buildGraph()` on every `size()`/resize. All draw functions read composition from `layout.*`. No exported signature changes — `initHeroEngine(canvas, getProgress)` is unchanged. The other agent (nav/FAB) does not depend on this.

- [ ] **Step 1: Add the `Layout` interface.**
  Insert immediately after the `Packet` interface (after line 41, before `export function initHeroEngine`):
  ```ts
  interface Layout {
    left: number;
    right: number;
    cy: number;
    rowGap: number;
    memGap: number;
    cw: number;
    headerY: number;
    laneTop: number;
    laneBottom: number;
    focalX: number;
    focalY: number;
    labelScale: number;
    mobile: boolean;
  }
  ```

- [ ] **Step 2: Add `computeLayout()`, a `layout` binding, and refactor `buildGraph()` to consume the band.**
  Replace the whole block from line 52 through line 85 (the `/* shared pipeline geometry */` comment through the closing `}` of `buildGraph`):
  ```ts
    /* ---------- shared pipeline geometry (identical in both worlds) ---------- */
    let nodes: Record<string, HeroNode>;
    let edges: Edge[];
    let cols: Col[];
    layout is assigned in buildGraph() (runs inside size(), before the first frame)
  ```
  with:
  ```ts
    /* ---------- shared pipeline geometry (identical in both worlds) ---------- */
    let nodes: Record<string, HeroNode>;
    let edges: Edge[];
    let cols: Col[];
    let layout!: Layout;

    // Layout band the map is composed into. Desktop (>= 768px canvas width) keeps
    // the original composition: text owns the left ~40%, the map lives in the
    // right band. Mobile (< 768px) drops the same map full-width into the bottom
    // band (y ~50%-90%) so it sits under the stacked copy instead of on top of it.
    // A zero-width box (W falls back to innerWidth in size(); if that is 0 too)
    // resolves to the desktop band.
    function computeLayout(): Layout {
      const mobile = W > 0 && W < 768;
      if (!mobile) {
        const left = W * 0.42, right = W * 0.955, span = right - left;
        return {
          left, right,
          cy: H * 0.52, rowGap: H * 0.16, memGap: H * 0.27,
          cw: Math.min(132, span * 0.20),
          headerY: H * 0.155, laneTop: H * 0.175, laneBottom: H * 0.84,
          focalX: W * 0.68, focalY: H * 0.52,
          labelScale: 1, mobile: false,
        };
      }
      const left = W * 0.05, right = W * 0.95, span = right - left;
      return {
        left, right,
        cy: H * 0.71, rowGap: H * 0.075, memGap: H * 0.15,
        cw: span * 0.18,
        headerY: H * 0.50, laneTop: H * 0.52, laneBottom: H * 0.90,
        focalX: W * 0.50, focalY: H * 0.71,
        labelScale: 0.72, mobile: true,
      };
    }

    function buildGraph() {
      layout = computeLayout();
      const { left, cy, rowGap, memGap } = layout;
      const CW = layout.cw, CH = 42;
      const span = layout.right - left;
      cols = [
        { x: left + span * 0.00, label: '01 / INTAKE' },
        { x: left + span * 0.30, label: '02 / TRIAGE' },
        { x: left + span * 0.62, label: '03 / AGENTS' },
        { x: left + span * 1.00 - CW, label: '04 / DONE' },
      ];
      const N = (col: number, y: number, label: string, paperLabel: string, opts: Partial<HeroNode> = {}): HeroNode =>
        ({ x: cols[col].x, y: y - CH / 2, w: CW, h: CH, label, paperLabel, busy: -9, ...opts });
      nodes = {
        intake: N(0, cy,          'INTAKE',        'call comes in'),
        triage: N(1, cy,          'TRIAGE',        'front desk sorts'),
        voice:  N(2, cy - rowGap, 'VOICE AGENT',   'phone tag'),
        docs:   N(2, cy,          'DOCS AGENT',    'paperwork pile'),
        camp:   N(2, cy + rowGap, 'CAMPAIGN AGENT','marketing? later'),
        done:   N(3, cy,          'DONE',          'invoice sent', { counter: true }),
        memory: N(2, cy - memGap, 'MEMORY',        'sticky notes', { dashed: true, small: true }),
      };
      nodes.memory.w = CW * 0.78; nodes.memory.h = 34;
      edges = ([
        ['intake', 'triage'], ['triage', 'voice'], ['triage', 'docs'], ['triage', 'camp'],
        ['voice', 'done'], ['docs', 'done'], ['camp', 'done'],
      ]).map(([a, b]): Edge => ({ a, b, k: a + '>' + b, pts: [], lens: [], total: 0 }));
      edges.push({ a: 'memory', b: 'voice', k: 'memory>voice', dashed: true, pts: [], lens: [], total: 0 });
      for (const e of edges) routeEdge(e);
    }
  ```
  (The `old_string` for the Edit is the literal current lines 52–85; the 3rd line
  of the pseudo-block above is just prose describing where `layout` gets set — the
  real match is the exact source. Match lines 52–85 verbatim from the file.)

- [ ] **Step 3: drawPaper — scale the column-header font and move it to the band header line.**
  Replace (lines 129–132):
  ```ts
      ctx.font = `${9 * S}px "Martian Mono", monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(40,52,64,0.45)';
      for (const c of cols) ctx.fillText(c.label, c.x * S + OX, H * 0.155 * S + OY);
  ```
  with:
  ```ts
      ctx.font = `${9 * S * layout.labelScale}px "Martian Mono", monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'rgba(40,52,64,0.45)';
      for (const c of cols) ctx.fillText(c.label, c.x * S + OX, layout.headerY * S + OY);
  ```

- [ ] **Step 4: drawPaper — scale the node-label font.**
  Replace (line 158):
  ```ts
        ctx.font = `${(nd.small ? 8.5 : 9.5) * S}px "Martian Mono", monospace`;
  ```
  with:
  ```ts
        ctx.font = `${(nd.small ? 8.5 : 9.5) * S * layout.labelScale}px "Martian Mono", monospace`;
  ```

- [ ] **Step 5: drawPaper — drop the margin notes + amber sticky on mobile.**
  These annotations (`waits 4 days`, `rework ×2`, the rework arc, the amber
  sticky) can't fit legibly at 375px and would spill outside the band. They are
  the last thing drawn in `drawPaper`, so an early return skips exactly them.
  Replace (line 164):
  ```ts
      // pain annotations (the audit's red pen, in ink)
  ```
  with:
  ```ts
      // Margin notes + amber sticky can't fit legibly at 375px — drop on mobile.
      if (layout.mobile) return;
      // pain annotations (the audit's red pen, in ink)
  ```

- [ ] **Step 6: drawLive — scale the header font, move the header + lane lines into the band.**
  Replace (lines 229–238):
  ```ts
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
  ```
  with:
  ```ts
      ctx.font = `${9 * S * layout.labelScale}px "Martian Mono", monospace`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      for (const c of cols) {
        const x = c.x * S + OX;
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillText(c.label, x, layout.headerY * S + OY);
        ctx.strokeStyle = 'rgba(150,200,250,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, layout.laneTop * S + OY); ctx.lineTo(x, layout.laneBottom * S + OY); ctx.stroke();
      }
  ```

- [ ] **Step 7: drawLive — scale the node-label font.**
  Replace (line 313):
  ```ts
        const fs = (nd.small ? 8.5 : 9.5) * S;
  ```
  with:
  ```ts
        const fs = (nd.small ? 8.5 : 9.5) * S * layout.labelScale;
  ```

- [ ] **Step 8: frame — aim the live-phase camera zoom at the band's focal point.**
  Replace (lines 370–371):
  ```ts
      const OX = -W * 0.68 * (S - 1) - push * W * 0.04;
      const OY = -H * 0.52 * (S - 1) + push * H * 0.02;
  ```
  with:
  ```ts
      const OX = -layout.focalX * (S - 1) - push * W * 0.04;
      const OY = -layout.focalY * (S - 1) + push * H * 0.02;
  ```
  (Desktop `focalX/focalY` are `W*0.68`/`H*0.52` — identical expression, so
  desktop is unchanged.)

- [ ] **Step 9: Verify build + type check.**
  Run: `cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b && npm run build`
  Expected: build succeeds, no TypeScript errors. In particular no "used before
  assigned" on `layout` (the `!` definite-assignment on `let layout!: Layout;`
  suppresses it; `buildGraph()` runs inside `size()` before the first frame).

- [ ] **Step 10: Commit.**
  ```bash
  cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
  printf '%s\n' 'feat(hero): compose the engine into a layout band (mobile bottom-band map)' > "$SCRATCH/a1-msg.txt"
  git add components/hero/heroEngine.ts
  git commit -F "$SCRATCH/a1-msg.txt"
  ```
  where `SCRATCH=/private/tmp/claude-501/-Users-calebbolden-Projects-calebbolden-com--claude-worktrees-mobile-site-experience-f6de8b/6dd38f05-ba93-46f9-803e-a149d0405e25/scratchpad`

---

### Task 2: Restore the scroll choreography on mobile (instrument)

**Files:**
- Modify: `components/HeroInstrument.tsx` (comment 7–12; effect 97–103; add mobile state; track height 158)

**Interfaces:**
- Consumes: the engine's mobile band from Task 1 (no code coupling — the engine
  reads the canvas box width itself).
- Produces: no exported API change. Static (single-viewport) path is now gated on
  `prefers-reduced-motion: reduce` ONLY; every viewport otherwise gets the
  scroll-driven path. Mobile scroll track is `200vh`, desktop stays `280vh`.

- [ ] **Step 1: Update the component doc comment to match the new behavior.**
  Replace (lines 7–12):
  ```tsx
  // The hero instrument: a scroll-driven canvas (Task 18's heroEngine) plus two
  // copy clusters that crossfade as the canvas sweeps from the paper map to the
  // live system. Desktop gets the full 280vh scroll choreography; mobile and
  // prefers-reduced-motion get a single static viewport with the engine pinned
  // to the midpoint split. DOM shape ported from
  // docs/design/hero-prototype-2026-07-14.html. Styles land in Task 22.
  ```
  with:
  ```tsx
  // The hero instrument: a scroll-driven canvas (Task 18's heroEngine) plus two
  // copy clusters that crossfade as the canvas sweeps from the paper map to the
  // live system. Every viewport gets the scroll choreography (desktop 280vh,
  // mobile 200vh); only prefers-reduced-motion falls back to a single static
  // viewport with the engine pinned to the midpoint split. The engine composes
  // its map into a desktop or mobile band from the canvas box width. DOM shape
  // ported from docs/design/hero-prototype-2026-07-14.html.
  ```

- [ ] **Step 2: Narrow the static-path media query to reduced-motion, and add a mobile-viewport flag for the track height.**
  Replace (lines 95–103):
  ```tsx
    // Detect mobile viewport or reduced-motion preference; re-check on change
    // (viewport resize across the breakpoint, or the OS preference flipping).
    useEffect(() => {
      const mq = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');
      setIsStatic(mq.matches);
      const onChange = () => setIsStatic(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }, []);
  ```
  with:
  ```tsx
    // Static (single-viewport) path is reduced-motion only now; mobile keeps the
    // scroll choreography. Re-check on change (the OS preference flipping).
    useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsStatic(mq.matches);
      const onChange = () => setIsStatic(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }, []);

    // Track height: shorten the pinned scroll section on phones so it doesn't
    // feel endless. Re-check on resize across the 768px breakpoint.
    useEffect(() => {
      const mq = window.matchMedia('(max-width: 767px)');
      setIsMobile(mq.matches);
      const onChange = () => setIsMobile(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }, []);
  ```

- [ ] **Step 3: Add the `isMobile` state next to `isStatic`.**
  Replace (line 93):
  ```tsx
    const [isStatic, setIsStatic] = useState(false);
  ```
  with:
  ```tsx
    const [isStatic, setIsStatic] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
  ```

- [ ] **Step 4: Make the scroll track height responsive.**
  Replace (line 158):
  ```tsx
      <div ref={trackRef} className="hero-track" style={{ height: '280vh' }}>
  ```
  with:
  ```tsx
      <div ref={trackRef} className="hero-track" style={{ height: isMobile ? '200vh' : '280vh' }}>
  ```
  (SSR and first client render both start `isMobile=false` → `280vh`, matching
  the server output; it flips to `200vh` after mount on phones. No hydration
  mismatch, same pattern as the existing `isStatic` flag.)

- [ ] **Step 5: Verify build + type check.**
  Run: `cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b && npm run build`
  Expected: build succeeds, no TypeScript errors, no unused-var warning for
  `isMobile`/`setIsMobile`.

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
  printf '%s\n' 'feat(hero): restore scroll choreography on mobile (200vh track, reduced-motion-only static)' > "$SCRATCH/a2-msg.txt"
  git add components/HeroInstrument.tsx
  git commit -F "$SCRATCH/a2-msg.txt"
  ```

---

### Task 3: Mobile cluster + spec-bar CSS

**Files:**
- Modify: `app/globals.css` (hero styles inside `@layer utilities`, insert after the `max-width: 860px` readout rule at lines 733–735)

**Interfaces:**
- Consumes: the existing hero class names (`.hero-sticky .viewport`,
  `.cluster-wrap`, `h1`, `.sub`, `.ctas`, `.btn`, `.pills`, `.pill`) and the
  existing `@media (max-width: 860px) { .readout { display: none } }` rule (that
  already hides the two-line readout on mobile — no change needed for it).
- Produces: a `@media (max-width: 767px)` block. Desktop (>= 768px) is untouched;
  all existing rules are unchanged, only overridden below 768px.

- [ ] **Step 1: Add the mobile hero block.**
  Replace (lines 733–736 — the `max-width: 860px` readout rule and the closing
  `}` of `@layer utilities`):
  ```css
    @media (max-width: 860px) {
      .hero-sticky .readout { display: none; }
    }
  }
  ```
  with:
  ```css
    @media (max-width: 860px) {
      .hero-sticky .readout { display: none; }
    }

    /* Mobile hero: copy stacks in the top half at a reduced type scale; the map
       band (heroEngine mobile layout) owns the bottom half. The spec bar keeps
       just its pills at a compact size (the two-line readout is already hidden
       below 860px), anchored at the bottom under the map band. */
    @media (max-width: 767px) {
      .hero-sticky .viewport {
        padding: 60px 6% 24px;
      }
      .hero-sticky .cluster-wrap {
        max-width: none;
      }
      .hero-sticky h1 {
        margin-top: 14px;
        font-size: clamp(1.5rem, 6vw, 1.9rem);
      }
      .hero-sticky .sub {
        margin-top: 14px;
        max-width: none;
        font-size: 14px;
        line-height: 1.55;
      }
      .hero-sticky .ctas {
        margin-top: 20px;
        gap: 10px;
      }
      .hero-sticky .btn {
        padding: 12px 18px;
        font-size: 10.5px;
      }
      .hero-sticky .pills {
        gap: 6px;
      }
      .hero-sticky .pill {
        font-size: 9px;
        letter-spacing: 0.1em;
        padding: 7px 11px;
        gap: 6px;
      }
    }
  }
  ```
  Note: `.pills` keeps `flex-wrap: wrap` (inherited). On the narrowest phones the
  three pills may wrap to two rows; that's acceptable because the spec bar is
  bottom-anchored below the map band. Do NOT force `flex-wrap: nowrap` — that
  produces horizontal page overflow, which the mobile QA pass forbids.

- [ ] **Step 2: Verify build.**
  Run: `cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b && npm run build`
  Expected: build succeeds (CSS is not type-checked, but confirms no syntax error
  broke the stylesheet parse / no build regression).

- [ ] **Step 3: Commit.**
  ```bash
  cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
  printf '%s\n' 'feat(hero): mobile cluster + spec-bar CSS (copy stacks top, pills condense)' > "$SCRATCH/a3-msg.txt"
  git add app/globals.css
  git commit -F "$SCRATCH/a3-msg.txt"
  ```

---

### Task 4: Hero browser verification (mobile band + desktop regression + resize)

No code changes — this is the hero slice of "Testing and verification". Per the
recorded project gotcha, verify against the PRODUCTION server, not the dev server
(dev can't hot-reload this CSS and its preview throttles rAF).

**Files:** none (verification only).

- [ ] **Step 1: Build and start the production server.**
  ```bash
  cd /Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
  npm run build && npm start
  ```
  Expected: server listening on `http://localhost:3000`.

- [ ] **Step 2: Mobile hero — progress 0 (top of scroll).**
  Open `http://localhost:3000/` in the browser pane, viewport preset mobile
  (375x812), fresh scroll at the top. Verify:
  - Headline "AI agents that answer your calls…" is fully readable, not clipped.
  - No canvas element intersects the copy cluster — the paper map sits in the
    bottom band (~lower half), the copy sits in the top half, clear gap between.
  - The whole map is inside the viewport width (no map edge clipped off-screen
    right or left).
  - Column labels (01/INTAKE … 04/DONE) are legible inside the band, not colliding
    with the "sheet 1 / the map" eyebrow.
  - No horizontal page scroll.

- [ ] **Step 3: Mobile hero — mid-wipe.**
  Scroll down ~40–55% of the track. Verify the scan line sweeps left→right across
  the full width; paper (right of the line) and live (left) both render inside the
  band; the copy crossfade is progressing; nothing overlaps the copy.

- [ ] **Step 4: Mobile hero — end (live phase).**
  Scroll to the bottom of the pinned section. Verify the live system is fully in
  view: the camera zoom stays framed on the map (map does not push off-screen),
  the "running right now" live copy is readable in the top half, the pills row sits
  at the bottom under the map band, and `jobs completed` counter area does not
  overlap the map. No horizontal overflow at any scroll position.

- [ ] **Step 5: Reduced-motion mobile.**
  With the OS "reduce motion" setting on (or emulated), reload at 375x812. Verify
  the hero renders the single static viewport (no long scroll track), map in the
  bottom band, copy readable — i.e. the static path still works and uses the mobile
  band.

- [ ] **Step 6: Desktop regression (pixel-identical).**
  Switch to desktop preset (1280x800), reload `/`. Verify the hero is visually
  identical to before this branch: text owns the left ~40%, map in the right band,
  margin notes + amber sticky present, same scan wipe and camera push. Nothing
  about the desktop composition changed.

- [ ] **Step 7: Resize across the 768px breakpoint.**
  With the page open, resize the window from 1280 down through 767 and back up.
  Verify the map rebuilds cleanly at the crossover (desktop right-band ⇄ mobile
  bottom-band) with no clipping, no stuck composition, and no console errors (the
  existing `resize` → `size()` → `buildGraph()` → `computeLayout()` path re-runs).

- [ ] **Step 8: Report.**
  Record pass/fail per step with the screenshots (progress 0 / mid / end mobile,
  desktop). If any label is too small to read or any element clips, tune the
  mobile constants in `computeLayout()` (`labelScale`, `cw`, band fractions) or the
  Task 3 CSS sizes and re-verify — those are the intended tuning knobs.

---

## Part B: Mobile nav, chat FAB/footer, QA sweep

Scope: spec sections 2 (mobile nav overlay), 3 (chat FAB + footer), 4 (full mobile QA pass).
Repo: `/Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b`
Branch: `claude/mobile-site-experience-f6de8b`. Next.js 16 app router, Tailwind 4, TS.

Conventions verified against source:
- Repo mixes Tailwind utilities with inline `style={{}}` using CSS vars (`var(--color-hairline)`, `var(--color-ink-muted)`, `var(--color-ink-faint)`, `var(--color-bg)`) and utility classes `anno`, `btn-ink`, `type-display`, `link-draw`, `graph-field`. Reuse these.
- No test framework. Verify = `npm run build` (type check) then `npm run build && npm start` (prod server — dev cannot hot-reload this CSS; recorded gotcha) with the browser pane.
- Commits: conventional commits (`feat:`/`fix:`), authored via message file + `git commit -F` (never heredocs).
- Chat FAB (`components/AIChat.tsx:97-109`) is `md:hidden` (mobile-only; desktop shows the sidebar). Hamburger shows below `lg` (matches links `hidden lg:flex`). So: hamburger visible 0-1023px; FAB visible 0-767px; footer FAB overlap only occurs below `md` (768px).

---

### Task 5: Mobile nav — hamburger + full-screen overlay (`components/MobileNav.tsx`)

**Files:**
- Create: `components/MobileNav.tsx` (new client component)
- Modify: `components/Header.tsx:16-59` (import + render `<MobileNav>`; Header stays a server component)

**Interfaces:**
- Consumes: the existing `links` array in `Header.tsx` (`{ label: string; href: string }[]` — Services /#services, Method /#method, Packages /#packages, Resources /resources, Work /work, Blog /blog). Plain serializable objects, safe to pass from a server component to a client component.
- Produces: `export default function MobileNav({ links }: { links: NavLink[] })` where `type NavLink = { label: string; href: string }`.

- [ ] **Step 1: Create `components/MobileNav.tsx`**
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type NavLink = { label: string; href: string };

// Full-screen working-wall menu behind a hamburger, shown below lg (1024px).
// Header stays a server component; all interactive state lives here.
export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock body scroll, move focus into the overlay, close on Esc.
  // On close/unmount: restore scroll and return focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-overlay"
        onClick={() => setOpen(true)}
        className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="graph-field fixed inset-0 z-[300] flex flex-col overflow-y-auto lg:hidden"
          style={{ background: 'var(--color-bg)' }}
        >
          <div
            className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8"
            style={{ borderBottom: '1px solid var(--color-hairline)' }}
          >
            <span className="type-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.01em' }}>
              Caleb Bolden
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="-mr-2 flex h-11 w-11 items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-1 flex-col px-5 pt-2 sm:px-8">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-5"
                style={{ borderBottom: '1px solid var(--color-hairline)' }}
              >
                <span className="type-display" style={{ fontSize: 34 }}>
                  {l.label}
                </span>
                <span className="anno" style={{ color: 'var(--color-ink-faint)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>
            ))}
          </nav>

          <div className="px-5 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-ink w-full"
              style={{ padding: '14px 22px', fontSize: 15 }}
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Import `MobileNav` in `Header.tsx`**
In `components/Header.tsx`, add the import directly under the existing `import Link from 'next/link';` (line 1):
```tsx
import Link from 'next/link';
import MobileNav from './MobileNav';
```

- [ ] **Step 3: Render `<MobileNav>` in the header's right zone**
In `components/Header.tsx`, replace the closing of the right-side `div` (currently lines 53-56):
```tsx
        <span className="anno hidden lg:block" style={{ color: 'var(--color-ink-faint)' }}>
          sht 1 / rev b
        </span>
      </div>
```
with:
```tsx
        <span className="anno hidden lg:block" style={{ color: 'var(--color-ink-faint)' }}>
          sht 1 / rev b
        </span>
        <MobileNav links={links} />
      </div>
```
(The hamburger renders rightmost in the cluster: brand | ... | Let's talk | hamburger. It is `lg:hidden`, so at `lg+` nothing changes — the desktop header is byte-identical.)

- [ ] **Step 4: Verify — type check**
Run: `npm run build`
Expected: build completes with no TypeScript errors; `components/MobileNav.tsx` compiles; no lint failure on the new file.

- [ ] **Step 5: Verify — mobile behavior (prod server)**
Run: `npm run build && npm start`, browser pane at **375x812**, load `http://localhost:3000/`.
Expected, in order:
  1. Header shows brand (left), "Let's talk" and a hamburger (right). No inline link list.
  2. Tap hamburger → full-screen white overlay with graph-paper field, brand + close (X) top bar, six big-type rows (Services, Method, Packages, Resources, Work, Blog) each with a hairline underline and a right-aligned mono number `01`-`06`, and a full-width dark "Let's talk" button at the bottom.
  3. Background page does not scroll while the overlay is open (body scroll locked).
  4. Tapping a link closes the overlay and navigates. Tapping the X closes it. Pressing Esc (hardware keyboard / devtools) closes it.
  5. Every tap target (hamburger, close, each link row, CTA) is at least ~44px tall.
  6. `aria-expanded` on the hamburger flips `false`→`true`→`false`; after close, focus returns to the hamburger (check the focus ring).

- [ ] **Step 6: Verify — desktop unchanged (spot-check)**
Browser pane at **1280x800**, load `http://localhost:3000/`.
Expected: header is pixel-identical to before — inline link list visible, `sht 1 / rev b` annotation visible, NO hamburger (it is `lg:hidden`). Overlay never appears.

- [ ] **Step 7: Commit**
```bash
DIR=/Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
MSG=/private/tmp/claude-501/-Users-calebbolden-Projects-calebbolden-com--claude-worktrees-mobile-site-experience-f6de8b/6dd38f05-ba93-46f9-803e-a149d0405e25/scratchpad/msg-b1.txt
printf '%s\n' 'feat: mobile nav overlay behind a hamburger below lg' > "$MSG"
git -C "$DIR" add components/MobileNav.tsx components/Header.tsx
git -C "$DIR" commit -F "$MSG"
```

---

### Task 6: Chat FAB safe-area offset + footer mobile bottom padding

**Files:**
- Modify: `components/AIChat.tsx:104` (FAB `className`/`style` — safe-area bottom offset)
- Modify: `components/Footer.tsx:12` (inner container padding — clear the FAB on mobile)

**Interfaces:**
- Consumes: nothing new.
- Produces: no exported signature change. Behavioral: FAB sits above the iOS home indicator; footer links never sit under the FAB below `md`.

- [ ] **Step 1: Give the FAB a safe-area-aware bottom offset**
In `components/AIChat.tsx`, the FAB button (line 104) currently is:
```tsx
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.55_0.09_210)] text-white transition-colors hover:bg-[oklch(0.62_0.09_210)] motion-reduce:transition-none md:hidden"
```
Remove `bottom-6` from the class list and add an inline `style` with the safe-area calc. The full opening button tag (lines 97-105) becomes:
```tsx
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsCollapsed(false);
        }}
        aria-label="Open chat assistant"
        className="fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.55_0.09_210)] text-white transition-colors hover:bg-[oklch(0.62_0.09_210)] motion-reduce:transition-none md:hidden"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
```
(`1.5rem` preserves the original `bottom-6`; `env(safe-area-inset-bottom)` lifts it above the home indicator on notched devices, 0 elsewhere.)

- [ ] **Step 2: Add footer bottom padding below `md` so links clear the FAB**
In `components/Footer.tsx`, the inner container (line 12) is:
```tsx
      <div className="mx-auto w-[90%] max-w-[1200px] py-8">
```
Replace with:
```tsx
      <div className="mx-auto w-[90%] max-w-[1200px] pt-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
```
(Splits `py-8` into `pt-8` + a larger bottom pad. FAB occupies ~80px from the bottom [24px offset + 56px height]; `6rem`=96px plus the safe-area inset clears it. `md:pb-8` restores the normal 32px at `md+`, where the FAB is `md:hidden`, so tablet/desktop footers are unchanged.)

- [ ] **Step 3: Verify — type check**
Run: `npm run build`
Expected: build passes, no TS errors.

- [ ] **Step 4: Verify — FAB + footer on mobile (prod server)**
Browser pane at **375x812**, `npm run build && npm start`, load `http://localhost:3000/` and scroll to the footer.
Expected:
  1. The teal FAB sits bottom-right and does NOT cover any footer link (copyright line + the five service links are fully visible and tappable).
  2. FAB tap still opens the chat panel; close still works.
  3. Footer title-block grid and copyright are unchanged in layout aside from the extra bottom breathing room.

- [ ] **Step 5: Verify — tablet/desktop footer unchanged (spot-check)**
Browser pane at **1280x800**, load `/` and scroll to footer.
Expected: footer is pixel-identical to before (bottom padding back to `py-8` equivalent via `md:pb-8`); no FAB present (chat sidebar visible instead).

- [ ] **Step 6: Commit**
```bash
DIR=/Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
MSG=/private/tmp/claude-501/-Users-calebbolden-Projects-calebbolden-com--claude-worktrees-mobile-site-experience-f6de8b/6dd38f05-ba93-46f9-803e-a149d0405e25/scratchpad/msg-b2.txt
printf '%s\n' 'fix: safe-area FAB offset and footer clearance so the FAB never covers links' > "$MSG"
git -C "$DIR" add components/AIChat.tsx components/Footer.tsx
git -C "$DIR" commit -F "$MSG"
```

---

### Task 7: Full mobile QA sweep at 375x812 (every route, end to end)

Runs AFTER Tasks 1–6 have landed. This is a verification-and-fix task, not a feature build. No code is written up front; each defect that surfaces gets its own `fix:` commit and a re-verify of that route.

**Files:**
- Modify: only files that surface a defect during the sweep (unknown until run). Likely candidates if anything: `app/**/page.tsx`, component files, `app/globals.css`.

**Interfaces:**
- Consumes: the merged branch state (Tasks 1–6).
- Produces: a checked-off route matrix + zero-defect confirmation, plus any `fix:` commits.

- [ ] **Step 1: Start the prod server once for the whole sweep**
Run: `npm run build && npm start` (dev server is not valid for this CSS — recorded gotcha). Browser pane resized to the **mobile preset 375x812**. Keep this server up across all route checks.

**Per-route checklist.** For each route below, load it at 375x812 and confirm ALL of: (a) no horizontal overflow — the page body never scrolls sideways; (b) no overlapping or clipped text; (c) tap targets (links, buttons, form controls) at least ~44px; (d) any forms are usable (fields reachable, labels visible, submit reachable above the FAB); (e) the chat FAB opens and closes cleanly and does not cover content; (f) the hamburger overlay opens/closes cleanly. Tick the box only when the route passes all checks (after any fixes).

- [ ] **Step 2:** `/` (home) — plus: hero renders inside its band with no clip and no text collision (hero is Tasks 1–4's; confirm it here); footer links clear the FAB (Task 6); hamburger overlay (Task 5).
- [ ] **Step 3:** `/about`
- [ ] **Step 4:** `/work`
- [ ] **Step 5:** `/work/vora`
- [ ] **Step 6:** `/work/chapterhq`
- [ ] **Step 7:** `/work/open-source`
- [ ] **Step 8:** `/work/site-assistant`
- [ ] **Step 9:** `/services/marketing`
- [ ] **Step 10:** `/services/seo`
- [ ] **Step 11:** `/services/web-development`
- [ ] **Step 12:** `/blog`
- [ ] **Step 13:** `/blog/map-before-you-automate` (one representative post; confirm long-form prose stays within the measure, no horizontal scroll on code/quote blocks)
- [ ] **Step 14:** `/resources`
- [ ] **Step 15:** `/contact` — plus: the contact form is fully usable (every field focusable, inputs not under the FAB, submit button reachable and ~44px).
- [ ] **Step 16:** `/how-i-build`
- [ ] **Step 17:** `/tools/ai-readiness` END TO END — complete a FULL scorecard run: answer every question/step through to the final result/score screen. Confirm at each step: no overflow, options are ≥~44px and tappable, progress/nav controls usable, the results view and any email/PDF gate render correctly on mobile and are not obscured by the FAB.
- [ ] **Step 18:** `/tools/revenue-leak` END TO END — complete a FULL calculator run: fill every input, advance through to the final computed result. Confirm number inputs bring up the numeric keypad, no field sits under the FAB, sliders/steppers are tappable, and the result view renders without overflow.

- [ ] **Step 19: Fix-what-surfaces protocol**
For each defect found on a route:
  1. Diagnose the smallest correct fix (prefer a Tailwind responsive utility or a `style` tweak matching the existing token system — `var(--color-*)`, `anno`/`btn-ink`/`type-display`; do not introduce a parallel styling system).
  2. Apply the edit.
  3. Re-run `npm run build` (type check) and, with the prod server, re-load the affected route at 375x812 to confirm the defect is gone AND nothing else on that route regressed.
  4. Spot-check the same route at **1280x800** to confirm the desktop rendering is unchanged (mobile-only utilities `sm:`/`md:`/`lg:` should scope the change).
  5. Commit that single fix on its own:
```bash
DIR=/Users/calebbolden/Projects/calebbolden.com/.claude/worktrees/mobile-site-experience-f6de8b
MSG=/private/tmp/claude-501/-Users-calebbolden-Projects-calebbolden-com--claude-worktrees-mobile-site-experience-f6de8b/6dd38f05-ba93-46f9-803e-a149d0405e25/scratchpad/msg-b3-fix.txt
printf '%s\n' 'fix: <route> mobile <one-line what was wrong>' > "$MSG"
git -C "$DIR" add <changed files>
git -C "$DIR" commit -F "$MSG"
```
  6. Re-tick the route's checkbox above only after it fully passes.

- [ ] **Step 20: Confirm the two known items are fixed**
Explicitly re-confirm on mobile: footer link row no longer wraps awkwardly and is not covered by the FAB (Task 6); the FAB never overlaps footer or form controls on any route.

- [ ] **Step 21: Final full build**
Run: `npm run build`
Expected: clean build, no TS errors, all routes compile. Every route checkbox above is ticked. If any defect could not be fixed, report it plainly with the route, the symptom, and why — do not tick its box.
