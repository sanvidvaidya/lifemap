import { cp, mkdir, readdir } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const distDir = new URL('./dist/', projectRoot);
const clientDir = new URL('./client/', distDir);
const serverDir = new URL('./server/', distDir);

await mkdir(clientDir, { recursive: true });

for (const entry of await readdir(distDir, { withFileTypes: true })) {
  if (entry.name === 'client' || entry.name === 'server') continue;

  await cp(new URL(`./${entry.name}`, distDir), new URL(`./${entry.name}`, clientDir), {
    recursive: entry.isDirectory(),
  });
}

await mkdir(serverDir, { recursive: true });
await cp(new URL('./server/index.js', projectRoot), new URL('./index.js', serverDir));
