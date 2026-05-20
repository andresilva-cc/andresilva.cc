import Image from 'next/image';

export interface FigureProps {
  caption: string;
  number: number;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/*
 * Figure — flush diagram with typographic caption, per decision log §3.9.
 *
 * Accepts src/alt/width/height as direct props rather than a markdown-image
 * child. This avoids the nested <figure> problem that would arise if the
 * child were processed through ImageMdx (which wraps every image in its own
 * <figure>). Rendering next/image directly here keeps the HTML valid and
 * gives Figure full control over image presentation (no border, no shadow).
 *
 * Author usage in MDX:
 *   <Figure caption="Client-side rendering flow." number={1}
 *           src="./diagram.png" alt="alt text" width={800} height={600} />
 */
export function Figure({ caption, number, src, alt = '', width, height }: FigureProps) {
  const hasSize = Boolean(width && height);

  return (
    <figure className="my-8 mx-auto max-w-prose-figure">
      { hasSize && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block w-full h-auto"
        />
      ) }
      { !hasSize && (
        // Plain <img> fallback for figures where Velite does not emit width/height
        // metadata (e.g. absolute-URL images). This bypasses next/image's host
        // allowlist — acceptable under the single-author trust model (all MDX is
        // authored content).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="block w-full h-auto"
        />
      ) }
      <figcaption className="mt-3 text-sm font-mono text-left">
        <span className="text-accent">{ `Fig. ${number} —` }</span>
        { ' ' }
        <span className="text-fg-muted">{ caption }</span>
      </figcaption>
    </figure>
  );
}
