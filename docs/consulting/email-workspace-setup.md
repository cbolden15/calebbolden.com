# Google Workspace setup for caleb@calebbolden.com

**Goal:** professional email address `caleb@calebbolden.com` for the consulting site. Mail to and from caleb@ flows through Google Workspace's own SMTP, so SPF/DKIM align and deliverability is clean.

**Decision (2026-07-18):** caleb@calebbolden.com stays a fully separate inbox — no forwarding to or send-as from cbolden15@gmail.com. Parts 3 and 4 below (forwarding, send-as) are skipped. Check caleb@ directly at mail.google.com.

**Cost:** Google Workspace Business Starter, about $7/mo (one user).

**Why not the free option:** Cloudflare Email Routing + Gmail send-as costs $0 and works at low volume, but sends through consumer Gmail SMTP with weaker authentication. Workspace gives proper SPF/DKIM alignment, which matters once outreach sequences start.

---

## Prerequisites

- Access to Cloudflare for the calebbolden.com zone (dashboard login, or `CLOUDFLARE_API_TOKEN` in `~/.dev-secrets.env` if Claude is adding the DNS records).
- A payment card for the Workspace subscription.
- Vaultwarden open so the new account credentials get saved (https://homelab.bream-python.ts.net:8081).

## Important context before touching DNS

- Resend domain verification for calebbolden.com is a separate, parallel task (it covers outbound transactional mail from the site: lead capture, lead magnets). Resend's records normally live on a subdomain like `send.calebbolden.com`, so they should not conflict with Workspace's root-domain records. **Check what email-related DNS already exists on the zone before adding anything** (MX, TXT/SPF, DKIM records at the root).
- If a root SPF TXT record already exists, do not add a second one. Merge them into a single record, e.g. `v=spf1 include:_spf.google.com include:amazonses.com ~all` (adjust includes to what is actually present). Two SPF records at the same name breaks SPF entirely.

---

## Part 1: buy Workspace and create the account

1. Go to https://workspace.google.com and start a Business Starter signup.
2. Business name: Vora Technologies LLC (or Caleb Bolden — cosmetic only).
3. When asked for a domain, choose "use a domain I already own" and enter `calebbolden.com`. Do NOT buy a domain through Google.
4. Create the first user as `caleb@calebbolden.com`. This user is also the Workspace admin.
5. **Save the caleb@ password in Vaultwarden immediately.** This is a full separate Google account; you will rarely log into it, so it is exactly the kind of credential that gets lost.
6. Google will ask you to verify domain ownership, usually via a TXT record — add it in Cloudflare when prompted (this can be part of the Part 2 DNS batch).

## Part 2: DNS records in Cloudflare

Workspace setup will show the exact records. As of 2026 Google uses a single MX host:

| Type | Name | Content | Priority |
|------|------|---------|----------|
| MX | `calebbolden.com` (@) | `smtp.google.com` | 1 |
| TXT | `calebbolden.com` (@) | `v=spf1 include:_spf.google.com ~all` (merge if an SPF record already exists — see note above) | — |
| TXT | `google._domainkey` | DKIM key — generate it in Admin console: Apps → Google Workspace → Gmail → Authenticate email → Generate new record, then paste here and click "Start authentication" | — |
| TXT | verification record | whatever string the signup wizard gives you | — |

Also add DMARC if none exists yet:

| Type | Name | Content |
|------|------|---------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:caleb@calebbolden.com` |

(`p=none` is monitoring mode; tighten to `quarantine` later once reports look clean.)

All records: DNS only (grey cloud), not proxied. MX/TXT are never proxied anyway, but Cloudflare will warn if something is off.

If Claude is doing this step: token is `CLOUDFLARE_API_TOKEN` in `~/.dev-secrets.env`; list existing records first, then add.

## Part 3: forward incoming mail to the Gmail inbox — SKIPPED

Decision: caleb@ stays a separate inbox, checked directly. No forwarding to cbolden15@gmail.com.

## Part 4: send-as from the cbolden15 inbox — SKIPPED

Decision: no send-as. Reply to caleb@ mail from within the caleb@ mailbox itself.

## Part 5: verify it actually works

1. From an outside address (or the site's contact form), send to `caleb@calebbolden.com` → check it arrives at mail.google.com logged in as caleb@.
2. Reply from within the caleb@ mailbox → recipient sees From: caleb@calebbolden.com.
3. Send a test to https://www.mail-tester.com (compose from caleb@ directly) → expect SPF pass, DKIM pass (d=calebbolden.com), score 9+.
4. In the received test message's headers (Show original), confirm `spf=pass` and `dkim=pass` for calebbolden.com.

## Part 6: follow-ups once email works

- [ ] Update the site: replace `cbolden15@gmail.com` with `caleb@calebbolden.com` on the contact page (mailto link) and anywhere else it appears. Grep the repo for `cbolden15`.
- [ ] Redeploy the site (Hetzner, per README deployment section; needs per-session approval).
- [ ] Resend: verify the calebbolden.com domain in the Resend dashboard (separate pending task), then flip `LEAD_EMAIL_FROM` in all env files so site-generated mail also comes from the domain.
- [ ] Vaultwarden: confirm the caleb@ account password is saved (no app password needed since send-as is skipped).
- [ ] Set up a habit/reminder to check the caleb@ inbox directly (mail.google.com, separate login) since it no longer forwards anywhere.
- [ ] Add caleb@ to the site's DMARC monitoring later (tighten `p=none` → `quarantine` after a few clean weeks).

## Gotchas

- Two SPF TXT records at the root = SPF broken. Always merge.
- Workspace signup sometimes auto-creates conflicting "domain protection" MX records suggestions; only the records listed in the admin console's setup checklist are needed.
- With no forwarding, caleb@ is a genuinely separate inbox — nothing surfaces it in cbolden15@gmail.com. Check it directly or it'll go stale.
