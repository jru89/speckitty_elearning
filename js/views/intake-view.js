// Intake (FR-002, FR-003, FR-005, FR-006; NFR-002): five questions on one page, chip only when it matters.
// View contract (js/app.js): render(main, params, ctx).

import { QUESTIONS, CHIP_HINTS, CHIP_OPTIONS, normalizeAnswers } from "../data/intake.js";
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

function buildChoice(q, opt, current, errorId) {
  const label = el("label", "choice");
  label.dataset.value = opt.value;
  const input = document.createElement("input");
  input.type = "radio";
  input.name = q.id;
  input.value = opt.value;
  input.setAttribute("aria-describedby", errorId);
  if (current[q.id] === opt.value) input.checked = true;
  const text = el("span", "choice__text");
  const name = el("span", "choice__label", opt.label);
  name.id = `intake-${q.id}-${opt.value}-label`;
  text.append(name);
  const labelledBy = [name.id];
  if (q.id === "tool") {
    const tool = toolById(opt.value);
    if (tool && tool.demo) {
      const tag = el("span", "chip-label", "Used in the demo");
      tag.id = `${name.id}-demo`;
      tag.style.marginTop = "4px";
      text.append(tag);
      labelledBy.push(tag.id);
    }
  }
  // Always render the hint slot, so the chip question can fill it per OS.
  const hintId = `intake-${q.id}-${opt.value}-hint`;
  const hint = el("span", "choice__hint", opt.hint || "");
  hint.id = hintId;
  hint.hidden = !opt.hint;
  text.append(hint);
  input.setAttribute("aria-labelledby", labelledBy.join(" "));
  input.setAttribute("aria-describedby", `${hintId} ${errorId}`);
  label.append(input, text);
  return label;
}

function buildFieldset(q, current, index) {
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

  // Less common choices (more tools) sit in a fold, so the first screen stays short.
  const main = q.options.filter((o) => !o.more);
  const more = q.options.filter((o) => o.more);
  for (const opt of main) fs.append(buildChoice(q, opt, current, errorId));
  if (more.length) {
    const fold = el("details", "more-choices");
    fold.append(el("summary", "", `More supported tools (${more.length})`));
    const inner = el("div", "choice-group");
    for (const opt of more) inner.append(buildChoice(q, opt, current, errorId));
    fold.append(inner);
    if (more.some((o) => o.value === current[q.id])) fold.open = true;
    fs.append(fold);
  }
  fs.setAttribute("aria-describedby", errorId);
  // The cell is the box; the fieldset inside keeps its legend at the top instead of on the border.
  const cell = el("div", "cell intake-q");
  cell.dataset.step = String(index + 1);
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
    el("p", "lead", "Five quick questions, so the course only shows what fits you and your computer. You can change them any time."),
  );

  const form = el("form", "stack intake-form");
  form.noValidate = true;
  form.setAttribute("aria-label", "Your setup");

  const fieldsets = {};
  QUESTIONS.forEach((q, i) => {
    fieldsets[q.id] = buildFieldset(q, current, i);
    form.append(fieldsets[q.id]);
  });

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
    // Word and order the chip answers for this OS (e.g. Snapdragon on Windows, Apple Silicon on a Mac).
    const chipOptions = CHIP_OPTIONS[sofar.os];
    if (chipOptions) {
      chipOptions.forEach((opt, order) => {
        const choice = fieldsets.chip.querySelector(`.choice[data-value="${opt.value}"]`);
        if (!choice) return;
        choice.style.order = String(order + 1);
        choice.querySelector(".choice__label").textContent = opt.label;
        const h = choice.querySelector(".choice__hint");
        h.textContent = opt.hint || "";
        h.hidden = !opt.hint;
      });
    }
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
