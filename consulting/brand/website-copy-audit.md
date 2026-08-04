# Website copy audit

Audited against `consulting/brand/brand-context.md` (2026-08-03). Scope: the nine page
files listed in the audit brief (root, about, owners, operators, work, how-i-build,
resources, contact, blog) plus the components whose copy those pages render. Privacy
and terms excluded. This is a punch list, not a rewrite — no copy changes were made.

Severity key: **high** = costs conversions, **medium** = weakens the page, **low** = polish.

---

## Home (`app/page.tsx`)

The home page is assembled from ten components. Findings below are grouped by component
in render order.

**HeroInstrument.tsx**

- **High** (`components/HeroInstrument.tsx:37`) — H1 reads "**AI agents** that answer your
  calls, chase your leads, and clear your paperwork." Brand-context specifies the H1 voice
  as "I automate the work you shouldn't be doing" (first person, anti-busywork). The live
  H1 is third-person feature description, not the documented line. Fix: replace with the
  brand-context H1 or a close variant of it.
- **Medium** (`components/HeroInstrument.tsx:37`) — the H1 is a three-part list ("answer
  your calls, chase your leads, and clear your paperwork"), which is the rule-of-three
  pattern the voice rules ban. Fix: cut to one or two concrete actions.
- **High** (`components/HeroInstrument.tsx:22-24`) — primary hero CTA is "Analyze my
  business" (opens the chat widget), with "See my work" as secondary. Neither is the
  documented primary CTA (book a call) or the documented lead magnet (the readiness
  assessment). This is a third, undocumented conversion path competing with the
  "Let's talk" CTA used elsewhere on the same page (see Packages, below). Fix: decide
  whether the chat widget is the intended homepage primary action; if not, swap in
  "Let's talk" / a link to the readiness assessment.

**PainSolution.tsx** — no CTA in this section (accordion only); no findings.

**Process.tsx** — no findings. Headings and body copy are clean.

**AISystems.tsx** — no findings. "What I actually build" is a plain, functional label, which is acceptable for a mid-page section heading.

**Packages.tsx**

- No voice violations. "Let's talk" (`components/Packages.tsx:112`) is the audit card's CTA and matches the header nav CTA — this is the one place on the homepage that uses the documented primary CTA correctly.

**Proof.tsx**

- **High** (`components/Proof.tsx:11`) — Vora's description reads "An **AI-powered** CRM
  platform for service businesses..." "AI-powered" as decoration is explicitly on the
  brand's banned-words list. Fix: cut to "A CRM platform for service businesses" (matches
  how Work page already describes it, see below).
- **Low** (`components/Proof.tsx:11` vs `app/work/page.tsx:17`) — Vora's description
  differs between the two pages that carry it: home says "An AI-powered CRM platform for
  service businesses: missed-call text-back, lead follow-up, campaigns, and scheduling in
  one system," Work says "A CRM platform for service businesses: missed-call text-back,
  lead follow-up, campaigns, and scheduling in one system." Same product, two descriptions
  one buzzword apart. Fix: use one canonical description in both places.

**NowStrip.tsx / Industries.tsx** — no findings.

**CTA.tsx (bottom, dark band)**

- **High** (`components/CTA.tsx:172-176`) — closing CTA is again "Analyze my business"
  (opens chat with an email capture field). Same issue as the hero: this is the page's
  *second* non-documented primary CTA, meaning home has two "Analyze my business" chat
  CTAs and one "Let's talk" contact CTA competing for the same real estate. A visitor who
  scrolls the whole page sees three different framings of "get in touch."
- **Medium** (page-level, no single line) — the readiness assessment (the documented lead
  magnet, `/tools/ai-readiness`) is never linked from the home page at all — not in the
  hero, not in Packages, not in the closing CTA. It only appears on Resources. Fix: add it
  as the secondary path somewhere on home (e.g., "not ready to talk? take the readiness
  assessment").

---

## About (`app/about/page.tsx`)

- **High** (`app/about/page.tsx:122`) — "the method" paragraph runs five sentences with no
  break: "AI made automation cheap. It did not make judgment cheap. Most AI projects fail
  because they automate a process nobody understood, so I refuse to skip the mapping step.
  Interviews first, a value stream on the wall, honest scoring, then one build with one
  success metric. If the map says AI will not pay, I say that instead." (~58 words). In the
  8-of-12-column body width this reads as 5+ lines. Fix: split after "mapping step" into two
  paragraphs.
- **Medium** (`app/about/page.tsx:37`) — "the background" paragraph is also dense: "I came
  up through payments and fintech, working with US Bank, Elavon, and TSYS, then moved into
  product management in crypto infrastructure at Blockdaemon. Big companies are a
  masterclass in process..." (~50 words, two long sentences). Fix: break at the sentence
  boundary.
- **Medium** (`app/about/page.tsx:55`) — "the products" paragraph names only Vora and
  ChapterHQ ("Vora is a CRM platform for service businesses. ChapterHQ runs clubs and
  nonprofits.") and omits Real Estate Maite and Agent Team, both of which brand-context
  lists as proof points. About is the credibility page — it's the thinnest proof section on
  the site relative to what's documented. Fix: add Real Estate Maite and/or Agent Team, or
  link to Work where all four are listed.
- **Low** (`app/about/page.tsx:20-22`) — H1 "Builder first, consultant second" is a
  positioning statement, not a benefit statement — acceptable for an About page but doesn't
  tell a first-time visitor what they get. Not urgent; flagging for completeness.

CTA: "Let's talk" (`app/about/page.tsx:151-158`) is consistent with the documented primary
CTA. No competing CTA on this page — good.

---

## Owners (`app/owners/page.tsx`)

- **High** (`app/owners/page.tsx:16`) — "the after-hours call problem" body runs six
  sentences, ~85 words, in a narrow one-of-three-column layout at `lg:grid-cols-3`: "A
  customer calls at 6:40 on a Tuesday because their water heater just went out. Nobody
  picks up. They hang up, call the next name on the list, and that name usually wins the
  job. The missed call shows up in your log the next morning, filed next to a dozen others
  nobody looked at twice. That's not a phone problem. It's a business you already built
  losing work it already earned." At that column width this is 6-7 lines, well past the
  ~4-line guideline. Fix: cut to 2-3 sentences and land on the closing line ("That's not a
  phone problem...") faster.
- **Low** (`app/owners/page.tsx:19`) — "What's in the weekly issue" is a functional label
  rather than a persuasive subhead. Acceptable for a newsletter table-of-contents pattern;
  flagging only because it's the flattest of the three subheads on the page.

CTA: single clear CTA ("Get The Missed Call," `app/owners/page.tsx:84`) with no competing
action on the page — this page does CTA discipline correctly and is a good model for the
rest of the site.

---

## Operators (`app/operators/page.tsx`)

- **Medium** (`app/operators/page.tsx:16`) — "the manual-work tax" body runs ~65 words in
  the same narrow three-column layout as the Owners equivalent: "Somewhere in your business,
  someone is copying numbers from one spreadsheet into another, or chasing an approval
  through four Slack threads because the tool that's supposed to handle it doesn't talk to
  the other tool. None of it shows up on a line in the P&L. It shows up as hours nobody has
  left over for anything else." Fix: trim the first sentence, which carries two examples
  joined by "or" and reads long before it gets to the point.
- **Low** (`app/operators/page.tsx:19`) — same "What's in the weekly issue" label pattern as
  Owners; not urgent, listed for the pair.

CTA: single clear CTA ("Get The Workflow Brief," `app/operators/page.tsx:83`), no
competing action — same good pattern as Owners.

---

## Work (`app/work/page.tsx`)

- **High** (page-level — no CTA panel anywhere on the page) — Work is the credibility page
  (it lists Vora, ChapterHQ, the site assistant, and open source) and ends directly in a
  list of blog post excerpts with no CTA to book a call or take the assessment. About and
  How I Build both close with a "Start with the audit → Let's talk" panel; Work has no
  equivalent. A visitor convinced by the proof has nowhere obvious to go next. Fix: add the
  same closing CTA panel used on About/How I Build.
- **Low** (`app/work/page.tsx:41-43`) — H1 "Work" is a single word; the subhead does the
  actual explaining ("The systems I have built and run, the code I publish, and how I
  build."). Acceptable but generic; same pattern as How I Build and Blog below.

Voice: no violations found. Vora's description here ("A CRM platform for service
businesses...") is the clean version — see the Home/Proof.tsx cross-reference above.

---

## How I build (`app/how-i-build/page.tsx`)

- No high-severity findings. Body paragraphs are within a reasonable length (the longest,
  `app/how-i-build/page.tsx:44`, is ~48 words and reads as 3-4 lines at this column width).
- **Low** (`app/how-i-build/page.tsx:27-29`) — H1 "How I build" mirrors the nav label
  exactly; same generic-H1 pattern noted on Work and Blog.

CTA: "Let's talk" (`app/how-i-build/page.tsx:118-125`), consistent with About's panel and
the documented primary CTA. Good.

---

## Resources (`app/resources/page.tsx`)

- **Medium** (page-level) — the page has five separate CTAs (two "Open the..." links, three
  "Get the PDF" gated buttons via `ResourceGate`) and zero path to the primary CTA (book a
  call). A visitor who works through all five tools/checklists and is ready to talk has
  nothing to click. Fix: add a closing "ready to talk about your business? Let's talk" line
  or panel, matching About/How I Build.
- **Low** (`app/resources/page.tsx:87`) — "leave an email and I will send new ones as I
  write them" implies an ongoing relationship (a list) beyond the single PDF download,
  which isn't otherwise described on this page. Minor expectation-setting gap, not urgent.

Voice: clean. No buzzwords, no unsourced stats on this page (the stats live inside the
tool pages, which are out of scope and are properly sourced there).

---

## Contact (`app/contact/page.tsx`)

- **Medium** (`app/contact/page.tsx:89` vs `:99-101`) — route 3's h2 says "Book a call" but
  the button underneath it says "Pick a time." Two different verbs for the same action on
  the same row. Fix: match the button label to the heading, or vice versa.
- **Low** (`app/contact/page.tsx:69-76`) — the email route's CTA button literally is the
  email address ("caleb@calebbolden.com") rather than an action phrase. Common pattern,
  but it's the only CTA on the site that isn't a verb phrase; worth a look for consistency
  ("Email Caleb" vs. showing the address).

This page is, structurally, the site's actual "single primary CTA" answer — three
alternate routes to the same outcome, clearly ranked ("fastest," "direct," "calendar"). The
labeling mismatch above is the only issue.

---

## Blog (`app/blog/page.tsx`)

- **Low** (`app/blog/page.tsx:22-24`) — H1 "Blog" is a single word; acceptable for an index
  page, listed for completeness alongside the same pattern on Work and How I Build.
- **Low** (page-level) — no CTA anywhere on the page. Likely fine for a listing page by
  design, but worth a decision one way or the other rather than leaving it implicit.

Voice: clean.

---

## Site-wide CTA label inventory

Across the nine audited pages, the following distinct CTA labels appear for what are, in
several cases, the same underlying action (get in touch / start an engagement):

| Label | Where | Action |
|---|---|---|
| Let's talk | Header (all pages), Home/Packages, About, How I Build | → `/contact` |
| Analyze my business | Home/Hero, Home/CTA (bottom) | opens chat widget |
| See my work | Home/Hero (secondary) | → `/work` |
| Open the assistant | Contact | opens chat widget |
| Pick a time | Contact | → Calendly |
| Book a call | Contact (heading only, not the button) | n/a |
| Get The Missed Call | Owners | newsletter subscribe |
| Get The Workflow Brief | Operators | newsletter subscribe |
| Get the PDF | Resources (x3) | gated download |
| Open the scorecard / Open the calculator | Resources | → tool pages |

"Let's talk" is the closest thing to a consistent primary CTA and does match the roadmap
decision everywhere it appears. The chat-widget CTAs ("Analyze my business," "Open the
assistant") are the main source of inconsistency — they compete with "Let's talk" on the
same pages (home, contact) without a documented reason to prefer one over the other.

---

## Fix first (top 5, site-wide)

1. **Home hero H1 doesn't match the documented brand voice.** `components/HeroInstrument.tsx:37`
   should read the brand-context line ("I automate the work you shouldn't be doing") or a
   close variant, not the current third-person feature list.
2. **Home has three competing primary CTAs.** Hero and the bottom CTA both push "Analyze my
   business" (chat widget); Packages pushes "Let's talk" (contact). Pick one path per the
   roadmap decision and demote the others to secondary.
3. **"AI-powered" appears in Vora's homepage description** (`components/Proof.tsx:11`), a
   banned buzzword, and doesn't match Vora's own description on the Work page. Fix in one
   place, make both pages match.
4. **Work has no closing CTA at all.** The page that carries the most proof (Vora,
   ChapterHQ, Real Estate Maite via Home/Proof, open source) ends in a blog list with
   nothing to click next. Add the same "Start with the audit → Let's talk" panel used on
   About and How I Build.
5. **The readiness assessment (the documented lead magnet) is invisible outside Resources.**
   It doesn't appear on Home, About, Owners, Operators, Work, or Contact — only Resources
   links to it. For a tool the roadmap treats as the anchor lead magnet, it has almost no
   surface area.

---

## Severity totals

- High: 8
- Medium: 8
- Low: 9
