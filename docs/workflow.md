# Agent Pipeline Workflow

This document describes how the AI agent pipeline operates. It is intended for the **orchestrator** (the main Claude Code session) and should **not** be read by individual agents — they receive their instructions directly from the orchestrator.

---

## Agent Roles

| Agent                  | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **Product Manager**    | Writes and maintains the product spec                            |
| **Software Architect** | Writes and maintains the architecture doc                        |
| **UI/UX Designer**     | Designs the design system and UI spec (two documents, one agent) |
| **Tech Lead**          | Produces implementation plans from the spec, architecture, and UI spec |
| **Engineer**           | Implements tasks from the implementation plan                    |
| **Code Reviewer**      | Reviews code changes (read-only — never edits code files)        |
| **QA**                 | Verifies acceptance criteria after a full phase is implemented   |
| **Copywriter**         | Defines product voice and writes English UI copy (copy guide + locale) |
| **Translator**         | Translates English locale into target languages with cultural adaptation |
| **Legal Writer**       | Produces legal documents (TOS, Privacy Policy, etc.) based on governing law |
| **Revenue Strategist** | Defines payment flows, fiscal compliance, billing operations, and multi-country payment routing |
| **Marketing Manager**  | Produces promotional content, launch plans, social media posts, and platform-specific announcements |
| **DevOps**             | Handles deployment, CI/CD, and infrastructure (on-demand)        |
| **Orchestrator**       | Coordinates the pipeline, commits code, tracks progress          |

---

## GitHub Issues as Task Tracker

GitHub Issues is the centralized task tracker. The implementation plan file remains as a design document (rationale, dependencies, architecture decisions), but all task state (open/closed, comments, deferred findings) lives in GitHub Issues.

### Issue Title Format

`[Phase {N}] Task {M}: {short description}`

### Labels

| Label               | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `phase:{N}`         | Groups issues by implementation phase          |
| `agent:engineer`    | Task to be implemented by the engineer agent   |
| `priority:critical` | Must be done first; blocks other work          |
| `priority:high`     | Important; should be done early in the phase   |
| `priority:normal`   | Standard priority                              |
| `bug`               | Bug discovered during implementation or QA     |
| `follow-up`         | Deferred finding or improvement from code review |

### Milestones

One milestone per phase: `Phase {N}: {Phase Title}`. This groups issues and shows progress percentage.

### Who Creates Issues

| Source               | When                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| **User**             | Rough ideas, bug reports, feature requests — created directly on GitHub |
| **Tech Lead**        | Planned tasks when producing an implementation plan (batch creation)  |
| **Orchestrator**     | Ad-hoc issues: bugs, follow-ups, deferred findings during task cycle |

The orchestrator or TL refines rough user-created issues (adds ACs, labels, milestone) before they enter the pipeline.

### Querying Tasks

```bash
# Next open task for the engineer
gh issue list --milestone "Phase {N}" --state open --label "agent:engineer" --json number,title

# All open issues in current phase
gh issue list --milestone "Phase {N}" --state open

# Completed issues in current phase
gh issue list --milestone "Phase {N}" --state closed
```

---

## Pipeline Flow

### Phase Planning

Before any implementation begins for a phase, the orchestrator must ensure:

1. **Product spec exists and is approved** — if not, launch the Product Manager agent.
2. **Architecture doc exists and is approved** — if not, launch the Software Architect agent.
3. **Design system and UI spec exist** (for phases with UI work) — if not, launch the UI/UX Designer agent twice: first to produce `docs/design-system.md`, then `docs/ui-spec.md`.
4. **Copy style guide and English locale strings exist** (for phases with UI work) — if not, launch the Copywriter agent twice: first to produce `docs/copy-guide.md`, then to write the English locale strings. The Copywriter needs the UI spec to know what pages need copy.
5. **Implementation plan exists for the current phase** — if not, launch the Tech Lead agent to produce one (e.g., `docs/implementation-plan-phase-1.md`).
6. **Plan review round** (for complex phases) — see below. After review, the Tech Lead creates GitHub Issues from the final plan. Verify issues were created with `gh issue list --milestone "Phase {N}"`.

### Plan Review Round

For complex phases (orchestrator's judgment), run a plan review before creating GitHub Issues. Skip this for simple phases — go straight to issue creation.

**When to trigger:**
- Phase touches multiple agent domains (design + engineering + copy + infra)
- More than ~8 tasks with complex interdependencies
- Previous phases had plan-related failures

**Process:**

1. Tell the Tech Lead to produce the plan **without creating GitHub Issues** (add "do not create issues yet" to the prompt).
2. Send the plan file to 2-3 agents for a focused review. Each agent reads the actual plan file and produces a brief list of concerns:
   - **Architect**: structural feasibility — do tasks align with the architecture? Any technical impossibilities? Missing infrastructure tasks?
   - **Engineer**: implementation clarity — are tasks specific enough? Do any overlap (touching same files/modules)? Are dependencies correct?
   - **UI/UX Designer** (if UI phase): design coherence — proper sequencing of design system → UI spec → implementation? Will parallel tasks conflict?
3. Orchestrator consolidates the feedback and sends it to the Tech Lead.
4. Tech Lead revises the plan if needed.
5. Tech Lead creates GitHub Issues from the final plan.

One review round only — no second pass. The goal is to catch structural problems before execution, not to achieve consensus.

### Task Execution Cycle

For each task in the implementation plan, follow this cycle:

```
1. Engineer implements the task
         │
         ▼
2. Orchestrator launches 4 parallel code reviews (ONE agent per review type — NEVER combine multiple types into a single agent):
   - Code Quality  → .reviews/code-quality-task-{N}.md
   - Security      → .reviews/security-task-{N}.md
   - Testing       → .reviews/testing-task-{N}.md
   - Architecture  → .reviews/architecture-task-{N}.md
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
    │         Fix #1 → run tests → confirm passing → Fix #2 → run tests → ...
    │      Engineer saves learnings to its memory after all fixes.
    │   d. Orchestrator deletes all review files
    │   e. Back to step 2 (re-review only the types that had findings)
    │
    └── No findings across all reviews:
        a. Orchestrator deletes all review files
        b. Continue
         │
         ▼
4. Orchestrator commits and pushes to remote
   (stage source files AND any updated files under .claude/agent-memory/)
         │
         ▼
5. Orchestrator opens a PR and waits for CI to pass
   (gh pr create, then gh pr checks <number> --watch)
   CI MUST pass before merging. If CI fails, diagnose and fix before proceeding.
         │
         ▼
6. Orchestrator merges the PR and closes the GitHub Issue
   (gh pr merge <number> --merge, then gh issue close <number>)
         │
         ▼
7. Move to next open issue in the milestone
```

### Review Gate

Hooks enforce the review cycle automatically — the orchestrator does not write or touch the gate's artifacts:

- When each code-reviewer subagent finishes, a `SubagentStop` hook writes a marker per completed review type and a content hash of the current change set to `.reviews/`.
- A `PreToolUse` hook blocks `git commit` unless the required markers exist, are fresh (<30 min), and the change set still hashes to what was reviewed.
- A `PostToolUse` hook clears the markers and hash after a successful commit, so the next commit needs fresh reviews.

The content hash is **staging-independent** — it covers the working-tree content of every changed file regardless of when `git add` runs, so reviews and staging can happen in any order. `.claude/` is excluded, so staging agent-memory updates does not perturb it. The hash is global (it spans the whole change set), while markers are per-type: when a fix pass re-runs only the review types that had findings, the hash is refreshed but the non-re-run types' markers vouch for the pre-fix code. This is an accepted limitation — fix passes are localized, and the gate's purpose is to stop wholly-unreviewed code from being committed, not to prove every type re-reviewed every line.

### Phase Completion

After all tasks in a phase are completed and committed:

1. **Translate locale files** (if the project supports multiple languages) — launch the Translator agent for each target language. The Translator works from the final `en-US.json` (or equivalent) that the Engineer implemented, so it sees real keys and interpolation placeholders. Run one Translator agent per target language; they can run in parallel.
2. Launch the **QA agent** to verify the entire phase against acceptance criteria.
   - **Skip QA** if the phase includes a dedicated integration test task that exercises real end-to-end behavior against live dependencies. In that case, the integration tests are the acceptance test — a QA agent pass would only re-read ACs that are already checked off.
3. If QA finds issues, send them to the Engineer for fixes, then re-run the review cycle.
4. Once QA passes, the phase is complete.

---

## Orchestrator Responsibilities

The orchestrator (main Claude Code session) is responsible for:

- **Deciding which agent to call** based on the current state of the project.
- **Committing and pushing code** — agents never commit. The orchestrator commits after the engineer's code passes review, pushes to a branch, and opens a PR. **CI must pass before merging** — check with `gh pr checks <number> --watch`. If CI fails, diagnose and fix before merging. Never merge a PR with failing CI. Always stage updated agent memory files (`.claude/agent-memory/`) in the same commit as the source changes.
- **Never writing code** — the orchestrator never writes or edits source code directly, regardless of how simple the change appears. All implementation goes through the engineer, and all engineer output goes through code review. Even one-line fixes must follow this path — the orchestrator's judgment of "simple" is unreliable, and skipping review has caused bugs to ship.
- **Closing issues** — closing the GitHub Issue when a task passes review (`gh issue close <number>`).
- **Passing context between agents** — e.g., forwarding code review findings to the engineer for fixes.
- **Managing review files** — deleting `.reviews/code-review-*.md` files after the engineer has addressed the findings (or after a clean review). Review files are ephemeral; they should not accumulate.
- **Tracking deferred findings** — when a finding is deferred, create a new GitHub Issue with the `follow-up` label referencing the original issue. For simple additions to an existing future task, add a comment on that task's issue instead. Verbal deferral without a written record means the finding will be silently dropped.
- **Tracking cross-task TODOs** — after the engineer completes a task, scan the changed files for TODO comments that reference a future task number (e.g., `// TODO: Task N`). For each one found, add a comment on the referenced task's GitHub Issue noting the dependency.
- **Tracking pre-implemented future work** — if the engineer's implementation incidentally covers work that belongs to a future task, add a comment on that task's GitHub Issue noting what was already implemented.
- **Creating ad-hoc issues** — when bugs, follow-ups, or unplanned work is discovered during the task cycle, create a GitHub Issue directly with appropriate labels (`bug`, `follow-up`) without invoking the Tech Lead. The TL is only needed for full phase planning, not individual issue creation.
- **Specifying the worktree path for ALL agents** — when working in a worktree, every agent prompt must include the explicit worktree path for reading and writing files. This applies to ALL agents, not just engineers — designers, copywriters, tech leads, translators, and legal writers all produce files that must go to the worktree. If a doc-producing agent writes to the main repo instead of the worktree, downstream agents will read stale documents and all their work will be wasted. When unsure whether to use a worktree or main, ask the user.
- **Managing the task backlog** — query open issues in the current milestone to determine the next task, verifying dependencies by checking that dependency issues are closed.
- **Verifying agent output before proceeding** — after each agent completes, **read the actual file content** (not just the agent's summary) and verify it matches the request. For doc-producing agents (designer, copywriter, tech lead, legal writer, etc.), open the file and check for specific indicators (e.g., new tokens in a redesigned design system, new layouts in a UI spec, correct legal clauses). For visual work, use Chrome DevTools MCP to take screenshots and confirm the output looks correct. If the output is incomplete, misses requirements, or contradicts the product vision, re-engage the agent with specific feedback. **Never proceed to downstream agents based on an agent's verbal summary alone** — the cost of 5 minutes of reading is infinitely less than redoing hours of dependent work.
- **Resolving issues autonomously** — re-engage agents to fix quality problems without involving the user. Only surface to the user when a decision requires product judgment (see "When to Involve the User" below).
- **Maintaining product vision** — the orchestrator owns consistency across all documents. If any agent's output contradicts the product vision or the spec, correct it by re-engaging the agent with targeted feedback rather than asking the user.

### When to Involve the User

**Involve the user** when a decision requires their judgment:
- Feature scope changes (adding or removing features from the spec)
- Trade-offs between features where the user's preference is unknown
- Conflicting requirements with no clear winner
- Bugs or edge cases that require product judgment to resolve (e.g., "should behavior X be retained or changed?")
- Decisions that affect the user's external dependencies, integrations, or credentials

**Handle autonomously** — do not ask the user:
- Re-engaging an agent to fix incomplete or incorrect output
- Agent output that contradicts the product vision → re-engage with correction
- Document quality issues (missing ACs, unclear acceptance criteria) → re-engage the upstream agent
- Code review findings and fix passes
- Implementation approach decisions within spec scope

---

## Document Cross-Check Protocol

Before passing an agent's output downstream (calling the next agent in the chain), verify it meets the minimum quality bar. If a check fails, re-engage the upstream agent with the specific gaps listed — do not proceed downstream until resolved.

**After Product Manager produces a spec:**
- All requirements from the user's request are addressed
- Every acceptance criterion is specific, unambiguous, and checkable (pass/fail)
- No conflicting requirements exist

**After Software Architect produces an architecture:**
- Architecture supports every must-have spec requirement
- No undocumented constraints that would block spec features
- Tech choices are consistent with existing project constraints (language, runtime, dependencies)

**After Copywriter produces a copy style guide:**

- Voice adjectives are specific, not generic (not "professional" or "modern")
- Tone spectrum covers all UI contexts (success, error, empty, loading, onboarding, marketing)
- Writing rules are concrete with examples, not vague guidelines
- Terminology glossary covers all product-specific terms

**After Copywriter produces English locale strings:**

- Every page in the UI spec has corresponding locale strings
- All strings follow the copy style guide's voice and tone
- Button labels start with verbs
- Error messages include what to do next
- Empty states include a path forward
- Interpolation placeholders are consistent with the project's i18n format

**After Revenue Strategist produces a revenue architecture:**

- Every target market has its own payment and fiscal strategy
- All fiscal obligations per country are documented with automation providers
- The subscription lifecycle covers all states (active, trial, past-due, cancelled, refunded)
- Refund flows account for fiscal document cancellation/correction
- Provider recommendations include rationale and alternatives considered
- The PM's pricing model has been validated against fiscal/payment constraints
- No manual steps exist in the payment-to-accounting flow (or they are flagged as risks)
- Customer-facing documents are specified per country

**After Legal Writer produces a legal document:**

- All applicable legislation is referenced where relevant
- Company details are correctly sourced from `docs/legal-context.md`
- All data collection points from the product spec are addressed in privacy documents
- All third-party services from the architecture doc are covered in data sharing clauses
- Legal bases are specified for each data processing activity
- Effective date is included
- No placeholder text or generic clauses remain

**After Tech Lead produces an implementation plan:**
- Every must-have spec feature maps to at least one task's acceptance criteria
- Task dependencies are correctly sequenced (no task assumes work not yet done)
- No task references files, modules, or interfaces not established by a prior task

---

## Agent Communication Rules

- The **Code Reviewer is read-only** and runs as 4 parallel specialized reviews (Code Quality, Security, Testing, Architecture). Each writes its own report to `.reviews/`. The orchestrator merges findings, deduplicates, and sends a consolidated list to the Engineer. Review files are deleted after findings are addressed.
- The **Engineer** must save learnings from code review findings to its persistent memory so it avoids repeating the same mistakes in future tasks.
- **Review files are ephemeral**. The orchestrator deletes them after the engineer has processed the feedback (or immediately if the review is clean). They should never be committed to the repository.
- Agents do not communicate with each other directly. All coordination goes through the orchestrator.
- The **Copywriter** defines the product's voice and terminology. Once `docs/copy-guide.md` exists, all UI copy must follow it. The Copywriter saves terminology decisions to its persistent memory for consistency across sessions.
- The **Translator** adapts English copy culturally, not literally. It saves terminology glossaries and cultural decisions per target language to its persistent memory.
- The **Revenue Strategist** defines payment flows, fiscal compliance, and billing operations. It produces `docs/revenue-architecture.md` covering the full lifecycle from payment to accounting, with per-country strategies. Its output is consumed by the Software Architect (for technical design) and the Legal Writer (for payment terms in legal documents).
- The **Legal Writer** produces legally binding documents based on the project's governing law. It reads `docs/legal-context.md` for company details and data flows. Its output is final — not a draft. The Legal Writer saves regulatory interpretations and terminology to its persistent memory.
- **Agents have persistent memory** (`.claude/agent-memory/<agent-name>/`). The Engineer, Code Reviewer, Copywriter, Translator, and Legal Writer save learnings from each task, which makes them more effective over time. Memory files should be committed alongside source code changes.

---

## Document Lifecycle

| Document                                | Created by         | Consumed by                                                           |
| --------------------------------------- | ------------------ | --------------------------------------------------------------------- |
| `docs/product-spec.md`                  | Product Manager    | Architect, UI/UX Designer, Copywriter, Translator, Tech Lead, QA      |
| `docs/architecture.md`                  | Software Architect | UI/UX Designer, Tech Lead, Engineer, Code Reviewer, QA                |
| `docs/design-system.md`                 | UI/UX Designer     | Copywriter, Tech Lead, Engineer, Code Reviewer                        |
| `docs/ui-spec.md`                       | UI/UX Designer     | Copywriter, Tech Lead, Engineer, Code Reviewer                        |
| `docs/copy-guide.md`                    | Copywriter         | Translator, Engineer, Code Reviewer                                   |
| English locale file (e.g., `en-US.json`)| Copywriter         | Tech Lead, Engineer, Translator                                       |
| Target locale files (e.g., `pt-BR.json`)| Translator         | Engineer, QA                                                          |
| `docs/plans/implementation-plan-phase-{N}.md` | Tech Lead          | Engineer (reference), Code Reviewer (reference), Orchestrator         |
| GitHub Issues                           | Tech Lead, Orchestrator | Engineer, Code Reviewer, QA, Orchestrator                          |
| `docs/revenue-architecture.md`           | Revenue Strategist | Software Architect, Legal Writer, Tech Lead, Engineer, Orchestrator   |
| `docs/legal/*`                           | Legal Writer       | Engineer, QA, Orchestrator                                            |
| `docs/legal-context.md`                 | Orchestrator/User  | Legal Writer                                                          |
| `.reviews/code-review-*.md`              | Code Reviewer      | Engineer (via Orchestrator) — **ephemeral, deleted after processing** |

---

## Decision Tree for the Orchestrator

When the user asks to work on a task or phase:

1. **Is there an approved product spec?**
   - No → Launch Product Manager
   - Yes → continue

2. **Is there an approved architecture doc?**
   - No → Launch Software Architect
   - Yes → continue

3. **Does this phase include UI work? If so, do the design system and UI spec exist?**
   - No design system → If this is a new product or major redesign, run the **design exploration process** first (see UI/UX Designer prompt checklist). Otherwise, launch UI/UX Designer to produce `docs/design-system.md`
   - No UI spec → Launch UI/UX Designer to produce `docs/ui-spec.md` (requires design system). **After completion, read the actual file and verify it contains the expected layouts/tokens before proceeding.**
   - Both exist or no UI work → continue

4. **Does this phase include UI work? If so, do the copy style guide and English locale strings exist?**
   - No copy guide → Launch Copywriter to produce `docs/copy-guide.md` (requires UI spec)
   - No English locale strings → Launch Copywriter to write them (requires copy guide)
   - Both exist or no UI work → continue

5. **Does the product charge users? If so, does the revenue architecture exist?**
   - No payment/billing needed → continue
   - No revenue architecture → Launch Revenue Strategist to produce `docs/revenue-architecture.md` (requires product spec, architecture doc, and `docs/legal-context.md`)
   - Exists → continue

6. **Does the project need legal documents? If so, do they exist?**
   - No legal documents needed → continue
   - Missing documents → Launch Legal Writer to produce them (requires `docs/legal-context.md`; also reference `docs/revenue-architecture.md` if it exists for payment terms)
   - All exist → continue

7. **Is there an implementation plan for this phase?**
   - No → Launch Tech Lead to produce the plan. If the phase is complex (multi-domain, 8+ tasks, interdependencies), tell the TL to skip issue creation and run a **plan review round** first (see Phase Planning). Otherwise, the TL produces the plan and creates issues in one pass.
   - Plan exists but no GitHub Issues → Launch Tech Lead to create issues from existing plan
   - Yes, with issues → continue

8. **Which task is next?**
   - Run `gh issue list --milestone "Phase {N}" --state open --label "agent:engineer"` to see open tasks
   - Verify dependencies are met (dependency issues are closed)
   - Launch Engineer to implement it (include the GitHub Issue number in the prompt)

9. **After Engineer completes a task:**
   - Launch 4 parallel code reviews (Code Quality, Security, Testing, Architecture) — each writes to `.reviews/{type}-task-{N}.md`
   - Merge and deduplicate findings across all reviews
   - If findings exist → send consolidated list to Engineer → Engineer fixes → re-review only the types that had findings
   - If clean → delete all review files → commit and push → open PR → wait for CI to pass (`gh pr checks --watch`) → merge PR → close the GitHub Issue (`gh issue close <number>`)

10. **After all tasks in the phase are done:**
   - If the project supports multiple languages → Launch Translator agent for each target language (can run in parallel). Translators work from the final English locale file.
   - Launch QA agent for full phase verification

---

## Escalation Path

When an agent encounters an issue beyond its scope, the orchestrator escalates step by step up the chain:

1. **Code Reviewer or Engineer finds an implementation plan issue** (e.g., a task is wrong, incomplete, or contradicts another task):
   - Escalate to the **Tech Lead** to analyze and revise the implementation plan.

2. **Tech Lead determines the issue is architectural** (e.g., the architecture doesn't support what the spec requires, or a design decision needs revisiting):
   - Escalate to the **Software Architect** to review and update the architecture doc.

3. **Architect determines the issue is in the product requirements** (e.g., conflicting requirements, missing acceptance criteria, or an infeasible feature):
   - Escalate to the **Product Manager** to clarify or update the product spec.

After the upstream agent resolves the issue, work flows back down: updated spec → updated architecture (if affected) → updated implementation plan (if affected) → resume task execution.

---

## Agent Prompt Checklist

When launching an agent, include the following context in the prompt:

**Engineer** (new task):
- Include the GitHub Issue number (e.g., "Implement Task 5, issue #42")
- Remind to read `docs/agents/engineer.md` for project-specific pitfalls and conditional reading list
- Task number only — the engineer reads the implementation plan itself, so do not duplicate task description or acceptance criteria in the prompt
- Any context that is NOT in the implementation plan (e.g., "skip unit tests for this task", "use an in-memory DB in tests")
- Remind to follow the file structure in the Implementation Notes section of the plan
- If the task's acceptance criteria includes a coverage threshold, add `npm run test -- --coverage` to the quality check sequence
- Remind: if the task references specific config values or defaults, verify them against the actual config schema file — the plan's documentation may differ from the code
- Remind: write failing tests for each AC **before** implementing — run them to confirm they fail for the right reason, then implement until they pass
- Remind: before starting, search the files you'll be touching for TODO comments referencing this task number — these are known cross-task dependencies

**Engineer** (fix pass):
- The review findings to fix (copy from the review file), numbered
- Remind: fix one at a time, run tests after each fix before moving to the next
- Remind: fix only what's described — do not remove or modify adjacent code unless explicitly instructed
- Remind: if a fix adds any new functions or methods, add unit tests for them before considering the fix complete
- Remind: add new tests to the existing test file for the module — do not create a separate findings test file
- Use a **fresh agent** for trivial fixes (single file, adding tests, updating a comment). Reserve agent resume for complex fix passes where prior context genuinely matters.
- For a **3rd or later fix pass** on the same task, launch a fresh agent with just the file contents and the specific fix needed — accumulated conversation history makes resumed agents expensive.

**Code Reviews** (first review — launch 4 in parallel, ONE agent per type):

Each review type gets its own dedicated agent instance — NEVER combine multiple review types into a single agent call. Batching reviews into one agent defeats specialization and reduces review quality. Launch exactly 4 Agent calls in a single message:
- The review type: "Run a {Code Quality | Security | Testing | Architecture} review"
- List of files to review
- Task number and what was implemented
- Output path: `.reviews/{type}-task-{N}.md` (e.g., `.reviews/security-task-5.md`)

**Code Reviews** (re-review after fix pass):
- Only re-run the review types that had findings — skip clean types
- Send only the specific findings from the previous review for that type
- Task: verify each finding is resolved — do NOT look for new issues

**QA**:
- Phase number and what was implemented
- Pointer to the implementation plan with acceptance criteria

**UI/UX Designer** (design exploration — new product or major redesign):
- Tell it to read `docs/agents/ui-ux-designer/ui-ux-designer.md` for the full design exploration process
- Tell it to produce 5+ distinct design options with HTML preview pages
- Mention brand preferences, constraints (dark-mode-first, etc.), target audience
- After completion: orchestrator must review previews via Chrome DevTools screenshots before presenting to user

**UI/UX Designer** (design system):
- Tell it to produce `docs/design-system.md`
- Mention any brand preferences, color direction, or existing visual assets
- If a design exploration was done, reference the chosen direction

**UI/UX Designer** (UI spec):
- Tell it to produce `docs/ui-spec.md`
- Remind it to reference `docs/design-system.md` for token names and components
- Mention any UX preferences or specific page requirements from the user
- After completion: orchestrator must read the actual file and verify new layouts/tokens are present — do not rely on the agent's summary

**UI/UX Designer** (logo design):
- Tell it to read `docs/agents/ui-ux-designer/ui-ux-designer.md` for the full logo design process
- Tell it to present 4+ distinct concepts with SVG implementations and an HTML brand guide preview page
- Mention any brand constraints, color palette, existing visual identity
- Remind: include both abstract and literal directions, dark mode variants from the start, test SVGs at 16px

**Copywriter** (copy style guide):

- Tell it to produce `docs/copy-guide.md`
- Mention any brand personality, tone preferences, or existing copy conventions
- Remind it to reference the product spec for product personality and target users
- Remind it to reference the UI spec for what pages and elements need copy

**Copywriter** (English locale strings):

- Tell it to write the English locale file (e.g., `src/locales/en-US.json`)
- Remind it to follow `docs/copy-guide.md` for voice, tone, and terminology
- Mention the project's i18n format for interpolation placeholders (e.g., `{{name}}` vs `{name}`)
- If updating existing strings: specify which pages/features have new or changed copy

**Translator** (new locale or update):

- The target language code (e.g., `pt-BR`, `es-ES`, `fr-FR`)
- Path to the English locale file (source)
- Whether this is a full translation (new language) or partial update (new/changed strings only)
- If partial update: list of new or changed English keys to translate
- Any cultural preferences or formality overrides for the target language

**Revenue Strategist** (new or update):

- Confirm `docs/legal-context.md` exists with company fiscal identity
- Mention the target markets (which countries the product serves)
- Reference the PM's pricing model from the product spec
- If updating: specify what changed (new market, new payment method, pricing change, etc.)
- Remind to research current provider offerings via web search before recommending

**Legal Writer** (new document):

- Which document to produce (TOS, Privacy Policy, Cookie Policy, etc.)
- Confirm `docs/legal-context.md` exists and is up to date
- Mention any specific regulatory concerns or clauses the user has requested
- If updating an existing document: specify what changed (new feature, new third-party service, etc.)

**Legal Writer** (translation for Translator):

- After the Legal Writer produces documents, launch the Translator to produce courtesy translations
- Remind the Translator to include a clause: "This is a translation for convenience. The [original language] version prevails in case of conflict."

**Marketing Manager** (launch plan):

- Mention the product/feature being launched and the target audience
- Specify which platforms to target (Twitter/X, HN, Reddit, LinkedIn, Product Hunt, etc.)
- Mention any timing constraints (e.g., "launch next Tuesday")
- Remind to read the product spec and copy guide for voice/terminology

**Marketing Manager** (individual content):

- Specify the platform and content type (tweet, thread, Show HN, blog post, changelog, etc.)
- Provide context on what's new or noteworthy (feature, release, milestone)
- Mention any specific angle or hook the user wants to emphasize
- Remind: write in the user's voice (first person), not the product's voice

**DevOps** (deployment setup / CI/CD):
- The target platform and what needs to be configured
- Any existing infra config files and their locations
- For failures: the error message or build log output

**DevOps** (debugging a deploy failure):
- The exact error from the build/deploy logs
- What changed since the last successful deploy
- Remind: read logs and platform docs before changing config — one change at a time

**Tech Lead / Architect / Product Manager**:
- The specific issue or question that triggered the escalation
- Relevant context from the agent that escalated

**Tech Lead** (producing an implementation plan):
- Every must-have behaviour must appear in the acceptance criteria list — not only in the Notes section. Notes are advisory; ACs must be exhaustive and checkable.
- If the phase includes a live validation or integration test task, add a reserved "Post-Validation Findings" task at the end of the plan — a placeholder for bugs and unplanned features discovered during validation. This gives ad-hoc discoveries a defined home in the pipeline rather than being fully untracked.
- For complex phases: tell the TL "produce the plan but do NOT create GitHub Issues yet — a plan review will happen first"
- For simple phases: remind to create GitHub Issues after saving the plan using `gh issue create`. Create a milestone first if it doesn't exist. Append the issue mapping to the plan file.

**Tech Lead** (creating issues after plan review):
- Tell it to read the final plan and create GitHub Issues for all tasks
- Remind: create milestone first, then issues in dependency order, then append issue mapping to the plan

**Plan Review** (architect reviewing a plan):
- Send the plan file path — the architect must read the actual file
- Ask: "Review this implementation plan for structural feasibility. Flag: tasks that conflict with the architecture, technical impossibilities, missing infrastructure tasks, incorrect dependency ordering."
- Brief output only — a numbered list of concerns, not a rewrite

**Plan Review** (engineer reviewing a plan):
- Send the plan file path — the engineer must read the actual file
- Ask: "Review this implementation plan for implementation clarity. Flag: tasks that are too vague to implement, tasks that overlap (touch the same files/modules), incorrect dependencies, missing edge cases."
- Brief output only — a numbered list of concerns, not a rewrite

**Plan Review** (UI/UX designer reviewing a plan — UI phases only):
- Send the plan file path — the designer must read the actual file
- Ask: "Review this implementation plan for design coherence. Flag: incorrect sequencing of design tasks, parallel tasks that will conflict visually, missing design system or UI spec updates."
- Brief output only — a numbered list of concerns, not a rewrite

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
> "Task 7 requires a decision on X. Reply **yes** to proceed with option A or **no** to defer."

If `wait_for_reply` returns `null` (timeout), add a comment on the relevant GitHub Issue noting the pending decision and stop. Do not proceed with a decision that requires user input.

---

## Post-Task Report Format

When the user asks for a post-task report, produce it in this format:

```
Task {N} — Post-Task Report

Agent Calls

| Agent | Purpose | Tokens | Time |
|---|---|---|---|
| Engineer | Implement Task {N} | {tokens} | {time} |
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

This report is produced **on request only** — not automatically after every task. When produced, save it to `.reports/task-{N}-report.md` **in the main working tree** (not the worktree). Reports are gitignored and not committed — writing them to a worktree means they are lost when the worktree is removed.
