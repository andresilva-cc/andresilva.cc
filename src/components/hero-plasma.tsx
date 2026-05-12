'use client';

import { useEffect, useRef } from 'react';

const PL_COLS = 64;
const PL_ROWS = 26;
const PL_RAMP_HI = '@#8G';
const PL_RAMP_MID = 'LCft1i;:,.';

function renderPlasmaFrame(tf: number): string {
  const lines: Array<string> = [];
  for (let row = 0; row < PL_ROWS; row += 1) {
    let rowHtml = '';
    const y = ((row + 0.5) / PL_ROWS - 0.5) * 3.0;
    for (let col = 0; col < PL_COLS; col += 1) {
      const x = ((col + 0.5) / PL_COLS - 0.5) * 6.0;
      const f = Math.sin(x * 2 + tf)
        + Math.sin(y * 2 + tf * 0.9)
        + Math.sin((x + y) * 1.5 + tf * 1.1)
        + Math.sin(Math.sqrt(x * x + y * y) * 2.5 + tf * 0.8);
      let n = (f + 4) / 8;
      n = Math.min(1, Math.max(0, n));
      let ch: string;
      let isAccent = false;
      if (n > 0.72) {
        const idx = Math.min(PL_RAMP_HI.length - 1, Math.floor((n - 0.72) / 0.28 * PL_RAMP_HI.length));
        ch = PL_RAMP_HI[idx];
        isAccent = true;
      }
      else if (n > 0.28) {
        const idx2 = Math.min(PL_RAMP_MID.length - 1, Math.floor((n - 0.28) / 0.44 * PL_RAMP_MID.length));
        ch = PL_RAMP_MID[idx2];
      }
      else {
        ch = n > 0.10 ? '.' : ' ';
      }
      rowHtml += isAccent
        ? `<span class="text-accent">${ch}</span>`
        : ch;
    }
    lines.push(rowHtml);
  }
  return lines.join('\n');
}

export interface HeroPlasmaProps {
  className?: string;
}

/*
 * HeroPlasma — Home-only ASCII plasma field rendered into a <pre>.
 *
 * 64×26 character grid sampled from a 4-sine plasma function. High-
 * intensity cells get --color-accent; mid intensity stays --color-fg-muted;
 * low intensity uses dots and spaces. Animated at ~20fps via rAF.
 *
 * Reduced-motion users get one static frame, no loop. Client component
 * because the rAF loop is the whole point.
 */
export function HeroPlasma({ className }: HeroPlasmaProps) {
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      pre.innerHTML = renderPlasmaFrame(0);
      return undefined;
    }

    let t = 0;
    let lastFrameTime = 0;
    let rafId: number | null = null;

    const loop = (ts: number) => {
      rafId = requestAnimationFrame(loop);
      if (ts - lastFrameTime < 50) return;
      lastFrameTime = ts;
      t += 0.075;
      pre.innerHTML = renderPlasmaFrame(t);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <aside aria-hidden="true" className={className ?? ''}>
      {/*
        Inline font-size + line-height because the plasma is a one-off
        rendering surface — these values exist nowhere else in the system
        and don't belong as design tokens. Tailwind's escape hatch.
      */}
      <pre
        ref={preRef}
        role="presentation"
        style={{ fontSize: '8px', lineHeight: 1.15 }}
        className="font-mono text-fg-muted m-0 p-0 select-none whitespace-pre tracking-normal"
      />
    </aside>
  );
}
