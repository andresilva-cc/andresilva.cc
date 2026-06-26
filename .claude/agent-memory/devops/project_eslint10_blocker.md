---
name: project-eslint10-blocker
description: ESLint 10 upgrade — real blockers (eslint-plugin-react + next babel parser), the working in-repo workaround, and the clean upstream path
metadata:
  type: project
---

Upgrading to ESLint 10 (from ^9.39.4) on `next@16.2.9` / `eslint-config-next@16.2.9` hits TWO distinct crashes, not one:

1. **All `.ts`/`.tsx` files (the whole app):** `TypeError: ... 'react/display-name': contextOrFilename.getFilename is not a function`. Source is **`eslint-plugin-react@7.37.5`** version-detection (`lib/util/version.js` → `resolveBasedir`), which calls the `context.getFilename()` API ESLint 10 removed. This is the dominant blocker — it dies at rule-load before a parser is involved.
2. **Only `.js`/`.mjs`/`.cjs` config files:** `TypeError: scopeManager.addGlobals is not a function`. Source is next's bundled `next/dist/compiled/babel/eslint-parser` (set as default parser for non-TS files), whose old scope manager lacks ESLint 10's required `addGlobals`.

Earlier analysis that pinned this solely on next's babel parser / claimed it crashes "every file via addGlobals" was WRONG — verified by bisecting per file type and by `eslint --print-config` (`.tsx` resolves to `typescript-eslint/parser`, which is fine; `.mjs` resolves to `eslint-config-next/parser`).

**Why (it's not a hard blocker):** A working in-repo workaround exists and makes `eslint .` exit 0 today:
- Pin `settings: { react: { version: '19.2' } }` (last in the flat-config array, so it overrides next's `version: 'detect'`) → skips the version detection that calls `getFilename`.
- Add `{ files: ['**/*.{js,mjs,cjs}'], languageOptions: { parser: tseslint.parser } }` → replaces next's babel parser for config files.
BUT this runs `eslint-plugin-react@7.37.5` (peer caps at `^9.7`) against ESLint 10. It works only because next's `core-web-vitals` rule set happens to avoid the plugin's other unguarded removed-API calls (e.g. `forward-ref-uses-ref.js` calls raw `context.getSourceCode()`). It is avoidance, not support — brittle.

**How to apply:** Do NOT ship the workaround. Wait for the upstream fix, then it's a clean bump:
- `eslint-config-next` ESLint-10 PR: vercel/next.js **#91710** (open as of Jun 2026) — swaps `eslint-plugin-import` → `eslint-plugin-import-x`, bumps react-hooks. Tracking issue #91702.
- `eslint-plugin-react` ESLint-10 PR: jsx-eslint/eslint-plugin-react **#3979** (open; issue #3977). Maintainer comment 2026-06-25: "coming to an end soon."
- ESLint v9 EOL: **2026-08-06** — so this needs doing, but the clean path is weeks away.
- Already v10-ready in-repo: `eslint-plugin-react-hooks@^7.1.1`, `@typescript-eslint@8.62.0`, `@stylistic/eslint-plugin@5.10.0`, `@eslint/js@10`.

`typescript@6` + `@types/node@26` are independent of all this and shipped separately (only needed `tsconfig.json` `target: es5 → es2015`).
