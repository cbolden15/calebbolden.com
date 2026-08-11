# Consulting go-live plan

Written 2026-08-11, revised same day after the codex hardening pass (`2026-08-11-consulting-go-live.findings.md`; all 3 blockers and 16 majors addressed below). Target: **public launch Saturday 2026-08-22** (11 days).

**Two-tier launch definition (replaces the single "live" claim):**
- **Tier 1, marketing launch (committed for 8/22):** site deployed and verified, announcement out, booking link live, outreach running, leads handled same-day.
- **Tier 2, client-ready (gated, see go/no-go below):** attorney-reviewed MSA + SOW loaded in Anvil, E&O binder/COI active, invoice + W-9 + deposit rail tested. Only when Tier 2 holds can a client sign and pay. If Tier 2 misses 8/22, launch proceeds as Tier 1 with discovery calls booked and a stated "engagements start the week of 8/24" line. No signature, ever, before insurance binds.

Research basis (all in `consulting/research/go-live-2026-08/`): `research-marketing-sales.md`, `research-legal-finance.md`, `research-ops-it.md`, `research-brain-learning.md`, `package-readiness-audit.md`, plus the hardening findings file.

Constraints: $2,000 pre-first-client budget. 25 hrs/week owner capacity. Channels for the first 30 days: cold email, referrals, LinkedIn. Note: 2026-08-11 is a Tuesday; all weekday labels below are verified.

---

## Go/no-go gate: Thursday 8/20, end of day

Binary check, no judgment calls:

| Tier 2 item | Pass condition |
|---|---|
| Contract packet | Attorney-reviewed MSA + SOW back, revisions folded, loaded in Anvil |
| Insurance | E&O binder or COI in hand (not "quoted"), consulting + product activities of the LLC disclosed and covered |
| Payment | Test invoice sent through Wave, Stripe ACH live, W-9 ready |
| GBP | Verified, or launch copy switched to the no-GBP variant (direct site + booking + phone links) |

All four pass: launch 8/22 as client-ready. Any miss: launch 8/22 as Tier 1 (announcement + booking only), say so plainly in the copy, and close the gap the following week.

---

## Day-1 clock starters (Wednesday 8/12): everything with an external lead time

1. **Attorney gets the COMPLETE packet in one send**: MSA draft + the SOW draft (Claude writes it Wednesday morning, see Workstream A) + payment terms + three explicit asks: (a) liability cap and advice-only vs implementation split, (b) explicit IP assignment (work-for-hire alone doesn't bind independent contractors), (c) TRAIGA applicability (Texas AI law, effective Jan 2026, plausibly covers the site's chatbot; confirm the attorney handles AI regulatory questions or budget a separate consult). Ask for written delivery by **Tuesday 8/18** with one revision round included, and the flat fee confirmed up front. Turnaround is 3-7 business days; from Wednesday 8/12, day 7 is Friday 8/21, which is why the packet must be complete on day 1 and a partial send resets the clock.
2. **E&O + GL applications to all three carriers** (Hiscox, Insureon/TechInsurance, Embroker; questions prepped in `consulting/research/eo-insurance-options.md`), $1M/$2M limits, with full operations disclosure up front: Vora Technologies LLC also runs AI product/SaaS businesses, and the carrier must confirm in writing what's covered. Require binder/COI by 8/20, not just a quote. If underwriting prices it as broader tech E&O ($1,200-5,000/yr per the research), that busts the budget and becomes a same-day decision, not an auto-spend.
3. **Cold-email subdomain + warmup start** (e.g. `reach.calebbolden.com`): own SPF/DKIM/DMARC (subdomains don't inherit SPF; DMARC starts `p=none`), warmup takes 3-6 weeks and will NOT finish by launch. Launch outreach is warm network + referrals + LinkedIn; cold volume ramps mid-September. ~1-2 hrs.
4. **Google Business Profile claim + verification start** (needs the business phone from clock-starter 5 to be complete). Verification can take days to weeks; the 8/20 gate has a no-GBP launch-copy fallback, so this cannot slip the launch.
5. **Business phone number**: provision via Google Voice ($0) or the existing Twilio account, with a named business voicemail, forwarding to Caleb's cell, and missed-call notifications tested. Local SMBs call; GBP requires a phone. ~1 hr.
6. **Calendly account + booking link**, one "discovery call" event type on the free tier. The env var goes live via the production config checklist below, not just locally.
7. **Resend domain verification** (10 min in the dashboard) so the DNS + sender flip in the production checklist can happen this week.
8. **Professional correspondence mailbox** on the primary domain (e.g. `caleb@calebbolden.com` via a Workspace seat or existing mail hosting): proposals, invoices, and contracts never come from a personal Gmail or from the cold-outreach subdomain. Confirm Workspace status today; it's currently unknown. ~1 hr, $0-12/mo.

## Day-1/2 decisions (Caleb, before dependent drafting starts)

These gate the sales assets: positioning and pricing get decided BEFORE Claude drafts anything that quotes them. Until then Claude builds only structure-level templates.

1. **Positioning statement.** Claude drafts 3 options Wednesday morning; Caleb picks or edits one by Thursday. Everything downstream (GBP description, LinkedIn headline, proposal, cold email, launch post) quotes it verbatim.
2. **Audit pricing.** Site says $750 ($500 founding). The market benchmark is $1,500-8,000 with sub-$1,000 reading as superficial (ops research); the brain's offer-ladder source runs a $999 diagnostic claiming 50-60% conversion; close-rate doctrine says >50% close means underpriced. Recommendation: $1,500 base with $750 founding rate. Decide, then the site copy, proposal, and founding-offer terms all follow.
3. **Founding-offer terms in writing** (currently an unwritten $500 mention on `/results` only): number of slots (recommend 3), expiry date, exact scope, payment schedule, and a separate written case-study consent with defined editorial limits (redact identifying details, not results). This resolves the "goes up weak" vs "anything you want out comes out" contradiction the package audit flagged.
4. **Brand name vs entity name.** Marketing as "Caleb Bolden" requires a $25 Texas assumed-name filing (Form 503, SOSDirect, 15 min). Decide and file.
5. **CAN-SPAM physical mailing address.** Every cold email must carry one. Home address, the LLC's registered address, or a virtual mailbox (~$10-25/mo, add to budget if chosen). The cold-email template cannot be finalized without this.
6. **CRM pick**: folk (relationship/referral fit) vs HubSpot Free (pipeline fit) vs a Notion board (research says a board suffices under ~5 concurrent leads). One hour, don't overthink.
7. **Cold calling, yes or no.** You chose email + referrals + social; your own brain notes (Gong 300M-call study: calls ~2x email reply rate; local-business playbooks prioritize calls) argue for adding calls. Not launch-blocking. Flagged because the captured research disagrees with the chosen mix.

---

## Budget ($2,000 ceiling), corrected and categorized

Required, not yet quoted (the real number arrives with the quotes):

| Item | Range |
|---|---|
| Attorney flat-fee review (complete packet, one revision round) | $500-750 |
| E&O year 1 (solo profile; tech-E&O repricing is a decision point) | $375-900 |
| General liability (research range; bundling with E&O often lands ~$300) | $250-500 |

Conditional and small: DBA $25 (decision 4), privacy/ToS generator $0-200, virtual mailbox $0-25/mo (decision 5). Recurring: Calendly $0-12/mo, mailbox seat $0-12/mo, Anvil ~$1.50/packet.

Sums: best case ~$1,125; mid path ~$1,550-1,700; worst case ~$2,375, which **exceeds the ceiling**. Spend rule: the three insurance/legal line items get paid in priority order (attorney, E&O, GL); any second attorney round, CPA consult (~$150-300), or tech-E&O repricing above the stated ranges is a stop-and-decide, not an auto-spend. Set aside 25-30% of every future consulting payment for quarterly estimated taxes starting with the first invoice (next federal deadline: Sep 15, 2026).

---

## Workstream A: legal + finance

| Artifact | Owner | Caleb-hrs | Status |
|---|---|---|---|
| SOW template drafted (MSA requires one; none exists) and sent IN the day-1 attorney packet | Claude drafts Wed morning | 0.5 review | Missing |
| Attorney packet out 8/12, review back by 8/18, revisions folded by 8/20 | Caleb sends + intake call | 1-1.5 | Draft exists, unreviewed |
| E&O + GL bound with binder/COI by 8/20 | Caleb | 1.5-2 | Research only |
| Privacy policy + ToS live, PLUS a data-inventory pass verifying the policy matches actual flows (Resend, Gemini chat, lead capture, Umami) and a one-paragraph deletion-request procedure with Caleb as owner | Claude drafts both, Caleb approves | 1 | Missing |
| CAN-SPAM cold-email template: mailing address (decision 5) + one-click opt-out baked in, suppression-list process, no misleading subject lines. Penalty magnitude is per-email and severe; exact 2026 FTC figure pending verification, do not quote a number externally | Claude | 0.5 review | Missing |
| Wave account + chart of accounts (class-tag consulting vs product revenue; one set of books) | Caleb signs up, Claude specs | 2-3 | No bookkeeping exists |
| Client-onboarding money rail: branded invoice template, one TEST invoice sent through Wave, Stripe ACH enabled, current W-9 for Vora Technologies LLC ready to send | Caleb (Stripe/W-9), Claude (template) | 1.5 | Missing |
| Payment terms in the SOW: 50% deposit, balance on delivery, Net 15 only after payment history. ACH is cheaper than card at every relevant invoice size at stated rates (0.8% capped at $5 vs 2.9% + $0.30); the $5 cap kicks in around $625. Verify current Stripe pricing before quoting a client | Claude | 0 | Missing |
| TX franchise tax PIR: confirm current | Caleb | 0.25 | Likely done; verify |

Note: `research-legal-finance.md` line 181 contains a stale "next deadline is June 15" sentence; the correct next quarterly deadline is Sep 15, 2026 (the same file's own tax section agrees).

## Workstream B: site fixes + deploy (split into TWO deploys)

**Deploy 1 (this week, Thu-Fri 8/13-14): the already-merged visual rollout** (`114e52f`, merged 2026-08-05, never shipped). Deploying it separately de-risks the launch deploy and needs its own per-session approval. Book the approval window with Caleb now, note the rollback tag before deploying.

**Deploy 2 (Tue-Wed 8/18-19, NOT later): launch-critical changes**, so Thursday 8/20 and Friday 8/21 are pure verification and the weekend is a production freeze after a Friday smoke test. Contents, all Claude-built, Caleb-reviewed:

1. Build-sprint runbook template (scoping doc, build-phase gate checklist, handoff/runbook, training outline): closes the audit's one PARTIAL package and the `/method` "runbook" promise. ~3-4 hrs.
2. Phase-model reconciliation: public 6-phase vs internal framework v0.3 5-phase; pick one public naming, map the other.
3. `/method` guarantee hedging ("cannot take a dangerous action" becomes designed-so-that language) and on-page sourcing or softening of the "65 small businesses" and "double-digit" claims.
4. Fixed-fee absolute on Packages gets the change-order carve-out the MSA already contains.
5. Founding-offer copy per decisions 2-3: consistent price everywhere, written terms, tightened editorial-veto language.
6. Umami analytics deployed on the Hetzner box with events on tool completions and PDF gates (launch IS promotion; the backlog's own precondition).

**Production config checklist (part of Deploy 2, none of it is local-only):** Cloudflare DNS records for Resend, `LEAD_EMAIL_FROM` flipped in local env files AND Hetzner `/opt/calebbolden/.env`, `NEXT_PUBLIC_CALENDLY_CLIENT_URL` set on Hetzner, redeploy, then real-world tests: booking flow from a phone, lead-capture email arriving in the monitored inbox, chat capture, PDF gate, Umami events.

## Workstream C: marketing + sales assets

Gated on decisions 1-2 (positioning + pricing) landing Thursday 8/13. Claude drafts, Caleb reviews and personalizes.

| Artifact | Caleb-hrs |
|---|---|
| Positioning statement final (3 options Wed, picked Thu) | 1 |
| LinkedIn profile rework from positioning (personal profile, headline, About, banner CTA) | 1.5 |
| **Client-zero: run the audit method on Vora itself, decided now, started Friday 8/14.** Vora is the guaranteed subject (a friendly local business can't be scheduled, executed, evidenced, and permission-cleared inside 11 days; that becomes case study #2 later, with written publication consent). Write-up lands Tue 8/18 | 3-4 |
| Discovery-call question set: existing `discovery-interview-guide.md` + Stark's Why Conversation + brain's CLOSING framework (diagnostic opening, 1-10 readiness, direct-price answer) | 0.5 review |
| Proposal template (Stark 5-page: outcomes first, 2-3 options, price after value, fixed quote) | 1 |
| Cold-email 3-phase sequence (biggest problem, second problem, breakup; one research trigger reused; one specific personalization detail per prospect; CAN-SPAM fields from A). Reply-rate review every ~100 prospects, change exactly one template | 0.5 review |
| Warm-network referral email (specific ask; brain doctrine: 10-15 warm contacts before any cold) + named warm-contact list of at least 15 people | 1.5 |
| Launch announcement + **the two LinkedIn posts that follow it** (prewritten now: post 2 = client-zero findings, post 3 = one lead-magnet walkthrough), plus a daily 20-min LinkedIn engagement block on the calendar | 1.5 |
| Lead-qualification checklist (5+ reviews, verified GBP, decision-maker access) and objection notes for AI-skeptical owners (Acknowledge/Diagnose/Reframe/Bridge; log objections, fix the offer element) | 0.5 review |
| **Launch-weekend lead runbook**: lead email alerts forwarded to phone, same-day response target, acknowledgement template, CRM entry owner, fallback check of container logs Sat/Sun evening | 0.5 |

## Workstream D: ops + IT

| Artifact | Caleb-hrs |
|---|---|
| Reviewed MSA + SOW loaded into Anvil as reusable templates (after attorney return; link-based no-login signing). **Kickoff gate: no kickoff until SOW signed AND deposit paid** | 1 |
| Kickoff checklist + 30-min agenda (record the call) | 0.25 |
| Client folder convention (client → project → date, keep editables) + `consulting/materials/offboarding-checklist.md` stub holding the 7-year retention paragraph, completed during the first engagement | 0.25 |
| CRM set up per decision 6, stages: cold → replied → discovery → proposal → won/lost | 1 |
| Client-credential vault: dedicated Vaultwarden collection (homelab instance exists) + intake paragraph on how credentials are requested and revoked; prefer client-provisioned named accounts | 1 |
| Weekly async status-update template | 0 |

Capacity rules: at 25 hrs/week, 25 ÷ 8 ≈ 3.1, so **cap at 3 concurrent clients** and say "capacity is capped at three retainer clients" publicly (the scarcity claim becomes checkable). Sales calls on 1-2 fixed days per week. Daily: 3-5 revenue-producing activities before admin.

---

## Day-by-day (weekdays verified; 8/11 is Tuesday)

**Wed-Thu 8/12-13 (days 1-2):** all 8 clock starters. Decisions 1-6 made (positioning options Wed morning, picked Thu). SOW drafted and the complete attorney packet OUT Wednesday. Insurance applications with full disclosure out Wednesday. Deploy 1 approval booked.

**Fri-Mon 8/14-17 (days 3-6):** Deploy 1 (visual rollout) lands and is verified. Claude builds Workstream B fixes + C drafts + D templates. Caleb: Wave + Stripe ACH + W-9, CRM, LinkedIn profile, client-zero audit on Vora underway, warm-contact list written.

**Tue-Thu 8/18-20 (days 7-9):** attorney review back (chased Monday if silent); revisions folded; Anvil templates loaded. Insurance binder/COI in hand. Client-zero write-up published. Deploy 2 Tue-Wed including the production config checklist. **Thursday 8/20 EOD: the go/no-go gate.**

**Fri 8/21 (day 10):** full production smoke test (booking from a phone, lead capture to monitored inbox, chat, PDF gates, Umami). Production freeze after the smoke test. Launch content final pass against the gate outcome (client-ready copy vs Tier 1 copy).

**Sat 8/22 (day 11): launch.** LinkedIn announcement + warm-network email with the referral ask. Lead runbook active through the weekend. Cold email stays in warmup until ~mid-September.

**Caleb-hours honest total: ~25-33 hrs across the 11 days** (roll-up of the owner columns above plus clock starters, decisions, reviews, and deploy approvals). That is 2+ weeks of the 25 hr/wk capacity compressed into 1.5 weeks, so the pressure-relief valves, in drop order if the week overloads: objection notes and status template (drop to week after launch), CRM setup (a Notion board holds a week), client-zero write-up polish (publish rougher). The attorney packet, insurance, deploys, and lead runbook do not slip.

## First 90 days (explicitly deferred)

VSL for pre-call viewing (brain's highest-leverage claim; pairs with the portrait shoot), Cal.com self-hosting, email list provider + 5-email nurture sequences, formal referral program mechanics, Facebook page + NAP citations, content engine beyond the prewritten posts, security one-pager (when procurement asks), PM tooling, time tracking, CPA consult before Sep 15, friendly-business case study #2, cold-call channel test (decision 7). Unchanged backlog: Gemini key rotation, blog posts into sitemap.

## Risks (mitigations named and executable)

1. **Attorney misses 8/18.** Chase Monday 8/17; if not back by the 8/20 gate, launch Tier 1 and say "engagements start the week of 8/24." The complete-packet day-1 send with a written delivery date is the prevention.
2. **Insurance underwrites as broader tech E&O or excludes product operations.** Full disclosure on day 1 forces the answer early; over-range quotes are a stop-and-decide against the budget rule; no signature until binding either way.
3. **Zero response to the launch.** Prewritten posts 2-3 + daily engagement block + the 7-day review: if no discovery call is booked by Sat 8/29, change exactly one variable (audience, offer framing, or channel) and run another 7 days.
4. **Deploy regression near launch.** Two-deploy split, launch-critical done by Wed 8/19, Friday smoke test, weekend freeze, rollback tags noted before each deploy.
5. **GBP verification stalls.** No-GBP launch copy variant ready at the 8/20 gate; listing finishes when Google finishes.
6. **TRAIGA is new and untested.** Explicit attorney ask with a named fallback (separate AI-law consult, ~$150-250 from buffer) if the attorney declines the question; ToS carries the informational-not-advice disclaimer for the tools either way.
