# Design

Direction: **the working wall**. The site looks like the thing Caleb sells: a value stream
map mid-session. White mat board, blueprint-blue instrument marks, pencil-gray hairlines,
one amber sticky note. Precise like a drafting table, warm like a facilitator's marker.
Replaces the minimal-clean direction from docs/redesign/synthesis-plan.md (2026-07-06).

Mood sentence: "a process engineer's working wall at 10am: daylight, mat board, blueprint
ink, one sticky note that says automate this."

## Theme

Light only, locked. The scene is a shop owner at the counter in daylight. Dark mode is not
offered; the brand is paper. `color-scheme: light`.

## Color

OKLCH throughout. Strategy: restrained surface, committed identity moments (the blue owns
every mark, diagram, and interactive element; amber appears only as the sticky note).

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(1 0 0)` | Page. Pure white mat board, no tint. |
| `--surface` | `oklch(0.972 0.005 220)` | Panels, wells. |
| `--ink` | `oklch(0.21 0.015 230)` | Headlines, body strong. Drafting ink. ≥7:1 on bg. |
| `--ink-muted` | `oklch(0.42 0.02 230)` | Body secondary. ≥4.5:1 on bg. |
| `--ink-faint` | `oklch(0.55 0.02 230)` | Meta labels. Large/mono text only. |
| `--blue` | `oklch(0.48 0.10 210)` | Blueprint blue. Marks, links, diagram strokes, buttons. White text on fills. |
| `--blue-deep` | `oklch(0.36 0.08 220)` | Hover state, strong strokes. |
| `--blue-wash` | `oklch(0.94 0.02 210)` | Selection, soft fills, tag backgrounds. |
| `--grid-line` | `oklch(0.48 0.10 210 / 0.09)` | Graph-paper lines. Never behind body copy. |
| `--hairline` | `oklch(0.21 0.015 230 / 0.14)` | Structural rules and dividers. |
| `--sticky` | `oklch(0.88 0.115 85)` | Sticky-note fill. Ink text on it (pale, L .88). |
| `--sticky-edge` | `oklch(0.78 0.13 80)` | Sticky shadow edge / small amber marks. |
| `--pos` | `oklch(0.52 0.13 150)` | Confirmations only. |
| `--neg` | `oklch(0.5 0.16 25)` | Errors only. |

Rules: text on blue fills is white. Text on sticky is ink. The grid never exceeds 9%
opacity and never sits behind paragraphs; content lives on clean white panels.

## Typography

| Family | Load | Role |
|---|---|---|
| Archivo (variable, width axis) | next/font/google | Display and headings. Expanded width ≥600 weight for h1/h2. `letter-spacing -0.02em`, `text-wrap: balance`. |
| Schibsted Grotesk (variable) | next/font/google | Body and UI. 15-17px, line-height 1.6, max 70ch. |
| Martian Mono (variable, condensed) | next/font/google | Annotation voice only: dimension labels, timelines, tags. 11-12px, never body copy, uppercase short labels only. |

Scale: h1 `clamp(2.4rem, 5.5vw, 4.25rem)`, h2 `clamp(1.8rem, 3.6vw, 2.6rem)`, ratio ≥1.25
between steps. Weight contrast carries hierarchy before size does.

## Identity devices (use functionally, never as wallpaper)

- **Dimension line**: extension lines offset from the object (drafting convention),
  thin blue stroke, mono label. Annotates a real number only (a timeline, an hour count).
- **Dotted leader**: 2px-dash blue line from a mono label to the thing it names.
- **Sticky note**: amber chip, 1deg rotation, soft bottom edge shadow. Marks the single
  most important call on a surface ("Start here", "automate this"). Max one per section.
- **Graph grid**: `repeating-linear-gradient` both axes at 32px pitch, `--grid-line`,
  confined to hero and section margins. Content panels are clean white above it.
- **Title block**: the footer is a drafting title-block strip: hairline top rule, mono
  metadata (name, LLC line), no boxes, no version stamps.
- **Process boxes**: rounded-2px rectangles with blue strokes and mono captions, connected
  by straight connectors with small terminators. The hero diagram and the method section
  share this vocabulary.

## Motion

Confident, controlled. Things draw the way a facilitator's marker moves: SVG strokes
draw in (`stroke-dashoffset`), annotations stamp in after their line lands, sticky notes
drop with a 2-frame settle. Ease `cubic-bezier(0.22, 1, 0.36, 1)`, durations 400-700ms,
stagger ≤80ms. Scroll reveals only where sequence explains (the method flow draws left to
right). Everything visible by default; animation enhances, never gates. Full
`prefers-reduced-motion` alternative: instant states, no draws.

## Layout

12-col fluid grid, max-width 1200px content, `clamp()` section padding (6rem to 9rem).
Main content offset 360px right on md+ for the chat sidebar (existing constraint).
Asymmetry with intent: hero splits text/diagram; sections alternate full-measure and
split compositions. No identical card grids; hairline-divided rows are the default
grouping. Corner radius system: 2px on drafting elements (boxes, chips), 6px on
interactive controls, nothing larger.

## Components

- Buttons: primary = ink fill, white text, 6px radius; hover raises 1px. Secondary =
  1px hairline, ink text. On-blue variant only inside diagram contexts.
- Links: blue, underline on hover, never bare gray.
- Nav: hairline-constructed three-zone bar (brand / links / CTA), 64px, single line.
- Chat sidebar (AIChat): ink-navy panel reads as the site's "instrument"; keep dark
  against the light page deliberately, restyled to token blues.
- Forms: labels above inputs, 1px hairline borders, blue focus ring, placeholder ≥4.5:1.

## Accessibility

WCAG AA: verified pairs are ink/bg 15.6:1, ink-muted/bg 8.5:1, blue/bg 6.2:1, white/blue
6.2:1, ink/sticky 11:1. Focus visible (2px blue outline, 2px offset). Reduced motion
covered above. Grid pattern stays ≤9% opacity and off text panels.
