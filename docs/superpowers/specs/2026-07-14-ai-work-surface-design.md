# AI work surface — design

**Date:** 2026-07-14
**Status:** Approved by Caleb (brainstorm session)

## Problem

calebbolden.com currently reads process/automation focused and serves one goal (consulting sales). Revised goal set (2026-07-14, Caleb): the site must accomplish three things **equally**:

1. **Thought leadership** — a body of writing and a visible point of view (the existing "map before you automate" argument is the signature thread).
2. **Advertise consulting services** — the existing audit-first funnel, elevated to mid-size firms + professional services.
3. **Employer-visible skillset** — a hiring manager or recruiter can see engineering depth: shipped systems, open source, career background, skills.

Assessment of current site against these: consulting 8/10, thought leadership 3/10 (blog buried, stale description mentioning blockchain, no POV surface), employer skillset 2/10 (no GitHub link, no career history, no skills inventory).

## Decisions made

| Question | Decision |
|---|---|
| Audience for AI emphasis | Broader audience (peers, partners, bigger clients) — not just SMB cred |
| Site purpose | Consulting stays primary; AI depth layered in |
| Content to show | Shipped products (incl. GitHub repos as shipped work), how-I-build story, systems/architecture depth, writing/teaching |
| Homepage change size | Narrative hero ("the map becomes the machine", supersedes three-doors option A) + elevated funnel |
| Added audience | Mid-size/established firms + professional services (law, accounting, agencies). Tech buyers served by /work + /how-i-build. Enterprise out. Employers served by about + /work + GitHub/LinkedIn, no "hire me" banner. |
| Site goals | Thought leadership + consulting + employer-visible skillset, weighted equally |
| Structure | Hub + detail pages (option B) |

## Site map

```
/work                      hub: intro + 3 bands (Systems, Open source, How I build teaser)
  /work/vora               detail: Vora platform
  /work/chapterhq          detail: ChapterHQ
  /work/site-assistant     detail: this site's chat agent
  /work/open-source        single page listing public GitHub repos with links
/how-i-build               how AI runs my own operation
```

- Notes/teaching lives in the existing blog (tagged posts); no new blog structure.
- Nav: add "Work" link (header + footer).
- Homepage Proof section rows link into `/work/*`.

### Open-source repos to feature (github.com/cbolden15)

- life-agent-mcp — MCP server, 38 Claude-ready tools, FastMCP proxy pattern
- youtube-transcript-workflow — map/reduce caption→notes pipeline, multi-backend
- claude-code-config-manager — config source-of-truth for Claude Code across machines
- cli-printing-press — AI-agent-first CLI generator
- canton-traffic-calculator — Canton Network cost estimator

## Detail page template

Shared structure for `/work/vora`, `/work/chapterhq`, `/work/site-assistant`:

1. What it is (plain language)
2. Who uses it
3. The AI inside — architecture in plain terms, plus one technical band (mono-annotated) for technical readers
4. Stack line
5. Status: live / building (real semantic state, matching Proof section convention)
6. Link out where public

## Homepage rework

Revised twice on 2026-07-14. The "identity-led three doors" hero (earlier revision) is **superseded** by the narrative hero below, designed through an iterative demo session with Caleb (8 prototype rounds). The three goals are now served by: consulting → hero CTA 1 + funnel below; work → hero CTA 2 (/work); writing → nav + /work notes band.

1. **Hero — "the map becomes the machine"** (approved prototype: `docs/design/hero-prototype-2026-07-14.html`, open in a browser and scroll):
   - **Stage 1 (paper)**: the existing working-wall world. White graph paper, ink process boxes with plain-language labels (call comes in, front desk sorts, phone tag, paperwork pile, marketing? later, invoice sent), red-pen pain annotations (waits 4 days, rework ×2 with loop arrow), one amber sticky ("automate this →"), mono column headers 01/INTAKE → 04/DONE.
   - **Stage 2 (scroll-driven sweep)**: a glowing scan line labeled AUDIT → BUILD sweeps left to right (scroll 12%–62% of a 280vh hero track). Behind it the page turns dark instrument and each drawn box rebuilds as a glass card **in the same position**: phone tag → VOICE AGENT, paperwork pile → DOCS AGENT, marketing? later → CAMPAIGN AGENT, sticky notes → MEMORY (dashed card). Copy crossfades; DOM chrome (spec pills, readout) restyles ink→glass via a body class.
   - **Stage 3 (live system)**: corporate pipeline running — orthogonal connectors with arrowheads, job packets with label chips (missed call, invoice #4118, dues run…), progress bars inside cards while processing, DONE card with amber counter, spec-bar readout mirroring it ("jobs completed · NNN", "the map is running itself"). Camera pushes in (~1.4x) on remaining scroll; paper-white funnel section slides over.
   - **Hero copy (final, approved)**:
     - Stage 1 micro: "Caleb Bolden · Vora Technologies · sheet 1 / the map"; H1: "**AI agents** that answer your calls, chase your leads, and clear your paperwork"; sub: "I'm Caleb Bolden. I find where your business loses time, then build AI to take that work over. Every engagement starts with this map: a fixed-scope audit of how your business actually runs."
     - Stage 2 micro: "sheet 2 / live system · same map, same boxes"; H1: "This is one of my systems, **running right now**"; sub: "A voice agent answering, a docs agent filing, a campaign agent sending. I build and run these for my own companies first, then for yours. The counter is real work."
     - Copy rule established in session: the animation tells the story; the text states the offer. Stage 1 sells, stage 2 proves.
   - CTAs both stages: "Analyze my business" (primary, opens chat/funnel) + "See my work" (→ /work).
   - **Type on dark**: extralight Archivo (weight 200, stretch 88%) with a left-to-right gradient reveal (white 25% → 75% → 100%); strong spans at weight 750. Boot-up entrance cascade (0/0.2/0.4/0.6/0.8–1.1s delay ladder). Glass pill CTAs (backdrop-blur, white/18 border, inset highlight).
   - **Tech**: single canvas 2D, no libraries, DPR capped at 2, both worlds share one node/edge geometry (clip-rect split at the scan line). Smoothed scroll (lerp 0.08). Provenance: synthesized from Caleb's design-prompt library (`automation-machines-spline-spec-hero` layout/type, `growth-marketing-saas-parallax` scroll constants, `cognitra` AI-motion concept, `futuristic-cinematic-shader` glow discipline with purple→steel-blue substitution).
   - **Reduced motion**: static split state (scan line at 50%, both worlds visible, no packets, no cascade).
   - **Mobile**: decide at implementation — recommended: vertical stack variant or static split-state image; the 280vh scroll choreography is desktop-only.
   - **Design-system evolution (approved)**: the dark instrument surface is promoted from chat-sidebar/CTA-band accent to hero stage 2. Steel-blue/cyan glow palette on near-black joins the system for "live system" contexts; amber stays the single warm accent in both worlds. Light working-wall remains the identity everywhere else.
2. **Consulting funnel below hero, intact** — PainSolution, Process, Packages, Proof, CTA all stay. Voice elevated from solo-owner SMB to "businesses with real operations."
3. **Pain rows (PainSolution)** — keep strongest SMB rows (missed calls, leads sitting, admin); add white-collar rows: document intake/processing, client onboarding, knowledge search (answers buried in old files). Same accordion pattern, mono tags.
4. **New AI-systems band** — short section (placement between Process and Packages, finalize at implementation): what I actually build — voice agents, knowledge assistants, workflow automation, campaign systems — mono system-category tags, linking into /work.
5. **Proof section** — rows that have a `/work/*` detail page link to it (others keep current behavior). Add one row: "Open source — tooling I publish on GitHub" → `/work/open-source`. Keep chat-assistant callout line.
6. **Nav** — "Work" link in header and footer. Blog stays in nav; confirm placement.
7. **Metadata** — title/description/keywords broaden beyond "small business" (e.g. "AI systems, process consulting, and writing").
8. **Industries line** — already lists professional services; verify copy reads firm-friendly.

## How-I-build page (`/how-i-build`)

The meta story: the operation itself runs on AI. Bands:

- Opening: consultant who dogfoods — recommendations come from systems run daily.
- **My stack in practice**: Claude Code as primary dev environment; agent teams/swarms for parallel work; multi-model routing (right model per task); autonomous loops that ship while I sleep. Plain language first, mono-annotated detail for technical readers.
- **What this means for clients**: velocity, plus the failure modes have already been hit and survived.
- Tone: no "10x" hype; concrete workflow descriptions. Humanizer rules throughout.

## Blog integration (added 2026-07-14)

Blog infrastructure already exists (`content/blog/` markdown, list + detail pages, 4 posts). No new infrastructure. Changes:

- **Notes band on /work hub** — fourth band pulling the 2-3 latest posts (title, date, excerpt), linking to /blog. Makes writing visible from the AI surface.
- **Sitemap** — add blog post URLs to `app/sitemap.ts` (known gap, pulled forward from backlog).
- **New posts (content work, can trail the build)** — 2-3 posts carrying the AI depth story, e.g.: how my operation runs on agent teams; what an MCP server is and why a business should care; anatomy of the voice agent in Vora. Humanizer rules; blog tone matches existing posts.
- Out of scope: RSS, tag filtering, category pages, related posts (revisit when post volume justifies).

## About page rewrite (employer pivot)

The about page carries the employer goal without a "hire me" banner (a visible for-hire signal would undercut consulting credibility with clients). Extend the current page:

- Keep "Builder first, consultant second" framing; put substance behind it.
- **Career background** — payments/fintech history (currently only in the meta description), what Caleb did before consulting.
- **Skills band** — mono-annotated inventory: AI/agent systems, MCP, process mapping (lean/six sigma), full-stack (Next.js/SvelteKit/Postgres), infra (Docker, self-hosted). Grounded in shipped work, not a keyword wall.
- **Links out** — GitHub (github.com/cbolden15) and LinkedIn, visible. Currently the site has no GitHub link anywhere.
- Braid two threads: process discipline (existing lean/six-sigma story) + builder credibility. Link to `/work` and `/how-i-build`.

## Thought leadership thread

- **Signature POV**: "you can't automate a process you don't understand" / map-before-you-automate is the argument the writing keeps returning to. Blog and /how-i-build reference it consistently.
- **Blog metadata fix** — current blog description says "AI automation, process improvement, and blockchain technology"; drop blockchain, align with positioning.
- **Stale posts** — the two Jan-2026 posts (State of AI Agents, Beyond RPA) read generic; rewrite, retire, or leave dated (decide at implementation, lean rewrite-or-retire).

## Design system

Working wall stays the base identity: white, blueprint-blue, graph-paper fields, mono annotations, hairline dividers. New pages read like more sheets in the same drawing set. Utility contract in `app/globals.css`.

One approved extension (from the hero session): a **dark instrument surface** — near-black `#05070c`, steel-blue/cyan glow, glass chrome — promoted from the chat-sidebar/CTA-band accent to a first-class stage for "live system" contexts (hero stage 2; potentially /work detail-page tech bands later). Amber remains the single warm accent in both worlds. DESIGN.md's "light only, locked" rule is amended to "light base, dark instrument stage where a live system is being shown."

## Reference artifacts

- `docs/design/hero-prototype-2026-07-14.html` — approved hero (open in browser, scroll). Source of truth for the hero's motion, timing, and copy.
- `docs/design/site-mockup-2026-07-14.html` — 7-sheet static mockup of /work hub, detail template, open source, how-i-build, homepage, about. Note: sheet 5's hero (three doors) and sheet 7 (motion concepts) are superseded by the hero prototype; other sheets remain the visual direction.

## Copy rules

All deliverable prose follows humanizer rules (per project CLAUDE.md): no em dashes, no buzzwords, sentence-case headings, named sources for statistics, no promo adjectives.

## Out of scope

- Homepage section reorder
- New blog infrastructure
- Pricing changes
- Design-system changes
- Analytics (separate backlog item; still precedes promotion)

## Testing / verification

- `npm run build` passes (Next.js static build catches broken links/types)
- Manual pass: every new nav link and Proof row resolves; detail pages render on mobile width
- Humanizer check on all new copy before commit
