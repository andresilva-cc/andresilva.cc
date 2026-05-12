import { Fragment } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { getRepositories } from '@/repositories';

export interface FooterProps {
  className?: string;
}

/*
 * Footer — single row of lowercase social links separated by middle
 * dots; thin top border. No copyright line (decision logged in
 * redesign/notes.md: a copyright on a personal site is decoration).
 *
 * Each link routes externally except for the mailto: entry, which the
 * browser handles natively. All non-mail links are opened in a new tab
 * with rel="noopener noreferrer".
 */
export function Footer({ className }: FooterProps) {
  const { footerRepository } = getRepositories();
  const items = footerRepository.getAll();

  return (
    <footer className={clsx('flex items-baseline justify-center border-t border-rule', className)}>
      <div className="flex items-baseline">
        { items.map((item, index) => {
          const isMail = item.url.startsWith('mailto:');
          return (
            <Fragment key={item.url}>
              { index > 0 && (
                <Text variant="micro" as="span" className="px-0.5 text-fg-subtle font-normal">·</Text>
              ) }
              <Text asChild variant="micro">
                <a
                  href={item.url}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  className="lowercase font-normal text-fg-muted no-underline transition-colors duration-fast ease-out motion-safe:hover:text-accent-strong"
                >
                  { item.title }
                </a>
              </Text>
            </Fragment>
          );
        }) }
      </div>
    </footer>
  );
}
