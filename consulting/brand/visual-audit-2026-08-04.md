# Visual audit: where images earn their place

**Date:** 2026-08-04
**Scope:** every primary page at 1440px and 390px, live production site plus source.
**Method:** section-by-section source inventory, full-page screenshots at both widths (`.playwright-mcp/audit-shots/`), and a reconciliation pass against the credibility assessment (2026-08-03), its don't list, and DESIGN.md.
**Standing rule inherited from the credibility assessment:** if a visual's job is proof, the pipeline is real-capture or it does not get built. Generated imagery appears nowhere in this plan. DESIGN.md is locked; everything below fills gaps inside that system.

Every recommendation passed this test before making the list: will it help a visitor understand the work, trust that it is real, or decide what to do next? Items that only fill space were cut; the cut list is at the end.

---

## 1. Verdict

The site is visually complete exactly once: the homepage. Canvas hero, process connectors, the method-loop film in the closing band. It is also honest once in a deeper way: `/results` shows a real value-stream map of Caleb's own operation and refuses to print numbers it hasn't measured. Those two pages establish a visual language that the rest of the site then abandons.

Every interior page is pure typography. `/work` describes a phone conversation, a text thread, and a calendar entry across 5.8 mobile screens without showing any of them. `/work/vora` and `/work/chapterhq` have a media slot in their shared template that sits empty while `/work/site-assistant` proves the slot works. `/about` runs six straight paragraphs before its first structural break and contains no evidence a human is behind the site. The three service pages are the plainest template on the site. And the one rich visual the homepage does have below the fold, the method-loop figure, is `hidden` below 1024px, so mobile visitors never see it.

The imbalance is not decoration versus restraint. It is that the pages doing the persuading (home) are visually funded while the pages doing the proving (`/work`, `/work/*`, `/about`) are not. The fix is not more illustration. Almost everything this audit recommends is a capture of something that already exists and already runs.

What is *right* and must stay: `/results`' restraint (protected by the credibility assessment), `/owners` and `/operators` (short, well-segmented), `/resources`, `/blog` index, `/contact`, `/partners`. Ten of the site's ~18 surfaces should remain typographic.

---

## 2. Visual coverage table

Pipeline legend: **real-capture** = screenshot/photo/recording of a thing that exists · **code-only** = inline SVG in the site's drafting vocabulary · **photo** = photograph of a real person or place. Generated artwork is not used (credibility don't list).

| Page · section | Current weakness | Recommended visual | Job | Pipeline | Desktop / mobile | Priority | Effort | Main risk |
|---|---|---|---|---|---|---|---|---|
| `/work` · "One missed call, start to finish" | The site's core story told as 5 text rows; the artifacts it describes (text thread, booked job) are never shown | Two real captures mounted inline with their timestamp rows: the 6:40pm text-back thread (test data, caption says so) and the 6:44pm booked job in the Vora calendar | Prove it's real + explain the process | real-capture | Desktop: taped-print frames beside their rows. Mobile: frames stack under their rows, full width | **P1** | 0.5 day after pipeline | Customer data in capture; must re-run with test data and caption it honestly |
| `/work/vora` · below stack table | Empty `media` slot; falsifiable stack table with nothing visible | One cropped dashboard capture: the missed-call agent's conversation log | Prove it's real | real-capture | Both: taped-print below stack table, lazy, not LCP. Mobile: crop must read at 358px | **P1** | 2h after pipeline | Crop too wide to read on mobile; crop to the log region only |
| `/work/chapterhq` · below stack table | Same empty slot | One cropped main-app capture | Prove it's real | real-capture | Same as Vora | **P1** | 2h | Member PII in view; use a test org |
| `/about` · "the background" | Six paragraphs, no break, no human; LinkedIn/GitHub verification framing with no face to verify | One real photograph of Caleb at the working wall, beside the bio block, before the employment sequence | Humanize + prove | photo | Desktop: right of bio text. Mobile: below intro, above employment prose (breaks the 6-para run). Likely LCP: explicit dims, `priority`, `sizes` | **P1** | 0.5 day incl. shoot | A staged-looking portrait undercuts the documentary tone; shoot at the real wall, daylight, no studio |
| `/contact` · "I read everything myself" | Claim of personal attention with no person | Smaller frame from the same shoot | Humanize | photo | Both: small inline image next to the line, lazy | P2 | 30min after shoot | None if the About shot lands first |
| `/services/*` (ServicePage template) · "how it fits the method" | Plainest template on site; web-dev page narrates a customer journey it never draws | Optional `figure` slot in the template + one process-box path diagram per service (web-dev: search → site → call → booked; SEO: search → local pack → profile → call; marketing: lead → follow-up → booked). Generic method diagrams, not engagement claims | Explain the process | code-only | Desktop: inline SVG, draw-on-reveal. Mobile: `overflow-x-auto` + `minWidth`, same pattern as the `/results` VSM | **P2** | 1 day for slot + first diagram, 2h each after | Three near-identical diagrams read as templated; vary topology per service, not just labels |
| `/` · Packages | The decision point describes deliverables (map, scored list, roadmap) as prose only | An artifact strip: three small taped prints of the real audit deliverable templates (VSM map sheet, opportunity scoring matrix, 90-day roadmap page), captioned "the templates your audit fills in" | Strengthen conversion | real-capture (render the real templates from consulting/materials/) | Desktop: 3-up strip under the featured card. Mobile: horizontal scroll strip | P2 | 0.5 day + 2h asset prep | Must be clearly the *template*, not a fake filled-in client artifact (don't-list line 2); caption carries this |
| `/` · closing CTA (MethodFigure) | Video + drawn SVG + sticky entirely `hidden` below 1024px; mobile homepage ends visually flat | Show the existing reduced-motion drawn SVG (already built as the fallback) below `lg` instead of hiding the column | Explain the method on mobile | code-only (exists) | Desktop: unchanged. Mobile: static drawn figure, no autoplay video at 390px | **P1** | 30min | None; asset already ships |
| `/how-i-build` · "my stack in practice" | Describes a multi-agent build operation with zero evidence; one small table as the only break in 3 prose screens | One real capture of the actual build environment (agent fleet / terminal session), scrubbed, taped-print mount | Prove it's real + humanize the craft | real-capture | Both: below the stack table. Mobile: crop to a readable region | P2 | 2h + scrub pass | Leaking tokens/paths/client names in a terminal capture; dedicated scrub checklist before export |
| `/blog/map-before-you-automate` · mid-article | 1,600 words describing a value-stream map without showing one (credibility rec #10) | One inline SVG VSM in the existing drafting vocabulary, generic teaching example | Explain the process | code-only | Desktop: inline. Mobile: `overflow-x-auto` like `/results` | P2 | 2-3h | None; explicitly generic, not an engagement artifact |
| `/work` · systems rows (Vora/ChapterHQ/assistant) | Text rows only | Nothing now; the detail pages get the media. Revisit small thumbnails only if click-through data (once analytics exists) says the rows underperform | — | — | — | P3 | — | Icon-per-card creep |
| `/owners` · "the after-hours call problem" | Prose-only description of the exact artifact captured for `/work` | Optional reuse of the 6:40pm thread capture, single frame | Prove + convert | real-capture (reuse) | Both: one small frame beside the problem column | P3 | 1h | Page is currently well-balanced; only add if the frame reuses cleanly |
| `/resources` · gated PDF rows | Blind gate: email requested for unseen documents | Optional: first-page thumbnail of each real PDF (they exist in public/downloads/) | Strengthen conversion | real-capture (render page 1) | Desktop: small thumb per gated row. Mobile: omit or tiny | P3 | 2h | Three thumbnails against "one meaningful visual" preference; acceptable because they are the product itself |
| `/` · Process connectors | Connector arrows hidden below `lg`; steps lose visual continuity on mobile | Small vertical connector ticks between stacked steps | Improve scanning | code-only | Mobile only | P3 | 1h | Pure polish; do last |
| `/work` · client work section | Prose placeholder by design | Brittany Lyons case capture — **deferred**, gated on engagement end + written permission (already decided 2026-08-03) | Prove | real-capture | Per credibility assessment spec | Gated | 4-6h when unlocked | Publishing anything before written permission |

### Should remain typographic (protected)

- **`/results`** except its existing VSM: the credibility assessment explicitly forbids adding visuals here for density's sake. Its restraint *is* the proof. The 390px diagram compression is acceptable (overflow-scroll already handles it).
- **`/contact`** beyond the one small portrait: low-depth utility page by design.
- **`/owners`, `/operators`**: short, three-column, well-segmented; the form is the point.
- **`/partners`**: the "what I will not do" column does trust work that imagery would dilute.
- **`/blog` index, `/work/open-source`, `/resources` list structure, `/privacy`, `/terms`**: lists doing list work.
- **Homepage hero, PainSolution, AISystems, Proof, NowStrip, Industries**: the hero and NowStrip carry the visual load; PainSolution/Proof are voice-driven and should stay that way. Adding schematics to AISystems would repeat the hero's vocabulary at lower quality.

---

## 3. Three approaches

### A. Quick wins (existing assets, ~2 days)

Un-hide the MethodFigure fallback SVG on mobile (30min). Capture and mount Vora + ChapterHQ screenshots into the WorkDetail media slot that site-assistant already proves out (the slot exists; only the `next/image` pipeline is missing). Capture the missed-call thread + booked-job pair for `/work`. That is four real captures and one CSS change, and it converts the three worst proof gaps the credibility assessment scored. Limitation: `/about` still has no human, services stay flat, and nothing reusable gets built, so every future visual is bespoke again.

### B. Recommended: the evidence system (architecturally correct)

Build the visual layer as three reusable primitives, then roll pages onto them. This is more work up front than A but it is the correct architecture: every future proof asset (Brittany case study, founding-client case studies, future products) mounts into the same system instead of being hand-placed.

1. **Pipeline (one-time, ~2h, everything depends on it):** `images` block in `next.config.ts`, `next/image` adoption, `public/images/`, WebP/AVIF compression step. Identified in the credibility assessment as the gate for every visual rec; still unbuilt.
2. **Taped-print frame** (spec already written, build verbatim): 1px hairline border, 2px radius, no shadow, mono `anno anno-blue` caption slot above, optional dimension-line annotating one real number. One component; used by every capture and photo on this list.
3. **Figure slot in the two shared templates:** `WorkDetail.media` already exists; add the equivalent optional `figure` to `ServicePage`. Templates change once; six pages gain capacity.
4. **Filmstrip variant:** 2-3 taped prints in a row, horizontal scroll on mobile with a scroll affordance. Used by `/work`'s missed-call pair and Packages' artifact strip.

Then the rollout order in section 8. End state: every visual on the site is either a real capture in a taped-print frame or an SVG in the drafting vocabulary. Two mounts, one vocabulary, no exceptions — coherence comes from the system, not from per-page taste calls.

### C. Bolder: documentary motion

Everything in B, plus: the missed-call sequence as a scroll-driven drawn animation on `/work` (timestamps stamp in, the thread draws, the calendar entry lands with the sticky-note settle — the DESIGN.md motion grammar applied to the site's best story); the phase-two "how I work" 60-90s clip of Caleb at the actual wall in the About page; the live instrument panel on `/results` once real measurements exist (explicitly gated on measurement existing). All motion keeps the full reduced-motion alternative: the static filmstrip from B *is* the fallback, which is why C should only ever be built on top of B. Risks: production time competes with outreach (the highest-leverage item on the business list), and motion on `/work` must never gate the content. Defer C until analytics exists to judge whether B moved anything.

**Recommendation: B.** A is a subset of B's rollout, so nothing in A is wasted by choosing B; start with B's pipeline + the A captures in week one.

---

## 4. The five highest-leverage additions, ranked

1. **Missed-call filmstrip on `/work`** (thread capture + booked-job capture, inline with the timestamp rows). The site's central story, its worst text-wall page (5.8 mobile screens, zero visuals), and the exact "I'd want to see the interface" objection the operator persona raised. Real, cheap, already on the approved shot list.
2. **Vora + ChapterHQ captures into the WorkDetail media slot** (finishes credibility rec #2; carries the one-time image pipeline). The stack tables are falsifiable claims waiting for their evidence.
3. **Photograph of Caleb on `/about`** (+ the smaller `/contact` frame; same shoot fills the High/Missing social-profile-photo gap in the asset checklist). The only recommendation that humanizes; also breaks the site's single worst prose run.
4. **ServicePage figure slot + web-dev customer-path diagram first** (credibility rec #11). Fixes the plainest template and the clearest explain-gap: a journey narrated but never drawn. SEO and marketing diagrams follow the same slot.
5. **Packages artifact strip on `/`** (renders of the three real deliverable templates). The only visual aimed squarely at the conversion decision: it shows what $750 buys. Honest because the artifacts exist; the caption names them as templates.

Mobile fix for the hidden MethodFigure is not ranked because it is not an addition; do it first anyway (30 minutes).

---

## 5. Asset shot list

Items 1-5 and 7-8 were already specified in the credibility assessment; specs reused verbatim. All WebP/AVIF, max 1600px wide.

| # | Asset | Used by | Spec / notes |
|---|---|---|---|
| 1 | Missed-call text-back thread, phone capture of the 6:40pm exchange | `/work`, optionally `/owners` | Customer details replaced with Caleb's own test data; caption states it's a test run. <150KB |
| 2 | Booked job in the Vora calendar (the 6:44pm state) | `/work` filmstrip frame 2 | Same test-data rule. <150KB |
| 3 | Vora dashboard, missed-call agent conversation log | `/work/vora` | Cropped to the log region, not full desktop. <150KB |
| 4 | ChapterHQ main app view | `/work/chapterhq` | Test org, no member PII. <150KB |
| 5 | Caleb, portrait at the working wall | `/about` + LinkedIn/YouTube/IG/FB profiles | Daylight, real map behind, cool neutral grade, no purple. <120KB |
| 6 | Caleb, tighter frame, same shoot | `/contact` | <60KB |
| 7 | Audit deliverable trio: VSM map sheet, opportunity scoring matrix, 90-day roadmap page | `/` Packages strip | Render the real templates from consulting/materials/ (vsm-workshop-kit, opportunity-scoring-matrix, roadmap-deck-template) as clean page images. Blank/template state, never fake-filled. <100KB each |
| 8 | Build environment capture (agent fleet / terminal) | `/how-i-build` | Scrub checklist before export: no tokens, no client names, no internal hostnames, no email addresses. <150KB |
| 9 | First page of each gated PDF (3) | `/resources` (P3, optional) | Render from the existing PDFs in public/downloads/. <60KB each |
| — | Brittany Lyons site home capture | `/work`, `/results` | **Do not shoot for the site yet.** Gated on engagement end + written permission (decided 2026-08-03) |

---

## 6. Visual-system specification

Everything inherits DESIGN.md (locked): tokens, Archivo/Schibsted/Martian Mono, 2px/6px radii, hairline rows over card grids, grid ≤9% opacity and never behind copy, one amber sticky per section max.

**Taped-print frame** (`<TapedPrint>`), the only mount for raster content:
- 1px `--hairline` border, 2px radius, no drop shadow
- Mono `anno anno-blue` caption above the image; caption text states what the capture is and, where applicable, that data shown is test data
- Optional dimension line annotating exactly one real number visible in the capture; none otherwise
- Always `next/image`, explicit width/height, lazy + below fold (sole exception: the `/about` portrait, which may be LCP and gets `priority` + `sizes`)
- Alt text describes content, not medium: "Vora dashboard showing the missed-call agent's conversation log," never "screenshot of Vora"

**Filmstrip** (`<TapedPrint>` × 2-3):
- Desktop: row, equal heights, hairline gaps
- Mobile: horizontal scroll (`overflow-x-auto`, scroll-snap, partial peek of the next frame as the affordance); never stack more than 2 frames vertically inline
- Frame order must read as time order when depicting a sequence

**Drafting figure** (inline SVG), the only mount for diagrams:
- Process-box vocabulary: rounded-2px rects, blue strokes, mono captions, straight connectors with small terminators
- Draw-on-reveal per DESIGN.md motion (400-700ms, `cubic-bezier(0.22,1,0.36,1)`), full reduced-motion instant state
- Mobile: `overflow-x-auto` + `minWidth` (the `/results` VSM pattern) when wider than 390px; re-flow vertically only if the topology survives it
- `role="img"` + full descriptive `aria-label` (the `/results` VSM sets the standard)
- Generic/teaching diagrams only; anything depicting a specific engagement counts as evidence and needs the real-capture rule

**Template slots:**
- `WorkDetail.media` (exists): one TapedPrint or video, below the stack table, never replacing it
- `ServicePage.figure` (new): one drafting figure, inside/after the method section
- One visual per section, sitewide. A section earns a second only if each carries a different job (e.g. `/work` filmstrip frames share one job, so they count as one)

**Mobile rules:**
- Never `hidden` below `lg` for a meaning-bearing figure; provide the static/reduced state instead (the MethodFigure fix is the reference case)
- Every capture is cropped so its subject reads at 358px content width; if it can't, crop tighter rather than shrink
- Video never autoplays at mobile widths where the poster tells the story

**Budgets and a11y:** WebP/AVIF, per-asset caps in the shot list; nothing above the fold except the About portrait; contrast rules per DESIGN.md; all motion behind `prefers-reduced-motion` with content visible by default.

---

## 7. Text wireframes (top recommendations)

### `/work` — missed-call filmstrip (desktop)

```
WHAT IT LOOKS LIKE
One missed call, start to finish
─────────────────────────────────────────────
TUE 6:40PM        A call comes in while the crew is loading up...
TUE 6:40PM +SECONDS
                  The caller gets a text back...        ┌─────────────┐
                                                        │ [thread     │
                                                        │  capture]   │
                                                        └─────────────┘
                                                        ANNO: THE TEXT-BACK,
                                                        TEST DATA
TUE 6:43PM        They write back: water heater...
TUE 6:44PM        The job is on the schedule...         ┌─────────────┐
                                                        │ [calendar   │
                                                        │  capture]   │
                                                        └─────────────┘
                                                        ANNO: ON THE SCHEDULE
WED 7:18AM        You open your morning list...
```
Mobile: same rows; each capture sits full-width directly under its row. Page still reads if images fail (rows unchanged).

### `/work/vora` — media slot (both widths)

```
[stack table — unchanged]
─────────────────────────────
ANNO-BLUE: THE CONVERSATION LOG, LIVE SYSTEM
┌───────────────────────────────┐
│ [dashboard crop: missed-call  │
│  agent log]                   │
└───────────────────────────────┘
→ voratechnology.com (unchanged)
```

### `/about` — portrait placement

```
Builder first, consultant second
[intro prose]
──────────────────────────────────────
WHO I WORK WITH          ┌────────────────┐
[prose]                  │ [Caleb at the  │
THE BACKGROUND           │  working wall] │
[prose, para 1-2]        └────────────────┘
[prose, para 3+]         ANNO: THE WALL THE
                         SITE IS NAMED AFTER
```
Mobile: portrait lands between "who I work with" and "the background," splitting the six-paragraph run roughly in half.

### `/services/web-development` — customer-path figure

```
HOW IT FITS THE METHOD
[existing prose]

┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
│ search │─────▶│  site  │─────▶│  call/ │─────▶│ booked │
│        │      │ loads  │      │  form  │      │  job   │
└────────┘      └────────┘      └────────┘      └────────┘
   ANNO:           ANNO:           ANNO:           ANNO:
   FOUND YOU       <3S OR GONE     ONE TAP         ON THE
                                                   SCHEDULE
```
Mobile: horizontal scroll, `minWidth` ~520px, same as the `/results` VSM.

### `/` Packages — artifact strip

```
[featured $750 audit card — unchanged, keeps its sticky]

WHAT THE AUDIT PRODUCES
┌────────┐  ┌────────┐  ┌────────┐
│ [VSM   │  │ [scored│  │ [90-day│
│  sheet]│  │ matrix]│  │  road- │
│        │  │        │  │  map]  │
└────────┘  └────────┘  └────────┘
ANNO: THE THREE TEMPLATES YOUR AUDIT FILLS IN
```
Mobile: horizontal scroll strip with next-frame peek.

---

## 8. Phased implementation

**Phase 0 — foundations (half day, unblocks everything)**
1. `next/image` pipeline: `images` block, `public/images/`, compression step (~2h)
2. `<TapedPrint>` component to the written spec (~2h)
3. MethodFigure mobile fix: show the drawn SVG below `lg` (~30min)

**Phase 1 — proof captures (1-1.5 days, ranks 1-2)**
4. Captures 1-4 (thread, calendar, Vora log, ChapterHQ) with the test-data pass
5. Mount: `/work` filmstrip inline; `/work/vora` + `/work/chapterhq` media slots
- Gate: every capture reviewed for real customer data before commit

**Phase 2 — human + method (1-2 days elapsed; shoot is Caleb-side, rank 3-4)**
6. Portrait shoot at the wall (also produces the social profile set)
7. Mount `/about` + `/contact`
8. `ServicePage.figure` slot + web-dev path diagram; SEO and marketing diagrams after
- Blog VSM (rec #10) rides this phase: same SVG vocabulary, ~2-3h

**Phase 3 — conversion + craft (1 day, rank 5 + P2 remainder)**
9. Render deliverable templates, Packages artifact strip
10. `/how-i-build` build-environment capture (scrub checklist first)

**Phase 4 — measured extras (only after analytics exists)**
11. P3 items (PDF thumbnails, `/owners` frame reuse, process connector ticks) — decide from data, not taste
12. Approach C motion work, same condition
13. Brittany Lyons case visuals the day written permission lands (draft privately now per the existing decision)

Each phase ships independently; stopping after Phase 1 still resolves the operator persona's stated objection.

---

## 9. Explicitly excluded (failed the test)

- Icons on AISystems/Industries/skills cards: decoration, no job
- Homepage system schematic in "what I actually build": repeats the hero's vocabulary at lower value on the one page that's already funded
- Any `/results` addition beyond what exists: protected surface, restraint is the proof
- Analytics/dashboard artifact on the SEO or marketing pages: no analytics installed, nothing real to show, and fakes are banned
- "Responsive website examples" on web-dev: the only showable client site is gated behind the Brittany permission; showing this site on this site proves little. Wait for the case study
- Generated imagery of any kind, including generated working-wall images: don't-list, standing
- Blog index thumbnails, contact illustrations, newsletter-page imagery: pages already work

---

## Adjacent findings (not visual scope, flagged for separate decision)

1. **WorkDetail pages have no closing CTA** — `/work/vora`, `/work/chapterhq`, `/work/site-assistant` end at the external link; every other content page ends in a CTA box. One template edit.
2. **Dead code:** `components/Hero.tsx` (unused, contains its own diagram), plus three `sync-conflict` duplicate files (Footer, Header, sitemap).
3. **Unresolved copy conflict** from the credibility assessment: "not a demo" (site) vs "live demo" (brand-context.md) for the assistant — still needs Caleb's call.
