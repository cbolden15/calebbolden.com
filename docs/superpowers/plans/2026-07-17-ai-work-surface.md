# AI work surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved v4 "AI work surface" spec, evolving calebbolden.com from a single-goal consulting site into one that serves thought leadership, consulting, and employer-visible skillset equally.

**Architecture:** Next.js 16 App Router, one route segment per new surface (`/work`, `/work/*`, `/how-i-build`), a shared `WorkDetail` component for the detail-page template (mirrors the existing `components/ServicePage.tsx` pattern), and a self-contained client component for the canvas hero ported from the approved prototype. Design system stays "working wall" (light) with one approved extension: a dark instrument surface scoped to the hero's live-system stage.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, `gray-matter` (blog frontmatter), Vercel AI SDK (existing chat). No test runner in this repo.

## Global Constraints

- **Copy rules (humanizer, per project CLAUDE.md):** no em dashes or en dashes as connectors, no buzzwords or promo adjectives, sentence-case headings, named sources for any statistic, "is/has" over "serves as/boasts". Every string this plan adds to a page is deliverable prose and follows these rules.
- **Design system:** working wall base only (white `--color-bg`, blueprint `--color-blue`, graph-paper fields, mono annotations via `.anno`, hairline dividers `--color-hairline`). Reuse existing utility classes from `app/globals.css`: `.type-display`, `.graph-field`, `.graph-fade`, `.anno`, `.anno-blue`, `.reveal`, `.rise-in`, `.btn-ink`, `.btn-hairline`, `.btn-roll`, `.link-draw`, `.corner-hover`, `.chat-offset`, `.pulse-dot`. Do not invent new colors except the approved dark-instrument palette, and only inside the hero (Task 22).
- **Dark instrument surface (approved extension, hero-only):** near-black `#05070c`, steel-blue/cyan glow, glass chrome. Amber stays the single warm accent. Every other page stays light.
- **Real semantic status only:** `live` / `building` / `running` reflect actual deployment state (matches `components/Proof.tsx`). No invented metrics, no fake logos.
- **Verification model (no unit tests in this repo):** each task's test cycle is (1) `npm run build` passes, (2) `npm run lint` passes, (3) browser pass via the preview tools on the affected route. "Write the failing test" steps are replaced by "define the expected rendered result, then verify it in the browser."
- **GitHub handle:** `github.com/cbolden15`. LinkedIn URL: confirm Caleb's exact URL before Task 15; use `https://www.linkedin.com/in/calebbolden` as the working value and flag it in that task's commit if unconfirmed.
- **Branch:** work proceeds on the current worktree branch `claude/website-changes-progress-499fc8`; commit per task; open one PR at the end.

## Phase map

Each phase produces working, shippable software on its own. Recommended order builds link targets before the pages that link to them, and lands the high-risk hero last.

- **Phase 1 — /work surface** (Tasks 1-6): hub, detail template, three detail pages, open-source page, notes band. New section, self-contained.
- **Phase 2 — /how-i-build** (Task 7).
- **Phase 3 — About employer pivot** (Tasks 8-9).
- **Phase 4 — Blog integration** (Tasks 10-12): metadata fix, sitemap, new posts (content can trail).
- **Phase 5 — Homepage wiring** (Tasks 13-17): nav, AI-systems band, PainSolution rows, Proof links, metadata.
- **Phase 6 — Homepage hero** (Tasks 18-22): port the approved canvas prototype. Highest risk, most value; everything above ships without it.

---

## Phase 1 — /work surface

### Task 1: Shared work-detail template component

**Files:**
- Create: `components/WorkDetail.tsx`

**Interfaces:**
- Consumes: existing utility classes and `Reveal` from `components/Reveal.tsx`, `Header`, `Footer`.
- Produces: `WorkDetail` default export taking props:
  ```ts
  interface TechBand { label: string; value: string }
  interface WorkDetailProps {
    name: string;            // "Vora"
    status: 'live' | 'building' | 'running';
    whatItIs: string;        // plain-language paragraph
    whoUsesIt: string;
    aiInside: string;        // architecture in plain terms
    techBands: TechBand[];   // mono-annotated stack rows for technical readers
    stackLine: string;       // one-line stack summary
    href?: string | null;    // external "Visit" link where public
    sheet: string;           // e.g. "work / vora"
  }
  ```
  Later tasks (2, 3, 4) render detail pages by passing data to this component.

- [ ] **Step 1: Define the expected rendered result**

The component renders `Header`, a `main.chat-offset`, then five bands following the spec's detail-page template and the visual language of `app/about/page.tsx` (graph-field hero band, then hairline-divided `anno-blue` label + content bands):
1. Title band (`graph-field graph-fade`): `name` as `.type-display` h1, a status marker (`.pulse-dot` for live, blue dot for running, hollow for building, reusing the `Proof.tsx` convention), and the `sheet` string as `.anno`.
2. "What it is" band: `anno-blue` label "what it is" + `whatItIs`.
3. "Who uses it" band: label "who uses it" + `whoUsesIt`.
4. "The AI inside" band: label "the ai inside" + `aiInside`, followed by a mono technical table rendering `techBands` (each row: `.anno` label, value) inside a hairline border, matching the `Footer.tsx` title-block grid style.
5. Stack + link band: `stackLine` as `.anno`, and if `href`, a `Visit {name}` external link (`link-draw`, blue, `target="_blank" rel="noopener noreferrer"`).
Then `Footer`.

- [ ] **Step 2: Write the component**

Follow the exact section wrappers used in `app/about/page.tsx` (`<section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>` with a `grid grid-cols-1 gap-5 sm:grid-cols-12` and `anno anno-blue sm:col-span-2` label + `sm:col-span-8 sm:col-start-4` body). Render the status marker with this logic:
```tsx
{status === 'live' && <span className="pulse-dot" aria-hidden="true" />}
{status === 'running' && <span className="inline-block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: 'var(--color-blue)' }} aria-hidden="true" />}
{status === 'building' && <span className="inline-block h-[7px] w-[7px] shrink-0 rounded-full" style={{ border: '1.5px solid var(--color-blue)' }} aria-hidden="true" />}
<span className="anno">{status}</span>
```
Render `techBands` as a bordered grid (reuse Footer's `border: '1px solid var(--color-hairline)'` cell pattern): each row `min-h`, `.anno` label on top, value below at `fontSize: 13, color: 'var(--color-ink-muted)'`.

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: PASS. Component compiles (it is not yet imported by a route, so this only checks types/syntax).

- [ ] **Step 4: Commit**

```bash
git add components/WorkDetail.tsx
git commit -m "feat: shared work-detail template component"
```

---

### Task 2: /work/vora detail page

**Files:**
- Create: `app/work/vora/page.tsx`

**Interfaces:**
- Consumes: `WorkDetail` from Task 1.

- [ ] **Step 1: Define expected result**

`/work/vora` renders the `WorkDetail` template with real Vora facts (from project CLAUDE.md): live product, service-business CRM/platform, deployed on Hetzner. Metadata title "Vora | Work | Caleb Bolden".

- [ ] **Step 2: Write the page**

```tsx
import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

export const metadata: Metadata = {
  title: 'Vora | Work | Caleb Bolden',
  description: 'Vora is an AI CRM platform for service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in one system.',
};

export default function VoraPage() {
  return (
    <WorkDetail
      name="Vora"
      status="live"
      sheet="work / vora"
      whatItIs="Vora is a CRM platform for service businesses. It answers missed calls by text, follows up on new leads, runs campaigns, and handles scheduling, all in one place instead of five disconnected tools."
      whoUsesIt="Owners of service businesses (home services, clinics, studios) who lose revenue to calls that go unanswered and leads that sit. It runs for my own companies first, then for clients."
      aiInside="A voice and messaging layer sits in front of the business. When a call is missed, an agent texts back within seconds, qualifies the lead, and books the job. A campaign agent sends email and SMS on a schedule. Everything writes to one record so nothing gets dropped between steps."
      techBands={[
        { label: 'dashboard', value: 'SvelteKit, server routes, Postgres' },
        { label: 'agents', value: 'MCP server exposing business tools to the model' },
        { label: 'messaging', value: 'Twilio voice and SMS, Resend and SendGrid email' },
        { label: 'billing', value: 'Stripe' },
        { label: 'infra', value: 'Docker, shared Caddy, self-hosted on Hetzner' },
      ]}
      stackLine="SvelteKit · Postgres · MCP · Twilio · Stripe · Docker · Hetzner"
      href="https://voratechnology.com"
    />
  );
}
```

- [ ] **Step 3: Verify** — `npm run build && npm run lint`, then browser pass on `/work/vora` (all five bands render, external link resolves, mobile width at 375px stacks cleanly).

- [ ] **Step 4: Commit**

```bash
git add app/work/vora/page.tsx
git commit -m "feat: /work/vora detail page"
```

---

### Task 3: /work/chapterhq detail page

**Files:**
- Create: `app/work/chapterhq/page.tsx`

**Interfaces:** Consumes `WorkDetail` from Task 1.

- [ ] **Step 1: Define expected result** — Detail page for ChapterHQ (live; clubs/chapters/nonprofits management with an AI assistant answering from the org's own records via pgvector).

- [ ] **Step 2: Write the page** (same shape as Task 2, real ChapterHQ facts):

```tsx
import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

export const metadata: Metadata = {
  title: 'ChapterHQ | Work | Caleb Bolden',
  description: 'ChapterHQ runs clubs, chapters, and nonprofits: members, dues, events, and an AI assistant that answers from the org’s own records.',
};

export default function ChapterHQPage() {
  return (
    <WorkDetail
      name="ChapterHQ"
      status="live"
      sheet="work / chapterhq"
      whatItIs="ChapterHQ is a management platform for clubs, chapters, and nonprofits. It tracks members, collects dues, runs events, and answers member questions from the organization’s own records."
      whoUsesIt="Volunteer-run organizations where the person doing the admin also has a day job. The assistant takes the repeat questions so a board member does not have to."
      aiInside="Member records, bylaws, and past decisions are embedded into a vector store. When someone asks a question, the assistant retrieves the org’s own documents and answers from them, so the answer is grounded in that chapter’s reality, not a generic guess."
      techBands={[
        { label: 'app', value: 'Next.js, Postgres with pgvector' },
        { label: 'data', value: 'Drizzle migrations, vector embeddings for retrieval' },
        { label: 'realtime', value: 'Pusher' },
        { label: 'billing', value: 'Stripe' },
        { label: 'infra', value: 'Docker, shared Caddy, self-hosted on Hetzner' },
      ]}
      stackLine="Next.js · Postgres + pgvector · Drizzle · Pusher · Stripe · Docker"
      href="https://chapterhq.ai"
    />
  );
}
```

- [ ] **Step 3: Verify** — build, lint, browser pass on `/work/chapterhq`.
- [ ] **Step 4: Commit** — `git add app/work/chapterhq/page.tsx && git commit -m "feat: /work/chapterhq detail page"`

---

### Task 4: /work/site-assistant detail page

**Files:**
- Create: `app/work/site-assistant/page.tsx`

**Interfaces:** Consumes `WorkDetail` from Task 1.

- [ ] **Step 1: Define expected result** — Detail page for this site's chat agent (live). Real stack: Vercel AI SDK (`ai`, `@ai-sdk/google`, `@ai-sdk/react`), Gemini, Zod-typed tools in `lib/chat/`.

- [ ] **Step 2: Write the page:**

```tsx
import type { Metadata } from 'next';
import WorkDetail from '@/components/WorkDetail';

export const metadata: Metadata = {
  title: 'Site assistant | Work | Caleb Bolden',
  description: 'The chat assistant on this site is a live agent: it answers questions about the work and helps a visitor scope what AI could take off their plate.',
};

export default function SiteAssistantPage() {
  return (
    <WorkDetail
      name="Site assistant"
      status="live"
      sheet="work / site-assistant"
      whatItIs="The chat assistant in the corner of this site is a working agent, not a demo. It answers questions about what I build and helps a visitor think through where AI would pay in their own business."
      whoUsesIt="Anyone reading the site who would rather ask than dig. It is the same pattern I build for clients, running on my own site so you can try it before you buy it."
      aiInside="A model with a set of typed tools it can call: pull up a service, start the readiness scorecard, hand off to the audit funnel. The tools are defined with a schema so the model can only do what it is allowed to do, which is how these stay safe in production."
      techBands={[
        { label: 'model', value: 'Gemini via the Vercel AI SDK' },
        { label: 'tools', value: 'Zod-typed tool definitions in lib/chat' },
        { label: 'ui', value: 'React streaming chat, Next.js route handler' },
      ]}
      stackLine="Next.js · Vercel AI SDK · Gemini · Zod tools"
      href={null}
    />
  );
}
```

- [ ] **Step 3: Verify** — build, lint, browser pass on `/work/site-assistant` (no external link renders since `href` is null).
- [ ] **Step 4: Commit** — `git add app/work/site-assistant/page.tsx && git commit -m "feat: /work/site-assistant detail page"`

---

### Task 5: /work/open-source page

**Files:**
- Create: `app/work/open-source/page.tsx`

**Interfaces:** Consumes utility classes, `Header`, `Footer`, `Reveal`. Self-contained (does not use `WorkDetail`; it is a list, not a detail).

- [ ] **Step 1: Define expected result** — A single page listing the five public repos from the spec, each linking to its GitHub URL, using the same hairline divided-row pattern as `components/Proof.tsx` (name / description / external link).

- [ ] **Step 2: Write the page** — Header, `graph-field` title band ("Open source", `.type-display`, sub "Tooling I publish on GitHub. Small, sharp, agent-first."), then a `borderTop` hairline list mapping this data:

```tsx
const repos = [
  { name: 'life-agent-mcp', desc: 'An MCP server exposing 38 Claude-ready tools over a FastMCP proxy pattern.', href: 'https://github.com/cbolden15/life-agent-mcp' },
  { name: 'youtube-transcript-workflow', desc: 'A map/reduce pipeline that turns captions into notes, with multiple backends.', href: 'https://github.com/cbolden15/youtube-transcript-workflow' },
  { name: 'claude-code-config-manager', desc: 'A single source of truth for Claude Code config across machines.', href: 'https://github.com/cbolden15/claude-code-config-manager' },
  { name: 'cli-printing-press', desc: 'A generator for CLIs built to be driven by AI agents first.', href: 'https://github.com/cbolden15/cli-printing-press' },
  { name: 'canton-traffic-calculator', desc: 'A cost estimator for running on the Canton Network.', href: 'https://github.com/cbolden15/canton-traffic-calculator' },
];
```
Each row: `grid sm:grid-cols-12`, mono repo name (col-span-3, `font-display`), description (col-span-6), `View on GitHub` external link (col-span-3, right, `link-draw`, blue). Add a footer line: a `link-draw` to `https://github.com/cbolden15` ("All repos on GitHub"). Metadata title "Open source | Work | Caleb Bolden".

- [ ] **Step 3: Verify** — build, lint, browser pass on `/work/open-source`; every repo link resolves (open one to confirm the URL is real, or mark any 404 for Caleb to correct the slug).
- [ ] **Step 4: Commit** — `git add app/work/open-source/page.tsx && git commit -m "feat: /work/open-source page"`

---

### Task 6: /work hub with notes band

**Files:**
- Create: `app/work/page.tsx`

**Interfaces:**
- Consumes: `getAllBlogPosts` from `lib/blog/getBlogPosts.ts` (server component; safe to call `fs`), `Header`, `Footer`, `Reveal`, `Link`.

- [ ] **Step 1: Define expected result** — The hub is a server component with an intro and four bands per spec §Site map: Systems (links to the three detail pages), Open source (links to `/work/open-source`), How I build (teaser linking to `/how-i-build`), and Notes (the 2-3 latest blog posts, linking to `/blog`).

- [ ] **Step 2: Write the page** — Header, `graph-field graph-fade` title band ("Work", `.type-display`, sub: "The systems I have built and run, the code I publish, and how I build. I recommend what I have already shipped."). Then:
  - **Systems band** — hairline rows for Vora → `/work/vora`, ChapterHQ → `/work/chapterhq`, Site assistant → `/work/site-assistant` (internal `Link`, `link-draw`), each with a one-line description and status marker (reuse the Proof marker convention).
  - **Open source band** — one row linking to `/work/open-source`: "Tooling I publish on GitHub."
  - **How I build band** — teaser paragraph + `Link` to `/how-i-build`: "How my own operation runs on AI."
  - **Notes band** — pull latest posts:
    ```tsx
    const posts = getAllBlogPosts().slice(0, 3);
    ```
    Render each: `time` (formatted like `app/blog/page.tsx`), title linking to `/blog/${post.slug}`, excerpt. Band header links to `/blog` ("All notes"). Reuse the exact article-row markup from `app/blog/page.tsx:37-59`.
  - Metadata title "Work | Caleb Bolden", description broadened to name systems + open source + writing.

- [ ] **Step 3: Verify** — build, lint, browser pass on `/work`; every band link resolves to a real route (all built in Tasks 2-5 and Phase 2); notes band shows real post titles; mobile width stacks.
- [ ] **Step 4: Commit** — `git add app/work/page.tsx && git commit -m "feat: /work hub with systems, open source, and notes bands"`

> Note: the "How I build" teaser links to `/how-i-build`, built in Task 7. If executing strictly in order, the link 404s until Task 7 lands; the build still passes. Verify that link after Task 7.

---

## Phase 2 — /how-i-build

### Task 7: /how-i-build page

**Files:**
- Create: `app/how-i-build/page.tsx`

**Interfaces:** Consumes `Header`, `Footer`, `Reveal`, `Link`, and the mono technical-table pattern from `WorkDetail`.

- [ ] **Step 1: Define expected result** — The meta-story page per spec §How-I-build: the operation itself runs on AI. Bands: opening (consultant who dogfoods), "My stack in practice", "What this means for clients". Plain language first, mono-annotated detail for technical readers. No "10x" hype.

- [ ] **Step 2: Write the page** — Same structural pattern as `app/about/page.tsx` (`graph-field` title band, then `anno-blue` label + content bands). Real copy (humanizer-clean):
  - Title: "How I build". Sub: "I run my own companies on the systems I recommend. The advice comes from a workflow I use every day, not a slide."
  - **the operation** band: "I do not recommend AI I have not run myself. My own dev work, my own back office, and the products above all run on the same kind of agents I build for clients. When something breaks, I have usually already hit that failure and fixed it."
  - **my stack in practice** band: paragraph + a mono table (reuse WorkDetail's `techBands` grid style) with rows:
    - `primary env` → "Claude Code as the main development environment"
    - `parallelism` → "agent teams working in parallel on separate tasks"
    - `model routing` → "the right model for each task, not one model for everything"
    - `autonomous loops` → "jobs that keep shipping while I sleep, reviewed in the morning"
  - **what this means for clients** band: "Two things. Speed: I ship in days what used to take weeks. And judgment: because I run these systems on my own revenue, I know where they break, so I can tell you where AI will not pay before you spend on it."
  - Close with a `Link` to `/work` ("See the systems") and `/contact` CTA (reuse the about page's bordered CTA card, copy: "Start with the audit").
  - Metadata title "How I build | Caleb Bolden".

- [ ] **Step 3: Verify** — build, lint, browser pass on `/how-i-build`; re-verify the Task 6 `/work` "How I build" link now resolves.
- [ ] **Step 4: Commit** — `git add app/how-i-build/page.tsx && git commit -m "feat: /how-i-build page"`

---

## Phase 3 — About employer pivot

### Task 8: About page skills band + career depth

**Files:**
- Modify: `app/about/page.tsx` (insert a skills band after "the products" band at line 61; extend "the background" band copy is already fintech-accurate, leave it).

**Interfaces:** Consumes the mono-table grid style used in `WorkDetail`.

- [ ] **Step 1: Define expected result** — A new "the skills" band, mono-annotated inventory grounded in shipped work (not a keyword wall), inserted between the existing "the products" band (ends line 61) and "the method" band (starts line 63).

- [ ] **Step 2: Insert the band** — Match the surrounding section pattern exactly (`<section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>`, grid, `anno anno-blue sm:col-span-2` label "the skills"). Content: a short lead ("The inventory, tied to things I have actually shipped:") then a bordered mono grid with rows:
  - `ai / agents` → "agent systems, MCP servers, multi-model routing"
  - `process` → "value stream mapping, lean and six sigma"
  - `full stack` → "Next.js, SvelteKit, Postgres"
  - `infra` → "Docker, self-hosted, Caddy, CI"
  Each row cites where it shows up (Vora, ChapterHQ, this site) in the value text where natural.

- [ ] **Step 3: Verify** — build, lint, browser pass on `/about` (new band renders between products and method, mobile stacks).
- [ ] **Step 4: Commit** — `git add app/about/page.tsx && git commit -m "feat: about page skills band"`

---

### Task 9: About page GitHub and LinkedIn links

**Files:**
- Modify: `app/about/page.tsx` (the CTA band, ~lines 85-111).

- [ ] **Step 1: Define expected result** — Visible GitHub and LinkedIn links on the about page (the site currently has no GitHub link anywhere in `app/` except contact). Placed as a small links row inside or below the closing CTA band, `link-draw`, styled as `.anno`-scale secondary links so they do not read as a "hire me" banner (spec §About: employer goal without a for-hire banner).

- [ ] **Step 2: Add the links** — Below the CTA card, add:
  ```tsx
  <div className="mt-8 flex flex-wrap gap-6">
    <a href="https://github.com/cbolden15" target="_blank" rel="noopener noreferrer" className="link-draw" style={{ fontSize: 14, color: 'var(--color-blue)' }}>GitHub</a>
    <a href="https://www.linkedin.com/in/calebbolden" target="_blank" rel="noopener noreferrer" className="link-draw" style={{ fontSize: 14, color: 'var(--color-blue)' }}>LinkedIn</a>
  </div>
  ```
  Confirm the LinkedIn URL with Caleb before commit (per Global Constraints); if unconfirmed, note it in the commit body.

- [ ] **Step 3: Verify** — build, lint, browser pass; both links open the right destinations.
- [ ] **Step 4: Commit** — `git add app/about/page.tsx && git commit -m "feat: GitHub and LinkedIn links on about page"`

---

## Phase 4 — Blog integration

### Task 10: Fix stale blog metadata

**Files:**
- Modify: `app/blog/page.tsx:9` (metadata description) and `app/blog/page.tsx:26` (visible `<p>`).

- [ ] **Step 1: Define expected result** — Both strings drop "blockchain technology" and align with positioning (spec §Thought leadership).

- [ ] **Step 2: Edit both strings** — Replace "Insights on AI automation, process improvement, and blockchain technology." (line 9) and "Insights on AI automation, process improvement, and blockchain technology" (line 26) with: "Notes on AI, automation, and mapping a business before you build."

- [ ] **Step 3: Verify** — build, lint, browser pass on `/blog` (heading sub-copy updated; view source / metadata shows new description).
- [ ] **Step 4: Commit** — `git add app/blog/page.tsx && git commit -m "fix: drop blockchain from blog copy, align with positioning"`

---

### Task 11: Add blog post URLs to sitemap

**Files:**
- Modify: `app/sitemap.ts`

**Interfaces:** Consumes `getAllBlogPosts` from `lib/blog/getBlogPosts.ts`.

- [ ] **Step 1: Define expected result** — The sitemap includes one entry per blog post (currently only `/blog` is listed). Known gap pulled forward from backlog.

- [ ] **Step 2: Edit sitemap** — Import and append post URLs:
  ```ts
  import type { MetadataRoute } from 'next';
  import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';

  const BASE = 'https://calebbolden.com';

  export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllBlogPosts().map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }));
    return [
      { url: `${BASE}/`, changeFrequency: 'monthly', priority: 1 },
      // ...existing entries unchanged...
      { url: `${BASE}/work`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE}/work/vora`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE}/work/chapterhq`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE}/work/site-assistant`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE}/work/open-source`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE}/how-i-build`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.6 },
      ...posts,
    ];
  }
  ```
  Keep the existing service/tools/about/contact entries in place (shown truncated above).

- [ ] **Step 3: Verify** — build, lint, then browser pass on `/sitemap.xml` (blog post URLs and new /work URLs present).
- [ ] **Step 4: Commit** — `git add app/sitemap.ts && git commit -m "feat: add blog posts and work pages to sitemap"`

---

### Task 12 (optional, content can trail): New AI-depth blog posts

**Files:**
- Create: `content/blog/how-my-operation-runs-on-agent-teams.md`, `content/blog/what-is-an-mcp-server.md` (2 posts minimum; a third on the voice agent is optional).

**Interfaces:** Consumes the frontmatter schema in `lib/blog/getBlogPosts.ts` (`title, date, category, excerpt, featured, tags`).

- [ ] **Step 1: Define expected result** — 2-3 posts carrying the AI-depth story, humanizer-clean, tone matching the existing `content/blog/map-before-you-automate.md`. Each has valid frontmatter so it appears on `/blog` and in the sitemap automatically.

- [ ] **Step 2: Write the posts** — Match the frontmatter of an existing post exactly (open `content/blog/map-before-you-automate.md` for the field shape and voice). Topics: how the operation runs on agent teams; what an MCP server is and why a business should care. Each references the signature POV ("you can't automate a process you don't understand"). This is content work; it can land after the build in a separate session.

- [ ] **Step 3: Verify** — build, lint, browser pass on `/blog` (new posts listed, newest first) and each `/blog/<slug>` renders.
- [ ] **Step 4: Commit** — `git add content/blog/*.md && git commit -m "content: AI-depth blog posts"`

---

## Phase 5 — Homepage wiring

### Task 13: Point nav "Work" at the hub, add Work to footer

**Files:**
- Modify: `components/Header.tsx:12` and `components/Footer.tsx:33-38`.

- [ ] **Step 1: Define expected result** — Header "Work" link points to `/work` (currently `/#work`, a homepage anchor). Footer gains a "Work" link.

- [ ] **Step 2: Edit** — In `components/Header.tsx`, change `{ label: 'Work', href: '/#work' }` to `{ label: 'Work', href: '/work' }`. In `components/Footer.tsx`, add `{ label: 'Work', href: '/work' }` to the footer nav array (the `[{label,href}...]` at lines 33-38).

- [ ] **Step 3: Verify** — build, lint, browser pass: header "Work" navigates to `/work`; footer shows and resolves "Work".
- [ ] **Step 4: Commit** — `git add components/Header.tsx components/Footer.tsx && git commit -m "feat: nav Work links to /work hub"`

---

### Task 14: AI-systems band on the homepage

**Files:**
- Create: `components/AISystems.tsx`
- Modify: `app/page.tsx` (insert `<AISystems />` between `<Process />` and `<Packages />`).

**Interfaces:** Consumes utility classes, `Reveal`, `Link`. Rendered by `app/page.tsx`.

- [ ] **Step 1: Define expected result** — A short section per spec §New AI-systems band: what I actually build (voice agents, knowledge assistants, workflow automation, campaign systems), mono system-category tags, linking into `/work`.

- [ ] **Step 2: Write the component** — `<section>` with `.type-display` h2 ("What I actually build"), a short lead, then a mono-tagged grid of four categories:
  ```tsx
  const systems = [
    { tag: 'voice', title: 'Voice agents', desc: 'Answer every call, book the job, route the emergency.' },
    { tag: 'knowledge', title: 'Knowledge assistants', desc: 'Answer from your own records instead of a generic guess.' },
    { tag: 'workflow', title: 'Workflow automation', desc: 'Invoices, scheduling, and data entry that run themselves.' },
    { tag: 'campaigns', title: 'Campaign systems', desc: 'Email and SMS that go out on schedule while you work.' },
  ];
  ```
  Each cell: `.anno` tag, `font-display` title, muted description. Footer line: `Link` to `/work` ("See the systems I run"). Reuse `Reveal` with staggered `delay={i * 70}`.

- [ ] **Step 3: Insert into homepage** — In `app/page.tsx`, import `AISystems` and place `<AISystems />` between `<Process />` (line 20) and `<Packages />` (line 21).

- [ ] **Step 4: Verify** — build, lint, browser pass on `/`: band renders between Process and Packages, `/work` link resolves, mobile stacks.
- [ ] **Step 5: Commit** — `git add components/AISystems.tsx app/page.tsx && git commit -m "feat: AI-systems band on homepage"`

---

### Task 15: Add white-collar rows to PainSolution

**Files:**
- Modify: `components/PainSolution.tsx:10-53` (the `rows` array).

- [ ] **Step 1: Define expected result** — Keep the strongest existing SMB rows; add three white-collar rows per spec §Pain rows: document intake/processing, client onboarding, knowledge search. Same accordion pattern, mono `tag`.

- [ ] **Step 2: Append three row objects** to the `rows` array (same shape: `pain, painDesc, fix, fixDesc, tag`):
  ```tsx
  {
    pain: 'Documents pile up waiting to be processed',
    painDesc: 'Intake forms, contracts, and PDFs sit in a queue. Someone has to read each one, pull the fields, and file it. That someone is expensive and slow.',
    fix: 'Documents processed on arrival',
    fixDesc: 'An agent reads each document, extracts the fields, and files it to the right record. A person reviews the exceptions, not the whole stack.',
    tag: 'docs',
  },
  {
    pain: 'Client onboarding takes a week of back-and-forth',
    painDesc: 'Every new client means the same emails, the same forms, the same chasing for missing information. It stalls the work and it looks unpolished.',
    fix: 'Onboarding that runs itself',
    fixDesc: 'The system collects intake, checks it for gaps, chases what is missing, and sets up the account, so the first real conversation is about the work.',
    tag: 'workflow',
  },
  {
    pain: 'The answer is buried in old files',
    painDesc: 'A client asks a question and the answer is in a file from two years ago that nobody can find. So it gets re-answered from scratch, sometimes wrong.',
    fix: 'Answers from your own records',
    fixDesc: 'A knowledge assistant searches your documents and answers with the source attached, so the team stops re-deriving what the firm already knew.',
    tag: 'knowledge',
  },
  ```

- [ ] **Step 3: Verify** — build, lint, browser pass on `/`: new rows appear in the accordion, open/close works, tags render.
- [ ] **Step 4: Commit** — `git add components/PainSolution.tsx && git commit -m "feat: white-collar pain rows (docs, onboarding, knowledge search)"`

---

### Task 16: Proof section links to /work detail pages and open source

**Files:**
- Modify: `components/Proof.tsx:7-32` (product data) and `:63-86` (row render).

- [ ] **Step 1: Define expected result** — Rows that have a `/work/*` detail page get an internal "Details" link to it (Vora → `/work/vora`, ChapterHQ → `/work/chapterhq`), keeping their external "Visit" link. Add one new row: "Open source" → `/work/open-source`. Keep the chat-assistant callout line. Others keep current behavior (spec §Proof).

- [ ] **Step 2: Edit the data + render** — Add an optional `detail?: string` field to the product objects (`Vora` → `/work/vora`, `ChapterHQ` → `/work/chapterhq`). Append an open-source row: `{ name: 'Open source', desc: 'Tooling I publish on GitHub.', href: null, detail: '/work/open-source', status: 'live' }`. In the render (the `flex ... sm:col-span-3` block), when `p.detail` is set, render an internal `Link` ("Details", `link-draw`, blue) alongside the existing external `Visit` link. Use `next/link` `Link` for internal, keep `<a target="_blank">` for external.

- [ ] **Step 3: Verify** — build, lint, browser pass on `/`: Vora and ChapterHQ rows show both Details (internal, resolves to detail page) and Visit (external); open-source row resolves to `/work/open-source`; chat callout line intact.
- [ ] **Step 4: Commit** — `git add components/Proof.tsx && git commit -m "feat: Proof rows link to /work detail pages and open source"`

---

### Task 17: Broaden homepage and site metadata

**Files:**
- Modify: `app/layout.tsx:26-40` (root metadata).

- [ ] **Step 1: Define expected result** — Title/description/keywords broaden beyond "small business" to name AI systems, process consulting, and writing (spec §Metadata), while keeping the map-first positioning.

- [ ] **Step 2: Edit metadata** — Update `title` to "Caleb Bolden | AI systems, process consulting, and writing"; `description` to "I find where a business loses time, then build the AI that takes that work over. Every engagement starts with a map of how the business actually runs."; add keywords "AI systems", "agent systems", "process consulting"; mirror the same title/description into the `openGraph` block. Keep humanizer rules (no em dashes).

- [ ] **Step 3: Verify** — build, lint, browser pass: view metadata on `/` reflects new title/description.
- [ ] **Step 4: Commit** — `git add app/layout.tsx && git commit -m "feat: broaden site metadata beyond small business"`

---

## Phase 6 — Homepage hero (canvas port)

> This phase ports the approved prototype at `docs/design/hero-prototype-2026-07-14.html` (source of truth for motion, timing, and copy). The prototype is self-contained vanilla JS: one `<canvas id="cv">`, an inline `<style>`, and one `<script>` with the draw engine (identifiers include `DPR`, `ROUTES`, `JOBS`, `lerp`, a paper world and a live world sharing node/edge geometry split at a scan line, and a `scrollProgress`-driven render loop). The task is to wrap that engine in a React client component without changing its behavior, add a mobile/reduced-motion static path, and swap it into the homepage.

### Task 18: Hero canvas engine module (ported verbatim)

**Files:**
- Create: `components/hero/heroEngine.ts`

**Interfaces:**
- Produces: `initHeroEngine(canvas: HTMLCanvasElement, getProgress: () => number): { destroy: () => void }` — sets up DPR-capped 2D context, owns the requestAnimationFrame loop, reads scroll progress via `getProgress`, and returns a teardown that cancels the RAF and removes any listeners it added.

- [ ] **Step 1: Define expected result** — A framework-free module holding the prototype's draw code (node/edge geometry, paper world, live world, scan-line clip split, packets, glow), driven by an injected `getProgress` callback instead of reading `window.scrollY` directly. Behavior identical to the prototype at equivalent scroll positions.

- [ ] **Step 2: Port the engine** — Copy the `<script>` body from `docs/design/hero-prototype-2026-07-14.html` into `heroEngine.ts`. Refactor only these seams:
  - Wrap everything in `export function initHeroEngine(canvas, getProgress)`.
  - Replace direct scroll reads with `const p = getProgress()` inside the render loop (the prototype computes a 0..1 hero-track progress; expose that as the injected value).
  - Cap DPR at 2 (already in prototype: `const DPR = Math.min(2, window.devicePixelRatio || 1)`).
  - Keep the lerp smoothing constant (`0.08`) and all geometry/color constants unchanged.
  - Return `{ destroy }` that cancels the RAF handle and removes the resize listener.
  - Do not transcribe the code into this plan; the prototype file is the verbatim source. Match it exactly, changing only the seams above.

- [ ] **Step 3: Verify** — `npm run build && npm run lint` (types compile; module is not yet mounted). Lint may flag `any` on the 2D context; type the context as `CanvasRenderingContext2D`.
- [ ] **Step 4: Commit** — `git add components/hero/heroEngine.ts && git commit -m "feat: hero canvas engine ported from approved prototype"`

---

### Task 19: Hero client component (desktop scroll choreography)

**Files:**
- Create: `components/HeroInstrument.tsx`

**Interfaces:**
- Consumes: `initHeroEngine` from Task 18.
- Produces: `HeroInstrument` default export, a `'use client'` component rendering the 280vh hero track, the sticky canvas stage, the paper/live copy clusters, and the spec-bar readout, matching the prototype's DOM (`#stage > #cv`, `#hero > .viewport > .cluster-wrap > .cluster.paper-c / .cluster.live-c`, `.specbar`).

- [ ] **Step 1: Define expected result** — On desktop, the component reproduces the prototype: a 280vh scroll track, a sticky canvas, copy that crossfades paper→live, and a body-class restyle ink→glass. It mounts the engine in `useEffect`, feeds it scroll progress via a ref, and tears down on unmount.

- [ ] **Step 2: Write the component** — `'use client'`. Structure:
  ```tsx
  'use client';
  import { useEffect, useRef } from 'react';
  import { initHeroEngine } from './hero/heroEngine';

  export default function HeroInstrument() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const track = trackRef.current;
      if (!canvas || !track) return;

      const onScroll = () => {
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        progressRef.current = Math.min(1, Math.max(0, -rect.top / total));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      const engine = initHeroEngine(canvas, () => progressRef.current);
      return () => {
        window.removeEventListener('scroll', onScroll);
        engine.destroy();
      };
    }, []);

    return (
      <div ref={trackRef} className="hero-track" style={{ height: '280vh' }}>
        <div className="hero-sticky">
          {/* port DOM from prototype: #stage > canvas, #hero viewport, clusters, specbar */}
          <canvas ref={canvasRef} className="hero-canvas" />
          {/* paper cluster + live cluster with the approved copy (see Task 21) */}
        </div>
      </div>
    );
  }
  ```
  Port the prototype's exact DOM for the clusters and spec-bar into the sticky container. Move the prototype's inline `<style>` into `app/globals.css` under `.hero-track`/`.hero-sticky`/`.hero-canvas` scoped selectors in Task 22 (styles referenced here resolve once Task 22 lands; the component still builds without them).

- [ ] **Step 3: Verify** — `npm run build && npm run lint`. Not yet mounted on the homepage, so no visual check yet.
- [ ] **Step 4: Commit** — `git add components/HeroInstrument.tsx && git commit -m "feat: hero client component with scroll choreography"`

---

### Task 20: Mobile and reduced-motion static path

**Files:**
- Modify: `components/HeroInstrument.tsx`

- [ ] **Step 1: Define expected result** — Per spec §Mobile and §Reduced motion: on viewport `< 768px` or `prefers-reduced-motion: reduce`, render the static split-state (scan line at 50%, both worlds visible, no packets, no scroll choreography) instead of the 280vh track. This reuses the reduced-motion branch, the cheapest robust option.

- [ ] **Step 2: Add the branch** — In the component, detect on mount:
  ```tsx
  const [isStatic, setIsStatic] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');
    setIsStatic(mq.matches);
    const onChange = () => setIsStatic(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  ```
  When `isStatic`, render a non-scrolling single-viewport version: mount the engine with a fixed `getProgress` of `0.5` (static split), skip the 280vh track height, and render both copy clusters stacked. Guard the scroll `useEffect` so it only runs when `!isStatic`.

- [ ] **Step 3: Verify** — build, lint. Browser pass deferred to Task 22 (needs styles + mount). Confirm no runtime errors when `matchMedia` matches.
- [ ] **Step 4: Commit** — `git add components/HeroInstrument.tsx && git commit -m "feat: hero static path for mobile and reduced motion"`

---

### Task 21: Wire approved hero copy

**Files:**
- Modify: `components/HeroInstrument.tsx`

- [ ] **Step 1: Define expected result** — The exact approved copy from spec §Homepage rework item 1 is in the component, verbatim (the animation tells the story, the text states the offer).

- [ ] **Step 2: Set the copy** — Paper cluster:
  - micro: "Caleb Bolden · Vora Technologies · sheet 1 / the map"
  - H1: "**AI agents** that answer your calls, chase your leads, and clear your paperwork" (the `AI agents` span at weight 750 per the prototype's strong-span treatment)
  - sub: "I'm Caleb Bolden. I find where your business loses time, then build AI to take that work over. Every engagement starts with this map: a fixed-scope audit of how your business actually runs."
  - CTAs: "Analyze my business" (primary, dispatches `open-chat` event like `components/Hero.tsx:11-13`) + "See my work" (→ `/work`).

  Live cluster:
  - micro: "sheet 2 / live system · same map, same boxes"
  - H1: "This is one of my systems, **running right now**"
  - sub: "A voice agent answering, a docs agent filing, a campaign agent sending. I build and run these for my own companies first, then for yours. The counter is real work."
  - CTAs: same two.

  Use the existing `open-chat` dispatch for the primary CTA and `next/link` `Link` to `/work` for "See my work". No em dashes (the middots and copy above are already humanizer-clean).

- [ ] **Step 3: Verify** — build, lint.
- [ ] **Step 4: Commit** — `git add components/HeroInstrument.tsx && git commit -m "feat: approved hero copy, both stages"`

---

### Task 22: Hero styles, swap into homepage, full browser verification

**Files:**
- Modify: `app/globals.css` (add scoped hero styles + dark-instrument palette), `app/page.tsx` (swap `Hero` → `HeroInstrument`).

- [ ] **Step 1: Define expected result** — The hero renders on `/`, replacing the old `components/Hero.tsx`. Dark instrument surface (`#05070c`, steel-blue/cyan glow, glass CTAs) is scoped to the hero only; the rest of the page stays light. The funnel below (`PainSolution` onward) is unchanged.

- [ ] **Step 2: Port styles** — Move the prototype's inline `<style>` rules into `app/globals.css`, scoped under `.hero-track`, `.hero-sticky`, `.hero-canvas`, `.cluster`, `.specbar`, `.micro`, `.ctas`, and the ink→glass body class the prototype toggles. Add the approved dark-instrument palette as scoped custom properties on `.hero-sticky` (do not touch the global `:root` light tokens). Keep the extralight Archivo treatment (weight 200, gradient reveal, boot cascade) and glass pill CTAs from the prototype. Reference spec §Design system: this is the one approved dark extension.

- [ ] **Step 3: Swap into homepage** — In `app/page.tsx`, replace `import Hero from '@/components/Hero';` with `import HeroInstrument from '@/components/HeroInstrument';` and `<Hero />` with `<HeroInstrument />`. Leave `components/Hero.tsx` in the tree for now (remove in a follow-up once the new hero is confirmed in production).

- [ ] **Step 4: Full browser verification** (the payoff task, run the full workflow):
  - `npm run build && npm run lint` pass.
  - Preview via the dev server. On desktop width: scroll the 280vh track and confirm the three stages (paper → scan sweep → live system), copy crossfade, packets, and DONE counter behave like the prototype. Check the console for errors.
  - Resize to 375px: confirm the static split-state renders, no horizontal scroll, copy readable.
  - Toggle `prefers-reduced-motion`: confirm static split-state, no animation.
  - Confirm the funnel below the hero (PainSolution, Process, AISystems, Packages, Proof, NowStrip, Industries, CTA) is intact and the page background returns to light immediately below the hero.
  - Confirm both hero CTAs work: "Analyze my business" opens the chat, "See my work" navigates to `/work`.
  - Screenshot desktop stage 1 and stage 3 for the record.

- [ ] **Step 5: Commit** — `git add app/globals.css app/page.tsx && git commit -m "feat: swap homepage to canvas hero (map becomes the machine)"`

---

## Final verification (before PR)

- [ ] `npm run build` passes clean (Next.js static build catches broken links and type errors).
- [ ] `npm run lint` passes.
- [ ] Manual pass: every new nav link and Proof row resolves (`/work`, `/work/vora`, `/work/chapterhq`, `/work/site-assistant`, `/work/open-source`, `/how-i-build`); detail pages render at 375px.
- [ ] Humanizer check on all new copy (no em dashes, sentence-case headings, no promo adjectives, named sources for any stat).
- [ ] `/sitemap.xml` includes blog posts and all new routes.
- [ ] Open one PR from `claude/website-changes-progress-499fc8` summarizing the six phases.

---

## Self-review notes (spec coverage)

Every spec section maps to a task: site map + detail template + open source (Tasks 1-6), notes band (Task 6), how-i-build (Task 7), about employer pivot (Tasks 8-9), blog metadata + sitemap + new posts (Tasks 10-12), nav (Task 13), AI-systems band (Task 14), PainSolution white-collar rows (Task 15), Proof links (Task 16), metadata (Task 17), homepage hero incl. mobile + reduced-motion + dark-instrument design-system extension (Tasks 18-22). Out-of-scope items (section reorder, new blog infra, pricing, analytics) are excluded. Two spec "decide at implementation" points are resolved here: mobile hero = static split-state (Task 20); stale Jan-2026 posts = leave dated for now, rewrite folded into optional Task 12 if Caleb wants.
