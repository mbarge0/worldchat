# WorldChat — UI Guidelines (Foundation)

Version: v1.0 (Branded + Motion Enhanced)
Output Path: /docs/operations/ui-guidelines.md

---

## 1. Overview & Philosophy
WorldChat’s interface reflects modern minimalism with calm confidence, global clarity, and seamless connectivity. The design language draws inspiration from Linear, Vercel, Notion, and shadcn/ui: neutral surfaces, rigorous spacing, subtle motion, and precise typography. These guidelines are the single source of truth for design and UI implementation across all phases (Design → Build → UI Review).

Principles:
- Clarity first: content and language should be easy to parse in any script or direction (LTR/RTL).
- Calm motion: animations are purposeful, fast, and support cognition.
- Consistency via tokens: colors, type, spacing, motion, and states are tokenized and consumed via Tailwind and component props.
- Accessibility by default: WCAG AA+ contrast, focus visibility, and reduced-motion support.

---

## 2. Color System
Use the following token table for light and dark modes. Tokens map directly to Tailwind CSS (via config or CSS variables).

Brand & Neutral Tokens:

| Token | Name | Light (HEX) | Dark (HEX) | RGB (light) | Usage |
|---|---|---|---|---|---|
| --color-brand-primary | Dark Blue | #072D51 | #0B2F4F | rgba(7,45,81,1) | Primary actions, headers, emphasis |
| --color-brand-accent | Gold | #CFA968 | #B89058 | rgba(207,169,104,1) | Accents, focus glow, highlights |
| --color-brand-secondary | Light Blue | #CDD2C5 | #A8B2A3 | rgba(205,210,197,1) | Subtle surfaces, secondary text |
| --color-bg | Background | #FFFFFF | #0B0D10 | rgba(255,255,255,1) | Page background |
| --color-surface | Surface | #F7F8FA | #12161C | rgba(247,248,250,1) | Cards, modals, inputs |
| --color-border | Border | #E5E7EB | #273142 | rgba(229,231,235,1) | Dividers, input borders |
| --color-text | Text | #0F172A | #E5E7EB | rgba(15,23,42,1) | Primary text |
| --color-text-muted | Text Muted | #475569 | #94A3B8 | rgba(71,85,105,1) | Secondary text |

Semantic Tokens:

| Token | Light | Dark | Usage |
|---|---|---|---|
| --color-success | #16A34A | #22C55E | Success, confirmations |
| --color-warning | #F59E0B | #D97706 | Cautionary states |
| --color-error | #DC2626 | #EF4444 | Errors, destructive |
| --color-info | #0EA5E9 | #38BDF8 | Informational |

Tailwind mapping (example):
```js
// tailwind.config.js (excerpt)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)',
          accent: 'var(--color-brand-accent)',
          secondary: 'var(--color-brand-secondary)'
        },
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)'
      }
    }
  }
}
```

---

## 3. Typography
Modern sans-serif with strong clarity (recommend: Inter or Geist). Use utility classes for consistent hierarchy.

Scale & Weights:
- Display: 30/36, 700 → `text-3xl md:text-4xl font-bold leading-tight`
- H1: 24/32, 700 → `text-2xl md:text-3xl font-bold leading-snug`
- H2: 20/28, 600 → `text-xl md:text-2xl font-semibold leading-snug`
- H3: 18/26, 600 → `text-lg md:text-xl font-semibold`
- Body: 16/24, 400 → `text-base leading-7`
- Secondary: 14/20, 400 → `text-sm leading-5 text-muted`
- Caption: 12/16, 400 → `text-xs leading-4 text-muted`

Best practices:
- Line length 60–80 chars; increase line-height for multilingual scripts.
- Use `tabular-nums` for timestamps and metrics.

---

## 4. Spacing & Layout
Grid increments (4px): 4, 8, 12, 16, 24, 32, 48, 64.

Tokens:
- Spacing: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`, `--space-12: 48px`, `--space-16: 64px`
- Radius: `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-xl: 16px`, `--radius-2xl: 24px`
- Shadow: `--shadow-sm: 0 1px 2px rgba(7,45,81,0.08)`, `--shadow-md: 0 4px 10px rgba(7,45,81,0.12)`, `--shadow-lg: 0 8px 20px rgba(7,45,81,0.15)`
- Container: sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536

Tailwind mapping:
```css
:root {
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-2xl: 24px;
  --shadow-sm: 0 1px 2px rgba(7,45,81,0.08);
  --shadow-md: 0 4px 10px rgba(7,45,81,0.12);
  --shadow-lg: 0 8px 20px rgba(7,45,81,0.15);
}
```

---

## 5. Interaction States
Interaction should feel responsive and calm.

- Hover: soft fade (100ms; opacity + subtle shadow)
- Focus: 1px border highlight with gold glow (`outline-offset: 2px`)
- Active: scale to 0.97 with ease-out (tap/click feedback)
- Disabled: reduced opacity (~60%), no shadow, pointer-events none

Tailwind snippets:
```html
<button class="bg-brand-primary text-white hover:opacity-90 focus:ring-2 focus:ring-brand-accent active:scale-95 transition duration-100 ease-in-out rounded-md px-4 py-2">
  Action
</button>
```

---

## 6. Motion & Animation
Define motion tokens and principles for consistency.

Tokens:
- `--motion-fast: 100ms`
- `--motion-base: 200ms`
- `--motion-slow: 300ms`
- `--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)`

Principles:
- Use fade + slide for entrances; scale for emphasis only.
- Layer depth with shadow and slight blur for foreground elements.
- Honor `prefers-reduced-motion`: disable non-essential animations.

Examples:
```css
.animate-fade-in { animation: fade-in var(--motion-base) var(--ease-standard); }
@keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
```

---

## 7. Accessibility
- Maintain WCAG AA+ contrast with brand + neutrals.
- Provide clear focus styles across themes.
- Support keyboard navigation (tab order, focus traps in modals).
- Respect reduced-motion system preferences.
- RTL support: test Arabic/Hebrew layouts.

---

## 8. Component Tokens
Define atomic tokens per component for consistent composition.

### Button
- Colors: primary = `bg-brand-primary text-white`, secondary = `bg-surface text-text border border-border`, subtle = `bg-transparent text-text hover:bg-surface`
- Radius: `rounded-md` (8px)
- Padding: `px-4 py-2`
- States: `hover:opacity-90`, `focus:ring-2 focus:ring-brand-accent`, `active:scale-95`, `disabled:opacity-60`

### Card
- Surface: `bg-surface text-text shadow-sm rounded-lg`
- Padding: `p-4 md:p-6`
- Hover: `hover:shadow-md transition-shadow`

### Input
- Base: `bg-surface text-text border border-border rounded-md px-3 py-2`
- Focus: `focus:outline-none focus:ring-2 focus:ring-brand-accent`
- Error: `border-error focus:ring-error`

### Modal
- Container: `bg-surface text-text rounded-xl shadow-lg p-6` with backdrop blur
- Motion: fade-in + scale from 0.95 → 1.0 in `--motion-base`
- Focus trap and keyboard dismissal required

### Badge
- Neutral: `bg-surface text-text border border-border rounded-full px-2 py-0.5 text-xs`
- Info: `bg-info/10 text-info`, Success: `bg-success/10 text-success`, Warning: `bg-warning/10 text-warning`, Error: `bg-error/10 text-error`

---

## 9. Responsive Breakpoints
- Tailwind defaults: `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`
- Typography scales up at `md` and `lg` breakpoints
- Increase motion durations slightly on large displays (`--motion-slow`)

---

## 10. Version History
- v1.0 — Initial branded + motion-enhanced foundation (colors, type, spacing, states, motion, a11y, component tokens, responsive rules)
