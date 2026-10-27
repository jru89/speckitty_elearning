// Support setup blocks: work-device guidance (FR-017), agent check (FR-016, NFR-007)
// and the optional pipx head start (FR-018). Shape: data-model.md "Content block".
// js/data/modules/setup.js shows work-device blocks first, agent-check and head-start last.
// pipx commands checked against https://pipx.pypa.io/stable/how-to/install-pipx.html on 2026-10-26.

const DESKTOP_OS = ["windows", "macos", "linux", "chromeos"];

export const supportBlocks = [
  // Work device (T029)
  {
    id: "work-can-install",
    topic: "work-device",
    kind: "note",
    heading: "Using a work laptop",
    when: { device: ["work-can-install", "work-unsure"] },
    body: "<p>Work laptops sometimes block AI tools or sit behind a company proxy. If an install or log-in fails, try a personal device, or ask IT, and say so in the WhatsApp group before the session.</p>",
  },
  {
    id: "work-unsure",
    topic: "work-device",
    kind: "note",
    heading: "Not sure if you may install software?",
    when: { device: ["work-unsure"] },
    body: "<p>Just try the first step. If your laptop asks for an administrator password you don't have, or says installing is blocked, stop there: ask IT, or bring a personal laptop, and say so in the WhatsApp group before the session.</p>",
  },
  {
    id: "work-locked",
    topic: "work-device",
    kind: "warning",
    heading: "Your work laptop is locked down",
    when: { device: ["work-locked"] },
    body: [
      "<p>You can't install software on this laptop yourself. Ask IT to install:</p>",
      "<ul>",
      "<li>Git</li>",
      "<li>Python 3.11 or newer</li>",
      "<li>the AI coding tool you'll use in the class</li>",
      "</ul>",
      "<p>If IT can't do that in time, bring a personal laptop instead.</p>",
      "<p>Either way, say so in the WhatsApp group before the session.</p>",
    ].join("\n"),
  },
  {
    id: "mobile",
    topic: "work-device",
    kind: "warning",
    heading: "You'll need a laptop or desktop",
    when: { os: ["mobile"] },
    body: "<p>These steps need a laptop or desktop. Read along here, and say so in the WhatsApp group before the session.</p>",
  },

  // Agent check: the setup prompt (workflow-blocks.js) is the check; this is the help when it fails.
  {
    id: "agent-check-trouble",
    topic: "agent-check",
    kind: "note",
    heading: "If the check fails",
    body: [
      "<ul>",
      "<li>Not signed in: sign in to your tool.</li>",
      "<li>The tool can't see the folder: open the workspace folder itself (File → Open Folder…), not the folder above it.</li>",
      "<li>It can't install something: run the script instead, or follow “Do it by hand instead” below.</li>",
      "<li>An error about your plan or quota: check your account.</li>",
      "<li>Anything else: copy the error and post it in the WhatsApp group before the session.</li>",
      "</ul>",
    ].join("\n"),
  },
  {
    id: "agent-check-undecided",
    topic: "agent-check",
    kind: "note",
    when: { tool: ["undecided"] },
    body: "<p>Pick a tool above first, then come back to this check.</p>",
  },

  // Optional pipx head start (T030)
  {
    id: "head-start-intro",
    topic: "head-start",
    kind: "note",
    heading: "pipx",
    when: { os: DESKTOP_OS },
    body: [
      "<p>Spec Kitty installs with a small Python tool called pipx (or uv). The setup prompt and the script already install it; do this only if you're setting up by hand.</p>",
      "<p>Prefer uv? See its <a href=\"https://docs.astral.sh/uv/\" target=\"_blank\" rel=\"noopener\">official docs</a> instead.</p>",
    ].join("\n"),
  },
  {
    id: "head-start-windows",
    topic: "head-start",
    kind: "note",
    when: { os: ["windows"] },
    body: [
      "<p>In a terminal, run:</p>",
      "<pre><code>py -m pip install --user pipx</code></pre>",
      "<pre><code>py -m pipx ensurepath</code></pre>",
      "<p>Open a new terminal afterwards.</p>",
    ].join("\n"),
  },
  {
    id: "head-start-macos",
    topic: "head-start",
    kind: "note",
    when: { os: ["macos"] },
    body: [
      "<p>If you use Homebrew, run:</p>",
      "<pre><code>brew install pipx</code></pre>",
      "<pre><code>pipx ensurepath</code></pre>",
      "<p>Otherwise, run:</p>",
      "<pre><code>python3 -m pip install --user pipx</code></pre>",
      "<pre><code>python3 -m pipx ensurepath</code></pre>",
      "<p>Open a new terminal afterwards.</p>",
    ].join("\n"),
  },
  {
    id: "head-start-linux",
    topic: "head-start",
    kind: "note",
    when: { os: ["linux", "chromeos"] },
    body: [
      "<p>On Debian, Ubuntu or ChromeOS Linux, run:</p>",
      "<pre><code>sudo apt update</code></pre>",
      "<pre><code>sudo apt install pipx</code></pre>",
      "<p>On Fedora, run this instead:</p>" +
      "<pre><code>sudo dnf install pipx</code></pre>" +
      "<p>On other distributions, install your distribution's pipx package.</p>",
      "<p>Then run:</p>",
      "<pre><code>pipx ensurepath</code></pre>",
      "<p>Open a new terminal afterwards.</p>",
    ].join("\n"),
  },
  {
    id: "head-start-verify",
    topic: "head-start",
    kind: "note",
    when: { os: DESKTOP_OS },
    body: [
      "<p>Check that it worked:</p>",
      "<pre><code>pipx --version</code></pre>",
      "<p>You should see a version number.</p>",
    ].join("\n"),
  },
];
