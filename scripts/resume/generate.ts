/**
 * Resume PDF export — manual script, run by hand via `pnpm resume:pdf`.
 *
 * Builds the site, boots a production `next start` server on a local
 * port, navigates Playwright Chromium to /resume, and writes
 * public/resume.pdf via page.pdf() (print CSS, real embedded/subsetted
 * fonts, no rasterization).
 *
 * NOT wired into `prebuild` — Chromium isn't installed on Vercel's
 * build container (only WebKit is, for grafex's OG generation; see
 * package.json postinstall). This script is local-only; commit the
 * regenerated PDF after running it. Editing
 * src/repositories/implementations/static-resume-repository.ts does
 * NOT regenerate the PDF by itself — re-run this script and commit the
 * result, or the committed PDF silently drifts from the data.
 *
 * Written in TypeScript, unlike scripts/og/generate.mjs — that script
 * runs as a `prebuild` step on every Vercel build, so it stays plain
 * .mjs rather than depend on Node's native TS type-stripping being
 * available in the build container. This script never runs there (see
 * above); it's manual-only, so the same trade favors real type safety
 * on its more involved async orchestration instead.
 */

import {
  spawn, spawnSync, execFileSync, type ChildProcess,
} from 'node:child_process';
import {
  statSync, renameSync, rmSync, existsSync,
} from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const NEXT_BIN = join(ROOT, 'node_modules', '.bin', 'next');
const OUT_PATH = join(ROOT, 'public', 'resume.pdf');
// Same directory as OUT_PATH so the final move is an atomic same-filesystem
// rename, not a cross-filesystem copy that could half-fail.
const TMP_OUT_PATH = `${OUT_PATH}.tmp`;
const HOST = '127.0.0.1';
const PORT = process.env.RESUME_PDF_PORT ?? '4756';
const URL = `http://${HOST}:${PORT}/resume`;
const CAREER_URL = `http://${HOST}:${PORT}/career`;
const READY_TIMEOUT_MS = 30_000;
const FETCH_TIMEOUT_MS = 5_000;
const FAIL_FAST_THRESHOLD = 3;

// Pins current reality (docs/resume-print-theme.md §3: this content, at
// the spec's type scale, does not fit one A4 page — accepted, not a bug).
// Bump this deliberately after a real content/layout change, never to
// silence a regression.
const EXPECTED_PAGE_COUNT = 2;

// Independent, hardcoded expectations — deliberately NOT read from
// static-resume-repository.ts. Deriving them from the same data this
// check validates would let a corrupted data file pass its own check.
//
// Selection criterion: durable identifiers (name, contact info, employer
// names, job titles, institution names) that an ordinary copy edit —
// tightening a bullet, adjusting the summary — would never touch. A
// content-loss regression confined to the Experience or Education body
// (the most likely real-world failure, e.g. a bad merge dropping a
// section) still needs to fail this check, so at least one field from
// each body section is included, not just the header. Do NOT add bullet
// text here — bullets are exactly what does change on ordinary edits.
const REQUIRED_TEXT = [
  'André Luiz da Silva',
  '+55 47 99900-1415',
  'andresilva.cc',
  'github.com/andresilva-cc',
  'Atlas Technologies', // Experience: employer, recurs across 3 roles
  'Senior Front-end Engineer', // Experience: job title
  'Full Cycle', // Education: institution
  'apr 2025 — present', // Experience: open-role date label — already drifted to title-case "Present" once
  'Grupo Gmaes', // Experience: employer — already drifted to "Gmaes Telecom" once
];

// Same rationale as REQUIRED_TEXT above (independent, hardcoded, durable
// identifiers only — no bullet text), scoped to /career: the shared
// EMPLOYMENT_HISTORY dataset gives /career a blast radius from any
// /resume-focused edit, with no content guard beyond manual screenshots.
const CAREER_REQUIRED_TEXT = [
  'MPA',
  'Atlas Technologies',
  'Nuxstep',
  'Grupo Gmaes',
  'Senior Front-end Engineer',
  'apr 2025 — now', // /career keeps "now", not /resume's "present" — see format-date.ts
  // The one bullet fragment asserted anywhere. This is not copy coverage —
  // it is the `short`/`text` split itself. /career must render `text`, so
  // the full form's tail has to be present here and absent from the PDF
  // (see FORBIDDEN_TEXT). Every identifier-only assertion passes straight
  // through a short↔text swap, which is the exact regression
  // employment-history.ts exists to prevent.
  'previews without deployment',
];

// Strings that must NOT appear in the resume PDF. Currently one: the tail
// of the MPA bullet's full `text` form. /resume renders `short ?? text`,
// so seeing it means the print compression silently stopped applying.
const FORBIDDEN_TEXT = [
  'previews without deployment',
];

function log(message: string): void {
  console.log(`[resume:pdf] ${message}`);
}

// Node's fetch() wraps every network failure in a generic `TypeError:
// fetch failed` — the actual reason lives on `.cause`. Treating any
// TypeError as "server not ready yet" would also swallow an unrelated bug
// that happens to throw a TypeError elsewhere in this same catch block, so
// this only matches the specific cause connection-refused actually sets.
function isConnectionError(err: unknown): boolean {
  if (!(err instanceof TypeError)) return false;
  const cause = (err as { cause?: { code?: string } }).cause;
  return cause?.code === 'ECONNREFUSED';
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  }
  finally {
    clearTimeout(timer);
  }
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastBadStatus: number | null = null;
  let sameStatusStreak = 0;

  for (;;) {
    let res: Response | null;
    try {
      res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
    }
    catch (err) {
      // AbortError (our own per-request timeout) or connection-refused
      // (server not listening yet) both mean "not ready yet" — keep
      // polling. Anything else is a real failure.
      const name = (err as { name?: string } | undefined)?.name;
      if (name !== 'AbortError' && !isConnectionError(err)) throw err;
      res = null;
    }

    if (res) {
      if (res.ok) return;

      // The server answered but /resume itself is erroring — that's not
      // "still booting." Fail fast on a persistent, identical failure
      // instead of retrying silently until the full timeout.
      sameStatusStreak = res.status === lastBadStatus ? sameStatusStreak + 1 : 1;
      lastBadStatus = res.status;
      if (sameStatusStreak >= FAIL_FAST_THRESHOLD) {
        throw new Error(`${url} returned HTTP ${res.status} on ${FAIL_FAST_THRESHOLD} consecutive attempts — the server is up but /resume is broken, not still booting.`);
      }
    }

    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for ${url} to respond after ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
}

// spawn() only emits 'error' when the process fails to launch at all (e.g.
// the `next` binary is missing); a bad port or an early crash instead just
// exits normally. Without racing against both, waitForServer would poll
// silently for the full READY_TIMEOUT_MS before reporting a generic
// timeout, hiding the real cause. Rejects; never resolves.
function waitForExit(child: ChildProcess): Promise<never> {
  return new Promise((_resolve, reject) => {
    child.on('error', (err) => {
      reject(new Error(`next start failed to spawn: ${err.message}`));
    });
    child.on('exit', (code, signal) => {
      reject(new Error(`next start exited before the server became ready (code=${code}, signal=${signal}) — port ${PORT} may already be in use.`));
    });
  });
}

function runPopplerTool(cmd: string, args: Array<string>): string {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8' });
  }
  catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`\`${cmd}\` not found — install poppler (e.g. \`brew install poppler\`) to validate the generated PDF.`);
    }
    throw err;
  }
}

// Guards the exact defect this route exists to fix: a blank/broken render,
// a Type 3 font, or scrambled text would previously still exit 0 because
// the script only checked that *a* file got written. Fail loudly instead.
function validatePdf(pdfPath: string): void {
  log('validating PDF...');

  const info = runPopplerTool('pdfinfo', [pdfPath]);
  const pagesMatch = info.match(/^Pages:\s+(\d+)/m);
  const pageCount = pagesMatch ? Number(pagesMatch[1]) : null;
  if (pageCount !== EXPECTED_PAGE_COUNT) {
    throw new Error(`pdfinfo reports ${pageCount} page(s), expected ${EXPECTED_PAGE_COUNT}. If this is a deliberate content/layout change, update EXPECTED_PAGE_COUNT in this script.`);
  }

  const fonts = runPopplerTool('pdffonts', [pdfPath]);
  if (/\bType 3\b/.test(fonts)) {
    throw new Error(`pdffonts reports a Type 3 font — the exact defect this route replaces:\n${fonts}`);
  }

  const text = runPopplerTool('pdftotext', [pdfPath, '-']);
  const missing = REQUIRED_TEXT.filter((s) => !text.includes(s));
  if (missing.length > 0) {
    throw new Error(`pdftotext output is missing expected text: ${missing.join(', ')}`);
  }

  // Collapse all whitespace before testing. pdftotext breaks lines wherever
  // the PDF's layout does, so a phrase that wraps would slip a raw
  // `includes()` — and this check fails OPEN: a missed match reads as "no
  // leak". Normalising makes it independent of where the line happens to
  // break. REQUIRED_TEXT above is deliberately not normalised: those are
  // short, verified-unwrapped identifiers, and a false negative there fails
  // CLOSED (a missing string throws), which is the safe direction.
  const flatText = text.replace(/\s+/g, ' ');
  const leaked = FORBIDDEN_TEXT.filter((s) => flatText.includes(s.replace(/\s+/g, ' ')));
  if (leaked.length > 0) {
    throw new Error(
      `pdftotext output contains /career-only text: ${leaked.join(', ')} — `
      + '/resume should render bullet.short, not bullet.text.',
    );
  }

  log(`validated — ${pageCount} page(s), no Type 3 fonts, known fields present.`);
}

// /career renders the same EMPLOYMENT_HISTORY dataset as /resume (see
// employment-history.ts) but has no PDF/pdftotext pipeline of its own to
// validate through — the unification gives it a shared-data blast radius
// with no content guard beyond manual screenshots. The production server
// is already up for the /resume export, so a plain fetch + substring check
// here is cheap insurance against the same class of drift.
async function validateCareerPage(url: string): Promise<void> {
  log('checking /career...');
  const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
  if (!res.ok) {
    throw new Error(`${url} returned HTTP ${res.status} — /career must render 200 for this check to mean anything.`);
  }
  const html = await res.text();
  const missing = CAREER_REQUIRED_TEXT.filter((s) => !html.includes(s));
  if (missing.length > 0) {
    throw new Error(`/career is missing expected text: ${missing.join(', ')}`);
  }
  log('/career OK — known fields present.');
}

async function main(): Promise<void> {
  log('building production bundle (next build)...');
  const build = spawnSync(NEXT_BIN, ['build'], { cwd: ROOT, stdio: 'inherit' });
  if (build.status !== 0) {
    throw new Error(`next build failed with exit code ${build.status}`);
  }

  log(`starting production server on ${HOST}:${PORT}...`);
  const server = spawn(NEXT_BIN, ['start', '-p', PORT, '-H', HOST], { cwd: ROOT, stdio: 'inherit' });
  const serverExited = waitForExit(server);

  let browser: Browser | undefined;
  try {
    await Promise.race([waitForServer(URL, READY_TIMEOUT_MS), serverExited]);
    log('server ready — checking /career...');
    await validateCareerPage(CAREER_URL);
    log('launching Chromium (page.pdf() is Chromium-only)...');

    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // Write to a temp path first. Validating a file already at OUT_PATH
    // would clobber a known-good, previously-committed PDF with a broken
    // one the moment page.pdf() writes — only move it into public/ once
    // validation actually passes.
    log(`writing ${TMP_OUT_PATH}...`);
    await page.pdf({
      path: TMP_OUT_PATH,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    });

    validatePdf(TMP_OUT_PATH);

    renameSync(TMP_OUT_PATH, OUT_PATH);

    const { size } = statSync(OUT_PATH);
    log(`done — ${(size / 1024).toFixed(1)} KB`);
  }
  finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
    // Only reached on failure — the happy path already renamed the temp
    // file away, so this is a no-op unless validation (or the render
    // itself) threw.
    if (existsSync(TMP_OUT_PATH)) {
      rmSync(TMP_OUT_PATH);
    }
  }
}

main().catch((err: unknown) => {
  console.error('[resume:pdf] ERROR:', err);
  process.exit(1);
});
