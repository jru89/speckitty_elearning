// Tailoring rules: what each attendee sees (FR-004, FR-006, FR-021).
// Implements contracts/tailoring-contract.md. Pure: no DOM, no storage, no module registry.

export const KNOWN_DIMENSIONS = ["os", "chip", "device", "tool", "experience"];

// Main module order for suggestions; "terminal" is optional and suggested only for terminal-new.
export const MAIN_ORDER = ["words", "spec-driven", "setup", "ready"];
const VOCABULARY = ["words", "spec-driven"];

export function appliesTo(when, answers) {
  if (!when) return true;
  const dims = Object.keys(when);
  if (dims.length === 0) return true;
  // An unknown dimension is a content bug: never show the block.
  if (dims.some((d) => !KNOWN_DIMENSIONS.includes(d))) return false;
  if (answers === null || answers === undefined) return true;
  return dims.every((d) => {
    const allowed = when[d];
    if (!Array.isArray(allowed)) return false;
    if (d === "chip" && answers.chip === "unsure") return true;
    return allowed.includes(answers[d]);
  });
}

export function visibleBlocks(module, answers) {
  const blocks = (module && module.blocks) || [];
  return blocks.filter((b) => appliesTo(b.when, answers));
}

export function earlyStop(answers) {
  if (!answers) return null;
  if (answers.os === "mobile") return "mobile";
  if (answers.device === "work-locked") return "work-locked";
  return null;
}

export function suggestedNext(answers, progress) {
  const modules = (progress && progress.modules) || {};
  const notDone = (id) => modules[id] !== "done";

  if (earlyStop(answers)) {
    // Setup and ready can't succeed on this device: point at vocabulary only.
    // With every vocabulary module done, "words" stays the revisit target.
    return VOCABULARY.find(notDone) || VOCABULARY[0];
  }

  const experience = answers && answers.experience;
  if (experience === "agents-daily" && notDone("ready")) return "ready";
  if (experience === "terminal-new" && notDone("terminal")) return "terminal";
  return MAIN_ORDER.find(notDone) || "ready";
}
