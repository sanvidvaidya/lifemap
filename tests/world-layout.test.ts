import { describe, expect, it } from 'vitest';

import {
  createWorldTileSlots,
  districtShareInsetScale,
  isInsideWorldTile,
  WORLD_LANDMARK_OFFSETS,
} from '../src/world-layout';

describe('world tile geometry', () => {
  it('creates a balanced, non-overlapping layout for one through six districts', () => {
    for (let count = 1; count <= 6; count += 1) {
      const slots = createWorldTileSlots(count);
      expect(slots).toHaveLength(count);

      for (let first = 0; first < slots.length; first += 1) {
        for (let second = first + 1; second < slots.length; second += 1) {
          const [x1, y1] = slots[first].center;
          const [x2, y2] = slots[second].center;
          expect(Math.hypot(x2 - x1, y2 - y1)).toBeGreaterThan(200);
        }
      }
    }
  });

  it('keeps every landmark and its visual ring inside its district tile', () => {
    for (const [x, y] of WORLD_LANDMARK_OFFSETS) {
      expect(isInsideWorldTile(x, y, 23)).toBe(true);
    }
  });

  it('maps time share to a bounded inset instead of resizing the platform', () => {
    const smallest = districtShareInsetScale(0.8);
    const middle = districtShareInsetScale(0.97);
    const largest = districtShareInsetScale(1.14);

    expect(smallest).toBe(0.72);
    expect(middle).toBeGreaterThan(smallest);
    expect(largest).toBeCloseTo(0.92);
  });
});
