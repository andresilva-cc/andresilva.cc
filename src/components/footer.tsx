import clsx from 'clsx';

import { Text } from '@/components/text';
import { safeHref } from '@/lib/safe-href';
import { getRepositories } from '@/repositories';

export interface FooterProps {
  className?: string;
}

/*
 * Footer — lowercase social links; thin top border. No copyright line
 * (decision logged in docs/redesign-log.md).
 *
 * Two responsive regimes for the link row:
 *  - < sm (mobile): the row wraps to multiple centered lines. Visible dot
 *    separators are DROPPED here — a centered wrapped row cannot keep a
 *    separator off the line edge, so links are spaced with whitespace
 *    (gap) only. This is robust by construction: no separator exists,
 *    so none can orphan.
 *  - >= sm: the 6-link row is guaranteed single-line. Middle-dot
 *    separators are rendered as the `.footer-links li::before`
 *    pseudo-element (on the <li>, not the <a> — so the dot is never part
 *    of a link's clickable or hover area) with equal margin on both
 *    sides, so each dot sits optically centered between its neighbours.
 *    The first item's dot is suppressed.
 *
 * Each link routes externally except the mailto: entry. Non-mail links
 * open in a new tab with rel="noopener noreferrer".
 */
export function Footer({ className }: FooterProps) {
  const { footerRepository } = getRepositories();
  const items = footerRepository.getAll();

  return (
    <footer className={clsx('flex justify-center border-t border-rule tracking-button py-8', className)}>
      <ul className="footer-links flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 sm:gap-x-0 list-none p-0 m-0">
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
