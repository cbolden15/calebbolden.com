# Homepage Redesign Design

Date: 2026-06-13

## Goal

Redesign the homepage for Caleb Bolden as a boutique AI consultancy. The site should position Caleb Bolden as a strategic and hands-on partner for larger companies first, then startup and tech operators.

The homepage should sell two connected offers:

- AI strategy and roadmap
- Full implementation from roadmap to working automation

Primary CTA: `Book strategy call`.

CTA target: use `NEXT_PUBLIC_CALENDLY_CLIENT_URL` when configured. If it is missing, fall back to `mailto:cbolden15@gmail.com`.

## Scope

This redesign covers the homepage only.

Out of scope for the first implementation:

- About page redesign
- Contact page redesign
- Blog/workflows styling
- Full content management changes
- Keeping the current fixed AI chat sidebar

The current homepage can be replaced fully. The only required brand element to keep is the `Caleb Bolden` name.

## Audience

Primary audience: leaders at larger companies who need AI strategy, workflow automation, and implementation leadership.

Secondary audience: startup and tech operators who need working AI prototypes, internal agents, and automated workflows.

The copy should speak to operators and executives who are past casual AI interest and need shipped systems.

## Positioning

Core positioning:

> From AI roadmap to working automation.

Supporting message:

Caleb Bolden helps teams identify high-value AI opportunities, design practical automation roadmaps, and ship working systems that reduce manual work.

The site should feel like a polished consulting practice, not a solo portfolio and not a SaaS product landing page.

## Design Direction

Use a hybrid visual system:

- Dark cinematic hero for trust, depth, and AI atmosphere
- Warm off-white editorial sections for services, process, and proof
- Restrained monochrome proof/technical blocks
- Minimal accent color, avoiding purple, violet, and magenta

Avoid the current dark-blue dashboard-heavy SaaS look. The redesign should not feel like a generic AI dashboard product. It should feel strategic, crisp, and operational.

## Design References

The design uses the `/design-ref` prompt library as synthesis input. Do not copy prompt code verbatim.

Selected prompt roles:

- `hero/ai-automation-hero-split-text-video.md`: dark cinematic hero layout, left-aligned content, right-biased/ambient video, staggered word reveal.
- `hero/flowmate-serif-grayscale.md`: warm off-white palette, quiet borders, editorial restraint for light sections.
- `features/agency-services-numbered-list.md`: large numbered services list with strong typography and minimal decoration.
- `features/bento-grid-stats-why-us-smallmultiples.md`: proof grid with metrics, small charts, and structured evidence.
- `features/viktor-portfolio-technical-specs.md`: compact technical spec rows for credibility.
- `cta/pro-ai-deck-glass-contact-split.md`: closing CTA with large type, primary call button, and compact contact/audit card.
- `nav/sentinel-ai-floating-transparent.md`: transparent premium nav over the dark hero.

## Homepage Structure

### 1. Hero

Purpose: establish premium AI consultancy positioning and drive strategy-call conversion.

Content:

- Brand: `Caleb Bolden`
- Headline: `From AI roadmap to working automation`
- Subhead: explain strategy plus hands-on implementation in plain language
- Primary CTA: `Book strategy call`
- Secondary CTA: `View prototype work`
- Supporting credibility line focused on hands-on AI systems and automation ROI

Visual:

- Full-viewport or near-full-viewport dark hero
- Transparent top nav
- Content left or lower-left
- Ambient AI/workflow video or generated visual biased away from the text area
- Bottom fade into next section
- No dashboard mockup as the main hero object

Motion:

- Subtle headline word reveal
- Supporting copy and CTA fade/slide in
- Ambient background motion only, no busy effects

### 2. Services

Purpose: clarify what the consultancy does.

Layout:

- Warm off-white editorial section
- Large heading
- Numbered list with oversized numbers and compact descriptions

Services:

1. AI Strategy
2. Automation Roadmap
3. Prototype Build
4. Full Implementation
5. Rollout Support

Copy should explain business outcomes, not tool categories.

### 3. Proof / Prototype Work

Purpose: prove hands-on ability without fake client claims.

Layout:

- Bento or mixed-card grid
- Combination of light and dark cards
- One or more cards can show prototype/demo screenshots or generated abstract system visuals
- Cards should include structured metrics, diagrams, or spec-like data where useful

Proof sources:

- Personal projects
- Demos
- Prototypes
- Automation examples
- Stack/process credibility

Rules:

- No fake client logos
- No unverifiable named outcomes
- If metrics are used, label them as examples, prototypes, or personal project results unless verified

### 4. Process

Purpose: make engagement feel concrete.

Process:

1. Diagnose
2. Design
3. Build
4. Operationalize

Layout:

- Editorial light or monochrome section
- Clear steps with short descriptions
- Can reuse numbered-list typography at smaller scale

### 5. AI Audit CTA

Purpose: replace the fixed chat panel with a lower-friction lead capture path.

Form fields:

- Company URL
- Workflow pain
- Email

Behavior:

- Secondary to strategy-call CTA
- First implementation can submit as a prefilled `mailto:cbolden15@gmail.com` if no backend endpoint is added
- Should not dominate the first screen

### 6. Final CTA / Footer

Purpose: close with a clear action.

Content:

- Headline reinforcing roadmap-to-automation positioning
- Primary CTA: `Book strategy call`
- Contact details or simple contact card
- Minimal footer links

Visual:

- Dark cinematic close or dark glass section
- Large editorial headline
- Compact contact/audit card

## Navigation

Desktop nav:

- `Services`
- `Proof`
- `Process`
- `Book strategy call`

Mobile nav:

- Keep minimal. If implementation time is tight, show wordmark and CTA only.
- Avoid complex mobile drawer unless needed.

## Content Tone

Plain, direct, senior.

Use:

- Concrete outcomes
- Operational language
- Short service descriptions
- Clear implementation ownership

Avoid:

- AI hype
- "Revolutionary" or inflated language
- Small-business-only framing
- Vague agency slogans
- Fake social proof

## Visual Constraints

- No purple, violet, or magenta palette.
- Avoid one-note blue dominance.
- Avoid decorative gradient orbs.
- Do not use a dashboard mockup as the main hero visual.
- Keep cards purposeful: proof cards, form cards, contact cards.
- Use strong spacing and typography instead of excessive chrome.
- Text must fit cleanly on mobile and desktop.

## Video Slots

### Hero Background Video

Slot: background-video

Placement: hero background, right-biased or ambient behind content.

Brief:

Abstract AI workflow motion: soft data filaments, system maps, or automated process flows. Slow camera drift, low-key lighting, near-black neutral grade with restrained cool highlights. Keep the left content zone dark and quiet. No logos, no readable text, no purple/magenta, no fast cuts.

Suggested Higgsfield command:

```bash
higgsfield generate create veo3_1 --prompt "abstract AI workflow map with soft data filaments and automated process flows, slow cinematic drift, low-key near-black lighting, restrained cool white highlights, dark quiet left side for text, premium consulting mood, no text no logos no purple" --aspect_ratio 16:9 --duration 8 --quality high --wait
```

### Proof Media Video

Slot: section-video

Placement: one proof/prototype card.

Brief:

Close view of abstract dashboard panels, workflow nodes, and automation states moving in a restrained monochrome UI. Slow push-in, calm execution feel, neutral off-white and charcoal grade. No logos, no fake product names, no bright accent wash.

Suggested Higgsfield command:

```bash
higgsfield generate create seedance_2_0 --prompt "abstract monochrome workflow dashboard panels and automation nodes moving through task states, slow push-in, calm execution feel, neutral off-white and charcoal grade, premium consulting prototype mood, no text no logos" --aspect_ratio 16:9 --duration 6 --resolution 1080p --wait
```

### Final CTA Background

Slot: background-video

Placement: final CTA background or subtle dark media plane.

Brief:

Near-black abstract field with slow upward motion and faint white-blue system lines, suggesting progress from strategy to execution. Keep contrast low enough for headline and form readability. No purple/magenta, no busy light streaks.

Suggested Higgsfield command:

```bash
higgsfield generate create veo3_1 --prompt "near-black abstract field with slow upward motion and faint white-blue system lines, calm premium progress mood, low contrast areas for readable text, no text no logos no purple" --aspect_ratio 16:9 --duration 8 --quality high --wait
```

## Implementation Notes

Likely files:

- `app/page.tsx`
- `app/globals.css`
- `components/Header.tsx`
- New or rewritten homepage section components
- `components/AIChat.tsx` integration may need removal or homepage-specific disabling

The current AI chat sidebar should not appear as a fixed first-screen panel on the redesigned homepage. If it remains globally mounted, add a route-aware or prop-based way to suppress it on the homepage and replace it with the AI Audit CTA section.

## Acceptance Criteria

- Homepage clearly positions Caleb Bolden as an AI consultancy.
- Primary CTA is `Book strategy call`.
- Current fixed chat sidebar is removed or suppressed on homepage.
- Homepage includes hero, services, proof/prototype work, process, AI audit CTA, and final CTA/footer.
- Visual system uses dark hero plus light editorial sections.
- No purple/violet/magenta palette.
- No fake client proof or unverifiable logos.
- Page is responsive and readable on mobile and desktop.
- Build passes.
