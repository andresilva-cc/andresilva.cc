# Planning Rules — Issue Tracker

**Read on-demand when the task involves turning an implementation plan into GitHub Issues — creating issues, milestones, and labels, ordering issue creation, or wiring up cross-references and dependencies.**

The implementation-plan markdown is the *design artifact*; GitHub Issues is the *execution source of truth* the orchestrator works from. This file defines how the plan crosses cleanly into the tracker. Every rule is decidable — the tracker either follows it or it does not.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## One issue per task

### Rule: Each plan task becomes exactly one GitHub Issue — no merging, no splitting

**Applies to:** The mapping from the implementation plan to the tracker.
**Why:** The plan's tasks were already decomposed to the smallest meaningful unit and INVEST-screened. Merging two into one issue rebuilds an oversized item; splitting one into two creates issues with no plan entry behind them. One-to-one keeps the plan and the tracker in lockstep, so the Issue Mapping section stays a complete, trustworthy index.

### Rule: The issue title is action-oriented and self-contained

**Numeric baseline:** Aim for a title under ~70 characters.
**Applies to:** Every issue title.
**Why:** Titles are read in dense list views, in notifications, and in commit messages. A title like `[Phase 2] Task 4: Add password-reset email flow` says what the work is without opening the issue; `Task 4` or `backend stuff` forces a click and conveys nothing in a list. Lead with a verb, name the deliverable, keep it scannable.

### Rule: The issue body carries the full task contract — description, ACs, complexity, dependencies

**Applies to:** Every issue body.
**Why:** The engineer works from the issue, not the plan markdown. If the body omits the acceptance criteria, the contract is incomplete and "done" is undefined. Each body must contain: the task description, the complete AC list as a markdown checklist (`- [ ]`), the complexity size, and the dependency line. The body is self-sufficient — an engineer reading only the issue has everything needed to start and to know when they are finished.

### Rule: Acceptance criteria render as a markdown task-list checklist

**Applies to:** The ACs inside every issue body.
**Why:** GitHub renders `- [ ]` items as interactive checkboxes and shows a progress count on the issue. This makes partial completion visible at a glance and gives the reviewer and orchestrator a literal checklist to verify against. Plain bullet ACs lose that affordance.

---

## Milestones and labels

### Rule: Group a phase's issues under one milestone, named for the phase

**Numeric baseline:** One milestone per development phase.
**Applies to:** Every issue created from a phase plan.
**Why:** The milestone is the orchestrator's backlog view — `gh issue list --milestone "Phase N" --state open` is the live task list. Without a milestone, the phase's issues are not a coherent set and progress cannot be tracked as a group. Name it consistently (`Phase {N}: {Phase Title}`) so the filter is predictable.

### Rule: Check for an existing milestone before creating one

**Applies to:** The milestone-creation step.
**Why:** Re-running the planning step, or planning a phase someone already started, must not produce a duplicate milestone — duplicates split the backlog and break the orchestrator's filter. Query `gh api repos/:owner/:repo/milestones` first; create only if the phase's milestone is absent.

### Rule: Label every issue along three orthogonal axes — phase, agent, priority

**Applies to:** The label set on each created issue.
**Why:** Three axes are the load-bearing structure for the orchestrator's filters: *which phase* (so the label survives if milestones get reorganized), *which agent picks it up* (so routing is automatic), and *what priority within the phase* (so sequencing is filterable). A consistent labeling scheme along these axes makes the backlog filterable; ad-hoc or missing labels make it noise. The specific label prefixes are one valid convention — if your project adopts this convention, the labels are `phase:{N}`, `agent:{role}` (e.g. `agent:engineer` for implementation), and `priority:{level}` (e.g. `critical` / `high` / `normal`). Projects may use other schemes (different prefixes, different priority vocabularies); what matters is that the three axes are present and consistent.

### Rule: Create labels idempotently before creating issues

**Applies to:** The label-setup step.
**Why:** Assigning a label that does not exist fails the issue creation. Create the full label set up front with `gh label create --force` (which no-ops harmlessly if the label already exists) so every subsequent `gh issue create` succeeds. Setup is cheap; a half-labelled backlog is not.

---

## Dependency-ordered creation

### Rule: Create issues in topological order — prerequisites first

**Applies to:** The sequence of `gh issue create` calls.
**Why:** GitHub assigns issue numbers in creation order. Creating in dependency order means a prerequisite always has a *lower* number than the task that needs it, so a dependent issue can reference its prerequisite by a number that already exists. Creating out of order forces a second editing pass to backfill references — or leaves them dangling.

### Rule: State each issue's dependencies by issue number, not by task name

**Applies to:** The dependency line in every issue body.
**Why:** Once issues exist, their numbers are the stable identifiers — `Depends on #41` is a live, clickable, trackable link; `Depends on Task 3` forces the reader back to the plan to resolve it. Convert plan task numbers to issue numbers as you create each issue. Where the repo supports native issue dependencies ("blocked by" / "blocking"), set those too — they make the relationship machine-readable, not just prose. Use `None` explicitly when a task has no prerequisites; an absent dependency line is ambiguous.

### Rule: Write the Issue Mapping section back into the plan after creation

**Applies to:** The implementation-plan markdown, after all issues are created.
**Why:** The plan and the tracker must stay cross-referenced in both directions: the plan should map every task number to its issue number, and every issue body references the plan. Without the mapping, the design rationale in the plan and the execution state in the tracker drift into two disconnected documents. Append the mapping as the final step of issue creation, not as an afterthought.

### Rule: Report the created milestone, label set, and issue count when finishing

**Applies to:** The hand-off back to the user/orchestrator.
**Why:** The orchestrator needs to know the backlog exists and how to query it. A closing summary — milestone name, issue count, issue-number range, plan file path — lets it pick up `gh issue list --milestone "..."` immediately, with no guessing. Silent completion forces a discovery step.

---

## Sources

- [GitHub Docs — About issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues)
- [GitHub Docs — About milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)
- [GitHub Docs — Managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [GitHub Docs — Best practices for Projects (issue dependencies, blocking)](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects)
- [GitHub CLI — `gh issue` manual](https://cli.github.com/manual/gh_issue)
- [GitHub CLI — `gh label` manual](https://cli.github.com/manual/gh_label)
