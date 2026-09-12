import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { test, expect } from './helpers';
import { demos, completeDemo } from './demo-cases';

for (const { slug } of demos) test(`matched cold-cache eager plus interaction JavaScript ${slug}`, async ({ page }, info) => {
  test.skip(process.env.SHOWCASE_SERVER !== 'production', 'Production byte comparison only.');
  expect(process.versions.node).toBe('22.21.0'); expect(process.versions.zlib).toBe('1.3.1-470d3a2');
  const responses: Promise<{ path: string; sha256: string; bytes: number; gzipBytes: number }>[] = [];
  page.on('response', response => { if (response.request().resourceType() === 'script' && response.ok()) responses.push(response.body().then(body => ({ path: new URL(response.url()).pathname, sha256: createHash('sha256').update(body).digest('hex'), bytes: body.length, gzipBytes: gzipSync(body).length }))); });
  await page.goto(`/work/${slug}`, { waitUntil: 'networkidle' });
  const eager = await Promise.all(responses);
  if (process.env.SHOWCASE_MEASURE !== 'shell') {
    await page.locator('[data-demo-enhancement]').scrollIntoViewIfNeeded();
    const r = page.locator('[data-demo-enhancement] > div[data-ready] > section'); await expect(r).toBeVisible(); await completeDemo(r, slug);
  } else await page.locator('[data-demo-shell]').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  const files = [...new Map((await Promise.all(responses)).map(file => [file.sha256, file])).values()];
  const total = files.reduce((sum, file) => sum + file.gzipBytes, 0);
  const baseline = process.env.SHOWCASE_BASELINES ? JSON.parse(readFileSync(`${process.env.SHOWCASE_BASELINES}/${slug}.json`, 'utf8')).total : null;
  const measurement = { source: process.env.SHOWCASE_SOURCE_SHA, buildId: readFileSync('.next/BUILD_ID', 'utf8').trim(), node: process.versions.node, zlib: process.versions.zlib, slug, mode: process.env.SHOWCASE_MEASURE ?? 'candidate', eager: [...new Map(eager.map(f => [f.sha256, f])).values()].reduce((sum, f) => sum + f.gzipBytes, 0), total, baseline, added: baseline === null ? null : total - baseline, files };
  const path = info.outputPath(`${slug}.json`); writeFileSync(path, JSON.stringify(measurement, null, 2)); await info.attach('unique-js', { path, contentType: 'application/json' });
  if (process.env.SHOWCASE_MEASUREMENT_DIR) { mkdirSync(process.env.SHOWCASE_MEASUREMENT_DIR, { recursive: true }); writeFileSync(`${process.env.SHOWCASE_MEASUREMENT_DIR}/${slug}.json`, JSON.stringify(measurement, null, 2)); }
  expect(files.length).toBeGreaterThan(0); if (baseline !== null) expect(total - baseline).toBeLessThanOrEqual(100000);
  console.log(JSON.stringify({ slug, total, baseline, added: measurement.added }));
});
