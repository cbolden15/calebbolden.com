# Discovery interview guide (facilitator script)

For use during the Discover week. This is my script, not something to send to the client.

## Logistics

- 45-60 minutes per interview. Book 75 if it's the owner, they run long.
- Who to interview: the owner, one ops lead or office manager, and 2-3 frontline people who actually do the work (tech, front desk, whoever touches the customer or the job file). Five to six interviews total for a business this size. More than that and the map gets noisy without adding much.
- Take notes by hand or laptop, don't record unless the client explicitly says it's fine. If recording, ask on camera/mic at the start so it's on the record, and confirm again in writing after.
- Interview people one at a time, not in groups. A frontline person will not tell you about the workaround they use if their manager is in the room.
- Sit with the intake questionnaire answers open before each interview. Don't re-ask what's already answered, dig into it instead.

## Opening (every interview, all roles)

"Thanks for the time. I'm here to understand how work actually happens day to day, not how the manual says it happens. There's no wrong answer, and nothing you say here is going to get anyone in trouble. If something's broken, I want to know exactly how it's broken so we can decide whether it's worth fixing."

---

## Track A: Owner

Opening line: "I want to start with where the business is trying to go, then work backward into what's in the way."

Core questions:

1. Where do you want the business in 12 months? What has to be true for that to happen?
2. What's the ceiling on growth right now? If you doubled the number of jobs tomorrow, what breaks first?
3. Where does money leak out of this business that you can't fully explain?
4. What's the cost of a mistake in this business? (A missed callback, a double-booked job, a bad invoice.) What actually happens when one occurs?
5. If you took a two-week vacation with no phone, what would fall apart?
6. What have you already tried to fix this (a hire, a tool, a new process) and what happened?
7. What's the one thing you wish someone on your team did without you having to ask?
8. Where do you spend money on labor that's really just moving information from one place to another?
9. Who on the team would tell me the truth if I asked how things really work here?
10. What's your appetite for change? Are we talking about a small fix or are you ready to rebuild how something works?

Follow-ups: after any dollar figure or growth number, ask "how do you know that number is right?" Owners often quote figures nobody has checked in months.

---

## Track B: Ops / office lead

Opening line: "Walk me through a normal day, start to finish, the way it actually goes, not the way it's supposed to go."

Core questions:

1. Walk me through what happens from the moment a customer first contacts you to the moment the job is closed out and paid.
2. What system or paper does each step touch? Where does information get typed in more than once?
3. What's the most common exception, the thing that doesn't fit the normal process? How is it handled?
4. What report do you pull regularly, and who actually reads it?
5. What do you do when the software doesn't do what you need? (Workaround, call support, just deal with it manually?)
6. How do you know a job or task fell through the cracks? Does anyone notice before the customer complains?
7. What's the handoff point where things most often get dropped (tech to office, office to billing, etc.)?
8. If a new person started tomorrow, what would take the longest to teach them?
9. What takes longer than it should, purely because of how the system is set up?
10. Which numbers in your reports do you not fully trust? What do you end up double-checking by hand?

Follow-ups: for every system named, ask "does that talk to the other systems, or do you copy information between them?" For every exception mentioned, ask how often it happens (daily, weekly, rare) and whether "rare" is really rare or just underreported.

---

## Track C: Frontline (tech, front desk, field staff)

Opening line: "You're the person who actually does this, so you're the one who knows where it gets annoying. I want the real version, not the training-manual version."

Core questions:

1. Walk me through your day. What's the first thing you touch, and what's the last?
2. What part of your job is basically typing the same thing into two places?
3. What do you do when the system tells you to do something that doesn't make sense for the situation in front of you?
4. Is there a step in the official process you skip, shortcut, or do differently in practice? What's the real version?
5. Do you keep your own notes, list, or spreadsheet outside the official system? What's in it, and why does it exist?
6. What slows you down the most in a normal week?
7. When something goes wrong, who do you call, and how long does it usually take to get sorted?
8. What do you wish someone would just handle for you so you didn't have to think about it?
9. Is there anything you do outside normal hours, at night, early morning, weekends, to keep up?
10. If you could delete one task from your job forever, what would it be?

Follow-ups: when someone describes a workaround, ask "does your manager know you do it this way?" Don't push if they hesitate, just note it. When someone says "it's fine" about something that sounds slow, ask "fine, or you've just stopped noticing it?"

---

## The two threads to run in every interview, every role

### Data trust

Ask directly, in every interview: "Which numbers in your reports do you not trust? What do you check by hand before you believe it?"

This surfaces where the source data is dirty before it becomes an automation problem later. If three people separately say they don't trust the same number, that number is not a small issue, it's a structural one.

### Workarounds vs. official process

Ask directly, in every interview: "Where do people bend the system, or keep their own side list, instead of using it the way it's supposed to work? What does the official process say happens, versus what actually happens?"

Every business has at least one shadow spreadsheet. Find it. It's usually the clearest signal of where the official tools failed someone.

---

## What to listen for

### Signs a step is a good automation candidate

- The decision is rule-based: "if X then Y," no judgment call required.
- It happens often: several times a day or week, not twice a year.
- Someone copies or retypes the same information from one system into another.
- The step is just waiting: waiting on an approval, a callback, a status update, with nobody actively working during the wait.
- It gets done outside business hours because there wasn't time for it during the day.

### Signs a step is NOT a good automation candidate (yet)

- It requires judgment, tone, or relationship handling (a tough customer call, an exception that needs a human read on the situation).
- It happens rarely. Automating a once-a-quarter task rarely pays for itself.
- Getting it wrong is expensive or embarrassing (contract terms, medical or legal detail, anything customer-facing where a mistake damages trust).

When in doubt, write the step down anyway and flag it as "needs judgment call" rather than dropping it. That's information for the Map phase.

## After the interviews

Notes from all interviews feed directly into the current-state findings memo: every process step gets logged with who does it, what system touches it, how often it happens, and which of the two threads (data trust, workaround) it connects to. Steps get tagged as automation candidates or not before the VSM workshop, so the Map phase starts from evidence instead of opinion.
