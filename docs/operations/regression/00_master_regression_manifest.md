# 🧭 Master Regression Manifest

## Overview
This document defines all regression testing expectations across the WorldChat project lifecycle. It identifies the features introduced by each phase and specifies which prior systems must remain functional after new development.

Scope confirmed: iOS and Android via Expo SDK 54 (React Native 0.76). Environments: Local (Expo Go), Staging Firebase, Production Firebase. Web excluded.

---

## Phase Summary Table
Each phase is listed with its respective core features, regression scope, and dependencies at a high level.

| Phase | Core Features Introduced | Regression Scope | Dependencies |
|-------|---------------------------|------------------|--------------|
| Phase 00 – Project Initialization | Repo setup, Expo/Next dual setup, env config, CI hooks | N/A (baseline) | Toolchain, package graph |
| Phase 01 – Setup & Auth | Email/password auth, onboarding, profile (displayName, preferredLanguage, photo), persistent auth | Phase 00 baseline remains stable | Firebase project, SecureStore/AsyncStorage |
| Phase 02 – Messaging Core | 1:1 chat, group chat (3+), SQLite sync, optimistic UI, presence/typing, read receipts, image send | Phases 00–01 continue to function | Firestore, SQLite, Notifications (preview) |
| Phase 03 – Translation Engine | Auto-translate per recipient, Firestore cache, auto-detect language, dual-language UI + “View Original” | Phases 00–02 remain functional | Cloud Functions, Google Cloud Translation |
| Phase 04 – Notifications & Lifecycle | Foreground/background push, deep-link to conversation, badges, muted threads | Phases 00–03, especially message delivery and ordering | FCM/APNs, device permissions |
| Phase 05 – AI Intelligence (Core) | Cultural hints, formality detection (AI) | Phases 00–04 regression intact | Cloud Functions (AI), LLM provider |
| Phase 06 – Security & Rules | Firestore security: participants-only access, profile self-edit, read receipt visibility, rate limiting (5 req/min) | Phases 00–05 do not regress under stricter rules | Firestore Rules, Admin/Emulator |
| Phase 07 – Performance & Resilience | SLAs: <500ms msg latency, ≥70% translation cache hit, 100% offline queue reliability, 95% crash-free | Phases 00–06 must meet SLAs | Observability, emulator load patterns |
| Phase 08 – RTL & i18n Edge Cases | RTL rendering (Arabic/Hebrew), mixed-language bubbles, dual-render correctness | Phases 00–07 UI does not regress | Font/RTL settings |
| Phase 09 – Device/App States | Cold/warm start, >24h background, kill+pending notifications, loss/reconnect | Phases 00–08 continue to pass | AppState, NetInfo |

---

## Phase Details

### Phase 00 – Project Initialization
**Introduced Features:**
- Repo initialization, Expo (SDK 54) configuration
- Environment variable structure (.env with EXPO_PUBLIC_* keys)
- Basic build scripts, linting, CI pre-checks

**Regression Scope:**
- N/A (baseline definition)

**Dependencies:**
- Tooling versions, Node/PNPM alignment, Expo CLI

---

### Phase 01 – Setup & Auth
**Introduced Features:**
- Email/password auth
- Onboarding with language selection
- Profile: displayName, preferredLanguage, profilePhoto
- Persistent auth via AsyncStorage

**Regression Scope:**
- Phase 00: project builds, env loaded, crash-free startup

**Dependencies:**
- Firebase Auth, Firestore (users), AsyncStorage

---

### Phase 02 – Messaging Core
**Introduced Features:**
- One-on-one and group messaging (3+)
- Local persistence via SQLite; Firestore sync
- Optimistic UI; read receipts; presence/typing
- Image send (no video/voice)
- Ordering by timestamp; dedup by messageId

**Regression Scope:**
- Phase 01: auth/session stability across navigation and restarts
- Phase 00: app starts crash-free; env variables loaded

**Dependencies:**
- Firestore collections (`conversations`, `messages`), SQLite schema, device media permissions

---

### Phase 03 – Translation Engine
**Introduced Features:**
- Auto-translation per recipient with Firestore cache
- Google Translation API auto-detect fallback
- Dual-language bubble (receiver) + “View Original” toggle

**Regression Scope:**
- Phases 01–02: messaging continues to work; message ordering intact
- Cache does not cause duplicates or stale translations

**Dependencies:**
- Cloud Functions (translate), Firestore (`translationCache`), Google APIs

---

### Phase 04 – Notifications & Lifecycle
**Introduced Features:**
- Foreground/background push notifications via FCM/APNs
- Deep-link to conversation screen
- Badge counts and muted threads

**Regression Scope:**
- Phases 02–03: message delivery visible in UI; translated content still accurate when opening from notification
- Auth/session continuity when launched from push

**Dependencies:**
- Expo Notifications, device permissions, platform notification services

---

### Phase 05 – AI Intelligence (Core)
**Introduced Features:**
- Cultural hints
- Formality detection

**Regression Scope:**
- Phases 02–04: AI augmentations never block core messaging
- Translation and notifications remain unaffected by AI latency/failures

**Dependencies:**
- Cloud Functions (AI), LLM provider credentials and quotas

---

### Phase 06 – Security & Rules
**Introduced Features:**
- Firestore rules enforcing: profile self-edit only; participants-only conversation/message access; read receipts visible to participants; public translation cache
- Rate limiting: 5 req/min per user for Functions

**Regression Scope:**
- Phases 01–05: authorized paths work; unauthorized paths are blocked without breaking UX

**Dependencies:**
- Firestore Rules, Firebase Emulator for validation

---

### Phase 07 – Performance & Resilience
**Introduced Features:**
- Targets: <500 ms message latency; ≥70% translation cache hit; 100% offline queue reliability on reconnect; 95% crash-free sessions

**Regression Scope:**
- Phases 02–06 meet SLAs under normal and constrained networks

**Dependencies:**
- Emulator network throttling, Crashlytics/monitoring

---

### Phase 08 – RTL & i18n Edge Cases
**Introduced Features:**
- RTL rendering validation (Arabic/Hebrew)
- Mixed-language bubble correctness

**Regression Scope:**
- Phases 03–07: translation UI correct, no layout regressions with RTL

**Dependencies:**
- RTL font settings, directionality toggles

---

### Phase 09 – Device/App States
**Introduced Features:**
- Cold start, warm start, background > 24h
- Killed app with pending notifications
- Network loss/reconnect lifecycle

**Regression Scope:**
- Phases 02–08: no data loss; queue drains; deep links remain functional; presence & typing recover

**Dependencies:**
- AppState/NetInfo listeners, Expo relaunch behavior

---

## Notes
- This manifest defines what must be verified, not what was verified.
- Regression outcomes are documented per-phase in the corresponding debug files.
- Update this manifest only when the project’s phase structure or dependencies change.
