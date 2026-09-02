# Privacy and security

## Local-first guarantee

LifeMap has no backend endpoint for personal data. The shipped application contains no account code, analytics SDK, telemetry, advertisement tracker, AI client, cloud-storage client, or runtime API key.

Selected files are read with the browser `File` API. Records, mappings, analytics, undo history, and character preferences live in React memory. LifeMap does not write personal information to cookies, `localStorage`, IndexedDB, Cache Storage, or a service worker.

Exports use local `Blob` objects. The optional LifeMap Passport is a versioned JSON backup downloaded only when the user requests it. The service worker caches the public application shell for repeat and offline launches, but no personal record is placed in that cache.

## Untrusted input controls

- CSV, JSON, and Passport files are capped at 10 MB.
- JSON must be an array of plain objects or an object with an `activities` array.
- CSV is parsed as data; files are never executed.
- Imported strings have control characters removed and length limits applied.
- React renders values as escaped text.
- `dangerouslySetInnerHTML` is not used for imported data.
- Capsule HTML passes every imported value through explicit HTML escaping.
- CSV exports quote values and double embedded quotes.
- Invalid dates, times, durations, scores, and types become issues instead of executable state.
- Passport records are passed back through the canonical normalization and validation pipeline before restoration.
- A restore requires confirmation and can be undone immediately during the same session.

## Reset and persistence

Reset discards the current in-memory dataset after confirmation. A reload has the same effect. Because the browser may retain a downloaded export or Passport at the user's request, LifeMap cannot delete files the user deliberately downloaded.

## Dependency and secret posture

The lockfile pins dependencies. CI installs with `--frozen-lockfile`. Repository audits should search for credentials, personal datasets, build output, caches, and dependency directories before release.

