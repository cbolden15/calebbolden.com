---
title: "Map it, gate it, check it"
date: "2026-08-11"
category: "Process"
excerpt: "My method for putting AI into a business finally has a name: Charted. Map the work, gate the risky parts, and keep checking the output after it ships."
tags: ["charted", "process mapping", "ai", "small business"]
---

A few months ago an owner told me about the AI tool his company had bought the year before. It drafted customer emails, and for a while it was great. Then a customer called about a quote the system had sent with last spring's pricing. Nobody knew how long it had been doing that, because nobody had looked at its output since the week it launched. The tool hadn't broken. It had drifted, quietly, the way AI does, and there was no check in place to catch it.

I've been doing the same things on every engagement to prevent exactly that story, and I finally gave the method a name: Charted. The whole thing fits in six words. Map it, gate it, check it.

## Map it

RAND interviewed 65 experienced data scientists and found that more than 80 percent of AI projects fail, and the reasons they gave were almost all process reasons, not technology reasons. That matches what I see. AI lands in a business where nobody has written down how the work actually moves, and it automates a guess.

So the first phase of every engagement is still a map. Interviews, then the process on the wall: every step, handoff, wait, and workaround. Some steps get deleted instead of automated, because a deleted step is free and never drifts. And the map gets a lane most process maps skip: where the data for each step lives. If the answer is "in someone's head," that step isn't ready, no matter how good the demo looked.

The map also gives you the thing most AI pilots die without: a baseline. Minutes per task, errors per week, measured before the AI exists. Without that number, "it's working great" is a feeling. With it, it's arithmetic.

## Gate it

Here's my rule for the risky parts, and I hold to it in my own products: the AI physically cannot take a dangerous action on its own. Not "isn't supposed to." Cannot.

In the platform I run for my own customers, an agent cannot charge anyone for work that failed. The billing only fires after success, in the code, not in a policy document. Sending money, contacting customers, changing records that are hard to undo: each of those waits behind an approval, where the AI prepares the action and a named person clicks yes.

And when the system hits something it doesn't recognize, it stops and hands off to a person instead of guessing. Factories figured this out a century ago. Toyota's machines stop themselves and call a human the moment something looks abnormal, and nobody calls that a limitation. It's the reason the machines get trusted with speed everywhere else.

## Check it

This is the part most AI projects skip entirely, and it's the part I'd keep if I could only keep one.

AI output drifts. Your prices change, your customers change, the models behind the tools change on someone else's schedule. A system that was right in March can be confidently wrong in August, and it will not tell you. The only honest answer is to keep checking: pull a sample of real output every month, score it against a standard you set when the system launched, and watch the number. One score, monthly, next to last month's. When it slips, you know before your customers do.

I ask my clients to hold me to the same standard. The monthly report I send has real numbers from real samples, and a bad month gets reported as what happened, what it cost, and what I did about it. If your AI vendor won't show you a number like that, ask them why not.

None of this is exotic. It's lean process discipline, the same approach I used on delivery pipelines and server fleets for a decade before AI was the thing being delivered. The methodology is old. Only the object is new.

The full method is written up at [calebbolden.com/method](/method), all six phases. And if you want to know what it looks like pointed at your business, that's what the audit is for. It starts with a map, because everything starts with the map.
