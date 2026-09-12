import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export { expect };
export async function localOnly(context: BrowserContext) {
  const unexpected: string[] = [];
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (['http:', 'https:'].includes(url.protocol) && (url.origin !== 'http://localhost:3100' || url.pathname.startsWith('/api/'))) {
      unexpected.push(`${route.request().method()} ${url.origin}${url.pathname}`);
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  await context.routeWebSocket(/.*/, socket => {
    const url = new URL(socket.url());
    if (url.hostname === 'localhost' && url.port === '3100') socket.connectToServer();
    else { unexpected.push(`WebSocket ${url.origin}`); socket.close(); }
  });
  return unexpected;
}
export const test = base.extend<{ networkIsolation: void }>({
  networkIsolation: [async ({ context }, use) => {
    const unexpected = await localOnly(context);
    await use();
    expect(unexpected, 'No external or API request may leave the browser').toEqual([]);
  }, { auto: true }],
});

/** Real shared source compiled only into disposable scratch, with its actual CSS module. */
export async function mountComponentFixture(page: Page, options: { secondaryFarBelow?: boolean } = {}) {
  const root = resolve(__dirname, '../..');
  const scratch = mkdtempSync(join(tmpdir(), 'showcase-browser-'));
  const require = createRequire(join(root, 'package.json'));
  try {
    const outfile = join(scratch, 'fixture.cjs');
    await build({
      entryPoints: [join(root, 'tests/showcase/fixture.tsx')], outfile, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
      tsconfig: join(root, 'tsconfig.json'),
      plugins: [{ name: 'installed-packages', setup(builder) {
        builder.onResolve({ filter: /^[^./]/ }, args => args.path.startsWith('@/') ? undefined : { path: require.resolve(args.path), external: true });
      } }],
    });
    const { renderFixture } = require(outfile) as { renderFixture: (options: { secondaryFarBelow?: boolean }) => string };
    await page.goto('/work/vora');
    await page.locator('main').evaluate((main, fixture) => {
      main.innerHTML = fixture.markup;
      const style = document.createElement('style'); style.textContent = fixture.css; document.head.append(style);
    }, { markup: renderFixture(options), css: readFileSync(join(scratch, 'fixture.css'), 'utf8') });
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}
