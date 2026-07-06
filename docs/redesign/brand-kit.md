# Brand Kit — calebbolden.com

Captured 2026-06-13 from the live site via the `design-ref` skill (Mode B redesign capture).
Source of truth for the rebrand. Screenshot: `current-site-capture.jpeg`.

## Capture method

The skill's auto-fallback ingest ran as designed:

1. `firecrawl scrape` — CLI not installed, so this leg was skipped.
2. `curl` probe — returned 301, no usable body.
3. **Playwright fallback** — navigated the live site, extracted signals via one `evaluate` call, took a full-page screenshot.

So this kit comes from the rendered page, not raw HTML.

## Signals

| Field | Value |
|---|---|
| Brand / industry | Caleb Bolden — AI automation for small business (consulting / agency) |
| Title | Caleb Bolden \| AI Solutions for Small Business |
| Meta description | "I build AI systems that give small businesses their time back. Voice agents, CRM automation, marketing engines, and AI employees tailored to your industry." |
| Logo | Text wordmark "CALEB BOLDEN" (no image logo) |
| Audience | Small business owners → library token `smb` |
| Sections | 6 on the homepage; nav = Services, Industries, Blog |
| Video | None present (opportunity to add Higgsfield clips) |
| Vibe (library token) | `dark-premium` |

### Copy / tone

Confident, direct, anti-busywork. First person.

- H1: "I automate the work you shouldn't be doing"
- H2: "What could AI handle for you?"
- CTAs: "Analyze My Business", "Just tell me about your business"

### Palette (current)

Dark base, off-white text, blue accent family. No purple.

| Role | Value | Hex |
|---|---|---|
| Base background | `rgb(3, 7, 18)` | `#030712` (near-black navy) |
| Body text | `rgb(249, 250, 251)` | `#F9FAFB` (off-white) |
| Muted text | `rgb(156, 163, 175)` | `#9CA3AF` |
| Accent blue | `rgb(96, 165, 250)` | `#60A5FA` |
| Accent blue (light) | `rgb(147, 197, 253)` | `#93C5FD` |
| Accent blue (deep, 10%) | `rgba(37, 99, 235, 0.1)` | `#2563EB` @ 10% |
| Status red | `rgb(252, 165, 165)` | `#FCA5A5` |
| Status green | `rgb(134, 239, 172)` | `#86EFAC` |

Tailwind-based scale.

### Fonts

- Headings: Plus Jakarta Sans
- Body: Inter

## Constraints

- **No purple / violet / magenta** anywhere (standing rule; enforced at apply time and in any generated video grade).
- Keep the positioning and copy. They are strong; the rebrand is visual only.

## Dated patterns to avoid

The current site is already a modern dark-SaaS look. The risk is sameness, not age. A redesign should differentiate from the standard blue-glow dark-gradient hero rather than clone it.
