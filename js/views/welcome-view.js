// Welcome page (FR-001, FR-025): what Spec Kitty is, the session, what to bring, and the way in.
// View contract (js/app.js): render(main, params, ctx).

import { whatIsIt, agenda, goal, bring, installedInSession, demoNote, session } from "../data/welcome.js";

export const title = "Welcome";

const SESSION_FIELDS = [
  ["date", "Date"],
  ["time", "Time"],
  ["place", "Place"],
  ["trainerContact", "Trainer"],
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function list(tag, items) {
  const node = el(tag);
  for (const item of items) node.append(el("li", "", item));
  return node;
}

function sessionCell() {
  const filled = SESSION_FIELDS.filter(([key]) => typeof session[key] === "string" && session[key].trim());
  if (filled.length === 0) return null;
  const cell = el("section", "cell span-2");
  cell.setAttribute("aria-labelledby", "welcome-session-details");
  const h = el("h2", "cell-title", "Session details");
  h.id = "welcome-session-details";
  const dl = el("dl");
  for (const [key, label] of filled) {
    dl.append(el("dt", "caption", label), el("dd", "", session[key].trim()));
  }
  cell.append(h, dl);
  return cell;
}

export function render(main, params, ctx) {
  const hasAnswers = ctx.store.getAnswers() !== null;

  const wrap = el("div", "container");

  // Hero
  const hero = el("header", "section-head");
  const h1 = el("h1", "hero-title", "Spec Kitty Class Prep");
  const lead = el("p", "lead", "Get ready for the Spec Kitty class. It takes 30 to 60 minutes, a bit longer if this is your first time installing tools like these. You can stop and come back any time.");
  lead.style.marginTop = "var(--space-md)";
  const actions = el("div", "row");
  const cta = el("a", "btn btn--primary", hasAnswers ? "Back to the course" : "Start");
  cta.href = hasAnswers ? "#/course" : "#/intake";
  actions.append(cta);
  hero.append(h1, lead, actions);
  actions.style.marginTop = "var(--space-lg)";

  const grid = el("div", "bento");

  // What Spec Kitty is
  const what = el("section", "cell cell--blue span-2 tall");
  what.setAttribute("aria-labelledby", "welcome-what");
  const whatTitle = el("h2", "cell-title cell-title--lg", "What Spec Kitty is");
  whatTitle.id = "welcome-what";
  const whatBody = el("div");
  whatBody.innerHTML = whatIsIt; // repo-authored content (contracts/content-schema.md)
  for (const p of whatBody.querySelectorAll("p + p")) p.style.marginTop = "var(--space-sm)";
  what.append(whatTitle, whatBody);

  // The session
  const sess = el("section", "cell cell--purple span-2 tall");
  sess.setAttribute("aria-labelledby", "welcome-agenda");
  const sessTitle = el("h2", "cell-title cell-title--lg", "The session");
  sessTitle.id = "welcome-agenda";
  const goalP = el("p");
  goalP.append(el("strong", "", goal));
  sess.append(sessTitle, list("ol", agenda), goalP);

  // What to bring
  const bringCell = el("section", "cell cell--orange span-2");
  bringCell.setAttribute("aria-labelledby", "welcome-bring");
  const bringTitle = el("h2", "cell-title", "What to bring");
  bringTitle.id = "welcome-bring";
  bringCell.append(bringTitle, list("ul", bring));

  grid.append(what, sess, bringCell);
  const details = sessionCell();
  if (details) grid.append(details);

  // Install-in-session and demo notes: full width under session details, else beside "What to bring".
  const note = el("section", `block block--note ${details ? "span-4" : "span-2"}`);
  note.setAttribute("aria-labelledby", "welcome-note");
  const noteTitle = el("h2", "cell-title", "Good to know");
  noteTitle.id = "welcome-note";
  note.append(noteTitle, el("p", "", installedInSession), el("p", "", demoNote));
  grid.append(note);

  wrap.append(hero, grid);
  main.append(wrap);
}
