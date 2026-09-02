import type {
  ActivityRecord,
  CanonicalField,
  FieldMapping,
  ImportResult,
  MappingRecipes,
  PassportImport,
  RawRow,
  ValidationIssue,
} from '../types';

export const FIELD_ALIASES: Record<CanonicalField, string[]> = {
  date: ['date', 'day', 'timestamp'], activity: ['activity', 'task', 'event', 'description'], category: ['category', 'type', 'group'],
  duration: ['duration', 'minutes', 'duration_minutes'], startTime: ['start', 'start_time', 'starttime'], endTime: ['end', 'end_time', 'endtime'],
  subcategory: ['subcategory', 'sub_category'], energy: ['energy', 'energy_level'], mood: ['mood', 'mood_score'], planned: ['planned', 'is_planned'],
  completed: ['completed', 'complete', 'done'], location: ['location', 'place'], notes: ['notes', 'note'],
};

export const CANONICAL_FIELDS = Object.keys(FIELD_ALIASES) as CanonicalField[];

export function mappingRecipeKey(columns: string[]) {
  return [...columns]
    .map((column) => column.trim().toLowerCase())
    .sort()
    .join('|');
}

function cleanString(value: unknown, max = 5000) {
  const source = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : value == null ? '' : JSON.stringify(value);
  return Array.from(source).filter((character) => {
    const code = character.charCodeAt(0);
    return code === 9 || code === 10 || code === 13 || code >= 32;
  }).join('').trim().slice(0, max);
}

function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  const normalized = cleanString(value).toLowerCase();
  if (['true', 'yes', '1', 'y', 'done', 'complete'].includes(normalized)) return true;
  if (['false', 'no', '0', 'n', 'incomplete'].includes(normalized)) return false;
  return undefined;
}

function parseScore(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 5 ? parsed : undefined;
}

function normalizeTime(value: unknown) {
  const text = cleanString(value);
  if (!text) return undefined;
  const twelveHour = text.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (twelveHour) {
    let hour = Number(twelveHour[1]) % 12;
    if (twelveHour[3].toLowerCase() === 'pm') hour += 12;
    const minute = Number(twelveHour[2]);
    if (minute < 60) return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  const match = text.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return undefined;
  const hour = Number(match[1]); const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` : undefined;
}

function normalizeDate(value: unknown) {
  const text = cleanString(value);
  if (!text) return undefined;
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const candidate = `${iso[1]}-${iso[2]}-${iso[3]}`;
    const parsed = new Date(`${candidate}T12:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === candidate ? candidate : undefined;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}

function parseDuration(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  const text = cleanString(value).toLowerCase();
  if (!text) return undefined;
  const clock = text.match(/^(\d{1,2}):(\d{2})$/);
  if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
  const hours = text.match(/([\d.]+)\s*h/); const minutes = text.match(/([\d.]+)\s*m/);
  if (hours || minutes) return (Number(hours?.[1] ?? 0) * 60) + Number(minutes?.[1] ?? 0);
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function durationFromTimes(start?: string, end?: string) {
  if (!start || !end) return undefined;
  const toMinutes = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
  let value = toMinutes(end) - toMinutes(start);
  if (value < 0) value += 24 * 60;
  return value;
}

export function recordFingerprint(record: ActivityRecord) {
  return [
    record.date,
    record.startTime ?? '',
    record.activity.trim().toLowerCase(),
    record.category.trim().toLowerCase(),
    Math.round(record.duration * 10) / 10,
  ].join('|');
}

function stableRecordId(fingerprint: string) {
  let hash = 2166136261;
  for (let index = 0; index < fingerprint.length; index += 1) {
    hash ^= fingerprint.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `record-${(hash >>> 0).toString(36)}`;
}

export function mergeActivityRecords(
  existing: ActivityRecord[],
  incoming: ActivityRecord[],
) {
  const seen = new Set(existing.map(recordFingerprint));
  const added: ActivityRecord[] = [];
  let duplicateCount = 0;
  for (const record of incoming) {
    const fingerprint = recordFingerprint(record);
    if (seen.has(fingerprint)) {
      duplicateCount += 1;
      continue;
    }
    seen.add(fingerprint);
    added.push({ ...record, id: stableRecordId(fingerprint) });
  }
  return { records: [...existing, ...added], added, duplicateCount };
}

export function parseCsv(text: string): RawRow[] {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field); field = '';
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else field += char;
  }
  if (quoted) throw new Error('The CSV contains an unclosed quoted value.');
  row.push(field); if (row.some((cell) => cell.trim())) rows.push(row);
  if (rows.length < 2) throw new Error('The CSV needs a header row and at least one data row.');
  const headers = rows[0].map((header, index) => cleanString(header || `column_${index + 1}`, 120));
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

export function parseJson(text: string): RawRow[] {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error('The JSON file is malformed. Check commas, quotes, and brackets.'); }
  const candidate = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' && Array.isArray((parsed as { activities?: unknown }).activities) ? (parsed as { activities: unknown[] }).activities : null);
  if (!candidate) throw new Error('JSON must be an array of activity objects or an object with an activities array.');
  return candidate.filter((value): value is RawRow => Boolean(value) && typeof value === 'object' && !Array.isArray(value));
}

export function suggestMapping(columns: string[]): FieldMapping {
  const result: FieldMapping = {};
  for (const field of CANONICAL_FIELDS) {
    const match = columns.find((column) => FIELD_ALIASES[field].includes(column.toLowerCase().replace(/[\s-]+/g, '_')));
    if (match) result[field] = match;
  }
  return result;
}

export function normalizeRows(rows: RawRow[], mapping: FieldMapping): ImportResult {
  const issues: ValidationIssue[] = []; const records: ActivityRecord[] = []; const seen = new Set<string>(); let duplicateCount = 0;
  for (const required of ['date', 'activity', 'category'] as CanonicalField[]) {
    if (!mapping[required]) issues.push({ row: 0, severity: 'error', message: `Map a source field to ${required}.` });
  }
  if (issues.length) return { records, issues, duplicateCount };

  rows.forEach((raw, index) => {
    const rowNumber = index + 2;
    const value = (field: CanonicalField) => mapping[field] ? raw[mapping[field]!] : undefined;
    const date = normalizeDate(value('date')); const activity = cleanString(value('activity'), 240); const category = cleanString(value('category'), 120);
    const startTime = normalizeTime(value('startTime')); const endTime = normalizeTime(value('endTime'));
    let duration = parseDuration(value('duration')) ?? durationFromTimes(startTime, endTime) ?? 0;
    if (!date) issues.push({ row: rowNumber, severity: 'error', message: 'Invalid or missing date.' });
    if (!activity) issues.push({ row: rowNumber, severity: 'error', message: 'Missing activity.' });
    if (!category) issues.push({ row: rowNumber, severity: 'error', message: 'Missing category.' });
    if (!Number.isFinite(duration) || duration < 0 || duration > 1440) issues.push({ row: rowNumber, severity: 'error', message: 'Duration must be between 0 and 1,440 minutes.' });
    if (!date || !activity || !category || !Number.isFinite(duration) || duration < 0 || duration > 1440) return;
    duration = Math.round(duration * 10) / 10;
    const key = [date, startTime, activity.toLowerCase(), category.toLowerCase(), duration].join('|');
    if (seen.has(key)) { duplicateCount += 1; issues.push({ row: rowNumber, severity: 'warning', message: 'Duplicate row skipped.' }); return; }
    seen.add(key);
    const energy = parseScore(value('energy')); const mood = parseScore(value('mood'));
    if (value('energy') != null && cleanString(value('energy')) && energy == null) issues.push({ row: rowNumber, severity: 'warning', message: 'Energy must be between 1 and 5; value omitted.' });
    if (value('mood') != null && cleanString(value('mood')) && mood == null) issues.push({ row: rowNumber, severity: 'warning', message: 'Mood must be between 1 and 5; value omitted.' });
    records.push({ id: stableRecordId(key), date, startTime, endTime, activity, category, duration, energy, mood, subcategory: cleanString(value('subcategory'), 120) || undefined, planned: parseBoolean(value('planned')), completed: parseBoolean(value('completed')), location: cleanString(value('location'), 240) || undefined, notes: cleanString(value('notes')) || undefined });
  });
  return { records, issues, duplicateCount };
}

function sanitizeMappingRecipes(value: unknown): MappingRecipes {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const recipes: MappingRecipes = {};
  for (const [key, candidate] of Object.entries(value)) {
    if (!key || key.length > 2000 || !candidate || typeof candidate !== 'object' || Array.isArray(candidate)) continue;
    const mapping: FieldMapping = {};
    for (const field of CANONICAL_FIELDS) {
      const source = (candidate as Record<string, unknown>)[field];
      if (typeof source === 'string' && source.length <= 240) mapping[field] = source;
    }
    recipes[key] = mapping;
  }
  return recipes;
}

export function parseLifeMapPassport(text: string): PassportImport {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This Passport is not valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('This is not a LifeMap Passport.');
  }
  const source = parsed as Record<string, unknown>;
  if (source.format !== 'lifemap-passport' || source.version !== 1 || !Array.isArray(source.records)) {
    throw new Error('This Passport format is not supported.');
  }
  const identityMapping = Object.fromEntries(CANONICAL_FIELDS.map((field) => [field, field])) as FieldMapping;
  const normalized = normalizeRows(
    source.records.filter((record): record is RawRow => Boolean(record) && typeof record === 'object' && !Array.isArray(record)),
    identityMapping,
  );
  if (!normalized.records.length) throw new Error('This Passport contains no valid activity records.');
  const preferencesSource = source.preferences && typeof source.preferences === 'object' && !Array.isArray(source.preferences)
    ? source.preferences as Record<string, unknown>
    : {};
  const rawAccent = cleanString(preferencesSource.accent, 16);
  const rawStyle = cleanString(preferencesSource.avatarStyle, 16);
  return {
    records: normalized.records,
    preferences: {
      displayName: cleanString(preferencesSource.displayName, 80),
      accent: /^#[0-9a-f]{6}$/i.test(rawAccent) ? rawAccent : '#e7cc78',
      avatarStyle: rawStyle === 'city' || rawStyle === 'field' ? rawStyle : 'trail',
    },
    mappingRecipes: sanitizeMappingRecipes(source.mappingRecipes),
    issues: normalized.issues,
  };
}
