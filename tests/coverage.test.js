// Exhaustive coverage test (NFR-006, SC-003): contracts/tailoring-contract.md rules 1-5,
// plus the Git/Python completeness check (research R-03).
// Modules are imported directly (not via the WP03 registry) so this test has no WP03 dependency.

import { test, assert } from "./runner.js";
import { ENUMS, QUESTIONS } from "../js/data/intake.js";
import { appliesTo, visibleBlocks, earlyStop, KNOWN_DIMENSIONS } from "../js/lib/tailor.js";
import terminal from "../js/data/modules/terminal.js";
import words from "../js/data/modules/words.js";
import specDriven from "../js/data/modules/spec-driven.js";
import setup from "../js/data/modules/setup.js";
import ready from "../js/data/modules/ready.js";

const MODULES = { terminal, words, "spec-driven": specDriven, setup, ready };
const MAX_REPORTED = 20;

const chipQuestion = QUESTIONS.find((q) => q.id === "chip");

function allCombinations() {
  const combos = [];
  for (const os of ENUMS.os) {
    const chips = chipQuestion.askIf({ os }) ? ENUMS.chip : ["unsure"];
    for (const chip of chips)
      for (const device of ENUMS.device)
        for (const tool of ENUMS.tool)
          for (const experience of ENUMS.experience) combos.push({ os, chip, device, tool, experience });
  }
  return combos;
}

const COMBOS = allCombinations();
const label = (a) => `${a.os}/${a.chip}/${a.device}/${a.tool}/${a.experience}`;

// Runs `check(a)` (returns a list of problems) for every combination and fails with the first 20.
function checkAll(check) {
  const failures = [];
  let total = 0;
  for (const a of COMBOS) {
    for (const problem of check(a)) {
      total += 1;
      if (failures.length < MAX_REPORTED) failures.push(`${label(a)}: ${problem}`);
    }
  }
  if (total > 0) {
    throw new Error(`${total} problem(s) across ${COMBOS.length} combinations; first ${failures.length}: ${failures.join(" | ")}`);
  }
}

const topicCount = (blocks, topic) => blocks.filter((b) => b.topic === topic).length;
const readyItems = (a) => ready.exercise.config.items.filter((i) => appliesTo(i.when, a));

test(`coverage: all ${COMBOS.length} intake combinations generated, every module loaded`, () => {
  assert(COMBOS.length > 0, "no combinations generated");
  for (const [id, mod] of Object.entries(MODULES)) {
    assert(mod && typeof mod === "object", `module ${id} did not load`);
    assert(mod.id === id, `module ${id} has id ${mod && mod.id}`);
    assert(Array.isArray(mod.blocks), `module ${id} has no blocks array`);
  }
});

test("coverage rule 1: no dead ends (git, python, tool and agent-check in setup)", () => {
  checkAll((a) => {
    if (earlyStop(a) !== null) return [];
    const blocks = visibleBlocks(setup, a);
    return ["git", "python", "tool", "agent-check"]
      .filter((topic) => topicCount(blocks, topic) === 0)
      .map((topic) => `no ${topic} block`);
  });
});

test("coverage rule 2: only the attendee's OS in setup and terminal", () => {
  checkAll((a) =>
    [setup, terminal].flatMap((mod) =>
      visibleBlocks(mod, a)
        .filter((b) => b.when && b.when.os && !b.when.os.includes(a.os))
        .map((b) => `${mod.id} block ${b.id} is for another OS`),
    ),
  );
});

test("coverage rule 3: only the attendee's tool, and a tool block when not early-stopped", () => {
  checkAll((a) => {
    const problems = [];
    for (const mod of Object.values(MODULES)) {
      for (const b of visibleBlocks(mod, a)) {
        if (b.when && b.when.tool && !b.when.tool.includes(a.tool)) problems.push(`${mod.id} block ${b.id} is for another tool`);
      }
    }
    if (earlyStop(a) === null && topicCount(visibleBlocks(setup, a), "tool") < 1) problems.push("no tool block");
    return problems;
  });
});

test("coverage rule 4: every `when` uses known dimensions and enum values", () => {
  const problems = [];
  const checkWhen = (where, when) => {
    if (when === undefined) return;
    if (!when || typeof when !== "object" || Array.isArray(when)) {
      problems.push(`${where}: when is not an object`);
      return;
    }
    for (const [dim, values] of Object.entries(when)) {
      if (!KNOWN_DIMENSIONS.includes(dim)) {
        problems.push(`${where}: unknown dimension "${dim}"`);
        continue;
      }
      if (!Array.isArray(values) || values.length === 0) {
        problems.push(`${where}: ${dim} is not a non-empty array`);
        continue;
      }
      for (const v of values) if (!ENUMS[dim].includes(v)) problems.push(`${where}: ${dim} value "${v}" is not in ENUMS`);
    }
  };
  for (const mod of Object.values(MODULES)) {
    for (const b of mod.blocks) checkWhen(`${mod.id}/${b.id}`, b.when);
    const items = (mod.exercise && mod.exercise.config && mod.exercise.config.items) || [];
    for (const item of items) checkWhen(`${mod.id}/exercise/${item.id}`, item.when);
  }
  if (problems.length > 0) {
    throw new Error(`${problems.length} problem(s); first ${Math.min(problems.length, MAX_REPORTED)}: ${problems.slice(0, MAX_REPORTED).join(" | ")}`);
  }
});

test("coverage rule 5: every visible ready-check item can be completed", () => {
  assert(ready.exercise && ready.exercise.type === "checklist", "ready module has no checklist exercise");
  assert(ready.exercise.config.summary === true, "ready checklist must render the setup summary");
  const installOnly = ["git-version", "git-identity", "python-version", "tool-login", "agent-check"];
  checkAll((a) => {
    const ids = readyItems(a).map((i) => i.id);
    const problems = [];
    if (ids.length === 0) problems.push("no visible ready items");
    if (a.tool === "undecided") {
      for (const id of ["tool-login", "agent-check"]) if (ids.includes(id)) problems.push(`undecided sees ${id}`);
      if (!ids.includes("tool-picked")) problems.push("undecided does not see tool-picked");
    }
    if (earlyStop(a) !== null) {
      for (const id of installOnly) if (ids.includes(id)) problems.push(`early-stop sees ${id}`);
      if (!ids.some((id) => id.startsWith("told-trainer"))) problems.push("early-stop does not see told-trainer");
    }
    return problems;
  });
});

test("coverage: Git and Python setup are complete (git >= 3, python >= 2, each with an install step and a check)", () => {
  checkAll((a) => {
    if (earlyStop(a) !== null) return [];
    const blocks = visibleBlocks(setup, a);
    const problems = [];
    const git = topicCount(blocks, "git");
    const python = topicCount(blocks, "python");
    if (git < 3) problems.push(`only ${git} git block(s)`);
    if (python < 2) problems.push(`only ${python} python block(s)`);
    // Each tool needs a way to install it and a way to verify it, not just enough blocks.
    for (const topic of ["git", "python"]) {
      for (const kind of ["step", "check"]) {
        if (!blocks.some((b) => b.topic === topic && b.kind === kind)) problems.push(`no ${topic} ${kind} block`);
      }
    }
    return problems;
  });
});
