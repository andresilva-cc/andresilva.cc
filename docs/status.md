# Project Status

## Current State

André's personal website, already live at https://andresilva.cc. The project is **mature**: new work is one-off tasks (small features, tweaks, refactors), tracked as standalone GitHub Issues. No phases, no milestones, no multi-task implementation plans.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4
- **Package manager**: pnpm
- **Deployment**: Vercel (auto-deploy from `main`)

## Documents

| Document      | Path                   | Status              |
| ------------- | ---------------------- | ------------------- |
| Workflow      | `docs/workflow.md`     | Current             |
| Architecture  | `docs/architecture.md` | *Create on demand*  |
| Design system | `docs/design-system.md`| *Create on demand*  |
| UI spec       | `docs/ui-spec.md`      | *Create on demand*  |
| Copy guide    | `docs/copy-guide.md`   | *Create on demand*  |

Specialty docs are created **only when a task warrants them** — e.g., a redesign triggers a design system refresh; a new section triggers a UI spec update. Otherwise, the code is the source of truth.

## Conventions

- **Git Strategy**: Feature branch per task → PR → merge to `main`
- **Commit Messages**: Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`)
- **Code Quality**: ESLint (airbnb + @stylistic) + TypeScript strict
- **Install**: `pnpm install`
- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
