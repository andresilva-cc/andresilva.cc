import Link from 'next/link';
import clsx from 'clsx';

import { Text } from '@/components/text';

export interface WordmarkProps {
  className?: string;
}

/*
 * Wordmark — pixel-SVG "A" glyph + andresilva.cc text.
 *
 * Always links to home. The "A" is rendered as 21 inline rects in
 * `currentColor` so it inherits the accent color from the parent's text
 * color; the wordmark text composes Text variant="meta" for the right
 * size + weight. Hover lifts the text from --fg to a brighter --fg via
 * the design's wordmark hover rule.
 */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label="andresilva.cc — home"
      className={clsx(
        'inline-flex items-center gap-2 text-fg no-underline',
        className,
      )}
    >
      <svg
        width="18"
        height="24"
        viewBox="0 0 18 24"
        fill="none"
        aria-hidden="true"
        className="text-accent shrink-0"
      >
        <rect x="3" y="0" width="3" height="3" fill="currentColor" />
        <rect x="6" y="0" width="3" height="3" fill="currentColor" />
        <rect x="9" y="0" width="3" height="3" fill="currentColor" />
        <rect x="12" y="0" width="3" height="3" fill="currentColor" />
        <rect x="0" y="3" width="3" height="3" fill="currentColor" />
        <rect x="15" y="3" width="3" height="3" fill="currentColor" />
        <rect x="0" y="6" width="3" height="3" fill="currentColor" />
        <rect x="15" y="6" width="3" height="3" fill="currentColor" />
        <rect x="0" y="9" width="3" height="3" fill="currentColor" />
        <rect x="3" y="9" width="3" height="3" fill="currentColor" />
        <rect x="6" y="9" width="3" height="3" fill="currentColor" />
        <rect x="9" y="9" width="3" height="3" fill="currentColor" />
        <rect x="12" y="9" width="3" height="3" fill="currentColor" />
        <rect x="15" y="9" width="3" height="3" fill="currentColor" />
        <rect x="0" y="12" width="3" height="3" fill="currentColor" />
        <rect x="15" y="12" width="3" height="3" fill="currentColor" />
        <rect x="0" y="15" width="3" height="3" fill="currentColor" />
        <rect x="15" y="15" width="3" height="3" fill="currentColor" />
        <rect x="0" y="18" width="3" height="3" fill="currentColor" />
        <rect x="15" y="18" width="3" height="3" fill="currentColor" />
      </svg>
      <Text variant="meta" as="span">andresilva.cc</Text>
    </Link>
  );
}
