import {artifact,responseArtifact} from './artifacts';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { build } from 'esbuild';
import { test, expect } from './helpers';
import { demos, openDemo } from './demo-cases';
const marker: Record<string, string> = { vora: 'My kitchen tap is dripping. Could someone come by this week?', prism: 'Count the words in: one two three', 'agent-team': 'Task: keep a retry banner visible after the next successful check.', 'agent-config': 'Keep routine answers concise.', 'control-center': 'worker-example-01' };
const walk = (path: string): string[] => readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(path, entry.name)) : [join(path, entry.name)]);

test('approved media bytes MIME signature decode and exact public inventory', async ({ page }, info) => {
  const manifest = JSON.parse(readFileSync('showcase-evidence.manifest.json', 'utf8'));
  const measured = [];
  for (const snapshot of manifest.snapshots) for (const media of snapshot.media) {
    const response = await page.request.get(media.path.replace(/^public/, '')); expect(response.status()).toBe(200);
    const body = await response.body(); expect(createHash('sha256').update(body).digest('hex')).toBe(media.sha256);
    expect(response.headers()['content-type']).toContain('image/webp'); expect(body.subarray(0, 4).toString()).toBe('RIFF'); expect(body.subarray(8, 12).toString()).toBe('WEBP');
    const metadata = await sharp(body).metadata(); await sharp(body).raw().toBuffer(); expect(metadata.width).toBe(media.width); expect(metadata.height).toBe(media.height); expect(body.length).toBeLessThanOrEqual(250000);
    measured.push({ url:response.url(),status:response.status(),headers:response.headers(),path: media.path, bytes: body.length, width: metadata.width, height: metadata.height, sha256: media.sha256 });
  }
  expect(walk('public/work').sort()).toEqual(measured.map(m => m.path).sort());
  await artifact(info,'approved-media',measured);
});

test('all emitted client chunks exclude authored data, private imports and raw downloads', async ({ page }, info) => {
  test.skip(process.env.SHOWCASE_SERVER !== 'production', 'Production emitted chunks only.');
  const graph = await build({ entryPoints: walk('components/work').filter(file => file.endsWith('.tsx') && readFileSync(file, 'utf8').startsWith("'use client'")), bundle: true, write: false, outdir: '/tmp/showcase-unused-output', metafile: true, loader: { '.css': 'empty' } });
  for (const input of Object.keys(graph.metafile!.inputs)) expect(input).not.toMatch(/lib\/work\/(?:catalog|projects|fixtures)|consulting\/research/);
  await artifact(info,'client-import-graph',graph.metafile!.inputs);
  const files = walk('.next/static').filter(file => file.endsWith('.js'));
  const scanned = [];
  for (const file of files) {
    const body = readFileSync(file, 'utf8');
    expect(body, file).not.toMatch(/consulting\/research|lib\/work\/projects\/|\/Users\/caleb/);
    for (const value of Object.values(marker)) expect(body, `${file}: authored value`).not.toContain(value);
    scanned.push({ file, sha256: createHash('sha256').update(body).digest('hex'), bytes: Buffer.byteLength(body) });
  }
  for (const slug of demos.map(d => d.slug)) for (const path of [`/lib/work/fixtures/${slug}.json`, `/work/${slug}/fixture.json`, `/work/${slug}.json`]) expect((await page.request.get(path)).status(), path).toBe(404);
  await artifact(info,'every-emitted-client-chunk',scanned);
});

for (const route of ['/', '/work', '/how-i-build', ...demos.map(d => `/work/${d.slug}`)]) test(`HTML RSC and loaded client fixture isolation ${route}`, async ({ page }, info) => {
  const scripts: Promise<{ path: string; body: string }>[] = [];
  page.on('response', response => { if (response.request().resourceType() === 'script' && response.ok()) scripts.push(response.text().then(body => ({ path: new URL(response.url()).pathname, body }))); });
  const response = await page.goto(route, { waitUntil: 'networkidle' }); expect(response?.status()).toBe(200);
  const html = await response!.text(); const rsc = await page.request.get(`${route}?_rsc=showcase-boundary`, { headers: { RSC: '1' } }); const payload = await rsc.text();
  expect(rsc.status()).toBe(200); expect(rsc.headers()['content-type']).toContain('text/x-component');
  const selected = demos.find(d => route === `/work/${d.slug}`);
  if (selected) { await openDemo(page, selected.slug); await page.waitForLoadState('networkidle'); }
  for (const [slug, value] of Object.entries(marker)) if (slug !== selected?.slug) { expect(html).not.toContain(value); expect(payload).not.toContain(value); }
  if (selected) expect(html).toContain(marker[selected.slug]);
  for (const text of [html, payload]) if (process.env.SHOWCASE_SERVER === 'production') expect(text).not.toMatch(/SYNTHETIC_PRIVATE_SENTINEL|\/Users\/|consulting\/research/);
  const files = await Promise.all(scripts);
  for (const { path, body } of files) {
    for (const value of Object.values(marker)) expect(body, path).not.toContain(value);
    for (const demo of demos) if (demo.slug !== selected?.slug) expect(body, `${path}: other implementation`).not.toContain(demo.marker);
  }
  const saved=[];
  for(const [name,actual] of [['html',response!],['rsc',rsc]] as const) saved.push(await responseArtifact(info,name,await actual.body(),{route,url:actual.url(),status:actual.status(),headers:actual.headers(),request:{method:'GET',rsc:name==='rsc'}}));
  await artifact(info,'response-boundary',{route,responses:saved,scripts:files.map(f=>({path:f.path,sha256:createHash('sha256').update(f.body).digest('hex')}))});
});
