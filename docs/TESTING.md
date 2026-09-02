# Testing

## Automated tests

Run:

```bash
pnpm test
```

The Vitest suite covers:

- quoted and malformed CSV;
- JSON arrays, envelopes, and malformed JSON;
- alias detection and required mappings;
- date/time normalization and derived duration;
- invalid duration and duplicate handling;
- category aggregation, allocation, average duration, streaks, gaps, completion, fragmentation, day/time distributions;
- bounded consistency, deterministic XP, and level thresholds;
- empty-data honesty and association sample thresholds;
- monthly filtering and period comparison;
- deterministic demo generation;
- normalized CSV and standalone capsule generation;
- HTML escaping of imported values.

## Browser QA

The application was opened from the real Vite development server in the Codex in-app Chromium browser. The QA pass exercised:

- landing page at 1440×900 and 320×800;
- onboarding choice dialog;
- local CSV selection, field detection, mapping review, and generated user world;
- demo generation;
- region selection and time-period world regeneration;
- camera controls and protagonist positioning;
- character, timeline, insights, comparison, data, and methodology navigation;
- normalized CSV and LifeMap Capsule controls;
- reset confirmation surface;
- mobile navigation and page-width overflow measurement;
- console error inspection.

At 320px, `document.body.scrollWidth` and `document.documentElement.scrollWidth` are expected to equal `innerWidth`.

## Release gate

Run all three:

```bash
pnpm test
pnpm lint
pnpm build
```

Then inspect the production preview and repeat desktop/mobile smoke tests. Do not treat compilation alone as visual validation.

