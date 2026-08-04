# Credibility assessment prompt

Paste everything below the line into a fresh session or hand it to a reviewer agent. Unlike the tone assessment, this one is NOT blind: the reviewer works with full knowledge of the design system and the prior findings, because the deliverable is prescriptive (what to build) rather than perceptual (what a stranger sees). The tone assessment measured how the site sounds; this one determines what would make its author read as an established, credible authority.

The run is staged: stage A is the site inventory, stage B is the expert research, stage C is the synthesis that writes the deliverable. Each stage writes an intermediate file, so the whole thing can run as three agents in sequence or as one agent with checkpoints. Everything the runner needs, including the staging instructions and the failure protocols, is below the line.

---

You are conducting a credibility audit of calebbolden.com, the site of an AI consultant for local small businesses (Caleb Bolden). The question you are answering on every page: **what would make a skeptical visitor conclude this person is an established, verifiable authority rather than someone who writes well?** You produce a ranked plan of cosmetic and content changes. You do not implement anything.

## Context you must read first

1. `consulting/brand/brand-context.md`: positioning, voice rules, palette, the three packages.
2. `DESIGN.md` and the utility contract in `app/globals.css`: the "working wall" design system. Every cosmetic recommendation must be expressible in this system's language (white mat board, blueprint-blue instrument marks, hairlines, mono annotations, dimension lines, max one amber sticky per section, light theme only, no purple) or explicitly labeled as a proposed extension of it.
3. `consulting/brand/tone-perception-assessment.md`: the prior blind read. Fixes 2 through 5 of its ranked list shipped in commit c6e2698; do not restate them as new findings. Its "Do not touch" list remains binding. Its persona objections and doubt moments are the fear inventory you will rank against later, so read them closely.
4. The live pages. Do not work from a hand-written page list. Derive the audit surface from `app/sitemap.ts` and audit every entry it emits, including the blog posts it appends. `/privacy` and `/terms` are out of scope for credibility scoring; name them as deliberately excluded rather than dropping them silently. Every other URL gets an explicit "assessed" or "not assessed, and why" line.

Two things this derivation surfaces that a hand-list would miss: the three `/services/*` pages carry sitemap priority 0.9 and are search-entry pages that do not appear in the nav, and `/work/site-assistant`, `/work/open-source`, and `/blog` exist. For the blog, assess the index plus the newest and the oldest post, so recency and depth are both judgeable (four posts exist and the featured one is from January).

## The bounding constraint: the proof gap

Fix #1 of the tone assessment (every credibility exhibit on the site is self-built, because there is no first client result yet) is unresolved by design, not by oversight. It is the ceiling on every score in this audit. State it once at the top of your deliverable as the bounding constraint, mark which pages have a score capped by it, and then do not re-derive it page by page. A page that has done everything possible short of a client result should be scored on what it controls.

## Tools and evidence

- **Fetching pages**: use `ctx_fetch_and_index` for page content. Never use WebFetch; it is denied in this environment.
- **Rendered state**: text fetches cannot answer pass 2. For anything about how a page looks (visual counts, whitespace density, what sits above the fold, whether a section reads as a wall of prose), drive the playwright-server MCP: `browser_navigate` then `browser_take_screenshot`, and look at the screenshot.
- **The repo is available**: read `app/`, `components/`, and `content/blog/` directly to confirm what a page actually contains, which components render, and what is real versus placeholder.
- **Failure protocol**: any URL you cannot fetch or render is marked NOT ASSESSED in the scorecard with the reason. Never score a page you did not retrieve. Never cite a search-engine summary or a cached snippet as page content.

## How this run is staged

Write each stage to its own file before the next stage starts, and name the files in your final output.

- **Stage A, site inventory (passes 1 and 2)**: write to `consulting/brand/credibility-stage-a-inventory.md`. Raw per-page findings, quotes, screenshot observations, and the pipeline-tagged visual opportunities.
- **Stage B, expert research (pass 3)**: write to `consulting/brand/credibility-stage-b-experts.md`. The verified expert set, the anatomy table, and the recurring patterns.
- **Stage C, synthesis (the deliverable)**: read stage A and stage B from their files, not from memory, and write `consulting/brand/credibility-assessment.md`. This stage carries the most judgment and must not run in a context already full of raw fetches. If you are running all three stages as one agent, checkpoint between B and C: the synthesis works from the two stage files.

## Available asset pipelines

Tag every recommendation with the pipeline that fills it. These are the only five:

| Tag | What it is | Use for |
|---|---|---|
| `real-capture` | Screenshots or screen recordings of Caleb's actual running systems (Vora, ChapterHQ, the site assistant, agent dashboards), or real photos of Caleb and his actual working wall | Proof. Always preferred where the visual's job is evidence. |
| `higgsfield-image` | AI-generated stills via the higgsfield CLI | Illustrative and diagrammatic content only: process figures, abstract working-wall textures, section illustrations. |
| `higgsfield-video` | AI-generated video via the higgsfield CLI | Motion illustrations, ambient section backgrounds, explainer visuals. |
| `mobbin-pattern` | Reference screens from Mobbin (name the exact pattern query, e.g. "consulting case study web", "team page credibility", "product screenshot section") | Layout reference for building a new section; never shipped directly. |
| `code-only` | Diagrams and figures drawn in HTML/CSS/SVG in the design system itself | Process diagrams, dimension-line annotations, timelines, anything the working wall can draw natively. |

Two pipeline accuracy rules:

- Any `higgsfield-image` or `higgsfield-video` generation prompt you write must follow the installed CLI's real command reference at `~/Projects/agent-config/skills/design-ref/SKILL.md`, so what you hand over is runnable rather than plausible-looking.
- Every `mobbin-pattern` item carries the label "unverified reference query, check before using" unless the Mobbin session is re-authenticated and you actually ran the query and saw results.

## Honesty guardrail, non-negotiable

This covers any credibility signal, media or copy, not just generated images.

- No AI-generated client photos, testimonial portraits, fake dashboards, fake metrics charts, fake "results" imagery, and no generated image presented as a photograph of anything real.
- No claim the site cannot substantiate on request: client counts, slot scarcity, "trusted by" rows, implied volume, implied team size.
- A `code-only` diagram that depicts a specific engagement is evidence, not illustration, and falls under this rule the same way a screenshot does. Fabricated process maps presented as engagement artifacts go on the don't list by name.
- If a visual's job is proof, the pipeline is `real-capture` or it does not get built.

The brand's entire position is "measure before publishing"; a fabricated signal would be a worse credibility failure than an empty page.

Enforcement: every recommendation carries a required `substantiation` field naming the artifact or fact that makes it true today. If that field cannot be filled, the recommendation is cut, not softened. Capacity language follows the same rule: "taking three clients this quarter" is truthful and fine, "2 of 3 founding slots open" implies a client who does not exist and is not.

## Stage A, pass 1: credibility inventory

For each page in the derived surface, inventory the authority signals present and absent. Work through this checklist per page and cite what you find:

1. **Identity and face.** Is there a real photograph of Caleb anywhere on the site? A face is the single most-checked credibility signal for a personal brand; note every page where its absence is felt.
2. **Verifiable specifics.** Named employers, named systems, named sources, dates. Where does the copy make a claim a visitor could check, and where does it stay unverifiable?
3. **Third-party surface.** Links out to anything independent: LinkedIn, GitHub, published writing, press, chamber membership, certifications (lean/six sigma), business registration. What exists on the site now, and what is conspicuously missing?
4. **Proof-of-work media.** Where the site describes a system, can the visitor see it? Screenshots, recordings, live demos. The site assistant is the test case: `/work/site-assistant` calls it "a working agent, not a demo" while `brand-context.md` calls it "a live demo". Assess which framing a visitor actually encounters, whether the difference costs anything, and flag the source-document conflict for Caleb to resolve rather than picking a side yourself.
5. **Recency signals.** What tells a visitor this practice is alive this month: dated posts, a changelog, "now" markers, last-updated stamps?
6. **Depth markers.** Long-form content that demonstrates rather than claims expertise: teardowns, methodology writeups, the blog. Judge quantity and specificity, not just presence.

## Stage A, pass 2: visual audit

The site is deliberately spare, and the spareness is part of the brand. Your job is to find where spareness reads as *discipline* and where it reads as *thin*.

1. Count and describe every visual element per page (figures, diagrams, decorative canvas work, photos: currently believed to be near zero outside the hero instrument and the method figure). Use screenshots for this, not markup reading alone.
2. For each page, judge: does this page's lack of visuals make it feel like a clean drafting sheet, or like a text file? Quote the moment the page starts to feel like a wall of prose, if it does.
3. For each spot where a visual would raise credibility, specify: what the visual shows, which pipeline builds it, and how it renders in the working-wall language (e.g. a real Vora screenshot mounted like a taped-on print with a mono annotation and dimension lines, not a floating drop-shadowed browser mockup).
4. Flag any spot where adding a visual would *hurt*: pages whose single-column austerity is doing persuasion work (check the prior assessment's do-not-touch reasoning before proposing changes there).
5. Every proposed visual carries its safety rails, or it is not specified yet: alt text (or an explicit decorative marking), format and a rough weight budget, `prefers-reduced-motion` behavior if it animates, and whether it lands in the hero or otherwise affects LCP. Standing constraint: no autoplaying video above the fold. Note also that the site currently ships zero raster images and has no `next/image` configuration, so the first `real-capture` recommendation carries the one-time image-pipeline setup in its effort estimate.

## Stage B, pass 3: the industry-credibility bar, researched

Do not benchmark from memory. Research the people actually winning trust in these lanes today, then derive the bar from what they demonstrably do.

**3a. Find the experts.** Using live web research (in this environment: the perplexity tools or WebSearch; never WebFetch), identify 6 named practitioners with real public footprints across these lanes:

1. AI consulting for small and mid-size businesses (not enterprise AI strategy).
2. Small business operations consulting and fractional COO work.
3. Automation and systems consultants (the Zapier/Make/agents-for-SMB crowd).
4. Lean/six-sigma or process-improvement consultants with a modern public presence.
5. Adjacent solo authorities whose model translates: productized-service consultants, the build-in-public solo founders who consult on the side.

Six done properly beats ten done thin. Prefer practitioners a local-SMB owner or a referral partner might actually encounter (LinkedIn, YouTube, newsletters, chamber and trade-association circuits) over famous names owners never see. Name each person, their lane, and their primary surface, with URLs.

Verification is part of the job. For each expert: fetch their primary surface with `ctx_fetch_and_index`, and record one verbatim quote or one specifically described element from that page as evidence you actually saw it. Any attribute you did not directly observe gets an explicit `unverified` marker.

**3b. Extract the credibility anatomy.** Record these five attributes per expert, all observable from a fetched site:

1. Headshot and photography style.
2. Case study format, and whether numbers are named.
3. Certifications displayed.
4. Pricing visibility.
5. How they display client proof, especially how they handled it before they had much of it.

Video, speaking, and workshop presence: note it only if it is directly linked from their own site, otherwise mark it unverified rather than inferring it. Then note the patterns that recur across most of the set; those recurring patterns are the actual industry bar.

Failure branches, so a thin result stays honest:

- A lane that returns only enterprise names is itself a finding about where the lane's public attention sits. It is not a license to substitute an enterprise name and treat it as the SMB bar.
- If fewer than 4 experts verify, mark pass 3c low-confidence in both the stage file and the deliverable rather than proceeding as if the bar were established.

**3c. Translate to this site.** For each recurring pattern: does it apply to a local-SMB audience (some signals are enterprise theater that would hurt here), where would it live on this site, and which pipeline builds it.

Then run the differentiation test rather than asserting it. Caleb's three candidate differentiators are the working-wall system, the measure-before-publishing stance, and the live assistant. Check each against the researched set and report which ones actually hold (no researched expert does it) and which do not. If one does not hold, say so plainly instead of protecting it. Established-consultant polish is the bar to clear, not the personality to adopt.

Candidate signals to look for while researching, beyond whatever you find: a real headshot and workspace photography; annotated product screenshots; a public methodology artifact (a real value-stream map, anonymized); talk/workshop footage or a clinic recording; press or directory listings; certifications; a truthful capacity statement; video presence (a 60-90 second "how I work" clip).

## Stage C: the deliverable

Read `consulting/brand/credibility-stage-a-inventory.md` and `consulting/brand/credibility-stage-b-experts.md`, then write one document to `consulting/brand/credibility-assessment.md`.

Open it with the bounding constraint (the proof gap, stated once, as described above), then the eight numbered sections in this order:

1. **Expert benchmark table** (from stage B): name, lane, primary surface, URL, the verifying quote or element, and the two or three credibility signals worth learning from. This comes first so every later recommendation can cite which expert pattern it borrows, and so low-confidence research is visible before anything is ranked.
2. **Credibility scorecard**: per page, a 1-5 credibility score. Anchor the scale so two runs can be diffed: 5 means a skeptical owner could verify the page's core claims without leaving it, and the page carries at least one signal the researched experts also carry; 1 means every claim is self-asserted and unverifiable. Evidence is asymmetric, as in the sibling tone prompt: give the single strongest signal present, and the two absences that would move the score up one point. Those absences are the next run's checklist. Mark pages whose score is capped by the proof gap.
3. **Ranked recommendations, maximum 12.** Rank by which unresolved doubt moment or unanswered objection from `tone-perception-assessment.md` the recommendation closes; that file's persona objections are the fear inventory, and they are also the source for the "which fear it disarms" line. Do not rank by an unmeasurable "credibility gained per unit effort" proxy; real before-and-after measurement needs analytics, which is not installed yet, so note that as the prerequisite. The owner and the referral partner lead the ranking, but operators are brand-context's named consulting buyer: a recommendation that specifically moves the operator must say so and cannot be auto-deprioritized for being off the lead personas. Each recommendation carries: title, page(s), what changes, `cosmetic` or `content` or both, pipeline tag, `substantiation` (the artifact or fact that makes it true today), effort (hours/days), the doubt moment it closes, and one sentence on which fear it disarms.
4. **Do-now five**: the top five of those twelve, with enough spec detail (placement, working-wall treatment, copy angle, and for any visual its alt text, weight budget, reduced-motion behavior, and LCP impact) that an implementer needs no follow-up questions.
5. **The don't list**: changes that would raise visual density but lower credibility (stock-photo energy, fake-evidence risks, fabricated process maps presented as engagement artifacts, motif violations), stated so they stay off the roadmap.
6. **The honesty guardrail, restated**: the full guardrail from this prompt, in your own document, so it survives into implementation instead of living only in the brief.
7. **Asset manifest**: every visual asset the do-now five requires, grouped by pipeline, so `real-capture` items become a shot list for Caleb, `higgsfield-*` items become generation prompts written against the CLI's real command reference, and `mobbin-pattern` items become reference queries carrying the unverified label.
8. **Cut list**: everything passes 1 and 2 surfaced that did not make the twelve, one line each with why it lost. No silent truncation.

Rules: cite real page content for every claim; respect the voice rules (no em dashes, no buzzwords, sentence-case headings) in everything you write; recommendations must be implementable without violating the design system's standing rules (light only, no purple, max one amber sticky per section, Archivo/Schibsted/Martian Mono only).
