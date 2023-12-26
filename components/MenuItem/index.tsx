import { ReactNode } from 'react';
import { LinkButton } from '@/components/LinkButton';

export interface MenuItemProps {
  href: string
  active?: boolean
  children: ReactNode
}

export function MenuItem({
  href, active = false, children,
}: MenuItemProps) {
  const variant = active ? 'default' : 'text';

  return (
    <LinkButton variant={variant} href={href}>
      { children }
    </LinkButton>
  );
}
