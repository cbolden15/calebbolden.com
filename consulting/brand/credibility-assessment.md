# Credibility assessment

Date: 2026-08-04. Stage C synthesis. Written from `consulting/brand/credibility-stage-a-inventory.md` (site inventory, 21 of 24 sitemap URLs assessed) and `consulting/brand/credibility-stage-b-experts.md` (6 verified practitioners), with the repo read directly to confirm specific components and configuration. Nothing here was re-fetched from the live site.

## The bounding constraint: the proof gap

Every credibility exhibit on the live site is self-built. Vora, ChapterHQ, Real Estate Maite, the Agent Team, and this site's own assistant are all Caleb's products, and the single case study on `/results` is labeled in the UI as "my own operation, not a client." No third-party client name, logo, or testimonial appears anywhere in the sitemap-derived surface. All three personas in `tone-perception-assessment.md` hit their one doubt moment on exactly this fact, and the referral partner names it as their literal bounce point. Fix #1 of that assessment was left unresolved on purpose; its commit message says the gap is "not solvable with copy; requires a first client result."

This caps most scores below. It is stated here once and marked per page in section 2 rather than re-derived twenty-one times. A page that has done everything possible short of a client result is scored on what it controls.

One fact changes the ceiling, and it is the most important finding in this document. A complete, delivered-looking client website exists in this repo at `public/clients/brittany-lyons/`: `index.html`, `about.html`, `contact.html`, `faq.html`, `investment.html`, three area pages, more than ten journal posts, `bl-logo.png`, and a 15.7MB hero video. It is served behind HTTP basic auth by `proxy.ts` (realm "Brittany Lyons preview", credentials from `BRITTANY_PREVIEW_USER` and `BRITTANY_PREVIEW_PASSWORD`, `X-Robots-Tag: noindex, nofollow`). Two internal documents already treat it as real: `consulting/brand/asset-checklist.md:109` lists it as "Client case study (Brittany Lyons interior design site) / Delivered client work as a standing proof asset / High / Exists at public/clients/brittany-lyons/", and `consulting/launch-roadmap.md:131` notes it "suggests at least one exists already."

Neither Stage A nor Stage B saw this, because both worked from the live site and the sitemap, and this asset is deliberately excluded from both. The proof gap is real on the shipped site. Whether it is real in the business is a question only Caleb can answer, and the answer decides whether recommendation 1 below is the highest-value change available or is void. It is not treated as a client result anywhere in this document until he confirms it.

A second, unrelated correction to Stage A. Stage A's visual audit concluded that outside the homepage process diagram there is "not one illustration, screenshot, photo, chart, or diagram anywhere in the 21-page audit surface." That is not quite right. `components/CTA.tsx` renders the homepage's closing band with a real video asset at `public/video/method-loop.mp4` (1.9MB), autoplay, muted, looped, `playsInline`, carrying `aria-label="Hands drawing a process flow map with a marker, then placing an amber sticky note"`, with `motion-reduce:hidden` and a drawn SVG that serves as both the reduced-motion state and the load-failure fallback. The source comment names its origin: "the method loop filmed (Higgsfield)." It sits in the closing section, well below the fold, so it does not affect LCP. This matters for three reasons: the homepage has two visual assets rather than one, the `higgsfield-video` pipeline is already in production on this site rather than untried, and the correct precedent for generated media is already established (illustrative, captioned as the method, never presented as documentation of an engagement).

---

## 1. Expert benchmark table

From Stage B. Six of six attempted practitioners verified, each with one fetched primary surface and one directly observed quote or element. No lane returned enterprise-only names, so this is the SMB and solo bar rather than substituted enterprise theater. Confidence in the set is full; depth per attribute is uneven, and Jamie Flinchbaugh's row is thin because a tooling call budget ran out during the attribute pass, not because he lacks those signals. His blank cells are unverified, not absences.

| Name | Lane | Primary surface | URL | Verifying evidence | Signals worth learning from |
|---|---|---|---|---|---|
| Rachel Woods | AI consulting and education for SMB | The AI Exchange | https://www.theaiexchange.com/ | Homepage tagline observed: "The AI Exchange teaches people and teams how to 'operationalize' AI. Learn how to repeatedly turn processes into AI playbooks that scale your work." Star-rated testimonials signed with first name and last initial ("Dan C.") | Testimonials from real but partly anonymized people stand in for case studies. Process-to-playbook framing very close to Caleb's map-then-automate line. |
| Nora Schlesinger | Small business ops, fractional COO | Fractional COO page | https://www.noraschlesinger.com/fractional | Published rate on the page: "Investment: Starts at $5,000 per month." A "Sample Engagements" section with three named scenarios in a Challenge / What I Do / Outcome format | Named-scenario case studies with no client names and no hard numbers. A published starting price. This is the closest researched analog to Caleb's current position. |
| Ray Sidney-Smith | Automation and systems for SMB | About Ray, W3 Consulting | https://rsidneysmith.com/about-ray/ | A real personal photograph beside the bio. Bio text: "Ray Sidney-Smith is a perennial Small Business evangel[ist]... W3 Consulting has three subsidiaries" | A confirmed headshot. Scale and longevity shown through named business lines rather than a single project result. |
| Jamie Flinchbaugh | Lean and process improvement, modern presence | jflinch.com | https://www.jflinch.com/ | Homepage hero headline observed: "Be a Purposeful Leader. Bridge Cultural, Capability, Strategic, and Systems Gaps." Built as a slider-driven consulting site, not a resume page | Leads with leadership positioning, not a Black Belt badge. The one lean practitioner in the set, and certification is not his hero signal. |
| Justin Welsh | Solo authority, build in public | justinwelsh.me | https://justinwelsh.me/ | Homepage: "A weekly essay on living and working on your own terms... Read by over 200,000." Praise block with named attribution: "'One of only a few newsletters I read weekly.' Sahil Bloom, The 5 Types of Wealth" | Third-party praise from a named, checkable person rather than an anonymous quote. Own numbers used as the case study. |
| Brennan Dunn | Productized consulting | About Brennan, Double Your Freelancing | https://doubleyourfreelancing.com/about/brennan/ | Bio text: "I've been in and around the world of freelancing for over a decade... I grew my company... had eleven full-time salaried employees on payroll." Personal headshot present. Named podcast appearances listed, including one framed around "how I'm able to charge $20k+/week" | Rate surfaces through a third party rather than self-published. Named podcast appearances function as borrowed credibility. |

The five recurring patterns Stage B derived, compressed:

1. Headshots are inconsistent even among established practitioners. Two of six confirmed, four unverified. A photo is a differentiator when present, not a disqualifier when absent from one page.
2. Numbers are rare in on-page case studies and common in third-party citation. None of the six published a named-client quantified case study. Where hard numbers appear at all, a third party carries them.
3. Certifications are not load-bearing at this bar, including for the lean practitioner. This tempers any move to make lean and six sigma a hero-level trust device.
4. Pricing visibility splits by proximity to the SMB buyer. The one selling directly to small businesses publishes a starting price. Caleb's "$750, fixed scope" already matches the bar and needs no further change.
5. Proof before a track record leans on borrowed authority, never fabricated authority. Every expert lacking client numbers substituted something real and checkable. None simulated a client result.

Differentiation test, as Stage B ran it rather than as asserted:

- **The working wall visual system holds cleanly.** None of the six use anything resembling a process-map or drafting-instrument visual language. Two run generic template consulting sites, two run plain WordPress brochure sites, one a SaaS-style Webflow site, one a minimalist newsletter site.
- **Measure before publishing holds in the weak form only.** No researched expert states this as a principle, and none of them violated it either. The honest claim is "no one else says this," not "others fail at this." Say it that way.
- **The live assistant is unverified and must not be claimed as a differentiator.** A text-mode fetch cannot detect a client-side chat widget. No assistant was observed on any of the six pages, which is absence of evidence, not evidence of absence.

---

## 2. Credibility scorecard

Scale anchors, so two runs can be diffed. 5 means a skeptical owner could verify the page's core claims without leaving it, and the page carries at least one signal the researched experts also carry. 1 means every claim is self-asserted and unverifiable. Evidence is asymmetric on purpose: one strongest signal present, then the two absences that would move the score up a point. Those absences are the next run's checklist.

"Capped" marks pages whose score cannot rise past roughly 3 until a client result exists, because proof is the page's job. Pages not marked capped either have no proof job (`/contact`, the newsletters) or route around the gap using something independently checkable.

| Page | Score | Capped | Strongest signal present | Two absences that move it +1 |
|---|---|---|---|---|
| `/` | 3 | yes | The waste-log accordion's nine concrete scenarios, including "You're with a client, three calls go unanswered. One was a $3K lead who booked with a competitor by lunch" | A named third party anywhere on the page. Any visual evidence of a running system (the two assets present are a diagram and an illustrative video, neither is proof). |
| `/services/web-development` | 3 | yes | "This site, Vora, and ChapterHQ are all my builds, running in production. The assistant in the corner is not a mockup." A visitor can test the last clause without leaving the page | A screenshot of any of the three builds. A delivered client site named on the page. |
| `/services/seo` | 3 | yes | "I run this playbook on my own products and this site. You can check the work: search for it" | A ranking or traffic figure Caleb can defend. A named site other than his own. |
| `/services/marketing` | 3 | yes | "I built Vora, a CRM platform that runs exactly this machinery for service businesses. Yours gets the same engine" | Any interface view of that machinery. A named external statistic supporting the leak-first argument. |
| `/resources` | 4 | no | "Everything here is the real first mile of my paid work, free," backed by two tools that actually run in the browser | A count or figure on tool usage that Caleb can defend. A visible link from a tool result back to the audit offer. |
| `/owners` | 3 | no | "A customer calls at 6:40 on a Tuesday because their water heater just went out," naming HVAC, plumbing, electrical explicitly | A dated archive or sample issue proving the cadence is real. A named subscriber count or a named reader. |
| `/operators` | 3 | no | "About half the issues ship with the template, so you can build it yourself before we ever talk," a falsifiable claim about content ratio | A sample issue viewable without subscribing. A dated record of a clinic that already happened. |
| `/tools/ai-readiness` | 4 | no | Eighteen working diagnostic questions across five named categories, plus a named and dated third-party source: Goldman Sachs 10,000 Small Businesses survey, 2026 | A visible connection from the score to what an audit would do about it. A second sourced statistic for the categories that carry none. |
| `/tools/revenue-leak` | 4 | no | Five separately sourced leak calculations, every one named and dated: PCN 2026, Sesame Communications five-year study across 1.6 million appointments and 64 practices, BrightLocal 2024, Whitespark 2026, Zylo 2025 | A single figure from Caleb's own operation to sit beside the borrowed ones. Any signal on the page about who built it and why they can be trusted with the result. |
| `/about` | 3 | yes | Named employers in sequence, US Bank, Elavon, TSYS, then Blockdaemon, each checkable on LinkedIn, plus outbound GitHub and LinkedIn links | A photograph of Caleb. Those two outbound links promoted out of their current position as bare 14px text below the CTA box (`app/about/page.tsx:196-197`). |
| `/contact` | 2 | no | A real, direct email address and two clearly differentiated routes, with "I read everything myself. Two sentences about your business is plenty" | A face or a signature. A phone number, whose absence is a real inconsistency for a business whose core pitch is answering the phone. |
| `/results` | 2 | yes | The most honest paragraph on the site: "I am instrumenting each of these out of the live system before I publish a figure, so the placeholders below stay visible until the real measurement exists," under a "measure before publishing" sticky | One published figure, from anything. A date stamp showing when "measuring now" was last true. |
| `/work` | 3 | yes | The five-step timestamped walkthrough, Tue 6:40pm through Wed 7:10am, the most granular process description on the site, alongside the honest line "there is nothing on this page yet with someone else's name and numbers on it" | A screen capture of that exact flow happening. A delivered client build listed among the LIVE entries. |
| `/work/vora` | 3 | yes | A falsifiable stack table (SvelteKit and Postgres, MCP server, Twilio and Resend and SendGrid, Stripe, Docker and Caddy and Hetzner) plus a working outbound link to a live separate product | A screenshot of the dashboard. One defensible scale fact, such as the eleven service verticals named in `brand-context.md` but absent from the page. |
| `/work/chapterhq` | 3 | yes | Same stack-table specificity (Next.js, Postgres with pgvector, Drizzle, Pusher, Stripe) with a live outbound link | A screenshot. Any indication of who uses it. |
| `/work/site-assistant` | 4 | no | The one product a visitor can test in place, without leaving the page, which is why this page routes around the proof gap rather than being capped by it | A screenshot or short capture of a real conversation, so the proof is visible before the visitor decides to try it. Resolution of the framing conflict below. |
| `/work/open-source` | 4 | no | Five named GitHub repositories with working links, including "an MCP server exposing 38 Claude-ready tools over a FastMCP proxy pattern." GitHub is genuinely independent: commit history, code, and dates are all checkable | A commit-recency signal on the page itself, so the visitor sees the work is alive before clicking. A one-line note on why an owner should care about any of it. |
| `/how-i-build` | 2 | yes | "I do not recommend AI I have not run myself... When something breaks, I have usually already hit that failure and fixed it," tied directly to a specific stack grid rather than floating free | Any evidence of the overnight autonomous loops described. A number attached to "I ship in days what used to take weeks." |
| `/blog` index | 3 | no | Four real posts with titles, tags, and dates, newest first, most recent within the current month | A cadence that reads as alive (four posts across seven months is thin). Any signal of readership or response. |
| `/blog/map-before-you-automate` | 4 | no | "RAND interviewed 65 AI experts in 2024 and asked them why AI projects fail. The top root cause, named by 84% of the people they talked to... was leadership miscommunicating the problem to solve." Named, dated, with a sample size | A diagram of the value stream map the post spends 1,600 words describing. One example drawn from a real engagement rather than the general case. |
| `/blog/beyond-rpa` | 1 | no | Names real tools (n8n, Make, Zapier, OpenAI, Anthropic, Google), which are checkable products | Its central statistic, "40-60% of bots break within months," has no named source, which breaks the brand's own hard rule that every statistic gets a named source (`brand-context.md:42`). A rewrite out of generic listicle structure into the site's voice. |

Two pages sit at the extremes and both are worth naming. `/tools/revenue-leak` is the site's high-water mark and is held off a 5 only because everything it proves is about the problem rather than about Caleb. `/blog/beyond-rpa` is the only page in the audit surface that actively subtracts credibility rather than merely failing to add it, because a reader who checks one number and finds it unsourced will discount the twelve sourced numbers elsewhere on the site.

Deliberately excluded from scoring: `/privacy` and `/terms`, legal boilerplate, out of scope for a credibility read. Not assessed: `/blog/where-ai-pays-in-a-small-service-business` and `/blog/state-of-ai-agents-2026`, the two mid-list posts, excluded by the blog sampling rule rather than by any failure. No page was skipped due to a fetch or render failure.

---

## 3. Ranked recommendations

Twelve, ranked by which unresolved doubt moment or unanswered objection from `tone-perception-assessment.md` the change closes. Not ranked by credibility gained per unit effort: that proxy is unmeasurable today, because no analytics are installed. `app/layout.tsx` loads no analytics script and the codebase carries no analytics package, so before-and-after measurement of any of these is impossible until Umami or Plausible lands. That is a prerequisite for evaluating this list, not an item on it.

The owner and the referral partner lead the ranking. Recommendation 2 is an operator recommendation and is ranked second on purpose: operators are the named consulting buyer in `brand-context.md:29`, and their objection is the most specific unaddressed one in the whole fear inventory.

Fixes 2, 3, and 5 of the tone assessment shipped in commit `c6e2698` and are not restated here. Fix 4 is partially done and drives recommendation 2. Fix 1 is the bounding constraint and drives recommendation 1.

### 1. Publish the Brittany Lyons build as a named client case study

- **Pages:** `/results`, `/work`, `/services/web-development`
- **What changes:** the delivered interior-design site becomes a named case study with the client's name, a real screenshot of the delivered work, what the engagement was, and what was built. `/work` gains its first LIVE entry with someone else's name on it. `/results` gains CASE 002, and CASE 001 keeps its honest "my own operation" label so the contrast does the work.
- **Type:** content and cosmetic
- **Pipeline:** `real-capture`
- **Substantiation:** the delivered build exists at `public/clients/brittany-lyons/` (index, about, contact, faq, investment, three area pages, more than ten journal posts, logo, hero video), password-gated by `proxy.ts`. `consulting/brand/asset-checklist.md:109` records it as "Delivered client work as a standing proof asset." `consulting/launch-roadmap.md:131` treats it as evidence at least one engagement exists. **Gate status (answered 2026-08-03):** Caleb confirms this is a real engagement, currently in progress; he expects written permission to name the client when the engagement ends. The recommendation is therefore DEFERRED, not void: nothing publishes with her name until the engagement wraps and permission is in writing. Until then the case study can be drafted privately (in consulting/, not the site) so it publishes the day permission lands, and the site may truthfully say an engagement is in progress without naming anyone. No number goes on the page unless the client will stand behind it.
- **Effort:** 4 to 6 hours after permission, plus the one-time image pipeline shared with recommendation 2
- **Doubt moment closed:** the referral partner's literal bounce point at `/work`, "every 'system' listed is self-built rather than client-delivered," and the owner's standing objection, "no client testimonials, no third-party logos, nothing from an actual plumbing or law shop."
- **Fear disarmed:** that this is an agency that loves talking about itself, which is the one fear all three personas independently reached.

### 2. Show the interface

- **Pages:** `/work`, `/work/vora`, `/work/chapterhq`, `/work/site-assistant`
- **What changes:** each product page gains one real screenshot of its actual running interface, mounted below the stack table rather than replacing it. `/work` gains a capture of the missed-call text-back conversation from the five-step walkthrough.
- **Type:** cosmetic, with alt-text content
- **Pipeline:** `real-capture`
- **Substantiation:** all three systems are live and running in production. A screenshot of a running system invents nothing. Any customer-identifying data in the missed-call capture gets replaced with Caleb's own test data before publishing, and the caption says so.
- **Effort:** 1 day, including roughly 2 hours of one-time setup. `next.config.ts` has no `images` configuration and `app/` ships zero raster images, so this recommendation carries the image pipeline for every later one.
- **Doubt moment closed:** the operator's only stated objection, "No screenshot, demo video, or walkthrough of what the automation actually looks like day to day. I'd want to see the interface before I recommend adopting anything." Tone assessment fix 4, which commit `c6e2698` answered in prose only.
- **Fear disarmed:** that the operator will champion something internally and discover on day one it looks nothing like what was described.

### 3. Build the named-scenario case study format

- **Pages:** `/results`, feeding `/services/*`
- **What changes:** the three self-built systems are rewritten from a product roster into engagement-shaped write-ups using Nora Schlesinger's Challenge / What I Do / Outcome structure. Outcomes stay qualitative until real figures exist, which is exactly what the researched bar does.
- **Type:** content
- **Pipeline:** `code-only`
- **Substantiation:** Vora, ChapterHQ, and the Agent Team exist and Caleb built and runs all three. The format is borrowed from a verified practitioner solving the identical problem: Stage B observed her three named scenarios with no client names and no quantified outcomes, alongside her published $5,000 starting rate. Every outcome sentence must be one Caleb can defend if asked.
- **Effort:** 4 to 6 hours of writing
- **Doubt moment closed:** the referral partner's `/work` bounce, partially. It cannot supply someone else's name, but it converts "here are my products" into "here is what an engagement looks like," which is the actual question being asked.
- **Fear disarmed:** that Caleb sells software rather than sells the process, and that the visitor is looking at a portfolio rather than a practice.

### 4. Put a real photograph of Caleb on the site

- **Pages:** `/about` primarily, `/contact` secondarily
- **What changes:** one real photograph of Caleb on `/about`, and a smaller one on `/contact` next to the "I read everything myself" line. Ideally a second frame of the actual working wall, since the design system is named after it.
- **Type:** cosmetic
- **Pipeline:** `real-capture`
- **Substantiation:** Caleb is a real person and a photograph of him is a photograph of him. Two of the six researched practitioners carry a confirmed headshot, and they are the two closest to Caleb's positioning (automation-for-SMB and productized consulting). The same shoot also fills the "social profile photos and cover banners" gap that `asset-checklist.md` marks High and Missing.
- **Effort:** half a day including the shoot, sharing recommendation 2's image pipeline
- **Doubt moment closed:** the perception summary's unnamed adjacent fear, "whether this specific person understands a specific trade well enough to be trusted with it." A face does not answer that, but its absence keeps the question at arm's length on the one page built to answer it.
- **Fear disarmed:** that there is no specific person here, only a well-written site.

### 5. Give the referral partner a surface

- **Pages:** a new `/partners` page or a dedicated section on `/about`, linked from the footer
- **What changes:** explicit language addressed to bookkeepers, CPAs, MSPs, and business bankers: what Caleb does with a referral, what the client experiences, what the partner can promise on his behalf, and the audit price so they can quote it.
- **Type:** content
- **Pipeline:** `code-only`
- **Substantiation:** `brand-context.md:30` names referral partners as one of three target audiences and identifies them as the people who see process pain first. `consulting/materials/outreach-templates.md` already exists for them. Nothing on the live site addresses them.
- **Effort:** 3 to 4 hours
- **Doubt moment closed:** the referral partner's stated gap, "Not directly addressed to me as a referral source anywhere on these pages. No 'for advisors' or 'refer a client' language exists. I have to infer my own fit," and their money-question gap, "a referral partner still can't tell a client 'expect to spend $X'" (which the published $750 now answers, if it is put in front of them).
- **Fear disarmed:** for the partner, that attaching their name to this costs them credibility with their own client.

### 6. Promote the third-party links out of the basement

- **Pages:** `/about`, `components/Footer.tsx`, `/contact`
- **What changes:** the GitHub and LinkedIn links move into the page structure with labels that say what they verify, and appear in the footer title block sitewide rather than on one page.
- **Type:** cosmetic
- **Pipeline:** `code-only`
- **Substantiation:** both profiles exist and are already linked, at `app/about/page.tsx:196-197`, as two bare 14px links sitting below the "Start with the audit" CTA box at the very bottom of the page. `components/Footer.tsx` carries ten footer links and neither profile is among them.
- **Effort:** 1 to 2 hours
- **Doubt moment closed:** the skeptical visitor who wants to confirm this person is real currently has to scroll past the conversion box on one page to find the only two independently checkable links on the site.
- **Fear disarmed:** that the employment history (US Bank, Elavon, TSYS, Blockdaemon) is unverifiable, when in fact it is one click away and the click is hidden.

### 7. Source the RPA statistic or cut it

- **Pages:** `/blog/beyond-rpa`
- **What changes:** "40-60% of bots break within months" gets a named, dated source or is deleted. While the file is open, the duplicated title (the h1 repeated as the first line of body text) gets removed.
- **Type:** content
- **Pipeline:** `code-only`
- **Substantiation:** `brand-context.md:42` sets the hard rule, "every statistic gets a named source." Every other statistic in the audit surface names its source. This one does not. `brand-context.md:36` shows the standard is already enforced elsewhere: the MIT/NANDA "95% of pilots fail" figure was rejected as contested and not peer-reviewed.
- **Effort:** 30 minutes
- **Doubt moment closed:** none directly quoted, but this protects item 2 of the do-not-touch list, "the named, dated sources in both tools... are what separates the specificity score from every-consultant vagueness."
- **Fear disarmed:** that the sourcing discipline is a pose. One unsourced number on a site built on named sources is worse than none.

### 8. Ship an Open Graph image and a favicon

- **Pages:** sitewide, via `app/layout.tsx` and `app/opengraph-image.tsx`
- **What changes:** a shared link previews as the working-wall title block (wordmark, one line of positioning, blueprint rule) rather than a bare text card. A favicon lands in the browser tab.
- **Type:** cosmetic
- **Pipeline:** `code-only`. Next's `ImageResponse` draws it from the design system, so no raster asset and no image pipeline dependency.
- **Substantiation:** `app/layout.tsx:32-40` defines an `openGraph` block with title, description, url, siteName, locale, and type, and no `images` field. No `opengraph-image` file exists anywhere under `app/`, and no icon file exists in `app/`. `asset-checklist.md` marks both Missing.
- **Effort:** 2 to 3 hours
- **Doubt moment closed:** the referral partner's forwarding test. They said they would send it. What arrives in the recipient's inbox or Slack is currently a blank preview card.
- **Fear disarmed:** for the partner, that forwarding this makes them look like they are passing along something half-built.

### 9. Put the four named sales stats on the site

- **Pages:** `/services/*`, `/results`, and the `/tools/ai-readiness` result screen
- **What changes:** the external-specialist success rate goes on the services and results pages, where it argues for hiring an outsider. The Gartner, BCG, and S&P figures go on the readiness-result screen, where they explain a score rather than manufacture alarm on the homepage.
- **Type:** content
- **Pipeline:** `code-only`
- **Substantiation:** `brand-context.md:36` names all four as the brand's canonical, always-named sales stats: Gartner on 30% of GenAI projects abandoned after proof of concept, BCG on 74% of companies unable to show tangible AI value, S&P Global on abandonment jumping from 17% to 42% in a year, and external-specialist implementations succeeding around 67% against roughly a third for internal builds. Stage A ran a repo-wide grep across `app/` and `components/` for those sources and figures and found zero matches. **Gate:** each figure is verified against its primary source and dated before it ships, on the same standard that rejected the MIT/NANDA number.
- **Effort:** 3 to 4 hours including verification
- **Doubt moment closed:** the owner's core fear that "AI consultant" is the new word for the agency that burned them. Independent evidence that the failure mode is real, and that outside specialists measurably do better, is the argument for hiring at all, and it currently exists only in the brand document.
- **Fear disarmed:** that this is one more person selling AI, with nothing but his own confidence behind the claim that it works.

### 10. Draw the value stream map in the post that explains it

- **Pages:** `/blog/map-before-you-automate`
- **What changes:** one inline SVG process diagram mid-article showing steps, waits, and a rework loop, in the homepage's existing vocabulary.
- **Type:** cosmetic
- **Pipeline:** `code-only`
- **Substantiation:** the vocabulary already ships twice, in the hero process-box diagram and in `components/CTA.tsx`'s method figure. Nothing new is invented, and the diagram depicts the general concept the post teaches, not a specific engagement.
- **Effort:** 3 to 4 hours
- **Doubt moment closed:** the depth test. This is the site's most rigorously sourced long-form piece and it spends 1,600 words describing a visual artifact without showing one.
- **Fear disarmed:** that the map-first methodology is a slogan rather than a technique the visitor could recognize if they saw it.

### 11. Extend process figures to the services pages

- **Pages:** `/services/web-development`, `/services/seo`, `/services/marketing`, `/work`
- **What changes:** each page's "how it fits the method" band gains a small process-box figure in the existing vocabulary, so the page shows a method rather than only asserting one.
- **Type:** cosmetic
- **Pipeline:** `code-only`
- **Substantiation:** the vocabulary exists and is documented in `DESIGN.md` under identity devices ("process boxes: rounded-2px rectangles with blue strokes and mono captions"). These are illustrative, not evidentiary, so no guardrail question arises.
- **Effort:** 1 day for all four
- **Doubt moment closed:** none quoted directly, but these three pages carry sitemap priority 0.9, are search-entry pages, and do not appear in the nav. A cold search visitor's first impression of the practice is a page of text and one table.
- **Fear disarmed:** that a visitor arriving from search, with no context, bounces before reaching anything that demonstrates method.

### 12. Date the recency signals

- **Pages:** `/results`, `/work`, `/blog` index
- **What changes:** `/results` gains a "last measured" date beside its "Measuring now" rows. The `/work` LIVE entries gain a last-shipped date. The `/work` NOTES teaser is fixed to list all four posts rather than three.
- **Type:** content and cosmetic
- **Pipeline:** `code-only`
- **Substantiation:** `/results` already says "Measuring now" and commits to instrumenting the figures. A date stating when that was last true is checkable and truthful. Stage A confirmed the NOTES teaser shows three post dates while four posts exist on `/blog`.
- **Effort:** 1 to 2 hours
- **Doubt moment closed:** nothing on `/results` tells a visitor whether "measuring now" means this week or in January. An undated promise to measure ages badly and eventually reads as abandoned.
- **Fear disarmed:** that the practice is dormant and the site is a leftover.

---

## 4. Do-now five

The top five above, specified so an implementer needs no follow-up questions.

### 1. Brittany Lyons case study

**Before anything is built:** Caleb answers two questions in writing. Was this a real delivered engagement, paid or otherwise? Will the client permit her name and a screenshot of the delivered site on calebbolden.com? If either answer is no, stop here and skip to item 2. Nothing about this build appears on the public site without both.

**Placement.** `/results` gains CASE 002 above CASE 001, so the newest and the only client-named entry leads and the honest self-labeled entry sits beneath it. `/work` gains a fourth entry in the LIVE list. `/services/web-development` gains a single line under the existing "This site, Vora, and ChapterHQ are all my builds" claim, naming the delivered client site.

**Working-wall treatment.** The screenshot mounts as a taped-on print, not a floating browser mockup: 1px hairline border, 2px radius, no drop shadow, a mono `anno anno-blue` caption above it, and a dimension line annotating one real number if one exists (delivery time in weeks, page count). If `/results` already carries an amber sticky in that section, no second sticky is added; the maximum is one per section.

**Copy angle.** Challenge, what I did, outcome. Plain and short. No superlatives, no client quote unless she volunteers one in writing. If no defensible number exists, publish none and say what was delivered instead. The page's own standard applies: "I ask clients for numbers they can defend. Putting an unsourced one on my own page would make that a harder ask."

**Visual safety rails.** Alt text describes the delivered work specifically, for example "Home page of the interior design site delivered for Brittany Lyons, showing the hero, services grid, and journal." WebP or AVIF, under 150KB, maximum 1600px wide. Not an LCP element: it sits mid-page, below the fold, after the case text. No motion, so `prefers-reduced-motion` does not apply. The 15.7MB `hero-coastal.mp4` in the client folder is never reused on this site.

### 2. Show the interface

**Placement.** One screenshot per page, directly beneath the existing stack table, never replacing it. `/work/vora`: the dashboard view that shows the missed-call agent's conversation log. `/work/chapterhq`: the main app view. `/work/site-assistant`: a real conversation in the corner panel, ideally one that shows the assistant using a tool. `/work`: a capture of the text-back conversation from the 6:40pm step of the existing walkthrough, placed inline with the timestamp list rather than replacing it, so the page still reads if the image fails.

**Working-wall treatment.** Same taped-print mount as above. Mono caption naming what is shown. Where a real number is visible in the screenshot, a dimension line may annotate it; otherwise no annotation. Screenshots are cropped to the region that carries the point, not full desktop captures.

**Copy angle.** The caption states what the visitor is looking at in one plain sentence. No "as you can see." No feature list.

**Visual safety rails.** Alt text describes content, not medium: "Vora dashboard showing the missed-call agent's conversation log with three inbound calls and the automated text-back replies," never "screenshot of Vora." WebP or AVIF, under 150KB each, maximum 1600px wide. All four sit below the fold, after the stack table, so none is the LCP element. No video in this item, so no autoplay question and no reduced-motion behavior. Any real customer name, phone number, or address in the missed-call capture is replaced with Caleb's own test data before publishing, and the caption says the conversation is from a test run if it is.

**One-time setup carried by this item:** add an `images` block to `next.config.ts` (currently absent), adopt `next/image` for content images, and establish `public/images/` with a compression step. Roughly 2 hours, and every later visual recommendation depends on it.

### 3. Named-scenario case studies

No visual asset, so no rails.

**Placement.** `/results`, as the standing structure for entries that are not client engagements. Each of Vora, ChapterHQ, and the Agent Team becomes one entry, retaining the existing "my own operation, not a client" tag.

**Working-wall treatment.** Hairline-divided rows, the site's default grouping, with `anno anno-blue` labels reading "the challenge," "what I did," "the outcome." No cards. No grid. Maximum one amber sticky in the section, and `/results` already spends its sticky on "measure before publishing," so this section gets none.

**Copy angle.** Written as engagements, not product descriptions. Start with the problem in the business, not the technology. Outcomes stay qualitative until measurement exists, matching Nora Schlesinger's observed format, and every outcome sentence is one Caleb would defend to a client who asked "how do you know."

### 4. Photograph of Caleb

**Placement.** `/about`, beside the opening bio block, before the employment sequence. A smaller frame on `/contact` next to "I read everything myself." Not on the homepage: the hero's job is the diagram, and a face there competes with the process boxes for the one thing the visitor should look at first.

**Working-wall treatment.** Daylight, no studio backdrop, no crossed arms, no blurred-office stock energy. The design system's mood sentence is the art direction: "a process engineer's working wall at 10am: daylight, mat board, blueprint ink." Shoot at or near an actual wall with a real map on it. Mounted as a taped print, 1px hairline, 2px radius, no shadow, no circle crop. Grade cool and neutral to sit with the blueprint blue. No purple anywhere in the grade.

**Copy angle.** No caption needed on `/about`. On `/contact`, the existing line does the work.

**Visual safety rails.** Alt text names the person and the setting: "Caleb Bolden at a wall-mounted process map, marker in hand." WebP or AVIF, under 120KB at the `/about` size, under 60KB at the `/contact` size. Static image, no motion, so `prefers-reduced-motion` does not apply. On `/about` it may become the LCP element, so it ships with explicit width and height, `priority` on that one instance only, and a `sizes` attribute. On `/contact` it stays below the fold and lazy-loads.

**Non-negotiable:** this is a real photograph of a real person. Not generated, not a stock model, not an avatar. If no photo exists yet, the recommendation waits.

### 5. Referral partner surface

No visual asset, so no rails.

**Placement.** A `/partners` page, linked from the footer nav in `components/Footer.tsx` alongside the two newsletter links, and cross-linked from `/about`. The footer already labels its newsletter links explicitly after tone fix 3, so the same convention applies: "For bookkeepers, CPAs, and MSPs" rather than a bare "Partners."

**Working-wall treatment.** Same page template as `/owners` and `/operators`, which scored the fastest trust in the blind read. Hairline-divided rows, one `anno anno-blue` label per section, one amber sticky at most, marking the single call to action.

**Copy angle.** Written to the partner's risk, not to the end client's problem. What happens to a client they send. What the partner can promise, in their own words, including the $750 fixed-scope audit price so they can quote it without asking. What Caleb will not do, since a referral partner's fear is that the person they vouched for will overreach with their client. No finder's fee language yet; `asset-checklist.md` parks that until volume justifies formalizing it.

---

## 5. The don't list

Changes that would raise visual density and lower credibility. These stay off the roadmap.

1. **No AI-generated photographs of Caleb, of clients, or of any workspace presented as real.** A generated headshot on a site whose stated position is "measure before publishing" is the single most expensive possible failure. This includes generated images of "a working wall" presented as Caleb's working wall.
2. **No fabricated process maps presented as engagement artifacts.** A `code-only` diagram that depicts a specific engagement is evidence, not illustration, and falls under the same rule as a screenshot. Generic method diagrams that teach a concept are fine. A diagram captioned or positioned as "the map from a client engagement," drawn from nothing, is not.
3. **No mocked-up dashboards, fake metrics charts, or invented before-and-after numbers.** The `/results` page currently carries "Measuring now" placeholders and an explicit statement about why. Replacing those with plausible-looking figures would destroy the strongest honesty signal on the site.
4. **No "trusted by" logo row, no client counts, no implied team size.** The site says "I" throughout and that is an asset. A "we" or a logo wall built from tool vendors, employers, or prospects would be read correctly as padding.
5. **No scarcity language that implies clients who do not exist.** "Taking three clients this quarter" is truthful and fine. "2 of 3 founding slots open" implies two are taken. The $500 founding-client rate for the first three clients can be stated as an offer, never as a countdown.
6. **No stock photography of any kind.** No handshakes, no laptops on white desks, no smiling contractors, no "small business owner" stock. The working wall's austerity is doing persuasion work; generic imagery would read as a template site and undo it.
7. **No autoplaying video above the fold.** The existing method loop in `components/CTA.tsx` is correctly placed in the closing band. Any future video follows that pattern: below the fold, muted, looped, `motion-reduce:hidden`, with a drawn fallback.
8. **Do not add visuals to `/results` or `/contact` for density's sake.** `/results` earns its credibility from restraint: text, placeholders, and one amber sticky. `/contact` is a low-depth utility page by design. Filling either would trade the site's most honest surfaces for decoration.
9. **No motif violations.** Light theme only. No purple, violet, or magenta anywhere, including in any generated media grade. Maximum one amber sticky per section. Archivo, Schibsted Grotesk, and Martian Mono only, with mono reserved for short uppercase annotation labels and never for body copy.
10. **Do not touch the five items on the tone assessment's do-not-touch list.** "If the map says AI will not pay, I say that instead." The named, dated sources in both tools. The concrete scenario copy (the $3K lead, the water-heater Tuesday, the spreadsheet afternoon). "About half the issues ship with the template." "I read everything myself."

---

## 6. The honesty guardrail, restated

This covers any credibility signal, media or copy, not just generated images. It survives into implementation as written here.

- No AI-generated client photos, testimonial portraits, fake dashboards, fake metrics charts, fake results imagery, and no generated image presented as a photograph of anything real.
- No claim the site cannot substantiate on request: client counts, slot scarcity, "trusted by" rows, implied volume, implied team size.
- A `code-only` diagram that depicts a specific engagement is evidence, not illustration, and falls under this rule the same way a screenshot does. Fabricated process maps presented as engagement artifacts are named on the don't list above.
- If a visual's job is proof, the pipeline is `real-capture` or it does not get built.
- Capacity language follows the same rule. "Taking three clients this quarter" is truthful and fine. "2 of 3 founding slots open" implies a client who does not exist and is not.

The brand's entire position is measure before publishing. A fabricated signal would be a worse credibility failure than an empty page.

Enforcement: every recommendation in section 3 carries a `substantiation` field naming the artifact or fact that makes it true today. If that field cannot be filled, the recommendation is cut, not softened. Recommendation 1 is the live test of this rule: it carries a blocking gate rather than a hedge, and if Caleb cannot confirm the engagement and obtain permission, it does not ship in a weaker form.

One existing asset sits near the line and should be resolved rather than ignored. `public/video/method-loop.mp4` is a Higgsfield-generated clip of hands drawing a process map, per the source comment in `components/CTA.tsx`. It is captioned as the method ("the method: map it, score it, then automate what pays") and reads as illustration, which is the compliant side of the line. It would cross the line the moment it were captioned or positioned as footage of Caleb working with a client. Worth a decision from Caleb on whether the current framing is where he wants it.

One source-document conflict for Caleb to resolve, surfaced rather than decided here. `/work/site-assistant` calls the assistant "a working agent, not a demo," and `app/about/page.tsx` says "live, not a demo reel." `brand-context.md:35` calls it "a live demo" and prescribes the framing "my site runs a live AI agent, try it." A visitor encounters the first framing. The words point in opposite directions on whether this is a demonstration or production infrastructure, and one of the two documents should change.

---

## 7. Asset manifest

Every visual asset the do-now five requires, grouped by pipeline.

### `real-capture` (a shot list for Caleb)

All items below are photographs or screen captures of things that already exist. Nothing here is generated.

| # | Asset | For | Spec |
|---|---|---|---|
| 1 | Brittany Lyons delivered site, home page | Recommendation 1 | Browser capture at 1440px wide, cropped to hero plus first section. WebP, under 150KB, max 1600px. Blocked on written permission. |
| 2 | Vora dashboard, missed-call conversation log | Recommendation 2 | Cropped to the log region, not a full desktop capture. Real data acceptable if it is Caleb's own; any third-party contact detail replaced with test data. WebP, under 150KB. |
| 3 | ChapterHQ main app view | Recommendation 2 | Same treatment. WebP, under 150KB. |
| 4 | Site assistant, real conversation | Recommendation 2 | Capture the corner panel mid-conversation, ideally showing a tool call. WebP, under 150KB. |
| 5 | Missed-call text-back conversation | Recommendation 2 | Phone capture of the 6:40pm exchange in the `/work` walkthrough. Customer details replaced with test data, and the caption says so. WebP, under 150KB. |
| 6 | Caleb, portrait at a working wall | Recommendation 4 | Daylight, no studio backdrop, real map on the wall behind. Cool neutral grade, no purple. WebP, under 120KB. Doubles as the LinkedIn, YouTube, Instagram, and Facebook profile photo that `asset-checklist.md` marks High and Missing. |
| 7 | Caleb, tighter frame | Recommendation 4 | Same shoot, for `/contact`. WebP, under 60KB. |

Shoot 6 and 7 in one session. Captures 2 through 5 are one afternoon at the machine.

### `code-only`

| # | Asset | For | Notes |
|---|---|---|---|
| 1 | Named-scenario section structure on `/results` | Recommendation 3 | Hairline-divided rows with `anno anno-blue` labels. No new visual language. |
| 2 | `/partners` page built on the `/owners` and `/operators` template | Recommendation 5 | Reuses the existing page shell, adds a footer link in `components/Footer.tsx`. |
| 3 | Taped-print image frame component | Recommendations 1, 2, 4 | One shared component: 1px hairline, 2px radius, no shadow, mono caption slot, optional dimension-line annotation. Built once, used by all three visual recommendations. |

### `higgsfield-image` and `higgsfield-video`

**The do-now five require zero generated assets, and that is a finding rather than an omission.** Every visual in the top five has proof as its job (delivered client work, running interfaces, a real person), and the guardrail forces those to `real-capture` or nothing. Generation is available and already proven on this site, but it has no legitimate role in these five.

For later illustrative work only (recommendation 11, the services-page figures, where an ambient section texture is one option alongside the cheaper inline SVG), one runnable command written against the verified CLI reference in `~/Projects/agent-config/skills/design-ref/SKILL.md`. Run `higgsfield auth login` first, and `higgsfield model get seedance_2_0` to confirm the current parameter list before relying on any flag.

```bash
higgsfield generate create seedance_2_0 \
  --prompt "Overhead static shot of a white drafting table in flat 10am daylight, a hand slowly drawing three connected rectangles in blueprint-blue ink with a fine marker, one small amber sticky note resting at the edge of the frame, shallow depth of field, cool neutral grade with a single warm amber accent, no purple or violet anywhere, calm and precise and unhurried, no text and no faces" \
  --aspect_ratio 16:9 \
  --duration 5 \
  --resolution 1080p \
  --wait
```

Constraints that bind any generated clip on this site, matching the existing `components/CTA.tsx` precedent: below the fold only, muted, looped, `playsInline`, `motion-reduce:hidden` with a drawn SVG serving as both the reduced-motion state and the load-failure fallback, an `aria-label` describing the motion, under 2MB, and never the LCP element. It is illustration and is captioned as such. It never depicts a client, a result, an interface, or Caleb.

### `mobbin-pattern`

The Mobbin session was not re-authenticated in this pass and no query was run, so **every query below carries the label: unverified reference query, check before using.** These are layout references for building new sections and are never shipped directly.

| Query | For | Label |
|---|---|---|
| "consulting case study web" | Recommendations 1 and 3, case study layout | unverified reference query, check before using |
| "product screenshot section" | Recommendation 2, how a screenshot sits next to a spec table | unverified reference query, check before using |
| "partner program web" | Recommendation 5, referral surface structure | unverified reference query, check before using |
| "about page founder photo web" | Recommendation 4, headshot placement in a text-led about page | unverified reference query, check before using |

Stage A found no Mobbin candidates and gave a good reason: the site's visual vocabulary is distinctive enough that importing a generic pattern would work against the working wall. These four are listed because the do-now five build three genuinely new sections, and layout reference for a new section is exactly what the pipeline is for. Structure only. No visual language crosses over.

---

## 8. Cut list

Everything passes 1 and 2 surfaced that did not make the twelve, with why it lost. No silent truncation.

| Item | Why it lost |
|---|---|
| No phone number on `/contact` | A real inconsistency for a business whose core pitch is answering the phone, but it is a business decision rather than a credibility change, and `asset-checklist.md` records that phone fields were cut deliberately to protect conversion. Worth one question to Caleb. |
| "Monthly clinic" on `/owners` versus "even-month clinic" on `/operators` | Same substance, different label. A one-word consistency fix, not a credibility signal. Fix it whenever either page is next open. |
| Two vague claims: "I ship in days what used to take weeks" and "AI staff at a fraction of payroll" | Named in the tone assessment's minor notes and still unresolved. Both want a number or deletion. Real, but each is one line and neither is attached to a persona's stated doubt moment. |
| The one AI-tell on `/owners`: "That's not a phone problem. It's a business you already built losing work it already earned" | A voice issue rather than a credibility issue, and its current status is unconfirmed after the copy-audit pass. Belongs to the copy audit, not here. |
| `/blog/beyond-rpa` generic listicle structure | The unsourced statistic in that post made the twelve because it breaks a stated brand rule. The structural rewrite is a larger content job with a smaller credibility return, and the post is seven months old. |
| Blog cadence: four posts across seven months | Real thinness, but the fix is "publish more," which is a standing content commitment rather than a discrete recommendation. It is already tracked as launch content in the project's next-up list. |
| Site assistant framing conflict, "a working agent, not a demo" versus `brand-context.md`'s "a live demo" | Surfaced in section 6 for Caleb to resolve rather than ranked. It is a source-document conflict, and picking a side is his call, not this audit's. |
| Certification badge for lean and six sigma as a hero-level trust device | Stage B tested it and it failed. The one lean practitioner in the researched set leads with leadership positioning, not a Black Belt badge. Certification belongs as supporting detail in a bio line, which is small enough to fold into recommendation 4's page edit. |
| Third-party press, podcast appearances, or named-person praise | The pattern that recurs most strongly across the researched set (Justin Welsh's named praise, Brennan Dunn's named podcast appearances), and the one Caleb cannot build. It is a business development action, not a design change. It belongs on the outreach list. |
| Analytics installation | Named in section 3 as the prerequisite for measuring any of these changes, so it is deliberately not competing with them for a slot. It should ship before the promotion push regardless. |
| Usage or scale facts on `/work/vora` (the eleven service verticals named in `brand-context.md`) | Genuinely absent from the page and a real absence in the scorecard, but folded into recommendation 2 rather than ranked separately, since both edit the same region of the same page. |
| Two unassessed blog posts | Excluded by the sampling rule rather than by failure. They were not characterized, scored, or assumed similar to the sampled posts. A future run should read them before scoring the blog as a whole. |
| The `public/clients/brittany-lyons/` asset as a technical concern | The basic-auth gate in `proxy.ts` and the `noindex` header appear correctly configured for Next 16, which uses `proxy.ts` in place of `middleware.ts` (the project runs `next ^16.1.4` and no `middleware.ts` exists). Flagged here only so the gate is re-verified in production before anything draws attention to that path. |

## 9. Phase two visuals

Added 2026-08-04, after the ranked twelve. These are visuals worth building that either lost the ranking, depend on work that has not happened yet, or need Caleb in front of a camera. Same rules as everything above: pipeline tag, substantiation, and the honesty guardrail bind each one.

1. **A photograph of the actual working wall.** Real value-stream maps on a real wall, sticky notes, pencil marks. The design system is a digital homage to this object; one photograph of the physical thing makes the site's aesthetic documentary instead of decorative. Probably the highest credibility-per-pixel visual available. Pipeline: `real-capture`. Gate: the wall exists in a photographable state; if it does not currently, build it during the next real mapping session rather than staging one.
2. **A "what you walk away with" artifact on the audit pitch.** A rendered or photographed page of the real audit deliverable: the scored opportunity matrix, the 90-day plan. Buyers of a $750 audit want to see the shape of the thing before the call. Pipeline: `real-capture` or `code-only` render of the real template. Substantiation: the label states whose data it shows (own operation or template); never a fabricated client's.
3. **The own-operation value-stream map, drawn, on `/results`.** Case 001's "the map" section is prose today. A `code-only` VSM figure of Caleb's real week is evidence he can draw without waiting for a client: his operation, honestly labeled, demonstrating the literal craft being sold. Pipeline: `code-only`. Substantiation: case 001's existing "my own operation" label covers it.
4. **A screen recording of the site assistant mid-conversation.** It is live and real; a 20-second capture on `/work/site-assistant` is the cheapest proof-of-work media on the site. Pipeline: `real-capture`. Rails: no autoplay with sound, reduced-motion fallback to a still, any visitor-identifying content replaced with a test conversation and captioned as such.
5. **A live instrument panel, later.** Once the "measuring now" instrumentation from `/results` exists, real numbers rendered as a working-wall gauge cluster (calls answered this month, documents processed on arrival) would be the most on-brand visual possible: an instrument panel showing live readings. Pipeline: `code-only` fed by real system data. Gate: the measurement work ships first; no number renders before it is real.
6. **A 60 to 90 second "how I work" clip, only if Caleb is willing.** Real footage at the wall, not generated. All six benchmarked experts have video presence; this lost the ranking because it is the highest-effort ask on Caleb's side, not because it is low value. Pipeline: `real-capture`. Gate: Caleb's appetite for being on camera; a reluctant clip reads worse than none.
