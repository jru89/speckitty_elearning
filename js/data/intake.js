// Intake questions, answer enums and answer validation (FR-002, FR-003, FR-005; data-model.md "Answers").
// ENUMS is a contract: content `when` labels and tailor.js are written against these values.

import { tools, recommendedTools, otherTools } from "./tools.js";

export const ENUMS = {
  os: ["windows", "macos", "linux", "chromeos", "mobile"],
  chip: ["x64", "arm", "unsure"],
  device: ["personal", "work-can-install", "work-unsure", "work-locked"],
  tool: [...tools.map((t) => t.id), "other", "undecided"],
  experience: ["no-code", "terminal-new", "codes-no-agents", "agents-daily"],
};

const CHIP_OS = ["windows", "macos", "linux"];

// What the attendee sees on their own screen, so the hint and the options use the same words.
export const CHIP_HINTS = {
  windows: "Open Settings → System → About. Next to \"System type\" it says \"x64-based processor\" (Intel or AMD) or \"ARM-based processor\".",
  macos: "Open the Apple menu → About This Mac. It says \"Chip: Apple M…\" (Apple Silicon) or \"Processor: Intel\".",
  linux: "Run uname -m in a terminal: x86_64 means Intel or AMD, aarch64 means ARM.",
};

// Chip choices worded per OS, most common first. Values stay x64 / arm / unsure.
export const CHIP_OPTIONS = {
  windows: [
    { value: "x64", label: "Intel or AMD", hint: "Settings says \"x64-based processor\". Most Windows laptops." },
    { value: "arm", label: "Snapdragon (ARM)", hint: "Settings says \"ARM-based processor\". Copilot+ PCs, Surface Pro X." },
    { value: "unsure", label: "Not sure", hint: "Fine: you'll see both versions where it matters." },
  ],
  macos: [
    { value: "arm", label: "Apple Silicon (M1, M2, M3, M4…)", hint: "Most Macs from 2021 onwards." },
    { value: "x64", label: "Intel", hint: "Older Macs." },
    { value: "unsure", label: "Not sure", hint: "Fine: the steps work on both." },
  ],
  linux: [
    { value: "x64", label: "x86_64 (Intel or AMD)", hint: "Most PCs." },
    { value: "arm", label: "aarch64 (ARM)", hint: "Raspberry Pi, some newer laptops." },
    { value: "unsure", label: "Not sure", hint: "Fine: the steps work on both." },
  ],
};

const toolOption = (t) => ({ value: t.id, label: t.name, hint: t.pitch || t.costNote, more: !t.recommended });

export const QUESTIONS = [
  {
    id: "os",
    label: "Which computer will you bring to the class?",
    options: [
      { value: "windows", label: "Windows" },
      { value: "macos", label: "Mac" },
      { value: "linux", label: "Linux" },
      { value: "chromeos", label: "Chromebook" },
      { value: "mobile", label: "Tablet or phone" },
    ],
  },
  {
    id: "chip",
    label: "What kind of chip does it have?",
    askIf: (a) => CHIP_OS.includes(a.os),
    // Labels and hints are swapped in per OS from CHIP_OPTIONS; these are the fallback.
    options: CHIP_OPTIONS.windows,
  },
  {
    id: "device",
    label: "Whose computer is it?",
    options: [
      { value: "personal", label: "My own laptop or desktop" },
      { value: "work-can-install", label: "A work laptop, and I'm allowed to install software" },
      { value: "work-unsure", label: "A work laptop, and I'm not sure if I may install software" },
      { value: "work-locked", label: "A work laptop, and I can't install software" },
    ],
  },
  {
    id: "tool",
    label: "Which AI coding tool will you use?",
    options: [
      ...recommendedTools.map(toolOption),
      { value: "undecided", label: "Help me choose", hint: "We'll show the options with what they cost." },
      ...otherTools.map(toolOption),
      { value: "other", label: "Another tool", hint: "Check with your trainer that Spec Kitty supports it.", more: true },
    ],
  },
  {
    id: "experience",
    label: "How familiar are you with this kind of work?",
    options: [
      { value: "no-code", label: "I don't write code", hint: "For example product, design or management." },
      { value: "terminal-new", label: "I code a little, but I'm new to the terminal" },
      { value: "codes-no-agents", label: "I write code, but haven't used AI agents" },
      { value: "agents-daily", label: "I use AI coding agents (almost) daily" },
    ],
  },
];

export const ANSWER_LABELS = {
  os: { windows: "Windows", macos: "macOS", linux: "Linux", chromeos: "ChromeOS", mobile: "tablet or phone" },
  chip: { x64: "Intel/AMD", arm: "ARM" },
  device: {
    personal: "personal",
    "work-can-install": "work laptop",
    "work-unsure": "work laptop (installs unsure)",
    "work-locked": "locked work laptop",
  },
  experience: {
    "no-code": "doesn't code",
    "terminal-new": "new to the terminal",
    "codes-no-agents": "codes, new to agents",
    "agents-daily": "uses AI daily",
  },
};

// Returns a complete, valid answers object, or null when any field is missing or unknown.
// When the chip question is not asked for the chosen OS, chip is forced to "unsure".
export function normalizeAnswers(raw) {
  if (!raw || typeof raw !== "object") return null;
  const out = {};
  for (const field of ["os", "device", "tool", "experience"]) {
    if (!ENUMS[field].includes(raw[field])) return null;
    out[field] = raw[field];
  }
  if (CHIP_OS.includes(out.os)) {
    if (!ENUMS.chip.includes(raw.chip)) return null;
    out.chip = raw.chip;
  } else {
    out.chip = "unsure";
  }
  return { os: out.os, chip: out.chip, device: out.device, tool: out.tool, experience: out.experience };
}
