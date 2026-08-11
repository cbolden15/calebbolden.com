# Gate register

*Fill this in during pilot design, before any build work starts. It turns the error-tolerance calls from the VSM AI overlay (Annotation 3) into concrete controls in the build. One row per automated step. The client signs the completed register before the pilot goes live.*

---

## Why this exists

The scoring pass tells us which steps get AI. This register decides what the AI is allowed to do at each of those steps, and what happens when it shouldn't act alone. Every step that scored "strong candidate" or "assist only" gets a row. No row, no build.

## Gate types

| Gate | What it means | Use when |
|---|---|---|
| Hard block | The system cannot take this action at all. A person does it. | Error tolerance is "legal or safety problem." |
| Approval gate | The system prepares the action and waits. A named person approves before it fires. | The action moves money, contacts a customer, or changes a record you can't easily undo. |
| Stop and call | The system acts freely until it hits something it doesn't recognize (low confidence, missing data, out-of-pattern input), then stops and hands off to a person. | Error tolerance is "costs money" or "loses a customer." |
| Log only | The system acts, and every action is recorded for the monthly check. | Error tolerance is "annoyance" and the action is easy to reverse. |

Two build rules that apply regardless of gate type:

1. Retries can't double-fire. If a step runs twice, the second run must detect the first (idempotency). This matters most for anything that sends or charges.
2. Nothing bills on failure. If a step fails, no invoice line, no charge, no completed status. Success first, then the money.

## The register

| # | Step (from the map) | Action the AI takes | Gate type | Trigger / condition | Who approves or gets called | While waiting, the AI... |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

## Worked example (25-person HVAC company, quote-to-invoice)

| # | Step | Action | Gate type | Trigger | Who | While waiting |
|---|---|---|---|---|---|---|
| 1 | Draft the quote | AI drafts from job notes and price book | Stop and call | Any line item not in the price book | Office manager | Holds the draft, flags the odd line |
| 2 | Send the quote | AI emails the customer | Approval gate | Every send, first 60 days; after that, quotes over $5,000 | Owner | Queues the send with a one-click approve |
| 3 | Invoice on completion | AI generates the invoice | Approval gate + no-bill-on-failure | Job not marked complete, or amount differs from quote | Office manager | Does not create the invoice |
| 4 | Payment reminder | AI sends reminder at 15/30 days | Log only | n/a | n/a | n/a |

## Sign-off

Client has read each row and agrees this is what the system may and may not do.

Name: ____________  Date: ____________

*The register feeds two later documents: the output check sheet (what we sample monthly) and the runbook (what the team does when a gate fires). Update it whenever a gate changes; loosening a gate is a decision the client makes, never a default.*
