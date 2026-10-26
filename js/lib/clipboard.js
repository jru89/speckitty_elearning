// Copy text to the clipboard, falling back to selecting it in a read-only field. Never throws.
// Resolves "copied" when the Clipboard API succeeded, "selected" when the text was selected instead.

function selectIn(text, fallbackEl) {
  try {
    if (fallbackEl) {
      fallbackEl.readOnly = true;
      fallbackEl.value = text;
      fallbackEl.hidden = false;
      fallbackEl.focus();
      fallbackEl.select();
      if (typeof fallbackEl.setSelectionRange === "function") fallbackEl.setSelectionRange(0, text.length);
    }
  } catch {
    // Selecting is best effort; the text is still visible to copy by hand.
  }
  return "selected";
}

export async function copyText(text, fallbackEl) {
  const value = String(text ?? "");
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(value);
      return "copied";
    }
  } catch {
    // Permission denied, insecure context, or no user gesture: fall back below.
  }
  return selectIn(value, fallbackEl);
}
