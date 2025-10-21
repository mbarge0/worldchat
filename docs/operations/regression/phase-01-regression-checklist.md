# Phase 01 – Regression Checklist (Setup & Auth)

## Scope
- Ensure Phase 00 baseline remains stable while introducing Setup & Auth features.
- Platforms: iOS and Android via Expo (SDK 54). Web excluded.

## Pre-checks
- [ ] App boots crash-free on clean install
- [ ] Env variables load (no undefined critical keys)
- [ ] Single Firebase app initialization (no duplicate warnings)

## Authentication & Onboarding
- [ ] Unauthenticated launch shows Login screen
- [ ] Login (valid) routes to default authenticated entry (conversations/profile)
- [ ] Login (invalid) shows inline error without crash
- [ ] Sign-up creates Firebase Auth user
- [ ] Post sign-up navigates to Language Setup
- [ ] Language selection persists to Firestore `users/{uid}.preferredLanguage`
- [ ] Profile document created with required fields (email, displayName, preferredLanguage, createdAt)
- [ ] Logout returns to Login
- [ ] Session persists across app restart

## UI/UX Consistency
- [ ] Buttons, inputs, spacing follow `/docs/operations/ui-guidelines.md`
- [ ] Focus rings visible; contrast AA+
- [ ] Touch targets ≥44px

## Firestore Security Rules (Emulator)
- [ ] Self profile read/write allowed
- [ ] Other users' profiles write denied
- [ ] Conversations readable only if participant
- [ ] Messages write denied if not a participant
- [ ] Translation cache readable by authenticated

## Navigation & Routing
- [ ] Auth guard redirects unauthenticated users to Login
- [ ] Authenticated users reach default route after login
- [ ] Deep links (if any) still reach intended screens (sanity pass)

## Performance & Stability
- [ ] No memory leaks observed on login/logout loops
- [ ] No repeated listener warnings

## Notes
- Record any deviations and link fixes in `phase-01-02-build.md` Debug section.
