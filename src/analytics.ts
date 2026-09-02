import type { ActivityRecord, Analytics, Association, CategoryStats, Insight, PeriodSummary } from './types';

const DAY_MS = 86_400_000;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const average = (values: number[]) => values.length ? sum(values) / values.length : undefined;
const unique = <T,>(values: T[]) => [...new Set(values)];
const dayIndex = (date: string) => Math.floor(new Date(`${date}T12:00:00Z`).getTime() / DAY_MS);
const formatHours = (minutes: number) => minutes < 60 ? `${Math.round(minutes)}m` : `${(minutes / 60).toFixed(minutes % 60 ? 1 : 0)}h`;

export function levelFromXp(xp: number) {
  let level = 1;
  while (xp >= Math.round(120 * Math.pow(level, 1.55))) level += 1;
  const floor = level === 1 ? 0 : Math.round(120 * Math.pow(level - 1, 1.55));
  const ceiling = Math.round(120 * Math.pow(level, 1.55));
  return { level, xpInLevel: xp - floor, xpToNext: ceiling - xp };
}

function streaks(dates: string[]) {
  const indexes = unique(dates).map(dayIndex).sort((a, b) => a - b);
  if (!indexes.length) return { longestStreak: 0, longestGap: 0, gapRegularity: 0 };
  let longestStreak = 1; let current = 1; let longestGap = 0; const gaps: number[] = [];
  for (let index = 1; index < indexes.length; index += 1) {
    const gap = indexes[index] - indexes[index - 1]; gaps.push(gap);
    if (gap === 1) { current += 1; longestStreak = Math.max(longestStreak, current); } else current = 1;
    longestGap = Math.max(longestGap, gap - 1);
  }
  const mean = average(gaps) ?? 0; const variance = average(gaps.map((gap) => Math.pow(gap - mean, 2))) ?? 0;
  const gapRegularity = gaps.length ? 1 / (1 + Math.sqrt(variance)) : 1;
  return { longestStreak, longestGap, gapRegularity };
}

function categoryStats(category: string, records: ActivityRecord[], totalMinutes: number, spanDays: number): CategoryStats {
  const items = records.filter((record) => record.category === category); const minutes = sum(items.map((record) => record.duration));
  const dates = unique(items.map((record) => record.date)); const streak = streaks(dates);
  const frequency = Math.min(1, dates.length / Math.max(1, spanDays * .35));
  const streakStrength = Math.min(1, streak.longestStreak / 7);
  const consistency = Math.round((frequency * .5 + streak.gapRegularity * .3 + streakStrength * .2) * 100);
  const completedPlans = items.filter((record) => record.planned && record.completed).length;
  const xp = Math.round(minutes / 3 + items.length * 8 + consistency * 2 + completedPlans * 18);
  return { category, minutes, share: totalMinutes ? minutes / totalMinutes : 0, sessions: items.length, activeDays: dates.length, averageDuration: items.length ? minutes / items.length : 0, consistency, longestStreak: streak.longestStreak, longestGap: streak.longestGap, xp, ...levelFromXp(xp) };
}

function dateSpan(records: ActivityRecord[]) {
  if (!records.length) return { start: '', end: '', days: 0 };
  const dates = records.map((record) => record.date).sort();
  return { start: dates[0], end: dates.at(-1)!, days: dayIndex(dates.at(-1)!) - dayIndex(dates[0]) + 1 };
}

export function monthKey(date: string) { return date.slice(0, 7); }
export function monthLabel(month: string) { return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T12:00:00Z`)); }
export function availableMonths(records: ActivityRecord[]) { return unique(records.map((record) => monthKey(record.date))).sort(); }
export function recordsForMonth(records: ActivityRecord[], month: string) { return month === 'all' ? records : records.filter((record) => monthKey(record.date) === month); }

function associationFor(category: string, metric: 'energy' | 'mood', records: ActivityRecord[]): Association | null {
  const withMetric = records.filter((record) => typeof record[metric] === 'number');
  const inside = withMetric.filter((record) => record.category === category).map((record) => record[metric] as number);
  const outside = withMetric.filter((record) => record.category !== category).map((record) => record[metric] as number);
  if (inside.length < 5 || outside.length < 5) return null;
  const difference = (average(inside) ?? 0) - (average(outside) ?? 0); if (Math.abs(difference) < .15) return null;
  const direction = difference > 0 ? 'higher' : 'lower';
  return { label: `${category} and recorded ${metric}`, detail: `Recorded ${metric} was ${Math.abs(difference).toFixed(1)} points ${direction} during ${category} records than during other records. This is an association, not evidence of causation.`, sampleSize: inside.length + outside.length, difference };
}

export function summarize(records: ActivityRecord[], label = 'Selected period'): PeriodSummary {
  const span = dateSpan(records); const totalMinutes = sum(records.map((record) => record.duration));
  const categories = unique(records.map((record) => record.category)).map((category) => categoryStats(category, records, totalMinutes, span.days)).sort((a, b) => b.minutes - a.minutes);
  const overallStreak = streaks(records.map((record) => record.date));
  const frequency = Math.min(1, unique(records.map((record) => record.date)).length / Math.max(1, span.days * .55));
  const consistency = Math.round((frequency * .55 + overallStreak.gapRegularity * .3 + Math.min(1, overallStreak.longestStreak / 10) * .15) * 100);
  const planned = records.filter((record) => record.planned); const energy = records.flatMap((record) => typeof record.energy === 'number' ? [record.energy] : []); const mood = records.flatMap((record) => typeof record.mood === 'number' ? [record.mood] : []);
  return { label, records, totalMinutes, sessions: records.length, activeDays: unique(records.map((record) => record.date)).length, consistency, completionRate: planned.length ? planned.filter((record) => record.completed).length / planned.length : undefined, averageEnergy: average(energy), averageMood: average(mood), categories };
}

export function comparePeriods(a: ActivityRecord[], b: ActivityRecord[], aLabel: string, bLabel: string) {
  const first = summarize(a, aLabel); const second = summarize(b, bLabel);
  const change = (current: number, previous: number) => previous ? (current - previous) / previous : undefined;
  return { first, second, changes: { trackedTime: change(second.totalMinutes, first.totalMinutes), sessions: change(second.sessions, first.sessions), activeDays: change(second.activeDays, first.activeDays), consistency: second.consistency - first.consistency, completion: first.completionRate != null && second.completionRate != null ? second.completionRate - first.completionRate : undefined, energy: first.averageEnergy != null && second.averageEnergy != null ? second.averageEnergy - first.averageEnergy : undefined, mood: first.averageMood != null && second.averageMood != null ? second.averageMood - first.averageMood : undefined } };
}

export function analyze(records: ActivityRecord[]): Analytics {
  const summary = summarize(records); const span = dateSpan(records); const overallStreak = streaks(records.map((record) => record.date));
  const byDate = new Map<string, number>(); const byWeek = new Map<string, number>(); const byMonth = new Map<string, number>();
  const dayOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => ({ day, minutes: 0 }));
  const timeOfDay = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  const sorted = [...records].sort((a, b) => `${a.date} ${a.startTime ?? '00:00'}`.localeCompare(`${b.date} ${b.startTime ?? '00:00'}`)); let contextSwitches = 0;
  sorted.forEach((record, index) => {
    byDate.set(record.date, (byDate.get(record.date) ?? 0) + record.duration);
    const date = new Date(`${record.date}T12:00:00Z`); const weekStart = new Date(date); weekStart.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7)); const week = weekStart.toISOString().slice(0, 10);
    byWeek.set(week, (byWeek.get(week) ?? 0) + record.duration); byMonth.set(monthKey(record.date), (byMonth.get(monthKey(record.date)) ?? 0) + record.duration); dayOfWeek[date.getUTCDay()].minutes += record.duration;
    const hour = Number(record.startTime?.slice(0, 2) ?? 12); const bucket = hour >= 5 && hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : hour < 22 ? 'Evening' : 'Night'; timeOfDay[bucket] += record.duration;
    const previous = sorted[index - 1]; if (previous?.date === record.date && previous.category !== record.category) contextSwitches += 1;
  });
  const associations = summary.categories.flatMap((category) => [associationFor(category.category, 'energy', records), associationFor(category.category, 'mood', records)]).filter((item): item is Association => Boolean(item)).sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference)).slice(0, 4);
  const longestSession = records.length ? records.reduce((longest, record) => record.duration > longest.duration ? record : longest) : null;
  const top = summary.categories[0]; const topTime = Object.entries(timeOfDay).sort((a,b) => b[1] - a[1])[0]; const insights: Insight[] = [];
  if (top) insights.push({ id: 'allocation', title: `${top.category} shaped the largest district`, detail: `${top.category} accounted for ${(top.share * 100).toFixed(0)}% of tracked time.`, evidence: `${formatHours(top.minutes)} across ${top.sessions} records`, tone: 'neutral' });
  if (topTime?.[1]) insights.push({ id: 'time', title: `Activity clustered in the ${topTime[0].toLowerCase()}`, detail: `${Math.round(topTime[1] / Math.max(1, summary.totalMinutes) * 100)}% of tracked time began in the ${topTime[0].toLowerCase()} window.`, evidence: `${formatHours(topTime[1])} observed`, tone: 'neutral' });
  if (longestSession) insights.push({ id: 'record', title: 'Longest recorded session', detail: `${longestSession.activity} was the longest uninterrupted record at ${formatHours(longestSession.duration)}.`, evidence: `${longestSession.date} · ${longestSession.category}`, tone: 'neutral' });
  if (summary.completionRate != null) insights.push({ id: 'completion', title: 'Planned versus completed', detail: `${Math.round(summary.completionRate * 100)}% of records marked as planned were also marked completed.`, evidence: `${records.filter((record) => record.planned).length} planned records`, tone: summary.completionRate >= .75 ? 'up' : 'neutral' });
  associations.slice(0, 1).forEach((association) => insights.push({ id: 'association', title: association.label, detail: association.detail, evidence: `n = ${association.sampleSize}`, tone: association.difference > 0 ? 'up' : 'down' }));
  const totalXp = sum(summary.categories.map((category) => category.xp));
  return { ...summary, dateStart: span.start, dateEnd: span.end, averageDuration: records.length ? summary.totalMinutes / records.length : 0, longestSession, shortSessions: records.filter((record) => record.duration > 0 && record.duration < 30).length, contextSwitches, longestStreak: overallStreak.longestStreak, longestGap: overallStreak.longestGap, dailyMinutes: [...byDate].map(([date, minutes]) => ({ date, minutes })).sort((a,b) => a.date.localeCompare(b.date)), weeklyMinutes: [...byWeek].map(([week, minutes]) => ({ week, minutes })).sort((a,b) => a.week.localeCompare(b.week)), monthlyMinutes: [...byMonth].map(([month, minutes]) => ({ month, minutes })).sort((a,b) => a.month.localeCompare(b.month)), timeOfDay, dayOfWeek, associations, insights, totalXp, ...levelFromXp(totalXp) };
}

export const formatDuration = formatHours;
export const percentageChange = (value?: number) => value == null ? 'Not enough data' : `${value >= 0 ? '+' : ''}${(value * 100).toFixed(0)}%`;
