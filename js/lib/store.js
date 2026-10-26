// Per-attendee state: the only module that touches browser storage.
// Implements contracts/store-contract.md (NFR-003, NFR-004, NFR-005; FR-023, FR-024).
// Uses only getItem/setItem/removeItem on "skcp:" keys; never clear(), key(i) or length.

import { normalizeAnswers } from "../data/intake.js";

export const KEY = "skcp:v1";
const PROBE_KEY = "skcp:probe";
const SCHEMA_VERSION = 1;
const STATUS_ORDER = ["not_started", "in_progress", "done"];

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function freshRecord() {
  return {
    schemaVersion: SCHEMA_VERSION,
    answers: null,
    progress: { modules: {}, exercises: {}, checklist: {} },
    updatedAt: null,
  };
}

function cleanProgress(p) {
  const src = isPlainObject(p) ? p : {};
  return {
    modules: isPlainObject(src.modules) ? src.modules : {},
    exercises: isPlainObject(src.exercises) ? src.exercises : {},
    checklist: isPlainObject(src.checklist) ? src.checklist : {},
  };
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

// window.localStorage, or a stand-in that throws on use (accessing it can throw in some privacy modes).
export function safeLocalStorage() {
  try {
    const s = window.localStorage;
    if (s) return s;
  } catch {
    // fall through to the stand-in
  }
  const unavailable = () => {
    throw new Error("storage unavailable");
  };
  return { getItem: unavailable, setItem: unavailable, removeItem: unavailable };
}

export function createStore(storage = safeLocalStorage()) {
  let record = null;
  let persistent = true;
  const subscribers = new Set();

  try {
    storage.setItem(PROBE_KEY, "1");
    storage.removeItem(PROBE_KEY);
  } catch {
    persistent = false;
  }

  function load() {
    if (record) return record;
    record = freshRecord();
    try {
      const raw = storage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isPlainObject(parsed) && parsed.schemaVersion === SCHEMA_VERSION) {
          record = {
            schemaVersion: SCHEMA_VERSION,
            answers: isPlainObject(parsed.answers) ? parsed.answers : null,
            progress: cleanProgress(parsed.progress),
            updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
          };
        }
      }
    } catch {
      // Read or parse failure: keep the fresh default and leave the stored value untouched.
    }
    return record;
  }

  function commit() {
    record.updatedAt = new Date().toISOString();
    try {
      storage.setItem(KEY, JSON.stringify(record));
    } catch {
      persistent = false;
    }
    notify();
  }

  function notify() {
    for (const fn of [...subscribers]) fn();
  }

  return {
    getAnswers() {
      return normalizeAnswers(load().answers);
    },

    setAnswers(answers) {
      const valid = normalizeAnswers(answers);
      if (!valid) throw new TypeError("setAnswers: invalid answers");
      load().answers = valid;
      commit();
    },

    getProgress() {
      return copy(load().progress);
    },

    setModuleStatus(id, status) {
      const next = STATUS_ORDER.indexOf(status);
      if (typeof id !== "string" || next < 0) throw new TypeError("setModuleStatus: invalid id or status");
      const modules = load().progress.modules;
      const current = Math.max(0, STATUS_ORDER.indexOf(modules[id])); // missing counts as not_started
      if (next <= current) return; // forward-only
      modules[id] = status;
      commit();
    },

    setExerciseState(id, partial) {
      if (typeof id !== "string" || !isPlainObject(partial)) throw new TypeError("setExerciseState: invalid input");
      const exercises = load().progress.exercises;
      exercises[id] = { completed: false, ...(exercises[id] || {}), ...copy(partial) };
      commit();
    },

    setChecklistItem(id, checked) {
      if (typeof id !== "string") throw new TypeError("setChecklistItem: invalid id");
      load().progress.checklist[id] = Boolean(checked);
      commit();
    },

    startFresh() {
      try {
        storage.removeItem(KEY);
      } catch {
        persistent = false;
      }
      record = freshRecord();
      notify();
    },

    isPersistent() {
      return persistent;
    },

    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
}

export const store = createStore(safeLocalStorage());
