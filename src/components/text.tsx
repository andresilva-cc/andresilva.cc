import { ReactNode, ElementType, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';

/*
 * Text — typography primitive for the andresilva.cc design system.
 *
 * Variants apply the canonical size + line-height + font-family + weight
 * presets from docs/design-system.md. Components either use Text directly
 * (for prose content) or compose it via `asChild` (when the consumer wants
 * Text's classes merged onto its own element without an extra wrapper).
 *
 * Standard HTML attributes (`id`, `aria-*`, `data-*`, `onClick`, etc.) are
 * forwarded to the rendered element via rest spread.
 */

const variants = {
  display: { element: 'h1', classes: 'text-display font-display' },
  h1: { element: 'h1', classes: 'text-h1 font-display' },
  h2: { element: 'h2', classes: 'text-h2 font-mono font-semibold' },
  h3: { element: 'h3', classes: 'text-h3 font-mono font-semibold' },
  body: { element: 'p', classes: 'text-body font-mono' },
  meta: { element: 'span', classes: 'text-meta font-mono font-medium' },
  micro: { element: 'span', classes: 'text-micro font-mono font-semibold' },
} as const;

export type TextVariant = keyof typeof variants;

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  /** Override the rendered element. Ignored when `asChild` is true (the child's element wins). */
  as?: ElementType;
  /** Merge Text's classes onto a single child element via Radix Slot (precedence: `asChild` > `as` > variant default). */
  asChild?: boolean;
  children: ReactNode;
}

export function Text({
  variant = 'body',
  as,
  asChild = false,
  className,
  children,
  ...rest
}: TextProps) {
  const Comp = asChild ? Slot : (as ?? variants[variant].element);

  return (
    <Comp className={clsx(variants[variant].classes, className)} {...rest}>
      { children }
    </Comp>
  );
}
