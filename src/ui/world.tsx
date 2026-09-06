/* oxlint-disable next/no-img-element -- LifeMap is a Vite SPA using a bundled local protagonist asset. */
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useEffect, useId, useMemo } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

import {
  createCharacterProfile,
  createWorldConfiguration,
} from '../world-generation';
import { FaithfulProtagonist } from './faithful-protagonist';
import { portraitAsset } from './portrait-assets';
import { useAtlasCamera } from './use-atlas-camera';
import { cameraViewBox } from './atlas-camera';
import type {
  Analytics,
  CharacterProfile,
  DistrictBlueprint,
  WorldLandmark,
} from '../types';
import {
  createWorldTileSlots,
  districtShareInsetScale,
  WORLD_LANDMARK_OFFSETS,
  WORLD_TILE_LOCAL_POINTS,
  WORLD_NODE_OFFSETS,
  WORLD_STRUCTURE_OFFSETS,
} from '../world-layout';

const compactSlots = [
  {
    points: '72,135 225,70 372,136 338,215 225,270 105,214',
    ridge: '105,214 225,270 338,215 338,229 225,284 105,228',
    center: [225, 158],
  },
  {
    points: '388,135 530,75 690,144 654,220 530,272 410,216',
    ridge: '410,216 530,272 654,220 654,234 530,286 410,230',
    center: [530, 160],
  },
  {
    points: '78,300 225,235 372,302 340,382 225,438 103,380',
    ridge: '103,380 225,438 340,382 340,396 225,452 103,394',
    center: [225, 328],
  },
  {
    points: '388,300 530,238 688,306 654,384 530,438 410,382',
    ridge: '410,382 530,438 654,384 654,398 530,452 410,396',
    center: [530, 330],
  },
] as const;

type Props = {
  analytics: Analytics;
  periodKey?: string;
  categoryOrder?: string[];
  selectedCategory?: string;
  selectedLandmarkId?: string;
  onSelect?: (category: string) => void;
  onLandmarkSelect?: (landmark: WorldLandmark) => void;
  compact?: boolean;
  accent?: string;
  avatarStyle?: 'trail' | 'city' | 'field';
};

function Structure({
  district,
  index,
}: {
  district: DistrictBlueprint;
  index: number;
}) {
  const [dx, dy] =
    WORLD_STRUCTURE_OFFSETS[index % WORLD_STRUCTURE_OFFSETS.length];
  const height = 12 + district.development * 3 + (index % 3) * 2;
  const width = 8 + (index % 2) * 3;
  return (
    <g
      className={`district-structure structure-${district.identity}`}
      transform={`translate(${dx} ${dy})`}
    >
      <ellipse
        cx="0"
        cy="4"
        rx={width + 4}
        ry="5"
        fill="#082023"
        opacity=".24"
      />
      <path
        d={`M${-width} 0 0 ${-width / 2} ${width} 0 0 ${width / 2}Z`}
        fill={district.color}
      />
      <path
        d={`M${-width} 0 0 ${width / 2}V${height + width / 2}L${-width} ${height}Z`}
        fill="#d9cda9"
      />
      <path
        d={`M${width} 0 0 ${width / 2}V${height + width / 2}L${width} ${height}Z`}
        fill="#a99d7d"
      />
      {district.development >= 4 && index === 0 && (
        <path
          d={`M0 ${-width / 2}V${-height * 0.7}`}
          stroke="#f2df9a"
          strokeWidth="2"
        />
      )}
      {district.identity === 'learning' && index % 3 === 0 && (
        <path
          d={`M${-width - 2} 1Q0 ${-height * 1.15} ${width + 2} 1`}
          fill="#d9d0ad"
          stroke="#f2e6bd"
          strokeWidth="1"
        />
      )}
      {district.identity === 'career' && index % 2 === 0 && (
        <path
          d={`M${-width + 2} 5H${width - 2}M${-width + 2} 10H${width - 2}`}
          stroke="#f2df9a"
          strokeWidth="1"
          opacity=".75"
        />
      )}
      {district.identity === 'social' && index === 0 && (
        <circle cy={height * 0.4} r="3" fill="#f4d982" />
      )}
      {district.identity === 'fitness' && index === 0 && (
        <path
          d={`M${-width - 5} ${height + 4}H${width + 5}`}
          stroke="#f0e2b7"
          strokeWidth="3"
        />
      )}
    </g>
  );
}

function TerrainDetails({ district }: { district: DistrictBlueprint }) {
  if (district.identity === 'fitness')
    return (
      <ellipse
        rx="48"
        ry="25"
        fill="none"
        stroke="#e8d9ac"
        strokeWidth="4"
        strokeDasharray="9 5"
        opacity=".48"
      />
    );
  if (district.identity === 'learning')
    return (
      <g opacity=".54">
        <path d="M-54 21H54M-45 29H45" stroke="#d9cfaa" strokeWidth="2" />
        <circle cy="18" r="24" fill="none" stroke="#d9cfaa" />
      </g>
    );
  if (district.identity === 'social')
    return (
      <g opacity=".5">
        <circle r="31" fill="#e8d4a5" opacity=".24" />
        <path d="M-34 0H34M0-19V19" stroke="#ead8ad" strokeWidth="2" />
      </g>
    );
  if (district.identity === 'recreation')
    return (
      <g opacity=".58">
        <ellipse rx="39" ry="16" fill="#448d91" />
        <path
          d="M-42 17Q0 34 42 17"
          fill="none"
          stroke="#d6c88c"
          strokeWidth="3"
        />
      </g>
    );
  if (district.identity === 'creative')
    return (
      <path
        d="M-52 22Q-20-6 0 15T52 13"
        fill="none"
        stroke="#f0bd9d"
        strokeWidth="4"
        strokeDasharray="3 5"
        opacity=".58"
      />
    );
  if (district.identity === 'career')
    return (
      <g opacity=".44">
        <path
          d="M-52 28V-10M-32 32V-18M48 26V-8"
          stroke="#e6d398"
          strokeWidth="2"
        />
        <circle cx="-52" cy="-13" r="4" fill="#f4df94" />
        <circle cx="-32" cy="-21" r="4" fill="#f4df94" />
        <circle cx="48" cy="-11" r="4" fill="#f4df94" />
      </g>
    );
  return (
    <circle
      r="36"
      fill="none"
      stroke="#d8cfad"
      strokeWidth="2"
      strokeDasharray="4 7"
      opacity=".35"
    />
  );
}

function LandmarkGlyph({
  landmark,
  color,
}: {
  landmark: WorldLandmark;
  color: string;
}) {
  if (landmark.kind === 'streak')
    return (
      <>
        <path d="M0 14V-8" stroke="#e9d68e" strokeWidth="3" />
        <circle cy="-12" r="7" fill="#f1d87d" />
        <circle cy="-12" r="3" fill="#fff3b3" />
      </>
    );
  if (landmark.kind === 'milestone')
    return (
      <>
        <path d="M-8 12V-9H8V12" fill="#efe1bb" />
        <path d="M-12-9 0-18 12-9 0-2Z" fill={color} />
        <circle cy="3" r="3" fill="#80683d" />
      </>
    );
  if (landmark.kind === 'activity')
    return (
      <>
        <path d="M-10 12 0-10 10 12Z" fill="#f2ead3" />
        <path d="M-4 3 0-7 4 3Z" fill={color} />
        <circle cy="-12" r="3.5" fill="#fff0a7" />
      </>
    );
  return (
    <>
      <path d="M-13 12V-8L0-18 13-8V12Z" fill="#eee3c3" />
      <path d="M-17-8 0-22 17-8 0 1Z" fill={color} />
      <path d="M-4 12V2H4V12" fill="#7a6542" />
    </>
  );
}

export function WorldMap({
  analytics,
  periodKey = 'all',
  categoryOrder,
  selectedCategory,
  selectedLandmarkId,
  onSelect,
  onLandmarkSelect,
  compact = false,
  accent = '#e7cc78',
  avatarStyle = 'trail',
}: Props) {
  const id = useId().replace(/:/g, '');
  const world = useMemo(
    () => createWorldConfiguration(analytics, periodKey, categoryOrder),
    [analytics, periodKey, categoryOrder],
  );
  const displayedDistricts = compact
    ? world.districts.slice(0, compactSlots.length)
    : world.districts;
  const fullSlots = createWorldTileSlots(displayedDistricts.length);
  const tileIndexByCategory = new Map(
    displayedDistricts.map((district, index) => [district.category, index]),
  );
  const slotByCategory = new Map(
    displayedDistricts.map((district, index) => [
      district.category,
      compact ? compactSlots[index] : fullSlots[index],
    ]),
  );
  const slotForDistrict = (district: DistrictBlueprint) =>
    slotByCategory.get(district.category) ??
    (compact ? compactSlots[0] : createWorldTileSlots(1)[0]);
  const districtClipId = (district: DistrictBlueprint) =>
    `district-clip-${id}-${tileIndexByCategory.get(district.category) ?? 0}`;
  const selectedDistrict =
    displayedDistricts.find(
      (district) => district.category === selectedCategory,
    ) ?? displayedDistricts[0];
  const { svgRef, camera, handlers, exploring, toggleExploring, zoomBy, reset, focus } = useAtlasCamera();
  const avatarTarget = selectedDistrict
    ? slotForDistrict(selectedDistrict).center
    : ([380, 248] as const);
  const selectedDistrictCategory = selectedDistrict?.category;
  const profile = createCharacterProfile(analytics, selectedDistrictCategory);
  const [selectedX, selectedY] = avatarTarget;
  useEffect(() => {
    if (!compact) focus(selectedX, selectedY);
  }, [compact, selectedX, selectedY, focus]);

  const selectDistrict = (district: DistrictBlueprint) => {
    onSelect?.(district.category);
  };
  const districtKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    district: DistrictBlueprint,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectDistrict(district);
    }
  };
  const landmarkKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    landmark: WorldLandmark,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(landmark.category);
      onLandmarkSelect?.(landmark);
    }
  };

  return (
    <div
      className={`world-canvas atmosphere-${world.atmosphere} ${compact ? 'world-compact' : 'world-interactive'} ${exploring ? 'camera-exploring' : ''}`}
      data-world-fingerprint={world.fingerprint}
    >
      <div className="world-horizon" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <svg
        ref={svgRef}
        className="world-svg"
        viewBox={cameraViewBox(camera)}
        {...(!compact ? handlers : {})}
        aria-labelledby={`living-map-title-${id} living-map-desc-${id}`}
      >
        <title id={`living-map-title-${id}`}>
          LifeMap world for{' '}
          {periodKey === 'all' ? 'all recorded time' : periodKey}
        </title>
        <desc id={`living-map-desc-${id}`}>
          A connected isometric world. Every district has a fixed tile boundary.
          The colored inset represents time share, buildings represent
          progression, lights represent sessions, vegetation represents
          consistency, and landmarks can be traced to source records.
        </desc>
        <defs>
          <filter
            id={`world-shadow-${id}`}
            x="-30%"
            y="-30%"
            width="170%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="12"
              floodColor="#041315"
              floodOpacity=".42"
            />
          </filter>
          <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1a4545" />
            <stop offset=".55" stopColor="#103537" />
            <stop offset="1" stopColor="#08262a" />
          </linearGradient>
          <linearGradient id={`ground-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4f7567" />
            <stop offset="1" stopColor="#2f574f" />
          </linearGradient>
          <radialGradient id={`fog-${id}`}>
            <stop offset="0" stopColor="#d8e9e3" stopOpacity=".55" />
            <stop offset="1" stopColor="#aac7c1" stopOpacity="0" />
          </radialGradient>
          {displayedDistricts.map((district) => {
            return (
              <clipPath key={district.category} id={districtClipId(district)}>
                <polygon points={WORLD_TILE_LOCAL_POINTS} />
              </clipPath>
            );
          })}
        </defs>
        <g
          key={world.fingerprint}
          className="world-reconstruction"
        >
          <path d="M18 248 380 42 742 248 380 478Z" fill={`url(#sea-${id})`} />
          <g
            className="water-lines"
            fill="none"
            stroke="#87ded2"
            strokeWidth="1"
          >
            <path d="M54 250 380 72 706 250" />
            <path d="M82 300 380 138 678 300" />
            <path d="M118 350 380 208 642 350" />
            <path d="M166 400 380 284 594 400" />
          </g>
          <path
            className="world-landmass-shadow"
            d="M42 238 146 72 614 72 718 238 650 430 110 430Z"
          />
          <path
            className="world-landmass"
            d="M42 228 146 62 614 62 718 228 650 420 110 420Z"
            fill={`url(#ground-${id})`}
          />

          <g className="world-connections">
            {world.connections.map((connection) => {
              const from = displayedDistricts.find(
                (district) => district.category === connection.from,
              );
              const to = displayedDistricts.find(
                (district) => district.category === connection.to,
              );
              if (!from || !to) return null;
              const [x1, y1] = slotForDistrict(from).center;
              const [x2, y2] = slotForDistrict(to).center;
              const curve = `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 18} ${x2} ${y2}`;
              return (
                <g key={connection.id}>
                  <title>{connection.explanation}</title>
                  <path
                    className={`connection-base ${connection.kind}`}
                    d={curve}
                  />
                  <path
                    className={`connection-markers ${connection.kind}`}
                    d={curve}
                  />
                </g>
              );
            })}
          </g>

          <g
            className="world-platform-layer"
            filter={`url(#world-shadow-${id})`}
          >
            {displayedDistricts.map((district) => {
              const slot = slotForDistrict(district);
              const isSelected =
                district.category === selectedDistrict?.category;
              const unexplored = district.sessions < 3;
              return (
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                <g
                  key={district.category}
                  className={`world-region terrain-${district.identity} ${isSelected ? 'selected' : ''} ${unexplored ? 'unexplored' : ''}`}
                  data-district={district.category}
                  role={compact ? undefined : 'button'}
                  tabIndex={compact ? -1 : 0}
                  aria-label={`${district.category}, ${district.stage}, ${Math.round(district.share * 100)} percent of tracked time, ${district.structureCount} structures`}
                  onClick={compact ? undefined : () => selectDistrict(district)}
                  onKeyDown={
                    compact
                      ? undefined
                      : (event) => districtKeyDown(event, district)
                  }
                  style={{ color: district.color }}
                >
                  <title>
                    {district.category}: {district.stage}. {district.minutes}{' '}
                    minutes from {district.sessions} records.
                  </title>
                  <polygon points={slot.ridge} className="district-ridge" />
                  <polygon points={slot.points} className="district-platform" />
                  <polygon
                    points={slot.points}
                    className="district-share-footprint"
                    style={{
                      transform: `scale(${districtShareInsetScale(district.footprint)})`,
                      transformOrigin: `${slot.center[0]}px ${slot.center[1]}px`,
                    }}
                  />
                  <polygon points={slot.points} className="district-texture" />
                  <path
                    d={`M${slot.center[0] - 54} ${slot.center[1] + 4}q54-32 108 0`}
                    className="district-path"
                  />
                  {unexplored && (
                    <ellipse
                      cx={slot.center[0]}
                      cy={slot.center[1]}
                      rx="82"
                      ry="50"
                      fill={`url(#fog-${id})`}
                    />
                  )}
                  {!compact && (
                    <text
                      x={slot.center[0]}
                      y={slot.center[1] + 80}
                      textAnchor="middle"
                      className="district-tile-label"
                    >
                      {district.category}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          <g className="world-development" aria-hidden="true">
            {displayedDistricts.map((district) => {
              const [x, y] = slotForDistrict(district).center;
              return (
                <g
                  key={district.category}
                  transform={`translate(${x} ${y})`}
                  className={`development-stage-${district.development}`}
                  data-district={district.category}
                  clipPath={
                    compact ? undefined : `url(#${districtClipId(district)})`
                  }
                >
                  <g className="terrain-details" transform="translate(0 17)">
                    <TerrainDetails district={district} />
                  </g>
                  {Array.from(
                    { length: district.structureCount },
                    (_, index) => (
                      <Structure
                        key={index}
                        district={district}
                        index={index}
                      />
                    ),
                  )}
                  {Array.from(
                    { length: district.activityNodeCount },
                    (_, index) => {
                      const [dx, dy] =
                        WORLD_NODE_OFFSETS[index % WORLD_NODE_OFFSETS.length];
                      return (
                        <g
                          key={`node-${index}`}
                          className="activity-node"
                          transform={`translate(${dx} ${dy})`}
                        >
                          <circle r="4.5" fill="#ffe795" />
                          <circle
                            r="8"
                            fill="#ffe795"
                            opacity={0.08 + district.vitality * 0.14}
                          />
                        </g>
                      );
                    },
                  )}
                  {Array.from(
                    { length: district.vegetationCount },
                    (_, index) => {
                      const [dx, dy] =
                        WORLD_NODE_OFFSETS[
                          (index * 2 + 3) % WORLD_NODE_OFFSETS.length
                        ];
                      return (
                        <g
                          key={`tree-${index}`}
                          className="district-tree"
                          transform={`translate(${dx * 0.88} ${dy * 0.84 + 8})`}
                        >
                          <path d="M-6 8 0-5 6 8Z" fill="#174c42" />
                          <circle cy="-5" r="4" fill="#8cc985" />
                        </g>
                      );
                    },
                  )}
                </g>
              );
            })}
          </g>

          <g className="world-landmarks">
            {displayedDistricts.flatMap((district) =>
              district.landmarks.map((landmark, index) => {
                const [x, y] = slotForDistrict(district).center;
                const [dx, dy] =
                  WORLD_LANDMARK_OFFSETS[index % WORLD_LANDMARK_OFFSETS.length];
                const selected = landmark.id === selectedLandmarkId;
                return (
                  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                  <g
                    key={landmark.id}
                    transform={`translate(${x + dx} ${y + dy})`}
                    className={`landmark-node kind-${landmark.kind} ${selected ? 'selected' : ''}`}
                    data-district={district.category}
                    role={compact ? undefined : 'button'}
                    tabIndex={compact ? -1 : 0}
                    aria-label={`${landmark.title}. ${landmark.metric}. Open landmark details.`}
                    onClick={
                      compact
                        ? undefined
                        : (event) => {
                            event.stopPropagation();
                            onSelect?.(landmark.category);
                            onLandmarkSelect?.(landmark);
                          }
                    }
                    onKeyDown={
                      compact
                        ? undefined
                        : (event) => landmarkKeyDown(event, landmark)
                    }
                  >
                    <title>
                      {landmark.title}: {landmark.metric}
                    </title>
                    <circle className="landmark-ring" r="19" />
                    <LandmarkGlyph landmark={landmark} color={district.color} />
                  </g>
                );
              }),
            )}
          </g>

          {!compact && (
            <g
              className={`world-avatar evolution-${profile.evolutionTier}`}
              style={
                {
                  transform: `translate(${avatarTarget[0] - 28}px, ${avatarTarget[1] - 78}px)`,
                  '--avatar-accent': accent,
                } as CSSProperties
              }
              aria-hidden="true"
            >
              <ellipse
                cx="28"
                cy="74"
                rx="25"
                ry="7"
                className="avatar-shadow"
              />
              <circle cx="28" cy="61" r="22" className="avatar-arrival-ring" />
              <image
                href={portraitAsset(profile.portraitSrc, 160)}
                x="0"
                y="0"
                width="56"
                height="78"
                preserveAspectRatio="xMidYMid meet"
                className={`avatar-illustration style-${avatarStyle}`}
              />
            </g>
          )}
        </g>
      </svg>
      {!compact && (
        <div className="world-legend" aria-label="World visual legend">
          <span>
            <i className="legend-building" />
            Progression
          </span>
          <span>
            <i className="legend-light" />
            Sessions
          </span>
          <span>
            <i className="legend-tree" />
            Consistency
          </span>
          <span>
            <i className="legend-road" />
            Transitions
          </span>
        </div>
      )}
      {!compact && (
        <div className="camera-controls" aria-label="World camera controls">
          <button
            type="button"
            className="camera-explore-toggle"
            onClick={toggleExploring}
            aria-pressed={exploring}
          >
            {exploring ? 'Done' : 'Explore'}
          </button>
          <button
            type="button"
            onClick={() => zoomBy(-0.25)}
            aria-label="Zoom out of the atlas"
            title="Zoom out"
            disabled={camera.zoom <= 1}
          >
            <Minus />
          </button>
          <output className="camera-zoom-status" aria-live="polite">
            {Math.round(camera.zoom * 100)}%
          </output>
          <button
            type="button"
            onClick={() => zoomBy(0.25)}
            aria-label="Zoom into the atlas"
            title="Zoom in"
            disabled={camera.zoom >= 3}
          >
            <Plus />
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset atlas zoom"
            title="Reset zoom"
            disabled={camera.zoom === 1}
          >
            <RotateCcw />
          </button>
          <p className="camera-help">{exploring ? 'Drag to move. Pinch to zoom. Tap Done to scroll.' : 'Use + to zoom, or Explore to drag and pinch.'}</p>
        </div>
      )}
      {!compact && selectedDistrict && (
        <div
          className="region-plaque"
          aria-live="polite"
          style={{ '--region-color': selectedDistrict.color } as CSSProperties}
        >
          <i />
          <div>
            <span>
              {selectedDistrict.stage} · development{' '}
              {selectedDistrict.development}/5
            </span>
            <strong>{selectedDistrict.category}</strong>
            <small>
              {(selectedDistrict.minutes / 60).toFixed(1)}h ·{' '}
              {selectedDistrict.structureCount} structures ·{' '}
              {selectedDistrict.activityNodeCount} activity lights
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

type PortraitProps = {
  profile?: CharacterProfile;
  level?: number;
  accent: string;
  style: 'trail' | 'city' | 'field';
  name: string;
};

export function CharacterPortrait({
  profile,
  level = 1,
  accent,
  style,
  name,
}: PortraitProps) {
  const currentLevel = profile?.level ?? level;
  const evolutionTier = profile?.evolutionTier ?? 1;
  return (
    <figure
      className={`character-portrait style-${style} evolution-${evolutionTier}`}
      style={{ '--avatar-accent': accent } as CSSProperties}
    >
      <figcaption className="sr-only">
        {name}, level {currentLevel} LifeMap protagonist,{' '}
        {profile?.title ?? 'recorded explorer'}
      </figcaption>
      <div className="portrait-aura" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="portrait-sigil" aria-hidden="true">
        <span>
          {profile?.achievements.filter((item) => item.unlocked).length ?? 0}
        </span>
      </div>
      <FaithfulProtagonist
        archetypeId={profile?.archetypeId ?? 'wayfinder'}
        fallbackSrc={profile?.portraitSrc ?? './art/characters/wayfinder.png'}
        evolutionTier={evolutionTier}
        className="portrait-illustration portrait-original-form"
      />
      {profile && (
        <div
          className="portrait-equipment"
          aria-label="Equipped life-domain items"
        >
          {profile.equipment.slice(0, 4).map((item, index) => (
            <span
              key={item.id}
              className={`equipment-orbit equipment-orbit-${index + 1}`}
              title={item.reason}
            >
              <i>{item.name.slice(0, 1)}</i>
              <small>{item.name}</small>
            </span>
          ))}
        </div>
      )}
      <div className="portrait-level">
        <span>Level</span>
        <strong>{currentLevel}</strong>
      </div>
      {profile && (
        <div className="portrait-nameplate">
          <strong>{name}</strong>
          <span>
            {profile.evolutionLabel} · {profile.title}
          </span>
        </div>
      )}
    </figure>
  );
}
