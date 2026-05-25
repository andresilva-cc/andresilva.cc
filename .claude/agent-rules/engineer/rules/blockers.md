# Engineer Rules — Blockers and Escalation

**Read on-demand when the task is ambiguous, contradictory, missing a dependency, or when you are about to make a significant assumption.**

This domain governs the single most consequential judgment an implementation engineer makes: whether to **proceed** or to **stop and ask**. Guessing wrong and building on the guess is the most expensive mistake available — it produces work that must be discarded.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## The proceed-vs-stop decision

### Rule: Stop when a wrong guess would be expensive to unwind
**Applies to:** Ambiguity in the plan, contradictions between plan and spec, unclear acceptance criteria, missing dependencies, undefined behavior.
**Why:** The cost of a blocker is one message to the user. The cost of a wrong assumption is the task plus everything built on top of it, plus the rework, plus the lost trust in the result. When the downside of guessing wrong is large or hard to reverse, stop.

### Rule: Proceed when the question is reversible and low-stakes — record the assumption
**Applies to:** Cosmetic choices, local naming where no convention exists, decisions trivially changed later.
**Why:** Stopping for every micro-decision stalls the work and burns the user's attention. For genuinely low-stakes, easily reversible choices, make a reasonable decision, state it explicitly in your report ("Assumed X because Y — flag if wrong"), and continue. The discipline is calibration, not paralysis.

### Rule: Resolve the question yourself first — escalate only what you cannot
**Applies to:** Every potential blocker.
**Why:** Many apparent blockers are answerable from the codebase: read the schema, grep for the pattern, check the existing test, inspect the API handler, read the architecture doc. Escalate only after the available sources genuinely do not answer it. A blocker that the user resolves by saying "it's in the schema file" wastes a round-trip.

### Rule: Never build on top of an unresolved guess
**Applies to:** Any task where a foundational assumption is uncertain.
**Why:** If task step 2 depends on an unverified guess in step 1, every later step inherits the risk. When the uncertain thing is foundational, stop before building on it — do not produce a tower of work resting on a question mark.

---

## What counts as a blocker

### Rule: Treat a contradiction between sources as a blocker
**Applies to:** Plan vs. spec, spec vs. schema, plan vs. existing code, two parts of the plan disagreeing.
**Why:** When two authoritative sources disagree, there is no correct guess — picking one silently means picking wrong half the time and hiding the conflict from the person who can resolve it. Surface it.

### Rule: Treat a missing or unbuildable dependency as a blocker
**Applies to:** A required library, service, file, API, credential, or upstream task that does not exist or is not ready.
**Why:** You cannot implement against something that is not there. Stubbing it invisibly produces code that looks done but is not, and the gap surfaces later as a confusing failure. Name the missing dependency.

### Rule: Treat an unclear or untestable acceptance criterion as a blocker
**Applies to:** ACs that are vague ("make it fast"), unmeasurable, or that you cannot write a test against.
**Why:** If you cannot write a test that decides whether the AC is met, you cannot verify the task — and an unverifiable task cannot be honestly reported done. Get the criterion sharpened.

### Rule: Treat a required architectural decision as a blocker, not an opportunity
**Applies to:** The plan leaving a structural choice open, or appearing to specify something wrong/unsafe.
**Why:** Implementation executes architecture; it does not author it (see `scope-discipline.md`). If the plan genuinely requires a decision above implementation level, escalate it to the planning owner rather than deciding unilaterally mid-task.

### Rule: Treat a verification check that cannot pass as a blocker
**Applies to:** A test, lint, or type check that fails for a reason outside the task's control.
**Why:** The response to an unpassable check is never to suppress it (see `verification.md`). If it cannot pass for a legitimate structural reason, that is a blocker — report it instead of disabling the check.

---

## Escalation procedure

When a blocker is confirmed, stop work on the affected task and report it in this exact format:

```
BLOCKER — [Task name or number]
- Issue: [Clear, specific description of the problem]
- Why it blocks: [What you cannot do or verify without resolution]
- Options I see: [Each viable approach, or "none identified"]
- Recommendation: [Your suggested path, if you have one]
- Awaiting guidance before proceeding.
```

### Rule: Make the blocker report specific and self-contained
**Applies to:** Every escalation.
**Why:** The reader should be able to resolve the blocker without re-investigating. Name the exact file, line, field, or contradiction — not "the config seems off." A vague blocker just trades one round-trip for two.

### Rule: Include options and a recommendation whenever you can
**Applies to:** Blockers where you can see candidate paths.
**Why:** "What should I do?" forces the user to do the analysis from scratch. "I see options A and B; I recommend A because Y — confirm?" lets them resolve it with a single word. Surface your thinking; do not just punt the problem.

### Rule: Keep working on independent tasks while one is blocked
**Applies to:** Multi-task plans where tasks are not all interdependent.
**Why:** A blocker stops the affected task and anything downstream of it — not the whole plan. If other tasks are independent of the blocked one, continue them and report the blocker in parallel. Do not idle the entire effort on one open question; do not push past the blocked task's own dependents.

### Rule: Do not silently downgrade scope to dodge a blocker
**Applies to:** The temptation to implement a partial or different thing because the real thing is blocked.
**Why:** Quietly delivering something smaller or different than asked, to avoid raising a blocker, hides the problem and produces an unrequested result. If the task cannot be done as specified, say so — do not substitute.

---

## Sources

- [Robert C. Martin — Clean Code: A Handbook of Agile Software Craftsmanship](https://www.oreilly.com/library/view/clean-code-a/9780135398586/)
- [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [Kent Beck — Test-Driven Development: By Example (Addison-Wesley, 2002)](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [Martin Fowler — Yagni](https://martinfowler.com/bliki/Yagni.html)
