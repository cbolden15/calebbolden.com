# Founder-brand engine: two newsletters, consulting pipeline, gated communities

**Date:** 2026-08-01
**Status:** Approved design, pre-implementation
**Owner:** Caleb Bolden
**Relates to:** `consulting/launch-roadmap.md`, the Vora business blueprint (2026-07-31 revision) and its validation report, `~/Projects/vora-technologies-llc/operating-doc.md`

## Purpose

One planning frame for the consulting business and the online communities, designed as a single funnel under the Caleb Bolden brand. Two audiences are too different to share a send list, so the engine runs two separate newsletters that feed two revenue lines (Vora demos + the consulting ladder) and eventually up to three paid communities, each gated on its own audience metrics.

This plan operates inside the blueprint's guardrails. It expands the audience-building allocation consciously (~5–6 hrs/week vs. the blueprint's 2) — an explicit founder decision, with a pressure valve defined below.

## 1. Architecture

Two separate newsletters, each with its own name, signup page, sender identity, and send list. No shared sends.

| | Newsletter 1 | Newsletter 2 |
|---|---|---|
| Audience | Service-SMB / trades owners | Ops leaders at larger SMBs |
| Promise | "Stop losing jobs you already earned" | Workflow automation + AI readiness |
| Feeds | Vora demos, small consulting | Consulting ladder (audit → sprint → fractional) |
| Clinic | Odd months | Even months |
| Hub page | calebbolden.com/owners | calebbolden.com/operators |

A third audience (AI-curious builders) exists only as future intent. Its placeholder is build-in-public posting on LinkedIn/X. It becomes a third newsletter/community only after the sprint phase is fully over.

**Platform (working default): self-hosted Listmonk + n8n.** One Listmonk instance (Docker + Postgres, on existing infrastructure behind Caddy), one List per newsletter, sending relayed through Resend or SendGrid (existing keys — deliverability reputation is theirs, not self-hosted). Listmonk has no automation, so n8n (already running on the homelab for AI Life Agent) watches the subscribe webhook and fires welcome sequences. Alternative if per-tenant separation proves to matter more than maturity: Keila (per-newsletter Projects). Rejected: Ghost (bulk send is Mailgun-locked; two brands means two installs), Mautic (maintenance burden), Mailtrain (stagnant), Dittofeed (overbuilt), beehiiv (declined in favor of self-hosting; revisit only if ops burden bites).

**Community platform when gates hit: Skool or Circle** (~$99/mo per community). Decided against dogfooding ChapterHQ — it stays a parked product business, not internal infrastructure.

## 2. Content and clinic mechanics

- **Cadence: weekly issue per list** (two issues/week total).
- **Sourcing rule: everything is exhaust from work already happening.** Owners-list issues come from the Vora sprint (anonymized audit findings, missed-call math, install stories). Ops-list issues come from consulting productization (each template built in §4 ships as an essay + lead magnet). Nothing is written from scratch for its own sake.
- **Clinics: one per month, alternating audiences.** Free, 45 minutes, one concrete transformation demonstrated live, no pitch until the last five minutes. Owner clinics close with the Vora founding-slot mention; ops clinics close with the audit offer. Recordings become list content and the seed library for the paid communities.
- **Welcome sequences: three emails per list, written once.** Owners: missed-call math → audit-video offer → founding-slot CTA. Ops leaders: AI-readiness self-assessment → methodology essay → book-a-call.
- **Weekly budget: ~5–6 hrs** (3–4 writing, 1 clinic amortized, 1 LinkedIn repurposing). **Pressure valve:** when a Vora sprint week overloads, the ops list drops to biweekly first; the owners list is last to cut because it feeds the sprint.

## 3. Consulting positioning and pipeline

**Positioning sentence, used everywhere:** "I install and operate the workflow automation an SMB actually needs — audit first, fixed price, measured outcome." Specialty is workflow automation; no web design, SEO, or "anything digital" in the offer.

**Four inbound paths, no outbound:**
1. Ops newsletter → welcome sequence → book-a-call (self-assessment doubles as pre-discovery data).
2. Even-month clinics → last-five-minutes audit offer → discovery call.
3. Vora install referrals: the day-30 review asks "what's the most manual thing you still do weekly?" Answers route to consulting only when beyond Vora's product scope.
4. calebbolden.com consulting pages: scope and deliverables only, prices quoted live (2026-07-06 decision stands), one CTA.

**Gate stack (unchanged):** inbound only; max one engagement during the 90-day Vora sprint; minimum $4,500; only after Vora customer #1 is live; E&O bound and attorney-reviewed MSA before signature. Post-sprint: 15% founder-hours cap, wind-down trigger at 25% (operating-doc numbers, confirmed by the validation over the blueprint's 20%).

## 4. Delivery productization (25–40 hrs → ~15 per audit)

Fixes validation finding P1-8. Templatize scaffolding; findings stay bespoke — the deck template's "no reused content" rule applies to conclusions, not structure.

| Move | From | To |
|---|---|---|
| Interviews: 2 live + async intake questionnaire; AI transcript synthesis. Self-assessment = pre-discovery data | ~6 hrs (4–6 live) | ~3 hrs |
| VSM workshop: half-day remote-first with pre-work packet; reusable board template; on-site is a paid add-on | ~8 hrs (full-day on-site) | ~4 hrs |
| Kaizen: 90-min prioritization using scored opportunity-matrix template, end of VSM afternoon | ~4 hrs (half-day) | ~1.5 hrs |
| Roadmap deck: bespoke findings in fixed 12–14-slide skeleton, AI-drafted from artifacts, founder-edited | ~8 hrs | ~4 hrs |

Plus intake (1) and readout (2): **≈ 15 hrs/audit** — fits within two weeks of the 15% post-sprint cap without touching Vora hours.

**Dual-use rule:** every template ships as an ops-newsletter essay + lead magnet. **Sales angle:** the audit is itself AI-operated (transcript synthesis, deck drafting, agent-run analysis) — delivery demonstrates the methodology.

## 5. Pricing validation (anchors → list prices)

Current bands ($4.5–7.5k audit / $8–20k sprint / $2.5–6k/mo fractional) are unvalidated blog-sourced anchors per `launch-roadmap.md:47`.

- **Quote log:** every quote conversation records date, source path, package, number quoted, reaction (accepted / negotiated / rejected / ghosted), and the prospect's words about value.
- **Quote at midpoint, never the floor.** The sprint-window engagement quotes the audit at $6,000.
- **Decision rules:** 3 acceptances at/above midpoint → midpoint becomes the new floor. 3 rejections at the floor citing price → fix positioning or audience before cutting price. Ghosts are not price signal.
- **Discovery calls harvest willingness-to-pay:** clinic-sourced calls get "what did you expect something like this to cost?" — logged even without a quote.
- **Prices publish on the site only after 5 closed engagements** inside validated bands.
- **Fractional tier unsold until 2 sprints have completed.**

## 6. Community gates, guardrails, scorecard

**Per-list community gates** — a list earns its paid community (Skool/Circle) when ALL hold:
- 500+ subscribers
- 30%+ open rate sustained for a month
- Its clinic drew 25+ live attendees three consecutive times

Each community launches alone. The builders' third community additionally requires the sprint phase to be fully over.

**Guardrails carried forward, unbent:** Vora stays 80% of founder hours — this engine runs in the margin. No paid ads. ChapterHQ and PEI stay parked. Consulting gate stack per §3.

**Scorecard additions (weekly, three lines only):** subscribers + open rate per list; clinic registrations/attendance; quote-log entries.

## Open items

1. ~~Stand up Listmonk + n8n welcome-sequence flow (implementation plan to follow).~~ **Done.** Built across Tasks 1–6 of `docs/superpowers/plans/2026-08-01-founder-brand-engine-infra.md`; verified end to end (cold-path signup through confirmed welcome-1 delivery, backup/restore, scorecard automation) in Task 7. See `.superpowers/sdd/task-7-report.md`.
2. ~~Name the two newsletters; write the two hub pages.~~ **Done.** "The Missed Call" (owners) and "The Workflow Brief" (operators) — Task 4.
3. Build the intake questionnaire, pre-work packet, opportunity-matrix template, and deck skeleton (§4) — each paired with its newsletter essay. **Becomes the follow-on content plan** — this is content/template production, not infra, and is out of scope for the engine plan that closed with Task 7. Needs its own plan doc when picked up.
4. Refresh the Perplexity MCP API key (dead, 401 — found during platform research). **Remains founder-owned** — no API automation exists for Perplexity key rotation; the founder mints and replaces the key manually.

## Decisions log

| Decision | Choice | Rejected |
|---|---|---|
| Framing | One founder-brand engine | Two separate plans |
| First audience | SMB owners | Ops-first, builders-first |
| Send lists | Two fully separate newsletters | One list with lanes/tags |
| Cadence | Weekly per list | Biweekly alternating |
| Newsletter platform | Self-hosted Listmonk + n8n (default; Keila fallback) | beehiiv, Ghost, Mautic, Mailtrain, Dittofeed |
| Community platform | Skool/Circle at gate | ChapterHQ dogfood |
| Consulting scope | Pipeline, productization, pricing validation | PEI brand revival (stays parked) |
