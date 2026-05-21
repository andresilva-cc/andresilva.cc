---
name: velite-pipeline
description: Velite 0.3.x integration notes — export naming, s.mdx() output type, path alias, ESLint config
metadata:
  type: project
---

## Velite export naming

Velite exports the collection with a **singular camelCase name** derived from the collection's `name:` field.

- Collection `name: 'Article'` → export `article` (not `articles`)
- The type `Article` is also exported from `@/.velite`
- `index.d.ts` says: `export type Article = ...` and `export declare const article: Article[]`

Always import as `{ article }` not `{ articles }`.

## s.mdx() output

`s.mdx()` returns a **compiled function-body string** (MDX outputFormat: 'function-body'), NOT a React component.

- The article page (T4) needs to use `run()` from `@mdx-js/mdx` to turn it into a component before rendering as `<Content />`.
- The decision log's `<article.body />` shorthand refers to this pattern — the page must `run()` first.

## s.path() for folder-based collections

`s.path()` with `removeIndex: true` (default) returns the path relative to the Velite `root`, e.g.:
- File: `src/content/articles/74-percent-performance-increase/index.mdx`
- Root: `src/content`
- `s.path()` returns: `articles/74-percent-performance-increase`

To get just the slug (leaf folder name), use `.split('/').pop()` in the transform.

## Path alias for .velite/

`tsconfig.json` needs a separate alias for the Velite output dir (not covered by `@/*`):

```json
"@/.velite": ["./.velite"]
```

The `@/*` alias maps to `./src/*`, which doesn't cover `.velite/` at the project root.

## ESLint must ignore .velite/

Velite's generated `index.js` and `index.d.ts` don't conform to the stylistic rules. Add to `eslint.config.mjs`:

```js
globalIgnores(['.velite/**'])
```

Without this, lint fails with `@stylistic/semi` and `@stylistic/eol-last` errors on generated files.

## Top-level await in next.config.mjs

Velite is wired via top-level await in `next.config.mjs` (ESM .mjs supports this):

```js
import { build } from 'velite';
await build({ silent: true });
```

This runs Velite before Next's compilation — Turbopack-compatible (no webpack plugin needed).

## Reading time with s.raw()

Use `s.raw()` to get the raw MDX source text for word counting. Strip it in the transform and compute `readingTime` there. Don't expose `raw` in the final Article type.
