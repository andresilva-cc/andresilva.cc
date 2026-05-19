'use client';

import type { CSSProperties } from 'react';
import { useEffect } from 'react';

const ENGINE_SRC = 'https://art.andresilva.cc/embed/stipple.js';

/* Load the stipple engine module exactly once per page. Subsequent
   <StippleArt> instances reuse the singleton loader. If the script 404s
   (e.g. before deploy) the custom element simply never upgrades and the
   <stipple-art> tag renders as an empty box — no crash. */
function ensureEngineLoaded(): void {
  if (typeof document === 'undefined') return;
  if (customElements.get('stipple-art')) return;
  if (document.querySelector(`script[src="${ENGINE_SRC}"]`)) return;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = ENGINE_SRC;
  document.head.appendChild(script);
}

export interface StippleArtProps {
  /** A stipple permalink hash encoding the primitive + params (e.g. "p=plasma&palette=acid"). Leading "#" optional. */
  config: string;
  /** Animation behaviour: static (never), hover (while hovered), or always (whenever on-screen). */
  mode?: 'static' | 'hover' | 'always';
  /** Explicit grid column count — recommended for deterministic, layout-shift-free sizing. */
  cols?: number;
  /** Explicit grid row count — recommended for deterministic, layout-shift-free sizing. */
  rows?: number;
  /** Animation frame rate. Defaults to 30 in the engine. */
  fps?: number;
  /** How the ASCII art scales to its host box, like CSS object-fit. Defaults to 'contain' in the engine. */
  fit?: 'contain' | 'cover' | 'none';
  /**
   * The "open in stipple" affordance the embed renders for itself. `none`
   * (engine default) = no link, leave the surface free for a host link.
   * `badge` = a small hover-revealed permalink badge in the corner. `cover`
   * = a full-bleed link over the whole art.
   */
  link?: 'none' | 'badge' | 'cover';
  className?: string;
  style?: CSSProperties;
}

/*
 * StippleArt — React wrapper for the <stipple-art> Web Component.
 *
 * Ensures the engine module from art.andresilva.cc loads once per page,
 * then renders the custom element with props forwarded as string
 * attributes. The component handles IntersectionObserver and
 * prefers-reduced-motion internally; this wrapper only bridges React.
 */
export function StippleArt({
  config, mode, cols, rows, fps, fit, link, className, style,
}: StippleArtProps) {
  useEffect(() => {
    ensureEngineLoaded();
  }, []);

  return (
    <stipple-art
      config={config}
      mode={mode}
      cols={cols !== undefined ? String(cols) : undefined}
      rows={rows !== undefined ? String(rows) : undefined}
      fps={fps !== undefined ? String(fps) : undefined}
      fit={fit}
      link={link}
      className={className}
      style={style}
    />
  );
}
