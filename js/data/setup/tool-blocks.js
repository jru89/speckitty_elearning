// Tool setup blocks (FR-014, FR-015, C-006, C-007). Shape: data-model.md "Content block".
// Generated from tools.js: one topic "tool" block per ENUMS.tool value (tailoring contract rules 1 and 3).
// Link, don't copy (C-006): install steps live on each tool's official page, not here.

import { tools } from "../tools.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toolBody(t) {
  const lines = [
    `<p><strong>Cost:</strong> ${escapeHtml(t.costNote)}</p>`,
    `<p>Follow the official install guide: <a href="${escapeHtml(t.installUrl)}" target="_blank" rel="noopener">${escapeHtml(t.name)} installation</a></p>`,
    `<p>Then open it once and log in, so it's ready on the day.</p>`,
  ];
  if (t.demo) lines.push(`<p>This is the tool the trainer demos with.</p>`);
  return lines.join("\n");
}

export const toolBlocks = [
  ...tools.map((t) => ({
    id: `tool-${t.id}`,
    topic: "tool",
    kind: "step",
    heading: `Install ${t.name}`,
    when: { tool: [t.id] },
    body: toolBody(t),
  })),
  {
    id: "tool-undecided-intro",
    topic: "intro",
    kind: "note",
    heading: "Not sure which tool to use?",
    when: { tool: ["undecided"] },
    body: "<p>Not sure? Any of these works with Spec Kitty. The trainer demos with Claude Code. If you want a free option, pick one marked free or free tier.</p>",
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
];
