import { SVGProps } from 'react';

export interface IconHeartProps extends SVGProps<SVGSVGElement> {}

export function IconHeart({ className, ...rest }: IconHeartProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M8 14 L1.6 7 Q1 3 4.5 3 Q6.8 3 8 5 Q9.2 3 11.5 3 Q15 3 14.4 7 Z" />
    </svg>
  );
}
