// Intake rules from the course feedback: choices that make sense for the attendee's computer,
// every tool offered exactly once, and an IDE-first setup path for every desktop OS.

import { test, assert, assertEqual } from "./runner.js";
import { ENUMS, QUESTIONS, CHIP_OPTIONS, CHIP_HINTS, normalizeAnswers } from "../js/data/intake.js";
import { tools, recommendedTools } from "../js/data/tools.js";
import { visibleBlocks, earlyStop } from "../js/lib/tailor.js";
import setup from "../js/data/modules/setup.js";

const question = (id) => QUESTIONS.find((q) => q.id === id);
const DESKTOP = ["windows", "macos", "linux", "chromeos"];

test("intake: chip choices are worded per OS and cover every chip value", () => {
  for (const os of ["windows", "macos", "linux"]) {
    const values = (CHIP_OPTIONS[os] || []).map((o) => o.value).sort();
    assertEqual(values, [...ENUMS.chip].sort(), `${os} chip options`);
    assert(typeof CHIP_HINTS[os] === "string" && CHIP_HINTS[os].length > 0, `${os} has a chip hint`);
  }
  // Windows names the chip the way Settings does; a Mac never offers "Snapdragon".
  assert(CHIP_OPTIONS.windows.some((o) => /snapdragon/i.test(o.label)), "Windows offers Snapdragon");
  assert(!CHIP_OPTIONS.macos.some((o) => /snapdragon/i.test(o.label)), "Mac doesn't offer Snapdragon");
  assert(CHIP_OPTIONS.macos.some((o) => /apple silicon/i.test(o.label)), "Mac offers Apple Silicon");
  assertEqual(CHIP_OPTIONS.macos[0].value, "arm", "Apple Silicon listed first on a Mac");
});

test("intake: chip is only asked where it matters", () => {
  const chip = question("chip");
  for (const os of ENUMS.os) assertEqual(chip.askIf({ os }), ["windows", "macos", "linux"].includes(os), `askIf(${os})`);
});

test("intake: every tool value is offered exactly once, recommended ones first", () => {
  const values = question("tool").options.map((o) => o.value);
  assertEqual([...values].sort(), [...ENUMS.tool].sort(), "tool options match ENUMS.tool");
  assertEqual(new Set(values).size, values.length, "no duplicate tool options");
  const firstIds = values.slice(0, recommendedTools.length);
  assertEqual(firstIds, recommendedTools.map((t) => t.id), "recommended tools come first");
  assert(recommendedTools.length >= 2 && recommendedTools.length <= 5, "a short recommended list");
});

test("intake: non-coders and unsure work laptops are valid answers, and only a locked laptop stops early", () => {
  const base = { os: "windows", chip: "x64", device: "personal", tool: "codex", experience: "no-code" };
  assert(normalizeAnswers(base) !== null, "no-code is valid");
  assertEqual(earlyStop({ ...base, device: "work-unsure" }), null, "work-unsure doesn't stop");
  assertEqual(earlyStop({ ...base, device: "work-locked" }), "work-locked", "work-locked stops");
});

test("tools: every tool says how it lives in an editor", () => {
  for (const t of tools) assert(["extension", "own", "terminal"].includes(t.ide), `${t.id} has ide`);
  for (const t of tools.filter((x) => x.recommended)) assert(typeof t.pitch === "string" && t.pitch, `${t.id} has a pitch`);
});

test("setup: IDE first, then workspace, then the agent prompt, for every desktop OS and tool", () => {
  const problems = [];
  for (const os of DESKTOP) {
    for (const tool of ENUMS.tool) {
      const a = { os, chip: "unsure", device: "personal", tool, experience: "no-code" };
      const blocks = visibleBlocks(setup, a).filter((b) => !b.group);
      const index = (pred) => blocks.findIndex(pred);
      const own = (tools.find((t) => t.id === tool) || {}).ide === "own";
      const editor = own ? index((b) => b.id === `tool-${tool}`) : index((b) => b.topic === "editor");
      const workspace = index((b) => b.topic === "workspace");
      const prompt = index((b) => b.id === `agent-setup-${os}`);
      const script = index((b) => b.topic === "script");
      if (editor === -1) problems.push(`${os}/${tool}: no editor step`);
      if (workspace === -1) problems.push(`${os}/${tool}: no workspace step`);
      if (prompt === -1) problems.push(`${os}/${tool}: no setup prompt`);
      if (script === -1) problems.push(`${os}/${tool}: no script option`);
      if (!(editor < workspace && workspace < prompt)) problems.push(`${os}/${tool}: steps out of order`);
      if (own && blocks.some((b) => b.topic === "editor")) problems.push(`${os}/${tool}: VS Code shown for an own-editor tool`);
    }
  }
  if (problems.length) throw new Error(problems.slice(0, 10).join(" | "));
});

test("setup: the hand-typed steps are folded away, never in the main flow", () => {
  const a = { os: "windows", chip: "x64", device: "personal", tool: "claude-code", experience: "no-code" };
  const visible = visibleBlocks(setup, a);
  for (const b of visible.filter((x) => x.topic === "git" || x.topic === "python")) {
    assertEqual(b.group, "manual", `${b.id} is in the manual group`);
  }
  // Claude Code on Windows needs Git first: that warning comes before the Claude Code step.
  const ids = visible.map((b) => b.id);
  assert(ids.indexOf("tool-claude-code-windows-git") < ids.indexOf("tool-claude-code"), "Git warning before Claude Code");
});
