# Higgsfield video briefs — calebbolden.com rebrand

Two background-video slots in the rebuilt homepage. Until the clips exist, each slot
falls back to a CSS gradient (the site looks finished without them). Generate with the
Higgsfield CLI (`higgsfield auth login` first), then drop the files here:

- Hero → `public/video/hero-loop.mp4`
- CTA → `public/video/cta-loop.mp4`

Hard rule on both: **no purple / violet / magenta** in the grade.

---

## Hero — `background-video` (fills the dark hero card, 16:9, no scrim)

The lower-left must stay dark enough for the white headline; the top tolerates the
frosted status pill. The video carries the warmth; the UI stays a clean white mat.

- **Model:** `veo3_1` · 16:9 · duration 8 · quality high
- **Scene:** Cinematic b-roll of a small-business owner getting their time back — closing
  a laptop and stepping out of a sunlit workshop, hands lifting off a keyboard, a quiet
  shop at golden hour. The act of stepping away from busywork, faces incidental.
- **Camera:** slow dolly drift with an occasional rack focus, seamless loop-friendly.
- **Lighting:** soft window key, warm golden-hour, deep charcoal mid-tone shadows.
- **Color grade:** neutral warm-charcoal with clean highlights, low saturation. No purple.
- **Mood:** calm, confident, human, premium.
- **Avoid:** blown-out whites lower-left, readable on-screen text, logos, fast cuts,
  any purple/magenta cast.

```bash
higgsfield generate create veo3_1 \
  --prompt "Cinematic b-roll of a small-business owner stepping away from a busy desk into a calmer sunlit moment, closing a laptop, hands off keyboard, slow dolly drift with occasional rack focus, soft warm golden-hour window light with deep charcoal mid-tones, neutral warm grade, calm confident human mood, no readable text or logos" \
  --aspect_ratio 16:9 --duration 8 --quality high --wait
```

---

## CTA — `background-video` (full-bleed behind the cool-blue card, 16:9, no overlay)

Plays at full opacity with no scrim, so it must stay calm and low-contrast to keep the
navy text legible over the left third where the form sits.

- **Model:** `veo3_1` · 16:9 · duration 8 · quality high
- **Scene:** Abstract slow-drifting pale steel-blue and cool off-white bokeh / gentle
  gradient mesh with faint navy accents. Non-literal flowing light, nothing that competes
  with foreground text.
- **Camera:** near-static, very slow lateral drift.
- **Lighting:** diffuse and soft, no harsh highlights.
- **Color grade:** locked to the card palette — pale steel-blue `#d8e5f2`, cool off-white
  `#f0f2f7`, faint navy `#08063C`. Low saturation, low contrast. No purple.
- **Mood:** serene, premium, ambient.
- **Avoid:** bright flashes, fast motion, high-contrast hotspots, hard edges, any
  warm or purple cast, text or logos, anything busy in the left third.

```bash
higgsfield generate create veo3_1 \
  --prompt "Abstract slow-drifting pale steel-blue and cool off-white bokeh particles with faint navy accents, near-static camera with gentle lateral drift, diffuse soft lighting, low-contrast low-saturation serene ambient tech background, no text or logos" \
  --aspect_ratio 16:9 --duration 8 --quality high --wait
```

---

## After generating

1. Save both as `public/video/hero-loop.mp4` and `public/video/cta-loop.mp4`.
2. Optional: add poster stills at the same paths (`hero-poster.jpg`) and wire `poster=` on
   the `<video>` tags in `components/Hero3D.tsx` and `components/CTA.tsx`.
3. Re-run the dev server — the videos autoplay behind the existing gradient fallbacks.
