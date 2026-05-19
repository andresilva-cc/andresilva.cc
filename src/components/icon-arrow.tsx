import { SVGProps } from 'react';

export interface IconArrowProps extends SVGProps<SVGSVGElement> {}

export function IconArrow({ className, ...rest }: IconArrowProps) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}
