import { Fragment } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { useRepositories } from '@/hooks/use-repositories';

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
  const { footerRepository } = useRepositories();
  const items = footerRepository.getAll();

  return (
    <footer className={clsx('flex items-baseline justify-center border-t border-rule', className)}>
      <div className="flex items-baseline">
        { items.map((item, index) => {
          const isMail = item.url.startsWith('mailto:');
          return (
            <Fragment key={item.url}>
              { index > 0 && (
                <Text variant="meta" as="span" className="px-2 text-fg-subtle">·</Text>
              ) }
              <Text asChild variant="meta">
                <a
                  href={item.url}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  className="lowercase text-fg-muted no-underline transition-colors duration-fast ease-out motion-safe:hover:text-fg"
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
