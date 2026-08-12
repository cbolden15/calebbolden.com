# Package readiness audit (2026-08-11)

Read-only repo audit answering: "if a client bought on launch day, which package could I deliver without scrambling?" Produced by an exploration agent against the working tree at commit `3ded0f4` (plus local state).

## Verdicts

### 1. Process & AI audit, $750 ($500 founding clients): READY

Advertised in `components/Packages.tsx` (rendered on homepage): "Two to three weeks inside your business. I interview your team, map how the work really moves, and score where AI genuinely pays off." Deliverables promised: process map, scored shortlist, 90-day roadmap plus one pilot. "Audits start at $750, fixed scope."

Every promised deliverable has a complete, non-stub, immediately usable template behind it, covering the method end to end:

- Discover: `consulting/materials/discovery-interview-guide.md` (full facilitator script, 3 role-based interview tracks, signal patterns) plus `consulting/materials/intake-questionnaire.md` (pre-interview form, 6 sections)
- Map: `consulting/materials/vsm-workshop-kit.md` (full one-day facilitation script, notation legend, half-day compression variant)
- Prioritize: `consulting/materials/vsm-ai-overlay.md` (the scoring method: 4 annotations per step, worked 8-step HVAC example), `consulting/materials/kaizen-opportunity-workshop.md` (half-day facilitator guide), `consulting/materials/opportunity-scoring-matrix.md` (worked 3-candidate example, score bands), `consulting/materials/ai-readiness-assessment.md` (internal scoring tool)
- Final artifact: `consulting/materials/roadmap-deck-template.md`, explicitly the audit's final deliverable template, 12-14 slides with purpose/content/talk-track per slide

This package is genuinely turnkey.

### 2. Build sprint (quoted, 4-8 wks): PARTIAL

Advertised: "The top item on your roadmap, built and wired into your real systems... your team trained on it." `/method` adds safety promises (gates on anything that "sends money, contacts customers, or deletes records") and promises "the runbook gets written, and ownership transfers to you."

Exists: `consulting/materials/gate-register-template.md` and `consulting/materials/output-check-sheet-template.md`, both complete with worked examples, directly supporting the gate/eval promises.

Missing: no build/implementation runbook template, no client-facing build methodology, no architecture/integration playbook. Nothing documents how the build gets scoped, built, or handed off, despite `/method` promising a runbook as a Scale-phase deliverable. Technical capability isn't in question; the reusable delivery asset is what's absent.

### 3. Assurance retainer (quoted, monthly): READY on the core deliverable

`consulting/materials/monthly-assurance-report-template.md` matches the public promise almost verbatim (one-page format, score table, failure log, "the number that matters" section). `consulting/materials/output-check-sheet-template.md` defines the sampling plan, golden set, and threshold methodology feeding it.

Minor gap: "capacity is capped at a few clients" is an unquantified public claim with no cap-tracking mechanism.

## Gap list

1. Build sprint has no build/runbook methodology asset (biggest day-one-readiness gap).
2. Two non-identical phase models for the same method: public `/method` uses 6 phases (Discover/Map/Prioritize/Pilot/Scale/Assure); internal `consulting/framework/charted-framework.md` (v0.3) uses 5 phases (Map/Gate/Pilot/Chart/Compound) plus a cross-cutting Adoption track. Substantively aligned, structurally different. Reconcile before a client reads both.
3. Pricing inconsistency: the $500 founding-client offer appears only on `app/results/page.tsx:270-276`; homepage Packages and `/method` state $750 flatly with no cross-link.
4. Calendly booking advertised but not configured: `app/contact/page.tsx` and `components/AIChat.tsx` reference `NEXT_PUBLIC_CALENDLY_CLIENT_URL`, unset in `.env`/`.env.local`. Code defensively hides the button, so nothing is broken, but "book a call" isn't live.
5. No E&O/cyber policy in force. `consulting/research/eo-insurance-options.md` (2026-07-06) is research only.
6. MSA §9.1 (`consulting/materials/msa-template.md`) states "Consultant shall maintain... E&O insurance with limits of at least $1,000,000 per claim and $2,000,000 in the aggregate" and promises a certificate of insurance on request. False if signed today (no policy exists). Template header also says "DRAFT TEMPLATE. NOT LEGAL ADVICE. FOR ATTORNEY REVIEW BEFORE USE." and no attorney review has happened.
7. No SOW template exists, though the MSA structures every engagement around a signed SOW.

## Risky-promises list

1. "Every engagement is a fixed fee, quoted before we start. No hourly billing, no surprise scope." (`components/Packages.tsx`) stated as an absolute with no carve-out for scope discovered mid-build (the MSA has change-order language; the marketing copy doesn't hedge).
2. `/method` guarantees phrased as unconditional facts: "The systems I build cannot take a dangerous action on their own... an agent literally cannot charge a customer for work that failed." An edge case slipping a gate turns this into a broken guarantee rather than a design goal.
3. Unsourced quantified proof claims on `app/method/page.tsx`: "My own AI platform runs at 65 small businesses today" and "cut delivery times by double-digit percentages," with no on-page sourcing. The internal framework doc explicitly refuses this pattern ("Claims carry citations or I don't use them"); the figures are sourced in the internal Receipts table but not surfaced publicly.
4. Founding-client trade self-contradiction (`app/results/page.tsx`): "If a number comes back weak, it goes up weak" immediately followed by "anything you want out comes out," an open-ended editorial veto sitting next to a publish-the-weak-numbers commitment. Tighten before the first founding client signs.
5. "Capacity is capped at a few clients at a time" (retainer): unquantified scarcity claim, no tracking mechanism.

## Not classified as marketing-only

No advertised package lacks supporting assets entirely. The three service-path pages (`app/services/marketing`, `/seo`, `/web-development`) and the four "what I actually build" categories in `components/AISystems.tsx` aren't independently priced; they funnel to the audit as entry point, inheriting the audit's READY status for entry and the build sprint's PARTIAL status for execution.
