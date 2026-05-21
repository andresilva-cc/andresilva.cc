import Image from 'next/image';

export interface ImageMdxProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/*
 * ImageMdx — bare flush image for the ![]() MDX path.
 *
 * Consumes width/height metadata emitted by Velite's asset pipeline and
 * renders via next/image. Falls back to a plain <img> for external URLs
 * where Velite emits no dimensions.
 *
 * No border, no caption. For captioned, numbered figures, use <Figure>.
 */
export function ImageMdx({ src, alt = '', width, height }: ImageMdxProps) {
  const hasSize = Boolean(width && height);

  if (hasSize) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block my-6 max-w-full w-full h-auto"
      />
    );
  }

  return (
    // Plain <img> fallback for external/absolute URLs where Velite does not
    // emit width/height metadata. Bypasses next/image host allowlist —
    // acceptable under the single-author trust model (all MDX is authored content).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="block my-6 max-w-full w-full h-auto"
    />
  );
}
