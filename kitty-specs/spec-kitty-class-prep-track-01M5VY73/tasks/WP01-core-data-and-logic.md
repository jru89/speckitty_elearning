---

work_package_id: WP01

title: Core data & logic

dependencies: []

requirement_refs:

- C-007

- FR-002

- FR-003

- FR-004

- FR-005

- FR-006

- FR-015

- FR-020

- FR-021

- FR-023

- FR-024

- NFR-003

- NFR-004

- NFR-005

planning_base_branch: feat/spec-kitty-class-prep-track

merge_target_branch: feat/spec-kitty-class-prep-track

branch_strategy: Planning artifacts for this mission were generated on feat/spec-kitty-class-prep-track. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/spec-kitty-class-prep-track unless the human explicitly redirects the landing branch.

subtasks:

- T001

- T002

- T003

- T004

- T005

- T006

- T007

phase: Phase 1 - Foundation

history:

- at: '2026-10-26T11:38:51Z'

  actor: system

  action: Prompt generated via /spec-kitty.tasks

agent_profile: implementer-ivan

agent: claude

authoritative_surface: js/lib/

create_intent:

- tests/index.html

- tests/runner.js

- tests/store.test.js

- tests/tailor.test.js

- tests/summary.test.js

- js/data/tools.js

- js/data/intake.js

- js/lib/store.js

- js/lib/tailor.js

- js/lib/summary.js

execution_mode: code_change

model: ''

owned_files:

- js/lib/store.js

- js/lib/tailor.js

- js/lib/summary.js

- js/data/tools.js

- js/data/intake.js

- tests/index.html

- tests/runner.js

- tests/store.test.js

- tests/tailor.test.js

- tests/summary.test.js

role: implementer

tags: []

task_type: implement

tracker_refs: []
---



# Work Package Prompt: WP01 – Core data & logic



## ⚡ Do This First: Load Agent Profile



Use the `/ad-hoc-profile-load` skill to load the agent profile specified in the frontmatter, and behave according to its guidance before parsing the rest of this prompt.



- **Profile**: see `agent_profile` in the frontmatter | **Role**: `implementer` | **Agent/tool**: see `agent`



## ⚠️ IMPORTANT: Review Feedback



Check the `review_ref` field in the event log before starting. Address all feedback before your work is complete.



## Markdown Formatting



Wrap HTML/XML tags in backticks. Use language identifiers in code blocks.



---



## Objectives & Success Criteria



Build the pure, DOM-free foundation of the prep course. Every other WP imports from these files, so their exported names and shapes are the contract.



Done means:



- `tests/index.html`, served over HTTP, runs every `*.test.js` and shows **0 failures**.

- `store.js` satisfies [contracts/store-contract.md](../contracts/store-contract.md), including the foreign-key isolation test.

- `tailor.js` satisfies [contracts/tailoring-contract.md](../contracts/tailoring-contract.md) for all unit cases. The exhaustive coverage test belongs to WP08, because it needs the content.

- `tools.js` lists every supported tool, with a cost model and install URL checked against the official site, and `checkedOn` set to the date you checked.

- No DOM access in `js/lib/*` or `js/data/*` (they must load in the test page without a shell).



## Context & Constraints



- Read first: [spec.md](../spec.md), [plan.md](../plan.md) (Architecture, Isolation model), [data-model.md](../data-model.md), [research.md](../research.md) R0-02, R0-04 and R0-06, and all four files in [contracts/](../contracts/).

- Stack: vanilla ES2022 modules, no build and no dependencies (plan, Technical Context). Use relative import paths with the `.js` extension.

- The repo currently contains only Spec Kitty scaffolding. You are creating the first app files.

- Code style for the whole app, set here: two-space indent, double quotes, semicolons, and a short header comment per file saying what it owns and which contract it implements. Keep comments factual and few.



## Branch Strategy



- Planning base and final merge target: `feat/spec-kitty-class-prep-track`.

- Execution worktrees are allocated per computed lane from `lanes.json`. Implement with:



```bash

spec-kitty agent action implement WP01 --agent <name>

```



## Subtasks & Detailed Guidance



### Subtask T001 – Test runner page



**Purpose**: a zero-dependency way to run assertions in the browser, because the project has no Node toolchain (research R0-07).



**Steps**:

1. `tests/runner.js` exports:

   - `test(name, fn)`: registers a test (sync or async).

   - `assert(cond, message)`, `assertEqual(actual, expected, message)` (deep equality via `JSON.stringify` of both sides is enough here), and `assertThrows(fn, message)`.

   - `run()`: runs all tests and returns `{ passed, failed, results: [{ name, ok, error }] }`.

2. `tests/index.html`: a plain page that imports `runner.js`, then imports each test file (`./store.test.js`, `./tailor.test.js`, `./summary.test.js`, and `./coverage.test.js`). Import `coverage.test.js` dynamically inside `try/catch`, because WP08 creates it and its absence must not fail the page.

3. Render a summary line ("42 passed, 0 failed") with a green or red background, then one row per test showing the error message for failures. Set `document.title` to "PASS"/"FAIL" so a quick glance (or a screenshot) shows the result.

4. Keep it under ~60 lines of runner code. No styling beyond inline basics. This page is not part of the app UI and is never linked from it (plan, Routes).



**Validation**: a deliberately failing dummy test shows red. Remove it after checking.



### Subtask T002 – Tool list `js/data/tools.js`



**Purpose**: the single source of truth for supported AI coding tools (C-007, FR-014, FR-015). The intake options, setup blocks and summary all read from it.



**Steps**:

1. Export `checkedOn` (ISO date string) and `tools`: an array of entries shaped as in [data-model.md](../data-model.md#tool-entry-static): `{ id, name, cost, costNote, installUrl, commandStyle }`.

2. Include exactly these tools, with these ids:

   - `claude-code` (first, with `demo: true`)

   - then alphabetically: `antigravity`, `codex`, `copilot`, `cursor`, `gemini`, `kiro`, `letta`, `opencode`, `pi`, `qwen`, `vibe`, `windsurf`.

3. **Verify each entry on the tool's official site or docs today**:

   - `cost` is one of `free`, `free-tier`, `paid` or `api-key`. `costNote` is one short plain sentence, such as "Needs a paid Claude plan (Pro or Max) or an API key".

   - `installUrl` is the official install or getting-started page, never a blog or mirror.

   - `commandStyle` is how a Spec Kitty command looks in that tool: `/spec-kitty.specify` for slash-command tools, `$spec-kitty-specify` for skill-invocation tools like Codex. If unsure, check `spec-kitty init --help` and the Spec Kitty README, and use the slash form only where it's confirmed.

   - If a tool's facts can't be confirmed, keep the entry and set `costNote: "Check the tool's site for current pricing"`. Never guess a price.

4. Add a header comment: "Checked against official sites on <date>. Update: edit this file only; intake options and setup blocks read from it."

5. Also export a helper `toolById(id)` that returns the entry, or `undefined`.



**Files**: `js/data/tools.js` (new, ~90 lines)



**Validation**: 13 unique ids; every `installUrl` starts with `https://`; `checkedOn` matches today.



### Subtask T003 – Intake questions and answer enums `js/data/intake.js`



**Purpose**: define the five questions and the allowed values that the store validates, the tailoring tests enumerate, and the content `when` labels use.



**Steps**:

1. Export `ENUMS`:

   ```js

   export const ENUMS = {

     os: ["windows", "macos", "linux", "chromeos", "mobile"],

     chip: ["x64", "arm", "unsure"],

     device: ["personal", "work-can-install", "work-locked"],

     tool: [...tools.map(t => t.id), "other", "undecided"],

     experience: ["terminal-new", "codes-no-agents", "agents-daily"],

   };

   ```

   Import `tools` from `./tools.js`.

2. Export `QUESTIONS` in order `os, chip, device, tool, experience`. Each has `{ id, label, options: [{ value, label, hint? }], askIf? }`:

   - os labels: "Windows", "macOS", "Linux", "ChromeOS (Chromebook)", "Tablet or phone".

   - chip: `askIf: (a) => ["windows","macos","linux"].includes(a.os)`. Labels: "Intel or AMD", "ARM (including Apple Silicon M1–M4)", "Not sure". Add a per-OS "How do I check?" hint, exported as `CHIP_HINTS = { windows: "Settings → System → About → System type", macos: "Apple menu → About This Mac: 'Chip: Apple M…' means ARM", linux: "Run uname -m: aarch64 means ARM, x86_64 means Intel/AMD" }`.

   - device: "My own laptop or desktop", "A work laptop, and I can install software", "A work laptop, and I can't install software (or I'm not sure)".

   - tool: options built from `tools` (label = name, hint = costNote), then "Other tool" (`other`) and "Help me choose" (`undecided`).

   - experience: "I'm new to the terminal", "I write code but haven't used AI agents", "I use AI coding agents (almost) daily".

3. Export `normalizeAnswers(raw)`: returns a complete answers object if every field is valid. When the chip question is not asked, it forces `chip: "unsure"`. Otherwise it returns `null`. The store uses this for validation (data-model, Validation).

4. Export `ANSWER_LABELS`, a short-label map used by the summary, e.g. `{ os: { macos: "macOS" }, chip: { arm: "ARM" }, device: { personal: "personal", "work-can-install": "work laptop", "work-locked": "locked work laptop" }, experience: { "terminal-new": "new to the terminal", "codes-no-agents": "codes, new to agents", "agents-daily": "uses AI daily" } }`. For macOS + `arm`, the summary prints "Apple Silicon" (see T006).



**Files**: `js/data/intake.js` (new, ~110 lines)



**Validation**: `normalizeAnswers` returns `null` for a missing field, an unknown value or `null` input. It returns `chip: "unsure"` for `os: "chromeos"`, even if the input says `arm`.



### Subtask T004 – Storage owner `js/lib/store.js`



**Purpose**: the only code that touches `localStorage` (store contract; NFR-003, NFR-004, NFR-005; FR-023, FR-024).



**Steps**:

1. Implement `createStore(storage)` exactly per [contracts/store-contract.md](../contracts/store-contract.md). Key constant: `const KEY = "skcp:v1";`. Export `KEY` for tests.

2. In-memory record, lazily loaded. `getAnswers()` returns `normalizeAnswers(record.answers)`.

3. Writes are synchronous: no debounce. This is small data, and a "Start fresh" right after a change must not race a pending write. Wrap `setItem` in `try/catch`; on failure set the persistent flag to false and keep the change in memory.

4. When the default store is created, check whether storage is usable by writing and removing a probe **under the app's own key prefix**, `skcp:probe`. Never probe with a generic key.

5. `setModuleStatus` enforces forward-only order: `not_started < in_progress < done`.

6. `startFresh()` calls `storage.removeItem(KEY)` only, resets memory, then notifies subscribers.

7. Export a default instance:

   ```js

   export const store = createStore(safeLocalStorage());

   ```

   `safeLocalStorage()` returns `window.localStorage` inside `try`, or a no-op object that throws on use (accessing `localStorage` itself can throw in some privacy modes).

8. **Never** call `clear()`, `key(i)` or read `length` on storage.



**Files**: `js/lib/store.js` (new, ~140 lines)



### Subtask T005 – Tailoring rules `js/lib/tailor.js`



**Purpose**: decide what each attendee sees (FR-004, FR-006, FR-021; tailoring contract).



**Steps**:

1. Implement `appliesTo`, `visibleBlocks`, `earlyStop` and `suggestedNext` exactly per [contracts/tailoring-contract.md](../contracts/tailoring-contract.md). Note the special cases: `chip: "unsure"`; `answers === null`; an unknown dimension returns `false`; and the `earlyStop` rules for `suggestedNext`.

2. `suggestedNext(answers, progress)` uses the module order `["words", "spec-driven", "setup", "ready"]`, with `terminal` used only for `terminal-new`. Hard-code the order as an exported constant `MAIN_ORDER`. Don't import the module registry: this file must stay pure.

3. Export `KNOWN_DIMENSIONS = ["os", "chip", "device", "tool", "experience"]` for the coverage test.



**Files**: `js/lib/tailor.js` (new, ~80 lines)



### Subtask T006 – Setup summary `js/lib/summary.js`



**Purpose**: the one-line text attendees can copy to the trainer (FR-020; data-model, Setup summary).



**Steps**:

1. Export `buildSummary(answers, progress, visibleChecklistIds)`. `visibleChecklistIds` is the list of ready-check item ids visible for these answers; the caller computes it with `tailor.visibleBlocks`, keeping this function pure.

2. Parts, joined with `" · "`:

   - OS label, then the chip label (omitted when `unsure`; "Apple Silicon" for macOS + `arm`)

   - device label

   - tool name from `toolById` (or "Other tool", or "no tool chosen yet")

   - experience label

   - status: "all checks passed" when every visible id is checked, else "N of M checks done"

3. Return `null` if `answers` is `null`.

4. No free text, names or ids beyond these labels. Never include dates.



**Files**: `js/lib/summary.js` (new, ~50 lines)



### Subtask T007 – Unit tests



**Purpose**: prove the contracts before any UI exists.



**Steps**:

1. `tests/store.test.js`: the four tests listed in the store contract. Build the fake storage as a `Map`-backed object with `getItem`/`setItem`/`removeItem`. Pre-seed it with foreign keys `ccol:progress:v1`, `ccol:profile` and `rijbewijs:progress`. After every API call, assert those keys are byte-identical and that the set of keys is exactly the foreign keys plus (optionally) `skcp:v1`.

2. `tests/tailor.test.js`: unit cases for every bullet in the tailoring contract. Include a table-driven test for `appliesTo` with at least 12 rows, covering `chip: "unsure"`, `answers === null`, multi-dimension blocks, and an unknown dimension.

3. `tests/summary.test.js`:

   - macOS/arm → "Apple Silicon"

   - Windows/arm → "ARM"

   - ChromeOS → no chip part

   - `undecided` → "no tool chosen yet"

   - partial checks → "2 of 5 checks done"

   - the exact example line from the spec, User Story 4



**Validation**: open `tests/index.html` through a local server (`python -m http.server 8533` from the repo root, then `http://localhost:8533/tests/`). It shows 0 failures.



## Definition of Done



- All seven subtasks complete, and the test page shows 0 failures (attach a screenshot or paste the summary line in the activity log).

- `tools.js` `checkedOn` is today, and every tool fact was checked on its official site.

- `git grep -n "localStorage" js/` shows matches only in `js/lib/store.js`.

- No file in `js/lib` or `js/data` references `document` or `window` (except the guarded `localStorage` access in `store.js`).



## Risks & Edge Cases



- **Tool facts drift** (R-01): you verify them now; the README (WP09) tells the trainer how to re-check.

- **Accessing `window.localStorage` throws** in some Safari privacy modes: handled by `safeLocalStorage()`.

- **Enums are a contract**: WP05-WP08 write `when` labels against them. Don't rename values after merge without updating every content file.



## Review Guidance



- Run the test page yourself. Read `store.js` for any storage call other than `getItem`/`setItem`/`removeItem` on `skcp:` keys.

- Spot-check three `tools.js` entries against the official sites.

- Check `appliesTo` against the contract's wording, especially the unknown-dimension and `null`-answers cases.



## Activity Log



- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
- 2026-10-26T12:06:14Z – claude – shell_pid=12804 – Verification (commit 3ae62ba): http://localhost:8533/tests/ via python -m http.server 8533 in the built-in browser -> '26 passed, 0 failed', title PASS, green (dummy failing test first showed red '26 passed, 1 failed', then removed). Same 26/0 under Node 22. git grep localStorage js/ -> only js/lib/store.js; no document/window in js/lib or js/data except the guarded window.localStorage in store.js. tools.js checkedOn 2026-10-26, verified on official sites: Claude Code (code.claude.com/docs/en/setup: Pro/Max/Team/Enterprise/Console, free plan excluded) paid; Codex (learn.chatgpt.com/docs/pricing via developers.openai.com: all ChatGPT plans incl. Free, or API key) free-tier; Copilot (github.com/features/copilot/plans: Free plan) free-tier; Cursor (cursor.com/pricing: Free plan) free-tier; Gemini CLI (geminicli.com quota-and-pricing + developers.googleblog.com transition post: free/Pro/Ultra moved to Antigravity CLI 2026-06-18, paid API keys and Code Assist Std/Ent remain) api-key; Antigravity (antigravity.google/pricing: $0 for individuals) free-tier; Kiro (kiro.dev/pricing: Free 50 credits) free-tier; Letta (docs.letta.com/pricing: Free plan, BYOK) free-tier; OpenCode (opencode.ai/docs, /docs/zen: open source, limited-time free models) free; Pi (pi.dev: MIT, API keys or OAuth) api-key; Qwen Code (qwen-code-docs auth page: free tier discontinued 2026-04-15) api-key; Mistral Vibe (docs.mistral.ai/mistral-vibe: works in Free mode) free-tier; Windsurf (windsurf.com/pricing redirects to devin.ai/pricing, now Devin Desktop: Free plan) free-tier. commandStyle from Spec Kitty docs/api/supported-agents.md (codex $spec-kitty-specify; pi /skill:spec-kitty-specify; vibe/letta/antigravity /spec-kitty-specify; rest /spec-kitty.specify).
- 2026-10-26T12:07:21Z – claude – shell_pid=12804 – Implementation committed (3ae62ba), subtasks done. move-task to for_review blocked by the lane kitty-specs guard: acceptance-matrix.json, status.events.jsonl, status.json and tasks/WP01-core-data-and-logic.md differ from feat/spec-kitty-class-prep-track on the lane branch; they come from the scaffold/start/auto-rebase commits (f7cd5f1, 22809a7, 8b9dce0), not from WP01 work. Left for the orchestrator to clean (tool suggests git restore --source feat/spec-kitty-class-prep-track -- kitty-specs/ on the lane).
