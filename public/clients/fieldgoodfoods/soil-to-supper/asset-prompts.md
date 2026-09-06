# Soil to Supper media direction

## September 6, 2026: hero ad candidates

Three hero video candidates were produced so the client can choose a direction. All three are wired into `index.html` behind a review switcher (bottom-right pill, or `?hero=a|b|c`; the choice persists per browser). Each plays once, then a second stacked `<video>` takes over with its seamless loop. Every candidate has its own desktop and mobile poster frame. Files live in `assets/hero-ads/`. Once a candidate is approved: delete the `.hero-switcher` block in `index.html`, the switcher CSS in `style.css`, and the `HERO_CANDIDATES` logic in `app.js`, hard-code that candidate's two sources and posters, and remove the other two candidates' files.

Design spec: `docs/superpowers/specs/2026-09-06-hero-ad-videos-design.md`. Work directory with every request, job response, raw take, contact sheet and crop: `work/hero-ads-2026-09-06/`.

| Candidate | Length | Loop | Source takes |
|---|---|---|---|
| A. `hero-montage` | 24s | 4s platter hold | a1 Veo (4.5–8s), a2 Veo v2, a3 Veo, a4 Veo, a5 Kling v2, a6 Veo |
| B. `hero-cinematic` | 8s | 6.5s self-crossfade | b1 Veo |
| C. `hero-product` | 11.6s | 3s slice hold | c1 Veo, c2 Veo |

### Process

Higgsfield CLI 1.1.24, text-to-video. Every shot was generated on Google Veo 3.1 (preview variant, ultra quality, 8s) and Kling 3.0 (4K mode, 5s or 10s), plus Seedance 2.5 at 1080p for the single-shot drone. 25 takes in total including six retakes; about 1,400 credits. All Veo and Kling takes came back at native 3840x2160, 24fps. Assembly is ffmpeg: 4K intermediates, 0.35s crossfades, then a 1080p H.264 web encode capped at 4.5 Mbit/s. Loop files dissolve their last second into their first so the restart is invisible.

Review was contact sheets (six frames per take) followed by native-pixel center crops of hands, knife, cut face, fence rails and cattle for every selected take.

### What was selected and why

- a1 soil: Veo. Backlit soil falling from a hand with cattle behind. A green flare blob sits in the first four seconds, so only 4.5–8s is used. Kling's take was clean but flat.
- a2 herd: Veo retake. First Veo take was midday green with a person at the fence; Kling put a green flare blob in both attempts whenever the sun was in frame.
- a3 fence: Veo. Boots along the fence line in backlit dust. Kling's take was fine, Veo's light was better.
- a4 cut: Veo. Kling's take had a horned cow behind the counter.
- a5 cookout: Kling retake. Both Veo takes showed every face turned to camera and rendered a white family despite the prompt. The retake framed the camera behind the family at the head of the table, everyone facing the grill and the sunset. Kling honored it; Veo ignored it again.
- a6 platter: Veo. Hands set a platter of sliced ribeye on a rough table, family blurred beyond under string lights. Kling's take rendered the meat as a sliced loaf.
- b1 drone: Veo. Oak branches overhead, sun at frame left, fence receding. Kling 4K and Seedance 1080p were both usable; Seedance had the warmest light but only 1080p.
- c1 sear: Veo. Kling's steak sat raw in the pan without crusting.
- c2 slice: Veo. Kling's take was clean but had no ranch context behind the board.

### Homepage photograph candidates (same day, stills only)

Three candidates for each of the five homepage photographs, one each from Seedream 5.0 Pro (1), GPT Image 2 high (2) and Nano Banana Pro (3), all at 2K in the slot's own aspect ratio. 15 images, 57.5 credits. Files are `assets/stills/<shot>-<n>.webp`, resized to the slot's existing intrinsic size; originals, requests, job responses, sheets and native crops are under `work/hero-ads-2026-09-06/stills/`.

The review panel (bottom-right) has a row per slot: Hero A/B/C, then Herd, Soil, Check, Cuts and Table with 1/2/3. Clicking a slot name scrolls to it. Picks persist per browser and "Copy link to these picks" produces a URL like `?hero=b&media=herd:2,table:2` that opens with the same choices. The current photographs stay as the default until a number is pressed.

Review notes per slot:

- Herd: all three clean. 1 has moss-hung oaks and a barn, 2 has the sun through the oak (warmest), 3 has fence posts in the foreground.
- Soil: all three clean. 1 is the closest to the previous shot with a fence and sun behind; 2 shows cattle beyond; 3 is the tightest on roots.
- Check: all three from behind, face turned to the field, backlit dust. 1 is the strongest; 3 is the driest, straw-colored grass.
- Cuts: 2 is the overhead butcher-paper shot with the salt bowl and knife; 1 and 3 add the farm behind the board.
- Table: 2 is the best photograph in the set (profiles, real hands, lantern, sliced steak in front). 1 and 3 are usable but have brown or Hereford cattle in the far background instead of black Angus; flag this if either is chosen.

Teardown once picks are approved: delete the `review-panel` block in `index.html`, the `.review-panel` CSS, the `HERO_CANDIDATES` and `STILL_SLOTS` logic in `app.js`, hard-code the chosen sources, and remove the unchosen files from `assets/hero-ads/` and `assets/stills/`.

### Gotchas from this run

- Negative phrasing in a prompt is read as a subject. "No stacked lens flares" produced flares on both models. Retake prompts were written positive-only.
- A shared look block that mentions cattle puts cattle in every shot, including the cutting board and the backyard. Cattle direction now lives only in cattle shots.
- Veo 3.1 does not hold ethnicity or back-to-camera staging for a group of people. Kling 3.0 does. For any shot where faces must stay hidden, generate on Kling first.
- Kling 3.0 adds a green lens-flare blob whenever the sun is inside the frame, regardless of prompt. Keep the sun just outside the frame edge on Kling, or use Veo for sun-in-frame shots.
- The Ultra plan allows eight concurrent jobs. The submit script retries on `rate_limit_reached` every 75s instead of failing.
- The `reframe` workflow (9:16 mobile) costs 75 credits per 8s at 1080p, so it is deferred until a candidate is chosen. The mockup's mobile breakpoint shows the poster image rather than the video anyway.

## September 5, 2026: current hero and family replacements

This revision replaces only the desktop hero poster, mobile hero crop, hero video and family supper photograph. The existing asset filenames stay in place. Layout, visible copy, styles, scripts, interactions and the other four photographs are unchanged. The only HTML edits correct the three intrinsic media dimension attributes.

Audit files, original masters, exact CLI requests, job responses, model schemas, review crops and the previous assets are retained under `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05`.

### Catalog and quality process

Higgsfield CLI 1.1.23 was used. The live catalog was checked before generation and captured in `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/catalog/models.json`; model parameter schemas are in the same directory. It contained 86 model entries. The current photorealistic comparison used Seedream 5.0 Pro at 2K first, GPT Image 2 at high-quality 4K, and Higgsfield Soul 2.0 at 2K. This is a practical scene-specific comparison, not a claim that one model universally ranks highest.

Thirteen still candidates were produced: nine hero candidates, including the two repair alternatives, and four family candidates. Five video takes were compared. The final corrected hero was animated with Kling 3.0 in 4K mode and Seedance 2.5 at high-bitrate 1080p using the same six-second prompt and the same full-resolution starting image.

Review started with framing and behavior, then checked native-size crops of people, hands, every primary family face, fencing and texture. The cattle check was tightened to isolated enlarged pixel crops after a broad silhouette proved to have two opposing heads. That defect was in the still, not merely invented by Kling. The first three video takes were discarded with their defective source. A localized model edit removed that animal; all four remaining cattle were checked individually before both video models were rerun. Nothing from the defective source was integrated.

Selected assets:

- Hero still: `hero-repair-seedream`. Selected after renewed anatomy review. The malformed central silhouette is fully removed and replaced with matching pasture. All four remaining cattle were inspected separately: one head and body each, coherent legs and tail, no overlaps. The separated standing farmers, grounded boots, relaxed hands, weathered straight rails, neutral light and original pasture composition remain intact. Prefer this ordinary textured rendering over the more reconstructed GPT edit, not on sharpness alone.
- Family photograph: `family-gpt-image-2`. Selected. Four distinct people across three generations, each primary face sharply resolved at native size, ordinary age and skin detail, separated plausible hands and cutlery, no camera gaze or staged laughter. Grandmother and daughter attend to one another while father and boy concentrate on food. Unrelated everyday clothing, worn table, partly eaten plates, water glasses and crumpled napkin feel specific and unstyled. Selected for this coherent candid interaction as well as focus, not simply because it has the most pixels.
- Hero motion: `hero-motion-repaired-seedance-2-5`. Selected. Four separate cattle keep coherent single-headed silhouettes while making small grazing movements. Both farmers stay standing in place with planted boots, relaxed hands and only a slight body settling. The fence and framing remain stable in the sampled frames; grass and leaves move gently. No walking, gestures, camera move, body morph, fence warp or new animal was observed. It is the stronger match to the restrained documentary brief despite being delivered at 1080p rather than Kling's 4K mode.

### Candidate records and rejection reasons

Seedream seeds below are the exact server-assigned seeds returned with each job. Soul seeds were supplied explicitly. GPT Image 2, Kling 3.0 and Seedance 2.5 did not expose or return a seed in these job responses; those entries say “not exposed” rather than inventing one. Exact job IDs and request parameters are retained for traceability, but seedless requests are not promised to reproduce bit-for-bit.

#### hero-seedream-a

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `99792`. Job: `56747011-b8ca-43ae-9870-b1afea384a8b`. Exact prompt: P01.

Rejected at composition gate. Farmers occupy roughly half the image height and stand too close together. Too much attention on a paired portrait rather than a quiet distant pasture check.

#### family-seedream-a

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `118900`. Job: `4e8b6338-adad-41d5-beb0-83f31632b770`. Exact prompt: P02.

Rejected after native inspection. Believable meal and distinct expressions, but the nearer grandmother is softer than the central adults. Dense grain reduces face and skin clarity. Several simultaneous raised-fork poses feel more arranged than the selected scene.

#### hero-seedream-b

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `123241`. Job: `ecf70df6-234c-46bd-b0fd-a97743bf796c`. Exact prompt: P01.

Rejected at composition gate. Large foreground figures, close spacing and conspicuously lined-up cattle. Clean detail does not make the framing fit the brief.

#### family-seedream-b

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `32403`. Job: `3a435ef5-4a2d-4cc5-a103-3fb7f737b56b`. Exact prompt: P02.

Rejected after native inspection. Nearer grandmother and boy are less evenly sharp than the middle pair, with coarse grain and similar simultaneous eating poses. Does not meet the all-primary-faces-sharp requirement as well as GPT.

#### hero-gpt-image-2

Model: `gpt_image_2`. Settings: `{"aspect_ratio":"16:9","resolution":"4k","quality":"high"}`. Native output: 3840 × 2160. Seed: `not exposed`. Job: `107165f5-2bee-4b54-ae8b-267f1025f2ea`. Exact prompt: P01.

Rejected at composition gate. Fine detail and a usable empty left side, but the farmers are still large near-camera subjects rather than small distant figures.

#### family-gpt-image-2

Model: `gpt_image_2`. Settings: `{"aspect_ratio":"16:9","resolution":"4k","quality":"high"}`. Native output: 3840 × 2160. Seed: `not exposed`. Job: `7c58d5c0-6eb9-459d-99d9-9b81dd290091`. Exact prompt: P02.

Selected. Four distinct people across three generations, each primary face sharply resolved at native size, ordinary age and skin detail, separated plausible hands and cutlery, no camera gaze or staged laughter. Grandmother and daughter attend to one another while father and boy concentrate on food. Unrelated everyday clothing, worn table, partly eaten plates, water glasses and crumpled napkin feel specific and unstyled. Selected for this coherent candid interaction as well as focus, not simply because it has the most pixels.

#### hero-soul-2

Model: `text2image_soul_v2`. Settings: `{"aspect_ratio":"16:9","quality":"2k","seed":905261}`. Native output: 2048 × 1152. Seed: `905261`. Job: `bda2c123-c83b-4ecc-9f83-e3dafcaa48a5`. Exact prompt: P01.

Rejected at composition gate. Large figures, a foreground fence dominating the left copy area, invented horns, near-overlapping cattle and a turned/crossed stance that risks reading as a step.

#### family-soul-2

Model: `text2image_soul_v2`. Settings: `{"aspect_ratio":"16:9","quality":"2k","seed":905262}`. Native output: 2048 × 1152. Seed: `905262`. Job: `574bbe25-ca44-413b-a7d6-c3b8d8604f38`. Exact prompt: P02.

Rejected after native inspection. Faces span a deeper focal arrangement, contrast is harder and the middle woman reads much younger than intended. An invented shirt badge/logo and ornamental rings add styling not requested. Less convincing as the ordinary unstyled family scene.

#### hero-wide-seedream-a

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `701351`. Job: `ae70373f-e368-462b-949c-2bb23e83de11`. Exact prompt: P03.

Rejected. Wider than the first batch, but people remain around a third of the image height. The cattle form an unusually even horizontal row. Not as incidental as the selected wide frame.

#### hero-wide-seedream-b

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `271433`. Job: `608ee0bc-0c3a-4a96-9473-b226b97f43fd`. Exact prompt: P03.

Rejected on reopened anatomy review, despite initially passing composition and broader native-crop review. A tighter pixel inspection reveals two opposing heads on the broad central animal at approximately x1100-1250, y590-700. The initial Kling take exposes that source defect as two animals. The same defect persists in the first Seedance and endpoint-anchored Kling takes, so none can be integrated. The good farmer spacing, posture, fence and pasture do not excuse the malformed cattle.

#### hero-wide-gpt-image-2

Model: `gpt_image_2`. Settings: `{"aspect_ratio":"16:9","resolution":"4k","quality":"high"}`. Native output: 3840 × 2160. Seed: `not exposed`. Job: `8a146537-6e79-4f49-a3ad-84426074cd07`. Exact prompt: P03.

Rejected after native inspection. Small separated people and open left space meet the composition brief, but the man is rendered in a neater polo-like shirt and the fine pasture texture has a flattened, processed look. Fence and figures read more formally arranged. Extra resolution is not enough to displace the more incidental Seedream frame.

#### hero-motion-kling-3

Model: `kling3_0`. Settings: `{"aspect_ratio":"16:9","duration":8,"mode":"4k","sound":"off"}`. Native output: 3832 × 2164. Seed: `not exposed`. Job: `6ec45caf-47de-410f-b29b-75d3cc9b9e56`. Exact prompt: P04.

Input image: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-wide-seedream-b.png`.

Rejected. The broad central animal separates into two animals during the take. A tighter source inspection then shows that the starting still already contained a double-headed merged silhouette. This is a source-anatomy failure, not merely a Kling hallucination. The take also adds more foot and body displacement than requested. None of it is integrated.

#### hero-motion-seedance-2-5

Model: `seedance_2_5`. Settings: `{"aspect_ratio":"16:9","duration":8,"mode":"omni_reference","resolution":"1080p","bitrate_mode":"high","generate_audio":false}`. Native output: 1920 × 1080. Seed: `not exposed`. Job: `a227e3f5-47e7-4af0-b470-db59012a0c3b`. Exact prompt: P04.

Input image: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-wide-seedream-b.png`.

Rejected when source review was reopened. Camera and human motion are restrained, but the double-headed animal from the starting photograph persists. Temporal stability does not make invalid source anatomy acceptable.

#### hero-motion-kling-3-anchored

Model: `kling3_0`. Settings: `{"aspect_ratio":"16:9","duration":6,"mode":"4k","sound":"off"}`. Native output: 3832 × 2164. Seed: `not exposed`. Job: `9d5b318a-9e89-476e-a28a-fd1a01f83166`. Exact prompt: P05.

Input images: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-wide-seedream-b.png`, `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-wide-seedream-b.png` (same still supplied as both start and end frame).

Rejected. Supplying the same still as both endpoints makes motion nearly static but retains the same malformed animal. Endpoint anchoring is not an anatomy repair and provides less visible natural grazing or breeze movement.

#### hero-repair-seedream

Model: `seedream_v5_pro`. Settings: `{"aspect_ratio":"16:9","resolution":"2k"}`. Native output: 2720 × 1536. Seed: `170985`. Job: `5f126302-8acb-45a4-86c9-4bca4d81bf2e`. Exact prompt: P06.

Input image: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-wide-seedream-b.png`.

Selected after renewed anatomy review. The malformed central silhouette is fully removed and replaced with matching pasture. All four remaining cattle were inspected separately: one head and body each, coherent legs and tail, no overlaps. The separated standing farmers, grounded boots, relaxed hands, weathered straight rails, neutral light and original pasture composition remain intact. Prefer this ordinary textured rendering over the more reconstructed GPT edit, not on sharpness alone.

#### hero-repair-gpt-image-2

Model: `gpt_image_2`. Settings: `{"aspect_ratio":"16:9","resolution":"4k","quality":"high"}`. Native output: 3840 × 2160. Seed: `not exposed`. Job: `0115729a-e614-49d4-b984-6f9fd897c1f9`. Exact prompt: P06.

Input image: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-wide-seedream-b.png`.

Rejected after comparison with the repaired Seedream frame. It successfully removes the malformed animal, but reconstructs more of the grass and wood detail and gives the scene a cleaner, more processed texture. The Seedream repair better preserves the incidental character of the original composition.

#### hero-motion-repaired-kling-3

Model: `kling3_0`. Settings: `{"aspect_ratio":"16:9","duration":6,"mode":"4k","sound":"off"}`. Native output: 3832 × 2164. Seed: `not exposed`. Job: `a2ae15c5-a430-4fbd-9749-2f59c1de7183`. Exact prompt: P07.

Input image: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-repair-seedream.png`.

Rejected after comparison on the corrected source. Four separate cattle remain coherent, but the man moves a boot outward and develops a conspicuous sideways lean. This is more action than the barely perceptible standing weight shift in the brief. The larger 3832 x 2164 output is not a reason to accept the weaker motion.

#### hero-motion-repaired-seedance-2-5

Model: `seedance_2_5`. Settings: `{"aspect_ratio":"16:9","duration":6,"mode":"omni_reference","resolution":"1080p","bitrate_mode":"high","generate_audio":false}`. Native output: 1920 × 1080. Seed: `not exposed`. Job: `9e3e93f9-956a-43e7-a0e2-dfe2ab471ad4`. Exact prompt: P07.

Input image: `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/candidates/hero-repair-seedream.png`.

Selected. Four separate cattle keep coherent single-headed silhouettes while making small grazing movements. Both farmers stay standing in place with planted boots, relaxed hands and only a slight body settling. The fence and framing remain stable in the sampled frames; grass and leaves move gently. No walking, gestures, camera move, body morph, fence warp or new animal was observed. It is the stronger match to the restrained documentary brief despite being delivered at 1080p rather than Kling's 4K mode.

### Exact prompts

Prompts are quoted verbatim. Repeated prompts are listed once and referenced by ID in each candidate record.

#### P01

```text
Wide 16:9 unposed documentary photograph of an ordinary working cattle farm in the rural American South on a bright overcast late morning. Two Black family farmers stand still beside a weathered wooden pasture fence, quietly watching their herd. They are small distant figures in the right third of the photograph, each about one fifth of the image height. A Black woman in her late sixties wears a faded burgundy cotton work shirt, worn jeans and practical rubber boots. Her adult son wears a washed blue work shirt, dull brown work trousers and muddy boots. No hats. View both mainly from behind, with only a small distant side profile visible. They stand four feet apart, not touching, both feet planted separately on the ground, knees relaxed, ordinary balanced anatomy. Their empty arms rest loosely at their sides; neither grips a tool nor reaches across the other. Their attention is on five separate hornless Black Angus cattle grazing beyond the fence at irregular distances, not on the camera. The fence is a simple real structure with rough gray wooden posts and two continuous straight horizontal timber rails, each rail meeting its posts correctly. It occupies the right half and recedes toward the far right, never passes through a body, and never blocks a face. The left sixty percent is quiet open green pasture with no people, leaving generous uncluttered space for headline copy. Subtle uneven grass, clover, a few broadleaf weeds, worn earth beneath the farmers, an ordinary distant tree line and one oak at the far right. The farmers' complete silhouettes and grounded boots remain visible, neither in a step nor a walking pose. Eye-level full-frame DSLR, 50mm lens, f/8, 1/500 second, ISO 500, neutral daylight white balance, natural modest contrast, accurate dark skin and cloth, fine natural detail throughout. This is an incidental county newspaper farm photograph, not an advertising shoot. No walking, crossed legs, staged pose, hero posture, looking at camera, gestures, crossed or overlapping arms, hugs, extra limbs, malformed hands, merged cattle, extra legs, duplicated animals, warped fencing, pristine costume, mist, haze, golden hour, amber grade, sun rays, cinematic lighting, glamour, skin smoothing, HDR, artificial grain, oversharpening, text, logo or watermark.
```

#### P02

```text
Sharp candid documentary photograph of four members of a multigenerational Black family eating an ordinary meal together at a small worn rectangular table on a modest shaded farmhouse porch. A grandmother about seventy, her adult daughter about forty, an adult man in his forties and a thirteen-year-old boy. Exactly four people, three generations, distinct natural faces. Photograph across the long side of the table. The relatives occupy the far side and the two short ends, leaning comfortably toward their own plates so all four primary faces are close to the same focal plane, at nearly the same distance from the camera. All four faces, eyes, hairlines and visible hands are crisply resolved, none hidden behind another head. Each person is doing something small and different: the grandmother listens in three-quarter profile; her daughter glances toward her with a relaxed closed mouth; the man looks down at a bite on his plate; the boy looks at his own food. Nobody looks toward the camera and nobody performs laughter. They are already eating, not presenting plates or toasting. Ordinary unrelated clothes: the grandmother's faded mauve short-sleeve blouse, the daughter's olive everyday T-shirt, the man's pale gray cotton shirt and the boy's muted blue sports T-shirt without a logo. Natural age differences, believable Black skin texture, ordinary hairstyles, modest home, no coordinated styling. Mismatched everyday plates with partly eaten sliced steak, green beans and potatoes, forks resting naturally or held close to plates, water glasses at different levels, one chipped serving bowl, a pepper shaker, a crumpled napkin, a serving spoon and a folded dish towel. Normal table clutter with clear physical separation, not decorative styling. All hands have anatomically credible fingers, and utensils connect correctly to fingers and food. Four distinct chairs, worn painted porch boards, plain siding and a small window in the background. Bright neutral indirect daylight illuminates every face evenly. Full-frame DSLR, 50mm lens, f/11, 1/500 second, ISO 800, deep depth of field, accurate color and restrained contrast. Focus is on all four faces together; their edges, skin pores, hair and fabric must remain genuinely sharp at full resolution without sharpening halos. An unretouched family photograph caught quietly between bites. No motion blur anywhere, no soft primary face, no shallow-focus glamour, no dramatic bokeh, no fake laughter, perfect teeth display, coordinated outfits, fashionable styling, luxury furniture, banquet food, raised glasses, posing, camera eye contact, warped cutlery, duplicate faces, extra fingers, merged hands, disembodied limbs, waxy skin, cinematic haze, golden-hour warmth, beauty retouching, advertising polish, text, logo or watermark.
```

#### P03

```text
An ordinary documentary LANDSCAPE photograph, very wide 16:9, looking across a large uneven cattle pasture on a neutral overcast morning in the American South. The landscape is the subject. Camera on a fixed tripod at human eye level, 35mm lens, at least thirty meters away from the two tiny human figures. We see about sixty meters of pasture across the frame. Two Black family farmers stand still at a distant weathered wooden fence in the RIGHT THIRD, quietly checking cattle. Each complete person is only FIFTEEN PERCENT of the photograph height, from head at 43 percent down to boots at 58 percent of the frame. Neither person is in the foreground. They are separated by four feet of visible open space, a few feet apart, not close together or touching. Both have their backs to the camera, heads directed toward the cattle, both feet planted, arms resting naturally by their sides, no walking stance. An older Black woman wears a faded burgundy shirt, practical blue jeans and worn work boots; a middle-aged Black man wears a washed blue shirt, brown work trousers and muddy work boots. No hats or tools. The modest fence occupies only the middle-distance right half: gray weathered wooden posts with two continuous straight timber rails attached correctly, receding toward the right boundary. No oversized fence across the foreground. Five separate hornless Black Angus cattle graze farther away in the field, their bodies and legs distinct and not overlapping. The LEFT SIXTY PERCENT is open quiet meadow for headline copy. A low tree line, one ordinary oak at the far right, a modest band of pale cloudy sky. Enough plain grass below and to the left of the small figures. Grass is imperfect and varied with weeds, clover and dull earth patches, not a manicured lawn. Neutral daylight, no visible sun direction, no haze, accurate dark skin, ordinary textures, restrained greens and contrast. f/8, 1/500 second, ISO 500, natural depth of field, clean unretouched DSLR detail rather than artificial grain or extreme sharpening. Quiet regional newspaper farm coverage, not a posed farmer portrait or commercial. NO large people, foreground people, close or medium shot, walking, raised heel, step, crossed legs, dramatic stance, staged expressions, gestures, eye contact, hugging, extra limbs, malformed hands, warped wood, impossible joints, floating feet, duplicated cattle, merged animals, horns, theatrical clouds, fog, cinematic haze, golden light, orange color grade, glossy advertising, symmetry, text, logo or watermark.
```

#### P04

```text
One continuous eight-second observational farm recording from a completely LOCKED tripod, using the supplied photograph as the exact starting frame. Keep the exact same wide framing, two small Black family farmers, five separated cattle, pasture, oak tree, fence rails and fence posts, clothing, boots and neutral cloudy daylight. Both farmers remain standing in their original places with both boots planted for the entire shot. They do not walk, take a step, lift a foot, turn around, turn toward the camera, talk, wave, point, reach or pose. Their attention stays on the herd. Only one very slight natural settling of body weight is visible in a farmer's shoulders and torso; the head position and hands remain nearly unchanged. The cattle graze quietly with tiny chewing and muzzle movements close to the same patches of grass, one small ear flick and an occasional restrained tail movement. A light breeze produces gentle irregular movement in scattered blades of grass and the oak leaves. The movement is almost still and occurs at ordinary real-time speed. Keep the fence completely rigid and fixed, all straight rails joined correctly to their original posts, all cattle individually distinct with the same legs and bodies, and both farmers' anatomy, clothing and proportions unchanged from first to last frame. Absolutely no walking people, moving feet, sliding boots, bent or rubber limbs, extra hands or fingers, changing faces, body morphing, warped fencing, rail motion, multiplying or vanishing cattle, new animals, new objects, camera shake, pan, tilt, zoom, dolly, parallax, reframing, focus pull, cut, dissolve, speed ramp, slow motion, wind gust, staged gesture, sunlight change, cinematic haze, amber grade, golden hour, dramatic contrast, artificial polish, text, logo or watermark. Maintain the quiet plain unretouched documentary character of the photograph. No audio.
```

#### P05

```text
Six seconds of almost-still documentary farm footage, camera bolted to a fixed tripod. Preserve the starting photograph exactly as a real scene. The two small rear-view Black farmers stay standing in the same places, feet planted, hands down, looking at the herd. A barely perceptible shoulder settling is their only movement; no walking, foot movement, turning, gesture or pose. EXACTLY FIVE CATTLE remain in their original separate positions and preserve their original distinct bodies, legs, heads and tails. Each animal only makes tiny grazing muzzle and chewing movements, without changing its body silhouette. In particular the broad cow near the middle-right is ONE cow throughout, never two overlapping cows. No animal may appear, duplicate, split, merge, disappear or walk across another. A very light breeze barely stirs scattered grass blades and oak leaves. The wooden rails and every post remain perfectly rigid and fixed in place. No camera movement, lens movement, parallax, zoom, focus change, morphing, body distortion, fence warping, new details, new objects, weather change, sunlight, cinematic haze, golden-hour grade, dramatic lighting, beauty treatment, slow motion, cuts, text or sound. The final frame returns gently to the same resting positions as the starting frame, without a visible dissolve. Ordinary neutral overcast color, no advertising polish.
```

#### P06

```text
Edit the supplied farm photograph, preserving its exact composition and all unaffected details. Remove ONLY the malformed broad black animal near the horizontal center of the image, at approximately 43 percent of image width and 42 percent of image height. It currently has a grazing head at both its left and right ends. Remove that entire two-headed silhouette and fill its small former area with ordinary continuous pasture grass matching the surrounding ground. Do not replace it with any animal. The FOUR OTHER cattle must remain exactly where they are, with their original distinct bodies, one head per animal, four legs, one tail, no horns and no overlap. This is a localized removal, not a new composition. Preserve both Black farmers' exact small scale, positions, separation, naturally planted standing feet, rear-view heads, relaxed arms, hands and ordinary clothes. Preserve every wooden fence rail and post, oak tree, tree line, weeds, grass texture, ground contours, camera viewpoint and framing. Preserve the open left meadow for copy. Preserve the neutral cloudy daylight and original color and contrast. No other edits, no new animal or object, no subject movement, no crop, no zoom, no pose change, no walking, no smoothing, no cinematic haze, no golden light, no extra sharpening, no advertising polish, no text or watermark.
```

#### P07

```text
One continuous six-second documentary farm shot from a locked, bolted-down tripod. Preserve the supplied starting photograph exactly: two small Black family farmers standing naturally several feet apart, FOUR distinct grazing cattle, rigid weathered timber fence, uneven pasture and oak tree, all in the same original positions under neutral overcast light. The farmers remain focused on the herd, seen from behind. Their boots stay planted throughout; only a barely perceptible natural settling of weight in shoulders and torso is allowed. No footstep, walking, heel lifting, turning, posing, reaching or gesture. Exactly four individual cattle remain clearly separate. Each keeps one head, its original body and normal legs and tail, and only makes tiny grazing muzzle or chewing movements; an ear may flick once. Do not create or remove any animal, split an animal, merge bodies or add a head. A light breeze gently moves a few patches of grass and oak leaves without a gust. Every fence rail, post, joint and the distant tree line remains rigid and fixed. No camera motion, pan, tilt, zoom, dolly, shake, parallax, reframing, focus pull, cut or transition. Keep anatomy, clothing, faces, hands, boots, cattle and fence geometry consistent across the entire shot. No morphing, warping, duplication, floating feet, new objects, weather change, cinematic haze, golden-hour light, amber grade, dramatic action, advertising polish, text or watermark. Natural real-time motion, almost still but visibly alive, no audio.
```

### Final exports

| File | Dimensions | Bytes | Encoding |
| --- | --- | ---: | --- |
| `/Users/calebbolden/Projects/consulting/clients/travis-steaks/design-directions/soil-to-supper/assets/final-v3/hero-pasture-desktop.webp` | 1920 × 1080 | 387044 | webp |
| `/Users/calebbolden/Projects/consulting/clients/travis-steaks/design-directions/soil-to-supper/assets/final-v3/hero-pasture-mobile.webp` | 720 × 1280 | 92744 | webp |
| `/Users/calebbolden/Projects/consulting/clients/travis-steaks/design-directions/soil-to-supper/assets/final-v3/family-porch-supper.webp` | 1920 × 1080 | 246636 | webp |
| `/Users/calebbolden/Projects/consulting/clients/travis-steaks/design-directions/soil-to-supper/assets/final-v3/hero-pasture-motion.mp4` | 1920 × 1080 | 1919930 | h264, yuv420p, no audio, moov before mdat |

Desktop poster: WebP quality 84, crop 0, 3, 2720, 1530 from the hero-repair-seedream.png master, then resize to 1920 × 1080. Mobile: WebP quality 72, crop 1320, 0, 864, 1536 from the same master, then resize to 720 × 1280. The mobile crop retains the grazing cow and both farmers. Family: WebP quality 84, full frame downscaled from 3840 × 2160 to 1920 × 1080. No generative upscaling, added sharpening, color grade or motion interpolation was applied during export.

The selected Seedance 2.5 source is 1920 x 1080, 24 fps, 6.041667 seconds, HEVC 10-bit with BT.709 color. It was transcoded without resizing to H.264 High profile, level 4.0, yuv420p, using libx264 preset slow, CRF 22, maxrate 3500k, bufsize 7000k, square pixels, no audio and +faststart. No stabilization, optical-flow interpolation, artificial sharpening or color treatment was applied. The final MP4 has moov before mdat and is below 4,000,000 bytes.

### Verification

Ran `python3 design-directions/soil-to-supper/verify.py` from `/Users/calebbolden/Projects/consulting/clients/travis-steaks`. Desktop video playback, mobile menu and forms, reduced-motion behavior and console checks pass.

Export metadata and preservation assertions pass; details are in `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/export-validation.json`. The stylesheet, application script, verifier and four unrelated final photographs remain byte-identical to their pre-task snapshots.

Mobile Lighthouse 13.1.0, 2026-09-05T19:19:50.194Z: Performance 97; Accessibility 100; Best Practices 100; SEO 100.

Desktop Lighthouse 13.1.0, 2026-09-05T19:20:00.886Z: Performance 97; Accessibility 100; Best Practices 100; SEO 100.

The first mobile run scored 94 performance with the quality-80 mobile poster. Only that poster was recompressed to quality 72, visually checked and replaced; the verifier and both Lighthouse profiles were rerun afterward. The initial report remains archived as lighthouse-mobile-round1.report.json and lighthouse-mobile-round1.report.html in the audit directory. The local static server still produces cache and compression recommendations, and Lighthouse reports an unweighted accessible-name diagnostic on existing brand links. Those unrelated styles, labels and server settings were not changed to improve the scores.

Lighthouse JSON and HTML reports and browser screenshots are retained in `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05`.

The initial verifier invocation failed because the system Python did not have Playwright. The dependency was installed only in `/Users/calebbolden/Projects/consulting/clients/travis-steaks/work/soil-to-supper-visuals-2026-09-05/.venv`, then the same verifier was rerun with that environment active. No global Python package or project test code was changed. An optional OpenCV analysis check was also unavailable; native-frame visual inspection and FFmpeg metadata checks were used without installing OpenCV.

### Review gotcha

A broad, apparently grazing silhouette can conceal two heads when a whole pasture is viewed at once. The initial video revealed the problem. Review each distant animal separately before authorizing animation; a higher-resolution output or an endpoint anchor does not repair source anatomy.

## September 4 generation history

The notes below are preserved from the previous version. Their hero and family selections are historical and have been superseded by the September 5 records above. The herd, soil, pasture-check and fresh-cuts records remain applicable.


Generated for the Field Good Foods homepage mockup on September 4, 2026.

## Quality process

The replacement media was generated through Higgsfield CLI 1.1.23. Each scene was treated as a documentary photograph first. Prompts specify ordinary light, real camera behavior, visible wear, incidental composition, and simple physical actions. They also remove common synthetic tells such as coordinated clothing, direct eye contact, dramatic grading, crowded hand interactions, duplicated animals, and decorative food styling.

The hero still was compared across Seedream 5.0 Pro at 2K, Soul Cinematic at 2K, GPT Image 2 at 4K, and FLUX.2 Max at 2K. Seedream 5.0 Pro produced the most credible skin, clothing, pasture, cattle, and weathering. Soul Cinematic introduced a cowboy-style hat and unclear action. GPT Image 2 rendered a stiff fence-repair pose with weak wire geometry. FLUX.2 Max failed server-side.

The hero motion was compared across Kling 3.0 at 4K, Seedance 2.5 at high-bitrate 1080p, and Veo 3.1 Ultra. Kling won because the tripod framing, fence, people, and cattle stayed stable. Veo drifted the framing despite the locked-camera instruction. Seedance was stable, but it did not improve motion fidelity enough to justify choosing it over Kling's native detail.

## Hero still

Model: Seedream 5.0 Pro, 2K, 16:9.

Selected seed: 266924.

Prompt:

> Unposed documentary photograph from a real cattle farm in the rural American South at 8:20 on a cloudy morning. The camera is twenty yards away at waist height. Two Black family farmers walk away from the camera along a muddy tire track beside a plain four-strand wire fence: a Black woman in her late sixties in a washed charcoal T-shirt, worn jeans, and rubber work boots, and her son in his forties in a faded blue work shirt, work pants, and muddy boots. No hats of any kind. They carry nothing. Their arms hang naturally and their distant faces are only partly visible in three-quarter profile. They are not posing, touching, or looking at the camera. Six hornless Black Angus cattle graze at irregular distances across uneven pasture; one animal is partly hidden by an oak and another is naturally cropped by the far frame edge. The left sixty percent is quiet open meadow for website copy. Include hoof marks, broadleaf weeds, bent grass, a slightly leaning patched fence post, damp soil, and ordinary working-farm wear. Shot like a regional newspaper assignment on a full-frame DSLR with a 35mm lens, f/8, 1/500, ISO 500, neutral white balance, modest dynamic range, subtle sensor grain, and slight corner softness. Flat available light, muted greens, accurate Black skin, natural body proportions, ordinary clothing. The result must feel observed, incidental, and unretouched. Not a campaign photograph. No sunset, amber color grade, fog, cinematic haze, HDR, oversaturation, shallow-depth glamour, centered symmetry, arranged cattle, cowboy styling, pristine clothes, broad smiles, text, logo, watermark, malformed people, duplicate animals, horns, or impossible fencing.

Final files:

- assets/final-v3/hero-pasture-desktop.webp, 1920 × 1085
- assets/final-v3/hero-pasture-mobile.webp, 720 × 1280

The desktop poster uses WebP quality 88. The mobile crop uses WebP quality 72 and crop coordinates 1540, 0, 864, 1536 from the 2720 × 1536 master.

## Herd under oaks

Model: Seedream 5.0 Pro, 2K, 4:3.

Selected seed: 776895.

Prompt:

> A plain documentary photograph made from the edge of a working Black Angus pasture in the rural American South on a cloudy morning after rain. Exactly six hornless adult Black Angus cattle graze far apart beneath old oak trees. Every animal is fully distinct with clear space between its body and the others; no cattle overlap. Five are fully visible at different distances and one is partly hidden behind a broad oak trunk. Their heads, tails, legs, and body angles vary naturally. The field has close-grazed areas, taller wet grass, clover, broadleaf weeds, hoof divots, and a dull empty mineral tub near the distant fence. Trees are asymmetrical and the boundary fence is faint in the far background. Chest-height camera, 50mm lens, f/8, ISO 500, broad natural focus, slight sensor grain, restrained contrast, neutral white balance, muted greens, flat available light. Looks like an unretouched regional agriculture story, ordinary and specific. No people, barns, mountains, sun rays, mist, cinematic color, amber light, HDR, symmetry, pristine lawn, cloned cattle, merged animals, horns, impossible legs, text, logo, or watermark.

Final file: assets/final-v3/herd-under-oaks.webp, 1800 × 1347.

## Pasture soil cut

Model: Seedream 5.0 Pro, 2K, 3:4.

Selected seed: 821725.

Prompt:

> Vertical documentary close-up of a fresh cut through established cattle pasture after a farmer checked the ground. A small section of sod has been turned back beside a shallow spade cut, exposing dark brown topsoil, pale fibrous grass roots, tiny stones, a few earthworm channels, and clumps of damp clay. The dull edge of an old steel spade and the muddy toe of one plain black rubber work boot enter naturally from the lower edge; no person is otherwise visible. Clover and broadleaf weeds mix with imperfect grass at the surface. Soft gray overcast daylight, accurate soil color, no water spray, no dramatic sun. Shot from knee height with a 90mm macro lens at f/8, enough depth to see real root structure, neutral white balance, restrained contrast, fine grain. This is a practical soil-inspection record from a real workday, not a gardening advertisement. No hands, decorative plants, studio backdrop, perfect turf roll, hyper-detailed CGI texture, glossy mud, miniature fantasy landscape, text, logo, or watermark.

Final file: assets/final-v3/pasture-soil-cut.webp, 1200 × 1604.

## Pasture check

Model: Seedream 5.0 Pro, 2K, 4:3.

Selected seed: 357204.

Prompt:

> Unposed environmental photograph of a Black woman cattle farmer in her late fifties checking pasture health during morning chores. Seen from twelve feet away in side and rear three-quarter profile, she kneels on one knee near a weathered fence line and uses one bare right hand to part the grass at the roots; most of her fingers are naturally obscured by grass. Her left forearm rests across her raised thigh. She looks down at the ground, not toward the camera. She wears a faded olive work shirt, worn dark jeans, and mud-streaked rubber boots, with no hat and no jewelry. Three hornless Black Angus cattle graze loosely in the middle distance, not interacting with her. Include uneven weeds, a patched wood fence post, and damp soil. Plain overcast morning light, muted color, realistic Black skin texture and body proportions. Shot like a county newspaper feature on a 50mm lens at f/5.6, ISO 640, modest depth of field, slight grain, restrained dynamic range, no retouching. The moment should feel quiet, incidental, and work-focused. No smile at camera, heroic pose, fashion styling, cowboy costume, golden hour, cinematic haze, HDR, glossy skin, manicure, extra fingers, malformed hand, cloned cattle, text, logo, or watermark.

Final file: assets/final-v3/pasture-check.webp, 1920 × 1437.

## Fresh cuts

Model: Seedream 5.0 Pro, 2K, 3:2.

Selected seed: 583538.

Prompt:

> Documentary food photograph made during a real order at a small neighborhood butcher shop. On a large sheet of wrinkled peach butcher paper over a scarred maple cutting block are three fresh grass-fed beef cuts, placed casually with wide uneven gaps: a porterhouse nearest the camera with a believable T-shaped bone and larger tenderloin section, a smaller T-bone turned sideways near the back, and a boneless top sirloin at the far right. The cuts are not identical in shape or thickness. Meat is naturally dark cherry red and only faintly moist, with restrained cream fat, realistic lean marbling, visible muscle fibers, slightly ragged hand-cut edges, and one faint smear where a cut was moved. Leave much of the paper empty. An ordinary white tile wall and folded butcher paper are softly visible at the top edge. Mixed cool window light and flat overhead shop light, neutral color, soft honest shadows. Camera at counter height, three-quarter view, 55mm lens, f/8, ISO 640, modest contrast, fine sensor grain, no retouching. It should look photographed quickly before wrapping, not styled for an advertisement. No garnish, herbs, salt, fire, grill marks, knives, hands, twine, labels, slate, dramatic darkness, symmetry, identical cuts, excessive marbling, wet plastic shine, CGI smoothness, text, logo, or watermark.

Final file: assets/final-v3/fresh-cuts-counter.webp, 1920 × 1280.

## Family supper

Model: Seedream 5.0 Pro, 2K, 16:9.

Selected seed: 339098.

Prompt:

> Unposed documentary photograph of a multigenerational Black family eating an ordinary early supper on a shaded farmhouse porch in late summer. Five relatives are spread naturally around a worn rectangular wood table: a grandmother in side profile listening, an adult man with his back partly toward the camera, two adult women mid-conversation, and a ten-year-old boy moving behind one chair with a trace of natural motion blur. No one looks at the camera and no one is arranged in a row. Expressions are varied and small: one quiet laugh, one person chewing, one listening. Mismatched plates hold sliced steak, green beans, and corn; there are everyday drinking glasses, a serving bowl, napkins, and normal table clutter, with some objects partly occluded. Photograph from fifteen feet away just inside an open screen door, with a sliver of dark doorframe along one edge, 35mm lens at f/5.6, ISO 800. Soft porch shade mixed with neutral outdoor daylight, accurate Black skin tones, ordinary casual clothes in unrelated colors, modest contrast, fine sensor grain, one slightly soft moving figure. It must feel like a family photograph caught between moments, not a cast in an advertisement. No coordinated wardrobe, everyone smiling, perfect teeth, toast, raised glasses, posed eye contact, golden-hour glow, cinematic haze, shallow-focus glamour, luxury table styling, excessive food, distorted hands, duplicate faces, text, logo, or watermark.

Final file: assets/final-v3/family-porch-supper.webp, 1920 × 1085.

## Hero motion

Model: Kling 3.0, 4K mode, 8 seconds, audio off.

Prompt:

> One continuous locked-tripod documentary shot that preserves the exact people, herd, fence, pasture, framing, and flat overcast light in the starting photograph. The two farmers continue walking away at an unhurried working pace along the muddy track, taking small natural steps with slight arm swing; they never turn or look toward camera. The cattle remain where they are and only make quiet grazing movements: two heads lower, one animal shifts weight, and one tail swishes once. A light breeze moves patches of grass and a few oak leaves. The camera stays completely fixed with no pan, tilt, zoom, dolly, handheld shake, reframing, focus pull, or cut. Movement is subtle, real-time, physically coherent, and observational. Preserve face shape, body proportions, clothing, boots, fence wires, tree structure, and cattle anatomy from first frame to last. No morphing, duplication, disappearing subjects, sliding feet, rubber limbs, warped fence, new animals, new objects, changing weather, sunlight burst, haze, dust effect, slow motion, dramatic action, text, logo, or transition.

Generation command:

~~~bash
higgsfield generate create kling3_0 \
  --prompt "<hero motion prompt above>" \
  --start-image assets/final-v3/hero-pasture-desktop.webp \
  --aspect_ratio 16:9 \
  --duration 8 \
  --mode 4k \
  --sound off \
  --wait
~~~

The original generation used the full 2720 × 1536 Seedream master as its start image. The retained desktop WebP above is the closest reproducible input. The 3832 × 2164 Higgsfield result was stripped of audio, scaled and center-cropped to 1920 × 1080, encoded as H.264 at CRF 22 with 4:2:0 pixel format, and written with fast-start metadata.

Final file: assets/final-v3/hero-pasture-motion.mp4, 8.04 seconds, 3.7 MB.
