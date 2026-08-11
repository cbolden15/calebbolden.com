PENDING: pricing decision (recommended $1,500 base / $750 founding) and Caleb's approval
before any of this goes public or into a proposal.

# Founding-client offer terms

## Slots

Three. First three signed clients only, tracked in the CRM pipeline as they close, not as
they inquire. A signed client is one who has paid the deposit (see payment schedule below),
not one who has had a discovery call or received a proposal.

## Expiry

Slots close when filled or on 2026-10-31, whichever comes first. After either trigger, the
offer stops appearing anywhere (site, proposals, email templates) and the audit reverts to
its standard price for all new inquiries.

## Scope

Exactly the Process & AI audit as advertised on `/results` and `/method`, nothing added on top
to sweeten the discount:
- Two to three weeks inside the business
- Interviews with the owner and the people who do the work
- The core process mapped and annotated for automation
- A scored shortlist of AI opportunities, ranked by payoff and feasibility, data readiness,
  and risk
- A 90-day roadmap with one recommended pilot

No build sprint, no assurance retainer, and no extra deliverables are bundled into the
founding rate. Those are separate engagements, quoted separately, at standard rates, whether
or not the client came in on a founding slot.

## Pricing

Recommended: $1,500 base rate, $750 founding rate for the first three. This is the item
pending Caleb's sign-off (see plan decision 2, `docs/plans/2026-08-11-consulting-go-live.md`).
Both numbers must be corrected together everywhere they appear (`/results`, `/method`,
`Packages.tsx`, the proposal template, and any cold-email or LinkedIn copy that quotes a
price) once the decision lands. Do not let the founding rate update without the base rate
updating in the same pass, or the discount math on the page stops being true.

## Payment schedule

Same as the SOW default: 50% deposit to start, balance due on delivery of the audit
deliverables (the map, the scored shortlist, and the 90-day roadmap). No Net 15 terms for
founding clients; that tier only applies after payment history exists, per the SOW.

## The case-study trade, stated plainly

This replaces the current site language, which contradicts itself: `/results` currently says
both "if a number comes back weak, it goes up weak" and "anything you want out comes out" in
the same paragraph. Those can't both be true, since a client asking to cut a weak number out
is exactly the case the first sentence rules out. The resolved terms:

- The client agrees, in writing, before the audit starts, to a published case study using
  their real business name and real measured figures.
- Editorial rights are limited to two things: the client may request redaction of identifying
  operational details (internal system names, specific staff names, proprietary process
  details that would expose competitive information) and may request redaction of individual
  staff members' names from quotes or attribution.
- Editorial rights do NOT extend to the results figures themselves. Whatever the audit and any
  follow-on build actually measure publishes as measured. A weak number publishes weak. There
  is no post-hoc veto over the numbers, only over which operational and personal details
  surround them.
- The client reviews the write-up before publication and can flag factual errors or
  identifying-detail concerns. They cannot flag a number they don't like as a factual error.
- What gets measured is agreed in writing before the engagement starts (this is already the
  case-study-consent gate the go-live plan calls for), so there's no dispute after the fact
  about what "the numbers" were supposed to cover.

## Exact replacement copy block for `app/results/page.tsx`

Copy only. Do not edit the page; hand this to whoever implements Deploy 2's founding-offer
copy update (go-live plan, Workstream B, item 5).

This block assumes the $1,500 / $750 pricing decision has been approved. If Caleb picks
different numbers, substitute them before use; the structure and the editorial-rights
language should not change.

```
The audit starts at $1,500. Fixed scope: two to three weeks inside your business, a map of
your two or three core workflows, a data-readiness check, a scored shortlist of what AI can
actually pay for, and a 90-day plan. You keep all of it whether or not I build anything.

The first three clients get that audit for $750 and first call on build slots. Slots close
when filled or on October 31, 2026, whichever comes first.

Here is the trade, plainly. You get the discount and the front of the queue. I get to publish
what happened on this page with your name on it and the real figures: what it cost, what it
returned, how long it took. We agree in writing on what gets measured before I start. Once the
engagement runs, the results figures publish as measured, weak or strong. You can ask me to
redact operational details or staff names before it goes up. You can't ask me to leave out a
number because you don't like it.

Three slots. After those, the audit is $1,500 and the studies on this page already have names
on them.
```
