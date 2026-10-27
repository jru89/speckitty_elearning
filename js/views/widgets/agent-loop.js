// Animated agentic loop: a ring of four steps around the goal, next to an "agent trace" that types out one line
// at a time. Each trace line lights up its step on the ring; when the goal is met the centre lights up and it starts
// again. Pauses off-screen and when the attendee pauses it. With reduced motion it doesn't autoplay: "Next step".
// Content comes from the block's `trace` ([{ step: "goal"|"plan"|"act"|"observe"|"decide"|"done", text }]).

const STEPS = [
  { id: "plan", label: "Plan", x: 200, y: 52, colour: "#0A84FF" },
  { id: "act", label: "Act", x: 348, y: 200, colour: "#64D2FF" },
  { id: "observe", label: "Observe", x: 200, y: 348, colour: "#30D158" },
  { id: "decide", label: "Decide", x: 52, y: 200, colour: "#FF9F0A" },
];
const LABELS = { goal: "GOAL", plan: "PLAN", act: "ACT", observe: "OBSERVE", decide: "DECIDE", done: "DONE" };
const SVG_NS = "http://www.w3.org/2000/svg";
const LINE_MS = 1700;
const RESTART_MS = 3200;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function svg(tag, attrs, text) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, String(v));
  if (text) node.textContent = text;
  return node;
}

function ring() {
  const root = svg("svg", { viewBox: "0 0 400 400", class: "agent-loop__ring", "aria-hidden": "true" });
  root.append(svg("circle", { cx: 200, cy: 200, r: 148, class: "agent-loop__track" }));
  const nodes = {};
  for (const s of STEPS) {
    const g = svg("g", { class: "agent-loop__node", "data-step": s.id, style: `--node:${s.colour}` });
    g.append(svg("circle", { cx: s.x, cy: s.y, r: 44 }));
    g.append(svg("text", { x: s.x, y: s.y + 5 }, s.label));
    root.append(g);
    nodes[s.id] = g;
  }
  const goal = svg("g", { class: "agent-loop__node agent-loop__goal", "data-step": "goal" });
  goal.append(svg("circle", { cx: 200, cy: 200, r: 58 }));
  goal.append(svg("text", { x: 200, y: 198, class: "agent-loop__goal-title" }, "Goal"));
  goal.append(svg("text", { x: 200, y: 222, class: "agent-loop__goal-sub" }, "until done"));
  root.append(goal);
  nodes.goal = goal;
  nodes.done = goal;
  return { root, nodes };
}

export function render(block) {
  const trace = Array.isArray(block.trace) ? block.trace.filter((l) => l && LABELS[l.step] && l.text) : [];
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wrap = el("div", "agent-loop");
  const { root: ringSvg, nodes } = ring();
  const ringBox = el("div", "agent-loop__ring-box");
  ringBox.append(ringSvg);

  const term = el("div", "agent-loop__term");
  const bar = el("div", "agent-loop__bar");
  bar.append(el("span", "agent-loop__dots"), el("span", "agent-loop__title", "Agent trace"));
  const lines = el("ol", "agent-loop__lines");
  lines.setAttribute("aria-live", "polite");
  term.append(bar, lines);

  const controls = el("div", "agent-loop__controls");
  const toggle = el("button", "btn btn--secondary", reduced ? "Next step" : "Pause");
  toggle.type = "button";
  const restart = el("button", "btn btn--ghost", "Restart");
  restart.type = "button";
  controls.append(toggle, restart);

  wrap.append(ringBox, term, controls);

  let index = 0; // next line to show
  let playing = !reduced;
  let timer = null;
  let visible = false;
  let mounted = false; // true once on the page; a later removal (the module redrew) stops it for good
  const gone = () => {
    if (wrap.isConnected) mounted = true;
    return mounted && !wrap.isConnected;
  };

  function highlight(step) {
    const active = step === "done" ? "goal" : step;
    for (const [id, node] of Object.entries(nodes)) node.classList.toggle("is-active", id === active);
    wrap.classList.toggle("is-done", step === "done");
  }

  function showLine(i) {
    const line = trace[i];
    const li = el("li", `agent-loop__line agent-loop__line--${line.step}`);
    li.append(el("span", "agent-loop__tag", LABELS[line.step]), el("span", "agent-loop__text", line.text));
    lines.append(li);
    lines.scrollTop = lines.scrollHeight;
    highlight(line.step === "goal" ? "goal" : line.step);
  }

  function reset() {
    index = 0;
    lines.replaceChildren();
    highlight(null);
  }

  function step() {
    if (gone()) return stop();
    if (index >= trace.length) {
      reset();
    }
    showLine(index);
    index += 1;
  }

  function schedule() {
    clearTimeout(timer);
    if (!playing || !visible) return;
    const delay = index >= trace.length ? RESTART_MS : LINE_MS;
    timer = setTimeout(() => {
      step();
      schedule();
    }, delay);
  }

  function stop() {
    clearTimeout(timer);
    timer = null;
    if (observer) observer.disconnect();
  }

  toggle.addEventListener("click", () => {
    if (reduced) {
      step();
      return;
    }
    playing = !playing;
    toggle.textContent = playing ? "Pause" : "Play";
    schedule();
  });
  restart.addEventListener("click", () => {
    reset();
    if (reduced) {
      step();
      return;
    }
    playing = true;
    toggle.textContent = "Pause";
    step();
    schedule();
  });

  // Only animate while on screen.
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          visible = entries.some((e) => e.isIntersecting);
          if (gone()) return stop();
          if (visible && playing && index === 0) step();
          schedule();
        })
      : null;
  if (observer) observer.observe(wrap);
  else {
    visible = true;
    if (playing) {
      step();
      schedule();
    }
  }

  // Reduced motion: show the first line straight away, then step on demand.
  if (reduced && trace.length) showLine(index++);

  return wrap;
}
