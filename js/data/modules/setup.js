// Setup module (FR-004, FR-012 to FR-018). Composition order is fixed by contracts/content-schema.md:
// intro, work-device, platform (Git, then Python), tool, agent-check, head-start.

import { platformBlocks } from "../setup/platform-blocks.js";
import { toolBlocks } from "../setup/tool-blocks.js";
import { supportBlocks } from "../setup/support-blocks.js";

const byTopic = (blocks, topic) => blocks.filter((b) => b.topic === topic);

const intro = {
  id: "setup-intro",
  topic: "intro",
  kind: "note",
  body: "<p>You'll install three things: Git (tracks changes), Python 3.11+ (Spec Kitty runs on it) and your AI coding tool. Each step ends with a check. Download time isn't counted in the 15 minutes.</p>",
};

export default {
  id: "setup",
  title: "Get set up",
  summary: "Git, Python and your AI coding tool, with a check for each, for your machine only.",
  minutes: 15,
  optional: false,
  blocks: [
    intro,
    ...byTopic(supportBlocks, "work-device"),
    ...platformBlocks,
    ...toolBlocks,
    ...byTopic(supportBlocks, "agent-check"),
    ...byTopic(supportBlocks, "head-start"),
  ],
  exercise: null,
};
