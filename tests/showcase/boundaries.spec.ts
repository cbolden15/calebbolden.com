import { test, expect } from './helpers';

test('unpublished flagship paths and absent showcase downloads are not public', async ({ page }) => {
  for (const path of ['/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center', '/work/test-only/poster.png', '/work/prism/fixture.json']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    expect(await response!.text()).not.toContain('SYNTHETIC_PRIVATE_SENTINEL');
  }
});

test('production Vora response keeps the legacy fallback', async ({ page }) => {
  await page.goto('/work/vora');
  await expect(page.locator('main h1')).toHaveText('Vora');
  await expect(page.getByText('what it is', { exact: true })).toBeVisible();
  await expect(page.locator('[data-case-study-section]')).toHaveCount(0);
});

test.skip('approved direct media MIME, selected fixture payload and draft sentinel boundaries @release', () => {
  // T11/T12 need real approved media and rich production routes to execute this criterion.
});
