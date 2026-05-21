# UI Design Rules — Motion

**Read on-demand when the task involves animations, transitions, easing curves, motion tokens, gesture interactions, or loading states.**

This domain governs perceptual timing (how fast / slow a change should be), easing (the shape of the change), physics (how objects behave), and orchestration (how multiple moving things combine).

---

## Perceptual timing

### Rule: Under ~100ms feels instantaneous
**Numeric baseline:** ≤100ms for micro-interactions (button press, hover, toggle).
**Applies to:** Button press feedback, hover states, simple toggles, keyboard-driven UI.
**Why:** Below the perceptual threshold at which cause and effect appear simultaneous — no special feedback needed.

### Rule: Keep UI animations ≤300ms (within-screen); ≤500ms (route-level); never >700ms
**Numeric baseline:** 100–150ms micro; 150–250ms standard UI (tooltips, dropdowns); 200–300ms modals/drawers; up to ~500ms for full-screen route transitions.
**Applies to:** All in-app animations.
**Why:** Past ~400ms, perceived wait cost exceeds the transition's benefit; the animation reads as an obstacle. 500ms is the "real drag" threshold.

### Rule: Exit animations run ≈20% faster than entrance
**Numeric baseline:** Material mobile: 225ms enter / 195ms leave. Or: modal enter 300ms / exit 200–250ms.
**Applies to:** Modals, toasts, drawers, popovers — anything with distinct enter/exit.
**Why:** Entering needs orientation time ("where did this come from?"); exiting only needs acknowledgment.

### Rule: Duration scales with distance/size of motion
**Numeric baseline:** Small elements 150–250ms; 2–5 objects 300–400ms; 6–10 objects or full viewport 500–700ms.
**Applies to:** All transitions — especially tablet/desktop scaling, fullscreen modals, off-screen entrances.
**Why:** Constant duration across distance yields inconsistent apparent velocity — small motions look jittery-fast, large ones look impossibly fast.

---

## Physics and shape

### Rule: Scale entrances from 0.95, not from 0
**Numeric baseline:** `scale(0.95)` → `scale(1)`; common anchors 0.90, 0.95.
**Applies to:** Modal entrances, popover/dropdown reveals, card appearance, tooltip entrance.
**Why:** Real objects retain shape — they don't appear from nothing. Scale-from-0 violates object-permanence intuition.

### Rule: Enter uses ease-out; exit uses ease-in; morphs use ease-in-out
**Numeric baseline:** Enter `cubic-bezier(0, 0, 0.2, 1)` (or Material standard `cubic-bezier(0.4, 0, 0.2, 1)` as a compromise); exit `cubic-bezier(0.4, 0, 1, 1)`; hover changes `ease`; constant motion `linear`.
**Applies to:** Enter vs exit transitions of any UI element; morphs/position changes on-screen.
**Why:** Enter needs a fast start (responsiveness) and soft landing; exit needs quick release. Deceleration reads as arrival; acceleration reads as departure.

### Rule: Gestures retain momentum — never snap or recenter
**Applies to:** Drag, swipe-to-dismiss, scroll momentum, drawer drag, carousel gestures.
**Why:** Real objects carry momentum in the direction they were moving. Snapping breaks the physical metaphor and feels artificial.

### Rule: Animations must be interruptible
**Applies to:** All gesture-driven animation, drag, swipe, modal dismiss, navigation transitions.
**Why:** Real objects accept new forces anytime. Non-interruptible UI feels locked rather than responsive. CSS transitions support interruption better than keyframe animations.

### Rule: Active/press feedback uses `scale(0.97)` for tactility
**Numeric baseline:** `transform: scale(0.97)` on `:active`; range 0.95–0.98; `transition: transform 160ms ease-out`.
**Applies to:** Buttons, toggles, cards, any tappable/clickable element on pointer-capable devices.
**Why:** Mimics the physical button press and confirms input before server/logic responds. Buttons that don't depress feel dead.

---

## Performance

### Rule: Animate only `transform` and `opacity`
**Numeric baseline:** 60 fps target = 16.67ms per frame.
**Applies to:** All web/CSS animation.
**Why:** These stay on the compositor thread. Layout/paint-triggering properties (padding, margin, width, height, top, left) cannot hit 60fps reliably.

### Rule: Animate the child, not the parent
**Applies to:** Performance-critical animations; list items; menu items.
**Why:** Parent-property animation cascades re-layouts to all siblings and descendants. Isolating the animation to a descendant with `transform` keeps the work GPU-bound.

### Rule: Use `will-change: transform` on animated elements
**Applies to:** Elements with imminent or frequent animation.
**Why:** Hints to the browser to promote to its own compositor layer, preventing jitter. Don't apply globally — only where needed.

---

## Meaning and restraint

### Rule: Motion must convey meaning — no decorative animation
**Applies to:** All UI motion decisions.
**Why:** Decorative motion adds cognitive load without payoff. Animation should answer "why this movement, why now?" Motion-as-noise degrades perceived product quality.

### Rule: Don't animate high-frequency / keyboard-initiated actions
**Numeric baseline:** 0ms for actions repeated 100+ times per day.
**Applies to:** Command palettes, keyboard-driven UIs (cmd-K), context menus, shortcut-triggered overlays, Raycast/Superhuman/Linear-style tools.
**Why:** Repeated animation accumulates a perceived latency budget. After N exposures, animation becomes cost without information gain — power-user speed is set by the animation, not the underlying work.

### Rule: Respect `prefers-reduced-motion`
**Applies to:** All non-essential animation, parallax, reveal-on-scroll, autoplay video.
**Why:** WCAG 2.3.3. Vestibular disorders cause nausea, migraine, and dizziness from motion triggers. Essential animation (e.g. authoring-tool preview) is exempt but must be declared so.

---

## Orchestration

### Rule: Stagger multi-element reveals (follow-through)
**Numeric baseline:** 30–80ms between same-rank list items; 100–200ms between hierarchy levels.
**Applies to:** Modal open with header + body + actions; list reveals; nav menu opens; hero sections.
**Why:** Simultaneous motion reads as mechanical/scripted; offset timing reads as organic. Stagger also clarifies hierarchy (primary → secondary).

### Rule: Anchor scale/rotate via `transform-origin`
**Numeric baseline:** Popovers: `transform-origin: var(--radix-popover-content-transform-origin)`. Modals: `transform-origin: center`.
**Applies to:** Popovers, tooltips, context menus, modal-from-card transitions, expanded cards, dropdown menus.
**Why:** Users' eyes follow the trigger. Anchoring motion there preserves spatial continuity — the popover "grows from" its button rather than appearing arbitrarily.

---

## System architecture (detect-and-conform)

### Rule: Use a duration scale, not arbitrary numbers
**Numeric baseline:** 4–8 tokens, e.g., Carbon's `fast-01` (70ms), `fast-02` (110ms), `moderate-01` (150ms), `moderate-02` (240ms), `slow-01` (400ms), `slow-02` (700ms).
**Applies to:** Any project > ~1 screen.
**Why:** Without a scale, durations accumulate ad-hoc and lose internal consistency. Detect existing tokens before writing new durations.

### Rule: Use a named curve set, not arbitrary cubic-beziers
**Numeric baseline:** 3–6 named curves (standard, deceleration / enter, acceleration / exit, sharp).
**Applies to:** Design-system-level decisions.
**Why:** Scattered one-off cubic-beziers erode a product's motion voice. A named set imposes intention and makes curves comparable across the app.

### Rule: Pick spring physics OR curve-based easing as the system default — don't mix
**Applies to:** Whole-product motion personality.
**Why:** Mixing reads as inconsistent physics. Springs imply living/tactile; curves imply designed/choreographed. Pick one voice and conform. Detect: is the codebase using `transition: { type: "spring" }` or explicit durations + cubic-bezier?

### Rule: Loading state choice follows expected duration
**Numeric baseline:** <1s no indicator; 1–2s subtle indicator; 2–10s spinner; 10s+ determinate progress with percentage.
**Applies to:** All async UI.
**Why:** A spinner for a 30s task is anxiety-inducing; a progress bar for a 500ms task is overkill.

### Rule: Don't flash loading states — wait ~400ms before showing, then hold ≥300–500ms
**Numeric baseline:** Show-threshold ~400ms; minimum visible time 300–500ms if shown.
**Applies to:** All loading indicators.
**Why:** Showing a spinner for an 80ms action reads as a glitch. Showing one for a 200ms action makes fast things feel slow.

---

## Sources

- [W3C — WCAG 2.2 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Emil Kowalski — Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)
- [Emil Kowalski — Great Animations](https://emilkowal.ski/ui/great-animations)
- [Rauno Freiberg — Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)
- [Jakob Nielsen — Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- [NN/g — Animation Duration](https://www.nngroup.com/articles/animation-duration/)
- [NN/g — Progress Indicators](https://www.nngroup.com/articles/progress-indicators/)
- [NN/g — Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/)
- [NN/g — The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/)
- [Material Design 2 — Speed](https://m2.material.io/design/motion/speed.html)
- [Material Design 3 — Motion tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Motion (Framer Motion) — Spring docs](https://motion.dev/docs/spring)
- [Disney 12 Principles of Animation](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- [Radix UI — Popover](https://www.radix-ui.com/primitives/docs/components/popover)
