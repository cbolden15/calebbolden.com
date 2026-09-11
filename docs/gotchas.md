# Gotchas

## Older preview branches can restore retired access rules

During the September 11, 2026 branch consolidation, older branches carried Basic Auth handlers and tests that had already been replaced. Brittany uses a private-link token, OJÄ uses an unlisted path, and Field Good Foods is passwordless. Resolve preview merges against those current behaviors, including the tests, environment examples, and Compose variables. Keep newer Brittany font-preview markup when merging saved content worktrees whose edits are already in main.

## Use a consistent hostname for local preview smoke tests

Run the standalone server with `HOSTNAME=localhost` and request `http://localhost:<port>`. Next.js normalizes loopback addresses to `localhost` in `NextRequest`, while its routing layer can retain `127.0.0.1` as the original host. Mixing them makes an internal OJÄ rewrite look external, which sends another request through the proxy and returns the intended 404 for direct internal-path access. Include `public` and `.next/static` alongside the standalone server, as the Docker image does.

## A draft route does not protect its public assets

The September 11 showcase review found that a production 404 for a draft case study does not block files copied into `public/work/<slug>/`. The corrected showcase plan requires a reviewed manifest of exact paths, digests, and inert media formats before production builds, plus direct-URL and client-payload checks. Unreviewed captures stay outside website build inputs. This gate is planned, not implemented; existing preview access rules are separate. See `/Users/calebbolden/Projects/consulting/calebbolden.com/docs/plans/2026-09-11-project-showcase-verification.md` for the finding and correction record.
