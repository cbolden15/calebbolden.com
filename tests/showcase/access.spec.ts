import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { test, expect, localOnly, mountComponentFixture } from './helpers';

test('legacy project bodies remain visible with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://localhost:3100' });
  const unexpected = await localOnly(context);
  try {
    const page = await context.newPage();
    for (const slug of ['chapterhq', 'site-assistant']) {
      await page.goto(`/work/${slug}`);
      await expect(page.locator('main h1')).toBeVisible();
      const wrappers = page.locator('main .reveal');
      expect(await wrappers.count()).toBeGreaterThan(3);
      for (const wrapper of await wrappers.all()) await expect(wrapper).toHaveCSS('opacity', '1');
      await expect(page.getByText('the stack', { exact: true })).toBeVisible();
    }
    expect(unexpected).toEqual([]);
  } finally { await context.close(); }
});

test('component fixture keeps first frame, ordered walkthrough and native recovery without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://localhost:3100' });
  const unexpected = await localOnly(context);
  try {
    const page = await context.newPage(); await mountComponentFixture(page);
    await expect(page.locator('[data-case-study-section="introduction"]')).toHaveCSS('mask-image', 'none');
    await expect(page.locator('[data-demo-first-frame]')).toBeVisible();
    await expect(page.getByRole('list', { name: 'Sample walkthrough' })).toBeVisible();
    await expect(page.locator('[data-demo-reload]')).toHaveAttribute('href', '/work/vora');
    await expect(page.getByRole('button', { name: 'Enhancement fixture control' })).toBeHidden();
    await page.locator('[data-demo-reload]').click(); await expect(page.locator('main h1')).toHaveText('Vora');
    expect(unexpected).toEqual([]);
  } finally { await context.close(); }
});

test('component fixture reflows at post-chat container boundaries, including fractional widths', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await mountComponentFixture(page);
  for (const width of [800, 799.5, 799, 600, 599.5, 599, 320]) {
    await page.locator('[data-showcase-surface]').evaluate((surface, value) => { (surface as HTMLElement).style.width = `${value}px`; }, width);
    const layout = await page.locator('[data-showcase-surface]').evaluate(surface => {
      const content = surface.querySelector('[data-fixture-content]')!;
      const feature = content.querySelector('article > div')!;
      const row = content.querySelectorAll('article > div')[1];
      const workflow = surface.querySelector('[data-case-study-section="workflow"] h2')!.nextElementSibling!;
      return { width: surface.getBoundingClientRect().width, padding: getComputedStyle(content).paddingLeft,
        feature: getComputedStyle(feature).gridTemplateColumns.split(' ').length,
        row: getComputedStyle(row).gridTemplateColumns.split(' ').length,
        workflow: getComputedStyle(workflow).gridTemplateColumns.split(' ').length,
        overflow: surface.scrollWidth > surface.clientWidth };
    });
    expect(layout.width).toBe(width);
    expect(layout.padding).toBe(width < 600 ? '20px' : '32px');
    expect(layout.feature).toBe(width < 800 ? 1 : 12); expect(layout.workflow).toBe(width < 800 ? 1 : 12);
    expect(layout.row).toBe(width < 600 ? 1 : 12); expect(layout.overflow).toBe(false);
  }
  await page.setViewportSize({ width: 320, height: 900 });
  const output = testInfo.outputPath('component-320px.png');
  await page.locator('[data-showcase-surface]').screenshot({ path: output, animations: 'disabled' });
  await testInfo.attach('component-320px', { path: output, contentType: 'image/png' });
});

test('actual rich layout preserves chat preference and reflows at 320px and 640px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1160, height: 900 }); await page.goto('/work/vora');
  await expect(page.locator('html')).toHaveAttribute('data-chat', 'open');
  await expect(page.locator('[data-showcase-surface]')).toHaveCSS('width', '800px');
  const output = testInfo.outputPath('legacy-chat-open.png');
  await page.screenshot({ path: output, animations: 'disabled' });
  await testInfo.attach('legacy-chat-open', { path: output, contentType: 'image/png' });
  await page.getByRole('button', { name: 'Hide assistant' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-chat', 'collapsed');
  await expect(page.locator('[data-showcase-surface]')).toHaveCSS('width', '1160px');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-chat', 'collapsed');
  for (const width of [320, 640]) {
    await page.setViewportSize({ width, height: 900 });
    // Native browser zoom is covered separately with chrome.tabs.setZoom.
    await page.addStyleTag({ content: 'html, body { overflow-x: visible !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('main h1')).toBeVisible();
  }
});

test('component fixture failed media retains caption, transcript, walkthrough and native recovery', async ({ page }) => {
  await page.route('**/work/test-only/*', route => route.abort('failed'));
  await mountComponentFixture(page);
  const image = page.locator('[data-project-media="image"] img');
  await expect(image).toHaveAttribute('alt', 'A blue test frame');
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth === 0)).toBe(true);
  await expect(page.locator('[data-project-media="image"] figcaption')).toBeVisible();
  await expect(page.getByText('A blue frame stays visible.', { exact: true })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Sample walkthrough' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', '/work/test-only/poster.png');
  await page.locator('video').scrollIntoViewIfNeeded();
  await page.locator('video').evaluate(video => (video as HTMLVideoElement).load());
  await expect.poll(() => page.locator('video').evaluate(video => (video as HTMLVideoElement).networkState)).toBe(3);
  await expect(page.locator('video')).toHaveAttribute('poster', '/work/test-only/secondary.png');
  await page.locator('[data-demo-reload]').click(); await expect(page.locator('main h1')).toHaveText('Vora');
});

test('component fixture native video loads reviewed captions under the actual page headers', async ({ page }, testInfo) => {
  const scratch = mkdtempSync(join(tmpdir(), 'showcase-video-'));
  try {
    const path = join(scratch, 'clip.webm');
    execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=blue:s=32x20:d=1', '-c:v', 'libvpx-vp9', '-y', path], { timeout: 30_000 });
    const poster = await sharp({ create: { width: 32, height: 20, channels: 3, background: '#296f96' } }).png().toBuffer();
    let videoRequests = 0;
    await page.route('**/work/test-only/*.png', route => route.fulfill({ contentType: 'image/png', body: poster }));
    await page.route('**/work/test-only/clip.webm', route => { videoRequests++; return route.fulfill({ contentType: 'video/webm', body: readFileSync(path) }); });
    const response = await page.request.get('/work/vora');
    const output = testInfo.outputPath('actual-page-csp.txt');
    writeFileSync(output, response.headers()['content-security-policy'] ?? 'No Content-Security-Policy header on the current local app response.');
    await testInfo.attach('actual-page-csp', { path: output, contentType: 'text/plain' });
    await mountComponentFixture(page);
    const video = page.locator('video');
    await expect(video).toHaveAttribute('preload', 'none'); await expect(video).toHaveAttribute('controls', '');
    await expect(video).not.toHaveAttribute('autoplay', ''); expect(videoRequests).toBe(0);
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(element => { (element as HTMLVideoElement).textTracks[0].mode = 'showing'; (element as HTMLVideoElement).load(); });
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).textTracks[0].cues?.length ?? 0)).toBe(1);
    expect(await video.evaluate(element => ((element as HTMLVideoElement).textTracks[0].cues![0] as VTTCue).text)).toBe('A blue frame stays visible.');
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
    expect(videoRequests).toBeGreaterThan(0);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('component fixture reduced motion is immediate and enhancement controls require readiness', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await mountComponentFixture(page);
  const button = page.getByRole('button', { name: 'Enhancement fixture control' });
  await expect(button).toBeHidden();
  await page.locator('[data-fixture-controls]').evaluate(element => element.setAttribute('data-ready', 'true'));
  await expect(button).toBeVisible(); await expect(button).toHaveCSS('transition-duration', '0s'); await expect(button).toHaveCSS('animation-name', 'none');
  await button.focus(); await expect(button).toBeFocused();
  const box = await button.boundingBox(); expect(box!.height).toBeGreaterThanOrEqual(44); expect(box!.width).toBeGreaterThanOrEqual(44);
  const reload = page.locator('[data-demo-reload]'); await reload.focus(); await expect(reload).toBeFocused();
  const reloadBox = await reload.boundingBox(); expect(reloadBox!.height).toBeGreaterThanOrEqual(44);
});

for (const javaScriptEnabled of [true, false]) {
  test(`component fixture defers the distinct secondary video poster until approach (JavaScript ${javaScriptEnabled})`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 800, height: 600 }, baseURL: 'http://localhost:3100' });
    const unexpected = await localOnly(context);
    try {
      const page = await context.newPage();
      const requested: string[] = [];
      const poster = await sharp({ create: { width: 32, height: 20, channels: 3, background: '#296f96' } }).png().toBuffer();
      await page.route('**/work/test-only/*.png', route => { requested.push(new URL(route.request().url()).pathname); return route.fulfill({ contentType: 'image/png', body: poster }); });
      await mountComponentFixture(page, { secondaryFarBelow: true });
      await page.waitForLoadState('networkidle');
      expect(requested).toContain('/work/test-only/poster.png');
      expect(requested).not.toContain('/work/test-only/secondary.png');
      const video = page.locator('video');
      expect(await video.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThan(12000);
      await expect(page.getByText('A blue frame stays visible.', { exact: true })).toBeVisible();
      await expect(page.locator('[data-demo-reload]')).toHaveAttribute('href', '/work/vora');
      const approached = page.waitForResponse('**/work/test-only/secondary.png');
      await video.scrollIntoViewIfNeeded();
      expect((await approached).status()).toBe(200);
      expect(requested.filter(path => path === '/work/test-only/secondary.png')).toHaveLength(1);
      await expect(video).toHaveAttribute('controls', '');
      expect(unexpected).toEqual([]);
    } finally { await context.close(); }
  });
}

for (const slug of ['vora', 'prism', 'agent-team', 'agent-config', 'control-center']) {
  test(`${slug} real responsive/chat/reduced-motion matrix`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await page.goto(`/work/${slug}`, { waitUntil: 'networkidle' });
      // Inspect overflow with the site's body hiding disabled, so it cannot mask a defect.
      await page.addStyleTag({ content: 'html,body { overflow-x: visible !important; }' });
      await page.locator('[data-demo-enhancement]').scrollIntoViewIfNeeded();
      const controls = page.locator('[data-demo-enhancement] button'); await expect(controls.first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      for (const button of await controls.all()) { const box = await button.boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44); }
      if (width < 768) {
        await page.getByRole('button', { name: 'Open chat assistant', exact: true }).click();
        await expect(page.getByRole('button', { name: 'Close chat', exact: true })).toBeInViewport();
        await page.getByRole('button', { name: 'Close chat', exact: true }).click();
      } else {
        const hide = page.getByRole('button', { name: 'Hide assistant', exact: true });
        if (await page.locator('html').getAttribute('data-chat') === 'open') await hide.click();
        await expect(page.locator('html')).toHaveAttribute('data-chat', 'collapsed');
        await page.getByRole('button', { name: 'Show assistant', exact: true }).click(); await expect(page.locator('html')).toHaveAttribute('data-chat', 'open');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        await page.getByRole('button', { name: 'Hide assistant', exact: true }).click();
      }
      await controls.first().scrollIntoViewIfNeeded(); await expect(controls.first()).toBeInViewport();
      if (width === 320) { const path = info.outputPath(`${slug}-320.png`); await page.screenshot({ path }); await info.attach('mobile', { path, contentType: 'image/png' }); }
    }
    for (const width of [599, 599.5, 600, 799, 799.5, 800]) {
      await page.locator('[data-showcase-surface]').evaluate((el, w) => { (el as HTMLElement).style.width = `${w}px`; }, width);
      expect(await page.locator('[data-showcase-surface]').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    }
  });
}

for (const reducedMotion of ['reduce', 'no-preference'] as const) test(`Home Proof is topmost after scrolling, hero remains bounded (${reducedMotion})`, async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion }); await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  const hero = page.locator('.hero-sticky').filter({ visible: true });
  await expect(hero).toHaveCSS('position', reducedMotion === 'reduce' ? 'relative' : 'sticky');
  const feature = page.locator('[data-home-feature="true"]');
  for (const target of [feature.locator('img'), feature.locator('h3'), feature.locator('p').first()]) {
    await target.scrollIntoViewIfNeeded();
    await expect.poll(() => target.evaluate(el => {
      const box = el.getBoundingClientRect(); const x = box.x + box.width / 2; const y = Math.max(0, box.y) + Math.min(box.height, innerHeight - Math.max(0, box.y)) / 2;
      const hit = document.elementFromPoint(x, y); return hit === el || !!hit && el.contains(hit);
    })).toBe(true);
  }
  const path = info.outputPath(`proof-${reducedMotion}.png`); await page.screenshot({ path }); await info.attach('proof-hit-test', { path, contentType: 'image/png' });
});

test('Team stage numbers and whole labels stay on one line at every available width', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900}); await page.goto('/work/agent-team');
  await page.getByRole('button',{name:'Hide assistant',exact:true}).click();
  await page.locator('[data-demo-enhancement]').scrollIntoViewIfNeeded();
  const stages=page.locator('[data-demo-enhancement]').getByRole('list',{name:'Run stages'});
  await expect(stages).toBeVisible();
  for(const width of [320,390,599,599.5,600,640,768,799,799.5,800,1024,1440]) {
    await page.locator('[data-showcase-surface]').evaluate((el,w)=>{(el as HTMLElement).style.width=`${w}px`;},width);
    const labels=await stages.locator('button > span').evaluateAll(spans=>spans.map(span=>{const range=document.createRange();range.selectNodeContents(span);return {text:span.textContent,lines:new Set([...range.getClientRects()].map(r=>Math.round(r.y))).size};}));
    expect(labels.every(label=>label.lines===1),JSON.stringify({width,labels})).toBe(true);
    expect(await stages.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  }
});
