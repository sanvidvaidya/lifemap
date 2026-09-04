import { monthKey, summarize } from './analytics';
import type {
  Achievement,
  ActivityRecord,
  Analytics,
  CharacterArchetypeId,
  CharacterEquipment,
  CharacterProfile,
  DistrictBlueprint,
  DistrictIdentity,
  WorldConfiguration,
  WorldConnection,
  WorldLandmark,
} from './types';

export const WORLD_COLORS = [
  '#efb56b',
  '#65d2a6',
  '#e97a69',
  '#a78bdc',
  '#69bddd',
  '#d7cf72',
];

export const WORLD_IDENTITY_COLORS: Record<
  Exclude<DistrictIdentity, 'general'>,
  string
> = {
  career: '#efb56b',
  learning: '#65d2a6',
  recreation: '#e97a69',
  social: '#a78bdc',
  fitness: '#69bddd',
  creative: '#d7cf72',
  exploration: '#62c6b6',
};

const identityCatalog: Record<
  DistrictIdentity,
  { core: string; terrain: string }
> = {
  career: { core: 'Guildhall', terrain: 'Civic terraces' },
  learning: { core: 'Great Archive', terrain: 'Scholars’ quarter' },
  fitness: { core: 'Training Grounds', terrain: 'Highland circuit' },
  social: { core: 'Common Plaza', terrain: 'Gathering quarter' },
  recreation: { core: 'Leisure Garden', terrain: 'Lantern park' },
  creative: { core: 'Open Atelier', terrain: 'Makers’ ward' },
  exploration: { core: 'Waystation', terrain: 'Frontier paths' },
  general: { core: 'District Hall', terrain: 'Recorded terrain' },
};

const equipmentCatalog: Record<
  Exclude<DistrictIdentity, 'general'>,
  CharacterEquipment
> = {
  career: { id: 'satchel', name: 'Surveyor’s Satchel', reason: '' },
  learning: { id: 'codex', name: 'Field Codex', reason: '' },
  fitness: { id: 'bracers', name: 'Trail Bracers', reason: '' },
  social: { id: 'lantern', name: 'Signal Lantern', reason: '' },
  recreation: { id: 'keepsake', name: 'Keepsake Deck', reason: '' },
  creative: { id: 'sketchbook', name: 'Cartographer’s Sketchbook', reason: '' },
  exploration: { id: 'compass', name: 'Brass Compass', reason: '' },
};

const archetypeCatalog: Record<
  CharacterArchetypeId,
  { name: string; description: string; portraitSrc: string }
> = {
  wayfinder: {
    name: 'The Wayfinder',
    description:
      'A frontier cartographer shaped by exploration and broad, uncategorized paths.',
    portraitSrc: './art/characters/wayfinder.png',
  },
  'city-architect': {
    name: 'The City Architect',
    description:
      'A systems-minded builder shaped by career, projects, and professional momentum.',
    portraitSrc: './art/characters/city-architect.png',
  },
  'guild-forgemaster': {
    name: 'The Guild Forgemaster',
    description:
      'A seasoned builder shaped by an especially concentrated commitment to work and projects.',
    portraitSrc: './art/characters/guild-forgemaster.png',
  },
  'archive-sage': {
    name: 'The Archive Sage',
    description:
      'A patient scholar shaped by study, reading, research, and deliberate practice.',
    portraitSrc: './art/characters/archive-sage.png',
  },
  'observatory-scholar': {
    name: 'The Observatory Scholar',
    description:
      'A devoted observer shaped by an especially concentrated season of study and research.',
    portraitSrc: './art/characters/observatory-scholar.png',
  },
  'trail-warden': {
    name: 'The Trail Warden',
    description:
      'An energetic pathfinder shaped by movement, fitness, health, and training.',
    portraitSrc: './art/characters/trail-warden.png',
  },
  'circuit-ranger': {
    name: 'The Circuit Ranger',
    description:
      'An endurance specialist shaped by an especially concentrated rhythm of movement and training.',
    portraitSrc: './art/characters/circuit-ranger.png',
  },
  'hearth-envoy': {
    name: 'The Hearth Envoy',
    description:
      'A luminous connector shaped by relationships, community, and shared time.',
    portraitSrc: './art/characters/hearth-envoy.png',
  },
  'festival-herald': {
    name: 'The Festival Herald',
    description:
      'A trusted host shaped by an especially concentrated season of community and shared time.',
    portraitSrc: './art/characters/festival-herald.png',
  },
  grovekeeper: {
    name: 'The Grovekeeper',
    description:
      'A restorative keeper shaped by leisure, hobbies, rest, and recreation.',
    portraitSrc: './art/characters/grovekeeper.png',
  },
  'dream-gardener': {
    name: 'The Dream Gardener',
    description:
      'A restorative cultivator shaped by an especially concentrated season of hobbies, leisure, and rest.',
    portraitSrc: './art/characters/dream-gardener.png',
  },
  'atelier-weaver': {
    name: 'The Atelier Weaver',
    description:
      'An inventive maker shaped by art, music, writing, design, and creative work.',
    portraitSrc: './art/characters/atelier-weaver.png',
  },
};

const archetypeForIdentity: Record<DistrictIdentity, CharacterArchetypeId> = {
  career: 'city-architect',
  learning: 'archive-sage',
  fitness: 'trail-warden',
  social: 'hearth-envoy',
  recreation: 'grovekeeper',
  creative: 'atelier-weaver',
  exploration: 'wayfinder',
  general: 'wayfinder',
};

const specialistArchetypeForIdentity: Partial<
  Record<DistrictIdentity, CharacterArchetypeId>
> = {
  career: 'guild-forgemaster',
  learning: 'observatory-scholar',
  fitness: 'circuit-ranger',
  social: 'festival-herald',
  recreation: 'dream-gardener',
};

const SPECIALIST_SHARE_THRESHOLD = 0.68;

const identityTieOrder: DistrictIdentity[] = [
  'career',
  'learning',
  'fitness',
  'social',
  'recreation',
  'creative',
  'exploration',
  'general',
];

const identityDisplayName: Record<DistrictIdentity, string> = {
  career: 'Career and project activity',
  learning: 'Learning and research activity',
  fitness: 'Fitness and health activity',
  social: 'Social and community activity',
  recreation: 'Recreation and restorative activity',
  creative: 'Creative and making activity',
  exploration: 'Exploration and outdoor activity',
  general: 'Broad or uncategorized activity',
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatMinutes(minutes: number) {
  return minutes < 60
    ? `${Math.round(minutes)} minutes`
    : `${(minutes / 60).toFixed(minutes % 60 ? 1 : 0)} hours`;
}

function slug(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'district'
  );
}

function sortWorldRecords(records: ActivityRecord[]) {
  return [...records].sort((a, b) =>
    `${a.date}|${a.startTime ?? ''}|${a.category}|${a.activity}|${a.id}`.localeCompare(
      `${b.date}|${b.startTime ?? ''}|${b.category}|${b.activity}|${b.id}`,
    ),
  );
}

function hashRecords(records: ActivityRecord[], periodKey: string) {
  const input =
    [...records]
      .sort((a, b) =>
        `${a.date}|${a.startTime ?? ''}|${a.id}`.localeCompare(
          `${b.date}|${b.startTime ?? ''}|${b.id}`,
        ),
      )
      .map(
        (record) =>
          `${record.date}|${record.startTime ?? ''}|${record.activity}|${record.category}|${record.duration}`,
      )
      .join('¶') + `|${periodKey}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function districtIdentity(category: string): DistrictIdentity {
  const value = category.toLowerCase();
  if (/career|work|business|project|professional/.test(value)) return 'career';
  if (/learn|study|education|reading|research|language/.test(value))
    return 'learning';
  if (/fitness|health|exercise|sport|training|run|walk/.test(value))
    return 'fitness';
  if (/social|family|friend|community|relationship/.test(value))
    return 'social';
  if (/recreation|leisure|rest|film|game|hobby/.test(value))
    return 'recreation';
  if (/creative|art|music|writing|design|making/.test(value)) return 'creative';
  if (/explor|outdoor|travel|adventure|nature/.test(value))
    return 'exploration';
  return 'general';
}

function districtDevelopment(xp: number): 1 | 2 | 3 | 4 | 5 {
  if (xp >= 2_000) return 5;
  if (xp >= 1_200) return 4;
  if (xp >= 720) return 3;
  if (xp >= 360) return 2;
  return 1;
}

export function developmentStage(level: number) {
  return [
    'Small settlement',
    'Early township',
    'Developing district',
    'Established district',
    'Civic landmark',
  ][clamp(level, 1, 5) - 1];
}

function leadingActivity(records: ActivityRecord[]) {
  const groups = new Map<
    string,
    { minutes: number; records: ActivityRecord[] }
  >();
  records.forEach((record) => {
    const current = groups.get(record.activity) ?? { minutes: 0, records: [] };
    current.minutes += record.duration;
    current.records.push(record);
    groups.set(record.activity, current);
  });
  return [...groups].sort(
    (a, b) => b[1].minutes - a[1].minutes || a[0].localeCompare(b[0]),
  )[0];
}

function createLandmarks(
  category: string,
  identity: DistrictIdentity,
  records: ActivityRecord[],
  minutes: number,
  sessions: number,
  longestStreak: number,
  development: number,
  periodLabel: string,
): WorldLandmark[] {
  const categorySlug = slug(category);
  const catalog = identityCatalog[identity];
  const primary = leadingActivity(records);
  const landmarks: WorldLandmark[] = [
    {
      id: `${categorySlug}-district`,
      category,
      kind: 'district',
      title: `${category} ${catalog.core}`,
      represents: `${catalog.terrain} generated from every ${category} record in this period.`,
      metric: `${formatMinutes(minutes)} across ${sessions} records`,
      rule: 'Every category with at least one valid record creates a district landmark.',
      periodLabel,
      sourceRecordIds: records.map((record) => record.id),
    },
  ];

  if (primary && primary[1].records.length >= 2) {
    landmarks.push({
      id: `${categorySlug}-activity-${slug(primary[0])}`,
      category,
      kind: 'activity',
      title: primary[0],
      represents: `The activity contributing the most recorded time inside ${category}.`,
      metric: `${formatMinutes(primary[1].minutes)} across ${primary[1].records.length} records`,
      rule: 'Appears when an activity occurs at least twice; ties use the activity name alphabetically.',
      periodLabel,
      sourceRecordIds: primary[1].records.map((record) => record.id),
    });
  }

  if (longestStreak >= 5) {
    landmarks.push({
      id: `${categorySlug}-streak`,
      category,
      kind: 'streak',
      title: `${longestStreak}-day Beacon`,
      represents: `A visible marker for consecutive days containing ${category} records.`,
      metric: `Longest streak: ${longestStreak} days`,
      rule: 'Appears when the category’s longest active-day streak reaches five days.',
      periodLabel,
      sourceRecordIds: records.map((record) => record.id),
    });
  }

  if (development >= 4) {
    const milestoneHours = Math.floor(minutes / 600) * 10;
    landmarks.push({
      id: `${categorySlug}-milestone`,
      category,
      kind: 'milestone',
      title: `${Math.max(10, milestoneHours)}-Hour Marker`,
      represents: `Accumulated recorded time that helped establish the ${category} district.`,
      metric: `${formatMinutes(minutes)} currently represented`,
      rule: 'Appears at district development level 4 or 5; its label uses completed ten-hour bands.',
      periodLabel,
      sourceRecordIds: records.map((record) => record.id),
    });
  }

  return landmarks;
}

function createConnections(
  records: ActivityRecord[],
  districts: DistrictBlueprint[],
): WorldConnection[] {
  const districtNames = new Set(districts.map((district) => district.category));
  const orderedNames = districts
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((district) => district.category);
  const transitions = new Map<
    string,
    { from: string; to: string; strength: number }
  >();
  const sorted = [...records].sort((a, b) =>
    `${a.date}|${a.startTime ?? '00:00'}|${a.category}`.localeCompare(
      `${b.date}|${b.startTime ?? '00:00'}|${b.category}`,
    ),
  );

  sorted.forEach((record, index) => {
    const next = sorted[index + 1];
    if (
      !next ||
      next.date !== record.date ||
      next.category === record.category ||
      !districtNames.has(record.category) ||
      !districtNames.has(next.category)
    )
      return;
    const pair = [record.category, next.category].sort(
      (a, b) => orderedNames.indexOf(a) - orderedNames.indexOf(b),
    );
    const id = `${slug(pair[0])}-${slug(pair[1])}`;
    const current = transitions.get(id) ?? {
      from: pair[0],
      to: pair[1],
      strength: 0,
    };
    current.strength += 1;
    transitions.set(id, current);
  });

  const connections = [...transitions].map(([id, transition]) => ({
    id,
    from: transition.from,
    to: transition.to,
    strength: transition.strength,
    kind:
      transition.strength >= 6
        ? ('bridge' as const)
        : transition.strength >= 3
          ? ('road' as const)
          : ('trail' as const),
    explanation: `${transition.strength} same-day transitions connected these districts.`,
  }));

  orderedNames.slice(1).forEach((category, index) => {
    const from = orderedNames[index];
    const id = `${slug(from)}-${slug(category)}`;
    const reverse = `${slug(category)}-${slug(from)}`;
    if (
      !connections.some(
        (connection) => connection.id === id || connection.id === reverse,
      )
    ) {
      connections.push({
        id,
        from,
        to: category,
        strength: 0,
        kind: 'trail',
        explanation:
          'A quiet trail keeps every recorded district part of one world.',
      });
    }
  });

  return connections.sort(
    (a, b) => b.strength - a.strength || a.id.localeCompare(b.id),
  );
}

export function createWorldConfiguration(
  analytics: Analytics,
  periodKey = 'all',
  categoryOrder: string[] = analytics.categories.map(
    (category) => category.category,
  ),
): WorldConfiguration {
  const order = [
    ...categoryOrder,
    ...analytics.categories
      .map((category) => category.category)
      .filter((category) => !categoryOrder.includes(category)),
  ];
  const periodLabel = periodKey === 'all' ? 'All recorded time' : periodKey;
  const districts = analytics.categories
    .slice(0, 6)
    .map((category, rank): DistrictBlueprint => {
      const records = sortWorldRecords(
        analytics.records.filter(
          (record) => record.category === category.category,
        ),
      );
      const identity = districtIdentity(category.category);
      const development = districtDevelopment(category.xp);
      const slot = Math.max(0, order.indexOf(category.category)) % 6;
      return {
        category: category.category,
        identity,
        slot,
        color:
          identity === 'general'
            ? (WORLD_COLORS[slot] ?? WORLD_COLORS[rank])
            : WORLD_IDENTITY_COLORS[identity],
        footprint: 0.8 + Math.min(0.34, category.share * 0.9),
        development,
        stage: developmentStage(development),
        elevation: 9 + development * 4,
        structureCount: clamp(
          1 + development + Math.floor(category.sessions / 12),
          2,
          9,
        ),
        activityNodeCount: clamp(Math.ceil(category.sessions / 4), 1, 12),
        vegetationCount: clamp(Math.ceil(category.consistency / 14), 1, 8),
        vitality: clamp(
          category.sessions / Math.max(8, analytics.activeDays * 0.55),
          0.12,
          1,
        ),
        minutes: category.minutes,
        share: category.share,
        sessions: category.sessions,
        consistency: category.consistency,
        longestStreak: category.longestStreak,
        leadingActivity: leadingActivity(records)?.[0] ?? 'Recorded activity',
        landmarks: createLandmarks(
          category.category,
          identity,
          records,
          category.minutes,
          category.sessions,
          category.longestStreak,
          development,
          periodLabel,
        ),
        sourceRecordIds: records.map((record) => record.id),
      };
    })
    .sort((a, b) => a.slot - b.slot);

  const atmosphere = (Object.entries(analytics.timeOfDay)
    .sort((a, b) => b[1] - a[1])[0]?.[0]
    .toLowerCase() ?? 'afternoon') as WorldConfiguration['atmosphere'];
  return {
    fingerprint: hashRecords(analytics.records, periodKey),
    periodKey,
    atmosphere,
    intensity: clamp(
      analytics.sessions / Math.max(1, analytics.activeDays * 2),
      0.15,
      1,
    ),
    districts,
    connections: createConnections(analytics.records, districts),
  };
}

function recordsForAchievement(
  records: ActivityRecord[],
  predicate: (record: ActivityRecord) => boolean,
) {
  return records.filter(predicate).map((record) => record.id);
}

export function createAchievements(analytics: Analytics): Achievement[] {
  const records = sortWorldRecords(analytics.records);
  const months = new Map<string, ActivityRecord[]>();
  records.forEach((record) =>
    months.set(monthKey(record.date), [
      ...(months.get(monthKey(record.date)) ?? []),
      record,
    ]),
  );
  const consistentMonth = [...months.entries()]
    .map(([month, monthRecords]) => ({
      month,
      summary: summarize(monthRecords, month),
    }))
    .find(
      ({ summary }) => summary.activeDays >= 10 && summary.consistency >= 65,
    );
  const longSession =
    analytics.longestSession && analytics.longestSession.duration >= 180
      ? analytics.longestSession
      : null;
  const established = analytics.categories.find(
    (category) => category.minutes >= 3_000,
  );
  const establishedRecords = established
    ? recordsForAchievement(
        records,
        (record) => record.category === established.category,
      )
    : [];

  return [
    {
      id: 'first-record',
      title: 'First Record',
      description: 'The first piece of recorded terrain.',
      rule: 'Unlocks with at least one valid record.',
      unlocked: records.length >= 1,
      evidence: records.length
        ? `${records.length} valid records available`
        : 'No valid records yet',
      sourceRecordIds: records.slice(0, 1).map((record) => record.id),
    },
    {
      id: 'seven-day-streak',
      title: 'Seven-Day Trail',
      description: 'A continuous path across seven active dates.',
      rule: 'Unlocks when the overall longest active-day streak reaches seven days.',
      unlocked: analytics.longestStreak >= 7,
      evidence: `Longest streak: ${analytics.longestStreak} days`,
      sourceRecordIds: records.map((record) => record.id),
    },
    {
      id: 'hundred-hours',
      title: 'Hundred-Hour Atlas',
      description: 'A substantial accumulated record of time.',
      rule: 'Unlocks at 6,000 total recorded minutes.',
      unlocked: analytics.totalMinutes >= 6_000,
      evidence: `${formatMinutes(analytics.totalMinutes)} recorded`,
      sourceRecordIds: records.map((record) => record.id),
    },
    {
      id: 'five-categories',
      title: 'Five Districts Explored',
      description: 'A world containing at least five recorded categories.',
      rule: 'Unlocks when five distinct categories contain valid records.',
      unlocked: analytics.categories.length >= 5,
      evidence: `${analytics.categories.length} categories represented`,
      sourceRecordIds: records.map((record) => record.id),
    },
    {
      id: 'long-session',
      title: 'Long Session',
      description: 'One record sustained for at least three hours.',
      rule: 'Unlocks when a single record reaches 180 minutes.',
      unlocked: Boolean(longSession),
      evidence: longSession
        ? `${longSession.activity}: ${formatMinutes(longSession.duration)}`
        : `Longest session: ${formatMinutes(analytics.longestSession?.duration ?? 0)}`,
      sourceRecordIds: longSession ? [longSession.id] : [],
    },
    {
      id: 'consistent-month',
      title: 'Consistent Month',
      description: 'A month with enough observations and regular activity.',
      rule: 'Unlocks when one month has at least 10 active days and consistency of 65 or higher.',
      unlocked: Boolean(consistentMonth),
      evidence: consistentMonth
        ? `${consistentMonth.month}: ${consistentMonth.summary.activeDays} active days, consistency ${consistentMonth.summary.consistency}`
        : 'No qualifying month in this view',
      sourceRecordIds:
        consistentMonth?.summary.records.map((record) => record.id) ?? [],
    },
    {
      id: 'district-established',
      title: 'District Established',
      description:
        'One category accumulated enough time to become established.',
      rule: 'Unlocks when a category reaches 3,000 recorded minutes.',
      unlocked: Boolean(established),
      evidence: established
        ? `${established.category}: ${formatMinutes(established.minutes)}`
        : 'No category has reached 50 hours',
      sourceRecordIds: establishedRecords,
    },
  ];
}

function equipmentForIdentity(
  identity: DistrictIdentity,
  category: string,
  share: number,
): CharacterEquipment | null {
  if (identity === 'general') return null;
  const equipment = equipmentCatalog[identity];
  return {
    ...equipment,
    category,
    reason: `${category} accounts for ${Math.round(share * 100)}% of tracked time in this world.`,
  };
}

function characterArchetypeSelection(analytics: Analytics): {
  archetypeId: CharacterArchetypeId;
  identity: DistrictIdentity;
  minutes: number;
  share: number;
  specialist: boolean;
} {
  const minutesByIdentity = new Map<DistrictIdentity, number>();
  analytics.categories.forEach((category) => {
    const identity = districtIdentity(category.category);
    minutesByIdentity.set(
      identity,
      (minutesByIdentity.get(identity) ?? 0) + category.minutes,
    );
  });
  const represented = [...minutesByIdentity.entries()];
  const candidates = represented.some(([identity]) => identity !== 'general')
    ? represented.filter(([identity]) => identity !== 'general')
    : represented;
  const selected = candidates.sort(
    (a, b) =>
      b[1] - a[1] ||
      identityTieOrder.indexOf(a[0]) - identityTieOrder.indexOf(b[0]),
  )[0] ?? ['general', 0];
  const share = analytics.totalMinutes
    ? selected[1] / analytics.totalMinutes
    : 0;
  const specialistArchetype = specialistArchetypeForIdentity[selected[0]];
  const specialist = Boolean(
    specialistArchetype && share >= SPECIALIST_SHARE_THRESHOLD,
  );
  return {
    archetypeId:
      specialist && specialistArchetype
        ? specialistArchetype
        : archetypeForIdentity[selected[0]],
    identity: selected[0],
    minutes: selected[1],
    share,
    specialist,
  };
}

export function selectCharacterArchetype(
  analytics: Analytics,
): CharacterArchetypeId {
  return characterArchetypeSelection(analytics).archetypeId;
}

export function createCharacterProfile(
  analytics: Analytics,
  currentLocation?: string,
): CharacterProfile {
  const primary = analytics.categories[0];
  const archetypeSelection = characterArchetypeSelection(analytics);
  const archetypeId = archetypeSelection.archetypeId;
  const archetype = archetypeCatalog[archetypeId];
  const equipment = analytics.categories
    .filter((category, index) => index === 0 || category.share >= 0.12)
    .map((category) =>
      equipmentForIdentity(
        districtIdentity(category.category),
        category.category,
        category.share,
      ),
    )
    .filter((item): item is CharacterEquipment => Boolean(item))
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 3);
  if (!equipment.some((item) => item.id === 'compass'))
    equipment.unshift({
      id: 'compass',
      name: 'Brass Compass',
      reason:
        'Every LifeMap protagonist carries the instrument that connects recorded districts.',
    });

  const achievements = createAchievements(analytics);
  const unlocked = achievements.filter(
    (achievement) => achievement.unlocked,
  ).length;
  const title =
    analytics.level >= 10
      ? 'Architect of the Known World'
      : unlocked >= 5
        ? 'Keeper of Recorded Paths'
        : analytics.categories.length >= 5
          ? 'Wayfinder of Many Roads'
          : analytics.level >= 5
            ? 'District Pathfinder'
            : 'New Cartographer';
  const evolutionTier = (
    analytics.level >= 25
      ? 5
      : analytics.level >= 15
        ? 4
        : analytics.level >= 9
          ? 3
          : analytics.level >= 5
            ? 2
            : 1
  ) as 1 | 2 | 3 | 4 | 5;
  const evolutionLabel = [
    'Trailborn',
    'Pathfinder',
    'Realmwalker',
    'Atlas Keeper',
    'World Architect',
  ][evolutionTier - 1];

  return {
    archetypeId,
    archetypeName: archetype.name,
    archetypeDescription: archetype.description,
    archetypeEvidence:
      analytics.totalMinutes > 0
        ? `${identityDisplayName[archetypeSelection.identity]} contributes ${Math.round(archetypeSelection.share * 100)}% of tracked time and is the strongest recognized life-domain signal. ${archetypeSelection.specialist ? `That meets the ${Math.round(SPECIALIST_SHARE_THRESHOLD * 100)}% specialist threshold, revealing a concentrated form.` : 'Its broader mix reveals the core form for that domain.'}`
        : 'No recorded domain is available yet, so LifeMap begins with the general Wayfinder form.',
    portraitSrc: archetype.portraitSrc,
    title,
    evolutionTier,
    evolutionLabel,
    level: analytics.level,
    totalXp: analytics.totalXp,
    xpInLevel: analytics.xpInLevel,
    xpToNext: analytics.xpToNext,
    currentLocation: currentLocation || primary?.category || 'Unmapped edge',
    primaryCategory: primary?.category,
    equipment,
    attributes: [
      {
        id: 'allocation',
        label: 'Primary allocation',
        value: Math.round((primary?.share ?? 0) * 100),
        evidence: primary
          ? `${primary.category} holds ${Math.round(primary.share * 100)}% of tracked time.`
          : 'No category share available.',
      },
      {
        id: 'rhythm',
        label: 'Recorded rhythm',
        value: analytics.consistency,
        evidence: `Overall consistency is ${analytics.consistency}/100.`,
      },
      {
        id: 'range',
        label: 'District range',
        value: clamp(analytics.categories.length * 18, 0, 100),
        evidence: `${analytics.categories.length} distinct categories are represented.`,
      },
      {
        id: 'streak',
        label: 'Trail continuity',
        value: clamp(analytics.longestStreak * 9, 0, 100),
        evidence: `Longest active-day streak is ${analytics.longestStreak} days.`,
      },
    ],
    achievements,
  };
}
