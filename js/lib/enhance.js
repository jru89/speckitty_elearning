// Adds a "Copy" button to every `pre > code` block inside a container (idempotent via data-enhanced).

import { copyText } from "./clipboard.js";

const RESET_MS = 1500;

export function enhanceCodeBlocks(container) {
  if (!container || typeof container.querySelectorAll !== "function") return;
  for (const code of container.querySelectorAll("pre > code")) {
    const pre = code.parentElement;
    if (pre.dataset.enhanced) continue;
    pre.dataset.enhanced = "true";

    let wrap = pre.parentElement;
    if (!wrap || !wrap.classList.contains("code")) {
      wrap = document.createElement("div");
      wrap.className = "code";
      pre.replaceWith(wrap);
      wrap.append(pre);
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";

    const fallback = document.createElement("textarea");
    fallback.className = "copy-fallback input";
    fallback.readOnly = true;
    fallback.rows = 2;
    fallback.hidden = true;
    fallback.setAttribute("aria-label", "Command, selected for copying");

    const status = document.createElement("span");
    status.className = "visually-hidden";
    status.setAttribute("role", "status");

    let timer = 0;
    btn.addEventListener("click", async () => {
      const result = await copyText(code.textContent.replace(/\n$/, ""), fallback);
      const label = result === "copied" ? "Copied" : "Select and copy";
      btn.textContent = label;
      btn.dataset.state = result;
      status.textContent = result === "copied" ? "Copied to clipboard" : "Text selected. Press Ctrl+C or Cmd+C to copy.";
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = "Copy";
        delete btn.dataset.state;
        status.textContent = "";
      }, RESET_MS);
    });

    wrap.append(btn, status, fallback);
  }
}
