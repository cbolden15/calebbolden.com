# Service pages spec — /services/web-development, /services/seo, /services/marketing

Side-door landing pages that catch local search traffic and funnel it into the
same audit + assistant pipeline. Working-wall skin, process-first framing.
Copy below is FINAL: use it verbatim, do not rewrite, pad, or "improve" it.

## Shared structure

Build one shared component `components/ServicePage.tsx` (server component) that
renders the working-wall layout from props, and three thin pages at
`app/services/web-development/page.tsx`, `app/services/seo/page.tsx`,
`app/services/marketing/page.tsx`, each exporting Next.js `metadata` and
rendering `<ServicePage {...content} />`.

Page skeleton (top to bottom):

1. `<Header />` (existing component)
2. Hero strip: `graph-field graph-fade` section, py-16 lg:py-24. Inside the
   standard container (`mx-auto w-[90%] max-w-[1200px]`):
   - h1, `type-display`, fontSize clamp(2.2rem, 4.4vw, 3.6rem), max-width 18ch
   - intro paragraph, 17px, 1.65 line height, var(--color-ink-muted), max-w-xl
3. "How it fits the method" section: hairline-top section, py-14. A small
   `.anno` label reading `how it fits the method`, then the method paragraph
   (16px, max-w-xl), then a link to `/#method` reading `See the five phases`
   styled with the `.link-draw` class, 14.5px, color var(--color-blue).
4. Deliverables section: py-14, h2 `type-display` clamp(1.6rem, 2.6vw, 2.1rem)
   "What you get", then the items as hairline-divided rows (border-top on each,
   like the Proof spec-sheet rows, NOT cards): each row is a 12-col grid,
   item title (display font, 17px, weight 650) in cols 1-4, item detail
   (14.5px, ink-muted) in cols 5-12. Wrap rows in `Reveal` with 60ms stagger.
5. Proof line: py-10, single paragraph 15px ink color, max-w-xl.
6. CTA panel: py-16 section. White panel, border 1.5px var(--color-blue),
   rounded-[2px], p-8 sm:p-10, max-w-2xl: h2 `type-display`
   clamp(1.6rem, 2.6vw, 2.1rem) "Start with the audit", one paragraph
   (the cta text below, 15px ink-muted), then two actions side by side:
   `<Link href="/contact" className="btn-ink btn-roll">` with label
   "Let's talk" (roll markup contract: duplicated label, aria-hidden on copy),
   and a plain text line 14px ink-faint: "Or open the assistant in the corner
   and describe your business."
7. `<Footer />` (existing component)

Also render one JSON-LD block per page via
`<script type="application/ld+json">` with `@type: "Service"`:
serviceType (per page below), provider `{"@type": "LocalBusiness", "name":
"Caleb Bolden", "legalName": "Vora Technologies LLC", "url":
"https://calebbolden.com"}`, and `areaServed: "United States"`. Nothing
invented beyond these fields.

Every page uses `.chat-offset` the same way the homepage sections do (check
how app/page.tsx wraps sections in `<main className="chat-offset">`; do the
same in each page file).

Reduced motion and the reveal contract come free from existing utilities; do
not add new CSS. No em or en dashes anywhere. Sentence-case headings.

## Page 1: /services/web-development

metadata.title: `Website development for small businesses | Caleb Bolden`
metadata.description: `Websites built as working parts of your sales process, not brochures. Fast, measurable, and wired into your follow-up. For local small businesses.`
JSON-LD serviceType: `Website development`

h1: `Your website is a step in your sales process`

intro: `Most small-business sites are brochures. They look fine and do nothing. I build websites as working parts of the operation: they catch the customers you'd miss, book the jobs, and hand every lead to follow-up that happens.`

method paragraph: `Before I build a page, I map the path a customer takes to hire you: how they find you, what they check, where they hesitate, who they compare you against. The site gets built where that path leaks. It is the same process mapping that drives my AI work, applied to your storefront.`

deliverables (title / detail):
- `Fast by default` / `Pages that load in under two seconds on a phone, because that is where your customers are.`
- `Copy that answers` / `Written around the questions customers ask before they hire you, in plain language.`
- `Wired to your day` / `Booking, quotes, and contact land in your phone and inbox, not in a form nobody checks.`
- `An assistant, if it earns it` / `The same kind of AI agent that runs on this site, added only when it pays for itself.`
- `Numbers you can read` / `Analytics reduced to what matters: visits, calls, bookings. Five minutes a week.`

proof line: `This site, Vora, and ChapterHQ are all my builds, running in production. The assistant in the corner is not a mockup.`

cta text: `The audit maps how customers reach you today and where the site fits. If a new site is not the bottleneck, I will tell you what is.`

## Page 2: /services/seo

metadata.title: `SEO for small businesses | Caleb Bolden`
metadata.description: `Search visibility built on how customers find and choose you. Local SEO, technical fixes, and content with measurable results. No subscription traps.`
JSON-LD serviceType: `Search engine optimization`

h1: `Show up when your customers go looking`

intro: `SEO for a local business is not a mystery and not a monthly mystery invoice. It is a finite list of fixes and a steady publishing habit. I do the fixes, set up the habit, and show you the numbers.`

method paragraph: `The audit maps how customers find you today: search, referrals, reviews, word of mouth. SEO work starts where that map shows you losing people to competitors, not with a generic checklist.`

deliverables (title / detail):
- `The technical pass` / `Speed, mobile rendering, indexing, and structured data. Done once, done right.`
- `Local presence` / `Google Business Profile, review flow, and service-area pages that match how people search.`
- `Content with a job` / `Pages that answer real customer questions, mapped to what they search before hiring.`
- `Three numbers monthly` / `A report you can read in one minute: found, contacted, booked. No vanity charts.`

proof line: `I run this playbook on my own products and this site. You can check the work: search for it.`

cta text: `The audit tells us whether search is your bottleneck. If it is not, I will say so and point the budget somewhere useful.`

## Page 3: /services/marketing

metadata.title: `Online marketing for small businesses | Caleb Bolden`
metadata.description: `Follow-up systems, campaigns, and ads that pay for themselves. Marketing built on your sales process, starting with the leads you already have.`
JSON-LD serviceType: `Online marketing`

h1: `Marketing that follows up so you don't have to`

intro: `Most local businesses do not need more leads. They need to stop losing the ones they have. I build the follow-up machine first: replies, reminders, reviews, reactivation. Then, if the numbers say so, we buy traffic.`

method paragraph: `The audit maps what happens to a lead after it arrives: who answers, how fast, what happens on a missed call, who follows up and when. Marketing gets built where leads leak, which is almost never where the ad budget goes.`

deliverables (title / detail):
- `Speed to lead` / `Missed-call text-back and replies within minutes, around the clock.`
- `Campaigns people open` / `Email and SMS timed to your customer's rhythm, not a content calendar.`
- `Reviews on autopilot` / `Requests timed to the moment the job wraps, routed to the platforms that matter.`
- `Ads, last` / `Paid traffic only after the follow-up holds, so every click has somewhere to land.`
- `One honest dashboard` / `What came in, what it cost, what it closed.`

proof line: `I built Vora, a CRM platform that runs exactly this machinery for service businesses. Yours gets the same engine.`

cta text: `The audit shows where your leads leak before we spend a dollar on new ones.`
