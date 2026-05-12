import { ComponentProps, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';

import { Text } from '@/components/text';

type ButtonElementProps = Omit<ComponentProps<'button'>, 'children' | 'className'>;

export interface ButtonProps extends ButtonElementProps {
  /** Merge Button's classes onto a single child element (e.g. a next/link). Useful for link-buttons. */
  asChild?: boolean;
  className?: string;
  children: ReactNode;
}

/*
 * Button — the canonical outlined-accent CTA.
 *
 * Renders a 12px Mono / 600 / uppercase label with `--tracking-button`
 * tracking, inside an `--accent-muted` border. Hover fills with
 * `--accent-tint`, brightens the border to `--accent`, and shifts text
 * to `--accent-strong`. Active inverts to a solid `--accent` fill with
 * `--canvas` text — the "loud moment" that mirrors the SkipLink's solid
 * fill. Press feedback uses the `scale-press` token (97%).
 *
 * Single style; no variants. The design has one button language.
 *
 * Polymorphic via `asChild` — pass `<Link>` or `<a>` as the single
 * child to render a link styled as a button.
 */
export function Button({
  asChild = false, className, children, ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Text asChild variant="meta">
      <Comp
        className={clsx(
          // font-semibold intentionally overrides meta's default 500 weight
          // — Button is canonically 12px / 600 per docs/design-system.md.
          'inline-flex items-center gap-2 border border-accent-muted px-5 py-3 font-semibold uppercase tracking-button text-accent no-underline cursor-pointer select-none',
          // `transition` (not `transition-colors`) so the press-scale on
          // .active also animates — transition-colors + transition-transform
          // would clobber each other since both set the shorthand.
          'transition duration-fast ease-out',
          'motion-safe:hover:bg-accent-tint motion-safe:hover:border-accent motion-safe:hover:text-accent-strong',
          'active:bg-accent active:text-canvas active:border-accent',
          'motion-safe:active:scale-press',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
          className,
        )}
        {...(asChild ? {} : { type: 'button' as const })}
        {...props}
      >
        { children }
      </Comp>
    </Text>
  );
}
