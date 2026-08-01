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

## SMTP relay, API user, and lists (Task 2)

SMTP is configured entirely through `GET`/`PUT /api/settings` (no admin UI —
see the auth gotcha below). Current SMTP relay: **SendGrid**
(`smtp.sendgrid.net:587`, STARTTLS, user `apikey`, password `SENDGRID_API_KEY`),
default from-address `Caleb Bolden <caleb@calebbolden.com>`.

### MAIL DELIVERY PENDING FOUNDER ACTION

As of 2026-08-01, SMTP relay is fully configured and auth-verified against
both providers, but **neither can currently deliver mail** — both are blocked
on an action only the founder can take:

- **Resend** (the originally specced relay) — `RESEND_API_KEY` in
  `~/.dev-secrets.env` is a send-only restricted key (`GET
  https://api.resend.com/domains` → 401 `restricted_api_key`), so the domain
  cannot be verified via API. `calebbolden.com` has never been added in the
  Resend dashboard (Cloudflare has no Resend DNS records — only Google
  Workspace SPF/DKIM/DMARC). A tx smoke test through Resend SMTP got a clean
  `550 The calebbolden.com domain is not verified` — auth/STARTTLS work fine,
  it's purely the unverified domain. **Founder to-do**: add + verify
  `calebbolden.com` in the Resend dashboard (~10 min, already tracked in the
  project's root `CLAUDE.md`), then swap `smtp[0]` back to
  `smtp.resend.com:587` / user `resend` / password `RESEND_API_KEY`.
- **SendGrid** (fallback, this shared Vora account) — `SENDGRID_API_KEY` has
  full domain-management scope. Domain-authenticated `calebbolden.com` via
  `POST /v3/whitelabel/domains` (id `32174450`, `automatic_security: true`),
  added the 3 returned CNAMEs (`mail_cname`, `dkim1`, `dkim2`) to Cloudflare,
  polled `/v3/whitelabel/domains/32174450/validate` → `valid: true` within
  ~20s. SMTP auth against `smtp.sendgrid.net` succeeds, but the account has
  **zero send credits**: `GET /v3/user/credits` → `{"remain":0,"total":0,
  "used":0,"is_hard_limit":true}`, `GET /v3/user/account` → `{"type":"free"}`.
  Tx smoke test got `451 Authentication failed: Maximum credits exceeded`.
  **Founder to-do**: upgrade/refill this SendGrid account's plan, or provide a
  different key with quota.

Whichever provider gets unblocked first, the fix is a `smtp[0]` field swap via
the same GET/PUT pattern used above — no code change needed.

### API user

`api-bot` (id 2, type `api`) has user role `api-bot-role` (id 2) with
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

(IDs 1 and 2 are Listmonk's own demo seed data — "Default list" and "Opt-in
list" — left untouched.)

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
