import localFont from 'next/font/local';

/*
 * Static (non-variable) JetBrains Mono instances, /resume only.
 *
 * The site's --font-mono (src/app/fonts.ts) loads JetBrains Mono via
 * next/font/google, which only has a variable-font master available
 * from Google Fonts. On screen that's invisible. In Chromium's PDF
 * export, a variable-font instance (pinned via font-variation-settings)
 * gets embedded as a Type 3 bitmap font, not proper TrueType/CID —
 * exactly the "4 Type 3 fonts" defect issue #18 replaces. So /resume
 * needs genuinely static per-weight files instead.
 *
 * These four .woff2 files are copied from @fontsource/jetbrains-mono
 * 5.3.0's files/ directory — verified with fontTools that none of them
 * carry an `fvar` table (i.e. they're real static instances, not a
 * variable font pinned to one axis position).
 */
export const resumeMono = localFont({
  src: [
    { path: './_fonts/jetbrains-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './_fonts/jetbrains-mono-500.woff2', weight: '500', style: 'normal' },
    { path: './_fonts/jetbrains-mono-600.woff2', weight: '600', style: 'normal' },
    { path: './_fonts/jetbrains-mono-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-resume-mono',
  display: 'swap',
});
