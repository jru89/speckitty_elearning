// Tests for js/lib/store.js against contracts/store-contract.md.

import { test, assert, assertEqual } from "./runner.js";
import { createStore, KEY } from "../js/lib/store.js";

const VALID = { os: "macos", chip: "arm", device: "personal", tool: "cursor", experience: "agents-daily" };

const FOREIGN = {
  "ccol:progress:v1": '{"modules":{"intro":"done"},"score":42}',
  "ccol:profile": '{"name":"Someone Else"}',
  "rijbewijs:progress": '{"answered":[1,2,3]}',
};

function fakeStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

function throwingStorage() {
  const fail = () => {
    throw new Error("QuotaExceededError");
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

function assertForeignIntact(storage, step) {
  for (const [k, v] of Object.entries(FOREIGN)) {
    assertEqual(storage.map.get(k), v, `${step}: foreign key ${k} changed`);
  }
  const extra = [...storage.map.keys()].filter((k) => !(k in FOREIGN) && k !== KEY);
  assertEqual(extra, [], `${step}: unexpected keys`);
}

test("store: answers and progress round-trip through storage", () => {
  const storage = fakeStorage();
  const a = createStore(storage);
  a.setAnswers(VALID);
  a.setModuleStatus("words", "in_progress");
  a.setExerciseState("words-match", { completed: true, pairs: { agent: "loop" } });
  a.setChecklistItem("git-version", true);

  const b = createStore(storage);
  assertEqual(b.getAnswers(), VALID, "answers");
  const p = b.getProgress();
  assertEqual(p.modules, { words: "in_progress" }, "modules");
  assertEqual(p.exercises["words-match"], { completed: true, pairs: { agent: "loop" } }, "exercise");
  assertEqual(p.checklist, { "git-version": true }, "checklist");
  assertEqual(JSON.parse(storage.map.get(KEY)).schemaVersion, 1, "schemaVersion");
  assert(b.isPersistent(), "persistent with working storage");
});

test("store: module status only moves forward", () => {
  const s = createStore(fakeStorage());
  s.setModuleStatus("setup", "done");
  s.setModuleStatus("setup", "in_progress");
  s.setModuleStatus("setup", "not_started");
  assertEqual(s.getProgress().modules.setup, "done", "status went backwards");
});

test("store: setAnswers throws TypeError on invalid input", () => {
  const s = createStore(fakeStorage());
  let err = null;
  try {
    s.setAnswers({ ...VALID, os: "amiga" });
  } catch (e) {
    err = e;
  }
  assert(err instanceof TypeError, "expected TypeError");
  assertEqual(s.getAnswers(), null, "nothing saved");
});

test("store: foreign keys are never read, changed, added or removed", () => {
  const storage = fakeStorage(FOREIGN);
  const s = createStore(storage);
  assertForeignIntact(storage, "createStore");
  const steps = [
    ["getAnswers", () => s.getAnswers()],
    ["setAnswers", () => s.setAnswers(VALID)],
    ["getProgress", () => s.getProgress()],
    ["setModuleStatus", () => s.setModuleStatus("words", "done")],
    ["setExerciseState", () => s.setExerciseState("judge", { picks: [1] })],
    ["setChecklistItem", () => s.setChecklistItem("python-version", true)],
    ["isPersistent", () => s.isPersistent()],
    ["subscribe", () => s.subscribe(() => {})()],
    ["startFresh", () => s.startFresh()],
  ];
  for (const [name, fn] of steps) {
    fn();
    assertForeignIntact(storage, name);
  }
  assert(!storage.map.has(KEY), "startFresh removes skcp:v1");
  assertEqual(storage.map.size, 3, "only the foreign keys remain");
  assertEqual(s.getAnswers(), null, "memory reset after startFresh");
});

test("store: a throwing storage works from memory and reports not persistent", () => {
  const s = createStore(throwingStorage());
  let calls = 0;
  s.subscribe(() => calls++);
  assertEqual(s.getAnswers(), null, "no answers yet");
  s.setAnswers(VALID);
  s.setModuleStatus("words", "in_progress");
  s.setExerciseState("words-match", { completed: true });
  s.setChecklistItem("git-version", true);
  assertEqual(s.getAnswers(), VALID, "answers kept in memory");
  assertEqual(s.getProgress().modules.words, "in_progress", "progress kept in memory");
  assert(!s.isPersistent(), "isPersistent should be false");
  s.startFresh();
  assertEqual(s.getAnswers(), null, "startFresh still resets memory");
  assertEqual(calls, 5, "subscribers notified on every change");
});

test("store: a write failure after a good start flips isPersistent", () => {
  const storage = fakeStorage();
  const s = createStore(storage);
  assert(s.isPersistent(), "starts persistent");
  storage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  s.setAnswers(VALID);
  assert(!s.isPersistent(), "isPersistent false after failed write");
  assertEqual(s.getAnswers(), VALID, "change kept in memory");
});

test("store: corrupt JSON gives null answers and default progress, value left untouched", () => {
  const storage = fakeStorage({ [KEY]: "{not json" });
  const s = createStore(storage);
  assertEqual(s.getAnswers(), null, "answers");
  assertEqual(s.getProgress(), { modules: {}, exercises: {}, checklist: {} }, "progress");
  assertEqual(storage.map.get(KEY), "{not json", "broken value untouched by reads");
});

test("store: an unknown answer value or wrong schemaVersion gives null answers", () => {
  const bad = { schemaVersion: 1, answers: { ...VALID, tool: "notepad" }, progress: {}, updatedAt: null };
  assertEqual(createStore(fakeStorage({ [KEY]: JSON.stringify(bad) })).getAnswers(), null, "unknown value");
  const old = { schemaVersion: 0, answers: VALID, progress: {}, updatedAt: null };
  assertEqual(createStore(fakeStorage({ [KEY]: JSON.stringify(old) })).getAnswers(), null, "wrong schemaVersion");
});

test("store: subscribe returns a working unsubscribe", () => {
  const s = createStore(fakeStorage());
  let calls = 0;
  const off = s.subscribe(() => calls++);
  s.setChecklistItem("a", true);
  off();
  s.setChecklistItem("b", true);
  assertEqual(calls, 1, "notified once");
});
