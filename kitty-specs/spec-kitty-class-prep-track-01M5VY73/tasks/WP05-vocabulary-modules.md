---
work_package_id: WP05
title: Vocabulary modules
dependencies:
- WP01
requirement_refs:
- C-003
- C-005
- FR-008
- FR-009
- FR-010
- FR-011
- FR-025
- NFR-007
planning_base_branch: feat/spec-kitty-class-prep-track
merge_target_branch: feat/spec-kitty-class-prep-track
branch_strategy: Planning artifacts for this mission were generated on feat/spec-kitty-class-prep-track. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/spec-kitty-class-prep-track unless the human explicitly redirects the landing branch.
subtasks:
- T022
- T023
- T024
- T025
- T026
phase: Phase 3 - Content
history:
- at: '2026-10-26T11:38:51Z'
  actor: system
  action: Prompt generated via /spec-kitty.tasks
agent_profile: scribe-sally
agent: claude
authoritative_surface: js/data/modules/words.js
create_intent:
- js/data/modules/words.js
- js/data/modules/spec-driven.js
execution_mode: code_change
model: ''
owned_files:
- js/data/modules/words.js
- js/data/modules/spec-driven.js
role: documentarian
tags: []
task_type: implement
tracker_refs: []
---

# Work Package Prompt: WP05 – Vocabulary modules

## ⚡ Do This First: Load Agent Profile

Use the `/ad-hoc-profile-load` skill to load the agent profile specified in the frontmatter, and behave according to its guidance before parsing the rest of this prompt.

- **Profile**: see `agent_profile` in the frontmatter | **Role**: `implementer` | **Agent/tool**: see `agent`

## ⚠️ IMPORTANT: Review Feedback

Check the `review_ref` field in the event log before starting. Address all feedback before your work is complete.

## Markdown Formatting

Wrap HTML/XML tags in backticks. Use language identifiers in code blocks.

---

## Objectives & Success Criteria

Write the two vocabulary modules as data files: **Words you'll hear** (FR-008, FR-009) and **Vibe coding vs spec-driven** (FR-010, FR-011), both tool-neutral (NFR-007) and light (NFR-001).

Done means:

- `js/data/modules/words.js` and `js/data/modules/spec-driven.js` default-export module objects in the [data-model](../data-model.md#module-static) shape, with valid exercise configs per [contracts/exercise-engine-contract.md](../contracts/exercise-engine-contract.md).
- Every FR-008 term is explained and appears in the match exercise.
- Module 2 covers all seven steps with what each produces, one line each on work packages and worktrees, **exactly one** Bright Factory teaser line (C-005), and the `command-style` block.
- No `when.tool` condition anywhere except the single `command-style` block. Ideally no `when` at all in these two files.
- Reading time, excluding exercises: Module 1 ≤ 8 minutes, Module 2 ≤ 6 minutes.

## Context & Constraints

- Read first: [research.md](../research.md) R0-03 (canonical definitions), [contracts/content-schema.md](../contracts/content-schema.md), spec User Story 2 and the Domain Language table.
- These are **pure data files**. They import nothing and have no DOM.
- `body` is trusted HTML. Use `p`, `ul`/`ol`, `strong`, `code`, and at most one small table. No inline styles or scripts.
- Tone: light, "for your information", plain words. Address the reader as "you". No hype, no emoji.
- Until WP04 lands, check the files load by importing them in the browser console from the test page origin (`await import("/js/data/modules/words.js")`) and inspecting the object.

## Branch Strategy

- Planning base and final merge target: `feat/spec-kitty-class-prep-track`.
- Execution worktrees are allocated per computed lane from `lanes.json`. Implement with:

```bash
spec-kitty agent action implement WP05 --agent <name>
```

## Subtasks & Detailed Guidance

### Subtask T022 – Module 1 content `words.js`

Module object: `{ id: "words", title: "Words you'll hear", summary: "The handful of terms the trainer will use, in plain language.", minutes: 8, optional: false, blocks, exercise }`.

Blocks, in this order (one block each, short):

1. **Chatbot vs agent**: a chatbot answers in text and you do the work (copy, paste, run, report errors back). An agent can act: read and edit files, run commands, check results. You supervise instead of doing every step.
2. **The agentic loop**: think → use a tool → look at the result → repeat until done. Name it as the core idea that makes agents useful and also lets them drift.
3. **Model**: the AI "brain" (e.g. Claude, GPT, Gemini) that the tool runs. Different tools can run different models.
4. **Tools**: the actions an agent is allowed to take: read files, write files, run terminal commands, search the web. Mention that tools usually ask your permission.
5. **Context window**: the agent's working memory for one session. It's limited, and a new session starts empty. **This is why Spec Kitty keeps specs and plans in your repo.**
6. **Skills and slash commands**: saved instructions the agent loads when a task matches, often started with a command such as `/something`. Spec Kitty installs its commands this way. Keep it tool-neutral: "how they're typed differs per tool".
7. **Agent instruction files**: a file in your project the agent always reads, with names like `CLAUDE.md`, `AGENTS.md` or `GEMINI.md` depending on the tool.
8. **Doctrine**: Spec Kitty's reusable "how we work" knowledge: rules that must hold (directives), proven techniques (tactics), step-by-step routines (procedures) and roles (agent profiles).
9. **Charter**: your project's own selection of doctrine plus its rules. "The spec says *what* to build; the charter says *how* you build it."
10. **Agent profile**: a role an agent takes on, such as implementer, reviewer or architect, each with its own focus and boundaries.

Finish with a `note` block: "That's all the vocabulary you need. Everything else is explained during the session."

### Subtask T023 – Module 1 match exercise

`exercise: { id: "words-match", type: "match", config: { pairs } }`, with **8 pairs**: agent, agentic loop, context window, tool, skill, agent instruction file, doctrine, charter. Each pair has:

- `term`
- `definition`: one line, distinct enough that only one fits
- `whyWrong`: a hint shown when this term gets a wrong definition, pointing at the confusion. For example, for charter: "Close: doctrine is the shared library of how-to; the charter is your project's own pick from it."

Avoid definitions that differ only by one word.

### Subtask T024 – Module 2 content `spec-driven.js`

Module object: `{ id: "spec-driven", title: "Vibe coding vs spec-driven", summary: "Why loose prompting breaks down on bigger work, and the flow Spec Kitty uses instead.", minutes: 6, optional: false, blocks, exercise }`.

Blocks:

1. **Vibe coding**: prompt, accept, prompt again. Great for quick prototypes.
2. **Where it breaks down**: as a short list:
   - the agent forgets between sessions (context window)
   - it drifts from what you meant
   - there's no record of *why* something was built
   - "done" is never defined, so it's hard to review
3. **Spec-driven**: write down intent and acceptance criteria first, keep them in Git, and let the agent work from them.
4. **The seven steps**: an ordered list or a small table with step, what it produces and who leads:
   - spec: what and why, plus acceptance criteria (you)
   - plan: how, the technical approach (agent drafts, you check)
   - tasks: work packages (agent)
   - build: code, per work package (agent)
   - review: a check against the spec (another agent and/or you)
   - accept: confirm the criteria are met (you)
   - merge: into the main code (you approve)
5. **Work packages and worktrees**: one line each. A work package is one small, reviewable slice of the work. A worktree is a separate working folder of the same repo, so several agents can build different work packages at once without stepping on each other.
6. **Acceptance criteria**: the bridge to the exercise. A good criterion can be checked yes or no by someone who didn't write it. One example of a good one and one of a bad one.
7. **Teaser**: exactly one line, "In the session we'll zoom in on the Bright Factory: humans define intent and acceptance criteria, agents build it in a traceable way." (C-005: nothing more.)
8. A `command-style` block (`kind: "command-style"`, no body). WP04 renders it (FR-025).

### Subtask T025 – Module 2 judge exercise

`exercise: { id: "spec-driven-judge", type: "judge", config: { statements } }`, with **6 statements**, about half testable. Each has `text`, `isCriterion` and `why`. Use one running example, a small to-do app, to stay concrete:

- ✓ "When I add a task with an empty title, the app shows 'Title is required' and doesn't save it."
- ✗ "The app should be fast and user-friendly." (why: no one can check "user-friendly" with a yes or no)
- ✗ "Use React for the front end." (why: that's a plan decision about *how*, not a criterion about *what*)
- ✓ "After I reload the page, my tasks are still there."
- ✗ "Make it look nice."
- ✓ "Marking a task done moves it to the bottom of the list within one second."

Write the `why` for every statement, including the correct ones (why it *is* checkable).

### Subtask T026 – Tool-neutrality and terminology review

1. Re-read both files against research R0-03 and the spec's Domain Language table.
2. Grep both files for tool names. They may appear only as examples ("such as Claude, GPT or Gemini") or in instruction-file names, never as the assumed tool.
3. Check `when` usage: there should be none. The `command-style` block has no `when` either, because WP04 tailors its rendering.
4. Read both aloud at normal speed and check the minutes estimate.
5. Record the result of each check in the activity log.

## Definition of Done

- Both files load as ES modules and match the data-model shapes (checked in the console, or with WP04 once merged).
- Every FR-008 term is present, the 8 match pairs are distinct, and there are 6 judge statements, each with a `why`.
- The T026 checks are recorded.

## Risks & Edge Cases

- Over-writing: the course must stay light. If a block runs past ~80 words, cut it.
- Terminology drift: use "AI coding tool" for the product and "agent" for the concept. Don't use "Claude" generically.

## Review Guidance

- Verify every definition against research R0-03.
- Count Bright Factory mentions: exactly one.
- Do the match exercise yourself. Each term should have exactly one sensible definition.

## Activity Log

- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
