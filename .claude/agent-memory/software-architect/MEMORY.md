# Memory Index

- [Architecture doc conventions](project_architecture_doc_conventions.md) — docs/architecture.md is a descriptive snapshot; incremental edits only + per-route update checklist
- [Vercel browser constraint](project_vercel_browser_constraint.md) — no Playwright browser runs on Vercel's build container; browser rendering must be a local script + committed artifact
- [Styling convention](feedback_styling_convention.md) — Tailwind utilities in JSX; raw CSS only where a utility genuinely can't reach (plus the `/resume` pt-units exception)
