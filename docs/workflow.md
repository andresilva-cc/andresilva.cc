# Agent Pipeline Workflow

This document describes how the AI agent pipeline operates for andresilva.cc. It is intended for the **orchestrator** (the main Claude Code session) and should **not** be read by individual agents — they receive their instructions directly from the orchestrator.

The project is mature. Each unit of work is a **single task** (one GitHub Issue → one PR → one merge). There are no phases, no milestones, and no multi-task implementation plans.

---

## Agent Roles

| Agent                  | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| **Software Architect** | Consulted for tech-stack or structural decisions on a task             |
| **UI/UX Designer**     | Designs visual updates; maintains design system and UI spec on demand  |
| **Copywriter**         | Writes or refines on-page copy; maintains the copy style guide on demand |
| **Tech Lead**          | Breaks down a larger task into smaller steps when a single Engineer pass would be too much |
| **Engineer**           | Implements the task                                                    |
| **Code Reviewer**      | Reviews code changes (read-only — never edits code files)              |
| **QA**                 | Verifies acceptance criteria for bigger or regression-sensitive tasks  |
| **DevOps**             | Deployment, CI/CD, and infrastructure (Vercel, GitHub Actions) on demand |
| **Orchestrator**       | Coordinates the pipeline, commits code, tracks progress                |

There is no Product Manager — **André is his own PM**. He provides the spec directly (via chat or an issue body).

---

## GitHub Issues as Task Tracker

GitHub Issues is the centralized task tracker. Each task is a standalone issue — no phase grouping, no milestone, no implementation-plan file.

### Issue Title Format

`{type}: {short description}` — e.g., `feat: add dark-mode toggle to navbar`, `fix: hero image overflows on mobile Safari`.

### Labels (optional)

| Label               | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `agent:engineer`    | Task to be implemented by the engineer         |
| `priority:high`     | Should be handled soon                         |
| `bug`               | Bug                                            |
| `follow-up`         | Deferred finding from a prior review           |

### Who Creates Issues

| Source           | When                                                           |
| ---------------- | -------------------------------------------------------------- |
| **User**         | Ideas, bug reports, feature requests — created directly on GitHub or via chat |
| **Orchestrator** | Ad-hoc issues discovered during a task: bugs, follow-ups, deferred findings |

The orchestrator refines rough user-created issues (adds acceptance criteria, labels) before starting work.

### Querying Tasks

```bash
# Next open task for the engineer
gh issue list --state open --label "agent:engineer" --json number,title

# All open issues
gh issue list --state open
```

---

## Per-Task Execution Cycle

For each task, follow this cycle:

```
0. (Optional) Pre-implementation agents — invoke only if the task needs them:
   - Software Architect → if the task changes the stack, introduces a new dependency, or
     requires a structural decision. Produces or updates `docs/architecture.md`.
   - UI/UX Designer    → if the task is visual (new section, redesign, visual refactor).
                         Updates `docs/design-system.md` and/or `docs/ui-spec.md` on demand.
   - Copywriter        → if the task introduces or rewrites user-facing copy.
                         Updates `docs/copy-guide.md` on demand.
   - Tech Lead         → only if the task is large enough that a single Engineer pass
                         is unwieldy. Produces a short step breakdown inside the issue
                         (comment), NOT a separate plan document.
         │
         ▼
1. Engineer implements the task
         │
         ▼
2. Orchestrator launches 4 parallel code reviews (ONE agent per review type — NEVER combine multiple types into a single agent):
   - Code Quality  → .reviews/code-quality-task-{issue-number}.md
   - Security      → .reviews/security-task-{issue-number}.md
   - Testing       → .reviews/testing-task-{issue-number}.md
   - Architecture  → .reviews/architecture-task-{issue-number}.md
         │
         ▼
3. Orchestrator merges findings from all reviews, deduplicates,
   and triages by severity:
    ├── Any findings:
    │   a. Triage:
    │      - Critical → must fix before commit
    │      - Warning → should fix; orchestrator decides
    │      - Suggestion → orchestrator decides; can defer
    │   b. Orchestrator sends consolidated numbered findings to the Engineer
    │   c. Engineer fixes issues one at a time:
    │         Fix #1 → run quality checks → Fix #2 → run quality checks → ...
    │      Engineer saves learnings to its memory after all fixes.
    │   d. Orchestrator deletes all review files
    │   e. Back to step 2 (re-review only the types that had findings)
    │
    └── No findings across all reviews:
        a. Orchestrator deletes all review files
        b. Continue
         │
         ▼
4. (Optional) QA pass — invoke only for regression-sensitive changes (accessibility,
   responsive layout on new pages, content migration, analytics wiring). Skip for
   routine tweaks.
         │
         ▼
5. Orchestrator commits and pushes to remote
   (stage source files AND any updated files under .claude/agent-memory/)
         │
         ▼
6. Orchestrator opens a PR and waits for CI to pass
   (gh pr create, then gh pr checks <number> --watch)
   CI MUST pass before merging. If CI fails, diagnose and fix before proceeding.
         │
         ▼
7. Orchestrator merges the PR and closes the GitHub Issue
   (gh pr merge <number> --merge, then gh issue close <number>)
```

For small tweaks (copy change, one-line bug fix, style adjustment), the optional steps drop away and the cycle collapses to **Engineer → Reviews → Commit → PR → Merge**.

---

## Decision Tree for the Orchestrator

When the user asks to work on a task:

1. **Is there a GitHub Issue for it?**
   - No → Create one capturing the request and acceptance criteria (or ask the user to)
   - Yes → continue

2. **Does the task introduce a new dependency, change the stack, or require a structural decision?**
   - Yes → Launch **Software Architect** to update `docs/architecture.md` (create it if absent)
   - No → continue

3. **Is the task visual (new section, redesign, visual refactor)?**
   - Yes, and no design system → Launch **UI/UX Designer** to produce `docs/design-system.md`
   - Yes, no UI spec for this surface → Launch **UI/UX Designer** to produce `docs/ui-spec.md` (requires design system)
   - Not visual → continue

4. **Does the task introduce or rewrite user-facing copy?**
   - Yes, and no copy guide → Launch **Copywriter** to produce `docs/copy-guide.md`
   - Yes, copy guide exists → Launch **Copywriter** to write the copy
   - No copy change → continue

5. **Is the task large enough that a single Engineer pass would be unwieldy?**
   - Yes → Launch **Tech Lead** to add a brief step breakdown as a comment on the issue
   - No → continue

6. **Implement**:
   - Launch **Engineer** with the issue number
   - Run 4 parallel code reviews
   - Fix, re-review, commit, PR, wait for CI, merge, close issue

7. **Is this change regression-sensitive (accessibility, responsive behavior, analytics, content migration)?**
   - Yes → Launch **QA** before merging the PR
   - No → skip QA

8. **Does the task touch deployment, CI/CD, or infra?**
   - Yes → Launch **DevOps** at the appropriate point (before or after engineer, depending on the change)
   - No → skip DevOps

---

## Orchestrator Responsibilities

The orchestrator (main Claude Code session) is responsible for:

- **Deciding which agents to call** based on the task (see Decision Tree above). Default to the lightest possible pipeline: Engineer + Code Reviews. Add specialty agents only when the task genuinely needs them.
- **Committing and pushing code** — agents never commit. The orchestrator commits after the engineer's code passes review, pushes to a feature branch, and opens a PR. **CI must pass before merging** — check with `gh pr checks <number> --watch`. If CI fails, diagnose and fix before merging. Never merge a PR with failing CI. Always stage updated agent memory files (`.claude/agent-memory/`) in the same commit as the source changes.
- **Never writing code** — the orchestrator never writes or edits source code directly, regardless of how simple the change appears. All implementation goes through the engineer, and all engineer output goes through code review. Even one-line fixes must follow this path — the orchestrator's judgment of "simple" is unreliable, and skipping review has caused bugs to ship.
- **Closing issues** — closing the GitHub Issue when a task passes review (`gh issue close <number>`).
- **Passing context between agents** — e.g., forwarding code review findings to the engineer for fixes.
- **Managing review files** — deleting `.reviews/code-review-*.md` files after the engineer has addressed the findings (or after a clean review). Review files are ephemeral; they should not accumulate.
- **Tracking deferred findings** — when a finding is deferred, create a new GitHub Issue with the `follow-up` label referencing the original issue. Verbal deferral without a written record means the finding will be silently dropped.
- **Creating ad-hoc issues** — when bugs, follow-ups, or unplanned work is discovered during the task cycle, create a GitHub Issue directly with appropriate labels (`bug`, `follow-up`).
- **Specifying the worktree path for ALL agents** — when working in a worktree, every agent prompt must include the explicit worktree path for reading and writing files. This applies to ALL agents, not just engineers — designers, copywriters, architects all produce files that must go to the worktree. If a doc-producing agent writes to the main repo instead of the worktree, downstream agents will read stale documents and all their work will be wasted. When unsure whether to use a worktree or main, ask the user.
- **Verifying agent output before proceeding** — after each agent completes, **read the actual file content** (not just the agent's summary) and verify it matches the request. For doc-producing agents (designer, copywriter, architect), open the file and check for specific indicators (e.g., new tokens in a redesigned design system, new layouts in a UI spec). For visual work, use Chrome DevTools MCP to take screenshots and confirm the output looks correct. If the output is incomplete, misses requirements, or contradicts the site's direction, re-engage the agent with specific feedback. **Never proceed to downstream agents based on an agent's verbal summary alone** — the cost of 5 minutes of reading is infinitely less than redoing dependent work.
- **Resolving issues autonomously** — re-engage agents to fix quality problems without involving the user. Only surface to the user when a decision requires product judgment (see "When to Involve the User" below).
- **Maintaining site coherence** — the orchestrator owns consistency across the site. If any agent's output contradicts the existing design, copy voice, or architecture, correct it by re-engaging the agent with targeted feedback rather than asking the user.

### When to Involve the User

**Involve the user** when a decision requires their judgment:
- Scope changes (what the task should actually include)
- Trade-offs where the user's preference is unknown (visual direction, copy tone, tech choice)
- Bugs or edge cases that require judgment to resolve
- Decisions that affect external dependencies, integrations, or credentials

**Handle autonomously** — do not ask the user:
- Re-engaging an agent to fix incomplete or incorrect output
- Document quality issues → re-engage the upstream agent
- Code review findings and fix passes
- Implementation approach decisions within the task's scope

---

## Document Cross-Check Protocol

Before passing an agent's output downstream, verify it meets the minimum quality bar. If a check fails, re-engage the upstream agent with the specific gaps listed.

**After Software Architect updates the architecture:**
- The decision or change being introduced is clearly stated with rationale
- No undocumented constraints that would block the task
- Tech choices are consistent with existing project constraints (Next.js 16, React 19, Tailwind 4, pnpm)

**After UI/UX Designer produces/updates a design system or UI spec:**
- New tokens, components, or layouts are present and named consistently
- Dark mode variants are included if the site uses them
- The file references existing tokens rather than reinventing them

**After Copywriter updates the copy guide or writes copy:**
- Voice adjectives are specific, not generic
- New strings follow the existing voice on the site
- Error/empty states include a path forward where applicable

**After Tech Lead breaks down a task:**
- Every sub-step has a clear deliverable
- Sub-steps are sequenced correctly (no step assumes work not yet done)
- The breakdown lives in the issue comment, not a separate file

---

## Agent Communication Rules

- The **Code Reviewer is read-only** and runs as 4 parallel specialized reviews (Code Quality, Security, Testing, Architecture). Each writes its own report to `.reviews/`. The orchestrator merges findings, deduplicates, and sends a consolidated list to the Engineer. Review files are deleted after findings are addressed.
- The **Engineer** must save learnings from code review findings to its persistent memory so it avoids repeating the same mistakes in future tasks.
- **Review files are ephemeral**. The orchestrator deletes them after the engineer has processed the feedback (or immediately if the review is clean). They should never be committed to the repository.
- Agents do not communicate with each other directly. All coordination goes through the orchestrator.
- The **Copywriter** defines voice and terminology. Once `docs/copy-guide.md` exists, all on-page copy must follow it. The Copywriter saves terminology decisions to its persistent memory for consistency across sessions.
- **Agents have persistent memory** (`.claude/agent-memory/<agent-name>/`). The Engineer, Code Reviewer, and Copywriter save learnings from each task, which makes them more effective over time. Memory files should be committed alongside source code changes.

---

## Document Lifecycle

All project-level docs are **created on demand** — only when a task calls for them.

| Document                 | Created by         | Consumed by                                                  |
| ------------------------ | ------------------ | ------------------------------------------------------------ |
| `docs/architecture.md`   | Software Architect | Tech Lead, Engineer, Code Reviewer                           |
| `docs/design-system.md`  | UI/UX Designer     | Copywriter, Engineer, Code Reviewer                          |
| `docs/ui-spec.md`        | UI/UX Designer     | Copywriter, Engineer, Code Reviewer                          |
| `docs/copy-guide.md`     | Copywriter         | Engineer, Code Reviewer                                      |
| GitHub Issues            | User, Orchestrator | Engineer, Code Reviewer, QA, Orchestrator                    |
| `.reviews/code-review-*.md` | Code Reviewer   | Engineer (via Orchestrator) — **ephemeral, deleted after processing** |

---

## Agent Prompt Checklist

When launching an agent, include the following context in the prompt:

**Engineer** (new task):
- Include the GitHub Issue number (e.g., "Implement issue #42")
- Remind to read `docs/agents/engineer.md` for project-specific pitfalls and conditional reading list
- Issue number only — the engineer reads the issue body itself, so do not duplicate description or acceptance criteria in the prompt
- Any context that is NOT in the issue (e.g., "skip unit tests for this task")
- Remind: write failing tests for each AC **before** implementing (when tests are applicable — many UI tweaks won't have unit tests) — run them to confirm they fail for the right reason, then implement until they pass

**Engineer** (fix pass):
- The review findings to fix (copy from the review file), numbered
- Remind: fix one at a time, run quality checks (lint, typecheck, build) after each fix before moving to the next
- Remind: fix only what's described — do not remove or modify adjacent code unless explicitly instructed
- Remind: if a fix adds any new functions, consider whether a unit test is warranted for this codebase
- Use a **fresh agent** for trivial fixes (single file, adding tests, updating a comment). Reserve agent resume for complex fix passes where prior context genuinely matters.
- For a **3rd or later fix pass** on the same task, launch a fresh agent with just the file contents and the specific fix needed — accumulated conversation history makes resumed agents expensive.

**Code Reviews** (first review — launch 4 in parallel, ONE agent per type):

Each review type gets its own dedicated agent instance — NEVER combine multiple review types into a single agent call. Batching reviews into one agent defeats specialization and reduces review quality. Launch exactly 4 Agent calls in a single message:
- The review type: "Run a {Code Quality | Security | Testing | Architecture} review"
- List of files to review
- Issue number and what was implemented
- Output path: `.reviews/{type}-task-{issue-number}.md` (e.g., `.reviews/security-task-42.md`)

**Code Reviews** (re-review after fix pass):
- Only re-run the review types that had findings — skip clean types
- Send only the specific findings from the previous review for that type
- Task: verify each finding is resolved — do NOT look for new issues

**QA** (invoked on demand for regression-sensitive changes):
- Issue number and what was implemented
- The specific acceptance criteria to verify (from the issue body)
- The specific regression surface to check (accessibility, responsive breakpoints, analytics wiring, etc.)

**Software Architect** (consult for a task):
- Tell it the specific decision or change being considered
- Existing constraints (Next.js 16, React 19, Tailwind 4, pnpm)
- Whether the output should update `docs/architecture.md` or just return a recommendation in the chat

**UI/UX Designer** (design system):
- Tell it to produce or update `docs/design-system.md`
- Mention brand preferences, color direction, or existing visual assets
- Reference any existing design tokens or variables in `src/styles/`

**UI/UX Designer** (UI spec):
- Tell it to produce or update `docs/ui-spec.md` for the specific page/section
- Remind it to reference `docs/design-system.md` for token names and components
- Mention UX preferences or specific page requirements from the user
- After completion: orchestrator must read the actual file and verify new layouts/tokens are present — do not rely on the agent's summary

**UI/UX Designer** (design exploration — major redesign):
- Tell it to read `docs/agents/ui-ux-designer.md` for the full design exploration process
- Tell it to produce 5+ distinct design options with HTML preview pages
- After completion: orchestrator must review previews via Chrome DevTools screenshots before presenting to user

**Copywriter** (copy style guide):
- Tell it to produce or update `docs/copy-guide.md`
- Mention any tone preferences or existing copy conventions on the site

**Copywriter** (on-page copy):
- Tell it which surface/component needs copy and what it should communicate
- Remind it to follow `docs/copy-guide.md` for voice, tone, and terminology
- If updating existing strings: specify which component(s) have new or changed copy

**Tech Lead** (break down a large task):
- Tell it to produce the breakdown as a comment on the GitHub Issue — do NOT create a separate plan document
- Every step must have a clear deliverable
- Steps must be sequenced correctly

**DevOps** (deployment setup / CI/CD):
- The target platform (Vercel, GitHub Actions) and what needs to be configured
- Any existing infra config files and their locations
- For failures: the error message or build log output

**DevOps** (debugging a deploy failure):
- The exact error from the build/deploy logs
- What changed since the last successful deploy
- Remind: read logs and platform docs before changing config — one change at a time

---

## Mobile Communication

The orchestrator has access to a Telegram MCP server ("The Oracle") for sending messages to the user's mobile phone and waiting for replies. Use this for decisions that require user input when they may not be at their computer.

### Tools

| Tool | Description |
|---|---|
| `mcp__telegram__send_message(text)` | Sends a message to the user. Returns `message_id`. |
| `mcp__telegram__wait_for_reply(message_id, timeout_seconds?)` | Waits for a reply **to that specific message** (using Telegram's reply-to feature). Returns the reply text, or `null` on timeout. Default timeout: 1 hour. |

### When to use

Use Telegram when:
- The orchestrator needs user input to proceed but the decision is non-blocking (the user may be away)
- A task hits an approval gate that requires product judgment
- An unexpected blocker requires a scope decision

Do **not** use Telegram for:
- Routine task completion updates (close the GitHub Issue instead)
- Questions the orchestrator can resolve autonomously (re-engage agents, make the call)

### Pattern

```
1. Send message → get message_id
2. Wait for reply with that message_id
3. The user replies TO the message in Telegram (not a new message)
4. Proceed based on the reply text
```

Always tell the user what to reply to unblock you, e.g.:
> "Issue #17 requires a decision on X. Reply **yes** to proceed with option A or **no** to defer."

If `wait_for_reply` returns `null` (timeout), add a comment on the relevant GitHub Issue noting the pending decision and stop. Do not proceed with a decision that requires user input.

---

## Post-Task Report Format

When the user asks for a post-task report, produce it in this format:

```
Issue #{N} — Post-Task Report

Agent Calls

| Agent | Purpose | Tokens | Time |
|---|---|---|---|
| Engineer | Implement #{N} | {tokens} | {time} |
| Code Reviewer | First review | {tokens} | {time} |
| Engineer | Fix pass ({findings}) | {tokens} | {time} |  ← omit if no fix pass
| Code Reviewer | Re-review | {tokens} | {time} |         ← omit if no fix pass

Total: ~{N}k tokens, ~{N} min

---
What Worked

- ...

What Could Improve

- ...  ← use "Nothing notable." if clean
```

This report is produced **on request only** — not automatically after every task. When produced, save it to `.reports/issue-{N}-report.md` **in the main working tree** (not the worktree). Reports are gitignored and not committed — writing them to a worktree means they are lost when the worktree is removed.
