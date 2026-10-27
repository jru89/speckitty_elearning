// Ready check (FR-019) with the copyable setup summary (FR-020). Shape: data-model.md "Module (static)".
// Checklist items are tailored so every visible item can be completed (tailoring contract rule 5).
// `when` dimensions AND together, so "mobile OR work-locked" needs two told-the-group items.

import { ENUMS } from "../intake.js";

const DESKTOP_OS = ["windows", "macos", "linux", "chromeos"];
const CAN_INSTALL = ["personal", "work-can-install", "work-unsure"];
const CHOSEN_TOOLS = ENUMS.tool.filter((t) => t !== "undecided");

const installable = { os: DESKTOP_OS, device: CAN_INSTALL };

export default {
  id: "ready",
  title: "Ready check",
  summary: "Tick off your setup, so you walk in ready.",
  minutes: 3,
  optional: false,
  blocks: [
    {
      id: "ready-intro",
      kind: "note",
      body: "<p>Go through this list on the laptop you'll bring. If something doesn't work, the setup module has the fix. Still stuck? Ask in the WhatsApp group before the session; that's completely fine.</p>",
    },
  ],
  exercise: {
    id: "ready-check",
    type: "checklist",
    config: {
      summary: true,
      items: [
        { id: "editor", label: "My editor opens my class workspace folder (spec-kitty-class)", when: installable },
        { id: "tool-picked", label: "I picked an AI coding tool", when: { tool: ["undecided"] } },
        {
          id: "tool-login",
          label: "My AI tool is installed and I signed in once",
          when: { ...installable, tool: CHOSEN_TOOLS },
        },
        {
          id: "agent-check",
          label: "My AI tool ran the setup prompt (or I ran the script) and showed versions for Git, Python and pipx",
          when: { ...installable, tool: CHOSEN_TOOLS },
        },
        { id: "git-version", label: "Git shows a version number", when: installable },
        { id: "git-identity", label: "Git knows my name and email", when: installable },
        { id: "python-version", label: "Python is version 3.11 or higher", when: installable },
        { id: "workspace-repo", label: "My workspace folder has a README.md, so it's a Git repository", when: installable },
        { id: "told-trainer-mobile", label: "I said in the WhatsApp group that I can't install on this device", when: { os: ["mobile"] } },
        {
          id: "told-trainer-locked",
          label: "I said in the WhatsApp group that I can't install on this device",
          when: { device: ["work-locked"] },
        },
        { id: "laptop", label: "Laptop and charger packed" },
      ],
    },
  },
};
