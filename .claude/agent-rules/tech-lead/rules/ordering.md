# Planning Rules — Task Ordering

**Read on-demand when the task involves sequencing work items — deciding what to build first, how to lay tasks out so the project stays runnable, or whether a plan front-loads risk correctly.**

Decomposition produces the *set* of tasks; ordering produces the *sequence*. A correct set in a bad order still fails: it strands the team in a non-working state, hides integration bugs until the end, and starves later tasks of feedback. Every rule below is decidable — a plan either satisfies it or it does not.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## The working-state invariant

### Rule: After every task, the project is in a runnable, demonstrable state

**Applies to:** Every task boundary in the plan. The invariant holds at the *end* of each task, not only at the end of the phase.
**Why:** "Build all the pieces, assemble at the end" defers every integration bug to the worst possible moment — when there is no time to fix it and no way to localize it. A plan where the system runs after task N, and again after task N+1, surfaces breakage one task at a time and keeps the team able to demo, test, and ship at any point. If completing a task leaves the build broken or the app un-startable, the task boundary is drawn in the wrong place.

### Rule: No task depends on a future task to be verifiable

**Applies to:** Every task's acceptance criteria.
**Why:** A task is "done" only when its acceptance criteria pass *now*, against the system as it stands after that task. If verifying task N requires task N+3 to exist ("the button works once the backend is built"), task N is not really complete and cannot gate progress. Re-scope so each task's criteria are checkable the moment it lands — even if the check is partial (a stubbed dependency, a seeded fixture).

### Rule: Each task is self-sufficient given only the tasks before it

**Applies to:** Every task in sequence order.
**Why:** Run the test: "If an engineer picks up task N, does everything they need exist in tasks 1…N−1?" If task N needs a data model, an API, or a utility that is scheduled later, the order is wrong — the engineer will either block or build a throwaway stub. Reorder so every prerequisite lands first. This is the ordering consequence of the dependency graph: sequence must be a valid topological order of the DAG.

---

## Vertical slices over horizontal layers

### Rule: Sequence vertical slices, not horizontal layers

**Applies to:** The overall shape of the plan, especially for feature work that spans UI, logic, and storage.
**Why:** A horizontal plan builds all of one layer before the next — all data models, then all services, then all endpoints, then all UI. Nothing works end-to-end until the last layer lands, so integration risk and user feedback are both deferred to the end. A vertical slice cuts one thin feature through every layer at once: it ships a working, demonstrable capability and exercises the whole stack early. Order the plan as a series of vertical slices, each one a complete (if narrow) path from input to output.

### Rule: Build the walking skeleton first

**Numeric baseline:** One end-to-end slice before any feature depth — as few tasks as possible, the minimum to validate the end-to-end path.
**Applies to:** New projects, new services, or any phase introducing a new integration boundary.
**Why:** A walking skeleton is the thinnest possible slice that builds, deploys, and runs end-to-end through every major component — UI to logic to storage to deploy — even if it only does the equivalent of "hello world." Standing it up first proves the architecture connects, establishes the build/test/deploy loop, and turns every later task into an *increment on a working system* rather than a *bet on an unproven one*. It de-risks the integration assumptions while there is still time to act on what it reveals.

### Rule: Each slice delivers one thin, complete capability — not a dead layer

**Applies to:** Every feature task after the skeleton.
**Why:** A "dead layer" — a service with no caller, a schema with no reader, a component with no data — cannot be demonstrated or meaningfully tested, so it cannot honestly be called done. Prefer a task that does one narrow thing through the whole stack (one entity, one path, one rule) over a task that fully builds one layer. Depth comes from *adding slices*, not from *completing layers*.

---

## Foundational-first

### Rule: Foundational infrastructure precedes the features that rest on it

**Applies to:** Project scaffold, build pipeline, core data models, shared abstractions, auth primitives.
**Why:** Features built before their foundation force throwaway stubs and rework. Sequence the enablers a feature genuinely requires *just* ahead of that feature. The discipline cuts both ways: do not build foundation a phase does not yet need — speculative infrastructure is dead weight that the working-state invariant cannot even verify. Foundational-first means *just-in-time foundation*, not *all foundation up front*.

### Rule: Stand up the test and feedback loop before feature work begins

**Applies to:** Test harness, CI pipeline, local dev setup, seed/fixture data.
**Why:** Every feature task's acceptance criteria need a way to be checked. If the test harness arrives at task 20, tasks 1–19 are unverified-by-construction and accumulate silent regressions. Putting the feedback loop in early — right after the walking skeleton — means every subsequent task lands against a system that can immediately tell the engineer whether it broke something.

### Rule: Place risk-reducing and unblocking tasks early

**Applies to:** Spikes, tasks that resolve a key unknown, and tasks that unblock the most downstream work.
**Why:** Two forces pull a task forward in the sequence. **Risk:** an unproven assumption (a third-party API behaves as documented, a performance target is reachable) should be tested while there is still schedule to react — discovering it late is the most expensive failure mode. **Fan-out:** a task that many others depend on should land early so it does not become a bottleneck that idles the rest of the plan. When both apply to the same task, it is the single most important thing to schedule first.

---

## Sequencing for flow

### Rule: Group related tasks to minimize context-switching

**Applies to:** Tasks touching the same module, domain, or mental model, where ordering does not otherwise force them apart.
**Why:** Switching domains carries a real cognitive reload cost — re-learning a module's structure, conventions, and edge cases. When the dependency graph leaves ordering free, cluster tasks that share context so an engineer stays in one area across several tasks. Dependencies always win over grouping: never delay a prerequisite to keep a cluster intact.

### Rule: Order by value within each dependency tier

**Applies to:** Sets of tasks that are mutually independent and could run in any order.
**Why:** When the DAG permits several valid sequences, the tie-breaker is user and business value: schedule the higher-value slice first. This keeps the most important capability shippable earliest, so if the phase is cut short the project still has its best possible subset working.

### Rule: Sequence the happy path before error paths and edge cases

**Applies to:** Any feature decomposed (per SPIDR Rules-split) into a core task plus edge-case tasks.
**Why:** The happy path is the spine of a feature — it must exist for error handling to have something to wrap. Building it first yields a demonstrable capability immediately; the error-path and edge-case tasks then harden a system that already works, each leaving it in a still-better working state. Reversing this builds error handling for code that does not exist yet.

---

## Sources

- [Alistair Cockburn — Walking Skeleton](https://wiki.c2.com/?WalkingSkeleton)
- [Steve Freeman & Nat Pryce — Growing Object-Oriented Software, Guided by Tests (walking skeleton)](http://www.growing-object-oriented-software.com/)
- [Andrew Hunt & David Thomas — The Pragmatic Programmer (Tracer Bullets)](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
- [Code Climate — Kickstart Your Next Project with a Walking Skeleton](https://codeclimate.com/blog/kickstart-your-next-project-with-a-walking-skeleton)
- [Henrico Dolfing — Start Your Project With a Walking Skeleton](https://www.henricodolfing.com/2018/04/start-your-project-with-walking-skeleton.html)
- [Mike Cohn / Mountain Goat Software — The Forgotten Layer of the Test Automation Pyramid / vertical slicing guidance](https://www.mountaingoatsoftware.com/blog)
- [Martin Fowler — IncrementalDelivery / EvolutionaryDesign](https://martinfowler.com/bliki/EvolutionaryDesign.html)
