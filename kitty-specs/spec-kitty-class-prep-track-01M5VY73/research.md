# Research: Spec Kitty Class Prep Track

Phase 0 output for [plan.md](plan.md). Each entry gives the decision, why, and what else was considered. No `[NEEDS CLARIFICATION]` items remain.

## R0-01 — Tech stack

- **Decision**: vanilla HTML/CSS/JS with native ES modules, no build step, no dependencies (user decision DM-01M5VYBPB8AK5FJP1071488HG9).
- **Rationale**: the trainer already ships two apps this way to GitHub Pages, so deploying is just a push. With zero dependencies there's no supply-chain surface and nothing to keep upgraded, and the course is small (about 8 views).
- **Alternatives considered**: Vite + a UI framework. Rejected: it needs a build and a deploy Action, for no user-visible gain at this size.

## R0-02 — Per-attendee and per-app isolation on a shared origin

- **Decision**: one `localStorage` key, `skcp:v1`, owned by `js/lib/store.js`. Reset removes only that key. Caches are named `skcp-v<N>`, and the service worker deletes only `skcp-` caches.
- **Rationale**: every GitHub Pages project of one user shares the origin `https://<user>.github.io`. `localStorage` and the Cache API are per origin, not per path, so the onboarding lab and the rijbewijs app can see this app's keys and caches, and this app can see theirs. Browser storage is per browser profile per device, which already separates attendees (NFR-003). The remaining risks are same-origin collisions and a shared device, both handled by the single namespaced key plus "Start fresh".
- **Observed in the wild**: the onboarding lab's `service-worker.js` deletes every cache whose name differs from its own on `activate`. On a browser that has visited both apps, it will delete `skcp-` caches. This is handled by network fallback (plan risk R-02). Fixing it in the lab is out of scope (C-001).
- **Alternatives considered**: `sessionStorage` (loses progress between sittings, violating FR-024); IndexedDB (more API surface, same origin-sharing issue); a custom domain or separate GitHub account per app (real origin isolation, but needless setup for the trainer).

## R0-03 — Spec Kitty terminology for Module 1 and 2

- **Decision**: define the terms the way Spec Kitty uses them, tool-neutrally:
  - **Agent**: an AI model running in a loop with tools (read and edit files, run commands), checking results until a task is done. Contrast with a chatbot, which only answers in text.
  - **Skill / slash command**: a packaged set of instructions an agent loads when a task matches. Spec Kitty installs its commands as these (`/spec-kitty.specify` in Claude Code; other tools use their own syntax, for example `$spec-kitty-specify` in Codex).
  - **Agent instruction file**: a file the agent always reads for a project, such as CLAUDE.md, AGENTS.md or GEMINI.md.
  - **Doctrine**: Spec Kitty's reusable body of "how we work": directives (rules that must hold), tactics (proven techniques), procedures (step-by-step routines) and agent profiles.
  - **Charter**: a project's own governance, its selection of doctrine plus its rules. Spec = *what* to build; charter = *how* to build.
  - **Agent profile**: a role with identity and boundaries, such as implementer, reviewer or architect.
  - **Mission, work package, lane, worktree**: a mission is one feature from spec to merge. Work packages are its executable slices. They move through lanes (planned → in progress → for review → approved → done). Each runs in its own git worktree so agents can work in parallel.
- **Rationale**: the class uses these words. Sources: the Spec Kitty repository README (workflow, lanes, worktrees, supported agents, install commands) and the Spec Kitty 3.2.7 skill and doctrine surfaces installed locally (charter, doctrine, profile skills).
- **Alternatives considered**: generic AI-industry definitions. Rejected because "doctrine" and "charter" have Spec Kitty-specific meanings.

## R0-04 — Supported AI coding tools and cost models

- **Decision**: `js/data/tools.js` lists the agents Spec Kitty 3.2.7 supports (C-007): Claude Code, Codex, Cursor, Gemini, GitHub Copilot, Windsurf, OpenCode, Qwen, Kiro, Vibe, Pi, Letta, Antigravity, plus "Other". Each entry has a cost model (`free`, `free-tier`, `paid`, `api-key`), the official install URL and the Spec Kitty command style. **The implementer verifies each cost model and URL against the tool's official site at build time** and records the check date in the file header.
- **Rationale**: cost models change often. The class needs them correct on the day the link is shared, not on the day this plan was written. Linking rather than copying install steps (C-006) limits what can go stale.
- **Alternatives considered**: hard-coding a recommendation for one tool. Rejected because the course must stay tool-neutral (NFR-007).

## R0-05 — Git and Python install guidance per platform

- **Decision**: written-out steps (C-006 allows this) with one recommended path and one fallback per OS:
  - **Windows** (x64 and ARM64): Git and Python via `winget` (`Git.Git`, `Python.Python.3.12` or newer), with the python.org installer as the fallback ("Add python.exe to PATH" checked). Name the Microsoft Store `python` alias trap and how to disable it under App execution aliases. Use `py --version` as the reliable check.
  - **macOS** (Apple Silicon and Intel): Git via `xcode-select --install`. Python via the python.org universal installer, with Homebrew as the alternative for people who already use it. Verify with `python3 --version`.
  - **Linux**: Git and Python via the distro package manager (apt, dnf, pacman). Note that some LTS releases ship Python below 3.11, with the fallback of installing a newer version (for example via `uv python install`).
  - **ChromeOS**: turn on the Linux development environment, then follow the Linux (Debian) path. Note that managed Chromebooks may block it, which triggers the trainer-contact message.
  - **All**: `git config --global user.name` / `user.email`, then `git --version`.
- **Rationale**: these are the official or most common paths per platform as of 2026, and each ends in a version check (FR-012, FR-013).
- **Alternatives considered**: a single cross-platform installer (none covers Git + Python + every OS); conda (heavier than needed).

## R0-06 — Chip type handling

- **Decision**: ask for chip type on Windows, macOS and Linux, with options Intel/AMD, ARM and "not sure", each with a per-OS "how to check" hint (Windows: Settings → System → About; macOS: Apple menu → About This Mac; Linux: `uname -m`). Skip the question on ChromeOS and on tablet/phone. "Not sure" shows every chip-labelled block, each tagged with its chip.
- **Rationale**: most of the steps above are chip-independent. The chip matters only for a few download choices (Windows ARM64 installers, older macOS Intel notes). Asking keeps those few blocks precise without making everyone else read both.
- **Alternatives considered**: detecting the chip from the user agent. Rejected because it's unreliable (Apple Silicon reports as Intel in Safari) and it sends nothing anyway.

## R0-07 — Testing approach without a build

- **Decision**: `tests/index.html` loads the pure modules directly as ES modules and runs plain assertions through a ~40-line `runner.js`. It includes an exhaustive loop over every intake combination asserting: (a) no dead ends: Git, Python and tool blocks are shown, or early stop applies; (b) exactly one OS's install blocks are shown (SC-003). UI behaviour is verified manually via [quickstart.md](quickstart.md).
- **Rationale**: the logic that can silently go wrong across 5 dimensions is the tailoring. That's exactly what a combinatorial test catches and a human spot-check misses.
- **Alternatives considered**: Node + a test framework (adds a toolchain the project otherwise doesn't need); manual-only testing (cannot cover hundreds of combinations).

## R0-08 — Offline strategy

- **Decision**: precache the app shell and all content on install. Serve cache-first with a background refresh (stale-while-revalidate). On a cache miss, go to the network and store the response. Use a versioned cache name `skcp-v<N>`, bumped on each release.
- **Rationale**: it meets NFR-009, keeps the course fast, and recovers automatically if another app wipes the cache (R0-02).
- **Alternatives considered**: network-first (slower, and offline still needs a cache); no service worker (fails NFR-009).
