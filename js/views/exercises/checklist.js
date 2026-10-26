// Checklist exercise (FR-019, FR-020; contracts/exercise-engine-contract.md): the ready check.
// Visible items are filtered with appliesTo. Completed = every visible item checked; unchecking undoes it
// (the module status itself stays done: store.setModuleStatus is forward-only).
// With config.summary, renders the one-line setup summary and "Copy my setup summary" (clipboard with a selection fallback).

import { appliesTo } from "../../lib/tailor.js";
import { buildSummary } from "../../lib/summary.js";
import { copyText } from "../../lib/clipboard.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function mount(container, exercise, ctx) {
  const { store, answers } = ctx;
  const config = exercise.config || {};
  const items = (Array.isArray(config.items) ? config.items : []).filter(
    (i) => i && typeof i.id === "string" && appliesTo(i.when, answers),
  );
  const visibleIds = items.map((i) => i.id);
  const abort = new AbortController();
  const { signal } = abort;
  const prefix = `check-${String(exercise.id).replace(/[^\w-]/g, "")}`;

  const root = el("div", "stack");
  const head = el("div");
  const h = el("h2", "cell-title", "Ready check");
  h.id = `${prefix}-title`;
  head.append(h, el("p", "", "Tick each item once it's true on the laptop you'll bring."));
  root.append(head);

  const list = el("ul", "stack");
  list.style.listStyle = "none";
  list.style.padding = "0";
  list.setAttribute("aria-labelledby", h.id);
  const checklist = store.getProgress().checklist;
  const boxes = items.map((item) => {
    const li = el("li");
    const label = el("label", "checkbox");
    const box = el("input");
    box.type = "checkbox";
    box.checked = checklist[item.id] === true;
    const text = el("span");
    text.innerHTML = String(item.label || ""); // trusted, repo-authored label
    label.append(box, text);
    li.append(label);
    list.append(li);
    box.addEventListener(
      "change",
      () => {
        store.setChecklistItem(item.id, box.checked);
        syncCompletion();
        updateSummary();
      },
      { signal },
    );
    return box;
  });
  root.append(list);

  const progressLine = el("p", "caption");
  progressLine.setAttribute("role", "status");
  root.append(progressLine);

  let summaryBox = null;
  let copyStatus = null;
  if (config.summary) {
    const part = el("div", "stack");
    part.style.marginTop = "var(--space-xl)";
    const sh = el("h3", "cell-title--sm", "Your setup summary");
    sh.id = `${prefix}-summary-title`;
    summaryBox = el("textarea", "input");
    summaryBox.readOnly = true;
    summaryBox.rows = 3;
    summaryBox.style.minHeight = "0";
    summaryBox.style.fontSize = ".9375rem";
    summaryBox.setAttribute("aria-labelledby", sh.id);
    const row = el("div", "row");
    const copy = el("button", "btn btn--primary", "Copy my setup summary");
    copy.type = "button";
    copyStatus = el("p", "caption");
    copyStatus.setAttribute("role", "status");
    row.append(copy);
    const note = el("p", "caption", "Nothing is sent automatically. Share it only if you want to.");
    part.append(sh, summaryBox, row, copyStatus, note);
    root.append(part);

    copy.addEventListener(
      "click",
      async () => {
        const result = await copyText(summaryBox.value, summaryBox);
        if (signal.aborted) return;
        copyStatus.textContent =
          result === "copied" ? "Copied, paste it in a message to your trainer." : "Selected, press Ctrl+C / Cmd+C to copy.";
      },
      { signal },
    );
  }
  container.append(root);

  function allChecked() {
    const state = store.getProgress().checklist;
    return visibleIds.length > 0 && visibleIds.every((id) => state[id] === true);
  }

  // Write only when the stored value differs, so the store subscription can't loop.
  function syncCompletion() {
    const completed = allChecked();
    const saved = store.getProgress().exercises[exercise.id];
    if (!saved || Boolean(saved.completed) !== completed) store.setExerciseState(exercise.id, { completed });
    const done = boxes.filter((b) => b.checked).length;
    progressLine.textContent = completed ? "All checks done. You're ready." : `${done} of ${boxes.length} checked.`;
  }

  function updateSummary() {
    if (!summaryBox) return;
    summaryBox.value = buildSummary(answers, store.getProgress(), visibleIds) || "";
    if (copyStatus) copyStatus.textContent = "";
  }

  syncCompletion(); // answers may have changed which items are visible since the last visit
  updateSummary();

  return {
    unmount() {
      abort.abort();
      root.remove();
    },
  };
}
