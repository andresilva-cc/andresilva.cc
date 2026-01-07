import { ReactNode, type JSX } from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';

const variants = {
  'h1': {
    element: 'h1',
    classes: 'font-mono font-bold text-6xl',
  },
  'h2-sans': {
    element: 'h2',
    classes: 'font-sans font-medium text-2xl',
  },
  'h2-mono': {
    element: 'h2',
    classes: 'font-mono font-semibold text-2xl uppercase',
  },
  'h3': {
    element: 'h3',
    classes: 'font-sans font-medium text-base',
  },
  'button': {
    element: 'span',
    classes: 'font-mono font-bold text-base uppercase',
  },
  'body-1': {
    element: 'p',
    classes: 'font-sans font-normal text-base',
  },
  'body-2': {
    element: 'p',
    classes: 'font-sans font-normal text-sm',
  },
  'body-3': {
    element: 'p',
    classes: 'font-sans font-normal text-xs',
  },
  'caption': {
    element: 'span',
    classes: 'font-mono font-normal text-xs uppercase',
  },
};

export interface TextProps {
  variant?: keyof typeof variants;
  element?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export function Text({
  variant = 'body-1', element, children, asChild = false, className,
}: TextProps) {
  const Tag = asChild ? Slot : element || variants[variant].element;

  return (
    <Tag className={clsx(variants[variant].classes, className)}>
      { children }
    </Tag>
  );
}
