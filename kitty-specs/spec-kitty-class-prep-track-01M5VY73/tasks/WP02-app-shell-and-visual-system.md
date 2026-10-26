---
work_package_id: WP02
title: App shell & visual system
dependencies:
- WP01
requirement_refs:
- C-002
- FR-005
- FR-023
- NFR-008
- NFR-010
planning_base_branch: feat/spec-kitty-class-prep-track
merge_target_branch: feat/spec-kitty-class-prep-track
branch_strategy: Planning artifacts for this mission were generated on feat/spec-kitty-class-prep-track. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/spec-kitty-class-prep-track unless the human explicitly redirects the landing branch.
subtasks:
- T008
- T009
- T010
- T011
- T012
phase: Phase 2 - Shell
history:
- at: '2026-10-26T11:38:51Z'
  actor: system
  action: Prompt generated via /spec-kitty.tasks
agent_profile: frontend-freddy
agent: claude
authoritative_surface: js/app.js
create_intent:
- index.html
- manifest.json
- .claude/launch.json
- css/style.css
- js/app.js
- js/lib/clipboard.js
- js/lib/enhance.js
execution_mode: code_change
model: ''
owned_files:
- index.html
- manifest.json
- .claude/launch.json
- css/style.css
- js/app.js
- js/lib/clipboard.js
- js/lib/enhance.js
role: implementer
tags: []
task_type: implement
tracker_refs: []
---

# Work Package Prompt: WP02 – App shell & visual system

## ⚡ Do This First: Load Agent Profile

Use the `/ad-hoc-profile-load` skill to load the agent profile specified in the frontmatter, and behave according to its guidance before parsing the rest of this prompt.

- **Profile**: see `agent_profile` in the frontmatter | **Role**: `implementer` | **Agent/tool**: see `agent`

## ⚠️ IMPORTANT: Review Feedback

Check the `review_ref` field in the event log before starting. Address all feedback before your work is complete.

## Markdown Formatting

Wrap HTML/XML tags in backticks. Use language identifiers in code blocks.

---

## Objectives & Success Criteria

Build the frame every page renders in: the HTML entry, the visual system, the hash router with its route guard, the header menu, and copy buttons for command blocks. Views themselves come from WP03 and WP04, so the router loads them lazily and degrades gracefully while they don't exist yet.

Done means:

- `index.html` served locally loads with **no console errors**, even before WP03/WP04 views exist ("This page isn't built yet" placeholder).
- Routes match the table in [plan.md](../plan.md#routes). Unknown routes go to `#/`.
- **Route guard**: with no valid answers, `#/course` and `#/m/<anything>` redirect to `#/intake`.
- The header shows the course name and a menu with "Change my answers" (→ `#/intake`) and "Start fresh", which uses an in-page confirm (never `window.confirm`) and then calls `store.startFresh()` and goes to `#/intake`.
- When `store.isPersistent()` is false, a one-line notice says answers won't be remembered on this device.
- No horizontal scroll at 360 px. Light and dark themes both legible. Visible keyboard focus everywhere.

## Context & Constraints

- Read first: [plan.md](../plan.md) (Routes, Route guard, Technical Context), [spec.md](../spec.md) NFR-008 and NFR-010, [contracts/store-contract.md](../contracts/store-contract.md).
- Imports from WP01: `store` from `js/lib/store.js`.
- No dependencies and no CDN. Fonts are a system stack, or self-hosted files under `fonts/` if you choose a face. If you self-host, add `fonts/**` to your changes with a one-line rationale; WP09 adds them to the precache.
- Hosted under a sub-path (`/<repo>/`), so every URL in HTML, CSS and JS is relative (`./css/style.css`, not `/css/style.css`).

## Branch Strategy

- Planning base and final merge target: `feat/spec-kitty-class-prep-track`.
- Execution worktrees are allocated per computed lane from `lanes.json`. Implement with:

```bash
spec-kitty agent action implement WP02 --agent <name>
```

## Subtasks & Detailed Guidance

### Subtask T008 – `index.html`, minimal `manifest.json`, `.claude/launch.json`

**Steps**:
1. `index.html`:
   - `<!doctype html>`, `lang="en"`, charset, and viewport `width=device-width, initial-scale=1`.
   - `<title>Spec Kitty Class Prep</title>` and a meta description.
   - `<link rel="manifest" href="./manifest.json">`, the stylesheet, and a theme-color meta for each scheme.
   - Body: `<header id="app-header">`, `<main id="app-main" tabindex="-1">`, `<div id="app-notice" hidden>`, and `<script type="module" src="./js/app.js">`.
   - A `<noscript>` line explaining JavaScript is needed.
2. `manifest.json` (minimal; WP09 completes icons):
   ```json
   { "name": "Spec Kitty Class Prep", "short_name": "SK Prep", "start_url": "./", "scope": "./", "display": "standalone" }
   ```
   Pick `background_color` and `theme_color` from your tokens.
3. `.claude/launch.json` for the browser preview:
   ```json
   { "version": "0.0.1", "configurations": [ { "name": "prep", "runtimeExecutable": "python", "runtimeArgs": ["-m", "http.server", "8533"], "port": 8533 } ] }
   ```

### Subtask T009 – Design tokens, typography, layout

**Purpose**: a light, deliberate look that fits the subject: a factory-floor or workshop checklist feel for a class about building software in a structured flow. Avoid generic AI-looking defaults (purple gradients, everything centred, emoji section markers).

**Steps**:
1. At the top of `css/style.css`, put a one-line layout comment, then the tokens on `:root`:
   - colours: `--bg`, `--surface`, `--fg`, `--muted`, `--line`, `--accent`, `--accent-fg`, plus semantic `--ok`, `--warn` and `--stop`
   - fonts: `--font-display`, `--font-body`, `--font-mono`
   - a type scale (`--step-0` … `--step-4`) and spacing (`--space-1` … `--space-6`)
2. Dark theme: redefine colour tokens only, under `@media (prefers-color-scheme: dark)`. Set `color-scheme: light dark` on `:root`. `body` uses `background: var(--bg); color: var(--fg)`.
3. Layout: a single reading column, `max-width: 42rem` for text and `min(100%, 60rem)` for the overview grid. Side gutter `padding-inline: max(16px, env(safe-area-inset-left))` and the right equivalent. Use flex/grid with `gap`, not margins between siblings.
4. Text: body around 17-18px, line-height 1.55, `text-wrap: balance` on headings, and slight letter-spacing on uppercase labels.
5. `:focus-visible` outline using `--accent`, 2px, with offset.
6. `@media (prefers-reduced-motion: reduce)` disables transitions.

### Subtask T010 – Component styles

Style these classes. Views in WP03 and WP04 will use exactly these names, so list them in a comment block at the top of the components section:

| Class | Use |
|-------|-----|
| `.btn`, `.btn--primary`, `.btn--quiet` | actions |
| `.choice-group`, `.choice` (radio cards, input visually hidden but focusable, `:checked` state clear) | intake |
| `.block`, `.block--step`, `.block--note`, `.block--warning`, `.block--check` | module content blocks (from data-model `kind`) |
| `.chip-label` | small tag on blocks when chip is "not sure" |
| `.code` wrapper around `pre`, with `.copy-btn` | command blocks. The `pre` scrolls horizontally on its own (`overflow-x: auto`); the page never does. |
| `.module-card`, `.status`, `.status--done`, `.status--in_progress` | overview |
| `.banner`, `.banner--stop`, `.banner--info` | early stop, non-persistent notice |
| `.progress-bar` | overall progress |
| `.exercise`, `.feedback--right`, `.feedback--wrong` | exercises |
| `.menu` | header menu (a `details`/`summary` element is fine) |
| `.confirm` | the in-page confirm for "Start fresh" |

Make every semantic state readable in both themes. Feedback and status use text plus colour, never colour alone.

### Subtask T011 – Router, route guard, header menu, notices in `js/app.js`

**Steps**:
1. Route table (path pattern → view module path → `requiresAnswers`):
   ```js
   const routes = [
     { path: "/", view: null /* resolved: answers ? "overview" : "welcome" */ },
     { path: "/welcome", view: "./views/welcome-view.js" },
     { path: "/intake", view: "./views/intake-view.js" },
     { path: "/course", view: "./views/overview-view.js", requiresAnswers: true },
     { path: "/m/:id", view: "./views/module-view.js", requiresAnswers: true },
   ];
   ```
2. Matching: exact segments plus one `:id` param. Unknown paths → `/`.
3. Guard: if `requiresAnswers` and `store.getAnswers() === null`, `location.replace("#/intake")` and stop.
4. Render: `const mod = await import(view)`, then `mod.render(main, params, ctx)` with `ctx = { store, navigate }`. A view may return a cleanup function; call it before the next render. If the import fails, render a short placeholder: "This page isn't built yet." This is expected while WP03/WP04 are in progress.
5. After each render: `window.scrollTo(0, 0)`, move focus to `main` for screen readers, and set `document.title` to "<page> – Spec Kitty Class Prep".
6. Export `navigate(path)`.
7. Header, built once: the course name (links to `#/`), and a `.menu` with "Change my answers", "Start fresh" and "About this course" (→ `#/welcome`). "Start fresh" opens a `.confirm` inline panel: "This clears your answers and progress on this device. Other apps aren't affected." with **Clear and start over** / **Cancel** buttons. On confirm, call `store.startFresh()`, then `navigate("/intake")`.
8. Notice: if `!store.isPersistent()`, show `#app-notice` with "Your browser isn't letting this site save, so your answers will be forgotten when you close it." Re-check on `store.subscribe`.
9. Leave a clearly marked spot for WP09 to add service-worker registration:
   `// Service worker registration: added in WP09.`

**Files**: `js/app.js` (~160 lines)

### Subtask T012 – Clipboard helper and code-block copy enhancer

**Steps**:
1. `js/lib/clipboard.js` exports `copyText(text, fallbackEl)`. It tries `navigator.clipboard.writeText` inside the click handler and resolves `"copied"`. If that rejects or is unavailable, it puts the text into `fallbackEl` (a read-only `textarea` or `input`), selects it and resolves `"selected"`. It never throws.
2. `js/lib/enhance.js` exports `enhanceCodeBlocks(container)`. For each `pre > code` inside `container` that isn't enhanced yet, it wraps the `pre` in `.code` and adds a `.copy-btn` ("Copy"). On click it copies the code text and shows "Copied" for 1.5 s, or "Select and copy" on fallback. Mark processed blocks with `data-enhanced`.

## Definition of Done

- Everything listed under Objectives verified in the browser preview (`preview_start` with name `prep`), with a screenshot at 360 px and one at desktop width in the activity log.
- No console errors on `#/`, `#/welcome`, `#/intake`, `#/course` and `#/m/setup` with views missing.
- Guard verified with empty storage and with seeded valid answers. To seed, run in the console:
  ```js
  localStorage.setItem("skcp:v1", JSON.stringify({ schemaVersion: 1, answers: { os: "macos", chip: "arm", device: "personal", tool: "cursor", experience: "agents-daily" }, progress: { modules: {}, exercises: {}, checklist: {} } }))
  ```

## Risks & Edge Cases

- `window.confirm` is forbidden here: use the in-page confirm.
- Hash routes only. Don't use the History API, because GitHub Pages has no SPA fallback.
- Keep `app.js` free of content and view logic. It's the frame only.

## Review Guidance

- Check every URL is relative. Grep for `href="/` and `src="/`.
- Toggle the OS dark mode and check contrast on banners and feedback.
- Tab through the header menu and confirm panel with the keyboard only.

## Activity Log

- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
