import type { Locator, Page } from '@playwright/test';
import { test, expect, localOnly } from './helpers';
import { artifact } from './artifacts';

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

const productSlugs = ['vora', 'chapterhq', 'site-assistant'];
const developerSlugs = ['prism', 'agent-team', 'agent-config', 'control-center'];
const currentPublishedSlugs = ['vora', ...developerSlugs, 'chapterhq', 'site-assistant'];

async function expectCatalog(page: Page, slugs: string[], count: number) {
  await expect(page.locator('[data-work-count]')).toHaveText(`${count} ${count === 1 ? 'project' : 'projects'}`);
  await expect(page.locator('[data-work-card]').evaluateAll(cards => cards.map(card => card.getAttribute('data-work-card')))).resolves.toEqual(slugs);
}

async function expectFixedSections(page: Page) {
  const intro = page.getByText('I build AI products for real operational work, along with tools for developing and running them. Explore a workflow, see the decisions behind it, and find out what each project does today.', { exact: true });
  const method = page.locator('[data-work-section="how-i-build"]');
  const openSource = page.locator('[data-work-section="open-source"]');
  const notes = page.locator('[data-work-section="notes"]');
  const clientWork = page.locator('[data-work-section="client-work"]');
  const audit = page.locator('[data-work-section="audit"]');

  await expect(method).toContainText('How my own operation runs on AI, the tools I actually use, and where I still draw the line at a human.');
  await expect(method.getByRole('link', { name: 'How my own operation runs on AI' })).toHaveAttribute('href', '/how-i-build');
  await expect(openSource.getByRole('heading', { name: 'Open source' })).toBeAttached();
  await expect(openSource).toContainText('Tooling I publish on GitHub.');
  await expect(openSource.getByRole('link', { name: 'Explore open source' })).toHaveAttribute('href', '/work/open-source');
  await expect(notes).toContainText('recent notes');
  await expect(notes.getByRole('link', { name: 'All notes' })).toHaveAttribute('href', '/blog');
  await expect(notes.locator('article')).toHaveCount(3);
  for (const link of await notes.locator('article h2 a').all()) {
    await expect(link).not.toHaveText('');
    await expect(link).toHaveAttribute('href', /^\/blog\/[a-z0-9-]+$/);
  }
  await expect(clientWork).toContainText('I publish a named client case study only after the engagement is complete and the client has approved what the page says.');
  await expect(clientWork.getByRole('link', { name: 'See how engagements are structured and what the founding-client offer includes' })).toHaveAttribute('href', '/results');
  await expect(audit.getByRole('heading', { name: 'Start with the audit' })).toBeAttached();
  await expect(audit).toContainText('Audits start at $750, fixed scope. Every engagement begins here.');
  await expect(audit.getByRole('link', { name: 'Discuss a project' })).toHaveAttribute('href', '/contact');
  await expect(audit.getByRole('link', { name: 'Take the free AI readiness assessment' })).toHaveAttribute('href', '/tools/ai-readiness');
  await expect(page.locator('[data-work-section="client-work"]')).not.toContainText('in progress right now');

  for (const target of [
    page.getByRole('heading', { name: 'Work', exact: true }),
    intro,
    page.getByRole('heading', { name: 'Built for real operations' }),
    page.locator('[data-work-count]'),
    page.getByRole('link', { name: 'All', exact: true }),
    page.getByRole('link', { name: 'Products', exact: true }),
    page.getByRole('link', { name: 'Developer tools', exact: true }),
    method,
    openSource,
    notes,
    clientWork,
    audit,
  ]) await expectNoTransparentAncestor(target);
}

async function expectNoTransparentAncestor(locator: Locator) {
  await expect(locator).toBeAttached();
  const effectiveOpacity = await locator.evaluate(element => {
    let current: Element | null = element;
    let opacity = 1;

    while (current) {
      opacity *= Number.parseFloat(getComputedStyle(current).opacity);
      current = current.parentElement;
    }

    return opacity;
  });

  expect(effectiveOpacity).toBeCloseTo(1, 5);
}

async function workIntroEvidence(page: Page) {
  const paragraph = page.locator('[data-work-intro] > div > p').last();
  await expect(paragraph).toBeAttached();
  return paragraph.evaluate(element => {
    const ancestors = [];
    let current: Element | null = element;
    let effectiveOpacity = 1;
    while (current) {
      const style = getComputedStyle(current);
      const opacity = Number.parseFloat(style.opacity);
      const maskImage = style.maskImage;
      const webkitMaskImage = style.getPropertyValue('-webkit-mask-image');
      effectiveOpacity *= opacity;
      ancestors.push({ tag: current.tagName.toLowerCase(), opacity, maskImage, webkitMaskImage });
      current = current.parentElement;
    }
    const style = getComputedStyle(element);
    const toLinear = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    const readColor = (value: string) => {
      const canvas = new OffscreenCanvas(1, 1);
      const context = canvas.getContext('2d', { willReadFrequently: true })!;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    };
    const foregroundRgba = readColor(style.color);
    let backgroundColor = 'rgb(255, 255, 255)';
    current = element;
    while (current) {
      const candidate = getComputedStyle(current).backgroundColor;
      const channels = candidate.match(/[\d.]+/g)?.map(Number) ?? [];
      if (!candidate.startsWith('rgba(') || (channels[3] ?? 1) > 0) {
        backgroundColor = candidate;
        break;
      }
      current = current.parentElement;
    }
    const backgroundRgba = readColor(backgroundColor);
    const foreground = foregroundRgba.slice(0, 3).map(channel => toLinear(channel / 255));
    const background = backgroundRgba.slice(0, 3).map(channel => toLinear(channel / 255));
    const luminance = (channels: number[]) => channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const foregroundLuminance = luminance(foreground);
    const backgroundLuminance = luminance(background);
    const contrast = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
      / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    return { ancestors, effectiveOpacity, foreground: style.color, foregroundRgba, background: backgroundColor, backgroundRgba, contrast, fontSize: style.fontSize };
  });
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
  await expectCatalog(page, currentPublishedSlugs, 7);
  await expect(page.locator('[data-work-card][data-featured="true"]')).toHaveAttribute('data-work-card', 'vora');
  await expect(page.locator('[data-work-card="vora"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'All', exact: true })).toHaveAttribute('aria-current', 'page');
  await expectFixedSections(page);
});

test('feature layout begins within the 1440 by 900 viewport as the poster-position precondition', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work');
  await page.evaluate(() => document.documentElement.setAttribute('data-chat', 'collapsed'));

  const featureLayout = page.locator('[data-work-card][data-featured="true"]');
  await expect(featureLayout).toBeVisible();
  const bounds = await featureLayout.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y).toBeLessThan(900);
});

test('catalog responds to its actual post-chat available width', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto('/work');
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.chat)).toBe('open');

  await expect.poll(async () => page.locator('[data-work-surface]').evaluate(surface => {
    const content = surface.querySelector<HTMLElement>('[data-work-content]')!;
    const featureGrid = surface.querySelector<HTMLElement>('[data-work-card][data-featured="true"] article > div')!;
    return {
      surfaceWidth: surface.getBoundingClientRect().width,
      contentPaddingLeft: getComputedStyle(content).paddingLeft,
      featureColumns: getComputedStyle(featureGrid).gridTemplateColumns.split(' ').length,
    };
  }), { timeout: 5_000 }).toMatchObject({ surfaceWidth: 640, contentPaddingLeft: '32px', featureColumns: 1 });

  await page.setViewportSize({ width: 590, height: 900 });
  await expect.poll(() => page.locator('[data-work-surface]').evaluate(surface => {
    const content = surface.querySelector<HTMLElement>('[data-work-content]')!;
    const rowGrid = surface.querySelector<HTMLElement>('[data-work-card][data-featured="false"] article > div')!;
    return {
      surfaceWidth: surface.getBoundingClientRect().width,
      contentPaddingLeft: getComputedStyle(content).paddingLeft,
      rowColumns: getComputedStyle(rowGrid).gridTemplateColumns.split(' ').length,
    };
  }), { timeout: 5_000 }).toEqual({ surfaceWidth: 590, contentPaddingLeft: '20px', rowColumns: 1 });
});

test('direct category URLs normalize unknown and repeated category values', async ({ page }) => {
  await page.goto('/work?category=products');
  await expectCatalog(page, productSlugs, 3);
  await expect(page.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
  await expectFixedSections(page);

  await page.goto('/work?category=developer-tools');
  await expectCatalog(page, developerSlugs, 4);
  await expect(page.getByRole('link', { name: 'Developer tools' })).toHaveAttribute('aria-current', 'page');
  await expectFixedSections(page);

  for (const path of ['/work?category=unknown', '/work?category=products&category=developer-tools']) {
    await page.goto(path);
    await expectCatalog(page, currentPublishedSlugs, 7);
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
  await expectCatalog(page, developerSlugs, 4);
  await expectFixedSections(page);

  const products = page.getByRole('link', { name: 'Products' });
  await products.click();
  await expect(page).toHaveURL('/work?category=products');
  await expect(products).toBeFocused();
  await expectCatalog(page, productSlugs, 3);

  await page.goBack();
  await expect(page).toHaveURL('/work?category=developer-tools');
  await expect(developerTools).toBeFocused();
  await expectCatalog(page, developerSlugs, 4);

  await page.goForward();
  await expect(page).toHaveURL('/work?category=products');
  await expect(products).toBeFocused();
  await expectCatalog(page, productSlugs, 3);

  await page.reload();
  await expect(page.getByRole('link', { name: 'Products' })).toHaveAttribute('aria-current', 'page');
  await expectCatalog(page, productSlugs, 3);
  await expectFixedSections(page);
});

test('direct filtered pages can select All and preserve URL parity through Back and Forward', async ({ page }) => {
  for (const start of [
    { path: '/work?category=products', label: 'Products', slugs: productSlugs, count: 3 },
    { path: '/work?category=developer-tools', label: 'Developer tools', slugs: developerSlugs, count: 4 },
  ]) {
    await page.goto(start.path);
    await expect(page.getByRole('link', { name: start.label })).toHaveAttribute('aria-current', 'page');

    const all = page.getByRole('link', { name: 'All', exact: true });
    await all.click();
    await expect(page).toHaveURL('/work');
    await expect(all).toHaveAttribute('aria-current', 'page');
    await expect(all).toBeFocused();
    await expectCatalog(page, currentPublishedSlugs, 7);

    await page.goBack();
    await expect(page).toHaveURL(start.path);
    await expect(page.getByRole('link', { name: start.label })).toHaveAttribute('aria-current', 'page');
    await expectCatalog(page, start.slugs, start.count);

    await page.goForward();
    await expect(page).toHaveURL('/work');
    await expect(all).toHaveAttribute('aria-current', 'page');
    await expect(all).toBeFocused();
    await expectCatalog(page, currentPublishedSlugs, 7);
  }
});

test('native no-JavaScript filters retain exact catalogs and required Work content', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference', baseURL: 'http://localhost:3100' });
  const unexpected = await localOnly(context);
  const page = await context.newPage();
  try {
    const response = await page.goto('/work');
    expect(response?.status()).toBe(200);
    await expect(page.locator('main .reveal')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'All', exact: true })).toHaveAttribute('aria-current', 'page');
    await expectCatalog(page, currentPublishedSlugs, 7);
    await expectFixedSections(page);

    await page.getByRole('link', { name: 'Products', exact: true }).click();
    await expect(page).toHaveURL('/work?category=products');
    await expect(page.getByRole('link', { name: 'Products', exact: true })).toHaveAttribute('aria-current', 'page');
    await expectCatalog(page, productSlugs, 3);
    await expectFixedSections(page);

    await page.getByRole('link', { name: 'Developer tools', exact: true }).click();
    await expect(page).toHaveURL('/work?category=developer-tools');
    await expect(page.getByRole('link', { name: 'Developer tools', exact: true })).toHaveAttribute('aria-current', 'page');
    await expectCatalog(page, developerSlugs, 4);
    await expectFixedSections(page);

    await page.getByRole('link', { name: 'All', exact: true }).click();
    await expect(page).toHaveURL('/work');
    await expectCatalog(page, currentPublishedSlugs, 7);
    expect(unexpected).toEqual([]);
  } finally { await context.close(); }
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`Work intro has opaque unmasked foreground with ${reducedMotion} motion`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({ reducedMotion, baseURL: 'http://localhost:3100' });
    const unexpected = await localOnly(context);
    try {
      const page = await context.newPage();
      const response = await page.goto('/work');
      expect(response?.status()).toBe(200);
      const evidence = await workIntroEvidence(page);
      expect(evidence.effectiveOpacity).toBeCloseTo(1, 5);
      expect(evidence.ancestors.filter(({ maskImage, webkitMaskImage }) => maskImage !== 'none' || (webkitMaskImage !== '' && webkitMaskImage !== 'none'))).toEqual([]);
      expect(evidence.contrast).toBeGreaterThanOrEqual(4.5);
      await artifact(testInfo, `work-intro-${reducedMotion}`, evidence);
      const screenshot = testInfo.outputPath(`work-intro-${reducedMotion}.png`);
      await page.locator('[data-work-intro]').screenshot({ path: screenshot, animations: 'disabled' });
      await testInfo.attach(`work-intro-${reducedMotion}`, { path: screenshot, contentType: 'image/png' });
      expect(unexpected).toEqual([]);
    } finally { await context.close(); }
  });
}

test('homepage proof uses the published catalog and retains every secondary destination', async ({ page }) => {
  const response = await page.goto('/#work');
  const proof = page.locator('[data-home-proof]');

  await expect(proof.locator('[data-home-project]').evaluateAll(projects => projects.map(project => project.getAttribute('data-home-project'))))
    .resolves.toEqual(['vora', ...developerSlugs, 'chapterhq', 'site-assistant', 'open-source', 'real-estate-maite']);
  await expect(proof.locator('[data-home-feature="true"]')).toHaveAttribute('data-home-project', 'vora');
  await expect(proof.locator('[data-home-group="developer-tools"]')).toHaveCount(1);
  await expect(proof.locator('[data-home-group="secondary"] [data-home-project]')).toHaveCount(4);
  await expect(proof.getByRole('link', { name: 'Explore Vora' })).toHaveAttribute('href', '/work/vora');
  await expect(proof.getByRole('link', { name: 'Details', exact: true })).toHaveCount(3);
  await expect(proof.getByRole('link', { name: 'Explore the work' })).toHaveAttribute('href', '/work');
  await expect(proof).toContainText('prototypes and developer previews whose limits are stated beside the example');
  expect(await proof.locator('img[loading="eager"]').count()).toBeLessThanOrEqual(1);
  await expect(proof.locator('[data-demo-shell]')).toHaveCount(0);
  for (const path of ['/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center']) {
    await expect(proof.locator(`a[href="${path}"]`)).toHaveCount(1);
  }
  expect(await proof.textContent()).not.toMatch(/SYNTHETIC_PRIVATE_SENTINEL|\/Users\//);
  if (process.env.SHOWCASE_SERVER === 'production') {
    expect(await response!.text()).not.toMatch(/SYNTHETIC_PRIVATE_SENTINEL|\/Users\//);
  }
});

test('homepage proof remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://localhost:3100' });
  const unexpected = await localOnly(context);
  const page = await context.newPage();
  const response = await page.goto('/#work');
  const proof = page.locator('[data-home-proof]');

  expect(response?.status()).toBe(200);
  await expect(proof.locator('[data-home-project]')).toHaveCount(9);
  await expect(proof.locator('.reveal')).toHaveCount(0);
  await expectNoTransparentAncestor(proof.getByRole('heading', { name: 'The systems I recommend are ones I build and run' }));
  await expectNoTransparentAncestor(proof.locator('[data-home-feature]'));
  await expectNoTransparentAncestor(proof.locator('[data-home-group="secondary"]'));
  await expectNoTransparentAncestor(proof.getByRole('link', { name: 'Explore the work' }));
  expect(unexpected).toEqual([]);
  await context.close();
});

test('How I build preserves its method and conversion paths while approved panels remain present', async ({ page }) => {
  const response = await page.goto('/how-i-build');

  await expect(page.getByRole('heading', { name: 'Projects behind my development workflow' })).toBeVisible();
  await expect(page.locator('[data-method-project]')).toHaveCount(4);
  await expect(page.getByText('None of this is exotic.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See the systems' })).toHaveAttribute('href', '/work');
  await expect(page.getByRole('link', { name: "Let's talk", exact: true }).first()).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Take the free AI readiness assessment' })).toHaveAttribute('href', '/tools/ai-readiness');
  await expect(page).toHaveTitle('How I build | Caleb Bolden');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /workflow I use every day/);
  for (const path of ['/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center']) {
    await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);
  }
  expect(await page.locator('main').textContent()).not.toMatch(/SYNTHETIC_PRIVATE_SENTINEL|\/Users\//);
  if (process.env.SHOWCASE_SERVER === 'production') {
    expect(await response!.text()).not.toMatch(/SYNTHETIC_PRIVATE_SENTINEL|\/Users\//);
  }
});

test('How I build remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://localhost:3100' });
  const unexpected = await localOnly(context);
  const page = await context.newPage();
  const response = await page.goto('/how-i-build');

  expect(response?.status()).toBe(200);
  await expect(page.locator('main .reveal')).toHaveCount(0);
  for (const target of [
    page.getByRole('heading', { name: 'How I build' }),
    page.getByText('the operation', { exact: true }),
    page.getByRole('heading', { name: 'Projects behind my development workflow' }),
    page.getByText('primary env', { exact: true }),
    page.getByText('autonomous loops', { exact: true }),
    page.getByText('what this means for clients', { exact: true }),
    page.getByRole('heading', { name: 'Start with the audit' }),
  ]) {
    await expectNoTransparentAncestor(target);
  }
  expect(unexpected).toEqual([]);
  await context.close();
});

test('sitemap retains published legacy and collection routes with approved case studies', async ({ page }) => {
  const response = await page.goto('/sitemap.xml');
  expect(response?.status()).toBe(200);
  const xml = await response!.text();

  for (const path of ['/work/vora', '/work/chapterhq', '/work/site-assistant', '/work/open-source']) {
    expect(xml).toContain(`https://calebbolden.com${path}`);
  }
  for (const path of ['/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center']) {
    expect(xml).toContain(`https://calebbolden.com${path}`);
  }
  for (const path of ['/results', '/tools/ai-readiness', '/contact']) {
    expect(xml).toContain(`https://calebbolden.com${path}`);
  }
  expect(xml).toContain('<loc>https://calebbolden.com/blog</loc>');
  expect(xml).toMatch(/<loc>https:\/\/calebbolden\.com\/blog\/[a-z0-9-]+<\/loc>/);
  expect(xml).not.toMatch(/SYNTHETIC_PRIVATE_SENTINEL|\/Users\//);
});

test('complete catalog filters and five public flagship destinations @release', async ({ page }) => {
  await page.goto('/work');
  await expectCatalog(page, ['vora', 'prism', 'agent-team', 'agent-config', 'control-center', 'chapterhq', 'site-assistant'], 7);
  await page.getByRole('link', { name: 'Products' }).click();
  await expectCatalog(page, ['vora', 'chapterhq', 'site-assistant'], 3);
  await page.getByRole('link', { name: 'Developer tools' }).click();
  await expectCatalog(page, ['prism', 'agent-team', 'agent-config', 'control-center'], 4);

  await page.goto('/#work');
  await expect(page.locator('[data-home-group="developer-tools"] [data-home-project]')
    .evaluateAll(projects => projects.map(project => project.getAttribute('data-home-project'))))
    .resolves.toEqual(['prism', 'agent-team', 'agent-config', 'control-center']);
  await expect(page.locator('[data-home-feature="true"] img')).toHaveCount(1);
  expect(await page.locator('[data-home-proof] img[loading="eager"]').count()).toBeLessThanOrEqual(1);

  await page.goto('/how-i-build');
  await expect(page.locator('[data-method-project]').evaluateAll(projects => projects.map(project => project.getAttribute('data-method-project'))))
    .resolves.toEqual(['agent-config', 'agent-team', 'control-center', 'prism']);

  for (const path of ['/work/vora', '/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole('link', { name: 'Back to Work' }).last()).toHaveAttribute('href', '/work');
    await expect(page.getByRole('link', { name: 'Discuss a similar project' })).toHaveAttribute('href', '/contact');
    const related = page.locator('[data-case-study-section="continue"] a.type-display');
    expect(await related.count()).toBeGreaterThanOrEqual(1);
    expect(await related.count()).toBeLessThanOrEqual(2);
    for (const href of await related.evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      expect(['/work/vora', '/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center', '/work/chapterhq', '/work/site-assistant']).toContain(href);
    }
  }
});

test('approved featured poster begins within the 1440 by 900 viewport @release', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work');
  await page.evaluate(() => document.documentElement.setAttribute('data-chat', 'collapsed'));

  const poster = page.locator('[data-work-card][data-featured="true"] img');
  await expect(poster).toBeVisible();
  const bounds = await poster.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y).toBeLessThan(900);
});

test('modified category click opens native destination without changing current state', async ({ page, context }) => {
  await page.goto('/work');
  const opened = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Products', exact: true }).click({ modifiers: ['ControlOrMeta'] });
  const tab = await opened; await tab.waitForLoadState(); await expect(tab).toHaveURL('/work?category=products');
  await expect(page).toHaveURL('/work'); await expectCatalog(page, currentPublishedSlugs, 7); await tab.close();
});
