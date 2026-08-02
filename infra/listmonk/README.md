# Listmonk deployment runbook

Newsletter platform for calebbolden.com. Lives at `https://lists.calebbolden.com`,
deployed on the Hetzner production server (`root@5.78.121.71`) at `/opt/listmonk`,
routed through the shared Caddy instance at `/opt/caddy`.

## Architecture

- `listmonk-db` — Postgres 16, holds subscriber/campaign data in the `listmonk-data`
  named volume.
- `listmonk` — the Listmonk app server, listens on `0.0.0.0:9000` inside the
  container.
- Both containers run in the `listmonk` compose project on the server (`/opt/listmonk`).
- The `listmonk` service also joins the `listmonk_public` external Docker network,
  which the shared Caddy container also joins, so Caddy can reach it by container
  name (`listmonk-listmonk-1:9000`) without exposing a host port.
- Shared Caddy (`/opt/caddy/Caddyfile`) proxies `lists.calebbolden.com` to
  `listmonk-listmonk-1:9000` and terminates TLS via Let's Encrypt (TLS-ALPN-01 /
  HTTP-01, same pattern as the other sites on that Caddy instance).

## Secrets

`LISTMONK_DB_PASSWORD`, `LISTMONK_ADMIN_USER`, `LISTMONK_ADMIN_PASSWORD`,
`LISTMONK_API_USER`, and `LISTMONK_API_TOKEN` live in `~/.dev-secrets.env`
locally. They are **not** committed anywhere. `config.toml`
(the real one, built from `config.toml.example` with secrets filled in) lives only
on the server at `/opt/listmonk/config.toml` — never commit it.

> Note: as of Listmonk v6.2.0, `admin_username`/`admin_password` in `config.toml`
> are deprecated and ignored (Listmonk logs a warning on startup). The superadmin
> user is instead seeded **headlessly at install time** via the `LISTMONK_ADMIN_USER`
> / `LISTMONK_ADMIN_PASSWORD` **process environment variables** read by
> `cmd/install.go` (`os.Getenv`, not the config file) — this only runs during
> `--install`, not on normal startup. `infra/listmonk/docker-compose.yml` passes
> these through to the `listmonk` service via `${LISTMONK_ADMIN_USER}` /
> `${LISTMONK_ADMIN_PASSWORD}` interpolation, so they must be exported in the shell
> that runs `docker compose up` / `docker compose run` (e.g. `source
> ~/.dev-secrets.env` first). If the instance was already installed without these
> set (no superadmin exists), re-seed by wiping and reinstalling — safe only if
> there is no real subscriber/campaign data to lose:
> `docker compose down -v && docker compose up -d`, then re-run the install step
> below with `LISTMONK_ADMIN_USER`/`LISTMONK_ADMIN_PASSWORD` exported. Verify
> headlessly with `curl -u "admin:$LISTMONK_ADMIN_PASSWORD"
> https://lists.calebbolden.com/api/settings` (expect `200` + JSON, not `401`).

## Fresh deploy

```bash
# 1. Generate secrets (only if not already in ~/.dev-secrets.env)
openssl rand -hex 24   # LISTMONK_DB_PASSWORD
openssl rand -hex 24   # LISTMONK_ADMIN_PASSWORD
# append both, plus LISTMONK_ADMIN_USER=admin, to ~/.dev-secrets.env

# 2. DNS (Cloudflare, proxied:false so Caddy can issue TLS-ALPN/HTTP-01 certs directly)
source ~/.dev-secrets.env
ZONE_ID=$(curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones?name=calebbolden.com" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
curl -s -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -d '{"type":"A","name":"lists","content":"5.78.121.71","proxied":false,"ttl":300}'

# 3. Ship the compose file and a real config.toml (built locally from
#    config.toml.example with secrets substituted) to the server
ssh root@5.78.121.71 'mkdir -p /opt/listmonk'
rsync -az infra/listmonk/docker-compose.yml root@5.78.121.71:/opt/listmonk/
rsync -az /tmp/listmonk-config.toml root@5.78.121.71:/opt/listmonk/config.toml
rm -f /tmp/listmonk-config.toml   # delete the local temp copy with real secrets

# 4. Bring the stack up and install the schema (all three env vars must be set —
#    LISTMONK_ADMIN_USER/PASSWORD seed the superadmin headlessly at install time)
ssh root@5.78.121.71 "cd /opt/listmonk && LISTMONK_DB_PASSWORD='<value>' LISTMONK_ADMIN_USER='admin' LISTMONK_ADMIN_PASSWORD='<value>' docker compose up -d"
# schema install must run via 'compose run', not 'compose exec' — the listmonk
# service crash-loops until the schema exists, so exec can race a restarting container:
ssh root@5.78.121.71 "cd /opt/listmonk && LISTMONK_DB_PASSWORD='<value>' LISTMONK_ADMIN_USER='admin' LISTMONK_ADMIN_PASSWORD='<value>' docker compose run --rm listmonk ./listmonk --install --yes"
ssh root@5.78.121.71 "cd /opt/listmonk && LISTMONK_DB_PASSWORD='<value>' LISTMONK_ADMIN_USER='admin' LISTMONK_ADMIN_PASSWORD='<value>' docker compose up -d"

# 5. Wire shared Caddy — append this exact block to /opt/caddy/Caddyfile
#    (verbatim from the deployed production Caddyfile, so a disaster-recovery
#    rebuild reproduces it exactly — see the block below the shell commands).
#    Add listmonk_public as an external network in /opt/caddy/docker-compose.yml
#    (same pattern as vora_vora-public / chapterhq_chapterhq), then:
ssh root@5.78.121.71 'cd /opt/caddy && docker compose up -d'
ssh root@5.78.121.71 'docker exec shared-caddy caddy reload --config /etc/caddy/Caddyfile'

# 6. Verify
curl -s -o /dev/null -w "%{http_code}" https://lists.calebbolden.com/admin/login   # expect 200
```

The `lists.calebbolden.com` block to append to `/opt/caddy/Caddyfile` (verbatim,
matches the existing `calebbolden.com` block's security-header pattern):

```caddyfile
lists.calebbolden.com {
	reverse_proxy listmonk-listmonk-1:9000
	encode gzip zstd
	header {
		X-Content-Type-Options nosniff
		X-Frame-Options DENY
		Referrer-Policy strict-origin-when-cross-origin
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		-Server
	}
}
```

Confirm the real listmonk container name with `docker ps` after `docker compose up -d`
before writing the Caddyfile block — the compose project name (and therefore the
container name) depends on the directory name compose was run from.

## Upgrade

```bash
ssh root@5.78.121.71 'cd /opt/listmonk && docker compose pull && docker compose up -d'
```

Check the [Listmonk changelog](https://github.com/knadh/listmonk/releases) for
breaking config changes before upgrading across major versions.

## Backup

```bash
ssh root@5.78.121.71 'cd /opt/listmonk && docker compose exec listmonk-db pg_dump -U listmonk listmonk > backup.sql'
scp root@5.78.121.71:/opt/listmonk/backup.sql ./listmonk-backup-$(date +%Y%m%d).sql
```

Restore with `psql -U listmonk listmonk < backup.sql` against a running
`listmonk-db` container.

**Restore-tested (Task 7, 2026-08-02).** A backup that's never been restored
doesn't exist — verified by actually restoring one. Took a fresh dump via
the command above, then restored it into a disposable `postgres:16-alpine`
container (`docker run -d --name listmonk-restore-test -e
POSTGRES_USER=listmonk -e POSTGRES_PASSWORD=<scratch> -e
POSTGRES_DB=listmonk postgres:16-alpine`, `docker cp` the dump in, `psql -U
listmonk -d listmonk -f backup.sql`). Restore completed with no `ERROR`
lines in the output. Verified present afterward: lists `3`/`4` (`The Missed
Call`/`The Workflow Brief`), and `tx` templates `5`-`10` (the six welcome
emails) plus `11` (`scorecard`). Container destroyed immediately after
(`docker rm -f listmonk-restore-test`).

Ran on the Hetzner server itself rather than a local container — this
session's local Docker Desktop would not finish starting (backend process
launched and exited repeatedly over ~10 minutes with no error surfaced;
looks like a VM-backend startup issue in that sandboxed session, not a
Listmonk or backup problem). The scratch container was still a genuinely
separate Postgres instance built fresh from the public `postgres:16-alpine`
image, not the production `listmonk-db` container, so the restore proof
itself is not weakened — only the exact host it ran on differs from the
letter of the runbook. If reproducing locally, the same commands work
verbatim against Docker Desktop or any other local Docker host.

## SMTP relay, API user, and lists (Task 2)

SMTP is configured entirely through `GET`/`PUT /api/settings` (no admin UI —
see the auth gotcha below). Current SMTP relay: **SendGrid**
(`smtp.sendgrid.net:587`, STARTTLS, user `apikey`, password `SENDGRID_API_KEY`),
default from-address `Caleb Bolden <caleb@calebbolden.com>`.

### Mail delivery: resolved, Resend live (history)

As of 2026-08-01, both providers were auth-verified but blocked from
delivering: Resend's `RESEND_API_KEY` was a send-only restricted key that
couldn't verify the domain via API (`GET /domains` → 401
`restricted_api_key`), and `calebbolden.com` had never been added in the
Resend dashboard. SendGrid (the fallback, a shared Vora account) had SMTP
auth and domain authentication working but zero send credits (`451
Authentication failed: Maximum credits exceeded`).

The founder added and verified `calebbolden.com` in the Resend dashboard on
2026-08-02. `smtp[0]` now points at `smtp.resend.com:587` / user `resend` /
password `RESEND_API_KEY` (full-access key, not the earlier restricted
one), confirmed live via `GET /api/settings` and the container log
(`init.go:687: initialized email (SMTP) messenger: resend@smtp.resend.com`).
Task 7's cold-path test (see `task-7-report.md`) confirms end-to-end
delivery: confirmation + welcome-1 sends both accepted by Listmonk with no
SMTP error in the container logs.

**SendGrid remains configured as a fallback, not funded.** Domain
authentication is still valid (`POST /v3/whitelabel/domains` id `32174450`,
CNAMEs in Cloudflare, `validate` → `true`); the account still has 0 send
credits. If Resend has an outage or the account needs replacing, the swap
back to SendGrid is a `smtp[0]` field change only — same `GET`/`PUT
/api/settings` pattern used throughout this section, no code change — once
the SendGrid account has credits (upgrade the plan or supply a funded key).

### API user

`api-bot` (id 3 — recreated once, post-review, to rotate a token that had
leaked into a report; Listmonk v6.2.0 has no in-place token-regenerate
endpoint, so rotation is delete `/api/users/{id}` + recreate) has user role
`api-bot-role` (id 2) with
permissions `lists:get_all`, `lists:manage_all`, `subscribers:get_all`,
`subscribers:manage`, `subscribers:import`, `tx:send`. Created via
`POST /api/roles/users` then `POST /api/users` with `user_role_id`. Credentials
in `~/.dev-secrets.env` as `LISTMONK_API_USER=api-bot` /
`LISTMONK_API_TOKEN=<token>`. Verified with
`curl -u "$LISTMONK_API_USER:$LISTMONK_API_TOKEN" https://lists.calebbolden.com/api/lists` → 200.

### Lists

Created by `infra/listmonk/bootstrap.sh` (idempotent — re-running skips
already-present lists by name):

| ID | Name | Tag | Opt-in |
|----|------|-----|--------|
| 3 | The Missed Call | owners | double |
| 4 | The Workflow Brief | operators | double |

IDs 1 and 2 were Listmonk's own demo seed data ("Default list" and "Opt-in
list", plus their sample subscribers `john@example.com` / `anon@example.com`)
— deleted in Task 7 via `DELETE /api/subscribers/{id}` then
`DELETE /api/lists/{id}` so subscriber/list stats stay clean. Lists 3 and 4
are the only lists in the instance now.

## Failure modes and recovery (Task 7)

- **Listmonk is down or unreachable.** The hub pages' `POST /api/subscribe`
  route (`app/api/subscribe/route.ts`) wraps the `fetch()` to
  `LISTMONK_API_URL` in a try/catch: a network failure (connection refused,
  timeout after 10s, DNS failure) returns `502 {"ok": false, "error":
  "upstream"}` to the browser rather than crashing or hanging. A non-2xx,
  non-409 response from Listmonk (e.g. `500`) is treated the same way. The
  form on the hub page should surface this as a generic "something went
  wrong, try again" state — no code change needed to recover, just bring
  Listmonk back (`ssh root@5.78.121.71 'cd /opt/listmonk && docker compose
  up -d'`, or check `docker logs listmonk-listmonk-1` / `docker compose ps`
  for why it's down). A `409` (already subscribed) is treated as success by
  design — this is intentional idempotency, not a failure mode.
- **Pausing a welcome or scorecard sequence.** Deactivate the n8n workflow
  rather than deleting it or touching Listmonk: `POST
  /api/v1/workflows/{id}/deactivate` (resume with `POST
  /api/v1/workflows/{id}/activate`), or toggle the "Active" switch in the
  n8n editor (`https://homelab.bream-python.ts.net:5678`). A plain `PUT
  /api/v1/workflows/{id}` with `active: false` in the body does **not**
  reliably take effect on this n8n version — both `n8n-welcome-flow.md` and
  `n8n-scorecard-flow.md` record that deactivating first (via the dedicated
  endpoint) was required before a `PUT` would re-register the schedule;
  use the `/deactivate` and `/activate` endpoints directly instead of a
  `PUT` toggle. Welcome sequences:
  `founder-brand-welcome-sequences` (id `3cAy8jmJlC7goDLC`). Scorecard:
  `founder-brand-weekly-scorecard` (id `aVqZwXSmwzBhw6lu`). Both workflows
  only *read* subscriber state from Listmonk on each poll/run and write
  back `welcome_step`/`welcome_last_at` attribs or send a tx email —
  deactivating stops all of that immediately with nothing left mid-flight
  to clean up. Reactivating resumes from whatever state
  `welcome_step`/`welcome_last_at` are already in; no backfill logic exists
  for a pause window, so subscribers simply pick up their next due step
  once the poll resumes.
- **Swapping Resend for SendGrid (or any other SMTP relay).** SMTP settings
  only, no code or workflow change: authenticate via the admin
  session-cookie workaround (Gotchas below), then `GET /api/settings`,
  edit `smtp[0]` (`host`, `port`, `username`, `password`, `auth_protocol`,
  `from_email`), `PUT /api/settings` with the full settings object back.
  SendGrid's values (once the account has send credits — see "Mail
  delivery" above): `host: smtp.sendgrid.net`, `port: 587`, `username:
  apikey`, `password: $SENDGRID_API_KEY`. No Listmonk restart is needed —
  the `init.go` log line confirming the new messenger appears within
  seconds of the `PUT`.

## Gotchas

- **Zero-downtime Caddy changes**: prefer `docker exec shared-caddy caddy reload
  --config /etc/caddy/Caddyfile` over `docker compose restart caddy`. Note that
  adding a new network to the shared Caddy service in `docker-compose.yml` forces
  `docker compose up -d` to recreate the container (Compose can't hot-attach a
  declared network), which is a few seconds of restart, not a full outage — cert
  data persists in the `caddy-data` volume so other sites don't need to
  re-provision TLS. Still confirm other prod domains return 200 immediately after.
- **ACME failures right after DNS changes**: if Caddy logs show ACME/HTTP-01
  failures for `lists.calebbolden.com`, DNS probably hasn't propagated yet. Wait
  a few minutes and re-run the reload. (Same gotcha hit during the Vora migration.)
- **Schema install races the restart loop**: `docker compose exec` can fail with
  "container is restarting" if listmonk crash-loops before the schema exists. Use
  `docker compose run --rm listmonk ./listmonk --install --yes` instead — it runs
  in a fresh, non-restarting container.
- **admin_username / admin_password are deprecated** in config.toml as of
  Listmonk v6.2.0; use the `LISTMONK_ADMIN_USER` / `LISTMONK_ADMIN_PASSWORD`
  process env vars instead — see the Secrets section above.
- **Superadmin seeding only happens during `--install`**: if you bring the stack
  up without those env vars set, no admin user is created and there is no
  in-place way to seed one afterward — you must wipe (`down -v`) and reinstall
  with the env vars set. Only do this when there's no real data to lose.
  `docker compose down -v` on `/opt/listmonk` also removes the (non-external)
  `listmonk_public` network; if shared Caddy is still attached to it, Docker
  refuses to remove the network ("resource is still in use") and leaves it
  intact, so Caddy's connection survives. `docker compose up -d` afterward
  rejoins the same network by name — no need to touch `/opt/caddy` in that case.
- **`admin`'s HTTP Basic Auth on `/api/*` is unreliable — use a session cookie
  instead.** `curl -u "admin:$LISTMONK_ADMIN_PASSWORD"` worked once right after
  install, then started returning `403 {"message":"invalid API credentials"}`
  on every subsequent call, even verified directly against the container
  (bypassing Caddy/Cloudflare) and with the password confirmed correct via
  `bcrypt.checkpw` against the DB hash. The reliable path for admin-privileged
  API calls (e.g. `PUT /api/settings`) is a session cookie: `curl -c
  cookies.txt -X POST https://lists.calebbolden.com/admin/login
  --data-urlencode "username=admin" --data-urlencode "password=$LISTMONK_ADMIN_PASSWORD"`
  (expect `302`), then pass `-b cookies.txt` on subsequent calls. The session
  is short-lived (observed expiring within roughly a minute of inactivity) —
  re-login immediately before each admin-privileged call rather than reusing
  an older cookie jar. `api-bot`-type users are unaffected — their Basic Auth
  token works consistently.
- **Roles endpoints are at `/api/roles/users` and `/api/roles/lists`**, not
  `/api/roles` (404) — undocumented in the brief, discovered by probing.
- **`POST /api/tx` requires the subscriber to already exist** — sending to an
  address with no subscriber record 400s with `Subscriber (0: ...) not found`.
  For a one-off smoke-test address, `POST /api/subscribers` first (status
  `enabled`, empty `lists`) then retry the tx send.
- **Shared third-party sender accounts can silently have zero quota.** The
  Vora SendGrid account used as the SMTP fallback here is on the `free` plan
  with `remain: 0, total: 0` send credits (`GET
  https://api.sendgrid.com/v3/user/credits`) — domain authentication and SMTP
  auth both succeed, but every send 451s with "Maximum credits exceeded".
  Check `/v3/user/credits` before assuming a shared relay account has
  headroom.
