export interface YouTubeRssProps {
  id: string;
  caption?: string;
  number?: number;
}

export function YouTubeRss({ id, caption, number }: YouTubeRssProps) {
  return (
    <figure>
      <a href={`https://www.youtube.com/watch?v=${id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt={caption ?? ''}
          loading="lazy"
        />
      </a>
      {caption !== undefined && number !== undefined && (
        <figcaption>{`Fig. ${number} — ${caption}`}</figcaption>
      )}
    </figure>
  );
}
