# WP07 review feedback (cycle 1)

Verdict: **changes requested**. One install command is wrong and one fallback is incomplete. The rest is good. Coverage over os × chip × device × tool passes, ids are unique, all `when` values are in ENUMS, `chipLabel` appears only on chip-conditioned blocks, the composer order matches contracts/content-schema.md, and the terminal primer meets the spec.

## Issue 1 (high): the Homebrew Python command doesn't put `python3` on PATH

File: `js/data/setup/platform-blocks.js`, block `python-install-macos`, `cmd("brew install python@3.14")`.

Homebrew's `python3` alias now points to `python@3.15` (homebrew-core `Aliases/python3` → `Formula/p/python@3.15.rb`). That makes `python@3.14` an **altinstall**. According to the formula (`altinstall?` → the `python3` symlink goes only into `libexec/bin`) and its caveats on https://formulae.brew.sh/formula/python@3.14, it puts only `python3.14` in `$HOMEBREW_PREFIX/bin`. An attendee who follows this step will still get Apple's old `/usr/bin/python3` from the `python3 --version` check. The "Still seeing an older Python?" note then tells them to rerun the python.org installer, which doesn't help someone who used Homebrew.

Fix: use the unversioned alias, which always installs the current default and links `python3`, so it won't go stale:

```bash
brew install python3
```

(The formula caveat says the same thing: "always want Homebrew's `python3` in your PATH: brew install python3".) Optionally, add a sentence to `python-old-macos` for Homebrew users: open a new Terminal window. If `python3` is still old, run `brew link python3` or ask the trainer.

## Issue 2 (medium): the uv fallback leaves attendees with a Python that the class tools won't use

Block `python-old-linux`: after `uv python install 3.12`, `python3 --version` still shows the old version. Only `python3.12` is new (uv installs a versioned executable only, in `~/.local/bin`). That causes two problems for a beginner:

1. The verify check just above says success is `python3 --version` ≥ 3.11, so the attendee will think they failed the check even after the fallback.
2. The head-start step (`sudo apt install pipx`) gives a pipx that runs on the system Python. A plain `pipx install` of Spec Kitty in class will then use the old Python and fail, unless the attendee passes `--python python3.12`.

Fix (keep it short), for example after the `python3.12 --version` check:

- "`python3 --version` will still show the old version. That's expected: use `python3.12` from now on."
- "If `python3.12` isn't found, open a new terminal (uv puts it in `~/.local/bin`)."
- "Tell your trainer you're using this Python, so Spec Kitty gets installed with it (for example, `pipx install --python python3.12 …`)."

Alternatively, point the verify block at this case: "If you used the uv fallback, check with `python3.12 --version` instead."

## Issue 3 (low, optional): `xcode-select --install` when the tools are already installed

If the Command Line Tools are already installed, the command prints an error ("command line tools are already installed"). Add half a sentence: "If it says they're already installed, that's fine: go on to the next step."

## Verified as correct (no change needed)

- Git: `winget install --id Git.Git -e --source winget`, the "Git for Windows/x64 Setup" and "Git for Windows/ARM64 Setup" names, `xcode-select --install`, `brew install git`, apt/dnf/pacman (https://git-scm.com/install/windows, /mac, /linux).
- Python on Windows: `Python.Python.3.14` exists in winget-pkgs (3.14.0 to 3.14.7). The python.org fallback still offers "Windows installer (64-bit)/(ARM64)" for 3.15.2. The Store-alias steps match Microsoft Learn ("Manage app execution aliases", "App Installer" entries). `py --version` works as the check.
- Python on macOS: the python.org universal2 installer puts `python3` on PATH and Apple's `/usr/bin/python3` is old (docs.python.org/3/using/mac.html).
- ChromeOS: the steps and the "10 minutes or more" match support.google.com/chromebook/answer/9145439. The managed-device caveat is present.
