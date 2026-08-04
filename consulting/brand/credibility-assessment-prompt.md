# Credibility assessment prompt

Paste everything below the line into a fresh session or hand it to a reviewer agent. Unlike the tone assessment, this one is NOT blind: the reviewer works with full knowledge of the design system and the prior findings, because the deliverable is prescriptive (what to build) rather than perceptual (what a stranger sees). The tone assessment measured how the site sounds; this one determines what would make its author read as an established, credible authority.

---

You are conducting a credibility audit of calebbolden.com, the site of an AI consultant for local small businesses (Caleb Bolden). The question you are answering on every page: **what would make a skeptical visitor conclude this person is an established, verifiable authority rather than someone who writes well?** You produce a ranked plan of cosmetic and content changes. You do not implement anything.

## Context you must read first

1. `consulting/brand/brand-context.md`: positioning, voice rules, palette, the three packages.
2. `DESIGN.md` and the utility contract in `app/globals.css`: the "working wall" design system. Every cosmetic recommendation must be expressible in this system's language (white mat board, blueprint-blue instrument marks, hairlines, mono annotations, dimension lines, one amber sticky per surface, light theme only, no purple) or explicitly labeled as a proposed extension of it.
3. `consulting/brand/tone-perception-assessment.md`: the prior blind read. Do not re-litigate its findings; the copy work it drove has shipped. Build on it, especially the "Do not touch" list, which remains binding.
4. The live pages, as rendered: `/`, `/results`, `/work`, `/work/vora`, `/work/chapterhq`, `/about`, `/how-i-build`, `/owners`, `/operators`, `/resources`, `/contact`, `/tools/ai-readiness`, `/tools/revenue-leak`, and one blog post.

## Available asset pipelines

Tag every recommendation with the pipeline that fills it. These are the only five:

| Tag | What it is | Use for |
|---|---|---|
| `real-capture` | Screenshots or screen recordings of Caleb's actual running systems (Vora, ChapterHQ, the site assistant, agent dashboards), or real photos of Caleb and his actual working wall | Proof. Always preferred where the visual's job is evidence. |
| `higgsfield-image` | AI-generated stills via the higgsfield CLI | Illustrative and diagrammatic content only: process figures, abstract working-wall textures, section illustrations. |
| `higgsfield-video` | AI-generated video via the higgsfield CLI | Motion illustrations, ambient section backgrounds, explainer visuals. |
| `mobbin-pattern` | Reference screens from Mobbin (name the exact pattern query, e.g. "consulting case study web", "team page credibility", "product screenshot section") | Layout reference for building a new section; never shipped directly. |
| `code-only` | Diagrams and figures drawn in HTML/CSS/SVG in the design system itself | Process diagrams, dimension-line annotations, timelines, anything the working wall can draw natively. |

**Honesty guardrail, non-negotiable:** generated media must never manufacture evidence. No AI-generated client photos, testimonial portraits, fake dashboards, fake metrics charts, fake "results" imagery, and no generated image presented as a photograph of anything real. The brand's entire position is "measure before publishing"; a fabricated visual would be a worse credibility failure than an empty page. If a visual's job is proof, the pipeline is `real-capture` or it does not get built. State this constraint back in your output so it survives into implementation.

## Pass 1: credibility inventory

For each live page, inventory the authority signals present and absent. Work through this checklist per page and cite what you find:

1. **Identity and face.** Is there a real photograph of Caleb anywhere on the site? A face is the single most-checked credibility signal for a personal brand; note every page where its absence is felt.
2. **Verifiable specifics.** Named employers, named systems, named sources, dates. Where does the copy make a claim a visitor could check, and where does it stay unverifiable?
3. **Third-party surface.** Links out to anything independent: LinkedIn, GitHub, published writing, press, chamber membership, certifications (lean/six sigma), business registration. What exists on the site now, and what is conspicuously missing?
4. **Proof-of-work media.** Where the site describes a system, can the visitor see it? Screenshots, recordings, live demos. The site assistant is a live demo; is it framed as one?
5. **Recency signals.** What tells a visitor this practice is alive this month: dated posts, a changelog, "now" markers, last-updated stamps?
6. **Depth markers.** Long-form content that demonstrates rather than claims expertise: teardowns, methodology writeups, the blog. Judge quantity and specificity, not just presence.

## Pass 2: visual audit

The site is deliberately spare, and the spareness is part of the brand. Your job is to find where spareness reads as *discipline* and where it reads as *thin*.

1. Count and describe every visual element per page (figures, diagrams, decorative canvas work, photos: currently believed to be near zero outside the hero instrument and the method figure).
2. For each page, judge: does this page's lack of visuals make it feel like a clean drafting sheet, or like a text file? Quote the moment the page starts to feel like a wall of prose, if it does.
3. For each spot where a visual would raise credibility, specify: what the visual shows, which pipeline builds it, and how it renders in the working-wall language (e.g. a real Vora screenshot mounted like a taped-on print with a mono annotation and dimension lines, not a floating drop-shadowed browser mockup).
4. Flag any spot where adding a visual would *hurt*: pages whose single-column austerity is doing persuasion work (check the prior assessment's do-not-touch reasoning before proposing changes there).

## Pass 3: the industry-credibility bar, researched

Do not benchmark from memory. Research the people actually winning trust in these lanes today, then derive the bar from what they demonstrably do.

**3a. Find the experts.** Using live web research (in this environment: the perplexity tools or WebSearch; never WebFetch), identify 6 to 10 named practitioners with real public footprints across these lanes:

1. AI consulting for small and mid-size businesses (not enterprise AI strategy).
2. Small business operations consulting and fractional COO work.
3. Automation and systems consultants (the Zapier/Make/agents-for-SMB crowd).
4. Lean/six-sigma or process-improvement consultants with a modern public presence.
5. Adjacent solo authorities whose model translates: productized-service consultants, the build-in-public solo founders who consult on the side.

Prefer practitioners a local-SMB owner or a referral partner might actually encounter (LinkedIn, YouTube, newsletters, chamber and trade-association circuits) over famous names owners never see. Name each person, their lane, and their primary surface, with URLs.

**3b. Extract the credibility anatomy.** For each expert, record what their public presence shows that earns trust: headshot and photography style, case study format and whether numbers are named, certifications displayed, speaking or workshop footage, newsletter and cadence, video presence and production level, how they handle pricing visibility, how they display client proof before they had much of it. Note patterns that recur across most of them; those recurring patterns are the actual industry bar.

**3c. Translate to this site.** For each recurring pattern: does it apply to a local-SMB audience (some signals are enterprise theater that would hurt here), where would it live on this site, and which pipeline builds it. Also name the one or two things NONE of the researched experts do that Caleb already does (the working-wall system, the measure-before-publishing stance, the live assistant demo) so differentiation is protected, not homogenized away. Established-consultant polish is the bar to clear, not the personality to adopt.

Candidate signals to look for while researching, beyond whatever you find: a real headshot and workspace photography; annotated product screenshots; a public methodology artifact (a real value-stream map, anonymized); talk/workshop footage or a clinic recording; press or directory listings; certifications; a visible client pipeline ("currently: 2 of 3 founding slots open"); video presence (a 60-90 second "how I work" clip).

## Deliverable

One document, in this order:

1. **Credibility scorecard**: per page, a 1-5 credibility score with the two strongest signals present and the two most damaging absences, cited. Precede it with the expert benchmark table from Pass 3 (name, lane, primary surface, URL, the two or three credibility signals worth learning from), so every later recommendation can cite which expert pattern it borrows.
2. **Ranked recommendations, maximum 12**, ordered by credibility gained per unit effort for the primary audience (the skeptical owner and the referral partner attaching their name). Each recommendation: title, page(s), what changes, `cosmetic` or `content` or both, pipeline tag, effort (hours/days), and one sentence on which fear it disarms.
3. **Do-now five**: the top five of those twelve, with enough spec detail (placement, working-wall treatment, copy angle) that an implementer needs no follow-up questions.
4. **The don't list**: changes that would raise visual density but lower credibility (stock-photo energy, fake-evidence risks, motif violations), stated so they stay off the roadmap.
5. **Asset manifest**: every visual asset the do-now five requires, grouped by pipeline, so `real-capture` items become a shot list for Caleb, `higgsfield-*` items become generation prompts, and `mobbin-pattern` items become reference queries.

Rules: cite real page content for every claim; respect the voice rules (no em dashes, no buzzwords, sentence-case headings) in everything you write; recommendations must be implementable without violating the design system's standing rules (light only, no purple, one sticky per surface, Archivo/Schibsted/Martian Mono only).
