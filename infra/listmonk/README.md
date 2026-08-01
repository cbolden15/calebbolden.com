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

`LISTMONK_DB_PASSWORD`, `LISTMONK_ADMIN_USER`, and `LISTMONK_ADMIN_PASSWORD` live
in `~/.dev-secrets.env` locally. They are **not** committed anywhere. `config.toml`
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
