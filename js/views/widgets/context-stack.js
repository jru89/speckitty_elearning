// Animated context window: layers drop into the window from the bottom up (built-in instructions first, your prompt
// last) while a gauge fills, so "every line costs attention" is visible. The skill layer only arrives when a task
// matches. Content from the block: `layers` ([{ label, kind: "base"|"always"|"skill"|"prompt", size }]), bottom first.

import { createPlayer } from "./player.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function render(block) {
  const layers = Array.isArray(block.layers) ? block.layers : [];
  const total = layers.reduce((sum, l) => sum + (Number(l.size) || 0), 0) || 1;
  const capacity = Number(block.capacity) || total / 0.62; // the window never looks completely full

  const wrap = el("div", "ctx-demo");
  const win = el("div", "ctx-demo__window");
  win.append(el("p", "ctx-demo__title", "Context window"));
  const stack = el("ol", "ctx-demo__stack");
  stack.setAttribute("aria-label", "What's in the context window, top to bottom");
  // Rendered top-down (prompt on top), animated bottom-up.
  const items = layers.map((l) => {
    const li = el("li", `ctx-demo__layer ctx-demo__layer--${l.kind}`, l.label);
    return li;
  });
  for (const li of [...items].reverse()) stack.append(li);
  const gauge = el("div", "ctx-demo__gauge");
  const fill = el("span", "ctx-demo__fill");
  gauge.append(fill);
  const caption = el("p", "ctx-demo__caption");
  caption.setAttribute("aria-live", "polite");
  win.append(stack, gauge, caption);
  wrap.append(win);

  let used = 0;
  function show(i) {
    const layer = layers[i];
    items[i].classList.add("is-in");
    used += Number(layer.size) || 0;
    fill.style.width = `${Math.min(100, (used / capacity) * 100).toFixed(1)}%`;
    caption.textContent = layer.note || "";
  }
  function reset() {
    used = 0;
    for (const li of items) li.classList.remove("is-in");
    fill.style.width = "0%";
    caption.textContent = "";
  }

  if (layers.length) {
    wrap.append(createPlayer(wrap, { count: layers.length, show, reset, delay: () => 1500, nextLabel: "Next layer", restMs: 3200 }));
  }
  return wrap;
}
