// Tests for js/lib/summary.js and js/data/tools.js.

import { test, assert, assertEqual } from "./runner.js";
import { buildSummary } from "../js/lib/summary.js";
import { tools, toolById, checkedOn } from "../js/data/tools.js";

const IDS = ["git", "python", "tool-login", "agent-check", "told-trainer"];
const allChecked = { modules: {}, exercises: {}, checklist: Object.fromEntries(IDS.map((id) => [id, true])) };
const none = { modules: {}, exercises: {}, checklist: {} };

const mac = { os: "macos", chip: "arm", device: "personal", tool: "cursor", experience: "agents-daily" };

test("summary: exact example line from User Story 4", () => {
  assertEqual(
    buildSummary(mac, allChecked, IDS),
    "macOS · Apple Silicon · personal · Cursor · uses AI daily · all checks passed",
    "example line",
  );
});

test("summary: Windows ARM shows ARM", () => {
  const line = buildSummary({ ...mac, os: "windows" }, allChecked, IDS);
  assert(line.startsWith("Windows · ARM · "), line);
});

test("summary: ChromeOS has no chip part", () => {
  const line = buildSummary({ ...mac, os: "chromeos", chip: "unsure" }, allChecked, IDS);
  assertEqual(line, "ChromeOS · personal · Cursor · uses AI daily · all checks passed", "chromeos");
});

test("summary: unsure chip is omitted", () => {
  const line = buildSummary({ ...mac, os: "linux", chip: "unsure" }, allChecked, IDS);
  assert(line.startsWith("Linux · personal · "), line);
});

test("summary: undecided and other tools", () => {
  assert(buildSummary({ ...mac, tool: "undecided" }, none, IDS).includes(" · no tool chosen yet · "), "undecided");
  assert(buildSummary({ ...mac, tool: "other" }, none, IDS).includes(" · Other tool · "), "other");
});

test("summary: partial checks", () => {
  const p = { modules: {}, exercises: {}, checklist: { git: true, python: true, "tool-login": false, stray: true } };
  assert(buildSummary(mac, p, IDS).endsWith(" · 2 of 5 checks done"), buildSummary(mac, p, IDS));
  assert(buildSummary(mac, none, IDS).endsWith(" · 0 of 5 checks done"), "none checked");
});

test("summary: null answers give null; no dates or ids in the line", () => {
  assertEqual(buildSummary(null, allChecked, IDS), null, "null answers");
  const line = buildSummary({ ...mac, device: "work-can-install", experience: "terminal-new" }, allChecked, IDS);
  assertEqual(line, "macOS · Apple Silicon · work laptop · Cursor · new to the terminal · all checks passed", "labels");
  assert(!/\d{4}-\d{2}/.test(line), "no dates");
});

test("tools: 13 unique ids, claude-code first, https install URLs, valid cost", () => {
  const ids = tools.map((t) => t.id);
  assertEqual(ids.length, 13, "count");
  assertEqual(new Set(ids).size, 13, "unique");
  assertEqual(ids[0], "claude-code", "claude-code first");
  assert(tools[0].demo === true, "claude-code is the demo tool");
  const rest = ids.slice(1);
  assertEqual(rest, [...rest].sort(), "the rest alphabetical");
  for (const t of tools) {
    assert(t.installUrl.startsWith("https://"), `${t.id} installUrl`);
    assert(["free", "free-tier", "paid", "api-key"].includes(t.cost), `${t.id} cost`);
    assert(t.name && t.costNote && t.commandStyle, `${t.id} fields`);
  }
  assert(/^\d{4}-\d{2}-\d{2}$/.test(checkedOn), "checkedOn is an ISO date");
  assertEqual(toolById("codex").name, "Codex", "toolById");
  assertEqual(toolById("nope"), undefined, "toolById unknown");
});
