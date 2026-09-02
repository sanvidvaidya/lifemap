# World generation engine

LifeMap converts normalized activity records into a deterministic world blueprint before rendering any SVG. This separation keeps the RPG metaphor inspectable and testable.

## Pipeline

```text
ActivityRecord[]
  → selected-period analytics
  → WorldConfiguration
      ├─ DistrictBlueprint[]
      ├─ WorldConnection[]
      ├─ WorldLandmark[]
      ├─ atmosphere
      └─ stable fingerprint
  → SVG/CSS world renderer
```

`src/world-generation.ts` is pure. Identical normalized records, period key, and category order return an identical object. The renderer in `src/ui/world.tsx` has no random world-building behavior.

## District identity and position

Category labels are matched to a finite identity catalog: career, learning, fitness, social, recreation, creative, exploration, or general. Identity changes the landmark name and terrain semantics, not the underlying score.

The all-time category order assigns each of the six visible districts a stable slot. A monthly world uses that same order, so a district stays geographically stable even when another category becomes larger in that month.

## Visual encodings

- Footprint: `0.80 + min(0.34, category share × 0.90)`.
- Development: category XP thresholds of 360, 720, 1,200, and 2,000 create five documented stages.
- Structures: `clamp(1 + development + floor(record count / 12), 2, 9)`.
- Session lights: `clamp(ceil(record count / 4), 1, 12)`.
- Vegetation: `clamp(ceil(category consistency / 14), 1, 8)`.
- Vitality: record count divided by the greater of 8 or 55% of active days, clamped to 0.12–1.
- Elevation: `9 + development × 4` SVG units.
- Atmosphere: the largest deterministic start-time bucket.

These encodings are descriptive. A large or highly developed district means more recorded engagement under the published formula, not that the activity is morally better.

## Landmarks and traceability

Every landmark contains `sourceRecordIds`, a plain-language rule, the represented metric, and the selected period label.

| Landmark         | Appearance rule                                                       |
| ---------------- | --------------------------------------------------------------------- |
| District core    | At least one valid category record                                    |
| Leading activity | One activity occurs at least twice; time wins, then alphabetical name |
| Streak beacon    | Category longest streak reaches five days                             |
| Milestone marker | District reaches development 4 or 5                                   |

Selecting a landmark in the world opens its explanation. “Inspect source records” switches to the Data view and filters the all-time in-memory dataset to those exact IDs.

## Connections

Records are sorted by date, start time, and category. Adjacent same-day records in different categories create a transition:

- 1–2 transitions: trail
- 3–5 transitions: road
- 6 or more: bridge

If activity transitions do not connect all represented districts, deterministic quiet trails connect adjacent stable slots. This preserves a single coherent world without inventing engagement.

## Temporal reconstruction

Each calendar month is filtered and re-analyzed independently. The Journey and Compare views call the same world generation function as the primary World view. Choosing an era reconstructs a complete period-specific blueprint in place; entering that era carries the selected period into the primary World view.

The fingerprint uses a stable FNV-style hash of sorted, non-sensitive record values plus the period key. It is used only as an in-memory render identity; it is never uploaded, persisted, or used for tracking.

## Character generation

The character profile is derived from analytics:

- archetype: strongest recognized life-domain identity by aggregate minutes;
- title: level, represented district count, and unlocked achievement count;
- current location: selected district;
- equipment: primary category plus categories holding at least 12% of selected-period time;
- attributes: primary allocation, consistency, category range, and longest streak;
- achievements: finite, documented thresholds with evidence and source record IDs.

### Archetype selection

LifeMap aggregates category minutes into its recognized life-domain identities. If at least one recognized identity exists, generic or uncategorized minutes do not decide the character. The identity with the most minutes selects a core protagonist, while five domains reveal a specialist when their share reaches 68%:

| Strongest identity           | Core form      | Specialist at 68% share |
| ---------------------------- | -------------- | ----------------------- |
| Career and projects          | City Architect | Guild Forgemaster       |
| Learning and research        | Archive Sage   | Observatory Scholar     |
| Fitness and health           | Trail Warden   | Circuit Ranger          |
| Social and community         | Hearth Envoy   | Festival Herald         |
| Recreation and restoration   | Grovekeeper    | Dream Gardener          |
| Creative work and making     | Atelier Weaver | Atelier Weaver          |
| Exploration or generic input | Wayfinder      | Wayfinder               |

Exact minute ties use the fixed identity order `career → learning → fitness → social → recreation → creative → exploration → general`. The 68% test uses the strongest recognized domain divided by all tracked minutes. These rules are deterministic: identical normalized records always select the same protagonist. They visualize the activity pattern and never attempt to infer a user’s gender or personal identity. Users may customize the display name independently of the selected form.

The fictional demo makes this period-specific behavior visible. A July training block gives Fitness the strongest minute total and selects the Trail Warden. Career leads again in August and selects the City Architect. The Compare view therefore changes the protagonist because the underlying chapter data changed, not because a different costume was assigned to the screen.

The protagonist also has a deterministic visual evolution tier:

| Overall level | Evolution tier | Presentation label |
| ------------- | -------------: | ------------------ |
| 1–4           |              1 | Trailborn          |
| 5–8           |              2 | Pathfinder         |
| 9–14          |              3 | Realmwalker        |
| 15–24         |              4 | Atlas Keeper       |
| 25+           |              5 | World Architect    |

Evolution changes the aura and status treatment around the selected protagonist. Equipment slots, achievement sigils, title, XP, and the current region provide the other visible changes. No random cosmetic state is used.

The brass compass is the universal LifeMap instrument. Other gear is category-derived. Character state is a visualization of records, not an assessment of identity, health, worth, or productivity.

## Tests

`tests/world-generation.test.ts` covers deterministic equality, stable temporal slots, structural growth, landmark source traceability, every archetype mapping, tie-breaking, character derivation, visual evolution bands, alternate-user world changes, achievement thresholds, and empty data.
