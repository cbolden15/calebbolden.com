# Founder account and Vora tenant setup

This is a one-time manual runbook for standing up the consulting business's four social accounts and its Vora tenant. None of it can be automated: it needs a phone, four logins, and production access. Do the steps in order. Skipping ahead to LinkedIn or Facebook before step 1 is the most common way to end up redoing work.

**1. Handle availability.** Before creating anything, check whether `@calebbolden` is available on LinkedIn, YouTube, Instagram, and Facebook. Check all four before touching any of them. If it is taken on even one platform, use `@calebboldenai` on all four. A consistent handle across all four platforms matters more than winning the preferred handle on three of them and settling for a mismatch on the fourth. Display name is `Caleb Bolden` on every platform regardless of which handle wins.

**2. LinkedIn (reposition, do not create).** LinkedIn permits one profile per person. A second profile gets merged into the first or banned outright, and appealing a ban takes weeks. There is no "create a new LinkedIn for the consulting business" option here: the existing personal profile is the account. Rewrite the headline, About, and Featured sections to speak to the operators audience: operations leaders at SMBs large enough to have a real coordination problem. That is a different reader than the owners audience on the other three platforms. Add "Vora Technologies Consulting" under the Experience section. This is the only place in this entire setup where the LLC name appears. It does not go on YouTube, Instagram, or Facebook.

**3. YouTube.** Create a Brand Account under the existing Google account, named `Caleb Bolden`. A Brand Account is a separate channel identity layered on the same Google login. It carries none of the risk described in steps 2 and 5, because no second Google account gets created. This channel holds both the Shorts feed and the longer clinic recordings. Set the handle to whatever step 1 resolved.

**4. Instagram.** Create a new Instagram account. Instagram allows multiple accounts under one login, so a new account here does not put any existing personal Instagram at risk the way a second LinkedIn or Facebook profile would. Set the handle and display name to match step 1, and write the bio for the owners audience: plumbers, electricians, salon owners, landscapers.

**5. Facebook.** Create a Facebook Page from the existing personal account. Do not create a second personal Facebook account to "start clean." Facebook, like LinkedIn, permits one personal account per person, and the Page you are creating depends on that personal account staying in good standing. A second personal account risks a ban on the account the new Page is attached to, which takes the Page down with it. Name the Page to match the handle from step 1.

**6. Vora tenant.** Log into Vora production and create an org for the consulting business. Connect all four accounts, LinkedIn, YouTube, Instagram, and Facebook, through `social/sync-accounts`, authenticating each one from the credentials created in steps 1 through 5.

**7. Brand voice.** Author a brand-voice profile from scratch in `social/brand-voice`. Do not inherit `industry-presets.ts` for this org. Those presets are tuned for local service SMBs, the plumbers-and-electricians end of the audience, and applying them here will flatten the operators voice that steps 2's LinkedIn rewrite depends on. A from-scratch profile is what lets one org speak in two registers: operator on LinkedIn, owner on the other three.

**8. Guardrails and approvals.** Turn on guardrails so nothing publishes without review, across all four connected accounts. Turn on comment classification with the Telegram approval path. Incoming comments across all four accounts get classified, and anything that needs a response routes to one Telegram prompt on the founder's phone. That single prompt is what makes running four comment inboxes at once affordable; without it, four accounts means four inboxes to check by hand.

**9. First batch.** Film the `data and systems` dimension of `consulting/social/syllabus.md`, weeks 1 through 3, in one 30-minute session. That covers three questions, three clips, and three essays before moving to the next monthly batch.

## Record once known

- [ ] Handle actually used: `@calebbolden` or `@calebboldenai`
- [ ] Vora org ID
