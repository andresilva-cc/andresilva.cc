# Planning Rules — Task Decomposition

**Read on-demand when the task involves breaking a phase, spec, or feature into individual work items — sizing tasks, deciding what counts as one unit of work, or judging whether something should be split further.**

This file is a methods catalog: the techniques the tech-lead runs to turn a spec-and-architecture pair into a list of right-sized tasks. Granularity is a judgment call, but it is a *disciplined* one — these methods make the call repeatable.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Defining the unit of work

### Technique: The 100% rule — decomposition must be complete and exclusive

**What it is:** The PMBOK principle that the children of any node sum to exactly 100% of the parent — no work in scope is missing, no work out of scope is added, and children do not overlap.
**When to apply:** Every time you decompose a phase into tasks, and again when you decompose any task that is still too large.
**How:**
1. After listing the tasks for a phase, ask: "If every task on this list is done, is the phase complete?" If no, a task is missing. If a task could be done without contributing to the phase, it is out of scope — cut it.
2. Check for overlap: two tasks must not both claim the same piece of work. Overlap causes double-counting in estimates and merge conflicts in execution.
3. Decompose deliverables, not activities. A task is "user can reset their password," not "write backend code." Activity-oriented tasks ("do the backend") hide the 100% check — you cannot tell if they sum to the whole.
4. Re-run the check at every level: the sub-tasks of a split task must themselves sum to that task.

### Technique: Smallest meaningful unit (SMU)

**What it is:** The smallest slice of work that still delivers verifiable, standalone progress — small enough to finish in one focused session, large enough that completing it is a real, demonstrable step.
**When to apply:** As the target size for every task you write. It is the floor and the ceiling: do not go below it (busywork fragments), do not stay above it (unverifiable chunks).
**How:**
- **Lower bound — meaningful:** the task must end at a checkpoint someone can verify. "Add a column to the users table" is below the SMU if nothing observable changes; fold it into the task that uses the column. A task whose only acceptance criterion is "the code compiles" is too small.
- **Upper bound — fits a Large at most:** the task should be completable by one engineer in up to ~2 days of focused work (the Large ceiling in `estimation.md`). If it would estimate larger than Large, it is above the SMU — split it.
- **The test:** a task is at the SMU when (a) it has its own acceptance criteria that can pass or fail independently, and (b) you cannot split it without producing a piece that is not independently verifiable.
- Default to slightly smaller than feels natural. Small tasks give faster feedback, localize failures, and estimate more accurately than large ones.

### Technique: The INVEST screen

**What it is:** A six-letter checklist — Independent, Negotiable, Valuable, Estimable, Small, Testable — applied to each task after decomposition.
**When to apply:** As a final pass over every task before it becomes a GitHub Issue. A task that fails a letter is re-scoped or split.
**How:** For each task confirm: **I** — it can be completed without waiting mid-flight on another task (ordering dependencies are fine; entanglement is not); **N** — the *what* is fixed but implementation detail stays open; **V** — finishing it delivers a discernible slice of progress; **E** — you can size it S/M/L with confidence; **S** — it fits within roughly a day; **T** — it has concrete, checkable acceptance criteria. Failing **E** or **S** almost always means the task is too big — split it. Failing **I** means two tasks are tangled — redraw the boundary.

---

## When and how to split

### Technique: SPIDR — five axes for splitting a task that is too large

**What it is:** Mike Cohn's catalog of the five splits that resolve almost any oversized work item — **S**pike, **P**aths, **I**nterfaces, **D**ata, **R**ules. When a task exceeds the SMU, one of these five usually cuts it cleanly along a *vertical* line (each piece still ships end-to-end), not a horizontal one (each piece a dead layer).
**When to apply:** Whenever a task estimates Large-or-bigger, has many acceptance criteria, or you cannot describe it in two specific sentences.
**How — try the five in order:**
1. **Spike** — the task is large because it is *unknown*, not because it is *big*. Split off a timeboxed research task that answers the open question; the implementation task that follows is then estimable. Use sparingly — a spike is the split of last resort, not first.
2. **Paths** — the task supports multiple routes through the same outcome (pay by card *or* wallet; import from CSV *or* API). Make each path its own task; ship the simplest path first.
3. **Interfaces** — the task targets multiple surfaces, clients, or input modes (web *and* mobile; keyboard *and* mouse; one browser now, the rest later). Split by surface; deliver the primary surface first.
4. **Data** — the task handles several data types, sources, or formats. Split by data variety: support one entity type or one format first, add the rest as follow-on tasks.
5. **Rules** — the task bundles many business rules, validations, or edge cases. Split off the rules: a first task implements the happy path with the core rule; later tasks add the secondary rules and edge cases each as their own item.

### Technique: Workflow-step split — slice a multi-step flow into its steps

**What it is:** A complement to SPIDR for tasks that are a *sequence* (a checkout flow, an onboarding wizard, an approval chain). Each step of the workflow becomes a task.
**When to apply:** When a task describes a process with distinct stages and the stages can each leave the system in a usable state.
**How:** List the steps in user order. Make each step a task. Order them so the system is runnable after each — a half-built three-step wizard with steps 1–2 working is a valid intermediate state; a wizard where step 2 is built before step 1 is not. If a later step cannot stand without an earlier one, that is a real dependency, not a reason to merge them.

### Technique: Operations split — separate the verbs on one resource

**What it is:** Splitting a CRUD-style task ("manage projects") into its individual operations — create, read, update, delete, list.
**When to apply:** When a task says "manage," "administer," or "CRUD" anything, or bundles several verbs on one resource.
**How:** One task per operation, or per small cluster of operations that share machinery. Sequence them by value: read/list and create usually come before update and delete. Each operation is independently demonstrable, so each clears the SMU bar on its own.

---

## Granularity heuristics

### Technique: The two-sentence test

**What it is:** A fast triage: if you cannot describe a task specifically in one or two sentences, it is either too large or too vague.
**When to apply:** On first draft of every task title and description.
**How:** Write the task as "Implement X so that Y." If the sentence needs an "and," a comma-spliced list, or the word "etc.," the task is carrying multiple units of work — split on the conjunction. If the sentence is generic ("set up the backend"), it is underspecified — replace it with the concrete deliverable.

### Technique: Decomposition stopping check

**What it is:** A short procedure run after each round of splitting to decide whether to recurse or stop.
**When to apply:** After every split, before adding the resulting tasks to the plan.
**How — run these steps in order on each candidate task:**
1. Try to estimate it Small or Medium with confidence. If you cannot — split once more, then restart at step 1 on the pieces.
2. Write its acceptance criteria as a list you could check by hand. If you cannot produce clear, independently verifiable criteria — split once more.
3. Ask whether one engineer can own it start-to-finish. If two roles or two engineers must hand off mid-task — split along that seam.
4. Now attempt one more split *in your head*. If the result would be a piece with no standalone value (a dead layer, a "compiles but does nothing" fragment) — do not perform the split; the task is already at the SMU. Leave it.

The procedure terminates: either at step 4 (the task is at the SMU) or by exiting step 1–3 with a clean Small/Medium estimable, verifiable, single-owner task.

### Technique: Foundational-task carve-out

**What it is:** Recognizing that some genuinely-needed work (project scaffold, schema setup, CI pipeline, shared test harness) delivers no user-facing value but still belongs on the list.
**When to apply:** Early in decomposition, when separating enablers from features.
**How:** Keep foundational tasks as small and as few as possible — they are pure setup cost. Make each one concrete and verifiable ("CI runs the test suite on every PR and reports status"), never a vague "set up the project." Bundle trivial scaffolding into the first feature task when it is small enough to ride along; carve it out only when it is substantial or shared by many later tasks. Foundational tasks are necessary but should never dominate the plan — if more than a third of tasks are pure setup, the architecture is probably over-built for the phase.

---

## Sources

- [PMI — Practice Standard for Work Breakdown Structures](https://www.pmi.org/learning/library/practice-standard-work-breakdown-structures-8063)
- [PMI — The ABC Basics of the WBS (Paul Burek)](https://www.pmi.org/learning/library/work-breakdown-structure-basics-5919)
- [Wikipedia — Work Breakdown Structure (100% rule)](https://en.wikipedia.org/wiki/Work_breakdown_structure)
- [Mike Cohn / Mountain Goat Software — SPIDR: Five Simple but Powerful Ways to Split User Stories](https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories)
- [DPR — Story Splitting (design practice repository)](https://socadk.github.io/design-practice-repository/activities/DPR-StorySplitting.html)
- [Agile Alliance — INVEST glossary entry](https://agilealliance.org/glossary/invest/)
- [Bill Wake — INVEST in Good Stories, and SMART Tasks](https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/)
- [Richard Lawrence — Patterns for Splitting User Stories](https://www.richardlawrence.info/2009/10/28/patterns-for-splitting-user-stories/)
