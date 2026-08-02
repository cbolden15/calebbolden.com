# Founder-Brand Engine Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the two-newsletter engine: self-hosted Listmonk on the Hetzner server behind shared Caddy, two lists with double opt-in, signup hub pages on calebbolden.com, and n8n-driven 3-email welcome sequences relayed through Resend.

**Architecture:** Listmonk (Docker + Postgres) runs at `/opt/listmonk` on Hetzner (5.78.121.71), exposed as `lists.calebbolden.com` via the shared Caddy at `/opt/caddy`. calebbolden.com (Next.js, self-hosted at /opt/calebbolden on the same Hetzner server, container calebbolden-site behind the shared Caddy; deployed via git archive | ssh tar + docker compose build — see repo README) gets two hub pages whose forms POST to a Next.js API route that calls the Listmonk API server-side (credentials never reach the browser). n8n (already running on the homelab for AI Life Agent) polls Listmonk outbound every 15 minutes and fires welcome emails via Listmonk's transactional API, tracking progress in subscriber attributes — no inbound webhook to the homelab needed. All mail relays through Resend SMTP; deliverability reputation is Resend's.

**Tech Stack:** Listmonk (latest stable), PostgreSQL 16, Caddy 2 (existing shared instance), Next.js (existing calebbolden.com), n8n (existing homelab instance), Resend SMTP, Cloudflare DNS API.

## Global Constraints

- Newsletter working names (founder may rename before launch; treat as config, not hardcode): owners list = **"The Missed Call"**, operators list = **"The Workflow Brief"**. Slugs `owners` and `operators` are permanent regardless of display-name changes.
- List promises (verbatim from spec): owners = "Stop losing jobs you already earned"; operators = workflow automation + AI readiness.
- No fabricated claims anywhere in page or email copy: no testimonials, no subscriber counts, no results claims.
- Double opt-in ON for both lists.
- Secrets come from `~/.dev-secrets.env` (`RESEND_API_KEY`, `CLOUDFLARE_API_TOKEN`) and new entries added by this plan (`LISTMONK_ADMIN_PASSWORD`, `LISTMONK_API_TOKEN`). Never commit secrets; `/opt/listmonk/config.toml` stays server-side only.
- Git: commit messages via `git commit -F <file>` (never heredocs); prefix `command git` if the zsh `status` collision appears.
- Repo for all committed files: `~/Projects/calebbolden.com` (infra files under `infra/listmonk/`, pages under the existing Next.js app structure — inspect `app/` vs `pages/` layout before creating routes and follow what exists).

---

### Task 1: Listmonk deployment files + DNS

**Files:**
- Create: `infra/listmonk/docker-compose.yml`
- Create: `infra/listmonk/config.toml.example` (real `config.toml` is server-side only)
- Create: `infra/listmonk/README.md` (deploy + upgrade runbook)

**Interfaces:**
- Produces: Listmonk admin + API at `https://lists.calebbolden.com` (used by Tasks 2, 3, 5); server path `/opt/listmonk`.

- [ ] **Step 1: Write the compose file**

`infra/listmonk/docker-compose.yml`:

```yaml
services:
  listmonk-db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: listmonk
      POSTGRES_PASSWORD: ${LISTMONK_DB_PASSWORD}
      POSTGRES_DB: listmonk
    volumes:
      - listmonk-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U listmonk"]
      interval: 10s
      timeout: 5s
      retries: 5

  listmonk:
    image: listmonk/listmonk:latest
    restart: unless-stopped
    depends_on:
      listmonk-db:
        condition: service_healthy
    volumes:
      - ./config.toml:/listmonk/config.toml
    networks:
      - default
      - caddy-shared

networks:
  caddy-shared:
    name: listmonk_public
    driver: bridge

volumes:
  listmonk-data:
```

- [ ] **Step 2: Write `config.toml.example`**

```toml
[app]
address = "0.0.0.0:9000"
admin_username = "admin"
admin_password = "CHANGE_ME"   # real value in ~/.dev-secrets.env as LISTMONK_ADMIN_PASSWORD

[db]
host = "listmonk-db"
port = 5432
user = "listmonk"
password = "CHANGE_ME"          # matches LISTMONK_DB_PASSWORD
database = "listmonk"
ssl_mode = "disable"
```

- [ ] **Step 3: Generate secrets and record them**

```bash
openssl rand -hex 24   # run twice: LISTMONK_DB_PASSWORD, LISTMONK_ADMIN_PASSWORD
```

Append both to `~/.dev-secrets.env` (`LISTMONK_DB_PASSWORD=...`, `LISTMONK_ADMIN_PASSWORD=...`).

- [ ] **Step 4: Create the DNS record**

```bash
source ~/.dev-secrets.env
ZONE_ID=$(curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones?name=calebbolden.com" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
curl -s -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -d '{"type":"A","name":"lists","content":"5.78.121.71","proxied":false,"ttl":300}'
```

Expected: JSON response with `"success": true`. (`proxied: false` so Caddy can issue the TLS-ALPN cert directly.)

- [ ] **Step 5: Deploy to the server**

```bash
ssh root@5.78.121.71 'mkdir -p /opt/listmonk'
rsync -az infra/listmonk/docker-compose.yml root@5.78.121.71:/opt/listmonk/
# Build real config.toml locally from the example with the generated secrets, then:
rsync -az /tmp/listmonk-config.toml root@5.78.121.71:/opt/listmonk/config.toml
ssh root@5.78.121.71 'cd /opt/listmonk && LISTMONK_DB_PASSWORD=<value> docker compose up -d && sleep 5 && docker compose exec listmonk ./listmonk --install --yes || true && docker compose restart listmonk'
```

Note: `--install --yes` initializes the schema on first run only; the `|| true` keeps re-runs idempotent. Delete `/tmp/listmonk-config.toml` after rsync.

- [ ] **Step 6: Wire shared Caddy**

On the server, append to `/opt/caddy/Caddyfile`:

```
lists.calebbolden.com {
    reverse_proxy listmonk-listmonk-1:9000
}
```

Add `listmonk_public` to the shared Caddy compose's external networks (same pattern as `vora_vora-public` and `chapterhq_chapterhq` already in `/opt/caddy/docker-compose.yml`), then `cd /opt/caddy && docker compose up -d && docker compose restart caddy`.

- [ ] **Step 7: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}" https://lists.calebbolden.com/admin/login
```

Expected: `200`. If Caddy logs show ACME failure, wait for DNS propagation and restart Caddy (known gotcha from the Vora migration).

- [ ] **Step 8: Write the README runbook** — deploy, upgrade (`docker compose pull && up -d`), backup (`docker compose exec listmonk-db pg_dump -U listmonk listmonk > backup.sql`), where secrets live. Commit.

```bash
command git add infra/listmonk/ && command git commit -F /tmp/cm.txt   # msg: "feat: listmonk deployment files + runbook"
```

---

### Task 2: SMTP relay, API token, and the two lists

**Files:**
- Create: `infra/listmonk/bootstrap.sh` (idempotent API bootstrap: lists + opt-in template check)

**Interfaces:**
- Consumes: `https://lists.calebbolden.com` admin from Task 1.
- Produces: list slugs/IDs `owners` and `operators` (double opt-in); API credentials `LISTMONK_API_USER=api-bot` / `LISTMONK_API_TOKEN` in `~/.dev-secrets.env`; SMTP configured. Tasks 3 and 5 consume the token and list IDs.

- [ ] **Step 1: Configure Resend SMTP in the admin UI** (Settings → SMTP): host `smtp.resend.com`, port `587`, STARTTLS, username `resend`, password = `RESEND_API_KEY`. Set default from-address `caleb@calebbolden.com`.

- [ ] **Step 2: Verify the sending domain in Resend** — if `calebbolden.com` is not already verified: fetch required records from `https://api.resend.com/domains` (Bearer `RESEND_API_KEY`), add the returned DKIM/SPF records via the Cloudflare API (same pattern as Task 1 Step 4), poll until status `verified`.

- [ ] **Step 3: Create an API user** in admin (Admin → Users → new user `api-bot`, role with list-manage + subscriber-manage + tx-send permissions; API token type). Append `LISTMONK_API_USER` and `LISTMONK_API_TOKEN` to `~/.dev-secrets.env`.

- [ ] **Step 4: Write `bootstrap.sh`** — creates both lists if absent:

```bash
#!/usr/bin/env bash
set -euo pipefail
source ~/.dev-secrets.env
AUTH="$LISTMONK_API_USER:$LISTMONK_API_TOKEN"
BASE="https://lists.calebbolden.com/api"

create_list() { # name, slug
  existing=$(curl -su "$AUTH" "$BASE/lists?per_page=100" | python3 -c "import sys,json; print(any(l['name']=='$1' for l in json.load(sys.stdin)['data']['results']))")
  if [ "$existing" = "False" ]; then
    curl -su "$AUTH" -X POST "$BASE/lists" -H 'Content-Type: application/json' \
      -d "{\"name\":\"$1\",\"type\":\"public\",\"optin\":\"double\",\"tags\":[\"$2\"]}"
  fi
}
create_list "The Missed Call" owners
create_list "The Workflow Brief" operators
curl -su "$AUTH" "$BASE/lists?per_page=100" | python3 -c "import sys,json; [print(l['id'], l['name'], l['optin']) for l in json.load(sys.stdin)['data']['results']]"
```

- [ ] **Step 5: Run it, verify output** shows both lists with `double` opt-in. Record the two numeric list IDs in `infra/listmonk/README.md`.

- [ ] **Step 6: Manual smoke test** — send a test campaign to yourself from the admin UI; confirm delivery and that SPF/DKIM pass (check message headers). Commit `bootstrap.sh` + README update.

---

### Task 3: Signup API route on calebbolden.com

**Files:**
- Inspect first: repo router style (`app/api/.../route.ts` vs `pages/api/...`) — follow whichever exists.
- Create (app-router form): `app/api/subscribe/route.ts`
- Test: `scripts/test-subscribe.sh` (integration check against local dev)

**Interfaces:**
- Consumes: Listmonk API + token (Task 2). Env vars in the server's /opt/calebbolden/.env (env_file of the compose service) AND `.env.local`: `LISTMONK_API_URL=https://lists.calebbolden.com`, `LISTMONK_API_USER`, `LISTMONK_API_TOKEN`, `LISTMONK_LIST_ID_OWNERS`, `LISTMONK_LIST_ID_OPERATORS`.
- Produces: `POST /api/subscribe` accepting `{email: string, list: "owners"|"operators"}` → `200 {ok:true}` | `400 {ok:false,error}` — consumed by Task 4's forms.

- [ ] **Step 1: Write the integration test first**

`scripts/test-subscribe.sh`:

```bash
#!/usr/bin/env bash
set -e
BASE=${1:-http://localhost:3000}
echo "valid owners:";   curl -s -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"probe+owners@calebbolden.com","list":"owners"}'; echo
echo "bad list:";       curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"a@b.com","list":"nope"}'
echo "bad email:";      curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/api/subscribe" -H 'Content-Type: application/json' -d '{"email":"not-an-email","list":"owners"}'
```

Run against `npm run dev` before the route exists. Expected: 404s — test fails.

- [ ] **Step 2: Implement the route**

`app/api/subscribe/route.ts`:

```ts
import { NextResponse } from "next/server";

const LISTS: Record<string, string | undefined> = {
  owners: process.env.LISTMONK_LIST_ID_OWNERS,
  operators: process.env.LISTMONK_LIST_ID_OPERATORS,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; list?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }
  const listId = body.list ? LISTS[body.list] : undefined;
  if (!listId) return NextResponse.json({ ok: false, error: "unknown list" }, { status: 400 });
  if (!body.email || !EMAIL_RE.test(body.email)) return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });

  const auth = Buffer.from(`${process.env.LISTMONK_API_USER}:${process.env.LISTMONK_API_TOKEN}`).toString("base64");
  const res = await fetch(`${process.env.LISTMONK_API_URL}/api/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ email: body.email, name: "", status: "enabled", lists: [Number(listId)], attribs: { welcome_step: 0 } }),
  });
  // 409 = already subscribed: treat as success (idempotent signup)
  if (!res.ok && res.status !== 409) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Run the test again** with env vars set in `.env.local`. Expected: `{"ok":true}`, `400`, `400`. Confirm the probe address appears in Listmonk as unconfirmed (double opt-in pending) with `attribs.welcome_step = 0`.

- [ ] **Step 4: Add the five env vars to /opt/calebbolden/.env on the server** (compose `env_file`). Delete the probe subscriber in Listmonk admin. [CORRECTED 2026-08-01: site is self-hosted, not Vercel — vars added directly by controller.]

- [ ] **Step 5: Commit** — `feat: subscribe API route bridging to listmonk`.

---

### Task 4: Hub pages `/owners` and `/operators`

**Files:**
- Create: `app/owners/page.tsx`, `app/operators/page.tsx` (adjust to repo router style per Task 3 inspection)
- Create: `components/NewsletterSignup.tsx` (shared form, takes `list` prop)

**Interfaces:**
- Consumes: `POST /api/subscribe` (Task 3 contract).
- Produces: public pages linked from site nav/footer.

- [ ] **Step 1: Build the shared signup component** — client component; email input + submit; on success swap to "Check your inbox to confirm." (double opt-in message); on 4xx show inline error. Follow the site's existing styling system (inspect existing components; match, don't invent).

```tsx
"use client";
import { useState } from "react";

export function NewsletterSignup({ list }: { list: "owners" | "operators" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/subscribe", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, list }),
    });
    setState(res.ok ? "done" : "error");
  }
  if (state === "done") return <p>Check your inbox to confirm your subscription.</p>;
  return (
    <form onSubmit={submit}>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
      <button disabled={state === "busy"} type="submit">Subscribe</button>
      {state === "error" && <p role="alert">That didn&apos;t work — check the address and try again.</p>}
    </form>
  );
}
```

- [ ] **Step 2: Write the two pages.** Copy direction (write full prose in-page, human voice, no AI-tells, no claims):
  - `/owners` — headline built on "Stop losing jobs you already earned"; three short sections: the after-hours call problem, what the weekly issue covers (field notes: missed-call math, audit findings, install stories), what the monthly clinic is; signup form with working name "The Missed Call".
  - `/operators` — headline on workflow automation + AI readiness; sections: the manual-work tax, what the weekly issue covers (one real workflow dissected per issue, templates included), the even-month clinic; form with "The Workflow Brief".
  - Both pages: no subscriber counts, no testimonials, no outcome claims. Mention "free, weekly, unsubscribe anytime."

- [ ] **Step 3: Link both pages** from the site's nav or footer (match existing pattern) — minimal diff.

- [ ] **Step 4: Verify locally** — `npm run dev`, submit each form with a probe address, see the confirm state, verify the subscriber lands in the right Listmonk list. Then `npm run build` must pass.

- [ ] **Step 5: Commit + deploy** — `feat: owners and operators hub pages` — deploy happens at branch merge via the repo README's git-archive procedure to /opt/calebbolden; verify both live URLs return 200 and the form round-trips in production. Delete probe subscribers.

---

### Task 5: Welcome sequences (n8n polling worker)

**Files:**
- Create: `infra/listmonk/welcome-emails/owners-{1,2,3}.html`, `infra/listmonk/welcome-emails/operators-{1,2,3}.html` (tx template bodies)
- Create: `infra/listmonk/n8n-welcome-flow.md` (node-by-node workflow doc, since n8n JSON exports drift)

**Interfaces:**
- Consumes: Listmonk API token, list IDs (Task 2); subscriber `attribs.welcome_step` seeded by Task 3.
- Produces: confirmed subscribers receive email 1 within ~15 min of confirming, email 2 at +2 days, email 3 at +5 days; `attribs.welcome_step` advances 0→3 with `welcome_last_at` timestamps.

- [ ] **Step 1: Author the six email bodies.** Content per spec §2 (plain, human, no claims; each ends with one CTA):
  - owners-1: the missed-call math worked through on one honest example; CTA = watch for the weekly issue.
  - owners-2: "what a text-back actually recovers" field note; CTA = free 3-minute audit-video offer (reply to request).
  - owners-3: the founding-slot mention, framed exactly per compliance (five slots across launch verticals, $1,500 + $500/mo, guarantee wording verbatim from the live site); CTA = Apply link to voratechnology.com/hvac#founding-offer.
  - operators-1: the manual-work tax essay; CTA = the AI-readiness self-assessment (link).
  - operators-2: one workflow dissected (intake → quote → follow-up) with the template attached; CTA = reply with your ugliest workflow.
  - operators-3: how the audit works (2 interviews + half-day workshop + roadmap), scope only, no prices per the live-quote rule; CTA = book-a-call link.

- [ ] **Step 2: Create six transactional templates in Listmonk** (admin → Campaigns → Templates → type "transactional"), record template IDs in the flow doc.

- [ ] **Step 3: Build the n8n workflow** (on the homelab n8n, doc every node in `n8n-welcome-flow.md`):
  1. **Cron** every 15 min.
  2. **HTTP** GET `{BASE}/api/subscribers?query=subscribers.attribs->>'welcome_step' IS NOT NULL AND subscriber_status='enabled'&per_page=500` (Basic auth from n8n credential store — never inline).
  3. **Function** node: for each subscriber with confirmed opt-in to list `owners` or `operators`, compute due step: step 1 if `welcome_step=0`; step 2 if `welcome_step=1` and `now - welcome_last_at >= 2d`; step 3 if `welcome_step=2` and `>= 5d` since step 1. Emit `{subscriber_id, email, template_id}` items.
  4. **HTTP** POST `{BASE}/api/tx` with `{subscriber_email, template_id}`.
  5. **HTTP** PUT `/api/subscribers/{id}` merging `attribs: {welcome_step: N, welcome_last_at: iso-now}` (fetch-merge-put to avoid clobbering other attribs).
  6. Error branch → n8n's existing failure notification channel.

- [ ] **Step 4: Test with a compressed clock** — temporarily set the step-2/step-3 delays to 5/10 minutes in the Function node, subscribe a probe address via the live `/owners` form, confirm opt-in, watch all three emails arrive in order, verify `welcome_step` ends at 3. Restore real delays (2d/5d). Repeat once for `operators`.

- [ ] **Step 5: Commit** email bodies + flow doc — `feat: welcome sequences for both lists`.

---

### Task 6: Weekly scorecard automation

**Files:**
- Create: `infra/listmonk/n8n-scorecard-flow.md`

**Interfaces:**
- Consumes: Listmonk API (list stats, campaign analytics).
- Produces: one email to caleb@calebbolden.com every Monday 07:00 CT with exactly the spec's three lines.

- [ ] **Step 1: Build the n8n workflow:** Cron (Mon 07:00 CT) → HTTP GET `/api/lists` (subscriber counts per list) + GET `/api/campaigns?per_page=5&order_by=created_at` (recent campaign open rates) → Function node formats:

```
The Missed Call: N subs (+Δ this week) · open rate last issue X%
The Workflow Brief: N subs (+Δ this week) · open rate last issue X%
Clinics: [manual line — edit in n8n variable] · Quote log entries this week: [manual]
```

Week-over-week delta: store last week's counts in n8n static data. Manual fields stay manual by design — the spec caps the scorecard at three lines, not a dashboard.

- [ ] **Step 2: Send via Listmonk tx API** (a seventh tx template, `scorecard`), to the founder address.

- [ ] **Step 3: Trigger the cron manually once**, verify the email arrives with real numbers. Commit the flow doc — `feat: weekly scorecard automation`.

---

### Task 7: End-to-end verification + runbook close-out

**Files:**
- Modify: `infra/listmonk/README.md` (final runbook: all URLs, IDs, flows, restore procedure)

- [ ] **Step 1: Full cold-path test, both lists** — new probe address → hub page form → confirm-email arrives (double opt-in) → confirm → welcome-1 arrives within 15 min. Check Resend dashboard: no bounces/blocks; SPF+DKIM pass on received headers.
- [ ] **Step 2: Backup test** — run the pg_dump backup from the Task 1 runbook, restore it into a scratch Postgres container locally, confirm both lists and templates exist in the restore. (A backup that's never been restored doesn't exist.)
- [ ] **Step 3: Failure-mode note** — document in README: what happens if Listmonk is down (forms return 502; the subscribe route already handles it), how to pause sequences (disable the n8n workflow), how to swap Resend→SendGrid (SMTP settings only).
- [ ] **Step 4: Final commit** — `docs: complete engine runbook` — and update the spec's Open Items: items 1 and 2 done; item 3 (consulting template kit) becomes the follow-on plan; item 4 (Perplexity key) remains founder-owned.

---

## Self-Review

**Spec coverage:** §1 architecture → Tasks 1–4; §2 cadence/welcome sequences → Tasks 4–5 (issue-writing itself is ongoing content work, not plannable software); §2 clinics → operational, no infra needed beyond pages mentioning them; §3 pipeline links → Task 5 email CTAs + Task 4 pages; §4 templates + §5 quote log → explicitly deferred to the follow-on content plan (quote log is a spreadsheet decision, not software); §6 scorecard → Task 6; §6 gates → thresholds live in the spec, measured by Task 6 output. Gap check: none blocking.

**Placeholder scan:** clean — all steps carry code, commands, or exact admin-UI paths. Working names flagged as renameable config in Global Constraints, not TBD.

**Type consistency:** `welcome_step`/`welcome_last_at` attribs consistent across Tasks 3 and 5; list slugs `owners`/`operators` consistent across Tasks 2–6; env var names consistent across Tasks 3–4.
