# Architecture

## Runtime shape

LifeMap is a client-only React application built by Vite into static HTML, CSS, and JavaScript. A production deployment needs only a static file host. GitHub Pages is the primary target; OpenAI Sites is also supported by the included build metadata.

There is no application server, API route, authentication layer, remote database, or runtime secret.

## Modules

```text
index.html
└─ src/main.tsx
   └─ src/ui/lifemap-app.tsx
      ├─ src/data/import.ts
      ├─ src/data/demo.ts
      ├─ src/analytics.ts
      ├─ src/world-generation.ts
      ├─ src/export.ts
      └─ src/ui/world.tsx
```

- `lifemap-app.tsx` owns the in-memory dataset, selected period, active product view, Daily Dock, import state, undo buffer, and session-only character preferences.
- `import.ts` parses untrusted files and Passports, suggests or recalls session mappings, validates values, and removes duplicates within and across imports.
- `analytics.ts` is pure: the same record list returns the same metrics, category progression, associations, and insight statements.
- `world-generation.ts` converts selected-period analytics into typed district, landmark, connection, achievement, and character blueprints. It owns deterministic world rules and source-record traceability.
- `world.tsx` renders a world blueprint as lightweight SVG geometry, structures, landmark controls, vegetation, paths, atmosphere, and avatar equipment.
- `export.ts` serializes normalized CSV, standalone capsule HTML, and the portable LifeMap Passport entirely in the browser.

## State flow

```text
CSV / JSON / Daily Dock / manual / Passport / demo
        ↓
raw plain objects
        ↓
field mapping + normalization + validation
        ↓
ActivityRecord[] in React memory
        ↓
period filtering → deterministic analytics → world/character blueprints
        ↓
world / character / timeline / insights / comparison / data / export
```

Additional imports are merged into the active personal realm using a stable record fingerprint. The import preview reports new, duplicate, and rejected rows before commit. The last append or restore can be undone during the session.

Reset replaces the dataset state with `null` and discards import buffers. Refreshing the page also clears the session because personal records are never persisted automatically. A LifeMap Passport is the explicit, user-controlled way to continue on another device.

The production service worker caches only the public application shell and same-origin static assets. It never receives or stores personal records.

## Performance boundaries

- Analytics use linear passes and small `Map`/`Set` aggregations.
- Recalculation is memoized by dataset and selected period.
- The world renders only the six largest categories spatially.
- Stable all-time category slots keep the same district in the same place across monthly reconstructions.
- The data table renders at most 100 matching rows; exports retain all selected records.
- Input is capped at 10 MB.

The current design does not need a Web Worker for typical personal datasets. A Worker is the recommended next step if supported file sizes increase materially.
