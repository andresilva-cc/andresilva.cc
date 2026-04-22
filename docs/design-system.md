# Design System: andresilva.cc

> Reverse-engineered from the live codebase. This document describes the design language as it exists today, not a proposal. The source of truth for tokens is `src/styles/globals.css` (Tailwind 4 `@theme`) plus the four theme files under `src/styles/themes/`.

---

## 1. Brand Identity

André's personal website presents as a **developer-centric, editor-inspired portfolio**. The visual language borrows directly from popular code-editor color schemes (Dracula, Monokai, Terminal) and leans on monospaced typography for titles and UI chrome — the same aesthetic you'd find inside an IDE.

**Personality adjectives**: technical, playful, confident.

**Visual direction**:
- Dark by default. Every built-in theme is dark-mode; there is no light theme.
- IDE / code-editor feel — monospace titles, a purple-leaning primary, yellow/orange accent for names and titles, muted lavender-gray body copy.
- Low chrome, high typography. Very few borders, no shadows, no cards-with-elevation. Hierarchy is carried by color and type, not by boxes.
- Small, intentional flourishes — a rotating logo Easter egg, a scanline overlay in the Terminal theme, a subtly animated background when the Easter egg triggers.

**Inspirations** (as observable in the code): Dracula editor theme, Monokai, classic CRT/green-phosphor terminal, generic IDE chrome. The "default" theme is a custom violet-on-aubergine palette in the same family.

---

## 2. Color Palette

The site ships **four themes** — `default`, `dracula`, `monokai`, `terminal` — each defined as a scoped CSS variable block under `:root[data-theme='<name>']` in `src/styles/themes/`. The global `@theme inline` block in `globals.css` exposes these as Tailwind 4 color utilities so that every component simply uses classes like `text-primary-500` and adapts to whichever theme is active.

Every theme follows the same **token schema**:

| Role | Tokens |
|---|---|
| Base | `--color-black` |
| Neutrals | `--color-gray-200`, `--color-gray-900`, `--color-gray-950` |
| Primary | `--color-primary-300`, `--color-primary-400`, `--color-primary-500` |
| Secondary | `--color-secondary-300`, `--color-secondary-400`, `--color-secondary-500` |
| Auxiliary | `--color-auxiliary-300`, `--color-auxiliary-400`, `--color-auxiliary-500` |

The `-500` stop is the resting state, `-400` is hover, `-300` is active. This ramp is inverted vs. the Tailwind default (where `-500` is usually mid) — on this site, `-500` is the "true" color and the `-300`/`-400` variants are lighter tints used for interactive feedback.

### Token semantics (shared across themes)

| Token | Usage |
|---|---|
| `gray-200` | Body text, high-emphasis foreground |
| `gray-900` | Page background (main body) |
| `gray-950` | Darker surface — mobile menu panel, dropdown `data-focus` background, Easter-egg animated background target |
| `primary-500` | Logo fill, primary CTA background, active nav item background, tech chips, active theme item |
| `primary-400` / `-300` | Primary hover / active |
| `secondary-500` | Name on home, section item titles (job titles, project titles, article titles), `<strong>` emphasis |
| `secondary-400` / `-300` | Secondary hover / active |
| `auxiliary-500` | Muted text — icons, captions, dates, secondary nav, inline links, placeholder text |
| `auxiliary-400` / `-300` | Auxiliary hover / active |
| `black` | Defined but not currently referenced in components (reserved) |

### Theme palettes

**Default** (aubergine + violet + amber)

| Token | Value |
|---|---|
| `gray-200` | `#f6f5fa` |
| `gray-900` | `#2f2b42` |
| `gray-950` | `#232032` |
| `primary-300` | `#b0a2f6` |
| `primary-400` | `#a190f4` |
| `primary-500` | `#9b7ef2` |
| `secondary-300` | `#ffc65c` |
| `secondary-400` | `#ffbf47` |
| `secondary-500` | `#ffb633` |
| `auxiliary-300` | `#c2bddb` |
| `auxiliary-400` | `#b6b0d4` |
| `auxiliary-500` | `#aaa3cc` |

**Dracula**

| Token | Value |
|---|---|
| `gray-200` | `#F8F8F2` |
| `gray-900` | `#282A36` |
| `gray-950` | `#20212b` |
| `primary-300` | `#caa8fa` |
| `primary-400` | `#c39df9` |
| `primary-500` | `#bd93f9` |
| `secondary-300` | `#ffcd98` |
| `secondary-400` | `#ffc689` |
| `secondary-500` | `#ffb86c` |
| `auxiliary-300` | `#818eb6` |
| `auxiliary-400` | `#7180ad` |
| `auxiliary-500` | `#6272a4` |

**Monokai**

| Token | Value |
|---|---|
| `gray-200` | `#fdfff1` |
| `gray-900` | `#272822` |
| `gray-950` | `#1f201b` |
| `primary-300` | `#84e0f2` |
| `primary-400` | `#75dcf0` |
| `primary-500` | `#66d9ef` |
| `secondary-300` | `#b7e757` |
| `secondary-400` | `#aee442` |
| `secondary-500` | `#a6e22e` |
| `auxiliary-300` | `#8b8c84` |
| `auxiliary-400` | `#7c7e75` |
| `auxiliary-500` | `#6e7066` |

**Terminal** (green-on-black CRT)

| Token | Value |
|---|---|
| `gray-200` | `#ffffff` |
| `gray-900` | `#000000` |
| `gray-950` | `#000000` |
| `primary-300` | `#99ff99` |
| `primary-400` | `#66ff66` |
| `primary-500` | `#00ff00` |
| `secondary-300` | `#99ff99` |
| `secondary-400` | `#66ff66` |
| `secondary-500` | `#00ff00` |
| `auxiliary-300` | `#c1c1c1` |
| `auxiliary-400` | `#adadad` |
| `auxiliary-500` | `#999999` |

### Theme persistence

- The active theme is stored on `<html data-theme="...">` and mirrored into a `theme` cookie (`max-age=31536000`, path `/`).
- The server reads the cookie in `app/layout.tsx` (`cookies()`) and renders `<html data-theme={theme}>` so the palette is correct on first paint — no flash-of-unthemed-content.
- The `ThemeSelector` client component updates both the attribute and the cookie whenever the user picks a theme.

### Dark mode

All four themes currently shipping are dark — there is no light theme today. The token schema itself (`gray-200/900/950`, `primary-300/400/500`, `secondary-300/400/500`, `auxiliary-300/400/500`) is light/dark agnostic; a future light theme would just need to fill the same slots.

---

## 3. Typography

### Font stack

Two Google fonts are loaded via `next/font/google` in `src/app/fonts.ts` and exposed as CSS variables:

| Variable | Font family | Weights loaded | Role |
|---|---|---|---|
| `--font-fira-sans` → `--font-sans` | Fira Sans | 400, 500 | Body copy, sans-serif subtitles |
| `--font-fira-code` → `--font-mono` | Fira Code | 400, 600, 700 | Headings, button labels, captions, chips, code-style UI |

Both use `display: swap`. The body default is `font-sans` (Fira Sans). There is no explicit fallback stack declared — Next.js's font-loader provides the runtime fallback.

### Type variants

Typography is **not** expressed as raw Tailwind classes in pages — everything flows through the `<Text variant="...">` component in `src/components/text.tsx`. Each variant binds a default HTML element (overridable via `element` or `asChild`) and a fixed set of classes.

| Variant | Element | Family | Weight | Size (Tailwind) | Transform | Typical usage |
|---|---|---|---|---|---|---|
| `h1` | `h1` | mono | 700 (bold) | `text-6xl` (3.75rem) | — | Display title — "André Silva" on home, "404" |
| `h2-sans` | `h2` | sans | 500 (medium) | `text-2xl` (1.5rem) | — | Role line under the home title |
| `h2-mono` | `h2` | mono | 600 (semibold) | `text-2xl` (1.5rem) | uppercase | Page headers ("About", "Career", "Projects", "Articles") |
| `h3` | `h3` | sans | 500 (medium) | `text-base` (1rem) | — | Job titles, project titles, article titles, section subheads, modal titles |
| `button` | `span` | mono | 700 (bold) | `text-base` (1rem) | uppercase | Button labels (applied via `Text variant="button" asChild`) |
| `body-1` | `p` | sans | 400 (normal) | `text-base` (1rem) | — | Default paragraph copy — this is the variant when you don't pass one |
| `body-2` | `p` | sans | 400 (normal) | `text-sm` (0.875rem) | — | Job descriptions, project descriptions, article meta |
| `body-3` | `p` | sans | 400 (normal) | `text-xs` (0.75rem) | — | Chips, inline `<Link>` labels |
| `caption` | `span` | mono | 400 (normal) | `text-xs` (0.75rem) | uppercase | Dates on career page, "Read on dev.to" hint, small metadata |

### Overrides seen in use

- Home page `h1` is sized up responsively: `text-5xl md:text-6xl` (overrides the variant default).
- Home page `h2-sans` is sized down responsively: `text-xl md:text-2xl`.

### Body defaults and emphasis

Set globally in `globals.css`:

```css
body { background-color: var(--color-gray-900); color: var(--color-gray-200); font-family: var(--font-sans); }
strong { color: var(--color-secondary-500); font-weight: var(--font-weight-normal); }
```

`<strong>` is **recolored, not bolded** — it uses the secondary accent color at normal weight for in-prose emphasis (see the About page).

### Custom list-style marker

`globals.css` defines `--list-style-type-dash: '- '`, exposed as the `list-dash` Tailwind utility. Used on job-description bullet lists (`[&>ul]:list-dash [&>ul]:list-inside` in `src/components/job.tsx`) so bullet points render as a literal `-` instead of a disc — consistent with the IDE/markdown feel.

---

## 4. Spacing & Layout

### Spacing

No custom spacing tokens are registered. The site uses Tailwind 4's **default spacing scale** directly (`p-1`, `px-2.5`, `gap-8`, etc.). Common values observed in the codebase: `1`, `2`, `4`, `8`, `16`. Larger page paddings use `48` at `2xl`.

### Radius

Three custom radii are registered in `@theme` and used via `rounded`, `rounded-lg`, `rounded-full`:

| Token | CSS variable | Value | Used on |
|---|---|---|---|
| default | `--radius` | `5px` | Buttons, chips, theme-selector menu items |
| `lg` | `--radius-lg` | `10px` | Article cards, project cards, modal panel, theme-selector dropdown, avatar-adjacent focus rings |
| `full` | `--radius-full` | `100%` | Avatar image on About, logo SVG fill reference |

There are no intermediate radii (no `sm`, no `md` equivalent). Everything is either the small default, the larger `lg`, or fully round.

### Shadows & elevation

**None.** No `box-shadow` utility is applied anywhere in the codebase, and no shadow tokens are registered. Elevation is conveyed through:

- **Surface swap** — the mobile menu, dropdown, and modal use `gray-950` (one step darker than the page background at `gray-900`), while the modal also adds a `border-auxiliary-500` hairline.
- **Backdrop** — the modal uses a `bg-black/50` full-screen overlay.
- **Border-as-outline** — featured project cards have `outline-1 outline-auxiliary-500`, which thickens/lightens on hover/active.

### Grid templates

One custom grid template is registered in `@theme`:

```css
--grid-template-columns-job: 140px 1fr;
```

Available as `grid-cols-job`. Used on the Career page to render a fixed-width date gutter on the left and flexible job content on the right (only on `md+`; mobile stacks).

### Breakpoints

Tailwind 4 defaults, used as-is:

| Name | Value | Notable usage |
|---|---|---|
| `sm` | 640px | `main` gets `sm:px-6` horizontal padding |
| `md` | 768px | **The dominant breakpoint.** Menu switches desktop↔mobile, career grid activates, home title upsizes, article meta switches to long-form labels |
| `lg` | 1024px | About page switches from column to row, adds `lg:gap-16` |
| `xl` | 1280px | Projects grid goes from 2 to 3 columns |
| `2xl` | 1536px | Projects grid goes to 4 columns; `main` gets `2xl:px-48` |

### Page layout

Top-level shell in `src/app/layout.tsx`:

```
<body h-full flex flex-col px-4 md:px-8>
  <Header pt-4 md:pt-8 pb-8 md:pb-16 />
  <main grow flex flex-col justify-center
        px-0 sm:px-6 md:px-12 lg:px-24 2xl:px-48>
    {children}
  </main>
  <Footer py-8 md:py-16 />
</body>
```

Key properties:

- Full-viewport flex column — main grows, content is **vertically centered** via `justify-center`. This makes short pages (Home, About, 404) sit mid-screen.
- Horizontal padding compounds as the viewport grows: body has `px-4 md:px-8`, main adds `sm:px-6 md:px-12 lg:px-24 2xl:px-48`.
- No max-width container. Content breathes to the viewport minus padding.

---

## 5. Motion & Animation

### Conventions

A single asymmetric pattern is used for **all** interactive color/transform transitions across the site:

```
transition-colors hover:transition-none duration-300
```

The effect: state changes **animate on exit** (duration-300) but snap **instantly on hover enter**. This is applied consistently on the primary button, link, chips inside cards, article/project cards, footer icons, and the nav link active state.

### Duration tokens in use

| Duration | Where |
|---|---|
| `duration-150` | Modal enter/leave, theme-selector dropdown enter/leave |
| `duration-300` | All button/link color transitions, mobile-menu slide-in/out |

### Easing

- `ease-out` on enter, `ease-in` on leave (Headless UI `Transition` pattern).
- No custom cubic-bezier curves.

### Named animations

- `animate-spin` (Tailwind default) — applied to the logo when the Easter egg is triggered.
- `@keyframes background` — defined in `globals.css`, cycles `gray-900` ↔ `gray-950` at `1s linear infinite alternate`, applied to `body.animate` (activated by clicking the logo five times).

### Micro-interactions

- Article card: `group-hover:translate-x-1` on the "Read on dev.to" caret — it nudges right on card hover.
- Project card: `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` on the external-link arrow icon — nudges up-and-right on hover.
- 404 icon: `hover:scale-110 hover:fill-secondary-500` with `transition-transform` — the scale animates over the default Tailwind duration; the fill change snaps instantly (no `transition-colors`).
- Card surface hover: `bg-primary-300/0 → /5 → /10` — resting/hover/active stack up alpha on the same tint.

### Accessibility note

No `prefers-reduced-motion` handling is in place in the codebase.

---

## 6. Iconography

- **Library**: `@phosphor-icons/react` (imported from `@phosphor-icons/react/dist/ssr/index` for App Router compatibility).
- **Style**: outline (default Phosphor weight) across most UI; `weight="bold"` is used on inline card icons (calendar, clock, chat, heart, external-link arrow, modal close) to match monospace headings; `weight="fill"` is used for the 404 face.
- **Sizes** (as integer props):
  - `14` — inline link icon, "read more" caret
  - `16` — modal close, inline metadata icons (calendar, clock, etc.), check mark in theme selector
  - `32` — header (menu, logo, palette), footer social icons
  - `128` — 404 centerpiece icon

### Icons in active use

`ListIcon`, `XIcon`, `PaletteIcon`, `CheckIcon`, `LinkIcon`, `ArrowUpRightIcon`, `CaretDoubleRightIcon`, `CalendarBlankIcon`, `ClockIcon`, `ChatCircleDotsIcon`, `HeartIcon`, `SmileyXEyesIcon`, `GithubLogoIcon`, `LinkedinLogoIcon`, `XLogoIcon`, `DevToLogoIcon`, `EnvelopeIcon`, `InstagramLogoIcon`.

### Logo

The logo is an inline SVG (32×32) defined in `src/components/home-button.tsx`: a `primary-500`-filled rounded square containing a `gray-950`-filled stylized letter **A**. The rounded-square uses the registered default radius (`rx="5"`, matching `--radius: 5px`). Clicking it five times triggers the Easter egg (logo starts spinning and the body background animates).

---

## 7. Component Catalog

Every reusable component lives in `src/components/`. They are described below as they exist.

### Text (`text.tsx`)
- Nine variants defined in Section 3.
- Props: `variant`, `element` (override the default tag), `asChild` (render into a child slot via `@radix-ui/react-slot`), `className` (merged via `clsx`).
- `asChild` is the idiomatic way to apply variant styles to a non-default element — used by `Button` to style its `<button>` with `variant="button"`.

### Button (`button.tsx`)
- Built on top of `<Text variant="button" asChild>`, so every button inherits the uppercase mono typography.
- Variants:
  - `default` — filled pill. `text-gray-950 bg-primary-500`, hover → `bg-primary-400`, active → `bg-primary-300`, focus outline `primary-500`.
  - `text` — bare text link. `text-auxiliary-500`, hover → `-400`, active → `-300`, focus outline `auxiliary-500`.
  - `icon` — icon wrapper. Same color stack as `text`, but no padding and renders `[&>svg]:inline-block`.
- Shared styles: `rounded` (5px), `cursor-pointer`, `transition-colors hover:transition-none duration-300`, focus ring via `focus:outline-2 focus:outline-offset-2`.
- Padding: `px-2.5 py-1` on `default` and `text` only. `icon` has no padding.
- Supports `asChild` for composing into an anchor (see `LinkButton`).

### LinkButton (`link-button.tsx`)
- Thin wrapper that renders `<Button asChild><Link /></Button>`, using Next.js's `next/link`.
- Auto-detects external URLs (starts with `http`) and sets `target="_blank"`.
- Inherits all `Button` variants.

### Link (`link.tsx`)
- Distinct from `LinkButton` — this is the small inline **resource link** used in job and project detail lists (e.g., "Website", "GitHub").
- Renders `<a target="_blank">` with a leading 14px `LinkIcon` and `body-3` typography.
- Colors: `auxiliary-500` → `-400` → `-300`, matching the `text` button variant.
- Custom focus ring: `focus:outline-auxiliary-500 focus:outline-offset-4 focus:outline-1`.

### Chip (`chip.tsx`)
- Technology/tag pill.
- `body-3` typography inside a `<span>`.
- Style: `px-1.5 py-1 text-primary-500 border border-primary-500 rounded`.
- Single variant — no filled/ghost toggle.

### Header (`header.tsx`)
- `flex justify-between items-center`.
- Layout: `MobileMenu` (visible below `md`), `HomeButton` (logo, always visible), `DesktopMenu` (visible `md+`), `ThemeSelector` (always visible).
- Spacing controlled by `className` prop (layout gives it `pt-4 md:pt-8 pb-8 md:pb-16`).

### HomeButton (`home-button.tsx`)
- Icon-variant `LinkButton` pointing to `/` containing the 32×32 logo SVG.
- Client component — tracks a click counter; fifth click flips `enableEasterEgg`, adds `animate-spin` to itself, and toggles `body.animate` (which starts the background keyframes).

### DesktopMenu (`desktop-menu.tsx`)
- `<nav>` with `<ul class="flex gap-16">`.
- Each item is a `LinkButton`. Variant = `default` (filled primary) when the item's path matches the current route, else `text`.
- Active-match logic: `item.activeRegex` (regex) takes precedence over `path === currentPath`.
- Items flagged `hideOnDesktop` are filtered out (Home is desktop-hidden — the logo serves as home).

### MobileMenu (`mobile-menu.tsx`)
- Hamburger button (`ListIcon`, 32px) in icon variant.
- Opens a full-screen `Dialog` (Headless UI) that slides in from the top (`enterFrom="-translate-y-full"`, `duration-300`).
- Panel surface: `bg-gray-950 p-4`, with a `border-b border-b-auxiliary-500 pb-4 mb-4` divider above the nav list.
- Items render as stacked `LinkButton`s (`flex flex-col gap-4`), using the same active-state logic as DesktopMenu.
- Close button: icon-variant `XIcon` in the top bar.
- Auto-closes when an item is clicked (passes `onClick` to each item).

### ThemeSelector (`theme-selector.tsx`)
- Icon-variant `Button` with a `PaletteIcon` (32px) anchoring a Headless UI `Menu`.
- Dropdown surface: `absolute right-0 mt-2 w-36 rounded-lg bg-gray-900 border border-auxiliary-500 p-2`.
- Enter/leave: `transform transition ease-out/in duration-150`, `scale-90` ↔ `scale-100` with opacity fade.
- Menu items: `w-full px-3 py-2 text-sm rounded`, focused item gets `data-focus:bg-gray-950` (keyboard focus visualization). The currently active theme is rendered in `primary-500` semibold with a `CheckIcon` (16px, bold) on the right.

### Modal (`modal.tsx`)
- Built on Headless UI `Dialog` + `Transition`.
- Backdrop: `fixed inset-0 bg-black/50`, fades in over `duration-150`.
- Panel: `bg-gray-900 p-4 rounded-lg border border-auxiliary-500 min-w-[300px]`, scales from `0.9 → 1.0` with opacity fade over `duration-150`.
- Header row: `Text variant="h3"` title on the left, icon-variant close button (`XIcon`, 16px bold) on the right.
- Children slot gets the passed `className` — typical use is `flex flex-col gap-4` to stack Link rows.

### Job (`job.tsx`)
- Career item. On `md+` renders in the 2-column `grid-cols-job` (`140px 1fr`) with the date in the left gutter (right-aligned) and the content on the right; on mobile, stacks.
- Date: `caption` variant in `auxiliary-500`, formatted as `MMM yyyy — MMM yyyy` (or `— Present`).
- Title: `h3` variant in `secondary-500`, formatted as `"{title} @ {company}"`.
- Description: `body-2` in a `<div>`, with nested `<ul>` styled via `[&>ul]:list-dash [&>ul]:list-inside`.
- Optional links row: inline `<Link>` components, `gap-4 mt-4`.
- Technologies row: wrapping `Chip`s, `gap-2 mt-4`.

### Project (`project.tsx`)
- Project card. Has a `featured` prop that thickens the card (adds `h-full flex flex-col outline-1 outline-auxiliary-500` so featured cards fill their grid cell and wear a border).
- Content order: `h3` title (with a small `ArrowUpRightIcon` that nudges on hover if links exist), `body-2` description, row of `Chip`s.
- Link behaviour branches on `links.length`:
  - `0` → renders a plain, non-interactive `<div>`.
  - `1` → wraps the card in an external `<a target="_blank">`.
  - `>1` → wraps the card in a `<button>` that opens a `Modal` listing the links via `<Link>` components.
- Surface hover: `bg-primary-300/0 → /5 → /10`. Focus ring: `focus:rounded-lg focus:outline-hidden focus:outline-auxiliary-500` (+ `offset-4` for featured).

### Article (`article.tsx`)
- Article (blog post) card for the Articles page, rendered as a single `<a target="_blank">`.
- Surface hover same as Project: `bg-primary-300/0 → /5 → /10`, `rounded-lg p-4`.
- Title: `h3` in `secondary-500` with `secondary-400/300` hover states.
- Metadata row (`body-2 flex flex-wrap gap-x-6 md:gap-x-8`): four icon+text pairs — published date (formatted as `MMM dd, yyyy`), reading time, comment count, reaction count. The labels collapse on mobile (hides "min read", "comment(s)", "reaction(s)" — keeps just the number).
- Tag row: wrapping `Chip`s.
- Trailing caption: `"Read on dev.to"` with a `CaretDoubleRightIcon` that nudges on hover.

### RichText (`rich-text.tsx`)
- Render-prop component that provides typed `{ strong, p, ul, li }` tag renderers to children — used to embed rich job descriptions with consistent styling while keeping data as a function.

### Not a component — easter egg
- `body.animate` triggers the background keyframe defined in `globals.css`. Triggered by 5× logo clicks in `HomeButton`.

---

## 8. Accessibility

### What's in place

- Focus rings are **always present** on interactive components (button/link): 2px outline with 2–4px offset, colored to match the element's role (`primary-500` on primary buttons, `auxiliary-500` on text/icon buttons and links).
- Default-browser focus outlines are suppressed unless Headless UI sets `data-headlessui-focus-visible` on `html` (see `globals.css`), which scopes focus indicators to keyboard navigation.
- All icon-only buttons carry an `aria-label` ("Open menu", "Close menu", "Select theme", "Close", "Logo").
- Modal, mobile-menu, and theme-selector dropdowns are built on Headless UI components — they ship focus-trap, ESC-to-close, and backdrop-click-to-close out of the box.
- Project card buttons carry `aria-label={title}` so screen readers don't announce a blank button.
- External anchors use `target="_blank"` consistently (no `rel="noopener"` added in code — a known gap).

### Known gaps

- **No `prefers-reduced-motion` handling** — the Easter-egg background animation, mobile-menu slide, modal scale, and card transforms all run unconditionally.
- **Contrast** — `auxiliary-500` on `gray-900` is intentionally muted; on Dracula (`#6272a4` on `#282A36`) it's near the 4.5:1 AA threshold for body text. Body text itself (`gray-200` on `gray-900`) is high-contrast across all themes.
- **No explicit skip link** to `<main>`.
- **`rel="noopener noreferrer"`** is not set on external links.

These are observations of the current state, not prescriptions.

---

## 9. Tailwind 4 integration notes

- Tokens are registered in a single `@theme inline` block at the top of `src/styles/globals.css`. Each `--color-*` entry is set to `var(--color-*)`, which forwards the value of whatever `:root[data-theme]` block is active — that is the mechanism that makes every Tailwind color utility theme-reactive.
- There is **no `tailwind.config.*`** file. PostCSS config is minimal: `postcss.config.js` loads `@tailwindcss/postcss`, and `globals.css` starts with `@import 'tailwindcss';`.
- Custom tokens registered beyond colors and fonts: `--radius`, `--radius-lg`, `--radius-full`, `--list-style-type-dash`, `--grid-template-columns-job`.
- Utility classes that depend on those tokens: `rounded`, `rounded-lg`, `rounded-full`, `list-dash`, `grid-cols-job`.
- Plugin: `tailwind-scrollbar` is installed as a devDependency. It is not referenced by any current class in `src/`, so it has no visible effect on the live design today — treat it as latent.

---

## 10. Surface inventory

A quick map of what visual surfaces exist on the site so new work can reuse them by name.

| Surface | Background | Border/Outline | Radius | Example |
|---|---|---|---|---|
| Page | `gray-900` | — | — | `<body>` |
| Elevated panel | `gray-950` | — | — | Mobile-menu panel |
| Dropdown | `gray-900` | `border-auxiliary-500` | `rounded-lg` (10px) | Theme selector menu |
| Modal | `gray-900` | `border-auxiliary-500` | `rounded-lg` (10px) | Project links modal |
| Modal backdrop | `black/50` | — | — | Modal overlay |
| Hoverable card (unframed) | `primary-300/0 → /5 → /10` | — | `rounded-lg` (10px) | Article card, default project card |
| Hoverable card (framed) | `primary-300/0 → /5 → /10` | `outline-1 outline-auxiliary-500 → -400 → -300` | `rounded-lg` (10px) | Featured project card |
| Primary pill | `primary-500 → -400 → -300` | — | `rounded` (5px) | Primary button |
| Chip | transparent | `border border-primary-500` | `rounded` (5px) | Tech tag |
