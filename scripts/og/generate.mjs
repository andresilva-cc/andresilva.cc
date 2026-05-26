/**
 * OG image generator — runs as a prebuild step via `prebuild` in package.json.
 *
 * Primary path: iterates articles from Velite output, generates one PNG per
 * article into public/og/articles/<slug>.png using the grafex composition at
 * tools/og-article.tsx. Then iterates notes, generating one PNG per note into
 * public/og/notes/<slug>.png using tools/og-note.tsx.
 *
 * Escape hatch (§6.1.2): set SKIP_OG_BUILD=1 to skip generation entirely.
 * Use this when grafex/WebKit fails in the Vercel build container — commit the
 * PNGs to the repo and flip the env var in Vercel project settings.
 *
 * The script is idempotent: it skips any PNG that already exists and is newer
 * than the source MDX, the OG template, and this generator script itself.
 * Changing the template or generator invalidates all PNGs on the next build.
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

// Run Velite build so that .velite/article.json and .velite/note.json are
// available even when this script runs standalone (e.g. as a prebuild step
// before next.config.mjs loads). Velite build is idempotent and fast (~200ms).
// NOTE: Velite runs a second time when next.config.mjs loads at the start of
// `next build`. The double-run is acknowledged: prebuild needs .velite/*.json
// to exist before the generator runs, and next build needs Velite emitted again.
// Build-time cost is ~200ms per run — not worth optimizing away.
const { build } = await import('velite');
await build({ silent: true });

const articleVeliteOutput = join(ROOT, '.velite', 'article.json');
const noteVeliteOutput = join(ROOT, '.velite', 'note.json');

if (!existsSync(articleVeliteOutput)) {
  console.error('[og:generate] .velite/article.json not found after Velite build — check velite.config.ts.');
  process.exit(1);
}

if (!existsSync(noteVeliteOutput)) {
  console.error('[og:generate] .velite/note.json not found after Velite build — check velite.config.ts.');
  process.exit(1);
}

const articles = JSON.parse(readFileSync(articleVeliteOutput, 'utf8'));
const notes = JSON.parse(readFileSync(noteVeliteOutput, 'utf8'));

// Import grafex programmatic API.
const { render, close } = await import('grafex');

let generated = 0;
let skipped = 0;
let errors = 0;

const thisScriptPath = fileURLToPath(import.meta.url);

// --- Articles ---

if (articles.length === 0) {
  console.log('[og:generate] No articles found — skipping article OG generation.');
}
else {
  const articleOutDir = join(ROOT, 'public', 'og', 'articles');
  mkdirSync(articleOutDir, { recursive: true });

  const articleCompositionPath = join(ROOT, 'tools', 'og-article.tsx');

  // Compute once outside the loop: max mtime of the template and this script.
  const articleTemplateMtime = Math.max(
    statSync(articleCompositionPath).mtimeMs,
    statSync(thisScriptPath).mtimeMs,
  );

  for (const article of articles) {
    const { slug, title, publishedAt, readingTime, coverArt } = article;
    const outPath = join(articleOutDir, `${slug}.png`);

    // Idempotency check: skip if PNG exists and is newer than the source MDX,
    // the OG template, and this generator script.
    const sourcePath = join(ROOT, 'src', 'content', 'articles', slug, 'index.mdx');
    if (existsSync(outPath) && existsSync(sourcePath)) {
      const pngMtime = statSync(outPath).mtimeMs;
      const mdxMtime = statSync(sourcePath).mtimeMs;
      const sourceMtime = Math.max(mdxMtime, articleTemplateMtime);
      if (pngMtime > sourceMtime) {
        console.log(`[og:generate] skip  ${slug}.png (up to date)`);
        skipped += 1;
        continue;
      }
    }

    try {
      const result = await render(articleCompositionPath, {
        props: {
          title,
          publishedAt,
          readingTime,
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
}

// --- Notes ---

if (notes.length === 0) {
  console.log('[og:generate] No notes found — skipping note OG generation.');
}
else {
  const noteOutDir = join(ROOT, 'public', 'og', 'notes');
  mkdirSync(noteOutDir, { recursive: true });

  const noteCompositionPath = join(ROOT, 'tools', 'og-note.tsx');

  // Compute once outside the loop: max mtime of the note template and this script.
  const noteTemplateMtime = Math.max(
    statSync(noteCompositionPath).mtimeMs,
    statSync(thisScriptPath).mtimeMs,
  );

  for (const note of notes) {
    const { slug, title, publishedAt } = note;
    const outPath = join(noteOutDir, `${slug}.png`);

    // Idempotency check: skip if PNG exists and is newer than the source MDX,
    // the OG template, and this generator script.
    const sourcePath = join(ROOT, 'src', 'content', 'notes', `${slug}.mdx`);
    if (existsSync(outPath) && existsSync(sourcePath)) {
      const pngMtime = statSync(outPath).mtimeMs;
      const mdxMtime = statSync(sourcePath).mtimeMs;
      const sourceMtime = Math.max(mdxMtime, noteTemplateMtime);
      if (pngMtime > sourceMtime) {
        console.log(`[og:generate] skip  ${slug}.png (up to date)`);
        skipped += 1;
        continue;
      }
    }

    try {
      // Props shape is defined by the Props interface in tools/og-note.tsx —
      // update both files in lockstep if the shape changes.
      const result = await render(noteCompositionPath, {
        props: {
          title,
          publishedAt,
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
}

await close();

console.log(`[og:generate] done — ${generated} generated, ${skipped} skipped, ${errors} errors.`);

if (errors > 0) {
  process.exit(1);
}
