# The Charted checklist

*Twenty checks before, during, and after you put AI into your business. Most AI projects don't fail because the AI was dumb. They fail because nobody did these.*

---

RAND interviewed 65 experienced data scientists in 2024 and found that more than 80 percent of AI projects fail, roughly double the failure rate of ordinary IT projects. The pattern behind the number is consistent: businesses automate work they never mapped, launch without a baseline, and stop paying attention after go-live. Every item below exists because I've watched one of those three mistakes cost somebody real money.

## Before you buy anything

- [ ] **1. Write down the process the AI would touch, step by step.** If you can't list the steps, you're not ready to automate any of them.
- [ ] **2. Ask whether each step should exist at all.** Deleting a step is free and never drifts. Automating a pointless step just makes the pointless thing happen faster.
- [ ] **3. Check where the data for each step lives.** If the answer is "in Dave's head," the AI has nothing to work with until that changes.
- [ ] **4. Try a dumb rule first.** If a spreadsheet formula or a simple if-then covers it, you don't need AI there, and the rule will never hallucinate.

## Know your numbers first

- [ ] **5. Time the work as it happens today.** Minutes per task, tasks per week, who does them. This is your baseline.
- [ ] **6. Count today's error rate too.** Humans make mistakes. If you don't know how many, you can't tell whether the AI is an upgrade.
- [ ] **7. Agree on one success number before anything gets built.** One metric, written down, with the number it has to beat.
- [ ] **8. Agree what "stop" looks like.** Decide up front what result kills the project. It's much harder to cancel something after you've paid for it.

## Gate the risky parts

- [ ] **9. List every action that would hurt if the AI got it wrong.** Sending money, contacting customers, changing records, deleting anything.
- [ ] **10. Put an approval in front of each one.** The AI prepares the action; a person you name clicks yes. No exceptions in the first 60 days.
- [ ] **11. Make sure a retry can't double-fire.** If the system runs twice, the customer must not get two emails, two charges, or two of anything.
- [ ] **12. Never let it bill on failure.** If the work didn't complete, no invoice, no charge, no "done" status.
- [ ] **13. Give the AI a way to give up.** When it hits something it doesn't recognize, it should stop and hand off to a person, not guess.

## Test like it matters

- [ ] **14. Run it in the background first.** Let the AI do the work in parallel while humans still do the real thing, and compare.
- [ ] **15. Score the humans on the same test.** The AI has to match or beat your team's real accuracy, not a number from a vendor slide.
- [ ] **16. Go live on a small slice.** A few customers, one crew, one location. Earn the full rollout.
- [ ] **17. Keep ten to twenty examples of the work done right.** That's your answer key. Every future check uses it.

## Keep checking after it ships

- [ ] **18. Sample the output every month.** Pull twenty real outputs at random and score them against your answer key. AI output drifts as your business and the models change.
- [ ] **19. Put the score where you can see it.** One number, monthly, next to last month's. Falling two months in a row means something changed.
- [ ] **20. Log every failure once, with its fix.** Diagnose each mistake one time, write it down, and check for it forever.

---

## Scoring yourself

Count your checks for any AI you're running or about to buy.

**16 or more** means you're running AI more carefully than most enterprises. The gaps you have are probably in the monthly checking, and those are cheap to close.

**9 to 15** means you've got real protection with real holes, usually in the "keep checking" section. Drift is the failure you haven't met yet.

**Under 9** means stop before you buy or build anything else. You're not behind on AI. You're missing the process work that makes AI safe to own, and that work is cheaper than one bad automation.

Want a second pair of eyes? Send me a note about the one process you most want AI to take over, and I'll reply with the first three checks I'd run on it. Free, no obligation: **calebbolden.com/contact**

*Caleb Bolden maps business processes and builds AI that runs them, with guardrails. The safest AI is the one you keep checking.*
