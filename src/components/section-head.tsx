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
  className?: string;
}

/*
 * SectionHead — h2 + optional right-aligned CTA.
 *
 * No rule of its own: the section band's bottom border is the only separator.
 */
export function SectionHead({
  title, id, cta, className,
}: SectionHeadProps) {
  return (
    <div
      className={clsx(
        'flex justify-between items-baseline gap-4 flex-wrap pb-4',
        className,
      )}
    >
      <Text variant="h2" id={id}>{ title }</Text>
      { cta }
    </div>
  );
}
