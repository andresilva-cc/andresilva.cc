import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/* Attributes accepted by the <stipple-art> custom element shipped from
   art.andresilva.cc/embed/stipple.js. Custom-element attributes are all
   strings — see src/components/stipple-art.tsx for the typed wrapper. */
interface StippleArtAttributes extends HTMLAttributes<HTMLElement> {
  config?: string;
  mode?: string;
  cols?: string;
  rows?: string;
  fps?: string;
  fit?: string;
  link?: string;
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'stipple-art': DetailedHTMLProps<StippleArtAttributes, HTMLElement>;
      }
    }
  }
}
