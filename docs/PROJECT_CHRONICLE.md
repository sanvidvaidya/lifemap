# LifeMap: Complete Project Chronicle

## Purpose and evidence

This is the complete substantive record of what LifeMap became from the first specification through the current public release. It documents the product intent, engineering decisions, implemented behavior, visual evolution, character canon, analytics formulas, privacy model, testing, deployment, user feedback, removed experiments, current limitations, and ideas that remain future work.

This is a project chronicle, not a verbatim transcript of every conversational sentence. Exact source material is preserved in three places:

- `PROJECT_SPEC.md` contains the original 2,619-line master build specification.
- Git history preserves each implementation milestone and the exact files changed.
- This chronicle records every substantive requirement, correction, shipped feature, rejected direction, and future proposal discussed during the build.

Status captured: 1 September 2026.

## 1. The product in one sentence

LifeMap is a privacy-first, local-first personal analytics web application that converts a person's own activity records into an explorable cartographic RPG world, a deterministic protagonist, visible progression, reconstructable historical eras, traceable discoveries, and portable local exports without sending personal records to a server.

The original public identity was:

- Product name: LifeMap
- Primary tagline: “See the shape of your life.”
- Alternative tagline: “Turn your data into a world.”
- Current landing promise: “Your records forge the hero you become.”
- Core mental model: “My data creates my world.”

The product combines:

```text
personal data
  + deterministic analytics
  + information visualization
  + exploration
  + progression
  + privacy
  = a living personal atlas
```

## 2. Why LifeMap exists

The original product question was:

> Where is my time actually going, when do I tend to spend it, how consistent am I, what has changed, and what observable patterns exist within the data I have chosen to provide?

LifeMap was designed to answer five user questions:

1. Where does my tracked time go?
2. When do I tend to perform different activities?
3. How consistent are my activities?
4. What changed over time?
5. What observable associations appear when enough optional data exists?

The fifth question is intentionally framed as association, never causation. For example, LifeMap may report that recorded energy was higher during Fitness records. It must never claim that Fitness caused the energy change.

## 3. Non-negotiable principles established at the beginning

The original build order of priorities was:

1. Correctness
2. Privacy
3. Reliability
4. Simplicity
5. Performance
6. Accessibility
7. Visual quality
8. Maintainability

The master specification also established the following permanent rules:

- Build real software, not a mockup, toy, landing page, or first-screen prototype.
- Never claim a feature exists unless it works.
- Leave no fake buttons, dead links, placeholder behavior, or knowingly broken flows.
- Process personal data locally in the browser.
- Do not upload user records.
- Keep metrics transparent, deterministic, and reproducible.
- Never fabricate insights or fill empty states with generic motivational text.
- Never infer personality, psychology, health, worth, or productivity from the records.
- Preserve user ownership through import, analysis, export, reset, and explicit backup.
- Make the visual world a primary feature rather than decorative chrome around charts.
- Create an original visual identity and use no ripped or copyrighted game assets.
- Support desktop, tablet, and mobile, including a usable 320px layout.
- Preserve keyboard access, semantic markup, contrast, visible focus, screen-reader descriptions, and reduced motion.
- Keep the application lightweight and statically deployable.
- Require no backend, database, account, authentication, API key, AI API, Docker runtime, or paid cloud service.

## 4. What LifeMap was explicitly not allowed to become

LifeMap was not to be:

- a generic analytics dashboard;
- a generic CSV viewer;
- an AI chatbot or AI life coach;
- a personality detector;
- a psychological, medical, or financial diagnosis system;
- a fabricated productivity score;
- a conventional SaaS administration interface;
- a clone of GTA, Pokémon, Zelda, Nintendo, Disney, Minecraft, Roblox, Fortnite, or another protected game identity;
- a combat game with enemies, weapons, fake currencies, loot boxes, gambling, or meaningless quests;
- a backend-dependent application;
- an application that silently saves or transmits personal data.

The RPG language is a visual and interaction metaphor. The user's real activity is the progression system.

## 5. The complete central loop

The final product loop is:

```text
User supplies records
  -> records are parsed and normalized locally
  -> deterministic analytics describe time and rhythm
  -> activity becomes category XP
  -> XP becomes levels and development stages
  -> development shapes districts, structures, paths, and landmarks
  -> the activity mix selects a protagonist and equipment
  -> timeline reconstruction creates historical world states
  -> the user explores and verifies the result
  -> the user can append, export, back up, restore, or reset the realm
```

The same normalized input always produces the same analytics, XP, levels, world, landmarks, achievements, protagonist, and period reconstructions.

## 6. Complete development history

### Phase 1: The complete local-first analytics application

Commit `14215df`, 28 August 2026: **Build LifeMap local-first visual analytics experience**

The first release already contained a full application rather than a landing-page shell. It introduced:

- a React, TypeScript, and Vite application;
- the complete canonical data model;
- CSV and JSON parsing;
- field-alias detection and correction;
- manual entry;
- deterministic fictional demo data;
- validation and normalization;
- deterministic analytics;
- category XP and levels;
- world rendering;
- World, Character, Timeline, Insights, Compare, Data, and Method views;
- normalized CSV export;
- standalone LifeMap Capsule HTML export;
- reset with confirmation;
- privacy, design, analytics, architecture, testing, and data documentation;
- automated tests;
- GitHub Pages deployment workflow;
- Git ignore and repository release rules;
- OpenAI Sites hosting metadata.

The first commit added 98 files and more than 18,000 lines, including the complete 2,619-line source specification.

### Phase 2: Public static hosting support

Commit `039407b`, 28 August 2026: **Add Sites static asset worker adapter**

- Added a minimal static-asset Worker adapter for OpenAI Sites.
- The adapter serves generated assets and falls back to `index.html` for client-side routes.
- It does not process, receive, or persist personal data.

Commit `67b1ce7`, 28 August 2026: **Stage static client assets for Sites hosting**

- Added a post-build script that prepares the static output expected by Sites.
- Moved the Worker adapter into its final `server/` location.
- Kept the application itself fully static and client-only.

Commit `97dc9fb`, 28 August 2026: **Document the public LifeMap deployment**

- Added the public URL to the README.
- Confirmed that the public site required no visitor account.

### Phase 3: A genuinely data-driven living world

Commit `ec094d3`, 28 August 2026: **Evolve LifeMap into a living data-driven world**

This separated the analytical engine from a new deterministic world-generation layer. It added:

- typed district blueprints;
- world landmarks with rules, metrics, periods, and source record IDs;
- data-derived roads, trails, and bridges;
- stable temporal district positions;
- atmosphere derived from recorded time-of-day distribution;
- fog treatment for under-observed districts;
- period-specific world reconstruction;
- deterministic character profiles;
- achievement rules;
- a stable world fingerprint;
- extensive world-generation tests;
- `docs/WORLD_GENERATION.md`.

This was the point at which the visual world stopped being a decorative chart and became a testable data product.

### Phase 4: Character-first RPG transformation

Commit `3a50dee`, 29 August 2026: **Transform LifeMap into a character-first RPG experience**

The first visual overhaul responded to the requirement that LifeMap should feel like a personal RPG world rather than an analytics dashboard with game decoration. It introduced:

- a cinematic protagonist-in-world landing composition;
- stronger character hierarchy;
- an RPG-styled player HUD;
- a more immersive World view;
- an RPG character profile presentation;
- Journey as time travel rather than a chart selector;
- Discoveries as calculation-backed world intelligence;
- Compare as World A versus World B;
- Data as the source archive;
- Method as the LifeMap Codex;
- the original Wayfinder v2 artwork;
- deeper motion, lighting, environment, and editorial composition.

The underlying analytics and privacy architecture were preserved.

### Phase 5: Multiple deterministic protagonists

Commit `db27edb`, 29 August 2026: **Add deterministic multi-character protagonist roster**

This addressed the criticism that every uploaded CSV or JSON file could not produce the Wayfinder. The change added seven initial original portraits and a deterministic domain-selection system:

- Wayfinder
- City Architect
- Archive Sage
- Trail Warden
- Hearth Envoy
- Grovekeeper
- Atelier Weaver

Different category mixes now selected different protagonists. Character selection became data-driven, tested, and period-specific.

The roster was deliberately expanded beyond women after the user flagged that the initial designs appeared overwhelmingly female. The final canon contains men, women, varied ages, varied heritages, varied bodies, and one identity whose short canon text does not assign a gender.

### Phase 6: Landing, typography, and language correction

Commit `1347529`, 29 August 2026: **Fix landing layout and remove em dash copy**

This resolved four visibly jarring issues reported with screenshots:

1. The current-region or Career card blocked the character's face.
2. Tile contents appeared detached from their platforms.
3. The large hero words “you” and “could” collided because line spacing was too tight.
4. Em dashes appeared throughout the site and made the copy feel mechanical.

The landing composition, typography spacing, character/card relationship, and copy were corrected. Em dash usage was removed from user-facing application copy and replaced with more natural sentence structure.

### Phase 7: World tile rebuild and Journey contrast repair

Commit `3adf7af`, 29 August 2026: **Rebuild world tiles and fix Journey contrast**

The first layout correction was rejected because the structures and landmarks still appeared to float outside their tiles. The tile system was therefore rebuilt from first principles:

- one to six districts received fixed balanced layouts;
- every platform received a fixed polygon boundary;
- structures, activity nodes, trees, and landmarks were assigned tile-local anchor points;
- visual contents were clipped to the tile where appropriate;
- the district boundary stopped changing shape with time share;
- time share moved to a bounded inner footprint;
- a 12-unit front ridge created consistent platform depth;
- geometry tests verified that local feature points remain inside the platform.

The same commit removed the unreadable cream background from the bottom Journey intensity section and restored a dark atlas surface with readable white and muted copy.

### Phase 8: Composition, colors, labels, crop, and period-specific demo heroes

Commit `1157b17`, 29 August 2026: **Fix world composition and demo protagonists**

This addressed a second screenshot review:

- The protagonist was moved away from the map so all four landing tiles could be seen.
- In the standard fictional demo ordering, Recreation was restored to coral/red and Fitness to blue so platform and roof colors agreed.
- The district selector was repositioned so it did not cover the last two tile names.
- The Journey title lane was bounded so “All recorded time” did not cast over the world tiles.
- Full-world character framing gained top headroom so the Trail Warden's hair and head were no longer cropped.
- The gold primary call-to-action received dark text for readable contrast.
- Demo data was rebalanced so July and August produce genuinely different protagonists from their different records. July's training-heavy period selects the Trail Warden. August returns to a Career-led City Architect.

### Phase 9: Twelve protagonists and first live 3D experiment

Commit `2e35cb1`, 29 August 2026: **Add live 3D protagonist roster**

Five specialist portraits completed the twelve-character roster:

- Guild Forgemaster
- Observatory Scholar
- Circuit Ranger
- Festival Herald
- Dream Gardener

The same milestone introduced the first browser-rendered 3D protagonist experiment and an early web app manifest. The goal was to make the protagonists and the site feel spatial rather than flat.

The first 3D result was not accepted. It still looked too flat and, after further iteration, too much like a puppet rather than a premium RPG protagonist.

### Phase 10: Rigged model experiment

Commit `2c25126`, 30 August 2026: **Replace puppet protagonists with rigged RPG characters**

Six rigged GLTF character models from Quaternius were temporarily added:

- Cleric
- Monk
- Ranger
- Rogue
- Warrior
- Wizard

These models improved volume and animation, but they did not preserve the faces, silhouettes, wardrobes, heritage, ages, or signature props of the twelve original LifeMap characters. They solved “3D” while breaking character identity.

### Phase 11: Formal character canon

Commit `b1667d9`, 30 August 2026: **Add faithful protagonist archive**

This introduced `src/character-bible.ts`, the authoritative canon for all twelve protagonists. Each entry locks:

- name;
- data domain;
- core or specialist form;
- face and identity description;
- silhouette;
- wardrobe;
- signature props;
- palette;
- original portrait asset.

The Character screen gained an Original Form Archive that shows all twelve identities and explicitly states that their faces, silhouettes, and gear are not interchangeable.

### Phase 12: Stronger visible differentiation

Commit `3d8f863`, 30 August 2026: **Make every protagonist visibly distinct**

- Expanded model and presentation variation.
- Improved roster differentiation.
- Added PWA metadata and a LifeMap-specific icon treatment.
- Reinforced that each protagonist needed more than a recolored generic body.

Even after this, the generic 3D rigs still did not resemble the original character designs closely enough.

### Phase 13: Canonical 2.5D living forms

Commit `ba2a721`, 31 August 2026: **Make original characters the canonical living forms**

The original portraits became the actual living character surfaces throughout Landing, World, Character, Journey, and Compare. `FaithfulProtagonist` uses the exact original artwork with:

- depth-separated portrait layers;
- subtle perspective and parallax;
- responsive lighting;
- aura and evolution treatment;
- restrained idle movement;
- preservation of each original face, body, wardrobe, and prop silhouette.

This is the final identity decision: exact character fidelity is more important than forcing a generic fully modeled body into the interface.

Commit `c080127`, 31 August 2026: **Remove mismatched generic character rigs**

- Removed all six GLTF models.
- Removed the Three.js dependency and 3D renderer.
- Removed the duplicate Wayfinder art.
- Removed current third-party character assets.
- Reduced the production JavaScript bundle substantially.
- Left the original twelve local portraits as the canonical roster.

Current truth: LifeMap uses an original cartographic 2.5D presentation, not generic mesh-based 3D. It looks dimensional while preserving exact character identity. A future true 3D version would require twelve custom faithful meshes, not substitute stock rigs.

### Phase 14: The useful daily product loop and phone PWA

Commit `798fe2b`, 1 September 2026: **Add local-first daily loop and phone PWA**

This turned LifeMap from a one-time import experience into a repeatable personal tool. It added:

- Daily Dock for fast everyday entry;
- a universal Data Inbox that can append to an existing personal realm;
- import previews showing new, duplicate, and rejected records;
- stable cross-import duplicate detection;
- session mapping recipes for repeated file shapes;
- undo for the latest append or Passport restore;
- LifeMap Passport backup and restore;
- restore confirmation and revalidation;
- explicit conversion from fictional demo to a clean personal realm on the first personal log;
- installable PWA metadata;
- 192px, 512px, and Apple touch icons;
- a service worker for the public application shell;
- a fixed mobile navigation dock;
- mobile layout corrections at 320px;
- public release version 8.

This phase was built specifically around the requirement that neither the builder nor the user should need a paid API, hosted account system, paid database, or per-user processing bill.

## 7. Current application experience, screen by screen

### 7.1 Landing

The current landing screen immediately presents a protagonist inside a generated demo world.

It contains:

- LifeMap branding and “Your living atlas”;
- a visible “Your data stays on this device” statement;
- the headline “Your records forge the hero you become”;
- an explanation that career, training, study, community, and rest can produce different faces, silhouettes, equipment, and realms;
- primary “Create my world” and secondary “Explore fictional demo” actions;
- a trust statement: no account, no upload, no AI, no tracking;
- a four-tile world preview;
- a protagonist lane that does not cover the tiles;
- a player HUD with portrait, form, name, domain, level, and XP progress;
- a current-region readout;
- a clearly labeled fictional demo badge;
- an interactive twelve-character roster picker;
- identity descriptions and signature props;
- a four-step LifeMap loop: Data, XP, World, Journey;
- privacy, deterministic rules, and landmark-evidence explanations.

### 7.2 Onboarding and Data Inbox

The same onboarding surface is used to start a realm or grow an existing personal realm.

Available paths:

1. Import CSV or JSON by file picker or drag and drop.
2. Enter records manually.
3. Restore a `.lifemap` Passport.
4. Explore the fictional demo when no personal realm is active.

For file imports:

- file size is capped at 10 MB;
- the file is read with `File.text()`;
- CSV and JSON are parsed locally;
- likely field matches are suggested;
- required mappings are Date, Activity, and Category;
- every mapping is shown and can be corrected;
- a preview reports new records, skipped duplicates, rejected rows, and resulting archive size;
- only valid records are committed;
- existing personal records can be appended rather than replaced;
- repeated column layouts can reuse an in-session mapping recipe.

For manual onboarding, the user can enter date, activity, category, duration, start time, energy, mood, planned status, completed status, and notes.

### 7.3 Global application shell

Once a realm is open, the persistent shell contains:

- LifeMap brand button returning to World;
- a protagonist HUD with portrait, current name, title, XP bar, and level;
- primary navigation: World, Character, Journey, Discoveries, Compare, Data, Codex;
- current region;
- current era;
- dataset state: Demo realm or Local realm;
- total record count;
- quick “Log today” action;
- normalized CSV download for the selected period;
- Reset action with confirmation.

The mobile shell replaces the wide navigation with a fixed touch dock. It keeps World, Character, Log, Journey, Discoveries, and Compare readily accessible while preventing page-level horizontal overflow.

### 7.4 World

World is the primary interface. It shows:

- fictional or personal expedition label;
- all-time or selected-month title;
- represented date range and record count;
- tracked time, consistency, and level;
- era selector;
- a connected isometric realm;
- one to six visible districts;
- structures, activity lights, vegetation, terrain details, landmarks, fog, and connections;
- keyboard-selectable districts and landmarks;
- camera zoom, pan, reset, and selected-region focus;
- data-selected protagonist and current location;
- district compass with development stages;
- selected landmark ribbon with meaning, metric, leading activity, source-record count, and methodology link.

Selecting a district updates the selected region, camera focus, protagonist location, and first landmark. Selecting a landmark can open the exact normalized records that created it in Data.

### 7.5 Character

Character is an RPG profile sanctum rather than a conventional account page. It presents:

- exact data-selected protagonist;
- display name or canonical name;
- deterministic title;
- total level and XP progression;
- evolution tier and label;
- current location;
- archetype evidence explaining why this form was selected;
- equipment and the category share that produced it;
- four attributes with evidence;
- category levels and XP paths;
- seven rule-based achievements;
- personal records such as longest streak, longest session, and planned completion;
- display-name customization;
- journey style selection: trail, city, or field;
- sigil color selection;
- the complete Original Form Archive for all twelve protagonists.

Character preferences remain session-only unless included in a user-requested Passport.

### 7.6 Journey

Journey is a time-travel interface through recorded history.

It provides:

- All Eras plus every available calendar month;
- complete re-analysis of the selected period;
- a reconstructed period-specific world;
- period-specific districts, paths, landmarks, XP, level, and protagonist;
- the ability to enter the selected era in the main World view;
- a daily tracked-time intensity field;
- longest streak and longest gap;
- calculation-backed chapter observations.

The layout intentionally keeps the era title in a bounded lane so it does not cover the reconstructed world. The intensity section uses a dark surface for contrast. Dim cells represent untracked gaps, not failure.

### 7.7 Discoveries

Discoveries is the deterministic insight view. It shows only supported observations such as:

- largest time allocation;
- dominant time-of-day bucket;
- longest recorded session;
- planned completion;
- strongest qualifying energy or mood association.

Each discovery includes the supporting calculation. Optional associations require at least five values inside the category and five outside it, and a mean difference of at least 0.15. Otherwise the interface says there is not enough data.

### 7.8 Compare

Compare places two monthly worlds side by side as World A and World B.

It reconstructs and displays for both periods:

- world geometry and structures;
- protagonist selected from that period alone;
- level;
- district count;
- structure count;
- evolution label;
- title.

The comparison ledger covers:

- tracked time;
- sessions;
- active days;
- consistency;
- planned completion;
- recorded energy;
- recorded mood;
- category-share shifts.

Change is presented neutrally. More recorded time is never described as inherently better.

### 7.9 Data

Data is the transparent source archive. It includes:

- Add Records;
- normalized CSV export;
- LifeMap Capsule export;
- Passport backup;
- Passport restore;
- source-to-engine-to-realm lineage;
- a visible “Processed in this browser” statement;
- exact landmark source tracing;
- search across activity, category, and notes;
- category filter;
- sort by date or duration;
- normalized record table;
- date, activity, category, start time, duration, energy, mood, and status fields.

For responsiveness, the interface renders the first 100 matching rows. Exports retain the full selected period.

### 7.10 Codex

Codex is the human-readable methodology and rulebook. It explains:

- tracked time;
- allocation;
- consistency;
- XP and levels;
- fragmentation;
- associations;
- world mapping;
- development stages;
- landmark rules;
- roads and bridges;
- time reconstruction;
- protagonist selection;
- character equipment and achievements.

It explicitly states that there is no hidden model, generated score, or unsupported claim.

### 7.11 Daily Dock

Daily Dock supports a record in under a minute. It contains:

- current local date by default;
- activity with suggestions from recent activity names;
- category with existing and standard-domain suggestions;
- 15, 30, 60, and 90 minute shortcuts;
- custom duration from 0 to 1,440 minutes;
- optional energy from 1 to 5;
- optional mood from 1 to 5;
- optional context notes;
- a direct “Add to my world” action.

If the demo is active, the first Daily Dock record starts a clean personal realm rather than mixing fictional and personal data. A successful entry rebuilds the world immediately and can be undone.

## 8. Canonical activity data model

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string | yes after normalization | Stable local record identity |
| `date` | `YYYY-MM-DD` | yes | Activity date |
| `activity` | string | yes | User-provided activity label |
| `category` | string | yes | User-defined top-level category |
| `startTime` | `HH:MM` | no | Local start time |
| `endTime` | `HH:MM` | no | Local end time |
| `subcategory` | string | no | User-defined subdivision |
| `duration` | number | normalized | Minutes from 0 to 1,440 |
| `energy` | number | no | Optional observed value from 1 to 5 |
| `mood` | number | no | Optional observed value from 1 to 5 |
| `planned` | boolean | no | Whether the activity was planned |
| `completed` | boolean | no | Whether the plan was completed |
| `location` | string | no | Plain-text location label |
| `notes` | string | no | Plain text capped at 5,000 characters |

### Recognized import aliases

| Canonical field | Recognized examples |
| --- | --- |
| Date | `date`, `day`, `timestamp` |
| Activity | `activity`, `task`, `event`, `description` |
| Category | `category`, `type`, `group` |
| Duration | `duration`, `minutes`, `duration_minutes` |
| Start | `start`, `start_time`, `starttime` |
| End | `end`, `end_time`, `endtime` |
| Subcategory | `subcategory`, `sub_category` |
| Energy | `energy`, `energy_level` |
| Mood | `mood`, `mood_score` |
| Planned | `planned`, `is_planned` |
| Completed | `completed`, `complete`, `done` |
| Location | `location`, `place` |
| Notes | `notes`, `note` |

### Normalization behavior

- Exact ISO dates are validated. Other browser-parseable dates convert to ISO.
- Twelve-hour and twenty-four-hour times normalize to `HH:MM`.
- Duration accepts a number, `HH:MM`, text such as `1h 30m`, or valid start and end times.
- An end time before a start time is treated as an overnight interval.
- Duration is rounded to one decimal place.
- Negative, non-finite, or over-24-hour values are rejected.
- Energy and mood outside 1 to 5 are omitted with a warning.
- Common boolean forms such as yes, no, true, false, done, and complete normalize safely.
- Control characters are removed and string lengths are bounded.
- Invalid rows create human-readable issues instead of crashing the import.

### Duplicate identity

The stable duplicate fingerprint is:

```text
date
  + start time
  + normalized lowercase activity
  + normalized lowercase category
  + duration rounded to one decimal place
```

This fingerprint is used within one file and across incremental imports. Duplicate rows are skipped. Accepted imported records receive deterministic local IDs derived from an FNV-style hash of that fingerprint.

## 9. Complete analytics methodology

All calculations apply to the current selected period.

### Time and frequency

- Total tracked time: sum of normalized duration minutes.
- Category time: sum of duration for the exact category label.
- Subcategory time: sum of duration for the exact subcategory label.
- Category share: category minutes divided by all tracked minutes.
- Session count: number of normalized records.
- Active days: number of distinct ISO dates.
- Average duration: total minutes divided by record count.
- Daily time: duration grouped by date.
- Weekly time: duration grouped into Monday-starting weeks.
- Monthly time: duration grouped by calendar month.
- Day of week: duration grouped with UTC-safe calendar weekdays.

### Time-of-day buckets

- Morning: 05:00 through 11:59
- Afternoon: 12:00 through 16:59
- Evening: 17:00 through 21:59
- Night: all other times
- A missing start time defaults to noon only for time-of-day distribution.

### Streaks and gaps

- An active day is any date with at least one normalized record.
- Consecutive active dates form a streak.
- A gap counts the missing calendar dates between two active dates.
- Longest streak and longest gap are calculated globally and per category.

### Overall consistency

```text
55% x active-day frequency
+ 30% x gap regularity
+ 15% x longest-streak strength
```

Where:

- active-day frequency is active days divided by 55% of the represented date span, capped at 1;
- gap regularity is `1 / (1 + standard deviation of active-day gaps)`;
- overall streak strength is longest streak divided by 10, capped at 1.

The result is rounded to 0 through 100.

### Category consistency

```text
50% x category active-day frequency
+ 30% x category gap regularity
+ 20% x category longest-streak strength
```

Category frequency uses active dates divided by 35% of the represented date span, capped at 1. Category streak strength uses longest streak divided by 7, capped at 1.

### Fragmentation

- One normalized record is one session.
- A short session has positive duration below 30 minutes.
- A context switch occurs when adjacent time-sorted records on the same date use different categories.
- These are neutral structural measures, not productivity judgments.

### Planned completion

```text
completed planned records / all planned records
```

When there are no planned records, the value is unavailable rather than zero.

### XP

Category XP is:

```text
duration minutes / 3
+ record count x 8
+ consistency x 2
+ completed planned record count x 18
```

Total XP is the sum of all category XP. XP is a visualization of recorded engagement and does not morally rank categories.

### Levels

The next threshold is:

```text
round(120 x level^1.55)
```

The application reports level, XP inside the current level, and XP remaining to the next threshold.

### Associations

For optional energy and mood, LifeMap compares:

```text
mean inside one category
versus
mean across all other category records
```

Both groups require at least five values. Absolute mean differences below 0.15 are suppressed. Shown results include sample size and a direct warning that association is not evidence of causation. The four strongest qualifying associations can be retained, and the strongest can appear in Discoveries.

### Insight set

The finite deterministic insight engine can report:

- largest time allocation;
- dominant time-of-day bucket;
- longest recorded session;
- planned completion;
- strongest qualifying energy or mood association.

No generic life advice or motivational filler is generated.

## 10. Complete world-generation system

### Separation of concerns

`src/world-generation.ts` converts analytics into a typed `WorldConfiguration`. `src/ui/world.tsx` renders that blueprint. The renderer contains no random world-building behavior.

```text
ActivityRecord[]
  -> selected-period analytics
  -> WorldConfiguration
       -> DistrictBlueprint[]
       -> WorldConnection[]
       -> WorldLandmark[]
       -> atmosphere
       -> stable fingerprint
  -> SVG and CSS renderer
```

### Recognized world identities

Category labels are mapped by keyword to:

- Career: career, work, business, project, professional
- Learning: learn, study, education, reading, research, language
- Fitness: fitness, health, exercise, sport, training, run, walk
- Social: social, family, friend, community, relationship
- Recreation: recreation, leisure, rest, film, game, hobby
- Creative: creative, art, music, writing, design, making
- Exploration: exploration, outdoor, travel, adventure, nature
- General: any category without a recognized identity

User category labels remain arbitrary. Identity matching changes environmental semantics and protagonist selection, not the original label.

### District catalog

| Identity | Core landmark | Terrain language |
| --- | --- | --- |
| Career | Guildhall | Civic terraces |
| Learning | Great Archive | Scholars' quarter |
| Fitness | Training Grounds | Highland circuit |
| Social | Common Plaza | Gathering quarter |
| Recreation | Leisure Garden | Lantern park |
| Creative | Open Atelier | Makers' ward |
| Exploration | Waystation | Frontier paths |
| General | District Hall | Recorded terrain |

### District formulas

- Footprint: `0.80 + min(0.34, category share x 0.90)`.
- Development 1: XP below 360.
- Development 2: XP from 360 through 719.
- Development 3: XP from 720 through 1,199.
- Development 4: XP from 1,200 through 1,999.
- Development 5: XP of 2,000 or more.
- Elevation: `9 + development x 4` SVG units.
- Structures: `clamp(1 + development + floor(record count / 12), 2, 9)`.
- Activity lights: `clamp(ceil(record count / 4), 1, 12)`.
- Vegetation: `clamp(ceil(category consistency / 14), 1, 8)`.
- Vitality: record count divided by the greater of 8 or 55% of active days, clamped from 0.12 through 1.
- Atmosphere: the largest time-of-day bucket.
- Overall world intensity: session count divided by twice the active-day count, clamped from 0.15 through 1.
- Fog or unexplored treatment: fewer than three records in a visible district.

Only the six largest categories are rendered spatially for legibility. Every category remains available in calculations, character logic, Data, and exports.

### Tile geometry rebuilt after visual QA

Each full-world platform uses a fixed six-point polygon with local coordinates:

```text
-108,0  -54,-72  54,-72  108,0  54,72  -54,72
```

Key geometry rules:

- half width: 108 SVG units;
- half height: 72 SVG units;
- front ridge depth: 12 SVG units;
- one through six tile counts have explicit balanced center coordinates;
- structures have nine fixed tile-local offsets;
- activity nodes have twelve fixed tile-local offsets;
- landmarks have four fixed tile-local offsets;
- a bounded inner polygon represents share at scale 0.72 through 0.92;
- the platform boundary stays fixed so data does not make objects drift;
- visual contents use the same local coordinate system and clipping region;
- district names sit on the front ridge.

The standard fictional demo uses amber Career, green Learning, coral Recreation, violet Social, and blue Fitness. For arbitrary user categories, the six-color palette is assigned by stable all-time district slot.

### Stable geography

The all-time category order fixes district slots. Monthly reconstruction reuses that order, so a district does not jump to a new part of the map merely because its share changes in one month.

### Landmarks

Every landmark stores:

- ID;
- category;
- kind;
- title;
- plain-language meaning;
- represented metric;
- exact appearance rule;
- period label;
- exact normalized source record IDs.

Appearance rules:

| Landmark | Rule |
| --- | --- |
| District core | Every represented category with at least one valid record |
| Leading activity | Highest-time activity occurs at least twice; ties use alphabetical activity name |
| Streak beacon | Category longest active-day streak reaches five days |
| Milestone marker | District reaches development stage 4 or 5; title uses completed ten-hour bands |

This creates the trace path:

```text
world -> district -> landmark -> metric -> exact normalized records
```

### Connections

Records are sorted by date, start time, and category. Adjacent same-day records in different visible categories create a transition:

- 1 to 2 transitions: trail
- 3 to 5 transitions: road
- 6 or more transitions: bridge

If real transitions do not connect all represented districts, deterministic quiet trails join adjacent stable slots. The quiet trail preserves one coherent realm but is clearly explained as a structural connection rather than fabricated activity.

### Temporal fingerprint

A stable FNV-style hash uses sorted date, time, activity, category, duration, and period key. It is an in-memory render identity only. It is not uploaded, persisted, or used for tracking.

## 11. Complete protagonist system

### Selection rule

Category minutes are aggregated into recognized life-domain identities. If at least one recognized identity exists, unrecognized General minutes do not decide the protagonist. The identity with the most minutes selects the core form.

Five domains reveal a specialist form when that strongest domain represents at least 68% of all tracked time.

| Strongest identity | Core form | Specialist at 68% |
| --- | --- | --- |
| Career and projects | City Architect | Guild Forgemaster |
| Learning and research | Archive Sage | Observatory Scholar |
| Fitness and health | Trail Warden | Circuit Ranger |
| Social and community | Hearth Envoy | Festival Herald |
| Recreation and restoration | Grovekeeper | Dream Gardener |
| Creative work and making | Atelier Weaver | Atelier Weaver |
| Exploration or generic | Wayfinder | Wayfinder |

Exact ties use this fixed order:

```text
career -> learning -> fitness -> social -> recreation -> creative -> exploration -> general
```

The selection visualizes recorded activity. It does not infer the user's gender, identity, personality, health, or worth.

### The twelve-character canon

| Character | Domain and form | Locked identity | Silhouette, wardrobe, and signature props |
| --- | --- | --- | --- |
| The Wayfinder | Exploration, core | Young woman with warm medium skin, short wavy dark hair, and small braided ornaments | Long asymmetric teal and gold cartographer coat, expedition pack, ivory shirt, dark field trousers, tall boots, brass compass, map scrolls, survey satchel |
| The City Architect | Career, core | Young woman with warm olive skin and dark hair in a practical loose bun | Tailored deep-teal architectural coat with gold piping and amber lining, cream trousers, riding boots, rolled plans, dividers, document satchels |
| The Guild Forgemaster | Career, specialist | Older Black man with close gray hair, full gray beard, and powerful stocky build | Broad teal work coat with orange lining, charcoal waistcoat, heavy tool belt, reinforced trousers, brass hammer, measuring tools, forge plans |
| The Archive Sage | Learning, core | Young scholar with round glasses, calm expression, and tied-back dark hair | Layered teal and moss scholarly coat, cream knit layer, violet and gold details, book satchel, field book, rolled notes |
| The Observatory Scholar | Learning, specialist | Older brown-skinned man with swept white hair, full white beard, and observant gaze | Long teal, violet, gold, and cream observatory robe, broad sleeves, grounded boots, astrolabe, open codex, spyglass |
| The Trail Warden | Fitness, core | Athletic bearded man with short brown hair and an alert expedition stance | Technical sleeveless teal and coral vest, ivory athletic layer, charcoal trousers, trail pack, water bottle, route compass |
| The Circuit Ranger | Fitness, specialist | Young East Asian woman with short dark hair and a compact athletic climber build | Cropped teal and coral technical jacket, cargo joggers, gloves, climbing boots, rope, canteen, circuit compass |
| The Hearth Envoy | Social, core | Young Black man with short curls, neat beard, and warm ceremonial presence | Flowing teal, cream, violet, and gold formal coat, polished boots, signal lantern, letters, relationship medallions |
| The Festival Herald | Social, specialist | South Asian woman with long decorated braids, bright expression, and confident bearing | Wide teal and ivory ceremonial coat, violet sashes, gold embroidery, layered trousers, festival lantern, sealed invitations, ceremonial satchel |
| The Grovekeeper | Recreation, core | Young East Asian man with swept dark hair, relaxed smile, and outdoorsy build | Casual teal field jacket, cream knitwear, sand trousers, scarf, flowered pack, camera, thermos, wildflowers |
| The Dream Gardener | Recreation, specialist | Older East Asian woman with silver hair in a loose bun and a grounded expression | Generous teal and moss botanical coat, ivory linen, soft trousers, botanical journal, pruning shears, seed satchel |
| The Atelier Weaver | Creative, core | Young Black man with short shaped hair, groomed beard, and athletic creative presence | Modern teal studio jacket with coral accents, ivory shirt, charcoal trousers, sketchbook, camera, headphones, art tools |

The portrait files are original local PNG assets in `public/art/characters/`. Current LifeMap ships no third-party character model.

### Equipment

The primary category and every category holding at least 12% of the selected period can contribute equipment. Duplicate equipment types are removed and the first three qualifying domain items are retained. Every protagonist also carries a Brass Compass.

| Identity | Equipment |
| --- | --- |
| Career | Surveyor's Satchel |
| Learning | Field Codex |
| Fitness | Trail Bracers |
| Social | Signal Lantern |
| Recreation | Keepsake Deck |
| Creative | Cartographer's Sketchbook |
| Exploration | Brass Compass |

Each equipment item states the category and share that produced it.

### Attributes

| Attribute | Formula |
| --- | --- |
| Primary allocation | Leading category share as a percentage |
| Recorded rhythm | Overall consistency from 0 to 100 |
| District range | Category count times 18, clamped to 100 |
| Trail continuity | Longest streak times 9, clamped to 100 |

Each attribute includes literal evidence text.

### Titles

Title priority is:

1. Level 10 or higher: Architect of the Known World
2. Otherwise, at least five unlocked achievements: Keeper of Recorded Paths
3. Otherwise, at least five represented categories: Wayfinder of Many Roads
4. Otherwise, level 5 or higher: District Pathfinder
5. Otherwise: New Cartographer

### Evolution tiers

| Overall level | Tier | Label |
| --- | ---: | --- |
| 1 to 4 | 1 | Trailborn |
| 5 to 8 | 2 | Pathfinder |
| 9 to 14 | 3 | Realmwalker |
| 15 to 24 | 4 | Atlas Keeper |
| 25 or higher | 5 | World Architect |

Evolution affects aura and presentation. It does not replace the canonical face, body, wardrobe, or signature props.

### Achievements

| Achievement | Exact rule |
| --- | --- |
| First Record | At least one valid record |
| Seven-Day Trail | Overall longest active-day streak reaches seven days |
| Hundred-Hour Atlas | Total recorded time reaches 6,000 minutes |
| Five Districts Explored | Five distinct categories contain valid records |
| Long Session | One record reaches 180 minutes |
| Consistent Month | One month contains at least ten active days and consistency of at least 65 |
| District Established | One category reaches 3,000 minutes |

Every achievement publishes its rule, unlocked state, evidence, and source record IDs.

## 12. Final visual system

### Direction

The final design language is an original premium editorial RPG atlas:

- cartographic 2.5D rather than generic stock 3D;
- deep ink atmosphere;
- parchment typography;
- restrained mineral category colors;
- gold action accents;
- isometric fixed platforms;
- architectural landmarks;
- connected paths;
- environmental vegetation and lights;
- one canonical protagonist;
- analytical controls treated as a HUD, archive, or Codex.

### Core design tokens

- Ink background: `#08191b`
- Raised ink: `#10272a` and `#173235`
- Parchment foreground: `#f5f2e8`
- Gold accent: `#e7cc78`
- Muted copy: `#9fb3ae`
- Category colors: amber, green, coral, violet, blue, yellow
- Display type: Georgia and system serif fallback
- Body type: Inter and system sans-serif fallback
- Radius: approximately 0.65rem through 1.5rem by hierarchy
- Internal spacing rhythm: 4, 8, and 12 pixels

The interface intentionally avoids random neon, rainbow gradients, constant glow, excessive glass cards, emoji, stock game icons, and decorative motion without meaning.

### Motion language

Motion communicates:

- camera zoom and reset;
- district selection and focus;
- protagonist travel or contextual position;
- world reconstruction between eras;
- XP progress;
- selected states;
- restrained character idle depth.

`prefers-reduced-motion` removes idle animation and compresses transitions to near-zero duration.

## 13. Privacy and security architecture

### What is absent

The shipped application contains no:

- personal-data backend;
- user database;
- account or authentication system;
- cloud storage client;
- AI API;
- runtime API key;
- analytics SDK;
- telemetry;
- advertising tracker;
- personal-data upload endpoint.

### What happens to a file

1. The browser's File API reads the selected local file.
2. Deterministic parsers convert it into plain JavaScript objects.
3. Mapping, validation, normalization, analytics, and world generation run in browser memory.
4. React renders imported strings as escaped text.
5. Exports are generated locally with `Blob` and downloaded through an object URL.
6. Reset or page refresh drops the in-memory dataset.

### Storage boundaries

- Personal records are not automatically written to cookies, `localStorage`, IndexedDB, Cache Storage, or the service worker.
- Session mapping recipes and undo history stay in React memory.
- Display name, accent, and journey style stay in React memory.
- A Passport is written only when the user explicitly downloads it.
- The service worker caches only the public application shell and same-origin static assets.
- A deliberately downloaded Passport, CSV, or Capsule remains in the user's Downloads folder until the user removes it.

### Untrusted input controls

- CSV, JSON, and Passport files are capped at 10 MB.
- JSON must be an array of objects or an object with an `activities` array.
- CSV is parsed as data and never executed.
- Invalid dates, times, durations, scores, and types become issues.
- Control characters and null bytes are removed.
- Length limits are applied before rendering.
- Imported values are not interpreted as HTML or code.
- Capsule HTML uses explicit escaping.
- CSV export quotes cells and doubles embedded quotation marks.
- Passport records are revalidated through the canonical import pipeline.
- Passport restore requires confirmation and can be undone immediately.

## 14. Export, portability, and reset

### Normalized CSV

Exports every canonical field for the selected period. Values are quoted safely.

### LifeMap Capsule

Generates a standalone tracker-free HTML file containing:

- selected date range;
- record count;
- tracked time;
- consistency;
- engagement level;
- category time, share, and consistency;
- supported observations;
- methodology.

It needs no server after download.

### LifeMap Passport

A `.lifemap` Passport is versioned JSON containing:

- format identifier `lifemap-passport`;
- version 1;
- export timestamp;
- all canonical activity records;
- display name, accent, and journey style;
- session mapping recipes.

It is the explicit user-controlled way to continue on another browser or device. Restore sanitizes preferences, normalizes all records again, asks for confirmation, replaces the current realm, and exposes Undo.

### Reset

Reset requires confirmation and clears:

- active records;
- selected period and region;
- import buffers;
- staged manual records;
- issues;
- record trace filters;
- character preferences;
- mapping recipes;
- Daily Dock state;
- pending Passport;
- notices and undo history.

The application returns to Landing.

## 15. Mobile and installable web app status

LifeMap is a responsive Progressive Web App.

Implemented mobile behavior:

- layouts down to 320px;
- no expected page-level horizontal overflow;
- touch-friendly controls;
- fixed bottom navigation dock;
- central Log action;
- simplified responsive world composition;
- stacked metrics and panels;
- installable manifest;
- standalone display mode;
- maskable 192px and 512px icons;
- Apple touch icon;
- offline shell after a successful public load.

Installation paths:

- iPhone or iPad: Safari Share menu, then Add to Home Screen.
- Android: Chrome menu, then Install app or Add to Home screen.

This is not currently a native App Store or Google Play binary. A native wrapper or store submission would introduce store-specific testing and potentially paid developer accounts. The PWA route is the implemented zero-hosting-cost phone route.

## 16. Accessibility

Implemented accessibility work includes:

- semantic landmarks and headings;
- skip links;
- keyboard-operable navigation;
- keyboard-selectable districts and landmarks;
- Enter and Space activation for spatial controls;
- visible focus treatment;
- ARIA labels and current-page states;
- SVG title and description;
- text alternatives for every color encoding;
- explicit values in district labels and controls;
- screen-reader-readable district and landmark summaries;
- non-hover interaction paths;
- touch-size controls;
- reduced-motion handling;
- readable contrast on dark atlas surfaces;
- responsive layout without microscopic text.

## 17. Performance architecture

- Static HTML, CSS, JavaScript, images, and service worker at runtime.
- No runtime server computation.
- Linear analytics passes with small `Map` and `Set` aggregations.
- React memoization for selected records, analytics, all-time category order, and world configuration.
- Only six categories rendered spatially.
- At most 100 visible table rows.
- Full data retained for exports.
- 10 MB input cap.
- No Three.js or GLTF payload in the final build.
- No large local model, game engine, database SDK, or AI library.

A Web Worker is only proposed if supported data sizes grow materially.

## 18. Testing and quality assurance

### Automated suite

Current verified result on 1 September 2026:

```text
Test files: 5 passed
Tests: 35 passed
```

Coverage includes:

- quoted, escaped, empty, and malformed CSV;
- JSON arrays, envelopes, and malformed JSON;
- alias detection and required mappings;
- date and time normalization;
- direct and derived duration;
- invalid duration and scores;
- within-file and cross-import duplicates;
- stable record merging;
- Passport parsing and validation;
- category aggregation and allocation;
- average duration;
- streaks and gaps;
- planned completion;
- fragmentation and context switches;
- day and time distributions;
- bounded consistency;
- deterministic XP and level thresholds;
- association sample thresholds;
- empty-data honesty;
- monthly filtering and period comparison;
- deterministic demo generation;
- normalized CSV and Capsule generation;
- HTML escaping;
- deterministic world equality;
- stable temporal slots;
- structural district growth;
- landmark source traceability;
- all archetype mappings and tie breaking;
- period-specific protagonist changes;
- evolution bands;
- achievement thresholds;
- tile geometry and in-bounds feature anchors.

### Browser QA performed during development

The application was tested from its real development server in the Chromium-based in-app browser at desktop and mobile sizes. The checks covered:

- landing;
- onboarding;
- CSV selection and field mapping;
- demo generation;
- world selection and camera behavior;
- protagonist positioning;
- Character;
- Journey reconstruction;
- Discoveries;
- Compare;
- Data;
- Codex;
- exports;
- Reset;
- 320px overflow;
- console errors;
- desktop layout at 1440 by 900;
- Daily Dock submission;
- clean demo-to-personal conversion;
- Data archive on mobile;
- incremental append;
- duplicate skipping;
- Undo.

The 320px fix specifically removed a transformed app-shell containing block that interfered with the fixed dock, set the shell perspective to none, and clipped horizontal overflow. Body and document scroll width were checked against viewport width.

### Honest QA boundary

Chromium browser QA has been performed. Full automated Safari and Firefox regression suites, physical-device labs, and native iOS or Android store tests are not part of the current repository.

## 19. Deployment, public URL, and GitHub status

### Current public deployment

Public URL:

`https://lifemap-personal-progress-world.sanvidvaidya.chatgpt.site/`

The current public release was deployed through OpenAI Sites as version 8 after commit `798fe2b`.

The `chatgpt.site` suffix is a hosting domain, not a technical watermark embedded in the application. It can be removed by:

- connecting a custom domain where the host supports it; or
- deploying the static build to another host, including GitHub Pages.

A custom domain usually costs money. Hosting can remain free.

### GitHub readiness

The repository contains `.github/workflows/deploy-pages.yml`. On every push to `main`, the workflow:

1. checks out the repository;
2. installs pnpm and Node;
3. installs the locked dependencies;
4. runs tests;
5. builds the static site;
6. uploads `dist/`;
7. deploys to GitHub Pages.

Vite uses relative asset paths so a project URL such as `https://owner.github.io/lifemap/` works without a hard-coded repository name.

The code is Git-backed and GitHub-ready. This chronicle does not claim that a public repository on the user's personal GitHub.com account already exists, because no such account-linked repository was verified in the recorded build session.

### Local development

Requirements:

- Node.js 22.13 or newer
- pnpm

Commands:

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm preview
```

Development URL: `http://127.0.0.1:3000/`

Production output: `dist/`

## 20. Cost model

The implemented product has no per-user infrastructure bill because it uses:

- static hosting;
- browser-side parsing;
- browser-side analytics;
- browser-side world generation;
- no AI API;
- no hosted account service;
- no paid database;
- no cloud file storage;
- no server-side processing.

Free static hosts, including GitHub Pages and the current Sites deployment, can serve the application. Optional costs can arise from:

- buying a custom domain;
- future native App Store or Play Store developer programs;
- future optional services that are not part of the current architecture.

None of those optional costs is required to use the current public PWA.

## 21. User-feedback ledger and how each issue was handled

The following concerns directly shaped the final product:

1. **The UI had not changed enough.** The project received a complete character-first RPG composition rather than a small decorative pass.
2. **Wayfinder could not represent every user's data.** Deterministic domain selection and a twelve-character roster were added.
3. **The roster looked like only women.** Men and varied ages, heritages, and silhouettes were added while keeping selection independent of user gender.
4. **The Career card covered the protagonist's face.** Character and HUD lanes were separated.
5. **World contents floated outside the tiles.** The world platform geometry and all local anchors were rebuilt and tested.
6. **Hero typography collided.** Word and line spacing were corrected.
7. **Em dashes made the copy feel artificial.** User-facing copy was rewritten without them.
8. **Journey used an unreadable cream section.** It was replaced with a dark, high-contrast atlas surface.
9. **The protagonist covered the four landing tiles.** The protagonist was moved into a separate far-left lane.
10. **Recreation and Fitness colors were reversed.** Standard demo ordering was corrected to coral Recreation and blue Fitness.
11. **District navigation covered tile names.** The selector and label lanes were repositioned.
12. **The Journey title covered the map.** The title received a bounded desktop lane and responsive stacking.
13. **Trail Warden's head was cropped.** Full-world portrait framing gained top headroom and top-aligned containment.
14. **The gold CTA used white text.** It changed to dark text for contrast.
15. **July and August used the same protagonist.** Demo data and period-specific selection were corrected so different activity patterns select different characters.
16. **The first 3D result still looked flat.** A true animated 3D experiment was attempted.
17. **The next result looked like a puppet.** It was replaced with rigged RPG models.
18. **The rigged models did not resemble the original designs.** A formal character bible was created, then exact original forms became canonical.
19. **Combining mismatched 2D and 3D felt incoherent.** Generic models and Three.js were completely removed.
20. **The product needed more daily usefulness.** Daily Dock, incremental Data Inbox, deduplication, mapping recipes, Undo, Passport, and PWA support were added.
21. **The product needed to work on phones without paid APIs.** The responsive installable PWA became the zero-cost mobile path.
22. **The product had to remain shippable and stable.** The final release retained tests, static deployment, local-first privacy, and a GitHub Pages pipeline.

## 22. Ideas discussed but not yet implemented

These ideas are part of the product roadmap, not claims about the current release.

### Character DNA

A richer transparent explanation of how every category, activity, streak, period, and preference contributes to identity, equipment, and appearance. The current archetype evidence and character bible are the foundation, but a full interactive DNA editor or explainer does not yet exist.

### Quest Lab

User-authored, nonjudgmental goals built from explicit record rules. It would avoid fake game quests and would need transparent progress evidence. It has not been implemented.

### Chronicle Studio and social sharing

Share-ready visual compositions for Instagram, X/Twitter, Reddit, and other platforms, combining a user's selected protagonist, tiles, period, records, and privacy-safe summary. Current Capsule export is a local HTML summary, not a social image composer.

### World Memory

Explicit user-controlled historical persistence beyond downloaded Passports, potentially encrypted on-device. No automatic persistence exists today.

### Presentation modes

Proposed Realm-first, Balanced, and Data-first modes for users who prefer different levels of RPG presentation. The current product has one responsive design system.

### Native integrations

Potential adapters for Apple Health, Google Fit, calendars, fitness devices, or social platforms would require careful permission, privacy, policy, and cost review. None is currently included, and core LifeMap will remain usable without them.

### Faithful true 3D meshes

A future mesh-based roster would need twelve custom models that preserve every character-bible identity, face, body, wardrobe, palette, and prop. Generic rigs are explicitly not an acceptable substitute. No such custom mesh roster exists today.

### Additional technical roadmap

- optional explicit encrypted device persistence;
- user-authored category colors and landmark rules;
- Web Worker analytics for much larger files;
- additional non-causal statistical methods with confidence intervals;
- automated Safari and Firefox end-to-end CI;
- wider physical-device regression testing.

## 23. Current known limitations

- Personal data is intentionally session-only unless the user downloads a Passport.
- A browser refresh clears the active realm.
- The world renders up to six categories spatially.
- Associations are simple group-mean comparisons, not causal or clinical analysis.
- Input files are capped at 10 MB.
- The record table displays at most 100 matching rows at once.
- The current dimensional character system is 2.5D, not twelve custom skeletal 3D meshes.
- The public URL currently contains `chatgpt.site` unless moved to another host or custom domain.
- A public GitHub.com repository owned by the user is not yet verified.
- Native iOS and Android store packages are not included.
- Cross-browser automated QA beyond Chromium remains future work.

## 24. Technology stack

- React 19
- React DOM 19
- TypeScript 5.9
- Vite 8
- Tailwind CSS 4 utilities and local design CSS
- shadcn and Base UI primitives
- Lucide icons
- date-fns
- Vitest 4
- oxlint and oxfmt
- OpenAI Sites Vite adapter for the current public deployment
- GitHub Actions for GitHub Pages deployment
- Browser-native File, Blob, URL, Cache, and service-worker APIs

Current runtime deliberately excludes Three.js and external 3D models.

## 25. Repository map

```text
lifemap/
  .github/workflows/deploy-pages.yml
  .openai/hosting.json
  AGENTS.md
  PROJECT_SPEC.md
  README.md
  docs/
    ANALYTICS.md
    ARCHITECTURE.md
    DATA_MODEL.md
    DESIGN.md
    PRIVACY.md
    PROJECT_CHRONICLE.md
    TESTING.md
    THIRD_PARTY_ASSETS.md
    WORLD_GENERATION.md
  public/
    art/characters/           twelve canonical portraits
    apple-touch-icon.png
    favicon.svg
    icon-192.png
    icon-512.png
    manifest.webmanifest
    sw.js
  scripts/
    prepare-sites-output.mjs
  server/
    index.js                  static asset and SPA fallback adapter
  src/
    analytics.ts             deterministic metrics, XP, insights, comparison
    character-bible.ts       locked twelve-character canon
    export.ts                CSV, Capsule, and Passport exports
    types.ts                 canonical domain types
    world-generation.ts      pure world, landmark, connection, character rules
    world-layout.ts          fixed platform geometry and tile-local anchors
    data/
      demo.ts                deterministic fictional history
      import.ts              parsing, mapping, normalization, merging, Passport
    ui/
      faithful-protagonist.tsx
      lifemap-app.tsx
      world.tsx
    main.tsx
    styles.css
  tests/
    analytics.test.ts
    import.test.ts
    pipeline.test.ts
    world-generation.test.ts
    world-layout.test.ts
```

## 26. Exact Git milestone ledger

| Commit | Date | Milestone |
| --- | --- | --- |
| `14215df` | 28 Aug 2026 | Build LifeMap local-first visual analytics experience |
| `039407b` | 28 Aug 2026 | Add Sites static asset worker adapter |
| `67b1ce7` | 28 Aug 2026 | Stage static client assets for Sites hosting |
| `97dc9fb` | 28 Aug 2026 | Document the public LifeMap deployment |
| `ec094d3` | 28 Aug 2026 | Evolve LifeMap into a living data-driven world |
| `3a50dee` | 29 Aug 2026 | Transform LifeMap into a character-first RPG experience |
| `db27edb` | 29 Aug 2026 | Add deterministic multi-character protagonist roster |
| `1347529` | 29 Aug 2026 | Fix landing layout and remove em dash copy |
| `3adf7af` | 29 Aug 2026 | Rebuild world tiles and fix Journey contrast |
| `1157b17` | 29 Aug 2026 | Fix world composition and demo protagonists |
| `2e35cb1` | 29 Aug 2026 | Add live 3D protagonist roster |
| `2c25126` | 30 Aug 2026 | Replace puppet protagonists with rigged RPG characters |
| `b1667d9` | 30 Aug 2026 | Add faithful protagonist archive |
| `3d8f863` | 30 Aug 2026 | Make every protagonist visibly distinct |
| `ba2a721` | 31 Aug 2026 | Make original characters the canonical living forms |
| `c080127` | 31 Aug 2026 | Remove mismatched generic character rigs |
| `798fe2b` | 1 Sep 2026 | Add local-first daily loop and phone PWA |

## 27. Current definition of done

LifeMap currently satisfies the original objective at the implemented web-app level:

- complete rather than a mockup;
- functional import, manual entry, demo, append, analysis, world, character, history, comparison, export, backup, restore, undo, and reset flows;
- deterministic and traceable calculations;
- original character and world identity;
- local-first privacy;
- responsive PWA behavior;
- no paid runtime dependency;
- automated tests;
- documented architecture;
- static public deployment;
- GitHub Pages readiness.

The final product statement is:

```text
My data creates my world.
My activity creates my XP.
My XP creates visible progression.
My activity mix selects my protagonist.
My history creates my journey.

The system remains private, deterministic, traceable, and technically real.
```
