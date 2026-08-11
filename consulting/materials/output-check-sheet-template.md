# Output check sheet

*Written during pilot design, at the same time as the gate register. This defines the standard the AI's output gets scored against, forever. If we can't fill this sheet in, the candidate isn't ready to build.*

---

## Why this exists

You can't trust output you never check, and you can't check output without a standard. This sheet sets the standard once, with the client, before the build. The same sheet is used to score the shadow run, the canary, and every monthly check afterward. Nothing about the standard changes without the client agreeing in writing.

## 1. The standard

For the step being automated, define what a good output is. Three to six criteria, each one checkable by a person in under a minute. Write them so a new office hire could apply them.

| # | Criterion | Pass looks like | Fail looks like |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 2. The golden set

Ten to twenty real, completed examples of this work done right, pulled from the client's own records during the audit. This is what "correct" means here. Refresh it quarterly; a business changes, and last year's perfect quote may be this year's wrong price.

Location of golden set: ____________
Last refreshed: ____________

## 3. Sampling plan

| Setting | Value | Notes |
|---|---|---|
| Sample size per check | 20 outputs (or all of them, if volume is under 20) | Random, not cherry-picked |
| Check cadence | Monthly (weekly during the first 60 days) | |
| Pass threshold | ____ of 20 must pass all criteria | Set during shadow run, from the human baseline |
| Automatic escalation | Two consecutive checks below threshold, or any single legal/safety fail | Triggers a review with the client, and the gate register tightens until resolved |

The threshold comes from the baseline, not from wishful thinking. During the shadow run, score the humans on the same sheet. The AI must match or beat that number to go live, and stay at it to remain live.

## 4. Failure log

Every failed sample gets one line. The point is to diagnose each failure once, not to rediscover it monthly.

| Date | What failed | Category (input data / missing rule / model behavior / process change) | Fix | Fixed on |
|---|---|---|---|---|
| | | | | |

## Worked example criteria (HVAC quote drafting)

1. Every line item exists in the current price book at the current price.
2. Labor hours are within the range for that job type in the golden set.
3. Customer name, address, and job description match the job ticket.
4. No quote exceeds $10,000 without an itemized breakdown.

*Sheet is filled in with: ____________ (client) on ____________. Scores from this sheet feed the monthly assurance report.*
