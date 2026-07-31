# AI Readiness Assessment

Internal scoring tool used during the Discover phase of the Process & AI Readiness Audit. Scored from intake answers plus the interviews. Not shown to the client as a raw worksheet, the results feed the readiness snapshot slide in the final deck.

## How to use it

Score each question during or right after the interviews, while the answer is still fresh. Some questions you can score by observation alone (watching someone pull up a customer list tells you more than asking about it). Others need a direct question to the owner or office manager. Where a question is genuinely unanswerable for a given business (for example, no regulatory constraints apply), skip it and note the skip, do not force a score.

## Scoring

Each question scores 0, 1, or 2:

- **0**: No, or not really, or "we used to but stopped"
- **1**: Partially, inconsistently, or "one person can do this but nobody else"
- **2**: Yes, consistently, and more than one person could demonstrate it

Add the points in each dimension and divide by the number of questions asked (some businesses will skip one governance question, for example). That gives a dimension average from 0 to 2. Average the four dimension scores for the overall score.

## Dimension 1: Data

Is customer, job, and financial information digital, kept in named systems, trusted, and exportable.

1. Can you get a list of every customer and what they paid last year in under ten minutes?
2. When a customer calls, can one person pull up their full history (jobs, payments, notes) without calling a coworker or digging through paper?
3. Is job or project information (what was done, when, for whom) recorded somewhere other than a technician's memory or a group text?
4. If the answer to the above is yes, can that information be exported as a spreadsheet or report without a developer?
5. Do two people who pull the same report (say, monthly revenue) get the same number?
6. Is there a single system you'd point to as the "real" customer list, or would three people name three different files?

## Dimension 2: Technology

Do the core systems talk to each other, is there one source of truth per record type, who administers the tools, and how careless is access.

1. Do your main systems (scheduling, invoicing, CRM, accounting) sync with each other automatically, or does someone retype the same information into more than one?
2. For your most-used software, is there a way for another tool to read or write data through it automatically (an API or a listed integration), and do you know whether it's turned on?
3. If you look up a customer's phone number in two different systems, do you get the same number, or does one system quietly go stale?
4. Is there one specific person who can add or remove software, reset a password, or change a system setting, and would the business notice for weeks if that person left?
5. Do logins use shared passwords (one login for "the whole office") or does everyone have their own?
6. When an employee leaves, is there a routine for cutting off their system access, or does that get forgotten until someone asks?

## Dimension 3: People and culture

Has anyone used automation before, who would own a new tool day to day, and is the team more curious or more afraid of it.

1. Has anyone on the team used any form of automation before (auto-replies, scheduling software, an AI tool, even a basic Zapier flow), even informally?
2. If a new tool were introduced, is there a specific person (not "whoever has time") who would be responsible for using it every day?
3. When you've brought up new software or process changes before, has the team generally tried it, or found reasons to avoid it?
4. Would the team feed real data into a new system honestly, or would they under-report and route around it because they don't trust what happens to the information?
5. Does the owner have a standing hour or two a week they could spend reviewing a new tool's output during a pilot, or does every week already run at capacity?
6. Is there a recent example of the team adopting a new process and sticking with it past the first month?

## Dimension 4: Governance

Who is accountable for data, what promises exist to customers, how spend gets approved, and what happens when something breaks.

1. If a customer's data were mishandled or lost, is there one named person who'd own fixing it, or would it become everyone's problem and no one's job?
2. Are there contractual, legal, or industry promises (signed contracts, health information, financial data, insurance requirements) that limit which tools or vendors you can use?
3. Is there a real answer for who approves a new software purchase over a few hundred dollars a month, or does it depend on who happens to bring it up?
4. When a system goes down or a process breaks today, is there a documented fallback, or does the team just improvise?
5. Has anyone reviewed what a vendor can see, store, or do with your data before signing up for a tool in the last year?

## Overall bands and what they mean

Average the four dimension scores (0.0 to 2.0).

**0.0 to 0.7: Not ready yet**

Plain meaning: the basic plumbing isn't there. Records live in someone's head, a drawer, or three different phones. Putting automation on top of this would automate the confusion, not fix it.

First fix: get job and customer records into one system that more than one person can use. No automation work starts until this is done, usually four to six weeks of cleanup first.

**0.8 to 1.3: Ready with conditions**

Plain meaning: the basics exist but they're inconsistent. One system might be solid (say, invoicing) while another (job notes) is still informal. There's enough here to build on, but the roadmap has to sequence around the weak spot.

First fix: pick the one dimension dragging the score down and fix that specific gap before or alongside the first pilot, rather than after.

**1.4 to 2.0: Ready**

Plain meaning: records are trustworthy, someone owns the tools, and the team has shown it can adopt something new. Pilots can start on the priority opportunity without a cleanup phase first.

First fix: none needed, move straight into the prioritized backlog.

A low score is not a failed engagement. It's information that changes the sequence of the roadmap, not the value of the audit. A business that scores low on data still gets a clear, honest answer: here's what to fix first, and here's what it costs to fix it, before spending money on automation that would just sit on top of bad records.

## Note on the website lead magnet

A shortened, 10-question self-serve version of this assessment is planned as a website lead magnet. It will pull from this list rather than duplicate it. Questions that carry over cleanly (they're answerable by a non-technical owner alone, without an interviewer prompting them):

- Data Q1 (customer list in under ten minutes)
- Data Q3 (job info recorded somewhere durable)
- Data Q6 (one source of truth for customer list)
- Technology Q1 (systems sync automatically)
- Technology Q4 (one person administers tools)
- Technology Q5 (shared vs. individual logins)
- People Q1 (any prior automation use)
- People Q2 (named owner for a new tool)
- Governance Q2 (contractual/regulatory constraints)
- Governance Q3 (approval process for new spend)

The self-serve version itself is a separate deliverable and isn't written here.
