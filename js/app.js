// App shell: hash router with route guard, header menu, storage notice. Frame only: no content or view logic.

import { store } from "./lib/store.js";

const SITE = "Spec Kitty Class Prep";

// requiresAnswers routes redirect to #/intake while the store has no valid answers (plan.md, Route guard).
const routes = [
  { path: "/", view: null /* resolved: answers ? overview : welcome */ },
  { path: "/welcome", view: "./views/welcome-view.js", title: "Welcome" },
  { path: "/intake", view: "./views/intake-view.js", title: "Your setup" },
  { path: "/course", view: "./views/overview-view.js", title: "Course overview", requiresAnswers: true },
  { path: "/m/:id", view: "./views/module-view.js", title: "Module", requiresAnswers: true },
];
const byPath = (p) => routes.find((r) => r.path === p);

const main = document.getElementById("app-main");
const header = document.getElementById("app-header");
const notice = document.getElementById("app-notice");

let cleanup = null;
let renderToken = 0;

function currentPath() {
  const raw = location.hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function match(path) {
  const parts = path.split("?")[0].split("/").filter(Boolean);
  for (const route of routes) {
    const pattern = route.path.split("/").filter(Boolean);
    if (pattern.length !== parts.length) continue;
    const params = {};
    const ok = pattern.every((seg, i) => {
      if (seg.startsWith(":")) {
        try {
          params[seg.slice(1)] = decodeURIComponent(parts[i]);
        } catch {
          return false;
        }
        return true;
      }
      return seg === parts[i];
    });
    if (ok) return { route, params };
  }
  return null;
}

export function navigate(path) {
  const target = `#${path.startsWith("/") ? path : `/${path}`}`;
  if (location.hash === target) render();
  else location.hash = target;
}

function placeholder(title) {
  main.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "container container--reading";
  const cell = document.createElement("div");
  cell.className = "cell placeholder";
  const h = document.createElement("h1");
  h.className = "cell-title";
  h.textContent = "This page isn't built yet.";
  const p = document.createElement("p");
  p.textContent = `The ${title.toLowerCase()} page is still being written. Check back soon.`;
  const back = document.createElement("a");
  back.className = "btn btn--secondary";
  back.href = "#/";
  back.textContent = "Back to the start";
  cell.append(h, p, back);
  wrap.append(cell);
  main.append(wrap);
}

async function render() {
  const token = ++renderToken;
  closeMenu(false);

  const found = match(currentPath());
  if (!found) {
    location.replace("#/");
    return;
  }
  let { route } = found;
  const { params } = found;
  const answers = store.getAnswers();

  if (route.requiresAnswers && answers === null) {
    location.replace("#/intake");
    return;
  }
  if (route.view === null) route = byPath(answers ? "/course" : "/welcome");

  if (typeof cleanup === "function") {
    try {
      cleanup();
    } catch (err) {
      console.warn("View cleanup failed", err);
    }
  }
  cleanup = null;

  let mod = null;
  try {
    mod = await import(route.view);
  } catch {
    mod = null; // Expected while a view's work package hasn't landed yet.
  }
  if (token !== renderToken) return; // A newer navigation started while loading.

  main.innerHTML = "";
  let title = route.title;
  if (mod && typeof mod.render === "function") {
    try {
      const result = await mod.render(main, params, { store, navigate });
      if (token !== renderToken) return;
      if (typeof result === "function") cleanup = result;
      if (typeof mod.title === "function") title = mod.title(params, { store }) || title;
      else if (typeof mod.title === "string") title = mod.title;
    } catch (err) {
      console.warn("View failed to render", err);
      placeholder(route.title);
    }
  } else {
    placeholder(route.title);
  }

  document.title = `${title} – ${SITE}`;
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

// ------------------------------------------------------------------ Header menu

const CHEVRON = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>';

let toggle, panel, confirmBox, freshBtn;

function el(tag, attrs = {}, text = "") {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text) node.textContent = text;
  return node;
}

function buildHeader() {
  header.className = "menu";
  const bar = el("div", { class: "menu__bar" });
  const brand = el("a", { class: "menu__brand", href: "#/" }, SITE);

  toggle = el("button", { class: "menu__toggle", type: "button", "aria-expanded": "false", "aria-controls": "app-menu" });
  toggle.innerHTML = `<span>Menu</span>${CHEVRON}`;
  bar.append(brand, toggle);

  panel = el("nav", { class: "menu__panel", id: "app-menu", "aria-label": "Course menu" });
  panel.hidden = true;
  const list = el("ul", { class: "menu__list" });
  const link = (href, label) => {
    const li = el("li");
    li.append(el("a", { class: "menu__item", href }, label));
    return li;
  };
  freshBtn = el("button", { class: "menu__item", type: "button", "aria-expanded": "false", "aria-controls": "app-confirm" }, "Start fresh");
  const freshLi = el("li");
  freshLi.append(freshBtn);
  list.append(link("#/intake", "Change my answers"), freshLi, link("#/welcome", "About this course"));

  confirmBox = el("div", { class: "confirm", id: "app-confirm", role: "group", "aria-labelledby": "app-confirm-title" });
  confirmBox.hidden = true;
  const ct = el("p", { class: "confirm__title", id: "app-confirm-title" }, "Start fresh?");
  const cb = el("p", { class: "confirm__body" }, "This clears your answers and progress on this device. Other apps aren't affected.");
  const actions = el("div", { class: "confirm__actions" });
  const yes = el("button", { class: "btn btn--primary", type: "button" }, "Clear and start over");
  const no = el("button", { class: "btn btn--secondary", type: "button" }, "Cancel");
  actions.append(yes, no);
  confirmBox.append(ct, cb, actions);

  panel.append(list, confirmBox);
  header.append(bar, panel);

  toggle.addEventListener("click", () => (panel.hidden ? openMenu() : closeMenu(true)));
  freshBtn.addEventListener("click", () => {
    const show = confirmBox.hidden;
    confirmBox.hidden = !show;
    freshBtn.setAttribute("aria-expanded", String(show));
    if (show) yes.focus();
  });
  no.addEventListener("click", () => {
    confirmBox.hidden = true;
    freshBtn.setAttribute("aria-expanded", "false");
    freshBtn.focus();
  });
  yes.addEventListener("click", () => {
    store.startFresh();
    closeMenu(false);
    navigate("/intake");
  });
  header.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      e.preventDefault();
      closeMenu(true);
    }
  });
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !header.contains(e.target)) closeMenu(false);
  });
}

function openMenu() {
  panel.hidden = false;
  toggle.setAttribute("aria-expanded", "true");
}

function closeMenu(returnFocus) {
  if (!panel) return;
  panel.hidden = true;
  confirmBox.hidden = true;
  toggle.setAttribute("aria-expanded", "false");
  freshBtn.setAttribute("aria-expanded", "false");
  if (returnFocus) toggle.focus();
}

// ------------------------------------------------------------------ Storage notice

function updateNotice() {
  try {
    const persistent = store.isPersistent();
    notice.textContent = persistent ? "" : "Your browser isn't letting this site save, so your answers will be forgotten when you close it.";
    notice.hidden = persistent;
  } catch {
    // A store subscriber must never throw: it would surface in the store's setter.
  }
}

// ------------------------------------------------------------------ Boot

buildHeader();
updateNotice();
store.subscribe(updateNotice);
window.addEventListener("hashchange", render);
render();

// Service worker registration (WP09): offline support, research R0-08. Relative URL so it works under a GitHub Pages sub-path.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(() => {});
