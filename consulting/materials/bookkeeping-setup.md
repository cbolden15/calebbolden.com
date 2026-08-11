# Wave bookkeeping setup checklist

For Vora Technologies LLC (Texas single-member LLC, both consulting and product revenue). Follow in order. Total time: under half a day.

Source research: consulting/research/go-live-2026-08/research-legal-finance.md (items 13-17).

---

## 1. Account setup

1. Go to waveapps.com and sign up with the business email.
2. Business name: enter exactly "Vora Technologies LLC" (matches the entity name on file with the TX Secretary of State).
3. Business type: select LLC. Industry: pick the closest match to consulting/software (verify in-app which option maps best — Wave's category list changes).
4. Skip any upsell to Wave Payroll or Wave Advisors during signup unless already decided; neither is needed for this setup.
5. Connect the business bank account: Settings > Bank Accounts & Credit Cards > Connect a bank or credit card. Use the actual business checking account, not a personal one.
6. Let the bank feed pull in 30-60 days of transaction history if available — gives the chart of accounts something to categorize against immediately.

---

## 2. Income accounts (revenue streams)

Wave's free tier doesn't have QuickBooks-style "class tracking." Instead, Wave separates revenue by which **income account** a transaction or invoice line item posts to. Set these up as distinct income accounts under Accounting > Chart of Accounts > Add Income Account:

1. **Consulting - audits** (AI readiness audits, one-time diagnostic engagements)
2. **Consulting - build sprints** (implementation/build engagements)
3. **Consulting - retainers** (ongoing monthly retainer work)
4. **Product revenue - Vora** (Vora SaaS platform revenue running through this LLC)
5. **Product revenue - ChapterHQ** (ChapterHQ revenue running through this LLC)
6. **Other income** (catch-all — interest, refunds, anything that doesn't fit above)

When creating an invoice, assign each line item to the matching income account so the P&L can be filtered by account later. If Wave also offers a "labels" or "tags" feature on transactions (verify in-app — this has shown up in some Wave accounts and not others), use it as a second cut for sub-tracking within a stream, but the six income accounts above are the primary mechanism and don't depend on that feature existing.

To view revenue by stream: Reports > Profit & Loss, then check whether Wave's report filter supports breaking out by income account (verify in-app). Worst case, the P&L lists each income account as its own line, which is sufficient for a monthly glance.

---

## 3. Expense accounts

Wave ships with a default expense chart of accounts. Rename/add to match this list under Accounting > Chart of Accounts > Add Expense Account:

1. **Software subscriptions** (Wave itself is free, but this covers dev tools, SaaS tools, AI API costs)
2. **Insurance** (E&O + GL premiums)
3. **Professional fees** (legal, accounting, CPA consults)
4. **Contractor payments** (any subcontracted work — track separately in case 1099-NEC filing becomes needed; Wave's free tier does not generate 1099s, see item 19 in the research)
5. **Marketing & advertising** (cold email tooling, any paid promotion)
6. **Hosting & infrastructure** (Hetzner, Cloudflare, domain renewals, etc.)
7. **Office & equipment** (hardware, home office supplies)
8. **Payment processing fees** (Stripe card/ACH fees — Wave may auto-categorize these from the bank feed; check and recategorize if it lands somewhere generic)
9. **Travel & mileage** (client visits, conferences)
10. **Owner's draw** — set this up as an **equity account**, not an expense account. Any money moved from the business to personal use is a draw against owner's equity, not a business expense. Wave should have an "Owner Investment/Drawings" equity account by default; if not, add one under Accounting > Chart of Accounts > Add Equity Account.

---

## 4. Invoicing configuration

1. Go to Settings > Invoicing (or the invoice customization screen) and set up a template with these fields:
   - **SOW number reference** — add a custom field or put it in the invoice notes/memo so every invoice ties back to a specific statement of work.
   - **Specific due date**, not just a payment-terms label. Even when terms are "Net 15," compute and display the actual calendar date (e.g., "Due August 26, 2026") — this matches the payment-terms guidance in the research (item 16) and avoids ambiguity for the client.
   - **ACH payment instructions** — once Stripe ACH is connected (below), Wave should surface a "pay by bank" or ACH option on the hosted invoice link. Verify in-app that this appears correctly before sending the first real invoice.

2. Connect Stripe as the payment processor: Settings > Payments, follow Wave's Stripe connection flow (this uses Wave's built-in Stripe integration, which should already tie to the same Stripe account used elsewhere — verify in-app whether Wave requires its own Stripe sub-account or links to an existing one).

3. Default payment rail: **ACH**, not card. Stripe ACH runs 0.8% capped at $5/transaction; cards run 2.9% + $0.30. ACH becomes cheaper above roughly a $625-670 invoice, and most consulting engagements will clear that. Offer card as a fallback option, not the default.

4. Payment terms to use on invoices (per the MSA/SOW once the attorney review is back):
   - New clients / larger engagements (over ~$2,000): 50% deposit at kickoff, balance due on delivery.
   - Smaller or ongoing retainer work, once a client has payment history: Net 15, with the specific due date shown.

---

## 5. Tax discipline

1. Open a **separate business savings account** (not the operating checking account) dedicated to tax set-asides.
2. Every time a consulting payment clears, manually transfer **25-30% of that payment** into the tax savings account. Do this as a habit tied to each deposit, not a monthly lump-sum guess — it's easier to get right in small increments.
3. **Quarterly estimated federal tax payments**, paid from the tax savings account via EFTPS or IRS Direct Pay:
   - Next due date: **September 15, 2026**
   - Following: **January 15, 2027**
   - (April 15 and June 15, 2026 have already passed for this year.)
4. This is federal-only — Texas has no state income tax.
5. **Texas franchise tax Public/Ownership Information Report**: due **May 15 annually**. Filed via the Comptroller's WebFile system. Expect **$0 tax due** (2026 no-tax-due threshold is $2.65M in annualized revenue, well above what this entity will hit), but the PIR filing itself is still mandatory even at $0 — the old "No Tax Due Report" shortcut was discontinued in 2024. Missing this deadline risks a $50 penalty and possible forfeiture of the LLC's right to operate in Texas. This is likely already on file for the existing entity — confirm consulting revenue doesn't change anything about the filing (it doesn't; same entity, same report).
6. A one-time CPA consult (~$150-300) to confirm the safe-harbor estimated-tax number is worth doing before the September 15 deadline, since this is the first year mixing consulting and existing product revenue through one entity — not launch-blocking, but don't skip it before that date.

---

## 6. Monthly close routine (5 steps)

Run this once a month, ideally the same day each month:

1. **Categorize transactions** — clear anything sitting uncategorized in the Wave bank feed, assigning each to the correct income or expense account from sections 2-3.
2. **Match the bank feed** — confirm every bank transaction has a matching Wave entry (invoice payment, expense, transfer) and nothing is duplicated or missing.
3. **Send/chase invoices** — check for any invoice not yet sent, and follow up on anything past its due date per the SOW terms.
4. **Check the tax set-aside balance** — confirm the savings account balance roughly tracks 25-30% of consulting revenue received since the last quarterly payment.
5. **Glance at P&L by stream** — open Reports > Profit & Loss and scan revenue by income account (consulting vs. product, and within consulting by audits/sprints/retainers) to catch anything that looks off before it compounds.

---

## Items flagged verify-in-app

Wave's exact free-tier feature set shifts between accounts and over time. Confirm these directly in the Wave dashboard rather than trusting this doc:

- Whether Wave supports a tags/labels feature beyond income accounts for finer revenue-stream tracking.
- Whether the P&L report can filter/group by income account natively, or just lists them as separate lines.
- Whether Wave's Stripe integration creates its own sub-account or connects to an existing Stripe account.
- Whether the ACH "pay by bank" option actually surfaces on the hosted invoice page once Stripe is connected.
- The exact industry-category option to select during signup.
