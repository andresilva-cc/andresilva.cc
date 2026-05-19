import clsx from 'clsx';

import { Text } from '@/components/text';
import { safeHref } from '@/lib/safe-href';
import { getRepositories } from '@/repositories';

export interface FooterProps {
  className?: string;
}

/*
 * Footer — a centered row of lowercase social links, separated by
 * spacing only. No dot separators: the footer is a nav-style row of
 * discrete links (like the header), not an inline list of fragments —
 * the `·` separator belongs to within-a-value lists (Facts, article
 * meta), not between sibling links. The row wraps to multiple centered
 * lines on narrow viewports; with no separator, nothing can orphan at a
 * line edge, so no responsive regime split is needed.
 *
 * Thin top border, no copyright line (decision logged in
 * docs/redesign-log.md). Each link routes externally except the
 * mailto: entry; non-mail links open in a new tab with rel="noopener
 * noreferrer".
 */
export function Footer({ className }: FooterProps) {
  const { footerRepository } = getRepositories();
  const items = footerRepository.getAll();

  return (
    <footer className={clsx('flex justify-center border-t border-rule tracking-button py-8', className)}>
      <ul className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 list-none p-0 m-0">
        { items.map((item) => {
          const href = safeHref(item.url);
          const isMail = href.startsWith('mailto:');
          return (
            <li key={item.url}>
              <Text asChild variant="micro">
                <a
                  href={href}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  className="lowercase font-normal text-fg-subtle no-underline transition-colors duration-fast ease-out motion-safe:hover:text-accent-strong motion-safe:hover:underline"
                >
                  { item.title }
                </a>
              </Text>
            </li>
          );
        }) }
      </ul>
    </footer>
  );
}
