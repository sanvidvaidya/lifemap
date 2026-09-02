export type ActivityRecord = {
  id: string;
  date: string;
  startTime?: string;
  endTime?: string;
  activity: string;
  category: string;
  subcategory?: string;
  duration: number;
  energy?: number;
  mood?: number;
  planned?: boolean;
  completed?: boolean;
  location?: string;
  notes?: string;
};

export type RawRow = Record<string, unknown>;

export type CanonicalField =
  | 'date'
  | 'startTime'
  | 'endTime'
  | 'activity'
  | 'category'
  | 'subcategory'
  | 'duration'
  | 'energy'
  | 'mood'
  | 'planned'
  | 'completed'
  | 'location'
  | 'notes';

export type FieldMapping = Partial<Record<CanonicalField, string>>;

export type MappingRecipes = Record<string, FieldMapping>;

export type ValidationIssue = {
  row: number;
  severity: 'error' | 'warning';
  message: string;
};

export type ImportResult = {
  records: ActivityRecord[];
  issues: ValidationIssue[];
  duplicateCount: number;
};

export type LifeMapPreferences = {
  displayName: string;
  accent: string;
  avatarStyle: 'trail' | 'city' | 'field';
};

export type LifeMapPassport = {
  format: 'lifemap-passport';
  version: 1;
  exportedAt: string;
  records: ActivityRecord[];
  preferences: LifeMapPreferences;
  mappingRecipes: MappingRecipes;
};

export type PassportImport = {
  records: ActivityRecord[];
  preferences: LifeMapPreferences;
  mappingRecipes: MappingRecipes;
  issues: ValidationIssue[];
};

export type CategoryStats = {
  category: string;
  minutes: number;
  share: number;
  sessions: number;
  activeDays: number;
  averageDuration: number;
  consistency: number;
  longestStreak: number;
  longestGap: number;
  xp: number;
  level: number;
  xpInLevel: number;
  xpToNext: number;
};

export type Insight = {
  id: string;
  title: string;
  detail: string;
  evidence: string;
  tone: 'neutral' | 'up' | 'down';
};

export type Association = {
  label: string;
  detail: string;
  sampleSize: number;
  difference: number;
};

export type PeriodSummary = {
  label: string;
  records: ActivityRecord[];
  totalMinutes: number;
  sessions: number;
  activeDays: number;
  consistency: number;
  completionRate?: number;
  averageEnergy?: number;
  averageMood?: number;
  categories: CategoryStats[];
};

export type Analytics = PeriodSummary & {
  dateStart: string;
  dateEnd: string;
  averageDuration: number;
  longestSession: ActivityRecord | null;
  shortSessions: number;
  contextSwitches: number;
  longestStreak: number;
  longestGap: number;
  dailyMinutes: Array<{ date: string; minutes: number }>;
  weeklyMinutes: Array<{ week: string; minutes: number }>;
  monthlyMinutes: Array<{ month: string; minutes: number }>;
  timeOfDay: Record<'Morning' | 'Afternoon' | 'Evening' | 'Night', number>;
  dayOfWeek: Array<{ day: string; minutes: number }>;
  associations: Association[];
  insights: Insight[];
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpToNext: number;
};

export type DistrictIdentity =
  | 'career'
  | 'learning'
  | 'fitness'
  | 'social'
  | 'recreation'
  | 'creative'
  | 'exploration'
  | 'general';

export type WorldLandmark = {
  id: string;
  category: string;
  kind: 'district' | 'activity' | 'streak' | 'milestone';
  title: string;
  represents: string;
  metric: string;
  rule: string;
  periodLabel: string;
  sourceRecordIds: string[];
};

export type DistrictBlueprint = {
  category: string;
  identity: DistrictIdentity;
  slot: number;
  color: string;
  footprint: number;
  development: 1 | 2 | 3 | 4 | 5;
  stage: string;
  elevation: number;
  structureCount: number;
  activityNodeCount: number;
  vegetationCount: number;
  vitality: number;
  minutes: number;
  share: number;
  sessions: number;
  consistency: number;
  longestStreak: number;
  leadingActivity: string;
  landmarks: WorldLandmark[];
  sourceRecordIds: string[];
};

export type WorldConnection = {
  id: string;
  from: string;
  to: string;
  strength: number;
  kind: 'trail' | 'road' | 'bridge';
  explanation: string;
};

export type WorldConfiguration = {
  fingerprint: string;
  periodKey: string;
  atmosphere: 'morning' | 'afternoon' | 'evening' | 'night';
  intensity: number;
  districts: DistrictBlueprint[];
  connections: WorldConnection[];
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  rule: string;
  unlocked: boolean;
  evidence: string;
  sourceRecordIds: string[];
};

export type CharacterEquipment = {
  id:
    | 'compass'
    | 'codex'
    | 'satchel'
    | 'bracers'
    | 'lantern'
    | 'keepsake'
    | 'sketchbook';
  name: string;
  reason: string;
  category?: string;
};

export type CharacterAttribute = {
  id: 'allocation' | 'rhythm' | 'range' | 'streak';
  label: string;
  value: number;
  evidence: string;
};

export type CharacterArchetypeId =
  | 'wayfinder'
  | 'city-architect'
  | 'guild-forgemaster'
  | 'archive-sage'
  | 'observatory-scholar'
  | 'trail-warden'
  | 'circuit-ranger'
  | 'hearth-envoy'
  | 'festival-herald'
  | 'grovekeeper'
  | 'dream-gardener'
  | 'atelier-weaver';

export type CharacterProfile = {
  archetypeId: CharacterArchetypeId;
  archetypeName: string;
  archetypeDescription: string;
  archetypeEvidence: string;
  portraitSrc: string;
  title: string;
  evolutionTier: 1 | 2 | 3 | 4 | 5;
  evolutionLabel: string;
  level: number;
  totalXp: number;
  xpInLevel: number;
  xpToNext: number;
  currentLocation: string;
  primaryCategory?: string;
  equipment: CharacterEquipment[];
  attributes: CharacterAttribute[];
  achievements: Achievement[];
};

export type AppView =
  | 'world'
  | 'character'
  | 'timeline'
  | 'insights'
  | 'compare'
  | 'data'
  | 'methodology';
