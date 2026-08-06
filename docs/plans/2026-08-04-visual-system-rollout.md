# Visual System Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the top ten additions from `consulting/brand/visual-audit-2026-08-04.md`: an image pipeline, a shared taped-print mount, real product captures on `/work` + `/work/vora` + `/work/chapterhq`, the mobile MethodFigure fix, a portrait on `/about` + `/contact`, per-service path diagrams, the blog VSM figure, the Packages artifact strip, and a `/how-i-build` capture.

**Architecture:** Three reusable primitives (optimize script, `TapedPrint`/`PrintStrip` components, template figure slots), then page mounts. Raster proof assets are produced by four ASSET GATE tasks (captures/photos Caleb must supply); every code task that consumes an asset names its exact file path so gates and code can proceed independently. Diagrams are inline SVG server components reusing the existing draw/stamp animation classes.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 utility contract in `app/globals.css`, `next/image` with static imports, `sharp` for pre-optimization, vitest (node env, `*.test.ts` only — UI work is verified by build + rendered-HTML checks, matching repo practice).

## Global Constraints

- Design system is locked (`DESIGN.md`): blueprint blue owns all diagram strokes; amber only as sticky notes or small amber marks; max ONE sticky note per section; 2px radius on drafting elements; Martian Mono (`.anno`) for labels only, lowercase short labels.
- Proof rule (credibility assessment): any visual whose job is proof is a real capture. No generated imagery, no fake data, no invented numbers. Captures containing customer data are re-run with test data and the caption says so.
- Taped-print treatment: 1px `var(--color-hairline)` border, 2px radius, NO drop shadow, mono `anno anno-blue` caption above the image.
- Image budgets: WebP, max 1600px wide; content captures <150KB; About portrait <120KB; contact portrait <60KB. Nothing is an LCP element except the About portrait (which gets `priority`).
- Motion: reuse existing `draw-on-reveal` / `stamp-on-reveal` classes only; every animated figure must be fully visible with `prefers-reduced-motion` (those classes already handle it). No autoplaying video at mobile widths.
- Alt text describes content, not medium ("Vora dashboard showing…", never "screenshot of Vora").
- Copy rules (humanizer): no em dashes in visible copy, sentence-case, plain language. `.anno` captions are lowercase.
- Git gotchas: ONE git command per Bash call (RTK zsh wrapper aborts chains). Write commit messages to a file in the scratchpad dir and use `git commit -F <file>`. Never combine `git add && git commit`.
- After every Edit/Write a PostToolUse hook runs `npm test`; all 5 existing test files must stay green. `npm run build` is the real check for UI tasks.
- Do NOT deploy. Production deploys need per-session user approval and are out of scope for every task here.

**Dependency notes:** Tasks 4, 7, 12, 14 are ASSET GATES (Caleb-side or requiring product logins). Code tasks 5, 6, 8, 13, 15 consume gate outputs and are blocked until their gate's files exist at the named paths. Tasks 1-3, 9-11 have no asset dependencies and can run immediately.

---

<!-- model: sonnet -->

### Task 1: Image optimization script

**Files:**
- Create: `scripts/optimize-image.mjs`
- Create: `public/images/.gitkeep` (empty file)
- Modify: `package.json` (add `sharp` devDependency via npm)

**Interfaces:**
- Produces: `node scripts/optimize-image.mjs <input> <output.webp> [maxWidth]` — resizes to maxWidth (default 1600, never enlarges), strips metadata, writes WebP q82, prints `<output>: <N>KB`. Every ASSET GATE task uses this command.

- [ ] **Step 1: Install sharp as a devDependency**

Run: `npm install -D sharp`
Expected: `added N packages` (the darwin-arm64 binary is already in the npm cache via Next).

- [ ] **Step 2: Write the script**

Create `scripts/optimize-image.mjs`:

```js
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const [, , input, output, widthArg] = process.argv;
if (!input || !output || !output.endsWith('.webp')) {
  console.error('usage: node scripts/optimize-image.mjs <input> <output.webp> [maxWidth=1600]');
  process.exit(1);
}

const maxWidth = Number(widthArg ?? 1600);
await sharp(input)
  .rotate()
  .resize({ width: maxWidth, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(output);

const { size } = await stat(output);
console.log(`${output}: ${Math.round(size / 1024)}KB`);
```

- [ ] **Step 3: Create the images directory**

Create empty file `public/images/.gitkeep`.

- [ ] **Step 4: Verify the script works on a real file**

Run: `node scripts/optimize-image.mjs cb-home-full.jpeg /private/tmp/claude-501/-Users-calebbolden-Projects-calebbolden-com/330e7533-024e-4ad2-901e-319965b18274/scratchpad/pipeline-check.webp 1600`
Expected: prints `…pipeline-check.webp: <N>KB` with N well under 397 (the JPEG source size).

- [ ] **Step 5: Verify existing tests still pass**

Run: `npm test`
Expected: all existing suites pass (lib smoke, rate-limit, band-list, syllabus, subscribe).

- [ ] **Step 6: Commit**

```bash
git add scripts/optimize-image.mjs public/images/.gitkeep package.json package-lock.json
```
Then (separate Bash call) write the message file and run:
```bash
git commit -F <scratchpad>/commit-msg.txt   # "feat(site): image pipeline: optimize script + public/images"
```

---

### Task 2: TapedPrint and PrintStrip components

**Files:**
- Create: `components/TapedPrint.tsx`

**Interfaces:**
- Produces: `TapedPrint` (default export) — props `{ src: StaticImageData | string; alt: string; caption?: string; width?: number; height?: number; priority?: boolean; sizes?: string; className?: string }`. Renders `<figure>` with the mono caption ABOVE the image, hairline border, 2px radius, no shadow.
- Produces: `PrintStrip` (named export) — props `{ children: React.ReactNode }`. Horizontal scroll-snap strip on mobile, 3-col grid at `sm+`. Children should pass `className="min-w-[240px] snap-start sm:min-w-0"`.
- Consumed by: Tasks 5, 6, 8, 13, 15.

- [ ] **Step 1: Write the component**

Create `components/TapedPrint.tsx`:

```tsx
import Image, { type StaticImageData } from 'next/image';

// The taped-print mount from the visual audit: the only frame raster content
// gets on this site. 1px hairline, 2px radius, no shadow, mono caption above.
// Spec: consulting/brand/visual-audit-2026-08-04.md §6.

interface TapedPrintProps {
  src: StaticImageData | string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export default function TapedPrint({
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
  sizes,
  className = '',
}: TapedPrintProps) {
  return (
    <figure className={className}>
      {caption && <figcaption className="anno anno-blue mb-3">{caption}</figcaption>}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full rounded-[2px]"
        style={{ border: '1px solid var(--color-hairline)' }}
      />
    </figure>
  );
}

export function PrintStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (component is not yet consumed; this checks types only).

- [ ] **Step 3: Commit**

```bash
git add components/TapedPrint.tsx
```
Then: `git commit -F <msg-file>` — "feat(site): TapedPrint + PrintStrip, the shared image mount"

---

### Task 3: MethodFigure visible on mobile (audit item #6)

**Files:**
- Modify: `components/CTA.tsx:39` (video className) and `components/CTA.tsx:197` (Reveal wrapper)

**Interfaces:**
- Consumes: nothing. No other task depends on this.

Currently the entire right column of the closing band (`method-loop.mp4` + drawn SVG + sticky) is `hidden` below `lg`, so mobile never sees it. Fix: show the column at all widths, but suppress the VIDEO below `lg` so mobile gets the static drawn SVG (no autoplay video at mobile widths, per constraints). The SVG already renders underneath the video as the reduced-motion/failure fallback, so no new markup is needed.

- [ ] **Step 1: Suppress the video below lg**

In `components/CTA.tsx`, change the video element's className (line 39):

```tsx
// before
className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
// after
className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:hidden lg:block"
```

- [ ] **Step 2: Un-hide the column**

Change line 197:

```tsx
// before
<Reveal className="hidden lg:col-span-5 lg:block" delay={150}>
// after
<Reveal className="lg:col-span-5" delay={150}>
```

- [ ] **Step 3: Verify build and rendered output**

Run: `npm run build`
Expected: success.
Run: `npm start` in background, then `curl -s http://localhost:3000 | grep -c "method-loop.mp4"`
Expected: `1` (video still present for desktop). Stop the server.

- [ ] **Step 4: Visual check at 390px**

With `npm start` running, use the Playwright browser: navigate to `http://localhost:3000`, resize to 390x844, scroll to the closing dark band, screenshot. Expected: the drawn three-box figure and "start here" sticky are visible below the email form; no video plays. Then check 1440px: video still plays. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add components/CTA.tsx
```
Then: `git commit -F <msg-file>` — "fix(site): show the method figure on mobile, video stays desktop-only"

---

### Task 4: ASSET GATE A — product captures (blocks Tasks 5 and 6)

**Files:**
- Create: `public/images/work-missed-call-thread.webp` (phone capture, ~800px wide, <120KB)
- Create: `public/images/work-booked-job.webp` (dashboard crop, ≤1600px, <150KB)
- Create: `public/images/vora-conversation-log.webp` (dashboard crop, ≤1600px, <150KB)
- Create: `public/images/chapterhq-app.webp` (app crop, ≤1600px, <150KB)

**Interfaces:**
- Produces: the four files above at exactly those paths (Tasks 5 and 6 static-import them).

This task needs Vora/ChapterHQ logins and a phone; it is Caleb-side or a session with product access. **Do not fabricate any of these images. If a capture cannot be produced, leave its file absent and report the mount task as blocked.**

- [ ] **Step 1: Run the missed-call flow against a test number**

Trigger Vora's missed-call text-back with Caleb's own test number, answering as the "water heater, no hot water" scenario from `/work`'s walkthrough (two offered windows, one picked). No real customer data anywhere in frame.

- [ ] **Step 2: Capture and crop the four frames**

1. Phone screenshot of the SMS thread (shop name visible, the offer + confirmation visible). Crop to the thread only.
2. Vora calendar/job view showing that booked job with the thread attached. Crop to the job card region.
3. Vora dashboard conversation log showing inbound calls + automated text-backs (test data). Crop to the log region, not the full desktop.
4. ChapterHQ main view for a test org (members/dues/events visible, no real member PII). Crop to the content region.

- [ ] **Step 3: Scrub check**

For each frame confirm: no real customer name, phone number, email, or address. Re-shoot rather than blur.

- [ ] **Step 4: Optimize each into place**

```bash
node scripts/optimize-image.mjs <raw1> public/images/work-missed-call-thread.webp 800
node scripts/optimize-image.mjs <raw2> public/images/work-booked-job.webp 1600
node scripts/optimize-image.mjs <raw3> public/images/vora-conversation-log.webp 1600
node scripts/optimize-image.mjs <raw4> public/images/chapterhq-app.webp 1600
```
Expected: printed sizes 120/150/150/150 KB or less. If over, re-run with quality lowered in the script call chain or a tighter crop.

- [ ] **Step 5: Commit the assets**

```bash
git add public/images/work-missed-call-thread.webp public/images/work-booked-job.webp public/images/vora-conversation-log.webp public/images/chapterhq-app.webp
```
Then: `git commit -F <msg-file>` — "feat(site): real product captures for /work and the work detail pages"

---

### Task 5: Missed-call filmstrip on /work (audit item #1)

**Files:**
- Modify: `app/work/page.tsx` (walkthrough array at lines 32-38 and its render loop at lines 71-85)

**Interfaces:**
- Consumes: `TapedPrint` from Task 2; `public/images/work-missed-call-thread.webp` and `public/images/work-booked-job.webp` from Task 4. **Blocked until Task 4's two files exist.**

- [ ] **Step 1: Add imports at the top of `app/work/page.tsx`**

```tsx
import type { StaticImageData } from 'next/image';
import TapedPrint from '@/components/TapedPrint';
import missedCallThread from '@/public/images/work-missed-call-thread.webp';
import bookedJob from '@/public/images/work-booked-job.webp';
```
(If the `@/public/...` alias fails to resolve, use `../../public/images/...` — check `tsconfig.json` paths.)

- [ ] **Step 2: Attach captures to walkthrough rows 2 and 4**

Replace the `walkthrough` const (lines 32-38) with:

```tsx
// Mechanism walkthrough, not metrics: one missed call followed through time.
// Rows 2 and 4 carry real captures of the artifact they describe (test run).
type WalkthroughStep = {
  at: string;
  what: string;
  img?: { src: StaticImageData; alt: string; caption: string; width: string };
};

const walkthrough: WalkthroughStep[] = [
  { at: 'tue 6:40pm', what: 'A call comes in while the crew is loading up. Nobody answers it.' },
  {
    at: 'tue 6:40pm, seconds later',
    what: 'The caller gets a text back in your shop name, asking what they need.',
    img: {
      src: missedCallThread,
      alt: 'Text conversation where the agent replies to a missed call in the shop name, asks what the caller needs, and offers two appointment windows for a water heater repair',
      caption: 'the text-back, minutes after the missed call · test run, my own number',
      width: 'max-w-[320px]',
    },
  },
  { at: 'tue 6:43pm', what: 'They write back: water heater, no hot water. The agent offers two windows tomorrow and holds the one they pick.' },
  {
    at: 'tue 6:44pm',
    what: 'The job is on the schedule with the address, the problem, and the whole text thread attached.',
    img: {
      src: bookedJob,
      alt: 'Vora calendar entry for the water heater job showing the address, the problem summary, and the attached text thread',
      caption: 'on the schedule, thread attached · test run',
      width: 'max-w-[460px]',
    },
  },
  { at: 'wed 7:10am', what: 'You open your morning list and find a booked job you never touched, and you can read exactly how it got there.' },
];
```

- [ ] **Step 3: Render the capture under its row's text**

In the walkthrough render loop, replace the `<p className="sm:col-span-9" …>` block with:

```tsx
<div className="sm:col-span-9">
  <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
    {step.what}
  </p>
  {step.img && (
    <TapedPrint
      className={`mt-5 ${step.img.width}`}
      src={step.img.src}
      alt={step.img.alt}
      caption={step.img.caption}
      sizes="(max-width: 640px) 90vw, 460px"
    />
  )}
</div>
```

- [ ] **Step 4: Verify**

Run: `npm run build` — expected: success.
Run: `npm start` in background, then `curl -s http://localhost:3000/work | grep -c "taped\|work-missed-call-thread"` → expected ≥1 occurrence of `work-missed-call-thread`. Playwright: screenshot `/work` at 390x844 and 1440x900; the two prints sit inline with their rows, page still reads top-to-bottom if images are blocked. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add app/work/page.tsx
```
Then: `git commit -F <msg-file>` — "feat(work): missed-call walkthrough shows the thread and the booked job"

---

### Task 6: Vora and ChapterHQ media mounts (audit item #2)

**Files:**
- Modify: `app/work/vora/page.tsx`
- Modify: `app/work/chapterhq/page.tsx`

**Interfaces:**
- Consumes: `TapedPrint` (Task 2); `public/images/vora-conversation-log.webp`, `public/images/chapterhq-app.webp` (Task 4). **Blocked until those files exist.** The `WorkDetail` template already renders an optional `media` prop under a "what it looks like" band (`components/WorkDetail.tsx:153-164`) — pattern proven by `app/work/site-assistant/page.tsx:25-47`. No template change needed.

- [ ] **Step 1: Add the Vora media prop**

In `app/work/vora/page.tsx`, add imports:

```tsx
import TapedPrint from '@/components/TapedPrint';
import voraLog from '@/public/images/vora-conversation-log.webp';
```

Add to the `<WorkDetail …>` props (after `href`):

```tsx
media={
  <TapedPrint
    src={voraLog}
    alt="Vora dashboard showing the missed-call agent's conversation log: inbound calls on the left, the automated text-back replies in each thread"
    caption="the conversation log, live system · test data"
    sizes="(max-width: 640px) 90vw, 720px"
  />
}
```

- [ ] **Step 2: Add the ChapterHQ media prop**

Same pattern in `app/work/chapterhq/page.tsx`:

```tsx
import TapedPrint from '@/components/TapedPrint';
import chapterhqApp from '@/public/images/chapterhq-app.webp';
```

```tsx
media={
  <TapedPrint
    src={chapterhqApp}
    alt="ChapterHQ dashboard for a club: the member list with dues status and the upcoming events panel"
    caption="the org view, live system · test org"
    sizes="(max-width: 640px) 90vw, 720px"
  />
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` — success.
`npm start` + curl `/work/vora` and `/work/chapterhq`, grep for `what it looks like` → expected 1 each. Stop server.

- [ ] **Step 4: Commit**

```bash
git add app/work/vora/page.tsx app/work/chapterhq/page.tsx
```
Then: `git commit -F <msg-file>` — "feat(work): Vora and ChapterHQ pages show their running interfaces"

---

### Task 7: ASSET GATE B — portrait shoot (blocks Task 8)

**Files:**
- Create: `public/images/caleb-working-wall.webp` (3:4 portrait, ≤1200px wide, <120KB)
- Create: `public/images/caleb-contact.webp` (tighter crop, ≤480px wide, <60KB)

**Interfaces:**
- Produces: the two files above (Task 8 static-imports them).

Caleb-side. **This is a real photograph of a real person. Not generated, not stock, not an avatar. If no photo exists yet, Task 8 stays blocked; do not substitute anything.**

- [ ] **Step 1: Shoot** — daylight, at the actual working wall with a real map on it, marker in hand or mid-review. No studio backdrop, cool neutral grade, no purple. Several frames; pick one where the wall content is legible enough to read as real but not the subject.
- [ ] **Step 2: Crop** — 3:4 for the About frame; a tighter chest-up crop for contact.
- [ ] **Step 3: Optimize**

```bash
node scripts/optimize-image.mjs <raw-about> public/images/caleb-working-wall.webp 1200
node scripts/optimize-image.mjs <raw-contact> public/images/caleb-contact.webp 480
```
Expected: <120KB and <60KB respectively.

- [ ] **Step 4: Commit** — `git add public/images/caleb-working-wall.webp public/images/caleb-contact.webp`, then `git commit -F <msg-file>` — "feat(site): portrait assets from the working-wall shoot"

*(Same shoot also produces the LinkedIn/YouTube/Instagram/Facebook profile set flagged High/Missing in `consulting/brand/asset-checklist.md` — export those separately, they do not go in the repo.)*

---

### Task 8: Portrait mounts on /about and /contact (audit items #3 and #9)

**Files:**
- Modify: `app/about/page.tsx` ("the background" section, lines 54-73)
- Modify: `app/contact/page.tsx` (route 2 row, lines 55-80)

**Interfaces:**
- Consumes: `TapedPrint` (Task 2); both Task 7 files. **Blocked until they exist.**

- [ ] **Step 1: Mount on /about**

Add imports to `app/about/page.tsx`:

```tsx
import TapedPrint from '@/components/TapedPrint';
import calebWall from '@/public/images/caleb-working-wall.webp';
```

In "the background" section, replace the right column `<div className="space-y-5 sm:col-span-8 sm:col-start-4">…</div>` wrapper so the photo sits beside the prose on desktop and ABOVE it on mobile (this splits the page's six-paragraph run):

```tsx
<div className="sm:col-span-9 sm:col-start-4">
  <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_260px]">
    <TapedPrint
      className="max-w-[300px] md:order-2"
      src={calebWall}
      alt="Caleb Bolden at a wall-mounted process map, marker in hand"
      caption="the wall the site is named after"
      priority
      sizes="(max-width: 768px) 300px, 260px"
    />
    <div className="space-y-5 md:order-1">
      {/* the three existing <p> paragraphs, unchanged */}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Mount on /contact**

Add imports to `app/contact/page.tsx`:

```tsx
import Image from 'next/image';
import calebContact from '@/public/images/caleb-contact.webp';
```

In the route 2 row, replace `<div className="sm:col-span-6">` content with a flex pairing (small photo, no caption — the row copy is the caption):

```tsx
<div className="flex items-start gap-4 sm:col-span-6">
  <Image
    src={calebContact}
    alt="Caleb Bolden"
    className="h-auto w-[72px] shrink-0 rounded-[2px]"
    style={{ border: '1px solid var(--color-hairline)' }}
    sizes="72px"
  />
  <div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 650, color: 'var(--color-ink)' }}>
      Email me
    </h2>
    <p className="mt-2" style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
      I read everything myself. Two sentences about your business is plenty.
    </p>
  </div>
</div>
```
**Protected copy:** the sentence "I read everything myself. Two sentences about your business is plenty." must not change (tone assessment do-not-touch list).

- [ ] **Step 3: Verify**

`npm run build` — success. `npm start`; Playwright screenshots of `/about` at 390 and 1440 (photo splits the prose run on mobile, sits right on desktop) and `/contact` at 390. Stop server.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/contact/page.tsx
```
Then: `git commit -F <msg-file>` — "feat(about): a real photograph at the working wall, echoed on /contact"

---

### Task 9: ServicePage figure slot + web-dev customer-path figure (audit item #4)

**Files:**
- Create: `components/figures/WebDevPathFigure.tsx`
- Modify: `components/ServicePage.tsx` (type at lines 6-17, method section at lines 64-80)
- Modify: `app/services/web-development/page.tsx` (content const)

**Interfaces:**
- Consumes: existing CSS classes `draw-on-reveal`, `stamp-on-reveal`, `anno` (defined in `app/globals.css`; usage pattern in `components/CTA.tsx:49-97` and `app/results/page.tsx:121+`).
- Produces: `ServicePageContent` gains optional `figure?: React.ReactNode`, rendered inside the "how it fits the method" section. Task 10 reuses this slot. Figure components are self-contained: they include their own `anno` intro line and mobile `overflow-x-auto` wrapper.

- [ ] **Step 1: Add the slot to the template**

In `components/ServicePage.tsx`, add to the type:

```tsx
export type ServicePageContent = {
  serviceType: string;
  h1: string;
  intro: string;
  method: string;
  figure?: React.ReactNode;
  deliverables: {
    title: string;
    detail: string;
  }[];
  proof: string;
  cta: string;
};
```

Add `figure` to the destructured props, and in the method section render it after the "See the five phases" link:

```tsx
              <Link
                href="/#method"
                className="link-draw mt-5 inline-block"
                style={{ fontSize: 14.5, color: 'var(--color-blue)' }}
              >
                See the five phases
              </Link>
              {figure && <div className="mt-10 max-w-2xl">{figure}</div>}
```

- [ ] **Step 2: Write the web-dev figure**

Create `components/figures/WebDevPathFigure.tsx`. Generic teaching diagram (code-only is allowed: it depicts the general customer path, not an engagement). Vocabulary: process boxes, solid blue connectors with terminators, one amber dashed leak arc.

```tsx
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
```

- [ ] **Step 3: Wire the web-dev page**

In `app/services/web-development/page.tsx`:

```tsx
import WebDevPathFigure from '@/components/figures/WebDevPathFigure';
```
and inside the `content` const, after `method:`, add:
```tsx
  figure: <WebDevPathFigure />,
```

- [ ] **Step 4: Verify**

`npm run build` — success. `npm start`; curl `/services/web-development`, grep for `the path a customer takes` → 1. Playwright at 390: the SVG scrolls horizontally, does not overflow the page body. Confirm `/services/seo` and `/services/marketing` render unchanged (slot optional). Stop server.

- [ ] **Step 5: Commit**

```bash
git add components/ServicePage.tsx components/figures/WebDevPathFigure.tsx app/services/web-development/page.tsx
```
Then: `git commit -F <msg-file>` — "feat(services): figure slot in the template + web-dev customer-path figure"

---

### Task 10: SEO and marketing path figures (audit item #10)

**Files:**
- Create: `components/figures/SeoPathFigure.tsx`
- Create: `components/figures/MarketingPathFigure.tsx`
- Modify: `app/services/seo/page.tsx`, `app/services/marketing/page.tsx`

**Interfaces:**
- Consumes: the `figure` slot from Task 9. Topologies must differ from web-dev (constraint: three relabeled copies read as templated).

- [ ] **Step 1: SEO figure**

Create `components/figures/SeoPathFigure.tsx` — same imports/pattern as WebDevPathFigure but with this distinct topology: the second node is a stack of three small rects (the local pack), and the leak arc runs from the pack back to the search box.

```tsx
// Local search: the customer path runs through the map pack. Generic teaching
// figure; depicts no specific engagement.

export default function SeoPathFigure() {
  return (
    <div>
      <p className="anno mb-4">how local customers actually find you</p>
      <div className="overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label="The local search path: a customer searches, sees the map pack of three businesses, opens one profile, and calls. A dashed amber arrow shows the leak: businesses outside the top three are never seen."
          viewBox="0 0 584 190"
          className="h-auto w-full"
          style={{ minWidth: 520 }}
        >
          <rect className="stamp-on-reveal" x={8} y={92} width={112} height={46} rx="2" fill="var(--color-bg)" stroke="var(--color-blue)" strokeWidth="1.5" />
          <text x={64} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>they search</text>

          {/* the local pack: three stacked slots, yours highlighted */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className="stamp-on-reveal"
              style={{ ['--stamp-delay' as string]: `${140 + i * 90}ms` }}
              x={160}
              y={78 + i * 26}
              width={112}
              height={20}
              rx="2"
              fill={i === 1 ? 'var(--color-blue-wash)' : 'var(--color-bg)'}
              stroke="var(--color-blue)"
              strokeWidth={i === 1 ? 1.5 : 1}
            />
          ))}
          <text className="anno" x={216} y={66} textAnchor="middle" fill="var(--color-blue)">the local pack</text>
          <text x={216} y={118} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600 }}>your business</text>

          <rect className="stamp-on-reveal" style={{ ['--stamp-delay' as string]: '420ms' }} x={312} y={92} width={112} height={46} rx="2" fill="var(--color-bg)" stroke="var(--color-blue)" strokeWidth="1.5" />
          <text x={368} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>your profile</text>

          <rect className="stamp-on-reveal" style={{ ['--stamp-delay' as string]: '560ms' }} x={464} y={92} width={112} height={46} rx="2" fill="var(--color-bg)" stroke="var(--color-blue)" strokeWidth="1.5" />
          <text x={520} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>they call</text>

          {[120, 272, 424].map((x, i) => (
            <g key={x}>
              <line className="draw-on-reveal" style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${200 + i * 140}ms` }} x1={x} y1={115} x2={x + 40} y2={115} stroke="var(--color-blue)" strokeWidth="1.5" />
              <path d={`M ${x + 33} 111 L ${x + 40} 115 L ${x + 33} 119`} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
            </g>
          ))}

          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '760ms', ['--ants-delay' as string]: '1.5s' }}
            d="M 216 150 C 216 178, 90 178, 66 142"
            fill="none"
            stroke="var(--color-sticky-edge)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text className="anno" x={150} y={186} fill="var(--color-ink-faint)">outside the top three: never seen</text>
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Marketing figure**

Create `components/figures/MarketingPathFigure.tsx` — distinct topology: a follow-up self-loop on node three, leak arc at the first-reply step.

```tsx
// Follow-up marketing: speed to first reply, then persistence. Generic
// teaching figure; depicts no specific engagement.

export default function MarketingPathFigure() {
  return (
    <div>
      <p className="anno mb-4">what happens to a lead after it arrives</p>
      <div className="overflow-x-auto pb-1">
        <svg
          role="img"
          aria-label="The follow-up path: a lead comes in, gets a first reply, then follow-up repeats until they answer, then the job is booked. A dashed amber arrow shows the leak: a reply that comes a day late loses the lead to whoever answered first."
          viewBox="0 0 584 200"
          className="h-auto w-full"
          style={{ minWidth: 520 }}
        >
          {[
            { x: 8, label: 'lead comes in' },
            { x: 160, label: 'first reply' },
            { x: 312, label: 'follow-up' },
            { x: 464, label: 'booked' },
          ].map((b, i) => (
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
              <text x={b.x + 56} y={120} textAnchor="middle" fill="var(--color-ink)" style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600 }}>
                {b.label}
              </text>
            </g>
          ))}
          {[120, 272, 424].map((x, i) => (
            <g key={x}>
              <line className="draw-on-reveal" style={{ ['--draw-len' as string]: 40, ['--draw-delay' as string]: `${160 + i * 140}ms` }} x1={x} y1={115} x2={x + 40} y2={115} stroke="var(--color-blue)" strokeWidth="1.5" />
              <path d={`M ${x + 33} 111 L ${x + 40} 115 L ${x + 33} 119`} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" />
            </g>
          ))}

          {/* follow-up repeats until they answer */}
          <path
            className="draw-on-reveal"
            style={{ ['--draw-len' as string]: 140, ['--draw-delay' as string]: '620ms' }}
            d="M 340 138 C 340 172, 396 172, 396 138"
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth="1.5"
            strokeDasharray="2 4"
          />
          <text className="anno" x={368} y={188} textAnchor="middle" fill="var(--color-blue)">until they answer</text>

          {/* the leak: a slow first reply */}
          <path
            className="stamp-on-reveal ants"
            style={{ ['--stamp-delay' as string]: '760ms', ['--ants-delay' as string]: '1.5s' }}
            d="M 216 92 C 216 34, 90 34, 68 88"
            fill="none"
            stroke="var(--color-sticky-edge)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text className="anno" x={150} y={26} textAnchor="middle" fill="var(--color-ink-faint)">a day late: they already hired</text>
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire both pages**

`app/services/seo/page.tsx`: import `SeoPathFigure`, add `figure: <SeoPathFigure />,` to its content const. Same for `app/services/marketing/page.tsx` with `MarketingPathFigure`.

- [ ] **Step 4: Verify** — `npm run build`; `npm start`; curl each page and grep its figure intro line (`how local customers actually find you`, `what happens to a lead after it arrives`) → 1 each. Playwright at 390 for horizontal scroll behavior. Stop server.

- [ ] **Step 5: Commit**

```bash
git add components/figures/SeoPathFigure.tsx components/figures/MarketingPathFigure.tsx app/services/seo/page.tsx app/services/marketing/page.tsx
```
Then: `git commit -F <msg-file>` — "feat(services): SEO and marketing path figures, distinct topologies"

---

### Task 11: VSM figure inside the map-before-you-automate post (audit item #7)

**Files:**
- Create: `components/figures/BlogVsmFigure.tsx`
- Modify: `app/blog/[slug]/page.tsx` (the `<MDXRemote source={post.content} />` call)
- Modify: `content/blog/map-before-you-automate.md`

**Interfaces:**
- Consumes: nothing from other tasks (independent).
- Produces: `BlogVsmFigure` registered as an MDX component, so any post can use `<BlogVsmFigure />`.

- [ ] **Step 1: Write the figure**

Create `components/figures/BlogVsmFigure.tsx`. Generic teaching VSM matching the post's argument (the wait is the problem, not the work). No engagement data, no invented client.

```tsx
// A generic value stream map for the blog: short touches, long waits, one
// rework loop. Teaching figure only; depicts no specific engagement.

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
              <text className="anno" x={(w.from + w.to) / 2} y={100} textAnchor="middle" fill="var(--color-blue)">
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
  );
}
```

- [ ] **Step 2: Register the MDX component**

In `app/blog/[slug]/page.tsx`, add the import and pass a `components` map:

```tsx
import BlogVsmFigure from '@/components/figures/BlogVsmFigure';
```
```tsx
// before
<MDXRemote source={post.content} />
// after
<MDXRemote source={post.content} components={{ BlogVsmFigure }} />
```

- [ ] **Step 3: Place the figure in the post**

In `content/blog/map-before-you-automate.md`, in the "What a value stream map actually is" section, after the paragraph ending "…including the parts nobody likes to admit." insert a blank line then:

```
<BlogVsmFigure />
```

- [ ] **Step 4: Verify**

`npm run build` — success (this also confirms MDX parses the component tag in every post). `npm start`; curl `/blog/map-before-you-automate`, grep `the shape of most back-office work` → 1. Confirm the other three posts still render (curl each, grep `<h1`). Playwright at 390: figure scrolls, not the page. Stop server.

- [ ] **Step 5: Commit**

```bash
git add components/figures/BlogVsmFigure.tsx "app/blog/[slug]/page.tsx" content/blog/map-before-you-automate.md
```
Then: `git commit -F <msg-file>` — "feat(blog): draw the value stream map the post spends 1,600 words describing"

---

### Task 12: ASSET GATE C — audit deliverable template renders (blocks Task 13)

**Files:**
- Create: `public/images/audit-map-template.webp`
- Create: `public/images/audit-scoring-template.webp`
- Create: `public/images/audit-roadmap-template.webp`
(each ≤900px wide, <100KB)

**Interfaces:**
- Produces: the three files above (Task 13 static-imports them). Sources are the REAL engagement templates: `consulting/materials/vsm-workshop-kit.md` (the mapping template page), `consulting/materials/opportunity-scoring-matrix.md`, `consulting/materials/roadmap-deck-template.md`.

**These render the blank templates, never a fake filled-in client artifact** (credibility don't list). The print-styled HTML pipeline from `consulting/lead-magnets/` (headless Chrome) is the established pattern.

- [ ] **Step 1: Build a print-styled HTML page per template** — one page each, working-wall styling (white, ink text, blue rules, mono labels), content taken from the template section of its source md file. Save the HTML sources to the session scratchpad (same convention as the lead-magnet PDFs).
- [ ] **Step 2: Screenshot each at 1200px width** via headless Chrome (`--screenshot --window-size=1200,1553 --hide-scrollbars`).
- [ ] **Step 3: Optimize**

```bash
node scripts/optimize-image.mjs <shot1> public/images/audit-map-template.webp 900
node scripts/optimize-image.mjs <shot2> public/images/audit-scoring-template.webp 900
node scripts/optimize-image.mjs <shot3> public/images/audit-roadmap-template.webp 900
```
Expected: each <100KB.

- [ ] **Step 4: Commit** — `git add public/images/audit-*.webp`, then `git commit -F <msg-file>` — "feat(site): renders of the three real audit deliverable templates"

---

### Task 13: Packages artifact strip on the homepage (audit item #5)

**Files:**
- Modify: `components/Packages.tsx` (between the card grid ending at line 141 and the closing note Reveal at line 143)

**Interfaces:**
- Consumes: `TapedPrint` + `PrintStrip` (Task 2); the three Task 12 files. **Blocked until they exist.**
- Constraint: this section already spends its one sticky note ("Start here"); the strip adds NO sticky and NO new card styling — prints only.

- [ ] **Step 1: Add imports to `components/Packages.tsx`**

```tsx
import TapedPrint, { PrintStrip } from './TapedPrint';
import auditMap from '@/public/images/audit-map-template.webp';
import auditScoring from '@/public/images/audit-scoring-template.webp';
import auditRoadmap from '@/public/images/audit-roadmap-template.webp';
```

- [ ] **Step 2: Insert the strip between the grid and the closing note**

```tsx
        <Reveal delay={150}>
          <div className="mt-14">
            <p className="anno anno-blue mb-5">what the audit produces</p>
            <PrintStrip>
              <TapedPrint
                className="min-w-[240px] snap-start sm:min-w-0"
                src={auditMap}
                alt="The blank value stream mapping sheet used in the audit workshop: lanes for each process step with wait-time and handoff fields"
                caption="the map"
                sizes="(max-width: 640px) 240px, 30vw"
              />
              <TapedPrint
                className="min-w-[240px] snap-start sm:min-w-0"
                src={auditScoring}
                alt="The blank opportunity scoring matrix: impact, feasibility, data readiness, and risk columns for each automation candidate"
                caption="the scored shortlist"
                sizes="(max-width: 640px) 240px, 30vw"
              />
              <TapedPrint
                className="min-w-[240px] snap-start sm:min-w-0"
                src={auditRoadmap}
                alt="The blank 90-day roadmap page: sequenced builds with an owner, a success metric, and a stop-or-scale checkpoint"
                caption="the 90-day roadmap"
                sizes="(max-width: 640px) 240px, 30vw"
              />
            </PrintStrip>
            <p className="mt-4" style={{ fontSize: 13.5, color: 'var(--color-ink-faint)' }}>
              The three templates your audit fills in. You keep all of them, whether or not I build anything.
            </p>
          </div>
        </Reveal>
```

- [ ] **Step 3: Verify** — `npm run build`; `npm start`; curl `/`, grep `what the audit produces` → 1. Playwright at 390: strip scrolls horizontally with a peek of the next print; at 1440: three prints in a row under the cards. Stop server.

- [ ] **Step 4: Commit**

```bash
git add components/Packages.tsx
```
Then: `git commit -F <msg-file>` — "feat(home): packages section shows the three audit deliverable templates"

---

### Task 14: ASSET GATE D — build-environment capture (blocks Task 15)

**Files:**
- Create: `public/images/how-i-build-fleet.webp` (≤1600px, <150KB)

**Interfaces:**
- Produces: the file above (Task 15 static-imports it).

- [ ] **Step 1: Capture** a real build session: Claude Code agent teams running in parallel (terminal panes or fleet view), during actual work.
- [ ] **Step 2: Scrub checklist — every item, no exceptions:** no API keys/tokens, no `~/.dev-secrets` content, no internal hostnames (homelab/Tailscale names), no client or prospect names, no email addresses, no file paths that reveal private project names beyond the public products. Re-capture rather than blur.
- [ ] **Step 3: Optimize**

```bash
node scripts/optimize-image.mjs <raw> public/images/how-i-build-fleet.webp 1600
```
Expected: <150KB.
- [ ] **Step 4: Commit** — `git add public/images/how-i-build-fleet.webp`, then `git commit -F <msg-file>` — "feat(site): real capture of the parallel-agent build environment"

---

### Task 15: Mount the capture on /how-i-build (audit item #8)

**Files:**
- Modify: `app/how-i-build/page.tsx` ("my stack in practice" section, after the stack grid ending at line 75)

**Interfaces:**
- Consumes: `TapedPrint` (Task 2); Task 14's file. **Blocked until it exists.**

- [ ] **Step 1: Add imports**

```tsx
import TapedPrint from '@/components/TapedPrint';
import fleetCapture from '@/public/images/how-i-build-fleet.webp';
```

- [ ] **Step 2: Mount below the stack grid**

Inside the `space-y-6` column, directly after the closing `</div>` of the stack grid, add:

```tsx
                  <TapedPrint
                    src={fleetCapture}
                    alt="Terminal session with multiple Claude Code agents working separate tasks in parallel while one pane shows the review queue"
                    caption="a build session, captured live · agents in parallel, reviewed by hand"
                    sizes="(max-width: 640px) 90vw, 720px"
                  />
```

- [ ] **Step 3: Verify** — `npm run build`; `npm start`; curl `/how-i-build`, grep `a build session, captured live` → 1. Playwright at 390 and 1440. Stop server.

- [ ] **Step 4: Commit**

```bash
git add app/how-i-build/page.tsx
```
Then: `git commit -F <msg-file>` — "feat(how-i-build): show the build environment the page describes"

---

## Final verification (after all unblocked tasks)

- [ ] `npm test` — all suites pass.
- [ ] `npm run build` — clean.
- [ ] `npm run build && npm start` (prod mode, per the hero-verify gotcha: dev server can't be trusted for CSS/animation checks), then Playwright pass over `/`, `/work`, `/work/vora`, `/work/chapterhq`, `/about`, `/contact`, `/services/web-development`, `/services/seo`, `/services/marketing`, `/blog/map-before-you-automate`, `/how-i-build` at 1440x900 and 390x844. Check: no horizontal page scroll anywhere; every figure/image visible; reduced-motion (emulate via Playwright `reducedMotion: 'reduce'`) shows all figures fully drawn/static.
- [ ] Sticky-note census: still max one per section sitewide (this plan adds zero).
- [ ] Do NOT deploy. Report which tasks shipped and which remain blocked on asset gates.
