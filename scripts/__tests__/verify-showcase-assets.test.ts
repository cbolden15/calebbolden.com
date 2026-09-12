import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
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
  it('accepts every intact animation frame using the reviewed per-frame dimensions, then rejects a corrupt later frame', async () => {
    const c = await candidate();
    const raw = Buffer.alloc(32 * 40 * 3);
    for (let pixel = 0; pixel < 32 * 40; pixel++) raw[pixel * 3 + (pixel < 32 * 20 ? 2 : 0)] = 255;
    const valid = await sharp(raw, { raw: { width: 32, height: 40, channels: 3, pageHeight: 20 } }).webp({ lossless: true, delay: [100, 100] }).toBuffer();
    expect((await sharp(valid, { animated: true }).metadata()).pages).toBe(2);
    put(c.root, c.media.path, valid); c.media.sha256 = digest(valid); c.save();
    await expect(c.run()).resolves.toMatchObject({ media: 1 });
    const damaged = Buffer.from(valid);
    const frames: { offset: number; size: number }[] = [];
    for (let offset = 12; offset + 8 < damaged.length;) {
      const size = damaged.readUInt32LE(offset + 4);
      if (damaged.toString('ascii', offset, offset + 4) === 'ANMF') frames.push({ offset, size });
      offset += 8 + size + size % 2;
    }
    expect(frames).toHaveLength(2);
    const second = frames[1];
    damaged.fill(0, second.offset + 8 + 16 + 8 + 5, second.offset + 8 + second.size);
    // The first frame still decodes; only a complete-frame gate catches this reviewed replacement.
    await expect(sharp(damaged).raw().toBuffer()).resolves.toBeInstanceOf(Buffer);
    put(c.root, c.media.path, damaged); c.media.sha256 = digest(damaged); c.save();
    await expect(c.run()).rejects.toThrow(/decode/i);
  });
  for (const format of ['png', 'avif'] as const) {
    it(`accepts animated ${format} and rejects a damaged later frame with a current digest`, async () => {
      const c = await candidate(format);
      const full = join(c.root, c.media.path);
      const codec = format === 'png' ? ['-f', 'apng', '-plays', '0'] : ['-c:v', 'libsvtav1', '-preset', '12', '-svtav1-params', 'lp=1', '-pix_fmt', 'yuv420p', '-f', 'avif'];
      if (format === 'avif') {
        c.media.width = c.media.height = 64;
        if (c.record.caseStudy?.publication === 'published') Object.assign(c.record.caseStudy.evidence[0], { width: 64, height: 64 });
      }
      execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-f', 'lavfi', '-i', `testsrc=size=${c.media.width}x${c.media.height}:rate=10:duration=0.2`, '-threads', '1', ...codec, '-y', full], { timeout: 30_000, stdio: ['ignore', 'pipe', 'pipe'] });
      const valid = readFileSync(full);
      c.media.sha256 = digest(valid); c.save(); await expect(c.run()).resolves.toMatchObject({ media: 1 });
      const damaged = Buffer.from(valid);
      if (format === 'png') {
        let found = false;
        for (let offset = 8; offset + 12 <= damaged.length;) {
          const size = damaged.readUInt32BE(offset);
          if (damaged.toString('ascii', offset + 4, offset + 8) === 'fdAT') { damaged.fill(0, offset + 12, offset + 8 + size); found = true; break; }
          offset += size + 12;
        }
        expect(found).toBe(true);
      } else {
        const { packets } = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_packets', '-show_entries', 'packet=pos,size', '-of', 'json', full], { timeout: 30_000, encoding: 'utf8' })) as { packets: { pos: string; size: string }[] };
        // AVIF may expose the first frame again as its still cover-image stream.
        expect(new Set(packets.map(packet => packet.pos)).size).toBe(2);
        const last = packets.at(-1)!;
        damaged.fill(0, Number(last.pos), Number(last.pos) + Number(last.size));
      }
      if (format === 'png') await expect(sharp(damaged).raw().toBuffer()).resolves.toBeInstanceOf(Buffer);
      put(c.root, c.media.path, damaged); c.media.sha256 = digest(damaged); c.save();
      await expect(c.run()).rejects.toThrow(/decode/i);
    });
  }
  it('bounds animation frame count before allocating the all-frame raster', async () => {
    const c = await candidate();
    const raw = Buffer.alloc(2 * 2 * 513 * 3);
    for (let pixel = 0; pixel < 2 * 2 * 513; pixel++) raw[pixel * 3 + Math.floor(pixel / 4) % 2] = 255;
    const bytes = await sharp(raw, { raw: { width: 2, height: 2 * 513, channels: 3, pageHeight: 2 } }).webp({ lossless: true, delay: Array(513).fill(100) }).toBuffer();
    expect((await sharp(bytes, { animated: true }).metadata()).pages).toBe(513);
    c.media.width = c.media.height = 2;
    if (c.record.caseStudy?.publication === 'published') Object.assign(c.record.caseStudy.evidence[0], { width: 2, height: 2 });
    put(c.root, c.media.path, bytes); c.media.sha256 = digest(bytes); c.save();
    await expect(c.run()).rejects.toThrow(/frame limit/i);
  });
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
