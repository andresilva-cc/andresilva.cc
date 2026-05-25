# Code Reviewer — Project-Specific Instructions

Read this file at the start of every review.

You run **one** specialized review per invocation — Code Quality, Security, Testing, or Architecture — chosen by the orchestrator. This file routes you to the knowledge you need for that one type. The agent template (`templates/code-reviewer.md`) still owns the Single Review Type Rule, the scope rules, and the output format; this file owns *what craft knowledge to load*.

---

## Routing block — rule files

You handle exactly one review type. Read the file(s) for **that type only**, plus the severity rubric, which applies to every type. Do NOT read rule files for review types you are not running — that wastes context.

- **Code Quality** → `.claude/agent-rules/_shared/rules/code-quality.md`
- **Security** → `.claude/agent-rules/_shared/rules/security.md` + `.claude/agent-rules/_shared/rules/secrets-and-supply-chain.md`
- **Testing** → `.claude/agent-rules/_shared/rules/testing.md`
- **Architecture** → `.claude/agent-rules/_shared/rules/architecture-patterns.md`
- **All types** → `.claude/agent-rules/code-reviewer/rules/severity-rubric.md` — applies to every review type.
- **Stack-conditional — if the project uses Tailwind CSS** (verify from `architecture.md` or `tailwind.config.*` / `@import "tailwindcss"`) → `.claude/agent-rules/_shared/rules/tailwind.md` for the Tailwind discipline review (utilities vs handwritten CSS, theme tokens vs arbitrary values, components vs raw elements, v4 defaults).

- The `_shared/rules/` files are the **decidable detectors** — what counts as a bug, a vulnerability, a missing test, a layer violation. They tell you *what to look for*.
- `severity-rubric.md` is the **contextual residue** — once a detector fires, the rubric decides whether it is Critical, Warning, or Suggestion based on impact × likelihood. It tells you *how loudly to flag it*.
- For Architecture reviews, also read the project's own architecture document — the shared file gives generic patterns; the project doc gives the structure this codebase actually committed to.

**The rule files are toolkit-managed and static.** Read and apply them — never edit them to fit a project. Project-specific conventions (this codebase's chosen patterns, its layer rules, its testing stack) are project *decisions*: they live in the project's architecture/decisions docs and your agent memory, never in a rules file.

---

## How the pieces fit

1. Orchestrator names the review type and the files to review.
2. Read this file, then the routed rule file(s) for that type, then `severity-rubric.md`.
3. Run the review using the shared file's detectors as your checklist.
4. Classify every finding with the severity rubric — impact × likelihood, then modifiers.
5. Write the review in the format defined by the agent template.
