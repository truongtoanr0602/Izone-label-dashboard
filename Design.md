# Design.md

Styling conventions for `dashboard/`. Read this before touching any component's classes or restyling anything — matching the existing palette/patterns exactly matters more than introducing new ones.

## Tailwind setup

Tailwind **v4** via the `@tailwindcss/vite` plugin. There is **no `tailwind.config.js`** — all configuration lives in `dashboard/src/index.css`:

- `@theme { ... }` defines tokens (`--color-primary: #db0829`, label colors, `--font-heading: 'Geologica'` loaded from Google Fonts in `index.html`).
- `@custom-variant dark (&:where(.dark, .dark *))` enables **class-based** dark mode. `App.tsx` toggles `.dark` on `document.documentElement` in a `useEffect` (needed for `body`/global rules) *and* applies it on the root `<div>`. Both are load-bearing; removing the `useEffect` breaks global dark styles.

## Color palette

**Components do not use the `@theme` tokens.** They hardcode hex literals with explicit `dark:` pairs. Match the existing palette exactly rather than introducing new colors or switching to token classes mid-file:

| Role | Light | Dark |
|---|---|---|
| Brand (IZONE red) | `#DB0829` | same |
| Page background | `#f3f4f6` | `#18181b` |
| Surface / card | `white` | `#27272a` |
| Border | `#f3f4f6` | `#3f3f46` |
| Text primary | `#404040` | `#e4e4e7` |
| Text muted | `#404040/60–70` | `#a1a1aa` |

Radii are literal (`rounded-[8px]`, `rounded-[12px]`, `rounded-[16px]`), not the Tailwind scale. Semantic status colors use Tailwind's `emerald` / `amber` / `red` scales.

## Visual weight

Recent history (`e84c649` "Giảm nhiệt thị giác", `34a65ac`, `9cb0240`) is a deliberate push toward *lower visual heat*: flat surfaces, thin 1px borders, minimal shadows, no gradients. Don't reintroduce heavy shadows or saturated fills.

## Layout

Fixed sidebar + scrollable main; the sidebar becomes an off-canvas drawer below the `xl` breakpoint (`isMobileMenuOpen`).
