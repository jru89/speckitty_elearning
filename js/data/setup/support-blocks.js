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
    when: { device: ["work-can-install"] },
    body: "<p>Work laptops sometimes block AI tools or sit behind a company proxy. If an install or log-in fails, try a personal device, or ask IT, and tell your trainer before the session.</p>",
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
      "<p>Either way, tell your trainer before the session.</p>",
    ].join("\n"),
  },
  {
    id: "mobile",
    topic: "work-device",
    kind: "warning",
    heading: "You'll need a laptop or desktop",
    when: { os: ["mobile"] },
    body: "<p>These steps need a laptop or desktop. Read along here, and tell your trainer before the session.</p>",
  },

  // Agent check (T028)
  {
    id: "agent-check-steps",
    topic: "agent-check",
    kind: "check",
    heading: "Check that your AI coding tool works",
    body: [
      "<ol>",
      "<li>Make an empty folder called <code>spec-kitty-test</code>.</li>",
      "<li>Open it in your AI coding tool (or open a terminal there and start the tool).</li>",
      "<li>Ask: \"List the files in this folder and create a file called hello.txt that says hi.\"</li>",
      "<li><strong>Success looks like</strong>: the tool asks permission (or just does it), tells you the folder was empty, and <code>hello.txt</code> appears in the folder.</li>",
      "</ol>",
    ].join("\n"),
  },
  {
    id: "agent-check-trouble",
    topic: "agent-check",
    kind: "note",
    heading: "If the check fails",
    body: [
      "<ul>",
      "<li>Not logged in: log in to your tool.</li>",
      "<li>The tool can't see the folder: open the folder itself, not its parent.</li>",
      "<li>An error about your plan or quota: check your account.</li>",
      "<li>Anything else: copy the error and send it to your trainer before the session.</li>",
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
    heading: "Optional: save time in the session",
    when: { os: DESKTOP_OS },
    body: [
      "<p>Spec Kitty installs with a Python tool called pipx (or uv). Installing it now saves a few minutes in the session. Skip this if you're short on time.</p>",
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
