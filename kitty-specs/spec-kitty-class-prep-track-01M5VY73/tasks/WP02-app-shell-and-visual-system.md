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
- No horizontal scroll at 360 px. The Bento Grid look (research R0-09) matches the reference when compared side by side in the preview. Visible keyboard focus everywhere.

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

### Subtask T009 – Design tokens, typography, bento layout

**Purpose**: implement the trainer's chosen style, the **GG Prompts Bento Grid** (https://ggprompts.com/styles/bento-grid.html), as specified in [research.md](../research.md) R0-09. Open the reference in the browser preview before you start and keep it beside your work. Follow it closely; the only deviations are the ones R0-09 lists.

**Steps**:
1. At the top of `css/style.css`, put a one-line layout comment, then these tokens on `:root` (values from the reference):
   ```css
   :root {
     color-scheme: dark;
     --bg: #000000; --cell: #1c1c1e; --cell-hover: #2c2c2e; --elevated: #2c2c2e;
     --text: #f5f5f7; --text-2: rgba(245,245,247,.7); --text-3: rgba(245,245,247,.55);
     --line: rgba(255,255,255,.1);
     --blue: #0A84FF; --purple: #BF5AF2; --green: #30D158; --orange: #FF9F0A; --pink: #FF375F; --indigo: #5E5CE6;
     --gradient-signature: linear-gradient(135deg, #0A84FF, #BF5AF2);
     --font: Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI Variable", "Segoe UI", Roboto, sans-serif;
     --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace;
     --space-xs: 4px; --space-sm: 8px; --space-md: 16px; --space-lg: 24px; --space-xl: 32px; --space-2xl: 48px; --space-3xl: 64px;
     --radius-sm: 12px; --radius-md: 16px; --radius-lg: 20px; --radius-xl: 28px; --radius-full: 9999px;
     --bento-gap: 16px;
     --ease: cubic-bezier(.25,.1,.25,1);
   }
   ```
   This is a **single dark theme by choice** (R0-09): no light-mode block. `body { background: var(--bg); color: var(--text); }`.
2. Type scale (reference values):
   - hero headline `clamp(2.5rem, 8vw, 5.5rem)`, weight 800, `letter-spacing: -3px` (-2px under 768px), line-height 1.05
   - page title `clamp(2rem, 4vw, 3rem)`, weight 700, -1.5px
   - cell title 1.125-1.5rem, weight 700, -0.25 to -0.75px
   - body 1rem-1.0625rem, weight 400, line-height 1.6, colour `--text-2`
   - caption 0.8125rem, `--text-3`
   Use `text-wrap: balance` on headings. Keep running text at 70ch or less inside cells.
3. Layout:
   - `.container { max-width: 1200px; margin-inline: auto; padding-block: var(--space-3xl); }`, with the side gutter `padding-left: max(16px, env(safe-area-inset-left))` and `padding-right: max(16px, env(safe-area-inset-right))`.
   - `.bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--bento-gap); }`, with span helpers `.span-2`, `.span-4`, `.tall` (row span 2) and `.hero-cell` (2x2).
   - Below 768px: 2 columns, `--bento-gap: 12px`, `.hero-cell` spans the full width. Below 480px: 1 column, all spans reset.
   - Reading pages (module, intake) use a narrower column: `max-width: 760px`.
4. Focus: `:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }`, plus the reference's 3px blue focus ring on inputs.
5. Motion: hover lift (`translateY(-2px)` with a darker shadow) **only** on cells that are links. Transitions use `--ease`. `@media (prefers-reduced-motion: reduce)` removes transforms and transitions. No scroll-triggered entrance animations.

### Subtask T010 – Component styles

Style these classes in the reference's manner. Views in WP03 and WP04 use exactly these names, so list them in a comment block at the top of the components section:

| Class | Use | Reference look |
|-------|-----|----------------|
| `.cell` (+ `.cell--link`) | every bento box | `--cell` background, `--radius-xl`, `--space-xl` padding; `.cell--link` gets the hover lift and `--cell-hover` |
| `.hero-title` | welcome headline | hero scale; text filled with `--gradient-signature` (`background-clip: text`). This is the **only** gradient use. |
| `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost` | actions | pill (`--radius-full`), 12px 28px padding, weight 600; primary `--blue`; secondary `--elevated` with a `--line` border; ghost text-blue |
| `.chip`, `.chip--done`, `.chip--next`, `.chip--optional` | real status only | the reference's `card-chip`: pill, 6px 14px, 0.75rem/600, tinted background (15-20% of the colour) with full-colour text; sentence case, no tracking |
| `.choice-group`, `.choice` | intake radio cards | the reference's radio style inside a `.cell`-like option (`--elevated`, `--radius-md`); checked state gets a `--blue` border and the reference's radio dot; whole card clickable |
| `.block`, `.block--step`, `.block--note`, `.block--warning`, `.block--check` | module content blocks | `.cell` look; `--warning` and `--check` use the reference's alert treatment (6% tint background, 15% tint border, coloured title): orange for warning, green for check, blue for note |
| `.chip-label` | "For ARM chips" tag | `.chip` in indigo |
| `.code` (wraps `pre`), `.copy-btn` | command blocks | `#000` background inside the cell, `--radius-md`, `--font-mono`, `pre { overflow-x: auto }`; `.copy-btn` is a small secondary pill at top right |
| `.stat`, `.stat__value`, `.stat__label` | progress cell | the reference's `card-stat`: value 2rem/800/-1px; label 0.8125rem `--text-3` |
| `.progress-bar` | progress | 8px tall, `--elevated` track, `--blue` fill, full radius |
| `.banner`, `.banner--stop`, `.banner--info` | early stop, non-persistent notice | the reference's alert: stop = pink, info = blue |
| `.exercise`, `.feedback--right`, `.feedback--wrong` | exercises | right = green alert tint, wrong = orange alert tint, always with text, never colour alone |
| `.checkbox` | ready check | the reference's custom checkbox (22px, 6px radius, blue when checked) |
| `.menu` | header menu | the reference's nav bar: sticky, `rgba(0,0,0,.72)` with `backdrop-filter: saturate(180%) blur(20px)`, bottom hairline `--line`; menu items `--text-2`, turning `--text` on hover |
| `.confirm` | "Start fresh" confirm | `.cell` with the pink alert treatment and two buttons |

The header is sticky with `top: env(safe-area-inset-top, 0px)`, plus a fixed `body::before` band in `#000` the height of the top inset.

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
- Open the reference (https://ggprompts.com/styles/bento-grid.html) next to the app and compare cells, buttons, chips, alerts and type. Check that `--text-3` small text is readable on `--cell`.
- Tab through the header menu and confirm panel with the keyboard only.

## Activity Log

- 2026-10-26T11:38:51Z – system – Prompt generated via /spec-kitty.tasks
