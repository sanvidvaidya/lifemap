import { describe, expect, it } from 'vitest';

import { analyze, availableMonths } from '../src/analytics';
import { createDemoData } from '../src/data/demo';
import { normalizeRows, parseCsv, parseJson, suggestMapping } from '../src/data/import';
import { capsuleHtml, normalizedCsv } from '../src/export';

describe('end-to-end local data pipeline', () => {
  it('turns CSV into normalized records, analytics, world periods, and exports', () => {
    const csv = 'Date,Activity,Category,Duration,Energy,Mood\n2026-07-01,Sketch,Creative,60,4,5\n2026-08-01,Walk,Outdoors,45,5,5';
    const rows = parseCsv(csv); const mapping = suggestMapping(Object.keys(rows[0])); const normalized = normalizeRows(rows, mapping); const analytics = analyze(normalized.records);
    expect(normalized.records).toHaveLength(2);
    expect(analytics.categories.map((item) => item.category)).toEqual(expect.arrayContaining(['Creative', 'Outdoors']));
    expect(availableMonths(normalized.records)).toEqual(['2026-07', '2026-08']);
    expect(normalizedCsv(normalized.records)).toContain('"Sketch"');
    expect(capsuleHtml(normalized.records, analytics)).toContain('LifeMap Capsule');
  });

  it('turns JSON into the same canonical model', () => {
    const rows = parseJson(JSON.stringify({ activities: [{ day: '2026-08-01', task: 'Run', group: 'Fitness', minutes: 30 }] }));
    const result = normalizeRows(rows, suggestMapping(Object.keys(rows[0])));
    expect(result.records[0]).toMatchObject({ date: '2026-08-01', activity: 'Run', category: 'Fitness', duration: 30 });
  });

  it('creates deterministic fictional demo data with multiple periods and optional values', () => {
    const first = createDemoData(); const second = createDemoData();
    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(150);
    expect(new Set(first.map((record) => record.category)).size).toBeGreaterThanOrEqual(5);
    expect(availableMonths(first).length).toBeGreaterThanOrEqual(4);
    expect(first.some((record) => record.completed === false)).toBe(true);
  });

  it('escapes imported strings in standalone capsule HTML', () => {
    const rows = [{ date: '2026-08-01', activity: '<img src=x onerror=alert(1)>', category: '<script>bad</script>', duration: 30 }];
    const analytics = analyze(rows.map((record, index) => ({ ...record, id: String(index) })));
    const html = capsuleHtml(analytics.records, analytics);
    expect(html).not.toContain('<script>bad</script>');
    expect(html).toContain('&lt;script&gt;bad&lt;/script&gt;');
  });
});
