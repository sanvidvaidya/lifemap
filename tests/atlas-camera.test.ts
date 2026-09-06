import { describe, expect, it } from 'vitest';
import { cameraViewBox, constrainCamera, DEFAULT_CAMERA, pinchCamera } from '../src/ui/atlas-camera';

describe('atlas camera', () => {
  it('keeps the full atlas visible at reset and bounds excessive zoom and pan', () => {
    expect(cameraViewBox(DEFAULT_CAMERA)).toBe('0 0 760 500');
    const edge = constrainCamera({ x: -900, y: 900, zoom: 99 });
    expect(edge.zoom).toBe(3);
    expect(edge.x).toBeCloseTo(760 / 6);
    expect(edge.y).toBeCloseTo(500 - 500 / 6);
    expect(constrainCamera({ x: -900, y: 900, zoom: 0.1 })).toEqual(DEFAULT_CAMERA);
  });
  it('preserves the point beneath a stationary pinch midpoint', () => {
    const p = { x: 420, y: 280 };
    const next = pinchCamera(DEFAULT_CAMERA, p, p, 2);
    expect(next.x + (p.x - 380) / next.zoom).toBeCloseTo(420);
    expect(next.y + (p.y - 250) / next.zoom).toBeCloseTo(280);
  });
  it('pans in world units and keeps every edge reachable at high zoom', () => {
    const start = { x: 380, y: 250, zoom: 2 };
    const next = pinchCamera(start, { x: 380, y: 250 }, { x: 480, y: 310 }, 1);
    expect(next).toEqual({ x: 330, y: 220, zoom: 2 });
    expect(cameraViewBox(constrainCamera({ x: 760, y: 500, zoom: 2 }))).toBe('380 250 380 250');
  });
});
