import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const [, , input, output, widthArg] = process.argv;
if (!input || !output || !output.endsWith('.webp')) {
  console.error('usage: node scripts/optimize-image.mjs <input> <output.webp> [maxWidth=1600]');
  process.exit(1);
}

const maxWidth = Number(widthArg ?? 1600);
await sharp(input)
  .rotate()
  .resize({ width: maxWidth, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(output);

const { size } = await stat(output);
console.log(`${output}: ${Math.round(size / 1024)}KB`);
