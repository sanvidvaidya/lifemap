import { describe, expect, it } from 'vitest';

import {
  mappingRecipeKey,
  mergeActivityRecords,
  normalizeRows,
  parseCsv,
  parseJson,
  parseLifeMapPassport,
  suggestMapping,
} from '../src/data/import';
import { passportJson } from '../src/export';

describe('activity import', () => {
  it('parses quoted CSV fields and embedded commas', () => {
    const rows = parseCsv('Date,Activity,Category,Duration\n2026-08-01,"Read, annotate",Learning,90');
    expect(rows).toEqual([{ Date: '2026-08-01', Activity: 'Read, annotate', Category: 'Learning', Duration: '90' }]);
  });

  it('rejects malformed CSV quotes', () => {
    expect(() => parseCsv('Date,Activity\n2026-08-01,"Unclosed')).toThrow(/unclosed/i);
  });

  it('parses JSON arrays and activities envelopes', () => {
    expect(parseJson('[{"date":"2026-08-01"}]')).toHaveLength(1);
    expect(parseJson('{"activities":[{"date":"2026-08-01"}]}')).toHaveLength(1);
    expect(() => parseJson('{broken')).toThrow(/malformed/i);
  });

  it('detects common aliases without guessing unknown columns', () => {
    expect(suggestMapping(['day', 'task', 'group', 'duration_minutes', 'mystery'])).toMatchObject({ date: 'day', activity: 'task', category: 'group', duration: 'duration_minutes' });
  });

  it('derives duration from start and end times', () => {
    const result = normalizeRows([{ Day: '2026-08-01', Task: 'Walk', Group: 'Outdoors', Start: '09:15', End: '10:45' }], { date: 'Day', activity: 'Task', category: 'Group', startTime: 'Start', endTime: 'End' });
    expect(result.records[0].duration).toBe(90);
    expect(result.records[0].startTime).toBe('09:15');
  });

  it('skips invalid and duplicate rows with human-readable issues', () => {
    const rows = [
      { date: '2026-08-01', activity: 'Walk', category: 'Outdoors', minutes: '60' },
      { date: '2026-08-01', activity: 'Walk', category: 'Outdoors', minutes: '60' },
      { date: 'not-a-date', activity: 'Broken', category: 'Test', minutes: '-20' },
    ];
    const result = normalizeRows(rows, { date: 'date', activity: 'activity', category: 'category', duration: 'minutes' });
    expect(result.records).toHaveLength(1);
    expect(result.duplicateCount).toBe(1);
    expect(result.issues.some((issue) => issue.message.includes('Invalid or missing date'))).toBe(true);
    expect(result.issues.some((issue) => issue.message.includes('Duplicate'))).toBe(true);
  });

  it('requires explicit mandatory mappings', () => {
    const result = normalizeRows([{ a: 1 }], {});
    expect(result.records).toHaveLength(0);
    expect(result.issues.filter((issue) => issue.row === 0)).toHaveLength(3);
  });

  it('appends only genuinely new records across imports', () => {
    const existing = [{ id: 'old', date: '2026-08-01', activity: 'Walk', category: 'Fitness', duration: 30 }];
    const incoming = [
      { id: 'again', date: '2026-08-01', activity: 'Walk', category: 'Fitness', duration: 30 },
      { id: 'new', date: '2026-08-02', activity: 'Read', category: 'Learning', duration: 45 },
    ];
    const result = mergeActivityRecords(existing, incoming);
    expect(result.records).toHaveLength(2);
    expect(result.added).toHaveLength(1);
    expect(result.duplicateCount).toBe(1);
  });

  it('round-trips a validated portable Passport', () => {
    const records = [{ id: 'one', date: '2026-08-01', activity: 'Walk', category: 'Fitness', duration: 30 }];
    const recipes = { [mappingRecipeKey(['date', 'activity'])]: { date: 'date', activity: 'activity' } };
    const restored = parseLifeMapPassport(passportJson(records, { displayName: 'Ari', accent: '#67d2a7', avatarStyle: 'field' }, recipes));
    expect(restored.records).toHaveLength(1);
    expect(restored.preferences).toMatchObject({ displayName: 'Ari', accent: '#67d2a7', avatarStyle: 'field' });
    expect(restored.mappingRecipes).toEqual(recipes);
  });
});

