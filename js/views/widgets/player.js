// Shared timing for the step-by-step widgets (skills, context stack): plays one step at a time while on screen,
// with Pause/Play and Restart. It plays on its own for everyone; reduced motion only drops the movement (CSS).
// The widget supplies `count` steps, `show(i)` to draw step i, `reset()` before a new round, and `delay(i)`.

function button(className, text) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = text;
  return b;
}

export function createPlayer(wrap, { count, show, reset, delay, restMs = 2600 }) {
  const controls = document.createElement("div");
  controls.className = "agent-loop__controls";
  const toggle = button("btn btn--secondary", "Pause");
  const restart = button("btn btn--ghost", "Restart");
  controls.append(toggle, restart);

  let index = 0;
  let playing = true;
  let visible = false;
  let mounted = false;
  let timer = null;

  const gone = () => {
    if (wrap.isConnected) mounted = true;
    return mounted && !wrap.isConnected;
  };

  function advance() {
    if (index >= count) {
      index = 0;
      reset();
    }
    show(index);
    index += 1;
  }

  function schedule() {
    clearTimeout(timer);
    if (!playing || !visible) return;
    const wait = index >= count ? restMs : delay(index - 1);
    timer = setTimeout(() => {
      if (gone()) return stop();
      advance();
      schedule();
    }, wait);
  }

  function stop() {
    clearTimeout(timer);
    if (observer) observer.disconnect();
  }

  toggle.addEventListener("click", () => {
    playing = !playing;
    toggle.textContent = playing ? "Pause" : "Play";
    schedule();
  });
  restart.addEventListener("click", () => {
    index = 0;
    reset();
    advance();
    playing = true;
    toggle.textContent = "Pause";
    schedule();
  });

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          if (gone()) return stop();
          visible = entries.some((e) => e.isIntersecting);
          if (visible && playing && index === 0) advance();
          schedule();
        })
      : null;
  if (observer) observer.observe(wrap);
  else visible = true;

  // Always start with the first step drawn, so a still frame shows something real.
  reset();
  advance();
  return controls;
}
