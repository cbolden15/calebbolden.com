# Cold email sequence structure

This is the structure for the 3-phase outbound sequence, not the filled-in copy for a specific campaign. Reuse this skeleton per persona or per niche, swapping the specifics.

## Before any send

- [ ] Prospect passed the same five checks as `lead-qualification-checklist.md`: 5+ reviews, verified GBP, apparent decision-maker, budget signal, urgency signal
- [ ] Suppression list checked, prospect not on it
- [ ] Sending from the warmed cold-email subdomain, never the root domain or a personal inbox
- [ ] Cadence stays within warmup volume (roughly 10-20/day, ramping) until warmup finishes, expected mid-September. Do not scale volume before then.

## The one research trigger

Find one strong, specific trigger for the prospect before writing anything: a funding raise, a hiring push, a review pattern, a specific gap versus their competitors. Reuse that same trigger across all three phases and any other channel (LinkedIn, a call if one happens). Don't invent a new angle per touch, that reads as generic even when it isn't.

Add exactly one personalization detail per prospect beyond the trigger: something from their site, their reviews, or their GBP listing that shows you actually looked. Generic personalization tokens (first name, city, mail-merge fields with no real detail) read as templated and hurt reply rate.

## Subject lines

Short, plain, non-salesy. Never a curiosity gap ("quick question about your ops"), never anything misleading about what the email contains. A subject line should tell the truth about the one sentence that follows it.

## Phase 1: biggest problem

Trigger: [the one research trigger for this prospect]

Subject: [short, plain, names the actual topic]

Body:

> Hi [name],
>
> [One sentence connecting the trigger to a specific, plausible problem, phrased as an observation, not an accusation.]
>
> [One sentence describing, in plain terms, the kind of thing you help with, tied to that problem.]
>
> [One-line, low-friction ask: worth 15 minutes, or should I not bother.]
>
> [Sign-off]
>
> ---
> [PHYSICAL MAILING ADDRESS - PENDING DECISION 5]
> Don't want these emails? [One-click unsubscribe link]

## Phase 2: second problem (sent if no reply, roughly 4-6 days later)

Same trigger, different specific problem this business plausibly has. Reference the first email briefly ("following up on my note last week") without re-explaining it.

Subject: [short, different from phase 1, still plain]

Body: same three-sentence shape as phase 1, new problem, same CAN-SPAM footer.

## Phase 3: breakup (sent if no reply, roughly 4-6 days after phase 2)

Short and genuinely final. State plainly that this is the last email in the sequence, leave the door open without chasing.

Subject: [plain, signals this is a close-out, not a third pitch]

Body:

> Hi [name],
>
> Last note from me on this. If [the problem theme] isn't a priority right now, no worries, I'll leave it here.
>
> If it becomes one later, feel free to reach out: [booking link or reply-to].
>
> [Sign-off]
>
> ---
> [PHYSICAL MAILING ADDRESS - PENDING DECISION 5]
> Don't want these emails? [One-click unsubscribe link]

## CAN-SPAM requirements baked into every send

- **Physical mailing address**: `[PHYSICAL MAILING ADDRESS - PENDING DECISION 5]` placeholder until the address decision (home, LLC registered address, or virtual mailbox) is made. Do not send live campaigns with the placeholder unresolved.
- **One-click unsubscribe**: present in every email, no login or reply required to opt out.
- **Accurate from/reply-to**: sends from the cold-email subdomain mailbox, reply-to matches the visible from address, no spoofing or lookalike sender names.
- **Suppression list**: every unsubscribe or bounce gets added to the suppression list before the next send goes out. Unsubscribes are honored within 10 business days, and the list is checked against before any campaign, not just at send time for that one recipient.

## Cadence and review

Sends stay within warmup volume until roughly mid-September. Every ~100 prospects, review reply rate by segment or template, and change exactly one variable (the trigger type, the subject line, or the ask) before the next 100. Don't change multiple variables at once, you won't know what moved the number.
