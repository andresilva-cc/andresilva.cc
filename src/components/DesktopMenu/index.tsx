'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import clsx from 'clsx';
import { LinkButton } from '@/components/LinkButton';

export interface DesktopMenuProps {
  items: Array<{
    name: string
    path: string
    hideOnDesktop?: boolean
  }>
  className?: string
}

export function DesktopMenu({ items, className }: DesktopMenuProps) {
  const t = useTranslations();
  const currentPath = usePathname();
  const desktopOnlyItems = items.filter((item) => !item.hideOnDesktop);

  return (
    <nav className={clsx(className)}>
      <ul className="flex gap-16">
        { desktopOnlyItems.map((item) => (
          <li key={item.path}>
            <LinkButton
              variant={currentPath === item.path ? 'default' : 'text'}
              href={item.path}
            >
              { /* TODO: fix dynamic key type */ }
              { t(item.name as any) }
            </LinkButton>
          </li>
        ))}
      </ul>
    </nav>
  );
}
