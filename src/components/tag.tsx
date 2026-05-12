import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';

export interface TagProps {
  className?: string;
  children: ReactNode;
}

/*
 * Tag — outlined chip for tech labels and similar inline categorical text.
 *
 * Renders Mono / 500 / micro inside a transparent box with an accent-muted
 * border. The hover state nudges the border to full accent — "texture, not
 * affordance" per principle 02 of the design system. Gated to hover-capable
 * pointers and reduced-motion users to avoid sticky-hover on touch.
 *
 * Casing is the caller's responsibility:
 * - Tech chips (career, projects): canonical brand case (TypeScript, Vue.js).
 * - Article tags (articles): lowercase as delivered by the dev.to API.
 */
export function Tag({ className, children }: TagProps) {
  return (
    <Text asChild variant="micro">
      {/* font-medium intentionally overrides micro's default 600 weight —
          Tag is canonically 11px / 500 (see docs/design-system.md type scale). */}
      <span
        className={clsx(
          'inline-flex items-center border border-accent-muted text-accent font-medium px-2 py-0.5 transition-colors duration-fast ease-out',
          'motion-safe:hover:border-accent',
          className,
        )}
      >
        { children }
      </span>
    </Text>
  );
}
