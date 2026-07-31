# VSM AI overlay (annotation and scoring method)

This is the layer that turns a standard value stream map into an AI opportunity map. Run it on the finished current-state map from `vsm-workshop-kit.md`, either the same afternoon if energy holds, or as its own session within a few days while the map is still fresh in people's heads.

This document is the method itself. Read it straight through once, then run it from the page during the session.

---

## What you're doing and why

A current-state map shows where time goes and where things break. It does not tell you which steps are worth pointing AI at. Most consultants stop at the map and hand over a generic "automate this" list based on gut feel. This overlay replaces gut feel with four annotations, applied to every step, that combine into a defensible call: strong candidate, assist only, or leave alone.

The four annotations, in order:

1. Data: where the information lives, and whether you'd trust it
2. Decision type: rule-based, judgment, or mixed
3. Error tolerance: what happens when the step is done wrong
4. Handoff type: how work moves from this step to the next

Each gets its own color sticky, written directly onto the step's spot on the map (or as a linked note in the digital board). Don't combine all four onto one sticky, you want to be able to scan the whole map for, say, every step with a D3 or every step marked "legal/safety" at a glance.

---

## Annotation 1: Data

**Question to ask the room:** "When someone does this step, where does the information they need actually come from?"

| Code | Definition | Example |
|---|---|---|
| D1 | Lives in a system of record, structured, and the room trusts it without double-checking | Job address and customer history pulled from the CRM; nobody re-verifies it by phone first |
| D2 | Lives in a system, but the room double-checks it, or it's spread across more than one system that don't agree | Pricing is in QuickBooks, but the tech also carries a paper price sheet because the QuickBooks numbers go stale; office staff cross-check both |
| D3 | Lives in someone's head, on paper, or in a habit, with no system backing it at all | The senior tech knows which customers are difficult to schedule and works around it from memory; nothing is written down |

Write the code and, in a few words, where it actually lives: "D3, dispatcher's memory of which crews are fast vs. slow."

A step can only be a strong AI candidate if its data is D1 or a well-defined D2. You cannot automate a step whose input is a supervisor's memory (D3) until that knowledge gets written down somewhere first, that's a prerequisite project, not an AI project.

---

## Annotation 2: Decision type

**Question to ask the room:** "If you had to write down the rule for how you make this call, could you? Or does it depend on reading the situation?"

| Code | Definition | Example |
|---|---|---|
| Rule-based | Could be written as a clean if-then statement, and the room agrees the rule covers nearly all cases | "If the customer hasn't paid the last invoice, hold the new job until payment clears" |
| Judgment | Depends on context, relationship, or experience that resists a clean rule | "Decide whether to waive the trip fee for a longtime customer having a bad week" |
| Mixed | Mostly rule-based, with judgment needed at the edges | "Approve the standard discount automatically, but a manager reviews anything above 15%" |

Rule-based steps are where automation or AI assistance does the most good with the least risk. Judgment steps need a human making the actual call, though AI can still surface information to help (that's assist, not automate). Mixed steps usually split into a rule-based majority and a judgment-based exception path, and the two paths should probably be scored separately if the volumes justify it.

---

## Annotation 3: Error tolerance

**Question to ask the room:** "If this step gets done wrong and nobody catches it, what actually happens?"

| Code | Definition | Example |
|---|---|---|
| Annoyance | Someone notices, it's mildly irritating, gets fixed in minutes | A confirmation text goes out with the wrong tech's name, customer mentions it, gets corrected on arrival |
| Costs money | Real dollars lost or wasted, but the business absorbs it and moves on | A quote gets sent with an outdated material price, job runs at lower margin than expected |
| Loses a customer | The customer leaves, or a specific relationship is damaged in a way that's hard to repair | A repeat customer's job is scheduled twice and no one shows up either time |
| Legal or safety problem | Regulatory exposure, contract liability, or physical safety risk | A gas line job is scheduled without confirming the tech holds the right certification; a contract is sent with the wrong liability terms |

Low tolerance (loses a customer, or legal/safety) means a human stays in the review loop even where AI assists, no matter how rule-based the step looks. High rule-based-ness does not override low error tolerance. A step can be perfectly rule-based and still need a human signing off, because the cost of the rare miss is too high.

---

## Annotation 4: Handoff type

**Question to ask the room:** "When this step finishes, how does the next person find out it's their turn?"

| Code | Definition | Example |
|---|---|---|
| System-to-system | Data moves automatically from one system to the next, no person re-keys or re-checks it | A paid invoice in Stripe automatically marks the job closed in the CRM |
| Human-to-system | A person enters something into a system, and the next step reads from that system automatically | Dispatcher types the job into the CRM; the scheduling system picks it up from there without anyone re-entering it |
| Human-to-human | One person tells another directly, verbally or by message, with no system involved | The tech calls the office to say the job is done; the office manually updates a spreadsheet |
| System-to-human | A system produces something, but a person has to notice it and act, nothing pushes it to them | A report sits in a shared drive; someone has to remember to check it |

Human-to-human and system-to-human handoffs are where work dies: they depend on someone remembering to check, call, or forward something, with no automatic prompt. These are usually the highest-leverage places to add either a notification, a status field, or a direct system integration, even before touching AI. Note it on the map even when a step itself isn't a strong AI candidate, because fixing the handoff is often cheaper than automating the step.

---

## Scoring pass: combining the four into a call

Once every step carries all four annotations, walk the map a final time and assign one of three calls per step.

**Strong candidate.** Data is D1 or clean D2, decision type is rule-based (or the rule-based majority of a mixed step), and error tolerance is annoyance or costs-money. These steps are structured, well-defined, and forgiving of an occasional miss. This is where you point AI or automation first.

**Assist only.** Any one of: decision type is judgment or mixed-with-real-judgment, or error tolerance is loses-a-customer or legal/safety, or data is D3. AI can draft, summarize, surface information, or pre-fill, but a human makes the final call and stays accountable for it. This is the majority of steps in most office and service processes, and that's fine, it doesn't mean nothing here is worth doing.

**Leave alone.** Data is D3 with no near-term path to being written down, or the step is infrequent enough (a handful of times a year) that building anything around it doesn't pay for itself, regardless of the other three annotations. Flag these so the client stops wondering why they're not on the roadmap.

Quick reference:

| Data | Decision | Error tolerance | Call |
|---|---|---|---|
| D1/D2 | Rule-based | Annoyance / costs money | Strong candidate |
| D1/D2/D3 | Judgment / mixed | Any | Assist only |
| Any | Rule-based | Loses customer / legal-safety | Assist only |
| D3, no path to structure | Any | Any | Leave alone |

Write the call directly on the step, in a fourth color, or a bold border around the existing stickies. The finished map should be scannable from across the room: which steps are strong candidates should visually jump out.

---

## Worked example: quote to invoice, 25-person HVAC company

Process spine from the mapping session (SIPOC bound: starts when a customer requests a quote, ends when the invoice is paid and the job is marked closed).

### Step 1: Customer calls or submits a form requesting a quote

- Actor: office admin
- System: phone or website form, logged nowhere structured yet
- Touch time: 5 min
- Wait time: near 0 (answered live or checked hourly)

Annotations:
- Data: D2 (customer's name and address are usually right, but service history is scattered between a paper file and the tech's memory of the last job)
- Decision: rule-based (log the request, no judgment needed yet)
- Error tolerance: annoyance (a missed detail here gets caught at the next step)
- Handoff: human-to-system (admin types the request into a shared spreadsheet)

Call: **strong candidate.** Capturing a quote request and pulling prior service history is exactly the kind of structured, low-stakes, rule-based work an AI intake assistant handles well.

### Step 2: Admin schedules a site visit for estimation

- Actor: office admin
- System: paper calendar plus a group text to available techs
- Touch time: 10 min
- Wait time: 2-4 hours (waiting for a tech to reply to the group text)

Annotations:
- Data: D3 (which techs are free depends on the admin's memory of who's on which job, cross-checked against a paper calendar that isn't always updated same-day)
- Decision: mixed (matching tech to job type is partly rule-based, like certification requirements, and partly judgment, like who's fastest with this customer)
- Error tolerance: costs money (double-booking a tech means a rescheduled visit and an annoyed customer, rarely a lost one)
- Handoff: human-to-human (group text, no system of record)

Call: **assist only**, and the handoff is the real problem here, not the AI potential. The scheduling data (D3, paper calendar) needs to become structured before automation makes sense. Flag this to the client as a data-and-handoff fix that has to happen before this step becomes a strong candidate later.

### Step 3: Tech visits site, estimates scope

- Actor: field tech
- System: none, tech's own expertise
- Touch time: 30-45 min on site
- Wait time: 0 (happens live)

Annotations:
- Data: D3 (tech's trained judgment, not written down anywhere)
- Decision: judgment (every site is different, this is exactly what the tech is trained and paid for)
- Error tolerance: costs money (a bad estimate means a bad quote, rarely worse)
- Handoff: human-to-human (tech tells the office what they found, usually by phone on the drive back)

Call: **assist only.** This step stays human end to end. A tech's on-site judgment is the product, not a bottleneck. The handoff back to the office (phone call, unstructured) is worth noting, but there's no automation candidate in the estimation itself.

### Step 4: Office builds the written quote

- Actor: office admin
- System: a Word template, prices pulled from a price sheet that's updated a few times a year
- Touch time: 20 min
- Wait time: 1 day (often batched and done at end of day)

Annotations:
- Data: D2 (the price sheet is a real system of record, but it's known to go stale between updates, so admin sometimes calls a supplier to confirm current cost on bigger jobs)
- Decision: rule-based (assemble a quote from the tech's notes and the price sheet, following a standard markup formula)
- Error tolerance: costs money (an outdated price shrinks the margin, doesn't usually cost the customer)
- Handoff: human-to-system (admin's draft becomes the quote document, which the customer receives directly)

Call: **strong candidate.** Structured inputs, a real rule for markup, and a forgiving error profile. An AI-assisted quote draft, pulling current prices and the tech's site notes into the template automatically, removes most of the manual assembly time.

### Step 5: Quote sent to customer, awaiting response

- Actor: office admin (send), customer (respond)
- System: email
- Touch time: 5 min to send
- Wait time: 2-5 days average, sometimes weeks

Annotations:
- Data: D1 (the quote itself is a clean structured document once step 4 produces it)
- Decision: rule-based (send it, then follow up if no response by a set number of days, a rule that currently isn't followed consistently)
- Error tolerance: annoyance (a late follow-up just delays revenue, doesn't usually lose the job)
- Handoff: system-to-human (the quote sits in an inbox, nobody's prompted to follow up, it depends on someone remembering)

Call: **strong candidate**, specifically for the follow-up half of this step. An automated reminder or a drafted follow-up message after N days of silence is a clean, low-risk automation win, and it's currently just not happening consistently, which the room already knew and called out during mapping.

### Step 6: Customer approves, job gets scheduled

- Actor: office admin
- System: same paper calendar and group text as step 2
- Touch time: 10 min
- Wait time: same as step 2, 2-4 hours

Annotations: same as step 2 (D3, mixed, costs money, human-to-human)

Call: **assist only**, same underlying fix as step 2. Worth flagging as one root cause rather than two separate findings, this is the same scheduling gap showing up twice in the process.

### Step 7: Job completed, tech submits paperwork

- Actor: field tech
- System: a paper work order, handed to the office at end of day or end of week
- Touch time: 5 min to fill out
- Wait time: up to a week (techs sometimes batch paperwork)

Annotations:
- Data: D3 while it's in the tech's truck, becomes D2 once handed in (paper, not digitized until the office re-keys it)
- Decision: rule-based (fill in what was done, materials used, hours)
- Error tolerance: costs money (a delayed work order delays invoicing, which delays cash)
- Handoff: human-to-human, with a wait-time problem (the paperwork physically has to reach the office)

Call: **strong candidate**, specifically for replacing the paper work order with a phone-based digital form the tech fills out on site before leaving. This is the step the room reacted to hardest during mapping (marked with a pain sticky): a week-long wait purely because paper has to physically travel.

### Step 8: Office re-keys the work order into QuickBooks and generates the invoice

- Actor: office admin
- System: QuickBooks, re-typing from the paper work order
- Touch time: 15 min
- Wait time: 1-2 days (batched with other admin work)

Annotations:
- Data: D2 (the paper work order is trusted, but re-keying it introduces occasional typos)
- Decision: rule-based (standard formula: hours plus materials plus markup)
- Error tolerance: costs money (a re-keying error under- or over-bills, usually caught and corrected)
- Handoff: human-to-system (admin manually transfers paper data into QuickBooks, no integration)

Call: **strong candidate.** If step 7 becomes a digital form, this step nearly disappears, the work order data flows straight into the invoice without a re-keying pass at all. Even without fixing step 7 first, this is a clean automation target on its own.

### Summary table

| Step | Data | Decision | Error tolerance | Handoff | Call |
|---|---|---|---|---|---|
| 1. Quote request intake | D2 | Rule-based | Annoyance | Human-to-system | Strong candidate |
| 2. Schedule site visit | D3 | Mixed | Costs money | Human-to-human | Assist only |
| 3. On-site estimate | D3 | Judgment | Costs money | Human-to-human | Assist only |
| 4. Build written quote | D2 | Rule-based | Costs money | Human-to-system | Strong candidate |
| 5. Send quote, await response | D1 | Rule-based | Annoyance | System-to-human | Strong candidate |
| 6. Schedule job | D3 | Mixed | Costs money | Human-to-human | Assist only |
| 7. Tech submits paperwork | D3/D2 | Rule-based | Costs money | Human-to-human | Strong candidate |
| 8. Re-key and invoice | D2 | Rule-based | Costs money | Human-to-system | Strong candidate |

Four strong candidates (1, 4, 5, 8), one more (7) whose fix also shrinks step 8's work, and two recurring assist-only steps (2, 6) that share a root cause worth naming once instead of twice.

---

## Feeding the kaizen prioritization workshop

The scored map is the direct input to the next session, not a separate deliverable that sits on a shelf. Bring three things into kaizen prioritization:

1. **The list of strong candidates**, each with its step number, a one-line description of what AI or automation would actually do there, and the pain marker from the original map if one exists (steps the room already flagged as painful make an easier sell for where to start).
2. **Root-cause groupings**, where the same underlying gap shows up in more than one step (like the paper calendar behind both step 2 and step 6 in the example above). Fixing the root cause once is usually higher leverage than treating each occurrence as a separate project.
3. **The assist-only and leave-alone steps**, so the room understands why they're not on the shortlist. This heads off the "why isn't AI fixing my hardest problem" conversation before it starts. Judgment-heavy steps, like the on-site estimate in the example, are often the steps a business owner most wants automated and least should.

In kaizen scoring, each strong candidate still gets scored on effort and impact like any other improvement idea. The AI overlay narrows the field to what's structurally sound to automate. It doesn't replace the prioritization call on what to build first, it makes sure the ideas entering that call are ones AI can plausibly help with, not just ideas that would be nice.
