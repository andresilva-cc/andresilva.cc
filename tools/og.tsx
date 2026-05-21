import type { CompositionConfig } from 'grafex';

export const config: CompositionConfig = {
  width: 1200,
  height: 630,
  fonts: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=VT323&display=swap',
  ],
};

export default function OgCard() {
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
      {/* 1. Header wordmark — top-left */}
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
        {/* Pixel-A glyph — viewBox 0 0 18 24 rendered at 36×48 (2× live) */}
        <svg
          width="36"
          height="48"
          viewBox="0 0 18 24"
          fill="none"
          aria-hidden="true"
        >
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
        {/* Wordmark text */}
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

      {/* 2. Header rule — 1px line at top=140 */}
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

      {/* 3. Content cluster — display name + bio, flex column from y=200 */}
      <div
        style={{
          position: 'absolute',
          left: '64px',
          top: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        {/* 3a. Display name */}
        <span
          style={{
            fontFamily: '\'VT323\', monospace',
            fontSize: '184px',
            fontWeight: 400,
            lineHeight: 1.1,
            color: '#C8FF3D',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'none',
          }}
        >
          André Silva
        </span>

        {/* 3b. Bio paragraph */}
        <div
          style={{
            width: '830px',
            fontFamily: '\'JetBrains Mono\', monospace',
            fontSize: '22px',
            fontWeight: 400,
            lineHeight: 1.65,
            color: '#9DAA95',
          }}
        >
          {'Software engineer with '}
          <strong
            style={{
              fontWeight: 600,
              color: '#D7E5D0',
            }}
          >
            9+ years of experience
          </strong>
          {' building web platforms, internal tools, and developer tooling.'}
        </div>
      </div>

    </div>
  );
}
