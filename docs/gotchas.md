# Gotchas

## Older preview branches can restore retired access rules

During the September 11, 2026 branch consolidation, older branches carried Basic Auth handlers and tests that had already been replaced. Brittany uses a private-link token, OJÄ uses an unlisted path, and Field Good Foods is passwordless. Resolve preview merges against those current behaviors, including the tests, environment examples, and Compose variables. Keep newer Brittany font-preview markup when merging saved content worktrees whose edits are already in main.

## Use a consistent hostname for local preview smoke tests

Run the standalone server with `HOSTNAME=localhost` and request `http://localhost:<port>`. Next.js normalizes loopback addresses to `localhost` in `NextRequest`, while its routing layer can retain `127.0.0.1` as the original host. Mixing them makes an internal OJÄ rewrite look external, which sends another request through the proxy and returns the intended 404 for direct internal-path access. Include `public` and `.next/static` alongside the standalone server, as the Docker image does.
