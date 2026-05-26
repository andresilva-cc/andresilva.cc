import { absolutize } from '@/lib/rss-url';

export interface ImageMdxRssProps {
  src: string;
  alt?: string;
}

export function makeImageMdxRss(basePath: string) {
  return function ImageMdxRss({ src, alt = '' }: ImageMdxRssProps) {
    const absoluteSrc = absolutize(src, basePath);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={absoluteSrc} alt={alt} loading="lazy" />
    );
  };
}
