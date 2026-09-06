export type AtlasCamera = { x: number; y: number; zoom: number };
export const ATLAS_WIDTH = 760;
export const ATLAS_HEIGHT = 500;
export const DEFAULT_CAMERA: AtlasCamera = { x: 380, y: 250, zoom: 1 };

export function constrainCamera(camera: AtlasCamera): AtlasCamera {
  const zoom = Math.max(1, Math.min(3, camera.zoom));
  const halfWidth = ATLAS_WIDTH / zoom / 2;
  const halfHeight = ATLAS_HEIGHT / zoom / 2;
  return {
    zoom,
    x: Math.max(halfWidth, Math.min(ATLAS_WIDTH - halfWidth, camera.x)),
    y: Math.max(halfHeight, Math.min(ATLAS_HEIGHT - halfHeight, camera.y)),
  };
}

export function cameraViewBox(camera: AtlasCamera): string {
  const safe = constrainCamera(camera);
  const width = ATLAS_WIDTH / safe.zoom;
  const height = ATLAS_HEIGHT / safe.zoom;
  return `${safe.x - width / 2} ${safe.y - height / 2} ${width} ${height}`;
}

// Keep the same world point beneath the fingers as their midpoint moves.
export function pinchCamera(
  start: AtlasCamera,
  startPoint: { x: number; y: number },
  currentPoint: { x: number; y: number },
  ratio: number,
): AtlasCamera {
  const zoom = Math.max(1, Math.min(3, start.zoom * ratio));
  return constrainCamera({
    zoom,
    x: start.x + (startPoint.x - 380) / start.zoom - (currentPoint.x - 380) / zoom,
    y: start.y + (startPoint.y - 250) / start.zoom - (currentPoint.y - 250) / zoom,
  });
}
