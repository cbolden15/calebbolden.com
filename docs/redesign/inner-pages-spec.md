# Inner pages spec — /contact and /about (working-wall skin)

Copy is FINAL: verbatim, no rewrites, no padding. Layout idioms come from
components/ServicePage.tsx and the homepage. Same global constraints as
docs/redesign/interaction-pass-spec.md (tokens only, no gradients, no purple,
no em/en dashes, sentence-case headings, reduced motion via existing
utilities, server components unless stated).

## Shared: OpenChatButton

Create `components/OpenChatButton.tsx`: a small 'use client' component
rendering a `.btn-ink btn-roll` button (roll markup contract) that dispatches
`window.dispatchEvent(new Event('open-chat'))` on click. Props: `label`
(string). Used by both pages.

## /contact (rewrite app/contact/page.tsx)

metadata.title: `Contact | Caleb Bolden`
metadata.description: `Three ways to start: describe your business to the assistant, email me directly, or book a call.`

Structure: Header, hero strip (graph-field graph-fade, py-16 lg:py-24), then
a "routes" section, then Footer. No CTA panel (the page IS the CTA).

h1 (type-display, clamp(2.2rem, 4.4vw, 3.6rem), max-w 16ch):
`Tell me what's eating your week`

intro (17px, ink-muted, max-w-xl):
`Every engagement starts the same way: you describe how the work moves, I tell you whether a system can take it. Pick whichever route suits you.`

Routes: three hairline-divided rows (borderTop 1px hairline on each, py-8,
12-col grid like the Proof rows). Each row: an `.anno anno-blue` route label
in cols 1-2, a title (display font, 20px, 650) plus one line of detail
(14.5px ink-muted) in cols 3-8, and the action in cols 9-12 right-aligned.
Wrap rows in Reveal with 70ms stagger.

Row 1:
- anno: `route 1 / fastest`
- title: `Describe your business to the assistant`
- detail: `It maps the conversation before we ever get on a call, and it is a live sample of my work.`
- action: OpenChatButton with label `Open the assistant`

Row 2:
- anno: `route 2 / direct`
- title: `Email me`
- detail: `I read everything myself. Two sentences about your business is plenty.`
- action: `<a href="mailto:cbolden15@gmail.com" className="btn-hairline btn-roll">` with roll markup, label `cbolden15@gmail.com`

Row 3:
- anno: `route 3 / calendar`
- title: `Book a call`
- detail: `Twenty minutes, no deck, no pitch. We talk through your process and what I would map first.`
- action: if `process.env.NEXT_PUBLIC_CALENDLY_CLIENT_URL` is set at build
  time, an `<a>` styled btn-hairline btn-roll to that URL with label
  `Pick a time` (target _blank, rel noopener); if unset, render the row
  with the detail text but the action shows a plain 14px ink-faint note:
  `Booking link coming soon. Route 1 and 2 work today.`

## /about (rewrite app/about/page.tsx)

metadata.title: `About | Caleb Bolden`
metadata.description: `Builder first, consultant second. Payments and fintech background, lean process mapping, and live products: Vora, ChapterHQ, and this site's assistant.`

Structure: Header, hero strip, then three sections divided by hairline rules,
then the CTA panel (same pattern as ServicePage's CTA panel: white panel,
1.5px blue border, "Start with the audit" heading, btn-ink btn-roll
"Let's talk" to /contact), then Footer.

h1 (type-display, clamp(2.2rem, 4.4vw, 3.6rem), max-w 16ch):
`Builder first, consultant second`

intro (17px, ink-muted, max-w-xl):
`I'm Caleb Bolden. I run Vora Technologies, and I help small businesses find the work a system should be doing, then I build that system.`

Section 1 (anno label: `the background`):
paragraph 1: `I came up through payments and fintech, working with US Bank, Elavon, and TSYS, then moved into product management in crypto infrastructure at Blockdaemon. Big companies are a masterclass in process: thousands of people moving work between them, and every improvement starts with someone mapping how the work moves today.`
paragraph 2: `Along the way I picked up lean and six sigma the working way: value stream maps on real walls, timing real handoffs, sitting in the kaizen meetings where the map gets argued into the truth. That habit stuck harder than any job title.`

Section 2 (anno label: `the products`):
paragraph: `Nights and weekends I built software, and the side projects became the main event. Vora is a CRM platform for service businesses. ChapterHQ runs clubs and nonprofits. The assistant in the corner of this site is one of those systems, live, not a demo reel. When I recommend something to a client, it is because I have already run it myself.`

Section 3 (anno label: `the method`):
paragraph: `AI made automation cheap. It did not make judgment cheap. Most AI projects fail because they automate a process nobody understood, so I refuse to skip the mapping step. Interviews first, a value stream on the wall, honest scoring, then one build with one success metric. If the map says AI will not pay, I say that instead.`
Then a `.link-draw` link to `/#method`, 14.5px blue: `See the five phases`

CTA panel copy (15px ink-muted):
`The audit is where every engagement starts. Two to three weeks inside your business, and you end up with a map, a scored shortlist, and one recommended pilot, whether or not you hire me to build it.`
