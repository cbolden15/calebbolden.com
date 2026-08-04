# Brand asset checklist

Gap audit for a professional launch of the AI consulting brand, cross-referenced against what already exists in the repo as of 2026-08-03. Paths are relative to the project root unless noted.

## Visual identity

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Design system (palette, type, tokens) | The "working wall" visual language every asset draws from | High | Exists at DESIGN.md, app/globals.css |
| Wordmark (text-only, no image logo) | Brand identity decision: "CALEB BOLDEN" set in Archivo, never an image mark | High | Exists (documented decision, consulting/brand/brand-context.md) |
| Brand guidelines document | Single reference for palette, type, voice, and identity devices | High | In progress: consulting/brand/brand-guidelines.md |
| Social profile photos and cover banners (LinkedIn, YouTube, Instagram, Facebook) | Consistent presentation across the four accounts named in the social spec | High | Missing |
| Favicon | Browser tab identity, basic professionalism signal | Medium | Missing (no favicon.ico or icon file found under app/) |
| Open Graph / social share image | Link previews on LinkedIn, Slack, iMessage when the site is shared | Medium | Missing |
| One-pager / letterhead template for PDFs and proposals | Consistent look for anything printed or emailed as an attachment | Low | Missing |

## Website

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Core site (home, about, services, owners, operators, contact, resources) | The live storefront | High | Exists under app/ |
| Interactive lead tools (AI readiness scorecard, revenue leak calculator) | Web-form lead magnets that convert roughly 2x over static PDFs | High | Exists at app/tools/ai-readiness, app/tools/revenue-leak |
| Case studies / proof page (Vora, ChapterHQ, open-source, site assistant) | Work-shown authority per the "proof, not opinion content" positioning rule | High | Exists at app/work |
| Booking / Calendly integration | The single primary CTA the roadmap calls for above the fold on every page | High | Missing (NEXT_PUBLIC_CALENDLY_CLIENT_URL not set; Caleb-side blocker) |
| Analytics (Umami or Plausible, self-hosted) | Conversion measurement before any promotion push; explicitly flagged as a prerequisite | High | Missing (no analytics package or script found in the codebase) |
| Blog post coverage in the sitemap | Search visibility for announcement and evergreen posts | Medium | Partial: blog engine exists at app/blog, but app/sitemap.ts currently lists pages only |
| Legal pages (privacy, terms) | Baseline compliance and trust signal | High | Exists at app/privacy, app/terms |

## Social media

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Account setup runbook | Step-by-step for standing up all four platform accounts without the LinkedIn/Facebook ban risk | High | Exists at consulting/social/account-setup.md |
| 18-week content syllabus | Editorial spine mapping the readiness assessment's 5 dimensions to weekly clips and essays | High | Exists at consulting/social/syllabus.md |
| Social brand kit (post templates, caption voice, visual treatment) | Applies the working-wall system to social formats | High | In progress: consulting/brand/social-brand-kit.md |
| LinkedIn profile repositioning (headline, About, Featured, Experience) | The consulting buyer's channel; only place the LLC name appears | High | Missing (runbook written, execution not done) |
| YouTube Brand Account | Shorts feed and clinic-recording home | Medium | Missing |
| Instagram account | Reels for the visual-trades owner audience | Medium | Missing |
| Facebook Page | Reels and local DFW group presence | Medium | Missing |
| First content batch (4 clips + 4 essays, data-and-systems dimension) | Proves the weekly cadence before the full 18-week run starts | Medium | Missing |

## Marketing materials

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Lead magnets (5: scorecard, process audit, revenue leak, website checklist, local SEO checklist) | Top-of-funnel content across the offer ladder | High | Exists at consulting/lead-magnets/ |
| Gated PDF downloads (3 of 5 magnets) | Print-styled deliverables behind the email gate | High | Exists at public/downloads/ |
| Elevator pitches (owner, operator, referral-partner variants) | Fast verbal positioning for coffee meetings and chamber talks | High | In progress: consulting/brand/elevator-pitches.md |
| Launch announcement copy | LinkedIn post and blog post introducing the scorecard and calculator | High | In progress: consulting/brand/launch-announcement.md |
| Launch week plan | Sequenced rollout across channels for the first week live | High | In progress: consulting/brand/launch-week-plan.md |
| Outreach templates (chamber, referral partners) | Repeatable first-touch copy for bookkeepers, CPAs, MSPs, business bankers | Medium | Exists at consulting/materials/outreach-templates.md |
| Lunch-and-learn workshop deck | The in-person channel the roadmap ranks second, after referrals | Medium | Missing |
| Referral partner one-pager | Optional finder's-fee pitch once referral volume justifies formalizing | Low | Missing |

## Sales assets

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Intake questionnaire | Pre-qualifies fit, size, stack, pain signals before the first call | High | Exists at consulting/materials/intake-questionnaire.md |
| Discovery interview guide | Repeatable interview script with owner/ops/frontline variants | High | Exists at consulting/materials/discovery-interview-guide.md |
| VSM workshop kit | Agenda, facilitation guide, mapping template for the Map phase | High | Exists at consulting/materials/vsm-workshop-kit.md |
| Roadmap / recommendation deck template | Executive-ready sequencing for the Prioritize phase deliverable | High | Exists at consulting/materials/roadmap-deck-template.md |
| AI-annotated VSM overlay | The differentiating layer: data readiness, decision type, error tolerance per process step | Medium | Exists at consulting/materials/vsm-ai-overlay.md |
| Kaizen opportunity workshop guide | Converts VSM waste findings into automation candidates | Medium | Exists at consulting/materials/kaizen-opportunity-workshop.md |
| AI opportunity scoring matrix | Impact x feasibility x data-readiness x risk scoring | Medium | Exists at consulting/materials/opportunity-scoring-matrix.md |
| AI pilot charter template | Scope, owners, metrics, stop/scale criteria for the Pilot phase | Medium | Missing (tier-2 artifact, not yet built) |

## Email assets

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Lead-magnet capture and delivery (Resend) | Day-0 email on every gated download, logs `[lead-magnet]` events | High | Exists: app/api/lead-magnet route |
| Resend sender domain verification | Unblocks a professional visitor-facing send address | High | Missing (Caleb-side, ~10 min in the Resend dashboard) |
| 5-email follow-up sequences (one per magnet, 25 emails total) | Turns downloads into booked calls; spec written, copy not drafted | High | Missing |
| Dedicated LEAD_EMAIL_FROM address | Depends on domain verification; currently unset in env files | High | Missing |
| Client onboarding / welcome email | First touch after a contract is signed | Low | Missing |
| Email list provider | Automated sends once volume justifies it; parked deliberately for now | Low | Missing (manual sends acceptable at current volume) |

## Legal documents

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| MSA template with AI clauses | Contract stack foundation: disclosure, no-warranty, data handling, liability cap | High | Partial: drafted at consulting/materials/msa-template.md, not attorney-reviewed |
| Attorney review of MSA | Required before signing the first client | High | Missing |
| E&O insurance research | Vendor comparison and cost expectations | Medium | Exists at consulting/research/eo-insurance-options.md |
| E&O insurance policy (bound) | Many clients contractually require $1M coverage; also unblocks deals | High | Missing (quotes not yet run) |
| Privacy policy | Baseline compliance | High | Exists at app/privacy |
| Terms of service | Baseline compliance | High | Exists at app/terms |
| LLC footer attribution | "Services provided by Vora Technologies LLC" on every page | High | Exists at components/Footer.tsx |
| SOW template | Converts a scoped pilot into a signed contract | Medium | Missing |

## Brand documentation

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Brand context brief | Single source of truth distilled from DESIGN.md, roadmap, and the social spec | High | Exists at consulting/brand/brand-context.md |
| Brand guidelines | Full identity reference for anyone producing brand assets | High | In progress: consulting/brand/brand-guidelines.md |
| Social brand kit | Social-specific application of the design system | High | In progress: consulting/brand/social-brand-kit.md |
| Elevator pitches | Verbal positioning reference | High | In progress: consulting/brand/elevator-pitches.md |
| Launch announcement | Public introduction copy | High | In progress: consulting/brand/launch-announcement.md |
| Launch week plan | Rollout sequencing reference | High | In progress: consulting/brand/launch-week-plan.md |
| Website copy audit | Voice and tone pass across every live page | High | In progress: consulting/brand/website-copy-audit.md |
| Market and competitive research notes | Sourcing for the sales stats and white-space claim | Low | Exists at consulting/research/smb-ai-market-data.md |

## Content library

| Asset | Purpose | Priority | Status |
|---|---|---|---|
| Client case study (Brittany Lyons interior design site) | Delivered client work as a standing proof asset | High | Exists at public/clients/brittany-lyons/ |
| Work / case-study pages (Vora, ChapterHQ, open-source, site assistant) | Named, shipped products backing the "real AI product company" claim | High | Exists at app/work |
| 18-week syllabus | Content calendar backbone for both video and LinkedIn essays | High | Exists at consulting/social/syllabus.md |
| Case studies with before/after numbers, beyond Brittany Lyons | Roadmap explicitly flags the site as reading like an unproven freelancer without these | Medium | Missing (no engagement completed yet to draw numbers from) |
| Blog posts (scorecard/calculator announcement, evergreen) | SEO and the announced launch content | Medium | Missing |
| First-batch video clips (4 shorts, data-and-systems dimension) | Owner-altitude content per the syllabus | Medium | Missing |
| Weekly LinkedIn essays (operator register) | Operator-altitude content per the syllabus | Medium | Missing |
| Workshop / lunch-and-learn recording library | Reusable proof once the first chamber talk happens | Low | Missing |

## Missing and high priority

1. Resend sender domain verification. Blocks a professional send address and every follow-up email sequence behind it.
2. The five 5-email follow-up sequences (25 emails across all lead magnets). The delivery mechanism exists; the copy does not.
3. Booking / Calendly link. The roadmap calls for one primary CTA above the fold on every page, and it has nowhere to point yet.
4. Analytics. No tracking exists anywhere in the codebase, so launch conversion cannot be measured.
5. MSA attorney review and a bound E&O policy. Both are prerequisites for safely signing the first client.

## Summary

60 assets tracked across 8 categories. 25 exist, 11 are in progress (today's brand-deliverable batch), 2 are partial, and 22 are missing. Sales-process materials (intake through roadmap deck) are the most complete category at 7 of 8 built; email assets are the least complete at 1 of 6.
