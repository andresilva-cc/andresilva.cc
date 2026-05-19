/**
 * OG image generator — runs as a prebuild step via `prebuild` in package.json.
 *
 * Primary path: iterates articles from Velite output, generates one PNG per
 * article into public/og/articles/<slug>.png using the grafex composition at
 * tools/og-article.tsx.
 *
 * Escape hatch (§6.1.2): set SKIP_OG_BUILD=1 to skip generation entirely.
 * Use this when grafex/WebKit fails in the Vercel build container — commit the
 * PNGs to the repo and flip the env var in Vercel project settings.
 *
 * The script is idempotent: it skips any PNG that already exists and is newer
 * than the article's source index.mdx, so local dev and Vercel incremental
 * builds are fast.
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

// SKIP_OG_BUILD escape hatch — per §6.1.2.
if (process.env.SKIP_OG_BUILD) {
  console.log('[og:generate] SKIP_OG_BUILD is set — skipping OG image generation.');
  process.exit(0);
}

// Run Velite build so that .velite/article.json is available even when
// this script runs standalone (e.g. as a prebuild step before next.config.mjs
// loads). Velite build is idempotent and fast (~200ms).
// NOTE: Velite runs a second time when next.config.mjs loads at the start of
// `next build`. The double-run is acknowledged: prebuild needs .velite/article.json
// to exist before the generator runs, and next build needs Velite emitted again.
// Build-time cost is ~200ms per run — not worth optimizing away.
const { build } = await import('velite');
await build({ silent: true });

const veliteOutput = join(ROOT, '.velite', 'article.json');

if (!existsSync(veliteOutput)) {
  console.error('[og:generate] .velite/article.json not found after Velite build — check velite.config.ts.');
  process.exit(1);
}

const articles = JSON.parse(readFileSync(veliteOutput, 'utf8'));

if (articles.length === 0) {
  console.log('[og:generate] No articles found — nothing to generate.');
  process.exit(0);
}

const outDir = join(ROOT, 'public', 'og', 'articles');
mkdirSync(outDir, { recursive: true });

const compositionPath = join(ROOT, 'tools', 'og-article.tsx');

// Import grafex programmatic API.
const { render, close } = await import('grafex');

let generated = 0;
let skipped = 0;
let errors = 0;

for (const article of articles) {
  const { slug, title, publishedAt, readingTime, tags, coverArt } = article;
  const outPath = join(outDir, `${slug}.png`);

  // Idempotency check: skip if PNG exists and is newer than source MDX.
  const sourcePath = join(ROOT, 'src', 'content', 'articles', slug, 'index.mdx');
  if (existsSync(outPath) && existsSync(sourcePath)) {
    const pngMtime = statSync(outPath).mtimeMs;
    const mdxMtime = statSync(sourcePath).mtimeMs;
    if (pngMtime > mdxMtime) {
      console.log(`[og:generate] skip  ${slug}.png (up to date)`);
      skipped += 1;
      continue;
    }
  }
  // If sourcePath doesn't exist (non-standard article folder layout),
  // the guard falls through and the PNG regenerates every run. This is
  // a missed-skip, not a correctness issue — the rendered PNG is the
  // same either way.

  try {
    // Props shape is defined by the Props interface in tools/og-article.tsx —
    // update both files in lockstep if the shape changes.
    const result = await render(compositionPath, {
      props: {
        title,
        publishedAt,
        readingTime,
        tags: tags ?? [],
        coverArt: coverArt ?? null,
      },
    });

    writeFileSync(outPath, result.buffer);
    console.log(`[og:generate] wrote ${slug}.png`);
    generated += 1;
  }
  catch (err) {
    console.error(`[og:generate] ERROR generating ${slug}.png:`, err);
    errors += 1;
  }
}

await close();

console.log(`[og:generate] done — ${generated} generated, ${skipped} skipped, ${errors} errors.`);

if (errors > 0) {
  process.exit(1);
}
