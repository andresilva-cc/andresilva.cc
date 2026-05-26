const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const;

/*
 * Formats a date as `${mon} ${year}` (lowercase, three-letter month) —
 * the typographic convention used across the redesign for career roles
 * (e.g. "apr 2025"). Returns "now" when the date is omitted.
 *
 * Reads UTC accessors so the rendered month is stable across server
 * timezones. Job dates must be constructed with Date.UTC() to match.
 */
export function formatMonthYear(date?: Date): string {
  if (!date) return 'now';
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/*
 * Formats a date range with an em-dash separator and trailing "now"
 * when there is no end date (e.g. "apr 2025 — now").
 */
export function formatDateRange(start: Date, end?: Date): string {
  return `${formatMonthYear(start)} — ${formatMonthYear(end)}`;
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
