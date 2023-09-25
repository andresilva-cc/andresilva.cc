import { ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import { Text } from '@/components/Text';
import clsx from 'clsx';

const variants = {
  default: 'text-gray-950 bg-primary-500 hover:bg-primary-400 active:bg-primary-300',
  text: 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300',
  icon: 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300 [&>svg]:inline-block',
};

export interface ButtonProps extends LinkProps {
  variant?: keyof typeof variants
  children: ReactNode
}

export function Button({
  variant = 'default', children, ...props
}: ButtonProps) {
  const isIcon = variant === 'icon';

  return (
    <Text variant="button" asChild>
      <Link
        className={clsx(
          'transition-colors hover:transition-none duration-300',
          { 'px-2.5 py-1 rounded': !isIcon },
          variants[variant],
        )}
        {...props}
      >

        { children }
      </Link>
    </Text>
  );
}
