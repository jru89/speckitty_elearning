// Setup module (FR-004, FR-012 to FR-018), IDE first: editor → AI tool → workspace → the AI tool installs the rest.
// The hand-typed Git, Python and pipx steps stay available as a folded "Do it by hand instead" group
// (blocks with group: "manual"; module-view.js wraps them in one <details>).

import { platformBlocks } from "../setup/platform-blocks.js";
import { toolBlocks } from "../setup/tool-blocks.js";
import { supportBlocks } from "../setup/support-blocks.js";
import { workflowBlocks, workspaceBlocks, agentSetupBlocks, scriptBlocks } from "../setup/workflow-blocks.js";

const byTopic = (blocks, topic) => blocks.filter((b) => b.topic === topic);
const manual = (blocks) => blocks.map((b) => ({ ...b, group: "manual" }));

const chromeosLinux = platformBlocks.filter((b) => b.id === "chromeos-linux");
const handSteps = platformBlocks.filter((b) => b.id !== "chromeos-linux");

const intro = {
  id: "setup-intro",
  topic: "intro",
  kind: "note",
  body: [
    "<p>You'll install two things yourself: an <strong>editor</strong> and your <strong>AI tool</strong>. Then you make a class folder and let your AI tool install the rest (Git, Python and pipx).</p>",
    "<p>Plan 20 to 40 minutes, a bit longer if this is your first time. You can stop any time and come back: your progress is saved.</p>",
  ].join("\n"),
};

export default {
  id: "setup",
  title: "Get set up",
  summary: "Your editor and AI tool, a class workspace, and a prompt that lets your AI install the rest.",
  minutes: 30,
  optional: false,
  blocks: [
    intro,
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
