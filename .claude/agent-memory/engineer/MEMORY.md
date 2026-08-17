# Engineer Memory — andresilva.cc

## Quick reference
- Build: `pnpm build` — verify TypeScript + generates static pages
- Lint: `pnpm lint` — ESLint must stay clean
- Dev server: `http://localhost:3000` (started externally, not by engineer)

## Key patterns

- [Project structure and conventions](patterns.md) — tech stack, component conventions, design tokens
- [Velite pipeline notes](velite-pipeline.md) — export naming, s.mdx() returns string not component, path alias, ESLint ignore
- [RSS infrastructure](rss-infra.md) — shared helpers, renderer pattern, absolutize basePath signature
- [PDF generation gotchas](pdf-generation.md) — next/font/google variable fonts embed as Type 3; Chromium page.pdf() interleaves side-by-side columns in default pdftotext regardless of CSS technique (grid/flex/table/multicol/absolute/pdf-lib all fail identically)

## Lint conventions
- `@stylistic/jsx-curly-spacing`: JSX **attribute** curlies get no inner space (`href={x}`), JSX **children** curlies get a space (`{ x }`). Run `eslint <file> --fix` rather than hand-formatting.
- `@stylistic/max-statements-per-line`: arrow fns passed to `setTimeout`-style callbacks must be a single expression (`(r) => setTimeout(r, 300)`), not a block body.

## Bash tool quirk in worktrees
- The Bash tool refuses multi-command pipelines/backgrounding (`cmd &`, `>` redirects combined with `&&`) in a worktree session as "too complex to verify it stays inside the worktree" — even when clearly safe. Split into separate Bash calls, and use `run_in_background: true` instead of manual `&` backgrounding.
