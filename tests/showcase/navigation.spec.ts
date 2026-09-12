import type { Page } from '@playwright/test';
import { test, expect, localOnly } from './helpers';

const retainedRoutes = [
  '/',
  '/work',
  '/work/vora',
  '/work/chapterhq',
  '/work/site-assistant',
  '/work/open-source',
  '/how-i-build',
  '/contact',
];

const currentPublishedSlugs = ['vora', 'chapterhq', 'site-assistant'];

async function expectCatalog(page: Page, slugs: string[], count: number) {
  await expect(page.locator('[data-work-count]')).toHaveText(`${count} ${count === 1 ? 'project' : 'projects'}`);
  await expect(page.locator('[data-work-card]').evaluateAll(cards => cards.map(card => card.getAttribute('data-work-card')))).resolves.toEqual(slugs);
}

async function expectFixedSections(page: Page) {
  await expect(page.getByRole('link', { name: 'How my own operation runs on AI' })).toHaveAttribute('href', '/how-i-build');
  await expect(page.getByRole('link', { name: 'Explore open source' })).toHaveAttribute('href', '/work/open-source');
  await expect(page.getByRole('link', { name: 'See how engagements are structured and what the founding-client offer includes' })).toHaveAttribute('href', '/results');
  await expect(page.getByRole('link', { name: "Let's talk" }).first()).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Take the free AI readiness assessment' })).toHaveAttribute('href', '/tools/ai-readiness');
}

for (const path of retainedRoutes) {
  test(`retained route ${path} responds with its page content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    // The unchanged homepage hero has both static and animated H1 variants.
    // The single-H1 case-study rule applies to detail pages, not that legacy DOM.
    if (path !== '/') await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1').first()).not.toHaveText('');
  });
}

test('current published catalog has exact ordered cards and no featured duplicate', async ({ page }) => {
  await page.goto('/work');
  await expectCatalog(page, currentPublishedSlugs, 3);
  await expect(page.locator('[data-work-card][data-featured="true"]')).toHaveAttribute('data-work-card', 'vora');
  await expect(page.locator('[data-work-card="vora"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'All', exact: true })).toHaveAttribute('aria-current', 'page');
  await expectFixedSections(page);
});

test('first published feature begins within the 1440 by 900 viewport when chat is collapsed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work');
  await page.evaluate(() => document.documentElement.setAttribute('data-chat', 'collapsed'));

  const feature = page.locator('[data-work-card][data-featured="true"]');
  await expect(feature).toBeVisible();
  const bounds = await feature.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y).toBeLessThan(900);
});

test('direct category URLs normalize unknown and repeated category values', async ({ page }) => {
  await page.goto('/work?category=products');
  await expectCatalog(page, currentPublishedSlugs, 3);
  await expect(page.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
  await expectFixedSections(page);

  await page.goto('/work?category=developer-tools');
  await expectCatalog(page, [], 0);
  await expect(page.getByRole('link', { name: 'Developer tools' })).toHaveAttribute('aria-current', 'page');
  await expectFixedSections(page);

  for (const path of ['/work?category=unknown', '/work?category=products&category=developer-tools']) {
    await page.goto(path);
    await expectCatalog(page, currentPublishedSlugs, 3);
    await expect(page.getByRole('link', { name: 'All', exact: true })).toHaveAttribute('aria-current', 'page');
    await expectFixedSections(page);
  }
});

test('filter history, focus, reload, and list stay in URL parity', async ({ page }) => {
  await page.goto('/work');

  const developerTools = page.getByRole('link', { name: 'Developer tools' });
  await developerTools.click();
  await expect(page).toHaveURL('/work?category=developer-tools');
  await expect(developerTools).toBeFocused();
  await expectCatalog(page, [], 0);
  await expectFixedSections(page);

  const products = page.getByRole('link', { name: 'Products' });
  await products.click();
  await expect(page).toHaveURL('/work?category=products');
  await expect(products).toBeFocused();
  await expectCatalog(page, currentPublishedSlugs, 3);

  await page.goBack();
  await expect(page).toHaveURL('/work?category=developer-tools');
  await expect(developerTools).toBeFocused();
  await expectCatalog(page, [], 0);

  await page.goForward();
  await expect(page).toHaveURL('/work?category=products');
  await expect(products).toBeFocused();
  await expectCatalog(page, currentPublishedSlugs, 3);

  await page.reload();
  await expect(page.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
  await expectCatalog(page, currentPublishedSlugs, 3);
  await expectFixedSections(page);
});

test('native direct GET honors the selected filter without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://localhost:3100' });
  const unexpected = await localOnly(context);
  const page = await context.newPage();
  const response = await page.goto('/work?category=developer-tools');

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('link', { name: 'Developer tools' })).toHaveAttribute('aria-current', 'page');
  await expectCatalog(page, [], 0);
  await expectFixedSections(page);
  expect(unexpected).toEqual([]);
  await context.close();
});

test.skip('complete catalog filters and five public flagship destinations @release', async ({ page }) => {
  await page.goto('/work');
  await expectCatalog(page, ['vora', 'prism', 'agent-team', 'agent-config', 'control-center', 'chapterhq', 'site-assistant'], 7);
  await page.getByRole('link', { name: 'Products' }).click();
  await expectCatalog(page, ['vora', 'chapterhq', 'site-assistant'], 3);
  await page.getByRole('link', { name: 'Developer tools' }).click();
  await expectCatalog(page, ['prism', 'agent-team', 'agent-config', 'control-center'], 4);
});
