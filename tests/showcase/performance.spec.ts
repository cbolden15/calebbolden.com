import { gzipSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { test, expect } from './helpers';

for (const path of ['/work', '/work/vora', '/work/chapterhq', '/work/site-assistant']) {
  test(`cold-cache foundation route JavaScript measurement ${path}`, async ({ page }, testInfo) => {
    test.skip(process.env.SHOWCASE_SERVER !== 'production', 'Run after a separate production build; dev chunks are not a release budget baseline.');
    const scripts = new Map<string, Promise<{ path: string; bytes: number; gzipBytes: number }>>();
    page.on('response', response => {
      if (response.request().resourceType() !== 'script' || !response.ok()) return;
      const url = new URL(response.url());
      scripts.set(url.pathname, response.body().then(bytes => ({ path: url.pathname, bytes: bytes.length, gzipBytes: gzipSync(bytes).length })));
    });
    await page.goto(path, { waitUntil: 'networkidle' });
    const files = (await Promise.all(scripts.values())).sort((a, b) => a.path.localeCompare(b.path));
    expect(files.length).toBeGreaterThan(0);
    const measurement = { route: path, server: 'production', measurement: 'Fresh browser context per test; request routing disables HTTP cache. No navigation prewarm, scrolling, chat submission or demo activation. Capture script response bodies through initial network idle; recompress each separately with Node gzip defaults. This is route-shell JS, not incremental demo JS or wire transfer size.', files, totalBytes: files.reduce((sum, file) => sum + file.bytes, 0), totalGzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0) };
    const output = testInfo.outputPath('foundation-route-js.json');
    writeFileSync(output, JSON.stringify(measurement, null, 2));
    await testInfo.attach('foundation-route-js', { path: output, contentType: 'application/json' });
    console.log(JSON.stringify({ route: path, scripts: files.length, totalGzipBytes: measurement.totalGzipBytes }));
  });
}

test.skip('active demonstration adds at most 100KB gzip with documented exceptions @release', () => {
  // T12 compares the first real activation against a matched source-fixture shell build.
});
