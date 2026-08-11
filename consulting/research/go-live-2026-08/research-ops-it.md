# Operations + IT artifacts for a solo AI consulting launch

Context: solo, highly technical consultant, 25 hrs/week total capacity, $2,000 pre-client budget across every domain, 11-day runway, targeting DFW small businesses, existing stack: self-hosted Next.js site on Hetzner, Resend (transactional), Anvil (e-signature, unused yet), Stripe accounts (other businesses), no CRM/scheduling/analytics/Google Workspace status unknown.

Perplexity was out of quota (401, exceeded plan) for this session — all findings below are from WebSearch across 11 queries against 2026-dated sources. Citations inline.

---

## Part 1: Operations artifacts

### Client lifecycle stage-by-stage

| Stage | Standard artifact | What "done" looks like |
|---|---|---|
| Lead intake | Intake form (5-question client brief is the solo-tier norm — [Rock](https://www.rock.so/templates/client-onboarding-checklist)) | One short form captures: business name, contact, what's frustrating them, budget signal, timeline. Feeds CRM or a markdown/Airtable row. |
| Discovery/audit | Discovery call script + audit methodology doc | 1-2 hour structured conversation, not a fixed questionnaire — the pattern used by practicing AI-audit consultants is: understand the business and team (~1-2 hrs), then review the actual tools/CRM/invoicing/file storage in use ([therundown.ai](https://app.therundown.ai/guides/sell-a-high-value-ai-workflow-audit-as-a-consultant), [chrishig.com](https://chrishig.com/insights/ai-workflow-audit-small-business/)). The audit's job is to find the *real* problem behind the stated one, then rank 3-5 opportunities — not produce an exhaustive report. Map the customer's actual path end-to-end and flag every manual handoff as a candidate. |
| Proposal | Fixed-price or tiered proposal doc, ideally templated in the e-sign tool | One reusable template, fields swapped per client (score/evidence/bottleneck/recommendation pattern per therundown.ai's guide). Small-business AI audits price $1,500-$8,000 depending on business size; sub-$1,000 is considered a shortened/superficial version, not a real audit (UK/US benchmark comparison from [layer3labs.io](https://www.layer3labs.io/ai-consulting-for-small-business) and related sources). |
| Contract/MSA | MSA (umbrella terms: IP, confidentiality, liability, payment) + SOW (scope, deliverables, timeline, fees) referencing the MSA | Signed via e-sign, no client account/login required — link-based signing is the 2026 norm for SMB clients ([Zignt buyer's guide](https://zignt.com/blog/e-signature-solutions-for-smes)). Caleb already has Anvil — use it. |
| Kickoff | Kickoff checklist + agenda | Solo-tier norm ([Rock](https://www.rock.so/templates/client-onboarding-checklist)): signed contract + deposit, one welcome email, one 30-min kickoff call with a pre-shared agenda, one shared workspace folder, weekly async updates. Agencies commonly run kickoff at ~45 min covering scope confirmation, communication preferences, next steps ([Portico](https://www.portico.run/blog/post/client-onboarding-template)). Record the call — protects against scope disputes later. |
| Delivery / status updates | Recurring async update (weekly or biweekly) | A short written update, not a meeting, is the default cadence at solo scale — matches the "weekly async updates" pattern above. |
| Offboarding | Offboarding checklist + testimonial ask | Free templates exist ([ManyRequests](https://www.manyrequests.com/templates/client-offboarding-checklist)) — track final deliverables, document what was done, formally close, and ask for feedback/testimonial in the same motion. This is the highest-leverage 15 minutes in the whole lifecycle for a referral-driven solo practice. |

### Project/task tracking for a true solo

No source argues a solo practitioner needs dedicated PM software over a markdown file or simple Kanban — the lifecycle guides above (Rock, Portico) explicitly scope their "solo tier" to fit in a shared doc + one workspace. Recommendation: a markdown file or Notion board is sufficient; do not buy PM software pre-launch. Revisit only past 3-4 concurrent clients.

### Time tracking: needed or not

None of the sourced material treats time tracking as required for value-priced solo work — it matters for hourly billing (invoice defensibility) or for measuring your own utilization/burnout risk, not for the client relationship itself. Given Caleb's stated intent to price by value (audit fixed-fee), time tracking is a nice-to-have for personal capacity math, not a launch requirement.

### Capacity planning at 25 hrs/week

Convergent, well-sourced number: **2-4 active clients**, not more.
- Solo consultants sustainably bill 25-35 hrs/week before quality/burnout risk rises; 35-45% of total time goes to non-billable sales/admin/marketing overhead ([Wiggle Room](https://wiggleroom.so/blog/how-many-clients-should-a-freelancer-have), [SoloHourly](https://solohourly.com/guides/how-many-billable-hours-per-week-is-realistic)).
- Worked formula: 26 hrs ÷ (6 billable + 2 overhead per client) ≈ 3.25 → round down to 3 as the practical ceiling, minus a buffer client for safety ([GigRadar](https://gigradar.io/blog/marketing-consultant-freelance)).
- Each client adds 30-60 min/week of pure admin overhead, and context-switching between clients costs 10-25 min of refocus time per switch ([The Expert CFO](https://theexpertcfo.com/consulting-business-models/)).
- **Applied to Caleb's 25 hrs**: plan for 2-3 concurrent engagements as steady state at launch, not more, even though "active on the books" can be higher than "actively worked" in a given week.

### Folder/document structure per client

Convention across sources (WSBA retention guide, freelancer backup guides): organize by **client name → project name → date**, keep editable working files (not just final exports/PDFs), and store contract + invoices + correspondence + deliverables as clearly separated subfolders. A consistent structure is what lets you reconstruct a client's history after a device failure or a memory gap 8 months later — matters more for a solo than a team since there's no one else who remembers.

### Records retention

No universal standard, but the recurring benchmark across CPA/legal/bookkeeping practice guides is **7 years** post-engagement, with a written retention policy stated in the offboarding/disengagement communication and 30 days for the client to pull their own copy before you'd ever delete anything ([Ambitious Bookkeeper](https://www.ambitiousbookkeeper.com/blog/204), [WSBA](https://www.wsba.org/for-legal-professionals/member-support/practice-management-assistance/guides/document-retention-guide)). This is a "write it down once" artifact, not an infra build — one paragraph in the offboarding email template covers it.

---

## Part 2: IT artifacts

### Cold email sending infrastructure

**Verdict for ~10-30 emails/day local outreach: a subdomain of calebbolden.com (or a dedicated look-alike domain), not the root domain, and not plain Gmail.**

- Personal Gmail for cold outreach is universally discouraged in 2026 sources — it reads as amateur to recipients, gets less algorithmic trust, and can't meet Google's own bulk-sender authentication requirements at volume ([MailReach](https://www.mailreach.co/blog/email-domains-explained-how-to-pick-use-and-optimize-for-maximum-deliverability), [Cleverly](https://www.cleverly.co/blog/cold-email-outreach-best-practices)). Sending from the *root* domain risks burning your main site's domain reputation within ~30 days if something goes wrong.
- Subdomains do **not** inherit the parent's SPF — each subdomain needs its own SPF/DKIM/DMARC ([LeadHaste](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026)). At <500 emails/day, a subdomain's isolated-but-related reputation is an acceptable risk/effort tradeoff versus a fully separate purchased domain ([growleads.io](https://growleads.io/blog/subdomain-for-cold-email-protect-main-domain/)).
- DMARC rollout: start `p=none` for 30 days while monitoring reports, then `p=quarantine`, then `p=reject` — never start at reject ([devcommx.com](https://www.devcommx.com/blogs/cold-email-domain-setup-checklist)).
- Warm-up is still required even at low volume, because the signal providers look for is sending *history*, not just total count: ~10-20 emails/day ramping over 3-6 weeks, tied to engagement (open/reply rates), not a calendar date ([Salesforge](https://www.salesforge.ai/blog/best-practices-for-domain-warm-up), [Ozigi](https://blog.ozigi.app/blog/how-to-warm-up-sending-domain-2026)). Keep light maintenance warmup running permanently afterward or reputation erodes.
- At 10-30/day, a dedicated cold-email tool (Instantly/Smartlead) is overkill — one mailbox on the subdomain, sent through Google Workspace (or even a Resend-adjacent transactional setup you already run), stays comfortably under Gmail's ~30/day-per-mailbox throttle ceiling ([thequantumleap.business](https://www.thequantumleap.business/blog/gmail-cold-email-limits-2026-deliverability-playbook)). Revisit a dedicated tool only if outreach scales past ~50/day or multiple mailboxes.
- Effort estimate: DNS records (SPF/DKIM/DMARC) on a subdomain, ~1-2 hrs given Caleb already manages DNS for calebbolden.com via Cloudflare. Cost: $0 incremental if reusing an existing Workspace-style mailbox; ~$6-12/mo if a new Workspace seat is needed.

### CRM

No single "right answer" — tradeoffs by workflow shape ([editorialge.com](https://editorialge.com/crm-for-solopreneurs/), [Attio's own guide](https://attio.com/f/best-crm-for-consultants), [folk comparison](https://www.folk.app/articles/attio-alternatives)):

| Tool | Free tier | Best fit | Watch-out |
|---|---|---|---|
| HubSpot Free | 2 users, 1,000 contacts, no expiry | Sales-driven practice (leads → proposals → follow-ups) | Sequences/automation locked behind paid Sales Hub; UI can feel like overkill for one person |
| folk | Free up to 3 seats | Referral/network-driven practice — syncs existing email/LinkedIn contacts, usable same afternoon | Less structured pipeline automation than HubSpot |
| Attio | Free playground | Data-model tinkerers who want custom "Deal"/"Project" objects | Has moved upmarket toward Salesforce-scale teams; heavier than needed for one person |
| Airtable | 1,000 records/base, 100 automations/mo | If Caleb wants a relational DB-style CRM he builds himself | Free tier ceiling is tight if the practice grows past initial phase |
| Notion | 5MB upload limit | If client relationships are already tightly coupled to a Notion-based project/notes system | Weak on true relational CRM mechanics (no multi-table joins) |

**Recommendation**: folk (free, 3 seats) or HubSpot Free — folk fits the referral/cold-outreach-into-relationships model this launch is built on; HubSpot fits if the intake→proposal→follow-up motion is the primary loop. Either is $0/mo at this scale. Given the 11-day runway, do not overthink this — pick one, both take under an hour to set up.

### Scheduling

Calendly free vs. self-hosted Cal.com ([Contabo](https://contabo.com/blog/calcom-vs-calendly/), [TaskROI](https://taskroi.com/blog/calcom-vs-calendly/)):

- **Calendly free is capped at 1 event type** — insufficient the moment Caleb needs separate "discovery call" vs. "kickoff" links.
- **Cal.com self-hosted is genuinely free** beyond server cost (already has a Hetzner box), open source (AGPL), no event-type cap, and keeps booking data on infrastructure he controls — but requires deploying a Next.js app + Postgres + env config + his own backup/uptime responsibility.
- Given the 11-day runway and that this isn't the highest-leverage 11 days to spend on infra: **use Calendly's paid Standard tier ($10-12/mo) or accept the 1-event-type free constraint short-term**, and self-host Cal.com in the "first 90 days" bucket once launch pressure eases — the project CLAUDE.md already flags Calendly as planned and not yet set up, so don't let scheduling infra block outreach.

### E-signature

Anvil is already in the credential set and unused. Two relevant facts from research:
- E-signatures are legally binding under ESIGN/UETA in the US — no legal gap to worry about ([Zignt](https://zignt.com/blog/e-signature-solutions-for-smes)).
- The 2026 norm for SMB-facing "your paper" deals (consultant sends the MSA/SOW) is frictionless, no-login, link-based signing with reusable templates ([Zignt contract management guide](https://zignt.com/blog/contract-management-for-consultants)).
- Anvil's individual/free tier supports unlimited e-signatures at $1.50/completed packet with free dashboard usage — fits this use case well since it's API-first but has a usable direct-send flow, and Caleb already holds the API key. No need to add DocuSign or PandaDoc.
- Action: build one MSA template + one SOW template in Anvil now; this is a same-day task, not a research task.

### Client credential/secrets handling

Because this is an AI consultant who will plausibly get access to client tools (CRM, email, automation platforms), the 2026 norm matters more than usual:
- Never accept credentials over email, chat, or a spreadsheet — the norm is a shared vault/collection in a business-tier password manager with zero-knowledge encryption ([Securden](https://www.securden.com/blog/password-management-best-practices.html), [StrongDM](https://www.strongdm.com/blog/password-management-best-practices)).
- Better than shared passwords: ask the client to provision a **separate named account** scoped to only what the engagement needs, so access is auditable and revocable cleanly at offboarding — this is the practice-guide consensus, not just a security nicety.
- Layer MFA, and have a written policy for what happens to access at engagement end (revoke immediately, documented in the offboarding checklist).
- **Concrete artifact needed**: a Bitwarden (or 1Password) shared vault set up specifically for client credential handoffs, plus one paragraph in the client intake/kickoff doc explaining how credentials will be requested and revoked. This is a trust signal worth having in writing before the first engagement that touches client systems.

### Self-hosted analytics

Umami vs. Plausible, both viable on the existing Hetzner box ([OpenPanel comparison](https://openpanel.dev/articles/self-hosted-web-analytics), [Swetrix](https://swetrix.com/comparison/umami/vs-plausible)):
- **Umami wins on setup effort**: single Node process + Postgres, ~512MB RAM, docker-compose under 30 lines, MIT licensed. Runs comfortably alongside the existing site on the same VPS.
- **Plausible** needs Elixir + ClickHouse and wants 2-4GB RAM just for itself — more capable (funnels, revenue tracking, UTM breakdowns) but heavier, and its self-hosted edition drops the Stats API that the cloud version has.
- **Recommendation**: Umami. This matches the "before any promotion so conversion is measurable" line already in the project's CLAUDE.md next-up list — effort is genuinely under an hour for someone who already runs Docker Compose stacks (which Caleb does, for Vora and ChapterHQ).

### Personal Gmail vs. branded email for outreach credibility

Confirmed unambiguous: no 2026 source recommends personal Gmail for cold outreach. It reads as amateur to recipients, and modern inbox providers extend less algorithmic trust to free consumer addresses, independent of the SPF/DKIM/DMARC mechanics above ([MailReach](https://www.mailreach.co/blog/email-domains-explained-how-to-pick-use-and-optimize-for-maximum-deliverability)). This reinforces the subdomain recommendation above rather than adding new work — the subdomain setup *is* the fix for both deliverability and credibility simultaneously.

---

## Launch-blocking vs. first-90-days split

### Launch-blocking (before first outreach or first client, ~11-day window)

1. **MSA + SOW templates built in Anvil** — ~2-3 hrs. $0 (Anvil key already exists).
2. **Discovery call script / audit methodology doc** — ~2-3 hrs to write once, reusable every engagement. $0.
3. **Proposal template** (one reusable doc, fields swapped per client) — ~1-2 hrs. $0.
4. **Kickoff checklist + agenda template** — ~1 hr. $0.
5. **Client folder structure convention** (name → project → date, editable files kept) — ~30 min to decide and document. $0.
6. **Cold email subdomain + SPF/DKIM/DMARC + warm-up start** — ~1-2 hrs setup, but warm-up itself runs 3-6 weeks in parallel with early low-volume sending, so start this on day 1 even though it won't be "done" by day 11. $0-12/mo.
7. **CRM pick (folk or HubSpot Free) + basic pipeline** — ~1 hr. $0.
8. **Password manager shared-vault setup for client credentials** — ~1 hr if Caleb doesn't already run one for business use (he may via Vaultwarden on homelab, per existing infra — check that first before buying a new tool). $0 likely.
9. **Records retention policy paragraph** (7-year default, written into offboarding template) — ~15 min. $0.

Launch-blocking total: roughly 10-14 hours, effectively $0-12/mo incremental cost, all achievable inside the 11-day window in parallel with outreach prep.

### First 90 days (build after first client or two, not before)

1. **Status update template formalization** — the weekly async cadence starts informally, template itself can wait.
2. **Offboarding checklist + testimonial-request flow** — needed by the time the *first* engagement ends, not before it starts; build during week 1-2 of delivery.
3. **Self-hosted Umami analytics** — matches existing "before promotion" backlog item in project CLAUDE.md; not needed for the first 1-2 referral-based clients, becomes important once outreach volume scales.
4. **Cal.com self-hosting** — start on Calendly free/cheap tier at launch; migrate to self-hosted only once booking volume or the per-seat cost justifies the infra time.
5. **Dedicated PM tooling** — only revisit past 3-4 concurrent clients (unlikely in first 90 days at 25 hrs/week capacity).
6. **Time tracking tool** — only if pricing model shifts toward hourly billing.

---

## Recommended minimal tool stack + monthly cost

| Tool | Purpose | Monthly cost |
|---|---|---|
| Anvil (existing key) | MSA/SOW e-signature | ~$1.50/packet, pay-per-use, no subscription |
| folk (or HubSpot Free) | CRM | $0 |
| Calendly free (1 event type) or Standard | Scheduling | $0-12 |
| Cold-email subdomain on existing Cloudflare DNS + Google Workspace mailbox | Outreach | $0 if reusing existing mailbox, ~$6-12 if new seat |
| Bitwarden/Vaultwarden (check existing homelab instance first) | Client credential vault | $0 (self-hosted, already exists per homelab infra) |
| Markdown file / Notion board | Task tracking | $0 |
| Umami (deferred to first-90-days) | Analytics | $0 (self-hosted on existing Hetzner box) |

**Total recurring cost at launch: roughly $0-25/month**, well inside the $2,000 pre-client budget — the real spend in this domain is Caleb's own hours (~10-14 hrs of template-building), not tooling.

---

## Sources

- [Rock solo-tier onboarding checklist](https://www.rock.so/templates/client-onboarding-checklist)
- [Portico client onboarding templates](https://www.portico.run/blog/post/client-onboarding-template)
- [ManyRequests offboarding checklist](https://www.manyrequests.com/templates/client-offboarding-checklist)
- [Wiggle Room — how many clients should a freelancer have](https://wiggleroom.so/blog/how-many-clients-should-a-freelancer-have)
- [SoloHourly — realistic billable hours](https://solohourly.com/guides/how-many-billable-hours-per-week-is-realistic)
- [GigRadar — solo vs agency capacity math](https://gigradar.io/blog/marketing-consultant-freelance)
- [The Expert CFO — consulting business models](https://theexpertcfo.com/consulting-business-models/)
- [Salesforge — domain warm-up best practices 2026](https://www.salesforge.ai/blog/best-practices-for-domain-warm-up)
- [growleads.io — subdomain for cold email](https://growleads.io/blog/subdomain-for-cold-email-protect-main-domain/)
- [LeadHaste — cold email domain setup guide 2026](https://leadhaste.com/blog/cold-email-domain-setup-guide-2026)
- [devcommx.com — cold email setup checklist](https://www.devcommx.com/blogs/cold-email-domain-setup-checklist)
- [thequantumleap.business — Gmail cold email limits 2026](https://www.thequantumleap.business/blog/gmail-cold-email-limits-2026-deliverability-playbook)
- [MailReach — email domains explained](https://www.mailreach.co/blog/email-domains-explained-how-to-pick-use-and-optimize-for-maximum-deliverability)
- [editorialge.com — CRM for solopreneurs 2026](https://editorialge.com/crm-for-solopreneurs/)
- [Attio — best CRM for consultants](https://attio.com/f/best-crm-for-consultants)
- [folk — Attio alternatives](https://www.folk.app/articles/attio-alternatives)
- [Contabo — Cal.com vs Calendly](https://contabo.com/blog/calcom-vs-calendly/)
- [TaskROI — Cal.com vs Calendly 2026](https://taskroi.com/blog/calcom-vs-calendly/)
- [Zignt — e-signature solutions for SMEs 2026](https://zignt.com/blog/e-signature-solutions-for-smes)
- [Zignt — contract management for consultants](https://zignt.com/blog/contract-management-for-consultants)
- [Securden — password management best practices 2026](https://www.securden.com/blog/password-management-best-practices.html)
- [StrongDM — password management best practices](https://www.strongdm.com/blog/password-management-best-practices)
- [OpenPanel — self-hosted web analytics 2026](https://openpanel.dev/articles/self-hosted-web-analytics)
- [Swetrix — Umami vs Plausible](https://swetrix.com/comparison/umami/vs-plausible)
- [therundown.ai — sell a high-value AI workflow audit](https://app.therundown.ai/guides/sell-a-high-value-ai-workflow-audit-as-a-consultant)
- [chrishig.com — how I audit a small business for AI workflow automation](https://chrishig.com/insights/ai-workflow-audit-small-business/)
- [layer3labs.io — AI consulting for small business pricing 2026](https://www.layer3labs.io/ai-consulting-for-small-business)
- [Ambitious Bookkeeper — client document retention](https://www.ambitiousbookkeeper.com/blog/204)
- [WSBA — document retention guide](https://www.wsba.org/for-legal-professionals/member-support/practice-management-assistance/guides/document-retention-guide)

Note: Perplexity research/reason tools returned 401 quota-exceeded errors for this session and were not usable; all findings above are WebSearch-sourced against 2026-dated articles.
