# WorldChat — SM2 Messaging UI Designs

Artifacts in this folder are the design system deliverables for Supermodule 2 (Messaging Core).

Contents:
- `tokens.json`: Figma tokens (colors, radius, spacing, typography, motion)
- `components.json`: Component specs (MessageBubble, MessageInput, ConversationListItem, TypingIndicator)

Usage:
- Import into Figma via Tokens Studio or similar plugin using the JSON schema.
- Map tokens to Tailwind via `tailwind.config.ts` using CSS variables (see `/docs/operations/ui-guidelines.md`).
- Use Lucide icons for glyphs: Send, Plus, ArrowLeft, EllipsisVertical, Check, CheckCheck, Image.

Screens to compose:
- Conversation List (iPhone 13 frame)
- Conversation Screen (iPhone 13 frame)

Notes:
- Light mode first; dark mode can be derived from brand tokens later.
- Motion durations: 120–200ms; typing loop = 250ms; pull-to-refresh = 300ms.
- Corner radii: bubbles 16, inputs 12, avatars 20.
