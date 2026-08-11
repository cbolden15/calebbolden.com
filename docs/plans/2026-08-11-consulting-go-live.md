# Consulting go-live plan

Written 2026-08-11. Target: **public launch Saturday 2026-08-22** (11 days). "Live" means: site promoted, outreach running, able to take a client immediately.

Research basis (all in `consulting/research/go-live-2026-08/`):
- `research-marketing-sales.md` (Baker/Enns positioning, Stark proposals, 2026 cold-email and local-SEO benchmarks)
- `research-legal-finance.md` (attorney/E&O costs, CAN-SPAM, TRAIGA, TX franchise tax, bookkeeping)
- `research-ops-it.md` (client lifecycle, capacity math, cold-email infra, tool stack)
- `research-brain-learning.md` (practices mined from the work-brain learning wiki)
- `package-readiness-audit.md` (which advertised packages are deliverable today)

Constraints: $2,000 budget pre-first-client. 25 hrs/week capacity. Channels for the first 30 days: cold email, referrals, social (LinkedIn).

---

## The one thing that cannot wait: day-1 clock starters

Five items have external lead times longer than a day. Start all five on day 1 (Tue 8/12) regardless of everything else:

1. **Cold-email subdomain + warmup.** Create a subdomain (e.g. `reach.calebbolden.com`), set its own SPF/DKIM/DMARC (subdomains don't inherit SPF; DMARC starts `p=none`), start warmup. Warmup takes 3-6 weeks, so it will NOT finish by launch. That's fine: launch outreach leans on the warm network and referrals; real cold volume ramps in September. ~1-2 hrs, $0-12/mo.
2. **Google Business Profile claim + verification.** Verification (video/postcard) takes days. Service-area config, category, 750-char description. ~1-2 hrs.
3. **E&O + GL quotes.** Hiscox, Insureon/TechInsurance, Embroker (questions already prepped in `consulting/research/eo-insurance-options.md`). $1M/$2M limits. Rates vary 40-60% across carriers for identical coverage, so get all three. Bind before launch: the MSA's §9.1 promises this insurance exists. ~1-2 hrs, ~$600-950/yr.
4. **Attorney engaged for MSA review.** Turnaround is 3-7 business days, so day 1 or 2 engagement is the only way review completes by launch. Flat fee ~$500-750. Three explicit asks the review must cover (generic reviews miss them): (a) liability cap + advice-only vs implementation risk split, (b) explicit IP assignment clause (work-for-hire alone doesn't bind independent contractors), (c) TRAIGA applicability, the Texas AI law effective Jan 2026 that plausibly covers the site's AI chatbot.
5. **Calendly account + `NEXT_PUBLIC_CALENDLY_CLIENT_URL`.** The site already renders the booking button once the env var exists. Free tier caps at 1 event type; that's enough for launch (one "discovery call" type). ~30 min.

Also on day 1, two 10-minute unblocks already on the backlog: verify calebbolden.com in the Resend dashboard, and (optional, non-blocking) mint the dedicated Gemini key.

---

## Budget allocation ($2,000 ceiling)

| Item | Est. cost | Notes |
|---|---|---|
| Attorney MSA review (flat fee) | $500-750 | Includes the 3 asks above; confirm one revision round is included |
| E&O insurance, year 1 | $600 | Range $375-900 for $1M/$2M solo |
| General liability (bundled with E&O) | $150-350 | Skip only if never on client premises; in-person SMB visits make it required |
| Privacy policy + ToS generator | $0-99 | Termly/Bonsai tier; attorney drafting skipped at this budget |
| DBA filing (conditional) | $25 | Only if branding as "Caleb Bolden" rather than "Vora Technologies LLC" (Form 503, SOSDirect) |
| Wave bookkeeping | $0 | Free tier, real double-entry |
| Calendly + cold-email mailbox | $0-25/mo | Free tiers likely sufficient at launch |
| **Committed** | **~$1,275-1,825** | |
| Buffer | ~$175-725 | CPA consult (~$150-300) or second attorney pass if needed |

---

## Decisions only Caleb can make (decide by day 3)

1. **Audit pricing.** The site says $750 ($500 founding). Three independent sources say that's low: market benchmark for small-business AI audits is $1,500-8,000 with sub-$1,000 reading as superficial (ops research); the brain's offer-ladder source runs a $999 diagnostic claiming 50-60% conversion to paid work; close-rate doctrine says >50% close means underpriced. Options: (a) keep $750/$500 as a deliberate founding-era wedge and raise after 3 case studies, (b) reprice now to $1,500 base with $750 founding, (c) keep as-is. Recommendation: (b), the founding discount does the wedge work while the base price anchors credibility.
2. **Brand name vs entity name.** Site brands as "Caleb Bolden." Contracts and invoices come from Vora Technologies LLC. If marketing materials use any name other than the exact LLC name, Texas requires a $25 assumed-name filing (Form 503). Decide, file if needed, done in 15 min.
3. **CRM pick.** folk (free, referral/relationship fit) vs HubSpot Free (pipeline fit) vs a Notion/Airtable board (research consensus: a single board is enough until ~5 concurrent leads). Either real CRM takes under an hour; don't overthink.
4. **Founding-client offer placement.** The $500 founding offer lives only on `/results`; homepage and `/method` say $750 flatly. Either surface the founding offer on the Packages component or keep it as a `/results`-only reveal, but make it consistent with decision 1.
5. **Add cold calling?** You chose cold email + referrals + social. The brain's evidence disagrees with that mix for local businesses: the Gong 300M-call study has cold calls at ~2x email reply rates, and the local-business playbooks prioritize calls over email. Not a launch blocker; flagging because your own captured research points at a channel you excluded.

---

## Workstream A: legal + finance (launch-blocking)

| Artifact | Owner | Effort | Status |
|---|---|---|---|
| Attorney MSA review (3 asks) | Caleb engages; Claude preps the ask letter | 30-60 min intake | MSA draft exists, unreviewed |
| E&O + GL bound | Caleb | 1-2 hrs quoting | Research done, no quotes |
| SOW template (MSA requires one; none exists) | Claude drafts, attorney glances in same review | 2 hrs | Missing entirely |
| Privacy policy + ToS live (TDPSA has no size threshold; TRAIGA covers AI-chatbot deployers) | Claude drafts via generator output, Caleb approves | 1-2 hrs | Missing |
| CAN-SPAM-compliant cold-email template: physical address + one-click opt-out baked into the template, suppression list process, no misleading subject lines | Claude | 2 hrs | Missing. Penalty exposure ~$51K per email; highest-leverage $0 item |
| Wave account + chart of accounts (class-tag consulting vs product revenue; one set of books is correct) | Caleb signs up, Claude specs the account structure | half day | No bookkeeping exists |
| Stripe ACH enabled + payment terms written into SOW: 50% deposit, balance on delivery, Net 15 only after payment history (never Net 30 for new clients); ACH beats card fees above ~$650 invoices | Caleb (Stripe), Claude (terms language) | 1 hr | Missing |
| TX franchise tax PIR: confirm current for the entity | Caleb | 15 min | Likely done; verify (May 15 deadline, $50 penalty) |

Deferred to first 90 days: data-handling one-pager (build when procurement asks), pricing-floor spreadsheet (before first quote, after insurance premiums are known), CPA consult on estimated taxes (before the **Sep 15** quarterly deadline; set aside 25-30% of every consulting payment starting now).

## Workstream B: site fixes (from the package audit)

All Claude-implementable; Caleb reviews. Deploy together with the already-merged visual rollout (merged at `114e52f`, never deployed to Hetzner; deploy needs per-session approval).

1. **Build-sprint runbook template** (the one PARTIAL package): scoping doc, build-phase gate checklist, handoff/runbook template, training session outline. Closes the gap between `/method`'s "the runbook gets written" promise and the empty shelf behind it. ~3-4 hrs.
2. **Reconcile the two phase models**: public 6-phase (Discover/Map/Prioritize/Pilot/Scale/Assure) vs internal 5-phase framework v0.3 (Map/Gate/Pilot/Chart/Compound). Pick one public naming, map the other to it. ~1 hr.
3. **Hedge the unconditional guarantees on `/method`**: "cannot take a dangerous action" becomes design-goal language ("designed so that...", "every action that moves money passes a gate"). Same page: source the "65 small businesses" and "double-digit" claims on-page (the internal Receipts table already has the sourcing) or soften them. The internal framework doc's own rule is "claims carry citations or I don't use them." ~1-2 hrs.
4. **Fix the fixed-fee absolute**: add the change-order reality to the Packages copy ("scope changes are re-quoted before work continues"), matching what the MSA already says. ~30 min.
5. **Tighten the founding-client editorial-veto contradiction** on `/results` ("goes up weak" vs "anything you want out comes out"): name the veto's limits (e.g. redact identifying details, not results). ~30 min.
6. **Pricing consistency** per decision 4, plus Calendly env var per clock-starter 5.

## Workstream C: marketing + sales assets

| Artifact | Owner | Effort |
|---|---|---|
| Positioning statement (one sentence, used verbatim on homepage, LinkedIn headline, GBP description, email signature) | Claude drafts 3 options, Caleb picks | 2-3 hrs |
| LinkedIn profile optimized (personal profile, not company page; headline = positioning) | Caleb, from Claude's draft | 2 hrs |
| Client-zero pilot: run the audit method on a friendly local business (or Vora itself), write it up as case study #1 using a reusable template | Both; this is the only credibility asset available with zero clients | 3-5 hrs |
| Discovery-call question set: merge the existing `discovery-interview-guide.md` with Stark's Why Conversation and the brain's CLOSING framework (open with a diagnostic question; 1-10 readiness close; direct-price answer) | Claude | 2 hrs |
| Proposal template (Stark 5-page structure: outcomes first, 2-3 priced options, price after value, fixed quote) | Claude adapts, Caleb brands | 2-3 hrs |
| Cold-email sequence: 3-phase outbound (biggest problem, second problem, breakup), one research trigger reused across channels, one specific personalization detail per prospect, CAN-SPAM fields from Workstream A; review reply rate every ~100 prospects and change exactly one template | Claude drafts, Caleb sends | 3-4 hrs |
| Referral-ask email to warm network (specific ask, paired with launch announcement); brain doctrine: 10-15 warm contacts before any cold outreach | Claude drafts, Caleb personalizes | 1 hr |
| Launch announcement: LinkedIn post + network email (already on the backlog as "announcement content," fold in) | Claude drafts | 2 hrs |
| Lead-qualification checklist (brain screening doctrine: 5+ reviews, verified GBP, decision-maker access; client selection is "90% of churn") | Claude | 1 hr |
| Objection notes for AI-skeptical SMB owners (diagnose, don't script: Acknowledge/Diagnose/Reframe/Bridge; log objections and fix the offer element causing them) | Claude | 2 hrs |

## Workstream D: ops + IT

| Artifact | Owner | Effort |
|---|---|---|
| MSA + SOW templates loaded into Anvil (key exists; link-based no-login signing) | Claude preps, Caleb connects account | 2-3 hrs, after attorney review lands |
| Kickoff checklist + 30-min agenda (record the call; scope-dispute protection) | Claude | 1 hr |
| Client folder convention (client → project → date; keep editables) + 7-year retention paragraph for the offboarding template | Claude | 45 min |
| CRM set up with pipeline stages (cold → replied → discovery → proposal → won/lost) per decision 3 | Caleb | 1 hr |
| Client-credential vault: dedicated Vaultwarden collection (homelab instance already runs) + one intake paragraph on how credentials are requested and revoked; prefer client-provisioned named accounts | Claude specs, Caleb creates | 1 hr |
| Umami analytics on the Hetzner box (single Node+Postgres compose; the CLAUDE.md backlog says before any promotion, and launch IS promotion) | Claude, with deploy approval | 1-2 hrs |
| Weekly async status-update template | Claude | 30 min |

Capacity rule adopted from the research: at 25 hrs/week, plan for **2-3 concurrent clients maximum** (formula: ~26 hrs ÷ 8 hrs/client). Quantify the retainer's "few clients" cap as 3 and say so publicly; scarcity claim becomes checkable. Cap sales calls to 1-2 fixed days per week (brain doctrine). Daily rule: 3-5 revenue-producing activities before any admin.

---

## Day-by-day sequence

**Tue-Wed 8/12-13 (days 1-2):** all five clock starters + Resend verify. Make decisions 1-4. Claude starts: SOW draft, cold-email template with CAN-SPAM fields, positioning options, attorney ask-letter.

**Thu-Sun 8/14-17 (days 3-6):** Claude builds Workstream B site fixes + build-sprint runbook + Workstream C drafts (proposal, sequences, objection notes, qualification checklist) + Workstream D templates. Caleb: Wave setup, Stripe ACH, CRM pick, LinkedIn profile, insurance decision from quotes, start client-zero pilot conversations.

**Mon-Wed 8/18-20 (days 7-9):** attorney feedback lands; fold into MSA/SOW; load into Anvil. Client-zero pilot write-up. Privacy policy + ToS live. Umami deployed. Full site deploy to Hetzner (visual rollout + all fixes; per-session approval).

**Thu-Fri 8/21-22 (days 10-11):** verify everything end to end (booking link, lead capture, analytics events, PDF gates, chat). Final launch content pass. **Saturday 8/22: publish the LinkedIn announcement + send the network email with the referral ask.** First cold sends remain low-volume warmup until the domain is ready (~mid-September).

Caleb-hours estimate across the 11 days: ~15-20 hrs (well inside 2 weeks of 25 hr/wk capacity). Claude-hours don't consume that budget.

## Explicitly deferred (first 90 days)

VSL for pre-call viewing (brain's highest-leverage claim; needs the portrait/video shoot anyway), Cal.com self-hosting, email list provider + 5-email nurture sequences, formal referral program mechanics, Facebook page + NAP citations, content engine beyond 1 post/week, security one-pager, PM tooling, time tracking. Also on the existing backlog and unchanged: Gemini key rotation, blog posts into sitemap.

## Risks

1. **Cold email can't reach real volume by launch.** Accepted: launch leans on warm network + referrals + LinkedIn; cold ramps ~4 weeks post-launch. This matches the brain doctrine (10-15 warm contacts first) anyway.
2. **MSA signed before insurance binds** would make §9.1 false. Sequence guard: no signature until the E&O policy is active.
3. **Attorney runs past launch.** If review isn't back by 8/20, launch anyway (launch ≠ signing); no contract goes out until it lands.
4. **TRAIGA is new (Jan 2026) and untested.** Generic templates won't cover it; it's an explicit attorney ask, and the privacy policy mentions the chatbot's AI nature.
5. **Scorecard/calculator claims vs ToS**: tools get an "informational, not professional advice" disclaimer in the ToS.
