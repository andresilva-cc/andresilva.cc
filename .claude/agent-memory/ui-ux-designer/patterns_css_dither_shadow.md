---
name: CSS dither shadow — card-wrap pattern
description: How to implement a stippled 1-bit checkerboard drop shadow that renders behind card content without using z-index: -1 on the ::after of the card itself
type: feedback
---

When implementing a CSS background-image checkerboard dither shadow on a card element, the naive approach (::after on the card with z-index: -1) causes the dither pattern to render ON TOP of the card content in Chrome, because setting z-index: 1 on the card creates a new stacking context that clips the ::after to paint at the same visual level as the card's own background.

**The correct approach: .card-wrap + .card two-element pattern.**

```css
/* The wrapper carries the dither ::after — its z-index: 0 sits below the card */
.card-wrap {
  position: relative;
  display: block;
  /* Add padding-right/bottom to prevent shadow clipping by parent overflow */
  padding-right: 6px;
  padding-bottom: 6px;
}
.card-wrap::after {
  content: '';
  position: absolute;
  top: 6px;          /* shadow offset */
  left: 6px;         /* shadow offset */
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='2' height='2' fill='%231A1A1A'/><rect x='2' y='2' width='2' height='2' fill='%231A1A1A'/></svg>");
  z-index: 0;         /* behind the card (z-index: 1) */
  pointer-events: none;
}
/* The card surface sits on top of the dither shadow */
.card {
  position: relative;
  z-index: 1;
  background: #F4ECD8;
  border: 2px solid #1A1A1A;
  border-radius: 0;
}
```

**Why:** The ::after is on .card-wrap, which has no z-index set on itself (auto), so it does NOT create a stacking context. The ::after at z-index: 0 and the .card at z-index: 1 are siblings in the same stacking context — .card naturally paints on top.

**Grid context:** When .card-wrap is a grid item, use `display: flex; flex-direction: column` on the wrapper and `flex: 1` on the .card to make cards fill equal height.

**Tile spec for 2×2 checkerboard:**
```
url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='2' height='2' fill='%23COLOR'/><rect x='2' y='2' width='2' height='2' fill='%23COLOR'/></svg>")
```
The 4×4 viewbox with two 2×2 squares on opposite diagonals produces a dense 50% stipple that reads as a shadow at normal viewing distance. Hex must be URL-encoded (%23 for #).

**Why:** **How to apply:** Any future direction using a non-blurred textural shadow (e.g., Hypercard-style dither, cross-hatch, dot pattern) should use this wrapper pattern instead of ::after on the card itself.
