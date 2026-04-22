# andresilva.cc — Agent Instructions

André's personal website — Next.js 16 + React 19 + Tailwind 4. Served at https://andresilva.cc.

The project is **mature**: changes are one-off tasks (tweaks, small features, refactors). There are no phases, no milestones, and no multi-task implementation plans.

---

## Git Worktrees (orchestrator only)

**The orchestrator** creates and manages worktrees — subagents (engineer, code reviewer, etc.) never create worktrees themselves. The orchestrator enters the worktree, then launches subagents to work inside it.

### Rules

1. **Always use a worktree.** Before starting any implementation work, use `EnterWorktree` to create and switch into a worktree:
   ```
   EnterWorktree with name: "feature-name"
   ```
   Then run `pnpm install` — worktrees don't share `node_modules/`, and ESLint runs from the worktree's local install. All commands and subagents will run in the worktree directory automatically — no `cd` prefixes needed.

2. **Clean up after merging.** Once a branch is merged:
   ```
   gh pr merge <number> --merge
   git push origin --delete <branch-name>
   ExitWorktree with action: "remove"
   git pull
   ```

3. **Never rebase — use merge.** When a branch needs to be synced with main, use `git merge main` instead of `git rebase main`. Rebase rewrites history and requires a force-push, which is destructive.

4. **Separate git add and git commit.** Always stage files and commit in separate commands. A pre-commit hook verifies review markers, and it can only check staged files if `git add` already ran.

5. **Only clean up your own worktrees.** Never remove worktrees you didn't create — other sessions may be actively using them.

---

## Orchestrator (main Claude Code session)

You coordinate the agent pipeline for André's personal website. At the start of every session — including after a context reset or continuation — re-read both documents before taking any action:

- `docs/status.md` — project snapshot, deployment info, and conventions
- `docs/workflow.md` — per-task workflow (decision tree, execution cycle, your responsibilities)
- `gh issue list --state open` — current open tasks (GitHub Issues is the source of truth)

Never assume prior context is intact. Always re-orient from these documents and the issue tracker. Then ask the user: **"Would you like post-task reports saved to `.reports/` after each task?"**

You are responsible for committing code, closing GitHub Issues when tasks pass review, and routing work between agents. Agents never commit — you do.

### Scope note

There is no Product Manager — **André is his own PM**. Each request is a single task. For small tweaks (copy change, style tweak, bug fix), go straight to Engineer + Code Reviewer. Pull in the Designer, Copywriter, Architect, Tech Lead, QA, or DevOps only when the task genuinely warrants it (see `docs/workflow.md`).

When a decision requires user input and they may not be at their computer, use the Telegram MCP tools (`mcp__telegram__send_message` / `mcp__telegram__wait_for_reply`) to reach them on mobile. See the "Mobile Communication" section in `docs/workflow.md` for when and how to use them.
