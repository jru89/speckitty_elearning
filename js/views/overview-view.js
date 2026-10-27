// Course overview (FR-006, FR-007, FR-021, FR-023): modules as a bento grid where size encodes importance.
// View contract (js/app.js): render(main, params, ctx); returns the store unsubscribe as cleanup.

import { loadAll } from "../data/modules/index.js";
import { ANSWER_LABELS } from "../data/intake.js";
import { toolById } from "../data/tools.js";
import { earlyStop, suggestedNext, MAIN_ORDER } from "../lib/tailor.js";

export const title = "Course overview";

// Shown while a module file hasn't landed yet ("Coming soon" cells).
// Module colours (css/style.css .cell--*): one per module, as on the module pages.
const MODULE_COLOUR = { words: "blue", "spec-driven": "purple", setup: "green", ready: "orange", terminal: "teal" };

const FALLBACK = {
  terminal: { title: "Terminal in 5 minutes", summary: "Just enough terminal to follow the setup steps." },
  words: { title: "Words you'll hear", summary: "The terms the trainer will use, in plain language." },
  "spec-driven": { title: "Vibe coding vs spec-driven", summary: "Why loose prompting breaks down, and the flow Spec Kitty uses." },
  setup: { title: "Get set up", summary: "Your editor and AI tool, a class workspace, and a prompt that installs the rest." },
  ready: { title: "Ready check", summary: "A short checklist so you walk in ready." },
};

const STOP_TEXT = {
  mobile: "This setup needs a laptop or desktop. You can still read the modules here, but please say so in the WhatsApp group before the session, so the trainer can help.",
  "work-locked":
    "Your laptop doesn't let you install software. Ask your IT department for Git, Python 3.11+ and an AI coding tool, or use a personal laptop, and say so in the WhatsApp group before the session.",
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Capitalise all-lowercase labels ("tablet or phone") but keep brand casing ("macOS").
const cap = (s) => (s && s === s.toLowerCase() ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function toolName(id) {
  if (id === "other") return "another tool";
  if (id === "undecided") return "no tool picked yet";
  const t = toolById(id);
  return t ? t.name : id;
}

// Big readout in the setup cell, e.g. "macOS, Apple Silicon, Cursor".
function machineReadout(a) {
  const parts = [cap(ANSWER_LABELS.os[a.os] || a.os)];
  if (a.chip === "arm") parts.push(a.os === "macos" ? "Apple Silicon" : "ARM");
  else if (a.chip === "x64") parts.push("Intel/AMD");
  parts.push(cap(toolName(a.tool)));
  return parts.join(", ");
}

function shortLabels(a) {
  const parts = [ANSWER_LABELS.os[a.os]];
  if (ANSWER_LABELS.chip[a.chip]) parts.push(ANSWER_LABELS.chip[a.chip]);
  parts.push(ANSWER_LABELS.device[a.device], toolName(a.tool), ANSWER_LABELS.experience[a.experience]);
  return parts.filter(Boolean).join(" · ");
}

// One numbered step on the path. `step` is 1-4 for the main modules, null for the optional primer.
function stepTile(entry, { step, status, isNext, answers }) {
  const data = entry.module;
  const info = data || FALLBACK[entry.id] || { title: entry.id, summary: "" };
  const available = Boolean(data);

  const tile = el(available ? "a" : "div", "cell path-step");
  if (available && MODULE_COLOUR[entry.id]) tile.classList.add(`cell--${MODULE_COLOUR[entry.id]}`);
  if (available) {
    tile.classList.add("cell--link");
    tile.href = `#/m/${encodeURIComponent(entry.id)}`;
  } else {
    tile.classList.add("cell--soon");
  }
  if (isNext) tile.classList.add("cell--suggested");
  if (status === "done") tile.classList.add("is-done");

  const top = el("div", "path-step__top");
  const badge = el("span", "path-step__num", status === "done" ? "✓" : step ? String(step) : "+");
  badge.setAttribute("aria-hidden", "true");
  const state = !available
    ? el("span", "chip", "Coming soon")
    : status === "done"
      ? el("span", "chip chip--done", "Done")
      : isNext
        ? el("span", "chip chip--next", "Up next")
        : status === "in_progress"
          ? el("span", "chip", "In progress")
          : null;
  top.append(badge);
  if (state) top.append(state);
  tile.append(top);

  const label = step ? `Step ${step}` : "Optional warm-up";
  tile.append(el("p", "path-step__kicker", label));
  tile.append(el("h2", "cell-title", info.title));
  if (entry.id === "setup" && answers) tile.append(el("p", "path-step__machine", machineReadout(answers)));
  if (info.summary) tile.append(el("p", "", info.summary));
  if (available && Number.isFinite(data.minutes)) tile.append(el("p", "caption", `About ${data.minutes} min`));
  tile.setAttribute("aria-label", `${label}: ${info.title}${status === "done" ? ", done" : isNext ? ", up next" : ""}`);
  return tile;
}

function stopBanner(kind) {
  const banner = el("div", "banner banner--stop");
  banner.setAttribute("role", "alert");
  banner.append(el("p", "banner__title", "Let the group know before the session"));
  const body = el("p", "banner__body", STOP_TEXT[kind]);
  banner.append(body);
  return banner;
}

function startFreshCell(ctx) {
  const cell = el("section", "cell");
  cell.setAttribute("aria-labelledby", "overview-fresh");
  const h = el("h2", "cell-title", "Not you?");
  h.id = "overview-fresh";
  const p = el("p", "", "On a shared computer, start fresh to clear these answers and progress.");
  const btn = el("button", "btn btn--secondary", "Start fresh");
  btn.type = "button";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "overview-confirm");

  const confirm = el("div", "confirm");
  confirm.id = "overview-confirm";
  confirm.hidden = true;
  confirm.append(el("p", "confirm__title", "Start fresh?"), el("p", "confirm__body", "This clears your answers and progress on this device."));
  const actions = el("div", "confirm__actions");
  const yes = el("button", "btn btn--primary", "Clear");
  yes.type = "button";
  const no = el("button", "btn btn--ghost", "Cancel");
  no.type = "button";
  actions.append(yes, no);
  confirm.append(actions);

  btn.addEventListener("click", () => {
    const show = confirm.hidden;
    confirm.hidden = !show;
    btn.setAttribute("aria-expanded", String(show));
    if (show) yes.focus();
  });
  no.addEventListener("click", () => {
    confirm.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  });
  yes.addEventListener("click", () => {
    ctx.store.startFresh();
    ctx.navigate("/intake");
  });

  cell.append(h, p, btn, confirm);
  return cell;
}

function draw(main, entries, ctx) {
  const answers = ctx.store.getAnswers();
  if (!answers) return; // the router sends the attendee to the intake
  const progress = ctx.store.getProgress();
  const statuses = progress.modules || {};
  // suggestedNext falls back to a finished module once everything is done; show no suggestion then.
  const candidate = suggestedNext(answers, progress);
  const finished = statuses[candidate] === "done";
  const next = finished ? null : candidate;
  const stop = earlyStop(answers);
  const byId = Object.fromEntries(entries.map((e) => [e.id, e]));

  const wrap = el("div", "container");
  const stack = el("div", "stack");

  if (stop) stack.append(stopBanner(stop));

  // The path: the four main modules in order, numbered. The optional primer sits apart, as a warm-up.
  const path = MAIN_ORDER.map((id) => byId[id]).filter(Boolean);
  const stepOf = (id) => {
    const i = MAIN_ORDER.indexOf(id);
    return i === -1 ? null : i + 1;
  };
  const totalMinutes = path.reduce((sum, e) => sum + (e.module && Number.isFinite(e.module.minutes) ? e.module.minutes : 0), 0);
  const doneCount = path.filter((e) => statuses[e.id] === "done").length;

  // Head: one primary action that names the step to do now.
  const head = el("header");
  head.append(el("h1", "page-title", "Your course"));
  head.append(
    el(
      "p",
      "lead",
      `${path.length} short steps, in this order. About ${totalMinutes} minutes in total, and you can stop and come back any time.`,
    ),
  );
  const nextEntry = next ? byId[next] : null;
  if (finished) {
    head.append(el("p", "lead", "You've done every step. See you in the session!"));
  } else if (nextEntry) {
    const nextTitle = (nextEntry.module || FALLBACK[next] || { title: next }).title;
    const step = stepOf(next);
    const verb = doneCount === 0 && (statuses[next] || "not_started") === "not_started" ? "Start" : "Continue";
    const label = step ? `${verb}: ${step}. ${nextTitle}` : `${verb}: ${nextTitle} (optional warm-up)`;
    const row = el("div", "row");
    row.style.marginTop = "var(--space-lg)";
    if (nextEntry.module) {
      const btn = el("a", "btn btn--primary btn--lg", `${label} →`);
      btn.href = `#/m/${encodeURIComponent(next)}`;
      row.append(btn);
    } else {
      const btn = el("span", "btn btn--primary btn--lg", `${label} (coming soon)`);
      btn.setAttribute("aria-disabled", "true");
      row.append(btn);
    }
    head.append(row);
  }
  stack.append(head);

  const pathList = el("ol", "path");
  pathList.setAttribute("aria-label", "Your course, in order");
  for (const entry of path) {
    const li = el("li", "path__item");
    li.append(stepTile(entry, { step: stepOf(entry.id), status: statuses[entry.id], isNext: next === entry.id, answers }));
    pathList.append(li);
  }
  stack.append(pathList);

  if (byId.terminal) {
    const warm = el("section", "path-extra");
    warm.setAttribute("aria-label", "Optional warm-up");
    const newToTerminal = answers.experience === "terminal-new" || answers.experience === "no-code";
    warm.append(
      el(
        "p",
        "path-extra__note",
        newToTerminal
          ? "Never used a terminal? Do this short warm-up before step 2."
          : "Optional: a short terminal warm-up, if you'd like one before step 2.",
      ),
    );
    warm.append(stepTile(byId.terminal, { step: null, status: statuses.terminal, isNext: next === "terminal", answers }));
    stack.append(warm);
  }

  // About you: progress, your answers and "start fresh", kept quiet so they don't compete with the path.
  const about = el("h2", "section-label", "About you");
  stack.append(about);
  const grid = el("div", "bento bento--quiet");

  const pct = path.length ? Math.round((doneCount / path.length) * 100) : 0;
  const stat = el("section", "cell stat");
  stat.setAttribute("aria-label", "Progress");
  const statText = el("div");
  statText.append(el("p", "stat__value", `${doneCount} of ${path.length}`), el("p", "stat__label", "steps done"));
  const bar = el("div", "progress-bar");
  bar.style.setProperty("--value", String(pct));
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", String(path.length));
  bar.setAttribute("aria-valuenow", String(doneCount));
  bar.setAttribute("aria-label", `${doneCount} of ${path.length} steps done`);
  bar.append(el("span"));
  stat.append(statText, bar);
  grid.append(stat);

  const mine = el("section", "cell span-2");
  mine.setAttribute("aria-labelledby", "overview-mine");
  const mh = el("h2", "cell-title", "Your setup");
  mh.id = "overview-mine";
  const change = el("a", "", "Change my answers");
  change.href = "#/intake";
  mine.append(mh, el("p", "", shortLabels(answers)), change);
  grid.append(mine);

  grid.append(startFreshCell(ctx));

  stack.append(grid);
  wrap.append(stack);
  main.replaceChildren(wrap);
}

export async function render(main, params, ctx) {
  // Module files load asynchronously; if the attendee navigates away meanwhile,
  // stop drawing so this view never paints over the next page.
  const route = window.location.hash;
  const stillHere = () => window.location.hash === route;
  const entries = await loadAll();
  if (!stillHere()) return undefined;
  draw(main, entries, ctx);
  const unsubscribe = ctx.store.subscribe(() => {
    if (!stillHere()) {
      unsubscribe();
      return;
    }
    try {
      draw(main, entries, ctx);
    } catch (err) {
      console.warn("Overview re-render failed", err);
    }
  });
  return unsubscribe;
}
