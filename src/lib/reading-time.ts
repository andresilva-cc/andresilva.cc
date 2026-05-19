const WPM = 220;

/*
 * Counts whitespace-delimited tokens in raw markdown/MDX text. MDX tags and
 * frontmatter inflate the count slightly; close enough for a reading-time
 * hint. Used by both `readingTime` and the Velite transform's `wordCount`
 * field so the two metrics stay in lockstep — change the tokenisation here
 * and both update.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/*
 * Estimates reading time in minutes from raw markdown/MDX text. WPM = 220
 * (average adult reading speed). Counts all whitespace-delimited tokens,
 * including MDX/HTML tags — the slight overcounting is acceptable for
 * prose-heavy articles. Returns at least 1.
 */
export function readingTime(text: string): number {
  return Math.max(1, Math.round(countWords(text) / WPM));
}
