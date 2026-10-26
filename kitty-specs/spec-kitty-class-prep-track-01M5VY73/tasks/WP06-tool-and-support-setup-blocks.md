---
work_package_id: WP06
title: Tool & support setup blocks
dependencies:
- WP01
requirement_refs:
- C-006
- C-007
- FR-014
- FR-015
- FR-016
- FR-017
- FR-018
planning_base_branch: feat/spec-kitty-class-prep-track
merge_target_branch: feat/spec-kitty-class-prep-track
branch_strategy: Planning artifacts for this mission were generated on feat/spec-kitty-class-prep-track. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/spec-kitty-class-prep-track unless the human explicitly redirects the landing branch.
subtasks:
- T027
- T028
- T029
- T030
phase: Phase 3 - Content
history:
- at: '2026-10-26T11:38:51Z'
  actor: system
  action: Prompt generated via /spec-kitty.tasks
agent_profile: ''
authoritative_surface: js/data/setup/
create_intent:
- js/data/setup/tool-blocks.js
- js/data/setup/support-blocks.js
execution_mode: code_change
model: ''
owned_files:
- js/data/setup/tool-blocks.js
- js/data/setup/support-blocks.js
role: implementer
tags: []
task_type: implement
tracker_refs: []
---

# Work Package Prompt: WP06 – Tool & support setup blocks

## ⚡ Do This First: Load Agent Profile

Use the `/ad-hoc-profile-load` skill to load the agent profile specified in the frontmatter, and behave according to its guidance before parsing the rest of this prompt.

- **Profile**: see `agent_profile` in the frontmatter | **Role**: `implementer` | **Agent/tool**: see `agent`

## ⚠️ IMPORTANT: Review Feedback

Check the `review_ref` field in the event log before starting. Address all feedback before your work is complete.

## Markdown Formatting

Wrap HTML/XML tags in backticks. Use language identifiers in code blocks.

---

## Objectives & Success Criteria

Write the tool-specific and support parts of the setup module as two data files. WP07's composer `js/data/modules/setup.js` concatenates them with the Git and Python blocks (see [contracts/content-schema.md](../contracts/content-schema.md), "The setup module is the exception").

Done means:

- `js/data/setup/tool-blocks.js` exports `toolBlocks`, with exactly one `topic: "tool"` block per tool id in `tools.js`, one for `undecided` (holding a `tool-chooser` block) and one for `other` (FR-014, FR-015, C-006, C-007).
- `js/data/setup/support-blocks.js` exports `supportBlocks`, containing the `agent-check` block(s) (FR-016), `work-device` blocks (FR-017) and `head-start` blocks per OS (FR-018).
- Every `when` uses only the WP01 enums (`ENUMS` in `js/data/intake.js`).
- Every link goes to the tool's or project's official site.

## Context & Constraints

- Read first: [data-model.md](../data-model.md) (Content block, interactive kinds), [contracts/content-schema.md](../contracts/content-schema.md), [contracts/tailoring-contract.md](../contracts/tailoring-contract.md) (coverage rules 1 and 3), research R0-04 and R0-05, spec User Story 1 and the Edge Cases.
- Imports allowed: `tools` from `js/data/tools.js` (WP01), so blocks can be generated from the tool list instead of being hand-copied 13 times.
- **Link, don't copy** (C-006): don't paste tool install commands. Link to the official page and add at most a one-line orientation (e.g. "It's a desktop app" or "It runs in your terminal").
- Block `body` is trusted HTML. Commands go in `pre > code`, one command per block, so WP02's copy buttons work.
- `when` values must be the exact enum strings. WP08's coverage test fails otherwise.

## Branch Strategy

- Planning base and final merge target: `feat/spec-kitty-class-prep-track`.
- Execution worktrees are allocated per computed lane from `lanes.json`. Implement with:

```bash
spec-kitty agent action implement WP06 --agent <name>
```

## Subtasks & Detailed Guidance

### Subtask T027 – Per-tool blocks, "help me choose" and "other"

**Steps**:
1. Generate one block per tool:
   ```js
   export const toolBlocks = [
     ...tools.map(t => ({
       id: `tool-${t.id}`,
       topic: "tool",
       kind: "step",
       heading: `Install ${t.name}`,
       when: { tool: [t.id] },
       body: toolBody(t),
     })),
     { id: "tool-undecided", topic: "tool", kind: "tool-chooser", heading: "Pick an AI coding tool", when: { tool: ["undecided"] } },
     { id: "tool-other", topic: "tool", kind: "note", heading: "Using another tool", when: { tool: ["other"] }, body: "…" },
   ];
   ```
2. `toolBody(t)` renders, in this order:
   - cost line from `costNote` (e.g. "Cost: needs a paid plan or API key"). Escape it, since it's data: write a tiny `escapeHtml` in this file.
   - "Follow the official install guide:" + link to `installUrl` (`target="_blank" rel="noopener"`)
   - "Then open it once and log in, so it's ready on the day."
   - for Claude Code only, "This is the tool the trainer demos with."
3. If a tool needs OS-specific notes (for example, it doesn't support one OS), add a separate block with `when: { tool: [id], os: [...] }` and `kind: "warning"`. Only do this for facts confirmed on the official site. Otherwise leave it to the official guide.
4. The `tool-other` body: "Spec Kitty supports many AI coding tools. Check with your trainer before the session that yours is one of them, and install it using its own guide." Then the trainer-contact phrase "your trainer". WP03 shows the contact itself on the overview.
5. Pre-check the chooser data: `tool-chooser` renders from `tools.js` (WP04), so put a short intro for the chooser in a separate `note` block with `when: { tool: ["undecided"] }`: "Not sure? Any of these works with Spec Kitty. The trainer demos with Claude Code. If you want a free option, pick one marked free or free tier."

### Subtask T028 – Agent-check blocks

Purpose: one verification that works for any tool (FR-016, NFR-007).

Blocks (all `topic: "agent-check"`):
1. `agent-check-steps` (kind `check`, no `when`):
   1. Make an empty folder called `spec-kitty-test`.
   2. Open it in your AI coding tool (or open a terminal there and start the tool).
   3. Ask: "List the files in this folder and create a file called hello.txt that says hi."
   4. **Success looks like**: the tool asks permission (or just does it), tells you the folder was empty, and `hello.txt` appears in the folder.
2. `agent-check-trouble` (kind `note`, no `when`): if it fails:
   - not logged in → log in
   - the tool can't see the folder → open the folder itself, not its parent
   - an error about the plan or quota → check your account
   - otherwise copy the error and send it to your trainer before the session
3. `agent-check-undecided` (kind `note`, `when: { tool: ["undecided"] }`): "Pick a tool above first, then come back to this check."

### Subtask T029 – Work-device guidance blocks

All `topic: "work-device"`:

1. `work-can-install` (`when: { device: ["work-can-install"] }`, kind `note`): "Work laptops sometimes block AI tools or sit behind a company proxy. If an install or log-in fails, try a personal device, or ask IT, and tell your trainer before the session."
2. `work-locked` (`when: { device: ["work-locked"] }`, kind `warning`): what to ask IT for (Git, Python 3.11 or newer, and the AI coding tool), the alternative of bringing a personal laptop, and a note to tell the trainer before the session.
3. `mobile` (`when: { os: ["mobile"] }`, kind `warning`): "These steps need a laptop or desktop. Read along here, and tell your trainer before the session."

### Subtask T030 – Optional pipx/uv head start per OS

All `topic: "head-start"`, kind `note`, with a heading such as "Optional: save time in the session". Explain once: "Spec Kitty installs with a Python tool called pipx (or uv). Installing it now saves a few minutes in the session. Skip this if you're short on time."

- Windows (`when: { os: ["windows"] }`): `py -m pip install --user pipx` then `py -m pipx ensurepath`, each in its own `pre`, plus "Open a new terminal afterwards."
- macOS (`when: { os: ["macos"] }`): `brew install pipx` if they use Homebrew, otherwise `python3 -m pip install --user pipx` then `python3 -m pipx ensurepath`.
- Linux and ChromeOS (`when: { os: ["linux", "chromeos"] }`): `sudo apt install pipx` (Debian/Ubuntu and ChromeOS Linux), or the distro's package. Then `pipx ensurepath`.
- Verify (no `when`, but exclude mobile: `when: { os: ["windows","macos","linux","chromeos"] }`): `pipx --version`.
- Mention uv as an alternative in one line, with a link to its official docs (`https://docs.astral.sh/uv/`). Don't include its install command.

Verify each command against pipx's official install docs (`https://pipx.pypa.io/`) before committing.

## Definition of Done

- Both files load as ES modules (check in the console) and every `when` value is in `ENUMS`. Add a temporary console check, `toolBlocks.every(b => Object.entries(b.when||{}).every(([k,v]) => v.every(x => ENUMS[k].includes(x))))`, run it, and paste the result into the activity log.
- Exactly one `topic: "tool"` block per `ENUMS.tool` value. The chooser intro note doesn't count: give it `topic: "intro"`.
- All external links checked to resolve to official pages.

## Risks & Edge Cases

- A stale `costNote` comes from WP01's data, not this file. Don't duplicate prices here.
- Tool OS-support notes must be confirmed facts, or left out.

## Review Guidance

- Click through three install links.
- Check that the `undecided` path has a `tool-chooser` block, and that the `other` path is not a dead end.
- Make sure no install command for a tool was copied in (C-006).

## Activity Log

- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
