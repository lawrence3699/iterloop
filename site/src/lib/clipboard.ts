/**
 * Copy text to the clipboard. Returns true on success, false if the
 * Clipboard API is unavailable or the write is rejected.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator?.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
