import { FigureCaption } from './figure-caption';
import { YouTubeSwap } from './youtube-swap';

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export interface YouTubeProps {
  id: string;
  caption?: string;
  number?: number;
}

/*
 * YouTube — Server Component shell per decision log §3.7.
 *
 * Renders a static thumbnail façade in the initial HTML response:
 *   - <noscript> <iframe> so no-JS users get the embed
 *   - thumbnail <img> and play button visible in view-source (LCP-friendly)
 *
 * The click-to-load swap is handled by the thin client island YouTubeSwap.
 * No iframe is loaded before user interaction; prevents YouTube from loading
 * its JS bundle (~600 kB) on page load.
 *
 * Thumbnail: hqdefault.jpg (480×360). Grayscale at rest per design spec §4.11.
 * Play button: 64×64 square, bg-canvas, border-accent, ▶ glyph in text-accent.
 * Hover: grayscale dissolves over 200ms (motion-safe gated).
 * Click: façade replaced by the real <iframe> (instantaneous swap).
 */
export function YouTube({ id, caption, number }: YouTubeProps) {
  if (!id || !YOUTUBE_ID_RE.test(id)) {
    console.warn(`[YouTube] Invalid or missing video id: "${id}". Rendering nothing.`);
    return null;
  }
  if (number !== undefined && !caption) {
    console.warn(`[YouTube] "number" prop provided without "caption" — figure label will not render.`);
  }

  const thumbnailSrc = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${id}?autoplay=1`;
  const embedSrcNoAutoplay = `https://www.youtube.com/embed/${id}`;

  return (
    <>
      { /* no-JS fallback: render the iframe directly inside <noscript> so users
           without JavaScript still get the embed. Hidden from JS users by the
           client island which renders the interactive façade instead. */ }
      <noscript>
        <figure className="my-6">
          <div className="relative max-w-prose-wide w-full" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              src={embedSrcNoAutoplay}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full bg-canvas"
            />
          </div>
          { caption && number !== undefined && (
            <FigureCaption number={number} caption={caption} />
          ) }
          { caption && number === undefined && (
            <figcaption className="mt-3 text-sm font-mono text-left text-fg-muted">
              { caption }
            </figcaption>
          ) }
        </figure>
      </noscript>
      <YouTubeSwap
        id={id}
        caption={caption}
        number={number}
        thumbnailSrc={thumbnailSrc}
        embedSrc={embedSrc}
      />
    </>
  );
}
