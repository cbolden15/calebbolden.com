# Tone and audience-perception assessment prompt

Paste everything below the line into a fresh session (or hand it to a reviewer agent). It is self-contained: the reviewer does not need repo access, and it deliberately withholds the intended positioning until after the blind read so the first impressions are honest.

---

You are assessing the tone and audience perception of calebbolden.com, a live website. You have no prior context about the site or its owner. That is intentional: your value is reading it the way a stranger does.

## The job

Two passes. Do not skip ahead.

**Pass 1 is blind.** Read the site as three specific visitors would, record what each one perceives, and score the tone. Do not guess at what the site is trying to be; only report what it is.

**Pass 2 compares.** After the blind read is written down, open the sealed section at the bottom of this prompt, which states what the site intends to communicate. Measure the gap between intent and perception.

## Pages to read, in this order

Read them as rendered pages in a browser, not as source code. Order matters: follow the path a real visitor takes.

1. https://calebbolden.com/ (home; spend the first 10 seconds as a genuine first impression before reading closely)
2. https://calebbolden.com/owners
3. https://calebbolden.com/operators
4. https://calebbolden.com/work
5. https://calebbolden.com/about
6. https://calebbolden.com/how-i-build
7. https://calebbolden.com/resources
8. https://calebbolden.com/contact
9. https://calebbolden.com/tools/ai-readiness and https://calebbolden.com/tools/revenue-leak (skim the framing copy, not every question)

## Pass 1a: the three visitors

Play each persona fully before moving to the next. For each one, answer the questions in their voice, quoting the exact copy that produced the reaction.

**Persona 1: the owner.** Runs a local service business (think HVAC, plumbing, med spa, small law office), 5 to 25 employees. Time-poor, allergic to hype, has been burned by a marketing agency before, and suspects "AI" is the new word for that same pitch. Landed on the site from a chamber-of-commerce mention or a referral text.

**Persona 2: the operator.** Office manager or ops lead at a business like the one above. Lives in the software every day, copies data between systems, did not choose the tools. Found the site through the owner forwarding a link, or through a free checklist.

**Persona 3: the referral partner.** An accountant, bookkeeper, web designer, or chamber contact deciding whether to send clients here. Their own reputation rides on the referral. They will skim, not read.

Questions each persona answers:

1. **Ten-second read.** Before scrolling: what does this person do, who is it for, and what do they want me to do? Was anything confusing?
2. **Is this for me?** Does a business my size, in my kind of industry, in my town, feel addressed? Quote the line that made you feel included or excluded.
3. **Trust arc.** Where in the page flow did you first trust this person, and where (if anywhere) did doubt creep back in? Name the exact sentence or element for both.
4. **The money question.** No prices are published. As this persona, how does that land: premium and consultative, or evasive? What would you do about it?
5. **Objections left standing.** What would stop you from taking the next step, and does the site ever answer it? List each unanswered objection.
6. **The forwarding test** (persona 3 especially): would you send this link to a client? What one sentence would you say when you did? If you would not, what is missing?
7. **Bounce point.** If you left without acting, which page and which moment?

## Pass 1b: tone scorecard

Score each dimension 1 to 5, where 5 means the tone lands consistently across all pages. Every score needs at least two quoted examples: one where the tone works, one where it wobbles (or a note that you could not find a wobble).

| Dimension | What 5 looks like |
|---|---|
| Plainness | A non-technical owner never hits a word they have to translate. No AI-industry jargon, no consultant-speak. |
| Peer vs. pedestal | Reads like a competent tradesperson talking shop, not an expert lecturing down or a guru performing. |
| Confidence vs. sales pressure | Assured about the work without manufactured urgency, superlatives, or hedge-everything timidity. |
| Specificity | Claims are concrete (named systems, real numbers, named sources). Count the vague claims that could appear on any consultant's site. |
| Warmth | A human wrote this and a human answers the email. Not clinical, not chummy. |
| Consistency | Home, industry pages, About, and the tools all sound like the same person on the same day. Flag any page that sounds like a different author. |
| AI-tell absence | No em-dash connectors, rule-of-three padding, "it's not just X, it's Y" constructions, significance inflation, or uniform sentence rhythm. Quote any you find. |

## Pass 1c: perception summary

Before opening the sealed section, write one paragraph per question:

1. In one sentence, what is this site's implicit promise?
2. What kind of person do you picture behind it (age, background, temperament), and which copy built that picture?
3. What does this site think its visitor is afraid of, and is it right?
4. If this site were a person at a chamber mixer, how would they come across?

## Pass 2: intent vs. perception

Now open the sealed section below. For each intent line, mark it PERCEIVED (your blind read matched), PARTIAL (visible but weak), or MISSED (the blind read saw something else), citing your own Pass 1 notes as evidence. A MISSED that the site's copy actively contradicts is the most important kind of finding; flag those separately.

## Deliverable format

1. Three persona narratives (Pass 1a), each under 400 words.
2. The tone scorecard with quotes (Pass 1b).
3. The perception summary (Pass 1c).
4. The intent-gap table (Pass 2).
5. **Top 5 fixes**, ranked by how much each closes a perception gap for the primary audience (the owner persona). Each fix names the page, quotes the current copy, and states the perception problem it causes. Do not write replacement copy; diagnose.
6. **Do-not-touch list:** the 3 to 5 things doing the most perception work right now, so future edits protect them.

Rules: quote real copy for every claim; no finding without evidence. Judge only what is on the pages, not what you infer might exist elsewhere. If a page fails to load, say so rather than working from imagination.

---

## SEALED: intended positioning (open only after Pass 1 is fully written)

The site intends to communicate:

1. Caleb Bolden is a person, not an agency; the brand is personal and the LLC (Vora Technologies) stays in the background.
2. The audience is local small-business owners and operators, primarily service businesses, plus referral partners; not startups, not enterprises.
3. Core promise: "I automate the work you shouldn't be doing." Practical automation with measured payoff, not AI hype.
4. Differentiator: lean/six-sigma process discipline; he maps the process before touching tools, and most AI projects fail because nobody maps first.
5. Credibility: he runs his own companies on the same systems he sells (Vora CRM platform, agent teams); the proof is his own operation.
6. Every engagement starts with a paid audit; prices are deliberately not published; the free tools (AI readiness scorecard, revenue leak calculator) are the honest first mile of paid work, not bait.
7. Tone target: plain, concrete, confident, peer-to-peer, sounding like a person who has done the work; never salesy, never lecture-y, no AI-industry jargon.
8. The single primary call to action is a conversation ("Let's talk"); the assessment is the low-commitment alternative.
