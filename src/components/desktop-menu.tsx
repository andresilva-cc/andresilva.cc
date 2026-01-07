'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { LinkButton } from '@/components/link-button';
import type { MenuRepositoryResponse } from '@/repositories/menu-repository';

export interface DesktopMenuProps {
  items: Array<MenuRepositoryResponse>;
  className?: string;
}

export function DesktopMenu({ items, className }: DesktopMenuProps) {
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
              { item.name }
            </LinkButton>
          </li>
        ))}
      </ul>
    </nav>
  );
}
