# Quickstart: run and verify the prep course

## Run locally

Any static server from the repository root works, for example:

```bash
python -m http.server 8533
```

Open `http://localhost:8533/`. Opening `index.html` through `file://` does **not** work, because ES modules and the service worker need an HTTP origin. The browser preview uses `.claude/launch.json`, which runs the same command.

## Automated checks

Open `http://localhost:8533/tests/` and confirm that the page reports **0 failures**. This covers the tailoring rules, the exhaustive intake-combination coverage (NFR-006, SC-003), the summary format, and storage isolation with foreign keys (NFR-004).

## Manual verification script

Use a fresh browser profile, or run "Start fresh" first.

1. **Welcome (FR-001)**: the first visit shows what Spec Kitty is (with a working link to its repository), the six agenda items, what to bring, and that Spec Kitty is installed in the session. "Start" opens the intake.
2. **Intake (FR-002, FR-003, NFR-002)**: there are five questions at most. Chip is asked for Windows and skipped for ChromeOS. "How do I check?" hints are present. Finishing takes under 2 minutes.
3. **Tailoring, four spot-checks (FR-004, SC-003)**: open the setup module after each intake below and confirm only that OS's and tool's steps appear, each with a verify step:
   - Windows · ARM · personal · Claude Code
   - macOS · Apple Silicon · personal · Cursor
   - Linux · x64 · work-can-install · undecided (the tool list with cost labels appears, and picking one updates the answers)
   - ChromeOS · personal · Gemini (the "turn on Linux" step comes first)
4. **Change answers (FR-005)**: switch the OS from Windows to macOS via "Change my answers", then return to the setup module and confirm the content changed without a reload.
5. **Early stop (FR-006)**: an intake with "tablet or phone" shows the trainer-contact message right after the intake. Repeat with "work, can't install". In both cases the suggested next step is a vocabulary module, not setup.
5b. **Route guard and "Other" tool**: after "Start fresh", open `#/m/setup` directly and confirm it redirects to the intake. Then complete the intake with tool "Other" and confirm the setup module shows the "check with the trainer" block.
6. **Suggestions (FR-021, FR-022)**: `agents-daily` gets the ready check suggested. `terminal-new` gets the terminal primer suggested, showing that OS's content only. Every module is still openable in both cases.
7. **Exercises (FR-009, FR-011)**: a wrong match shows an explanation, and every judge statement shows its "why". Each module is marked done after its exercise.
8. **Ready check and summary (FR-019, FR-020)**: tick all visible items, then press "Copy my setup summary" and paste it somewhere. It should be one line matching the answers. In a browser that blocks clipboard access, the text is selected for manual copying instead.
9. **Persistence (FR-024)**: reload the page and close and reopen the browser. Answers and progress are still there.
10. **Isolation (FR-023, NFR-003, NFR-004, SC-005)**:
    - In DevTools → Application → Local Storage, add a dummy key `ccol:progress:v1` = `keep-me`.
    - Run "Start fresh". The intake opens, `skcp:v1` is gone, and `keep-me` is unchanged.
    - In a second browser, complete the intake differently and confirm neither browser shows the other's answers.
11. **Storage unavailable**: in a private window that blocks storage, the course still works, and a one-line notice says answers won't be remembered.
12. **Offline (NFR-009)**: after one full visit, switch DevTools → Network to Offline and reload. Every page still opens. In Application → Cache Storage, only `skcp-` caches belong to this app.
13. **Phone width (NFR-008)**: at 360 px wide, no page scrolls horizontally, including the intake, the setup commands (code blocks scroll on their own) and the summary.
14. **First view speed (NFR-010)**: in DevTools → Network, pick the "Fast 4G" throttle with the cache disabled, and reload `#/welcome` in a fresh profile. The welcome heading and intro are readable within 2 seconds (check the Performance panel or the load timing). Record the time.
15. **Nothing sent (NFR-005)**: with DevTools → Network open and "Preserve log" on, complete the intake, a module exercise and the ready check, then copy the summary. Every request is a same-origin GET for a static file (HTML, CSS, JS, JSON, icons). No request has a query string, body or header containing an answer value, and there are no POST requests and no other hosts.
16. **Timing (NFR-001, SC-004)**: a first-time run through the four main modules, excluding downloads, takes 35 minutes or less. An `agents-daily` run from opening to a completed ready check takes under 10 minutes.

## Deploy

Push `main` to the GitHub repository. Under Settings → Pages, set the source to "Deploy from a branch", branch `main`, folder `/ (root)`. The course is then served at `https://<user>.github.io/<repo>/`. On every release, bump the cache name in `service-worker.js`.
