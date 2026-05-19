/*
 * Returns the last non-empty path segment of a URL as the slug.
 * Used to look up per-article illustrations keyed by dev.to slug.
 * Returns an empty string for invalid or unparseable URLs.
 */
export function getSlug(url: string): string {
  try {
    return new URL(url).pathname.split('/').filter(Boolean).pop() ?? '';
  }
  catch {
    return '';
  }
}
