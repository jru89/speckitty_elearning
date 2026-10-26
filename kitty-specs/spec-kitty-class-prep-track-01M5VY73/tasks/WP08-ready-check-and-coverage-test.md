---
work_package_id: WP08
title: Ready check & coverage test
dependencies:
- WP05
- WP06
- WP07
requirement_refs:
- FR-006
- FR-019
- FR-020
- NFR-006
planning_base_branch: feat/spec-kitty-class-prep-track
merge_target_branch: feat/spec-kitty-class-prep-track
branch_strategy: Planning artifacts for this mission were generated on feat/spec-kitty-class-prep-track. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/spec-kitty-class-prep-track unless the human explicitly redirects the landing branch.
subtasks:
- T035
- T036
- T037
phase: Phase 4 - Integration
history:
- at: '2026-10-26T11:38:51Z'
  actor: system
  action: Prompt generated via /spec-kitty.tasks
agent_profile: implementer-ivan
agent: claude
authoritative_surface: tests/coverage.test.js
create_intent:
- js/data/modules/ready.js
- tests/coverage.test.js
execution_mode: code_change
model: ''
owned_files:
- js/data/modules/ready.js
- tests/coverage.test.js
role: implementer
tags: []
task_type: implement
tracker_refs: []
---

# Work Package Prompt: WP08 – Ready check & coverage test

## ⚡ Do This First: Load Agent Profile

Use the `/ad-hoc-profile-load` skill to load the agent profile specified in the frontmatter, and behave according to its guidance before parsing the rest of this prompt.

- **Profile**: see `agent_profile` in the frontmatter | **Role**: `implementer` | **Agent/tool**: see `agent`

## ⚠️ IMPORTANT: Review Feedback

Check the `review_ref` field in the event log before starting. Address all feedback before your work is complete.

## Markdown Formatting

Wrap HTML/XML tags in backticks. Use language identifiers in code blocks.

---

## Objectives & Success Criteria

Write the final module (the ready check, FR-019, with the setup summary, FR-020) and the exhaustive coverage test that proves no attendee hits a dead end (NFR-006, SC-003, tailoring contract rules 1-5). Then fix whatever content gaps the test finds.

Done means:

- `js/data/modules/ready.js` default-exports the ready module with a `checklist` exercise (`summary: true`), whose items are tailored so each visible item can be completed (rule 5).
- `tests/coverage.test.js` runs every intake combination through rules 1-5 and every module through the known-dimensions rule. `tests/index.html` reports **0 failures**.
- Every gap found is fixed in the owning content file, with a one-line rationale per out-of-map edit in the activity log.

## Context & Constraints

- Read first: [contracts/tailoring-contract.md](../contracts/tailoring-contract.md) (the coverage rules are the spec for this WP); [contracts/exercise-engine-contract.md](../contracts/exercise-engine-contract.md) (checklist); [data-model.md](../data-model.md) (enums, Setup summary); spec User Story 4.
- Imports for the test: `ENUMS` and `QUESTIONS` (WP01), `visibleBlocks`, `earlyStop` and `KNOWN_DIMENSIONS` (WP01), `MODULES` and `loadModule` (WP03), and the runner (WP01).
- The test page already dynamically imports `./coverage.test.js` (WP01 T001). You just create the file.

## Branch Strategy

- Planning base and final merge target: `feat/spec-kitty-class-prep-track`.
- Execution worktrees are allocated per computed lane from `lanes.json`. Implement with:

```bash
spec-kitty agent action implement WP08 --agent <name>
```

## Subtasks & Detailed Guidance

### Subtask T035 – Ready module `js/data/modules/ready.js`

Module: `{ id: "ready", title: "Ready check", summary: "Tick off your setup, then send your trainer a one-line summary if you like.", minutes: 3, optional: false, blocks, exercise }`.

Blocks: one short intro, "Go through this list on the laptop you'll bring. If something doesn't work, the setup module has the fix, or tell your trainer before the session."

Exercise: `{ id: "ready-check", type: "checklist", config: { summary: true, items } }`, with items:

| id | label | when |
|----|-------|------|
| `git-version` | "`git --version` prints a version" | desktop OSes (`windows, macos, linux, chromeos`) and device not `work-locked` |
| `git-identity` | "I set my Git name and email" | same as above |
| `python-version` | "Python reports 3.11 or higher (`py --version` on Windows, `python3 --version` elsewhere)" | same |
| `tool-picked` | "I picked an AI coding tool" | `tool: ["undecided"]` |
| `tool-login` | "My AI coding tool is installed and I logged in once" | every tool except `undecided`; desktop OSes; not `work-locked` |
| `agent-check` | "The agent listed my test folder and created hello.txt" | same as `tool-login` |
| `told-trainer` | "I told my trainer I can't install on this device" | `os: ["mobile"]`, **or** `device: ["work-locked"]`. This needs two items, `told-trainer-mobile` and `told-trainer-locked`, because `when` dimensions AND together. |
| `laptop` | "Laptop and charger packed" | no `when` |

Make sure every combination has at least one visible item, and that `undecided` never sees `tool-login` or `agent-check` (rule 5). For `work-locked`, the visible items are `told-trainer-locked`, `laptop` and, when undecided, `tool-picked`.

### Subtask T036 – Exhaustive coverage test `tests/coverage.test.js`

**Steps**:
1. Generate all combinations:
   - `os` from `ENUMS.os`
   - `chip` from `ENUMS.chip` if the chip question's `askIf` applies to that OS, else `["unsure"]`
   - `device`, `tool` and `experience` from their enums
   That's roughly 5 OS × up to 3 chips × 3 × 15 × 3, around 1,800 combinations. It runs in milliseconds.
2. Load all modules once with `loadModule` for each `MODULES` id. Fail clearly if any is `null`.
3. For each combination, assert:
   - **Rule 1 (no dead ends)**: `earlyStop(a) !== null`, or the setup blocks include topics `git`, `python`, `tool` and `agent-check`.
   - **Rule 2 (one OS)**: every visible setup or terminal block with `when.os` includes `a.os`.
   - **Rule 3 (one tool)**: every visible block with `when.tool` includes `a.tool`, and the `tool` topic count is ≥ 1 when not early-stopped.
   - **Rule 5 (completable ready check)**: the visible ready items are non-empty. `undecided` sees neither `tool-login` nor `agent-check`. Early-stop combinations don't see `git-version`.
   - **Git/Python completeness** (R-03, stronger than rule 1): when not early-stopped, git topics ≥ 3 and python topics ≥ 2.
4. **Rule 4 (known dimensions)**: for every block and checklist item in every module, every `when` key is in `KNOWN_DIMENSIONS` and every value is in `ENUMS[key]`.
5. **Don't create one test per combination**: aggregate the failures and report the first 20 with their combination, e.g. `"linux/x64/personal/kiro/agents-daily: no python block"`. That gives the page one readable row per rule.

### Subtask T037 – Fix content gaps

1. Run the test page. For each failure, fix the owning content file:
   - Git/Python blocks → `js/data/setup/platform-blocks.js`
   - tool/support blocks → `js/data/setup/*-blocks.js`
   - vocabulary → `js/data/modules/words.js`, `spec-driven.js`
2. These are out-of-map edits for this WP. Keep each one minimal, and log a one-line rationale per file (e.g. "platform-blocks.js: Python verify block missing for chromeos (rule 1)").
3. Re-run until 0 failures. Screenshot the test page for the activity log.
4. Also open `#/m/ready` in the preview with two different intakes and check the visible items and summary line make sense.

## Definition of Done

- `tests/index.html` shows 0 failures, including all coverage rules. Screenshot in the activity log.
- The ready module renders correctly for a normal desktop attendee, an `undecided` attendee and a `work-locked` attendee (manual check, three screenshots).
- All out-of-map edits are logged with a rationale.

## Risks & Edge Cases

- If the test reveals a design problem rather than a content gap (e.g. a rule that can't be satisfied), stop and raise it in the activity log for review. Don't weaken the test.
- `when` dimensions AND together, so an OR across dimensions needs separate items or blocks (see `told-trainer`).

## Review Guidance

- Read the coverage test against the contract rule by rule.
- Temporarily remove one Python block locally and confirm the test catches it. Note in the review that you did this and reverted it.

## Activity Log

- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
