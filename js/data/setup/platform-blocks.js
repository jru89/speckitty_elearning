// Platform setup blocks: Git (FR-012) and Python 3.11+ (FR-013) per OS and chip (research R0-05, R0-06).
// Shape: data-model.md "Content block". Order: ChromeOS Linux step, then Git, then Python.
// js/data/modules/setup.js places these after the work-device blocks.
//
// Commands checked on 2026-10-26 against:
//   Git:     https://git-scm.com/install/windows, https://git-scm.com/install/mac,
//            https://git-scm.com/install/linux,
//            https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
//   Python:  https://www.python.org/downloads/windows/, https://www.python.org/downloads/macos/,
//            https://docs.python.org/3/using/mac.html (universal2 installer, Apple's older python3),
//            https://learn.microsoft.com/en-us/windows/python/beginners (winget id, Store alias),
//            winget id Python.Python.3.14 (microsoft/winget-pkgs manifests/p/Python/Python/3/14, 3.14.7,
//            x64 and arm64 installers), https://formulae.brew.sh/formula/python@3.14 (caveat: "brew install python3" for python3 on PATH),
//            https://docs.astral.sh/uv/guides/install-python/
//   ChromeOS: https://support.google.com/chromebook/answer/9145439

const DESKTOP_OS = ["windows", "macos", "linux", "chromeos"];

const cmd = (command) => `<pre><code>${command}</code></pre>`;

export const platformBlocks = [
  // ChromeOS: Linux has to be on before anything else (spec Edge Cases).
  {
    id: "chromeos-linux",
    topic: "intro",
    kind: "step",
    heading: "Turn on Linux on your Chromebook",
    when: { os: ["chromeos"] },
    body: [
      "<p>Git and Python run in the Chromebook's Linux environment. Turn it on first:</p>",
      "<ol>",
      "<li>Select the time in the bottom-right corner and open <strong>Settings</strong>.</li>",
      "<li>Go to <strong>About ChromeOS → Developers</strong>.</li>",
      "<li>Next to <strong>Linux development environment</strong>, select <strong>Set up</strong> and follow the steps. This can take 10 minutes or more.</li>",
      "</ol>",
      "<p>When it's done, a <strong>Terminal</strong> window opens. Run every command below in that Linux terminal.</p>",
      "<p>If the option is missing or blocked (a school or work Chromebook), say so in the WhatsApp group before the session.</p>",
    ].join("\n"),
  },

  // Git install (T031)
  {
    id: "git-install-windows",
    topic: "git",
    kind: "step",
    heading: "Install Git",
    when: { os: ["windows"] },
    body: [
      "<p>In a terminal, run:</p>",
      cmd("winget install --id Git.Git -e --source winget"),
      "<p>Accept the prompts. Then close and reopen your terminal.</p>",
    ].join("\n"),
  },
  {
    id: "git-install-windows-fallback-x64",
    topic: "git",
    kind: "note",
    chipLabel: "Intel/AMD",
    when: { os: ["windows"], chip: ["x64"] },
    body: "<p>No <code>winget</code>? Download <strong>Git for Windows/x64 Setup</strong> from <a href=\"https://git-scm.com/install/windows\" target=\"_blank\" rel=\"noopener\">git-scm.com</a> and keep the default options. Then close and reopen your terminal.</p>",
  },
  {
    id: "git-install-windows-fallback-arm",
    topic: "git",
    kind: "note",
    chipLabel: "ARM",
    when: { os: ["windows"], chip: ["arm"] },
    body: "<p>No <code>winget</code>? Download <strong>Git for Windows/ARM64 Setup</strong> from <a href=\"https://git-scm.com/install/windows\" target=\"_blank\" rel=\"noopener\">git-scm.com</a> and keep the default options. Then close and reopen your terminal.</p>",
  },
  {
    id: "git-install-macos",
    topic: "git",
    kind: "step",
    heading: "Install Git",
    when: { os: ["macos"] },
    body: [
      "<p>In Terminal, run:</p>",
      cmd("xcode-select --install"),
      "<p>This installs Apple's Command Line Tools, which include Git. A dialog appears: select <strong>Install</strong>. The download can take a while. If it says the tools are already installed, that's fine: go on to the next step.</p>",
      "<p>If you already use Homebrew, you can run this instead:</p>",
      cmd("brew install git"),
    ].join("\n"),
  },
  {
    id: "git-install-linux",
    topic: "git",
    kind: "step",
    heading: "Install Git",
    when: { os: ["linux"] },
    body: [
      "<p>Run the commands for your distribution. Not sure which you have? It's most likely Ubuntu.</p>",
      "<p>Debian or Ubuntu:</p>",
      cmd("sudo apt update"),
      cmd("sudo apt install git"),
      "<p>Fedora:</p>",
      cmd("sudo dnf install git"),
      "<p>Arch:</p>",
      cmd("sudo pacman -S git"),
    ].join("\n"),
  },
  {
    id: "git-install-chromeos",
    topic: "git",
    kind: "step",
    heading: "Install Git",
    when: { os: ["chromeos"] },
    body: [
      "<p>In the Linux terminal, run:</p>",
      cmd("sudo apt update"),
      cmd("sudo apt install git"),
    ].join("\n"),
  },

  // Git identity and check, every desktop OS
  {
    id: "git-identity",
    topic: "git",
    kind: "step",
    heading: "Tell Git who you are",
    when: { os: DESKTOP_OS },
    body: [
      "<p>Git saves your name and an email with every change you save (a <em>commit</em>). Any email works. It stays on your computer unless you later publish your work, for example on GitHub. Replace the examples with your own:</p>",
      cmd("git config --global user.name \"Your Name\""),
      cmd("git config --global user.email \"you@example.com\""),
    ].join("\n"),
  },
  {
    id: "git-verify",
    topic: "git",
    kind: "check",
    heading: "Check Git",
    when: { os: DESKTOP_OS },
    body: [
      "<p>Run:</p>",
      cmd("git --version"),
      "<p><strong>Success looks like</strong>: <code>git version 2.</code> followed by more numbers. If you see \"command not found\" or \"not recognized\", open a new terminal and try again.</p>",
    ].join("\n"),
  },

  // Python install (T032)
  {
    id: "python-install-windows",
    topic: "python",
    kind: "step",
    heading: "Install Python",
    when: { os: ["windows"] },
    body: [
      "<p>In a terminal, run:</p>",
      cmd("winget install --id Python.Python.3.14 -e --source winget"),
      "<p>Then close and reopen your terminal.</p>",
    ].join("\n"),
  },
  {
    id: "python-install-windows-fallback-x64",
    topic: "python",
    kind: "note",
    chipLabel: "Intel/AMD",
    when: { os: ["windows"], chip: ["x64"] },
    body: "<p>No <code>winget</code>? On <a href=\"https://www.python.org/downloads/windows/\" target=\"_blank\" rel=\"noopener\">python.org</a>, pick the newest Python 3 release and download its <strong>Windows installer (64-bit)</strong>. On the first screen, tick <strong>Add python.exe to PATH</strong>, then select Install Now.</p>",
  },
  {
    id: "python-install-windows-fallback-arm",
    topic: "python",
    kind: "note",
    chipLabel: "ARM",
    when: { os: ["windows"], chip: ["arm"] },
    body: "<p>No <code>winget</code>? On <a href=\"https://www.python.org/downloads/windows/\" target=\"_blank\" rel=\"noopener\">python.org</a>, pick the newest Python 3 release and download its <strong>Windows installer (ARM64)</strong>. On the first screen, tick <strong>Add python.exe to PATH</strong>, then select Install Now.</p>",
  },
  {
    id: "python-windows-store-alias",
    topic: "python",
    kind: "warning",
    heading: "Does \"python\" open the Microsoft Store?",
    when: { os: ["windows"] },
    body: [
      "<p>Windows has a shortcut that sends <code>python</code> to the Microsoft Store when Python isn't found. To turn it off:</p>",
      "<ol>",
      "<li>Open Start and search for <strong>Manage app execution aliases</strong> (in Settings under Apps → Advanced app settings → App execution aliases).</li>",
      "<li>Switch off the <strong>App Installer</strong> entries for <code>python.exe</code> and <code>python3.exe</code>.</li>",
      "</ol>",
      "<p>Or skip all that and use <code>py</code> instead of <code>python</code>.</p>",
    ].join("\n"),
  },
  {
    id: "python-install-macos",
    topic: "python",
    kind: "step",
    heading: "Install Python",
    when: { os: ["macos"] },
    body: [
      "<p>The <code>python3</code> that comes with Apple's tools is usually an older version, so install your own.</p>",
      "<p>Download the macOS installer for the newest Python 3 release from <a href=\"https://www.python.org/downloads/macos/\" target=\"_blank\" rel=\"noopener\">python.org</a> and run it. It works on Apple Silicon and Intel Macs.</p>",
      "<p>If you already use Homebrew, you can run this instead:</p>",
      cmd("brew install python3"),
      "<p>Then close and reopen Terminal.</p>",
    ].join("\n"),
  },
  {
    id: "python-install-linux",
    topic: "python",
    kind: "step",
    heading: "Install Python",
    when: { os: ["linux"] },
    body: [
      "<p>Most Linux distributions already include Python 3. Check below first. If <code>python3</code> is missing, install it.</p>",
      "<p>Debian or Ubuntu:</p>",
      cmd("sudo apt install python3"),
      "<p>Fedora:</p>",
      cmd("sudo dnf install python3"),
      "<p>Arch:</p>",
      cmd("sudo pacman -S python"),
    ].join("\n"),
  },
  {
    id: "python-install-chromeos",
    topic: "python",
    kind: "step",
    heading: "Install Python",
    when: { os: ["chromeos"] },
    body: [
      "<p>The Linux environment usually includes Python 3 already. If <code>python3</code> is missing, run this in the Linux terminal:</p>",
      cmd("sudo apt install python3"),
    ].join("\n"),
  },

  // Python check, one per OS group (the command differs)
  {
    id: "python-verify-windows",
    topic: "python",
    kind: "check",
    heading: "Check Python",
    when: { os: ["windows"] },
    body: [
      "<p>Run:</p>",
      cmd("py --version"),
      "<p><strong>Success looks like</strong>: <code>Python 3.11</code> or higher. A lower number means an old Python is installed: install the new one above, then open a new terminal.</p>",
    ].join("\n"),
  },
  {
    id: "python-verify-unix",
    topic: "python",
    kind: "check",
    heading: "Check Python",
    when: { os: ["macos", "linux", "chromeos"] },
    body: [
      "<p>Run:</p>",
      cmd("python3 --version"),
      "<p><strong>Success looks like</strong>: <code>Python 3.11</code> or higher. If you see a lower number, follow the note below.</p>",
    ].join("\n"),
  },
  {
    id: "python-old-macos",
    topic: "python",
    kind: "note",
    heading: "Still seeing an older Python?",
    when: { os: ["macos"] },
    body: "<p>You're probably still getting Apple's <code>python3</code>. Open a new Terminal window after installing and check again. If it's still old and you used the python.org installer, run it again with its default options. If you used Homebrew, ask in the WhatsApp group.</p>",
  },
  {
    id: "python-old-linux",
    topic: "python",
    kind: "note",
    heading: "Python older than 3.11?",
    when: { os: ["linux", "chromeos"] },
    body: [
      "<p>Some older releases ship an older Python. Install a newer one from your distribution if it offers one, or use uv (see <a href=\"https://docs.astral.sh/uv/getting-started/installation/\" target=\"_blank\" rel=\"noopener\">how to install uv</a>):</p>",
      cmd("uv python install 3.12"),
      "<p>Then check it with:</p>",
      cmd("python3.12 --version"),
      "<p><code>python3 --version</code> will still show the old version; that's expected.</p>",
      "<p>If <code>python3.12</code> isn't found, open a new terminal (uv puts it in <code>~/.local/bin</code>).</p>",
      "<p>Say so in the WhatsApp group, so Spec Kitty gets installed with <code>--python python3.12</code> in the session.</p>",
    ].join("\n"),
  },
];
