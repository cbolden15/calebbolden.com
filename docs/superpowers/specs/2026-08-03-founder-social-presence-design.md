# Founder social presence: four accounts, one curriculum, run on Vora

**Date:** 2026-08-03
**Status:** Approved design, pre-implementation
**Owner:** Caleb Bolden
**Relates to:** `docs/superpowers/specs/2026-08-01-founder-brand-engine-design.md` (this extends it), `docs/superpowers/plans/2026-08-01-founder-brand-engine-infra.md`, `~/Projects/vora-technologies-llc/operating-doc.md`

## Purpose

The founder-brand engine shipped its email half: two Listmonk lists, two hub pages, welcome sequences, a Monday scorecard. Its audience-acquisition half was a single unfilled line item, "1 hr/week LinkedIn repurposing."

This design fills that line. Four social accounts under the Caleb Bolden name, one editorial spine derived from the AI-readiness assessment already shipped at `/tools/ai-readiness`, published and moderated through Vora's own social layer.

Three constraints from the engine spec carry forward unbent. Vora stays 80% of founder hours. No paid ads. The third audience (AI-curious builders, placeholder X/LinkedIn build-in-public) stays parked until the sprint phase ends.

## 1. Accounts and identity

Two of the four platforms forbid a second personal account. LinkedIn's user agreement permits one profile per person and Facebook the same; second profiles get merged or banned. The sanctioned mechanism on both is a Page or repositioned profile attached to the existing account. Instagram permits multiple accounts per login and YouTube permits multiple channels per Google account via Brand Accounts, so those two are genuinely new and separate.

| Surface | What it is | Audience | Job |
|---|---|---|---|
| LinkedIn | Existing personal profile, repositioned | Operators | Weekly essay, clip reposts. The consulting buyer's channel. |
| YouTube | New Brand Account under the existing Google account | Owners, plus search | Shorts feed; evergreen home for 45-minute clinic recordings |
| Instagram | New account | Owners (visual trades: salons, landscaping, garage doors) | Reels |
| Facebook | New Page off the existing personal account | Owners (DFW local) | Reels, local business group presence |

Display name is "Caleb Bolden" on all four. Handle convention `@calebbolden`, falling back to `@calebboldenai`. Availability must be checked by the founder at four logins; it cannot be resolved in advance and is the first checklist item.

**House-of-brands hygiene.** The feed identity is the person. "Vora Technologies Consulting" appears in the LinkedIn experience section, where the operating doc's parent-is-the-brand exception already applies, and nowhere in the three video feeds.

**Identity decision:** reposition the existing LinkedIn profile rather than build a Company Page. Company Pages receive a fraction of the organic distribution a person does, and the consulting buyer hires a person. Rejected: full separation via Company Page, no separation at all, and leaving the personal profile untouched.

## 2. Editorial system: the readiness curriculum

**Spine:** the AI-readiness assessment, unpacked one question at a time. `components/tools/ReadinessScorecard.tsx` scores five dimensions and sorts respondents into three bands.

| Dimension | Representative question |
|---|---|
| Data and systems | Could you pull a clean list of your last 12 months of customers in under 10 minutes? |
| Process documentation | If you were out sick for a week, could someone run your busiest process from written instructions alone? |
| Repetition and volume | Does someone spend more than 2 hours a week on data entry or copy-pasting between systems? |
| Team and buy-in | Is there at least one person besides you who would champion a new tool internally? |
| Budget and focus | Can you name ONE specific task you want help with, rather than "we should use AI"? |

Bands: Foundations first, Ready for one pilot, Ready to sequence.

A generic AI curriculum is the most commoditized content in the category. This one is not copyable, because the syllabus is an instrument the site already ships and the content terminates in taking it.

**Schedule:** one question per week, worked through one dimension at a time. At 16 to 18 questions that is four to five months of pre-scheduled content, depending on the count reconciled in open item 2.

**Weekly unit, two cuts of one idea:**

1. Vertical clip, 45 to 75 seconds, that week's question answered for an owner. Distributed to YouTube Shorts, Instagram Reels, Facebook Reels.
2. LinkedIn essay, 200 to 300 words, the same question at operator altitude: what this looks like at 40 people instead of 4.

Both end at the same call to action: take the assessment.

**Monthly rollup, no net-new work.** The month's three or four questions become one clinic segment and one newsletter issue, satisfying the engine spec's rule that everything is exhaust from work already happening.

**Production model:** light on-camera, batched. One 30-minute session per month produces the month's three or four clips. Rejected: faceless screen-capture (weaker trust with owners), repurpose-only (supply too lumpy at one clinic per month), fully produced (a second job).

### 2.1 The band is the router

The platform split puts one person in front of two audiences the engine spec requires never to mix. The assessment resolves this at capture rather than in the feeds.

| Band | Routes to |
|---|---|
| Foundations first | The Missed Call (owners) |
| Ready for one pilot | The Missed Call (owners) |
| Ready to sequence | The Workflow Brief (operators) |

Current wiring, verified: `ReadinessScorecard.tsx` captures email and posts to `/api/lead-magnet`, which sends the resource through Resend and does not touch Listmonk. `/api/subscribe` accepts `{email, list: 'owners' | 'operators'}` and writes to Listmonk with the configured list IDs.

Required change: `ReadinessScorecard` also calls `/api/subscribe` with the list derived from the computed band. Lead-magnet delivery is unchanged.

**Sequencing constraint:** this points new traffic at `/api/subscribe`, which the pending `harden-subscribe-route` chip covers (409 cross-list no-op, rate limiting). That chip lands before the assessment begins feeding the route.

## 3. Vora dogfood wiring

Publishing and moderation run through Vora rather than new infrastructure. The founder becomes a Vora tenant for the consulting business.

Verified present in `platform/vora-dashboard/src/lib/server/social/` and its API routes (capability confirmed by code inspection, not yet exercised for this use case): publishing via Ayrshare, scheduled posts with a `reconcile-scheduled` drift check, `auto-post`, comment `classify` and `ai-replies` with a Telegram approval path, `guardrails`, `brand-voice`, `campaign-templates`, `optimal-time`, `analytics`, Canva integration, and media storage accepting `video/mp4`, `video/quicktime`, and `video/webm`. All four target platforms are supported.

Setup order:

1. Create a Vora org for the consulting business on production
2. Connect all four accounts through `social/sync-accounts`
3. Author a brand-voice profile from scratch
4. Upload each month's clips through `social/media`, schedule via `optimal-time`
5. Enable comment classification with Telegram approval
6. Enable guardrails; nothing auto-publishes without passing them

**Step 3 is not optional.** `industry-presets.ts` is tuned for local service SMBs and will flatten the operators voice if inherited. This is the one place dogfooding actively works against the goal.

**Dogfood dividend.** Bugs hit as tenant zero are bugs customers would hit. Each becomes a Vora issue and a piece of content, accumulating proof-of-work inventory at no cost. This is the upgrade path: once real installs and audits exist, the spine can shift from curriculum to proof-of-work without a new plan.

**Risks:**

| Risk | Handling |
|---|---|
| Publishing breaks, marketing stops | The batch produces real files. Manual upload is a 10-minute fallback, not a lost week. |
| Founder consumes own credit ledger | Accepted. Cost is visible in the same ledger customers use, which is itself useful signal. |
| Industry presets flatten the voice | Step 3 above. |

Note that the engine spec rejected dogfooding **ChapterHQ**, on the grounds that it is a parked product business rather than internal infrastructure. That reasoning does not extend to Vora, which is the active product at 80% of founder hours. The rejection stands for ChapterHQ and does not apply here.

## 4. Cadence, budget, metrics, gates

**Budget:**

| Item | Cost |
|---|---|
| Monthly filming batch (one dimension, 3 to 4 clips) | 30 min |
| Weekly LinkedIn essay | 15 min |
| Weekly comment approval via Telegram | 10 min |
| Total | ~32 min/week |

That is roughly half the ~1 hr/week the engine spec allocated to LinkedIn repurposing. Running under budget is deliberate, given how reliably a Vora sprint week consumes the margin.

**Scorecard: two new lines.**

- Assessment completions per week, band-tagged so it splits by audience automatically
- Follower count per channel, monthly rather than weekly

Explicitly not tracked: views, likes, impressions, engagement rate. None route to revenue and all invite a vanity spiral.

**Gates:**

- A channel earns continued investment at 10 or more assessment completions per month for two consecutive months.
- A channel producing fewer than 3 per month for three consecutive months is dropped, not optimized. Instagram is the likeliest casualty, having been the marginal addition, and dropping it is an acceptable outcome rather than a failure.
- Whole-effort kill criterion: if the monthly batch is skipped four or more times in the first three months, cut to LinkedIn text-only rather than sustaining a cadence being missed.

**Pressure valve**, consistent with the engine spec's: when a Vora sprint week overloads, video drops first. The LinkedIn essay is last to cut, being the cheapest unit and the one serving the buyer who writes the $6,000 check.

## Open items

1. Handle availability across four platforms. Founder-only; requires logins. First checklist item.
2. Reconcile the assessment question count. `/resources` describes 18 questions; 16 question stems were read out of `ReadinessScorecard.tsx`. Affects the schedule by at most one week.
3. `harden-subscribe-route` chip must land before the band router goes live (see §2.1).
4. Brand-voice profile copy for the founder brand, authored rather than inherited (§3 step 3).
5. Clinic recordings as YouTube long-form: the first clinic predates the channel, so back-publishing order needs deciding when the channel exists.

## Decisions log

| Decision | Choice | Rejected |
|---|---|---|
| Audience | Both, split by platform | Operators-only, owners-only, broad founder brand |
| Production model | Light on-camera, batched monthly | Faceless screen-capture, repurpose-only, fully produced |
| Platforms | LinkedIn, YouTube, Facebook, Instagram | LinkedIn+YouTube only; adding TikTok and X |
| Identity | Reposition personal LinkedIn; new YouTube/IG/FB surfaces | Full separation via Company Page; no separation; personal untouched |
| Editorial spine | Curriculum, indexed to the readiness assessment | Leak of the week, proof-of-work, curriculum plus dogfood diary |
| Audience routing | Assessment band routes to list at capture | Segmenting within the feeds |
| Publishing stack | Vora social layer (dogfood) | Late API plus n8n; manual posting |
| Scope | Setup kit, content system, and automation | Setup kit only; adding site changes now |
