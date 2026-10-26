// Zero-dependency test runner for tests/index.html (research R0-07). Not part of the app UI.

const registered = [];

export function test(name, fn) {
  registered.push({ name, fn });
}

export function assert(cond, message = "assertion failed") {
  if (!cond) throw new Error(message);
}

export function assertEqual(actual, expected, message = "values differ") {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${message}: expected ${e}, got ${a}`);
}

export function assertThrows(fn, message = "expected an error") {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error(message);
}

export async function run() {
  const results = [];
  for (const { name, fn } of registered) {
    try {
      await fn();
      results.push({ name, ok: true, error: null });
    } catch (err) {
      results.push({ name, ok: false, error: err && err.message ? err.message : String(err) });
    }
  }
  const passed = results.filter((r) => r.ok).length;
  return { passed, failed: results.length - passed, results };
}
