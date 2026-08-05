# Design System Inspired by IZONE

> Auto-extracted from `https://www.izone.edu.vn/` on 2026-07-11

## 1. Visual Theme & Atmosphere

Clean, minimal, and product-focused with deliberate use of whitespace.

The hero section leads with "Trung tâm luyện thi IELTS IZONE - Luyện thi IELTS "số 1" cho người mất gốc".

**Key Characteristics:**
- Geologica as the heading font (custom web font loaded via @font-face)
- ui-sans-serif as the body font for all running text
- Heading weight 400
- Light/white background (#ffffff) as the primary canvas
- Primary accent `#db0829` used for CTAs and brand highlights
- 8 shadow level(s) detected — tinted shadows
- Rounded corners (6px+) creating a friendly, approachable feel
- Tags: light, rounded, accented, compact, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#db0829`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#ef3753`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#ffffff`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#f3f4f6`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#404040`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#475569`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#f3f4f6`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#ffffff` | `--palette-1` | badge | large | text-dark |
| 2 | `#f3f4f6` | `--palette-2` | badge | large | text-dark |
| 3 | `#174266` | `--palette-3` | button | large | text-light |
| 4 | `#db0829` | `--palette-4` | text-accent | large | text-light |
| 5 | `#ef3753` | `--palette-5` | text-accent | medium | text-light |
| 6 | `#f9667d` | `--palette-6` | text-accent | medium | text-dark |
| 7 | `#1d2327` | `--palette-7` | block | medium | text-light |
| 8 | `#386991` | `--palette-8` | text-accent | medium | text-light |
| 9 | `#5184ae` | `--palette-9` | text-accent | medium | text-light |
| 10 | `#334155` | `--palette-10` | text-accent | small | text-light |
| 11 | `#475569` | `--palette-11` | text-accent | small | text-light |
| 12 | `#64748b` | `--palette-12` | text-accent | small | text-light |

## 3. Typography Rules

- **Heading Font:** `Geologica` (web font)
- **Body Font:** `ui-sans-serif`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Geologica | 14px | 400 | 20px | normal |
| H2 | Geologica | 30px | 700 | 36px | 0.75px |
| H3 | Geologica | 24px | 600 | 32px | normal |
| H4 | Geologica | 14px | 600 | 20px | normal |
| Body | Geologica | 16px | 400 | 24px | normal |
| Small | Geologica | 14px | 400 | 20px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `36px` | headings |
| H1 | `30px` | headings |
| H2 | `24px` | headings |
| H3 | `20px` | headings |
| H4 | `18px` | headings |
| Body L | `16px` | body / supporting text |
| Body | `14px` | body / supporting text |
| Small | `13px` | body / supporting text |
| XS | `12px` | body / supporting text |
| Caption | `11px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: transparent;
  color: #c3c4c7;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 13px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #174266;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #db0829;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 14px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button 2

```css
.btn-ghost-2 {
  background: transparent;
  color: #4b5563;
  border-radius: 8px;
  padding: 0px 0px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
```

### Card

```css
.card {
  background: #000000;
  border-radius: 8px;
  padding: 0px;
}
```

## 5. Layout Principles

- **Base spacing unit:** `12px` — use multiples (24px, 36px, 48px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `12px` | element |
| spacing-2 | `8px` | element |
| spacing-3 | `6px` | element |
| spacing-4 | `16px` | element |
| spacing-5 | `10px` | element |
| spacing-6 | `24px` | card |
| spacing-7 | `4px` | element |
| spacing-8 | `32px` | card |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-button | `6px` | button |
| radius-button | `8px` | button |
| radius-card | `16px` | card |
| radius-button | `12px` | button |
| radius-subtle | `4px` | subtle |
| radius-button | `9px` | button |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0...` | Cards, subtle elevation |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(219, 8,...` | Cards, subtle elevation |
| Mid | `rgba(0, 0, 0, 0.2) 0px 3px 5px 0px` | Dropdowns, popovers |
| Low | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(209, 213...` | Cards, subtle elevation |
| Low | `rgb(255, 255, 255) 0px 0px 0px 0px, rgb(255, 255, 255) 0px 0px 0px 4px, rgba(0, ...` | Cards, subtle elevation |


## 7. Do's and Don'ts

### Do
- Use `#ffffff` as the primary background color
- Use `Geologica` for all headings and `ui-sans-serif` for body text
- Use `#db0829` as the single dominant accent/CTA color
- Maintain `12px` as the base spacing unit — all gaps should be multiples
- Use rounded corners (`6px`+) consistently for all interactive elements
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 400 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Geologica/ui-sans-serif with generic alternatives
- Don't use irregular spacing — stick to 12px grid
- Don't use dark/black backgrounds — this is a light-themed design
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use oversized hero text — this brand uses restrained type
- Don't use pure black (#000000) for text — use `#404040` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 12px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #ffffff
Text:        #404040
Accent:      #db0829
Secondary:   #ef3753
Border:      #f3f4f6
```

### Example Prompts

1. "Build a hero section with a `#ffffff` background, `Geologica` heading in `#404040`, and a `#db0829` CTA button with 8px radius."
2. "Create a pricing card using background `#f3f4f6`, border `#f3f4f6`, `ui-sans-serif` for text, and 36px padding."
3. "Design a navigation bar — `#ffffff` background, `#404040` links, `#db0829` for active state."
4. "Build a feature grid with 3 columns, 36px gap, each card using the card component style."
5. "Create a footer with `#404040` background, `#ffffff` text, and 24px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 133 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--e-a-color-white` | `#fff` |
| `--e-a-color-black` | `#000` |
| `--e-a-color-logo` | `#fff` |
| `--e-a-color-primary` | `#f3bafd` |
| `--e-a-color-primary-bold` | `#d004d4` |
| `--e-a-color-secondary` | `#515962` |
| `--e-a-color-success` | `#0a875a` |
| `--e-a-color-danger` | `#dc2626` |
| `--e-a-color-info` | `#2563eb` |
| `--e-a-color-warning` | `#f59e0b` |
| `--e-a-color-accent` | `#93003f` |
| `--e-a-color-global` | `#1dddbf` |
| `--e-a-color-accent-promotion` | `#93003f` |
| `--e-a-bg-default` | `#fff` |
| `--e-a-bg-invert` | `#0c0d0e` |
| `--e-a-bg-hover` | `#f1f2f3` |
| `--e-a-bg-active` | `#e6e8ea` |
| `--e-a-bg-active-bold` | `#d5d8dc` |
| `--e-a-bg-loading` | `#f9fafa` |
| `--e-a-bg-logo` | `#000` |
| `--e-a-bg-primary` | `#fae8ff` |
| `--e-a-bg-secondary` | `#515962` |
| `--e-a-bg-success` | `#f2fdf5` |
| `--e-a-bg-info` | `#f0f7ff` |
| `--e-a-bg-danger` | `#fef1f4` |
| `--e-a-bg-warning` | `#fffbeb` |
| `--e-a-bg-chip` | `#f1f2f3` |
| `--e-a-color-txt` | `#515962` |
| `--e-a-color-txt-muted` | `#818a96` |
| `--e-a-color-txt-disabled` | `#babfc5` |
| ... | *(71 more)* |

### Spacing Variables

| Variable | Value |
|---|---|
| `--wp-admin--admin-bar--height` | `32px` |
| `--direction-multiplier` | `1` |
| `--e-a-border-radius` | `3px` |
| `--swiper-navigation-size` | `44px` |
| `--wp--preset--aspect-ratio--square` | `1` |
| `--wp--preset--spacing--20` | `0.44rem` |
| `--wp--preset--spacing--30` | `0.67rem` |
| `--wp--preset--spacing--40` | `1rem` |
| `--wp--preset--spacing--50` | `1.5rem` |
| `--wp--preset--spacing--60` | `2.25rem` |
| `--wp--preset--spacing--70` | `3.38rem` |
| `--wp--preset--spacing--80` | `5.06rem` |
| `--wp--style--global--content-size` | `40rem` |
| `--wp--style--global--wide-size` | `60rem` |
| `--rankmath-wp-adminbar-height` | `0` |

### Typography Variables

| Variable | Value |
|---|---|
| `--e-a-font-family` | `Roboto,Arial,Helvetica,sans-serif` |
| `--wp--preset--font-size--small` | `13px` |
| `--wp--preset--font-size--medium` | `20px` |
| `--wp--preset--font-size--large` | `36px` |
| `--wp--preset--font-size--x-large` | `42px` |

### Other Variables

| Variable | Value |
|---|---|
| `--e-a-border` | `1px solid var(--e-a-border-color)` |
| `--e-a-border-bold` | `1px solid var(--e-a-border-color-bold)` |
| `--e-a-btn-color-invert` | `var(--e-a-color-txt-invert)` |
| `--e-a-btn-color-disabled` | `var(--e-a-color-txt-disabled)` |
| `--e-a-transition-hover` | `all .3s` |
| `--wp--preset--aspect-ratio--4-3` | `4/3` |
| `--wp--preset--aspect-ratio--3-4` | `3/4` |
| `--wp--preset--aspect-ratio--3-2` | `3/2` |
| `--wp--preset--aspect-ratio--2-3` | `2/3` |
| `--wp--preset--aspect-ratio--16-9` | `16/9` |
| `--wp--preset--aspect-ratio--9-16` | `9/16` |
| `--page-title-display` | `block` |
