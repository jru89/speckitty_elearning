// Animated skills: a request types into the "You" bar, every skill card dims, the matching one lights up, and a status
// line confirms its SKILL.md was loaded. Then the next request. Content from the block: `skills` ([{ name, does }])
// and `requests` ([{ text, skill }]). Timing and controls come from player.js.

import { createPlayer } from "./player.js";

const TYPE_MS = 28;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function render(block) {
  const skills = Array.isArray(block.skills) ? block.skills : [];
  const requests = (Array.isArray(block.requests) ? block.requests : []).filter((r) => skills.some((s) => s.name === r.skill));
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wrap = el("div", "skills-demo");
  const ask = el("div", "skills-demo__ask");
  const who = el("span", "skills-demo__who", "You");
  const said = el("span", "skills-demo__said");
  const caret = el("span", "skills-demo__caret");
  caret.setAttribute("aria-hidden", "true");
  ask.append(who, said, caret);

  const grid = el("ul", "skills-demo__grid");
  const cards = {};
  for (const s of skills) {
    const li = el("li", "skills-demo__card");
    li.append(el("code", "skills-demo__name", s.name), el("span", "skills-demo__does", s.does));
    grid.append(li);
    cards[s.name] = li;
  }

  const status = el("p", "skills-demo__status");
  status.setAttribute("aria-live", "polite");

  let typing = null;
  let mounted = false;
  // False only once the widget was on the page and has been removed (the module redrew).
  const alive = () => {
    if (wrap.isConnected) mounted = true;
    return !mounted || wrap.isConnected;
  };
  function type(text, done) {
    clearInterval(typing);
    if (reduced) {
      said.textContent = text;
      return done();
    }
    let i = 0;
    said.textContent = "";
    typing = setInterval(() => {
      i += 1;
      said.textContent = text.slice(0, i);
      if (!alive()) return clearInterval(typing);
      if (i >= text.length) {
        clearInterval(typing);
        done();
      }
    }, TYPE_MS);
  }

  function show(i) {
    const r = requests[i];
    wrap.classList.add("is-choosing");
    for (const card of Object.values(cards)) card.classList.remove("is-match");
    status.replaceChildren();
    type(r.text, () => {
      cards[r.skill].classList.add("is-match");
      wrap.classList.remove("is-choosing");
      status.append(el("span", "skills-demo__dot"), document.createTextNode(`${r.skill}/SKILL.md loaded · the agent now follows its playbook`));
    });
  }

  function reset() {
    clearInterval(typing);
    said.textContent = "";
    status.replaceChildren();
    for (const card of Object.values(cards)) card.classList.remove("is-match");
  }

  wrap.append(ask, grid, status);
  if (requests.length) {
    wrap.append(
      createPlayer(wrap, {
        count: requests.length,
        show,
        reset,
        delay: (i) => requests[i].text.length * TYPE_MS + 2400,
      }),
    );
  }
  return wrap;
}
