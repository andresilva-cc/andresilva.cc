const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const;

/*
 * Formats a date as `${mon} ${year}` (lowercase, three-letter month) —
 * the typographic convention used across the redesign for career roles
 * (e.g. "apr 2025"). Returns "now" when the date is omitted.
 */
export function formatMonthYear(date?: Date): string {
  if (!date) return 'now';
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/*
 * Formats a date range with an em-dash separator and trailing "now"
 * when there is no end date (e.g. "apr 2025 — now").
 */
export function formatDateRange(start: Date, end?: Date): string {
  return `${formatMonthYear(start)} — ${formatMonthYear(end)}`;
}
