# AI work surface — design

**Date:** 2026-07-14
**Status:** Approved by Caleb (brainstorm session)

## Problem

calebbolden.com currently reads process/automation focused. It sells the SMB audit funnel well, but underplays the AI engineering work: shipped AI products, open-source tooling, and an operation that itself runs on AI. Goal: convey that depth to a broader audience (peers, partners, technically literate prospects) without weakening the SMB consulting funnel.

## Decisions made

| Question | Decision |
|---|---|
| Audience for AI emphasis | Broader audience (peers, partners, bigger clients) — not just SMB cred |
| Site purpose | Consulting stays primary; AI depth layered in |
| Content to show | Shipped products (incl. GitHub repos as shipped work), how-I-build story, systems/architecture depth, writing/teaching |
| Homepage change size | Light touch — funnel untouched |
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

## Homepage light touch

Funnel untouched. Three changes:

1. **Hero subline** — sharpen to signal builder identity. Direction: "I map how your business actually runs, then build AI where it pays. I build these systems myself — the same ones running my own companies." Final wording at implementation; humanizer rules apply (that draft's em dash gets replaced).
2. **Proof section** — keep spec-sheet rows; rows that have a `/work/*` detail page link to it (others keep current behavior). Add one row: "Open source — tooling I publish on GitHub" → `/work/open-source`. Keep chat-assistant callout line.
3. **Nav** — "Work" link in header and footer.

## How-I-build page (`/how-i-build`)

The meta story: the operation itself runs on AI. Bands:

- Opening: consultant who dogfoods — recommendations come from systems run daily.
- **My stack in practice**: Claude Code as primary dev environment; agent teams/swarms for parallel work; multi-model routing (right model per task); autonomous loops that ship while I sleep. Plain language first, mono-annotated detail for technical readers.
- **What this means for clients**: velocity, plus the failure modes have already been hit and survived.
- Tone: no "10x" hype; concrete workflow descriptions. Humanizer rules throughout.

## About page rewrite

Extend the current about page: braid two threads — process discipline (existing lean/six-sigma story) + builder credibility (new). Link to `/work` and `/how-i-build`.

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
