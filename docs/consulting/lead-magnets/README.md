# Lead magnets: packaging and distribution playbook

Internal notes for Caleb. The five magnets, how to package each, and the follow-up that turns downloads into calls. Grounded in the July 2026 research pass (MailerLite 41k-form study, Interact quiz report, GetResponse study, Unbounce benchmarks, Gill Andrews' 50-site SMB analysis).

## The set

| # | File | Format | Role in the funnel |
|---|------|--------|--------------------|
| 1 | ai-readiness-scorecard.md | 18-question scored self-assessment | Front door for "we should use AI but don't know where to start" leads. Scorecards convert 30-50% vs ~23% for flat checklists and the answers double as call-qualification data. |
| 2 | process-audit-worksheet.md | One-hour fill-in worksheet | The deepest commitment. Anyone who completes it and sends it in is a hot lead. Direct feeder into the audit engagement. |
| 3 | revenue-leak-worksheet.md | 5-input paper calculator | The money framing. Calculators are the best-evidenced format (roughly 2.4x static PDFs) because the output number is the sales pitch. Best candidate to later build as an interactive page. |
| 4 | website-conversion-checklist.md | 20-point checklist | Side door for the web development service. Cheap to promote, works ungated as a blog post too. |
| 5 | local-seo-checklist.md | 20-point checklist | Side door for the SEO service. Same treatment as #4. |

## Gating

2026 practice is hybrid: give most content away, gate only what has personal, tangible value.

- **Gate:** the scorecard (email required to get the score interpretation), the revenue leak worksheet, the process audit worksheet.
- **Half-gate:** both checklists. Publish the first section ungated as blog posts for SEO, gate the full printable PDF.
- **Form fields:** email only. Sleeknote's 26k-campaign data: 1 field converts 4.4%, 3 fields 1.9%. The scorecard gathers qualification from its own questions; nothing else needs a name field.

## Landing pages

One page per magnet, not a shared "resources" page (dedicated landing pages run ~18-23% conversion vs ~4% for popups). Title carries a number and an outcome. Reuse the working-wall design; the magnets fit the drafting-table brand.

Every thank-you page carries the same soft CTA: "Want me to look at yours? Book 20 minutes." The thank-you page is the highest-intent moment in the funnel; do not waste it on "check your inbox."

## Follow-up sequence (per magnet, 5 emails over ~2 weeks)

1. **Day 0:** deliver the file, one-line booking link at the bottom.
2. **Day 2-3:** the single most useful tip related to the magnet, no ask.
3. **Day 5-7:** short client story or worked example (the salon that stopped missing calls, the mapped quote process).
4. **Day 8-10:** the direct ask: 20-minute call, one concrete promise ("you leave knowing what to fix first").
5. **Day 14:** last touch, then they roll into the monthly list.

80% value, 20% ask. Reference their own numbers where possible ("if your leak total was over $1,000/month...").

## Personalized upgrade (use sparingly)

The highest-converting move in the research was the manual mini-audit (5-minute video review of their site or profile). It does not scale, so offer it only on thank-you pages behind magnets 3-5, capped at what a week can absorb. The delivery is the discovery call warm-up.

## Build status (2026-07-07)

Built and live on the site:
- /tools/ai-readiness: the scorecard as an interactive page (score shown free, full read-out behind the email gate).
- /tools/revenue-leak: the leak worksheet as a live calculator (magnets 1 and 3 are web forms; the research showed interactive formats convert 2x+ over static PDFs).
- /resources: hub page; magnets 2, 4, 5 are print-styled PDFs in public/downloads/, each behind an email gate.
- /api/lead-magnet: every capture emails Caleb via Resend and logs `[lead-magnet]` JSON in container logs.

Still open: verify a sender domain in Resend (visitor-facing email is not possible until then), and a proper email list provider once volume justifies it.

## Voice rules (already applied, keep applying)

No em dashes, no buzzwords, sentence-case headings, named sources with years for every statistic, no invented numbers. Every magnet ends with the same free, low-friction offer and a one-line bio that leads with process-first credibility.
