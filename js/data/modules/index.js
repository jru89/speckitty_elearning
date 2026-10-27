// Module registry in display order (contracts/content-schema.md "Modules").
// Each entry loads lazily, so a module file that doesn't exist yet makes only that module unavailable.

export const MODULES = [
  { id: "terminal", optional: true, load: () => import("./terminal.js") },
  { id: "spec-driven", load: () => import("./spec-driven.js") },
  { id: "setup", load: () => import("./setup.js") },
  { id: "words", load: () => import("./words.js") },
  { id: "ready", load: () => import("./ready.js") },
];

// Resolves to the module object, or null when the id is unknown or the file is missing or broken.
export async function loadModule(id) {
  const entry = MODULES.find((m) => m.id === id);
  if (!entry) return null;
  try {
    const mod = await entry.load();
    const data = mod && mod.default;
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

// Resolves to [{ id, optional, module | null }] in registry order.
export async function loadAll() {
  return Promise.all(
    MODULES.map(async (m) => ({ id: m.id, optional: Boolean(m.optional), module: await loadModule(m.id) })),
  );
}
