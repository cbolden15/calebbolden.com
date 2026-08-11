# Assured AI

My framework for AI implementations, built on lean six sigma principles.
Working name; v0.3, 2026-08-11. Caleb Bolden.

## Two names for the same method

This document uses five internal phases (Map, Gate, Pilot, Chart, Compound) plus a
cross-cutting Adoption track. The public site (`/method`) uses six phases (Discover,
Map, Prioritize, Pilot, Scale, Assure). Same method, different audience: the table
below maps one onto the other.

| Internal phase | Public phase(s) | Why they don't line up one to one |
|---|---|---|
| Map | Discover, Map, Prioritize | Internal Map covers interviewing, drawing the value stream, and scoring candidates as one continuous phase. The public site splits that into three because a client experiences them as three separate weeks with three separate deliverables. |
| Gate | Prioritize (end), Pilot (start) | Future-state design and the gate register get built before a pilot goes live, so the work spans the boundary between the public Prioritize and Pilot phases. |
| Pilot | Pilot | Shadow, canary, and limited rollout are what the public Pilot phase describes. |
| Chart | Assure | The monthly assurance report is Chart's sampling and control-chart discipline, renamed for a client. |
| Compound | Scale, and ongoing beyond Assure | The runbook, training, and ownership transfer that close a build happen at Scale. The redeployment and standard-work half of Compound keeps running after that, under whatever name the engagement is in. |
| Adoption track | Runs under all six | Cross-cutting in both models; it isn't its own phase in either one. |

Internal phase names are for me: analysis, gate design, and talking to another
practitioner. Public phase names are for the client: what happens in which week, in
the words the roadmap deck uses. Same method, two registers.

## Where this comes from

I've never been formally trained in lean six sigma and I don't hold any certifications.
I've spent twelve years applying the principles anyway, because they consistently work.
My views on process improvement are based in a lean six sigma approach, centered around
identifying value and eliminating waste. The methodology comes from manufacturing, but
it's actually perfect for corporate processes, and it applies just as directly to AI
implementations. The reason: enterprise AI rarely fails because the models are bad.
It fails because the process around the AI was never mapped, never measured, and never
controlled. That's a process problem, and process problems are what this methodology
was built to solve.

Whenever I begin an improvement, I like to start with a formal or informal kaizen event
including value stream mapping. Data is crucial to every process, and each process
should be designed with the data you want to get out of it in mind. Everything below
grows out of those two habits.

The short version: map it, gate it, chart it.

## My operating principles

1. Process before model. The workflow is the thing I'm improving, not the model. If the process is broken, AI just makes the broken parts run faster.
2. Eliminate, then simplify, then automate. I never automate a step that shouldn't exist, and I don't use an LLM where a rule or a script does the job.
3. Measure the human baseline first. If I can't prove the improvement with numbers from before the AI showed up, the pilot dies in a meeting. Baseline before build.
4. Contain variation instead of pretending to eliminate it. LLM outputs vary by design. Control means gates, sampling, and escalation paths, not the pretense of zero variance.
5. A vendor's compliance report is not validation. SOC 2 tells me about the vendor's process. It tells me nothing about my outputs. I have to own that measurement myself.
6. Human judgment is designed in from day one. The stop condition and the escalation path get drawn on the process map before anything ships.
7. Freed capacity gets redeployed, not cut. Efficiency makes new work economical (Jevons paradox). If people think the tool shrinks their job, they will make sure it fails.

## The lifecycle

Five phases, plus an adoption track that runs under all of them.

### 1. Map

Lean six sigma roots: define, measure, gemba, value stream mapping.

I start by walking the real process with the people who run it, then I draw the current
state value stream. I add three things the classic map doesn't have: a data lane showing
what data each step needs and whether it's actually available and governed, the wait
states and rework loops priced out explicitly, and touch time separated from lead time.
Then I capture the baseline: cycle times, error rates, cost per transaction.

The AI candidates come off the map, not out of a brainstorm. Wait states, handoffs, and
rework loops are the opportunity list. I score candidates on where they sit (customer
facing, customer supporting, or back office) and on whether the capability is a
commodity I should buy or an advantage worth building. Every candidate gets acceptance
criteria, meaning a measurable definition of what a good output looks like, before
anything gets built.

Artifacts: current state map with data lane, baseline sheet, prioritized candidate list,
acceptance criteria per candidate.
Exit test: could a skeptic reproduce my baseline numbers? And is there at least one step
I chose to eliminate instead of automate?

### 2. Gate

Lean six sigma roots: analyze, poka-yoke, jidoka.

Now I design the future state. Every step on the map gets one of five dispositions:

| Disposition | When |
|---|---|
| Eliminate | The step shouldn't exist. I check this first because it's the biggest win. |
| Keep human | Judgment, accountability, or the relationship lives here. |
| Automate with rules | Scripts, OCR, deterministic logic. Cheaper and testable. |
| Give it to AI | Pattern work at scale: drafting, retrieval, classification, triage. |
| Gate | A checkpoint the flow can't pass without a control firing. |

Gates come in two kinds, and both get drawn on the map.

Prevention gates make the bad action impossible. In Vora I built approval requirements
in front of anything destructive or customer facing, idempotency keys so a retry can't
fire twice, and a charge-after-success pattern so an agent can never bill for failed
work. The distinction matters: the system is designed so the failure mode cannot
happen, rather than relying on a monitor to catch it after the fact.

Stop conditions are the second kind. The AI runs at full speed until it hits something
abnormal, low confidence, an input it hasn't seen, a high risk situation, and then it
stops and brings in a human. Toyota has done this on assembly lines for a hundred years
(they call it jidoka, and the pull cord is the andon). I wire the same idea into
software as escalation paths.

The eval rubric gets written in this phase, together with the design, not after
deployment. I define the ground truth, build the golden set, and set the pass rate
threshold here. A gate without a rubric behind it is a formality, not a control.

Artifacts: future state map, gate register listing every gate with its type, trigger,
and owner, eval rubric plus golden set, buy or build decision per component.
Exit test: point at any step and the map answers what happens there, which gate covers
it, and who gets called. One warning from experience: gates create review queues, and a
review queue that isn't on the map becomes the new bottleneck.

### 3. Pilot

Lean six sigma roots: improve, controlled experiments.

Three stages, and promotion has to be earned at each one. Shadow first: the system runs
in parallel, touches nothing, and gets scored against what the humans produced. Then
canary: a small live slice, one to five percent, with every gate active. Then a limited
rollout to one team or client segment, with the adoption work running alongside. Every
stage gets scored against the phase 1 baseline, the same numbers, so improvement is
arithmetic instead of a story someone tells in a readout.

Artifacts: shadow and canary scorecards against baseline, incident log, a go or no-go
decision with the criteria named in advance.
Exit test: the pilot beat the baseline on the metrics chosen in Map, at an eval pass
rate above the threshold set in Gate. Or it was stopped early, cheaply, on evidence.
That outcome is also a success.

### 4. Chart

Lean six sigma roots: control, SPC, control charts, cost of poor quality.

This phase answers the question I get asked most: how do you trust a system whose
outputs vary? The same way lean six sigma always handled variation, statistically. I
sample production outputs continuously, score them against the rubric, and chart the
pass rate over time. That chart, not the vendor's compliance report, is the
independent validation.

Normal spread inside the limits gets left alone. A drift, a sudden shift, or a trend is
a special cause, and it gets investigated: did the data change, did the model version
change, did usage change? Every chart has an owner and a response plan for who gets
called when it trips. Every excursion gets a root cause entry filed by category (prompt,
retrieval, tool, data, or model) so we diagnose each failure once instead of
rediscovering it. And I keep a cost of poor quality ledger: rework volume, escalation
volume, incident cost in dollars, reviewed quarterly, with kill criteria for any system
whose cost outruns its value.

Artifacts: a live control chart per AI step, response plan, failure registry, and a
quarterly revalidation of the golden set, because ground truth ages too.
Exit test: none. Chart does not end. A system without a live chart is returned to
Pilot or retired.

### 5. Compound

Lean six sigma roots: kaizen, standard work.

The last phase closes the loop. Freed capacity gets redeployed against the demand the
efficiency just created: new advisory work, deeper coverage, the backlog that was never
economical before. Lessons harden into standard work, so prompts and SOPs are versioned,
failure modes go in the registry, and playbooks become reusable. The target: the
second implementation should cost roughly half of the first, and the updated map feeds
the next Map phase.

Artifacts: capacity redeployment plan, versioned prompt and SOP library, failure
registry, portfolio scorecard across every live system.
Exit test: the next implementation is measurably cheaper and faster than the last one.

**Auto-kaizen.** Kaizen can also run itself, inside limits, and Karpathy's AutoResearch
(March 2026) is the proof of shape: an agent proposes a change, runs the experiment,
and the change survives only if it beats the current best on one held-out metric.
Hundreds of attempts can run overnight, and rejected changes cost nothing. My
adaptation: an improvement agent
gets a sandbox and its own gate register. It may edit prompts, configs, and thresholds.
It may never touch billing logic, approval gates, or customer data. Every proposed
change is scored against the golden set, and only changes that beat the current pass
rate get queued for promotion. A human approves the promotion, and the change still
ships through shadow and canary like anything else. The check sheet stops being just a
smoke detector and becomes the selection pressure. Two guards make this honest: the
optimizer never sees a held-out slice of the golden set (an agent will overfit any
target you let it study, the same way a team learns to teach to the chart), and the
quarterly golden-set refresh moves from hygiene to hard requirement. The improvement
directions live in a versioned markdown brief, which is just standard work for the
optimizer. Autonomy on the inner loop, an andon cord on the outer one.

### The adoption track

This runs under every phase and never closes, because technology doesn't transform an
organization, adoption does. What I've seen work:

- Named champions inside the practice group, involved from Map onward. People describe their own workflow better than any outsider maps it.
- Tactical specificity. "Use it for first pass RFP drafts starting Monday" works. "We've deployed an AI tool" doesn't.
- Peer teaching over training decks, because practitioners trust practitioners.
- The redeployment promise, made early and kept. People adopt tools that grow their practice and quietly kill tools that threaten their jobs. The Jevons story is the honest version of that promise.
- Adoption metrics on the same dashboard as eval metrics: usage rate, opt out rate, override rate. A high override rate is telling me something about the model and about the rollout at the same time.

## What I won't do

- Sigma level math and belt hierarchy for AI work. The statistics are useful, the regalia isn't the point, and 3.4 defects per million is a fiction for LLM outputs.
- Quote vendor numbers I can't source. The "87% of ML projects fail" statistic gets repeated everywhere and cited nowhere. Claims carry citations or I don't use them.
- Unsupervised improvement loops in production. The experiment loop can run itself, sandboxed, offline, against golden sets (see auto-kaizen under Compound). The promotion decision cannot. An AI that ships its own changes to production is a demo, not an operating model I'd put in front of a regulated business.
- Big bang rollouts. Nothing skips shadow and canary, no matter what the vendor promises.

## Receipts

This framework existed in practice before it had a name. Every element below is
running, or ran, in production.

| Framework element | Where I've done it |
|---|---|
| Map: value stream mapping and bottleneck analysis | 29% node delivery reduction and 50% onboarding reduction at Blockdaemon |
| Gate: prevention gates | Vora's charge-after-success billing gate, approval workflows on destructive actions, idempotency keys |
| Gate: stop conditions | Human in the loop escalation paths in Vora; Smart Routing at Blockdaemon, which detects unhealthy nodes and reroutes, sustaining a 19 to 32% incident reduction across 1,500 nodes |
| Chart: evals against ground truth | Production agent evaluation and refund logic for failed tool calls in Vora |
| Chart: cost of poor quality | The incident versus revenue analysis behind sunsetting a platform at Blockdaemon: 40%+ of incidents against 6% of revenue |
| Compound: standard work and failure registry | Vora's gotcha registries; Aura cutting internal tool deployment from 4 weeks to 1 day across 40 live sites |
| Adoption track | AI transformation program at Blockdaemon; training non-technical users on a 1,200 user workflow app going back to my TSYS days. Vora runs in production at 65 small businesses today |

## The whiteboard version

If I've got a marker and 90 seconds, I draw the process as five boxes with arrows, and
a data lane underneath. I circle one box: this step we eliminated, because you never
automate waste. I draw a diamond in front of another box: prevention gate, the agent
literally can't bill a failed job here. On a third box I mark the stop condition: when
this step sees something abnormal it stops and calls a human, same thing Toyota's been
doing on assembly lines for a century. Then on the right I sketch a small control
chart, dots around a center line, one dot outside the limits. And I say: this is how
you trust it. You already trust audits built on sampling. Sample the outputs, score
them against ground truth, chart the pass rate. When a dot lands out here, that's
drift, and we catch it before the client does.

Then the close: map it, gate it, chart it. The methodology is seventy years old, only
the object is new. And everything on this board is running in production today. I can
show you the gate, and I can show you the chart.
