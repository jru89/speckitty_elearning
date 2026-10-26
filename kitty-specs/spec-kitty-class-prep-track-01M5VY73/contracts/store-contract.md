# Contract: `js/lib/store.js`

The only module that touches browser storage. Every view and exercise reads and writes per-attendee state through these functions.

## Storage footprint

- Exactly one key: `skcp:v1`. Any other key on the origin belongs to some other app and must never be read, written, enumerated or removed.
- Never call `localStorage.clear()`.
- Value: the JSON record in [data-model.md](../data-model.md#stored-record-the-only-thing-persisted).

## API

| Function | Behaviour |
|----------|-----------|
| `createStore(storage = window.localStorage)` | Returns a store bound to `storage`. Tests inject a fake object with `getItem`/`setItem`/`removeItem`. The app uses one default instance exported as `store`. |
| `getAnswers()` | The validated answers object, or `null` if the intake is not completed or the stored answers are invalid. Never throws. |
| `setAnswers(answers)` | Validates, then saves immediately. Throws `TypeError` on invalid input (programmer error, not attendee error). |
| `getProgress()` | The progress object (never `null`; a fresh default when missing or corrupt). Never throws. |
| `setModuleStatus(id, status)` | Forward-only per data-model transitions; a backwards move is ignored. |
| `setExerciseState(id, partial)` | Merges `partial` into `exercises[id]`. |
| `setChecklistItem(id, checked)` | Sets one ready-check item. |
| `startFresh()` | Removes `skcp:v1` only, and resets the in-memory record. |
| `isPersistent()` | `false` when storage is unavailable or a write failed; the app then runs from memory and the shell shows a one-line notice. |
| `subscribe(fn)` | Called after every change; returns an unsubscribe function. |

## Failure behaviour

- Read failure, parse failure or a wrong `schemaVersion` → fresh default record. The broken value is left untouched until the next successful write replaces it.
- Write failure (quota, privacy mode) → keep the change in memory and set `isPersistent()` to `false`. Never throw to callers.

## Tests (`tests/store.test.js`)

1. Round-trip of answers and progress through a fake storage.
2. A fake storage pre-seeded with foreign keys (`ccol:progress:v1`, `ccol:profile`, a rijbewijs key): after every API call, including `startFresh()`, the foreign keys are byte-identical and no other keys were added.
3. A throwing fake storage: every call succeeds from memory and `isPersistent()` is `false`.
4. Corrupt JSON and an unknown answer value → `getAnswers()` returns `null`.
