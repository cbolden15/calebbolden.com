# Project showcase documentation verification

Internal documentation. September 11, 2026. This record concerns specification hardening and planning, including the subsequently authorized runtime repair.

**Current status: correction pass complete and verified. Plan: PROVISIONAL.** User authorized the retained cycle-3 corrections after reviewing the result. The spec and implementation plan now incorporate those changes; document checks and a bounded independent consistency check passed. Application implementation remains unstarted. Cycle 3's `fix-first` result (0 Critical, 7 Important, 1 Minor groups) describes the earlier spec hash. Four reviews and audits completed, but its blind independent review timed out; no new hardening verdict covers these corrections. The generated report remains unchanged at `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.md`. Earlier sections are historical; the approved correction pass at the end is current.

## Scope and baseline

The repository was clean on `main` at `c59e91c`, one commit ahead of `origin/main`. Created `docs/project-showcase-hardening-20260911` from that current main without fetching, pulling, resetting, or discarding work. The coordinator owns all document edits. No application implementation, dependency change, production access, push, merge, deployment, or PR is authorized in this phase.

The source spec is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md`. Its initial SHA-256 is `c217d8f231bf3ef40d1ea76621a3efe34cee5462801592f3d22a2d24071f8997`. Supporting research is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/research/2026-09-11-project-showcase-review.md`.

Read applicable repository and ancestor guidance, the harden skill at `/Users/calebbolden/Projects/agent-config/skills/harden/SKILL.md`, workflow-governance at `/Users/calebbolden/Projects/agent-config/skills/workflow-governance/SKILL.md` and its limits/state references, and writing-plans at `/Users/calebbolden/.codex/plugins/cache/openai-curated/superpowers/d416fd5a/skills/writing-plans/SKILL.md`. The requested plan destination and stop-before-implementation instruction override the planning skill's default destination and execution-choice handoff.

## Governance ledger

One milestone: harden, reconcile, and plan. No separately dispatched child agents. The installed harden runner owns its shared atomic attempt ledger. Four lenses have a nominal maximum of 11 seats including five possible auditors and reconciliation, within the 12-attempt limit. Provider fallback attempts consume the same ledger. Maximum six active children; observed review waves begin with two seats. No attempt-budget override, verification bypass, root expansion, permission weakening, or third-party provider authorization is permitted.

Cycle 1 invokes `/Users/calebbolden/Projects/agent-config/bin/harden` with the exact target and repository, `--lenses DESIGN,FEASIBILITY,SCOPE,SECURITY --third-party deny`. No `--no-verify`. Run ID: `b60179cb-68e3-4def-a311-79b5803ada32`. Outer bound: 900 seconds, with process-group termination and preservation of partial stdout/events on expiry. The target remains unchanged during review. The installed workflow also has per-seat deadlines. At most two remediation cycles are allowed, and any additional run must account for this milestone's consumed attempts.

The governance phase template was rendered to `/private/tmp/project-showcase-phase.md` (2,070 bytes). Its first invocation incorrectly supplied a filename where the renderer expects JSON; using stdin corrected that argument error. This was not a reviewer dispatch. Raw cycle output is retained under `/private/tmp/project-showcase-hardening-20260911/`.

## Source and command inspection

The available CodeGraph tool is `mcp__codegraph__codegraph_explore`; it was used against this repository's existing index. No `ctx_search` tool is available in the current harness. Source inspection, rather than old plan assertions, establishes the following:

| Evidence | Result |
|---|---|
| Public route inventory | Existing `/work`, `/work/vora`, `/work/chapterhq`, `/work/site-assistant`, `/work/open-source`, `/how-i-build`, `/contact`, and homepage found. Four additional flagship detail pages are proposed new files. |
| Shared detail component | `/Users/calebbolden/Projects/consulting/calebbolden.com/components/WorkDetail.tsx` has exactly three current page callers and uses `live/building/running` legacy labels. Richer flagship maturity cannot be passed into that union without an explicit migration. |
| Homepage and catalog | `/Users/calebbolden/Projects/consulting/calebbolden.com/components/Proof.tsx` and `/Users/calebbolden/Projects/consulting/calebbolden.com/app/work/page.tsx` hold separate arrays. Real Estate Maite is homepage-only, in development; Open source is a collection; site assistant also has a homepage paragraph. |
| Responsive layout | `/Users/calebbolden/Projects/consulting/calebbolden.com/app/globals.css` reserves 360px for chat from 768px viewport width, unless `html[data-chat="collapsed"]`. Container width must drive showcase breakpoints. |
| No-JavaScript hazard | `/Users/calebbolden/Projects/consulting/calebbolden.com/components/Reveal.tsx` waits for an effect/IntersectionObserver; `.reveal` starts at opacity zero. Showcase static text must be visible without that enhancement. |
| Installed tools | Read-only version/help checks report Next.js 16.1.4, Vitest 3.2.7, ESLint 9.39.2, TypeScript 5.9.3. Next CLI has no lint subcommand. Installed Next route typing expects promised search parameters. |
| Test configuration | `/Users/calebbolden/Projects/consulting/calebbolden.com/vitest.config.ts` uses Node and `**/*.test.ts`; six current test files were found. No Playwright configuration or ESLint flat configuration was found. |
| Real commands | `/Users/calebbolden/Projects/consulting/calebbolden.com/package.json` defines `test: vitest run`, `build: next build`, `dev: next dev`, `start: next start`, and stale `lint: next lint`. `/Users/calebbolden/Projects/consulting/calebbolden.com/.claude/test-command` says `npm test`. Application tests/build were deliberately not run for this documentation-only phase. |
| Reference existence | All 10 unique literal absolute paths in the original spec and all 66 in research exist. The initial extractor accidentally combined a Markdown link label and destination; excluding brackets corrected the extractor, and no source document required that repair. Existence is not renewed behavioral, rights, or production verification. |

## Initial phase verification

**Documentation status: DONE_WITH_CONCERNS. Plan status: PROVISIONAL.** Supported corrections, all finding dispositions, and the sequenced plan are complete. Missing independent hardening evidence is still a readiness blocker; no website task has started.

The installed workflow exited 0 after 535.4 seconds and returned `fix-first`, 0 Critical, 9 Important, 3 Minor. Design, Scope, and Security succeeded; Feasibility failed after two adapter failures. The independent Codex seat failed with transport errors. Design/Scope/Security auditors could not route: Codex auth unavailable, Claude independence mismatch, third-party denial. `verified: true` means auditing was enabled, not completed successfully. `single_engine: true`; no second provider family contributed. Eight attempts were consumed (four successful, four failed), with at most two active concurrently. No second run or bypass was attempted. The portable command was available, so the skill's command-unavailable legacy fallback does not apply.

| Documentation check | Exact result |
|---|---|
| `python3 /private/tmp/verify-project-showcase-docs.py` | PASS. Five nonempty outputs; 32 existing repository files confirmed; 48 explicitly proposed application files confirmed absent; 91 existing absolute references checked; no unexpected repository writes. |
| Review revision and archive | PASS. Initial `git show c59e91c:docs/superpowers/specs/2026-09-11-project-showcase-design.md` hashes to the captured review SHA. Cycle archive equals the runner's actual `report` string byte for byte. Primary report preserves that exact text before coordinator reconciliation. Corrected spec hash matches the plan and reconciliation. |
| Plan structure/coverage | PASS. T01–T12 present; R01–R32 map all 16 spec sections to tasks and observable checks; A1–A5 each have a separate mapped acceptance row. Nine Important and three Minor groups each have a disposition. No unfinished implementation placeholders or unbalanced Markdown fences. |
| Manual coverage/feasibility pass | Completed as coordinator review, not independent attestation. Checked Vora three-terminal behavior; Team reachability/default merge/history; Config opposite-output drift; Center frozen counts/selection/reset; Prism event/receipt/previous rules. Checked URL-owned filtering, legacy-rich Vora publication distinction, container queries, scoped no-JS visibility, media failure, serialization boundaries, public links, secondary migration, and budget measurement. |
| Current tooling contracts | PASS by source/help inspection. Existing test/build commands and installed versions match the plan. Confirmed promised Next search params, history pushState integration, and ESLint core-web-vitals/TypeScript exports. Playwright/flat lint configuration are expressly proposed new work, not current capabilities. |
| `git diff --check` and `git diff --cached --check` | PASS, no whitespace errors. Staged file list is exactly the five permitted documentation outputs. Read the spec's complete focused diff and reviewed generated-document additions. |
| Application checks | NOT RUN, deliberately: this phase changes documentation only. Actual future full tests, build, typecheck, scoped lint, browser states, asset/privacy inspection, and performance measurement are specified in the plan. |

Initial committed source/plan identifiers (historical, before the runtime follow-up):

| Output | SHA-256 |
|---|---|
| Corrected spec | `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553` |
| Raw cycle-1 report | `19f4f796895da90d61bdf4755a89af1b19f78a57bfffbd9c2fc66ee3bbd41699` |
| Report plus reconciliation | `1d34b63ce8f47a828ee381981841e1f2e7c99005121ce8a1083d3ad9ac4d4277` |
| Implementation plan | `73af8fd87279c1963eda5bb15161069802e94bc240d784df86b34d5996f019a4` |

Source corrections also clarify that the requested showcase H1 scale is a change from current Work detail pages, not an already-existing constant. The accepted design values remain unchanged.

Prevention notes retained in this phase's allowed documentation scope: do not interpret the harden `verified` boolean without auditor outcomes; do not use initially invisible Reveal content as a no-JavaScript fallback; do not treat `next lint` as a valid Next 16 release check; keep an existing route's published entry distinct from a draft replacement body. The wider gotcha registry is outside this phase's allowed edit set and was not changed.

## Follow-up: independent audit routing diagnosis

The follow-up began with a clean website documentation branch at `047e055afe49dcfe990bbda498e6432dd26e94c9`. All supported spec corrections were already committed. No further spec change or review run was made during this diagnosis; the corrected spec hash and provisional plan status remain unchanged.

Read-only inspection of the installed agent-config checkout at `4ab3e27560ad0c846450cf1f4ea2213f350bf804` established a capability mismatch. That checkout has unrelated existing changes, which were preserved.

| Current source evidence | Consequence |
|---|---|
| `/Users/calebbolden/Projects/agent-config/packages/workflow-runtime/src/adapters/codex.ts`: `CodexSdkAdapter.supports` accepts only `tool-free`; `execute` rejects other modes. | Codex cannot execute the required repository-reading auditor, regardless of credential availability. No credentials were inspected. |
| `/Users/calebbolden/Projects/agent-config/packages/workflow-runtime/src/runtime.ts`: `adaptersFor` excludes adapters that do not support the requested permission, and routing receives `authAvailable` from that filtered map. | The recorded `auth-unavailable` reason also covers unsupported permission capability. It is not evidence that login or credential repair is needed. |
| `/Users/calebbolden/Projects/agent-config/packages/workflow-runners/src/harden/workflow.ts`: `auditSeat` requires an independent provider family and the repository read-only profile; `permissionFor` binds roots to the repo and target, allows filesystem-read/search/git-read, and denies network. | With successful Claude reviewers, no Codex read-only adapter, and third-party providers denied, the finding auditors have no eligible route. Repeating the same workflow cannot resolve this structural blocker. |
| `/Users/calebbolden/Projects/agent-config/bin/codex-workflow-runtime` launches the pinned Codex CLI with tool disabling, ignored user configuration/rules, strict configuration, read-only sandboxing, and no approvals. | A repair must preserve the security boundary. Merely enabling shell tools or advertising read-only support would not establish confinement to the declared roots. |

The pinned CLI reports version `0.151.0`; the CLI on PATH reports `0.154.0`. Source inspection shows readiness checks use PATH while execution uses the pinned launcher. This discrepancy is a diagnostic lead, not a proven cause of the two transport failures. The generic transport classification also does not identify a network cause. Feasibility adapter failures remain unresolved. A read-only CLI feature-list probe rejected an exec-only flag before model execution; it supplied no readiness evidence and was not retried unchanged. No additional model attempts were consumed; the shared ledger remains at eight.

The recommended infrastructure repair is a bounded read-only Codex adapter that enforces the declared filesystem roots, command classes, denied network, and provider independence, with meaningful escape/rejection tests and a synthetic end-to-end reviewer smoke test. An alternative would be an explicitly redesigned installed workflow using complete, locally prepared evidence packets and tool-free independent auditors; that changes the evidence contract and requires separate design and verification. Neither option is authorized by the original documentation-only scope. No manual replacement topology, permission bypass, source edit, dependency change, or credential operation was attempted.

Follow-up documentation verification: `python3 /private/tmp/verify-project-showcase-docs.py` passed with five nonempty outputs, 32 existing repository files, 48 proposed application files still absent, 95 existing absolute references, 12 tasks, 32 requirement rows, five acceptance rows, and 12 finding dispositions. Original report bytes and corrected spec/plan hashes remain unchanged. Whitespace checks passed. Only this verification document changed; application tests were not run for documentation-only work.

At this checkpoint, runtime repair had not yet been authorized. The later user instruction resolved that scope decision, as recorded below. The implementation plan still requires the missing review evidence before it can be marked ready. Website implementation remains outside this task.

## Initial handoff

Branch: `docs/project-showcase-hardening-20260911`, based on current main `c59e91c`. Commit the verified five-document set locally with `/private/tmp/project-showcase-docs-commit.txt`; no push, merge, deployment, or PR. The final local commit identifier is reported in the phase completion message rather than embedded recursively in its own commit.

Raw runtime stdout, event ledger, and exit result remain at `/private/tmp/project-showcase-hardening-20260911/`. The durable raw report and reconciliation remain in the repository. No credentials, production accounts, customer logs, deployment hosts, or private captures were inspected for this phase; public asset examples in the plan are synthetic and proposed.

Next readiness action: obtain the missing Feasibility, independent, and auditor evidence through functioning infrastructure without changing the declared permissions or roots. Any new architecture-changing Critical stops dependent work. **First implementation task remains T01, public catalog and migration boundary, not started.** A new session can resume from these documents; it must not mistake provisional planning for implementation or publication authorization.

## Authorized runtime repair and cycle 2

User authorized agent-config runtime repair after the scope question. Runtime repair is locally committed as `0bf7293` on `fix/workflow-readonly-review-20260911`, preserving unrelated changes. The runtime acceptance gate, full tests/typechecks, and three real synthetic provider checks passed. No website implementation or publication is authorized. The earlier scope-decision blocker is resolved; hardening evidence remains pending.

Cycle 2 reviews corrected spec SHA-256 `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553`, recoverable from website commit `0eaffc8`. The original report plus coordinator disposition is preserved at `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-1-reconciled.md`. The original raw cycle-1 archive remains unchanged.

Governance update: carry forward eight cycle-1 attempts and three synthetic provider smoke invocations. A recorded coordinator override permits at most 28 cumulative node/smoke invocations to fund the authorized infrastructure repair and one complete second cycle, with the existing per-run 12-attempt and concurrency limits. Adapter internal turns stay bounded and usage is aggregated. This supersedes the original no-override assumption solely for attempt count. Roots, command classes, sandboxing, provider independence, and third-party denial are unchanged. The second cycle is bounded to 900 seconds with partial output retained under `/private/tmp/project-showcase-hardening-20260911/`. It uses DESIGN,FEASIBILITY,SCOPE,SECURITY with no verification bypass. No third remediation cycle is authorized.

## Cycle-2 outcome and stop

The installed workflow exited 124 at 900.0 seconds, run ID `5d567258-fc8c-4e9c-aefa-0d9d657908fc`. Actual stdout is empty. Ten attempts produced six successful terminal events, three failure events, and one interrupted attempt; peak concurrency was two. Design, Scope, and Security reviews plus all three corresponding independent auditors completed. Feasibility failed first with a Codex timeout, then with Claude Opus and Sonnet adapter-failure codes. The blind independent review started but did not complete. Its audit and reconciliation did not start. There is no cycle-2 result object, so no returned verdict or verified/single_engine/lenses_failed flags can be reported. The primary report is explicitly labeled coordinator recovery, not a generated verdict.

The raw events are preserved byte for byte in `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-2.events.jsonl`. The partial disposition is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-2-partial.md`. It is identical to the current primary report. Cycle 1 raw findings and the complete coordinator reconciliation are separately preserved. Completed cycle-2 finding texts were not emitted before termination; node success alone cannot justify a new correction, refutation, or clean verdict. Therefore no further spec correction was applied.

The shared count is 21 node/smoke invocations, below the recorded override cap of 28. The spec is still exactly SHA-256 `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553`. Two remediation cycles have been used. Stop here; a new review series needs separate authority and a diagnosed Feasibility/checkpoint/run-bound strategy. No third identical attempt, permission bypass, dependency change, application edit, push, merge, deployment, or PR occurred.

## Closing documentation verification

`python3 /private/tmp/verify-project-showcase-final.py`: PASS. Eight nonempty deliverables; 32 existing repository files; 48 proposed application files still absent; 97 existing absolute references; 12 tasks; 32 requirement rows; all five A1–A5 acceptance rows; and all 12 cycle-1 finding dispositions preserved. The original review report and cycle-2 event ledger match their raw captures byte for byte. The current primary report equals the explicit partial archive. Cycle-2 stdout is confirmed empty, its exit is 124, and no result flags are invented.

`git diff --check`: PASS. Reviewed the complete focused plan/spec disposition diff. Only six documentation/report/state files are changed or added in this follow-up; the corrected spec and original raw cycle-1 report are unchanged. Application tests/build remain intentionally not run for website documentation. Runtime code was separately verified with the actual runtime acceptance gate, full 106-runtime/159-runner test pass, 38 final routing regression tests, full typechecks, and three real synthetic provider checks. The two unrelated agent-config files retain their pre-repair hashes.

Final immutable outputs (this verification record excludes its own hash):

| Absolute path | Bytes | SHA-256 |
|---|---:|---|
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md | 46906 | `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553` |
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.md | 6785 | `92a8078dd6f65f962171ac8fc2399dfc8c23dde633539e8ffe6dc839ccebada1` |
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-1.md | 19559 | `19f4f796895da90d61bdf4755a89af1b19f78a57bfffbd9c2fc66ee3bbd41699` |
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-1-reconciled.md | 28570 | `1d34b63ce8f47a828ee381981841e1f2e7c99005121ce8a1083d3ad9ac4d4277` |
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-2-partial.md | 6785 | `92a8078dd6f65f962171ac8fc2399dfc8c23dde633539e8ffe6dc839ccebada1` |
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-2.events.jsonl | 38187 | `8fc929efbbe7a8862a5d1c3cc7b82b092e6e7a2a294bc3628017854e34f4b888` |
| /Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-implementation.md | 77813 | `a13dd8ee20f13aad3a7449b16abe3b9d8b00ecec77b3572afe58736c4ce045b4` |

Final local commits are reported in the completion message after staged-scope verification. Nothing is pushed, merged, deployed, or published. The runtime capability repair is complete; hardening readiness remains limited by the failed/incomplete stages above. **First implementation task remains T01, public catalog and migration boundary, not started.** A separately authorized review series must resolve the missing evidence before marking the plan ready.

## Resumed runtime recovery and verification

User resumed work with parallel subagents. The coordinator verified both
repositories against the handoff, assigned separate Feasibility and deadline
investigations, and used a third agent for independent runtime review.
The local runtime repair is committed as
`c2b97af0ff688b73c1309ad76333802a1f1796de` on
`fix/workflow-readonly-review-20260911`. Its durable record is
/Users/calebbolden/Projects/agent-config/docs/plans/2026-09-11-readonly-review-runtime-repair.md.

The repaired harden runner saves schema-valid outputs before downstream stages,
in private per-run checkpoints outside reviewer roots. A path-only notice
allows recovery after termination. Queueing, schema retries, and provider
fallback now share one execution deadline after provider readiness checks.
Claude's typed terminal failures retain safe diagnostic subreasons. The two
historical generic Claude errors cannot be diagnosed retroactively from the
saved event archive.

Runtime verification passed the actual acceptance gate, full build/typechecks,
116 runtime tests and 162 runner tests, two real synthetic read-only adapter
checks, and a synthetic SIGTERM recovery check. The full suite passed with two
workers after updating downstream timeout assertions and isolating two
Git-heavy test timeouts; no tests were removed or given larger time limits.
Independent review found and verified a queued-deadline correction, then
finished with no unresolved actionable defects. Existing unrelated runtime
files were preserved byte for byte. The carried invocation ledger is 26 of 28.

The corrected spec, provisional implementation plan, primary recovery report,
and both cycle archives retain their previous hashes. This resumption changes
only this website verification record. There is still no new hardening verdict
and no absence-of-Critical claim for cycle 2. T01 remains not started.

The concrete next review option is one separately authorized read-only
invocation against the exact corrected spec, with the installed four lenses,
independent audits, third-party denial, a 12-attempt cap, retained checkpoints,
and an outer 1,800-second bound. The current two-wave critical path can consume
1,620 seconds, so 900 seconds cannot promise completion. A resumable stage
machine with reserved finalization capacity is the fuller architectural option
if the 900-second bound must remain; it has not been implemented. No third
review cycle, application edit, push, merge, PR, or deployment occurred.

Resumed documentation verification: PASS. Eight nonempty outputs, 32 existing
repository files, all 48 proposed application files still absent, 98 existing
absolute references, 12 tasks, 32 requirement rows, five acceptance rows, and
12 finding dispositions. Cycle archives still match the original captures.
Whitespace and single-file website scope checks passed. Application tests
remain intentionally unrun for this documentation-only website change.

## Explicitly approved third read-only review

User approved one additional read-only hardening invocation with a 30-minute
outer cap after the repaired runtime milestone. This is a one-time override of
the two-cycle limit, not permission for further remediation or implementation.
The installed runner at runtime commit `c2b97af` owns all reviewer dispatch:
DESIGN, FEASIBILITY, SCOPE, SECURITY, independent review, enabled audits, and
third-party denial. No manual replacement topology or additional helper agents
are dispatched for this invocation.

The corrected spec remains SHA-256
`3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553`.
The shared ledger carries forward 26 invocations and reserves at most 12 for
this explicitly authorized run, raising the cumulative ceiling to 38 solely
for that purpose. Existing runtime attempt/concurrency limits and permission
profiles remain enforced. The prior reports and event captures are preserved.

The supervisor enforces 1,800 seconds and captures stdout, event JSONL, exit
status, and the announced private checkpoint. A changed target or expired
outer deadline stops the invocation. Finding text stays outside reviewer
roots until every child has stopped. Stop after the result or interruption;
no automatic retry, target edit, new runtime repair, or T01 execution follows.
Current run state: completed, with the coverage limitation recorded below.

### Third-run outcome

Run ID `1da28b04-0eca-4390-b3a6-64ede243783d` exited 0 after 874.95 seconds
(14 minutes 35 seconds), within the 1,800-second cap. The spec remained
unchanged. Eleven attempts produced nine successes and two failures, with
peak concurrency two and no interrupted attempts. The carried total is 37
of the explicitly expanded 38-invocation ceiling.

| Stage | Outcome |
|---|---|
| Design and independent finding audit | Codex review completed in 218.536 s; Claude audit completed in 50.491 s. |
| Feasibility and independent finding audit | Codex review completed in 128.659 s; Claude audit completed in 25.383 s. The previously missing Feasibility evidence is now available. |
| Scope and independent finding audit | Codex review completed in 99.531 s; Claude audit completed in 67.279 s. |
| Security and independent finding audit | Codex review completed in 213.342 s; Claude audit completed in 52.628 s. |
| Blind independent review | Claude timed out after 302.025 s including shutdown. It supplied no findings, and its audit did not run. |
| Reconciliation | Codex failed with `transport` after 3.253 s; the allowed Claude fallback completed in 33.222 s. The generic transport event does not establish a cause. |

Actual result: `verdict: fix-first`, `critical: 0`, `important: 7`, `minor: 1`,
`verified: true`, `single_engine: true`, `lenses_failed: []`. Here `verified`
is supported by four successful independent finding audits, not just an enabled
flag. All four primary reviewers used Codex; Claude audited them but did not
complete its blind review. That distinction explains the single-engine flag
and prevents treating the result as a complete independent READY attestation.

The checkpoint is complete as a recovery artifact and holds ten final node
outcomes: four reviews, four audits, the blind-review failure, and successful
reconciliation. Individual provider failures remain in the event ledger. Its
complete status means the workflow produced its result; it does not mean the
spec is ready. The exact report, JSON result, event ledger, checkpoint, and exit
record are archived beside the spec with `.hardening.cycle-3` suffixes. The
primary report equals the returned report string byte for byte.

### Retained fix list and limits

The generated result groups ten retained source findings into eight groups.
Its public-destination group also contains Feasibility's distinct legacy-schema
finding; its recovery group also contains Scope's custom-retry finding. Preserve
those member requirements when applying fixes; the report prints a representative
finding for each group. The raw checkpoint preserves every source finding and
audit verdict.

| Group | Required correction before reconsidering readiness |
|---|---|
| Important: Vora route cutover | Define the legacy, rich-draft-with-legacy-fallback, and rich-published route states, including rollback and route checks. |
| Important: published destinations and legacy schema | Require valid destinations for published case studies. Separate rich flagship records from retained legacy records so ChapterHQ and the site assistant do not require invented flagship demos. |
| Important: fixture provenance | Bind review metadata to a fixture revision or digest, and invalidate that attestation when its bytes change. |
| Important: enhancement recovery | Put recovery outside the failing demo module. A native reload/direct approved asset path can satisfy recovery without a custom retry subsystem. |
| Important: gallery scope | Make gallery implementation and acceptance conditional on reviewed gallery assets actually being included, or explicitly defer it. |
| Important: draft assets | Keep unapproved assets outside the production public tree. Enforce an approved-asset manifest and check direct asset URLs and bundles. |
| Important: active media formats | Restrict media destinations to verified inert formats; reject executable content or isolate it under a separate explicitly reviewed delivery policy. |
| Minor: surface-specific data | Keep full records on the server and send only the fields required by each card, related link, or case-study view. |

The Scope auditor concretely refuted the analytics-workstream and forced-word-count
findings. They are recorded in `killed_by_audit`; do not reintroduce them as required
changes.

Coordinator comparison, not a new independent verdict: T01 already specifies a
separate optional rich case-study body, published-destination validation, Vora's
legacy fallback, and card DTO projection. Those details can inform surgical spec
alignment; they do not change what this spec-only review attests. Neither the
spec nor the implementation plan was edited. No reported finding was applied or
silently dismissed after the run.

The next work is a separately scoped correction pass against the retained findings,
followed by an explicitly bounded decision on any further independent review.
This one-time third-run authorization is exhausted. T01 remains not started;
no fourth invocation, runtime repair, application edit, push, merge, PR, or
deployment followed this run.

### Final archive verification

Documentation and evidence checks passed: 13 nonempty outputs, 98 existing
absolute references, 12 plan tasks, 32 requirement rows, five acceptance rows,
and 12 historical finding dispositions. All five cycle-3 archives match their
private captures exactly. The spec, provisional plan, and prior-cycle archives
match their pre-run bytes. The event ledger accounts for all 11 attempts with
no unfinished child; checkpoint records account for four reviews, four audits,
the independent timeout, and reconciliation. Twelve source findings minus two
auditor refutations yield ten retained findings in eight distinct groups.

The first scratch verifier incorrectly expected the checkpoint's result pointer
to contain the full CLI result. The checkpoint contract stores only verdict and
report path there, with node findings in separate records. Correcting that
verification assumption produced a passing check; runtime code was unchanged.
Whitespace and seven-file documentation scope checks passed. The 48 proposed
application files remain absent. Application tests were not run for this
documentation-only milestone. Runtime HEAD and both unrelated local runtime
edits retain their recorded hashes.

## Approved correction pass

User instructed “please proceed with your changes” after the retained fix list.
This milestone updates the spec and plan, verifies their agreement, and records
the result. It does not execute T01 or start another hardening invocation.
The coordinator owns the spec, this record, gotcha capture, and integration.
A worker owns only the implementation plan; a second worker checks the final
documents without editing them. The new milestone allows two workers, no nested
dispatches. The prior 37 review/repair invocations remain historical and their
one-time review override remains exhausted.

| Cycle-3 group | Applied document correction and planned behavioral verification |
|---|---|
| Important: Vora route cutover | Spec section 5 defines Legacy, Rich draft with legacy fallback, and Rich published, derived from one record revision. Plan T01/T02/T04/T12 cover route/body/metadata/link agreement and rollback, including rich-only assets. |
| Important: destinations and legacy schema | Spec section 13 distinguishes rich flagship bodies from legacy secondary records and requires resolvable published destinations. T01 validates the graph and accepts ChapterHQ/site-assistant records without fabricated demo fields. This preserves the merged Feasibility member. |
| Important: fixture provenance | A separate reviewed manifest binds every example's fixture and asset bytes to SHA-256, date, derivation, and disclosure. T01/T03/T04–T08/T11/T12 reject a changed sample under an unchanged attestation and never auto-approve digests during a build. |
| Important: enhancement recovery | Spec section 5 assigns static content and a native page-reload link to the server shell outside the lazy demo. T02/T03/T12 block module and media loads separately and check that recovery does not depend on failed JavaScript. No custom retry subsystem is required; this preserves the merged Scope member. |
| Important: gallery scope | Galleries are deferred because no initial asset inventory requires them. Spec sections 4/5/12–16 and plan T03/T12 use posters, readable crops, and optional approved raster links; future gallery acceptance is conditional on separately scoped assets. |
| Important: draft assets | Spec section 13 and plan T01/T03/T11/T12 require an exact manifest-approved showcase asset tree, reject draft-only/unlisted/stale files, and verify direct URLs and browser payloads. Unreviewed captures stay outside website build inputs. Page 404s are not asset protection. |
| Important: active media formats | The same gate checks allowed raster/video extension, decoded signature, digest, and MIME. Native image links cannot target HTML/SVG/XML or arbitrary JSON documents. T03/T11/T12 add negative content-type and direct-link checks; unrelated preview rules remain outside this gate. |
| Minor: per-surface projections | Spec sections 3/13/14 and plan T01/T09/T10/T12 project card/related/homepage fields from one server source; only a detail page receives its selected example. Payload tests exclude other narratives and fixtures. |

The analytics-workstream and mandatory narrative-quota findings stay refuted.
The 400–700-word narrative range remains a target, and analytics remains
conditional on an already reviewed provider. Neither becomes a new release gate.

The primary report and all cycle archives preserve their original bytes. The
reviewed spec hash was `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553`;
it must not be relabeled as the hash of this correction. Current document hashes
and the actual consistency-check result are recorded below.

Current corrected spec SHA-256: `c4dc3707042ecdc575768284a80740c9fd06ef242ceea80e6382c8d8113599d3`.
Current corrected plan SHA-256: `02ec995c64f77cee54ad9164cebd78c028317ee792aeee817cb8a6e21b797cb7`.

### Final correction verification

The plan worker completed the aligned task, ownership, command, traceability,
and acceptance updates. The independent consistency worker initially found two
remaining contradictions: Control Center's reducer had no fixture input for
ID/visibility-dependent transitions, and unconditional snapshot verification
blocked permitted synthetic local previews before production approval.

The coordinator corrected both. T08 now passes the projected fixture explicitly
through reducer calls and tests unknown IDs, hidden selections, and primary-run
selection. The spec and T01/T05 separate strict local fixture-content validation
from production attestation, with distinct draft/published bodies and an explicit
local-synthetic provenance state. A paired check requires a draft to work locally
with an empty manifest while still resolving to production 404 or Vora's legacy
fallback. Existing attestations and public-asset checks remain strict.

The same reviewer performed one targeted follow-up on the exact final hashes
above and returned PASS, with no unresolved inconsistency in the bounded scope.
This validates the correction pass, not a new hardening or READY verdict. The
milestone used two workers and one targeted follow-up; no nested dispatch or
additional harden invocation occurred.

Documentation verification passed: 14 nonempty tracked outputs, all ten historical
review/report artifacts byte-identical to commit `4f6df31`, 98 existing absolute
references, 12 tasks, 32 requirement rows, five acceptance rows, and balanced
fences. The spec hash in the plan and both hashes in this record match the files.
All 58 checked proposed/deferred application paths remain absent. Whitespace and
four-document scope checks passed. Runtime HEAD and unrelated runtime edits are
unchanged. Application tests/build were not run because this pass changed only
documents; implementation commands and loader/decoder validation remain future
work. T01 has not started.
