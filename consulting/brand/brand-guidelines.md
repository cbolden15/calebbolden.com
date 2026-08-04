# Caleb Bolden brand guidelines

One page for anyone producing work under this brand: designers, developers, freelancers,
marketers. Source of truth for the underlying detail is `consulting/brand/brand-context.md`
and `DESIGN.md`. Where this page and those disagree, those win.

## Mission

Help local small businesses map and fix their processes first, then automate the work that
is left. Services are delivered in person by Caleb Bolden through Vora Technologies LLC,
with lean and six-sigma discipline applied before any AI gets built.

## Brand personality

- **Precise.** Every mark on a surface means something. Dimension lines annotate real
  numbers, not decoration.
- **Direct.** First person, plain sentences, no hedging. The point comes first.
- **Practical.** Proof is shipped work, not opinion content. If it does not save hours, it
  does not get built.
- **Calm.** White mat board, daylight, a single amber sticky note. Nothing shouts.
- **Warm.** A facilitator at a whiteboard, not a vendor at a booth. Precise does not mean
  cold.

## Target audience

**Owners.** Local small-business owners in trades, salons, landscaping, garage doors, DFW
local for Facebook. They run scattered systems and repetitive admin, and they have heard
enough AI hype to be skeptical of more. They respond to concrete hours saved and to seeing
the work, and they arrive through referral partners, chamber lunch-and-learns, and short
vertical video.

**Operators.** Ops leads at roughly 40-person companies. They already know where the
bottlenecks are and want someone who can map a workflow and prove a fix before scaling it.
LinkedIn is their channel, and longer written arguments land with them.

**Referral partners.** Bookkeepers, CPAs, MSPs, business bankers. They see process pain
before anyone else does and they trade on trust, so material aimed at them should make it
easy to describe the offer accurately to a client in one sentence.

## Color

Light theme only, locked. The brand is paper. Canonical values are OKLCH in
`app/globals.css`; the hex values below are the sRGB equivalents.

### Primary palette

| Token | Hex | Role |
|---|---|---|
| `bg` | `#FFFFFF` | Page. Pure white mat board, no tint. |
| `surface` | `#F2F7F8` | Panels and wells. |
| `ink` | `#111A1E` | Headlines and strong body. Drafting ink. |
| `ink-muted` | `#424F56` | Secondary body copy. |
| `ink-faint` | `#66747B` | Meta labels. Large or mono text only. |
| `blue` | `#006C7D` | Blueprint blue. Marks, links, diagram strokes, buttons. |
| `blue-deep` | `#00465A` | Hover states and strong strokes. |
| `blue-wash` | `#DDEFF3` | Soft fills, tag backgrounds, selection. |

### Secondary and status

| Token | Hex | Role |
|---|---|---|
| `sticky` | `#FAD27B` | Amber sticky note fill. Ink text on it. |
| `sticky-edge` | `#E3AD4B` | Sticky shadow edge and small amber marks. |
| `pos` | `#1D7D3E` | Confirmations only. |
| `neg` | `#AC3031` | Errors only. |
| `grid-line` | `#006C7D` at 9% | Graph-paper lines. |
| `hairline` | `#111A1E` at 14% | Structural rules and dividers. |

### Hard rules

1. No purple, violet, or magenta anywhere. Standing rule, no exceptions.
2. One amber sticky note per surface, maximum. It marks the single most important call on
   the page.
3. The graph grid never exceeds 9% opacity and never sits behind body copy. Content lives
   on clean white panels above it.
4. Text on blue fills is white. Text on the sticky is ink.
5. Green and red are reserved for confirmations and errors. They are never brand accents.
6. Verified contrast pairs: ink on bg 15.6:1, ink-muted on bg 8.5:1, blue on bg 6.2:1,
   white on blue 6.2:1, ink on sticky 11:1. Keep new pairings at WCAG AA or better.

## Typography

| Family | Role | Rules |
|---|---|---|
| Archivo | Display and headings | Expanded width, weight 600 or heavier for h1 and h2. Letter-spacing -0.02em, `text-wrap: balance`. |
| Schibsted Grotesk | Body and UI | 15 to 17px, line-height 1.6, measure capped at 70 characters. |
| Martian Mono | Annotation voice only | Dimension labels, timelines, tags. 11 to 12px, uppercase, short labels. Never body copy. |

Scale: h1 `clamp(2.4rem, 5.5vw, 4.25rem)`, h2 `clamp(1.8rem, 3.6vw, 2.6rem)`, ratio of at
least 1.25 between steps. Weight contrast carries hierarchy before size does. Headings are
sentence case in every medium.

## Wordmark usage (proposed)

No formal logo spec exists yet. There is no image mark. The logo is the text wordmark
**CALEB BOLDEN**, and the rules below are proposed defaults until a spec is signed off.

- Set in Archivo, expanded width, weight 600 or heavier, uppercase, letter-spacing -0.02em.
- Ink (`#111A1E`) or white only. Never blue, never amber, never a gradient.
- Clear space on all four sides equal to the cap height of the wordmark. Nothing crosses it.
- Minimum size 16px cap height on screen, 5mm in print. Below that, use the first name alone.
- Acceptable backgrounds: white, `surface`, or a solid `blue` fill with the wordmark in
  white.
- Never place the wordmark on the amber sticky, over the graph grid, over photography, or
  on any mid-tone fill.
- Never outline, shadow, emboss, rotate, stretch, condense, or re-letter it. No tagline is
  locked up with it.
- The legal name Vora Technologies LLC appears in footers, contracts, and the LinkedIn
  experience section. It is never the wordmark and never the feed identity.

## Iconography and imagery

Icons are drafting instruments, not app glyphs. Line only, 1.5 to 2px strokes in blueprint
blue, 2px corner radius, no fills, no duotone, no rounded cartoon shapes. An icon should
look like it was drawn with a straightedge. Pair icons with Martian Mono captions when the
icon names something specific, and leave them uncaptioned otherwise.

The recurring identity devices carry more weight than icons do. Dimension lines annotate a
real number with extension lines offset from the object, drafting convention. Dotted
leaders run from a mono label to the thing it names. Process boxes are 2px-radius
rectangles with blue strokes, mono captions, and straight connectors with small
terminators. The footer is a drafting title block: a hairline top rule and mono metadata,
no boxes.

Photography is daylight and real. Actual workspaces, shop counters, whiteboards, paper on a
desk. Neutral mat-board backgrounds, natural shadows, nothing color-graded toward teal or
orange. No stock-glossy handshakes, no glowing neural networks, no robot hands, no
generated AI imagery of any kind. If a real photo is not available, use a diagram instead.

## Voice and tone

Confident, direct, plain. First person. It sounds like a process engineer explaining
something at a whiteboard, not a marketer writing copy. Sentence length varies. Concrete
beats abstract every time.

Hard rules: no em dashes as connectors, sentence-case headings, a named source on every
statistic, no "it's not just X, it's Y" constructions, no rule-of-three padding, no
signposting like "let's dive in".

Words that fit: process, map, fix, automate, hours back, waste, bottleneck, pilot, working,
shipped.

Words to avoid: journey, transform, transformation, empower, cutting-edge, revolutionize,
solutions as a standalone noun, synergy, seamless, robust, game-changing, unlock,
supercharge, leverage as a verb, AI-powered as decoration.

Approved statistics, always with the source named in the sentence: Gartner predicted 30% of
GenAI projects are abandoned after proof of concept. BCG found 74% of companies cannot show
tangible AI value. S&P Global measured companies abandoning most AI initiatives rising from
17% to 42% in one year. External-specialist implementations succeed around 67% of the time
against roughly a third for internal builds. The MIT and NANDA "95% of pilots fail" figure
is contested and not peer-reviewed; do not use it.

## Five do's

1. Do annotate real numbers with dimension lines. A timeline, an hour count, a percentage.
2. Do name the source inside the sentence whenever a statistic appears.
3. Do put content on clean white panels and keep the graph grid in the margins.
4. Do write headings in sentence case in every medium, including social and slides.
5. Do lead with the outcome the owner gets, in first person, before any explanation.

## Five don'ts

1. Don't use purple, violet, or magenta in any asset, ever.
2. Don't put more than one amber sticky note on a surface.
3. Don't publish a statistic without a named source, and don't cite the MIT and NANDA 95%
   figure at all.
4. Don't use em dashes as connectors. Use a period, comma, colon, or parentheses.
5. Don't use stock or generated AI imagery. Photograph the real workspace or draw a
   diagram.
