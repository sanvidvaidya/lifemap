# LifeMap

**See the shape of your life.**

LifeMap is a privacy-first personal analytics application that turns activity records into an interactive, game-inspired world. Time allocation shapes district footprint, consistency develops the environment, streaks reveal beacons, and category engagement advances an original protagonist.

For the complete product history, every shipped feature, formula, character, design decision, user-requested correction, deployment milestone, removed experiment, and future proposal, see [docs/PROJECT_CHRONICLE.md](docs/PROJECT_CHRONICLE.md).

## Live site

LifeMap is publicly available at [lifemap-personal-progress-world.sanvidvaidya.chatgpt.site](https://lifemap-personal-progress-world.sanvidvaidya.chatgpt.site). Visitors do not need an account, and imported personal data remains in their own browser memory.

The application is real local-first software: it has no backend, user accounts, database, trackers, telemetry, AI API, or personal-data upload path. CSV and JSON files are read through browser APIs and normalized in memory.

## Free public deployment options

The repository includes a small `streamlit_app.py` entrypoint for Streamlit Community Cloud. Streamlit is a Python host, while LifeMap itself is a static React app, so the entrypoint preserves the complete responsive experience inside a full-screen frame. It defaults to the free GitHub Pages build and accepts a `LIFEMAP_URL` environment variable if another public URL becomes the preferred canonical host.

To deploy the shell for free, create a public GitHub repository, push this project, open [Streamlit Community Cloud](https://share.streamlit.io/), choose **Deploy an app**, select the repository and `streamlit_app.py`, and deploy. No API key or paid server is required. The standalone GitHub Pages workflow in `.github/workflows/deploy-pages.yml` remains the better direct host for the React app; Streamlit is an optional `streamlit.app` doorway to the same build.

## What works

- Drag-and-drop or select CSV and JSON files.
- Review and correct detected field mappings before analysis.
- Add records manually without an account.
- Log a daily record in under a minute and append new files without rebuilding a personal archive from scratch.
- Preview new, duplicate, and rejected rows before an incremental import, then undo the latest data change.
- Export or restore a portable, revalidated `.lifemap` Passport with records, mapping recipes, and presentation preferences.
- Explore deterministic fictional demo data spanning four months.
- Validate dates, times, durations, numbers, duplicates, empty rows, and malformed files without crashing.
- Explore a data-driven isometric world with keyboard-selectable regions, camera zoom, district focus, character movement, fog of war, landmarks, paths, and atmosphere.
- Customize the protagonist's display name, journey style, and accent.
- Inspect tracked time, category share, frequency, averages, daily/weekly/monthly time, trends, consistency, streaks, gaps, planned completion, fragmentation, time-of-day, day-of-week, energy, mood, associations, period change, records, XP, and levels.
- Travel through the timeline and compare two calendar periods visually.
- Search, filter, and sort normalized records.
- Export normalized CSV or a standalone, tracker-free LifeMap Capsule HTML document.
- Reset the in-memory dataset with confirmation.
- Use an accessible textual world representation, full keyboard navigation, visible focus, reduced-motion support, and layouts down to 320px.
- Install LifeMap as a phone PWA with a fixed mobile dock and an offline public shell that never caches personal records.

## Privacy model

LifeMap performs all personal-data work in the browser process:

1. `File.text()` reads a selected local file.
2. Deterministic parsers convert CSV or JSON into plain JavaScript objects.
3. The normalization and analytics modules run in browser memory.
4. React renders escaped text values. Imported strings are never interpreted as HTML or code.
5. Exports are assembled locally with `Blob` and downloaded from an object URL.
6. Reset drops the React state holding the current dataset.

No dataset is automatically written to `localStorage`, IndexedDB, cookies, or remote storage. Avatar preferences are also session-only. See [docs/PRIVACY.md](docs/PRIVACY.md).

## Architecture

LifeMap is a static React + TypeScript + Vite application.

```text
src/
  analytics.ts          deterministic metrics, XP, associations, comparisons
  character-bible.ts    locked identities for twelve original protagonists
  world-generation.ts   deterministic districts, paths, landmarks, character
  world-layout.ts       fixed tile geometry and in-bounds feature anchors
  export.ts             normalized CSV and standalone HTML capsule
  data/
    demo.ts             deterministic fictional dataset
    import.ts           CSV/JSON parsing, mapping, validation, normalization
  ui/
    faithful-protagonist.tsx  canonical 2.5D original character presentation
    lifemap-app.tsx     landing, onboarding, views, export, reset
    world.tsx           data-driven world and protagonist
  main.tsx
  styles.css            design system, layout, motion, responsive states
tests/                  unit and local pipeline tests
docs/                   architecture, analytics, data, design, privacy, testing
```

State remains in a single in-memory React tree. Analytics are recalculated from the selected record subset. There is no runtime server requirement.

## Canonical data model

Required fields are `date`, `activity`, and `category`. The normalized record also supports `id`, `startTime`, `endTime`, `subcategory`, `duration`, `energy`, `mood`, `planned`, `completed`, `location`, and `notes`.

Duration is stored in minutes and can be imported directly or derived from valid start/end times. Optional fields never block analysis. See [docs/DATA_MODEL.md](docs/DATA_MODEL.md).

## Analytics and visual system

Every metric and world encoding is reproducible. Important formulas are visible inside the Method view and documented in [docs/ANALYTICS.md](docs/ANALYTICS.md).

- Category time share → district footprint
- Category XP → one of five development stages
- Progression + record count → visible structures
- Category consistency → vegetation density
- Record count → visible session lights
- Same-day category transitions → trails, roads, and bridges
- Streak of at least five days → beacon
- Fewer than three records → fog of war
- Selected category → camera focus and protagonist movement
- Category allocation → character equipment
- Most common start-time bucket → restrained atmosphere

Landmarks expose their rule, represented metric, and exact source records. Timeline and Compare render complete period-specific world blueprints rather than decorative charts. See [docs/WORLD_GENERATION.md](docs/WORLD_GENERATION.md).

The original visual language uses layered SVG, CSS, and semantic HTML. It does not use copyrighted game assets or a heavyweight 3D engine. See [docs/DESIGN.md](docs/DESIGN.md).

## Technology

- React 19
- TypeScript 5
- Vite 8
- Tailwind CSS 4 design utilities and reusable shadcn primitives
- Lucide interface icons
- Vitest
- Static output for GitHub Pages

## Local development

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://127.0.0.1:3000/`.

## Validation

```bash
pnpm test
pnpm lint
pnpm build
```

The production build writes static files to `dist/`. Test scope and browser QA are documented in [docs/TESTING.md](docs/TESTING.md).

## GitHub Pages deployment

The repository contains `.github/workflows/deploy-pages.yml`.

1. Create a GitHub repository and push this project to its `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main` or run the workflow manually.

The workflow installs the locked dependencies, runs tests, builds the static site, uploads `dist/`, and deploys it to the `github-pages` environment. Vite uses relative asset paths, so project URLs such as `https://owner.github.io/lifemap/` work without a hard-coded repository name.

## Current limitations

- Data is intentionally session-only; refreshing the page clears it.
- The world shows up to six categories spatially while every category remains available in analytics and exports.
- Associations use simple group-mean comparisons, not causal or clinical inference.
- Very large files are capped at 10 MB; rendering tables is capped at 100 visible rows while exports retain the selected records.
- Browser QA in this repository validates Chromium through the Codex in-app browser; additional Safari and Firefox regression runs are future work.

## Roadmap

- Optional, explicit encrypted device persistence.
- User-authored category color and landmark rules.
- Web Worker analytics for substantially larger datasets.
- Additional non-causal statistical methods with confidence intervals.
- Cross-browser automated end-to-end CI.

LifeMap requires no AI service. Transparent local computation is the feature.
