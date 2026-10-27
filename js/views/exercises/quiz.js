// Quiz exercise (FR-009; contracts/exercise-engine-contract.md): multiple choice, one card per question.
// Feedback (`why`) shows after every answer; answers can be changed. Low-stakes: no pass mark.
// Persists { answers: { [index]: optionIndex }, completed }; completed once every question was answered once.

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function mount(container, exercise, ctx) {
  const { store } = ctx;
  const questions = (exercise.config && Array.isArray(exercise.config.questions) ? exercise.config.questions : []).filter(
    (q) => q && typeof q.question === "string" && Array.isArray(q.options) && Number.isInteger(q.answer),
  );
  const abort = new AbortController();
  const { signal } = abort;
  const prefix = `quiz-${String(exercise.id).replace(/[^\w-]/g, "")}`;

  const saved = store.getProgress().exercises[exercise.id] || {};
  const answers = {};
  if (saved.answers && typeof saved.answers === "object") {
    for (const [k, v] of Object.entries(saved.answers)) {
      const q = questions[Number(k)];
      if (q && Number.isInteger(v) && v >= 0 && v < q.options.length) answers[k] = v;
    }
  }
  let everCompleted = Boolean(saved.completed);

  const root = el("div", "stack quiz");
  const head = el("div");
  head.append(
    el("h2", "cell-title", "Quick quiz"),
    el("p", "", "Pick an answer for each question. You'll see why straight away, and you can change your answer."),
  );
  const dots = el("div", "quiz-dots");
  dots.setAttribute("aria-hidden", "true");
  head.append(dots);
  root.append(head);

  const cards = questions.map((q, i) => {
    const card = el("section", "quiz-card");
    const title = el("p", "quiz-card__q");
    title.id = `${prefix}-${i}`;
    title.append(el("span", "quiz-card__num", String(i + 1)), document.createTextNode(q.question));
    const group = el("div", "quiz-options");
    group.setAttribute("role", "group");
    group.setAttribute("aria-labelledby", title.id);
    const buttons = q.options.map((text, o) => {
      const b = el("button", `quiz-option quiz-option--${o % 4}`);
      b.type = "button";
      b.append(el("span", "quiz-option__letter", LETTERS[o] || String(o + 1)), el("span", "quiz-option__text", text));
      b.addEventListener("click", () => choose(i, o), { signal });
      group.append(b);
      return b;
    });
    const feedback = el("p");
    feedback.hidden = true;
    feedback.setAttribute("aria-live", "polite");
    card.append(title, group, feedback);
    root.append(card);
    const dot = el("span", "quiz-dot");
    dots.append(dot);
    return { q, i, card, buttons, feedback, dot };
  });

  const tally = el("p", "quiz-tally");
  tally.setAttribute("role", "status");
  root.append(tally);
  container.append(root);

  function show(row) {
    const pick = answers[row.i];
    const answered = Number.isInteger(pick);
    row.buttons.forEach((b, o) => {
      b.setAttribute("aria-pressed", String(pick === o));
      b.classList.toggle("is-picked", pick === o);
      b.classList.toggle("is-right", answered && o === row.q.answer);
      b.classList.toggle("is-wrong", answered && pick === o && o !== row.q.answer);
    });
    row.card.classList.toggle("is-right", answered && pick === row.q.answer);
    row.card.classList.toggle("is-wrong", answered && pick !== row.q.answer);
    row.dot.className = `quiz-dot${answered ? (pick === row.q.answer ? " is-right" : " is-wrong") : ""}`;
    if (!answered) {
      row.feedback.hidden = true;
      return;
    }
    const right = pick === row.q.answer;
    row.feedback.className = right ? "feedback--right" : "feedback--wrong";
    row.feedback.replaceChildren(el("strong", "", right ? "Right. " : "Not quite. "), document.createTextNode(row.q.why || ""));
    row.feedback.hidden = false;
  }

  function updateTally() {
    const answered = cards.filter((r) => Number.isInteger(answers[r.i]));
    if (cards.length && answered.length === cards.length) {
      const right = cards.filter((r) => answers[r.i] === r.q.answer).length;
      tally.textContent = right === cards.length ? `All ${cards.length} right. Nice work!` : `${right} of ${cards.length} right. Have another look at the ones in orange.`;
    } else {
      tally.textContent = `${answered.length} of ${cards.length} answered.`;
    }
  }

  function choose(i, option) {
    answers[i] = option;
    show(cards[i]);
    updateTally();
    const allAnswered = cards.length > 0 && cards.every((r) => Number.isInteger(answers[r.i]));
    everCompleted = everCompleted || allAnswered; // answered once is enough; changing an answer never undoes it
    store.setExerciseState(exercise.id, { answers: { ...answers }, completed: everCompleted });
  }

  cards.forEach(show);
  updateTally();

  return {
    unmount() {
      abort.abort();
      root.remove();
    },
  };
}
