// Animated "tools and MCP" diagram: Agent ↔ MCP (one plug) ↔ tools. A pulse flows from the agent through MCP to one
// tool and back; a terminal shows the call as it leaves (→) and the result as it returns (←), then the next tool.
// Plays only while on screen; Pause/Play and Restart. It plays on its own for everyone; with reduced motion each call appears whole, without the travelling pulse.
// Content comes from the block's `calls` ([{ tool: "Jira", call, result }]); `tools` lists the boxes on the right.

const SVG_NS = "http://www.w3.org/2000/svg";
const GO_MS = 1100;
const AT_TOOL_MS = 450;
const BACK_MS = 900;
const HOLD_MS = 1700;

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

// Layout in a 640x360 box: agent left, MCP in the middle, tools stacked on the right.
function diagram(toolNames) {
  const root = svg("svg", { viewBox: "0 0 640 360", class: "mcp__svg", "aria-hidden": "true" });
  const toolBoxes = {};
  const toolPaths = {};
  const gap = 360 / toolNames.length;

  const agentPath = svg("path", { d: "M150 180 L252 180", class: "mcp__wire" });
  root.append(agentPath);
  toolNames.forEach((name, i) => {
    const cy = Math.round(gap * i + gap / 2);
    const path = svg("path", { d: `M348 180 C 410 180, 410 ${cy}, 468 ${cy}`, class: "mcp__wire" });
    root.append(path);
    toolPaths[name] = path;
  });

  const agent = svg("g", { class: "mcp__box mcp__agent" });
  agent.append(svg("rect", { x: 12, y: 148, width: 138, height: 64, rx: 14 }), svg("text", { x: 81, y: 188 }, "Agent"));
  root.append(agent);

  const hub = svg("g", { class: "mcp__box mcp__hub" });
  hub.append(
    svg("circle", { cx: 300, cy: 180, r: 50 }),
    svg("text", { x: 300, y: 180, class: "mcp__hub-title" }, "MCP"),
    svg("text", { x: 300, y: 200, class: "mcp__hub-sub" }, "one plug"),
  );
  root.append(hub);

  toolNames.forEach((name, i) => {
    const cy = Math.round(gap * i + gap / 2);
    const g = svg("g", { class: "mcp__box mcp__tool" });
    g.append(svg("rect", { x: 468, y: cy - 27, width: 160, height: 54, rx: 12 }), svg("text", { x: 548, y: cy + 8 }, name));
    root.append(g);
    toolBoxes[name] = g;
  });

  const pulse = svg("circle", { cx: 150, cy: 180, r: 8, class: "mcp__pulse" });
  root.append(pulse);
  return { root, agent, hub, agentPath, toolPaths, toolBoxes, pulse };
}

export function render(block) {
  const tools = Array.isArray(block.tools) && block.tools.length ? block.tools : ["Jira", "Confluence", "Database", "Git"];
  const calls = (Array.isArray(block.calls) ? block.calls : []).filter((c) => c && tools.includes(c.tool) && c.call && c.result);
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wrap = el("div", "mcp");
  const d = diagram(tools);
  const pic = el("div", "mcp__pic");
  pic.append(d.root);

  const term = el("div", "mcp__term");
  const callLine = el("p", "mcp__call");
  const resultLine = el("p", "mcp__result");
  term.setAttribute("aria-live", "polite");
  term.append(callLine, el("hr", "mcp__rule"), resultLine);

  const controls = el("div", "agent-loop__controls");
  const toggle = el("button", "btn btn--secondary", "Pause");
  toggle.type = "button";
  const restart = el("button", "btn btn--ghost", "Restart");
  restart.type = "button";
  controls.append(toggle, restart);
  wrap.append(term, pic, controls);

  let index = 0;
  let playing = true;
  let visible = false;
  let mounted = false;
  let frame = null;
  let timer = null;
  let runId = 0; // bumps on restart/pause, so an old animation never finishes into a new state

  const gone = () => {
    if (wrap.isConnected) mounted = true;
    return mounted && !wrap.isConnected;
  };

  function setLine(node, arrow, text) {
    node.replaceChildren();
    if (!text) return;
    node.append(el("span", "mcp__arrow", arrow), document.createTextNode(text));
  }

  function lightUp(toolName, part) {
    d.agent.classList.toggle("is-active", part === "agent");
    d.hub.classList.toggle("is-active", part === "hub" || part === "tool");
    for (const [name, box] of Object.entries(d.toolBoxes)) box.classList.toggle("is-active", part === "tool" && name === toolName);
    d.agentPath.classList.toggle("is-active", Boolean(toolName));
    for (const [name, path] of Object.entries(d.toolPaths)) path.classList.toggle("is-active", name === toolName);
  }

  function placePulse(point) {
    d.pulse.setAttribute("cx", point.x.toFixed(1));
    d.pulse.setAttribute("cy", point.y.toFixed(1));
  }

  // Move the pulse along agent → MCP → tool (forward) or back, over `ms` milliseconds.
  function travel(toolName, forward, ms, id) {
    const a = d.agentPath;
    const b = d.toolPaths[toolName];
    const la = a.getTotalLength();
    const lb = b.getTotalLength();
    const total = la + lb;
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now) => {
        if (id !== runId || gone()) return resolve(false);
        const t = Math.min(1, (now - start) / ms);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const dist = (forward ? eased : 1 - eased) * total;
        placePulse(dist <= la ? a.getPointAtLength(dist) : b.getPointAtLength(dist - la));
        d.hub.classList.toggle("is-active", dist > la - 30);
        if (t < 1) frame = requestAnimationFrame(tick);
        else resolve(true);
      };
      frame = requestAnimationFrame(tick);
    });
  }

  const wait = (ms, id) =>
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(id === runId && !gone()), ms);
    });

  async function playCall(id) {
    if (reduced) {
      showStatic();
      return wait(GO_MS + AT_TOOL_MS + BACK_MS + HOLD_MS, id);
    }
    const c = calls[index % calls.length];
    index += 1;
    setLine(callLine, "→", c.call);
    setLine(resultLine, "←", "");
    d.pulse.style.opacity = "1";
    lightUp(c.tool, "agent");
    if (!(await travel(c.tool, true, GO_MS, id))) return false;
    lightUp(c.tool, "tool");
    if (!(await wait(AT_TOOL_MS, id))) return false;
    if (!(await travel(c.tool, false, BACK_MS, id))) return false;
    setLine(resultLine, "←", c.result);
    lightUp(c.tool, "agent");
    d.pulse.style.opacity = "0";
    return wait(HOLD_MS, id);
  }

  async function loop() {
    const id = ++runId;
    while (playing && visible && id === runId && calls.length) {
      const ok = await playCall(id);
      if (!ok) return;
    }
  }

  function stopMotion() {
    runId += 1;
    cancelAnimationFrame(frame);
    clearTimeout(timer);
  }

  // Reduced motion: show the whole call and result at once, no travelling pulse.
  function showStatic() {
    const c = calls[index % calls.length];
    index += 1;
    setLine(callLine, "→", c.call);
    setLine(resultLine, "←", c.result);
    lightUp(c.tool, "tool");
    d.pulse.style.opacity = "0";
  }

  toggle.addEventListener("click", () => {
    playing = !playing;
    toggle.textContent = playing ? "Pause" : "Play";
    if (playing) loop();
    else stopMotion();
  });
  restart.addEventListener("click", () => {
    stopMotion();
    index = 0;
    playing = true;
    toggle.textContent = "Pause";
    loop();
  });

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          if (gone()) {
            observer.disconnect();
            stopMotion();
            return;
          }
          const was = visible;
          visible = entries.some((e) => e.isIntersecting);
          if (visible && !was && playing) loop();
          if (!visible) stopMotion();
        })
      : null;
  if (observer) observer.observe(wrap);
  else {
    visible = true;
    if (playing) loop();
  }

  d.pulse.style.opacity = "0";
  if (calls.length) {
    const first = calls[0];
    setLine(callLine, "→", first.call);
  }
  return wrap;
}
