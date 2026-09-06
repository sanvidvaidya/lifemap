import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { portraitAsset } from '../src/ui/portrait-assets';

describe('mobile portrait assets', () => {
  it('preserves deployment subpaths for both optimized sizes', () => {
    expect(portraitAsset('./art/characters/wayfinder.png', 160)).toBe('./art/characters/wayfinder-160.webp');
    expect(portraitAsset('/lifemap/art/characters/wayfinder.png', 512)).toBe('/lifemap/art/characters/wayfinder-512.webp');
  });

  it('ships a nonempty thumbnail and portrait for every original character', () => {
    const directory = fileURLToPath(new URL('../public/art/characters/', import.meta.url));
    const originals = readdirSync(directory).filter((name) => name.endsWith('.png'));
    expect(originals.length).toBeGreaterThanOrEqual(12);
    for (const original of originals) {
      for (const width of [160, 512] as const) {
        expect(statSync(`${directory}/${portraitAsset(original, width)}`).size).toBeGreaterThan(1000);
      }
    }
  });
});
