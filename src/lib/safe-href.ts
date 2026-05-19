/*
 * Treat a href as safe if it's an http(s) URL, a relative path, or a fragment.
 * Anything else (javascript:, data:, blob:, vbscript:, mailto:, tel:, etc.)
 * gets coerced to "#".
 *
 * Defense-in-depth — most call sites already trust their data source, but
 * an allowlist guard is cheap insurance against a future data-source change
 * that introduces user-controlled URLs.
 */
export function safeHref(href: string): string {
  if (/^https?:\/\//i.test(href)) return href;
  if (/^[/#?]/.test(href)) return href;
  if (/^(mailto|tel):/i.test(href)) return href;
  return '#';
}

/*
 * Returns true if the (already-safe) href is an absolute http(s) URL.
 * Use to decide whether a link should open in a new tab with noopener.
 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
