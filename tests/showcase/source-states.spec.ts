import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { test, expect } from './helpers';
const files = (path: string): string[] => readdirSync(path, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(path,e.name)) : [join(path,e.name)]);

test('fresh isolated source candidate has explicit HTTP body metadata catalog sitemap asset and all-chunk parity', async ({ page }, info) => {
  test.skip(!process.env.SHOWCASE_EXPECTATION, 'Executed only for an explicit isolated source build.');
  const expected = JSON.parse(readFileSync(process.env.SHOWCASE_EXPECTATION!, 'utf8'));
  const selectors = JSON.parse(readFileSync(process.env.SHOWCASE_EXPECTATION!.replace('expectation.json', 'selectors.json'), 'utf8'));
  const richVora = ['approved-rich','four-new-drafts'].includes(expected.state);
  const checks = [];
  for (const route of ['/', '/work', '/work?category=products', '/work?category=developer-tools', '/how-i-build', '/work/vora', '/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center', '/sitemap.xml']) {
    const draft = expected.state==='four-new-drafts' && expected.changed.some((s:string)=>route==='/work/'+s);
    const response = await page.goto(route); expect(response?.status(),route).toBe(draft ? 404 : 200);
    const html = await response!.text(); const rsc = route==='/sitemap.xml' ? null : await page.request.get(route+'?_rsc=source-state', {headers:{RSC:'1'}});
    for(const marker of expected.markers) { expect(html,route).not.toContain(marker); if(rsc) expect(await rsc.text(),route+' RSC').not.toContain(marker); }
    if(route==='/work/vora') {
      await expect(page.locator('[data-case-study-section]')).toHaveCount(richVora?5:0);
      if(!richVora) {
        const legacy = {body:await page.locator('main').textContent(),title:await page.title(),description:await page.locator('meta[name="description"]').getAttribute('content')};
        writeFileSync(join(dirname(process.env.SHOWCASE_EXPECTATION!), 'legacy-body.json'),JSON.stringify(legacy,null,2));
        if(process.env.SHOWCASE_LEGACY_REFERENCE) expect(legacy).toEqual(JSON.parse(readFileSync(process.env.SHOWCASE_LEGACY_REFERENCE,'utf8')));
 await expect(page.getByText('what it is',{exact:true})).toBeVisible(); await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/AI CRM|AI-native|AI-powered/); }
    }
    if(route==='/work') { await expect(page.locator('[data-work-card]')).toHaveCount(expected.counts[0]); for(const [category,count] of [['products',expected.counts[1]],['developer-tools',expected.counts[2]]]) { await page.goto('/work?category='+category); await expect(page.locator('[data-work-card]')).toHaveCount(count as number); } }
    if(route==='/work') {
      await page.goto('/work');
      const ordered = await page.locator('[data-work-card]').evaluateAll(cards=>cards.map(card=>card.getAttribute('data-work-card')));
      expect(ordered).toEqual(expected.state==='four-new-drafts'?['vora','chapterhq','site-assistant']:['vora','prism','agent-team','agent-config','control-center','chapterhq','site-assistant']);
      expect(ordered).toEqual([selectors.catalog[0].featured,...selectors.catalog[0].rows].filter(Boolean).map((card:{slug:string})=>card.slug));
    }
    if(route==='/') await expect(page.locator('[data-home-project]')).toHaveCount(expected.homeCount);
    if(route==='/how-i-build') await expect(page.locator('[data-method-project]')).toHaveCount(expected.methodCount);
    if(expected.state==='four-new-drafts' && !draft) for(const slug of expected.changed) { expect(html).not.toContain('href="/work/'+slug+'"'); if(route==='/sitemap.xml') expect(html).not.toContain('https://calebbolden.com/work/'+slug); }
    if(route==='/sitemap.xml') for(const path of selectors.paths) expect(html).toContain('https://calebbolden.com'+path);
    if (route.startsWith('/work/') && route !== '/work') {
      const selected = selectors.views.find((view: {slug:string}) => route === '/work/'+view.slug);
      if(selected.metadata) { await expect(page.locator('title')).toHaveText(selected.metadata.title); await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',selected.metadata.description); }
      else { await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content',/Draft .* authored boundary marker/); expect(selected.view.kind).toBe('not-found'); expect(draft).toBe(true); }
    }
    await info.attach(route.replaceAll('/', '_')+'-html.gz',{body:gzipSync(html),contentType:'application/gzip'});
    if(rsc) await info.attach(route.replaceAll('/', '_')+'-rsc.gz',{body:gzipSync(await rsc.body()),contentType:'application/gzip'});
    if(route.startsWith('/work/') && !draft && (route!=='/work/vora'||richVora)) {
      const expectedRelated = selectors.related.find((r:{slug:string})=>route==='/work/'+r.slug).links;
      expect(await page.locator('[data-case-study-section="continue"] a.type-display').evaluateAll(links=>links.map(a=>a.getAttribute('href')))).toEqual(expectedRelated.map((link:{destination:string})=>link.destination));
    }
    checks.push({route,status:response!.status(),htmlSha256:createHash('sha256').update(html).digest('hex'),rscStatus:rsc?.status()});
  }
  expect(selectors.catalog.map((c:{count:number})=>c.count)).toEqual(expected.counts);
  expect(selectors.home.length).toBe(expected.homeCount); expect(selectors.method.length).toBe(expected.methodCount);
  for (const slug of expected.changed) expect(selectors.assets.some((a:{path:string})=>a.path.includes('/'+slug+'/') || a.path.endsWith('/'+slug+'.json'))).toBe(false);
  const chunks=files('.next/static').filter(f=>f.endsWith('.js')); const chunkEvidence=[];
  for(const file of chunks) {const text=readFileSync(file,'utf8'); for(const marker of expected.markers) expect(text,file).not.toContain(marker); chunkEvidence.push({file,sha256:createHash('sha256').update(text).digest('hex')});}
  for(const url of [...expected.removedMedia,...['vora','prism','agent-team','agent-config','control-center'].flatMap(s=>['/lib/work/fixtures/'+s+'.json','/work/'+s+'/fixture.json'])]) { const response=await page.request.get(url); expect(response.status(),url).toBe(404); for(const marker of expected.markers) expect(await response.text(),url).not.toContain(marker); }
  await info.attach('source-state-proof',{body:JSON.stringify({expected,checks,chunkEvidence},null,2),contentType:'application/json'});
});
