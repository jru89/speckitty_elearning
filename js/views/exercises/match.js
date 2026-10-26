// Match exercise (FR-009; contracts/exercise-engine-contract.md): pair each term with its definition.
// No drag and drop: every term has a native <select>. Correct pairs lock; wrong ones explain why. Retries are unlimited.
// Persists { matched: [term…], completed }; completed once every term was matched correctly at least once.

// Deterministic shuffle so a reload keeps the same option order (seeded by the exercise id).
function seededShuffle(items, seedText) {
  let h = 2166136261;
  for (const ch of String(seedText)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let a = h >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

const FALLBACK_WHY = "Not quite — this term means something else.";

export function mount(container, exercise, ctx) {
  const { store } = ctx;
  const pairs = (exercise.config && Array.isArray(exercise.config.pairs) ? exercise.config.pairs : []).filter(
    (p) => p && typeof p.term === "string" && typeof p.definition === "string",
  );
  const abort = new AbortController();
  const { signal } = abort;
  const prefix = `match-${String(exercise.id).replace(/[^\w-]/g, "")}`;

  const saved = store.getProgress().exercises[exercise.id] || {};
  const matched = new Set(Array.isArray(saved.matched) ? saved.matched.filter((t) => pairs.some((p) => p.term === t)) : []);

  const order = seededShuffle(
    pairs.map((p, i) => i),
    exercise.id,
  );

  const root = el("div", "stack");
  const head = el("div");
  const h = el("h2", "cell-title", "Match the words");
  h.id = `${prefix}-title`;
  head.append(h, el("p", "", "Pick the definition that fits each term, then press Check. Try as often as you like."));
  root.append(head);

  const list = el("ol", "stack");
  list.style.listStyle = "none";
  list.style.padding = "0";
  const rows = pairs.map((pair, i) => {
    const li = el("li");
    const label = el("label", "", "");
    label.htmlFor = `${prefix}-${i}`;
    label.append(el("strong", "", pair.term));
    label.style.display = "block";
    label.style.marginBottom = "var(--space-xs)";
    const select = el("select");
    select.id = `${prefix}-${i}`;
    const blank = el("option", "", "Choose a definition…");
    blank.value = "";
    select.append(blank);
    for (const j of order) {
      const opt = el("option", "", pairs[j].definition);
      opt.value = String(j);
      select.append(opt);
    }
    const feedback = el("p");
    feedback.id = `${prefix}-${i}-fb`;
    feedback.hidden = true;
    feedback.style.marginTop = "var(--space-sm)";
    select.setAttribute("aria-describedby", feedback.id);
    li.append(label, select, feedback);
    list.append(li);
    return { pair, select, feedback };
  });
  root.append(list);

  const actions = el("div", "row");
  const check = el("button", "btn btn--primary", "Check");
  check.type = "button";
  actions.append(check);
  const status = el("p", "caption");
  status.setAttribute("role", "status");
  root.append(actions, status);
  container.append(root);

  function showRight(row) {
    row.select.value = String(pairs.indexOf(row.pair));
    row.select.disabled = true;
    row.feedback.className = "feedback--right";
    row.feedback.replaceChildren(el("strong", "", "Right. "), document.createTextNode(row.pair.definition));
    row.feedback.hidden = false;
  }

  function showWrong(row, message) {
    row.feedback.className = "feedback--wrong";
    row.feedback.replaceChildren(el("strong", "", "Not yet. "), document.createTextNode(message));
    row.feedback.hidden = false;
  }

  function updateStatus() {
    const total = rows.length;
    if (matched.size >= total && total > 0) {
      status.textContent = `All ${total} matched. Nice work.`;
      check.disabled = true;
    } else {
      status.textContent = `${matched.size} of ${total} matched.`;
    }
  }

  for (const row of rows) if (matched.has(row.pair.term)) showRight(row);
  updateStatus();

  check.addEventListener(
    "click",
    () => {
      let firstWrong = null;
      for (const row of rows) {
        if (matched.has(row.pair.term)) continue;
        if (row.select.value === "") continue; // not tried yet: no feedback
        const pickedIndex = Number(row.select.value);
        if (pairs[pickedIndex] === row.pair) {
          matched.add(row.pair.term);
          showRight(row);
        } else {
          showWrong(row, row.pair.whyWrong || FALLBACK_WHY);
          firstWrong = firstWrong || row.select;
        }
      }
      const completed = matched.size >= rows.length && rows.length > 0;
      store.setExerciseState(exercise.id, { matched: [...matched], completed });
      updateStatus();
      if (firstWrong) {
        firstWrong.focus();
      } else if (completed) {
        // Check is now disabled: keep keyboard focus on the result instead of losing it to <body>.
        status.tabIndex = -1;
        status.focus();
      }
    },
    { signal },
  );

  // Changing a wrong pick hides its stale feedback.
  for (const row of rows) {
    row.select.addEventListener(
      "change",
      () => {
        if (!matched.has(row.pair.term)) row.feedback.hidden = true;
      },
      { signal },
    );
  }

  return {
    unmount() {
      abort.abort();
      root.remove();
    },
  };
}
