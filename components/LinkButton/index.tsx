import { ComponentProps, ReactNode } from 'react';
import { Link } from '@/navigation';
import { Button, ButtonProps } from '@/components/Button';

export interface LinkButtonProps extends ButtonProps, Partial<ComponentProps<typeof Link>> {
  href: string
  children: ReactNode
  onClick?: () => any
}

export function LinkButton({
  variant, className, href, children, onClick, ...props
}: LinkButtonProps) {
  const isExternal = href.startsWith('http');

  return (
    <Button
      variant={variant}
      className={className}
      asChild
      onClick={onClick}
    >
      <Link
        href={href}
        target={isExternal ? '_blank' : '_self'}
        {...props}
      >
        { children }
      </Link>
    </Button>
  );
}
