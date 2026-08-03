# n8n weekly scorecard workflow

Node-by-node doc for `founder-brand-weekly-scorecard`. Mirrors the format of
`n8n-welcome-flow.md` — this file is the source of truth; re-derive the JSON
from it (or `GET /api/v1/workflows/{id}`) if the two disagree.

- **n8n instance:** homelab. The public REST API only answered reliably from
  this session over SSH + `curl` to `http://localhost:5678` on the homelab
  box itself (`ssh cbolden15@homelab`, container `heal-n8n`). Both
  `https://homelab.bream-python.ts.net/n8n` and
  `https://100.96.119.69:5678` (and `https://homelab.bream-python.ts.net:5678`,
  the host+port combo `n8n-welcome-flow.md` recorded as working for Task 5)
  failed TLS handshake from this Mac with `tlsv1 alert internal error` on both
  `curl`/LibreSSL and Python's `ssl` module, even though `openssl s_client`
  against the same host presented a valid, current Let's Encrypt cert for
  `homelab.bream-python.ts.net` — looks like a local client/TLS-stack quirk on
  this machine, not a server problem, but flagging it in case a future agent
  hits the same wall and wants to skip straight to the SSH workaround.
- **API key:** `N8N_HOMELAB_API_KEY` in `~/.dev-secrets.env` — same instance
  and key as `founder-brand-welcome-sequences`. (The task-6 brief said
  "`N8N_API_KEY`"; that key 401s against this instance, same gotcha
  `n8n-welcome-flow.md` already recorded for Task 5. Use
  `N8N_HOMELAB_API_KEY`.)
- **Workflow ID:** `aVqZwXSmwzBhw6lu`
- **Workflow name:** `founder-brand-weekly-scorecard`
- **Status:** active
- **Credential:** reused `listmonk-api-bot` (id `hBvoOrVMOmeEw4xe`), the same
  `httpBasicAuth` credential Task 5 created — every HTTP Request node that
  talks to Listmonk references it by id, nothing inlined.
- **Workflow settings:** `settings.timezone = "America/Chicago"`. The
  Schedule Trigger's cron expression is evaluated in this timezone, not UTC —
  confirmed the hard way during manual verification (see below).

## Permission change: `api-bot-role` gained `campaigns:get`

`api-bot` could not read campaigns before this task (`GET /api/campaigns` →
`403`). Fixed via the session-cookie admin workaround
(`infra/listmonk/README.md` gotchas — `admin` Basic Auth is unreliable, so
login to `/admin/login`, get a cookie, re-login before each admin call since
it expires in roughly a minute):

1. `GET /api/roles/users` (admin cookie) — probed the Super Admin role (id 1)
   for the exact permission strings, since they're undocumented. Found:
   `campaigns:get`, `campaigns:get_all`, `campaigns:get_analytics`,
   `campaigns:manage`, `campaigns:manage_all`, `campaigns:send`.
2. `PUT /api/roles/users/2` (admin cookie), added `campaigns:get` to
   `api-bot-role`'s existing permission list (`lists:get_all`,
   `lists:manage_all`, `subscribers:get_all`, `subscribers:manage`,
   `subscribers:import`, `tx:send`).
3. Verified: `GET /api/campaigns?per_page=5&order_by=created_at&order=DESC`
   with `api-bot` Basic Auth now returns `200`. `campaigns:get` alone was
   sufficient — didn't need `campaigns:get_all`.

## tx template (Step 2)

Created via `POST /api/templates` using the same admin session-cookie
workaround (`api-bot` still lacks `templates:manage`).

| Template ID | Name | Subject | Notes |
|---|---|---|---|
| 11 | `scorecard` | `Weekly scorecard — {{ .Tx.Data.week_of }}` | Body is a plain HTML shell (same visual pattern as the `welcome-*` templates) with three `<p>` lines bound to `{{ .Tx.Data.line1/line2/line3 }}` and a `Week of {{ .Tx.Data.week_of }}` header. |

## Recipient subscriber

`POST /api/tx` 400s if the recipient has no subscriber record
(`infra/listmonk/README.md` gotcha). `caleb@calebbolden.com` didn't exist —
created it: subscriber id `13`, `status: enabled`, `lists: []` (not
subscribed to list 3 or 4, per the task brief's instruction not to
self-subscribe the founder).

## List IDs

Same as Task 5: `owners` = list `3` ("The Missed Call"), `operators` = list
`4` ("The Workflow Brief"). Lists `1`/`2` (Listmonk's stock "Default
list"/"Opt-in list") are filtered out by construction — the Code node only
ever looks up ids `3` and `4`.

## Nodes

1. **`Weekly Monday 07:00 CT`** — `n8n-nodes-base.scheduleTrigger`, cron
   `0 7 * * 1`, evaluated in the workflow's `America/Chicago` timezone
   setting. Entry point; fans out to the three nodes below.

2. **`GET lists (owners+operators)`** — `n8n-nodes-base.httpRequest`, GET
   `https://lists.calebbolden.com/api/lists?per_page=all`. Auth: generic
   credential type, `listmonk-api-bot`. Returns subscriber counts for every
   list; the Code node picks out ids `3`/`4` and ignores the rest.

3. **`GET campaigns (recent)`** — same auth, GET
   `https://lists.calebbolden.com/api/campaigns?per_page=5&order_by=created_at&order=DESC`.
   Runs in parallel with node 2.

4. **`Manual scorecard inputs`** — `n8n-nodes-base.set`, two string fields:
   `clinics_line` and `quote_log_line`, currently placeholder text
   (`[edit in n8n: clinics status]` / `[edit in n8n: quote log count]`). This
   is the "manual variable" the brief specs for line 3 — edit these two
   field *values* directly on this node in the n8n editor each week; nothing
   else in the workflow needs to change. Runs in parallel with nodes 2–3.

5. **`Merge 3 branches`** — `n8n-nodes-base.merge`, mode `append`, 3 inputs.
   Combines the three branches so the Code node has a single upstream
   dependency to run after. The Code node doesn't actually read from the
   merged stream — see below.

6. **`Format scorecard + tx payload`** — `n8n-nodes-base.code`,
   `runOnceForAllItems`. Pulls each branch's output directly by node name
   (`$('GET lists (owners+operators)')`, `$('GET campaigns (recent)')`,
   `$('Manual scorecard inputs')`) rather than reading the merged item list,
   to avoid depending on `Merge`'s append ordering. Logic:
   - **Delta:** week-over-week subscriber-count delta is stored in
     `$getWorkflowStaticData('global').lastCounts[listId]`, set at the end of
     every run so the *next* Monday's run has something to diff against. On
     the very first run (no prior static data) delta reads as `+0` — this is
     expected and will start reflecting real deltas from the second run
     (2026-08-10) onward.
   - **Open rate:** finds the most recent campaign in the (already
     `created_at DESC`-sorted) campaigns list where `sent > 0` and the
     campaign's `lists` array includes the target list id; open rate =
     `views / sent * 100`. If no such campaign exists yet, renders `N/A`.
   - **Line 3:** `Clinics: {clinics_line} · Quote log entries this week:
     {quote_log_line}` from the Set node's values, verbatim.
   - Builds the final `POST /api/tx` body: `subscriber_email`,
     `template_id: 11`, `content_type: "html"`, and `data: {week_of, line1,
     line2, line3}`.

7. **`POST tx send`** — `n8n-nodes-base.httpRequest`, POST
   `https://lists.calebbolden.com/api/tx`, `jsonBody: "={{ JSON.stringify($json) }}"`,
   same `listmonk-api-bot` credential.

## Connections

Pulled from `GET /api/v1/workflows/aVqZwXSmwzBhw6lu` for ground truth (live
workflow, not a paraphrase). `Merge 3 branches` is `mode: append`,
`numberInputs: 3` — the three fan-out branches land on inputs 0/1/2
respectively, in the order listed below.

```
Weekly Monday 07:00 CT
  -> GET lists (owners+operators) -> Merge 3 branches (input 0)
  -> GET campaigns (recent)       -> Merge 3 branches (input 1)
  -> Manual scorecard inputs      -> Merge 3 branches (input 2)
Merge 3 branches -> Format scorecard + tx payload -> POST tx send
```

Note: as documented in node 6 above, `Format scorecard + tx payload` doesn't
actually consume `Merge 3 branches`'s combined item list — it reads each
upstream branch directly by node name (`$('GET lists (owners+operators)')`,
etc.) to avoid depending on append ordering. The Merge node exists only to
give the Code node a single upstream dependency to run after all three
branches finish, not as a data source.

## Manual verification (Step 3)

n8n's public API has no "run now" endpoint for schedule-only workflows
(`POST .../run` and `.../execute` both `405`; the `n8n execute` CLI inside
the container also fails — it tries to spin up a second Task Broker on the
already-bound port 5679). Worked around it by temporarily overriding the
cron expression to fire a few minutes out, in Chicago local time (the
timezone setting bit us once: a UTC-based test time silently fired 5 hours
later than expected, since the trigger evaluates in `America/Chicago`, not
UTC — this is also proof the real `0 7 * * 1` schedule will fire at 07:00
*Chicago* time as specced, not 07:00 UTC), then deactivate → PUT → activate
(an in-place PUT while active did not re-register the cron; deactivating
first was required), waited for the fire, and restored `0 7 * * 1` +
reactivated immediately after confirming.

**Execution `16508`** — started `2026-08-02T03:35:00.029Z` UTC
(`2026-08-01 22:35:00 CDT`), finished `2026-08-02T03:35:01.357Z`, status
`success`. Every node ran; the final `POST tx send` node's output was
`{"data": true}` (Listmonk accepted the send). Rendered content for this
run:

```
The Missed Call: 1 subs (+0 this week) · open rate last issue N/A
The Workflow Brief: 1 subs (+0 this week) · open rate last issue N/A
Clinics: [edit in n8n: clinics status] · Quote log entries this week: [edit in n8n: quote log count]
```

Subscriber counts are `1` (only the probe subscribers Task 5 created) and
open rate is `N/A` on both lines because no real campaign has been sent to
list 3 or 4 yet (Listmonk currently has one seed "Test campaign" targeting
list 1, `sent: 0`) — expected given where the project is, not a bug.

**Mail relay:** `infra/listmonk/README.md`'s "Mail delivery: resolved,
Resend live (history)" section (originally written, and titled
differently, earlier in this same build) recorded that neither Resend nor
SendGrid could deliver as of the time it was written. That's now resolved —
`GET /api/settings` shows `smtp[0]` active and pointed at
`smtp.resend.com:587` / user `resend`, and the container log confirms it
reloaded onto that config at `2026/08/02 01:53:10`
(`init.go:687: initialized email (SMTP) messenger: resend@smtp.resend.com`).
`docker logs listmonk-listmonk-1` shows **no SMTP error** in the minutes
around the `03:35:00–03:35:01` scorecard send (compare to the earlier
SendGrid/unverified-Resend period, where every failed send logged a
`manager.go:578: error sending message ...` line within seconds) — the
absence of an error line, plus the `{"data": true}` accept from the tx API,
is the available evidence the send went through. This session has no access
to the destination inbox or the Resend dashboard (its API key is send-only,
`GET /domains` 401s per the README) to confirm final inbox delivery
independently; the README's stale note should probably be updated by
whoever owns that file next (Task 5's agent is still active in this
worktree — flagging rather than editing to avoid a merge collision).

## Known limitations

- **First-run delta is always `+0`** — no prior static data to diff against.
  Real deltas start appearing from the second Monday run.
- **No campaigns sent to lists 3/4 yet** — both `open rate last issue` lines
  will read `N/A` until a real campaign goes out to owners or operators.
- **Manual lines are truly manual** — `clinics_line` and `quote_log_line`
  need a human to update the `Manual scorecard inputs` node in the n8n
  editor each week. By design, per the brief (three lines, not a dashboard).

## Scorecard additions (Task 8)

Two new lines, documented here so they can be wired into the workflow once
the query below is verified. This section records what the lines compute
and where the numbers come from. No n8n nodes were built for this task;
adding the actual `Format scorecard + tx payload` Code node logic, and a
node to call Vora's `social/analytics`, is follow-up work.

## Assessment completions metric (Task 8)

Counts subscribers with `attribs.source = 'ai-readiness'`, created in the
trailing 7 days, split by `attribs.band` (`foundations`, `pilot`,
`sequence`). Reported weekly on the Monday scorecard line, and rolled up
into a monthly total for the gates below.

Query form, using the same JSONB attribute path Task 2 wrote the attributes
with:

```
query=subscribers.attribs->>'source' = 'ai-readiness' AND subscribers.created_at >= now() - interval '7 days'
```

Per-band split (one call per band, substituting the value):

```
query=subscribers.attribs->>'source' = 'ai-readiness' AND subscribers.attribs->>'band' = 'foundations' AND subscribers.created_at >= now() - interval '7 days'
```

**Unverified against live Listmonk.** Attempted:

```bash
source ~/.dev-secrets.env
curl -s -u "$LISTMONK_API_USER:$LISTMONK_API_TOKEN" \
  --data-urlencode "query=subscribers.attribs->>'source' = 'ai-readiness'" \
  -G "https://lists.calebbolden.com/api/subscribers?per_page=1"
```

Response: `403`, body `{"message":"Permission denied: subscribers:sql_query"}`.
This is the same permission gap `n8n-welcome-flow.md` recorded for Task 5's
original design: `api-bot-role` (id 2) does not include
`subscribers:sql_query` in its permission list. This line stays unverified
until `subscribers:sql_query` is granted to `api-bot-role`, using the same
admin session-cookie workaround (`infra/listmonk/README.md` gotchas) this
doc used above to grant `campaigns:get`. Granting it is a decision for
whoever owns the live Listmonk instance to make.

## Follower count metric (Task 8)

One count per channel (LinkedIn, Instagram, YouTube, and the fourth channel
from the account-setup runbook), pulled from Vora's `social/analytics`
endpoint. Reported monthly on the scorecard. The assessment completions
line above is reported weekly. This line does not read from Listmonk.

## Metrics excluded from this scorecard (Task 8)

Views, likes, impressions, and engagement rate are deliberately left off.
The two tracked metrics are assessment completions and channel follower
counts, above. This exclusion was a decision made when the metrics were
chosen. Keep it in place; do not add those lines back.

## Gates

Recorded next to the metrics that trigger them, evaluated per channel from
the monthly rollup of the assessment completions metric above:

- **Continued investment.** 10 or more assessment completions per month,
  for two consecutive months, earns a channel continued investment.
- **Drop.** Fewer than 3 assessment completions per month, for three
  consecutive months, means the channel gets dropped from the rotation.
  Below this threshold the correct response is removal; time spent tuning
  content for that channel is better spent elsewhere. Instagram is the
  channel most likely to hit this first. If it does, removing it is the
  gate working as intended.
- **Whole-effort kill criterion.** If the monthly filming batch gets
  skipped four or more times within the first three months, the response
  is to cut the whole effort down to LinkedIn text-only.
- **Pressure valve.** In a week where a Vora sprint overloads the founder's
  time, video is the first thing cut and the LinkedIn essay is the last.
