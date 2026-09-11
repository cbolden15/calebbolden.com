# Project showcase implementation plan

> For future agentic workers: use the installed executing-plans or subagent-driven-development skill only after a separate implementation instruction. Checkboxes track future work. This phase does not execute any task.

**Status: PROVISIONAL.** Hardening returned `fix-first` (0 Critical, 9 Important, 3 Minor), but Feasibility failed, the independent reviewer failed, and all three finding auditors failed routing. `verified: true` means auditing was enabled; it does not attest that the auditors succeeded. The report is single-family and its findings are independently unverified. Supported corrections are applied and unsupported scope changes are refuted. Missing review evidence must be obtained under unchanged permissions before this plan can be marked ready.

**Goal:** Make Vora, Prism, Agent Team, Agent Config, and Control Center inspectable through a shared catalog, truthful case studies, and five bounded browser demonstrations while preserving existing work.

**Architecture:** Keep Next.js App Router and explicit route files. Server-render the public catalog, narrative, first frame, and complete walkthroughs. Load a small project-specific client island for the active demonstration. Shared case-study sections extend the existing `WorkDetail` contract; secondary pages keep their existing behavior during migration.

**Tech stack:** Installed Next.js 16.1.4, React 19, TypeScript 5.9.3, Tailwind 4, Vitest 3.2.7 in Node, ESLint 9.39.2, Zod, Sharp, and existing Headless UI. Browser tests need a proposed development-only Playwright dependency and configuration, created in T03. No runtime dependency, CMS, workflow engine, backend, or public terminal is required.

**Spec:** `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md`. Code baseline: `c59e91c`. This plan targets corrected spec SHA-256 `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553`. Cycle 1 reviewed only initial SHA-256 `c217d8f231bf3ef40d1ea76621a3efe34cee5462801592f3d22a2d24071f8997`; its verdict is not an attestation of the corrected bytes. No unresolved Critical was reported, but incomplete independent review cannot establish their absence.

**Evidence:** `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/research/2026-09-11-project-showcase-review.md` is private research, never a runtime import. Hardening disposition: `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.md`. Documentation verification: `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-verification.md`.

All application paths below are repository-relative to `/Users/calebbolden/Projects/consulting/calebbolden.com`. File tables distinguish existing files from proposed new files. No proposed application path has been created by this planning phase.

## Global constraints

| Contract | Required behavior |
|---|---|
| Scope | Five flagships only. Keep `/`, `/work`, all four existing `/work/*` destinations, `/how-i-build`, `/contact`, secondary projects, and current homepage section order. No hero, service/package, blog infrastructure, client-preview, chat preference, or backend redesign. |
| Catalog | All: 7, Products: 3, Developer tools: 4 at the complete release. Vora leads All/Products; Prism leads Developer tools. Extract the feature once. Open source stays outside counts and visible in every filter. Real Estate Maite stays homepage-only, in development. |
| Presentation | Light working wall; blue/ink/surface tokens; Archivo, Schibsted Grotesk, Martian Mono. 1200px maximum; 12 columns at large available width; narrative at most 70ch. H1 `clamp(2.4rem, 5.5vw, 4.25rem)`. Body 16–18px, about 1.6 line height. One amber note per section at most. Frames 2px radius; controls 6px. |
| Responsive behavior | Below 800px available content width, feature/workflow columns stack; below 600px, rows stack and padding is 20px. Otherwise gutters 32px and gaps 24–40px. Preserve the existing 360px chat offset and the user's preference. Controls at least 44×44 CSS px; no document overflow or unreadable miniaturized dashboards. |
| Interaction and evidence | Local deterministic state; explicit Reset; no storage or share URL state; no automatic progression. Text labels for state and media type. No demo network calls, message delivery, repository operations, model calls, approvals, subprocesses, or private-service queries. |
| Accessibility and loading | Server-visible first frame and full ordered walkthrough; hide enhancement-only controls before hydration. Keyboard controls and focus return; polite concise state announcements. Immediate reduced-motion states. Videos click-to-play with native controls and required transcript/captions. Intrinsic dimensions; at most one eager primary poster; later media/modules lazy; no eager full video. |
| Evidence limits | Vora approvals are configuration-dependent. Agent Team pass/retry shows default legacy auto-merge with enforcement disabled. Control Center is Prototype, sample data, deployment unverified; credit Homepage/Healthchecks. Agent Config credits imported skills/hooks and uses captured or explicitly illustrative outputs. Prism is Developer preview with version, public revision, derivation, checked date, authentic event order, and limited cleanup claims. |
| Size and copy | Overview posters target ≤250KB each. Active demonstration additional gzip JavaScript target ≤100KB. Required exceptions state the reason and measured bytes. Summaries 25–45 words; problem 80–140; flagship narrative 400–700 excluding walkthroughs/technical disclosures; 2–3 engineering decisions; 1–2 related projects. Human prose; no invented outcomes or performance claims. |

Analytics is conditional on an already reviewed provider; none was established in this planning inspection. No provider installation belongs here. If later verified, allow only `project_open`, `demo_start`, `demo_complete`, `technical_detail_open`, `contact_click` with slug and fixed scenario ID. Blocked intended terminal outcomes count as completion. Never include fixture bodies, free text, approval contents, or private identifiers.

## Architecture decisions and release states

1. **Use one server-side catalog composed from small authored project modules.** It supplies homepage cards, Work, metadata, related links, and detail content. Client components receive explicit allowlisted DTOs and only their selected public fixture. Never spread a research record into props. Test both the input schema and serialized responses; server placement alone does not prevent leaks.
2. **Use five small state models, not a generic workflow interpreter.** Share presentation controls and media, while Vora authorization branches and Prism receipt ordering remain project-specific. Reducers and selectors are pure, testable in the existing Node Vitest environment. No DOM testing package is needed for those tests.
3. **Preserve explicit routes and the legacy `WorkDetail` API.** Add a rich-project branch to the component. Existing Vora, ChapterHQ, and site-assistant callers remain valid until individually migrated. Never map `Implemented` to `live`. Keep the Open source collection outside the main result set.
4. **Separate code, evidence, and publication readiness.** New flagship entries start draft. Draft pages may render only in local development and carry a visible development label; production requests return 404, and catalog links, metadata, related links, and sitemap omit them. No URL parameter, cookie, or deployed preview switch enables drafts. Existing Vora remains reachable with its prior page until its richer case study is approved; keep that legacy body as a temporary server-rendered fallback within its current route. Public Vora summary/maturity still comes from the catalog. Draft rollout counts are derived honestly; 7/3/4 is the complete-release gate, not a value to fake while entries are draft.
5. **Prefer reviewed authored fixtures to blocked captures.** Local development can use explicitly illustrative samples. Vora's unverified live action is not asserted; compiler outputs remain illustrative until generated offline; Prism has no recorded label or invented version/revision. A missing required provenance field blocks that case study's publication, while shared layout and state testing can progress. Isolated hosted product environments remain the higher-fidelity future alternative, pending provisioning/isolation/reset/abuse/maintenance verification; they are excluded from this release.

Do not copy private project code, run logs, configs, captures, internal paths, hostnames, or customer records into the website. Private evidence remains in the research ledger. Only independently reviewed, purpose-written public strings/assets enter application modules or browser fixtures. Do not add repository-reading build steps or arbitrary HTML/script content.

## File boundaries and ownership

| Existing files verified on disk | Responsibility and future owner |
|---|---|
| `components/WorkDetail.tsx`; `app/work/vora/page.tsx`; `app/work/chapterhq/page.tsx`; `app/work/site-assistant/page.tsx` | T02 foundation owner adds compatible rich layout; T04 later owns Vora. T01/T02 coordinator migrates secondary summaries/status to shared records while retaining their bodies and media. |
| `app/work/page.tsx`; `components/Proof.tsx`; `app/how-i-build/page.tsx`; `app/sitemap.ts` | Integration owner only, sequential T09 then T10. Arrays currently duplicate summaries and status. Sitemap explicitly lists existing detail routes. |
| `app/globals.css`; `components/Reveal.tsx`; `app/layout.tsx`; `components/AIChat.tsx`; `app/page.tsx` | Read dependencies. T03 may add narrowly scoped showcase fallback CSS to globals; keep Reveal, fonts, chat behavior, and homepage order intact. |
| `package.json`; `package-lock.json`; `vitest.config.ts`; `tsconfig.json` | T03 tooling owner only. Keep existing Node `**/*.test.ts` test coverage. ESLint flat config and Playwright are absent today. |
| `scripts/optimize-image.mjs`; `public/video/assistant-demo.mp4`; `public/video/assistant-demo-poster.jpg` | Existing optimizer and secondary media, not flagship publication approval. T11 uses optimizer for reviewed new assets. |
| `proxy.test.ts`; `lib/__tests__/rate-limit.test.ts`; `app/api/__tests__/subscribe.test.ts`; `lib/social/__tests__/band-list.test.ts`; `consulting/social/__tests__/syllabus.test.ts`; `lib/__tests__/smoke.test.ts` | Existing full-suite regression surface; no showcase transition tests exist. Preserve proxy/auth behavior. The arithmetic smoke test is not showcase verification. |

| Proposed new path or exact path pattern | Owner and purpose |
|---|---|
| `lib/work/types.ts`, `lib/work/catalog.ts`, `lib/work/public-content.ts`, `lib/work/__tests__/catalog.test.ts`, `lib/work/__tests__/public-content.test.ts` | T01 owns types, server composition, strict public schema/DTO projection, and publication/filter tests. |
| `lib/work/projects/vora.ts`, `lib/work/projects/prism.ts`, `lib/work/projects/agent-team.ts`, `lib/work/projects/agent-config.ts`, `lib/work/projects/control-center.ts`, `lib/work/projects/secondary.ts` | T01 creates initial records. After the foundation checkpoint, each flagship task exclusively owns its own record; coordinator alone owns secondary and catalog composition. |
| `components/work/CaseStudySections.tsx`, `components/work/ProjectEntry.tsx`, `components/work/WorkFilters.tsx`, `components/work/ProjectMedia.tsx`, `components/work/MediaGallery.tsx`, `components/work/Showcase.module.css` | T02 owns sections and entries; T03 owns media/gallery/styles; T09 alone creates filters. No flagship worker edits these shared files. |
| `lib/work/demos/vora.ts`, `lib/work/demos/prism.ts`, `lib/work/demos/agent-team.ts`, `lib/work/demos/agent-config.ts`, `lib/work/demos/control-center.ts` | T04–T08 respectively own one pure fixture/state model each. Their tests are exactly `lib/work/__tests__/vora.test.ts`, `prism.test.ts`, `agent-team.test.ts`, `agent-config.test.ts`, `control-center.test.ts`. |
| `components/work/demos/VoraDemo.tsx`, `PrismDemo.tsx`, `AgentTeamDemo.tsx`, `AgentConfigDemo.tsx`, `ControlCenterDemo.tsx` in that same directory | T04–T08 client islands. Import only their own model and type-only shared contracts. |
| `app/work/prism/page.tsx`, `app/work/agent-team/page.tsx`, `app/work/agent-config/page.tsx`, `app/work/control-center/page.tsx` | Four new explicit routes, owned by T05–T08. Vora modifies its existing route. |
| `eslint.config.mjs`, `playwright.config.ts`, `tests/showcase/navigation.spec.ts`, `tests/showcase/demos.spec.ts`, `tests/showcase/access.spec.ts`, `tests/showcase/boundaries.spec.ts`, `tests/showcase/performance.spec.ts` | T03 tooling owner establishes the harness; T09/T12 integration owner expands browser checks. `.spec.ts` keeps Playwright files outside Vitest's `.test.ts` discovery. |
| `public/work/vora/overview.webp`, `public/work/prism/overview.webp`, `public/work/agent-team/overview.webp`, `public/work/agent-config/overview.webp`, `public/work/control-center/overview.webp` | Required proposed public overview posters. Optional galleries preserve meaningful source ratios; reviewed recordings/captions get descriptive names in the same project directory. No unreviewed capture is copied here. |

Proposed implementation evidence record: `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-release-checks.md`. T11/T12 coordinator owns it. It records asset approvals, exact fixture provenance, checks, byte budgets, and publication gates; application modules never import it.

## Sequence and independent work

| Milestone | Dependency order | Completion boundary |
|---|---|---|
| Shared foundation, about 1–2 days | T01 → T02 → T03 | Typed public boundary, compatible sections, static rendering, responsive media, and executable test tooling. Existing routes still work. |
| Vora and Prism, about 2–3 days | T04 and T05 after T03 | Both distinct interactions pass their state tests and local browser checks. Evidence may remain a separately named publication gate. |
| Remaining three, about 2–4 days | T06, T07, T08 after first-pair integration checkpoint | Five demonstrations, each with complete terminal/reset behavior and truthful examples. |
| Site integration, about 1–2 days | T09 → T10 after project implementations | Catalog, homepage proof, responsibilities, sitemap, and all related links consume the shared records. |
| Evidence and final verification | T11 evidence preparation can progress beside project tasks; final approval follows their completed content. T12 follows T09–T11. | A1–A5 evidence collected. Code readiness and publication readiness reported separately. No deployment. |

T04/T05 have disjoint writes after T03. T06/T07/T08 have disjoint project files after the first pair is accepted. They may run in parallel under the future session's shared governance ledger. Catalog registration, package/config edits, shared CSS/components, sitemap, browser tests, and release-check documentation have one coordinator writer. A worker needing a shared change sends a request to that owner and waits for integration; it does not edit the shared file. Asset reviewers are read-only and never share implementation write ownership.

The complete release remains the spec's 7–12 focused-working-day planning range, not a commitment. Approval/capture delays extend calendar time. Each checkbox below is a bounded action; repeat its test/edit cycle for the concrete subcases listed, then commit the completed task locally using a commit-message file. No push or deployment is implied.

## T01: Public catalog and migration boundary

**Files:** create the T01 files and six project-record modules in the table; read the existing Work/Proof/detail/sitemap sources. No UI migration until the model tests pass.

**Interfaces:** `Category = 'products' | 'developer-tools'`; `CategoryFilter = 'all' | Category`; `Placement = 'home' | 'work' | 'case-study' | 'how-i-build'`; `ProjectRecord` has identity, publication, placements, order, maturity, checked date, optional public links, related slugs, and optional story/evidence/interaction. How I build records add `responsibility: { label: string; order: number; evidenceId: string; caption: string }`. Collection and homepage-only records do not require a detail route. Secondary legacy availability is separate from flagship maturity. `getCatalog(category: CategoryFilter, records?: readonly ProjectRecord[]): { featured?: ProjectCard; rows: ProjectCard[]; count: number }`; `normalizeCategory(value: string | string[] | undefined): CategoryFilter`; `getProject(slug: string): ProjectRecord | undefined`; `toProjectCard(record: ProjectRecord): ProjectCard`; `canRenderCaseStudy(record: ProjectRecord, mode: 'development' | 'production'): boolean`. Production has no draft bypass.

Represent the richer body as optional `caseStudy: { publication: 'draft' | 'published'; story: ProjectStory; evidence: PublicMedia[]; interaction: PublicInteraction }`, separate from the entry's top-level publication. `ProjectStory` contains problem, workflow introduction/ordered walkthroughs, decisions, credits, limits, and About text; `PublicInteraction` is a discriminated five-kind fixture reference with display copy. This distinction is required for Vora: its existing entry stays published while a replacement rich body is draft. `canRenderCaseStudy` checks rich-body readiness and top-level publication in production; development may render a labeled draft. New routes without a renderable rich body call `notFound()`. Vora falls back to its legacy body instead. The fixed existing legacy route set is validated separately and never synthesized from arbitrary slugs. A published new route requires both flags, approved media/evidence, and a real route file. Card/related/sitemap selectors advertise only a destination with a renderable published rich body or a known existing legacy body.

`ProjectCard` defines `slug`, `name`, `category`, `summary`, `contribution`, optional `maturity`, optional `legacyStatus`, optional `checkedDate`, optional `detailRoute`, optional approved product/source links, and an optional poster DTO of `src`, `width`, `height`, `alt`, `caption`, and optional gallery reference. No narrative, fixture, private approval note, or raw capture is included. `public-content.ts` exports `selectCatalog` for already filtered public cards; `catalog.ts` alone imports authored project records. Each demo component receives its own typed public fixture as a prop from the server route; no client import of the entire catalog is allowed.

- [ ] Define the public Zod schemas with strict keys at every object level. Keep private evidence/approval notes out of the type entirely. Add a synthetic poison-field test, missing-route publication test, unresolved-related-link test, and exact release filter test.

```ts
expect(normalizeCategory(['products', 'developer-tools'])).toBe('all');
expect(normalizeCategory('unknown')).toBe('all');
const result = getCatalog('developer-tools', releaseRecords);
expect(result.featured?.slug).toBe('prism');
expect(result.rows.map(p => p.slug)).toEqual(['agent-team', 'agent-config', 'control-center']);
expect(result.count).toBe(4);
expect(publicProjectSchema.safeParse({ ...validPublicRecord, internalNotes: 'SYNTHETIC_PRIVATE_SENTINEL' }).success).toBe(false);
```

`releaseRecords` and `validPublicRecord` are synthetic test helpers declared in the catalog test, using complete accepted public shapes, not a production publication override. Export `publicProjectSchema` from `public-content.ts`. Test fields nested inside evidence and fixtures too; `toProjectCard` constructs fields explicitly rather than spreading the input.

- [ ] Run `npm test -- lib/work/__tests__/catalog.test.ts lib/work/__tests__/public-content.test.ts`; first run must fail on missing behavior, then pass after the next step.
- [ ] Implement the catalog with ordered slugs `vora, prism, agent-team, agent-config, control-center, chapterhq, site-assistant`. Keep Open source in a separate collection and Real Estate Maite only in home placement. Seed four new routes as draft. Preserve existing secondary descriptions/status without inventing fresh verification dates. Mark flagship maturity independently of category and optional source visibility. Unknown and repeated category values resolve to All.
- [ ] Verify All/Products/Developer tools lists are exactly 7/3/4 with fully ready synthetic records; Vora appears once in All/Products and Prism once in developer tools. Test filtered counts with draft records, direct production draft rejection, and absent optional links. Test the public DTO serializes no story/fixture/internal fields when a card only needs name, summary, role, maturity, poster, and link.
- [ ] Commit only T01 files with a file-based message. Completion: the public boundary rejects synthetic private fields, draft destinations cannot become production links, and migration semantics are deterministic before UI code uses them.

## T02: Compatible case-study and project-entry sections

**Files:** modify `components/WorkDetail.tsx`; create `components/work/CaseStudySections.tsx`, `components/work/ProjectEntry.tsx`; modify existing ChapterHQ/site-assistant routes only to consume shared identity/status/summary where those values are duplicated. Keep their full bodies/media intact. Foundation coordinator owns these writes.

**Interfaces:** preserve current `WorkDetailProps` for legacy callers; add a discriminated `{ project: ProjectRecord; demonstration: React.ReactNode }` input for the rich layout. `CaseStudySections({ project, demonstration })` server-renders the five ordered sections. `ProjectEntry({ project: ProjectCard, featured: boolean })` contains native detail links and a sibling enlarge control only when a gallery exists.

- [ ] Establish browser assertions for one H1, meaningful reading order, primary demonstration before technical stack, visible role/maturity/media label/date, and ChapterHQ/site-assistant regression destinations. Use the T03 harness once available; until then inspect local `/work/vora`, `/work/chapterhq`, `/work/site-assistant` with `npm run dev -- --hostname localhost --port 3100`.
- [ ] Implement a compatible branch inside WorkDetail; preserve the legacy branch and all three current callers. Example branch contract:

```tsx
if ('project' in props) {
  return <><Header /><main className="chat-offset"><CaseStudySections project={props.project} demonstration={props.demonstration} /></main><Footer /></>;
}
```

- [ ] Server-render introduction, media label/caption, problem/workflow, 2–3 constraint→choice→consequence decisions, credits/limits/dated About this example, 1–2 published related projects, Back to Work, and `/contact`. Ordinary headings and `<details>` disclose technical depth; core meaning is always visible. Render a full walkthrough beside/below the initial frame. Do not put required content inside an initially hidden `Reveal` wrapper.
- [ ] Implement large 7/5 feature and smaller-media editorial rows with 25–45 word summaries and contribution/maturity/detail link. Render development placeholders with explicit labels only in development. A missing public source creates no button; links and gallery buttons are siblings. Run `npm test` and `npm run build`; inspect secondary pages and no-JavaScript reading order after T03 provides browser coverage.
- [ ] Commit the compatible shared layout. Completion: existing detail pages still compile/render, and a populated rich example has the required sections without hiding its explanation behind JavaScript.

## T03: Responsive media, progressive enhancement, and browser tooling

**Files:** create `components/work/ProjectMedia.tsx`, `components/work/MediaGallery.tsx`, `components/work/Showcase.module.css`, `playwright.config.ts`, `eslint.config.mjs`, and the five named browser test files. Modify `app/globals.css` only for showcase-scoped visibility if necessary; modify `package.json`/`package-lock.json` for test tooling. Do not change `components/AIChat.tsx`, chat storage, preview proxy, or global Reveal behavior.

**Interfaces:** `ProjectMedia({ media: PublicMedia })` displays reviewed dimensions, poster, caption, and static walkthrough. `PublicMedia` in T01 defines `id`, `kind`, local `poster`, optional local `src`, `width`, `height`, `alt`, `caption`, `walkthrough`, optional `transcript`, optional `gallery`, and public evidence text. `MediaGallery` owns dialog open/index state, clears it on close, traps focus, and restores the triggering button. Demo controls mount only after hydration and module readiness; the first server frame/walkthrough remains readable if loading fails.

- [ ] Add a pinned compatible `@playwright/test` development dependency after inspecting its current version in the implementation session; do not install anything in this documentation phase. Use `npm install --save-dev --save-exact @playwright/test` and `npx playwright install chromium`. Configure local-only tests with `baseURL: 'http://localhost:3100'`, `testDir: './tests/showcase'`, one Chromium project named `chromium`, one worker, a 30-second test timeout, and 120-second server startup bound. Preserve existing Vitest discovery. Use `webServer` for `npm run dev -- --hostname localhost --port 3100` during draft work; set `SHOWCASE_SERVER=production` to select `npm run start -- --hostname localhost --port 3100` after a separately completed build. This environment selector only chooses the test server, never website draft visibility.
- [ ] Replace the invalid lint script with ESLint CLI and a scoped flat configuration using installed `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Example configuration imports the two exported config arrays and `globalIgnores` from `eslint/config`; ignores `.next/**`, `node_modules/**`, generated coverage/test reports, and `next-env.d.ts`. Keep exclusions transparent; do not mass-fix unrelated source or claim pre-existing lint debt is resolved. Use `npm run lint -- <changed TS/TSX paths>` as the scoped gate and record any broader baseline failure separately.
- [ ] Implement a container around content after chat offset, then apply container queries to its children. Keep images intrinsically sized and locally scoped horizontal scrolling for code. CSS behavior:

```css
.surface { container-type: inline-size; }
.content { max-width: 1200px; margin-inline: auto; padding-inline: 32px; }
@container (width < 800px) { .feature, .workflow { grid-template-columns: 1fr; } }
@container (width < 600px) { .row { grid-template-columns: 1fr; } .content { padding-inline: 20px; } }
@media (prefers-reduced-motion: reduce) { .surface * { animation: none; transition: none; } }
```

Set the container on a parent of `.content`, so the 800/600px boundaries measure the post-chat main area before gutters. Test 799/800 and 599/600, including fractional widths below the boundary. Server-render required content without `.reveal`; wrap legacy WorkDetail and reused showcase sections with a scoped identifier and a `<noscript>` visibility override for their existing reveal wrappers. Keep that override local to showcase content, including the retained secondary bodies. Do not rely on body `overflow-x:hidden` to conceal overflow.

- [ ] Implement native image/video fallback and optional gallery. Failed image keeps alt/caption/walkthrough plus Retry and a reviewed original-image link; failed video keeps poster/text. Video uses `preload="none"`, native controls, no autoplay, and captions/transcript when speech exists. On opening the gallery remember the actual opener; Escape/backdrop/Close returns focus, arrows and disabled ends work, and reopening resets the frame. Test failed lazy import by blocking its chunk: static content remains, unusable controls stay absent, and Retry is offered. Use `npx playwright test tests/showcase/access.spec.ts --project=chromium` plus `npm test` and `npm run build`.
- [ ] Commit media/tooling with the dependency change visible. Completion: keyboard gallery lifecycle, no-JavaScript/static import-failure behavior, reduced motion, media failure, and chat-width stacking are testable before five interactions are added. Only the primary poster is eager; secondary modules load on approach/intent, not through a single eagerly imported five-demo registry.

## T04: Vora approval simulation

**Files:** modify `lib/work/projects/vora.ts` and existing `app/work/vora/page.tsx`; create `lib/work/demos/vora.ts`, `lib/work/__tests__/vora.test.ts`, `components/work/demos/VoraDemo.tsx`. Assets: proposed `public/work/vora/overview.webp`. No other shared-file writes.

**Interfaces:** model exports `VoraState`, `initialVora`, `voraReducer(state, event)`, `voraView(state)`. State has `outcome: 'succeeds' | 'fails'` and `step: 'request' | 'pending' | 'approved' | 'completed' | 'rejected' | 'failed'`. Events: `review`, `approve`, `reject`, `show-result`, `set-outcome` with `outcome`, and `reset`. `voraView` exposes active caption, sample CRM activity, and `deliveryConfirmed: boolean`. Invalid transitions return unchanged state. `VoraDemo` consumes only the approved Vora fixture and shared type declarations.

- [ ] Write the meaningful forbidden-transition and reset tests before UI code. Include both outcome values, every intermediate state, and repeated clicks.

```ts
const pending = voraReducer(initialVora, { type: 'review' });
const rejected = voraReducer(pending, { type: 'reject' });
expect(voraReducer(rejected, { type: 'show-result' })).toEqual(rejected);
expect(voraReducer(pending, { type: 'show-result' })).toEqual(pending);
const failureStart = voraReducer(initialVora, { type: 'set-outcome', outcome: 'fails' });
const approvedFailure = voraReducer(voraReducer(failureStart, { type: 'review' }), { type: 'approve' });
const failed = voraReducer(approvedFailure, { type: 'show-result' });
expect(failed.step).toBe('failed');
expect(voraView(failed).deliveryConfirmed).toBe(false);
expect(voraReducer(failed, { type: 'reset' })).toEqual(initialVora);
```

- [ ] Run `npm test -- lib/work/__tests__/vora.test.ts`, observe the initial failure, then implement the reducer and invented Cedar Repair request/Customer A message/error/CRM fixtures. Selecting an outcome from any state resets to Request received with the newly selected outcome. Reset also restores Succeeds. Only approved→show-result can reach a sample completion; failed and rejected states have no completed CRM activity.
- [ ] Implement request, approval, decision, and result panels with the exact named buttons from §6. No generic Next/Previous, delivery effect, unrestricted input, or chat integration. Show `Interactive simulation · sample data`, Implemented, contribution, public checked date, and conditional-approval limitation near the media. Keep all three terminal walkthroughs server-rendered. Draft copy describes approval as a concept until a supported configured action is verified.

Give the live interaction wrapper `role="region"` and `aria-label="Vora approval example"`; keep the complete static walkthrough outside that region so browser tests can distinguish a currently shown result from text describing another branch.
- [ ] Add browser rejection→blocked-result, approve→success, approve→failure, outcome change at pending/terminal, double-click, and Reset assertions to the coordinator's test queue. Run `npm test -- lib/work/__tests__/vora.test.ts` and `npm run build`; exercise the local route with T03 browser tooling. Keep the old public Vora body as a server fallback until rich content is reviewed; never expose a draft-only source link or claim universal approval.
- [ ] Commit Vora-only files. Completion: all six states behave correctly and the route remains available. Publication dependency: approved poster and exact configured approval action, or explicitly conceptual simulation copy without a live delivery claim. Any future recording requires isolated invented data and blocked/mocked or test-mode delivery under separate capture authority.

## T05: Prism trace and receipt

**Files:** modify `lib/work/projects/prism.ts`; create `app/work/prism/page.tsx`, `lib/work/demos/prism.ts`, `lib/work/__tests__/prism.test.ts`, `components/work/demos/PrismDemo.tsx`. Asset: proposed `public/work/prism/overview.webp`.

**Interfaces:** `PrismState = { eventIndex: number; receiptOpen: boolean }`; `initialPrism` uses `eventIndex: -1`, closed receipt. `prismReducer` accepts `start`, `next`, `previous`, `inspect-receipt`, `close-receipt`, `reset`. Start presents event zero; valid events are zero through five. `prismView` returns active event, optional result, receipt eligibility, and disabled-control state. `PrismFixture` includes prompt, six ordered source event-type identifiers, result, terminal receipt, and `{ version, publicRevision, derivation: 'captured' | 'contract-derived', checkedDate, substitutions?: string }`.

- [ ] Write tests that first exercise Next/Previous/receipt before Start, then reach the final event and walk backward. Example:

```ts
expect(prismReducer(initialPrism, { type: 'inspect-receipt' })).toEqual(initialPrism);
let state = prismReducer(initialPrism, { type: 'start' });
for (let i = 0; i < 5; i++) state = prismReducer(state, { type: 'next' });
expect(prismView(state).result).toBe('3 words');
state = prismReducer(state, { type: 'inspect-receipt' });
const earlier = prismReducer(state, { type: 'previous' });
expect(earlier.receiptOpen).toBe(false);
expect(prismView(earlier).result).toBeUndefined();
expect(prismReducer(earlier, { type: 'reset' })).toEqual(initialPrism);
```

- [ ] Run `npm test -- lib/work/__tests__/prism.test.ts`, then implement bounded index transitions and immutable fixture data. Next before Start is inert; Previous disables at event zero; Next disables at five. Start is hidden/disabled after starting. Reset restores the unstarted state with a static first-frame preview. No result/receipt is presented early.
- [ ] Obtain a version-pinned public contract-derived fixture or an isolated captured run with the exact six-event order. Prompt is `Count the words in: one two three`; result is `3 words`. Retain public event-type names in optional technical detail. Allowlist public receipt fields; remove private run identifiers/paths/PIDs/hosts and disclose substitutions. Use only recorded limits/usage/cleanup values; explain missing fields rather than inventing guarantees. Local draft examples lacking verified public revision remain draft.
- [ ] Implement Start example, Next event, Previous event, Reset, and completion-only Inspect receipt. Show `Recorded trace playback · local CLI example` only for captured provenance; otherwise `Deterministic simulation`. Maturity stays Developer preview. Browser tests walk all six events, open/close receipt, go back, reset, reload, and confirm no subprocess/network activity. Recheck public source and getting-started destinations in the implementation session. Run the Prism unit test and `npm run build`.
- [ ] Commit Prism-only files. Completion: exact sequence and receipt disclosure work in local development; publication requires version/public revision/derivation/date and reviewed poster. Plugin digest approval, ambient-authority experiments, Linux/KVM/QEMU/Firecracker assurance, and native execution remain excluded.

## T06: Agent Team run explorer

**Files:** modify `lib/work/projects/agent-team.ts`; create `app/work/agent-team/page.tsx`, `lib/work/demos/agent-team.ts`, `lib/work/__tests__/agent-team.test.ts`, `components/work/demos/AgentTeamDemo.tsx`. Asset: proposed `public/work/agent-team/overview.webp`.

**Interfaces:** `TeamState = { scenario: 'pass' | 'retry' | 'security'; stage: number; detailsOpen: boolean }`; export `initialTeam = { scenario: 'pass', stage: 0, detailsOpen: false }`. `teamReducer` accepts `scenario` with value, `next`, `previous`, `select-stage` with index, `toggle-details`, and `reset`; `teamView` returns visible stage, reachable stage indices, terminal label, and immutable attempt history. Stages: Task, Implementation, Reviews, QA, Delivery.

- [ ] Add tests for all three scenarios, direct stage selection, keyboard-equivalent events, end clamping, scenario changes, and history retention:

```ts
const blocked = teamReducer(initialTeam, { type: 'scenario', value: 'security' });
expect(teamView(blocked).reachableStages).toEqual([0, 1, 2]);
expect(teamReducer(blocked, { type: 'select-stage', index: 4 })).toEqual(blocked);
const retry = teamReducer(initialTeam, { type: 'scenario', value: 'retry' });
expect(teamView(teamReducer(retry, { type: 'select-stage', index: 4 })).attemptHistory.map(a => a.outcome)).toEqual(['failed', 'passed']);
```

- [ ] Run `npm test -- lib/work/__tests__/agent-team.test.ts`; implement the reducer and three fictional repository/task runs. QA retry retains a specific failed assertion, debugger change excerpt, and passing second attempt. Security ends at Reviews; QA and Delivery remain visible as Not reached and cannot be selected. A pass or retry may inspect any reachable stage; viewing a later sample stage is not executing a pipeline.
- [ ] Show isolated implementation, separate review prompt contexts, QA, draft PR, CI, and legacy green-PR automatic merge within the five visible stages. Each panel has role, decision, and artifact excerpt. Pin pass/retry to merge-policy enforcement disabled and show this beside the final automatic-merge label. The security fixture models a blocking review result before PR, not an enabled merge gate. If source verification discovers an additional setting required for that review stop, disclose it before publication; do not enable unrelated controls in the story.
- [ ] Display the compact configuration disclosure: merge/queue enforcement, sandboxing, anomaly termination off; hard caps unset. Do not promise universal human approval, active sandboxing, provider/model diversity, or production replay. Label `Sample run · deterministic simulation`; reset returns Pass/Task with details closed. Run unit tests, build, and browser blocked-stage/direct-click/reset checks. Include all three complete text walkthroughs without JavaScript.
- [ ] Commit Agent Team-only files. Completion: retry history remains inspectable after success, security cannot reach delivery, and the final decision is consistent with the stated configuration. Budget/rollback and operator-confirmation scenarios remain follow-ons.

## T07: Agent Config fixture compiler example

**Files:** modify `lib/work/projects/agent-config.ts`; create `app/work/agent-config/page.tsx`, `lib/work/demos/agent-config.ts`, `lib/work/__tests__/agent-config.test.ts`, `components/work/demos/AgentConfigDemo.tsx`. Asset: proposed `public/work/agent-config/overview.webp`.

**Interfaces:** `ConfigState = { variant: 'brief' | 'detailed'; stale: boolean }`, `initialConfig = { variant: 'brief', stale: false }`; `configReducer` accepts `variant` with value, `stale`, `regenerate`, `reset`. `configView(state)` selects a fragment, Claude Code output, Codex output, and each status from two fixed output pairs. Stale means Codex uses the opposite variant; Claude Code remains current.

- [ ] Write tests for both directions, stale→variant changes, repeated regeneration, and Reset:

```ts
const staleBrief = configReducer(initialConfig, { type: 'stale' });
expect(configView(staleBrief).codex.variant).toBe('detailed');
const detailed = configReducer(staleBrief, { type: 'variant', value: 'detailed' });
expect(detailed.stale).toBe(false);
expect(configView(configReducer(detailed, { type: 'stale' })).codex.variant).toBe('brief');
expect(configReducer(detailed, { type: 'reset' })).toEqual(initialConfig);
```

- [ ] Run `npm test -- lib/work/__tests__/agent-config.test.ts`; implement a selector over authored Brief/Detailed fixture pairs. No runtime compiler, editable free-text buffer, filesystem call, or hashing API is needed. Use a harmless formatting preference and purpose-written output excerpts.
- [ ] Build three panels with Brief/Detailed controls, Show stale output, Regenerate example, Reset, Current/Out of date text, and a highlighted differing excerpt. Changing the variant updates the fragment and both outputs atomically and clears stale state. Show `Compiler example · fixture simulation`; add visible `Illustrative outputs` until real sample compiler capture is complete.
- [ ] Prepare two offline output pairs through the real compiler only in a disposable sample workspace under separate capture work; never edit the canonical Agent Config source or run its normal generation against the user's configuration as a website step. Require matching public sample bytes before displaying a stamp. Credit Caleb's compiler/runtime/adapters/integration and imported skills/hooks separately. Run unit tests, build, and browser variant/stale/reset/no-JavaScript checks; review fixture serialization for private fragment paths.
- [ ] Commit Agent Config-only files. Completion: drift/regeneration semantics work with clearly labeled examples. Real compiler capture/stamp verification is a separate evidence gate; review-finding funnel and dated continuity claims stay outside the initial interaction.

## T08: Control Center attention dashboard

**Files:** modify `lib/work/projects/control-center.ts`; create `app/work/control-center/page.tsx`, `lib/work/demos/control-center.ts`, `lib/work/__tests__/control-center.test.ts`, `components/work/demos/ControlCenterDemo.tsx`. Asset: proposed `public/work/control-center/overview.webp`.

**Interfaces:** `CenterState` has `scenario: 'succeeds' | 'fails'`, `phase: 'started' | 'finished'`, `filter: 'all' | 'attention'`, and optional selected `{ kind: 'run' | 'decision' | 'deployment'; id: string }`. `initialCenter` is Succeeds/Started/All/no detail. `centerReducer` accepts `scenario`, `filter`, `select`, `show-result`, `reset`; `centerView` derives visible records, counts, selected detail, frozen ages, spend, and deployments from the fixture and state. Reject unknown IDs.

- [ ] Author two deterministic sample datasets at frozen `2026-09-01T12:00:00Z`. Succeeds contains one recently started run and one resolved decision, becoming a succeeded run. Fails contains that run plus one started run explicitly stale after 60 minutes without an update, and one unresolved decision; the primary run becomes failed. Both contain the same sample-spend and one deployment record with fictional target and SHA. Thus All counts are 1 run/1 decision for Succeeds and 2/1 for Fails. Attention counts are 0/0 for Succeeds, 1/1 for Fails Started, and 2/1 for Fails Finished. Deployment count and sample spend never change when filtering. These are authored examples, not measured operations.
- [ ] Write reducer/selector tests before implementation and run `npm test -- lib/work/__tests__/control-center.test.ts`:

```ts
const attention = centerReducer(initialCenter, { type: 'filter', value: 'attention' });
expect(centerView(attention).counts).toEqual({ runs: 0, decisions: 0 });
const failStart = centerReducer(attention, { type: 'scenario', value: 'fails' });
expect(centerView(failStart).counts).toEqual({ runs: 1, decisions: 1 });
expect(centerView(centerReducer(failStart, { type: 'show-result' })).counts).toEqual({ runs: 2, decisions: 1 });
expect(centerReducer(failStart, { type: 'reset' })).toEqual(initialCenter);
```

Also select a resolved decision in All, apply attention, and assert the detail clears. Scenario changes preserve the chosen filter, reset the run to Started, clear other details, and select the primary run only if it is visible. Reset clears all details and restores All. Selecting a deployment is read-only and shows the unchanged sample record.

- [ ] Implement filter/scenario/detail controls and named Show sample run result, with no generic stepper or approval controls. Filtering derives both counts and lists from the same data. Empty groups have the specified sentence. Source-type labels are text, not fabricated internal links. Frozen ages and the 60-minute example rule are explained; no live timer or `services_down` metric appears.
- [ ] Show `Dashboard example · sample data`, Prototype, and `Implemented dashboard; deployment not verified`. Mark the attention filter as portfolio-demo behavior unless source-backed. Credit Homepage and Healthchecks, and Caleb's aggregator/adapters/run wrapper/configuration/composition. Use readable stacked mobile panels; desktop dark instrument styling stays inside the light page. Run unit tests, build, and browser all/attention, success/failure, selected-hidden, decision/deployment, scenario, reset, and empty-state checks.
- [ ] Commit Control Center-only files. Completion: state and counts match the authored fixture exactly, no sample spend becomes business-outcome copy, and no dashboard deployment claim is inferred from a sample deployment record.

## T09: Work filtering and preserved conversion paths

**Files:** modify `app/work/page.tsx`; create `components/work/WorkFilters.tsx`; integration owner updates `tests/showcase/navigation.spec.ts`. Shared entry/model corrections go through their owner; no independent copy arrays.

**Interfaces:** `WorkPage` awaits `searchParams: Promise<Record<string, string | string[] | undefined>>`. It selects the first render category with T01 normalization, passes only published `ProjectCard[]` to a small `WorkFilters` client boundary, and keeps notes/conversion sections server-rendered outside that boundary. `WorkFilters` derives current category from `useSearchParams`, using `getAll('category')` to distinguish repeated values; it has no independent category state. T01 exports `selectCatalog(category: CategoryFilter, cards: readonly ProjectCard[])` from the client-safe public-content module; its result shape matches `getCatalog`, which first projects server records to cards and delegates to it. Keep server catalog/project imports out of the client module.

- [ ] Write navigation tests for exact ordered slugs/counts, direct URLs, unknown/repeated parameters, reload, back/forward, and featured de-duplication. Use fully approved production data only for the final 7/3/4 gate; development tests may inspect draft routes directly, never count them as published. Test removal of a new project from publication in the pure catalog tests and confirm related links/sitemap omit it.
- [ ] Implement anchors with real hrefs and progressive enhancement. For an unmodified left click only, prevent default and call `window.history.pushState(null, '', href)`. Next 16.1.4's installed App Router patches history updates into URL/search-param state; this was checked in its local source. Preserve stable control keys, `aria-current`, focus on the selected anchor, and one mounted polite count region. Modified-click/new-tab and no-JavaScript behavior remain ordinary links. Example handler:

```tsx
function selectCategory(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.history.pushState(null, '', href);
}
```

Use a Suspense boundary if required by the actual Next rendering mode; its server fallback must render the correct URL-selected list and usable native filter anchors, not an empty spinner. Do not fetch fixture data or mount demos when filtering.

- [ ] Render compact introduction, feature, editorial rows, How I build/Open source/recent notes, client-work positioning and `/results`, then audit/contact with `/tools/ai-readiness`. Keep the current offer/pricing and avoid unsupported client-completion claims. At 1440×900 with chat collapsed the first product visual begins before the bottom of the viewport.
- [ ] Run `npm test -- lib/work/__tests__/catalog.test.ts`, `npm run build`, and `npx playwright test tests/showcase/navigation.spec.ts --project=chromium`. Assert filter focus, count changes, Back/Forward URL/list parity, outside sections remaining available, and native direct GET results with JavaScript disabled.
- [ ] Commit the Work integration. Completion: catalog filtering has one URL owner, all preserved destinations remain reachable, and new draft records cannot become visible links.

## T10: Homepage, How I build, related links, and sitemap

**Files:** modify `components/Proof.tsx`, `app/how-i-build/page.tsx`, `app/sitemap.ts`; integration owner updates `lib/work/catalog.ts`, `lib/work/projects/secondary.ts`, and browser navigation tests as needed. Read `app/page.tsx` only to preserve section order. Project owners supply responsibility fields through their project records.

**Interfaces:** add `getHomeProjects(): ProjectCard[]`, `getMethodProjects(): ProjectRecord[]`, `getRelatedProjects(slug: string): ProjectCard[]`, and `getPublishedCaseStudyPaths(): string[]` in the server catalog. Each filters publication and valid placements/routes. Related lists limit to 1–2 available destinations and drop unresolvable candidates; an empty related list leaves Back to Work and contact intact. Sitemap includes existing legacy routes and only published new case studies, preserving unrelated entries and blog enumeration.

- [ ] Extend catalog tests: setting Agent Team draft removes it from homepage/method/related/sitemap outputs; a missing related slug produces no href; collection/home-only records stay out of case-study paths. The known legacy `/work/vora`, `/work/chapterhq`, `/work/site-assistant`, `/work/open-source` routes stay present. Example invariant:

```ts
expect(getPublishedCaseStudyPaths()).toContain('/work/chapterhq');
const publishedPaths = new Set(getPublishedCaseStudyPaths());
expect(getRelatedProjects('vora').every(p => p.detailRoute && publishedPaths.has(p.detailRoute))).toBe(true);
```

`ProjectCard` contains only the displayed summary/status/media/link fields. Test publication through the resolved route set rather than widening browser DTOs.

- [ ] Replace the Proof array with a Vora visual feature and four compact developer-tool links. Keep ChapterHQ, site assistant, Real Estate Maite (in development, no invented route), and Open source in the secondary group. Reconcile source-backed status/summary once in the record. Update Proof's current blanket claim that all these systems run day to day so it accurately includes Prototype and Developer preview entries. Preserve homepage `id="work"`, existing section order and hero, and add Explore the work→`/work`. Posters and links only; no five mounted demos and at most one eager poster.
- [ ] Add the four ordered responsibility panels to How I build from `how-i-build` placement and project-owned responsibility/evidence references, under “Projects behind my development workflow.” Keep the plain-language method explanation and existing conversion path. Show compact static examples for instructions→Agent Config, review/retry/block→Agent Team, attention queue→Control Center, event/receipt→Prism. No connecting arrows or invented shared runtime. Link to approved detail pages; omit draft-only links without hiding the existing method content.
- [ ] Update sitemap from published path selectors while retaining unrelated entries. Verify homepage anchor/detail links, legacy secondary pages, Back to Work, related links, Open source in every Work view, `/results`, `/tools/ai-readiness`, and `/contact`. Run catalog tests, build, and the navigation browser suite. Check response HTML/RSC/metadata for draft slugs and private identifiers.
- [ ] Commit site integration. Completion: one record owns shared copy/status/evidence, method panels have no separate content array, and sitemap never advertises unfinished routes.

## T11: Reviewed evidence and asset completion

**Files:** project-specific record and media inputs through their designated owners; approved assets under each proposed `public/work/<slug>/` directory. Coordinator alone writes `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-release-checks.md`. This internal record is never imported or copied under public.

- [ ] Review each exact public asset set: visible image/video, underlying fixture, caption, alt, transcript/walkthrough, metadata, public links, downloads, role/credits, and checked date. Reject real logs/customer records, decorative hashes, filenames carrying private data, or source-derived private paths. Preserve actual image ratio or caption the selected crop. Required five overviews are separate from optional recordings/galleries; do not delay useful code work waiting for a live capture.
- [ ] Complete Vora action/isolation evidence, Agent Config two-pair capture or explicit illustrative labeling, and Prism version/public revision/derivation/receipt provenance. Recheck selected public links read-only at implementation time; browser automation never enters accounts or contacts production. Retain Agent Team default/gated settings and Control Center attribution/prototype limitations. Record explicit rights/contribution clearance for each new public asset; never treat upstream public visibility as authorship.
- [ ] Optimize only approved inputs with the existing command, for example `node scripts/optimize-image.mjs /private/tmp/showcase-approved-vora.png public/work/vora/overview.webp 1600`, after confirming that approved input exists. The `/private/tmp/` PNG is a proposed capture artifact, not an existing file. Check output dimensions/metadata with Sharp and byte length with `wc -c`; target ≤250,000 bytes per poster. If a focused crop cannot remain legible, record the measured exception and offer a larger optional gallery image rather than compressing away evidence.
- [ ] Run schema/serialization/fixture tests and manually review their rendered media. Add synthetic poison fixtures only inside tests; do not put them under public. A captured Prism example with replaced identifiers remains derivation `captured` and discloses replacements; contract-derived remains a simulation. Record which immutable public bytes were approved and hash them in the release-check document.
- [ ] Commit only reviewed content/assets. Completion: each project has an explicit code-ready state and evidence-ready/publication state. No dependency is silently marked complete because a page compiles. Asset review alone does not authorize publishing, deployment, or production access.

## T12: Final state, browser, boundary, and performance verification

**Files:** integration owner finishes the five proposed browser specs and `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-release-checks.md`. Correct only failures caused by this implementation within its authorized scope; record unrelated existing failures without hiding them.

- [ ] Run the full `npm test` suite, `npm run build`, then `npx tsc --noEmit` after Next has generated its route types. Run the corrected scoped ESLint command. Record exact commands, exit codes, test counts, build routes, and any baseline failures. Use no production credentials; tests use synthetic values and mocks. If a command fails, classify the cause before retrying; two identical failures require a changed strategy.
- [ ] Run all five browser specs against local development while drafts remain, and against a fresh production build only after the candidate's published records meet evidence gates: `SHOWCASE_SERVER=production npx playwright test tests/showcase --project=chromium`. Use `localhost` consistently. Production mode must reject drafts. A test-server selector must never override application publication flags. Collect failures and traces locally. No proxy/auth relaxation or remote service contact is part of test setup.
- [ ] Exercise the state and access cases in the matrix below, including forbidden transitions and reset from every terminal/intermediate state. Example browser test, using a stable demo region accessible name defined by T04:

```ts
import { test, expect } from '@playwright/test';
test('Vora rejects without displaying a sample delivery', async ({ page }) => {
  await page.goto('/work/vora');
  const demo = page.getByRole('region', { name: 'Vora approval example' });
  await demo.getByRole('button', { name: 'Review proposed action' }).click();
  await demo.getByRole('button', { name: 'Reject example' }).click();
  await expect(demo.getByRole('button', { name: 'Show sample result' })).toHaveCount(0);
  await expect(demo.getByText('No action taken in this example.')).toBeVisible();
  await demo.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Review proposed action' })).toBeVisible();
});
```

Assertions target the active demo region, not the always-present walkthrough that intentionally describes all outcomes. A node-state test cannot substitute for a button/focus test; a screenshot cannot establish a forbidden transition.

- [ ] Inspect production response HTML, RSC payloads, JavaScript chunks, public fixture data, and media/download metadata. Block all unexpected outbound requests before browser tests, record attempted requests even when aborted, and fail on any demo-initiated non-static request, API call, WebSocket/EventSource, provider/messaging/private host/process endpoint, or storage write. Merely leaving chat open must not send a message. The existing site assistant is separate: do not invoke it while asserting demo isolation. If analytics is later authorized, compare exactly the allowlisted fixed payloads; otherwise no instrumentation. Use synthetic private-path/token sentinels in unit tests, not real secrets. Inspect module import graphs for research/private dependencies as well as serialized values.
- [ ] Measure posters and active-demo JavaScript in the production build and record results. A test harness can collect unique JS responses for the same route before enhancement, then after starting/finishing its interaction, sum `gzipSync(body).byteLength`, and report the incremental total. Also account for route-entry chunks imported eagerly: lazy-only measurement is insufficient. Compare to a recorded baseline before adding the demo, using the same browser/build mode and cold cache. Count duplicated shared dependencies once; report the five routes separately. Target additional gzip JS ≤100,000 bytes and poster ≤250,000 bytes. Verify intrinsic sizes, no eager video payload, one primary poster, lazy later images, no other demo modules on homepage/Work/How I build, and legibility at 320px/200% zoom. Record code-ready and publication-ready separately; commit final fixes/check evidence locally and stop before publication.

## Future command sheet and expected results

Run from `/Users/calebbolden/Projects/consulting/calebbolden.com` in a separately authorized implementation session. None of these application checks ran in this documentation phase. Before full publication is possible, browser invocations exclude only explicitly named `@release` tests and report them pending; the final production invocation includes all tests. Draft visibility tests adapt their expected 200-development/404-production status to the selected server mode, not to a website bypass flag.

| Command | When and expected evidence |
|---|---|
| `npm test -- lib/work/__tests__/catalog.test.ts lib/work/__tests__/public-content.test.ts` | T01: initially red for missing behavior, then green on migration/schema/publication contracts. |
| `npm test -- lib/work/__tests__/vora.test.ts lib/work/__tests__/prism.test.ts` | First pair: every terminal, forbidden transition, receipt/back/reset case passes. |
| `npm test -- lib/work/__tests__/agent-team.test.ts lib/work/__tests__/agent-config.test.ts lib/work/__tests__/control-center.test.ts` | Remaining three: scenario guards, retained history, stale/regenerate, filter/count/detail invariants pass. |
| `npm test` | Existing command, required final full Vitest suite including six baseline files and new tests; no skipped showcase verification or contacted service. |
| `npm run build` | Existing Next production build succeeds; route table contains retained pages and new route handlers. Direct HTTP checks separately establish draft 404/published 200. Font fetching may require network because layout uses `next/font/google`; record an environment failure rather than change fonts or claim a passed build. |
| `npx tsc --noEmit` | After build/typegen: no TypeScript errors, including promised App Router search params. |
| `npm run lint -- lib/work components/work components/WorkDetail.tsx components/Proof.tsx app/work app/how-i-build app/sitemap.ts tests/showcase playwright.config.ts` | Proposed corrected ESLint script/config from T03; zero errors on modified scope. Current `next lint` is invalid and cannot satisfy this gate. |
| `npm run dev -- --hostname localhost --port 3100` | Existing development server with explicit local binding. Useful draft checks, not production publication proof. |
| `npx playwright test tests/showcase --project=chromium --grep-invert @release` | Proposed T03 harness; draft/local interaction, access, URL, and boundary checks pass. Tag full-publication counts/provenance checks `@release`; their exclusion here is explicitly reported as pending evidence, not a release attestation. Production final verification runs the entire suite without this exclusion. |
| `SHOWCASE_SERVER=production npx playwright test tests/showcase --project=chromium` | After a fresh build and evidence-ready publication flags: A1–A5 production candidate checks pass. Harness starts `npm run start -- --hostname localhost --port 3100`. No deployment. |
| `curl --fail --max-time 10 http://localhost:3100/work` | Read-only response smoke test; does not replace browser/state tests. Repeat GET for the nine Work/method/contact destinations and homepage; production draft tests assert 404 without `--fail`. |
| `git diff --check` | No whitespace errors. At each local task completion, stage exact files and use `git commit -F /private/tmp/showcase-task-commit.txt` after writing a plain commit-message file. Never push implicitly. |

Browser setup adds a development dependency only during implementation. No existing Playwright test command is claimed. If installation is unavailable, use the installed browser-control tool for a documented manual pass; retain the missing automated regression gate as a limitation instead of claiming equivalent automation.

## Requirement-to-task coverage

Every task inherits Global constraints. Unit tests check data/state rules; browser checks verify actual route controls and rendered boundaries. The matrix covers every numbered spec section and all release acceptance IDs.

| ID / spec requirement | Tasks | Observable verification |
|---|---|---|
| R01 §§1–2 Purpose and five success criteria | T01–T12 | Five titles/summaries/primary visuals explain purpose; every approved flagship has a destination and meaningful workflow; role, maturity, demo type and business meaning precede technical detail. Inspect without private access at desktop/mobile/keyboard/no-JS. |
| R02 §2 Architecture and scope alternatives | T01–T03, T12 | One catalog, shared sections, five bounded local models. No new CMS/runtime backend/terminal/service, no hosted-environment promises. Hero/service/package/client-preview/blog scope stays unchanged. |
| R03 §3 Migration and exact counts | T01, T09, T10 | All ordered `vora, prism, agent-team, agent-config, control-center, chapterhq, site-assistant`; Products `vora, chapterhq, site-assistant`; Developer tools `prism, agent-team, agent-config, control-center`; count 7/3/4 only when all seven ready. Feature extracted once. |
| R04 §3 Secondary routes/placements | T01, T09, T10 | Existing four detail/collection routes respond; Open source stays visible outside all counts; Real Estate Maite remains in-development/home-only; site assistant and ChapterHQ stay discoverable. No invented secondary route or label. |
| R05 §3 URL filters | T01, T09, T12 | All→Products→Developer tools→Back→Forward, deep link/reload, unknown/repeated query, modified click, stable focus/live count, no-JS normal navigation. No component-only category state. |
| R06 §4 Work composition | T02, T09 | Editorial feature/rows with 7/5 feature split and smaller row media, not a uniform dashboard grid. First visual begins within 1440×900 collapsed-chat viewport. Notes/method/Open source/client-work/audit/contact persist across filtering. |
| R07 §4 Entry anatomy | T01, T02, T11 | Poster, 25–45 word summary, role, maturity, detail link; separate gallery button; no nested controls or empty private-source button; no published development placeholder. |
| R08 §5 Detail sequence/copy | T02, T04–T08, T11 | One H1, Back, purpose/role/maturity, primary demo before stack, problem 80–140 words, workflow/outcomes, 2–3 engineering decisions, limits/credits/date, related/back/contact. Narrative 400–700 words. Core labels not hidden in details. |
| R09 §5 Draft/legacy/related boundary | T01, T02, T10, T12 | Production new drafts 404 and absent from HTML/RSC/metadata/sitemap/related hrefs. Vora legacy route remains until rich version ready; ChapterHQ/site assistant retain bodies. Unknown related slug is omitted while Back/contact remains. |
| R10 §5 Shared reset/isolation | T04–T08, T12 | Reset each scenario from intermediate and terminal states; reload starts deterministically; changing scenario clears result/details as defined. No storage/share URLs/network/real operations. Repeated/invalid actions cannot advance. |
| R11 §5 Pattern-specific controls | T03–T08 | Ordered stage controls only on Team/Prism; other controls follow named actions. Active preview/caption/state text stay synchronized; no autoplay; concise status announcements. End-disabled buttons cannot act through keyboard/direct dispatch. |
| R12 §5 Fallback/failure | T02, T03, T12 | First frame and every scenario/terminal walkthrough visible before hydration and with JS disabled. No invisible Reveal content. Chunk/image/video failures preserve meaning; retry/open-image works; no dead controls; dialogs restore focus. |
| R13 §6 Vora branches | T04, T12 | Succeeds and Fails each traverse request→pending→approved→result; pending cannot skip approval; rejection cannot later complete; failed execution never confirms delivery/CRM completion. Outcome changes reset step, Reset restores Succeeds. No generic Previous bypass. |
| R14 §6 Vora evidence/capture limits | T04, T11 | Conditional approval label; selected action and autonomy config checked or conceptual language retained. Capture environment disposable, no production/customer reachability, test/mocked outbound mode recorded. Voice/industry/retrieval/v2 remain follow-on/planned. |
| R15 §7 Team lifecycle | T06, T12 | Five visible stages contain eight internal steps; pass/retry default green-CI legacy automatic merge disclosed at Delivery. QA failure/debugger/pass retained. Security blocks Reviews→QA/Delivery by mouse, keyboard, direct index. Scenario/Reset clears view state without deleting fixture history. |
| R16 §7 Team qualifications | T06, T11 | Separate isolated prompt contexts without promised provider diversity; merge/queue/sandbox/anomaly defaults off, caps unset. Any acted control named. No universal human approval, real merge, budget/rollback/manual-confirmation initial fixtures. |
| R17 §8 Config variants/drift | T07, T12 | Brief/current initial, Detailed/current, Brief stale uses Detailed Codex output and reverse, Claude output stays current, variant change clears stale, regenerate/current, reset/Brief/current. Captured sample stamps match approved bytes or outputs are visibly illustrative. |
| R18 §8 Config attribution | T07, T11 | Compiler/runtime/adapters credited to Caleb; imported skills/hooks credited separately. No browser compiler or private paths/stamps, no undated continuity guarantee or review-funnel feature. |
| R19 §9 Center filters/counts | T08, T12 | Both authored datasets and Started/Finished counts match visible run/decision records; failed/stale/unresolved attention logic uses frozen example time; empty groups readable; sample spend/deployment totals unchanged. Hidden selection clears; scenario resets run/details; Reset returns default. |
| R20 §9 Center inspection/attribution | T08, T11 | Decision source/type/age/explanation read-only, no approve action/internal href; fictional deployment/SHA result. Prototype + deployment-unverified text, sample-spend label, no services_down. Credit Homepage/Healthchecks and authored aggregator layer. |
| R21 §10 Prism progression | T05, T12 | Start, six events in exact pinned order, Next/Previous ends, final-only `3 words`, completion-only receipt, Previous clears final/receipt, Reset unstarts. No native execution. |
| R22 §10 Prism provenance | T05, T11 | Version/public tag-or-commit/derivation/date in public About; public event-type identifiers retained; captured substitutions disclosed; contract-derived simulation correctly labeled; only recorded limits/usage/cleanup fields, no broad safety/sandbox guarantee. Plugin approval/Linux assurance excluded. |
| R23 §11 Homepage | T10, T12 | Original homepage order/hero preserved; Vora poster feature and four compact links; secondary group preserved; Explore the work resolves; no mounted flagship demos or more than one eager image. |
| R24 §11 How I build | T01, T10, T12 | Four responsibility fields/static evidence captions come from same records and link to published cases. Existing method explanation stays; unconnected panels imply no unverified integration. |
| R25 §12 Working wall/reference synthesis | T02, T03, T10 | Required typography/colors/radii/gutters/hairlines/70ch; graph only in margins/intro, authentic dark media inside light page. 16:10 default or source ratio with useful crop caption. Adopt reference composition/control hierarchy, not its copy/assets/numbers/video URLs. No generated visual presented as product evidence. |
| R26 §12 Available width/motion | T03, T12 | Check content 599/600/799/800px including fractional widths, viewport 768 with 360px chat, and restored collapsed state. Legible mobile panels, wrapped controls, no document overflow. 160–240ms state motion, optional reveals ≤400ms, immediate reduced motion; no autoplay/parallax/scroll-required evidence/theme switch. |
| R27 §13 Public schema/publication | T01, T10–T12 | Identity/category/order/placements/status/date/story/evidence/interaction in typed records; no slug-implied route. Strict nested schema and explicit DTO projection reject synthetic private fields; no runtime imports from research or source projects. Publication flags gate all outward surfaces. |
| R28 §13 All assets/claims | T04–T08, T11 | Five reviewed overview posters, complete fixture families/walkthroughs, meaningful alt/caption/dimensions/date. Source replacement plus entire output review; no raw logs/customer data/private URLs. Required inputs missing are explicit evidence dependencies, not false code-completion blockers. |
| R29 §14 Keyboard/reading/media | T03–T08, T12 | Tab/Shift-Tab, Enter/Space appropriate to element, gallery focus trap/Escape/return, native details; text states/4.5:1 required-label contrast/44px controls; native click-to-play video with caption/transcript; no automatic audio. |
| R30 §14 Responsive/failure/loading/budgets | T03, T11, T12 | 320, 390, 768, 1024, 1440px; 200% browser zoom; chat open/collapsed/mobile overlay with reachable collapse/close and restored access; JS off/reduced motion; image/video/chunk failures. Intrinsic dimensions, primary-only eager poster, later lazy media/modules, no eager video; ≤250,000 poster bytes and ≤100,000 added gzip JS or explicit evidence-backed exception. |
| R31 §15 Meaningful checks/analytics | T01, T03, T12 | Full tests/build plus real browser route/state/boundary tests; valid scoped ESLint rather than next lint. No analytics code unless reviewed provider exists; then only five named fixed events/slug/scenario, terminal includes intentional block, no free text. |
| R32 §16 Sequencing/future scope | T01–T12 | Foundation→Vora/Prism→remaining three→homepage/Work/method→final verification. Code/evidence/publication separated. Follow-ons ChapterHQ expansion, Open Brain, launcher, Canton attribution, Bacchus role/rights, voice/industry/knowledge, budget/rollback, continuity and plugin approval remain excluded. |

| Acceptance ID | Tasks and release proof |
|---|---|
| A1 Navigation/content | T01, T02, T09, T10, T12; production 200s for five flagships and every migration route, full lists/counts/order, no duplicates/draft/private link, direct/back/forward filters, retained client/audit/readiness/contact/notes. See R03–R09/R23–R24. |
| A2 Interaction correctness | T04–T08, T12; unit forbidden-transition tests plus actual mouse/keyboard/Reset/scenario sequences. Vora reject/failure, Team retries/block/merge label, Config drift, Center derived counts, Prism completion-only result/receipt. See R10–R22. |
| A3 Evidence integrity | T01, T04–T08, T10–T12; exact approved public asset hashes/provenance/date/role/labels/default controls, no live-data or integration claims. See R14/R16/R18/R20/R22/R27–R28. |
| A4 Presentation/access | T02, T03, T09, T10, T12; specified widths/chat/zoom/motion/keyboard/media/JS-off checks, gallery lifecycle and contact route. See R06–R12/R25–R26/R29–R30. |
| A5 Build/boundaries | T01, T03, T11, T12; full tests/build/typecheck, explicit serialized field boundaries and negative sentinels, asset/capture review, no unexpected demo network or storage effects, measured poster/bundle/loading budgets. See R27–R31. |

## Rollout, recovery, and release gates

1. **Foundation checkpoint:** retain all existing routes and secondary bodies; add model and rich sections behind local development use. Record baseline route responses, statuses, CSS behavior, and route JavaScript bytes before migration. Verify existing tests/build. A failing foundation does not proceed into concurrent flagship writers.
2. **First-pair checkpoint:** validate Vora and Prism before the next three. Draft local pages are reviewable but absent from production links/sitemap. Existing Vora stays reachable via its legacy body until the richer record is approved. Asset/capture work can proceed independently without publishing a draft.
3. **Complete local candidate:** integrate all five plus Work/home/method, reconcile every secondary entry, and collect T11 evidence. Only explicitly approved content becomes `published`; the complete candidate must satisfy exact 7/3/4. This is a local branch/build operation, not public release authority. No private preview cookie/query or production bypass is added.
4. **Verify and recover locally:** run T12 against the fresh candidate. Before publication, failure means restore the last verified task commit with a new reviewed revert commit or leave the rich content draft; do not reset/discard unrelated work. Restore existing Vora's legacy route body if its replacement is withdrawn. After any future public release, a new route must remain reachable as a truthful static case-study fallback when disabling its interactive media; remove invalid related links and repair asset references. Never turn an established public URL into a silent 404 as a rollback. Any real public rollback/deploy requires separate authorization.
5. **Stop at handoff:** report code-ready, evidence-ready, and publication-ready individually with unresolved gates. Required release gates are A1–A5, safe captures/public assets, valid public destinations, truthful attribution/provenance, and independent spec/plan review under functioning infrastructure. Publishing, PRs, merges, deployment, production accounts, customer logs, and live-message verification remain outside this plan's current authority.

Remaining concrete dependencies: repair review infrastructure separately and obtain missing independent evidence; select a supported Vora approval action or retain conceptual wording; prepare public posters; capture compiler sample pairs or visibly retain illustrative output; pin Prism public fixture provenance and recheck destinations; confirm each asset's publication rights. None authorizes customer-data access. No unresolved architecture-changing Critical was reported by the available seats; new independently supported Critical findings stop affected tasks for an exact design decision.

**First implementation task, not started:** T01, public catalog and migration boundary. In a future authorized implementation session, first open this plan and the exact spec revision, confirm the readiness limitation is resolved, and establish the failing catalog/publication tests. This documentation phase ends before that action.
