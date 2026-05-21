import { absolutize } from '@/lib/rss-url';

export interface FigureRssProps {
  caption: string;
  number: number;
  src: string;
  alt?: string;
}

export function makeFigureRss(basePath: string) {
  return function FigureRss({ caption, number, src, alt = '' }: FigureRssProps) {
    const absoluteSrc = absolutize(src, basePath);
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={absoluteSrc} alt={alt} loading="lazy" />
        <figcaption>{`Fig. ${number} — ${caption}`}</figcaption>
      </figure>
    );
  };
}
