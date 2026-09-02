import type { ActivityRecord } from '../types';

function seeded(index: number, salt = 1) {
  const value = Math.sin(index * 91.731 + salt * 17.13) * 43758.5453;
  return value - Math.floor(value);
}

function isoDate(base: Date, offset: number) {
  const next = new Date(base);
  next.setUTCDate(base.getUTCDate() + offset);
  return next.toISOString().slice(0, 10);
}

function endTime(start: string, duration: number) {
  const [hour, minute] = start.split(':').map(Number);
  const total = hour * 60 + minute + duration;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function createDemoData(): ActivityRecord[] {
  const base = new Date('2026-05-01T00:00:00Z');
  const records: ActivityRecord[] = [];
  let id = 0;

  const add = (
    day: number,
    activity: string,
    category: string,
    start: string,
    duration: number,
    extras: Partial<ActivityRecord> = {},
  ) => {
    const energy = Math.max(
      1,
      Math.min(
        5,
        Math.round((extras.energy ?? 3) + (seeded(day, id + 3) - 0.5) * 1.4),
      ),
    );
    const mood = Math.max(
      1,
      Math.min(
        5,
        Math.round((extras.mood ?? 3) + (seeded(day, id + 8) - 0.5) * 1.2),
      ),
    );
    records.push({
      id: `demo-${++id}`,
      date: isoDate(base, day),
      startTime: start,
      endTime: endTime(start, duration),
      activity,
      category,
      duration,
      energy,
      mood,
      planned: extras.planned ?? true,
      completed: extras.completed ?? true,
      subcategory: extras.subcategory,
      location: extras.location,
      notes: extras.notes,
    });
  };

  for (let day = 0; day < 112; day += 1) {
    const weekday = new Date(`${isoDate(base, day)}T12:00:00Z`).getUTCDay();
    const julyTrainingBlock = day >= 61 && day <= 91;
    if (day >= 45 && day <= 49) continue;

    if (weekday >= 1 && weekday <= 5) {
      const duration = julyTrainingBlock
        ? 45 + Math.round(seeded(day, 4) * 25)
        : 115 + Math.round(seeded(day, 4) * 85) + (day > 72 ? 25 : 0);
      add(
        day,
        weekday === 3 ? 'Project review' : 'Focused craft',
        'Career',
        '09:00',
        duration,
        {
          subcategory: 'Deep work',
          energy: 3.2,
          mood: 3.1,
          location: 'Studio',
        },
      );
      if (!julyTrainingBlock && seeded(day, 2) > 0.45)
        add(
          day,
          'Planning & correspondence',
          'Career',
          '14:30',
          35 + Math.round(seeded(day, 9) * 35),
          { subcategory: 'Coordination', energy: 2.8 },
        );
    }

    if ([2, 4, 6].includes(weekday) && !(day > 29 && day < 38)) {
      add(
        day,
        day % 3 ? 'Language practice' : 'Systems reading',
        'Learning',
        weekday === 6 ? '10:30' : '18:15',
        48 + Math.round(seeded(day, 5) * 42),
        {
          subcategory: day % 3 ? 'Practice' : 'Reading',
          energy: 3.4,
          mood: 3.5,
          location: 'Home desk',
        },
      );
    }

    if ([1, 3, 5].includes(weekday) && !(day > 58 && day < 67)) {
      add(
        day,
        weekday === 5 ? 'Long walk' : 'Strength session',
        'Fitness',
        weekday === 5 ? '17:30' : '07:15',
        julyTrainingBlock
          ? 105 + Math.round(seeded(day, 7) * 35)
          : 42 + Math.round(seeded(day, 7) * 28),
        {
          subcategory: weekday === 5 ? 'Outdoor' : 'Training',
          energy: 3.8,
          mood: 3.7,
          location: weekday === 5 ? 'Riverside' : 'Gym',
        },
      );
    }

    if (julyTrainingBlock && [2, 4].includes(weekday)) {
      add(
        day,
        'Mobility and conditioning',
        'Fitness',
        '07:20',
        70 + Math.round(seeded(day, 17) * 25),
        {
          subcategory: 'Conditioning',
          energy: 3.7,
          mood: 3.8,
          location: 'Training studio',
        },
      );
    }

    if (
      (weekday === 5 && seeded(day, 10) > 0.28) ||
      (weekday === 6 && seeded(day, 11) > 0.5)
    ) {
      add(
        day,
        weekday === 5 ? 'Dinner with friends' : 'Community meetup',
        'Social',
        weekday === 5 ? '19:30' : '16:00',
        75 + Math.round(seeded(day, 12) * 70),
        {
          subcategory: 'In person',
          energy: 3.2,
          mood: 4.2,
          location: 'Around town',
        },
      );
    }

    if (weekday === 0 || (weekday === 6 && seeded(day, 14) > 0.4)) {
      add(
        day,
        weekday === 0 ? 'Unhurried reading' : 'Film night',
        'Recreation',
        weekday === 0 ? '11:00' : '20:15',
        65 + Math.round(seeded(day, 15) * 70),
        {
          subcategory: weekday === 0 ? 'Reading' : 'Film',
          energy: 2.7,
          mood: 3.8,
          planned: weekday !== 0,
        },
      );
    }

    if (day % 19 === 6) {
      add(day, 'Planned exploration', 'Learning', '20:00', 0, {
        planned: true,
        completed: false,
        energy: 2.5,
        mood: 2.8,
        notes: 'Fictional incomplete plan retained for completion analysis.',
      });
    }
  }

  return records;
}
