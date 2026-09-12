# calebbolden.com

AI consulting site for local small businesses (Caleb Bolden, Vora Technologies LLC). Design system: "the working wall" (white, blueprint-blue, graph-paper fields; utility contract in app/globals.css). All deliverable prose follows humanizer rules: no em dashes, no buzzwords, sentence-case headings, named sources for statistics.

## Deployment

Production is the Hetzner server (5.78.121.71), NOT Vercel and NOT the homelab. Full procedure and gotchas in README.md (Deployment section). Production deploys and writes need per-session user approval. Lead capture (chat + lead magnets) emails via Resend and logs `[lead]` / `[lead-magnet]` JSON in container logs. The Brittany Lyons preview uses a private URL token from `BRITTANY_PREVIEW_TOKEN`; requests without its token cookie return 404, and every response carries `X-Robots-Tag` noindex directives. Never commit the token.

## Key paths

- Lead magnets source + packaging playbook: consulting/lead-magnets/
- Business docs (MSA draft, outreach templates, E&O research): consulting/
- Interactive tools: app/tools/ai-readiness, app/tools/revenue-leak; capture route app/api/lead-magnet
- Gated PDFs: public/downloads/ (print HTML sources live in session scratchpad; regenerate via headless Chrome)
- Brittany Lyons mockups: public/clients/brittany-lyons/; chooser at index.html, existing design in classic/, R2 in r2/, staged R2 Gold variant in r2-gold/, access gate in proxy.ts

## Visual-system rollout — partially implemented, resume here (as of 2026-08-05)

This historical rollout remains partial. For showcase surfaces, follow the current Project showcase section below; preserve the unrelated portrait work. Remove this section only when the remaining rollout finishes.

State: 8 of 15 plan tasks merged to main at `114e52f` (image pipeline, TapedPrint/PrintStrip, mobile MethodFigure fix, three service path figures, blog VSM figure, audit template renders, Packages artifact strip). **Deployed to Hetzner 2026-08-11** (shipped with the go-live day-1 deploy at `3660d19`). Full history in `.superpowers/sdd/progress.md`; plan (with complete mount code for the remaining tasks) in `docs/plans/2026-08-04-visual-system-rollout.md`; audit in `consulting/brand/visual-audit-2026-08-04.md`; cross-session detail (test line, creds pointers) in auto-memory `visual-rollout-state`.

Next steps, in order:
1. Vora captures (plan tasks 5–6): waiting on the Vora fix deploy (13 local commits in ~/Projects/vora-technology, `/deploy-prod` there with Caleb present). Then: text the armed test line, verify the receptionist-grade reply in vora-mcp logs, capture the phone thread + dashboard views, run the mounts.
2. Portrait mounts (task 8): waiting on Caleb's portrait shoot.
3. /how-i-build mount (task 15): waiting on a scrubbed fleet capture (no tokens, hostnames, client names, or emails) and a ChapterHQ test login (Clerk) for its capture.

Gotcha for any figure work: `stamp-on-reveal`/`draw-on-reveal` SVGs are invisible without a `.reveal.in` ancestor (`components/Reveal.tsx`); BlogVsmFigure self-wraps for MDX.

## Go-live program (as of 2026-08-11) — supersedes the list below for sequencing

Public launch targeted **Sat 2026-08-22**. The authoritative plan is `docs/plans/2026-08-11-consulting-go-live.md` (day-1 clock starters, $2k budget allocation, 5 decisions for Caleb, 4 workstreams, day-by-day schedule). Research backing it: `consulting/research/go-live-2026-08/` (marketing-sales, legal-finance, ops-IT, brain-learning mining, package readiness audit). The "Next up" items below are folded into that plan where still relevant.

## Next up (as of 2026-07-07)

Claude-side (in priority order):
- [ ] Analytics: no tracking exists. Add self-hosted Umami or Plausible on the Hetzner box + events on tool completions and PDF gates. Do this before any promotion so conversion is measurable.
- [ ] Follow-up email sequences: write the 5-email sequence copy per magnet (spec in consulting/lead-magnets/README.md). No list provider yet; at current volume Caleb sends manually.
- [ ] Announcement content: LinkedIn post + short blog post introducing the scorecard and calculator; add blog posts to app/sitemap.ts (currently pages only).
- [ ] After Caleb verifies the Resend domain: set DNS records via Cloudflare API, flip LEAD_EMAIL_FROM in all env files, redeploy.
- [ ] After Caleb mints a dedicated Gemini key: rotate GOOGLE_GENERATIVE_AI_API_KEY in local .env/.env.local, ~/.dev-secrets.env, and Hetzner /opt/calebbolden/.env (currently shares GEMINI_API_KEY_VORA).

Caleb-side (quick unblocks, ~1 hour total):
- [ ] Verify calebbolden.com in the Resend dashboard (~10 min; unblocks professional sender + visitor-facing email).
- [ ] Mint a dedicated Gemini key in Google AI Studio (2 min).
- [ ] Create the Calendly booking link and provide NEXT_PUBLIC_CALENDLY_CLIENT_URL.
- [ ] Send first outreach: chamber + one adjacent professional, using consulting/materials/outreach-templates.md and pointing at the free tools. Highest-leverage item on this list.
- [ ] Run E&O quotes (Hiscox + TechInsurance/Insureon + Embroker; questions in consulting/research/eo-insurance-options.md).
- [ ] Send the MSA draft (consulting/materials/msa-template.md) to an attorney before signing the first client.

Parked / later:
- Interactive PDF gating is soft (direct URLs work); revisit only if link-sharing shows up.
- Email list provider decision once lead volume justifies automated sequences.
- Retire or repurpose the stopped homelab stack (containers stopped 2026-07-07, restart with `docker compose start`).

## Project showcase (September 12, 2026 local candidate)

The shared server catalog is `lib/work/catalog.ts`; authored records, raw fixture JSON and evidence hashing must never enter client imports. The five local rich examples use exact reviewed fixture/poster bytes bound by `showcase-evidence.manifest.json`. Validation never refreshes hashes. Draft case studies do not protect public media: deliberate rollback removes inactive snapshot entries and unreferenced media together.

Use Node 22.21.0 for application checks and gzip comparisons. Run `npm test`, `npm run verify:showcase-assets`, `npm run build`, `npx tsc --noEmit`, then `SHOWCASE_SERVER=production npx playwright test tests/showcase --project=chromium`. The Playwright production runner stages standalone output with matching public/static assets on localhost:3100. Source-transition tests require separate archived sources; no application environment, URL or cookie publication switch exists. Final command output and release gates are recorded in `docs/plans/2026-09-11-project-showcase-release-checks.md`.

The older Vora and How I build capture sequence above is superseded for these showcase surfaces by the approved portfolio simulations. It does not authorize a live capture or complete the unrelated portrait rollout. Local code/evidence readiness is separate from independent review and deployment authorization. Read `docs/gotchas.md` before changing showcase fixtures, loading boundaries or required content.
