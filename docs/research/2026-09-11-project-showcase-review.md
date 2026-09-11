# Project showcase review

Internal research and website proposal. September 11, 2026. Source paths and unpublished project details in this document are for Caleb's review, not website copy.

## Recommendation

Build a visual Work section around five projects: Vora, Agent Team, Agent Config, Control Center, and Prism. Give each one a real screen or clearly labeled demonstration, one useful interaction, and a short account of an engineering decision. Keep source links optional. A visitor should be able to understand what you built and inspect how it behaves without accessing a private repository.

Your strongest throughline is: **you build useful AI products and the tools needed to develop and operate them.** Vora provides the business-facing anchor. The other four show the engineering behind dependable agent work. ChapterHQ is the strongest next business product to feature.

Keep the site's white and blueprint-blue “working wall” design. Use large product media inside that system, with restrained motion and precise captions. A dark Control Center or terminal screen can sit inside a light page without changing the whole brand.

Audience assumption: serve both consulting buyers and technical collaborators. Keep the business outcome first, with an obvious “How it works” path into implementation details. This extends the current consulting positioning rather than replacing it.

## What to borrow from Alex's site

[Alex Schar's homepage](https://alexschar.dev/) makes its projects inspectable: product screenshots open galleries, project rows explain a purpose, and deeper pages are available without requiring every visitor to read them. It also shows the working environment and offers a useful downloadable kit. Borrow that sequence: see the product, follow a workflow, inspect the engineering. Keep your own visual identity and use only evidence you can substantiate.

The [Proofline case study](https://alexschar.dev/work/proofline) is the strongest structural reference. It moves from the problem to a sequence of annotated product frames, then explains limitations. Your case studies should do the same: show what changed at each step and say whether the footage is a real product using sample data, a deterministic simulation, or a design prototype. Treat the author's rankings, speed claims, and outcomes as self-reported, not independently verified benchmarks for your site.

The [agent-context architecture case study](https://alexschar.dev/case-studies/agent-context/) is especially relevant to your private tooling. Its diagrams have text descriptions, and its explanation distinguishes shipped work, future work, and private data. You can explain control flow, failure handling, and your decisions without exposing prompts, transcripts, customer records, or private source.

## What your current site is missing

| Observed gap | Concrete change | Evidence |
|---|---|---|
| `/work` leads with explanatory text and an illustrative missed-call sequence. | Put a substantial Vora product visual near the top. Let readers step through that same missed-call story with visible state changes. | [Live Work page](https://calebbolden.com/work); `/Users/calebbolden/Projects/consulting/calebbolden.com/app/work/page.tsx:13` |
| The Work page's systems list contains Vora, ChapterHQ, and the site assistant. | Add the five requested projects to one curated catalog, with separate product and developer-tool views. | `/Users/calebbolden/Projects/consulting/calebbolden.com/app/work/page.tsx:13` |
| Agent Team appears in the homepage proof list without a destination. | Give it a case study and an inspectable sample run. | `/Users/calebbolden/Projects/consulting/calebbolden.com/components/Proof.tsx:8` |
| Detail pages support optional media, but Vora supplies none and the slot is below the text sections. | Move the primary visual into the introduction; reserve later media for supporting evidence. | `/Users/calebbolden/Projects/consulting/calebbolden.com/components/WorkDetail.tsx:15`; `/Users/calebbolden/Projects/consulting/calebbolden.com/components/WorkDetail.tsx:153`; `/Users/calebbolden/Projects/consulting/calebbolden.com/app/work/vora/page.tsx:9` |
| `/how-i-build` describes the stack and method without showing actual tools. | Add a guided walkthrough linking Agent Config, Agent Team, Control Center, and Prism, with each tool's actual role and maturity. | `/Users/calebbolden/Projects/consulting/calebbolden.com/app/how-i-build/page.tsx:12` |

The existing visual rollout already identified Vora and fleet captures as missing. Its deployment paths and prerequisites are dated, so use it as design context and establish current capture conditions separately: `/Users/calebbolden/Projects/consulting/calebbolden.com/CLAUDE.md:22`.

## The five featured projects

These are proposed website demonstrations. Implementation and relevant test files were inspected; the research did not execute each project's test suite or verify production behavior.

| Project | Story a visitor should understand | First element to build | Accurate presentation |
|---|---|---|---|
| **Vora** | An AI employee works inside a CRM with configurable approval for selected consequential actions. | A short, annotated request → pending approval → decision → result sequence using a fictional service business. | Real product footage with sample data after a fresh capture check; simulation label if recreated. |
| **Agent Team** | A coding task moves through isolated implementation, reviews, retries, and merge policy. | A run explorer with successful, QA-blocked, and security-blocked examples. | Deterministic example run; distinguish implemented controls from enabled production settings. |
| **Agent Config** | Shared instructions and workflow rules remain consistent across agent tools. | Edit a sample fragment and watch two generated harness outputs update; show drift detection. | Synthetic fragments demonstrating the compiler; credit imported skills and hooks. |
| **Control Center** | An operator can see unattended work, pending decisions, spend, and deployment state together. | A wide cockpit preview with clickable annotations and a fixture-backed scenario. | Implemented dashboard with sample data; deployment not verified. |
| **Prism** | A bounded local agent run produces inspectable execution evidence. | Step through its deterministic word-count example, then inspect the result. | Developer preview; distinguish trace playback from executing native tools in the browser. |

### Vora: show an outcome, then the controls behind it

Lead the Work page with Vora. Its combination of CRM, voice, messaging, and AI employees is easier for consulting buyers to recognize than infrastructure alone.

1. **Approval walkthrough.** Show a fictional customer request, the proposed action, the approval state, and the result. Autonomy policy can bypass approval even for a destructive tool, so verify that the selected action and configuration actually require it. Include the rejected path so visitors can see that the human decision matters.
2. **Voice-to-CRM story.** Use synthetic audio and a synchronized transcript beside the resulting appointment or CRM state. A 30–45 second recording is enough. Streaming depends on voice mode, provider configuration, and eligible tier; booking defaults to human approval. Verify the selected path in a demo environment before claiming an end-to-end outcome.
3. **Industry switcher.** Let visitors compare three sample industries to see how navigation, terminology, and records change while the platform core stays shared. This explains architectural depth without a feature-count wall.
4. **Supporting knowledge example.** Add a fictional FAQ and show retrieval of the matching source text. This is a useful supporting sequence, not another homepage card.

Evidence: approval/execution implementation at `/Users/calebbolden/Projects/vora/vora-platform/platform/mcp-server/mcp_server/employee_executor.py:492` and `:807`; approval test source at `/Users/calebbolden/Projects/vora/vora-platform/platform/mcp-server/mcp_server/tests/test_employee_executor.py:538`; voice session handling at `/Users/calebbolden/Projects/vora/vora-platform/platform/mcp-server/mcp_server/voice/router.py:74`; industry registry at `/Users/calebbolden/Projects/vora/vora-platform/platform/vora-dashboard/src/lib/industries/index.ts:14`; retrieval at `/Users/calebbolden/Projects/vora/vora-platform/platform/mcp-server/mcp_server/knowledge_base.py:481`.

Existing assets can shorten production: `/Users/calebbolden/Projects/vora/vora-platform/artifacts/vora-product-showcase.mp4` and `/Users/calebbolden/Projects/vora/vora-platform/artifacts/vora-3d-showcase.mp4`. They are candidates for review, not cleared assets. The inspected AI Team screenshot is visually useful but shows older plan gates and account initials. Fresh sample-data capture is preferable.

Keep Vora v2 inside an optional architecture note. Its current workspace is architecture work, not a second launched product: `/Users/calebbolden/Projects/vora/vora-v2/README.md:7`.

### Agent Team: let visitors inspect a task

Build a compact timeline: task → isolated workspace → implementation → separate review stages → QA → merge decision. Selecting a step reveals its purpose, a sample artifact, and why the run continued or stopped. Reviewers have isolated prompt context; this does not establish different model or provider assignments.

The most persuasive interaction is a failure. Switch from “passes review” to “security finding” and show the blocked state. Add a retry example and a synthetic budget threshold. This demonstrates judgment in the workflow rather than merely displaying multiple agent names.

Use the existing fake runner to design deterministic examples. The public widget should read new static fixtures; it should never connect to your private task queue. Call it a “sample run” or “run history,” not replay of a real execution unless a replay contract is established.

Evidence: lifecycle at `/Users/calebbolden/Projects/oss/agent-team/agent_team/daemon.py:1378` and `:1672`; merge decisions at `/Users/calebbolden/Projects/oss/agent-team/agent_team/policy/merge_gate.py:151`; run details at `/Users/calebbolden/Projects/oss/agent-team/agent_team/api.py:583`; anomaly limits at `/Users/calebbolden/Projects/oss/agent-team/agent_team/anomaly.py:46`; fixtures at `/Users/calebbolden/Projects/oss/agent-team/agent_team/runners/fake.py:74`.

Reuse the structure of `/Users/calebbolden/Projects/oss/agent-team/docs/diagrams/lifecycle-happy.svg` and `/Users/calebbolden/Projects/oss/agent-team/docs/diagrams/merge-policy.svg`. State feature and host-drill limits from `/Users/calebbolden/Projects/oss/agent-team/docs/limitations.md:16`. Repository history supports authorship, not performance or adoption claims.

Merge-policy enforcement, queue enforcement, sandboxing, and anomaly termination are off by default; hard spending caps are unset. A blocked or stopped sample must explicitly model an enabled control. The legacy green-PR path may merge automatically. Defaults are documented at `/Users/calebbolden/Projects/oss/agent-team/CLAUDE.md:252`; optional termination is implemented at `/Users/calebbolden/Projects/oss/agent-team/agent_team/anomaly.py:80`.

### Agent Config: make invisible engineering visible

The compiler is the clearest first demonstration: a small editable policy on the left, generated outputs on the right, and a source stamp showing whether they match. Use a fictional project with a harmless preference. This connects a common problem, configuration drift, to a visible result.

A second interaction can show the review workflow: several perspectives propose findings; an independent check rejects weak ones; the final report keeps supported findings. Write a small fictional specification containing an intentional contradiction so the result is understandable.

Session continuity is a supporting card: show a verified milestone and next action surviving a context change. The live probe was against Codex CLI 0.145.0 in July 2026; current wiring exists but was not re-executed in this review. Present it as a local hook mechanism with dated evidence, not a cross-version reliability guarantee: `/Users/calebbolden/Projects/agent-config/docs/plans/EXECUTION-LOG.md:204`.

Evidence: compiler at `/Users/calebbolden/Projects/agent-config/bin/generate:34`; stamps at `/Users/calebbolden/Projects/agent-config/tools/genlib/stamps.py:13`; review workflow at `/Users/calebbolden/Projects/agent-config/packages/workflow-runners/src/doc-review/workflow.ts:48`; runtime at `/Users/calebbolden/Projects/agent-config/packages/workflow-runtime/src/runtime.ts:63`; continuity code at `/Users/calebbolden/Projects/agent-config/hooks/session-state.mjs:583`.

Describe your contribution as the compiler, runtime, integration rules, and adapters. Some skills and hooks are imported. Their presence should not become a claim that you authored the whole collection: `/Users/calebbolden/Projects/agent-config/hooks/ecc-vendored/README.md:1`.

### Control Center: show the operator's view

This is the fastest visual addition. The inspected screenshot already uses a blueprint grid, thin rules, and a dense operations layout that fits your site's identity.

Recreate the sample dataset with fictional projects and hosts. Let visitors highlight “needs attention,” expand a sample decision, and follow a run from started to failed. Explain what the dashboard aggregates and where the operator acts next.

The decision queue is a view of GitHub and file-based items. Do not imply that every approval can be performed inside the dashboard. The current `services_down` summary value is hard-coded, so omit that metric from the showcase until its source is real, or label it explicitly as illustrative.

Evidence: fixtures and endpoint switching at `/Users/calebbolden/Projects/infra/homelab-setup/control-center/aggregator/src/server.mjs:9`; queue at `/Users/calebbolden/Projects/infra/homelab-setup/control-center/aggregator/src/decisions.mjs:28`; summary limitation at `/Users/calebbolden/Projects/infra/homelab-setup/control-center/aggregator/src/summary.mjs:19`; deployment prerequisites at `/Users/calebbolden/Projects/infra/homelab-setup/control-center/DEPLOY.md:3`.

Asset: `/Users/calebbolden/Projects/infra/homelab-setup/control-center/docs/mockups/live-after.png`. Despite its filename, the evidence is fixture-backed. The tracked infra repository is the source of record; the similarly named standalone “canonical” folder has matching inspected files but no Git metadata. Credit Homepage and Healthchecks; your contribution is the aggregator, adapters, run wrapper, configuration, and visual composition.

### Prism: give technical visitors something precise to try

Start with the existing deterministic example: count the words in “one two three.” A visitor advances through the execution trace and gets “3 words,” then opens the run receipt. The simple task keeps attention on the system behavior.

Follow with a plugin-approval explainer: inspect the proposed artifact, approve its identity, alter its contents, and see the prior approval become invalid. The key explanation belongs beside the interaction: digest approval establishes what was approved; it does not prove that arbitrary code is safe.

Use recorded CLI output or static trace fixtures for the website. A browser visualization of native subprocess execution is a simulation, even when the underlying example can also be run locally.

Evidence: deterministic demo at `/Users/calebbolden/Projects/oss/prism/packages/cli/src/deterministic/prism-demo.ts:60`; ordered events at `/Users/calebbolden/Projects/oss/prism/packages/runtime/src/runtime/bounded-local-coordinator.ts:59`; run record at `/Users/calebbolden/Projects/oss/prism/packages/cli/src/run-store.ts:207`; plugin preparation at `/Users/calebbolden/Projects/oss/prism/packages/cli/src/project-plugin-approval-preview.ts:162`; admission revalidation at `/Users/calebbolden/Projects/oss/prism/packages/cli/src/project-plugin-run.ts:285`.

Prism's public GitHub v0.1.0 release and all four `@useprism` npm packages were confirmed on September 11, 2026. Label it a published developer preview; the local demo is contract-tested in source, not a deployed service verified by this research. Do not claim general sandboxing or current Linux/KVM/QEMU/Firecracker assurance. The project-plugin subprocess retains ambient host authority. Preserve the limits in `/Users/calebbolden/Projects/oss/prism/docs/assurance/README.md:54` and the release scope in `/Users/calebbolden/Projects/oss/prism/docs/releases/developer-preview/README.md:24`.

## The website elements to build

1. **A curated project gallery.** One large Vora feature, four supporting project entries, then a compact archive. Each entry has a visual, purpose, your role, maturity, and “Explore the project.” Separate “Source available” from “Product status.” A private repository is not an incomplete project.
2. **A shared case-study format.** Outcome and role → primary visual → one workflow → engineering decisions → limits and evidence. Add optional source/demo links. Put screenshots before the stack list. A five-frame gallery with useful captions can communicate more than another page of feature bullets.
3. **One distinctive interaction per flagship.** Approval decision, task trace, compiler diff, operations queue, bounded run. Reuse accessible controls and layout, but give each interaction a reason to exist.
4. **An illustrated `/how-i-build` page.** Explain configuration, task execution, observation, and bounded runtime as separate responsibilities. Link to the relevant projects. Use conceptual grouping unless an actual integration edge has been verified; do not draw a fictional end-to-end production architecture.
5. **A small public resource.** Later, extract one neutral example such as a review checklist, sample run schema, or fictional multi-harness policy. This can play the useful-takeaway role of Alex's kit without publishing Agent Config. Review exact content and upstream licenses before release.

Keep Work in the existing navigation. Avoid adding five new top-level links. Put “Products” and “Developer tools” filters inside Work. Show maturity labels near media: “Product recording · sample data,” “Deterministic simulation,” “Prototype,” and “Developer preview” as appropriate.

Use click-to-play recordings, poster images, keyboard-operable galleries, captions/transcripts, and reduced-motion behavior. On mobile, preserve the key state transition instead of shrinking an entire desktop dashboard until its text is unreadable.

## Implementation choices

| Approach | What it provides | Tradeoff | Planning estimate |
|---|---|---|---|
| Media retrofit | Add approved screenshots and recordings to existing WorkDetail pages; create missing pages. | Quick visible improvement, but catalog content and page evidence can drift. | 2–4 focused days with ready assets. |
| **Shared project and evidence model, recommended** | A typed project catalog, reusable case-study sections, optional media, dated evidence records, and deterministic browser demos. Existing homepage, Work, and detail pages consume the same records. | More initial content structure; easier to keep status, links, and evidence consistent. | 7–12 focused days for the five-project version, including asset preparation. |
| Isolated hosted demo environments | Separate disposable environments with synthetic tenants and resettable state for true product trials. | Best fidelity where hands-on product use matters, but requires hosting, isolation, reset jobs, abuse controls, and maintenance. Viability depends on demo provisioning in each project. | An additional 2–4 weeks for selected projects, pending provisioning checks. |

The proper foundation is the shared model even if the first release contains only screenshots and one interaction. Use TypeScript or MDX within the current Next.js site; a separate CMS is unnecessary until content editing needs justify it.

Public content should contain only approved captions, media, fixture data, and public URLs. Keep internal source paths, private review notes, and capture provenance outside browser bundles. Project records need purpose, role, contribution/credits, status, last checked date, media type, and optional links. Status should not be inferred from the existence of a repository or test file.

These are estimates for one person with repository access, not delivery commitments. Fresh Vora footage and rights review can extend the schedule. Synthetic demos should be described as simulations; making them resemble product screens does not turn them into product recordings.

## Build order

1. **Create the content and evidence foundation, 1–2 days.** Define the catalog and case-study sections. Reconcile Vora, Agent Team, Agent Config, Control Center, and Prism descriptions with their current status.
2. **Publish the first pair, 2–3 days.** Prepare Vora's sample-data workflow and Prism's deterministic trace. These cover the business and technical audiences with clearly different work.
3. **Add the operations story, 2–4 days.** Build the Agent Team run explorer, relabel Control Center fixtures, and add Agent Config's compiler example.
4. **Finish navigation and presentation, 1–2 days.** Update homepage/Work/how-I-build links, mobile media, captions, accessibility, and the site's real build/checks.
5. **Expand only after reviewing engagement.** Add ChapterHQ, Open Brain, or Bacchus according to which audience is responding. Measure project opens, demo completion, technical-detail opens, and contact clicks before claiming impact.

First concrete build target: **one reusable case-study page populated with Vora's approval workflow**, plus its Work card. This establishes the pattern all other projects can reuse.

## Broader project review

The filesystem inventory found 42 Git checkout/worktree directories across 38 Git common directories. That is not 42 distinct authored products. Related repositories, duplicate clones, worktrees, client previews, and internal knowledge stores are grouped below. The five priority projects received implementation, test-source, documentation, and asset review. Other entries received targeted source inspection or a documentation/metadata triage, as stated. Hidden runtime directories, dependency folders, and credentials were excluded.

### Strong next additions

| Project | Why it deserves space | Best element | Review depth and boundary |
|---|---|---|---|
| ChapterHQ | A distinct business product for organizations whose officers and members change over time. | Fictional member/officer switch: scoped answer → draft event → confirmation card. | Source inspected. `/Users/calebbolden/Projects/lab/chapterhq/src/lib/ai/tools/events.ts:66` returns confirmation metadata; this alone does not establish the entire approval UI path. |
| Open Brain | Local knowledge capture, provenance, review, and portability are a strong complement to the agent tooling. | Export a tiny fictional knowledge collection, reopen it, and show preserved source provenance. | Targeted source and docs. Pre-alpha; export/import implementation at `/Users/calebbolden/Projects/oss/open-brain-public/packages/engine/src/open_brain_engine/engine/portability.py:356`. Older AI OS UI is not proof of integration with the rebuilt engine. |
| Terminal Agent Launcher | A small, understandable developer utility with a visible permission decision. | Select a fictional folder, choose a preset, inspect the command preview. | Source inspected at `/Users/calebbolden/Projects/oss/agent-launchpad/terminal_agent_launcher/web/assets/app.js:321`. Website interaction must not execute a visitor-supplied command. |
| Canton Traffic Calculator | A compact interactive calculator demonstrates domain modeling and clear tradeoffs. | Edit a fictional transaction mix, inspect the free/billable breakdown, and share the scenario. | Source and test-source inspected; identify it as work for Blockdaemon and establish case-study/asset rights. |
| Bacchus, conditional on role clarification | Hardware, mobile, and backend work would broaden a portfolio otherwise dominated by AI software. | Pair a fictional device, show sample sensor data reaching the app, and explain your contribution. | Source inspected across mobile/backend and PCB inventory. Other authors account for most implementation history; role and asset rights are unresolved. |

ChapterHQ and Vora already have longer internal case-study drafts at `/Users/calebbolden/Projects/consulting/case-studies/chapterhq.md` and `/Users/calebbolden/Projects/consulting/case-studies/vora.md`. Reuse their problem and decision narratives after fact-checking. The ChapterHQ draft contains conflicting identifier/schema descriptions and should not be copied directly.

For Canton, the calculator engine handles monthly traffic, free allowance, and estimated cost at `/Users/calebbolden/Projects/work/blockdaemon/canton-traffic-calculator/src/lib/engine.ts:51`; scenario validation lives at `/Users/calebbolden/Projects/work/blockdaemon/canton-traffic-calculator/src/lib/url-state.ts:50`. The public, non-fork repository and Caleb-authored local history support a contribution story, but public visibility alone does not establish rights to reuse employer branding or code. Use hypothetical rates or clearly dated source rates; this research did not validate current pricing.

Bacchus pairs a wearable and reads Bluetooth measurements in `/Users/calebbolden/Projects/lab/bacchus/mobile-app/context/GlobalProvider.js:522`; backend analysis exists at `/Users/calebbolden/Projects/lab/bacchus/backend/monitoring/tasks.py:51`. Its product includes estimated BAC and time-to-sober displays. Show interface and systems-integration work without making accuracy or safety claims. Git authorship does not determine ownership, but the history does rule out casually describing every layer as your own implementation. Establish whether your role was founder, product lead, integrator, developer, or some combination before writing the case study.

### Lab and supporting material

| Project or group | Portfolio treatment | Review depth |
|---|---|---|
| YouTube/Obsidian summarizer | Small capture → summary → useful note demonstration using public, permitted source material and an invented “why I saved it.” | Documentation and project structure at `/Users/calebbolden/Projects/lab/youtube-obsidian-summarizer`. |
| Life Systems | An optional personal-build card showing a fictional weekly routine. Keep private habits and conversations out. | Documentation at `/Users/calebbolden/Projects/lab/life-systems`. |
| Signal Relay | A lab note about notification capture and normalization. Do not imply trading execution. | README at `/Users/calebbolden/Projects/lab/signal-relay`. |
| Pentest Team | Later, an authorized synthetic-lab triage/report example. Describe the workflow rather than making certification or coverage claims. | README/package metadata at `/Users/calebbolden/Projects/lab/pentest-team`. |
| Cursor/DeepSeek proxy | A small adapter note if it demonstrates a useful decision. | Non-Git directory inventory only at `/Users/calebbolden/Projects/cursor-deepseek-proxy`; no implementation claims established. |

### Client and work-related material

| Project or group | Portfolio treatment | Review depth |
|---|---|---|
| Bold Steps Therapy, Moseley Wellness, Rickey Bolden, Travis Steaks/Field Good Foods | Choose the strongest approved before/after case; explain your exact role. A concept or preview needs that label. Do not invent conversion/SEO outcomes. | Documentation, package and directory triage under `/Users/calebbolden/Projects/consulting/clients`; not a full code or results audit. |
| Brittany Lyons and other local website previews, including Shotmakers | Keep previews separate from delivered client work. Public naming, media, and results require case-specific evidence. | Current site and prior branch consolidation context; preview access controls remain separate from showcase planning. |
| Funnel Engine | Explain a completed consulting workflow or deliverable if useful. Do not present the planned helper system as an implemented application. | `/Users/calebbolden/Projects/consulting/funnel-engine/CLAUDE.md` and directory structure; some described implementation directories were absent. |
| Canton Upgrade Tracker and DraftDaemon | Potential anonymized engineering stories using public or invented inputs. Establish employer permission and authorship before publication. | READMEs at `/Users/calebbolden/Projects/work/canton/upgrade-tracker` and `/Users/calebbolden/Projects/work/blockdaemon/draftdaemon`. |
| Product Pricing and private Canton configs | Exclude from the public catalog unless an approved, generic account of a specific contribution is available. | Metadata only at `/Users/calebbolden/Projects/work/blockdaemon/product-pricing` and `/Users/calebbolden/Projects/work/canton/configs-private`. |

### Grouped, supporting, or excluded entries

| Inventory entry | Treatment |
|---|---|
| Vora Platform and nested Vora Website | One product story; website is a supporting surface. Canonical code is `/Users/calebbolden/Projects/vora/vora-platform`. |
| Vora v2 and Vora LLC | Architecture work and company strategy respectively. Do not count as two additional shipped products. |
| Agent Team, Agent Config, Prism | Featured individually above. Shared conceptual story does not establish actual integration. |
| Homelab canonical and infra clone | Group as one operations project. Control Center's authored layer sits inside the larger homelab setup. |
| Bacchus mobile, legacy mobile, backend, PCB | One hardware/product story, not four portfolio tiles. |
| Open Brain private, public, M1, and safety checkouts | One project family with explicit generation/maturity distinctions; worktrees are not extra products. |
| Caleb Brain | Architecture composition at M0, not a running personal AI service. `/Users/calebbolden/Projects/caleb-brain` remains separate from the Open Brain product. |
| Work Brain and personal career | Private knowledge/career material; context, not public projects. |
| CLI Printing Press | Upstream/fork contribution only unless original contribution is established. Credit the original project. `/Users/calebbolden/Projects/oss/cli-printing-press`. |
| Claude Shared and Design Kit prompts | Shared configuration/reference collections. Do not imply authorship of collected external work. |
| Personal site, Brittany checkout, Blockdaemon handoff worktree | Current site or alternate working state, not independent products. |

The current Open Source page also names Life Agent MCP and Claude Code Config Manager. No standalone canonical checkout with those names was located in this scan, so their current status was not independently established. Keep or revise those listings after checking their current public repositories: `/Users/calebbolden/Projects/consulting/calebbolden.com/app/work/open-source/page.tsx:10`.

## Evidence and publication boundaries

Prefer an actual recording with invented records when a product is readily runnable. Use a deterministic fixture simulation when live capture would require private accounts or unstable integrations. Use a labeled diagram or prototype for architecture-only work. None of these requires making a repository public.

Every public asset needs an accurate caption, a capture/review date, and a defined contribution. Replace private identifiers in the underlying dataset rather than relying on blur alone. Do not ship real logs, prompts, internal URLs, customer records, credentials, or private repository paths inside fixture JSON or downloadable files.

Show measured outcomes only when a reproducible source exists. Counts of commits, tools, skills, or test files do not establish business value, reliability, or production usage. This review did not measure those outcomes.

The reference site was reviewed in a rendered browser, including its gallery, Proofline page, and architecture case study. The five priority projects were researched by three independent workers, followed by a separate skeptical review of the leading claims. Additional breadth review covered selected secondary projects. This is a portfolio assessment, not a security audit or deployment certification.
