'use client';

import { useState } from 'react';

interface YouTubeSwapProps {
  id: string;
  caption?: string;
  thumbnailSrc: string;
  embedSrc: string;
}

/*
 * YouTubeSwap — thin client island for the click-to-load swap.
 *
 * Replaces the static thumbnail façade (rendered by the server component)
 * with a live <iframe> on click. The server component owns all static markup;
 * this component owns only the stateful swap behavior.
 */
export function YouTubeSwap({ id, caption, thumbnailSrc, embedSrc }: YouTubeSwapProps) {
  const [active, setActive] = useState(false);
  const ariaLabel = caption ? `Play video: ${caption}` : `Play video (YouTube ${id})`;

  return (
    <figure className="my-6">
      <div className="relative max-w-prose-wide w-full" style={{ aspectRatio: '16 / 9' }}>
        { active && (
          <iframe
            src={embedSrc}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border border-rule bg-canvas"
          />
        ) }
        { !active && (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={ariaLabel}
            className="group/yt-play absolute inset-0 w-full h-full border border-rule bg-canvas overflow-hidden cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover [filter:grayscale(1)_contrast(0.95)] motion-safe:transition-[filter] duration-200 ease-out motion-safe:group-hover/yt-play:[filter:none]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex items-center justify-center size-16 bg-canvas border border-accent text-accent text-2xl motion-safe:transition-colors duration-fast ease-out motion-safe:group-hover/yt-play:border-accent-strong">
                ▶
              </span>
            </span>
          </button>
        ) }
      </div>
      { caption && (
        <figcaption className="mt-2 text-meta text-fg-subtle italic font-mono">
          { caption }
        </figcaption>
      ) }
    </figure>
  );
}
