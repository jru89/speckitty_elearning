// Tests for js/lib/tailor.js against contracts/tailoring-contract.md (unit cases; exhaustive coverage is WP08).

import { test, assert, assertEqual } from "./runner.js";
import { appliesTo, visibleBlocks, earlyStop, suggestedNext, MAIN_ORDER, KNOWN_DIMENSIONS } from "../js/lib/tailor.js";
import { ENUMS, normalizeAnswers } from "../js/data/intake.js";

const base = { os: "windows", chip: "x64", device: "personal", tool: "codex", experience: "codes-no-agents" };
const mac = { ...base, os: "macos", chip: "arm" };
const unsure = { ...base, chip: "unsure" };

test("tailor: appliesTo table", () => {
  const rows = [
    [undefined, base, true, "absent when"],
    [{}, base, true, "empty when"],
    [{ os: ["windows"] }, base, true, "os match"],
    [{ os: ["macos", "linux"] }, base, false, "os mismatch"],
    [{ chip: ["arm"] }, base, false, "chip mismatch"],
    [{ chip: ["arm"] }, mac, true, "chip match"],
    [{ chip: ["arm"] }, unsure, true, "chip unsure matches arm block"],
    [{ chip: ["x64"] }, unsure, true, "chip unsure matches x64 block"],
    [{ os: ["macos"], chip: ["arm"] }, unsure, false, "unsure does not override os"],
    [{ os: ["windows"], tool: ["codex"] }, base, true, "multi-dimension all match"],
    [{ os: ["windows"], tool: ["cursor"] }, base, false, "multi-dimension one mismatch"],
    [{ device: ["work-can-install", "personal"], experience: ["codes-no-agents"] }, base, true, "device + experience"],
    [{ os: ["linux"] }, null, true, "answers null shows everything"],
    [{ chip: ["arm"], tool: ["cursor"] }, null, true, "answers null, multi-dimension"],
    [{ planet: ["earth"] }, base, false, "unknown dimension"],
    [{ os: ["windows"], colour: ["red"] }, base, false, "known plus unknown dimension"],
    [{ planet: ["earth"] }, null, false, "unknown dimension even with null answers"],
    [{ tool: ["undecided"] }, { ...base, tool: "undecided" }, true, "undecided block"],
    [{ tool: ["other"] }, base, false, "other block hidden for a named tool"],
  ];
  assert(rows.length >= 12, "at least 12 rows");
  for (const [when, answers, expected, label] of rows) {
    assertEqual(appliesTo(when, answers), expected, label);
  }
});

test("tailor: visibleBlocks filters and keeps order", () => {
  const module = {
    blocks: [
      { id: "a" },
      { id: "b", when: { os: ["macos"] } },
      { id: "c", when: { os: ["windows"] } },
      { id: "d", when: { chip: ["arm"] } },
      { id: "e", when: { chip: ["x64"] } },
    ],
  };
  assertEqual(visibleBlocks(module, base).map((b) => b.id), ["a", "c", "e"], "windows x64");
  assertEqual(visibleBlocks(module, unsure).map((b) => b.id), ["a", "c", "d", "e"], "windows unsure");
  assertEqual(visibleBlocks(module, null).map((b) => b.id), ["a", "b", "c", "d", "e"], "null answers");
});

test("tailor: earlyStop", () => {
  assertEqual(earlyStop(base), null, "personal windows");
  assertEqual(earlyStop({ ...base, os: "mobile", chip: "unsure" }), "mobile", "mobile");
  assertEqual(earlyStop({ ...base, device: "work-locked" }), "work-locked", "work-locked");
  assertEqual(earlyStop({ ...base, os: "mobile", chip: "unsure", device: "work-locked" }), "mobile", "mobile wins");
  assertEqual(earlyStop(null), null, "no answers");
});

function progressWith(modules) {
  return { modules, exercises: {}, checklist: {} };
}

test("tailor: suggestedNext by experience", () => {
  const empty = progressWith({});
  assertEqual(suggestedNext({ ...base, experience: "agents-daily" }, empty), "ready", "agents-daily");
  assertEqual(suggestedNext({ ...base, experience: "terminal-new" }, empty), "terminal", "terminal-new");
  assertEqual(suggestedNext(base, empty), "words", "codes-no-agents starts at words");
  assertEqual(suggestedNext(base, progressWith({ words: "done" })), "spec-driven", "next not-done");
  assertEqual(suggestedNext(base, progressWith({ words: "in_progress" })), "words", "in_progress is not done");
  assertEqual(
    suggestedNext({ ...base, experience: "terminal-new" }, progressWith({ terminal: "done" })),
    "words",
    "terminal done → main order",
  );
  assertEqual(
    suggestedNext({ ...base, experience: "agents-daily" }, progressWith({ ready: "done" })),
    "words",
    "agents-daily with ready done → first not-done",
  );
});

test("tailor: suggestedNext never returns a done module, except ready when all done", () => {
  const all = progressWith({ words: "done", "spec-driven": "done", setup: "done", ready: "done", terminal: "done" });
  for (const experience of ENUMS.experience) {
    assertEqual(suggestedNext({ ...base, experience }, all), "ready", `all done (${experience})`);
  }
  const partial = progressWith({ words: "done", "spec-driven": "done" });
  for (const experience of ENUMS.experience) {
    const next = suggestedNext({ ...base, experience }, partial);
    assert(partial.modules[next] !== "done", `${experience} got done module ${next}`);
  }
  assertEqual(suggestedNext(base, partial), "setup", "setup after vocabulary");
});

test("tailor: early stop never suggests setup or ready", () => {
  const stops = [
    { ...base, os: "mobile", chip: "unsure" },
    { ...base, device: "work-locked" },
  ];
  const progresses = [
    progressWith({}),
    progressWith({ words: "done" }),
    progressWith({ words: "done", "spec-driven": "done" }),
  ];
  for (const a of stops) {
    for (const experience of ENUMS.experience) {
      for (const p of progresses) {
        const next = suggestedNext({ ...a, experience }, p);
        assert(next !== "setup" && next !== "ready", `early stop got ${next}`);
      }
    }
  }
  assertEqual(suggestedNext({ ...stops[0], experience: "agents-daily" }, progressWith({})), "words", "first vocabulary");
  assertEqual(suggestedNext(stops[1], progressWith({ words: "done" })), "spec-driven", "next vocabulary");
});

test("tailor: suggestedNext with null answers or progress", () => {
  assertEqual(suggestedNext(null, null), "words", "nothing known");
  assertEqual(suggestedNext(base, undefined), "words", "no progress");
});

test("tailor: exported constants", () => {
  assertEqual(MAIN_ORDER, ["words", "spec-driven", "setup", "ready"], "MAIN_ORDER");
  assertEqual(KNOWN_DIMENSIONS, ["os", "chip", "device", "tool", "experience"], "KNOWN_DIMENSIONS");
  assertEqual(Object.keys(ENUMS), KNOWN_DIMENSIONS, "ENUMS keys match dimensions");
});

test("intake: normalizeAnswers validates and forces chip", () => {
  assertEqual(normalizeAnswers(base), base, "valid passes");
  assertEqual(normalizeAnswers(null), null, "null input");
  assertEqual(normalizeAnswers("macos"), null, "non-object");
  const missing = { ...base };
  delete missing.device;
  assertEqual(normalizeAnswers(missing), null, "missing field");
  assertEqual(normalizeAnswers({ ...base, tool: "notepad" }), null, "unknown tool");
  assertEqual(normalizeAnswers({ ...base, chip: undefined }), null, "chip required when asked");
  assertEqual(normalizeAnswers({ ...base, os: "chromeos", chip: "arm" }).chip, "unsure", "chromeos forces unsure");
  assertEqual(normalizeAnswers({ ...base, os: "mobile", chip: undefined }).chip, "unsure", "mobile forces unsure");
  for (const tool of ENUMS.tool) {
    assert(normalizeAnswers({ ...base, tool }), `tool ${tool} accepted`);
  }
});
