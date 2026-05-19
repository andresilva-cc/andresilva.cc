# andresilva.cc

![Deploy](https://img.shields.io/github/deployments/andresilva-cc/andresilva.cc/production?style=flat&label=deploy)

My personal site — a brutalist-mono portfolio. Live at **[andresilva.cc](https://andresilva.cc/)**.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript. Server
Components by default; content comes from static repositories plus the
dev.to (Forem) API. Deployed on Vercel.

## Development

Requires Node and [pnpm](https://pnpm.io/).

```bash
pnpm install      # install dependencies
pnpm dev          # dev server — http://localhost:3000
pnpm build        # production build
pnpm lint         # eslint
```

## Documentation

The repo carries its own docs in [`docs/`](docs/):

| Doc | Covers |
| --- | --- |
| [`architecture.md`](docs/architecture.md)   | How the site is built — structure, data flow, conventions |
| [`design-system.md`](docs/design-system.md) | Tokens, components, the standing rules |
| [`ui-spec.md`](docs/ui-spec.md)             | Page-level structure and content sources |
| [`copy-guide.md`](docs/copy-guide.md)       | Voice and microcopy |
| [`redesign-log.md`](docs/redesign-log.md)   | Decision history of the redesign |

The `/design-system` route renders the design system live from production components.
