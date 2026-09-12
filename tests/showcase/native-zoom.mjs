import { chromium } from '@playwright/test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const scratch = await mkdtemp(path.join(tmpdir(), 'showcase-native-zoom-'));
let context;
try {
  const extension = path.join(scratch, 'extension');
  await mkdir(extension);
  await writeFile(path.join(extension, 'manifest.json'), JSON.stringify({manifest_version:3,name:'Showcase native zoom test',version:'1.0',background:{service_worker:'worker.js'},host_permissions:['http://localhost/*']}));
  await writeFile(path.join(extension, 'worker.js'), 'chrome.runtime.onInstalled.addListener(() => {});');
  context = await chromium.launchPersistentContext(path.join(scratch, 'profile'), {channel:'chromium',headless:true,viewport:null,args:['--window-size=1280,900', '--disable-extensions-except='+extension, '--load-extension='+extension],timeout:30000});
  const blocked = [];
  await context.route('**/*', route => {
    const url = new URL(route.request().url()); if (url.origin === 'http://localhost:3100' && !url.pathname.startsWith('/api/')) return route.continue();
    blocked.push(route.request().url()); return route.abort();
  });
  await context.routeWebSocket(/.*/, socket => { blocked.push(socket.url()); socket.close(); });
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker', {timeout:15000});
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto('http://localhost:3100/work/vora', {waitUntil:'load', timeout:15000});
  const measure = () => page.evaluate(() => ({innerWidth,outerWidth,dpr:devicePixelRatio,visualScale:visualViewport?.scale,cssZoom:getComputedStyle(document.body).zoom,scrollWidth:document.documentElement.scrollWidth}));
  const before = await measure();
  const native = await worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({url:'http://localhost/*'});
    if (!tab?.id) throw new Error('Owned test tab missing');
    const before = await chrome.tabs.getZoom(tab.id);
    await chrome.tabs.setZoomSettings(tab.id, {mode:'automatic',scope:'per-tab'});
    await chrome.tabs.setZoom(tab.id, 2);
    return {before, after:await chrome.tabs.getZoom(tab.id),settings:await chrome.tabs.getZoomSettings(tab.id)};
  });
  await page.waitForFunction(width => innerWidth <= width/1.9, before.innerWidth, {timeout:10000});
  const after = await measure();
  assert.equal(native.before,1); assert.equal(native.after,2);
  assert.equal(after.outerWidth,before.outerWidth);
  assert.equal(after.cssZoom,'1'); assert.equal(after.visualScale,1);
  assert.equal(after.scrollWidth,after.innerWidth);
  const routes = [];
  for (const slug of (process.env.SHOWCASE_ZOOM_SLUGS?.split(',') ?? ['vora','prism','agent-team','agent-config','control-center'])) {
    await page.goto('http://localhost:3100/work/'+slug, {waitUntil:'networkidle'});
    // Native per-tab zoom resets on a full navigation. Set and verify it on each actual page.
    const routeZoom = await worker.evaluate(async () => { const [tab] = await chrome.tabs.query({url:'http://localhost/*'}); await chrome.tabs.setZoom(tab.id,2); return chrome.tabs.getZoom(tab.id); });
    assert.equal(routeZoom,2); await page.waitForFunction(() => innerWidth===640);
    await page.addStyleTag({content:'html,body{overflow-x:visible!important}'});
    await page.locator('[data-demo-enhancement]').scrollIntoViewIfNeeded();
    const controls = page.locator('[data-demo-enhancement] button'); await controls.first().waitFor();
    for (const button of await controls.all()) { const box = await button.boundingBox(); assert(box.width>=44 && box.height>=44); }
    await page.getByRole('button',{name:'Open chat assistant',exact:true}).click();
    const close = page.getByRole('button',{name:'Close chat',exact:true}); assert(await close.isVisible()); await close.click();
    await controls.first().scrollIntoViewIfNeeded(); await controls.first().focus(); await page.keyboard.press('Space');
    await page.locator('[data-demo-enhancement]').getByRole('button',{name:'Reset',exact:true}).click();
    const layout = await measure(); assert.equal(layout.scrollWidth,layout.innerWidth); assert.equal(layout.outerWidth,before.outerWidth);
    await controls.first().scrollIntoViewIfNeeded();
    if(slug==='agent-team') {
      const stages=page.locator('[data-demo-enhancement]').getByRole('list',{name:'Run stages'});
      const labels=await stages.locator('button > span').evaluateAll(spans=>spans.map(span=>{const range=document.createRange();range.selectNodeContents(span);return {text:span.textContent,lines:new Set([...range.getClientRects()].map(r=>Math.round(r.y))).size};}));
      assert(labels.every(label=>label.lines===1),JSON.stringify(labels));
    }
    const hit = await controls.first().evaluate(el => { const b=el.getBoundingClientRect(); const target=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return target===el || !!target&&el.contains(target); });
    assert(hit,'Actual native-zoom control must be the viewport hit target');
    if(slug==='agent-team') await page.locator('[data-demo-enhancement]').getByRole('list',{name:'Run stages'}).scrollIntoViewIfNeeded();
    // Chromium's native zoom uses device-independent Page metrics for the capture clip.
    // Playwright's CSS-sized default clip cropped the 2x page; preserve the actual native viewport.
    const cdp=await context.newCDPSession(page);
    const metrics=await cdp.send('Page.getLayoutMetrics');
    const viewport=metrics.layoutViewport;
    const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:true,clip:{x:viewport.pageX,y:viewport.pageY,width:viewport.clientWidth,height:viewport.clientHeight,scale:1}});
    const png=Buffer.from(shot.data,'base64');
    await cdp.detach();
    await writeFile(process.env.SHOWCASE_ZOOM_DIR+'/'+slug+'-native200.png',png);
    const pixels=await sharp(png).stats(); assert(pixels.channels.some(channel=>channel.stdev>5),'Native screenshot must contain rendered content');
    routes.push({slug,nativeZoom:routeZoom,...layout,captureViewport:viewport});
  }
  assert.equal(blocked.length,0);
  const result={routes,method:'Native chrome.tabs.setZoom via disposable Chromium extension; actual final candidate, local-only requests',browser:context.browser()?.version(),native,before,after,blocked};
  await writeFile(process.env.SHOWCASE_ZOOM_DIR+'/native-zoom.json', JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
} finally { await context?.close(); await rm(scratch,{recursive:true,force:true}); }
