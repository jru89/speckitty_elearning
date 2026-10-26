// Optional "Terminal in 5 minutes" primer (FR-022). Per-OS blocks only where the instructions differ.

const cmd = (command) => `<pre><code>${command}</code></pre>`;

export default {
  id: "terminal",
  title: "Terminal in 5 minutes",
  summary: "Just enough terminal to follow the setup steps.",
  minutes: 5,
  optional: true,
  blocks: [
    {
      id: "terminal-what",
      kind: "note",
      body: "<p>A terminal is a window where you type commands instead of clicking. The setup steps give you each command to copy, so you only need the basics below.</p>",
    },

    // 1. Open a terminal
    {
      id: "terminal-open-windows",
      kind: "step",
      heading: "Open a terminal",
      when: { os: ["windows"] },
      body: "<p>Open Start, type <strong>Terminal</strong> and open it. If it isn't there, open <strong>PowerShell</strong> instead.</p>",
    },
    {
      id: "terminal-open-macos",
      kind: "step",
      heading: "Open a terminal",
      when: { os: ["macos"] },
      body: "<p>Press <kbd>Cmd</kbd>+<kbd>Space</kbd>, type <strong>Terminal</strong> and press Enter.</p>",
    },
    {
      id: "terminal-open-linux",
      kind: "step",
      heading: "Open a terminal",
      when: { os: ["linux"] },
      body: "<p>Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> on most distributions, or find <strong>Terminal</strong> in your app menu.</p>",
    },
    {
      id: "terminal-open-chromeos",
      kind: "step",
      heading: "Open a terminal",
      when: { os: ["chromeos"] },
      body: "<p>Open the <strong>Terminal</strong> app from your launcher. It appears after you turn on Linux (see the setup module).</p>",
    },

    // 2. Where am I, and what's here?
    {
      id: "terminal-where-windows",
      kind: "step",
      heading: "Where am I, and what's here?",
      when: { os: ["windows"] },
      body: [
        "<p>Show the folder you're in:</p>",
        cmd("pwd"),
        "<p>List what's in it:</p>",
        cmd("dir"),
      ].join("\n"),
    },
    {
      id: "terminal-where-unix",
      kind: "step",
      heading: "Where am I, and what's here?",
      when: { os: ["macos", "linux", "chromeos"] },
      body: [
        "<p>Show the folder you're in:</p>",
        cmd("pwd"),
        "<p>List what's in it:</p>",
        cmd("ls"),
      ].join("\n"),
    },

    // 3. Move into a folder
    {
      id: "terminal-cd",
      kind: "step",
      heading: "Move into a folder",
      body: [
        "<p>Go into a folder:</p>",
        cmd("cd Documents"),
        "<p>Go back up one level:</p>",
        cmd("cd .."),
      ].join("\n"),
    },

    // 4. Run a command
    {
      id: "terminal-run-windows",
      kind: "step",
      heading: "Run a command",
      when: { os: ["windows"] },
      body: "<p>Paste the command with <kbd>Ctrl</kbd>+<kbd>V</kbd> (or right-click), press Enter, and wait until the prompt comes back before typing the next one.</p>",
    },
    {
      id: "terminal-run-macos",
      kind: "step",
      heading: "Run a command",
      when: { os: ["macos"] },
      body: "<p>Paste the command with <kbd>Cmd</kbd>+<kbd>V</kbd>, press Enter, and wait until the prompt comes back before typing the next one.</p>",
    },
    {
      id: "terminal-run-linux",
      kind: "step",
      heading: "Run a command",
      when: { os: ["linux", "chromeos"] },
      body: "<p>Paste the command with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>, press Enter, and wait until the prompt comes back before typing the next one. Commands starting with <code>sudo</code> ask for your password; nothing shows while you type it, which is normal.</p>",
    },

    // 5. Reading an error
    {
      id: "terminal-errors",
      kind: "note",
      heading: "Reading an error",
      body: "<p>Read the last few lines: they usually say what went wrong. \"Command not found\" (or \"not recognized\") right after an install usually means: close the terminal, open a new one and try again.</p>",
    },

    // 6. Stop something
    {
      id: "terminal-stop",
      kind: "note",
      heading: "Stop something",
      body: "<p>Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop a command that's still running. This works on every system, including Mac.</p>",
    },
  ],
  exercise: null,
};
