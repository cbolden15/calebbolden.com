import { installLocalGuard } from './network-policy.mjs';
import { artifact } from './artifacts';
import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export { expect };
export async function localOnly(context: BrowserContext) {
  return (await installLocalGuard(context, process.env.SHOWCASE_SERVER !== 'production')).unexpected;
}
export const test = base.extend<{ networkIsolation: void }>({
  networkIsolation: [async ({ context }, use, info) => {
    const guard = await installLocalGuard(context, process.env.SHOWCASE_SERVER !== 'production');
    await use();
    await artifact(info, 'network-isolation', guard);
    expect(guard.unexpected, 'Only fixed local navigation/framework/static requests are allowed').toEqual([]);
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
