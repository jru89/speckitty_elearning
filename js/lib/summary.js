// One-line setup summary the attendee may copy to the trainer (FR-020; data-model.md "Setup summary").
// Pure. Contains only intake labels and ready-check status: no free text, names, ids or dates.

import { ANSWER_LABELS } from "../data/intake.js";
import { toolById } from "../data/tools.js";

const SEPARATOR = " · ";

function chipLabel(answers) {
  if (answers.chip === "unsure") return null;
  if (answers.os === "macos" && answers.chip === "arm") return "Apple Silicon";
  return ANSWER_LABELS.chip[answers.chip] || null;
}

function toolLabel(tool) {
  if (tool === "other") return "Other tool";
  if (tool === "undecided") return "no tool chosen yet";
  const entry = toolById(tool);
  return entry ? entry.name : "Other tool";
}

function statusLabel(progress, visibleChecklistIds) {
  const ids = visibleChecklistIds || [];
  const checklist = (progress && progress.checklist) || {};
  const done = ids.filter((id) => checklist[id] === true).length;
  if (ids.length > 0 && done === ids.length) return "all checks passed";
  return `${done} of ${ids.length} checks done`;
}

export function buildSummary(answers, progress, visibleChecklistIds) {
  if (!answers) return null;
  const parts = [
    ANSWER_LABELS.os[answers.os],
    chipLabel(answers),
    ANSWER_LABELS.device[answers.device],
    toolLabel(answers.tool),
    ANSWER_LABELS.experience[answers.experience],
    statusLabel(progress, visibleChecklistIds),
  ];
  return parts.filter(Boolean).join(SEPARATOR);
}
