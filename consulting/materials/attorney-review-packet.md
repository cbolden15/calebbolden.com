# Attorney review packet: cover memo

**DRAFT TEMPLATE. NOT LEGAL ADVICE. FOR ATTORNEY REVIEW BEFORE USE.**

This is the cover memo that goes to the reviewing attorney along with the contract drafts. Nothing in this packet has been reviewed by a licensed attorney. Fill in the bracketed items before sending.

---

**To:** [ATTORNEY NAME], [FIRM]
**From:** Caleb Bolden, Principal, Vora Technologies LLC
**Date:** [DATE]
**Subject:** Flat-fee review of a consulting MSA and SOW template, with three specific questions

## What this is

I run Vora Technologies LLC, a Texas LLC. I am launching an AI and process consulting practice serving local small businesses. The same entity also operates AI software products, which matters for a couple of the questions below.

Engagements will follow a master agreement plus per-project statement of work structure. No client has signed anything yet, and no client will sign anything until this review is back and the changes are made.

## What is enclosed

1. **Master services agreement draft** (`msa-template.md`). Covers definitions, the engagement model, fees, term and termination, intellectual property, confidentiality, AI-specific terms, limitation of liability, insurance, contractor status, non-solicitation, and general provisions. Bracketed placeholders mark the items I expect to decide with your input, including governing law and dispute resolution.

2. **Statement of work template** (`sow-template.md`). Incorporates the MSA by reference. Covers engagement type and scope, deliverables, timeline and milestones, fixed fee, payment schedule, change orders, client responsibilities, acceptance, and signatures. It is written to be readable by a small business owner in about ten minutes.

Neither document has been reviewed by counsel. Both were drafted in-house from published templates and secondary sources.

## What I am asking for

A **flat-fee review** of both documents, including **one round of revisions** after I respond to your first pass.

- Please **confirm the flat fee in writing before you start**, and tell me whether the revision round is inside that fee or billed separately.
- I need the written review back by **Tuesday, August 18, 2026**. Please tell me right away if that is not workable, because I have a launch date behind it.
- I am happy to do a 30 to 60 minute intake call at whatever point is most useful to you.

If any of the three questions below falls outside what you handle, please say so up front rather than working around it. I would rather book a separate consult for that piece than get a hedge.

## Question 1: liability cap, and splitting advice work from implementation work

The MSA currently has a single liability structure in Section 8: a mutual exclusion of consequential and indirect damages (8.1), a cap tied to fees paid under the applicable SOW in the preceding 12 months (8.2), and carve-outs for confidentiality breach, IP indemnification, and gross negligence or willful misconduct (8.3).

My concern is that this treats two very different kinds of work the same way. Some engagements are advice only: I assess a business, write findings, and recommend a roadmap. The client decides what to do with it. Other engagements are implementation: I build an automation and wire it into systems the business runs on.

What I would like you to consider and advise on:

- For **advice-only engagements**, whether a no-reliance clause is appropriate and enforceable in Texas, making clear that the client is responsible for its own decisions based on the advice.
- For **implementation engagements**, whether a cap at one to two times the fees paid under that SOW, with consequential damages excluded, is the right structure and the right number for this kind of work.
- Whether the split should live in the MSA as two liability tracks selected by the SOW, or whether the SOW should carry engagement-specific liability language. I have no view on which is cleaner. I want yours.
- Whether the current 8.2 language is internally consistent. It refers to aggregate liability across the agreement and all SOWs but then measures the cap against a single applicable SOW, and I am not sure those say the same thing.
- Section 8.3(b) carves out indemnification obligations for IP infringement, but the MSA does not contain an indemnification section anywhere. Either the carve-out is pointing at nothing, or the agreement is missing a clause. Please tell me which, and draft what is needed.
- If any deliverable ever includes a promise to the client that AI-generated output is free of third-party IP claims, whether that promise can survive the cap or whether it makes the cap illusory.

## Question 2: explicit IP assignment for deliverables, including AI-generated output

Section 5.1 of the MSA says the client owns the deliverables on full payment. I do not think that language does the job, for two reasons.

First, under US copyright law, work-for-hire does not automatically apply to independent contractors outside the statute's enumerated categories. My understanding is that an **explicit, irrevocable present assignment** of all right, title, and interest is required, and that a bare statement of ownership is not the same thing. Please draft the assignment language you would want to see, including any further-assurances obligation and any moral-rights waiver you think belongs there.

Second, and specific to this practice: **purely AI-generated output may not be copyrightable at all** under current US Copyright Office guidance, because it lacks human authorship. That means an assignment of copyright may be assigning nothing in some cases. I would like the contract to assign whatever rights do exist, however they arise, and to be drafted so it does not fall apart if a court or the Copyright Office later says a given output was never protectable. Please advise on how to handle this.

Related, and please tell me if it creates a conflict: Section 5.2 reserves my pre-existing IP and residual know-how, and grants the client a perpetual license to any of my property embedded in the deliverables. I want to keep reusing my own frameworks, scoring models, and code libraries across clients. I need that reservation to survive alongside whatever assignment language you add.

## Question 3: TRAIGA applicability

The Texas Responsible AI Governance Act took effect January 1, 2026. My understanding is that it applies broadly to parties who develop or deploy AI systems doing business in Texas. I have two exposures and need to know whether either one is covered.

**(i) My own website.** calebbolden.com runs an AI chatbot that visitors interact with, plus two interactive AI-assisted tools (an AI readiness scorecard and a revenue leak calculator) that collect a visitor's email in exchange for a report. The chatbot runs on a third-party model API. If disclosure, documentation, or any other obligation attaches, I need to know what to put on the site and by when.

**(ii) AI systems I build and deploy for clients.** In a build sprint I configure and deploy AI-driven automations inside a client's business. I want to understand whether that makes me a developer, a deployer, both, or neither under the statute, and how that changes if the client operates the system after handoff.

Then the contract question: **does the MSA need a TRAIGA allocation clause** that assigns responsibility for compliance between me and the client for systems I build and they operate? If so, please draft it. If TRAIGA is outside your practice area, please tell me now and I will book a separate AI regulatory consult rather than have this question answered indirectly.

## Two more things to flag

**Insurance representation and its effective date.** Section 9.1 says I will maintain errors and omissions insurance at $1M per claim and $2M aggregate for the duration of the agreement. **My E&O policy is not bound yet.** Applications are out to three carriers, and I expect a binder or certificate before I sign anything with a client. I do not want a representation in the contract that is untrue on the day it is signed. Please add effective-date or condition language so the insurance obligation attaches when coverage is in force, or advise on a cleaner way to handle it. Whatever you draft, my own rule is that no client signature happens before the policy binds.

**Payment terms sanity check.** My intended default, reflected in the SOW template, is a 50% deposit due at signing before any work starts, the balance due on delivery, ACH preferred, and Net 15 offered only to clients who have already paid on time on a completed engagement. Please tell me whether that holds up in Texas for small business clients, and specifically:

- whether "work does not start until the deposit clears" is enforceable as written in Section 5.2 of the SOW;
- whether the deposit should be characterized as non-refundable, and what that requires;
- whether MSA Section 3.3, which sets a blanket net 15 due date for all invoices, conflicts with the SOW's due-on-receipt default and the payment-history condition on Net 15. The SOW says it controls, but I would rather the two documents just agree;
- whether the late-payment interest rate placeholder in Section 3.3 should be a specific number or a reference to the Texas statutory maximum.

## Practical notes

- **Governing law and venue** are placeholders in Section 12.1 and 12.2. I am in Texas, clients will be Texas small businesses, and I have no preference beyond what protects me. Section 12.2 offers negotiation-then-litigation or arbitration and asks for a choice with counsel. That choice is yours to recommend.
- **Confidentiality survival** in Section 6.4 is an unresolved placeholder between a term of years and indefinite protection for trade secrets. Please pick and draft.
- The **survival list in Section 4.5** names Sections 5, 6, and 8. Section 11's non-solicitation obligation runs 12 months past termination but is not listed. Please check the list is complete.
- Once the review is back, both documents go into an e-signature tool as reusable templates, so **clean, final language with placeholders clearly marked** is more useful to me than tracked comments alone.
- Contact: [EMAIL], [PHONE]. Fastest way to reach me is [EMAIL/PHONE].
