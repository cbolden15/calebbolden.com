import { build } from 'esbuild';
import { projectRecords } from '../../lib/work/catalog';
import { test, expect, localOnly } from './helpers';
import { demos, openDemo, completeDemo } from './demo-cases';

test('Vora every state resets, changes outcome, rejects and keeps approval separate from delivery', async ({ page }) => {
  const r = await openDemo(page, 'vora');
  const button = (name: string) => r.getByRole('button', { name, exact: true });
  for (const outcome of ['Succeeds', 'Fails']) for (const state of ['request', 'pending', 'approved', 'rejected', 'result']) {
    await button('Reset').click(); await button(outcome).click();
    if (state !== 'request') await button('Review proposed action').click();
    if (['approved', 'result'].includes(state)) await button('Approve example').click();
    if (state === 'rejected') { await button('Reject example').click(); await expect(r).toContainText('No action taken in this example.'); }
    if (state === 'result') await button('Show sample result').click();
    if (state !== 'approved') await expect(button('Show sample result')).toHaveCount(0);
    if (state === 'pending') await expect(r).not.toContainText('Approval recorded');
    if (state === 'approved') { await expect(r).toContainText('Execution has not been shown'); await expect(button('Approve example')).toHaveCount(0); }
    if (state === 'result') await expect(r.getByRole('heading', { name: outcome === 'Succeeds' ? 'Completed' : 'Execution failed', exact: true })).toBeVisible();
    await button(outcome === 'Succeeds' ? 'Fails' : 'Succeeds').click();
    await expect(r.getByRole('heading', { name: 'Request received', exact: true })).toBeFocused();
    await button('Reset').click(); await expect(button('Succeeds')).toHaveAttribute('aria-pressed', 'true');
  }
  await button('Review proposed action').focus(); await page.keyboard.press('Enter');
  await expect(r.getByRole('heading', { name: 'Awaiting approval' })).toBeFocused();
  await button('Approve example').dblclick(); await expect(r).toContainText('Execution has not been shown');
  await button('Show sample result').dblclick(); await expect(r.getByRole('heading', { name: 'Completed', exact: true })).toHaveCount(1);
});

test('Prism every event resets; receipt and result occur only at completion and disappear on Previous', async ({ page }) => {
  const r = await openDemo(page, 'prism');
  const button = (name: string) => r.getByRole('button', { name, exact: true });
  await expect(button('Previous event')).toBeDisabled(); await expect(button('Next event')).toBeDisabled();
  for (let stage = 0; stage < 6; stage++) {
    await button('Start example').focus(); await page.keyboard.press('Enter');
    for (let n = 0; n < stage; n++) await button('Next event').click();
    if (stage < 5) { await expect(button('Inspect receipt')).toHaveCount(0); await expect(r.getByRole('region', { name: 'Prism result' })).toHaveCount(0); }
    else {
      await expect(button('Next event')).toBeDisabled(); await button('Inspect receipt').click();
      await expect(r).toContainText('no persisted measured usage'); await expect(r).toContainText('no cleanup or lifecycle-receipt field');
      await r.locator('summary').click(); await expect(r).toContainText('not OOM-killed');
      await button('Close receipt').click(); await expect(button('Inspect receipt')).toBeVisible();
      await button('Inspect receipt').click(); await button('Previous event').click();
      await expect(button('Close receipt')).toHaveCount(0); await expect(r.getByRole('region', { name: 'Prism result' })).toHaveCount(0);
    }
    await button('Reset').click(); await expect(r.getByRole('heading', { name: 'Ready to start' })).toBeFocused();
  }
});

test('Team every reachable stage resets, retry retains evidence and Security forbids QA and Delivery', async ({ page }) => {
  const r = await openDemo(page, 'agent-team');
  const button = (name: string) => r.getByRole('button', { name, exact: true });
  for (const scenario of ['Passes review', 'QA retry', 'Security block']) {
    await button(scenario).click();
    const stages = r.getByRole('list', { name: 'Run stages' }).getByRole('button');
    for (let stage = 0; stage < (scenario === 'Security block' ? 3 : 5); stage++) {
      await stages.nth(stage).click(); await expect(stages.nth(stage)).toHaveAttribute('aria-current', 'step');
      if (stage === 4) { await expect(r).toContainText('Merge-policy enforcement: disabled'); if (scenario === 'QA retry') await expect(r).toContainText(/assert|retry|passing/i); }
      await button('Reset').click(); await expect(button('Passes review')).toHaveAttribute('aria-pressed', 'true'); await button(scenario).click();
    }
    if (scenario === 'Security block') {
      await stages.nth(2).click(); await expect(stages.nth(3)).toBeDisabled(); await expect(stages.nth(4)).toBeDisabled(); await expect(button('Next stage')).toBeDisabled();
      await expect(r).not.toContainText('draft-pr'); await expect(r).toContainText('Not reached');
    }
    await button('Reset').click();
  }
});

test('Config both stale directions, atomic variants and all resets', async ({ page }) => {
  const r = await openDemo(page, 'agent-config');
  const button = (name: string) => r.getByRole('button', { name, exact: true });
  for (const variant of ['Brief', 'Detailed']) for (const stale of [false, true]) {
    await button(variant).focus(); await page.keyboard.press('Enter');
    await expect(button('Regenerate example')).toBeDisabled();
    if (stale) {
      await button('Show stale output').click(); await expect(button('Show stale output')).toBeDisabled();
      await expect(r.getByRole('region', { name: 'Codex illustrative output' })).toContainText('Out of date');
      await expect(r.getByRole('region', { name: 'Claude Code illustrative output' })).toContainText('Current');
      await button('Regenerate example').click(); await expect(r).not.toContainText('Out of date');
      await button('Show stale output').click(); await button(variant === 'Brief' ? 'Detailed' : 'Brief').click(); await expect(r).not.toContainText('Out of date');
    }
    await button('Reset').click(); await expect(button('Reset')).toBeFocused(); await expect(button('Brief')).toHaveAttribute('aria-pressed', 'true');
  }
});

test('Center derived counts, all detail announcements, both filters and terminal resets', async ({ page }) => {
  const r = await openDemo(page, 'control-center');
  const button = (name: string | RegExp) => r.getByRole('button', { name, exact: typeof name === 'string' });
  const live = r.getByRole('status');
  for (const scenario of ['Succeeds', 'Fails']) for (const filter of ['Show all', 'Needs attention']) {
    await button(scenario).click(); await expect(live).toHaveText(`${scenario} scenario selected. Sample run reset to Started.`);
    await button(filter).click(); await expect(live).toHaveText(`${filter} filter selected.`);
    await expect(r.locator('[data-center-state]')).toContainText(scenario === 'Succeeds' ? filter === 'Show all' ? '1 run and 1 decision' : '0 runs and 0 decisions' : filter === 'Show all' ? '2 runs and 1 decision' : '1 run and 1 decision');
    if (scenario === 'Succeeds' && filter === 'Needs attention') await expect(r.getByText('No items need attention in this example.', { exact: true })).toHaveCount(2);
    if (filter === 'Show all') { await button(/Refresh demo index/).click(); await expect(live).toHaveText('Run detail opened: Refresh demo index'); }
    if (scenario === 'Fails') { await button(/Archive sample reports/).click(); await expect(live).toHaveText('Run detail opened: Archive sample reports'); }
    if (scenario === 'Fails' || filter === 'Show all') {
      await button(/Keep sample reports/).click(); await expect(live).toHaveText('Decision detail opened: Keep sample reports for 30 days?');
      await expect(r).toContainText(scenario === 'Fails' ? 'Unresolved · needs attention' : 'Configuration review');
    }
    await button(/demo-console\.example/).click(); await expect(live).toHaveText('Deployment detail opened: demo-console.example');
    await expect(r).toContainText('f1c7a2b'); await expect(r).toContainText('not evidence that Control Center itself is deployed');
    await expect(button(/approve/i)).toHaveCount(0);
    await button('Show sample run result').click(); await expect(live).toHaveText(`Sample run result: ${scenario === 'Succeeds' ? 'Succeeded' : 'Failed'}.`);
    await expect(button('Show sample run result')).toBeDisabled();
    await button('Reset').click(); await expect(live).toHaveText('Reset complete. Succeeds, Started, and Show all restored.'); await expect(button('Reset')).toBeFocused();
  }
});

for (const demo of demos) {
  test(`${demo.slug} physical keyboard traversal, storage and completed interaction`, async ({ page }) => {
    await page.addInitScript(() => {
      const writes: string[] = []; (window as unknown as { startupWrites: string[] }).startupWrites = writes;
      for (const method of ['setItem', 'removeItem', 'clear'] as const) {
        const original = Storage.prototype[method];
        Storage.prototype[method] = function(...args: string[]) { writes.push(JSON.stringify([method, ...args])); return Reflect.apply(original, this, args); };
      }
    });
    await page.goto('/work/chapterhq', { waitUntil: 'networkidle' });
    const baselineStartup = await page.evaluate(() => (window as unknown as { startupWrites: string[] }).startupWrites);
    const r = await openDemo(page, demo.slug);
    expect(await page.evaluate(() => (window as unknown as { startupWrites: string[] }).startupWrites)).toEqual(baselineStartup);
    const before = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }));
    await page.evaluate(() => {
      const writes: string[] = []; (window as unknown as { demoWrites: string[] }).demoWrites = writes;
      const original = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { writes.push(key); return original.call(this, key, value); };
    });
    const controls = r.locator('button:enabled, a[href], summary, [tabindex="0"]');
    const count = await controls.count(); expect(count).toBeGreaterThan(0);
    await controls.first().focus();
    // Chromium also tabs native scroll containers; retain them while proving every control in DOM order.
    for (const key of ['Tab', 'Shift+Tab']) {
      let expectedIndex = key === 'Tab' ? 0 : count - 1;
      await (key === 'Tab' ? controls.first() : controls.last()).focus();
      for (let n = 0; n < count + 8 && expectedIndex >= 0 && expectedIndex < count; n++) {
        if (await controls.nth(expectedIndex).evaluate(el => el === document.activeElement)) expectedIndex += key === 'Tab' ? 1 : -1;
        await page.keyboard.press(key);
      }
      expect(expectedIndex).toBe(key === 'Tab' ? count : -1);
    }
    await completeDemo(r, demo.slug);
    await r.getByRole('button', { name: 'Reset', exact: true }).click();
    expect(await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }))).toBe(before);
    expect(await page.evaluate(() => (window as unknown as { demoWrites: string[] }).demoWrites)).toEqual([]);
  });
  test(`${demo.slug} actual implementation chunk failure and independent poster failure preserve native shell`, async ({ browser }) => {
    const discovery = await browser.newContext(); const unexpected = await localOnly(discovery);
    const page = await discovery.newPage(); const chunks: { path: string; body: Promise<string> }[] = [];
    page.on('response', response => { if (response.request().resourceType() === 'script' && response.ok()) chunks.push({ path: new URL(response.url()).pathname, body: response.text() }); });
    await openDemo(page, demo.slug); await page.waitForLoadState('networkidle');
    const bodies = await Promise.all(chunks.map(async chunk => ({ path: chunk.path, body: await chunk.body })));
    const implementation = bodies.find(chunk => chunk.body.includes(demo.marker)); expect(implementation, 'actual implementation-containing response').toBeTruthy();
    expect(unexpected).toEqual([]); await discovery.close();
    for (const failure of ['chunk', 'poster']) {
      const context = await browser.newContext({ baseURL: 'http://localhost:3100' }); const blocked = await localOnly(context); const p = await context.newPage(); let failedRequests = 0;
      await p.route(failure === 'chunk' ? `**${implementation!.path}` : `**/work/${demo.slug}/overview.webp`, route => { failedRequests++; return route.abort('failed'); });
      await p.goto(`/work/${demo.slug}`); await p.locator('[data-demo-enhancement]').scrollIntoViewIfNeeded();
      if (failure === 'chunk') { await expect(p.locator('[data-demo-enhancement]')).toContainText('Interactive controls could not load'); await expect(p.locator('[data-demo-enhancement] button')).toHaveCount(0); }
      else { await expect(p.locator('[data-project-media] figcaption').first()).toBeVisible(); expect(await p.locator('[data-project-media] img').first().evaluate(e => (e as HTMLImageElement).naturalWidth)).toBe(0); }
      await expect(p.locator('[data-case-study-section="workflow"]')).toBeVisible();
      expect(failedRequests).toBeGreaterThan(0); await expect(p.locator('[data-demo-reload]')).toHaveAttribute('href', `/work/${demo.slug}`);
      const response = p.waitForResponse(response => response.request().isNavigationRequest() && new URL(response.url()).pathname === `/work/${demo.slug}`);
      await p.locator('[data-demo-reload]').click(); expect((await response).status()).toBe(200);
      expect(blocked).toEqual([]); await context.close();
    }
  });
  test(`${demo.slug} full static walkthrough and first frame without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://localhost:3100' }); const unexpected = await localOnly(context); const page = await context.newPage();
    await page.goto(`/work/${demo.slug}`); await expect(page.locator('[data-demo-shell]')).toBeVisible();
    await expect(page.locator('[data-demo-enhancement] button')).toHaveCount(0);
    const workflow = page.locator('[data-case-study-section="workflow"]'); await expect(workflow).toBeVisible();
    const record = projectRecords.find(record => record.slug === demo.slug)!;
    if (record.kind !== 'flagship' || record.caseStudy?.publication !== 'published') throw Error('Expected approved story');
    const walkthroughs = record.caseStudy.story.workflow.walkthroughs;
    expect(walkthroughs.length).toBe({vora:3,prism:1,'agent-team':3,'agent-config':2,'control-center':2}[demo.slug]);
    for (const walkthrough of walkthroughs) {
      await expect(workflow.locator(`[id="${demo.slug}-${walkthrough.id}"]`)).toBeVisible();
      for (const step of walkthrough.steps) await expect(workflow.getByText(step, { exact: true })).toBeVisible();
    }
    expect(await workflow.evaluate(el => el.closest('[data-demo-enhancement]'))).toBeNull();
    await expect(page.locator('[data-demo-reload]')).toHaveAttribute('href', `/work/${demo.slug}`); expect(unexpected).toEqual([]); await context.close();
  });
}

test('actual shared enhancement recovers from a rendered child throwing', async ({ page }, info) => {
  // Next development asks for stack frames after this intentional error. Abort and record it separately.
  const diagnostics: string[] = [];
  if (process.env.SHOWCASE_SERVER !== 'production') await page.route('**/__nextjs_original-stack-frames', route => { diagnostics.push(`${route.request().method()} ${new URL(route.request().url()).pathname}`); return route.abort('blockedbyclient'); });
  const compiled = await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import Demo from './components/work/DemoEnhancement'; const load=async()=>({default:()=>{throw Error('Purpose-written render failure')}}); createRoot(document.getElementById('throw-fixture')).render(<Demo load={load} componentProps={{}}/>);`, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, outfile: '/tmp/showcase-render-fixture.js', format: 'iife', loader: { '.css': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
  await page.goto('/work/vora');
  await page.locator('[data-demo-enhancement]').evaluate(el => { const fixture = document.createElement('div'); fixture.id = 'throw-fixture'; el.replaceWith(fixture); });
  await page.addStyleTag({ content: compiled.outputFiles.find(file => file.path.endsWith('.css'))?.text ?? '' }); await page.addScriptTag({ content: compiled.outputFiles.find(file => file.path.endsWith('.js'))!.text }); await page.locator('#throw-fixture').scrollIntoViewIfNeeded();
  await expect(page.locator('#throw-fixture')).toContainText('Interactive controls are unavailable'); await expect(page.locator('#throw-fixture button')).toHaveCount(0);
  await expect(page.locator('[data-demo-shell]')).toBeVisible(); await expect(page.locator('[data-case-study-section="workflow"]')).toBeVisible();
  await page.locator('[data-demo-reload]').click(); await expect(page.locator('main h1')).toHaveText('Vora');
  await info.attach('framework-diagnostics', { body: JSON.stringify(diagnostics), contentType: 'application/json' });
  expect(diagnostics.every(value => value === 'POST /__nextjs_original-stack-frames')).toBe(true);
});

test('Reset directly clears every Vora phase, open Prism receipt, stale Config output and Center selection', async ({ page }) => {
  let r = await openDemo(page, 'vora');
  const click = (name: string) => r.getByRole('button', { name, exact: true }).click();
  for (const outcome of ['Succeeds', 'Fails']) for (const phase of ['request','pending','approved','rejected','result']) {
    await click(outcome);
    if(phase!=='request') await click('Review proposed action');
    if(['approved','result'].includes(phase)) await click('Approve example');
    if(phase==='rejected') await click('Reject example');
    if(phase==='result') await click('Show sample result');
    await click('Reset'); await expect(r.getByRole('heading',{name:'Request received',exact:true})).toBeFocused();
    await expect(r.getByRole('button',{name:'Succeeds',exact:true})).toHaveAttribute('aria-pressed','true');
  }
  r = await openDemo(page,'prism'); await completeDemo(r,'prism'); await click('Reset');
  await expect(r.getByRole('heading',{name:'Ready to start'})).toBeFocused(); await expect(r.getByRole('region',{name:'Prism result'})).toHaveCount(0);
  await expect(r.getByRole('button',{name:'Close receipt',exact:true})).toHaveCount(0);
  r = await openDemo(page,'agent-config');
  for(const variant of ['Brief','Detailed']) { await click(variant); await click('Show stale output'); await click('Reset'); await expect(r).not.toContainText('Out of date'); await expect(r.getByRole('button',{name:'Brief',exact:true})).toHaveAttribute('aria-pressed','true'); }
  r = await openDemo(page,'control-center');
  for(const scenario of ['Succeeds','Fails']) for(const filter of ['Show all','Needs attention']) {
    await click(scenario); await click(filter); await r.getByRole('button',{name:/demo-console\.example/}).click(); await click('Reset');
    await expect(r.locator('[data-center-state]')).toHaveText('Succeeds, Started, Show all: 1 run and 1 decision visible.');
    await expect(r.getByRole('region',{name:'demo-console.example deployment detail'})).toHaveCount(0);
  }
});

test('Team stage details reset at every reachable stage and retry history retains failed assertion debugger change and pass', async ({ page }) => {
  const r=await openDemo(page,'agent-team');
  for(const scenario of ['Passes review','QA retry','Security block']) for(let stage=0;stage<(scenario==='Security block'?3:5);stage++) {
    await r.getByRole('button',{name:scenario,exact:true}).click();
    await r.getByRole('list',{name:'Run stages'}).getByRole('button').nth(stage).click();
    await r.getByRole('button',{name:'Show stage details',exact:true}).click();
    await expect(r.getByRole('heading',{name:'Stage details',exact:true})).toBeVisible();
    if(scenario==='QA retry'&&stage===4) { const history=r.getByRole('heading',{name:'Retained QA attempt history'}).locator('..'); await expect(history).toContainText('fail'); await expect(history).toContainText('pass'); await expect(history).toContainText('Change:'); }
    await r.getByRole('button',{name:'Reset',exact:true}).click();
    await expect(r.getByRole('heading',{name:'Stage details',exact:true})).toHaveCount(0);
    await expect(r.getByRole('heading',{name:'Task',exact:true})).toBeFocused();
  }
});
