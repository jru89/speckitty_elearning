// Tool setup blocks (FR-014, FR-015, C-006, C-007). Shape: data-model.md "Content block".
// Generated from tools.js: one topic "tool" block per ENUMS.tool value (tailoring contract rules 1 and 3).
// Link, don't copy (C-006): install steps live on each tool's official page, not here.
// IDE first: the wording depends on tools.js `ide` (an extension in VS Code, its own editor, or the editor's terminal).

import { tools } from "../tools.js";

const DESKTOP_OS = ["windows", "macos", "linux", "chromeos"];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const guide = (t) =>
  `<a href="${escapeHtml(t.installUrl)}" target="_blank" rel="noopener">${escapeHtml(t.name)} install guide</a>`;

function heading(t) {
  if (t.ide === "own") return `Install ${t.name}`;
  if (t.ide === "extension") return `Add ${t.name} to VS Code`;
  return `Add ${t.name}`;
}

function toolBody(t) {
  const lines = [];
  if (t.ide === "own") {
    lines.push(`<p>${escapeHtml(t.name)} is your editor and your AI tool in one, so you don't need VS Code. Download and install it from the ${guide(t)}.</p>`);
  } else if (t.ide === "extension") {
    lines.push(
      `<p>In VS Code, open <strong>Extensions</strong> (the four-squares icon on the left, or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>; <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> on a Mac). Search for <strong>${escapeHtml(t.extensionName || t.name)}</strong> and select <strong>Install</strong>. Stuck? See the ${guide(t)}.</p>`,
    );
  } else {
    lines.push(`<p>${escapeHtml(t.name)} runs in the terminal inside VS Code. Follow the ${guide(t)}. In VS Code, open a terminal with <strong>Terminal → New Terminal</strong> to run its commands.</p>`);
  }
  lines.push(`<p>Then sign in once, so it's ready on the day.</p>`);
  lines.push(`<p class="caption"><strong>Cost:</strong> ${escapeHtml(t.costNote)}</p>`);
  if (t.demo) lines.push(`<p class="caption">This is the tool the trainer demos with.</p>`);
  return lines.join("\n");
}

export const toolBlocks = [
  {
    // Claude Code on Windows uses Git for Windows to run commands, so Git has to come first.
    id: "tool-claude-code-windows-git",
    topic: "tool",
    kind: "warning",
    heading: "On Windows, install Git first",
    when: { tool: ["claude-code"], os: ["windows"] },
    body: [
      "<p>Claude Code on Windows needs Git for Windows before it can run. Install it first: open <strong>PowerShell</strong> (Start → type PowerShell) and paste:</p>",
      "<pre><code>winget install --id Git.Git -e --source winget</code></pre>",
      "<p>Or download it from <a href=\"https://git-scm.com/install/windows\" target=\"_blank\" rel=\"noopener\">git-scm.com</a>. Then restart VS Code.</p>",
    ].join("\n"),
  },
  ...tools.map((t) => ({
    id: `tool-${t.id}`,
    topic: "tool",
    kind: "step",
    heading: heading(t),
    when: { tool: [t.id] },
    body: toolBody(t),
  })),
  {
    id: "tool-undecided-intro",
    topic: "intro",
    kind: "note",
    heading: "Not sure which tool to use?",
    when: { tool: ["undecided"] },
    body: [
      "<p>Any of these works with Spec Kitty. Three good starting points:</p>",
      "<ul>",
      "<li><strong>Already pay for or use ChatGPT?</strong> Pick <strong>Codex</strong>: it's included in your ChatGPT plan, even the free one.</li>",
      "<li><strong>Want exactly what the trainer shows?</strong> Pick <strong>Claude Code</strong>. It needs a paid Claude plan.</li>",
      "<li><strong>Want free and simple?</strong> Pick <strong>GitHub Copilot</strong> (built into VS Code) or <strong>Cursor</strong>.</li>",
      "</ul>",
      "<p>Commands look slightly different per tool, but you'll follow the same steps in the session.</p>",
    ].join("\n"),
  },
  {
    id: "tool-undecided",
    topic: "tool",
    kind: "tool-chooser",
    heading: "Pick an AI coding tool",
    when: { tool: ["undecided"] },
  },
  {
    id: "tool-other",
    topic: "tool",
    kind: "note",
    heading: "Using another tool",
    when: { tool: ["other"] },
    body: "<p>Spec Kitty supports many AI coding tools. Check with your trainer before the session that yours is one of them, and install it using its own guide.</p>",
  },
  {
    id: "tool-terminal-hint",
    topic: "tool",
    kind: "note",
    heading: "Starting a terminal tool",
    when: { os: DESKTOP_OS, tool: tools.filter((t) => t.ide === "terminal").map((t) => t.id) },
    body: "<p>Each time you use it: open your workspace folder in VS Code, choose <strong>Terminal → New Terminal</strong>, and start the tool with the command from its install guide. The terminal opens in your workspace folder automatically.</p>",
  },
];
