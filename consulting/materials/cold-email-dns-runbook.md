# Cold-email subdomain DNS runbook

Sending domain: `reach.calebbolden.com`. Subdomains do not inherit the parent's SPF, so every record below is set on the subdomain itself. State as of 2026-08-11:

| Record | Status |
|---|---|
| DMARC (`_dmarc.reach.calebbolden.com` TXT, `v=DMARC1; p=none; rua=mailto:cbolden15@gmail.com; fo=1`) | **Live** (created 2026-08-11 via Cloudflare API) |
| SPF (`reach.calebbolden.com` TXT) | Waiting on mailbox provider decision |
| DKIM (`<selector>._domainkey.reach.calebbolden.com` TXT) | Waiting on mailbox creation (provider issues the key) |
| MX for the subdomain | Waiting on mailbox provider (needed so replies and bounces land somewhere) |

## When the mailbox exists (Google Workspace assumed; adjust if not)

1. In Google Admin, add `reach.calebbolden.com` as a domain/alias and create the sending mailbox (e.g. `caleb@reach.calebbolden.com`).
2. SPF: create a TXT record on `reach.calebbolden.com` with content `v=spf1 include:_spf.google.com ~all`.
3. DKIM: in Google Admin (Apps > Google Workspace > Gmail > Authenticate email), generate the DKIM key for the subdomain, then create the TXT record it gives you at `google._domainkey.reach.calebbolden.com`.
4. MX: create the standard Google MX record (`smtp.google.com`, priority 1) on `reach.calebbolden.com`.
5. Verify all four records with `dig TXT reach.calebbolden.com`, `dig TXT _dmarc.reach.calebbolden.com`, `dig TXT google._domainkey.reach.calebbolden.com`, `dig MX reach.calebbolden.com`, then send a test to a mail-tester service and confirm SPF, DKIM, and DMARC all pass.

Cloudflare API shape for each record (token in `~/.dev-secrets.env` as `CLOUDFLARE_API_TOKEN`; zone ID lookup: `GET /zones?name=calebbolden.com`):

```bash
curl -s -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records" \
  --data '{"type":"TXT","name":"reach.calebbolden.com","content":"v=spf1 include:_spf.google.com ~all","ttl":3600}'
```

## Warmup and policy schedule

- Weeks 1-2 after the mailbox exists: warmup only, 5-10 sends/day to engaged/known addresses, replies encouraged.
- Weeks 3-4: 15-20/day, begin low-volume real sends to warm-adjacent contacts.
- Week 5+: add cold sends, cap ~25-30/day per mailbox. This is roughly mid-September against an August 12 start.
- DMARC stays `p=none` for 30 days while rua reports arrive at cbolden15@gmail.com, then tighten to `p=quarantine`, then `p=reject`. Never jump straight to reject.
- Keep light warmup running permanently once real sends begin, or reputation erodes.

Compliance pairing: no cold send happens before the CAN-SPAM fields in `cold-email-sequence.md` are complete, including the physical mailing address (pending decision 5 in the go-live plan) and the working suppression list.
