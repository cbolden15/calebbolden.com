import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { projectRecords } from '../lib/work/catalog.ts';
import { validateEvidenceDigests } from '../lib/work/evidence.ts';
import { collectRequiredShowcaseAssets, validateProjectGraph } from '../lib/work/publication.ts';

// Inspect every path component before following it, including public/ and fixture parents.
function safePath(root, path, optional = false) {
  const full = resolve(root, path);
  const rel = relative(root, full);
  if (isAbsolute(path) || rel === '..' || rel.startsWith(`..${sep}`)) throw new Error(`Path escapes repository: ${path}`);
  let current = root;
  const parts = rel.split(sep);
  for (let i = 0; i < parts.length; i++) {
    current = resolve(current, parts[i]);
    let stat;
    try { stat = lstatSync(current); } catch (error) {
      if (optional && error.code === 'ENOENT') return null;
      throw new Error(`Missing asset/path: ${path}`, { cause: error });
    }
    if (stat.isSymbolicLink()) throw new Error(`Symlink is forbidden: ${path}`);
    if (i < parts.length - 1 && !stat.isDirectory()) throw new Error(`Not a directory: ${path}`);
  }
  return full;
}

function treeFiles(root, path) {
  const full = safePath(root, path, true);
  if (!full) return [];
  const stat = lstatSync(full);
  if (stat.isFile()) return [path];
  if (!stat.isDirectory()) throw new Error(`Not a regular file or directory: ${path}`);
  return readdirSync(full).sort().flatMap(name => treeFiles(root, `${path}/${name}`));
}

function fileBytes(root, path) {
  const full = safePath(root, path);
  if (!lstatSync(full).isFile()) throw new Error(`Not a regular file: ${path}`);
  return readFileSync(full);
}

function isoBrands(bytes) {
  if (bytes.length < 16 || bytes.toString('ascii', 4, 8) !== 'ftyp') return [];
  const end = bytes.readUInt32BE(0);
  if (end < 16 || end > bytes.length || end % 4) return [];
  const brands = [bytes.toString('ascii', 8, 12)];
  for (let offset = 16; offset < end; offset += 4) brands.push(bytes.toString('ascii', offset, offset + 4));
  return brands;
}

// EBML DocType must actually be webm (Matroska shares its outer magic bytes).
function isWebm(bytes) {
  if (!bytes.subarray(0, 4).equals(Buffer.from('1a45dfa3', 'hex'))) return false;
  function vint(offset, stripMarker) {
    const first = bytes[offset];
    if (!first) throw new Error('Invalid EBML integer');
    let size = 1;
    while (size <= 8 && !(first & (1 << (8 - size)))) size++;
    if (size > 8 || offset + size > bytes.length) throw new Error('Truncated EBML integer');
    let value = stripMarker ? first & ((1 << (8 - size)) - 1) : first;
    for (let i = 1; i < size; i++) value = value * 256 + bytes[offset + i];
    return { value, size };
  }
  try {
    const header = vint(4, true);
    const end = 4 + header.size + header.value;
    if (end > bytes.length) return false;
    for (let offset = 4 + header.size; offset < end;) {
      const id = vint(offset, false); offset += id.size;
      const length = vint(offset, true); offset += length.size;
      if (offset + length.value > end) return false;
      if (id.value === 0x4282) return bytes.toString('ascii', offset, offset + length.value) === 'webm';
      offset += length.value;
    }
  } catch { return false; }
  return false;
}

function matchesSignature(bytes, mime) {
  switch (mime) {
    case 'image/png': return bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
    case 'image/jpeg': return bytes.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'));
    case 'image/webp': return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
    case 'image/avif': return isoBrands(bytes).some(brand => brand === 'avif' || brand === 'avis');
    case 'video/mp4': return isoBrands(bytes).some(brand => ['isom', 'iso2', 'iso4', 'iso5', 'iso6', 'mp41', 'mp42', 'avc1', 'dash'].includes(brand)) && !isoBrands(bytes).some(brand => ['avif', 'avis', 'heic', 'mif1'].includes(brand));
    case 'video/webm': return isWebm(bytes);
    default: return false;
  }
}

async function verifyMedia(root, asset) {
  const bytes = fileBytes(root, asset.path);
  if (!matchesSignature(bytes, asset.mediaType)) throw new Error(`Media signature/format mismatch: ${asset.path}`);
  let width, height;
  try {
    if (asset.mediaType.startsWith('image/')) {
      const image = sharp(bytes, { failOn: 'warning', limitInputPixels: 100_000_000 });
      const metadata = await image.metadata();
      const expected = { 'image/png': 'png', 'image/jpeg': 'jpeg', 'image/webp': 'webp', 'image/avif': 'heif' }[asset.mediaType];
      if (metadata.format !== expected || (expected === 'heif' && metadata.compression !== 'av1')) throw new Error('Decoded format does not match MIME');
      // metadata() alone succeeds for several truncated files. Decode every pixel.
      const decoded = await image.raw().toBuffer({ resolveWithObject: true });
      width = decoded.info.width; height = decoded.info.height;
    } else {
      const full = safePath(root, asset.path);
      const options = { timeout: 30_000, maxBuffer: 10 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] };
      const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', full], options));
      const video = probe.streams?.find(stream => stream.codec_type === 'video');
      if (!video || !(Number(video.nb_read_frames) > 0) || !probe.format?.format_name?.includes(asset.mediaType === 'video/mp4' ? 'mp4' : 'webm')) throw new Error('Decoded container is not the reviewed video type');
      // A container header is insufficient: decode all video/audio streams to the end.
      execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-xerror', '-err_detect', 'explode', '-i', full, '-map', '0:v', '-map', '0:a?', '-f', 'null', '-'], options);
      width = video.width; height = video.height;
    }
  } catch (error) { throw new Error(`Media decode failed: ${asset.path}: ${error.message}`, { cause: error }); }
  if (width !== asset.width || height !== asset.height) throw new Error(`Decoded dimensions disagree: ${asset.path}`);
}

/** Read-only filesystem adapter. Tests supply an isolated candidate; CLI always uses the real catalog. */
export async function verifyShowcaseAssets({ root = resolve(dirname(fileURLToPath(import.meta.url)), '..'), records = projectRecords } = {}) {
  root = realpathSync(root);
  const manifest = validateEvidenceDigests(JSON.parse(fileBytes(root, 'showcase-evidence.manifest.json').toString('utf8')), path => fileBytes(root, path));
  const routePaths = treeFiles(root, 'app/work').filter(path => /\/page\.(tsx|ts|jsx|js)$/.test(path)).map(path => `/${path.slice(4).replace(/\/page\.(tsx|ts|jsx|js)$/, '')}`);
  validateProjectGraph(records, manifest, routePaths);
  const required = collectRequiredShowcaseAssets(records, manifest);
  const expected = new Set(required.filter(asset => asset.path.startsWith('public/work/')).map(asset => asset.path));
  const actual = new Set(treeFiles(root, 'public/work'));
  for (const path of actual) if (!expected.has(path)) throw new Error(`Unexpected/unrequired showcase file: ${path}`);
  for (const path of expected) if (!actual.has(path)) throw new Error(`Missing showcase media: ${path}`);
  const reviewed = new Map(manifest.snapshots.flatMap(snapshot => snapshot.media.map(asset => [asset.path, asset])));
  for (const asset of reviewed.values()) await verifyMedia(root, asset);
  return { media: expected.size, fixtures: required.filter(asset => asset.mediaType === 'application/json').length, snapshots: manifest.snapshots.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyShowcaseAssets().then(result => console.log(`Showcase assets verified: ${result.media} media, ${result.fixtures} fixtures, ${result.snapshots} snapshots.`)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
