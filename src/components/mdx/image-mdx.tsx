import Image from 'next/image';

export interface ImageMdxProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
}

/*
 * ImageMdx — wraps next/image for use inside MDX article bodies.
 *
 * Consumes the width/height metadata that Velite's asset pipeline emits
 * when processing relative image references (e.g. ./images/diagram.png).
 * Adds a 1px hairline border per design spec §4.9.
 *
 * Hover: no grayscale reveal. Article images are content illustrations,
 * not identity photos — they render at full strength, static. (§4.9)
 *
 * When width/height are not available (rare — an absolute-URL image with
 * no dimensions), falls back to a plain <img> with the same classes.
 */
export function ImageMdx({ src, alt = '', width, height, title }: ImageMdxProps) {
  const caption = title;
  const hasSize = Boolean(width && height);

  return (
    <figure className="my-6">
      { hasSize && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block max-w-full w-full h-auto border border-rule"
        />
      ) }
      { !hasSize && (
        // Plain <img> fallback for external/absolute URLs where Velite does not
        // emit width/height metadata. This bypasses next/image's host allowlist —
        // acceptable under the single-author trust model (all MDX is authored content).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="block max-w-full w-full h-auto border border-rule"
        />
      ) }
      { caption && (
        <figcaption className="mt-2 text-meta text-fg-subtle italic font-mono">
          { caption }
        </figcaption>
      ) }
    </figure>
  );
}
