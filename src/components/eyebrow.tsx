import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';

export interface EyebrowProps {
  className?: string;
  children: ReactNode;
}

/*
 * Eyebrow — small label above a section heading.
 *
 * Renders the canonical `// NN / phrase` comment-tag format: micro size,
 * Mono / 600, accent color, uppercase with eyebrow-tracking. The phrase
 * itself must be authored lowercase; CSS handles the uppercase rendering.
 * See docs/copy-guide.md §"Eyebrow patterns".
 */
export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <Text
      variant="micro"
      as="span"
      className={clsx('uppercase tracking-eyebrow text-accent', className)}
    >
      { children }
    </Text>
  );
}
