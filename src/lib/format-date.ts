const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const;

/*
 * Formats a date as `${mon} ${year}` (lowercase, three-letter month) —
 * the typographic convention used across the redesign for career roles
 * (e.g. "apr 2025"). Returns `openLabel` ("now" by default) when the
 * date is omitted — /resume passes "present" here, the term ATS parsers
 * pattern-match (case-insensitively, so lowercase costs nothing there)
 * instead of the site's "now"; /career keeps the "now" default (brand
 * voice), which is why this is an optional param rather than a fork.
 * Both stay lowercase — "present" is not a proper noun, and diverging
 * casing mid-string was never a deliberate distinction.
 *
 * Reads UTC accessors so the rendered month is stable across server
 * timezones. Job dates must be constructed with Date.UTC() to match.
 */
export function formatMonthYear(date?: Date, openLabel: string = 'now'): string {
  if (!date) return openLabel;
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/*
 * Formats a date range with an em-dash separator and a trailing label
 * when there is no end date (e.g. "apr 2025 — now", or "apr 2025 —
 * present" when `openLabel` is overridden).
 */
export function formatDateRange(start: Date, end?: Date, openLabel: string = 'now'): string {
  return `${formatMonthYear(start)} — ${formatMonthYear(end, openLabel)}`;
}

/*
 * Formats an ISO date string into the canonical `YYYY.MM.DD` lowercase
 * date used across the redesign for content metadata. Returns an empty
 * string for invalid or missing timestamps.
 *
 * Reads UTC accessors so the rendered date doesn't shift with the
 * server's local timezone.
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}
