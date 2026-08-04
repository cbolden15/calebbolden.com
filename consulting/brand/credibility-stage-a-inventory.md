# Credibility inventory: Stage A (passes 1-2)

Date: 2026-08-04. Raw evidence only, no scoring, no ranked recommendations (Stage C's job). Audit surface derived from `app/sitemap.ts`. Pages fetched with `ctx_fetch_and_index` for text and read via source files where useful; visuals judged only from actual rendered screenshots (Playwright, desktop 1440x900 and mobile 390x844), never from markup alone.

## Methodology note: two screenshot artifacts, both worked around

Two rendering behaviors on this site make naive `fullPage` Playwright screenshots unreliable evidence for whitespace or density judgments, and both were discovered and solved during this pass:

1. **The homepage hero is genuinely scroll-jacked.** `components/HeroInstrument.tsx` pins a 280vh canvas animation to scroll position. A `fullPage` stitch does not represent this correctly and produces a large apparent blank gap that is not real. Fixed by scrolling to specific positions manually and taking viewport-only screenshots of the homepage instead.
2. **Nearly every other page uses `components/Reveal.tsx`**, an IntersectionObserver fade-in wrapper that does not fire during an automated `fullPage` capture. Content exists in the DOM but renders as false blank space. Fixed by priming every page before capture: scroll the full `scrollHeight` in 400px steps with ~30ms pauses, then return to top, which triggers every observer once. This was applied before all 24 desktop and 3 mobile captures in this pass and produced no false blanks anywhere, on either viewport.

Any prior read of this site's screenshots that skipped this priming step will overstate whitespace and understate content density. Flagging this for Stage C since it changes how "wall of prose vs. clean drafting sheet" should be judged.

## The proof gap (bounding constraint, stated once)

Every credibility exhibit on this site is self-built: Vora, ChapterHQ, Real Estate Maite, Agent Team, and this site's own chat assistant are all Caleb's own products, and the one case study on `/results` is explicitly labeled "my own operation, not a client." There are no third-party client names, logos, or testimonials anywhere in the sitemap-derived surface. This is not a defect the copy can fix; the site's own commit history (see below) treats it as unsolvable without a first real client result. Every page below is implicitly capped by this constraint for the "third-party surface" checklist item, so it is stated once here rather than repeated 21 times. Pages are marked "capped by proof gap" only where something additional and page-specific is worth noting.

A second, closely related fact worth stating once: `consulting/brand/brand-context.md` names four stats as "always named" sales proof (Gartner 30% GenAI abandonment, BCG 74% can't show tangible value, S&P Global 17%→42% abandonment jump, external-specialist ~67% vs ~1/3 success rate). A repo-wide grep (`Gartner|BCG|S&P Global|74%|30%|17%|42%|67%` across `app/` and `components/`) returns zero matches. None of the four canonical stats brand-context.md specifies actually appear anywhere on the live site. This is a real, verified gap between the brand document's intent and the shipped site, not a rendering artifact.

## Prior fixes already shipped (commit c6e2698, 2026-08-03, same day as this audit)

Before recording raw findings, one grounding fact: `consulting/brand/tone-perception-assessment.md` (read in full as required context) proposed five ranked fixes from an earlier blind-read pass. Commit `c6e2698` ("feat(site): close the perception gaps from the tone assessment") shipped same-day and, cross-checked against every rendered page in this pass, has visibly landed:

- **Fix #2 (unpublished price pattern-matched to a burned-by-an-agency reader):** shipped. "Audits start at $750, fixed scope" now appears on `/results`, `/how-i-build`, `/work`, and the homepage packages section, replacing the old "you'll know the cost after a call" line.
- **Fix #3 (Owners/Operators nav mismatch: clicking expected a pitch, got a newsletter):** shipped. Footer nav now labels the links explicitly: "The Missed Call · newsletter for owners" and "The Workflow Brief · newsletter for operators." Confirmed in `components/Footer.tsx` and on every footer screenshot taken this pass.
- **Fix #5 (blueprint footer jargon "sht 1 / rev b," "scale: none"):** shipped. `components/Footer.tsx` now renders a plain title-block (drawn by / based in / the work / start with / email) with no drafting jargon anywhere. Confirmed on every page footer screenshotted this pass, desktop and mobile.
- **Fix #4 (no picture of the work):** partially addressed. `/work` now has a five-step "One missed call, start to finish" text walkthrough (Tue 6:40pm through Wed 7:10am). This answers "what does it look like" in prose but is still not a screenshot, demo video, or interface walkthrough — the operator persona's original ask (see tone-perception-assessment.md) is not fully closed.
- **Fix #1 (the proof gap):** explicitly not closed. The commit message itself says "not solvable with copy; requires a first client result." The `/results` page now handles it honestly (labeled "my own operation, not a client," a "measure before publishing" sticky note over unfinished metrics) rather than hiding it, which is a tone improvement but not a resolution of the underlying gap.

This means Stage C should not re-recommend fixes 2, 3, or 5 as new work, and should treat fix 4 as partially done and fix 1 as the standing, load-bearing gap.

---

## Pass 1: per-page authority-signal findings

Checklist per page: identity/face, verifiable specifics, third-party surface, proof-of-work media, recency signals, depth markers.

### Home (`/`)

- **Identity/face:** no photograph of Caleb anywhere on the page. Text identity only: "CALEB BOLDEN · VORA TECHNOLOGIES · SHEET 1 / THE MAP" mono label above the h1.
- **Verifiable specifics:** the process-box diagram names concrete failure states ("call comes in," "front desk sorts," "phone tag," "paperwork pile," "marketing? later," "invoice sent") rather than abstractions. The waste-log accordion (`components/PainSolution.tsx`) has nine real-business pain rows, each with a specific scenario ("You're with a client, three calls go unanswered. One was a $3K lead who booked with a competitor by lunch").
- **Third-party surface:** none beyond the capped default. "Vora · live," "ChapterHQ · live" badges are self-referential.
- **Proof-of-work media:** the SVG process-box diagram in the hero is the one genuinely distinctive visual asset on the entire site (blueprint-style boxes and connectors, on-brand). No screenshots of any actual product interface.
- **Recency signals:** none on this page specifically (no dates).
- **Depth markers:** "Three ways to work with me" (Process, Build sprint, Fractional operator) and a five-phase method summary (Discover, Map, Prioritize, Pilot, Scale) show real methodology depth, not just a service list.

### `/services/web-development`

- **Identity/face:** none.
- **Verifiable specifics:** "Pages that load in under two seconds on a phone." "This site, Vora, and ChapterHQ are all my builds, running in production. The assistant in the corner is not a mockup." That last line is a genuinely checkable claim (a visitor can open the assistant and test it themselves) rather than an assertion.
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none. Pure hairline-divided text/table page, zero imagery.
- **Recency signals:** none.
- **Depth markers:** "How it fits the method" band ties this service back to the audit-first methodology rather than presenting it as a standalone SKU.

### `/services/seo`

- **Identity/face:** none.
- **Verifiable specifics:** "I run this playbook on my own products and this site. You can check the work: search for it." Same self-verifiable pattern as web-development.
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none. Same clean text/table template, zero imagery.
- **Recency signals:** none.
- **Depth markers:** "The audit maps how customers find you today: search, referrals, reviews, word of mouth" ties SEO to the same map-first method.

### `/services/marketing`

- **Identity/face:** none.
- **Verifiable specifics:** "I built Vora, a CRM platform that runs exactly this machinery for service businesses. Yours gets the same engine." Names the actual product doing the claimed work.
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none, same template.
- **Recency signals:** none.
- **Depth markers:** "Marketing gets built where leads leak, which is almost never where the ad budget goes" is a specific, opinionated methodology claim, not generic marketing copy.

### `/resources`

- **Identity/face:** none.
- **Verifiable specifics:** each of the five tools/checklists has a concrete, testable description ("An 18-question scored self-assessment. Ten minutes, plain language"; "Five numbers most owners never calculate: missed calls, slow quotes, no-shows, unanswered reviews, unused software. Live math, your figures").
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none, but the tools themselves are functionally proof-of-work: two are fully interactive (scorecard, calculator), not just described.
- **Recency signals:** none.
- **Depth markers:** "Everything here is the real first mile of my paid work, free" frames the free tools as literal excerpts of the paid methodology, which is a specific and checkable claim (a client can compare).

### `/owners`

- **Identity/face:** none.
- **Verifiable specifics:** "A customer calls at 6:40 on a Tuesday because their water heater just went out." Names the exact trades served: "HVAC, plumbing, electrical."
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none, pure text.
- **Recency signals:** "FREE · WEEKLY · UNSUBSCRIBE ANYTIME" signals an ongoing cadence but no dated issue archive is visible on this page.
- **Depth markers:** describes the actual editorial content ("the missed-call math for a shop that finally ran the numbers, what an audit turned up when we counted answered calls against booked jobs") rather than a generic "subscribe for updates" pitch.
- **Minor consistency note:** this page calls the recurring session "The monthly clinic" ("Every other month I run a free 45-minute clinic..."); `/operators` calls the same recurring thing "The even-month clinic." Same substance, different label. Worth a single-word fix, not a credibility issue.

### `/operators`

- **Identity/face:** none.
- **Verifiable specifics:** "About half the issues ship with the template, so you can build it yourself before we ever talk" is a specific, falsifiable claim about the newsletter's actual content ratio.
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none, pure text.
- **Recency signals:** same cadence framing as `/owners`, no dated archive.
- **Depth markers:** "On even months I run a free 45-minute clinic and automate one real workflow live, start to finish. No slides, no pitch until the last five minutes" is a specific, verifiable-by-attending format description.

### `/tools/ai-readiness`

- **Identity/face:** none.
- **Verifiable specifics:** 18 real diagnostic questions across 5 named categories (data and systems, process documentation, repetition and volume, team and buy-in, budget and focus), fully interactive with a live "0 of 18 answered" counter.
- **Third-party surface:** one named external statistic: "76% of small businesses now use AI in some form, but only 14% have it working inside their actual operations (Goldman Sachs 10,000 Small Businesses survey, 2026)." Named source, dated. This is the strongest third-party-surface signal on the entire site even though it isn't a client reference.
- **Proof-of-work media:** the tool itself is the proof; fully functional in-browser.
- **Recency signals:** "2026" dated source.
- **Depth markers:** five-dimension diagnostic structure shows real domain modeling, not a generic quiz.

### `/tools/revenue-leak`

- **Identity/face:** none.
- **Verifiable specifics:** five distinct, separately-sourced leak calculations.
- **Third-party surface:** the most heavily sourced page on the site. Named, dated sources for every leak: PCN Missed Call Revenue Study (2026, 38% of inbound calls answered live across 85 businesses); Sesame Communications (5-year, 1.6 million appointments, 64 practices, 23% no-show reduction) plus a PMC-indexed orthodontic study (1,193 appointments, 1.9% no-show rate with SMS); BrightLocal 2024 (98% stat) and Whitespark 2026; Zylo's 2025 SaaS Management Index (21% completely unused, 45% underutilized software).
- **Proof-of-work media:** the calculator itself, fully interactive, live math against the visitor's own numbers.
- **Recency signals:** 2024, 2025, and 2026 dated sources mixed, all recent.
- **Depth markers:** this is the single best-evidenced page on the site for the "verifiable specifics" and "third-party surface" checklist items, precisely because every claim is sourced to someone other than Caleb, even though none of the sources are Caleb's own clients.

### `/about`

- **Identity/face:** no photograph, on the one page where a headshot would most plausibly appear. Confirmed via full-page screenshot.
- **Verifiable specifics:** named employers in sequence: US Bank, Elavon, TSYS, then Blockdaemon (crypto infrastructure PM). A skills table ties each stated skill (AI/Agents, Process, Full stack, Infra) to a shipped thing rather than leaving it as a bare claim.
- **Third-party surface:** the named employers are the closest thing to third-party surface on the site (verifiable via LinkedIn), but they are employment history, not client or partner references for the consulting business itself.
- **Proof-of-work media:** none. No photo, no screenshots, no video.
- **Recency signals:** none dated explicitly, but the employer sequence implies a career timeline.
- **Depth markers:** "The method" section links out to the five-phase process; "The products" section lists Vora, ChapterHQ, Real Estate Maite, Agent Team, and this site's own assistant as shipped work.

### `/contact`

- **Identity/face:** none.
- **Verifiable specifics:** two clearly differentiated contact routes (assistant vs. direct email), a real email address (caleb@calebbolden.com).
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none.
- **Recency signals:** none.
- **Depth markers:** none beyond routing; this is a low-depth utility page by design.
- **Notable absence:** no phone number anywhere on the page, which is a mild inconsistency for a business whose core pitch is "we answer the phone."

### `/results`

- **Identity/face:** none.
- **Verifiable specifics:** the most detailed process narrative on the site (three-businesses-one-person framing, the specific sequence of what got built and in what order, and why).
- **Third-party surface:** explicitly and honestly none. "CASE 001 · MY OWN BACK OFFICE" is tagged "my own operation, not a client" in the UI itself, and the copy states directly: "Today there is one entry and it is mine... it is marked as my own operation rather than dressed up as a client."
- **Proof-of-work media:** none (no screenshots of the actual systems described).
- **Recency signals:** "Measuring now" language on all three number rows (calls, documents, build queue) signals an active, ongoing measurement process rather than static/stale figures, though no figures are published yet.
- **Depth markers:** this is the deepest self-honesty on the site. "I am instrumenting each of these out of the live system before I publish a figure, so the placeholders below stay visible until the real measurement exists," plus the amber sticky note "measure before publishing" and "I ask clients for numbers they can defend. Putting an unsourced one on my own page would make that a harder ask." This page states the proof gap out loud rather than hiding it, which is the single strongest piece of honesty-signaling found anywhere in this pass, even though it does not resolve the gap itself.

### `/work`

- **Identity/face:** none.
- **Verifiable specifics:** a five-step, timestamped walkthrough of a single missed-call scenario (Tue 6:40pm caller unanswered, 6:40pm+seconds text-back, 6:43pm scheduling reply, 6:44pm job on the schedule, Wed 7:10am morning list) — the most granular, checkable process description on the site.
- **Third-party surface:** explicitly, honestly absent, and named as such: "there is nothing on this page yet with someone else's name and numbers on it. When there is, it goes here." Same honesty pattern as `/results`.
- **Proof-of-work media:** none (text description of the missed-call flow, no screen capture of it happening).
- **Recency signals:** the "NOTES" teaser section shows three blog post dates (two July 6, 2026 and one January 15, 2026) but under-lists the fourth, older post (January 10, 2026), which does not appear in this teaser at all even though it exists on `/blog`.
- **Depth markers:** three "LIVE" product entries (Vora, ChapterHQ, Site assistant) each with a one-line description of what they actually do.

### `/work/vora`

- **Identity/face:** none.
- **Verifiable specifics:** a genuine technical stack breakdown across five categories (Dashboard: SvelteKit + Postgres; Agents: MCP server; Messaging: Twilio + Resend + SendGrid; Billing: Stripe; Infra: Docker + Caddy + Hetzner), plus an outbound "Visit Vora" link a visitor can actually click through to a live, separate product.
- **Third-party surface:** none named (capped), but the outbound link to a genuinely separate, live production product is a stronger proof-of-work signal than a description alone.
- **Proof-of-work media:** none on this page itself (no screenshot of Vora's UI), but the outbound link functions as a proxy for it.
- **Recency signals:** "LIVE" tag.
- **Depth markers:** the stack table is specific enough to be falsifiable by a technical referral partner.

### `/work/chapterhq`

- **Identity/face:** none.
- **Verifiable specifics:** same stack-table template (App: Next.js + Postgres + pgvector; Data: Drizzle migrations + vector embeddings; Realtime: Pusher; Billing: Stripe; Infra: Docker + Caddy + Hetzner), outbound "Visit ChapterHQ" link.
- **Third-party surface:** none named (capped); same outbound-link proxy as Vora.
- **Proof-of-work media:** none on-page; outbound link only.
- **Recency signals:** "LIVE" tag.
- **Depth markers:** specific, technical, falsifiable stack claims.

### `/work/site-assistant`

- **Identity/face:** none.
- **Verifiable specifics:** three-row stack table (Model: Gemini via the Vercel AI SDK; Tools: Zod-typed tool definitions in `lib/chat`; UI: React streaming chat + Next.js route handler).
- **Third-party surface:** none named (capped).
- **Proof-of-work media:** none as a screenshot, but this is the one product on the whole site a visitor can test live, in place, without leaving the page (the chat assistant in the corner of every page). Functionally the strongest proof-of-work signal on the site.
- **Recency signals:** none dated.
- **Depth markers:** technical specificity matches the Vora/ChapterHQ pages.

### `/work/open-source`

- **Identity/face:** none.
- **Verifiable specifics:** five named GitHub repos, each with a one-line technical description and a "View on GitHub" link (life-agent-mcp: "An MCP server exposing 38 Claude-ready tools over a FastMCP proxy pattern"; plus youtube-transcript-workflow, claude-code-config-manager, cli-printing-press, canton-traffic-calculator).
- **Third-party surface:** GitHub itself functions as a genuine, independently-checkable third party here: a visitor can click through and see real commit history, stars, and code, which is a materially different credibility signal from the self-hosted product pages.
- **Proof-of-work media:** none on-page, but again the outbound links are themselves verifiable proof.
- **Recency signals:** none dated on this page (would need to click through to GitHub for commit recency).
- **Depth markers:** "38 Claude-ready tools over a FastMCP proxy pattern" is technical enough to be a real depth signal to a technical referral partner.

### `/how-i-build`

- **Identity/face:** none.
- **Verifiable specifics:** "My stack in practice" four-cell grid (primary env: Claude Code; parallelism: agent teams; model routing: right model per task; autonomous loops: overnight jobs reviewed each morning).
- **Third-party surface:** none (capped).
- **Proof-of-work media:** none.
- **Recency signals:** none.
- **Depth markers:** "I do not recommend AI I have not run myself... When something breaks, I have usually already hit that failure and fixed it" is a specific, first-person credibility claim tied directly to the stack description above it, not a generic "we practice what we preach" line.

### `/blog` (index)

- **Identity/face:** none.
- **Verifiable specifics:** four real posts listed with titles, tags, and dates, newest-first: "You can't automate a process you don't understand" (PROCESS, July 6, 2026), "Where AI pays in a small service business (and where it doesn't)" (AI, July 6, 2026), "The State of AI Agents in 2026" (AI TRENDS, January 15, 2026), "Beyond RPA: Next-Gen Workflows" (AUTOMATION, January 10, 2026).
- **Third-party surface:** none on the index itself.
- **Proof-of-work media:** none.
- **Recency signals:** dated posts, most recent within the current month.
- **Depth markers:** four posts across roughly seven months (January to July 2026) is a real but thin publishing cadence, not a dead blog and not a heavily active one either.

### `/blog/map-before-you-automate` (newest, confirmed via `browser_find`, July 6, 2026)

- **Identity/face:** none.
- **Verifiable specifics:** long-form (~1,600 words), well-structured argument with named h2 sections (why this keeps happening, what a value stream map actually is, the wait is the problem not the paperwork, what mapping looks like in practice).
- **Third-party surface:** one strong named source: "RAND interviewed 65 AI experts in 2024 and asked them why AI projects fail. The top root cause, named by 84% of the people they talked to... was leadership miscommunicating the problem to solve." Named, dated, specific sample size.
- **Proof-of-work media:** none. Zero diagrams or illustrations despite the post explaining a visually-explainable concept (steps, waits, rework loops) in dense prose.
- **Recency signals:** July 6, 2026, the most recent post on the site.
- **Depth markers:** tag footer #PROCESS MAPPING #AI #SMALL BUSINESS; this is the most rigorously sourced and most distinctively-voiced piece of long-form content on the site.

### `/blog/beyond-rpa` (oldest, confirmed via `browser_find`, January 10, 2026)

- **Identity/face:** none.
- **Verifiable specifics:** shorter, listicle-style structure (The RPA Problem / Intelligent Automation / Real Example: Lead Enrichment / The Shift / What to Do).
- **Third-party surface:** names real tools (n8n, Make, Zapier, OpenAI, Anthropic, Google) but these are product mentions, not sources for the post's actual statistical claim.
- **Proof-of-work media:** none.
- **Recency signals:** January 10, 2026, the oldest post on the site.
- **Depth markers:** weaker than the newest post on every dimension. Two specific issues worth flagging plainly:
  1. **Unsourced statistic.** "Companies that invested millions in RPA are finding 40-60% of bots break within months, requiring constant maintenance from expensive specialists" has no named source anywhere on the page. This is the one piece of content found anywhere on the site that violates the humanizer voice rule in `brand-context.md`: "every statistic gets a named source." Every other statistic found across the whole audit surface (ai-readiness, revenue-leak, map-before-you-automate) names its source; this one does not.
  2. **Generic structure and duplicated title.** The prose reads as more generic listicle/marketing-boilerplate voice than the rest of the site ("RPA Approach: / Problems: / Intelligent Approach: / Results:" headers), and the title "Beyond RPA: Next-Gen Workflows" is duplicated as both the h1 and the first line of body text, a minor formatting artifact not seen elsewhere.

---

## Pass 2: visual audit

### Whitespace and density judgment, page by page (from primed, correctly-rendered screenshots)

The sitewide pattern, confirmed across all 21 assessed pages at desktop 1440x900 and re-confirmed at mobile 390x844 for home, `/results`, and `/work`: this is a **clean drafting sheet, not a wall of prose**, on every page. Content is consistently hairline-divided into short rows and sections, body copy stays within the design system's stated 70ch measure, and mono annotation labels (`anno anno-blue`) break up sections visually even without imagery. No page in the audit surface reads as a dense, undifferentiated text block. The home page's hero and process-box diagram is the one page with genuine illustrative structure; every other page in the sitemap uses the same clean but visually flat template: h1, one-line subhead, then hairline-divided rows of text or a simple table, repeating down the page, ending in a bordered "Start with the audit" CTA box.

This flatness is the real visual finding, not density. The site never feels cluttered or overwhelming. It also never shows anything. Outside the homepage's process diagram, there is not one illustration, screenshot, photo, chart, or diagram anywhere in the 21-page audit surface. Every "what you get" table, every stack breakdown, every case-study anatomy is communicated in text and hairline-divided rows, never visually.

Mobile confirms the same pattern holds at 390px: the home page's above-the-fold hero (h1, subhead, two CTAs, then the process-box diagram) renders cleanly with no layout breakage; `/results` and `/work` both reflow their hairline-divided sections and tables into single-column stacks without truncation, overlap, or false blanks.

### Visual opportunities, tagged by asset pipeline with safety rails

1. **Sitewide: sub-pages have zero illustrative visuals (code-only, sitewide candidate).** Every page except the homepage (services x3, resources, owners, operators, both tools, about, contact, results, work + 4 sub-pages, how-i-build, blog index, both sampled posts) uses text/table only. The homepage already has a working SVG process-box diagram in the same visual vocabulary (blueprint boxes, blue strokes, mono captions per `DESIGN.md`'s "process boxes" identity device) that could extend to other pages' "what you get" or "the stack" tables.
   - Pipeline: **code-only**. Safety rails: decorative SVG marked `aria-hidden="true"` if purely illustrative, or given real `alt`/label text if it encodes information the table doesn't already state; inline SVG (no external image request) keeps weight near zero; static by default with motion (stroke-draw) gated behind `prefers-reduced-motion: no-preference`, matching the existing hero pattern; positioned mid-page, never as an LCP element, so it cannot affect largest-contentful-paint on first load.

2. **`/blog/map-before-you-automate`: value-stream-map concept has zero diagram (code-only candidate).** The post explains steps, waits, and rework loops in dense, well-organized prose but never shows one, despite this being a visually native concept and despite the homepage already having exactly this kind of diagram in its own vocabulary.
   - Pipeline: **code-only**. Safety rails: inline SVG process-box diagram matching the homepage's existing vocabulary (not a new visual language); `alt`/surrounding caption text describing the diagram's content for screen readers, since here the diagram would carry real information (which step is the wait, which is the rework loop), not decoration; static render with `stroke-dashoffset` draw-in gated behind `prefers-reduced-motion`; placed below the fold, mid-article, so no LCP impact.

3. **`/work/vora`, `/work/chapterhq`, `/work/site-assistant`: stack tables with no interface screenshot (real-capture candidate).** All three sub-pages describe real, live, running products in detail (stack tables, outbound links) but show nothing of what they look like. This is the one place on the site where the underlying "proof" already exists and is real (these are genuinely running products), so a screenshot would not be inventing anything, just showing what already exists.
   - Pipeline: **real-capture**. Safety rails: actual screenshot of each product's real UI (not a mockup or stock image); descriptive `alt` text stating what's shown ("Vora dashboard showing the missed-call agent's conversation log," not "screenshot"); compressed to a defined weight budget (target under 150KB per image, WebP/AVIF) since these are content images, not decoration; no autoplay video even if a walkthrough clip is later considered, and any video version must sit below the fold, never as the page's LCP element; positioned after the stack table, not replacing it.

4. **`/work`: the missed-call walkthrough is text-only despite being the site's best "what does it look like" candidate (real-capture or code-only candidate, tone-perception fix #4 still open).** The five-step timestamped walkthrough (Tue 6:40pm through Wed 7:10am) is the most granular process description on the site and the exact content the operator persona in `tone-perception-assessment.md` asked to see as a screenshot or demo, but it remains pure prose. Commit c6e2698 addressed this fix only partially.
   - Pipeline: **real-capture** (an actual screenshot of the text-back conversation and scheduling confirmation, since this is Caleb's own real system, not staged) is the stronger option; **code-only** (a timeline/diagram in the existing process-box vocabulary) is the faster, lower-risk fallback if a real capture isn't ready. Safety rails: if real-capture, redact/synthesize any personally identifying customer data before publishing; `alt` text describing the interaction shown; weight budget under 150KB; no autoplay; positioned inline with the existing timestamp list, not replacing it, so the page still works if the image fails to load.

5. **Homepage hero diagram: confirmed working positive example, not a gap.** The SVG process-box diagram (`call comes in → front desk sorts → phone tag/paperwork pile/marketing? later → sticky notes → invoice sent`) already follows the design system's process-box identity device correctly, renders cleanly on both desktop and mobile, sits below the primary CTA buttons (not competing with them for attention), and involves no autoplaying video. This is the one asset on the site Stage C should point to as the template for what "more of this" should look like, not treat as something to fix.

**No mobbin-pattern or higgsfield-image/video candidates were identified in this pass.** The site's existing visual vocabulary (process boxes, hairline dividers, mono annotations) is distinctive enough that inserting a generic UI-pattern reference or a generated stock-style image would work against the "the working wall" identity described in `DESIGN.md` and `brand-context.md`, not for it. Every opportunity found above is better served by extending the site's own existing SVG vocabulary (code-only) or showing the real, already-running products (real-capture).

---

## Assessed / not-assessed ledger

21 of 24 sitemap URLs assessed. 3 not assessed, none of them failures.

### Assessed (21)

`/`, `/services/web-development`, `/services/seo`, `/services/marketing`, `/resources`, `/owners`, `/operators`, `/tools/ai-readiness`, `/tools/revenue-leak`, `/about`, `/contact`, `/results`, `/work`, `/work/vora`, `/work/chapterhq`, `/work/site-assistant`, `/work/open-source`, `/how-i-build`, `/blog` (index), `/blog/map-before-you-automate` (newest sampled post), `/blog/beyond-rpa` (oldest sampled post).

### Not assessed (3), by design, not failure

- `/privacy`, `/terms` — deliberately excluded per the audit brief; legal boilerplate is out of scope for a credibility/visual assessment.
- `/blog/where-ai-pays-in-a-small-service-business` and `/blog/state-of-ai-agents-2026` (exact slugs not confirmed; the two mid-list posts on `/blog`, dated July 6 and January 15, 2026 respectively) — excluded per the blog sampling rule (index + newest + oldest only). Not characterized, scored, or assumed similar to the sampled posts; genuinely unassessed.

No page in the sitemap-derived surface was skipped due to a fetch failure, render failure, or any other blocker. Every exclusion above was a scope decision, not a NOT ASSESSED failure.
