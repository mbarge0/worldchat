# Context — WorldChat

## 1. Project Overview
WorldChat is a mobile messaging app that eliminates language barriers by embedding AI translation and cultural context directly into conversations. Target users are travelers, language learners, and cross-cultural communicators. The AI-first goal is to deliver WhatsApp-grade messaging with seamless, secure, real-time translation that preserves tone and context, enabling authentic multilingual relationships.

## 2. Architecture Summary
- Platform: React Native + Expo SDK 54 (RN 0.76) — iOS/Android (mobile-only)
- Backend: Firebase (Auth, Firestore, Cloud Functions, Cloud Messaging, Storage)
- Local Persistence: Expo SQLite (offline-first, queue + sync)
- AI/Translation: Google Cloud Translation API; LLM via Cloud Functions for cultural hints + formality detection
- Notifications: FCM/APNs (deep links, badges, muted threads)
- Security: Firestore Rules (participants-only access, profile self-edit, read receipt visibility), Functions rate limit (5 req/min)
- Env/Config: EXPO_PUBLIC_* env vars for client config; `config/firebase.ts` with AsyncStorage persistence

## 3. Active Sprint / Phase
- Sprint: MVP Week (Days 1–7)
- Deliverables:
  - P0: Auth + 1:1 messaging + group chat (3+) + offline queue + optimistic UI + presence/typing + read receipts + image send + foreground notifications
  - P1: Translation Engine (auto-translate per recipient, cache, auto-detect, dual-language bubbles)
  - P1 (AI subset): Cultural hints + formality detection
  - Ops: Security Rules, Notifications deep link, Performance targets, RTL checks
- Tasks in focus (now):
  - Expo runtime stabilization (TurboModuleRegistry, AppEntry) — fixed with root index.js + prebuild
  - Firebase init with AsyncStorage persistence — complete
  - Regression Manifest and UI Guidelines — generated
  - Context file — generating now

## 4. Known Issues / Blockers
- iOS native build requires CocoaPods (not installed on host). Workaround: Expo Go for development; native run requires pods install.
- Package version alignment: ensure React Native matches Expo SDK; use `expo install` for native deps.
- Notifications require device permissions; simulator variances (badge, push) must be validated on devices.
- Cost/Quota risks: Translation and LLM quotas; add rate limiting and cache validation.

## 5. Prompts and Workflows in Use
- System Prompts:
  - Context Loop: `/prompts/system/00_d_context_generation.md`
  - Master Regression Manifest Generator: `/prompts/system/utilities/10_regression_manifest.md`
  - UI Guidelines (Branded + Motion): `/prompts/system/utilities/11_design_guidelines.md`
- Literal Prompts (Foundation):
  - PRD generation, architecture planning, checklist generation, regression checklist, design guidelines
- Active Docs (reference):
  - `/docs/foundation/prd.md`, `/docs/foundation/architecture.md`, `/docs/foundation/dev_checklist.md`, `/docs/foundation/user_flow.md`
  - `/docs/operations/regression/00_master_regression_manifest.md`, `/docs/operations/ui-guidelines.md`

## 6. Checkpoint Tag
- Last stable checkpoint: prebuild complete; Firebase init integrated; regression + UI guidelines generated
- Timestamp: ${new Date().toISOString()}

# End of context.md — generated ${new Date().toISOString()}
