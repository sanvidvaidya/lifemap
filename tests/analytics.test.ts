import { describe, expect, it } from 'vitest';

import { analyze, availableMonths, comparePeriods, levelFromXp, recordsForMonth } from '../src/analytics';
import { createDemoData } from '../src/data/demo';
import type { ActivityRecord } from '../src/types';

const sample: ActivityRecord[] = [
  { id: '1', date: '2026-01-01', activity: 'Read', category: 'Learning', duration: 60, energy: 4, mood: 4, planned: true, completed: true },
  { id: '2', date: '2026-01-02', activity: 'Read', category: 'Learning', duration: 120, energy: 5, mood: 4, planned: true, completed: true },
  { id: '3', date: '2026-01-04', activity: 'Walk', category: 'Fitness', duration: 30, energy: 3, mood: 4, planned: true, completed: false },
];

describe('analytics engine', () => {
  it('aggregates time allocation and average duration', () => {
    const result = analyze(sample);
    expect(result.totalMinutes).toBe(210);
    expect(result.averageDuration).toBe(70);
    expect(result.categories[0].category).toBe('Learning');
    expect(result.categories[0].share).toBeCloseTo(180 / 210);
  });

  it('calculates streaks, gaps, completion, fragmentation, and distributions', () => {
    const result = analyze(sample);
    expect(result.longestStreak).toBe(2);
    expect(result.longestGap).toBe(1);
    expect(result.completionRate).toBeCloseTo(2 / 3);
    expect(result.longestSession?.duration).toBe(120);
    expect(result.timeOfDay.Afternoon).toBe(210);
    expect(result.dayOfWeek.reduce((total, day) => total + day.minutes, 0)).toBe(210);
  });

  it('keeps consistency and level formulas bounded and reproducible', () => {
    const first = analyze(sample); const second = analyze(sample);
    expect(first.consistency).toBeGreaterThanOrEqual(0); expect(first.consistency).toBeLessThanOrEqual(100);
    expect(first.totalXp).toBe(second.totalXp);
    expect(levelFromXp(0)).toEqual({ level: 1, xpInLevel: 0, xpToNext: 120 });
    expect(levelFromXp(500).level).toBeGreaterThan(1);
  });

  it('handles empty data without fabricated observations', () => {
    const result = analyze([]);
    expect(result.totalMinutes).toBe(0);
    expect(result.categories).toEqual([]);
    expect(result.insights).toEqual([]);
    expect(result.associations).toEqual([]);
  });

  it('supports period-over-period comparison', () => {
    const demo = createDemoData(); const months = availableMonths(demo);
    const comparison = comparePeriods(recordsForMonth(demo, months[0]), recordsForMonth(demo, months[1]), months[0], months[1]);
    expect(comparison.first.records.length).toBeGreaterThan(0);
    expect(comparison.second.records.length).toBeGreaterThan(0);
    expect(comparison.changes.trackedTime).toBeTypeOf('number');
  });

  it('only reports associations with sufficient samples and honest wording', () => {
    const result = analyze(createDemoData());
    expect(result.associations.length).toBeGreaterThan(0);
    expect(result.associations.every((association) => association.sampleSize >= 10)).toBe(true);
    expect(result.associations.every((association) => /not evidence of causation/i.test(association.detail))).toBe(true);
  });
});

