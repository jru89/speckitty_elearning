// Offline support (NFR-009, research R0-08): precache on install, stale-while-revalidate on fetch.
// Every shipped file must be listed here; bump CACHE on each release.
// Isolation (research R0-02, plan R-02): this worker only ever touches caches named "skcp-*".
// Another app on the same github.io origin may delete our cache; we then refill it from the network.

const CACHE = "skcp-v11";
const PREFIX = "skcp-";

// Built from `git ls-files`, minus tests/, kitty-specs/, .kittify/, .claude/, dotfiles and README.md.
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./js/app.js",
  "./js/data/intake.js",
  "./js/data/modules/index.js",
  "./js/data/modules/ready.js",
  "./js/data/modules/setup.js",
  "./js/data/modules/spec-driven.js",
  "./js/data/modules/terminal.js",
  "./js/data/modules/words.js",
  "./js/data/setup/platform-blocks.js",
  "./js/data/setup/support-blocks.js",
  "./js/data/setup/tool-blocks.js",
  "./js/data/setup/workflow-blocks.js",
  "./js/data/tools.js",
  "./js/data/welcome.js",
  "./js/lib/clipboard.js",
  "./js/lib/enhance.js",
  "./js/lib/store.js",
  "./js/lib/summary.js",
  "./js/lib/tailor.js",
  "./js/views/exercises/checklist.js",
  "./js/views/exercises/judge.js",
  "./js/views/exercises/quiz.js",
  "./js/views/widgets/agent-loop.js",
  "./js/views/widgets/tools-mcp.js",
  "./js/views/widgets/controls.js",
  "./js/views/widgets/player.js",
  "./js/views/widgets/skills.js",
  "./js/views/widgets/context-stack.js",
  "./js/views/intake-view.js",
  "./js/views/module-view.js",
  "./js/views/overview-view.js",
  "./js/views/welcome-view.js",
];

const SCOPE = self.registration.scope; // e.g. https://jru89.github.io/<repo>/
const INDEX = new URL("./index.html", SCOPE).href;

// cache: "reload" skips the browser's own HTTP cache, so a new release never stores an older copy of a file.
const precache = () =>
  caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" }))));

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      // Only our own older versions. Never a cache without the skcp- prefix.
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// If another app wiped our cache, refill the whole shell once (in the background) so offline works again.
let refilling = null;
let lastRefill = 0;
const REFILL_COOLDOWN_MS = 60 * 1000; // a file that keeps failing can't trigger a refill on every request
function refillIfWiped(cache) {
  if (refilling) return refilling;
  if (Date.now() - lastRefill < REFILL_COOLDOWN_MS) return Promise.resolve();
  lastRefill = Date.now();
  refilling = cache
    .match(INDEX)
    .then((hit) => (hit ? undefined : precache()))
    .catch(() => undefined) // Offline or a file failed: try again on a later request.
    .finally(() => {
      refilling = null;
    });
  return refilling;
}

function store(cache, request, response) {
  if (response && response.ok && response.type === "basic") return cache.put(request, response.clone());
  return Promise.resolve();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = request.url;
  // Same-origin, inside our scope only. tests/ is for the trainer and is never cached.
  if (!url.startsWith(SCOPE) || url.startsWith(SCOPE + "tests/")) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      event.waitUntil(refillIfWiped(cache));
      const cached = await cache.match(request);
      const network = fetch(request).then(async (response) => {
        await store(cache, request, response);
        return response;
      });

      if (cached) {
        event.waitUntil(network.catch(() => undefined)); // Revalidate in the background.
        return cached;
      }
      try {
        return await network;
      } catch (err) {
        if (request.mode === "navigate") {
          const shell = await cache.match(INDEX);
          if (shell) return shell;
        }
        throw err;
      }
    }),
  );
});
