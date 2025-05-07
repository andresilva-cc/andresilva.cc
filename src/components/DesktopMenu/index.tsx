'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import clsx from 'clsx';
import { LinkButton } from '@/components/LinkButton';
import type { MenuRepositoryResponse } from '@/repositories/MenuRepository';

export interface DesktopMenuProps {
  items: Array<MenuRepositoryResponse>
  className?: string
}

export function DesktopMenu({ items, className }: DesktopMenuProps) {
  const t = useTranslations();
  const currentPath = usePathname();

  const menuItems = useMemo(() => items.map((item) => ({
    ...item,
    active: item.activeRegex
      ? new RegExp(item.activeRegex).test(currentPath)
      : item.path === currentPath,
  })).filter((item) => !item.hideOnDesktop), [items, currentPath]);

  return (
    <nav className={clsx(className)}>
      <ul className="flex gap-16">
        { menuItems.map((item) => (
          <li key={item.path}>
            <LinkButton
              variant={item.active ? 'default' : 'text'}
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
