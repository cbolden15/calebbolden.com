# Build sprint runbook

*Fill this in at the start of Phase 4 (Pilot), right after the roadmap picks the pilot candidate. It turns one line on the 90-day roadmap into a bounded build, tracks the gates while the build is live, and closes with the handoff that makes the system the client's, not mine. Nothing in the Scale phase happens until this document exists.*

---

## Why this exists

The roadmap tells us what to build next. This runbook tells us how to build it without scope creep, how to know when it's safe to turn on, and how to hand it over so the client can run it without me. Three artifacts live inside it: the scoping doc (before the build), the gate checklist (during the build), and the handoff package (at the end). A build sprint that skips any of the three isn't done, it's just stopped.

## 1. Scoping doc template

*Written in the first two to three days of the sprint, before any code gets touched. This is the boundary of the fixed fee: what's in, what's out, and what the build depends on that isn't mine to fix.*

### 1.1 The one-line description

What this system does, in a sentence the owner could repeat back. If it takes two sentences, the scope is still too broad; split it or cut it.

### 1.2 Inputs

| Input | Where it comes from | Format | Who owns it |
|---|---|---|---|
| | | | |

Every input the system reads to do its job: job records, price books, customer data, prior tickets. "Where it comes from" names the actual system (the CRM, a shared spreadsheet, an inbox), not "the business."

### 1.3 Systems touched

| System | What the build does to it | Read or write |
|---|---|---|
| | | |

Anything the build reads from or writes to: the CRM, the invoicing tool, email, SMS, a scheduling app. A system missing from this table is a system the build has no business touching once it ships.

### 1.4 Integration points

For each system in 1.3 with write access, name the actual mechanism: API, webhook, scheduled export, browser automation. Note the auth method (API key, OAuth, a service account) and who provisions it. This section is where "should be straightforward" gets tested before the client's calendar gets committed to it.

### 1.5 Success metric

One number, defined the same way it was defined on the roadmap slide (the audit's Slide 11 sets this first). What result triggers scale, what result triggers stop, both stated as numbers, not adjectives.

### 1.6 Out of scope

Explicit list of adjacent things this build will not do, even if they come up during the sprint. Anything a client asks for that lands here becomes a change order, not a scope addition on the original fee. The boundary only protects both sides if it's written down before the build starts.

### 1.7 Sign-off

Client and Caleb both sign the scoping doc before build work starts on anything beyond the scoping itself.

Client: ____________  Date: ____________
Caleb: ____________  Date: ____________

## 2. Build-phase gate checklist

*The gate register (see `gate-register-template.md`) already defines what the AI may and may not do. This checklist tracks when each of those gates gets armed during the build, so nothing goes live half-wired.*

| Build milestone | Gate state required | Who verifies | Sign-off |
|---|---|---|---|
| First code that touches a real system (not a sandbox) | Every hard block and approval gate from the register is coded and testable, even if not yet wired to production data | Caleb | |
| Shadow run starts (system runs, touches nothing live) | No gate can be bypassed in shadow mode; a shadow run that can accidentally write is not a shadow run | Caleb | |
| Canary (small live slice) | All approval gates route to a named person who has confirmed they'll respond within the agreed window; stop-and-call conditions tested against at least one real out-of-pattern input | Caleb, client approver | |
| Full rollout | Output check sheet (see `output-check-sheet-template.md`) has a golden set, a threshold set from the shadow-run baseline, and a named person who reviews the monthly sample | Client | |
| Handoff | Client has walked through triggering a hard block and an approval gate live, not just been told about them | Client | |

No milestone advances without its row signed off. A gate that isn't armed by the milestone it's required at is a stop, not a note for later.

## 3. Handoff runbook template

*This is the artifact `/method` promises: "the runbook gets written, and ownership transfers to you." Filled in during the last week of the build, reviewed with the client at the training session (section 4), delivered as a standalone document the client keeps.*

### 3.1 What was built

Plain description: what the system does, which roadmap item it came from, when it went live. No architecture diagram jargon; write it the way you'd explain it to the person who'll actually run it.

### 3.2 How it runs

Where it lives (which server, which account, which tool), how it starts and stops, what triggers it (a schedule, an event, a person clicking something), and where its logs or output land. Include the login the client will actually use day to day, not the admin credentials.

### 3.3 How to operate it

Day-to-day tasks the client's team will do: approving a queued action, reviewing a flagged item, checking the dashboard. Screenshot or walk through each one. This section is the one staff will reopen six weeks after training when they've forgotten the details.

### 3.4 Failure modes and what to do

| If this happens | It means | Do this | Call this person if it doesn't resolve |
|---|---|---|---|
| A stop-and-call fires | The system hit something outside its pattern | Handle the case manually, note it | |
| An approval queue backs up | Nobody's checking it, or volume spiked | Assign a backup approver | |
| Output looks wrong on a spot check | Possible drift, or an upstream system changed | Flag it, don't wait for the monthly report | |

Pulled from the gate register's "while waiting" column and the failure categories on the output check sheet. Add anything specific to this build that came up during shadow or canary.

### 3.5 Who to call

Named contacts for: a gate malfunctioning, a system it's wired into changing, and general questions once the sprint closes. If the client is on the assurance retainer, this is where that gets stated; if not, this is where the client's own IT or ops contact goes instead.

## 4. Training session outline (60-90 minutes)

*Run once, near the end of the build, with the owner and whoever will operate the system day to day. Recorded if the client agrees; the recording becomes part of the handoff package.*

| Time | Segment | Content |
|---|---|---|
| 0-10 min | What this replaces | Walk the old process from the audit's map, then show where this system sits in it now |
| 10-25 min | Live walkthrough | Run the system on a real (or realistic) input, end to end, narrating each step |
| 25-40 min | Hands-on | The staff member who'll actually operate it does it themselves, with Caleb watching, not driving |
| 40-55 min | The gates | Trigger an approval gate and a stop-and-call live, so the team has seen both fire at least once before it happens for real |
| 55-70 min | Failure modes | Walk section 3.4 of the runbook, ask what questions come up |
| 70-85 min | Q&A and the escalation path | Confirm everyone in the room knows who to call and when |
| 85-90 min | Sign-off | Confirm the runbook has been received and understood (section 5.3) |

If a client's team is larger than the room can hold live, this session gets recorded and a second working session gets scheduled for questions after people have used the system for a week.

## 5. Ownership-transfer checklist

*Closes the sprint. Nothing here is optional; a build that's technically working but hasn't cleared this list isn't handed off, it's just deployed.*

| Item | Done | Notes |
|---|---|---|
| Credentials rotated to client-owned accounts (no service still running on Caleb's personal keys or logins) | | |
| Access Caleb no longer needs revoked (per the offboarding norms in the client-credential vault process) | | |
| Handoff runbook (section 3) delivered as a standalone document | | |
| Training session (section 4) completed and, if recorded, the recording delivered | | |
| Gate register and output check sheet handed to the named client owner, not just referenced | | |
| Success metric from the scoping doc (1.5) measured and compared against the baseline | | |
| Client acceptance signed | | |

### 5.3 Acceptance

Client confirms the system matches the scoping doc, the runbook was received, and ownership has transferred.

Client: ____________  Date: ____________
Caleb: ____________  Date: ____________

## Worked example (25-person HVAC company, quote-to-invoice)

Continuing the example from the gate register and output check sheet: the pilot automates quote drafting and invoice generation.

- **Scoping doc:** inputs are job notes (from the field app) and the price book (a shared spreadsheet, owned by the office manager). Systems touched: the CRM (write, new quote records) and the invoicing tool (write, on job completion). Out of scope, written down before the sprint started: scheduling and dispatch, even though the owner asked about it twice during the interview.
- **Gate checklist:** the approval gate on quote sends (from the gate register's row 2) gets tested in canary against three real out-of-pattern line items before full rollout.
- **Handoff runbook:** the failure-mode table's first row is exactly the gate register's row 1 ("any line item not in the price book"), restated for the office manager who'll actually see it fire.
- **Training:** the office manager runs a real quote through the system during the hands-on segment, then triggers the approval gate on a quote over $5,000 to see it queue.
- **Ownership transfer:** the CRM and invoicing API keys move from Caleb's Vora account to a service account the office manager controls before the sprint closes.

*This runbook feeds the client's own operating rhythm going forward: the failure-mode table (3.4) becomes the first entry in the assurance retainer's failure log if the client stays on for monthly checks, and the golden set from the output check sheet keeps scoring the system whether or not they do.*
