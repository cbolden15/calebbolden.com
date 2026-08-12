# LSS ↔ AI implementation: the correlation map

Working document, 2026-08-11. Seed for Caleb's AI implementation framework. Sources:
12 transcribed videos (`~/Brain/social-content/Business & Marketing/General/2026-08-11*`),
enterprise digests (session scratchpad), Caleb's delivery record (work-brain
`pages/career/`).

## The central correlation (thesis)

Lean Six Sigma exists to make unreliable processes reliable. Enterprise AI fails for
process-reliability reasons, not model reasons — that's the one claim every credible
source in the batch agrees on:

- AWS re:Invent: ~95% of AI initiatives fail because they bolt AI onto unchanged processes; the successes reimagine the process.
- Box CTO: companies don't have an AI problem, they have a data/access-governance problem.
- Netflix/JPMorgan/Goldman talk: failures are operationalization failures, not model failures.
- TransformationX: AI doesn't fix process chaos, it amplifies it; AI value is capped by process clarity.

So the framework's direction is **LSS-for-AI**: the discipline wrapped around AI
implementations. AI-for-LSS (agents generating SIPOCs, 10-day DMAIC) is a tooling
accelerant inside it, not the frame.

## Concept-level correlations

| LSS concept | Classical meaning | AI implementation counterpart | Caleb's lived evidence |
|---|---|---|---|
| Voice of Customer / CTQ | Translate needs into measurable critical-to-quality specs | Define "good output" as measurable acceptance criteria BEFORE building; no use case enters the pipeline without them | Vora: scoped with stakeholders, success metrics up front; Blockdaemon launch success criteria + adoption metrics |
| Gemba walk / value-stream mapping | Go see the real process; map value vs waste end to end | Observe the actual workflow (process mining, shadowing) before automating; redesign, don't bolt on (the AWS 95% point) | 29% node-delivery reduction via LSS process mapping; value-stream mapping at U.S. Bank |
| 8 wastes | Transport, inventory, motion, waiting, overproduction, overprocessing, defects, skills | AI-era remap: manual data movement, dark data lakes, context switching, waiting on approvals/GPU/labels, POCs that never ship, LLMs doing regex work, model drift, experts doing data janitor work | Jira migration killing duplicated systems; automation of cross-functional handoffs |
| 5S | Sort, set in order, shine, standardize, sustain the workplace | Data readiness: inventory, clean, govern, and access-control data before any agent touches it (Box CTO's point, GE Healthcare's calibration-before-training case) | Multi-tenant data layer with strict org-scoped isolation at every query path |
| **Jidoka** (autonomation) | Machine detects abnormality, stops itself, human intervenes | Human-in-the-loop agent design: escalation paths, andon cord = the agent's escalation trigger; autonomy WITH a stop condition | Vora HITL escalation paths; Smart Routing detects unhealthy nodes and reroutes (19–32% incident reduction) |
| **Poka-yoke** (mistake-proofing) | Design the process so the error is impossible | Guardrails: approval gates on destructive actions, idempotency keys, charge-after-success billing | Vora's AiOutcome gate is literally poka-yoke — agents cannot bill for failed work |
| Standard work | Documented best-known method, versioned | Versioned prompts, agent SOPs, eval suites as the executable spec; failure modes documented | Gotcha registries encoding failure modes; Blockdaemon documentation program |
| **SPC / control charts** | Monitor variation, catch special causes early | Sample-based eval scoring makes stochastic outputs chartable: eval pass-rate over time IS the control chart; drift detection; canary (1%) and shadow deploys as controlled experiments | Evals against operational ground truth; Grafana/Looker SLA observability layer |
| Defect / DPMO | Out-of-spec output rate | Eval failure rate per N sampled outputs against ground truth (never literal 3.4-per-million; the spec limit is the eval rubric) | Vora eval pipelines; refund logic for failed tool calls |
| 5 whys / root cause | Find cause, not symptom | Failure taxonomy for agents: was it prompt, retrieval, tool, data, or model? File it, don't re-diagnose | Gotcha registries — institutionalized root-cause memory |
| Kaizen / PDCA | Continuous small improvements | Short eval-driven iteration loops; this is where AI-accelerated DMAIC (weeks, not months) is genuinely true | Consulting engagements feeding back into Vora vertical configs |
| Cost of poor quality | Quantify defects in dollars | Incident-vs-revenue and ROI casing that survives CFO scrutiny; kill switches for negative-ROI systems | API-sunset analysis (40%+ of incidents vs 6% of revenue); TBM across $850M IT spend |
| Respect for people / skills waste | Underutilized human potential is waste | Adoption and redeployment: Jevons paradox says freed capacity meets expanded demand — reinvest hours, don't cut heads (IBM); adoption tactics close the deploy-vs-use gap (Duke) | AI transformation program at Blockdaemon; 50% onboarding cut; training non-technical users since TSYS |
| DMAIC | Improvement project lifecycle | The AI use-case lifecycle: Define (intake + prioritization — customer-facing/supporting/backend × buy-vs-build), Measure (baseline the HUMAN process first), Analyze (where AI actually helps), Improve (pilot via canary/shadow), Control (evals, drift monitoring, governance) | The whole delivery record, end to end |

## The three correlations to build the framework around

These are differentiated — none of the 12 videos went past DMAIC surface language:

1. **Jidoka → human-in-the-loop.** Toyota's own answer to "how much autonomy do you give the machine": full speed until abnormality, then stop and summon a human. This is the exact design question for agents, and the andon-cord metaphor gives partners a 100-year-old, board-safe way to understand HITL escalation.
2. **Poka-yoke → guardrails.** Approval gates, idempotency, charge-after-success. Mistake-proofing beats mistake-detecting; a gate that makes the bad action impossible outranks a monitor that reports it. Caleb has production receipts.
3. **SPC → evals.** The honest answer to "Six Sigma assumes deterministic processes and AI isn't one": you don't chart individual outputs, you chart the *eval pass-rate of sampled outputs over time*. Variation becomes manageable the way LSS always managed it — statistically. Drift is a special cause. Canary/shadow are controlled experiments. This also answers the PCAOB precedent: vendor SOC 2 is not validation; your own control chart is.

## Corrections LSS needs to survive contact with AI (the framework's honesty section)

- **Control means containment, not prevention.** Classical Six Sigma reduces variation toward zero. LLM variation is irreducible by design; the framework contains it (gates, sampling, escalation) rather than pretending to eliminate it.
- **Measure the human baseline first.** Most AI pilots die because nobody measured the pre-AI process, so improvement is unprovable. Measure-phase discipline is the cheapest fix for the "95% fail" number.
- **"Should this process exist?" precedes "improve it."** Process intelligence over process optimization (TransformationX) — automating a process that shouldn't exist is the biggest overprocessing waste of all.

## What to throw away (do not carry into the framework)

- Sigma-level literalism (3.4 DPMO) and belt hierarchy — cargo cult for this domain.
- The unsourced stats: 87% ML failure, 27%→87% success jump, 8–12x ROI, 10-day DMAIC. Use "most enterprise AI initiatives fail to reach production (multiple industry studies)" and cite real sources when needed; never quote the cert-shop numbers.
- "AI will run DMAIC autonomously" — demo-ware framing that undercuts the governance story a COO is buying.

## Value stream mapping: the framework's spine

VSM is not one tool among many — it is the central artifact. Define and Measure operate
on it; gates and evals are drawn on it; the ROI case is read off it.

Four jobs:

1. **Use-case discovery (Define).** Map first; candidates fall out of wait states, handoffs, rework loops. Ordering rule: **eliminate → simplify → automate.** Automating waste produces waste faster — the lean mechanism behind "AI amplifies process chaos."
2. **Baseline (Measure).** Current-state map with cycle/touch/wait times and error rates per step = the pre-AI baseline that makes improvement provable. (The 29% Blockdaemon node-delivery win was exactly this: map → bottleneck → automate handoffs.)
3. **AI placement (future state).** Five dispositions per step: eliminate | keep human | automate deterministically (rules/OCR — no LLMs for regex work) | AI/agent | gate (jidoka/poka-yoke). Gates are drawn on the map because approval gates create new review queues, and unmapped review queues become the new bottleneck.
4. **Honest ROI.** Touch time vs lead time. AI pitches count labor minutes; the map usually shows the bigger win is lead-time collapse — the number customers feel and COOs can board.

Three AI-era additions to the classical map:

- **Data lane** — data availability/quality/access per step (Box CTO's governance problem, made visible on one page). A step can be automatable and still blocked by dark/siloed/ungoverned data.
- **Eval checkpoint at every AI step** — sampling point + pass-rate threshold (the SPC anchor, drawn on the map).
- **Retry/rework loop as first-class flow** — eval failure → retry → escalate is a rework loop; lean has always priced rework loops.

Worked example (CohnReznick proposal/RFP gen): current state ~2 weeks lead / ~12 hrs
touch (3-day inbox wait, 4-hr prior-proposal mining, 6-hr draft, 2-day review wait).
Future state: retrieval agent for mining, LLM drafts from the prior-proposal corpus
(data lane: is the corpus accessible/governed?), partner review kept human as the jidoka
gate, eval checkpoint samples drafts against a win-themes rubric. Lead ~3 days; partner
judgment untouched.

Modern accelerant: process mining (current-state map auto-generated from Jira/ticket/CRM
event logs) — the legitimate core of the "AI accelerates DMAIC" claim. AI draws the map
faster; the decisions on the map stay disciplined and human.

## Resolved (2026-08-11, CohnReznick lens)

1. **Pitch structure: SPC-evals leads, jidoka is the partner adoption story, poka-yoke is the receipts.** Rationale: sampling-based assurance pitched to a sampling-based-assurance firm; directly answers the PCAOB independent-validation precedent; carries a growth story (internal AI validation muscle → sellable AI assurance service line). Jidoka/andon = the emotional pitch for billable-hour partner fear; AiOutcome gate = production proof.
2. **Belt answer** (verified: resume lists LSS as methodology, never claims a belt):
   "None — I've been deliberate about never claiming a certification I don't hold; my
   resume lists it as a methodology I practice. I learned it by doing it: the 29%
   node-delivery and 50% onboarding reductions at Blockdaemon came from value-stream
   mapping and bottleneck analysis I led. If a belt matters for client-facing
   credibility here, I'll formalize it quickly — the practice already exists, only the
   certificate is missing."
3. **Adoption = parallel track across the whole lifecycle**, not a phase. Duke: adoption transforms, not technology. LSS grounding: eighth waste (skills) + respect for people. Jevons = the redeployment story (freed hours → advisory expansion, not headcount cuts) — the only efficiency framing that doesn't terrify a partnership.
4. **Naming direction:** considered assurance vocabulary (candidates included "AI Assurance Loop"; phases Map → Gate → Chart) and mapping vocabulary. Avoided "Sigma"/"DMAIC" in the name — invites the credential question on bad terms. Final name: Charted, decided 2026-08-11.

## AutoResearch → auto-kaizen (added 2026-08-11)

Karpathy's AutoResearch (2026-03, github.com/karpathy/autoresearch): an agent edits one
bounded file, runs an experiment, keeps the change only if it beats the current best on
one held-out validation metric. Principles mapped into the framework:

| AutoResearch principle | Charted counterpart |
|---|---|
| One held-out metric decides survival | Chart's eval pass-rate becomes a fitness function, not just a monitor |
| Baseline-and-keep loop | The Pilot exit test ("beat the baseline or die") made continuous |
| Bounded sandbox makes autonomy safe (one file, one GPU) | The improvement agent gets its own gate register: prompts/configs/thresholds yes; billing, gates, customer data never |
| program.md as declarative research directions | Versioned markdown brief = standard work for the optimizer |
| Rejects are free, run hundreds overnight | Cheap offline tuning against the golden set; retainer gains "changes tried / promoted / score delta" reporting |

Guard added: Goodhart. An optimizer studying its own target overfits it (LSS analog:
teaching to the control chart). Mitigations: held-out golden-set slice the optimizer
never sees; quarterly golden-set refresh promoted to hard requirement.

Refusal-list nuance this forced: the *experiment loop* may be autonomous (offline,
sandboxed, golden-set-scored); the *promotion decision* stays human, and promoted
changes still ship shadow → canary. Jidoka applied to kaizen itself.

Filed in framework v0.3 (Compound → "Auto-kaizen" + amended refusal). Consulting-arm
hook (not yet on the site): assurance retainer gains overnight tuning runs.

## Open

- Framework skeleton: named phases, artifacts per phase, one-page interview sketch — DONE (charted-framework.md v0.3, approved v0.2 2026-08-11).
- Site incorporation of auto-kaizen (retainer copy, monthly report line) — pending Caleb's call; site currently reflects v0.2.
