import { test, expect } from './helpers';

for (const path of ['/', '/work', '/work/vora', '/work/chapterhq', '/work/site-assistant', '/work/open-source', '/how-i-build', '/contact']) {
  test(`retained route ${path} responds with its page content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    // The unchanged homepage hero has both static and animated H1 variants.
    // The single-H1 case-study rule applies to detail pages, not that legacy DOM.
    if (path !== '/') await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1').first()).not.toHaveText('');
  });
}

test.skip('complete catalog filters and five public flagship destinations @release', () => {
  // T09/T12 replace this pending release criterion with actual catalog navigation.
});
