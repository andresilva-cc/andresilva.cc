// NOTE: This file is intentionally excluded from the app's tsconfig.json.
// Grafex uses its own JSX namespace that collides with React's, so it must
// be compiled in isolation by the grafex toolchain — not by tsc.
//
// The Props interface below is the CONTRACT with scripts/og/generate.mjs.
// If the shape changes, update BOTH files in lockstep.
// Drift surfaces at build time (grafex throws on missing/wrong props),
// NOT at lint time — there is no static type-checking across this boundary.

import type { CompositionConfig } from 'grafex';

export const config: CompositionConfig = {
  width: 1200,
  height: 630,
  // Fonts are fetched at build time inside grafex's headless WebKit.
  // If Vercel's outbound network blocks the Google Fonts URL, the build
  // will fail. Use SKIP_OG_BUILD=1 (§6.1.2) as the documented escape hatch.
  fonts: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=VT323&display=swap',
  ],
};

interface Props {
  title: string;
  publishedAt: string; // YYYY-MM-DD from frontmatter
  readingTime: number; // minutes
  // Currently unused visually — reserved for future cover art rendering
  coverArt?: { params: string } | null;
}

// Format date from ISO string (YYYY-MM-DDT...) to YYYY.MM.DD
function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.');
}

// Build the meta line segments — date and reading time only (no tags)
function buildMetaLine(publishedAt: string, readingTime: number): {
  date: string;
  time: string;
} {
  return {
    date: formatDate(publishedAt),
    time: `${readingTime} min`,
  };
}

// Pixel-A glyph — identical SVG from tools/og.tsx
function PixelA() {
  return (
    <svg width="36" height="48" viewBox="0 0 18 24" fill="none" aria-hidden="true">
      <rect x="3" y="0" width="3" height="3" fill="#C8FF3D" />
      <rect x="6" y="0" width="3" height="3" fill="#C8FF3D" />
      <rect x="9" y="0" width="3" height="3" fill="#C8FF3D" />
      <rect x="12" y="0" width="3" height="3" fill="#C8FF3D" />
      <rect x="0" y="3" width="3" height="3" fill="#C8FF3D" />
      <rect x="15" y="3" width="3" height="3" fill="#C8FF3D" />
      <rect x="0" y="6" width="3" height="3" fill="#C8FF3D" />
      <rect x="15" y="6" width="3" height="3" fill="#C8FF3D" />
      <rect x="0" y="9" width="3" height="3" fill="#C8FF3D" />
      <rect x="3" y="9" width="3" height="3" fill="#C8FF3D" />
      <rect x="6" y="9" width="3" height="3" fill="#C8FF3D" />
      <rect x="9" y="9" width="3" height="3" fill="#C8FF3D" />
      <rect x="12" y="9" width="3" height="3" fill="#C8FF3D" />
      <rect x="15" y="9" width="3" height="3" fill="#C8FF3D" />
      <rect x="0" y="12" width="3" height="3" fill="#C8FF3D" />
      <rect x="15" y="12" width="3" height="3" fill="#C8FF3D" />
      <rect x="0" y="15" width="3" height="3" fill="#C8FF3D" />
      <rect x="15" y="15" width="3" height="3" fill="#C8FF3D" />
      <rect x="0" y="18" width="3" height="3" fill="#C8FF3D" />
      <rect x="15" y="18" width="3" height="3" fill="#C8FF3D" />
    </svg>
  );
}

export default function OgArticle({
  title,
  publishedAt,
  readingTime,
}: Props) {
  const { date, time } = buildMetaLine(publishedAt, readingTime);
  // Stored in a variable to prevent JSX from treating // as a comment node
  const eyebrowText = '// article';

  const metaParts: { text: string; isSep?: boolean }[] = [
    { text: date },
    { text: '·', isSep: true },
    { text: time },
  ];

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: '#0B0F0A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header row — pixel-A glyph + wordmark */}
      <div
        style={{
          position: 'absolute',
          left: '64px',
          top: '56px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <PixelA />
        <span
          style={{
            fontFamily: '\'JetBrains Mono\', monospace',
            fontSize: '22px',
            fontWeight: 500,
            color: '#D7E5D0',
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          andresilva.cc
        </span>
      </div>

      {/* 2. Hairline at y=140 */}
      <div
        style={{
          position: 'absolute',
          left: '64px',
          right: '64px',
          top: '140px',
          height: '1px',
          background: '#1F2A1F',
        }}
      />

      {/* 3. Content cluster — eyebrow + title + meta, flex-column anchored at top:200 */}
      <div
        style={{
          position: 'absolute',
          left: '64px',
          top: '200px',
          width: '1072px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 3a. Eyebrow comment-tag "// article" — accent moment #1 */}
        <span
          style={{
            fontFamily: '\'JetBrains Mono\', monospace',
            fontSize: '17px',
            fontWeight: 600,
            color: '#C8FF3D',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            lineHeight: 1.5,
          }}
        >
          {eyebrowText}
        </span>

        {/* 3b. Title — VT323 80px, full width, 2-line clamp */}
        <div
          style={{
            marginTop: '32px',
            fontFamily: '\'VT323\', monospace',
            fontSize: '80px',
            fontWeight: 400,
            lineHeight: 1.10,
            color: '#D7E5D0',
            letterSpacing: '-0.01em',
            WebkitFontSmoothing: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>

        {/* 3c. Meta line — date · readingTime */}
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '8px',
            fontFamily: '\'JetBrains Mono\', monospace',
            fontSize: '22px',
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {metaParts.map(({ text, isSep }, i) => (
            <span
              key={i}
              style={{
                color: isSep ? '#7E8E76' : '#9DAA95',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
