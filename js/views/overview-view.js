// Course overview (FR-006, FR-007, FR-021, FR-023): modules as a bento grid where size encodes importance.
// View contract (js/app.js): render(main, params, ctx); returns the store unsubscribe as cleanup.

import { loadAll } from "../data/modules/index.js";
import { ANSWER_LABELS } from "../data/intake.js";
import { toolById } from "../data/tools.js";
import { earlyStop, suggestedNext } from "../lib/tailor.js";
import { session } from "../data/welcome.js";

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
  mobile: "This setup needs a laptop or desktop. You can still read the modules here, but please tell your trainer before the session so they can help.",
  "work-locked":
    "Your laptop doesn't let you install software. Ask your IT department for Git, Python 3.11+ and an AI coding tool, or use a personal laptop, and tell your trainer before the session.",
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

function statusChip(status) {
  if (status === "done") return el("span", "chip chip--done", "Done");
  if (status === "in_progress") return el("span", "chip", "In progress");
  return null;
}

function moduleCell(entry, { status, suggested, extraClass = "", hero = false, answers }) {
  const data = entry.module;
  const info = data || FALLBACK[entry.id] || { title: entry.id, summary: "" };
  const available = Boolean(data);

  const cell = el(available ? "a" : "div", `cell ${extraClass}`.trim());
  if (available && MODULE_COLOUR[entry.id]) cell.classList.add(`cell--${MODULE_COLOUR[entry.id]}`);
  if (available) {
    cell.classList.add("cell--link");
    cell.href = `#/m/${encodeURIComponent(entry.id)}`;
  } else {
    cell.classList.add("cell--soon");
  }
  if (suggested) cell.classList.add("cell--suggested");

  const chips = el("div", "row");
  chips.style.gap = "var(--space-sm)";
  if (entry.optional) chips.append(el("span", "chip chip--optional", "Optional"));
  if (!available) chips.append(el("span", "chip", "Coming soon"));
  if (suggested) chips.append(el("span", "chip chip--next", "Suggested next"));
  const sc = available ? statusChip(status) : null;
  if (sc) chips.append(sc);

  const heading = el("h2", hero ? "cell-title cell-title--lg" : "cell-title", info.title);
  cell.append(heading);
  if (hero && answers) {
    const readout = el("p", "stat__value", machineReadout(answers));
    readout.style.fontSize = "clamp(1.75rem, 4vw, 2.75rem)";
    readout.style.lineHeight = "1.1";
    readout.style.letterSpacing = "-1.5px";
    cell.append(readout);
  }
  if (info.summary) cell.append(el("p", "", info.summary));
  const minutes = available && Number.isFinite(data.minutes) ? `About ${data.minutes} min` : "";
  if (minutes) cell.append(el("p", "caption", minutes));
  if (chips.childElementCount) cell.append(chips);
  return cell;
}

function stopBanner(kind) {
  const banner = el("div", "banner banner--stop");
  banner.setAttribute("role", "alert");
  banner.append(el("p", "banner__title", "Talk to your trainer before the session"));
  const body = el("p", "banner__body", STOP_TEXT[kind]);
  const contact = typeof session.trainerContact === "string" ? session.trainerContact.trim() : "";
  if (contact) {
    body.append(" Trainer contact: ");
    const c = el("strong", "", contact);
    c.style.userSelect = "all";
    body.append(c);
  }
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

  // Head: title and the suggested next step as the one primary action.
  const head = el("header");
  head.append(el("h1", "page-title", "Your course"));
  head.append(el("p", "lead", "Do the modules in any order. Your progress stays on this device."));
  const nextEntry = next ? byId[next] : null;
  if (finished) {
    head.append(el("p", "lead", "You've done every module. See you in the session."));
  } else if (nextEntry) {
    const nextTitle = (nextEntry.module || FALLBACK[next] || { title: next }).title;
    const row = el("div", "row");
    row.style.marginTop = "var(--space-lg)";
    if (nextEntry.module) {
      const btn = el("a", "btn btn--primary", `Next: ${nextTitle}`);
      btn.href = `#/m/${encodeURIComponent(next)}`;
      row.append(btn);
    } else {
      const btn = el("span", "btn btn--primary", `Next: ${nextTitle} (coming soon)`);
      btn.setAttribute("aria-disabled", "true");
      row.append(btn);
    }
    head.append(row);
  }
  stack.append(head);

  // Grid (4 columns): setup 2x2 | words | spec-driven / progress | your setup; ready 2x1 | terminal | start fresh.
  const grid = el("div", "bento");
  const opts = (id, extra = {}) => ({ status: statuses[id], suggested: next === id, answers, ...extra });

  if (byId.setup) grid.append(moduleCell(byId.setup, opts("setup", { extraClass: "hero-cell", hero: true })));
  if (byId.words) grid.append(moduleCell(byId.words, opts("words")));
  if (byId["spec-driven"]) grid.append(moduleCell(byId["spec-driven"], opts("spec-driven")));

  // Progress: main (non-optional) modules only.
  const main4 = entries.filter((e) => !e.optional);
  const done = main4.filter((e) => statuses[e.id] === "done").length;
  const pct = main4.length ? Math.round((done / main4.length) * 100) : 0;
  const stat = el("section", "cell stat");
  stat.setAttribute("aria-label", "Progress");
  const statText = el("div");
  statText.append(el("p", "stat__value", `${done} of ${main4.length}`), el("p", "stat__label", "modules done"));
  const bar = el("div", "progress-bar");
  bar.style.setProperty("--value", String(pct));
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", String(main4.length));
  bar.setAttribute("aria-valuenow", String(done));
  bar.setAttribute("aria-label", `${done} of ${main4.length} modules done`);
  bar.append(el("span"));
  stat.append(statText, bar);
  grid.append(stat);

  // Your setup
  const mine = el("section", "cell");
  mine.setAttribute("aria-labelledby", "overview-mine");
  const mh = el("h2", "cell-title", "Your setup");
  mh.id = "overview-mine";
  const change = el("a", "", "Change");
  change.href = "#/intake";
  change.setAttribute("aria-label", "Change my answers");
  mine.append(mh, el("p", "", shortLabels(answers)), change);
  grid.append(mine);

  if (byId.ready) grid.append(moduleCell(byId.ready, opts("ready", { extraClass: "span-2" })));
  if (byId.terminal) grid.append(moduleCell(byId.terminal, opts("terminal")));
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
