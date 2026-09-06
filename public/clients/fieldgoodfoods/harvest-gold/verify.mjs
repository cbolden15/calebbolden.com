import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'design-directions/harvest-gold/index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'design-directions/harvest-gold/style.css'), 'utf8');
const sealCss = fs.readFileSync(path.join(root, 'design-directions/harvest-gold/brand-seal.css'), 'utf8');
const contentSource = fs.readFileSync(path.join(root, 'design-directions/shared/content.js'), 'utf8');
const directionDir = path.join(root, 'design-directions/harvest-gold');
const sandbox = { window: {} };
vm.runInNewContext(contentSource, sandbox);
const FGF = sandbox.window.FGF;

for (const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
  new vm.Script(script[1]);
}
for (const asset of html.matchAll(/(?:src|poster|href)="(\.\.?\/[^"#?]+)"/g)) {
  assert.ok(fs.existsSync(path.resolve(directionDir, asset[1])), 'Missing local asset: ' + asset[1]);
}

const expectedChapters = [
  ['I', 'Pasture', 'pasture', 'Our Story'],
  ['II', 'The Craft', 'craft', 'Price List'],
  ['III', 'The Box', 'box', 'Shop Packages'],
  ['IV', 'Your Kitchen', 'kitchen', 'Gallery'],
];

assert.equal(FGF.tagline, 'Made by Nature, Not by Man!');
for (const [number, label, id, page] of expectedChapters) {
  assert.match(html, new RegExp('id="' + id + '"[^>]*data-chapter="' + number + '"[^>]*data-chapter-label="' + label + '"'));
  assert.match(html, new RegExp('href="#' + id + '"><span class="nav__chapter"[^>]*>' + number + '</span><span class="nav__name">' + page + '</span>'));
}

for (const key of ['tagline', 'heroTagline', 'storyExcerpt', 'promise']) {
  assert.match(html, new RegExp('data-fgf="' + key + '"|data-fgf-hero-(?:lead|rest)'));
}
assert.match(html, /data-fgf-list="differentiators"/);
assert.match(html, /FGF\.packages\.slice\(0, 3\)/);
assert.match(html, /var packageImages = \{/);

const packageSlugs = FGF.packages.slice(0, 3).map((pkg) => pkg.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
for (const slug of packageSlugs) {
  assert.match(html, new RegExp("'" + slug + "':"));
  assert.match(html, /\.\.\/shared\/boxes\/[a-z-]+\.webp/);
}

assert.match(html, /class="card__media package-card__media"/);
assert.match(css, /\.package-card__media\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3;/s);
assert.match(css, /\.package-card__media img\s*\{[^}]*object-fit:\s*contain;/s);

assert.match(css, /--harvest:\s*#f2c84b;/i);
assert.match(css, /--pasture:\s*#95c46b;/i);
assert.doesNotMatch(css, /hue-rotate/i);
const allowedHex = new Set(['#0b0a09', '#121110', '#14120f', '#95c46b', '#b8df8d', '#f2c84b', '#f5ebd8', '#ffe08a']);
for (const color of css.match(/#[0-9a-f]{6}/gi) || []) {
  assert.ok(allowedHex.has(color.toLowerCase()), 'Off-palette color: ' + color);
}
assert.match(css, /animation-timeline:\s*scroll\(root block\)/);
assert.match(html, /window\.scrollY\s*\/\s*scrollRange/);
assert.match(html, /observer\.unobserve\(entry\.target\)/);
assert.match(html, /dataset\.revealCount/);
assert.match(html, /desktopNavQuery\s*=\s*window\.matchMedia\('\(min-width: 901px\)'\)/);
assert.match(html, /navMenu\.open\s*=\s*desktopNavQuery\.matches/);

assert.match(html, /prefers-reduced-motion:\s*reduce/);
assert.match(html, /root\.dataset\.motion\s*=\s*'reduced'/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /\.journey-rail\s*\{\s*display:\s*none;/);
assert.match(css, /\.chapter\s*\{\s*--active-accent:\s*var\(--chapter-accent\);/);
assert.match(css, /\.js \.reveal\.is-in[\s\S]*?opacity:\s*1;[\s\S]*?transform:\s*none;/);

assert.equal((html.match(/sunrise-farm-seal-a\.svg/g) || []).length, 2);
assert.match(sealCss, /sunrise-farm-seal-a\.svg/);
assert.doesNotMatch(html + css + sealCss, /content\/assets\/generated|\.\.\/\.\.\/content/);
for (const logo of fs.readdirSync(path.join(root, 'design-directions/shared/logos'))) {
  const source = fs.readFileSync(path.join(root, 'design-directions/shared/logos', logo), 'utf8');
  assert.doesNotMatch(source, /<(?:script|metadata|foreignObject)\b|c2pa|xmp|javascript:|\son[a-z]+=/i);
}
assert.doesNotMatch(html + css, /#brxe-/);
assert.match(css, /overflow-x:\s*hidden/);

assert.match(css, /\.hero__brand img\s*\{[^}]*filter:/s);
assert.match(css, /\.footer__wordmark\s*\{[^}]*filter:/s);
assert.match(css, /transition:\s*\n\s*opacity 0\.6s var\(--ease-lux\)/);
assert.match(css, /--ease-lux:\s*cubic-bezier\(0\.22, 1, 0\.36, 1\)/);

const green = [149, 196, 107];
const yellow = [242, 200, 75];
const samples = [0, 0.17, 0.33, 0.5, 0.72, 1].map((progress) =>
  green.map((channel, index) => channel + (yellow[index] - channel) * progress)
);
for (const sample of samples) {
  const ratios = sample.map((channel, index) => (channel - green[index]) / (yellow[index] - green[index]));
  assert.ok(Math.max(...ratios) - Math.min(...ratios) < 1e-10);
}

console.log(JSON.stringify({
  status: 'PASS',
  canonicalCopyKeys: ['tagline', 'heroTagline', 'storyExcerpt', 'promise', 'differentiators', 'packages'],
  chapters: expectedChapters.map(([number, label]) => number + ' ' + label),
  packageSlugs,
  accentSamples: samples.map((rgb) => rgb.map((value) => Number(value.toFixed(3)))),
  reducedMotion: 'explicit JS and CSS fallbacks present',
}, null, 2));
