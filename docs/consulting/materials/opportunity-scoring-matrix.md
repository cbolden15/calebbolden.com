# Opportunity scoring matrix

Scoring instrument for the shortlist that comes out of the kaizen opportunity workshop. Use it live at the end of the workshop if the group has energy left, or run it afterward and bring the ranked backlog back to the client for sign-off. Either way, this is the last filter before candidates become roadmap items or a pilot charter.

## The four dimensions

Score each candidate 1 to 5 on each dimension. The anchors below are written so an SMB owner can self-score without a facilitator translating for them.

### 1. Impact

Hours saved or revenue captured per week, in dollar terms where possible.

| Score | Definition |
|---|---|
| 5 | 10+ hours/week of owner or skilled-staff time freed, or direct revenue leakage stopped (missed calls, abandoned quotes, late invoices) |
| 4 | 5 to 10 hours/week freed, or a clear but smaller revenue effect |
| 3 | 2 to 5 hours/week freed, noticeable but not enough to change headcount or cash flow |
| 2 | Under 2 hours/week, or the benefit is mostly comfort or convenience rather than money or time |
| 1 | Effect is marginal or unclear; nobody could say what changes if this is fixed |

### 2. Feasibility

How proven the automation pattern is, and how hard the integration will be.

| Score | Definition |
|---|---|
| 5 | Off-the-shelf pattern, existing APIs or native integrations available, no custom model work |
| 4 | Proven pattern, but needs some custom glue between two or more systems |
| 3 | Doable, but requires meaningful configuration or a workaround for a system with limited export options |
| 2 | Requires custom development, an unusual data format, or a system with only partial API access |
| 1 | Requires custom model work, or the system involved has no export path and no API at all |

### 3. Data readiness

Does the data the automation needs exist, digitally, in usable shape.

| Score | Definition |
|---|---|
| 5 | Data is clean, structured, and lives in one system already |
| 4 | Data is digital and mostly clean, but scattered across two or three systems |
| 3 | Data exists digitally but is messy: inconsistent formats, missing fields, needs cleanup work first |
| 2 | Data is partly digital, partly on paper, or locked in unstructured text (call notes, emails, handwritten forms) |
| 1 | Data is on paper, in someone's head, or doesn't exist as a record at all today |

### 4. Risk

Cost of the automation being wrong. This dimension is inverted: low risk scores high, because low risk is good.

| Score | Definition |
|---|---|
| 5 | Mistakes are cheap and immediately visible; a human can catch and correct them before any harm is done |
| 4 | Mistakes are minor and recoverable, might cost a little time to fix, no customer sees it |
| 3 | Mistakes are noticeable to a customer but recoverable with an apology or a quick fix |
| 2 | Mistakes could cost a customer relationship or create a real cleanup job |
| 1 | Mistakes could lose a customer outright, create legal exposure, or violate a compliance requirement (health, safety, licensing, financial reporting) |

## Weighting guidance

Default: weight all four dimensions equally. Add the four scores for a total out of 20. Equal weighting is the right default because it forces the room to actually look at data readiness instead of getting swept up by a big impact number.

Overweight data readiness (count it double, total out of 25) when:

- This is the client's first AI engagement and a failed pilot would kill the relationship before a second one gets a chance.
- The client has no in-house technical staff to troubleshoot data issues after you leave.
- The shortlist has more than one candidate above a 4 on impact, so you can afford to let data readiness break the tie instead of chasing the biggest number on paper.

Don't overweight impact just because the owner is excited about a number. A high-impact, low-data-readiness candidate is usually a data cleanup project wearing an AI costume. Score it honestly and let the bands below tell you what it actually is.

## Worked example: three sample candidates

| Candidate | Impact | Feasibility | Data readiness | Risk | Total | Rationale |
|---|---|---|---|---|---|---|
| Missed-call text-back (HVAC firm) | 5 | 5 | 5 | 4 | 19 | Impact is 5 because the firm loses an estimated 8 to 10 booked jobs a month to unanswered calls during peak season, real revenue leakage. Feasibility is 5 because missed-call auto-text is a standard pattern with mature APIs on every major phone and CRM platform. Data readiness is 5 because the only data needed is the caller's number, which the phone system already captures cleanly. Risk is 4, not 5, because a poorly worded auto-text could read as robotic and annoy a customer who wanted a human, but that's a copy fix, not a safety issue. |
| Auto-drafting quotes from site-visit notes | 4 | 3 | 2 | 3 | 12 | Impact is 4 because the estimator spends roughly 6 hours a week turning handwritten site notes into formal quotes. Feasibility is 3 because turning unstructured notes into a structured quote needs a real extraction step and a template mapping, more than a simple off-the-shelf hookup. Data readiness is 2 because the source is handwritten or loosely typed notes with no consistent format, someone will need to standardize the intake before this works well. Risk is 3 because a wrong quote reaches a customer before anyone reviews it, embarrassing and possibly costly, but recoverable with a follow-up call. |
| AP invoice entry | 3 | 4 | 4 | 5 | 16 | Impact is 3 because the bookkeeper spends about 3 hours a week keying invoices, real but not the biggest time sink in the business. Feasibility is 4 because invoice-capture tools with accounting-software integrations are mature and widely used, though this firm's specific AP software needs a small custom connector. Data readiness is 4 because invoices arrive as PDFs or emails, mostly consistent format from the same handful of vendors, with only a few outliers. Risk is 5 because a human still approves every payment before it goes out, so an extraction error gets caught before any money moves. |

Bands, applied: missed-call text-back (19) is a quick win, pilot it first. AP invoice entry (16) is solid, put it on the roadmap. Auto-drafting quotes (12) is conditional, the data readiness score of 2 says fix the intake process (standardize a site-visit form) before this becomes a good automation candidate.

## Score bands

| Total (out of 20) | Band | Meaning |
|---|---|---|
| 17 to 20 | Quick win | Pilot now. High confidence, low downside, good candidate for the first engagement. |
| 13 to 16 | Solid | Put it on the roadmap. Worth doing, not the first move. |
| 9 to 12 | Conditional | There's a real dependency blocking this, almost always data readiness. Name the dependency explicitly in the backlog (for example: "fix data first: standardize site-visit intake form") rather than just noting a low score. |
| 4 to 8 | Avoid | Park it. Say why in one sentence so it doesn't quietly resurface next quarter with the same problem unaddressed. |

## Tie-breaker rules

When two candidates land in the same band, or within 1 point of each other:

1. Prefer the candidate the owner personally feels every week. A candidate the owner runs into constantly builds more buy-in for the next round of work than one that's abstractly important but invisible to them day to day.
2. Prefer the candidate that produces a visible win inside the first engagement. Something a client can see, show a colleague, or reference in a testimonial does more for the relationship than a bigger but slower-to-land fix.
3. If still tied, default to the one with the higher data readiness score. It carries the least execution risk, and a clean first win sets up trust for tackling the harder candidates next.

## Blank scoring worksheet

| Candidate | Impact (1-5) | Feasibility (1-5) | Data readiness (1-5) | Risk (1-5) | Total | Band | Notes / dependencies |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
