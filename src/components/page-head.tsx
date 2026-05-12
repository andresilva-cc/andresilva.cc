import clsx from 'clsx';

import { Text } from '@/components/text';

export interface PageHeadProps {
  /** Page name rendered between the angle braces (e.g. "ABOUT"). Authored in caps; CSS does no transform here. */
  name: string;
  className?: string;
}

/*
 * PageHead — the `<X />` brace pattern at the top of every page (except
 * home, which uses the hero composition instead). VT323 28px, with the
 * `<` and ` />` glyphs in --fg-subtle and the page name in --accent.
 *
 * The bracket-and-slash form deliberately echoes the wordmark's
 * "andresilva.cc" identity moment while still reading as a page title.
 */
export function PageHead({ name, className }: PageHeadProps) {
  return (
    <div className={clsx('pt-16 pb-5 border-b border-rule', className)}>
      <Text variant="h1">
        <span className="text-fg-subtle" aria-hidden="true">&lt;</span>
        <span className="text-accent">{ name }</span>
        <span className="text-fg-subtle" aria-hidden="true"> /&gt;</span>
      </Text>
    </div>
  );
}
