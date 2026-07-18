# Mobile experience design

Date: 2026-07-18
Status: approved (design), pending implementation
Branch: claude/mobile-site-experience-f6de8b

## Problem

The site is unusable or degraded on phones. Audited on the live site at 375x812:

1. **Homepage hero is broken.** The canvas map draws on top of the headline and body
   copy, stage labels collide with the eyebrow, and the right half of the map clips
   off-screen. This happens in both engine modes:
   - The static mobile path in `components/HeroInstrument.tsx` (viewport under
     768px pins the engine at progress 0.5) still uses the desktop composition.
   - The engine's `buildGraph()` in `components/hero/heroEngine.ts` hard-codes the
     map into the right band (`left = W * 0.42`, `right = W * 0.955`), assuming
     text owns the left 40%. At 375px wide there is no left band.
2. **No mobile nav.** Header links are `hidden lg:flex` (`components/Header.tsx:30`).
   Below 1024px there is no menu and no hamburger. Mobile users can reach only
   Contact (the "Let's talk" button) and footer links.
3. **Chat FAB covers footer links** at the bottom of pages (minor).
4. Inner pages (/work, /tools/ai-readiness spot-checked) render fine. The chat
   panel already opens full-screen on mobile and works well.

## Goals

- Mobile users get the same quality experience as desktop: the hero choreography,
  full navigation, and working flows on every route.
- No regression to the desktop experience.

## Decisions made during brainstorm

- Hero: **adapt the choreography for mobile** (not a static or text-only fallback).
- Nav: **full-screen overlay** menu behind a hamburger.
- Scope: **full mobile pass** over every route, not just the found issues.

## Design

### 1. Hero: vertical recomposition

The same map, same boxes, same paper-to-live wipe, recomposed for portrait.

**Engine (`components/hero/heroEngine.ts`):**

- `buildGraph()` takes a layout band instead of hard-coded desktop fractions.
  - Desktop (>= 768px): current composition, map in the right band. No visual change.
  - Mobile (< 768px): map laid into the bottom band of the viewport, full width,
    roughly y 48% to 92%, scaled to fit with side margins so nothing clips.
- Stage labels (`01 / INTAKE` ...) scale down and fit inside the mobile band
  instead of colliding with the copy.
- Annotations that cannot fit legibly at 375px (sticky note, margin notes) either
  scale into the band or drop on mobile; nothing may overlap the copy clusters.
- The horizontal paper-to-live wipe stays as is; it reads fine sweeping the full
  width on mobile.

**Instrument (`components/HeroInstrument.tsx`):**

- Restore scroll choreography on mobile: the media query that forces the static
  path becomes `prefers-reduced-motion: reduce` only. Reduced motion keeps the
  static single-viewport render (pinned at the midpoint split), which was that
  path's original purpose.
- Mobile scroll track shortens to about 200vh (desktop stays 280vh) so the pinned
  section does not feel endless on a phone.

**Cluster and spec-bar CSS (globals.css hero styles):**

- Copy clusters stack in the top half of the viewport, full width, reduced type
  scale. The paper and live clusters still crossfade with scroll progress.
- Spec bar condenses to a single row of pills on mobile; the two-line readout
  hides or collapses so it never stacks over the map band.

### 2. Mobile nav: full-screen overlay

- Hamburger button in the header, visible below `lg` (1024px), replacing nothing;
  the brand and "Let's talk" button stay.
- Opens a full-screen overlay styled to the working wall: big-type link list
  (Services, Method, Packages, Resources, Work, Blog), hairline rules between
  rows, annotation-style micro-labels, "Let's talk" CTA at the bottom.
- Behavior: body scroll locked while open; closes on link tap, Esc, or the close
  button; `aria-expanded` on the trigger; focus moves into the overlay on open
  and returns to the trigger on close.
- New client component (e.g. `components/MobileNav.tsx`) rendered from
  `Header.tsx` so the header itself stays a server component.

### 3. Chat FAB and footer

- FAB gets a safe-area-aware bottom offset (`env(safe-area-inset-bottom)`).
- Footer gets enough bottom padding on mobile that the FAB never covers links.

### 4. Full mobile QA pass

After 1 to 3 land, walk every route at 375x812 and fix what surfaces:

- /, /about, /work + 4 work detail pages, /services/marketing, /services/seo,
  /services/web-development, /blog + one post, /resources, /contact,
  /how-i-build, /tools/ai-readiness and /tools/revenue-leak end to end
  (complete a full scorecard and calculator run).
- Check: no horizontal overflow, no overlapping text, tap targets at least
  around 44px, forms usable, chat opens and closes cleanly.
- Known items to confirm fixed: footer link wrap, FAB overlap.

## Error handling

- Engine layout falls back to the desktop band if the canvas box reports zero
  width (matches the existing `rect.width || innerWidth` fallback).
- Resize across the 768px breakpoint rebuilds the graph (the existing resize
  handler re-runs sizing; layout choice re-evaluates there).
- Reduced-motion users never get the scroll-driven path, on any viewport.

## Testing and verification

- Per the project gotcha: verify hero and CSS via `npm run build && npm start`
  (production server), not the dev server. Dev cannot hot-reload this CSS and
  the preview throttles rAF.
- Browser pane at mobile preset (375x812): screenshot the hero at progress 0,
  mid-wipe, and end; screenshot the nav overlay open; screenshot each route.
- Desktop preset (1280x800) spot check: hero unchanged, header unchanged at lg+.
- `npm run build` passes clean (type check included).

## Out of scope

- Redesigning the hero visuals or copy (composition change only).
- Tablet-specific compositions: 768px to 1023px keeps the desktop hero
  composition and gains the hamburger nav (links are hidden below 1024px today).
- Analytics, email sequences, and other roadmap items in CLAUDE.md.
