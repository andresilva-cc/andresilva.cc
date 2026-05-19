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

// Stipple-art note: the <stipple-art> web component requires the custom
// element to be registered in the browser and fetches its runtime from
// art.andresilva.cc — neither is available in grafex's headless WebKit
// without additional setup. The motif slot therefore renders a
// deterministic dot-grid pattern built from CSS, which preserves the
// brutalist-mono aesthetic without a network dependency. Option (c) per
// T6 brief.

interface Props {
  title: string;
  publishedAt: string; // YYYY-MM-DD from frontmatter
  readingTime: number; // minutes
  tags: string[];
  coverArt?: { preset: string; params: string } | null;
}

// Format date from ISO string (YYYY-MM-DDT...) to YYYY.MM.DD
function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.');
}

// Build the meta line segments
function buildMetaLine(publishedAt: string, readingTime: number, tags: string[]): {
  date: string;
  time: string;
  tagStr: string;
} {
  return {
    date: formatDate(publishedAt),
    time: `${readingTime} min`,
    tagStr: tags.join(' · '),
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

// Dot-grid motif rendered as a 15×10 grid of dots.
// Deterministic — same inputs always produce the same output.
// Rows/cols chosen to fill 300×200 at 20px grid spacing with 3px dots.
//
// v1 NOTE: The dot pattern is identical regardless of coverArt.params.
// Two articles with different stipple configs (flow vs donut) currently
// produce visually identical motif slots in the OG card. This is deliberate
// for v1. A follow-up could hash the slug to vary density/arrangement.
function StippleMotif() {
  const dots: { cx: number; cy: number; opacity: number }[] = [];
  const cols = 15;
  const rows = 10;
  const colStep = 300 / cols; // 20px
  const rowStep = 200 / rows; // 20px

  // Build a deterministic "density" pattern using a simple formula that
  // creates a sparse field in the top-left and denser fill toward
  // bottom-right — mimicking a flow stipple motif.
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const norm = (r / (rows - 1) + c / (cols - 1)) / 2; // 0..1 diagonal
      // Threshold: show dot when norm > 0.15 (prune sparse corner)
      if (norm > 0.15) {
        // Opacity ramp: 0.18 → 0.55 across the diagonal
        const opacity = 0.18 + norm * 0.37;
        dots.push({
          cx: colStep * c + colStep / 2,
          cy: rowStep * r + rowStep / 2,
          opacity: Math.round(opacity * 100) / 100,
        });
      }
    }
  }

  return (
    <svg
      width="300"
      height="200"
      viewBox="0 0 300 200"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {dots.map(({ cx, cy, opacity }) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.5"
          fill="#D7E5D0"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

export default function OgArticle({
  title,
  publishedAt,
  readingTime,
  tags,
  coverArt,
}: Props) {
  const hasCoverArt = coverArt != null;
  // Title width: constrained when cover art present (room for motif),
  // relaxed without. Derivation:
  //   720  = canvas (1200) − left margin (64) − right margin (64) − motif slot (300) − gap (52)
  //   1072 = canvas (1200) − left margin (64) − right margin (64)
  const titleWidth = hasCoverArt ? '720px' : '1072px';
  // Dynamic font-size based on character count (spec §11.6 thresholds):
  //   ≤40 chars → 96px (design spec value — the common case)
  //   41-65 chars → 80px (intermediate — keeps two lines comfortable)
  //   >65 chars → 68px (compact — rare long titles)
  const titleFontSize = title.length <= 40 ? '96px' : title.length <= 65 ? '80px' : '68px';
  const { date, time, tagStr } = buildMetaLine(publishedAt, readingTime, tags);
  // Stored in a variable to prevent JSX from treating // as a comment node
  const eyebrowText = '// ARTICLE';

  // Separator · between meta segments (only add if there's a next segment)
  const metaParts: { text: string; isDate?: boolean; isSep?: boolean }[] = [
    { text: date, isDate: true },
    { text: '·', isSep: true },
    { text: time },
    ...(tagStr ? [{ text: '·', isSep: true }, { text: tagStr }] : []),
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
            fontSize: '24px',
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

      {/* 3. Eyebrow comment-tag "// ARTICLE" — accent moment #1 (eyebrow) */}
      <span
        style={{
          position: 'absolute',
          left: '64px',
          top: '200px',
          fontFamily: '\'JetBrains Mono\', monospace',
          fontSize: '18px',
          fontWeight: 600,
          color: '#C8FF3D',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          lineHeight: 1.5,
        }}
      >
        {eyebrowText}
      </span>

      {/* 4. Title — VT323, dynamic size — accent moment #2 (title) */}
      <div
        style={{
          position: 'absolute',
          left: '64px',
          top: '260px',
          width: titleWidth,
          fontFamily: '\'VT323\', monospace',
          fontSize: titleFontSize,
          fontWeight: 400,
          lineHeight: 1.10,
          color: '#C8FF3D',
          letterSpacing: '-0.01em',
          WebkitFontSmoothing: 'none',
          // Overflow safety net: clamp to ~2 lines at 96px so the meta line
          // at top:480px stays visible even for pathologically long titles.
          maxHeight: '210px',
          overflow: 'hidden',
        }}
      >
        {title}
      </div>

      {/* 5. Meta line — date · reading time · tags — accent moment #3: date elevated */}
      <div
        style={{
          position: 'absolute',
          left: '64px',
          top: '480px',
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
        {metaParts.map(({ text, isDate, isSep }, i) => (
          <span
            key={i}
            style={{
              // date is elevated to fg (#D7E5D0); separators use fg-subtle (#7E8E76);
              // rest use fg-muted (#9DAA95)
              color: isDate ? '#D7E5D0' : isSep ? '#7E8E76' : '#9DAA95',
            }}
          >
            {text}
          </span>
        ))}
      </div>

      {/* 6. Cover-art motif slot — right-anchored, only when coverArt present */}
      {hasCoverArt && (
        <div
          style={{
            position: 'absolute',
            right: '64px',
            bottom: '50px',
            width: '300px',
            height: '200px',
            border: '1px solid #1F2A1F',
            background: '#0B0F0A',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StippleMotif />
        </div>
      )}
    </div>
  );
}
