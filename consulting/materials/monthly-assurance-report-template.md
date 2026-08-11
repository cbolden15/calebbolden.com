# Monthly assurance report

*The one-page report that goes to the client every month on the assurance retainer. One page means one page. The client should be able to read it over coffee and know whether their AI is still doing its job. Numbers come straight from the output check sheet; never send a report without a completed check behind it.*

---

## [Client name]: AI assurance report, [Month Year]

**Systems covered:** [list the live automations]
**Prepared by:** Caleb Bolden, Vora Technologies
**Check date:** [date]

### The score

| System | Sampled | Passed | Score | Threshold | Last month | Verdict |
|---|---|---|---|---|---|---|
| [e.g., Quote drafting] | 20 | 19 | 95% | 90% | 92% | Healthy |
| [e.g., Payment reminders] | 20 | 20 | 100% | 90% | 100% | Healthy |

Verdict is one of: Healthy / Watch (passed, but trending down) / Action taken (fell below threshold, see below).

### What the failures were

Plain language, one line each, from the failure log. If nothing failed, say so and move on.

- [e.g., One quote used a price-book entry that changed on the 3rd. Price book sync was a day behind. Fixed the same day; added the sync check.]

### What changed this month

- Gates: [any gate loosened or tightened, per the gate register, and who approved it]
- Golden set: [refreshed / due next on date]
- Tuning: [anything adjusted and why]

### The number that matters

[One sentence connecting the score to the business. e.g., "The quote system drafted 84 quotes this month; at your pre-pilot baseline of 25 minutes each, that's about 35 hours of drafting your team didn't do, at a 95% pass rate."]

### This month's build

[The retainer includes one new automation a month. What was built, or what's queued and why.]

### Anything I need from you

[Approvals waiting, decisions pending, or "Nothing this month."]

---

*Reporting rules: every number traces to the check sheet. A below-threshold score is reported as what happened, what it cost, and what was done, in that order, in the month it happened. Never smooth a bad month; the report's whole value is that the client can trust it more than they can trust the AI.*
