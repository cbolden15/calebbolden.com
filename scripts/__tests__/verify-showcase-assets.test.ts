import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { richRecord, releaseManifest, fixtureBytes } from '../../lib/work/__tests__/samples';
import type { EvidenceManifest } from '../../lib/work/types';
import { verifyShowcaseAssets } from '../verify-showcase-assets.mjs';

const roots: string[] = [];
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function put(root: string, path: string, bytes: string | Buffer) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
}
async function candidate(format: 'png' | 'jpeg' | 'webp' | 'avif' = 'webp') {
  const root = mkdtempSync(join(tmpdir(), 'showcase-gate-')); roots.push(root);
  const bytes = await sharp({ create: { width: 32, height: 20, channels: 3, background: '#296f96' } }).toFormat(format).toBuffer();
  const record = richRecord('vora'); record.related = [];
  const manifest = structuredClone({ version: 1, snapshots: [releaseManifest.snapshots[0]] }) as EvidenceManifest;
  const media = manifest.snapshots[0].media[0];
  Object.assign(media, { path: `public/work/vora/overview.${format}`, sha256: digest(bytes), mediaType: `image/${format}`, width: 32, height: 20 });
  if (record.caseStudy?.publication !== 'published') throw new Error('Expected rich record');
  Object.assign(record.caseStudy.evidence[0], { src: media.path.slice(6), width: 32, height: 20 });
  put(root, media.path, bytes); put(root, 'lib/work/fixtures/vora.json', fixtureBytes('vora'));
  put(root, 'app/work/vora/page.tsx', 'export default function Page() {}');
  const save = () => put(root, 'showcase-evidence.manifest.json', JSON.stringify(manifest));
  save();
  return { root, record, manifest, media, save, run: () => verifyShowcaseAssets({ root, records: [record] }) };
}

describe('production showcase asset gate', () => {
  it('accepts the empty manifest and absent tree, ignoring unrelated public files', async () => {
    const c = await candidate();
    rmSync(join(c.root, 'public/work'), { recursive: true });
    put(c.root, 'public/existing.svg', '<svg />');
    put(c.root, 'showcase-evidence.manifest.json', JSON.stringify({ version: 1, snapshots: [] }));
    await expect(verifyShowcaseAssets({ root: c.root, records: [] })).resolves.toMatchObject({ media: 0, fixtures: 0 });
  });
  for (const format of ['png', 'jpeg', 'webp', 'avif'] as const) {
    it(`decodes and accepts real ${format}`, async () => { const c = await candidate(format); await expect(c.run()).resolves.toMatchObject({ media: 1, fixtures: 1 }); });
  }
  it('requires an actual route file', async () => { const c = await candidate(); rmSync(join(c.root, 'app/work/vora/page.tsx')); await expect(c.run()).rejects.toThrow(/route/i); });
  it('rejects unlisted public files', async () => { const c = await candidate(); put(c.root, 'public/work/vora/extra.png', 'extra'); await expect(c.run()).rejects.toThrow(/unexpected|unrequired/i); });
  it('rejects missing media', async () => { const c = await candidate(); rmSync(join(c.root, c.media.path)); await expect(c.run()).rejects.toThrow(/missing|ENOENT/i); });
  it('rejects stale media bytes', async () => { const c = await candidate(); put(c.root, c.media.path, 'changed'); await expect(c.run()).rejects.toThrow(/digest/i); });
  it('hashes the full fixture including trailing bytes', async () => { const c = await candidate(); put(c.root, 'lib/work/fixtures/vora.json', Buffer.concat([fixtureBytes('vora'), Buffer.from(' ')])); await expect(c.run()).rejects.toThrow(/digest/i); });
  it('checks even inactive snapshot attestations', async () => { const c = await candidate(); c.record.caseStudy = { publication: 'draft' }; put(c.root, 'lib/work/fixtures/vora.json', 'changed'); await expect(c.run()).rejects.toThrow(/digest/i); });
  it('rejects approved but draft-only public media', async () => { const c = await candidate(); c.record.caseStudy = { publication: 'draft' }; await expect(c.run()).rejects.toThrow(/unexpected|unrequired/i); });
  it('rejects path escapes', async () => { const c = await candidate(); c.media.path = 'public/work/../escape.webp'; c.save(); await expect(c.run()).rejects.toThrow(); });
  for (const location of ['media', 'directory', 'public', 'fixture'] as const) {
    it(`rejects a symlink at ${location}`, async () => {
      const c = await candidate();
      const path = location === 'media' ? c.media.path : location === 'directory' ? 'public/work/vora' : location === 'public' ? 'public' : 'lib/work/fixtures/vora.json';
      const target = join(c.root, path); const replacement = join(c.root, 'link-target');
      if (location === 'media' || location === 'fixture') put(c.root, 'link-target', 'bytes'); else mkdirSync(replacement);
      rmSync(target, { recursive: true }); symlinkSync(replacement, target);
      await expect(c.run()).rejects.toThrow(/symlink/i);
    });
  }
  for (const content of ['<!doctype html><script>alert(1)</script>', '<svg xmlns="http://www.w3.org/2000/svg"/>', '<?xml version="1.0"?><x/>', '{"download":true}']) {
    it(`rejects renamed active/document content: ${content.slice(0, 12)}`, async () => { const c = await candidate(); const bytes = Buffer.from(content); put(c.root, c.media.path, bytes); c.media.sha256 = digest(bytes); c.save(); await expect(c.run()).rejects.toThrow(/signature|format|decode/i); });
  }
  it('rejects MIME versus extension mismatch', async () => { const c = await candidate(); c.media.mediaType = 'image/png'; c.save(); await expect(c.run()).rejects.toThrow(/MIME/i); });
  it('rejects valid images renamed to another format', async () => { const c = await candidate(); const bytes = await sharp({ create: { width: 32, height: 20, channels: 3, background: '#ffffff' } }).png().toBuffer(); put(c.root, c.media.path, bytes); c.media.sha256 = digest(bytes); c.save(); await expect(c.run()).rejects.toThrow(/signature|format/i); });
  it('rejects truncated raster files even with a valid signature and digest', async () => { const c = await candidate('png'); const bytes = Buffer.from('89504e470d0a1a0a0000000d4948445200000020000000140802000000', 'hex'); put(c.root, c.media.path, bytes); c.media.sha256 = digest(bytes); c.save(); await expect(c.run()).rejects.toThrow(/decode/i); });
  it('rejects decoded dimensions that disagree with review', async () => { const c = await candidate(); c.media.width = 33; if (c.record.caseStudy?.publication === 'published') c.record.caseStudy.evidence[0].width = 33; c.save(); await expect(c.run()).rejects.toThrow(/dimension/i); });
  for (const format of ['mp4', 'webm'] as const) {
    it(`fully decodes real ${format} and rejects a truncated replacement`, async () => {
      const c = await candidate(); const path = `public/work/vora/clip.${format}`;
      execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-f', 'lavfi', '-i', 'color=c=blue:s=32x20:d=0.12', '-c:v', format === 'mp4' ? 'libx264' : 'libvpx-vp9', '-y', join(c.root, path)], { timeout: 30_000 });
      const { readFileSync } = await import('node:fs'); const bytes = readFileSync(join(c.root, path));
      c.manifest.snapshots[0].media.push({ path, sha256: digest(bytes), mediaType: `video/${format}`, width: 32, height: 20 });
      if (c.record.caseStudy?.publication !== 'published') throw new Error('Expected rich');
      c.record.caseStudy.evidence.push({ kind: 'video', src: path.slice(6), poster: c.media.path.slice(6), snapshotId: 'vora-sample', width: 32, height: 20, alt: 'Synthetic clip', caption: 'Synthetic clip', transcript: 'A blue frame.', captions: [{ start: 0, end: 0.1, text: 'A blue frame.' }] });
      c.save(); await expect(c.run()).resolves.toMatchObject({ media: 2 });
      const truncated = bytes.subarray(0, 48); put(c.root, path, truncated); c.manifest.snapshots[0].media[1].sha256 = digest(truncated); c.save();
      await expect(c.run()).rejects.toThrow(/decode|signature/i);
    });
  }
});
