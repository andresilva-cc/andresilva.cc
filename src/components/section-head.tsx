import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';

export interface SectionHeadProps {
  /** H2 title. */
  title: string;
  /** Accessible id; should match the H2's id for `aria-labelledby` parents. */
  id?: string;
  /** Optional right-aligned slot for things like ArrowLinks ("Full bio →"). */
  cta?: ReactNode;
  /** Drop the bottom border + margin when the next element provides its own top rule (e.g. a GridFrame). */
  flush?: boolean;
  className?: string;
}

/*
 * SectionHead — h2 + optional right-aligned CTA.
 *
 * Used on every banded section. The `flush` variant zeros both the
 * margin-bottom and the bottom border to prevent doubled 2px seams when
 * the next element already carries a top rule.
 */
export function SectionHead({
  title, id, cta, flush = false, className,
}: SectionHeadProps) {
  return (
    <div
      className={clsx(
        'flex justify-between items-baseline gap-4 flex-wrap pb-4',
        flush ? null : 'mb-5 border-b border-rule',
        className,
      )}
    >
      <Text variant="h2" id={id}>{ title }</Text>
      { cta }
    </div>
  );
}
