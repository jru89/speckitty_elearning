// Supported AI coding tools (C-007, FR-014, FR-015). Shape: data-model.md "Tool entry".
// Checked against official sites on 2026-10-26. Update: edit this file only; intake options and setup blocks read from it.
// commandStyle follows the Spec Kitty "Supported Agents" doc (docs/api/supported-agents.md, Spec Kitty 3.2.7).
// ide: how the tool lives in an editor. "extension" = an extension inside VS Code; "own" = the tool is its own
// editor (download it instead of VS Code); "terminal" = runs in the terminal inside VS Code.
// recommended + pitch: shown first in the intake and the "help me choose" list, for people new to all this.

export const checkedOn = "2026-10-26";

// If a fact can't be confirmed, keep the entry and use costNote "Check the tool's site for current pricing".

export const tools = [
  {
    id: "claude-code",
    name: "Claude Code",
    demo: true,
    cost: "paid",
    costNote: "Needs a paid Claude plan (Pro or Max) or an API key; the free Claude plan doesn't include it",
    installUrl: "https://code.claude.com/docs/en/setup",
    commandStyle: "/spec-kitty.specify",
    ide: "extension",
    extensionName: "Claude Code",
    recommended: true,
    pitch: "Used in the demo. Works inside VS Code. Needs a paid Claude plan.",
  },
  {
    id: "antigravity",
    name: "Google Antigravity",
    cost: "free-tier",
    costNote: "Free for individuals with weekly limits; Google AI Pro or Ultra gives more",
    installUrl: "https://antigravity.google/download",
    commandStyle: "/spec-kitty-specify",
    ide: "own",
  },
  {
    id: "codex",
    name: "Codex",
    cost: "free-tier",
    costNote: "Included in every ChatGPT plan, Free included (with limits), or use an OpenAI API key",
    installUrl: "https://learn.chatgpt.com/docs/codex/cli",
    commandStyle: "$spec-kitty-specify",
    ide: "extension",
    extensionName: "Codex",
    recommended: true,
    pitch: "Already use ChatGPT? Codex is included in your plan, even the free one.",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    cost: "free-tier",
    costNote: "Copilot Free has limited chat and agent use; paid plans give more",
    installUrl: "https://docs.github.com/en/copilot/get-started/quickstart",
    commandStyle: "/spec-kitty.specify",
    ide: "extension",
    extensionName: "GitHub Copilot",
    recommended: true,
    pitch: "Built into VS Code. Free plan with a GitHub account.",
  },
  {
    id: "cursor",
    name: "Cursor",
    cost: "free-tier",
    costNote: "Free plan with limited agent requests; paid plans for more usage",
    installUrl: "https://cursor.com/docs/get-started/installation",
    commandStyle: "/spec-kitty.specify",
    ide: "own",
    recommended: true,
    pitch: "An editor with AI built in. Free plan to start.",
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    cost: "api-key",
    costNote: "Needs a paid Gemini API key or a work Gemini Code Assist licence; free personal use moved to Antigravity",
    installUrl: "https://geminicli.com/docs/get-started/installation/",
    commandStyle: "/spec-kitty.specify",
    ide: "terminal",
  },
  {
    id: "kiro",
    name: "Kiro",
    cost: "free-tier",
    costNote: "Free plan with 50 credits a month; paid plans for more",
    installUrl: "https://kiro.dev/docs/getting-started/installation/",
    commandStyle: "/spec-kitty.specify",
    ide: "own",
  },
  {
    id: "letta",
    name: "Letta Code",
    cost: "free-tier",
    costNote: "Free Letta plan with limits; paid plans or your own API keys for more",
    installUrl: "https://docs.letta.com/letta-code/quickstart",
    commandStyle: "/spec-kitty-specify",
    ide: "terminal",
  },
  {
    id: "opencode",
    name: "OpenCode",
    cost: "free",
    costNote: "Free, open-source app; you connect a model provider (a few models are free for a limited time)",
    installUrl: "https://opencode.ai/docs/",
    commandStyle: "/spec-kitty.specify",
    ide: "terminal",
  },
  {
    id: "pi",
    name: "Pi",
    cost: "api-key",
    costNote: "Free, open-source app; you sign in to a model provider or add its API key",
    installUrl: "https://pi.dev/docs/latest",
    commandStyle: "/skill:spec-kitty-specify",
    ide: "terminal",
  },
  {
    id: "qwen",
    name: "Qwen Code",
    cost: "api-key",
    costNote: "The free tier ended in April 2026; needs a Qwen Cloud API key or plan",
    installUrl: "https://qwenlm.github.io/qwen-code-docs/en/users/quickstart/",
    commandStyle: "/spec-kitty.specify",
    ide: "terminal",
  },
  {
    id: "vibe",
    name: "Mistral Vibe",
    cost: "free-tier",
    costNote: "Works in Mistral's Free mode with limits; a paid plan or pay-as-you-go gives more",
    installUrl: "https://docs.mistral.ai/mistral-vibe/introduction",
    commandStyle: "/spec-kitty-specify",
    ide: "terminal",
  },
  {
    id: "windsurf",
    name: "Windsurf (now Devin Desktop)",
    cost: "free-tier",
    costNote: "Free plan with a light agent quota; paid plans for more",
    installUrl: "https://docs.devin.ai/desktop/getting-started",
    commandStyle: "/spec-kitty.specify",
    ide: "own",
  },
];

export const recommendedTools = tools.filter((t) => t.recommended);
export const otherTools = tools.filter((t) => !t.recommended);

export function toolById(id) {
  return tools.find((t) => t.id === id);
}
