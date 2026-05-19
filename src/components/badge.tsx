import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';

export interface BadgeProps {
  className?: string;
  children: ReactNode;
}

/*
 * Badge — outlined accent label, uppercase, decorative (non-interactive).
 *
 * Used as the categorical marker in the home Latest section (CAREER /
 * PROJECT / ARTICLE) and as the FEATURED overlay on featured project
 * cards. The visual primitive is the same; positioning, min-width, and
 * any opaque-bg override are the parent component's concern (passed
 * through `className`).
 *
 * No hover state by design — see docs/design-system.md §"08c. Floating
 * badge" and §"08b. Row badge" notes.
 *
 * Source text is authored in title case (Career, Featured); CSS uppercase
 * handles the rendering.
 */
export function Badge({ className, children }: BadgeProps) {
  return (
    <Text asChild variant="micro">
      <span
        className={clsx(
          'inline-flex items-center border border-accent-muted text-accent px-2 py-0.5 uppercase tracking-badge select-none',
          className,
        )}
      >
        { children }
      </span>
    </Text>
  );
}
