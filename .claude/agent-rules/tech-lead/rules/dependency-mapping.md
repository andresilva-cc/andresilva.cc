# Planning Rules — Dependency Mapping

**Read on-demand when the task involves working out which work items depend on which — building the dependency graph, finding a valid order, detecting circular dependencies, or hunting for hidden dependencies a plan missed.**

This file is a methods catalog: the procedures the tech-lead runs to turn an unordered set of tasks into a directed acyclic graph (DAG) and a safe execution order. The graph is the backbone of the plan — ordering, the critical path, and the GitHub-issue sequence all derive from it.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Building the graph

### Technique: DAG construction — one directed edge per real dependency

**What it is:** Modeling tasks as nodes and "must be done before" relationships as directed edges, producing a graph with no cycles.
**When to apply:** After decomposition, before ordering. Every plan needs this graph; the textual dependency diagram in the implementation plan is its serialization.
**How:**
1. For each task, ask only: "What must already exist for this task to be *startable and verifiable*?" Draw an edge from each prerequisite to this task. Direction is prerequisite → dependent.
2. Record only **direct** dependencies. If C needs B and B needs A, draw A→B and B→C — do not also draw A→C. The transitive link is implied; drawing it clutters the graph and hides the real structure.
3. Distinguish a **hard** dependency (B literally cannot be built or checked without A) from a **soft** preference (B is just nicer to do after A). Only hard dependencies become edges; soft preferences are ordering tie-breakers, handled in `ordering.md`.
4. The result must be acyclic — see cycle detection below. If you cannot draw it without a loop, the task boundaries are wrong.

### Technique: Topological sort — deriving a safe execution order

**What it is:** Linearizing the DAG into a sequence where every task appears after all its prerequisites.
**When to apply:** Once the graph is built and cycle-free, to produce the task numbering and the issue-creation order.
**How:**
1. Repeatedly take any task with no remaining unsatisfied prerequisites, append it to the order, and remove it from the graph along with its outgoing edges.
2. When several tasks are simultaneously eligible, the graph does not constrain their relative order — break the tie with the value and grouping rules in `ordering.md`.
3. If at some point tasks remain but none is eligible, the graph has a cycle — stop and resolve it. A successful topological sort is itself the proof that the graph is acyclic.
4. The resulting sequence is the plan's task order and the order in which GitHub Issues are created, so earlier tasks get lower issue numbers and later tasks can reference them.

### Technique: Critical-path identification

**What it is:** Finding the longest chain of dependent tasks through the DAG — the sequence that sets the phase's minimum duration.
**When to apply:** After the graph is built, to know which tasks carry no slack and where parallelism is possible.
**How:**
1. The critical path is the longest chain of dependent tasks — the longest root-to-leaf path through the DAG by number of tasks. Its length is the floor on phase duration: no ordering makes the phase shorter than its critical path.
2. Tasks *off* the critical path have slack — they can run in parallel or slip somewhat without moving the end date. Tasks *on* it have none; a slip there slips the whole phase.
3. Complexity weighting (treating each node's S/M/L size as a rough weight) is an optional refinement when one chain is clearly heavier than another by node count alone — but it is not a precise procedure; do not convert S/M/L into hour totals (that fakes precision the estimates cannot support, per `estimation.md`).
4. Use this to place attention: critical-path tasks deserve the most scrutiny in estimation and the earliest, most reliable engineers. Flag the critical path explicitly in the plan.

---

## Detecting and resolving cycles

### Technique: Circular-dependency detection

**What it is:** Finding any loop where a task depends — directly or transitively — on itself, which makes a valid order impossible.
**When to apply:** Every time the graph is built or edited. A cycle is a hard defect, not a style issue.
**How:**
- **Primary check:** run the topological sort. If it stalls with tasks remaining but none eligible, those remaining tasks contain at least one cycle.
- **Tracing the loop:** from any stalled task, follow prerequisite edges; you will return to a task already visited — that revisit closes the cycle and names every task in it.
- **Common disguised forms:** A needs a field B adds *and* B needs an interface A exposes; two modules each importing the other; a "shared" task that both depends on and is depended on by the tasks it serves.
- A plan with even one cycle cannot be executed in order — it must be resolved before the plan ships.

### Technique: Cycle resolution by re-decomposition

**What it is:** Breaking a cycle by redrawing task boundaries — never by deleting an edge that is genuinely there.
**When to apply:** Whenever detection finds a cycle.
**How — choose the fitting move:**
1. **Split the bidirectional task.** A↔B usually means one task bundles two separable pieces. Split A into A1 (what B needs) and A2 (what needs B); the cycle A1→B→A2 is now linear.
2. **Extract the shared core.** If A and B both depend on each other through common ground (a shared type, a base interface), pull that ground into a new task C; both A and B then depend on C and the loop is gone.
3. **Introduce a seam.** If two modules are mutually dependent by design, add a task for the abstraction that decouples them (an interface, an event, an injection point) — that task lands first and breaks the runtime loop.
4. **Re-sequence around a soft edge.** If one "dependency" in the loop was only a preference, not a hard requirement, it should never have been an edge — drop it and record it as an ordering tie-breaker instead.
Never resolve a cycle by ignoring a real dependency: that just relocates the breakage from the plan to the build.

---

## Finding what the plan missed

### Technique: Hidden-dependency hunt

**What it is:** A deliberate sweep for dependencies that are real but were not obvious from the task descriptions — the most common cause of a plan stalling mid-execution.
**When to apply:** After the first-draft graph, before finalizing. Assume hidden dependencies exist; the question is where.
**How — probe each category:**
- **Data/schema:** does this task read or write a model, column, or migration another task creates? The reader depends on the creator.
- **Shared code:** does it call a utility, type, component, or config another task introduces? Edge from the introducer.
- **Environment/infra:** does it need an env var, secret, service, queue, bucket, or CI step that a setup task provisions? Edge from that task.
- **Auth/identity:** feature tasks usually depend on the auth task even when no one wrote it down — anything behind a login does.
- **Contract:** does it consume an API shape, event format, or interface another task defines? Producer-before-consumer.
- **Test infrastructure:** does verifying it need a fixture, seed, mock, or harness another task builds? The test loop is a dependency too.
- **Knowledge:** is it un-startable until a spike resolves an open question? The spike is a prerequisite.

### Technique: The reverse-reachability check

**What it is:** Verifying, per task, that everything it needs is genuinely upstream of it in the graph — catching the dependency that exists in reality but not on paper.
**When to apply:** As a final validation pass over the finished graph and order.
**How:** For each task N in execution order, ask: "Standing where the project is right after task N−1, can an engineer start and *finish* task N — including verifying its acceptance criteria — with nothing from a later task?" If the honest answer is no, a dependency edge is missing; add it and re-sort. This is the same self-sufficiency test from `ordering.md`, applied as graph validation: the order is only correct once every task passes it.

### Technique: Fan-in / fan-out review

**What it is:** Inspecting the nodes with unusually many edges, because they are where plans most often break.
**When to apply:** After the graph is stable, as a risk scan.
**How:**
- **High fan-out** (many tasks depend on this one): a bottleneck. It must be scheduled early, estimated carefully, and watched — if it slips, everything downstream idles. If one task fans out to most of the plan, consider whether it can be split so parts of it unblock work sooner.
- **High fan-in** (this task depends on many others): a late integration point that cannot start until a broad front completes. It carries concentrated risk; make sure its prerequisites are themselves well-sequenced, and verify it is not secretly two tasks.
- **Isolated nodes** (no edges at all): legitimately parallelizable — good — but double-check the isolation is real and not a missed hidden dependency.

---

## Sources

- [Wikipedia — Directed Acyclic Graph (scheduling, critical path)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
- [Wikipedia — Topological Sorting](https://en.wikipedia.org/wiki/Topological_sorting)
- [NetworkX — DAGs & Topological Sort](https://networkx.org/nx-guides/content/algorithms/dag/index.html)
- [University of Manchester — Critical Path Analysis (lecture notes)](https://personalpages.manchester.ac.uk/staff/mark.muldoon/Teaching/DiscreteMaths/LectureNotes/CriticalPathAnalysis.pdf)
- [PMI — Practice Standard for Work Breakdown Structures](https://www.pmi.org/learning/library/practice-standard-work-breakdown-structures-8063)
- [Wikipedia — Circular Dependency](https://en.wikipedia.org/wiki/Circular_dependency)
