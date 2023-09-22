import { ReactNode } from 'react';
import clsx from 'clsx';

type TextStyles = {
  [key: string]: {
    element: keyof JSX.IntrinsicElements,
    classes: string
  }
};

const textStyles: TextStyles = {
  h1: {
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
  h3: {
    element: 'h3',
    classes: 'font-sans font-medium text-base',
  },
  menu: {
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
  caption: {
    element: 'span',
    classes: 'font-mono font-normal text-xs uppercase',
  },
};

export interface TextProps {
  textStyle?: 'h1' | 'h2-sans' | 'h2-mono' | 'h3' | 'menu' | 'body-1' | 'body-2' | 'body-3' | 'caption'
  element?: keyof JSX.IntrinsicElements
  children: ReactNode
  className?: string
}

export function Text({
  textStyle = 'body-1', element, children, className,
}: TextProps) {
  const style = textStyles[textStyle];
  const Element = (element || style.element) as keyof JSX.IntrinsicElements;

  return (
    <Element className={clsx(style.classes, className)}>
      { children }
    </Element>
  );
}
