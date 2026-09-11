# Project showcase design spec

Date: September 11, 2026

Status: Design corrected after partial hardening; implementation planning remains provisional. The run returned fix-first with no Critical findings, but Feasibility, the independent reviewer, and finding auditors failed. Website changes and publication have not been performed. See Document review below.

Site: calebbolden.com

Scope: Work, project case studies, homepage proof, and How I build.

## 1. Purpose

Make Caleb's products and engineering work inspectable without requiring access to private repositories. Visitors should see a product, understand one meaningful workflow, and find evidence of Caleb's contribution.

The central story is: **I build useful AI products and the tools needed to develop and operate them.**

Business visitors enter through Vora and recognizable operational problems. Technical visitors can inspect agent execution, configuration, review, and runtime decisions. Both paths lead to the same project catalog. Writing remains visible through the existing notes section.

This spec turns the recommendations in [/Users/calebbolden/Projects/consulting/calebbolden.com/docs/research/2026-09-11-project-showcase-review.md](/Users/calebbolden/Projects/consulting/calebbolden.com/docs/research/2026-09-11-project-showcase-review.md) into design requirements. That report contains the project inventory, implementation citations, attribution findings, and maturity caveats.

### Success criteria

1. A visitor can identify what each featured project does from its title, summary, and primary visual.
2. Every featured project has a working detail destination and an inspectable workflow.
3. Business meaning appears before technical detail; contribution, maturity, and demonstration type are explicit.
4. Private projects receive the same presentation quality as public projects, with source links optional.
5. All five projects remain usable on a small screen, with keyboard navigation, reduced motion, and static fallbacks.

## 2. Scope and decisions

| Area | Decision |
|---|---|
| Featured projects | Vora, Agent Team, Agent Config, Control Center, and Prism. |
| Website architecture | One typed project catalog and shared case-study sections in the existing Next.js application. |
| Demonstration architecture | Public, purpose-written fixtures rendered locally in the browser. Real recordings may supplement them after review. |
| Visual identity | Preserve the working wall: white, blueprint blue, graph-paper margins, thin rules, existing fonts. |
| Navigation and conversion | Retain Work in the existing navigation. Use project links and the existing contact route; no new top-level project links. |

The first release includes one primary interaction per flagship. ChapterHQ, the site assistant, and existing secondary work remain discoverable. Do not silently remove or relabel existing projects during catalog migration.

This spec supersedes the Work hub and detail-template portions of [/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-07-14-ai-work-surface-design.md](/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-07-14-ai-work-surface-design.md). It retains that document's broader consulting, technical-credibility, and writing goals. Homepage hero behavior, service content, packages, client previews, and blog infrastructure are outside this change.

### Architecture alternatives considered

| Option | Benefit | Tradeoff and decision |
|---|---|---|
| Add media to each existing page independently | Fastest first improvement. | Repeats content and status across pages. Useful as a capture spike, not the final structure. |
| Shared catalog, evidence metadata, and fixture demonstrations | Consistent content, reusable layout, low operating cost, and a clear boundary around private systems. | Selected foundation. Project-specific interactions remain small components. |
| Isolated, resettable hosted product environments | Highest fidelity for visitors who need a hands-on product trial. | Valid later extension. Provisioning, isolation, reset behavior, abuse controls, and ongoing maintenance need separate verification. It is not required to explain these projects well. |

Do not introduce a new CMS, generic workflow engine, agent backend, or public terminal service for this release. The existing site is sufficient for authored content and bounded interactions.

## 3. Information architecture

```text
/                                updated proof section → project pages
/work                            curated catalog
  /work/vora                     existing URL, expanded case study
  /work/agent-team               new case study
  /work/agent-config             new case study
  /work/control-center           new case study
  /work/prism                    new case study
  /work/chapterhq                existing URL, retained
  /work/site-assistant           existing URL, retained
  /work/open-source              existing public-source collection, retained
/how-i-build                     illustrated responsibilities → project pages
/contact                         existing contact destination
```

Catalog filters are **All**, **Products**, and **Developer tools**. Vora is a Product. The four other flagships are Developer tools. Category describes the work, not repository visibility. A private tool belongs under Developer tools; public source is a separate optional link.

Use native links with `?category=products` and `?category=developer-tools`; All uses `/work`. The URL is the single owner of category state. Render its selected category on direct load. Unknown or repeated category values resolve to All. With JavaScript, enhance ordinary same-tab activation with a history update and derive the list from the URL using already public catalog records; keep the controls and count announcement mounted. Do not maintain a second independently mutable category value. Modified clicks retain native link behavior. Browser back/forward restores the selected category. Enhanced navigation keeps focus on the selected control and announces the count without moving focus into the list. Without JavaScript, links perform normal document navigation with a visible text count and native focus behavior. Filter only the catalog; How I build, writing, client-work, audit, and contact remain available.

The first release uses this migration map. Order applies before extracting the featured entry; it does not duplicate that entry in the remaining list.

| Stable slug / destination | Category | Order | Visible catalog filters |
|---|---|---:|---|
| `vora` → `/work/vora` | Products | 1 | All, Products |
| `prism` → `/work/prism` | Developer tools | 2 | All, Developer tools |
| `agent-team` → `/work/agent-team` | Developer tools | 3 | All, Developer tools |
| `agent-config` → `/work/agent-config` | Developer tools | 4 | All, Developer tools |
| `control-center` → `/work/control-center` | Developer tools | 5 | All, Developer tools |
| `chapterhq` → `/work/chapterhq` | Products | 6 | All, Products |
| `site-assistant` → `/work/site-assistant` | Products | 7 | All, Products |
| `open-source` → `/work/open-source` | Collection, outside the catalog | Separate section | Its collection link stays visible in every filter view; excluded from result counts. |

Expected result counts are All: 7, Products: 3, Developer tools: 4, including the featured entry. Homepage-only secondary entries, including the existing Real Estate Maite entry, retain their homepage placement and status; this spec does not invent a detail route for them. Every existing `/work/*` route is preserved by the map above.

## 4. Work page

### Composition

The page is a vertical editorial layout, with one large feature followed by thin-rule project rows. It should read as a curated body of work rather than a uniform dashboard grid.

| Order | Section | Required content and behavior |
|---|---|---|
| 1 | Introduction and filters | H1, short positioning statement, category links. Compact enough that the first product visual begins within the first desktop viewport at 1440×900 with chat collapsed. |
| 2 | Featured work | Vora leads All and Products. Prism leads Developer tools. Large poster beside project summary, role, maturity, and “Explore Vora” or “Explore Prism.” |
| 3 | Project list | Remaining matching flagships in editorial rows, followed by matching secondary projects according to the migration map. Do not repeat the featured project in the list. |
| 4 | How I build and notes | One illustrated teaser for `/how-i-build`, the existing Open source destination, and the existing recent-writing links. |
| 5 | Client work | Preserve the existing client-work positioning and `/results` link. Reconcile dated wording without inventing a completed client engagement. |
| 6 | Audit and contact | Preserve the fixed-scope audit offer and `/tools/ai-readiness` path. Include “Have a workflow like this?” and “Discuss a project” linking to `/contact`. Pricing/service changes require separate scope. |

Draft introduction:

> **Products and tools I've built**
>
> I build AI products for real operational work, along with tools for developing and running them. Explore a workflow, see the decisions behind it, and find out what each project does today.

### Project entry anatomy

Each entry has a poster, project name, a 25–45 word summary, a concise contribution line, maturity, and one clear detail link. Use a separate enlarge control only where an image gallery is available. Do not nest buttons inside a whole-card link.

The feature uses a roughly 7/5 media/copy split. Supporting rows use a smaller media column and a wider text column; dividers and spacing establish grouping. Alternate visual subject matter, not arbitrary background colors. Posters show a meaningful state rather than a logo alone.

A missing optional source link produces no empty button, disabled GitHub control, or lock icon. A missing poster during development produces an explicit development placeholder. Unfinished flagship entries must not be published as though their demonstration exists.

## 5. Shared case-study layout

| Order | Section | Content contract |
|---|---|---|
| 1 | Project introduction | Back to Work, name, one-sentence purpose, contribution, maturity, and optional product/source links. A single H1. |
| 2 | Primary demonstration | Large media frame, visible demonstration label, short caption, interaction controls, and optional gallery. Appears before stack details. |
| 3 | Problem and workflow | 80–140 words on the problem, followed by the concrete steps and observed or simulated outcome. The primary interaction can occupy this section when the top frame is a recording. |
| 4 | Engineering and evidence | Two or three decisions: constraint → choice → consequence. Add contribution/credits, current limits, and a dated “About this example” disclosure. |
| 5 | Continue | One or two related projects, Back to Work, and “Discuss a similar project” linking to `/contact`. |

Target 400–700 words of narrative per flagship, excluding transcripts and optional technical disclosures. Technical detail is available through ordinary headings and `<details>` disclosures. Core meaning, maturity, and simulation labels must not be hidden inside a disclosure.

Use the existing `WorkDetail` layout as the migration starting point. Extract richer shared sections behind an explicit rich-project input while retaining the current legacy input for ChapterHQ and the site assistant. Do not force new maturity values into the old `live/building/running` union. The Open source collection has its own page and does not use WorkDetail. Full secondary-story redesign is outside this release. Existing URL paths stay stable. A site build does not prove that every link works; route and interaction verification is required separately.

Resolve related slugs through published records with existing detail destinations. Omit unavailable related links while retaining Back to Work and contact. Draft entries are excluded from production links, metadata, related lists, and sitemap; their new detail routes return 404 in production. Local development can render clearly labeled drafts without a deployed preview bypass. Existing Vora remains reachable through its legacy page until its richer case study is ready. Counts reflect currently published entries during migration; the complete-release requirement remains 7/3/4.

### Shared interaction behavior

Each demonstration starts in a deterministic initial state and has an explicit Reset control. Selecting a scenario resets its step, result, and expanded receipt. State is local to the current page and is not persisted to storage or encoded in share URLs.

Use real buttons and a text description of the active state. Agent Team and Prism use ordered stage/event controls; selecting a stage changes the preview and caption together, with manual Next/Previous and disabled ends. Vora uses its named branching transitions; Agent Config uses variant/stale/regenerate controls; Control Center uses filters, record selection, and the named run transition. Do not add a generic Next button that bypasses a decision. No automatic playback is required. A status announcement reports only the new step/result, not the entire panel.

No website demonstration sends a message, approves a real action, invokes a model, starts a process, queries a private service, or changes a repository. Button labels and the nearby simulation label must make their scope understandable.

When JavaScript is unavailable, render the first frame plus a complete ordered text walkthrough, including every scenario and terminal branch. Required showcase content must not inherit the existing Reveal component's initially invisible state. Hide enhancement-only controls until their module and hydration are ready. A failed enhancement retains readable static content and offers retry without exposing dead controls. Media failure retains the caption, text walkthrough, and retry/open-image option. A failed video never removes the case study's explanation.

## 6. Vora demonstration

**Purpose:** show an AI employee proposing an action that a person can approve or reject.

**Draft summary:** “An industry-aware CRM with AI employees, messaging, and voice workflows. Selected consequential actions can wait for human approval.”

**Presentation:** a request card beside a simplified approval panel and CRM result. Use one fictional service business and invented customer records. The first release is labeled **Interactive simulation · sample data**. A fresh recording from an isolated demo tenant can be added as **Product recording · sample data** after the exact path is checked.

A sample-outcome selector offers Succeeds and Fails, defaulting to Succeeds. Changing it restarts the walkthrough at Request received. Approval records a decision; the selected sample outcome determines the later execution result.

| State | What the visitor sees | Allowed transition |
|---|---|---|
| Request received | A fixed customer request and the proposed follow-up. | “Review proposed action” opens the approval state. |
| Awaiting approval | Action summary, recipient alias, reason for approval, and sample message. | “Approve example” or “Reject example.” |
| Approved | A visible approval decision. No delivery claim yet. | “Show sample result.” |
| Completed | A clearly fictional completion record and corresponding CRM activity. | Reset. |
| Rejected | A rejected decision and “No action taken in this example.” | Reset. |
| Execution failed | “Action approved; sample execution failed,” a fictional error reason, and no completed CRM activity. | Reset. |

The pending state must not progress to completion through Next alone. Rejection cannot lead to completion without Reset. After approval, “Show sample result” selects Completed or Execution failed from the chosen outcome. A failure never displays a delivery confirmation. Reset restores Succeeds and Request received. The text walkthrough includes rejection, successful execution, and failed execution.

Asset production must select a real supported action whose autonomy configuration requires approval. Record that configuration in the internal evidence notes. Until it is verified, copy must describe the concept rather than assert a particular live delivery path. Vora can auto-execute some destructive tools under its autonomy policy; approval is not universal.

Future action verification or recording requires a disposable isolated demo environment with invented records, no reachable customer contacts or production data, and sandbox/test providers or blocked/mocked outbound delivery. Never verify the action against a production tenant. Record environment isolation and provider mode, not credential values, in internal evidence notes. If these preconditions cannot be met, retain the labeled conceptual simulation. Production access and real sends are not asset-preparation shortcuts.

Voice-to-CRM recording, an industry switcher, and knowledge retrieval are follow-on demonstrations. Voice depends on configured mode, provider, and tier; booking defaults to approval. Vora v2 remains an optional architecture note labeled as planned work.

## 7. Agent Team demonstration

**Purpose:** let a visitor inspect why a coding task continues, retries, or stops.

**Draft summary:** “A system for moving coding tasks through isolated workspaces, separate reviews, QA retries, and merge decisions.”

**Presentation:** an ordered timeline beside an evidence panel. Use a fictional repository and task. Label it **Sample run · deterministic simulation**. These are new examples, not production logs or a replay product.

| Scenario | Required behavior | Terminal state |
|---|---|---|
| Passes review | Show task intake, isolated implementation, separate reviews, QA, draft PR, CI, and the default legacy green-PR auto-merge path. Group these into five visible stages; details reveal the internal steps. | “Sample run complete · automatic merge.” |
| QA retry | QA reports a specific fictional assertion failure; a debugger attempt changes the sample artifact; QA passes on the next attempt. | Complete, with the failed attempt still visible. |
| Security block | A concrete fictional security finding stops progression before PR/merge. Later stages display “Not reached.” | “Blocked by review.” |

The default five visible stages are **Task**, **Implementation**, **Reviews**, **QA**, and **Delivery**. Each panel contains role, decision, and a short artifact excerpt. A successful run must not erase its retry history. Selecting another scenario resets all stage state. Stages beyond a blocking review are visible but disabled; keyboard or direct step selection cannot bypass the block.

The demo configuration must be shown in a compact disclosure. Merge enforcement, queue enforcement, sandboxing, and anomaly termination are off by default in the inspected project; hard caps are unset. If a sample shows any of these controls acting, it must name the enabled setting. Do not claim universal human approval or active sandboxing.

Pin Passes review and QA retry to merge-policy enforcement disabled, the inspected default, with green CI allowing the legacy automatic merge path. Show that configuration next to the final decision; the website does not execute the merge. Security block terminates in Reviews before Delivery. Manual/operator-confirmation outcomes are outside these initial fixtures; a later example using one must end at Awaiting operator confirmation with merge not reached.

Use “separate review stages with isolated prompt context.” The evidence does not establish that reviewers necessarily use different providers or models. Budget termination and staged rollback are later supporting scenarios, not requirements for the first release.

## 8. Agent Config demonstration

**Purpose:** show how a shared policy can remain consistent across agent tools.

**Draft summary:** “A private configuration compiler and workflow toolkit for keeping agent instructions consistent and review work inspectable.”

**Presentation:** a shared fragment panel and two output panels labeled Claude Code and Codex. Label the whole interaction **Compiler example · fixture simulation**. Use two supported sample variants, Brief and Detailed, rather than an unrestricted editor.

1. Start with Brief selected and both outputs marked Current.
2. Select Detailed. The shared fragment and corresponding generated examples update together. Changing Brief/Detailed clears any stale-output state.
3. Select “Show stale output.” The Codex panel uses the prior output and is marked Out of date, with the differing content highlighted.
4. Select “Regenerate example.” Restore the output matching the selected variant and its Current label. In Brief, the stale fixture uses Detailed output; in Detailed, it uses Brief output.
5. Reset returns to Brief with no stale state.

Generate the two sample output pairs offline from harmless fragments using the real compiler, or clearly identify them as illustrative until that capture is complete. Do not implement a second compiler in the website. A browser fixture selector does not execute the private build pipeline. Show a source stamp only if it comes from the corresponding sample fixture; a decorative hash must not be presented as verified evidence.

Explain Caleb's compiler, runtime, adapters, and integration work. Credit imported skills and hooks separately. The review-finding funnel and session-continuity example are later additions. Continuity evidence is dated; a July 2026 probe must not become an undated cross-version guarantee.

## 9. Control Center demonstration

**Purpose:** show what an operator needs to notice and where to inspect it.

**Draft summary:** “An operations dashboard combining unattended runs, pending decisions, sample spend, and deployment records.”

**Presentation:** a dark instrument panel within the light page. Recreate the existing layout with purpose-written fixtures. Label it **Dashboard example · sample data** and label maturity **Prototype** with the nearby explanation “Implemented dashboard; deployment not verified.”

| Interaction | Visible result | Boundary |
|---|---|---|
| Show all / Needs attention | Filter sample runs and decisions; counts update from the same fixture data. | Explain that this filter belongs to the portfolio demonstration if it is not present in the product. |
| Select a decision | Open its source type, age, and short explanation. | Read-only. No approve/reject control. |
| Select a run scenario | Show a started → succeeded or started → failed sequence. | Invented hosts, job names, and times. |
| Select a deployment | Show a sample target, abbreviated fictional SHA, and recorded result. | A deployment record is not evidence that Control Center itself is deployed. |

Omit `services_down`: the inspected implementation uses a fixed placeholder. Label spend “Sample spend,” and never put fixture totals into the page's business-outcome copy. Relative ages are based on one frozen example timestamp, not a timer that implies a live feed.

Needs attention includes failed/stale runs and unresolved decisions. Run and decision counts reflect the visible records; sample spend and deployment totals are unaffected. Scenario changes update the selected run and derived counts together. An empty filtered group says “No items need attention in this example.” If filtering hides a selected record, clear its detail panel. Decision sources are descriptive labels, not fabricated internal links.

Use Succeeds and Fails run scenarios, starting at Started; “Show sample run result” advances to the selected terminal result. A scenario change returns the selected run to Started and clears other record details. Reset restores Succeeds, Show all, Started, and no open record detail. Fixtures explicitly mark stale records against the frozen timestamp and explain the example's staleness rule. Filtering does not mutate source records or the selected outcome; it changes visibility and derived counts.

Credit Homepage and Healthchecks. Describe Caleb's contribution as the aggregator, adapters, run wrapper, configuration, and visual composition. The versioned source of record is `/Users/calebbolden/Projects/infra/homelab-setup/control-center`.

## 10. Prism demonstration

**Purpose:** make a bounded local run and its evidence understandable.

**Draft summary:** “A developer preview for bounded local agent execution, with an inspectable trace and run receipt.”

**Presentation:** a fixed prompt, ordered event trace, and result panel. Label it **Recorded trace playback · local CLI example** only when sourced from a captured run; otherwise use **Deterministic simulation**. Maturity is **Developer preview**.

Prompt: `Count the words in: one two three`

Expected result: `3 words`

The six event stages are: goal accepted → provider requests tool → policy allows → tool completes → provider finalizes → run completes. Preserve the exact event order of the version-pinned captured run or contract-derived fixture; visitor-facing labels may be shorter, but an optional technical view retains public event-type identifiers. This does not require copying private run IDs, paths, hostnames, or raw receipt fields. Its public evidence record includes Prism version, public source tag/commit, derivation type (`captured` or `contract-derived`), and checked date. Show these in About this example. Disclose identifier replacement in a captured example while retaining `captured` as its derivation type; never describe a contract-derived fixture as a recording.

Use Start example, Next event, Previous event, and Reset. The result appears only at the final event. Previous clears later presented state and closes any receipt. “Inspect receipt” becomes available at completion and shows the selected fixture's terminal state, limits/usage where recorded, and cleanup fields with plain-language explanations. Do not invent a cleanup guarantee from the presence of a field.

Prism 0.1.0 and its four public npm packages were confirmed during research on September 11, 2026. Link to the verified public source and getting-started documentation after checking those destinations during implementation. Playback in a browser does not execute native subprocesses.

Digest-based plugin approval is a follow-on interaction: declare → inspect → approve identity → change contents → invalidate approval. Its explanation must say that approval identifies approved bytes and operation; it does not establish that code is safe or sandboxed. Wider Linux/KVM/QEMU/Firecracker assurance remains outside verified claims.

## 11. Homepage and How I build

### Homepage proof

Keep the existing homepage order and narrative hero. Enrich the Proof section with a Vora visual feature and compact entries linking to the four developer-tool case studies. Preserve ChapterHQ, the site assistant, existing in-development work, and Open source in a clearly labeled secondary group. Existing links and descriptions must be reconciled during migration, not dropped because they are outside the flagship five.

The homepage contains posters and links, not five mounted interactive demos. At most one featured visual receives priority loading. Use “Explore the work” to link to `/work`.

### How I build

Keep the current plain-language method explanation and add four illustrated responsibility sections:

| Responsibility | Project | Evidence shown |
|---|---|---|
| Keep instructions consistent | Agent Config | A compact shared-fragment/output example. |
| Move a task through review | Agent Team | A sample run and one stopped branch. |
| Notice what needs attention | Control Center | A sample decision queue and run status. |
| Inspect bounded local execution | Prism | A compact event trace and receipt. |

Label the overview “Projects behind my development workflow.” Use an unconnected set of panels rather than arrows implying a verified shared runtime. Add an integration edge only when a specific relationship is substantiated and accurately described. Link to each full case study instead of duplicating its full interaction on this page.

## 12. Visual system and responsive behavior

Reuse tokens and utility contracts in `/Users/calebbolden/Projects/consulting/calebbolden.com/app/globals.css` and fonts from `/Users/calebbolden/Projects/consulting/calebbolden.com/app/layout.tsx`.

| Element | Specification |
|---|---|
| Page and structure | White background, 1200px maximum content width, 12-column composition at large available widths, 1px hairline dividers. Grid only in margins and introduction fields, never under paragraphs. |
| Typography | Archivo headings; Schibsted Grotesk body/UI at 16–18px and about 1.6 line height; Martian Mono for short annotations. Showcase H1 uses `clamp(2.4rem, 5.5vw, 4.25rem)`; this updates the smaller scale currently used on Work detail pages. Narrative measure stays at or below 70ch. |
| Color and form | Existing blue/ink/surface tokens. Blue marks selection; textual labels accompany status colors. One amber note per section at most. Drafting-frame radius 2px, controls 6px. |
| Media | Default overview poster 16:10; preserve the source ratio when cropping would hide important UI. Dense screens open into a gallery. A crop always has a caption describing the selected region. |
| Motion | State transitions 160–240ms; optional section reveal up to 400ms using the existing easing. No scroll-controlled demos, parallax, autoplay galleries, or motion required to reveal evidence. |

The older “light only” design note refers to page identity. The July 14 approved spec permits dark instrument surfaces for system views. Keep the document background light; use dark product/terminal frames locally. Do not add a theme switch or recolor authentic product screenshots to make them resemble the website.

Layout decisions use available content width after the existing chat sidebar offset, not viewport width alone. Use a CSS inline-size container inside the post-offset main area, before its content gutters, and container queries on descendants. Below 800px of available content width, feature and workflow columns stack. Below 600px, project rows also stack, padding reduces to 20px, and controls wrap. At wider sizes use 32px gutters and 24–40px column gaps. The existing server default reserves chat space at desktop widths; restoring a saved collapsed preference can widen the container after hydration. Both layouts must remain usable and reflow automatically. Do not change chat preference initialization or promise zero initial reflow in this scope.

On narrow screens, show a legible crop or purpose-built mobile fixture panel above the selected step's explanation. Keep the same state and controls as desktop. Do not shrink a full dashboard to unreadable text. Long code may scroll inside its labeled panel; the document must not scroll horizontally.

### Reference synthesis

The research inspected [Alex Schar's project presentation](https://alexschar.dev/), [Proofline case study](https://alexschar.dev/work/proofline), and [architecture case study](https://alexschar.dev/case-studies/agent-context/). The adopted principle is progressive disclosure through product media, a workflow, and technical evidence. Exact copy, imagery, rankings, and numerical claims are not reused.

The existing five-prompt shortlist contributes these specific roles:

| Local reference | Adopted role |
|---|---|
| `/Users/calebbolden/Projects/design-kit/prompts/hero/blog-showcase-video-card-grid.md` | Featured media/copy composition and aspect-ratio discipline. Adapt supporting entries to the site's editorial rows. |
| `/Users/calebbolden/Projects/design-kit/prompts/features/benefits-features-accordion-split.md` | Step controls beside a large synchronized preview; restrained state transition. |
| `/Users/calebbolden/Projects/design-kit/prompts/features/agency-services-numbered-list.md` | Numbered workflow hierarchy and thin-rule grouping. |
| `/Users/calebbolden/Projects/design-kit/prompts/features/saas-software-dashboard-gauge-grid.md` | A clearly bounded product viewport. Its metric/gauge content is not adopted. |
| `/Users/calebbolden/Projects/design-kit/prompts/features/neo-museum-icon-action-pills.md` | Compact wrapping category controls with an obvious selected state. Use current radii and colors. |

Color, typography, and motion constants come from the current site. Reference video URLs and decorative generation briefs are not adopted. Product evidence uses recordings, captured output, or labeled fixtures; generated footage cannot substantiate application behavior.

## 13. Content, evidence, and assets

### Public content model

Define typed project records in a dedicated public-content module. Homepage, Work, How I build, related-project links, and detail pages consume the same record rather than maintaining separate status/summary arrays.

| Field group | Required values |
|---|---|
| Identity | Stable slug, name, category, summary, contribution statement, related slugs, optional detail route. A slug alone does not create a published route. |
| Publication | Draft/published flag, placements (homepage proof, Work catalog, case study, How I build), display order, maturity, public checked date, optional product/source/documentation URLs. |
| Story | Problem, workflow introduction, engineering decisions, limits, contribution credits. |
| Evidence | Media ID, kind, poster/source, caption, alt text, dimensions, transcript or walkthrough, and public “About this example” explanation. Prism also requires version, public source tag/commit, derivation type, and checked date. |
| Interaction | One of the five explicitly supported demo kinds, with fixture ID and display copy. How I build entries also provide responsibility label, order, and a compact static evidence selection/caption referencing that project's approved example. No arbitrary scripts or private service configuration. |

Category, maturity, and media kind are distinct. Initial maturity labels are **Implemented** for Vora, Agent Team, and Agent Config; **Prototype** for Control Center; and **Developer preview** for Prism. Implemented means the reviewed capability exists in source, not that every feature is enabled or production availability was verified. Supporting projects retain evidence-backed existing labels until reviewed.

The flagship labels explicitly replace Vora's old `live` and Agent Team's old `running` presentation for this source-backed showcase. This is an intentional qualification, not a deployment downgrade. Secondary `live` or `in development` labels remain separately represented legacy availability/status values, not members of the flagship maturity enum or a shared ranking. Do not invent new deployment verification or remap every secondary project merely to normalize badges.

Public records may link only to reviewed public assets and destinations. Keep the detailed evidence ledger, private source citations, capture settings, and approval notes in internal research documentation outside runtime imports. A build must serialize only explicitly public fields; a server-only file alone is not sufficient if its contents are passed to a client component.

Captured compiler/Prism examples use an explicit public field allowlist and source replacement. Keep only approved event names/order, harmless excerpts, recorded public limits/usage, terminal status, and plain-language cleanup fields. Exclude raw workspace/temp paths, hostnames, process IDs, account/key identifiers, environment values, and private fragment paths. Preserve semantics and disclose substitutions; a source stamp is valid only for the corresponding sample bytes. Schema/serialization tests reject unexpected nested fields and synthetic private sentinels, and scan public fixtures/assets for path/token/internal-host patterns. These checks supplement review of the full asset, caption, transcript, download, metadata, and destination; a clean pattern scan alone is not publication approval.

### Initial asset inventory

| Project | Required for first release | Existing material and readiness |
|---|---|---|
| Vora | Overview poster; approval simulation fixture; rejection, success, and execution-failure walkthrough. | Older captures and clips are composition references. Selected action/configuration and fresh sample records need verification in the isolated environment described above. |
| Agent Team | Lifecycle poster/diagram; three scenario fixtures; role/decision excerpts. | Existing lifecycle and merge-policy diagrams can guide new public assets. Private run logs are not inputs. |
| Agent Config | Shared-fragment poster; two generated output pairs; stale-output fixture. | Create harmless samples. No project-specific product captures were found in the targeted research. |
| Control Center | Relabeled overview poster; run/decision/deploy/spend fixtures with one frozen timestamp. | Existing screenshot is fixture-backed. Replace internal-looking names and omit the services-down placeholder. |
| Prism | Trace poster; captured or contract-derived six-event fixture; receipt and text walkthrough. | Public demo, tests, and diagrams provide the source. Record which release/fixture the public example represents. |

Proposed new public assets live under `/public/work/<slug>/` within this website; this path is a future implementation target. Use descriptive filenames without private paths, customer IDs, tokens, or internal hostnames. Strip unnecessary image metadata. Put the evidence label in HTML, not only inside an image.

Source replacement is the preferred privacy control: fictional records, authored documents, and disposable samples. Cropping or blur alone does not establish that an asset is suitable for publication. Review captions, transcripts, metadata, fixture JSON, downloads, and link destinations together with the visible image.

Draft case studies can be built locally while assets are being prepared. A missing asset or role confirmation is a publication dependency, not a reason to stop writing or implementing the reusable page structure.

## 14. Accessibility and performance

| Area | Acceptance requirement |
|---|---|
| Keyboard and focus | Every filter, step, scenario, disclosure, and media control is reachable and labeled. Gallery dialogs trap focus, close with Escape, and return focus to their opener. Ordered-sequence Previous/Next disable at the ends; other demos follow their named transitions. |
| Reading and status | Content order makes sense without layout. Active step and outcomes have text equivalents. Important labels meet 4.5:1 contrast at normal text sizes; do not rely on faint annotation styling for required information. |
| Motion and media | Reduced motion uses immediate state changes and static diagrams. Video is click-to-play, with native controls and captions/transcript where speech exists. No automatic audio. |
| Touch and resizing | Controls target at least 44×44 CSS px. Verify at 320px width, 200% zoom, and with chat expanded/collapsed. No obscured controls or page-level horizontal overflow. |
| Loading | Set intrinsic media dimensions; load only the primary poster eagerly, lazy-load later images and demo modules. Videos use a poster and no eager full download. Text and fallback walkthroughs render before enhancements. |

Planning budgets: target each optimized poster at 250KB or less and additional compressed JavaScript for the active case-study demonstration at 100KB or less. Measure before/after during implementation. If evidence is illegible within a media budget, use a focused crop and optional larger gallery asset. A budget exception must state what needs the bytes; do not quietly replace useful evidence with unreadable compression.

## 15. Verification and release acceptance

The current project commands are `npm run test` and `npm run build`. Run them after implementation and read their results. The existing `npm run lint` script uses `next lint`; establish a working lint command before treating lint as a release gate. This document makes no claim that implementation tests have run.

| ID | Acceptance criteria |
|---|---|
| A1: Navigation and content | Five flagship destinations resolve; every migration-map route remains reachable; filters return the exact mapped entries and counts (7/3/4); Open source remains outside counts; category deep links and back/forward work; featured entries are not duplicated; no private-source button, draft route, or link to a draft/unresolvable related destination is published. Existing client-work `/results` and audit/readiness paths remain available. |
| A2: Interaction correctness | Vora cannot complete after rejection or show success for its failed-execution outcome. Agent Team preserves retries, disables unreachable stages, and labels the pass/retry fixture's default automatic merge. Agent Config clears stale state correctly; Control Center counts follow its fixture filter; Prism result/receipt appear only at completion. Reset clears each complete scenario. |
| A3: Evidence integrity | Every flagship has a truthful contribution, maturity, media label, and checked date. Prism records version, public source revision, and captured/contract-derived provenance. Config-gated behavior is qualified. No fixture is described as current operational data, and no diagram invents cross-project integration. |
| A4: Presentation and access | Check desktop, narrow available width with chat open, mobile, keyboard, zoom, reduced motion, failed media, and no-JavaScript fallback. Verify the gallery lifecycle and existing contact destination in a browser. |
| A5: Build and boundaries | Project tests/build pass; public schema/serialization tests reject private identifiers and imports; reviewed assets/fixtures contain only approved fields; any Vora action capture has documented isolation and sandbox/test or mocked delivery. Browser network inspection shows no demo call to an AI provider, messaging endpoint, private host, or process launcher. Media dimensions/loading and bundle budgets are checked. |

Tests should exercise meaningful state transitions, filter routing, data-publication boundaries, and broken-link risks. Do not write tests that only mirror static copy. Browser verification is required in addition to unit checks; a successful build does not validate interaction behavior or every external link.

If analytics already has a reviewed provider, measure only `project_open`, `demo_start`, `demo_complete`, `technical_detail_open`, and `contact_click`, with project slug and fixed scenario ID. Never transmit free text, fixture bodies, approval contents, or private identifiers. Define completion as reaching the intended terminal outcome, including a deliberately blocked scenario. Adding a new analytics service is a separate task; this release does not depend on it. If no reviewed provider is established, omit instrumentation entirely; do not add dormant event plumbing.

## 16. Delivery sequence and future work

| Milestone | Deliverable | Completion condition |
|---|---|---|
| 1. Shared foundation | Catalog, case-study sections, evidence labels, responsive media/gallery, static fallback. | Existing project pages still work; public-content boundary is established. |
| 2. First pair | Vora approval case study and Prism trace case study; Work entries. | Both examples meet their interaction, evidence, and browser criteria. |
| 3. Remaining flagships | Agent Team, Agent Config, and Control Center. | All five primary demonstrations and reviewed assets are complete. |
| 4. Site integration | Homepage proof, Work filtering, How I build, related links, final verification. | A1–A5 pass and every published entry is ready. |

The complete five-project release is estimated at 7–12 focused working days, including asset preparation. This is a planning range, not a commitment. Fresh product capture and publication-rights questions can extend it. Code, content, and assets should be made concrete and reviewable before a separate publication step.

Follow-on work is ordered by evidence readiness and audience value: ChapterHQ's member/officer workflow; Open Brain's capture/provenance/portability example; Terminal Agent Launcher; Canton Traffic Calculator with clear employer attribution; Bacchus only after Caleb's exact role and asset rights are established. Keep the wider inventory in the research report rather than expanding the first release into dozens of thin project pages.

Within the five flagships, later interactions include Vora voice/industry/knowledge, Agent Team budget/rollback, Agent Config review/continuity, and Prism plugin approval. A small public checklist or fixture kit can follow once its exact content and upstream attribution are reviewed.

No design choice is waiting on user input to complete this spec. Remaining dependencies are concrete production work: prepare reviewed assets, verify the chosen Vora action/configuration, capture compiler and Prism examples, reconcile existing content, and validate public destinations.

### Document review

A bounded manual consistency review preceded this phase; earlier automated doc-review attempts timed out and are not completed hardening runs.

The installed harden workflow subsequently reviewed the `c59e91c` spec bytes with SHA-256 `c217d8f231bf3ef40d1ea76621a3efe34cee5462801592f3d22a2d24071f8997`, using DESIGN, FEASIBILITY, SCOPE, SECURITY and `--third-party deny`. It returned fix-first, 0 Critical, 9 Important, and 3 Minor groups. `single_engine: true`; Feasibility failed; the independent reviewer failed with transport errors; all three finding auditors failed routing. `verified: true` records that auditing was enabled, not that those auditors succeeded. Findings therefore remain independently unverified.

Supported corrections and concrete refutations are recorded in `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.md`. The unmodified cycle report is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-1.md`. These later corrected bytes have no new independent attestation. No structural Critical required a rerun; unchanged infrastructure failures were not repeated or bypassed. The implementation plan remains provisional until the missing review evidence is obtained. Application tests were not run for this documentation-only phase.
