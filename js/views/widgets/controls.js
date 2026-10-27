// The control bar every animated widget shares: a round play/pause button and a restart button, icons only.
// The icon is the label for sighted users; aria-label and title carry the words for screen readers and on hover.

const NS = "http://www.w3.org/2000/svg";
const ICONS = {
  pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
  play: "M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z",
  restart: "M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z",
};
const LABELS = { pause: "Pause", play: "Play", restart: "Restart" };

function icon(name) {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", ICONS[name]);
  svg.append(path);
  return svg;
}

function setIcon(button, name) {
  button.replaceChildren(icon(name));
  button.setAttribute("aria-label", LABELS[name]);
  button.title = LABELS[name];
}

export function createControls() {
  const controls = document.createElement("div");
  controls.className = "agent-loop__controls";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "media-btn media-btn--main";
  const restart = document.createElement("button");
  restart.type = "button";
  restart.className = "media-btn";
  setIcon(toggle, "pause");
  setIcon(restart, "restart");
  controls.append(toggle, restart);
  // true shows the pause icon (it's playing), false the play icon.
  const setPlaying = (playing) => setIcon(toggle, playing ? "pause" : "play");
  return { controls, toggle, restart, setPlaying };
}
