---
work_package_id: WP07
title: Platform setup & terminal primer
dependencies:
- WP01
- WP06
requirement_refs:
- FR-004
- FR-012
- FR-013
- FR-022
- NFR-006
planning_base_branch: feat/spec-kitty-class-prep-track
merge_target_branch: feat/spec-kitty-class-prep-track
branch_strategy: Planning artifacts for this mission were generated on feat/spec-kitty-class-prep-track. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/spec-kitty-class-prep-track unless the human explicitly redirects the landing branch.
subtasks:
- T031
- T032
- T033
- T034
phase: Phase 3 - Content
history:
- at: '2026-10-26T11:38:51Z'
  actor: system
  action: Prompt generated via /spec-kitty.tasks
agent_profile: scribe-sally
agent: claude
authoritative_surface: js/data/setup/platform-blocks.js
create_intent:
- js/data/setup/platform-blocks.js
- js/data/modules/setup.js
- js/data/modules/terminal.js
execution_mode: code_change
model: ''
owned_files:
- js/data/setup/platform-blocks.js
- js/data/modules/setup.js
- js/data/modules/terminal.js
role: documentarian
tags: []
task_type: implement
tracker_refs: []
---

# Work Package Prompt: WP07 – Platform setup & terminal primer

## ⚡ Do This First: Load Agent Profile

Use the `/ad-hoc-profile-load` skill to load the agent profile specified in the frontmatter, and behave according to its guidance before parsing the rest of this prompt.

- **Profile**: see `agent_profile` in the frontmatter | **Role**: `implementer` | **Agent/tool**: see `agent`

## ⚠️ IMPORTANT: Review Feedback

Check the `review_ref` field in the event log before starting. Address all feedback before your work is complete.

## Markdown Formatting

Wrap HTML/XML tags in backticks. Use language identifiers in code blocks.

---

## Objectives & Success Criteria

Write the platform-specific heart of the course: Git (FR-012) and Python 3.11+ (FR-013) for every OS and chip, the setup module composer, and the optional "Terminal in 5 minutes" primer (FR-022).

Done means:

- `js/data/setup/platform-blocks.js` exports `platformBlocks`. For **every** OS in `windows, macos, linux, chromeos` and every applicable chip value, the visible blocks include Git install, Git identity, Git verify, Python install and Python verify (NFR-006, R-03).
- `js/data/modules/setup.js` default-exports the setup module, composing blocks in the order fixed by the content schema.
- `js/data/modules/terminal.js` default-exports the optional primer, with per-OS blocks.
- Every command is correct for its platform as of today (research R0-05), one command per `pre`.

## Context & Constraints

- Read first: [research.md](../research.md) R0-05 (install paths) and R0-06 (chip handling); [contracts/content-schema.md](../contracts/content-schema.md) (setup composition order); [contracts/tailoring-contract.md](../contracts/tailoring-contract.md) (coverage rules 1-2); the spec's Edge Cases (old Python, Store alias, ChromeOS).
- Imports: `toolBlocks` and `supportBlocks` from WP06's files (composer only).
- Use only enum values from `ENUMS` (`js/data/intake.js`). Every block in this WP needs a `topic` (`git`, `python`, `intro`) except the terminal-primer blocks.
- Chip: most steps are chip-independent, so don't add `chip` conditions unless the step really differs. Where it does, add `chipLabel` so "not sure" readers see which applies.
- **Verify commands on the official sources** (git-scm.com, python.org, the winget package ids, the Microsoft docs on app execution aliases, distro docs) before committing. Note the sources in the activity log.

## Branch Strategy

- Planning base and final merge target: `feat/spec-kitty-class-prep-track`.
- Execution worktrees are allocated per computed lane from `lanes.json`. Implement with:

```bash
spec-kitty agent action implement WP07 --agent <name>
```

## Subtasks & Detailed Guidance

### Subtask T031 – Git blocks

Per OS (`when: { os: [...] }`, `topic: "git"`):

- **Windows**: `winget install --id Git.Git -e`. Fallback: the installer from https://git-scm.com/download/win (keep the defaults). The ARM64 installer is available on the same page: add a small `chipLabel: "ARM"` note block only if the download choice differs. Then "Close and reopen your terminal."
- **macOS**: `xcode-select --install` (installs Apple's command-line tools, including Git). Note that a dialog appears and the download can take a while. Homebrew users can run `brew install git` instead.
- **Linux**: `sudo apt install git` (Debian/Ubuntu), `sudo dnf install git` (Fedora), `sudo pacman -S git` (Arch). One `pre` per command, with a label before each saying which distro it's for.
- **ChromeOS**: first a block `chromeos-linux` (`topic: "intro"`, `when: { os: ["chromeos"] }`, kind `step`): turn on Settings → About ChromeOS → Developers → Linux development environment. If that option is missing or blocked (managed Chromebook), tell the trainer. Then `sudo apt install git` inside the Linux terminal.

For all desktop OSes (`when: { os: ["windows","macos","linux","chromeos"] }`):

- **Identity** (`topic: "git"`): `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`, each in its own `pre`, with "Use the name and email you want on your commits."
- **Verify** (`topic: "git"`, kind `check`): `git --version`. Success: prints `git version 2.x`.

### Subtask T032 – Python 3.11+ blocks

Per OS (`topic: "python"`):

- **Windows**: `winget install --id Python.Python.3.13 -e`. Use the newest stable 3.x winget id; verify it exists. Fallback: the python.org installer, with **"Add python.exe to PATH" ticked**. A `warning` block about the **Microsoft Store trap**: if typing `python` opens the Store, turn off the "App execution aliases" for python.exe and python3.exe (Settings → Apps → Advanced app settings), or just use `py`. Verify with `py --version`.
- **macOS**: the python.org macOS installer (universal: works on Apple Silicon and Intel). Homebrew alternative: `brew install python@3.13` (verify the current formula). Note that the old system `python3` on some macOS versions may be below 3.11. Verify with `python3 --version`.
- **Linux**: `python3 --version` first. If it's 3.11 or newer, you're done. If it's older (some LTS releases), a `note` with the fallback: install a newer Python via the distro's newer package if available, or via `uv python install 3.12` (link to uv docs). Keep it short.
- **ChromeOS**: like Linux, inside the Linux environment. Debian 12-based containers ship 3.11, which is enough. Verify with `python3 --version`.
- **Verify** (kind `check`, one per OS group, since the command differs): success is "Python 3.11" or higher. If you see a lower number, follow the "older Python" note for your OS.

### Subtask T033 – Setup module composer `js/data/modules/setup.js`

```js
import { platformBlocks } from "../setup/platform-blocks.js";
import { toolBlocks } from "../setup/tool-blocks.js";
import { supportBlocks } from "../setup/support-blocks.js";

const byTopic = (blocks, topic) => blocks.filter(b => b.topic === topic);

export default {
  id: "setup",
  title: "Get set up",
  summary: "Git, Python and your AI coding tool, with a check for each, for your machine only.",
  minutes: 15,
  optional: false,
  blocks: [
    intro,                                   // topic "intro": what you'll install and why; downloads may take extra time
    ...byTopic(supportBlocks, "work-device"),
    ...platformBlocks,                       // ChromeOS Linux step first, then git, then python
    ...toolBlocks,
    ...byTopic(supportBlocks, "agent-check"),
    ...byTopic(supportBlocks, "head-start"),
  ],
  exercise: null,
};
```

- The `intro` block says: "You'll install three things: Git (tracks changes), Python 3.11+ (Spec Kitty runs on it) and your AI coding tool. Each step ends with a check. Download time isn't counted in the 15 minutes."
- Make sure `platformBlocks` lists the ChromeOS Linux step first, then the Git blocks, then the Python blocks.
- `exercise: null`: the setup module is "done" when opened, and the ready check is where attendees confirm.

### Subtask T034 – Terminal primer `js/data/modules/terminal.js`

Module: `{ id: "terminal", title: "Terminal in 5 minutes", summary: "Just enough terminal to follow the setup steps.", minutes: 5, optional: true, blocks, exercise: null }`.

Blocks, with per-OS variants where the instructions differ:

1. **Open a terminal**:
   - Windows: Start → type "Terminal" (Windows Terminal / PowerShell).
   - macOS: Cmd+Space → "Terminal".
   - Linux: Ctrl+Alt+T on most distros.
   - ChromeOS: the "Terminal" app after turning on Linux.
2. **Where am I, and what's here?**: `pwd` / `ls` on macOS, Linux and ChromeOS; `pwd` / `dir` on Windows. One `pre` each.
3. **Move into a folder**: `cd Documents`, and `cd ..` to go up.
4. **Run a command**: paste it (Ctrl+V or Ctrl+Shift+V on Windows/Linux terminals, Cmd+V on Mac), press Enter, and wait for the prompt to come back.
5. **Reading an error**: the last lines usually say what went wrong. "command not found" after an install often means "open a new terminal".
6. **Stop something**: Ctrl+C.

Keep the whole module to about 5 minutes of reading.

## Definition of Done

- In the console: for each OS in `windows, macos, linux, chromeos` × each applicable chip, `visibleBlocks(setupModule, answers)` contains `topic` git ×3 (install, identity, verify) and python ×2 (install, verify), plus tool and agent-check blocks. Paste the result table into the activity log. (WP08 makes this a permanent test.)
- Every command checked against an official source, with the sources listed in the activity log.
- No `when` value outside `ENUMS`.

## Risks & Edge Cases

- winget package ids and Homebrew formula names change with Python versions. Verify them today, and prefer instructions that age well ("the newest 3.x from python.org").
- Some ChromeOS devices are ARM. The apt commands are the same, so no chip conditions.
- Don't claim macOS ships a usable Python. Always install from python.org or Homebrew.

## Review Guidance

- Pick two OSes and follow the commands literally in your head. Is anything missing between the steps?
- Check the Windows Store-alias warning is clear and that `py` is the fallback.
- Check the composer order matches the content schema exactly.

## Activity Log

- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
