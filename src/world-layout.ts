export type WorldTileSlot = {
  center: readonly [number, number];
  points: string;
  ridge: string;
};

export const WORLD_TILE_HALF_WIDTH = 108;
export const WORLD_TILE_HALF_HEIGHT = 72;
export const WORLD_TILE_RIDGE_DEPTH = 12;
export const WORLD_TILE_LOCAL_POINTS =
  '-108,0 -54,-72 54,-72 108,0 54,72 -54,72';

export const WORLD_STRUCTURE_OFFSETS = [
  [-34, -10],
  [0, -18],
  [34, -10],
  [-42, 8],
  [-14, 10],
  [14, 10],
  [42, 8],
  [-20, 27],
  [20, 27],
] as const;

export const WORLD_NODE_OFFSETS = [
  [-57, -8],
  [-48, 14],
  [-31, -32],
  [-8, -39],
  [23, -33],
  [51, -16],
  [58, 8],
  [46, 29],
  [18, 39],
  [-15, 38],
  [-42, 29],
  [0, -5],
] as const;

export const WORLD_LANDMARK_OFFSETS = [
  [-40, -18],
  [40, -18],
  [-40, 24],
  [40, 24],
] as const;

function pointList(points: ReadonlyArray<readonly [number, number]>) {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

function createTileSlot(center: readonly [number, number]): WorldTileSlot {
  const [x, y] = center;
  const halfWidth = WORLD_TILE_HALF_WIDTH;
  const halfHeight = WORLD_TILE_HALF_HEIGHT;
  const ridgeDepth = WORLD_TILE_RIDGE_DEPTH;
  return {
    center,
    points: pointList([
      [x - halfWidth, y],
      [x - halfWidth / 2, y - halfHeight],
      [x + halfWidth / 2, y - halfHeight],
      [x + halfWidth, y],
      [x + halfWidth / 2, y + halfHeight],
      [x - halfWidth / 2, y + halfHeight],
    ]),
    ridge: pointList([
      [x - halfWidth, y],
      [x - halfWidth / 2, y + halfHeight],
      [x + halfWidth / 2, y + halfHeight],
      [x + halfWidth, y],
      [x + halfWidth, y + ridgeDepth],
      [x + halfWidth / 2, y + halfHeight + ridgeDepth],
      [x - halfWidth / 2, y + halfHeight + ridgeDepth],
      [x - halfWidth, y + ridgeDepth],
    ]),
  };
}

function centersForCount(count: number): ReadonlyArray<readonly [number, number]> {
  switch (Math.max(1, Math.min(6, count))) {
    case 1:
      return [[380, 248]];
    case 2:
      return [
        [260, 248],
        [500, 248],
      ];
    case 3:
      return [
        [140, 248],
        [380, 248],
        [620, 248],
      ];
    case 4:
      return [
        [260, 145],
        [500, 145],
        [260, 350],
        [500, 350],
      ];
    case 5:
      return [
        [140, 145],
        [380, 145],
        [620, 145],
        [260, 350],
        [500, 350],
      ];
    default:
      return [
        [140, 145],
        [380, 145],
        [620, 145],
        [140, 350],
        [380, 350],
        [620, 350],
      ];
  }
}

export function createWorldTileSlots(count: number): WorldTileSlot[] {
  return centersForCount(count).map(createTileSlot);
}

export function districtShareInsetScale(footprint: number) {
  const normalized = (footprint - 0.8) / 0.34;
  return Math.max(0.72, Math.min(0.92, 0.72 + normalized * 0.2));
}

export function isInsideWorldTile(
  x: number,
  y: number,
  padding = 0,
) {
  const verticalLimit = WORLD_TILE_HALF_HEIGHT - padding;
  if (Math.abs(y) > verticalLimit) return false;
  const edgeAtY =
    WORLD_TILE_HALF_WIDTH -
    (WORLD_TILE_HALF_WIDTH / 2) *
      (Math.abs(y) / WORLD_TILE_HALF_HEIGHT) -
    padding;
  return Math.abs(x) <= edgeAtY;
}
