# AI Consulting Launch Roadmap

Prepared 2026-07-06. Synthesized from research on business setup, engagement methodology, market pricing, and local marketing for launching AI consulting services for small-medium businesses.

## Decisions locked

| Decision | Choice |
|---|---|
| Entity | Vora Technologies LLC (no new business, no DBA needed) |
| Brand | Personal — calebbolden.com. No new domain. |
| Market | Local/regional SMBs first, in-person delivery |
| Niche | Industry-agnostic, ops-pain focused (niche later from real engagements) |
| Capacity | Serious part-time, building pipeline |
| Differentiator | Lean/six sigma process discipline: map and fix the process first, then automate it |

The differentiator is validated white space. No firm was found combining kaizen-event facilitation with AI-candidate identification. The Lean Enterprise Institute is publishing "value stream mapping is your missing AI superpower," and Gartner projects more than half of lean-six-sigma companies will fold in AI tooling by 2026. Meanwhile the widely-cited "95% of GenAI pilots show no P&L impact" stat (Project NANDA at MIT Media Lab, 2025 — note: not peer-reviewed, and contested) points at integration, data, and workflow gaps rather than model quality. Sturdier corroborating numbers exist from firms clients recognize: Gartner predicted 30% of GenAI projects abandoned after proof of concept and 60% of AI projects failing for lack of AI-ready data; BCG found 74% of companies can't show tangible AI value; S&P Global measured the share of companies abandoning most AI initiatives jumping from 17% to 42% in one year. The failure pattern is the sales argument for assessment-first consulting.

---

## 1. Business setup (one-time, ~2 weeks elapsed)

**Structure.** Market as Caleb Bolden, contract and invoice as Vora Technologies LLC. Sign as "Caleb Bolden, Principal, Vora Technologies LLC." This is the standard solo-consultant pattern and requires no DBA filing as long as no bank account, contract, or invoice uses a different business name. If you ever invoice under the personal brand, a WA trade name is $10-15 through DOR Business Licensing Service.

**Checklist:**

- [ ] Add "Services provided by Vora Technologies LLC" to calebbolden.com footer and all proposals
- [ ] Confirm LLC registration state and standing (verify DBA rules there if not WA)
- [ ] Contract stack: MSA (signed once per client) + short SOW per project. Start from a Bonsai (~$25/mo) or Terms.Law template, add the AI clauses below, then pay a lawyer once (~$500-900) to review before the first significant client
- [ ] E&O insurance: $1M/$2M tech E&O with cyber bundled. Quote Hiscox and NEXT (10 minutes each). Expect $300-1,000/yr solo. Cyber matters here because client data flows through LLM APIs. Many clients contractually require $1M E&O, so it also unblocks deals
- [ ] Books: add a "Consulting" class/category so consulting and Vora product revenue separate on one P&L. Stripe Invoicing (0.4-0.5% per invoice, no subscription) on the existing Stripe account is enough to start; move to QuickBooks Plus when class-level reporting gets annoying. Two revenue streams in one LLC is legally fine — veil-piercing risk comes from personal/business commingling, not from mixed business lines

**AI clauses for the MSA** (the part generic templates miss):

1. Disclosure that third-party AI tools (named by category) are used in service delivery, with human review of output
2. No-warranty on AI output: may contain errors; client verifies before relying on it for material decisions
3. Client data: processed via enterprise/API tiers only, never used to train models. All three major vendors (OpenAI, Anthropic, Google) exclude paid API data from training by default — put it in writing anyway; Anthropic auto-deletes API I/O in 7 days
4. Regulated data carve-out: no PHI without a BAA (both with the vendor and with the client), no PCI unless separately agreed
5. Liability cap at fees paid (per SOW), consequential damages excluded, indemnity limited to gross negligence/willful misconduct
6. Flow-down of AI vendor terms; right to substitute vendors if their terms change

## 2. Offer ladder and pricing

Three packages, each feeding the next. Fixed-fee, not hourly — the assessment category has matured to defined deliverables at defined prices.

Decision (2026-07-06): prices are NOT published on the website. The site shows package names, scope, deliverables, and timelines, with a book-a-call CTA; pricing is quoted live. The price bands below are internal anchors for those conversations. Tradeoff accepted: some unqualified calls in exchange for per-client scoping flexibility. Revisit if call volume fills with tire-kickers — the fallback is a "starting at" anchor on the audit only.

Pricing caveat: every published price band below traces to consultant/vendor blog content, not independent surveys or verified transactions. Good enough for anchoring your own rates; don't quote them to clients as market data. Validate against what your first few prospects actually accept.

### Package 1: Process & AI Readiness Audit — $4,500-7,500 fixed, 2-3 weeks

Lean six sigma mapping of 2-3 core workflows, data-readiness check, waste/bottleneck quantification, scored opportunity matrix, 90-day roadmap with ROI estimates. This is the entry point and the place the lean discipline is most visible. It pre-qualifies implementation buyers and filters clients whose data isn't ready — which is how you avoid joining the 95% pilot-failure statistic. Market band for SMB AI readiness assessments: $2,000-8,000 narrow scope, $5,000-15,000 full.

### Package 2: Build Sprint — $8,000-20,000 fixed per project, 4-8 weeks

Implement the top 1-2 roadmap items: workflow automation, AI-enabled CRM, agent/chatbot. Defined success metric, staff training, 30-day post-launch tuning. Sits at the accessible end of the validated $12.5K-45K SMB implementation band, sized for part-time delivery. Scoping risk is already retired by the audit.

### Package 3: Fractional AI Operator — $2,500-6,000/mo, quarterly commitment

Monitor and iterate shipped automations, one new automation or improvement per month, monthly metrics review, ad-hoc advisory. Recurring revenue on part-time hours. Cap at 3-4 concurrent clients. Priced between automation-retainer norms ($500-5K/mo) and fractional-CAIO floors ($5K+/mo), justified because you advise and build.

Useful sales stat: external-specialist AI implementations succeed roughly 67% of the time versus about a third for internal builds.

Competitive notes from a second research pass: no Big 4 firm has a direct-to-SMB AI consulting product in the US as of mid-2026 — they've ceded the segment entirely. Direct searches for solo consultants positioned on "lean six sigma + AI for SMBs" came up empty; the closest analogues are software platforms (LeanSigma Pro, Lean Coach) and the enterprise consultancy Roboyo, none SMB or solo. Market convention names packages with plain outcome nouns rather than methodology jargon (e.g., one boutique's "Clarity / Momentum / Growth" ladder) — worth following: sell the lean discipline in the pitch, not in the package names. Several fractional-CAIO firms structure engagements as contained 90-day cycles with an explicit scale/continue/stop decision at day 90 — a de-risking frame that pairs naturally with the pilot charter's stop/scale criteria.

## 3. Engagement methodology

Five phases, 8-12 weeks elapsed per client, deliverable per phase. Compatible with 2-4 concurrent clients part-time. (Phases 1-3 are the Audit package; 4 is the Build Sprint; 5 closes either.)

| Phase | Duration | What happens | Deliverable |
|---|---|---|---|
| 1. Discover | 1 week | Intake questionnaire, 4-6 stakeholder interviews (owner, ops lead, frontline) | Current-state findings memo |
| 2. Map | 1 week | 1-day VSM workshop on 1-2 core processes, annotated for AI | Annotated VSM + waste/pain log |
| 3. Prioritize | 3-4 days | Kaizen-style scoring workshop, opportunity matrix | Scored backlog + roadmap deck |
| 4. Pilot | 4-8 weeks | Charter one use case, build, weekly checkpoints | Pilot charter, working pilot, results readout |
| 5. Scale/Handoff | 1-2 weeks | SOP updates, training, runbook, KPI baseline | Runbook, training, ROI summary |

**Lean tool adaptations for AI** (this is the original IP to build):

- **VSM overlay:** annotate each process step with data availability/quality, decision-point type (rule-based = automatable, judgment-based = human-in-loop), error tolerance, and system-vs-manual handoffs
- **Kaizen reframe:** three-way sort of each waste item — eliminable by AI, by process redesign, or by neither. Keeps AI-eager clients honest that not everything is an AI problem
- **Interview additions:** ask where data is trusted/untrusted and where people already fudge or route around the system — those surface automation candidates lean interviews alone miss

**Use-case categories to prime workshops:** customer comms (chat/phone triage, FAQ deflection), quoting/estimating, scheduling/dispatch, back-office admin (data entry, AP/invoicing, reconciliation), marketing content, reporting/dashboards, document processing, inventory/demand signals.

## 4. Materials to build

Sixteen artifacts run the whole engagement. Build order matters: tier 1 is needed to sell and run the first audit; tier 2 before the first pilot; tier 3 can be drafted during the first engagement.

**Tier 1 — build before first client (sales + audit):**

| # | Artifact | Purpose |
|---|---|---|
| 1 | Intake questionnaire | Pre-qualify fit, size, stack, pain signals |
| 2 | Discovery interview guide | Repeatable interview script, role variants (owner/ops/frontline) |
| 3 | VSM workshop kit | Agenda, facilitation guide, mapping template, symbol legend |
| 4 | AI-annotated VSM overlay | The differentiating extension layer (see adaptations above) |
| 5 | Kaizen opportunity workshop guide | Convert VSM waste findings into automation candidates |
| 6 | AI opportunity scoring matrix | Impact × feasibility × data-readiness × risk |
| 7 | AI readiness assessment | Data, tech, people, governance blockers |
| 8 | Roadmap/recommendation deck template | Executive-ready sequencing, quick wins vs bigger bets |

**Tier 2 — build before first pilot:**

| # | Artifact | Purpose |
|---|---|---|
| 9 | Current-state findings memo template | Synthesize interviews into themes and pain ranking |
| 10 | AI pilot charter | Scope, owners, metrics, data needs, stop/scale criteria (adapt InitializeAI's public template) |
| 11 | ROI/business-case calculator | Time saved × loaded cost, error reduction, revenue capture |
| 12 | Implementation SOW template | Convert pilot into scoped contract (part of contract stack) |

**Tier 3 — build during first engagement:**

| # | Artifact | Purpose |
|---|---|---|
| 13 | Training/SOP update materials | Staff run the new process without you |
| 14 | Handoff runbook template | Ownership, monitoring, escalation, vendor contacts |
| 15 | Post-engagement review template | 30/60/90 check-ins; harvests the case study and the upsell |
| 16 | Master client tracking sheet | Your own PM backbone across concurrent clients |

**Plus one marketing artifact:** an "AI Opportunity Self-Assessment" scorecard (10-15 questions, scored result) as the site lead magnet. It pre-qualifies and gives a natural personal follow-up hook.

## 5. Website repositioning

Keep calebbolden.com — personal-name domains outperform generic ones for solo consultants and Google gives no SEO edge to keyword domains. The site already says "AI Solutions Consultant" with the right anti-busywork tone, so this is refinement:

- [ ] **Offer page:** the three packages with names, scopes, deliverables, and timelines — no prices (decision 2026-07-06; quoted live on the call). Single primary CTA (book a call) above the fold on every page
- [ ] **Authority, proof-first (decision 2026-07-06):** authority comes from work shown, not opinion content. Elements: case studies as they land, shipped products named, a workshops/speaking section (chamber talks become "as presented at" credibility markers), the self-assessment tool, and a short insights section fed by real engagement findings. No blog-as-centerpiece, no AI punditry. Revisit a newsletter layer once engagements generate material
- [ ] **Process section:** the five phases as "how it works" — SMB buyers doing diligence look for this
- [ ] **Proof:** name the shipped products. Vora (production AI CRM across 11 service verticals with real billing), ChapterHQ, Real Estate Maite, the autonomous Agent Team. Today the site reads as an unproven freelancer while you run a real AI product company
- [ ] **Make the chatbot an explicit demo:** "my site runs a live AI agent — try it" instead of a generic contact widget
- [ ] **Case studies with numbers** as engagements complete (before/after metrics; the brittany-lyons client asset suggests at least one exists already)
- [ ] **Lead magnet:** the self-assessment scorecard, delivered with a booking link ("get your results in a 20-min call")
- [ ] **Footer:** LLC attribution line; contact form email-only (phone fields cut conversion)

## 6. Marketing plan

Channel ranking for local B2B at 5-8 hrs/week. LinkedIn is a supporting credibility channel, not primary — many local SMB owners aren't on it. Primary reach is referral and in-person.

1. **Referral partners** — bookkeepers/CPAs, MSPs, business bankers, agencies serving SMBs. They see process pain before anyone else. Start with coffee meetings, formalize with a one-pager (optional 10-20% first-invoice finder's fee) only once volume justifies it. Offer two-way referrals
2. **Free "AI for local business" lunch-and-learns** — matches the in-person facilitation strength directly. Chambers will co-host and promote for free (solves the zero-audience problem). One talk to 15-20 members reliably produces 2-4 real conversations
3. **Chamber of Commerce membership** — infrastructure for #2 and local credibility, not a standalone lead source
4. **SCORE/SBDC listing** — free, durable referral trickle from action-oriented businesses
5. **LinkedIn 2-3x/week** from personal profile — reaches the referral partners and validates you when a chamber contact checks you out
6. Skip for now: BNI (~$1,200/yr plus weekly attendance, poor part-time fit), local business journals, Rotary

**90-day sequence:**

| Weeks | Focus |
|---|---|
| 1-2 | Business setup checklist. Site repositioning (offer page, packages, proof). Draft lead magnet. Join chamber. Build tier-1 materials |
| 3-4 | Lead magnet + booking link live. Book 5 coffee meetings with bookkeepers/CPAs/MSPs. Start LinkedIn 2x/week (repurpose proof-of-work) |
| 5-8 | Pitch chamber on hosting a lunch-and-learn. Run it. Follow up 1:1 with every attendee within 48 hrs using the self-assessment as the hook. 2 referral-partner meetings/week. Finish tier-2 materials |
| 9-12 | Second workshop, different venue (SBDC, library, coworking). Formalize any referral relationship with traction. Review which channel produced conversations; double down, cut the rest |

**Day-90 success bar:** 2 workshops delivered, 8-10 referral relationships seeded, 1 signed or near-signed audit, self-assessment producing a monthly trickle.

## 7. This week

1. Footer LLC attribution + confirm LLC standing
2. Hiscox + NEXT E&O quotes
3. Bonsai signup, draft MSA with AI clauses, book lawyer review
4. "Consulting" class in books + Stripe invoice template
5. Join chamber of commerce
6. Start tier-1 materials, beginning with the intake questionnaire and interview guide

---

## Appendix: key sources

- MIT 95% pilot failure: fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/
- VSM as AI tool (Lean Enterprise Institute): lean.org/the-lean-post/articles/value-stream-mapping-is-your-missing-ai-superpower/
- SMB adoption stats (Thryv 2025): businesswire.com/news/home/20250717239434/en/
- Assessment pricing: consultkit.ai/blog/how-to-price-an-ai-readiness-assessment-what-the-market-actually-pays-in-2026-1773479248460
- Pilot charter template to adapt: initializeai.com/resources/templates/ai-pilot-charter-template
- Packaged assessment examples: catalant.com/capability/ai-opportunity-assessment-and-roadmap/, advantageworks.com/discovery
- WA trade names: dor.wa.gov/manage-business/grow-business/register-trade-names
- AI contract clauses: bonterms.com/forms/ai-standard-clauses-version-1-0, gouchevlaw.com/10-critical-clauses-for-ai-vendor-contracts/
- Anthropic API retention: platform.claude.com/docs/en/manage-claude/api-and-data-retention
- E&O costs: nextinsurance.com/professional-liability-insurance/cost/, hiscox.com/small-business-insurance/errors-and-omissions-insurance
- Domain advice: youpreneur.com/how-to-choose-between-a-personal-or-brand-domain-name/
