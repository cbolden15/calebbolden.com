# calebbolden.com

AI consulting site for local small businesses (Caleb Bolden, Vora Technologies LLC). Design system: "the working wall" (white, blueprint-blue, graph-paper fields; utility contract in app/globals.css). All deliverable prose follows humanizer rules: no em dashes, no buzzwords, sentence-case headings, named sources for statistics.

## Deployment

Production is the Hetzner server (5.78.121.71), NOT Vercel and NOT the homelab. Full procedure and gotchas in README.md (Deployment section). Production deploys and writes need per-session user approval. Lead capture (chat + lead magnets) emails via Resend and logs `[lead]` / `[lead-magnet]` JSON in container logs.

## Key paths

- Lead magnets source + packaging playbook: consulting/lead-magnets/
- Business docs (MSA draft, outreach templates, E&O research): consulting/
- Interactive tools: app/tools/ai-readiness, app/tools/revenue-leak; capture route app/api/lead-magnet
- Gated PDFs: public/downloads/ (print HTML sources live in session scratchpad; regenerate via headless Chrome)

## Visual-system rollout — partially implemented, resume here (as of 2026-08-05)

**At session start in this repo, tell Caleb this rollout is partial and state the next steps below.** Remove this section when the rollout finishes.

State: 8 of 15 plan tasks merged to main at `114e52f` (image pipeline, TapedPrint/PrintStrip, mobile MethodFigure fix, three service path figures, blog VSM figure, audit template renders, Packages artifact strip). Merged but NOT deployed to Hetzner. Full history in `.superpowers/sdd/progress.md`; plan (with complete mount code for the remaining tasks) in `docs/plans/2026-08-04-visual-system-rollout.md`; audit in `consulting/brand/visual-audit-2026-08-04.md`; cross-session detail (test line, creds pointers) in auto-memory `visual-rollout-state`.

Next steps, in order:
1. Deploy the merged work to Hetzner (needs per-session approval, procedure in README.md).
2. Vora captures (plan tasks 5–6): waiting on the Vora fix deploy (13 local commits in ~/Projects/vora-technology, `/deploy-prod` there with Caleb present). Then: text the armed test line, verify the receptionist-grade reply in vora-mcp logs, capture the phone thread + dashboard views, run the mounts.
3. Portrait mounts (task 8): waiting on Caleb's portrait shoot.
4. /how-i-build mount (task 15): waiting on a scrubbed fleet capture (no tokens, hostnames, client names, or emails) and a ChapterHQ test login (Clerk) for its capture.

Gotcha for any figure work: `stamp-on-reveal`/`draw-on-reveal` SVGs are invisible without a `.reveal.in` ancestor (`components/Reveal.tsx`); BlogVsmFigure self-wraps for MDX.

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
