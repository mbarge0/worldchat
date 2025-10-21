# Phase 02 — Regression Checklist (Messaging Core)

References:
- Master Manifest: `docs/operations/regression/00_master_regression_manifest.md`
- Dev Checklist: `docs/foundation/dev_checklist.md`

Scope: Verify prior phases remain functional after Messaging Core changes.

## Phase 00 — Project Initialization

- [ ] App launches crash-free on iOS and Android (Expo Go)
- [ ] Env vars load (Firebase config present)
- [ ] No runtime redboxes on cold start

## Phase 01 — Setup & Auth

- [ ] Email/password login and logout work
- [ ] Profile read/write (`displayName`, `preferredLanguage`) works
- [ ] Auth persists across app restart (AsyncStorage)
- [ ] Guarded navigation: unauthenticated → login; authenticated → Conversations

## Messaging Core Interactions (Sanity)

- [ ] Navigate to `/(tabs)/conversations` after login
- [ ] Open `conversation/[id]` route without errors
- [ ] DB initialization runs once; no duplicate table errors

## Security Rules (quick)

- [ ] Participants-only access respected for conversation and message reads
- [ ] Writes only allowed by participants

## Observations / Notes

- 


