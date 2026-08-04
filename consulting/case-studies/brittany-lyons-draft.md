# CASE 002, Brittany Lyons Interiors (private draft)

**PRIVATE DRAFT. Do not publish any part of this file.** Nothing here goes on calebbolden.com
until both of the following are true:

1. The engagement has ended.
2. Written permission from the client is in hand, covering her name, her business name, and a
   screenshot of the site on calebbolden.com.

Written 2026-08-04 against the build at `public/clients/brittany-lyons/` and the binding spec in
`consulting/brand/credibility-assessment.md`, section 4, item 1. It exists so the case study can
publish the same day permission lands, not before.

## Two open confirmations

Both must be answered before this ships. Neither can be answered by reading the repo.

**1. Caleb confirms the engagement terms in writing.** Was this paid, and at what shape (fixed fee,
trade, friends-and-family rate, unpaid portfolio work)? How long did it take from first
conversation to handoff? Did it launch, and if so when? The build in the repo is a preview. As of
2026-08-04 `www.brittanylyonsinteriors.com` still serves the client's existing Squarespace site, so
the new build has not gone live at that domain yet. The three commit messages that touch the folder
call it a "mockup" and a "v4 mockup," which reads as a preview under review rather than a
handoff. Everything below is written for a delivered engagement, so if the engagement ends without
a launch, the copy needs a different frame and this draft is the wrong starting point.

**2. The client permits her name and a screenshot.** Name, business name, and one screen capture of
the home page on calebbolden.com. In writing, from her, not inferred from a friendly conversation.
If she will also stand behind a number, that is a separate ask and a separate yes. No number goes
on the page unless she will defend it.

If either answer is no, this file stays here and nothing changes on the site.

## Facts verified from the build

Counted from `public/clients/brittany-lyons/` on 2026-08-04. These are checkable by anyone with the
folder open, which is why they are the only numbers the draft uses.

- 58 HTML pages: 31 journal posts and 27 other pages.
- The 27: home, about, services index plus 6 individual service pages, portfolio plus 3 project
  pages, 3 area pages, service-areas index, process, investment, journal index, testimonials, FAQ,
  contact, thank-you, 404, privacy, accessibility.
- Hand-built static HTML, CSS, and JavaScript. No CMS, no framework, no build step.
- Structured data across the set: local business, service, FAQ, blog posting, breadcrumb list,
  how-to, and review markup.
- The journal was migrated with its data: 31 post pages plus 32 JSON records under `journal-data/`.
- Content is fully readable with JavaScript off. The script only adds scroll reveal, a header state,
  and the mobile menu.
- Total folder weight is 17MB, and 15.7MB of that is the hero video.

Do not reuse the testimonials on `testimonials.html`. Those are her clients praising her work, not
anyone praising mine. Quoting them on my site would be borrowing credibility that was never lent.

---

## Paste-ready CASE 002 copy

### Placement

`/results` gains this as a new `<section>` inserted **above** the CASE 001 section, so the client
entry leads and CASE 001's "my own operation, not a client" label sits beneath it doing the
contrast work. CASE 001 is not edited.

### A note on the structure

CASE 001 runs four rails: the problem, the map, the build, the numbers. The spec for this item
calls for challenge, what I did, outcome. Those reconcile as three rails in CASE 001's exact
markup: same twelve-column grid, same hairline dividers, same `anno anno-blue` rail labels, same
`Reveal` delays. The fourth rail is dropped rather than filled with a number that does not exist
yet. If a defensible figure arrives later, it gets added back as a fourth "the numbers" row without
touching anything else.

### The copy

Rail: **the challenge**

> Brittany runs a boutique interior design studio in Dallas. She does the design work herself, which
> is the whole promise of hiring a boutique studio, and it means the hours she spends on her website
> are hours she is not spending in a client's house. Her site was on Squarespace, and it looked the
> way that arrangement usually looks after a few years. The work was good. Finding it was the
> problem. [CONFIRM: what she actually told me was wrong with the old site, in her words. Replace
> this last sentence with her framing if it differs from mine.]

Rail: **what I did**

> I rebuilt the site as hand-written static pages. That decision is the whole engagement in one
> line: no template to fight, no plugin to break, no monthly platform fee, and pages that load
> because there is almost nothing to load.
>
> The structure follows how people actually search for a designer. Six service pages, one per thing
> she sells, instead of one page listing all six. Three area pages for the Park Cities, Dallas and
> Oak Cliff, and the northern suburbs, because a homeowner in Frisco searches differently than one
> in Highland Park. A pricing page that answers the question everyone types in, with her real
> numbers on it, because a designer who publishes what the consultation costs gets fewer tire
> kickers on the phone.
>
> Her journal came across intact, all thirty-one posts, with the structured data underneath so
> search engines can read them properly. Every page carries markup for the business, the services,
> and the questions people ask. The whole site works with JavaScript turned off.

Rail: **the outcome**

> Fifty-eight pages, delivered [CONFIRM: delivery time, in weeks, from first call to handoff].
> [CONFIRM: launch status and date. If it has launched, say so plainly and link nothing. If it has
> not, this sentence comes out and the outcome ends at the page count.]
>
> There are no traffic or revenue figures here yet. The site is new, and I would rather publish this
> with a page count I counted myself than a number I rounded up. When there is one she will stand
> behind, it goes here.

### The JSX

Paste as a new section immediately before the `case 001` section in `app/results/page.tsx` (the
section currently starting at line 64). Prose above is the source of truth; if the two drift, the
prose wins.

```tsx
<section className="py-14" style={{ borderTop: '1px solid var(--color-hairline)' }}>
  <div className="mx-auto w-[90%] max-w-[1200px]">
    <Reveal>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="anno anno-blue">case 002 · brittany lyons interiors</p>
        <span
          className="anno rounded-[2px] px-2 py-1"
          style={{ background: 'var(--color-blue-wash)', color: 'var(--color-blue-deep)' }}
        >
          client work, published with permission
        </span>
      </div>
      <h2 className="type-display max-w-[22ch]" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}>
        A boutique design studio, off the template
      </h2>
    </Reveal>

    <div className="mt-10" style={{ borderTop: '1px solid var(--color-hairline)' }}>
      <Reveal>
        <div
          className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6"
          style={{ borderBottom: '1px solid var(--color-hairline)' }}
        >
          <p className="anno anno-blue sm:col-span-2">the challenge</p>
          <div className="space-y-5 sm:col-span-8 sm:col-start-4">
            <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-ink-muted)' }}>
              {/* paragraph 1 of "the challenge" */}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={70}>
        <div
          className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6"
          style={{ borderBottom: '1px solid var(--color-hairline)' }}
        >
          <p className="anno anno-blue sm:col-span-2">what I did</p>
          <div className="space-y-5 sm:col-span-8 sm:col-start-4">
            {/* three paragraphs of "what I did", each its own <p> at the same style */}
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-12 sm:gap-6">
          <p className="anno anno-blue sm:col-span-2">the outcome</p>
          <div className="space-y-6 sm:col-span-8 sm:col-start-4">
            {/* two paragraphs of "the outcome", then the screenshot figure */}
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</section>
```

Note the last rail has no `borderBottom`, matching how CASE 001's "the numbers" row closes its
group. No amber sticky in this section, see the publish-day checklist.

---

## The one-line addition for /services/web-development

`app/services/web-development/page.tsx`, line 36, currently reads:

```
proof: 'This site, Vora, and ChapterHQ are all my builds, running in production. The assistant in the corner is not a mockup.',
```

Append one sentence, so the whole string becomes:

```
proof: 'This site, Vora, and ChapterHQ are all my builds, running in production. The assistant in the corner is not a mockup. Brittany Lyons Interiors, a Dallas design studio, is fifty-eight hand-built pages I delivered as client work.',
```

If the launch confirmation comes back positive, "delivered as client work" can become "delivered and
launched." Not before.

## The /work LIVE entry line

`app/work/page.tsx` keeps its `systems` array for things I run. The client entry does not belong in
that array, because those three are mine and the separation is the point. Add a second list under a
`client work` rail label, using the same row markup as the `systems` map, with one entry:

- **Name:** Brittany Lyons Interiors
- **Description:** `A boutique Dallas interior design studio. Fifty-eight hand-built static pages: services, service areas, a pricing page, and a migrated journal.`
- **Status:** the same `pulse-dot` plus `live` annotation the systems rows use, but only if the site
  has actually launched. [CONFIRM: launch status.] If it has not launched, the status reads
  `delivered` with no pulse dot, because a pulse dot next to a site that is not serving traffic is a
  small lie.
- **Link:** none. The delivered build stays password-gated at `public/clients/brittany-lyons/`, and
  linking to her live domain from a case study invites her clients into my sales page. Link to
  `/results` instead, where CASE 002 lives.

---

## Screenshot spec

Instructions for the capture, not a capture. From the safety rails in the assessment, section 4,
item 1, and the asset manifest, `real-capture` item 1.

**What to capture.** `public/clients/brittany-lyons/index.html`, the home page, at 1440px viewport
width, cropped to the hero plus the first content section beneath it. The hero holds a video, so
capture on the poster frame (`hero-coastal-poster.webp`) rather than a paused video frame, and let
nothing about the still imply motion.

**Format and weight.** WebP or AVIF. Under 150KB. Maximum 1600px wide. The 15.7MB
`hero-coastal.mp4` in the client folder is never copied into this site, at any size, for any reason.

**Mount.** The taped-on print treatment, not a floating browser mockup: 1px hairline border, 2px
radius, no drop shadow. A mono `anno anno-blue` caption sits above it. This is the shared taped-print
frame component listed as `code-only` asset 3 in the assessment; if that component has not been
built yet, this case study is the first caller and builds it.

**Caption.** One plain sentence naming what is on screen. Something like `the home page as delivered`.
No "as you can see." No feature list.

**Dimension line.** One, annotating the page count, which is the only real number the entry carries.
If the delivery-time confirmation comes back with a defensible figure in weeks, that is the better
annotation and the page count moves into the caption. Never two dimension lines.

**Alt text.** Describes the work, not the medium: `Home page of the interior design site I built for
Brittany Lyons Interiors, showing the hero, the services grid, and the journal.` Not "screenshot of
a website."

**Placement and performance.** Mid-page, below the fold, inside the outcome rail, after the case
text. It is not the LCP element. Explicit width and height, lazy loaded, no `priority`. Static
image, no motion, so `prefers-reduced-motion` does not apply.

**One-time setup this depends on.** `next.config.ts` has no `images` block and `app/` ships no
raster images today. Whoever ships first between this and the "show the interface" screenshots
carries that setup, roughly two hours.

---

## Publish-day checklist

Run in order. Any unchecked box stops the publish.

1. **Permission letter received and filed.** Written, from the client, naming her, her business, and
   the screenshot. Saved next to this file. If she volunteered a quote, it is in the same letter or
   it does not exist.
2. **Both confirmations answered.** Engagement terms and launch status from Caleb, permission from
   the client. Every `[CONFIRM: ...]` marker in this file is resolved and deleted, not left in the
   published copy.
3. **Screenshot captured, compressed, and checked.** Under 150KB, max 1600px, WebP or AVIF, taped
   print mount, alt text written. Confirm no client contact detail, no address, and no third-party
   name is legible anywhere in the crop.
4. **Sticky budget check on /results.** The page spends its one amber sticky on "measure before
   publishing" in CASE 001. CASE 002 adds none. Confirm the rendered page still has exactly one
   sticky before committing.
5. **The truthful in-progress lines are replaced, not left standing beside the new entry.**
   `app/work/page.tsx` line 130 currently says there is nothing on the page with someone else's name
   on it. That sentence becomes false the moment CASE 002 publishes, and a visitor who reads both
   will trust neither. Replace it with the named entry and check `/results` for any parallel line
   that has gone stale.
6. **Read the whole thing once as the client.** She is the second reader after Caleb, and the first
   one who can withdraw permission. Anything she would not say about her own business out loud comes
   out.

## Things this draft deliberately does not do

- No number that is not counted from the build. No traffic, no rankings, no inquiries, no load time.
- No client quote. If she volunteers one in writing, it gets added then.
- No "trusted by" treatment, no logo, no implied second client.
- No link to her live domain from the case study.
- No reuse of her Houzz rating or her clients' testimonials as evidence about my work.
