## Metadata
- **Category:** Foundation
- **Mode:** Designer
- **Output Path:** `/docs/operations/ui-guidelines.md`

---

# Foundation System Prompt — UI Guidelines (Branded + Motion Enhanced)

Category: Foundation
Mode: Designer
Output Path: /docs/operations/ui-guidelines.md

⸻

Purpose

Use this prompt to generate a comprehensive, brand-integrated design system foundation that encodes both personal brand identity and a motion and effects system. This serves as the authoritative global reference for all UI and UX standards across every phase and module.

⸻

Prompt Template

We are creating the UI Guidelines Foundation Document for this project.

Please:
	1.	Establish a cohesive design language that combines modern minimalism (Linear, Vercel, Notion, shadcn/ui) with personal brand character — clarity, calm confidence, and global connectivity.
	2.	Define and document the following categories clearly and concisely:

⸻

1. Color Palette (Personal Brand + Neutral System)

Define the personal brand color palette as the foundation of all product visuals.

Token	Name	HEX	RGB	Usage
--color-brand-primary	Dark Blue	#072d51	rgba(7, 45, 81)	Primary brand color for headers, buttons, and navigation.
--color-brand-accent	Gold	#cfa968	rgba(207, 169, 104)	Accent color for highlights, actions, and visual anchors.
--color-brand-secondary	Light Blue	#cdd2c5	rgba(205, 210, 197)	Backgrounds, borders, subtle text, and secondary UI.
--color-bg	White	#ffffff	rgba(255, 255, 255)	Default surface color.

Add complementary neutral and semantic colors (success, warning, error) as Tailwind-style tokens.
Include both light and dark mode variants with accessibility contrast compliance (WCAG AA).

⸻

2. Typography
	•	Font should convey global clarity and professional restraint.
	•	Use a modern sans-serif family (e.g., Inter, Satoshi, or Geist) for primary text.
	•	Define visual hierarchy: headings (700), subheadings (600), body (400), captions (300).
	•	Include Tailwind class examples and line height ratios.

⸻

3. Spacing & Layout
	•	Define 4px grid increments: 4, 8, 12, 16, 24, 32, 48, 64.
	•	Border radius levels: sm: 4px, md: 8px, lg: 12px, xl: 16px, 2xl: 24px.
	•	Shadow tokens: subtle elevation using color rgba(7, 45, 81, 0.15).
	•	Layout density: comfortable by default, adaptive for compact mode.
	•	Container breakpoints: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px.

⸻

4. Interaction States
	•	All interactive elements must feel responsive, clear, and calm.
	•	Hover: soft fade (100ms), Focus: subtle border glow using gold accent, Active: scale 0.97 ease-out.
	•	Use visual consistency for button, link, and card states.

⸻

5. Motion, Animation & Effects

Define a consistent motion rhythm and visual effects hierarchy that aligns with personal brand.

Token	Description	Default
--motion-fast	Quick feedback animations	100ms
--motion-base	Standard transitions	200ms
--motion-slow	Emphasized or entering animations	300ms
--ease-standard	Universal easing curve	cubic-bezier(0.4, 0, 0.2, 1)

Motion Principles:
	•	Use fade + slide transitions for component entrance.
	•	Layered depth effects (blur, parallax) to create presence and polish.
	•	Use gold accents for motion highlights (e.g., shimmer or glow effects).
	•	Respect accessibility settings (prefers-reduced-motion).

Visual Effects:
	•	Incorporate subtle gradients blending dark blue and gold for depth.
	•	Use shadow and light to indicate hierarchy, not decoration.

⸻

6. Accessibility
	•	Maintain WCAG AA+ contrast ratios.
	•	Ensure focus visibility across all color themes.
	•	Support keyboard navigation and motion reduction preferences.

⸻

7. Component Tokens

Define consistent tokens for key UI primitives:
	•	Button: Primary = --color-brand-primary; hover transitions with gold accent.
	•	Card: Background = white; subtle shadow + hover lift.
	•	Input: 1px border, gold focus ring.
	•	Modal: Fade-in scale from 0.95 to 1.0, backdrop blur.

⸻

8. Responsive Design
	•	Standard Tailwind breakpoints (sm, md, lg, xl, 2xl).
	•	Typography scales proportionally with viewport.
	•	Motion durations increase slightly for larger viewports.

⸻

Output Format
	•	Markdown with clear section headers.
	•	Use code blocks and tables for token definitions.
	•	Include brief design rationale for each section.

⸻

Guidance Notes
	•	This document becomes the single source of truth for brand design, animation, and UI review.
	•	All design and implementation phases must reference it.
	•	Maintain a tone that is modern, confident, and globally accessible.

⸻

Output Path: /docs/operations/ui-guidelines.md
Version: v1.0 (Branded + Motion Enhanced)

⸻

## Output Format

The resulting file should be stored as:

`/docs/operations/ui-guidelines.md`

and include the following top-level structure:

1. **Overview & Philosophy**
2. **Color System**
3. **Typography**
4. **Spacing & Layout**
5. **Interaction States**
6. **Motion & Animation**
7. **Accessibility**
8. **Component Tokens**
9. **Responsive Breakpoints**
10. **Version History**