// Intake (FR-002, FR-003, FR-005, FR-006; NFR-002): five questions on one page, chip only when it matters.
// View contract (js/app.js): render(main, params, ctx).

import { QUESTIONS, CHIP_HINTS, normalizeAnswers } from "../data/intake.js";
import { toolById } from "../data/tools.js";

export function title(params, { store }) {
  return store.getAnswers() ? "Change your answers" : "Your setup";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Pre-fill from saved answers (FR-005). Invalid or old records read as null, so the form starts empty.
// A chip of "unsure" that was forced because the saved OS never asked the chip question is
// not pre-filled, so switching to an OS that does ask it starts with the question unanswered.
function prefillSource(store) {
  const saved = store.getAnswers();
  if (!saved) return {};
  const chipQuestion = QUESTIONS.find((q) => q.id === "chip");
  if (chipQuestion && chipQuestion.askIf && !chipQuestion.askIf(saved)) {
    const { chip, ...rest } = saved;
    return rest;
  }
  return saved;
}

function readForm(form) {
  const data = new FormData(form);
  const out = {};
  for (const q of QUESTIONS) {
    const v = data.get(q.id);
    if (typeof v === "string") out[q.id] = v;
  }
  return out;
}

function buildFieldset(q, current) {
  const fs = el("fieldset", "choice-group");
  fs.dataset.question = q.id;
  const legend = el("legend", "", q.label);
  fs.append(legend);

  const errorId = `intake-${q.id}-error`;
  const error = el("p", "field-error", "");
  error.id = errorId;
  error.hidden = true;
  error.setAttribute("role", "alert");

  if (q.id === "chip") {
    const help = el("details", "caption");
    const summary = el("summary", "", "How do I check?");
    summary.style.cursor = "pointer";
    const hint = el("p", "caption");
    hint.dataset.chipHint = "";
    help.append(summary, hint);
    fs.append(help);
  }

  fs.append(error);

  for (const opt of q.options) {
    const label = el("label", "choice");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = q.id;
    input.value = opt.value;
    input.setAttribute("aria-describedby", errorId);
    if (current[q.id] === opt.value) input.checked = true;
    const text = el("span", "choice__text");
    const name = el("span", "choice__label", opt.label);
    text.append(name);
    if (q.id === "tool") {
      const tool = toolById(opt.value);
      if (tool && tool.demo) {
        const tag = el("span", "chip-label", "Used in the demo");
        tag.style.marginTop = "4px";
        text.append(tag);
      }
    }
    if (opt.hint) {
      // Name the radio by its label; the cost note is read as its description.
      const hintId = `intake-${q.id}-${opt.value}-hint`;
      const hint = el("span", "choice__hint", opt.hint);
      hint.id = hintId;
      text.append(hint);
      name.id = `intake-${q.id}-${opt.value}-label`;
      input.setAttribute("aria-labelledby", name.id + (text.querySelector(".chip-label") ? ` ${name.id}-demo` : ""));
      const demo = text.querySelector(".chip-label");
      if (demo) demo.id = `${name.id}-demo`;
      input.setAttribute("aria-describedby", `${hintId} ${errorId}`);
    }
    label.append(input, text);
    fs.append(label);
  }
  fs.setAttribute("aria-describedby", errorId);
  // The cell is the box; the fieldset inside keeps its legend at the top instead of on the border.
  const cell = el("div", "cell");
  cell.append(fs);
  return cell;
}

export function render(main, params, ctx) {
  const { store, navigate } = ctx;
  const editing = store.getAnswers() !== null;
  const current = prefillSource(store);

  const wrap = el("div", "container container--reading");
  const head = el("header", "section-head");
  head.append(
    el("h1", "page-title", editing ? "Change your answers" : "Tell us about your setup"),
    el("p", "lead", "Five quick questions, so the course only shows the steps for your machine. You can change them any time."),
  );

  const form = el("form", "stack");
  form.noValidate = true;
  form.setAttribute("aria-label", "Your setup");

  const fieldsets = {};
  for (const q of QUESTIONS) {
    fieldsets[q.id] = buildFieldset(q, current);
    form.append(fieldsets[q.id]);
  }

  const submitRow = el("div", "row");
  const submit = el("button", "btn btn--primary", editing ? "Save my answers" : "Show my course");
  submit.type = "submit";
  submitRow.append(submit);
  if (editing) {
    const cancel = el("a", "btn btn--ghost", "Cancel");
    cancel.href = "#/course";
    submitRow.append(cancel);
  }
  form.append(submitRow);

  function syncChip() {
    const sofar = readForm(form);
    for (const q of QUESTIONS) {
      if (typeof q.askIf !== "function") continue;
      const show = Boolean(q.askIf(sofar));
      const cell = fieldsets[q.id];
      cell.hidden = !show;
      cell.querySelector("fieldset").disabled = !show; // a hidden question never submits a stale value
    }
    const hint = form.querySelector("[data-chip-hint]");
    if (hint) hint.textContent = CHIP_HINTS[sofar.os] || "";
  }

  function clearError(id) {
    const err = fieldsets[id] && fieldsets[id].querySelector(".field-error");
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }
  }

  form.addEventListener("change", (e) => {
    if (e.target && e.target.name) clearError(e.target.name);
    if (e.target && e.target.name === "os") syncChip();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const values = readForm(form);
    const answers = normalizeAnswers(values);
    if (answers) {
      store.setAnswers(answers);
      navigate("/course");
      return;
    }
    // Mark every visible, unanswered question; focus the first.
    let first = null;
    for (const q of QUESTIONS) {
      const fs = fieldsets[q.id];
      if (fs.hidden) continue; // the chip cell, when not asked
      const err = fs.querySelector(".field-error");
      if (values[q.id]) {
        clearError(q.id);
        continue;
      }
      err.textContent = "Please pick one answer here.";
      err.hidden = false;
      if (!first) first = fs;
    }
    if (first) {
      // Scroll clear of the sticky header, then focus the question's first radio.
      window.scrollTo(0, Math.max(0, first.getBoundingClientRect().top + window.scrollY - 72));
      const radio = first.querySelector("input");
      if (radio) radio.focus({ preventScroll: true });
    }
  });

  syncChip();
  wrap.append(head, form);
  main.append(wrap);
}
