import { describe, expect, it } from 'vitest';

import { analyze, recordsForMonth } from '../src/analytics';
import { createDemoData } from '../src/data/demo';
import {
  createAchievements,
  createCharacterProfile,
  createWorldConfiguration,
  selectCharacterArchetype,
  WORLD_IDENTITY_COLORS,
} from '../src/world-generation';
import type { ActivityRecord } from '../src/types';

function recordsFor(
  category: string,
  count: number,
  duration = 120,
): ActivityRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-${index}`,
    date: `2026-01-${String(index + 1).padStart(2, '0')}`,
    startTime: index % 2 ? '09:00' : '18:00',
    activity: index % 3 ? `${category} practice` : `${category} review`,
    category,
    duration,
    planned: true,
    completed: index % 4 !== 0,
  }));
}

describe('world generation engine', () => {
  it('produces the same complete blueprint for identical records', () => {
    const records = createDemoData();
    const order = analyze(records).categories.map(
      (category) => category.category,
    );
    const first = createWorldConfiguration(analyze(records), 'all', order);
    const second = createWorldConfiguration(
      analyze([...records].reverse()),
      'all',
      order,
    );
    expect(second).toEqual(first);
    expect(first.fingerprint).toMatch(/^[a-f0-9]{8}$/);
    expect(first.connections.length).toBeGreaterThan(0);
  });

  it('selects each protagonist from the strongest recognized life domain', () => {
    const mappings = [
      ['Work', 'city-architect'],
      ['Learning', 'archive-sage'],
      ['Fitness', 'trail-warden'],
      ['Social', 'hearth-envoy'],
      ['Recreation', 'grovekeeper'],
      ['Creative', 'atelier-weaver'],
      ['Outdoors', 'wayfinder'],
      ['Personal admin', 'wayfinder'],
    ] as const;

    mappings.forEach(([category, expected]) => {
      const secondaryCategory =
        category === 'Learning' ? 'Fitness' : 'Learning';
      const records =
        category === 'Personal admin'
          ? recordsFor(category, 3, 90)
          : [
              ...recordsFor(category, 3, 90),
              ...recordsFor(secondaryCategory, 3, 60).map((record) => ({
                ...record,
                id: `secondary-${record.id}`,
              })),
            ];
      const analytics = analyze(records);
      const profile = createCharacterProfile(analytics);
      expect(selectCharacterArchetype(analytics)).toBe(expected);
      expect(profile.archetypeId).toBe(expected);
      expect(profile.portraitSrc).toBe(`./art/characters/${expected}.png`);
    });
  });

  it('reveals specialist protagonists when one supported domain reaches 68 percent', () => {
    const mappings = [
      ['Work', 'guild-forgemaster'],
      ['Learning', 'observatory-scholar'],
      ['Fitness', 'circuit-ranger'],
      ['Social', 'festival-herald'],
      ['Recreation', 'dream-gardener'],
    ] as const;

    mappings.forEach(([category, expected]) => {
      const analytics = analyze(recordsFor(category, 4, 90));
      const profile = createCharacterProfile(analytics);
      expect(profile.archetypeId).toBe(expected);
      expect(profile.portraitSrc).toBe(`./art/characters/${expected}.png`);
      expect(profile.archetypeEvidence).toContain(
        'meets the 68% specialist threshold',
      );
    });
  });

  it('uses visibly different protagonists for the July and August demo chapters', () => {
    const records = createDemoData();
    const july = createCharacterProfile(
      analyze(recordsForMonth(records, '2026-07')),
    );
    const august = createCharacterProfile(
      analyze(recordsForMonth(records, '2026-08')),
    );

    expect(july.archetypeId).toBe('trail-warden');
    expect(august.archetypeId).toBe('city-architect');
    expect(july.portraitSrc).not.toBe(august.portraitSrc);
  });

  it('uses stable tie-breaking and lets recognized domains outrank generic labels', () => {
    const tied = [
      ...recordsFor('Creative', 2, 120),
      ...recordsFor('Outdoors', 2, 120).map((record) => ({
        ...record,
        id: `outdoor-${record.id}`,
      })),
    ];
    const genericHeavy = [
      ...recordsFor('Work', 1, 60),
      ...recordsFor('Personal admin', 6, 180).map((record) => ({
        ...record,
        id: `generic-${record.id}`,
      })),
    ];

    expect(selectCharacterArchetype(analyze(tied))).toBe('atelier-weaver');
    expect(selectCharacterArchetype(analyze([...tied].reverse()))).toBe(
      'atelier-weaver',
    );
    expect(selectCharacterArchetype(analyze(genericHeavy))).toBe(
      'city-architect',
    );
    expect(
      createCharacterProfile(analyze(genericHeavy)).archetypeEvidence,
    ).toContain('Career and project activity');
  });

  it('keeps district positions stable while monthly worlds reconstruct', () => {
    const january = [...recordsFor('Learning', 5), ...recordsFor('Fitness', 3)];
    const february = [
      ...recordsFor('Fitness', 8).map((record) => ({
        ...record,
        id: `feb-${record.id}`,
        date: record.date.replace('-01-', '-02-'),
      })),
      ...recordsFor('Learning', 2).map((record) => ({
        ...record,
        id: `feb-${record.id}`,
        date: record.date.replace('-01-', '-02-'),
      })),
    ];
    const order = ['Learning', 'Fitness'];
    const januaryWorld = createWorldConfiguration(
      analyze(january),
      '2026-01',
      order,
    );
    const februaryWorld = createWorldConfiguration(
      analyze(february),
      '2026-02',
      order,
    );
    expect(
      januaryWorld.districts.find(
        (district) => district.category === 'Learning',
      )?.slot,
    ).toBe(0);
    expect(
      februaryWorld.districts.find(
        (district) => district.category === 'Learning',
      )?.slot,
    ).toBe(0);
    expect(januaryWorld.fingerprint).not.toBe(februaryWorld.fingerprint);
  });

  it('keeps recognized district colors tied to their meaning, not their rank', () => {
    const world = createWorldConfiguration(
      analyze([
        ...recordsFor('Fitness', 7, 180),
        ...recordsFor('Recreation', 6, 150).map((record) => ({
          ...record,
          id: `rec-${record.id}`,
        })),
        ...recordsFor('Learning', 5, 120).map((record) => ({
          ...record,
          id: `learn-${record.id}`,
        })),
        ...recordsFor('Social', 4, 90).map((record) => ({
          ...record,
          id: `social-${record.id}`,
        })),
      ]),
      'all',
      ['Social', 'Fitness', 'Learning', 'Recreation'],
    );

    expect(world.districts.find(({ identity }) => identity === 'fitness')?.color)
      .toBe(WORLD_IDENTITY_COLORS.fitness);
    expect(
      world.districts.find(({ identity }) => identity === 'recreation')?.color,
    ).toBe(WORLD_IDENTITY_COLORS.recreation);
    expect(
      world.districts.find(({ identity }) => identity === 'learning')?.color,
    ).toBe(WORLD_IDENTITY_COLORS.learning);
    expect(world.districts.find(({ identity }) => identity === 'social')?.color)
      .toBe(WORLD_IDENTITY_COLORS.social);
  });

  it('turns greater engagement into deterministic structural development', () => {
    const early = createWorldConfiguration(
      analyze(recordsFor('Learning', 2, 30)),
    );
    const established = createWorldConfiguration(
      analyze(recordsFor('Learning', 18, 180)),
    );
    const earlyDistrict = early.districts[0];
    const establishedDistrict = established.districts[0];
    expect(establishedDistrict.development).toBeGreaterThan(
      earlyDistrict.development,
    );
    expect(establishedDistrict.structureCount).toBeGreaterThan(
      earlyDistrict.structureCount,
    );
    expect(establishedDistrict.activityNodeCount).toBeGreaterThan(
      earlyDistrict.activityNodeCount,
    );
  });

  it('publishes landmark rules, metrics, and exact source records', () => {
    const records = recordsFor('Learning', 8, 240).map((record) => ({
      ...record,
      activity: 'Language practice',
    }));
    const district = createWorldConfiguration(analyze(records), '2026-01')
      .districts[0];
    expect(
      district.landmarks.some((landmark) => landmark.kind === 'activity'),
    ).toBe(true);
    expect(
      district.landmarks.some((landmark) => landmark.kind === 'streak'),
    ).toBe(true);
    expect(
      district.landmarks.every((landmark) => landmark.rule.length > 20),
    ).toBe(true);
    expect(district.landmarks[0].sourceRecordIds).toEqual(
      records.map((record) => record.id),
    );
  });

  it('derives character title, equipment, location, and attributes from analytics', () => {
    const analytics = analyze([
      ...recordsFor('Learning', 12, 120),
      ...recordsFor('Fitness', 8, 90).map((record) => ({
        ...record,
        id: `fit-${record.id}`,
      })),
    ]);
    const profile = createCharacterProfile(analytics, 'Fitness');
    expect(profile.currentLocation).toBe('Fitness');
    expect(profile.equipment.some((item) => item.id === 'compass')).toBe(true);
    expect(profile.equipment.some((item) => item.id === 'codex')).toBe(true);
    expect(profile.attributes).toHaveLength(4);
    expect(
      profile.attributes.every(
        (attribute) => attribute.value >= 0 && attribute.value <= 100,
      ),
    ).toBe(true);
    expect(profile.title).not.toBe('');
    expect(profile.evolutionLabel).not.toBe('');
    expect(profile.evolutionTier).toBeGreaterThanOrEqual(1);
  });

  it('visibly evolves the protagonist at documented level bands', () => {
    const early = createCharacterProfile(
      analyze(recordsFor('Learning', 1, 20)),
    );
    const advanced = createCharacterProfile(
      analyze([
        ...recordsFor('Learning', 31, 1_440),
        ...recordsFor('Fitness', 31, 1_440).map((record) => ({
          ...record,
          id: `advanced-${record.id}`,
        })),
      ]),
    );
    expect(early.evolutionTier).toBe(1);
    expect(advanced.level).toBeGreaterThanOrEqual(25);
    expect(advanced.evolutionTier).toBe(5);
    expect(advanced.evolutionLabel).not.toBe(early.evolutionLabel);
  });

  it('changes the complete RPG state for a genuinely different user dataset', () => {
    const learner = analyze(recordsFor('Learning', 4, 45));
    const explorerRecords = [
      ...recordsFor('Fitness', 12, 180),
      ...recordsFor('Social', 8, 90).map((record) => ({
        ...record,
        id: `social-${record.id}`,
      })),
    ];
    const explorer = analyze(explorerRecords);
    const learnerWorld = createWorldConfiguration(learner, '2026-01');
    const explorerWorld = createWorldConfiguration(explorer, '2026-01');
    const learnerProfile = createCharacterProfile(learner);
    const explorerProfile = createCharacterProfile(explorer);

    expect(explorer.totalXp).not.toBe(learner.totalXp);
    expect(explorerWorld.fingerprint).not.toBe(learnerWorld.fingerprint);
    expect(
      explorerWorld.districts.map((district) => district.category),
    ).not.toEqual(learnerWorld.districts.map((district) => district.category));
    expect(
      explorerWorld.districts.flatMap((district) => district.landmarks),
    ).not.toEqual(
      learnerWorld.districts.flatMap((district) => district.landmarks),
    );
    expect(explorerProfile.equipment).not.toEqual(learnerProfile.equipment);
    expect(explorerProfile.archetypeId).not.toBe(learnerProfile.archetypeId);
    expect(explorerProfile.achievements).not.toEqual(
      learnerProfile.achievements,
    );
    expect(explorer.insights).not.toEqual(learner.insights);
  });

  it('keeps achievements rule-based and honest about locked states', () => {
    const empty = createAchievements(analyze([]));
    expect(empty.every((achievement) => !achievement.unlocked)).toBe(true);
    expect(empty.every((achievement) => achievement.rule.length > 20)).toBe(
      true,
    );
    const active = createAchievements(analyze(recordsFor('Fitness', 10, 600)));
    expect(
      active.find((achievement) => achievement.id === 'first-record')?.unlocked,
    ).toBe(true);
    expect(
      active.find((achievement) => achievement.id === 'seven-day-streak')
        ?.unlocked,
    ).toBe(true);
    expect(
      active.find((achievement) => achievement.id === 'hundred-hours')
        ?.unlocked,
    ).toBe(true);
  });

  it('renders an empty configuration without inventing districts or landmarks', () => {
    const world = createWorldConfiguration(analyze([]), 'all', []);
    expect(world.districts).toEqual([]);
    expect(world.connections).toEqual([]);
    expect(world.intensity).toBeGreaterThan(0);
  });
});
