# Interaction pass spec — "the working wall" premium motion layer

Shared contract for the 2026-07-06 interaction upgrade. Every implementation task
reads this file first. The brand direction lives in DESIGN.md; this file only adds
the motion/interaction layer on top of it.

## Global constraints (every task)

- Light theme only. Use existing tokens from `app/globals.css` `@theme` block:
  `--color-ink`, `--color-ink-muted`, `--color-ink-faint`, `--color-blue`,
  `--color-blue-deep`, `--color-blue-wash`, `--color-hairline`, `--color-surface`,
  `--color-sticky`, `--color-sticky-edge`. Never hardcode new colors, never purple,
  never any gradient (no `linear-gradient` except the two existing SVG data-URI
  masks already in globals.css).
- Standard easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Hover transitions 0.18-0.3s,
  entrances 0.4-0.7s, idle loops 1-8s.
- Every new animation MUST have a `prefers-reduced-motion: reduce` treatment
  (static end-state, loops off). The foundation task extends the existing media
  block in globals.css; component tasks must not create motion outside the
  utility contract below unless they add their own reduced-motion handling.
- No layout-property animation (width/height/top/left) except the existing
  accordion grid-rows trick. Transform + opacity + stroke props + clip-path only.
- Copy rules: no em dashes or en dashes anywhere, sentence case, no words from
  this list: crucial, pivotal, robust, seamless, delve, transformative, leverage,
  empower, unlock, elevate, streamline, supercharge, game-changer.
- File ownership is absolute. Each task edits ONLY the files named in its brief.
  Utilities are added by the foundation task alone; component tasks reference
  the class names below even if they do not exist yet (parallel execution).
- Do not run `npm run dev` or `npm run build` (sandbox port binding fails).
  `npx tsc --noEmit` is allowed but optional. The orchestrator verifies.

## Utility contract (implemented in app/globals.css by the foundation task)

Class names are exact. Component tasks code against these.

### Hover / focus

- `.corner-hover` — container gets `position: relative`. On `:hover` and
  `:focus-within`, four blueprint-blue crop-mark corners (L-shapes, ~10px legs,
  1.5px thick, `var(--color-blue)`) fade in at the four corners and extend
  slightly outward (2px). No layout shift. 0.25s standard easing.
  Reduced motion: corners appear without movement.
- `.link-draw` — for inline links. A 1px underline in `currentColor` draws
  left to right on hover via `::after` `scaleX(0) -> scaleX(1)`,
  `transform-origin: left`, 0.25s. On mouse-out it retreats to the right
  (`transform-origin` flips). Works on `display: inline-block` or inline-flex.
- Focus rings: `.btn-ink:focus-visible`, `.btn-hairline:focus-visible`, and
  `.corner-hover:focus-visible` get a CAD-style selection marquee:
  `outline: 2px dashed var(--color-blue); outline-offset: 3px;` replacing the
  solid outline for these elements only (global `:focus-visible` rule stays).
  If a clean marching offset is possible without hacks, add it; static dashed
  is acceptable.

### Buttons (text roll)

- `.btn-roll` — composes with `.btn-ink` / `.btn-hairline`. Markup contract:

  ```html
  <button class="btn-ink btn-roll">
    <span class="roll-box">
      <span class="roll-a">Label</span>
      <span class="roll-b" aria-hidden="true">Label</span>
    </span>
  </button>
  ```

  `.roll-box` is `display: inline-block; overflow: hidden; height: 1.4em;` with
  the two labels stacked (flex-col). Hover on `.btn-roll` translates the stack
  up by 50% so label B rolls into place, 0.45s standard easing, no seam.
  Reduced motion: no roll.
- `.arrow-settle` — a child arrow (SVG or span) sits at `rotate(-45deg)` at
  rest; `.btn-roll:hover .arrow-settle` rotates to 0deg, 0.3s. Optional per
  button; only the hero primary CTA uses it.

### Sticky note

- Extend `.sticky-note`: add hover state `translateY(-2px) rotate(-0.6deg)`
  plus deeper shadow, 0.2s.
- `.sticky-settle` — entrance: when inside `.reveal.in` (or given class `.in`),
  animates from `opacity 0, rotate(-7deg) scale(1.05)` to the resting
  `rotate(-1.2deg)` with a slight overshoot (keyframe passes rotate(-0.4deg)),
  0.5s, supports `--stamp-delay`. Reduced motion: instant.

### Status / life

- `.pulse-dot` — 7px round dot, `background: var(--color-blue)`, with an
  `::after` ring that expands from scale(1) to scale(2.4) while fading, 2s
  infinite. Reduced motion: static dot, no ring.
- `.ants` — for SVG strokes: `stroke-dasharray: 4 6` and an infinite linear
  `stroke-dashoffset` march (keyframe shifts offset by -10, ~1.1s). Supports
  `animation-delay` via `--ants-delay`. Reduced motion: static dashes.
- `.flow-dot` — a small (5px) blue circle that travels an SVG path using
  `offset-path` (set inline per use via `style={{ offsetPath: 'path("...")' }}`),
  keyframe `flow-travel { to { offset-distance: 100% } }`, linear or standard
  easing, duration/delay via `--flow-duration` / `--flow-delay`, infinite.
  Wrap the moving rules in `@supports (offset-path: path("M0 0H1"))` and hide
  the element (`display: none`) when unsupported. Reduced motion: hidden.

### Scroll-gated SVG draws (replaces mount-only .draw-line usage)

- `.draw-on-reveal` — same visual as `.draw-line` (dasharray/dashoffset prep on
  the element at rest) but the draw animation only runs when an ancestor
  `.reveal.in` exists: `.reveal.in .draw-on-reveal { animation: drawLine ... }`.
  Honors `--draw-len` and `--draw-delay`. Keep `.draw-line` untouched for
  backward compat.
- `.stamp-on-reveal` — same pattern for `stampIn`, honors `--stamp-delay`.

### Headline ink fill

- `.ink-fill` — markup contract: a heading containing two stacked identical
  spans:

  ```html
  <h2 class="ink-fill">
    <span class="ink-base">Line of copy</span>
    <span class="ink-top" aria-hidden="true">Line of copy</span>
  </h2>
  ```

  `.ink-base` is `color: var(--color-ink-faint)` at reduced opacity (0.35);
  `.ink-top` is absolutely stacked on top in full ink, revealed left to right
  via `clip-path: inset(0 100% 0 0)` -> `inset(0 0 0 0)`.
  Primary driver: CSS scroll-driven animation inside
  `@supports (animation-timeline: view())` using `animation-timeline: view()`
  with `animation-range: entry 20% cover 60%`.
  Fallback (no support): when ancestor `.reveal.in` exists, run the fill once
  over 1.2s. Reduced motion: fully filled, no animation.

### Chat

- `.msg-in` — message entrance: opacity 0 + translateY(8px) to rest, 0.3s
  standard easing. Reduced motion: none (instant).
- `.typing-dots` — container with three 4px dots (`currentColor`), staggered
  opacity/translateY bounce (0.15s stagger), ~1s infinite. Reduced motion:
  three static dots at full opacity.

### Reveal variants

- `components/Reveal.tsx` gains optional prop `variant?: 'rise' | 'stagger'`
  (default `'rise'` = exact current behavior, fully backward compatible).
  `'stagger'` adds class `reveal--stagger`; CSS: direct children start
  `opacity: 0` and, when `.in`, run `riseIn` with
  `animation-delay: calc(var(--i, 0) * 70ms)`. Children set `--i` inline.
  Reduced motion: all visible instantly (extend the existing media block).

## Per-item specs

Item numbers match the approved improvement list.

### Item 1 — Process pipeline (components/Process.tsx)

The 5 phase boxes + connectors become a sequence that visibly activates:

- Wrap the row in a `Reveal` (it may already be; adjust as needed) so the
  sequence is scroll-gated.
- Replace the static `<span>` connector lines with small inline SVG lines
  (with the existing arrowhead style from Hero's map: simple stroke +
  triangle) using `.draw-on-reveal`, sequential `--draw-delay` (i * 220ms).
- Each phase box "activates" in sequence after its incoming connector draws:
  a keyframed transition of `border-color` from hairline to
  `var(--color-blue)` and its `.anno` duration label from faint to
  `anno-blue`, staggered to land right after connector i. Implement as a
  scoped animation triggered under `.reveal.in` (the foundation utilities
  don't cover this; add minimal component-scoped classes but define the
  keyframes via existing utilities where possible; if a new keyframe is
  unavoidable, use a `<style>` tag is NOT allowed in RSC: instead use the
  two utilities `.draw-on-reveal`/`.stamp-on-reveal` plus border-color
  transitions with `transition-delay` toggled by `.reveal.in` descendant
  selectors composed from Tailwind arbitrary variants, e.g.
  `[.reveal.in_&]:border-[var(--color-blue)]` with a `transition-delay`
  arbitrary property. Keep it clean; if arbitrary variants get unreadable,
  fall back to `.stamp-on-reveal` on the boxes only.
- After the draw completes, each connector shows a small traveling dot:
  connectors are straight horizontal lines, so a plain `translateX` keyframe
  is fine (absolutely positioned dot inside the connector wrapper, animating
  left 0% to 100%, one connector at a time in a shared ~6s loop using
  per-connector delays). Hide dots below `lg` (the row stacks; check the
  file's actual responsive behavior and keep mobile clean, entrance-only).
- Do not change copy or IA. Reduced motion: everything static and visible.

### Item 2 — Hero map life (components/Hero.tsx, HeroMap inline function)

- Keep the existing mount-time draw sequence timings but make them
  scroll-gated for robustness: wrap the map (or the whole hero grid) in
  `Reveal` with a low threshold and swap `.draw-line`/`.stamp-in` to
  `.draw-on-reveal`/`.stamp-on-reveal` keeping every existing `--draw-delay`
  / `--stamp-delay` value.
- Idle life after the intro finishes (all delays end by ~1.75s):
  - The dashed rework-loop path additionally gets `.ants` with
    `--ants-delay: 2.2s` so it starts marching after the intro.
  - One `.flow-dot` travels the main Call -> Quote -> Job -> Invoice
    connector route on an inline `offset-path` (compose the path string from
    the existing connector coordinates), `--flow-duration: 7s`,
    `--flow-delay: 2.6s`, infinite.
- Hover states on the four process-box `<g>` groups: `cursor: crosshair`;
  on hover the box `rect` stroke thickens (1.5 -> 2.5) and fill becomes
  `var(--color-blue-wash)`, its label fill shifts to `var(--color-blue)`.
  Use CSS classes on the groups (SVG accepts class + CSS hover fine).
- Item 7 applied: hero primary CTA button ("Analyze my business") gets
  `.btn-roll` markup + `.arrow-settle` arrow; secondary `#packages` link
  stays `.btn-hairline` but gains `.btn-roll` too (no arrow).
- Item 12 applied: the headline/subhead/CTA `.rise-in` entrances stay as-is
  (hero is above the fold; mount timing is correct there).

### Item 3 — NowStrip (new components/NowStrip.tsx + app/page.tsx)

- New client component: a thin full-width strip between Proof and
  Industries. Hairline top and bottom borders, `py-4`,
  same `w-[90%] max-w-[1200px]` container as other sections.
- Left: `.anno` label `On the board this week`. Right (or flowing after on
  mobile): a single-slot cycler. One item visible at a time inside an
  `overflow-hidden` slot (~1.6em tall); items roll vertically every 4s with
  a 0.6s standard-easing translate, seamless loop (triple the array and
  silently reset, same mechanic as a task-queue ticker).
- Items (placeholder copy, orchestrator will flag for owner review):
  `Mapping a quote-to-invoice flow`, `Auditing a client intake form`,
  `Timing a dispatch handoff`, `Drafting an automation spec`,
  `Testing a follow-up assistant`.
- Item text: body font, 15px, `var(--color-ink-muted)`, with a small
  leading blueprint-blue square bullet (4px) as the drafting mark.
- `setInterval` in a `useEffect` with cleanup; pause the interval when
  `document.hidden` (visibilitychange) and under reduced motion show a
  static first item (check `matchMedia('(prefers-reduced-motion: reduce)')`).
- Register it in `app/page.tsx` between `<Proof />` and `<Industries />`.
  This task is the only one allowed to touch page.tsx.

### Item 4 — Live pulse (components/Proof.tsx)

- Rows whose status is `live` (and only those) get a `.pulse-dot` before the
  status label. `running` gets a static blue dot (no pulse), `in development`
  gets nothing. Align vertically with the `.anno` text.

### Item 5 — Corner-bracket hover (components/Packages.tsx, components/Proof.tsx)

- Packages: all three cards get `.corner-hover` plus a gentle lift on hover
  (`translateY(-3px)`, 0.25s transform transition, plus a faint blue-tinted
  shadow `0 8px 24px oklch(0.48 0.1 210 / 0.10)`). Featured card included.
- Proof: each spec-sheet row gets `.corner-hover` and a `background:
  var(--color-surface)` tint on hover (like PainSolution rows).

### Item 6 — Dimension readout (components/Packages.tsx)

- On card hover, a small `.anno anno-blue` annotation fades in at the card's
  top-right showing the engagement duration ALREADY present in the card copy
  (read the file; reuse the real values, e.g. the audit's stated duration).
  Include a tiny horizontal dimension line (12px, with 1px end ticks) drawn
  as inline SVG before the text. `aria-hidden="true"` (decorative duplicate).
  Opacity 0 -> 1 plus 4px slide-down, 0.25s, tied to the same `:hover` as
  `.corner-hover` (plain CSS group-hover via Tailwind `group`/`group-hover`).

### Item 7 — Text-roll CTAs (applied per owner file)

- Applies `.btn-roll` markup contract to: Header "Let's talk" (Header task),
  hero CTAs (Hero task), Packages "Let's talk" link (Packages task), CTA
  submit button (CTA task). Labels must be duplicated exactly; `aria-hidden`
  on the second copy.

### Item 8 — Underline draw + accordion chevron

- Header task: nav links get `.link-draw` (remove the current color-swap-only
  hover or keep color shift AND add the draw; both is fine).
- Proof task: "Visit {name}" links get `.link-draw` instead of
  `hover:underline`.
- PainSolution task: add a plus icon (two 1.5px strokes, currentColor, 12px)
  on the accordion row right side that rotates 45deg into an X when open,
  0.3s standard easing. Keep the existing `{isOpen ? 'close' : row.tag}` tag
  text OR replace `close` with the icon; prefer: tag text stays, `close` word
  replaced by the rotating icon. Also fade the revealed panel content
  (opacity 0 -> 1, 0.25s, delayed 80ms) so it doesn't pop when the grid-rows
  height opens.

### Item 9 — Focus marquee (foundation task only)

- Covered in the utility contract (dashed CAD focus ring on buttons +
  corner-hover elements).

### Item 10 — Sticky-note animation

- Foundation implements `.sticky-settle` + hover (utility contract).
- Packages task applies `.sticky-settle` to the "Start here" badge (it is
  inside a Reveal already; confirm) and keeps `.sticky-note`.
- Hero task: the hero map sticky note is SVG; leave it as-is (already
  stamp-animated).

### Item 11 — Ink-fill headline (components/Process.tsx)

- The Process section heading ("Map the work first. Then automate it.")
  becomes an `.ink-fill` heading per the markup contract. Keep the exact
  copy. It should read as the line being inked as you scroll through the
  section.

### Item 12 — Reveal variants (foundation + CTA task)

- Foundation: the `variant` prop + `reveal--stagger` CSS.
- CTA task: the CTA panel's heading / paragraph / form get an internal
  stagger: wrap in `<Reveal variant="stagger">` with `--i` 0/1/2 on the
  three children. Also give the email input an explicit focus style:
  `border-color: var(--color-blue)` + `box-shadow: 0 0 0 3px
  var(--color-blue-wash)` on focus (the global outline is suppressed by
  `outline-none`; this replaces it accessibly).

### Item 13 — Chat polish (components/AIChat.tsx)

- Every message bubble wrapper gets `.msg-in` so new messages slide in.
  Ensure it applies to newly appended messages (class is on each message
  element; CSS animation runs on mount, which is exactly right).
- Replace the static "Analyzing..." text with `.typing-dots` (three dots)
  plus visually-hidden text "Analyzing" for screen readers (keep whatever
  aria-live wiring exists; do not degrade it).
- Do NOT touch lib/chat/tools.ts or any backend file. Keep all existing
  aria labels, the collapse system, and localStorage behavior untouched.
