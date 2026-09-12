# Gotchas

## Older preview branches can restore retired access rules

During the September 11, 2026 branch consolidation, older branches carried Basic Auth handlers and tests that had already been replaced. Brittany uses a private-link token, OJÄ uses an unlisted path, and Field Good Foods is passwordless. Resolve preview merges against those current behaviors, including the tests, environment examples, and Compose variables. Keep newer Brittany font-preview markup when merging saved content worktrees whose edits are already in main.

## Use a consistent hostname for local preview smoke tests

Run the standalone server with `HOSTNAME=localhost` and request `http://localhost:<port>`. Next.js normalizes loopback addresses to `localhost` in `NextRequest`, while its routing layer can retain `127.0.0.1` as the original host. Mixing them makes an internal OJÄ rewrite look external, which sends another request through the proxy and returns the intended 404 for direct internal-path access. Include `public` and `.next/static` alongside the standalone server, as the Docker image does.

## A draft route does not protect its public assets

The September 11 showcase review found that a production 404 for a draft case study does not block files copied into `public/work/<slug>/`. The corrected showcase plan requires a reviewed manifest of exact paths, digests, and inert media formats before production builds, plus direct-URL and client-payload checks. Unreviewed captures stay outside website build inputs. The immutable asset gate is implemented as `npm run verify:showcase-assets` and runs during prebuild; existing preview access rules are separate. See `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-verification.md` for the finding and correction record.

## Showcase runtime and exact evidence

Use Node 22.21.0 with zlib 1.3.1-470d3a2 for both sides of a gzip comparison. Node 26 compressed identical hashed JavaScript to different byte counts. Compare each rich route with a matched same-source shell that removes its complete client demo entry and enhancement host; the historical 277,999-byte legacy shell is not a like-for-like baseline. Count each unique eager and lazy response body once. Raw fixture JSON remains server-only.

Synthetic test records must explicitly bind synthetic snapshot relationships. Spreading a published record can inherit real method-responsibility IDs and break a valid synthetic manifest. Keep strict shape validation and semantic checks: Prism needs its pinned event/receipt contract, and Control Center needs relational identity/count checks. A matching digest alone does not establish either contract.

## Required content must survive animation and enhancement failure

Opacity-based visibility checks do not establish readability. Required Proof and method text must stay outside Reveal. Reduced-motion HeroInstrument removes its scroll track, so its static child must be positioned relative; an unwrapped sticky child can intercept later Proof content. Test actual viewport hit targets as well as opacity. Preserve normal-motion sticky containment.

Playwright's `toBeVisible()` can pass for content inside an ancestor with `opacity: 0`. For required server-visible content, walk the ancestor chain and assert effective opacity; keep the content outside `Reveal` when it must survive JavaScript failure.

A native video with preload=none can still load its poster eagerly. Keep later posters lazy and decode all frames during the media gate. A graph-fade mask can fade foreground text along with the background; required rich introductions retain graph-field without that mask.

Block the actual interactive implementation chunk, not an earlier asynchronous loader stub. Keep first frame, complete walkthrough and native reload outside the enhancement boundary. Live regions need event-specific detail announcements, not only unchanged scenario/count summaries. Config text may contain the highlighted phrase more than once; slice around the first match so later text survives.

## Browser evidence needs actual DOM and command envelopes

CSS uppercase changes rendered labels; compare authored text through textContent when exact capitalization matters. A restored collapsed chat can leave an offscreen Hide assistant button that isVisible considers visible. Use the actual chat state and reachable Show assistant control. Chromium may tab a native scroll container between explicit buttons; include those native stops without losing the required control order.

Development responses include Next debug filesystem paths. Run serialized-public-data checks against a fresh production build and use distinctive authored sentinels; schema validation vocabulary is not authored fixture content. Record command, output and exit status, including silent lint/type checks. Keep expected subscription-test diagnostics visible as existing baseline output.

Native Chromium per-tab zoom resets on full navigation. Set and verify tabs.getZoom()==2 on each route. In Chromium 153 headless, Playwright's default CSS-sized screenshot clip produced white or cropped native-zoom captures. Capture with `Page.getLayoutMetrics().layoutViewport` coordinates and dimensions, then inspect the resulting image; numeric zoom alone is insufficient. The fixture uses a disposable extension/profile only.

Turbopack rejects a node_modules symlink that points outside an isolated source root. Reuse existing installed bytes with hardlinks inside the disposable root, wait for staging to finish, and only then build. A single recorded dependency directory can move between sequential owned source candidates after their runtimes stop. Keep failed build logs and exact source transformations before disposal.

A viewport breakpoint does not guarantee room inside a demo. Agent Team’s five-column stage list split two-digit numbers and single-word labels at native 200% zoom. Use an intrinsic minimum track width and stacked button contents, then test individual text Range line boxes at fractional available widths as well as inspecting the native screenshot. Overflow checks alone miss this legibility defect.

Playwright webServer defaults to SIGKILL for its process group. Signal-based cleanup in a standalone runner cannot run under SIGKILL, leaving full runtime copies behind. Set gracefulShutdown to SIGTERM with a bounded timeout and verify the actual child exits, the exact runtime directory disappears, and the local port closes.

An isolated new-project draft must change both the record publication flag and its case-study body flag. Leaving a published record with a draft body and no legacy route correctly fails graph validation before build. Preserve placements and let the production selectors exclude the explicit draft record.

## Retain actual verification evidence before disposable cleanup

Playwright body-only attachments are not durable files with the list reporter. Explicitly write bounded JSON and compressed response bodies, attach their paths, and verify the files by parsing/decompressing and matching response/source/build identities before removing a source runtime. A passing list log is not a retained response body.

Build RSC URLs with URL.searchParams so existing category queries survive. Assert status and text/x-component. WorkFilters intentionally receives all public cards in Flight and filters by the URL on the client; validate the real Flight DTO and independently compare category slug orders/counts with the rendered view. Do not require a server-filtered DTO that the producer does not emit.

Same-origin GET is not synonymous with static traffic. A browser guard must distinguish fixed document/framework/static requests from ordinary fetch/XHR/EventSource and mutations, record rejected attempts, and prove rejection with actual browser requests. Use the same test-side policy for shared and native runs.

A physical double-click can target two different elements when click one removes or reflows a control. Capture both pointer targets and the final activeElement. Preserve native pointer behavior, assert state boundaries and reachable keyboard continuation, and check stable repeated controls separately instead of inventing a heading-focus requirement for a second click on nonfocusable content.
