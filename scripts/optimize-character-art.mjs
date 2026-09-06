// Re-encode the canonical artwork without changing its design. Generated files
// are committed so deployments need no image service or extra runtime package.
// Run with sharp available through NODE_PATH or installed locally.
import { createRequire } from 'node:module';
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const sharp = createRequire(import.meta.url)('sharp');
const directory = fileURLToPath(new URL('../public/art/characters/', import.meta.url));
let bytes = 0;
for (const name of (await readdir(directory)).filter((name) => name.endsWith('.png'))) {
  for (const width of [160, 512]) {
    const output = path.join(directory, name.replace(/\.png$/, `-${width}.webp`));
    await sharp(path.join(directory, name)).resize({ width }).webp({ quality: 86, alphaQuality: 100 }).toFile(output);
    bytes += (await stat(output)).size;
  }
}
console.log(`Prepared character thumbnails and phone portraits: ${(bytes / 1048576).toFixed(2)} MB total.`);
