# Tasks: Spec Kitty Class Prep Track

**Input**: [plan.md](plan.md), [spec.md](spec.md), [data-model.md](data-model.md), [contracts/](contracts/), [research.md](research.md), [quickstart.md](quickstart.md)
**Prerequisites**: plan.md complete (Implementation Concern Map IC-01..IC-07, Plan Review fixes applied)

There are 41 subtasks (T001-T041) in 9 work packages. Execution shape:

```
WP01 core data & logic
 ├── WP02 app shell & visual system
 │    ├── WP03 welcome, intake & overview
 │    └── WP04 module view & exercises  (also needs WP03's module registry)
 ├── WP05 vocabulary modules           ─┐
 ├── WP06 tool & support setup blocks  ─┤ content, parallel with WP02-WP04
 │    └── WP07 platform setup & primer ─┤
 └──────────────────────────────────── WP08 ready check & coverage test (needs WP05-WP07)
                                        WP09 offline, deploy & end-to-end (needs everything)
```

Content WPs (WP05, WP06, WP07) are plain data files and can run in parallel with the UI WPs (WP02-WP04) once WP01 has fixed the answer enums and the tool list.

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|----|----------|
| T001 | Test runner page (`tests/index.html`, `tests/runner.js`) | WP01 | [P] |
| T002 | Tool list `js/data/tools.js`, verified against official sites | WP01 | [P] |
| T003 | Intake questions and answer enums `js/data/intake.js` | WP01 | |
| T004 | Storage owner `js/lib/store.js` | WP01 | |
| T005 | Tailoring rules `js/lib/tailor.js` | WP01 | |
| T006 | Setup summary `js/lib/summary.js` | WP01 | |
| T007 | Unit tests for store, tailor, summary | WP01 | |
| T008 | `index.html`, minimal `manifest.json`, `.claude/launch.json` | WP02 | [P] |
| T009 | Design tokens, typography, layout in `css/style.css` | WP02 | [P] |
| T010 | Component styles (blocks, code, choices, buttons, progress, banners) | WP02 | |
| T011 | Router, route guard, header menu, notices in `js/app.js` | WP02 | |
| T012 | Clipboard helper and code-block copy enhancer | WP02 | [P] |
| T013 | Welcome content `js/data/welcome.js` | WP03 | [P] |
| T014 | Welcome view | WP03 | |
| T015 | Intake view | WP03 | |
| T016 | Module registry `js/data/modules/index.js` | WP03 | [P] |
| T017 | Course overview view | WP03 | |
| T018 | Module view (tailored blocks, status, pager, exercise mount) | WP04 | |
| T019 | Match exercise engine | WP04 | [P] |
| T020 | Judge exercise engine | WP04 | [P] |
| T021 | Checklist exercise engine with setup summary | WP04 | [P] |
| T022 | Module 1 content `words.js` | WP05 | [P] |
| T023 | Module 1 match exercise config | WP05 | |
| T024 | Module 2 content `spec-driven.js` | WP05 | [P] |
| T025 | Module 2 judge exercise config | WP05 | |
| T026 | Tool-neutrality and terminology review of WP05 content | WP05 | |
| T027 | Per-tool setup blocks, "help me choose" and "other" | WP06 | |
| T028 | Agent-check blocks | WP06 | [P] |
| T029 | Work-device guidance blocks | WP06 | [P] |
| T030 | Optional pipx/uv head-start blocks per OS | WP06 | [P] |
| T031 | Git install, identity and verify blocks per OS/chip | WP07 | [P] |
| T032 | Python 3.11+ install and verify blocks per OS/chip, with traps | WP07 | [P] |
| T033 | Setup module composer `js/data/modules/setup.js` | WP07 | |
| T034 | Optional terminal primer `js/data/modules/terminal.js` | WP07 | [P] |
| T035 | Ready-check module `js/data/modules/ready.js` | WP08 | |
| T036 | Exhaustive coverage test `tests/coverage.test.js` | WP08 | |
| T037 | Fix content gaps the coverage test finds | WP08 | |
| T038 | Service worker with `skcp-` caches | WP09 | |
| T039 | Icons and complete manifest | WP09 | [P] |
| T040 | README: run, deploy, update tools, fill session details | WP09 | [P] |
| T041 | Full quickstart pass and fixes | WP09 | |

## Work Packages

### WP01 — Core data & logic

- **Summary**: the pure, DOM-free foundation everything else builds on: the verified tool list, the intake questions and answer enums, the storage owner, the tailoring rules and the summary builder, plus the in-browser test runner and unit tests.
- **Priority**: P1 (foundation; blocks all other WPs)
- **Independent test**: `tests/index.html` served locally reports 0 failures for store, tailor and summary unit tests, including the foreign-key isolation test.
- **Estimated size**: 7 subtasks, ~480 lines
- **Dependencies**: none
- **Subtasks**:

T001 Test runner page (WP01)
T002 Tool list js/data/tools.js, verified against official sites (WP01)
T003 Intake questions and answer enums js/data/intake.js (WP01)
T004 Storage owner js/lib/store.js (WP01)
T005 Tailoring rules js/lib/tailor.js (WP01)
T006 Setup summary js/lib/summary.js (WP01)
T007 Unit tests for store, tailor, summary (WP01)

- **Parallel opportunities**: T001 and T002 are independent. T004-T006 each depend only on T003.
- **Risks**: tool cost models change often (research R0-04). Store must never touch foreign keys (store contract).
- **Prompt file**: [tasks/WP01-core-data-and-logic.md](tasks/WP01-core-data-and-logic.md)

### WP02 — App shell & visual system

- **Summary**: the page frame: HTML entry, the design system (tokens for light and dark, type, layout) and component styles, the hash router with route guard and header menu ("Change my answers", "Start fresh"), and copy buttons on code blocks.
- **Priority**: P1
- **Independent test**: served locally, the shell loads with no console errors. Unknown routes fall back to `#/`. With no answers stored, `#/m/setup` redirects to `#/intake`. The page has no horizontal scroll at 360 px.
- **Estimated size**: 5 subtasks, ~380 lines
- **Dependencies**: WP01
- **Subtasks**:

T008 index.html, minimal manifest.json, .claude/launch.json (WP02)
T009 Design tokens, typography, layout in css/style.css (WP02)
T010 Component styles (WP02)
T011 Router, route guard, header menu, notices in js/app.js (WP02)
T012 Clipboard helper and code-block copy enhancer (WP02)

- **Parallel opportunities**: T008, T009 and T012 are independent.
- **Risks**: the design must feel deliberate but light. Views are lazy-loaded, so missing views must degrade gracefully.
- **Prompt file**: [tasks/WP02-app-shell-and-visual-system.md](tasks/WP02-app-shell-and-visual-system.md)

### WP03 — Welcome, intake & overview

- **Summary**: the attendee's first three screens: the welcome (what Spec Kitty is, agenda, what to bring, session details), the five-question intake with chip hints and pre-fill, and the course overview with progress, suggested next step and the early-stop banner. Also the lazy module registry.
- **Priority**: P1
- **Independent test**: from a fresh browser, welcome → Start → intake → overview works. The chip question appears for Windows and not for ChromeOS. "Tablet or phone" shows the trainer-contact banner. Changing answers updates the overview without a reload.
- **Estimated size**: 5 subtasks, ~420 lines
- **Dependencies**: WP01, WP02
- **Subtasks**:

T013 Welcome content js/data/welcome.js (WP03)
T014 Welcome view (WP03)
T015 Intake view (WP03)
T016 Module registry js/data/modules/index.js (WP03)
T017 Course overview view (WP03)

- **Parallel opportunities**: T013 and T016 are independent of the views.
- **Risks**: NFR-002 (under 2 minutes) means one compact page, not five screens. The registry must tolerate module files that don't exist yet.
- **Prompt file**: [tasks/WP03-welcome-intake-overview.md](tasks/WP03-welcome-intake-overview.md)

### WP04 — Module view & exercises

- **Summary**: the generic module page (tailored blocks, chip labels for "not sure", the "how commands look in your tool" block, status transitions, prev/next) and the three exercise engines: match, judge and checklist. The checklist renders the "Copy my setup summary" action.
- **Priority**: P1
- **Independent test**: with a stub module (the implementer's local scratch data, not committed), each engine renders, persists, completes and survives a reload. The summary copies, or falls back to selected text.
- **Estimated size**: 4 subtasks, ~420 lines
- **Dependencies**: WP01, WP02, WP03
- **Subtasks**:

T018 Module view (WP04)
T019 Match exercise engine (WP04)
T020 Judge exercise engine (WP04)
T021 Checklist exercise engine with setup summary (WP04)

- **Parallel opportunities**: the three engines are independent once T018's mount contract is fixed (it already is, in contracts/exercise-engine-contract.md).
- **Risks**: keyboard-only operation and 360 px width for the match engine (no drag-and-drop-only interaction).
- **Prompt file**: [tasks/WP04-module-view-and-exercises.md](tasks/WP04-module-view-and-exercises.md)

### WP05 — Vocabulary modules

- **Summary**: content for Module 1 (Words you'll hear) and Module 2 (Vibe coding vs spec-driven), with the match and judge exercise configs. Tool-neutral, light, accurate to Spec Kitty's own terms.
- **Priority**: P2
- **Independent test**: both files load, and every FR-008 term appears with a definition and a match pair. Module 2 lists the seven steps with outputs, and no block has a `tool` condition except the one allowed command-style block.
- **Estimated size**: 5 subtasks, ~380 lines
- **Dependencies**: WP01
- **Subtasks**:

T022 Module 1 content words.js (WP05)
T023 Module 1 match exercise config (WP05)
T024 Module 2 content spec-driven.js (WP05)
T025 Module 2 judge exercise config (WP05)
T026 Tool-neutrality and terminology review (WP05)

- **Parallel opportunities**: Module 1 (T022, T023) and Module 2 (T024, T025) are independent.
- **Risks**: C-005 (Bright Factory gets one line only); NFR-001 (reading time).
- **Prompt file**: [tasks/WP05-vocabulary-modules.md](tasks/WP05-vocabulary-modules.md)

### WP06 — Tool & support setup blocks

- **Summary**: the tool-specific part of setup (one block per supported tool linking to official docs, plus the "help me choose" chooser and the "other" block) and the support blocks: generic agent check, work-device guidance, and the optional pipx/uv head start.
- **Priority**: P1
- **Independent test**: for each tool id there is exactly one `topic: "tool"` block. `undecided` and `other` each have one. Every install link points to the tool's official domain.
- **Estimated size**: 4 subtasks, ~360 lines
- **Dependencies**: WP01
- **Subtasks**:

T027 Per-tool setup blocks, "help me choose" and "other" (WP06)
T028 Agent-check blocks (WP06)
T029 Work-device guidance blocks (WP06)
T030 Optional pipx/uv head-start blocks per OS (WP06)

- **Parallel opportunities**: T028-T030 are independent of T027.
- **Risks**: C-006 (link, don't copy). The chooser must be able to update the answer, which needs a hook from WP04 (see prompt).
- **Prompt file**: [tasks/WP06-tool-and-support-setup-blocks.md](tasks/WP06-tool-and-support-setup-blocks.md)

### WP07 — Platform setup & terminal primer

- **Summary**: Git and Python install, identity and verify blocks for every OS and chip combination, the composer that assembles the setup module, and the optional "Terminal in 5 minutes" primer per OS.
- **Priority**: P1
- **Independent test**: for every OS (excluding `mobile`) and every chip value, Git and Python blocks with a verify step are visible. ChromeOS starts with "turn on Linux".
- **Estimated size**: 4 subtasks, ~460 lines
- **Dependencies**: WP01, WP06
- **Subtasks**:

T031 Git install, identity and verify blocks per OS/chip (WP07)
T032 Python 3.11+ install and verify blocks per OS/chip, with traps (WP07)
T033 Setup module composer js/data/modules/setup.js (WP07)
T034 Optional terminal primer js/data/modules/terminal.js (WP07)

- **Parallel opportunities**: T031, T032 and T034 are independent. T033 needs T031, T032 and WP06's files.
- **Risks**: R-03 (wrong steps for a combination). Windows Store alias trap; old Linux Pythons.
- **Prompt file**: [tasks/WP07-platform-setup-and-terminal-primer.md](tasks/WP07-platform-setup-and-terminal-primer.md)

### WP08 — Ready check & coverage test

- **Summary**: the ready-check module (tailored checklist items, summary enabled) and the exhaustive coverage test over every intake combination (tailoring contract rules 1-5). Then fixing whatever content gaps it finds.
- **Priority**: P1
- **Independent test**: `tests/index.html` reports 0 failures, including `coverage.test.js` over all combinations.
- **Estimated size**: 3 subtasks, ~300 lines
- **Dependencies**: WP05, WP06, WP07
- **Subtasks**:

T035 Ready-check module js/data/modules/ready.js (WP08)
T036 Exhaustive coverage test tests/coverage.test.js (WP08)
T037 Fix content gaps the coverage test finds (WP08)

- **Parallel opportunities**: none (sequential by nature).
- **Risks**: T037 may need small out-of-map edits in WP05-WP07 files. Each needs a one-line rationale in the activity log.
- **Prompt file**: [tasks/WP08-ready-check-and-coverage-test.md](tasks/WP08-ready-check-and-coverage-test.md)

### WP09 — Offline, deploy & end-to-end

- **Summary**: the service worker (own `skcp-` caches only, precache all shipped files, stale-while-revalidate), icons and full manifest, the README for the trainer, and the full quickstart verification pass.
- **Priority**: P2
- **Independent test**: every quickstart step passes, including offline reload, 360 px, isolation with a foreign key, and timing.
- **Estimated size**: 4 subtasks, ~360 lines
- **Dependencies**: WP02, WP03, WP04, WP08
- **Subtasks**:

T038 Service worker with skcp- caches (WP09)
T039 Icons and complete manifest (WP09)
T040 README (WP09)
T041 Full quickstart pass and fixes (WP09)

- **Parallel opportunities**: T039 and T040 are independent of T038.
- **Risks**: R-02 (foreign SW deleting our caches). The precache list must match the shipped files exactly.
- **Prompt file**: [tasks/WP09-offline-deploy-and-end-to-end.md](tasks/WP09-offline-deploy-and-end-to-end.md)

## MVP

WP01 → WP02 → WP03 → WP04 plus WP06 → WP07 → WP08 gives the P1 value: a tailored, verified setup path with a ready check. WP05 (vocabulary) and WP09 (offline, README) complete the course.
