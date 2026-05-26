export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// toUTCString() isn't spec-guaranteed to be RFC 822, but Node/V8 always emits
// it that way. Revisit if the runtime changes to Bun or Deno.
export function toRfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

// Escape any literal ]]> sequences so they don't close the CDATA section early.
export function escapeCdata(html: string): string {
  return html.replace(/]]>/g, ']]]]><![CDATA[>');
}
