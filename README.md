# Spec Kitty Class Prep

A short, self-paced prep course for people attending a [Spec Kitty](https://github.com/spec-kitty/spec-kitty) class. Attendees answer five quick questions about their laptop and AI coding tool, and the course shows only the setup steps for their machine (Git, Python 3.11+, their AI tool), in this order: what Spec Kitty is, get set up, words you'll hear, and a ready check, plus an optional terminal primer. Questions and class details go through the class WhatsApp group; a stuck attendee can copy a one-line setup summary to post there. It's a static, no-build site: plain HTML, CSS and JavaScript modules, which works offline after the first visit and sends nothing anywhere. The full requirements are in the mission spec, `kitty-specs/spec-kitty-class-prep-track-01M5VY73/spec.md`.

## Run locally

From the repository root:

```bash
python -m http.server 8533
```

Then open <http://localhost:8533/>. Opening `index.html` straight from disk (`file://`) doesn't work, because ES modules and the service worker need an HTTP origin.

The automated tests are at <http://localhost:8533/tests/>. They should report **0 failures**. The page isn't linked from the course and isn't cached for offline use.

While you edit files locally, the service worker serves the previous version first and fetches the new one in the background, so you may need to reload twice to see a change. In Chrome DevTools, Application → Service workers → "Update on reload" avoids this.

## Before sharing the link

1. Make sure everyone is in the class WhatsApp group: the course sends people there for the date, time, place and any questions (`groupNote` in `js/data/welcome.js`).
2. Re-check the tool list in `js/data/tools.js` (names, cost labels, official links) and set `checkedOn` to today's date.
3. Bump `CACHE` in `service-worker.js` (`skcp-v1` → `skcp-v2`, and so on) so returning attendees get the new content.

## Deploy to GitHub Pages

1. Create a **public** repository on GitHub and push the `main` branch to it. Without the GitHub CLI, a plain `git push` works.
2. In the repository, go to Settings → Pages, choose "Deploy from a branch", then branch `main` and folder `/ (root)`.
3. After a minute or two the course is live at `https://<user>.github.io/<repo>/`.

Every URL in the app is relative, so it works under that sub-path without changes.

## Updating content

All course content lives in `js/data/`:

| File | What it holds |
|------|---------------|
| `js/data/welcome.js` | Welcome page text, agenda and the WhatsApp group note |
| `js/data/intake.js` | The five intake questions and their answer labels |
| `js/data/tools.js` | Supported AI coding tools, cost labels and links; `recommended` tools are shown first, and `ide` says whether a tool is a VS Code extension, its own editor, or runs in the terminal |
| `js/data/modules/*.js` | The five modules (terminal, spec-driven, setup, words, ready) |
| `js/data/setup/workflow-blocks.js` | The IDE-first setup flow: install VS Code, make the workspace, the per-OS prompt the AI tool runs, and the script option |
| `js/data/setup/*.js` (other files) | Per-tool blocks, support blocks, and the hand-typed Git/Python steps shown under "Do it by hand instead" |
| `scripts/setup-windows.ps1`, `scripts/setup-unix.sh` | The one-line setup scripts the setup page links to. They install what's missing, ask for a Git name and email, and create `Documents/spec-kitty-class`. Keep them in step with the prompt in `workflow-blocks.js`. They aren't cached for offline use, because they're downloaded by a terminal command. |

After any change, open the test page and check for 0 failures. The coverage test checks every intake combination, so a missing install or verify step for some platform shows up there.

When you add a new file that the course loads, also add it to `PRECACHE` in `service-worker.js`, or offline mode will break for that file, and bump `CACHE`.

## Offline and the shared github.io origin

Every GitHub Pages project of one user shares the origin `https://<user>.github.io`, so apps there can see each other's storage and caches. This course:

- caches only under names starting with `skcp-`, and on update deletes only older `skcp-` caches;
- refills its cache from the network if another app's service worker deletes it, so the worst case is losing offline mode until the next online visit.

## Icons

`icons/icon.svg` is the source: a 2×2 bento grid with one blue-to-purple cell carrying a check mark, on black, kept inside the maskable safe zone. `icons/icon-192.png` and `icons/icon-512.png` were rasterised from the same geometry with Pillow (drawn at 4× size, then downscaled with LANCZOS). If you change the SVG, regenerate both PNGs.

## Privacy

Nothing leaves the attendee's browser: there are no analytics, fonts or other third-party requests. Answers and progress are stored under one `localStorage` key, `skcp:v1`. "Start fresh" in the menu clears only that key and leaves other apps' data alone.
