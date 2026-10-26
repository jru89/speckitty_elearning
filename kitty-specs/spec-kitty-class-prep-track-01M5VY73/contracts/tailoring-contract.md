# Contract: `js/lib/tailor.js`

Pure functions with no DOM and no storage access. They decide what an attendee sees.

## `appliesTo(when, answers) → boolean`

- `when` absent or `{}` → `true`.
- `answers` is `null` (intake not done) → `true` (preview mode shows everything).
- For every dimension `d` present in `when`:
  - if `answers[d]` is in `when[d]` → this dimension matches;
  - special case `d === "chip"` and `answers.chip === "unsure"` → matches;
  - otherwise → `false`.
- Returns `true` only if every present dimension matches.
- An unknown dimension name in `when` is a content bug: the function returns `false`, and the coverage test fails on it.

## `visibleBlocks(module, answers) → Block[]`

`module.blocks.filter(b => appliesTo(b.when, answers))`, order preserved.

## `earlyStop(answers) → null | "mobile" | "work-locked"`

Per [data-model.md](../data-model.md#answers-per-attendee-persisted). `mobile` wins if both apply.

## `suggestedNext(answers, progress) → moduleId`

Per data-model derived states. It never returns a module that is already `done`, except `ready` when everything is done.

## Coverage test (`tests/tailor.test.js`)

For **every** combination of `os × chip × device × tool × experience` (chip limited to `unsure` where the question is not asked):

1. **No dead ends (NFR-006)**: either `earlyStop(answers)` is non-null, or the visible blocks of `setup` include at least one block tagged `topic: "git"`, one `topic: "python"`, one `topic: "tool"` and one `topic: "agent-check"`.
2. **One OS only (SC-003)**: every visible `setup` or `terminal` block with an `os` condition includes `answers.os`.
3. **One tool only (SC-003)**: every visible block with a `tool` condition includes `answers.tool`, except for `undecided`, which shows the "help me choose" block instead.
4. **Known dimensions only**: no block in any module uses a `when` key outside `os, chip, device, tool, experience`, or a value outside the data-model enums.

Plus unit cases for each rule above, including the `chip: "unsure"` and `answers === null` cases.
