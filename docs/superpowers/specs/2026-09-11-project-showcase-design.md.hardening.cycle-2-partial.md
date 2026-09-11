# Project showcase hardening: cycle 2 partial disposition

**Status: INCOMPLETE. Plan: PROVISIONAL. No cycle-2 verdict was emitted.** This document is a coordinator recovery record derived from the actual event ledger and outer-run result. It is not a generated hardening verdict or an independent attestation.

## Reviewed revision and runtime

Target: `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md`.

Cycle 2 ran against SHA-256 `3d5be73004e60931083ee486f86645335292addd8f67735bc0ca3d18f348d553`, recoverable from website commit `0eaffc8`. The spec remained unchanged throughout the run and afterward. Runtime source matched local agent-config commit `0bf7293`, branch `fix/workflow-readonly-review-20260911`.

The installed `/Users/calebbolden/Projects/agent-config/bin/harden` entry point ran with the original target/repo, `--lenses DESIGN,FEASIBILITY,SCOPE,SECURITY --third-party deny`. No verification bypass, provider-independence exception, root expansion, sandbox change, or hook-trust change was used. Reviewers were read-only or tool-free; the coordinator owns all edits.

Run ID: `5d567258-fc8c-4e9c-aefa-0d9d657908fc`. The outer bound expired after **900.0 seconds**, returning **exit 124** and terminating the process group. The harden parent exited. Standard output is **0 bytes**, so there is no JSON result or final generated report to inspect for this cycle.

## Actual stage evidence

| Stage | Provider | Actual result |
|---|---|---|
| Design | Codex gpt-5.6-sol, read-only | Completed, 207.147 seconds. |
| Design finding audit | Claude Opus 5, read-only | Completed, 57.796 seconds. |
| Feasibility, first attempt | Codex gpt-5.6-sol, read-only | Failed: timeout, 300.010 seconds. |
| Feasibility, first fallback | Claude Opus 5, read-only | Failed: adapter-failure, 66.806 seconds. |
| Feasibility, second fallback | Claude Sonnet 5, read-only | Failed: adapter-failure, 250.759 seconds. No Feasibility result or audit. |
| Scope | Codex gpt-5.6-sol, tool-free | Completed, 150.158 seconds. |
| Scope finding audit | Claude Opus 5, read-only | Completed, 64.679 seconds. |
| Security | Codex gpt-5.6-sol, read-only | Completed, 225.507 seconds. |
| Security finding audit | Claude Opus 5, read-only | Completed, 23.731 seconds. |
| Blind independent review | Claude Opus 5, tool-free | Started; interrupted by the outer bound. No terminal event. |
| Independent finding audit and reconciliation | Not started | No result; no final findings or verdict. |

The ledger has 120 events and 10 attempts: six successes, three failures, and one interrupted attempt. Peak active attempts: two. The shared milestone total is 21 node/smoke invocations: eight in cycle 1, three synthetic provider checks, and ten in cycle 2, within the documented coordinator override of 28. Internal adapter turns are bounded separately and their usage is aggregated in the node receipt.

The successful audit events prove those nodes completed their structured calls. They do not disclose whether individual findings were upheld or refuted. The runner writes the findings report only after reconciliation, so the completed finding texts were not emitted before termination. No new finding is invented, applied, or dismissed on the basis of an event alone.

## Flags and honest verdict

| Result field | Cycle-2 disposition |
|---|---|
| `verdict`, `critical`, `important`, `minor` | Unavailable. No result was emitted. Absence of findings output cannot establish absence of Criticals. |
| `verified` | Unavailable as a returned flag. Verification was requested, and three finding auditors completed. The cycle is incomplete. |
| `single_engine` | Unavailable as a returned flag. Review/audit events involve OpenAI and Anthropic, but the blind independent review did not complete. |
| `lenses_failed` | No returned array. The event ledger establishes Feasibility failed all three attempts. |

The last completed workflow verdict remains cycle 1's **fix-first**, with 0 Critical, 9 Important, 3 Minor, `verified: true`, `single_engine: true`, and `lenses_failed: [FEASIBILITY]`. In that cycle, `verified: true` only meant auditors were enabled; none succeeded. That report reviewed the earlier SHA-256 `c217d8f231bf3ef40d1ea76621a3efe34cee5462801592f3d22a2d24071f8997`, not the current spec bytes.

Cycle 1's nine Important and three Minor finding groups each retain their applied or concretely refuted disposition. Supported corrections addressed placement/publication boundaries, URL-owned filters, preserved conversion routes, container width, safe Vora capture, strict public data fields, and per-demo interactions. No unsupported scope reduction or maturity relabeling was applied.

## Preserved evidence and next gate

The exact cycle-1 raw report is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-1.md`.

The exact prior report plus coordinator reconciliation is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-1-reconciled.md`.

The exact cycle-2 event ledger is `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.cycle-2.events.jsonl`, SHA-256 `8fc929efbbe7a8862a5d1c3cc7b82b092e6e7a2a294bc3628017854e34f4b888`.

Raw stdout, events, and the exit result remain under `/private/tmp/project-showcase-hardening-20260911/`. The empty stdout is a recorded failure artifact, not a completed deliverable. This partial disposition is also saved at the expected primary report path, `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/superpowers/specs/2026-09-11-project-showcase-design.md.hardening.md`.

The original adapter-capability blocker is repaired and tested. Remaining review limitations are Feasibility failure, interrupted blind review, missing reconciliation/verdict, and missing durable intermediate finding text. The generic Claude adapter-failure codes do not establish a specific cause. A future, separately authorized review series needs diagnosis and a bounded run/checkpoint strategy that preserves completed findings. The two allowed remediation cycles are used; no third cycle starts here.

The implementation plan remains `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-implementation.md`, **PROVISIONAL**. Its code tasks and A1–A5 coverage remain useful, but it cannot be marked ready without the missing evidence. No architecture-changing Critical decision can be inferred from this partial output. **First implementation task: T01, public catalog and migration boundary. Not started.**
