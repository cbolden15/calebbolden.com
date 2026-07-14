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
| Homepage change size | Identity-led rework (option A, revised 2026-07-14): hero leads with who Caleb is, three doors under it |
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

## Homepage rework (identity-led, option A)

Revised 2026-07-14 after three-goal reframe. Hero leads with identity; consulting funnel keeps full depth one screen lower.

1. **Hero** — identity-led. Direction: "I build AI systems and the processes around them" (final wording at implementation; humanizer rules). Subline names the three facts: runs Vora Technologies, ships production AI products, consults on process-first AI. Under the subline, **three doors** (hairline panels or annotated links, working-wall style):
   - Hire me → `#packages` / consulting funnel below
   - See my work → `/work`
   - Read my thinking → `/blog`
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

Unchanged. Working wall: white, blueprint-blue, graph-paper fields, mono annotations, hairline dividers. New pages read like more sheets in the same drawing set. Utility contract in `app/globals.css`.

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
