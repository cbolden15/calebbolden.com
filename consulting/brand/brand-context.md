# Brand context brief

Single source of truth for brand deliverables in this directory. Distilled 2026-08-03 from
DESIGN.md, consulting/launch-roadmap.md, docs/redesign/brand-kit.md, and
docs/superpowers/specs/2026-08-03-founder-social-presence-design.md. If this file and those
disagree, those win; fix this file.

## Identity

- Brand: **Caleb Bolden**, personal. Site calebbolden.com. Wordmark is the text "CALEB BOLDEN"; there is no image logo.
- Legal: services provided by **Vora Technologies LLC**. Signed "Caleb Bolden, Principal, Vora Technologies LLC." The LLC appears in footers, contracts, and the LinkedIn experience section; never as the feed identity.
- Display name on all social surfaces: "Caleb Bolden". Handle convention `@calebbolden`, fallback `@calebboldenai` (availability unverified; founder checks at signup).

## What the business is

AI consulting for local small businesses, delivered in person, part-time capacity, industry-agnostic but ops-pain focused. The differentiator is lean/six-sigma process discipline: **map and fix the process first, then automate it**. Validated white space; no US firm found combining kaizen-event facilitation with AI-candidate identification.

Three packages (names/scope public; pricing policy updated 2026-08-03: the audit price is published on the site, "Audits start at $750, fixed scope", with a $500 founding-client rate for the first three clients; Build Sprint and Fractional prices are still quoted live from the map, never published):

1. **Process & AI Readiness Audit**: 2-3 weeks. VSM of 2-3 core workflows, data-readiness check, scored opportunity matrix, 90-day roadmap.
2. **Build Sprint**: 4-8 weeks. Implement the top 1-2 roadmap items with a defined success metric, training, 30-day tuning.
3. **Fractional AI Operator**: monthly, quarterly commitment. Monitor and iterate shipped automations, one improvement per month.

Method: Discover → Map → Prioritize → Pilot → Scale/Handoff (five phases, 8-12 weeks).

## Audiences

- **Owners**: local small-business owners (trades, salons, landscaping, garage doors; DFW local for Facebook). Scattered systems, repetitive admin, skeptical of AI hype. Reached via referral partners, chamber lunch-and-learns, short vertical video.
- **Operators**: ops leads at ~40-person companies. The consulting buyer's channel is LinkedIn.
- **Referral partners**: bookkeepers, CPAs, MSPs, business bankers. They see process pain first.

## Positioning and proof

- H1 voice: "I automate the work you shouldn't be doing." Anti-busywork, first person.
- Proof is work shown, not opinion content: Vora (production AI CRM across 11 service verticals with real billing), ChapterHQ, Real Estate Maite, the autonomous Agent Team. The site chatbot is a live demo (framing: "my site runs a live AI agent, try it").
- Sales stats, always named: Gartner predicted 30% of GenAI projects abandoned after proof of concept; BCG found 74% of companies can't show tangible AI value; S&P Global measured companies abandoning most AI initiatives jumping 17% → 42% in one year; external-specialist implementations succeed ~67% vs ~⅓ for internal builds. The MIT/NANDA "95% of pilots fail" stat is contested and not peer-reviewed; use the Gartner/BCG/S&P numbers instead.

## Voice

Confident, direct, plain. First person. Sounds like a process engineer explaining something at a whiteboard, not a marketer.

Hard rules (humanizer): no em dashes as connectors; no buzzwords ("seamless", "robust", "game-changing", "unlock", "supercharge", "leverage" as a verb); sentence-case headings; every statistic gets a named source; no "it's not just X, it's Y"; no rule-of-three padding; no signposting ("Let's dive in"); vary sentence length; concrete over abstract.

Words that fit: process, map, fix, automate, hours back, waste, bottleneck, pilot, working, shipped.
Words to avoid: journey, transform(ation), empower, cutting-edge, revolutionize, solutions (as a standalone noun), synergy, AI-powered (as decoration).

## Visual system: "the working wall"

The site looks like the thing Caleb sells: a value stream map mid-session. White mat board, blueprint-blue instrument marks, pencil-gray hairlines, one amber sticky note. Light theme only, locked; the brand is paper. **No purple/violet/magenta anywhere** (standing rule). Mood: "a process engineer's working wall at 10am: daylight, mat board, blueprint ink, one sticky note that says automate this."

Palette (canonical OKLCH in app/globals.css; sRGB hex computed 2026-08-03):

| Token | OKLCH | Hex | Role |
|---|---|---|---|
| bg | oklch(1 0 0) | #FFFFFF | Page. Pure white mat board. |
| surface | oklch(0.972 0.005 220) | #F2F7F8 | Panels, wells. |
| ink | oklch(0.21 0.015 230) | #111A1E | Headlines, strong body. |
| ink-muted | oklch(0.42 0.02 230) | #424F56 | Secondary body. |
| ink-faint | oklch(0.55 0.02 230) | #66747B | Meta labels, large/mono only. |
| blue | oklch(0.48 0.10 210) | #006C7D | Blueprint blue. Marks, links, buttons. |
| blue-deep | oklch(0.36 0.08 220) | #00465A | Hover, strong strokes. |
| blue-wash | oklch(0.94 0.02 210) | #DDEFF3 | Soft fills, tags, selection. |
| sticky | oklch(0.88 0.115 85) | #FAD27B | Amber sticky note. Ink text on it. Max one per section. |
| sticky-edge | oklch(0.78 0.13 80) | #E3AD4B | Sticky shadow edge, small amber marks. |
| pos | oklch(0.52 0.13 150) | #1D7D3E | Confirmations only. |
| neg | oklch(0.5 0.16 25) | #AC3031 | Errors only. |

Typography: **Archivo** (display/headings, expanded width, weight ≥600, tight tracking), **Schibsted Grotesk** (body/UI, 15-17px, 1.6 line height), **Martian Mono** (annotation voice only: uppercase short labels, 11-12px, never body copy).

Identity devices: dimension lines annotating real numbers, dotted leaders, the amber sticky note (max one per section), 32px graph grid at ≤9% opacity confined to margins, drafting title-block footer, blue process boxes with mono captions. 2px radius on drafting elements, 6px on controls, nothing larger.

## Social presence (from the 2026-08-03 spec; that spec is authoritative)

| Surface | What | Audience | Job |
|---|---|---|---|
| LinkedIn | Existing personal profile, repositioned | Operators | Weekly 200-300 word essay. The consulting buyer's channel. |
| YouTube | New Brand Account | Owners + search | Shorts; evergreen home for clinic recordings. |
| Instagram | New account | Owners (visual trades) | Reels. |
| Facebook | New Page off personal account | Owners (DFW local) | Reels, local group presence. |

No Threads, no X. Editorial spine: the **AI readiness curriculum**, the site's 18-question readiness assessment unpacked one question per week for 18 weeks (five dimensions: data and systems, process documentation, repetition and volume, team and buy-in, budget and focus). Weekly unit is one vertical clip (45-75s, owner altitude) plus one LinkedIn essay (operator altitude). Every piece ends at the same call to action: **take the assessment** (calebbolden.com/tools/ai-readiness).

## Key files

- Design system: DESIGN.md, app/globals.css
- Launch strategy, offers, marketing: consulting/launch-roadmap.md
- Social presence spec: docs/superpowers/specs/2026-08-03-founder-social-presence-design.md
- 18-week syllabus: consulting/social/syllabus.md
- Account setup checklist: consulting/social/account-setup.md
- Outreach templates: consulting/materials/outreach-templates.md
