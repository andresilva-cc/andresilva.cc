export interface FigureCaptionProps {
  number: number;
  caption: string;
}

/*
 * FigureCaption — shared caption renderer for <Figure> and <YouTube>.
 *
 * "Fig. N" is the categorical label and sits in text-accent. The em-dash and
 * caption body are structural punctuation + content and sit in text-fg-muted —
 * accent marks the type of thing, not the separator (same rule as the `·`
 * middot in metadata rows).
 */
export function FigureCaption({ number, caption }: FigureCaptionProps) {
  return (
    <figcaption className="mt-3 text-sm font-mono text-left">
      <span className="text-accent">{ `Fig. ${number}` }</span>
      <span className="text-fg-muted">{ ` — ${caption}` }</span>
    </figcaption>
  );
}
