// Module page (FR-004, FR-015, FR-025): one generic view renders every module's tailored blocks and its exercise.
// View contract (js/app.js): render(main, params, ctx); returns a cleanup that unsubscribes and unmounts.
// Block `body` is trusted repo HTML (innerHTML); anything derived from answers or tool names uses textContent.

import { loadModule, MODULES } from "../data/modules/index.js";
import { recommendedTools, otherTools, toolById } from "../data/tools.js";
import { visibleBlocks } from "../lib/tailor.js";
import { enhanceCodeBlocks } from "../lib/enhance.js";

export function title(params) {
  const id = params && params.id;
  return cachedTitles[id] || "Module";
}
const cachedTitles = {};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function link(href, className, text) {
  const a = el("a", className, text);
  a.href = href;
  return a;
}

// ------------------------------------------------------------------ Pager

// Previous/next among the main (non-optional) modules; the optional terminal primer leads into the first one.
function neighbours(id) {
  const main = MODULES.filter((m) => !m.optional).map((m) => m.id);
  const i = main.indexOf(id);
  if (i === -1) return { prev: null, next: main[0] || null };
  return { prev: main[i - 1] || null, next: main[i + 1] || null };
}

function pagerLink(id, mod, rel) {
  const label = rel === "prev" ? "Previous" : "Next";
  if (!mod) return null;
  const a = link(`#/m/${encodeURIComponent(id)}`, rel === "next" ? "btn btn--primary" : "btn btn--secondary", "");
  a.rel = rel;
  a.append(el("span", "visually-hidden", `${label} module: `));
  a.append(document.createTextNode(rel === "prev" ? `← ${mod.title}` : `${mod.title} →`));
  return a;
}

function pager(id, near) {
  const nav = el("nav", "row");
  nav.setAttribute("aria-label", "Module navigation");
  nav.style.marginTop = "var(--space-2xl)";
  const prev = near.prev ? pagerLink(near.prev.id, near.prev.mod, "prev") : null;
  const next = near.next ? pagerLink(near.next.id, near.next.mod, "next") : null;
  if (prev) nav.append(prev);
  if (next) nav.append(next);
  nav.append(link("#/course", "btn btn--ghost", "Back to the course"));
  return nav;
}

// ------------------------------------------------------------------ Blocks

function toolCard(t, onPick) {
  const li = el("li", "tool-card");
  const name = el("h3", "cell-title--sm", t.name);
  li.append(name);
  if (t.demo) li.append(el("span", "chip chip--next", "Used in the demo"));
  if (t.pitch) li.append(el("p", "", t.pitch));
  li.append(el("p", "caption", t.costNote));
  const btn = el("button", "btn btn--secondary", "Use this tool");
  btn.type = "button";
  btn.setAttribute("aria-label", `Use ${t.name}`);
  btn.addEventListener("click", () => onPick(t.id));
  li.append(btn);
  return li;
}

// Recommended tools first; the rest sit in a fold so a newcomer isn't faced with 13 choices.
function toolChooser(onPick) {
  const intro = el("p", "", "Pick one and the steps below switch to it. You can change it later under Menu → Change my answers.");
  const list = el("ul", "tool-grid");
  for (const t of recommendedTools) list.append(toolCard(t, onPick));
  const fold = el("details", "more-choices");
  fold.append(el("summary", "", `More supported tools (${otherTools.length})`));
  const more = el("ul", "tool-grid");
  for (const t of otherTools) more.append(toolCard(t, onPick));
  fold.append(more);
  return [intro, list, fold];
}

function commandStyle(answers) {
  const p = el("p");
  const t = toolById(answers.tool);
  if (!t) {
    p.append("Commands look slightly different in each tool; the trainer will show the Claude Code form, ");
    p.append(el("code", "", "/spec-kitty.specify"));
    p.append(".");
    return [p];
  }
  p.append(`In ${t.name}, Spec Kitty commands look like `);
  p.append(el("code", "", t.commandStyle));
  p.append(". The trainer uses Claude Code (");
  p.append(el("code", "", "/spec-kitty.specify"));
  p.append(").");
  return [p];
}

function renderBlock(block, index, answers, ctx, onPick) {
  const kind = typeof block.kind === "string" ? block.kind : "";
  const section = el("section", kind ? `block block--${kind}` : "block");
  section.dataset.blockId = block.id || String(index);
  section.tabIndex = -1; // focus target after the tool chooser is replaced

  if (answers.chip === "unsure" && block.chipLabel) {
    section.append(el("span", "chip-label", `For ${block.chipLabel} chips`));
  }

  let heading = block.heading;
  if (!heading && kind === "tool-chooser") heading = "Pick an AI coding tool";
  if (!heading && kind === "command-style") heading = "How commands look in your tool";
  if (heading) {
    const h = el("h2", "", heading);
    h.id = `block-${section.dataset.blockId}`;
    section.setAttribute("aria-labelledby", h.id);
    section.append(h);
  }

  if (kind === "tool-chooser") {
    section.append(...toolChooser(onPick));
  } else if (kind === "command-style") {
    section.append(...commandStyle(answers));
  } else if (typeof block.body === "string") {
    const tpl = document.createElement("template");
    tpl.innerHTML = block.body.replaceAll("{{SITE}}", SITE); // trusted, repo-authored HTML
    section.append(tpl.content);
  }
  return section;
}

// The course's own address (works locally and under the GitHub Pages sub-path), for script links.
const SITE = new URL("./", window.location.href).href;

const GROUP_LABELS = { manual: "Do it by hand instead" };
const openGroups = new Set(); // remembers which folds the attendee opened, across redraws

// Wrap runs of blocks that share a `group` in one <details>, so optional detail stays out of the way.
function groupBlocks(nodes, blocks) {
  const out = [];
  let fold = null;
  nodes.forEach((node, i) => {
    const group = blocks[i].group;
    if (!group) {
      fold = null;
      out.push(node);
      return;
    }
    if (!fold || fold.dataset.group !== group) {
      fold = el("details", "block-group");
      fold.dataset.group = group;
      fold.open = openGroups.has(group);
      fold.addEventListener("toggle", () => (fold.open ? openGroups.add(group) : openGroups.delete(group)));
      const summary = el("summary", "", GROUP_LABELS[group] || group);
      const inner = el("div", "stack block-group__body");
      fold.append(summary, inner);
      out.push(fold);
    }
    fold.lastElementChild.append(node);
  });
  return out;
}

// ------------------------------------------------------------------ Page

function header(mod) {
  const head = el("header", "module-head");
  head.append(link("#/course", "caption", "← Your course"));
  const h1 = el("h1", "page-title", mod.title);
  h1.style.marginTop = "var(--space-md)";
  head.append(h1);
  const meta = el("div", "row");
  meta.style.gap = "var(--space-sm)";
  if (mod.optional) meta.append(el("span", "chip chip--optional", "Optional"));
  if (Number.isFinite(mod.minutes)) meta.append(el("span", "chip", `About ${mod.minutes} min`));
  if (meta.childElementCount) head.append(meta);
  if (mod.summary) {
    const lead = el("p", "lead", mod.summary);
    lead.style.marginTop = "var(--space-md)";
    head.append(lead);
  }
  return head;
}

function unavailable(main) {
  const wrap = el("div", "container container--reading");
  const cell = el("div", "cell placeholder");
  cell.append(el("h1", "cell-title", "This module isn't available yet"));
  cell.append(el("p", "", "It's still being written. The other modules are ready for you."));
  cell.append(link("#/course", "btn btn--secondary", "Back to the course"));
  wrap.append(cell);
  main.replaceChildren(wrap);
}

export async function render(main, params, ctx) {
  const id = params && params.id;
  const route = window.location.hash;
  const stillHere = () => window.location.hash === route;

  const near = neighbours(id);
  const [mod, prevMod, nextMod] = await Promise.all([
    loadModule(id),
    near.prev ? loadModule(near.prev) : null,
    near.next ? loadModule(near.next) : null,
  ]);
  if (!stillHere()) return undefined;
  if (!mod) {
    unavailable(main);
    return undefined;
  }
  cachedTitles[id] = mod.title;
  const nearMods = {
    prev: near.prev ? { id: near.prev, mod: prevMod } : null,
    next: near.next ? { id: near.next, mod: nextMod } : null,
  };

  const { store } = ctx;
  const exercise = mod.exercise && typeof mod.exercise === "object" ? mod.exercise : null;
  let engine = null; // { unmount() }
  let engineLoad = null; // the engine module, loaded once
  let lastAnswersKey = "";
  let alive = true;
  let mountToken = 0;

  const wrap = el("div", "container container--reading");
  wrap.dataset.module = id; // module colour (css/style.css)
  const stack = el("div", "stack");
  const blocksHost = el("div", "stack blocks");
  const exerciseHost = el("section", "exercise");
  exerciseHost.setAttribute("aria-label", "Exercise");
  wrap.append(stack);
  stack.append(header(mod), blocksHost);
  if (exercise) stack.append(exerciseHost);
  stack.append(pager(id, nearMods));
  main.replaceChildren(wrap);

  function unmountEngine() {
    if (engine && typeof engine.unmount === "function") {
      try {
        engine.unmount();
      } catch (err) {
        console.warn("Exercise unmount failed", err);
      }
    }
    engine = null;
  }

  async function mountExercise(answers) {
    const token = ++mountToken;
    unmountEngine();
    exerciseHost.replaceChildren();
    try {
      if (!engineLoad) engineLoad = import(`./exercises/${exercise.type}.js`);
      const mod = await engineLoad;
      if (!alive || token !== mountToken) return;
      engine = mod.mount(exerciseHost, exercise, { store, answers });
    } catch (err) {
      console.warn("Exercise failed to load", err);
      exerciseHost.replaceChildren(el("p", "", "This exercise couldn't load. Reload the page to try again."));
    }
  }

  // Pick a tool in the chooser: save it, then keep the attendee's place and focus on the block that replaced it.
  // The replacement is the first block that wasn't visible before (the picked tool's block); it is pinned to the
  // chooser's old position on screen, so content above it shrinking or growing doesn't move the attendee's place.
  function pickTool(toolId, chooserIndex) {
    const answers = store.getAnswers();
    if (!answers) return;
    const chooser = blocksHost.children[chooserIndex];
    const anchorTop = chooser ? chooser.getBoundingClientRect().top : 0;
    const before = new Set([...blocksHost.children].map((n) => n.dataset.blockId));
    store.setAnswers({ ...answers, tool: toolId }); // the subscriber redraws synchronously
    const after = [...blocksHost.children];
    const replacement = after.find((n) => !before.has(n.dataset.blockId)) || after[chooserIndex] || after[after.length - 1];
    if (!replacement) return;
    // A long chooser can start far above the viewport (13 tools on a phone): clamp so the replacement lands in view,
    // just below the sticky header, rather than scrolled off the top.
    const headerBottom = (document.getElementById("app-header")?.getBoundingClientRect().bottom || 0) + 16;
    const target = Math.min(Math.max(anchorTop, headerBottom), window.innerHeight / 2);
    window.scrollBy(0, replacement.getBoundingClientRect().top - target);
    replacement.focus({ preventScroll: true });
  }

  function drawBlocks(answers) {
    const blocks = visibleBlocks(mod, answers);
    const nodes = blocks.map((b, i) => renderBlock(b, i, answers, ctx, (toolId) => pickTool(toolId, i)));
    blocksHost.replaceChildren(...groupBlocks(nodes, blocks));
    enhanceCodeBlocks(blocksHost);
  }

  function syncStatus() {
    const progress = store.getProgress();
    const current = progress.modules[id];
    if (current !== "done" && current !== "in_progress") store.setModuleStatus(id, "in_progress");
    const done = !exercise || Boolean(progress.exercises[exercise.id] && progress.exercises[exercise.id].completed);
    if (done && store.getProgress().modules[id] !== "done") store.setModuleStatus(id, "done");
  }

  function update() {
    const answers = store.getAnswers();
    if (!answers) return; // "Start fresh" from the menu: the router moves to the intake
    const key = JSON.stringify(answers);
    if (key !== lastAnswersKey) {
      // Only answer changes redraw content; exercise progress updates stay inside the engine.
      lastAnswersKey = key;
      const y = window.scrollY;
      drawBlocks(answers);
      if (exercise) mountExercise(answers);
      window.scrollTo(0, y);
    }
    syncStatus();
  }

  update();

  const unsubscribe = store.subscribe(() => {
    if (!alive) return;
    if (!stillHere()) {
      cleanup();
      return;
    }
    try {
      update();
    } catch (err) {
      console.warn("Module re-render failed", err);
    }
  });

  function cleanup() {
    if (!alive) return;
    alive = false;
    unsubscribe();
    unmountEngine();
  }
  return cleanup;
}
