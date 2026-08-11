# Launch weekend lead runbook

Covers Saturday 8/22 and Sunday 8/23, the launch announcement window. The goal is that no lead sits unanswered over the weekend because email delivery or attention lapsed.

## Before the weekend

- [ ] Verify the Resend lead notification actually lands in the monitored inbox, not just in container logs. Send a real test lead through the site and confirm it arrives, don't assume the pipeline works because it worked in July.
- [ ] Lead email alerts forwarded to phone (push notification or SMS forward, whichever is already set up for the monitored inbox)
- [ ] CRM open and ready on phone or laptop for quick entry

## Response target

Same-day response to every lead that comes in Saturday or Sunday. Not "within 24 hours," same calendar day. A lead who reaches out during a launch weekend is at peak interest, that fades fast.

## Acknowledgement reply template

Send this the moment a lead notification arrives, before doing anything else with it:

> Hi [name], thanks for reaching out. I'd love to talk through what you're dealing with. Here's my booking link if you'd like to grab a time: [Calendly link]

Two sentences, the booking link, nothing else. Don't try to qualify or sell in the acknowledgement, that happens on the discovery call.

## CRM entry

Log every lead the moment you acknowledge it: name, contact info, source (site chat, lead magnet, referral), and the exact message they sent. Don't batch this for Monday, memory of a specific detail fades and that detail is often what makes the discovery call feel personal.

## Fallback: email delivery fails

If a Resend notification doesn't arrive but you suspect a lead came in, check the raw logs directly:

```bash
ssh root@5.78.121.71
docker logs <calebbolden-container-name> --tail 200 | grep -E '\[lead\]|\[lead-magnet\]'
```

Do this check manually Saturday evening and Sunday evening regardless of whether any notification fired, as a backstop. The `[lead]` and `[lead-magnet]` JSON lines in the container logs are the source of truth if the email pipeline is silent.

## After the weekend

Monday morning: review every lead logged over the weekend, confirm none are sitting without a booked call or a clear next step, and note in the CRM which ones need a follow-up nudge.
