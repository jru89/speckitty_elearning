// Setup module (FR-004, FR-012 to FR-018), IDE first: editor → AI tool → workspace → the AI tool installs the rest.
// The hand-typed Git, Python and pipx steps stay available as a folded "Do it by hand instead" group
// (blocks with group: "manual"; module-view.js wraps them in one <details>).

import { ENUMS } from "../intake.js";
import { platformBlocks } from "../setup/platform-blocks.js";
import { toolBlocks } from "../setup/tool-blocks.js";
import { supportBlocks } from "../setup/support-blocks.js";
import { workflowBlocks, workspaceBlocks, agentSetupBlocks, scriptBlocks } from "../setup/workflow-blocks.js";

const byTopic = (blocks, topic) => blocks.filter((b) => b.topic === topic);
const manual = (blocks) => blocks.map((b) => ({ ...b, group: "manual" }));

const chromeosLinux = platformBlocks.filter((b) => b.id === "chromeos-linux");
const handSteps = platformBlocks.filter((b) => b.id !== "chromeos-linux");

// The intro names what you install yourself. Claude Code on Windows needs Git first, so that combination gets its
// own wording; the three `when`s don't overlap and together cover every answer.
const TIME = "<p>Plan 20 to 40 minutes, a bit longer if this is your first time. You can stop any time and come back: your progress is saved.</p>";
const introBlock = (id, when, what, rest = "Git, Python and pipx") => ({
  id,
  topic: "intro",
  kind: "note",
  when,
  body: `<p>You'll install ${what}. Then you make a class folder and let your AI tool install the rest (${rest}).</p>
${TIME}`,
});
const TWO = "two things yourself: an <strong>editor</strong> and your <strong>AI tool</strong>";
const intros = [
  introBlock("setup-intro", { os: ["macos", "linux", "chromeos", "mobile"] }, TWO),
  introBlock("setup-intro-windows", { os: ["windows"], tool: ENUMS.tool.filter((t) => t !== "claude-code") }, TWO),
  introBlock(
    "setup-intro-windows-claude",
    { os: ["windows"], tool: ["claude-code"] },
    "three things yourself: <strong>Git</strong> (Claude Code on Windows needs it first), an <strong>editor</strong> and your <strong>AI tool</strong>",
    "Python and pipx",
  ),
];

export default {
  id: "setup",
  title: "Get set up",
  summary: "Your editor and AI tool, a class workspace, and a prompt that lets your AI install the rest.",
  minutes: 30,
  optional: false,
  blocks: [
    ...intros,
    ...byTopic(supportBlocks, "work-device"),
    ...chromeosLinux,
    ...workflowBlocks,
    ...toolBlocks,
    ...workspaceBlocks,
    ...agentSetupBlocks,
    ...byTopic(supportBlocks, "agent-check"),
    ...scriptBlocks,
    ...manual(handSteps),
    ...manual(byTopic(supportBlocks, "head-start")),
  ],
  exercise: null,
};
