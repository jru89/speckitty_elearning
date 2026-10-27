// IDE-first setup flow: editor, class workspace, the agent prompt that installs the rest, and a script as plan B.
// Shape: data-model.md "Content block". js/data/modules/setup.js places these around the tool blocks.
// {{SITE}} in a body is replaced by the course's own address when it renders (module-view.js).

import { tools } from "../tools.js";

const DESKTOP_OS = ["windows", "macos", "linux", "chromeos"];
const VSCODE_TOOLS = [...tools.filter((t) => t.ide !== "own").map((t) => t.id), "other", "undecided"];

const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cmd = (command) => `<pre><code>${esc(command)}</code></pre>`;

// The prompt the attendee pastes into their AI tool. Plain words, asks before installing, ends with a check.
function setupPrompt({ osName, git, python, pythonCheck, pipx, sudoNote }) {
  return [
    "I'm getting ready for a Spec Kitty class and I'm new to this. Please set up this computer for me, one step at a time. Before each step, tell me in one plain sentence what you're about to do, and ask me before installing anything.",
    "",
    `My computer runs ${osName}. The folder that's open right now is my class workspace.`,
    "",
    `1. Check whether Git is installed (git --version). If it isn't, install it: ${git}`,
    `2. Check whether Python 3.11 or newer is installed (${pythonCheck}). If it isn't, install it: ${python}`,
    `3. Install pipx: ${pipx}`,
    "4. Ask me which name and email to use for Git, then set them with git config --global user.name and git config --global user.email.",
    "5. Turn this folder into a Git repository (git init), create a README.md that says \"My Spec Kitty class workspace\", and make a first commit.",
    "6. Finally, show me the versions of Git, Python and pipx, and tell me whether anything still needs fixing.",
    "",
    "If a program you just installed isn't found, tell me to close and reopen the terminal (or the editor), then carry on.",
    sudoNote || "",
  ]
    .filter((line, i, all) => !(line === "" && i === all.length - 1))
    .join("\n");
}

const PROMPTS = {
  windows: setupPrompt({
    osName: "Windows",
    git: "winget install --id Git.Git -e --source winget",
    python: "winget install --id Python.Python.3.14 -e --source winget",
    pythonCheck: "py --version",
    pipx: "py -m pip install --user pipx, then py -m pipx ensurepath",
  }),
  macos: setupPrompt({
    osName: "macOS",
    git: "xcode-select --install (or brew install git if Homebrew is installed)",
    python: "brew install python3 if Homebrew is installed; otherwise tell me to download the installer from python.org and wait while I do that",
    pythonCheck: "python3 --version",
    pipx: "brew install pipx if Homebrew is installed, otherwise python3 -m pip install --user pipx; then pipx ensurepath",
  }),
  linux: setupPrompt({
    osName: "Linux",
    git: "with my package manager, for example sudo apt install git",
    python: "with my package manager, for example sudo apt install python3",
    pythonCheck: "python3 --version",
    pipx: "with my package manager, for example sudo apt install pipx, then pipx ensurepath",
    sudoNote: "Commands that start with sudo ask for my password, which you can't type for me: give me those commands to run myself in the terminal.",
  }),
  chromeos: setupPrompt({
    osName: "ChromeOS, with the Linux development environment turned on (Debian)",
    git: "sudo apt update, then sudo apt install git",
    python: "sudo apt install python3",
    pythonCheck: "python3 --version",
    pipx: "sudo apt install pipx, then pipx ensurepath",
    sudoNote: "Commands that start with sudo ask for my password, which you can't type for me: give me those commands to run myself in the terminal.",
  }),
};

function promptBlock(os) {
  return {
    id: `agent-setup-${os}`,
    topic: "agent-check",
    kind: "step",
    heading: "Let your AI tool install the rest",
    when: { os: [os] },
    body: [
      "<p>Open your AI tool's chat in your workspace folder, paste the prompt below and follow along. It installs Git, Python and pipx (what Spec Kitty needs), and turns your folder into a Git repository. It asks before it installs anything.</p>",
      `<pre class="prompt"><code>${esc(PROMPTS[os])}</code></pre>`,
      "<p class=\"caption\">This takes 10 to 20 minutes, mostly waiting for downloads. It's also the check that your AI tool works.</p>",
    ].join("\n"),
  };
}

export const workflowBlocks = [
  {
    id: "editor-vscode",
    topic: "editor",
    kind: "step",
    heading: "Install VS Code",
    when: { os: DESKTOP_OS, tool: VSCODE_TOOLS },
    body: [
      "<p><strong>VS Code</strong> is a free editor: the window where you see your project's files and chat with your AI tool. You'll work in it during the class.</p>",
      "<p>Download it from <a href=\"https://code.visualstudio.com/download\" target=\"_blank\" rel=\"noopener\">code.visualstudio.com</a> and install it with the default options.</p>",
    ].join("\n"),
  },
  {
    id: "editor-vscode-chromeos",
    topic: "editor",
    kind: "note",
    when: { os: ["chromeos"], tool: VSCODE_TOOLS },
    body: "<p>On a Chromebook, pick the <strong>.deb</strong> download (x64, or Arm64 for ARM Chromebooks). Open it from the <strong>Files</strong> app and choose <strong>Install with Linux</strong>.</p>",
  },
];

export const workspaceBlocks = [
  {
    id: "workspace",
    topic: "workspace",
    kind: "step",
    heading: "Make your class workspace",
    when: { os: DESKTOP_OS },
    body: [
      "<ol>",
      "<li>In your <strong>Documents</strong> folder, create a new folder called <code>spec-kitty-class</code>.</li>",
      "<li>In your editor, choose <strong>File → Open Folder…</strong> and pick that folder.</li>",
      "<li>If it asks whether you trust the authors of the files, choose <strong>Yes</strong>: it's your own folder.</li>",
      "</ol>",
      "<p>Everything for the class happens in this folder. The next step turns it into a Git repository, so every change is saved with a history.</p>",
    ].join("\n"),
  },
];

export const agentSetupBlocks = [
  ...DESKTOP_OS.map(promptBlock),
  {
    id: "agent-setup-success",
    topic: "agent-check",
    kind: "check",
    heading: "Success looks like this",
    when: { os: DESKTOP_OS },
    body: [
      "<ul>",
      "<li>Your AI tool ends by showing a version number for Git, for Python (3.11 or higher) and for pipx.</li>",
      "<li>Your workspace folder now has a <code>README.md</code> file.</li>",
      "</ul>",
      "<p>That also proves your AI tool works: it read your folder, ran commands and created a file.</p>",
    ].join("\n"),
  },
];

export const scriptBlocks = [
  {
    id: "script-windows",
    topic: "script",
    kind: "note",
    heading: "Prefer a script?",
    when: { os: ["windows"] },
    body: [
      "<p>The script does the same as the prompt: it installs what's missing, asks for your name and email, and creates <code>Documents\\spec-kitty-class</code>. Open <strong>PowerShell</strong> (Start → type PowerShell) and paste:</p>",
      cmd("irm {{SITE}}scripts/setup-windows.ps1 | iex"),
      "<p class=\"caption\">Want to read it first? <a href=\"{{SITE}}scripts/setup-windows.ps1\" target=\"_blank\" rel=\"noopener\">View the script</a>.</p>",
    ].join("\n"),
  },
  {
    id: "script-unix",
    topic: "script",
    kind: "note",
    heading: "Prefer a script?",
    when: { os: ["macos", "linux", "chromeos"] },
    body: [
      "<p>The script does the same as the prompt: it installs what's missing, asks for your name and email, and creates <code>Documents/spec-kitty-class</code>. Open a terminal and paste:</p>",
      cmd("curl -fsSL {{SITE}}scripts/setup-unix.sh | bash"),
      "<p class=\"caption\">Want to read it first? <a href=\"{{SITE}}scripts/setup-unix.sh\" target=\"_blank\" rel=\"noopener\">View the script</a>.</p>",
    ].join("\n"),
  },
];
