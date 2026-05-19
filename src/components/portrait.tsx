import Image from 'next/image';
import clsx from 'clsx';

export interface PortraitProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/*
 * Portrait — André's photo as a foreground-coloured duotone (a
 * `mix-blend-mode: multiply` tint over the grayscale photo) + a
 * CRT-scanline overlay. Focus or hover reveals the natural color;
 * touch devices get a softer fallback filter since they can't hover.
 *
 * The state-driven filter + overlay + reduced-motion / pointer:coarse
 * fallbacks live in `.portrait` in globals.css — Tailwind utilities
 * can't combine them ergonomically. Component-scoped CSS, single class.
 */
export function Portrait({ src, alt, width, height, className }: PortraitProps) {
  return (
    <div
      tabIndex={0}
      role="img"
      aria-label={alt}
      className={clsx('portrait', className)}
    >
      {/* alt="" — the wrapper carries the accessible name via aria-label; the
          inner <img> is presentational to avoid duplicate announcement. */}
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
