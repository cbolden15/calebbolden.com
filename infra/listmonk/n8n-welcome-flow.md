# n8n welcome-sequence workflow

Node-by-node doc for `founder-brand-welcome-sequences`, since n8n JSON exports
drift from what's actually deployed. This is the source of truth; re-derive
the JSON from this doc (or `GET /api/v1/workflows/{id}`) if the two disagree.

- **n8n instance:** homelab, `https://homelab.bream-python.ts.net:5678` (also
  reachable at `https://homelab.bream-python.ts.net/n8n` from inside the
  Tailscale network, but the REST API only answered on the `:5678` host+port
  combination during this build; use that one). API key: `N8N_HOMELAB_API_KEY`
  in `~/.dev-secrets.env`. (`N8N_API_KEY`, the other key in that file, belongs
  to a different n8n project and returns `401` against this instance, so
  don't confuse the two.)
- **Workflow ID:** `3cAy8jmJlC7goDLC`
- **Workflow name:** `founder-brand-welcome-sequences`
- **Status:** active, production delays (2d / 5d)
- **Credential:** `listmonk-api-bot` (id `hBvoOrVMOmeEw4xe`), type `httpBasicAuth`,
  created via `POST /api/v1/credentials` with `LISTMONK_API_USER` /
  `LISTMONK_API_TOKEN`. Stored in n8n's credential store, referenced by id from
  every HTTP Request node that talks to Listmonk. Never inlined in a node's
  URL or body.

## Deviation from the original SQL-query design

The brief's original Step 3.2 GET used
`query=subscribers.attribs->>'welcome_step' IS NOT NULL AND subscriber_status='enabled'`.
`api-bot`'s role does not include `subscribers:sql_query` (confirmed: that
query param 403s with `{"message":"Permission denied: subscribers:sql_query"}`,
by design, see Task 2's README). The workflow instead issues one
`list_id`-scoped `GET /api/subscribers` call per list with
`subscription_status=confirmed`, which `subscribers:get_all` does permit.

## Template IDs (Listmonk `tx` templates, Step 2)

Created via `POST /api/templates` using the admin session-cookie workaround
(`api-bot` lacks `templates:manage`; see `infra/listmonk/README.md` gotchas).

| Template ID | Name | List | Step | Subject | Source file |
|---|---|---|---|---|---|
| 5 | `welcome-owners-1` | owners | 1 | The missed-call math | `welcome-emails/owners-1.html` |
| 6 | `welcome-owners-2` | owners | 2 | What a text-back actually recovers | `welcome-emails/owners-2.html` |
| 7 | `welcome-owners-3` | owners | 3 | Five founding slots, six months at this price | `welcome-emails/owners-3.html` |
| 8 | `welcome-operators-1` | operators | 1 | The manual-work tax | `welcome-emails/operators-1.html` |
| 9 | `welcome-operators-2` | operators | 2 | One workflow, taken apart: intake, quote, follow-up | `welcome-emails/operators-2.html` |
| 10 | `welcome-operators-3` | operators | 3 | How the audit actually works | `welcome-emails/operators-3.html` |

Each template's `body` is the corresponding HTML file wrapped in a minimal
`<!doctype html>` shell (Listmonk `tx`-type templates are standalone documents,
not wrapped by the campaign base template; confirmed against the seeded
"Sample transactional template").

## List IDs

Confirmed against `GET /api/lists` (Task 2): `owners` = list `3` ("The Missed
Call"), `operators` = list `4` ("The Workflow Brief").

## Nodes

1. **`Every 15 minutes`**: `n8n-nodes-base.scheduleTrigger`, interval every
   15 minutes. Entry point.

2. **`GET owners confirmed subscribers`**: `n8n-nodes-base.httpRequest`, GET
   `https://lists.calebbolden.com/api/subscribers` with query params
   `list_id=3`, `subscription_status=confirmed`, `per_page=500`, `page=1`.
   Auth: generic credential type, `listmonk-api-bot`.

3. **`GET operators confirmed subscribers`**: same shape, `list_id=4`. Runs
   in parallel with node 2 (both fan out from the trigger).

   **Known limitation:** single page, `per_page=500`, no pagination loop. If
   either list's confirmed-subscriber count exceeds 500, subscribers past the
   first page are silently skipped until pagination is added. Not built now,
   since both lists currently have 0 real confirmed subscribers, and 500 is a
   wide margin past the community-gate threshold (500 subs) that would
   prompt revisiting this workflow anyway.

4. **`Merge owners + operators`**: `n8n-nodes-base.merge`, mode `append`,
   2 inputs. Combines the two list responses into one stream of 2 items
   (one per list) for the next node.

5. **`Compute due steps`**: `n8n-nodes-base.code`, run once for all items.
   For every subscriber in either list response with an `attribs.welcome_step`
   present (0, 1, or 2; subscribers without the attrib, or already at 3, are
   skipped), determines which list the subscriber is *confirmed* on (reads
   `sub.lists[].id` + `.subscription_status`, not which HTTP branch it arrived
   on, so it's robust either way) and computes the due step:
   - `welcome_step == 0` → due step 1 (fires next poll after confirmation,
     i.e., within ~15 min).
   - `welcome_step == 1` and `now - welcome_last_at >= 2 days` → due step 2.
   - `welcome_step == 2` and `now - welcome_last_at >= 5 days` → due step 3.

   Emits `{subscriber_id, email, list, due_step, template_id}` per due
   subscriber, looking `template_id` up from the table above.

   **Delay interpretation (a brief ambiguity, resolved and documented here):**
   the brief phrases the step-3 condition as "`>= 5d` since step 1," which
   read literally would mean 5 days after the *first* email, not after the
   second. But the workflow's own update mechanism (node 9 below) overwrites
   `welcome_last_at` at *every* step transition, and the step-2 condition is
   explicitly `now - welcome_last_at >= 2d` off that same field. Those two
   things can't both be true unless the delays chain relative to the
   *immediately preceding* send: 2 days after step 1, then 5 days after step
   2, so roughly 7 days total from confirmation to email 3, not 5. That's
   what's implemented. If the actual intent was 5 days total from
   confirmation (i.e., only 3 days between email 2 and email 3), the fix is a
   one-line change to the `STEP3_DELAY_MS` comparison in this node. Flagging
   for founder sign-off rather than guessing further.

   **Known limitation:** a subscriber confirmed on *both* lists (rare, since
   the two hub-page forms are separate, but nothing stops the same email
   subscribing to both) shares one `welcome_step` attribute across both
   funnels, because Task 3's subscribe route seeds it as a subscriber-level
   attribute, not a per-list one. This node will emit two due items for that
   subscriber (one per list) off the same `welcome_step` value, and node 9's
   PUT will only end up recording one list's `template_id` progression,
   because the field is shared. Not fixed here; it's an upstream Task 3
   design decision, out of this task's scope.

6. **`POST tx send`**: `n8n-nodes-base.httpRequest`, POST
   `https://lists.calebbolden.com/api/tx` with
   `{"subscriber_email": <email>, "template_id": <template_id>}`. Auth via
   the same credential. `onError: continueErrorOutput`: success continues to
   node 7, failure routes to node 10 (error branch).

   **Known limitation (delivery confirmation gap):** Listmonk's `/api/tx`
   returns `200` once the message is queued, before the actual SMTP send
   happens. The SMTP attempt runs asynchronously in Listmonk's own send
   manager and only surfaces in the container's application logs (there is
   no delivery webhook back to n8n). This node's success path, and therefore
   `welcome_step`'s advance, reflects "Listmonk accepted the send request,"
   not "the email was actually delivered." This is exactly what surfaced
   during testing: see "Verification" below, where an early test run's tx
   call was accepted and `welcome_step` advanced while the relay was still
   down, so the underlying SMTP send failed silently from the workflow's
   point of view. Founder-owned follow-up: either watch Listmonk's bounce
   API/webhooks for a tighter loop, or treat container-log monitoring as the
   backstop, as Task 7's delivery-proof scope already does.

7. **`GET subscriber by id`**: GET
   `https://lists.calebbolden.com/api/subscribers/{{subscriber_id}}`. Fetches
   the current full subscriber record so the next step can merge instead of
   clobber. The URL expression reads `subscriber_id` from
   `$('Compute due steps').item.json`, not from `$json` (which at this point
   is the tx-send node's response body, not the original due-step item). An
   earlier draft used `$json.subscriber_id` here and 404'd (`.../subscribers/`
   with an empty id) during the first live test run; see "Verification."

8. **`Merge attribs + build PUT body`**: `n8n-nodes-base.code`, run once per
   item. Takes the fetched subscriber (`$json.data`), spreads its existing
   `attribs`, and overwrites only `welcome_step` (to the due step just sent)
   and `welcome_last_at` (to now, ISO). Reconstructs the full subscriber body
   Listmonk's `PUT /api/subscribers/{id}` expects (`email`, `name`, `status`,
   `lists` as an id array, `attribs`). Listmonk's update endpoint takes the
   whole record, not a partial patch, hence the fetch-first.

9. **`PUT update subscriber`**: PUT
   `https://lists.calebbolden.com/api/subscribers/{{id}}` with the merged
   body from node 8. `onError: continueErrorOutput`: failure also routes to
   node 10.

10. **`Merge error branches`**: `n8n-nodes-base.merge`, mode `append`, 2
    inputs: the error outputs of nodes 6 and 9.

11. **`Format Telegram error message`**: `n8n-nodes-base.code`. Builds a
    plain-text failure summary (subscriber + error) per failed item.

12. **`Telegram sendMessage`**: `n8n-nodes-base.httpRequest`, POST to
    `https://api.telegram.org/bot{{ $env.TELEGRAM_HOMELAB_HEALBOT_TOKEN }}/sendMessage`
    with `chat_id: $env.TELEGRAM_HOMELAB_HEALBOT_CHAT_ID`. This reuses the
    exact pattern already running in this n8n instance's `alert-default`
    workflow (its Alertmanager-to-Telegram bridge): the closest thing this
    instance has to "n8n's existing failure notification channel." There
    isn't a separate generic error-notification workflow to hook into. No
    Listmonk credential is attached to this node; it doesn't need one.

## Connections

```
Every 15 minutes
  -> GET owners confirmed subscribers   -> Merge owners + operators (input 0)
  -> GET operators confirmed subscribers -> Merge owners + operators (input 1)
Merge owners + operators -> Compute due steps -> POST tx send
POST tx send
  [success] -> GET subscriber by id -> Merge attribs + build PUT body -> PUT update subscriber
  [error]   -> Merge error branches (input 0)
PUT update subscriber
  [success] -> (end)
  [error]   -> Merge error branches (input 1)
Merge error branches -> Format Telegram error message -> Telegram sendMessage
```

## Verification

Mail delivery was blocked upstream for most of this build (see
`infra/listmonk/README.md` § "MAIL DELIVERY PENDING FOUNDER ACTION": neither
Resend nor the SendGrid fallback could send at build start). The relay went
live mid-task: the founder fixed the Resend account mismatch and the
controller flipped Listmonk's SMTP settings to `smtp.resend.com` and
verified a standalone tx send end-to-end (`200`, messenger reinitialized, no
SMTP errors). That let the brief's original Step 4 compressed-clock test run
for real, rather than the rejection-based substitute originally planned
around the delivery blocker.

**Run 1 (before the relay went live), caught a real bug:**

1. Created probe subscriber `probe+task5@calebbolden.com` (id `10`) directly
   via `POST /api/subscribers`, `list: [3]` (owners), `attribs:
   {welcome_step: 0}`, then set that list subscription to `confirmed` via
   `PUT /api/subscribers/lists`, bypassing the (also relay-blocked) opt-in
   confirmation email.
2. Activated the workflow. Manual triggering turned out not to be available
   two ways it was tried: `n8n execute --id` from inside the running
   `heal-n8n` container failed ("Task Broker's port 5679 is already in use,"
   the CLI can't run side-by-side with the live server process in the same
   container), and the public REST API has no ad-hoc "run now" endpoint for
   a schedule-triggered workflow (`POST /api/v1/workflows/{id}/run` → `405`).
   Let the workflow's own 15-minute schedule fire it instead.
3. The scheduled run at `21:30:03Z` errored at node 7 (`GET subscriber by
   id`): the URL resolved to `.../api/subscribers/` (empty id) because that
   node read `$json.subscriber_id`, which at that point was the tx-send
   response body (`{"data": true}`), not the original due-step item. Fixed
   by pointing the expression at `$('Compute due steps').item.json.subscriber_id`
   instead (see node 7 above), then redeployed via `PUT /api/v1/workflows/{id}`.
4. Before the fix, `POST tx send` itself had already run and succeeded
   (Listmonk returned `{"data": true}`, `200`), and the container logs
   showed Listmonk's async send manager then failing at SMTP with the same
   `451 Authentication failed: Maximum credits exceeded` documented in the
   README, proving the chain worked correctly up through the point the old
   relay was blocked. This is also what exposed the delivery-confirmation
   gap documented on node 6 above: the workflow's tx-send success path
   doesn't know the SMTP send behind it failed.

**Run 2 (after the relay went live), the actual compressed-clock test:**

1. Reset probe `10` back to `welcome_step: 0` and created a second probe,
   `probe+task5-ops@calebbolden.com` (id `12`), confirmed on the operators
   list (`4`), also at `welcome_step: 0`, so both lists could be tested in
   the same pass (they share one poll schedule).
2. Temporarily compressed the delays in node 5: `STEP2_DELAY_MS` to 5
   minutes, `STEP3_DELAY_MS` to 10 minutes, redeployed, confirmed active.
3. Polled both subscribers' `attribs.welcome_step` every 60 seconds. Both
   advanced 0 → 1 at `02:01Z`, 1 → 2 at `02:16Z` (roughly 15 minutes later,
   the next poll cycle after the 5-minute due mark), and 2 → 3 at `02:31Z`
   (roughly 15 minutes after that, the next poll cycle after the 10-minute
   due mark). Both subscribers ended at `welcome_step: 3` with
   `welcome_last_at` set, all three steps in order, for both lists.
4. No `manager.go` error lines appeared in the Listmonk container logs for
   either probe's address during the run, consistent with all six sends
   (three per list) being accepted by Resend. The founder separately
   confirmed human-verified delivery in a real inbox for the welcome-sequence
   emails.
5. Restored the production delays (`STEP2_DELAY_MS` = 2 days,
   `STEP3_DELAY_MS` = 5 days, chained per-step as documented on node 5),
   redeployed, and confirmed the workflow is active with the restored
   values.
6. Deleted both probe subscribers (`DELETE /api/subscribers/10`,
   `DELETE /api/subscribers/12`), confirmed both now 404.

Net result: the full three-email sequence was verified end to end for both
lists, delays restored to production values, workflow left active, no test
data left behind.

## Failure modes / operating notes

- **Pausing the sequence:** deactivate the workflow
  (`POST /api/v1/workflows/3cAy8jmJlC7goDLC/deactivate`). Subscribers stop
  advancing but keep their current `welcome_step`; reactivating resumes from
  wherever each subscriber was.
- **Listmonk down:** the GET/POST/PUT calls fail; `onError: continueErrorOutput`
  on the tx-send and subscriber-update nodes routes those failures to the
  Telegram error branch rather than crashing the execution. No retry logic:
  the next 15-minute poll re-evaluates and re-attempts naturally, since
  `welcome_step`/`welcome_last_at` won't have advanced.
- **Credential rotation:** update the `listmonk-api-bot` credential's `password`
  field via `PUT /api/v1/credentials/{id}` (or the n8n editor). No node
  changes needed; they all reference the credential by id.
- **Delivery confirmation gap:** see node 6's "Known limitation" above.
  `welcome_step` advancing means Listmonk accepted the tx request, not that
  the email was necessarily delivered. Cross-check the Listmonk container
  logs (`docker compose logs listmonk | grep manager.go`) if delivery is
  ever in doubt.
