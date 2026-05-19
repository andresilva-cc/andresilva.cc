# Project Status

## Current State

André's personal website, live at https://andresilva.cc. A full **brutalist-mono redesign** is complete and open as PR #5 (`impl` → `main`), pending merge — once merged it auto-deploys and becomes the live site. The project is otherwise **mature**: new work is one-off tasks (small features, tweaks, refactors), tracked as standalone GitHub Issues. No phases, no milestones, no multi-task implementation plans.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4
- **Package manager**: pnpm
- **Deployment**: Vercel (auto-deploy from `main`)

## Documents

| Document      | Path                    | Status                                  |
| ------------- | ----------------------- | --------------------------------------- |
| Workflow      | `docs/workflow.md`      | Current                                 |
| Architecture  | `docs/architecture.md`  | Current                                 |
| Design system | `docs/design-system.md` | Current                                 |
| UI spec       | `docs/ui-spec.md`       | Current                                 |
| Copy guide    | `docs/copy-guide.md`    | Current                                 |
| Redesign log  | `docs/redesign-log.md`  | Current — redesign decision log/history |

Specialty docs are created **only when a task warrants them** — e.g., a redesign triggers a design system refresh; a new section triggers a UI spec update. Otherwise, the code is the source of truth. The redesign produced the full set above.

## Conventions

- **Git Strategy**: Feature branch per task → PR → merge to `main`
- **Commit Messages**: Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`)
- **Code Quality**: ESLint (airbnb + @stylistic) + TypeScript strict
- **Install**: `pnpm install`
- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
