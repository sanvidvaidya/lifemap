import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { cameraViewBox, constrainCamera, DEFAULT_CAMERA, pinchCamera } from './atlas-camera';
import type { AtlasCamera } from './atlas-camera';

type Point = { x: number; y: number };
type Gesture = { camera: AtlasCamera; midpoint: Point; distance: number };

export function useAtlasCamera(initialExploring = false, fit: 'meet' | 'slice' = 'meet') {
  const svgRef = useRef<SVGSVGElement>(null);
  const current = useRef(DEFAULT_CAMERA);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef<number | null>(null);
  const dragged = useRef(false);
  const [camera, setCamera] = useState(DEFAULT_CAMERA);
  const [exploring, setExploring] = useState(initialExploring);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  const draw = useCallback((next: AtlasCamera, commit = false) => {
    current.current = constrainCamera(next);
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (commit) {
      frame.current = null;
      svgRef.current?.setAttribute('viewBox', cameraViewBox(current.current));
      setCamera(current.current);
    } else {
      // A gesture only moves the camera. It never regenerates the world,
      // re-runs analytics, or renders hundreds of React SVG nodes per move.
      frame.current = requestAnimationFrame(() => {
        svgRef.current?.setAttribute('viewBox', cameraViewBox(current.current));
        frame.current = null;
      });
    }
  }, []);
  const focus = useCallback((x: number, y: number) => draw({ ...current.current, x, y }, true), [draw]);
  const point = (event: PointerEvent<SVGSVGElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const scale = (fit === 'slice' ? Math.max : Math.min)(bounds.width / 760, bounds.height / 500);
    return {
      x: (event.clientX - bounds.left - (bounds.width - 760 * scale) / 2) / scale,
      y: (event.clientY - bounds.top - (bounds.height - 500 * scale) / 2) / scale,
    };
  };
  const metrics = () => {
    const [a, b] = [...pointers.current.values()];
    return a ? {
      midpoint: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a,
      distance: b ? Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)) : 1,
    } : null;
  };
  const rebase = () => {
    const next = metrics();
    gesture.current = next ? { camera: current.current, ...next } : null;
  };
  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (!exploring || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (!pointers.current.size) dragged.current = false;
    pointers.current.set(event.pointerId, point(event));
    rebase();
  };
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(event.pointerId) || !gesture.current) return;
    pointers.current.set(event.pointerId, point(event));
    const next = metrics();
    if (!next) return;
    const start = gesture.current;
    if (Math.hypot(next.midpoint.x - start.midpoint.x, next.midpoint.y - start.midpoint.y) > 4 || Math.abs(next.distance - start.distance) > 4) {
      dragged.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    draw(pinchCamera(start.camera, start.midpoint, next.midpoint, next.distance / start.distance));
  };
  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;
    draw(current.current, true);
    rebase();
  };
  const reset = () => { pointers.current.clear(); gesture.current = null; draw(DEFAULT_CAMERA, true); };
  const toggleExploring = () => {
    pointers.current.clear();
    gesture.current = null;
    draw(current.current, true);
    setExploring((value) => !value);
  };

  return {
    svgRef, camera, exploring, toggleExploring, reset,
    zoomBy: (amount: number) => draw({ ...current.current, zoom: current.current.zoom + amount }, true),
    focus,
    handlers: {
      onPointerDown, onPointerMove, onPointerUp,
      onPointerCancel: onPointerUp,
      onLostPointerCapture: onPointerUp,
      onClickCapture: (event: MouseEvent<SVGSVGElement>) => {
        if (dragged.current) { event.stopPropagation(); dragged.current = false; }
      },
    },
  };
}
