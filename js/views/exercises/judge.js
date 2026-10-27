// Judge exercise (FR-011; contracts/exercise-engine-contract.md): is each statement a testable acceptance criterion?
// Feedback (`why`) shows after every judgement, right or wrong; answers can be changed. No pass mark.
// Persists { answers: { [index]: boolean }, completed }; completed once every statement was judged once.

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function mount(container, exercise, ctx) {
  const { store } = ctx;
  const statements = (exercise.config && Array.isArray(exercise.config.statements) ? exercise.config.statements : []).filter(
    (s) => s && typeof s.text === "string" && typeof s.isCriterion === "boolean",
  );
  const abort = new AbortController();
  const { signal } = abort;
  const prefix = `judge-${String(exercise.id).replace(/[^\w-]/g, "")}`;

  const saved = store.getProgress().exercises[exercise.id] || {};
  const answers = {};
  if (saved.answers && typeof saved.answers === "object") {
    for (const [k, v] of Object.entries(saved.answers)) {
      if (typeof v === "boolean" && Number(k) >= 0 && Number(k) < statements.length) answers[k] = v;
    }
  }
  let everCompleted = Boolean(saved.completed);

  const root = el("div", "stack");
  const head = el("div");
  head.append(
    el("h2", "cell-title", "Testable or not?"),
    el("p", "", "For each statement, decide whether someone could check it with a clear yes or no. You'll see why after each choice."),
  );
  root.append(head);

  const list = el("ol", "judge-list");
  const rows = statements.map((s, i) => {
    const li = el("li", "judge-card");
    const text = el("p", "judge-card__text", s.text);
    text.id = `${prefix}-${i}`;
    const group = el("div", "judge-buttons");
    group.setAttribute("role", "group");
    group.setAttribute("aria-labelledby", text.id);
    const yes = el("button", "judge-btn judge-btn--yes", "✓ Testable");
    const no = el("button", "judge-btn judge-btn--no", "✗ Not testable");
    for (const b of [yes, no]) b.type = "button";
    group.append(yes, no);
    const feedback = el("p");
    feedback.hidden = true;
    feedback.setAttribute("aria-live", "polite");
    li.append(text, group, feedback);
    list.append(li);
    const row = { s, i, li, yes, no, feedback };
    yes.addEventListener("click", () => choose(row, true), { signal });
    no.addEventListener("click", () => choose(row, false), { signal });
    return row;
  });
  root.append(list);

  const tally = el("p", "quiz-tally");
  tally.setAttribute("role", "status");
  root.append(tally);
  container.append(root);

  function show(row) {
    const pick = answers[row.i];
    const judged = typeof pick === "boolean";
    row.yes.setAttribute("aria-pressed", String(pick === true));
    row.no.setAttribute("aria-pressed", String(pick === false));
    row.yes.classList.toggle("is-picked", pick === true);
    row.no.classList.toggle("is-picked", pick === false);
    const right = judged && pick === row.s.isCriterion;
    row.li.classList.toggle("is-right", judged && right);
    row.li.classList.toggle("is-wrong", judged && !right);
    if (!judged) {
      row.feedback.hidden = true;
      return;
    }
    row.feedback.className = right ? "feedback--right" : "feedback--wrong";
    const verdict = row.s.isCriterion ? "This is a testable criterion." : "This isn't testable as written.";
    row.feedback.replaceChildren(el("strong", "", right ? "Right. " : "Not quite. "), document.createTextNode(`${verdict} ${row.s.why || ""}`.trim()));
    row.feedback.hidden = false;
  }

  function updateTally() {
    const judged = rows.filter((r) => typeof answers[r.i] === "boolean");
    if (rows.length && judged.length === rows.length) {
      const spotted = rows.filter((r) => answers[r.i] === r.s.isCriterion).length;
      tally.textContent = spotted === rows.length ? `You spotted all ${rows.length}. You're ready to write criteria!` : `You spotted ${spotted} of ${rows.length}.`;
    } else {
      tally.textContent = `${judged.length} of ${rows.length} judged.`;
    }
  }

  function choose(row, value) {
    answers[row.i] = value;
    show(row);
    updateTally();
    const allJudged = rows.length > 0 && rows.every((r) => typeof answers[r.i] === "boolean");
    everCompleted = everCompleted || allJudged; // judged once is enough; changing an answer never undoes it
    store.setExerciseState(exercise.id, { answers: { ...answers }, completed: everCompleted });
  }

  rows.forEach(show);
  updateTally();

  return {
    unmount() {
      abort.abort();
      root.remove();
    },
  };
}
