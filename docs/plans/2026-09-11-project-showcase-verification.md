# Project showcase documentation verification

Internal documentation. September 11, 2026. This record concerns specification hardening and planning only.

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

## Final checks

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

Final immutable source/plan identifiers (verification record excluded from its own hash list):

| Output | SHA-256 |
|---|---|
| Corrected spec | `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553` |
| Raw cycle-1 report | `19f4f796895da90d61bdf4755a89af1b19f78a57bfffbd9c2fc66ee3bbd41699` |
| Report plus reconciliation | `1d34b63ce8f47a828ee381981841e1f2e7c99005121ce8a1083d3ad9ac4d4277` |
| Implementation plan | `73af8fd87279c1963eda5bb15161069802e94bc240d784df86b34d5996f019a4` |

Source corrections also clarify that the requested showcase H1 scale is a change from current Work detail pages, not an already-existing constant. The accepted design values remain unchanged.

Prevention notes retained in this phase's allowed documentation scope: do not interpret the harden `verified` boolean without auditor outcomes; do not use initially invisible Reveal content as a no-JavaScript fallback; do not treat `next lint` as a valid Next 16 release check; keep an existing route's published entry distinct from a draft replacement body. The wider gotcha registry is outside this phase's allowed edit set and was not changed.

## Handoff

Branch: `docs/project-showcase-hardening-20260911`, based on current main `c59e91c`. Commit the verified five-document set locally with `/private/tmp/project-showcase-docs-commit.txt`; no push, merge, deployment, or PR. The final local commit identifier is reported in the phase completion message rather than embedded recursively in its own commit.

Raw runtime stdout, event ledger, and exit result remain at `/private/tmp/project-showcase-hardening-20260911/`. The durable raw report and reconciliation remain in the repository. No credentials, production accounts, customer logs, deployment hosts, or private captures were inspected for this phase; public asset examples in the plan are synthetic and proposed.

Next readiness action: obtain the missing Feasibility, independent, and auditor evidence through functioning infrastructure without changing the declared permissions or roots. Any new architecture-changing Critical stops dependent work. **First implementation task remains T01, public catalog and migration boundary, not started.** A new session can resume from these documents; it must not mistake provisional planning for implementation or publication authorization.
