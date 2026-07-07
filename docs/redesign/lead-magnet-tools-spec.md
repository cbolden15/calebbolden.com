# Lead magnet tools spec (interactive pages + gated PDFs)

Implementation spec. Copy marked FINAL is verbatim; do not rewrite it. Design language: the working wall (see globals.css utility contract and ServicePage.tsx for idiom). Light theme only. No em dashes anywhere. Sentence-case headings.

## Shared API route (agent A owns)

`app/api/lead-magnet/route.ts`, POST only.

Request body (validate with zod, already a dependency):

```ts
{
  magnet: 'ai-readiness' | 'revenue-leak' | 'process-audit-pdf' | 'website-checklist-pdf' | 'local-seo-pdf',
  email: string,          // required, must match /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  name?: string,
  payload?: Record<string, unknown>,  // scores or calculator inputs
}
```

Behavior, mirroring lib/chat/tools.ts captureContact exactly:
1. `console.log('[lead-magnet]', JSON.stringify({ magnet, email, name, payload }));`
2. If `process.env.RESEND_API_KEY` missing: console.error, skip send.
3. Else fetch POST https://api.resend.com/emails with Authorization Bearer key, from `process.env.LEAD_EMAIL_FROM || 'Caleb Bolden <onboarding@resend.dev>'`, to `[process.env.LEAD_EMAIL_TO || 'cbolden15@gmail.com']`, subject `Lead magnet: ${magnet} (${email})`, text body: name, email, magnet, then payload pretty-printed with JSON.stringify(payload, null, 2). AbortSignal.timeout(10000). Log-only on failure.
4. Response: valid body always returns `Response.json({ success: true })` (send failures are log-only). Invalid body returns 400 `{ success: false }`.

## Page: /tools/ai-readiness (agent A owns)

`app/tools/ai-readiness/page.tsx` (server, exports metadata) + `components/tools/ReadinessScorecard.tsx` ('use client').

Metadata FINAL: title `Is your business ready for AI? An 18-question scorecard | Caleb Bolden`, description `Answer 18 plain-language questions and get a scored read on where AI would actually help your business, and what to do first.`

Page skeleton follows ServicePage.tsx idiom: Header, main.chat-offset, hero section (graph-field graph-fade, Reveal, anno line above h1), then the client component in a bordered section, then Footer.

Hero copy FINAL:
- anno: `self-assessment · 18 questions · about 10 minutes`
- h1: `Is your business ready for AI?`
- intro: `76% of small businesses now use AI in some form, but only 14% have it working inside their actual operations (Goldman Sachs 10,000 Small Businesses survey, 2026). The difference is not the tools. It is whether the business was ready before the tools showed up. Answer honestly and find out which side of that gap you are on.`

### Scorecard behavior

18 questions in 5 sections. Each question is a row with the question text and three radio options rendered as segmented buttons: `Yes` (2 pts), `Sometimes` (1 pt), `No` (0 pts). Selected state: blueprint blue border + blue text (match .btn-blue idiom); unselected: hairline border, ink-muted. Keyboard accessible (real radio inputs, visually styled labels). Section headers use the anno style with section number and title.

Sections and questions FINAL (verbatim, including numbering):

Section 1 `data and systems`:
1. Is your customer and job information in one place, rather than scattered across email, texts, spreadsheets, and paper?
2. Could you pull a clean list of your last 12 months of customers or jobs in under 10 minutes?
3. Do you avoid typing the same customer information into more than one system?
4. Could a new hire find a past customer's history without asking a coworker?

Section 2 `process documentation`:
5. If you were out sick for a week, could someone run your busiest process from written instructions alone?
6. Do your 3 most common tasks have a written step-by-step, rather than living in someone's head?
7. When a mistake happens, can you point to the exact step where it went wrong?
8. Does your team do the same task the same way regardless of who is doing it?

Section 3 `repetition and volume` (render this note under the section header, FINAL: `In this section "yes" scores points, because repetitive volume is what makes automation worth the money.`):
9. Is there a task you or your team does more than 5 times a week that feels repetitive?
10. Does someone spend more than 2 hours a week on data entry or copy-pasting between systems?
11. Do you answer certain customer questions with nearly identical wording every time?

Section 4 `team and buy-in`:
12. Would your staff try a new tool if it saved them time, rather than resisting any change?
13. Is there at least one person besides you who would champion a new tool internally?
14. When your team suggests a shortcut or tool, does it get a real follow-up?

Section 5 `budget and focus`:
15. Could you set aside $100 to $300 a month to test a tool that saved 5+ hours a week?
16. Can you name ONE specific task you want help with, rather than "we should use AI"?
17. If you have abandoned a tool before, do you know why it did not stick?
18. Do you know roughly what an hour of your own time is worth to the business?

Below the questions: a submit button (btn-ink btn-roll idiom, label `See my score`) plus a live counter in anno style: `{n} of 18 answered`. Button disabled until all 18 answered.

### Result states

On submit, scroll to and render a result panel (bordered box, 1.5px solid var(--color-blue), like the ServicePage CTA panel):

Score header FINAL: big display number `{total} / 36`, then the band title:
- 0 to 14: `Foundations first`
- 15 to 26: `Ready for one pilot`
- 27 to 36: `Ready to sequence`

Under the band title, ungated one-line teaser FINAL:
- Foundations first: `Do not buy an AI tool this quarter. There is a cheaper move that has to come first.`
- Ready for one pilot: `You have enough structure to automate one thing, and only one. Picking the right one is the whole game.`
- Ready to sequence: `Readiness is not your problem. Ordering is.`

Then the email gate form inline in the same panel: email input (required) + name input (optional, placeholder `Name (optional)`) + submit button label `Get my full read-out`. Above the form, one line FINAL: `Enter your email and I will show your full read-out here, including what I would do first at your score.` On submit: POST to /api/lead-magnet with `magnet: 'ai-readiness'`, email, name, and payload `{ total, bands: sectionTotals }` where sectionTotals is an object of the five section scores. While pending: disable button. On response (treat any 2xx as success): replace the form with the full band guidance.

Full band guidance FINAL:

Foundations first: `Your money is better spent getting customer data into one place and writing down how your top two processes actually work. This is not a setback; businesses that skip this step are the ones that feed the failure statistics. Most software project failures trace to people and process, not the platform. Start with the one-hour process audit, then reassess. I will also look at your answers myself and reply if I see something worth flagging.`

Ready for one pilot: `Look at your repetition answers: whichever task came up as most repetitive is your pilot. Keep a person reviewing the output for the first month, and resist rolling out three tools at once. The adoption gap (76% using AI, 14% integrated) is made of businesses that scaled before one thing worked. I will also look at your answers myself and reply if I see something worth flagging.`

Ready to sequence: `Your data, processes, and team can support AI across several workflows. Your risk is ordering: which automation first, which measurements prove it worked, and when to add the next one. This is where a process-first plan pays for itself, because at your level the wins compound. I will also look at your answers myself and reply if I see something worth flagging.`

After the guidance, a row with a Link to /contact styled btn-ink btn-roll labeled `Talk it through` and a link-draw link to /resources labeled `More free tools`.

Reduced motion and error handling: if the POST fails (network), still show the full guidance (never strand the visitor) and console.error.

## Page: /tools/revenue-leak (agent A owns)

`app/tools/revenue-leak/page.tsx` (server, metadata) + `components/tools/RevenueLeakCalculator.tsx` ('use client').

Metadata FINAL: title `The revenue leak calculator for local businesses | Caleb Bolden`, description `Five numbers most owners never calculate. Fill in yours and see what missed calls, slow quotes, no-shows, and unused software cost per month.`

Hero copy FINAL:
- anno: `calculator · 5 leaks · 15 minutes with your phone log`
- h1: `What are the leaks costing you?`
- intro: `None of these leaks show up in your books, because money you never collected never gets recorded. That is why they survive for years. Grab last month's numbers where you have them and estimate honestly where you don't.`

### Calculator behavior

Five leak blocks, each a bordered row (hairline top border like deliverable rows) with: number + title (display font), a one-sentence evidence line (ink-muted, 14.5px), labeled numeric inputs, and a live result line in mono/anno style showing the computed monthly figure. Inputs: `<input type="number" inputMode="decimal" min="0">`, working-wall styling (hairline border, 2px radius, blue focus border). Empty inputs compute as 0. Currency formatting: `$` + Math.round + toLocaleString('en-US').

Leak 1 `The calls nobody answers`
- Evidence FINAL: `An observational study of 85 small businesses found only 38% of inbound calls get answered live; most voicemail callers hang up and call the next business (PCN Missed Call Revenue Study, 2026).`
- Inputs: `Calls missed per week` (m), `Average job or sale value, $` (v), `Share of quoted jobs you win, %` (w).
- Formula: `m × 0.5 × 4.3 × v × (w/100)` (assume half of missed calls were new business).
- Result line FINAL: `Missed-call leak: {result} per month` with a smaller note `assumes half of missed calls were new business`.

Leak 2 `The slow quote`
- Evidence FINAL: `Lead-response research has one consistent shape: reply in minutes and you reach almost everyone; reply tomorrow and much of the interest is gone. In the trades, the first detailed quote wins well over half of jobs, largely regardless of price.`
- Inputs: `Quotes that go quiet per month` (q), `Average value of those quotes, $` (v2).
- Formula: `q × v2 × 0.25`.
- Result line: `Slow-quote leak: {result} per month` with note `counts a quarter of the silence as speed, a conservative share`.

Leak 3 `The no-shows`
- Evidence FINAL: `A five-year study covering 1.6 million appointments found automated reminders cut no-shows by 23%. A peer-reviewed study found SMS reminders brought no-shows down to 1.9%, the lowest of any channel tested.`
- Inputs: `No-shows per month` (n), `Average value of a kept appointment, $` (v3).
- Formula: `n × v3 × 0.25`.
- Result line: `No-show leak: {result} per month` with note `the share reminders would recover`.

Leak 4 `The reviews you never answer` (not a dollar figure; a status)
- Evidence FINAL: `98% of consumers say the quality of a business's response to reviews influences whether they use that business (BrightLocal, 2024). Review signals are also one of the largest local ranking factors (Whitespark, 2026).`
- Input: `Share of your Google reviews you responded to, %` (r).
- Logic: if r entered and r < 80 show status line `This leak is OPEN. Fixing it costs about 30 minutes a week.` (blue, mono); if r >= 80 show `This leak is closed. Keep the streak.`; if empty show nothing.

Leak 5 `The software you pay for and don't use`
- Evidence FINAL: `Zylo's 2025 SaaS Management Index found 21% of paid software licenses go completely unused and another 45% underutilized. For a 15-person company that is commonly thousands of dollars a year.`
- Input: `Monthly total of subscriptions nobody logged into for 60 days, $` (s).
- Formula: adds s directly.
- Result line: `Software leak: {result} per month, straight off the bottom line`.

### Total and gate

Sticky-feel total block after the five leaks (bordered box, 1.5px solid var(--color-blue)): anno label `sheet total`, display-font line FINAL `Monthly leak total: {total}` (sum of leaks 1, 2, 3, 5), then one line FINAL: `Two things are usually true about this number. It is bigger than you expected, and every line above is cheaper to fix than to keep.`

Email gate form in the same block: email (required) + button `Send me the fix list`. Above it FINAL: `Enter your email and I will reply with the two fixes I would start with for your numbers, specific tools and realistic prices, free.` POST to /api/lead-magnet with `magnet: 'revenue-leak'`, email, payload = all raw inputs plus per-leak results and total. Success state FINAL: `Sent. Check your inbox in the next day or two; I write these myself. In the meantime, the one-hour process audit is the natural next step.` followed by a link-draw link to /resources labeled `Get the process audit` and a btn-ink btn-roll link to /contact labeled `Or just talk to me`. On network failure show the same success state (log-only error).

## Page: /resources (agent B owns)

`app/resources/page.tsx` (server, metadata) + `components/ResourceGate.tsx` ('use client').

Metadata FINAL: title `Free tools and checklists for local businesses | Caleb Bolden`, description `Two interactive tools and three printable checklists: AI readiness, revenue leaks, process mapping, website conversion, and local SEO.`

Hero (graph-field graph-fade, Reveal) copy FINAL:
- anno: `free · no sales call required`
- h1: `Tools and checklists`
- intro: `Everything here is the real first mile of my paid work, free. The tools run in your browser. The checklists are printable PDFs; leave an email and I will send new ones as I write them.`

Then five rows in the deliverables idiom (hairline top borders, title col + detail col). Order and copy FINAL:

1. Title `Is your business ready for AI?` · detail `An 18-question scored self-assessment. Ten minutes, plain language, and you leave knowing what to do first at your score.` · action: Link styled btn-ink btn-roll to /tools/ai-readiness, label `Open the scorecard`.
2. Title `The revenue leak calculator` · detail `Five numbers most owners never calculate: missed calls, slow quotes, no-shows, unanswered reviews, unused software. Live math, your figures.` · action: Link btn-ink btn-roll to /tools/revenue-leak, label `Open the calculator`.
3. Title `The one-hour process audit` · detail `A printable worksheet that walks you through mapping one workflow, finding the waste, and pricing what it costs you weekly. Pen and paper, one hour.` · ResourceGate with file `/downloads/one-hour-process-audit.pdf`, magnet `process-audit-pdf`.
4. Title `The 20-point website checklist` · detail `Does your site turn visitors into calls? Twenty items ordered by impact, each one actionable without code.` · ResourceGate with file `/downloads/website-conversion-checklist.pdf`, magnet `website-checklist-pdf`.
5. Title `Get found on Google` · detail `The local SEO checklist: the one-time fixes first, then the weekly routine that does the compounding.` · ResourceGate with file `/downloads/local-seo-checklist.pdf`, magnet `local-seo-pdf`.

### ResourceGate component

Props: `{ file: string; magnet: string; label?: string }`. Initial state: a button (btn-blue outline idiom or link-draw + arrow) labeled `Get the PDF`. On click, swap to an inline one-line form: email input (required, placeholder `you@business.com`) + submit `Email me + download`. On submit: POST /api/lead-magnet `{ magnet, email }`; regardless of response (log-only on failure), trigger the download by creating an anchor to the file with the `download` attribute and clicking it, and swap to state FINAL: `Downloading. It is also fine to print it and scribble on it; that is the point.` with a link-draw link to the file labeled `Download again`.

No fake "we emailed it to you" claim anywhere; the PDF downloads directly (sender domain is not verified yet, so the site must not promise outbound mail to visitors).

### Nav wiring (agent B owns)

- components/Header.tsx: add a `Resources` link to `/resources` in the nav, matching the existing link idiom and order (place it after Services-type links, before Contact if present; match whatever structure exists, minimal diff).
- components/Footer.tsx: add a `Resources` link to `/resources` in the nav/services links block, matching the existing .link-draw idiom.
- app/sitemap.ts: add `/resources`, `/tools/ai-readiness`, `/tools/revenue-leak` entries matching the existing entry shape.

## Hard rules (both agents)

- Copy marked FINAL is verbatim. No em dashes or en dashes anywhere, including aria labels. No buzzwords (streamline, seamless, robust, leverage, unlock, empower, elevate).
- Match existing code style: 2-space indent, single quotes, inline style objects with CSS vars, Reveal wrappers per content block, anno/type-display/link-draw/btn-ink/btn-roll utilities as used in ServicePage.tsx.
- Buttons using btn-roll must include the roll-box/roll-a/roll-b structure with aria-hidden duplicate, exactly as ServicePage.tsx does.
- All interactive components live under 'use client'; pages stay server components with metadata exports.
- prefers-reduced-motion is already handled by the utility classes; do not add new keyframe animations.
- Verify with `rm -rf .next && npm run build` (if sandbox blocks rm -rf, use rm -r). `npx tsc --noEmit --incremental false` as a fallback check.
- Do not commit. Do not touch files owned by the other agent. Do not open any .env* file.
