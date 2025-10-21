## Start — Supermodule 2: Messaging Core (Phase 02)

Phase number: 02  
Date: 2025-10-21  
Mode: Consolidated Plan Phase (Start → Plan → Design)

---

## Plan — Detailed Phase Plan

Phase Context: Supermodule 2 — Messaging Core; entering planning loop to sequence work and confirm dependencies. Date: 2025-10-21.

### Overview

- Goal: Deliver Messaging Core to MVP readiness (P0-1, P0-2, P0-3, P0-4, P0-5, P0-6, P0-10).
- Time estimate: ~1.5–2 days of focused implementation + validation.

### Task Summary (Priority and Effort)

- P0: SQLite schema & service (S), Queue manager (M), Firestore sync (M), Message service (M), Chat UI (M), Conversation list (S), Presence/Typing (S), Read receipts (S), Image send (S). Total: 9 items.

Legend: S = Small (≤2h), M = Medium (2–4h), L = Large (4–8h).

### Dependency Graph

```
Schema (2.1.1) → SQLite Service (2.1.2) → Queue Manager (2.1.3)
                                 ↘
                         Firestore Sync (2.2.1) → Message Service (2.2.2)
                                                   ↙            ↘
                       Message Bubble/Input (2.3.1/2.3.2)     Read Receipts (2.6.1)
                                   ↓                                 ↓
                         Chat Screen (2.3.3)                Receipt UI (2.6.2)
                                   ↑
               Conversation Service/List (2.4.1/2.4.3) + List Item (2.4.2)
                                   ↘
                      Presence (2.5.1) + Typing (2.5.2/2.5.3)
                                   ↘
                             Image Send (2.8.1/2.8.2)
```

### Task Breakdown (IDs map to Dev Checklist)

1) 2.1.1 Create SQLite Database Schema — S  
   - Acceptance: Tables, indexes, FKs per checklist.  
   - Output: `services/storage/schema.ts`.

2) 2.1.2 Implement SQLite Service — M  
   - Acceptance: CRUD for messages/conversations; transactions.  
   - Output: `services/storage/sqliteService.ts`.

3) 2.1.3 Create Message Queue Manager — M  
   - Acceptance: enqueue/process with retry + dedupe.  
   - Output: `services/messaging/queueManager.ts`.

4) 2.2.1 Implement Firestore Sync Service — M  
   - Acceptance: send + subscribe + unsubscribe.  
   - Output: `services/messaging/firestoreSync.ts`.

5) 2.2.2 Create Message Service — M  
   - Acceptance: send flow, optimistic UI, local-first load.  
   - Output: `services/messaging/messageService.ts`.

6) 2.3.1 Message Bubble; 2.3.2 Message Input — S+S  
   - Acceptance: styles for sent/received, status, input UX.  
   - Outputs: `components/chat/MessageBubble.tsx`, `components/chat/MessageInput.tsx`.

7) 2.3.3 Chat Screen — M  
   - Acceptance: FlatList, auto-scroll, pagination, header.  
   - Output: `app/conversation/[id].tsx`.

8) 2.4.1 Conversation Service; 2.4.2 Item; 2.4.3 Screen — S+S+S  
   - Acceptance: list sorted by `updatedAt`; pull-to-refresh; navigation.  
   - Outputs: `services/messaging/conversationService.ts`, `components/chat/ConversationListItem.tsx`, `app/(tabs)/conversations.tsx`.

9) 2.5.1 Presence; 2.5.2 Typing; 2.5.3 UI — S+S+S  
   - Acceptance: presence doc updates; typing throttle; indicator UI.  
   - Outputs: `services/messaging/presenceService.ts`, `services/messaging/typingService.ts`, `components/chat/TypingIndicator.tsx`.

10) 2.6.1 Read Receipts; 2.6.2 Checkmarks — S+S  
    - Acceptance: `readBy` updates; status transitions; UI reflects.  
    - Outputs: `services/messaging/readReceiptService.ts`, update `MessageBubble.tsx`.

11) 2.8.1 Image Upload; 2.8.2 Bubble Rendering — S+S  
    - Acceptance: pick, upload, display thumbnail; full-screen view.  
    - Outputs: `services/media/imageService.ts`, update `MessageBubble.tsx`.

### Critical Path

2.1.1 → 2.1.2 → 2.1.3 → 2.2.1 → 2.2.2 → 2.3.1/2.3.2 → 2.3.3 → 2.6.1/2.6.2 → 2.5.x → 2.8.x → 2.9.1 (MVP validation)

### Risk Mitigation

- SQLite performance: use transactions and indices; paginate UI.  
- Offline conflicts: append-only messages, dedupe by UUID, retries capped.  
- Listener leaks: return unsubscribe and clean up on unmount.

### Regression Plan

Reference: `docs/operations/regression/00_master_regression_manifest.md`.

- Affected prior phases: Phase 00 (startup), Phase 01 (auth session, navigation).  
- Regression checks to include:  
  - App launches crash-free with env loaded (Phase 00).  
  - Auth persists across restarts and navigation remains guarded (Phase 01).  
  - Firestore rules continue to enforce access for participants-only.  
  - Unit tests for auth services remain green.

### Success Metrics (Phase)

- P0 user stories P0-1..P0-6, P0-10 satisfied; sub-500ms perceived latency; 100% offline queue delivery on reconnect.

### Next Steps

- Proceed to Design specifications for UI components and screens, then begin Build.

---

## Design — UI/UX Specifications

Phase Context: Supermodule 2; define Messaging Core UI with modern, accessible system.

### Visual Objectives

- Clarity, responsiveness, and accessibility (WCAG AA).  
- WhatsApp-like speed perception with optimistic feedback.

### Layout Description (Text Wireframes)

Conversation List (`app/(tabs)/conversations.tsx`):

```
[Header: Conversations       (+)]
[Search input]
-------------------------------------------------
[Avatar]  [Name]        [Time]
          [Last msg…]   [Unread badge]
-------------------------------------------------
... (scroll)
```

Chat Screen (`app/conversation/[id].tsx`):

```
[Header: < Back]  [Title / Presence dot]  [⋯]
----------------------------------------------
[Day separator]
[Received bubble]
[Sent bubble   ✓/✓✓/✓✓ blue]
... (scroll up loads more)
----------------------------------------------
[ + ] [Type a message…................] [Send]
```

### Component Specifications

- MessageBubble:  
  - States: sent/received; status: sending/sent/delivered/read.  
  - Supports text and image; dual-language placeholder ready.  
  - Spacing: 8px grid; max width ~80%.

- MessageInput:  
  - Multiline TextInput; disabled when empty; 5,000 char counter.  
  - Accessory buttons: image pick (+), optional voice placeholder (disabled).  
  - Shows typing debounce events.

- ConversationListItem:  
  - Avatar 40px; name bold; last message 14px gray; unread badge pill.  
  - Presence dot overlay on avatar (green/gray).

- TypingIndicator:  
  - Three-dot pulse (100–250ms ease-in-out), auto-hide after 3s.

### Figma-Ready Spec (detailed)

Tokens (light mode):
- Sent bubble: `#2563EB` (blue-600), text `#FFFFFF`, radius 16, padding 12x10, shadow-sm
- Received bubble: `#F3F4F6` (gray-100), text `#111827`, radius 16, padding 12x10
- Presence dot: `#10B981` (emerald-500) 8px, offset bottom-right avatar
- Accent badge: `#38BDF8` (sky-500) used for unread count background
- Input: surface `#FFFFFF`, border `#E5E7EB`, radius 12, inner padding 12, placeholder `#9CA3AF`
- Avatar: 40px, radius 20, shadow-sm
- Header: bg `#FFFFFF`, title `#0F172A`, subtitle muted `#475569`

Typography:
- Title: 17/22 SemiBold (SF Pro/Roboto)  
- Subtitle/timestamp: 12/16 Regular, `#94A3B8`  
- Body: 16/22 Regular; Emphasis Medium for names  
- Badge count: 12/16 SemiBold, white text

Conversation List Screen layout specs:
- Header: left aligned “Messages” (H2), right action (+). Safe area top padding 16.  
- Search: full-width input, radius 12, left icon (Search), placeholder “Search messages or users”.  
- List item: container padding 12x16; grid: avatar (40) + content (name + last line) + right column (time + unread).  
- Name row: name SemiBold 16, presence dot overlay; time right-aligned 12 muted.  
- Last line: 14 muted; truncation to 1 line; icons inline if present.  
- Unread badge: pill 18–20px height, min width 20, bg sky-500, text white.

Conversation Screen layout specs:
- Header: Back (ArrowLeft), Avatar 32, Name 16 SemiBold, presence dot 8px, status text “Online” 12 muted; overflow (EllipsisVertical) right.  
- Timeline: day separators (Caption 12 muted) centered with thin divider  
- Bubbles: max-width 78% of container; 8px gap vertical; 4px intra-group gap.  
- Sent alignment right, received left; tails implied by asymmetric radius (sent: top-left 16, top-right 16, bottom-left 16, bottom-right 6; received mirrored).  
- Status icons: right of sent bubble footer: Check (sent), CheckCheck (delivered), CheckCheck blue (read).  
- Images: 200px width thumbnail inside bubble with 8px radius; caption below image in same bubble.  
- Input row: left (+), center text field, right (Send). Field grows to 4 lines max; then scrolls.  
- Safe area: bottom 16 padding; background subtle gradient optional.

Interaction & Motion:
- Send: bubble slides up 8px and fades from 0.8→1.0 over 120ms (ease-in-out); status changes when confirmed.  
- Receive: scale 0.98→1.0 with fade 0→1 over 120ms.  
- Typing: three-dot pulse loop every 250ms with 40%→100% opacity.  
- Pull-to-refresh on list: 300ms ease-in-out with spinner.

Iconography (Lucide):
- Send: `Send` (filled via background circle), Plus: `Plus`, Back: `ArrowLeft`, Overflow: `EllipsisVertical`, Checks: `Check`, `CheckCheck`, Image: `Image`.

Accessibility:
- Tap targets ≥ 44px; focus ring 2px `#CFA968` glow on interactive elements.  
- Contrast: sent text on `#2563EB` ≥ 4.5:1 using pure white text; received text on `#F3F4F6` uses `#111827`.

Empty/Edge States:
- No conversations: centered illustration placeholder, button “Start a chat”.  
- Long press on message: shows actions sheet (Copy, Retry if failed, Delete local).  
- Failed send: red outline bubble with retry icon.

Data examples for mockups:
- Names: Alex Johnson, Maya Patel.  
- Messages: short, two-line, emoji row with 24px icons.

Deliverables mapping:
- Artboards: 1) Conversation List (iPhone 13), 2) Conversation Screen (iPhone 13).  
- Components: MessageBubble, MessageInput, ConversationListItem, TypingIndicator as variants (Default, Hover, Focus, Disabled; Sent/Received; Status states).  
- Tokens: colors, radii (16/12/20), spacing (4px grid), motion (120–200ms), typography (SF Pro/Roboto).  
- Optional: Dark mode variant using brand guidelines.

### Color & Typography System (Tailwind tokens)

- Colors:  
  - Primary (sent): `#2563EB` (blue-600).  
  - Received: `#F3F4F6` (gray-100).  
  - Text on sent: `#FFFFFF`; text on received: `#111827`.  
  - Presence dot: `#10B981` (emerald-500).  
  - Accent badge: `#38BDF8` (sky-500).  
  - Background: `#FFFFFF` with subtle `#F9FAFB` surface.

- Typography:  
  - Font families per platform defaults; sizes: `text-xs/sm/base` for metadata/body; `font-semibold` for names.  
  - Line heights comfortable for multilingual scripts.

### Responsive & Accessibility

- Breakpoints: Phone-first; accommodate small to large phones.  
- A11y: Focus rings, Min 4.5:1 contrast, dynamic type friendly, larger tap targets (44px).

### Motion Guidelines

- Transitions 100–200ms, `ease-out` for entrance, `ease-in-out` for tap.  
- List updates animated subtly; typing dots looping.

### Design Assets Summary

- Components: MessageBubble, MessageInput, ConversationListItem, TypingIndicator.  
- Icons: Lucide; images via `expo-image` with caching.

### Wireframes (Blueprints)

Exported SVG blueprints (Figma-ready reference):
- Conversation List: `/docs/designs/messaging/conversation_list.svg`
- Conversation Screen: `/docs/designs/messaging/conversation_screen.svg`

Notes:
- Layouts follow tokens: colors (sent `#2563EB`, received `#F3F4F6`, presence `#10B981`, badge `#38BDF8`), radii (16/12/20), typography (SF Pro/Roboto).
- Conversation Screen demonstrates day separator, sent/received bubbles with status, typing indicator, and input bar with plus/send icons.
- Conversation List shows header with (+), search, presence dot on avatar, unread badge, timestamps, and dividers.

### Next Steps / Open Questions

- Confirm header default after login should be Conversation List (replacing temporary `/c/123`).  
- Confirm image max width and caching policy; finalize dark mode timing (post-MVP).

---
### Previous Phase Summary (Phase 01 — Setup & Auth)

Reference: `docs/operations/phases/recent/phase-01-03-reflect.md`

- Implemented `services/auth/authService.ts` and `services/auth/userProfileService.ts` with unit tests passing (4/4).
- Hardened `firestore.rules` to enforce participants-only access and user self-edit; translation cache readable.
- Expo Router adopted; `AuthProvider` at root; login flow verified on simulator.
- Outstanding: Firestore emulator tests blocked by missing local Java runtime; device E2E for auth pending.
- Stability: Medium-High; identity layer considered stable enough to proceed to Messaging Core, with environment prerequisite (Java) tracked.

### Objectives for this Phase

Deliver Supermodule 2: Messaging Core to MVP gate readiness per PRD and Dev Checklist. Specifically:
- One-on-one messaging end-to-end with real-time delivery (< 500ms on good network).
- Local persistence via SQLite; offline queue; optimistic UI.
- Presence, typing indicators, read receipts.
- Conversation list and chat UI with message input and bubbles.
- Firestore sync services (send, subscribe, status updates).
- Image send (baseline) to satisfy media requirement.

### Scope

Included in Phase 02:
- Storage layer: SQLite schema and CRUD services (`users`, `conversations`, `messages`, `messageQueue`).
- Messaging services: queue manager, Firestore sync, message orchestration, read receipts, presence/typing.
- UI: Conversation list, list item, chat screen, message bubble, message input, typing indicator.
- Basic image sharing in messages (no video/audio).

Explicitly excluded/deferred:
- Translation Engine integration (Phase 03) beyond data placeholders.
- Advanced AI features (Phase 04+).
- Group chat polish beyond minimal attribution (Group features primarily in Supermodule 5).
- Background push and lifecycle handling (Supermodule 6).

### Constraints

- Maintain architectural consistency and file structure as per `architecture.md` and `dev_checklist.md`.
- Do not regress Phase 00–01 functionality; adhere to `firestore.rules`.
- Follow Expo SDK 54 + Firebase 10.x; SQLite via `expo-sqlite`.

### Deliverables

- Services: `services/storage/schema.ts`, `services/storage/sqliteService.ts`, `services/messaging/queueManager.ts`, `services/messaging/firestoreSync.ts`, `services/messaging/messageService.ts`, `services/messaging/readReceiptService.ts`, `services/messaging/presenceService.ts`, `services/messaging/typingService.ts`, `services/messaging/conversationService.ts`.
- UI: `components/chat/MessageBubble.tsx`, `components/chat/MessageInput.tsx`, `components/chat/ConversationListItem.tsx`, `components/chat/TypingIndicator.tsx`, screens `app/(tabs)/conversations.tsx`, `app/conversation/[id].tsx`.
- Documentation: This consolidated plan with Plan and Design sections appended.
- Testing: Unit coverage for services; manual E2E for messaging basics.

### Risks & Assumptions

- Assumption: Auth/session stable; user profile with `preferredLanguage` available.
- Assumption: Firestore indexes and rules sufficient for queries outlined.
- Risk: Local Java requirement could block emulator-based tests; mitigation: proceed with device/manual validation and add Java install step in dependency checklist.
- Risk: Performance jank with large lists; mitigation: FlatList virtualization and message pagination from day one.

### Testing Focus (this phase)

- Unit: SQLite CRUD, queue logic, message status transitions, Firestore sync happy-path and failure handling.
- Integration: Send/receive between two devices; offline queue processing; read receipts propagation.
- E2E: One-on-one chat; app restart persistence.

### Implementation Plan (high-level)

1) Define SQLite schema and implement storage service.  
2) Implement queue manager and Firestore sync services.  
3) Implement message service orchestration with optimistic UI.  
4) Build chat UI components and screens; wire listeners.  
5) Add presence/typing and read receipts.  
6) Add basic image sending.  
7) Tests and MVP validation.

### Expected Outcome / Definition of Done

- Achieve MVP gate criteria related to Messaging Core as defined in PRD and Checklist P0 stories P0-1 → P0-6, P0-10 (excluding notifications which are covered in Supermodule 6).
- No regressions in Setup & Auth; app remains crash-free; messages persist locally.

### Checkpoint Readiness Summary

Dependencies aligned (Auth, Rules, Project setup). Environment prerequisite (Java) noted for emulator; not blocking device/manual tests. Ready to proceed to detailed Plan and Design.

---


