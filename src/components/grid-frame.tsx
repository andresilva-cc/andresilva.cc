import { ReactNode, ElementType } from 'react';
import clsx from 'clsx';

export interface GridFrameProps {
  /** Defaults to "ul". Use "div" or "ol" when the children aren't list items. */
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/*
 * GridFrame — closed-corner grid container.
 *
 * Outer cells share only the inner rules; the container itself supplies
 * a top + left hairline so the grid reads as a single bounded surface
 * regardless of how many cells live inside. Cells get padding + right
 * and bottom hairlines via the `*:` child variant.
 *
 * Consumer is responsible for `grid-cols-*` classes (including responsive
 * variants like `grid-cols-1 md:grid-cols-3`).
 */
export function GridFrame({ as, className, children }: GridFrameProps) {
  const Comp = (as ?? 'ul') as ElementType;
  return (
    <Comp
      className={clsx(
        'grid border-t border-l border-rule list-none p-0 m-0',
        '*:p-5 *:border-r *:border-b *:border-rule',
        className,
      )}
    >
      { children }
    </Comp>
  );
}
