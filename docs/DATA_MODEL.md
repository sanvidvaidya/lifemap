# Data model

## Canonical activity record

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string | yes | Local record identity |
| `date` | `YYYY-MM-DD` | yes | Activity date |
| `activity` | string | yes | User-provided activity label |
| `category` | string | yes | User-defined top-level category |
| `startTime` | `HH:MM` | no | Local start time |
| `endTime` | `HH:MM` | no | Local end time |
| `subcategory` | string | no | User-defined subdivision |
| `duration` | number | normalized | Minutes, 0–1,440 |
| `energy` | number | no | Optional observed value, 1–5 |
| `mood` | number | no | Optional observed value, 1–5 |
| `planned` | boolean | no | Whether the record was planned |
| `completed` | boolean | no | Whether the plan was completed |
| `location` | string | no | Plain-text location label |
| `notes` | string | no | Plain text, capped at 5,000 characters |

## Import aliases

The mapper recognizes common case-insensitive aliases. Examples include `day`/`timestamp` for date, `task`/`event`/`description` for activity, `type`/`group` for category, `minutes`/`duration_minutes` for duration, and snake/camel variants for start and end time.

Detected mappings are always shown. Date, activity, and category must be explicitly mapped before normalization.

## Normalization rules

- ISO dates are validated exactly; other browser-parseable date strings are converted to ISO.
- Twelve- or twenty-four-hour times normalize to `HH:MM`.
- Duration accepts numbers, `HH:MM`, and text such as `1h 30m`.
- When duration is absent, valid start and end times derive it. Overnight intervals can cross midnight.
- Negative, non-finite, or over-24-hour durations are rejected.
- Energy and mood outside 1–5 are omitted with a warning.
- Common boolean words (`yes`, `no`, `true`, `false`, `done`, and similar) normalize safely.
- Duplicate identity is date + start + activity + category + duration; later duplicates are skipped with a warning.
- Null bytes and unsafe control characters are removed. Length limits apply before rendering.

Invalid rows do not crash or poison valid records. The result contains accepted records and human-readable row issues.

## Portable Passport

The `.lifemap` Passport is a versioned JSON document containing canonical activity records, session mapping recipes, and non-sensitive presentation preferences. It is never uploaded. Restore treats every value as untrusted input and normalizes the records again before replacing the active in-memory realm.

Incremental imports use a stable fingerprint of date, start time, normalized activity, normalized category, and duration. Existing fingerprints are skipped so repeated exports can be appended safely.

