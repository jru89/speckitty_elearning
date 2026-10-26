# Contract: content files under `js/data/`

Content authors (human or agent) change only these files to update the course. Views treat them as trusted, repo-authored data.

## Modules (`js/data/modules/*.js`)

Each file default-exports one module object as defined in [data-model.md](../data-model.md#module-static). `js/data/modules/index.js` exports them in display order: `terminal` (optional), `words`, `spec-driven`, `setup`, `ready`.

### Block rules

- `id` is unique within the module.
- `when` uses only the dimensions and enum values from the data model (enforced by the coverage test).
- Setup blocks carry `topic`: `git`, `python`, `tool`, `agent-check`, `work-device`, `head-start` or `intro`. The coverage test relies on these.
- `body` is HTML authored in the repo. Commands go in `<pre><code>` blocks, one command per block, so each gets its own copy button.
- Tool-neutral modules (`words`, `spec-driven`) must not use a `tool` condition, except one optional "how commands look in your tool" block that renders the chosen tool's `commandStyle` (NFR-007, FR-025).

## Tools (`js/data/tools.js`)

- Exports `checkedOn` (ISO date) and `tools` (array of tool entries, data-model shape).
- `installUrl` must be the tool's own official documentation or site (C-006).
- The order is alphabetical except Claude Code first, labelled "used in the demo" (FR-025).

## Intake (`js/data/intake.js`)

- Exports the five questions in order, each with `id` (the answer field), `label`, `options: [{value, label, hint?}]`, and an optional `askIf(answersSoFar)` (used for chip).
- Option values must equal the data-model enums.

## Welcome (`js/data/welcome.js`)

- Exports `whatIsIt` (HTML, links to https://github.com/spec-kitty/spec-kitty), `agenda` (ordered list of the session's six agenda items), `bring` (list), and `installedInSession` (one sentence, C-004).
- Exports `session: { date, time, place, trainerContact }`, each optional. Empty fields are not rendered. `trainerContact` is also shown in every trainer-contact message (FR-006, the `other` tool block) as selectable text, never as a `mailto:`-only link. If it is empty, those messages say "your trainer" without contact details.
