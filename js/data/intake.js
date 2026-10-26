// Intake questions, answer enums and answer validation (FR-002, FR-003, FR-005; data-model.md "Answers").
// ENUMS is a contract: content `when` labels and tailor.js are written against these values.

import { tools } from "./tools.js";

export const ENUMS = {
  os: ["windows", "macos", "linux", "chromeos", "mobile"],
  chip: ["x64", "arm", "unsure"],
  device: ["personal", "work-can-install", "work-locked"],
  tool: [...tools.map((t) => t.id), "other", "undecided"],
  experience: ["terminal-new", "codes-no-agents", "agents-daily"],
};

const CHIP_OS = ["windows", "macos", "linux"];

export const CHIP_HINTS = {
  windows: "Settings → System → About → System type",
  macos: "Apple menu → About This Mac: 'Chip: Apple M…' means ARM",
  linux: "Run uname -m: aarch64 means ARM, x86_64 means Intel/AMD",
};

export const QUESTIONS = [
  {
    id: "os",
    label: "Which computer will you bring to the class?",
    options: [
      { value: "windows", label: "Windows" },
      { value: "macos", label: "macOS" },
      { value: "linux", label: "Linux" },
      { value: "chromeos", label: "ChromeOS (Chromebook)" },
      { value: "mobile", label: "Tablet or phone" },
    ],
  },
  {
    id: "chip",
    label: "What kind of chip does it have?",
    askIf: (a) => CHIP_OS.includes(a.os),
    options: [
      { value: "x64", label: "Intel or AMD" },
      { value: "arm", label: "ARM (including Apple Silicon M1–M4)" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "device",
    label: "Whose device is it?",
    options: [
      { value: "personal", label: "My own laptop or desktop" },
      { value: "work-can-install", label: "A work laptop, and I can install software" },
      { value: "work-locked", label: "A work laptop, and I can't install software (or I'm not sure)" },
    ],
  },
  {
    id: "tool",
    label: "Which AI coding tool will you use?",
    options: [
      ...tools.map((t) => ({ value: t.id, label: t.name, hint: t.costNote })),
      { value: "other", label: "Other tool" },
      { value: "undecided", label: "Help me choose" },
    ],
  },
  {
    id: "experience",
    label: "How familiar are you with this kind of work?",
    options: [
      { value: "terminal-new", label: "I'm new to the terminal" },
      { value: "codes-no-agents", label: "I write code but haven't used AI agents" },
      { value: "agents-daily", label: "I use AI coding agents (almost) daily" },
    ],
  },
];

export const ANSWER_LABELS = {
  os: { windows: "Windows", macos: "macOS", linux: "Linux", chromeos: "ChromeOS", mobile: "tablet or phone" },
  chip: { x64: "Intel/AMD", arm: "ARM" },
  device: { personal: "personal", "work-can-install": "work laptop", "work-locked": "locked work laptop" },
  experience: {
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
