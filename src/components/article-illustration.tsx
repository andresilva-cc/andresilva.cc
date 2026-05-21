import Link from 'next/link';

import { StippleArt } from '@/components/stipple-art';

interface ArticleIllustrationProps {
  /** Internal URL — `/articles/<slug>`. */
  url: string;
  config: string;
  title: string;
}

/*
 * ArticleIllustration — a linked stipple-art thumbnail for an article card.
 *
 * The anchor is taken out of the accessibility tree (tabIndex={-1},
 * aria-hidden="true") because the card already exposes two announced
 * links to the same URL: the title InlineLink and the "read article"
 * ArrowLink. A third announced link would be a redundant duplicate for
 * screen-reader users. The illustration remains mouse-clickable.
 *
 * fontSize: 6px is a one-off embed-tuning value — it sets the stipple
 * grid density against the host container. There is no token for it
 * because it is not a design-system spacing decision; it is a rendering
 * parameter specific to this embed surface.
 */
export function ArticleIllustration({ url, config, title }: ArticleIllustrationProps) {
  return (
    <Link
      href={url}
      aria-label={title}
      className="absolute inset-0"
      tabIndex={-1}
      aria-hidden="true"
    >
      <StippleArt
        mode="hover"
        config={config}
        link="badge"
        fit="none"
        className="font-mono text-fg-muted m-0 p-0 select-none block overflow-hidden w-full h-full"
        style={{ fontSize: '6px', lineHeight: 1 }}
      />
    </Link>
  );
}
