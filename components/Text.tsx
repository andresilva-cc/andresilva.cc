import { ReactNode } from 'react';

import { textStyles } from '@/utils/textStyles';

interface TextProps {
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
    <Element className={`${style.classes} ${className}`}>
      { children }
    </Element>
  );
}
