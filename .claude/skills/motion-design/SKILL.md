---
name: motion-design
description: Opinionated rules for web motion and animation — easing curves, library selection, duration tokens, anti-pattern banlist, exemplar matching, accessibility, and verification loop.
---

Opinionated rules for web motion and animation. Apply these whenever writing or reviewing any CSS transition, keyframe, JS animation, or 3D scene. Full research and exemplar corpus: `indie-brain/research/motion-design-foundations.md`.

---

## Rule 1 — Reach for browser-native first

Before touching any library:

| Need | Native solution |
|---|---|
| Page / shared-element transitions | `document.startViewTransition()` (View Transitions API) |
| Layout-change animations (list reorder, panel resize) | View Transitions → fall back to GSAP Flip or hand-rolled FLIP |
| Simple scroll parallax / fade-in-on-enter | CSS `animation-timeline: scroll()` / `view()` |
| Simple loops and accents | CSS `@keyframes` |

Only escalate to a library when native primitives can't express the intent.

---

## Rule 2 — Library defaults when escalating

| Situation | Library |
|---|---|
| 3D line-based / pseudo-3D / hand-drawn feel | Zdog (charm) → React Three Fiber + Drei (real depth) |
| React component micro-interactions | Motion (motion.dev) |
| Complex multi-property sequencing / scroll storytelling | GSAP + ScrollTrigger + Lenis |
| Physics-feeling motion (springs, bounces, weight) | Motion `spring()` or react-spring |
| State-driven mascot / vector animation | Rive |
| Kinetic typography | GSAP + SplitText |
| Simple icon loops | Lottie (playback only) |

**Never reach for a library when CSS keyframes will do.**

---

## Rule 3 — Easing curve defaults

Banned for spatial transforms: `ease-in-out`, `linear`, `ease`.

| Context | Use |
|---|---|
| General product motion | `cubic-bezier(0.2, 0, 0, 1)` — M3 emphasized |
| Entry (element arriving) | `cubic-bezier(0.05, 0.7, 0.1, 1)` — M3 emphasized-decelerate |
| Exit (element leaving) | `cubic-bezier(0.3, 0, 0.8, 0.15)` — M3 emphasized-accelerate |
| Confident SaaS entry | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Opacity / color blends | `linear` only — the one valid use |

---

## Rule 4 — Duration defaults

| Scale | Range | Use |
|---|---|---|
| Micro | 100–200ms | Button states, hover, small icon transforms |
| Standard | 200–400ms | Modals, drawers, tab changes — the default range |
| Hero | 400–700ms | Emphasized / brand-defining motion |
| Cinematic | 700ms+ | Scrollytelling only — slow must be intentional |

---

## Rule 5 — Anti-pattern banlist

Never write any of the following:

1. `transition: all 0.3s` — always explicit per-property
2. `ease-in-out` or `linear` for spatial transforms
3. Simultaneous entry of all list/grid items — always stagger (50–100ms cascade)
4. `scale(1.05)` hover with no easing nuance — add overshoot or register-matched curve
5. Scroll-jacking via custom `wheel` handlers — use Lenis or CSS scroll-driven
6. Motion with no functional purpose — if it doesn't communicate state, remove it
7. Entry animations that delay LCP — content visible first, motion enhances
8. Non-compositor properties in animations (`width`, `height`, `top`, `left`) — animate `transform` and `opacity` only
9. Missing `prefers-reduced-motion` — mandatory on every motion deliverable
10. 24/7 `will-change` — apply just before animation, remove after

---

## Rule 6 — Match an exemplar before writing

Before writing motion, identify which aesthetic register applies:

- **Product / SaaS**: Linear, Vercel, Stripe, Arc, Raycast
- **Scroll storytelling**: The Pudding, NRK Shorthand, GSAP showcase
- **3D / geometric**: Bruno Simon, Lusion, Active Theory, Codrops Playground
- **Kinetic type**: NYT Interactive, Awwwards type nominees
- **Magnetic / cursor**: Obys Agency, motion.dev examples
- **Brutalist / mechanical**: Even Odd, Bürocratik
- **Glass / viscous**: Apple iOS-style, Linear's slower transitions

If no aesthetic is specified, ask which exemplar the output should match before writing.

---

## Rule 7 — Verification loop (every motion task)

1. Write the motion.
2. Record a 2–3s Playwright video: `recordVideo: { dir: './videos' }`.
3. Extract frame strip: `ffmpeg -i video.webm -vf "fps=4" frame_%03d.png`.
4. Review frame strip with multimodal vision: does easing feel match intent?
5. Assert numerically: `anim.effect.getTiming().easing` matches expected — easing feel doesn't transmit through frames alone.
6. Verify `prefers-reduced-motion` variant: `await context.emulateMedia({ reducedMotion: 'reduce' })`.

---

## Rule 8 — Mandatory accessibility

Every motion deliverable ships with:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Also: `prefers-reduced-data` for heavy / 3D motion (bandwidth consideration).

---

## Rule 9 — Interruption by default

Motion responds to new target states immediately. Model UI as having **target states**, not playing animations. When target state changes mid-flight:

- **Motion (motion.dev)**: blends to new target automatically
- **GSAP**: `overwrite: 'auto'` on tweens
- **Web Animations API**: `.cancel()` + re-apply

No animation should block user input or queue unconditionally. If a user clicks during an entrance, the motion responds immediately.

---

## iOS Safari checklist

Before shipping any motion: test on a real iPhone.

- Use `100dvh` not `100vh` (URL bar shifts cause layout jumps)
- Handle `webglcontextlost` / `webglcontextrestored` in Three.js / R3F scenes
- Test the `prefers-reduced-motion` variant with iOS Accessibility > Reduce Motion enabled
- Add `-webkit-tap-highlight-color: transparent` on tap-triggered animations

---

## Full reference

`indie-brain/research/motion-design-foundations.md` — vocabulary, full library tier list, exemplar corpus, anti-pattern deep-dives, testability tooling.
