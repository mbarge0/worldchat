## Phase Overview

- Phase: 01 — Supermodule 1: Setup & Auth
- Date: 2025-10-20
- Mode: Consolidated Plan (Start → Plan → Design)
- References:
  - PRD: `/docs/foundation/prd.md`
  - Architecture: `/docs/foundation/architecture.md`
  - Tech Stack: `/docs/foundation/tech_stack.md`
  - User Flow: `/docs/foundation/user_flow.md`
  - Development Checklist: `/docs/foundation/dev_checklist.md`
  - UI Guidelines: `/docs/operations/ui-guidelines.md`
  - Regression Manifest: `/docs/operations/regression/00_master_regression_manifest.md`

---

## Start

### Previous Phase Summary (Phase 00 – Project Initialization)
- Baseline established: Repo structure, Expo SDK configuration, environment variable scaffolding, basic lint/build scripts, and CI pre-checks.
- Target platforms: iOS and Android via Expo SDK 54; Web excluded for now.
- Baseline must remain stable: app starts crash-free; env variables read correctly; build/run flows consistent across machines.

### Objectives for This Phase (Supermodule 1: Setup & Auth)
- Implement end-to-end authentication and onboarding:
  - Email/password auth (sign-up/sign-in/sign-out)
  - Auth state persistence across app restarts (SecureStore/AsyncStorage)
  - Login and Sign-up screens with validation
  - Language selection onboarding and user profile creation
  - Auth Context and protected navigation
  - Firestore security rules for users/conversations/messages (initial pass)

### Scope (Included)
- Module 1.1 Project Initialization (completion/verification): env typing, Firebase config.
- Module 1.2 Firebase Authentication: service, login, signup, auth context.
- Module 1.3 User Profile & Onboarding: language selection, profile service, profile screen.
- Module 1.4 Firestore Security Rules: write rules, validate with emulator.

### Out of Scope (Deferred)
- Messaging Core (Supermodule 2), Translation Engine (Supermodule 3), Notifications & AI features.
- Social login (Google/Apple) and password reset flows (optional future enhancement).

### Deliverables
- Code:
  - `config/env.ts` (typed env), `config/firebase.ts` (initialized app)
  - `services/auth/authService.ts`
  - `app/auth/login.tsx`, `app/auth/signup.tsx`, `app/contexts/AuthContext.tsx`
  - `app/auth/language-setup.tsx`, `services/auth/userProfileService.ts`, `app/(tabs)/profile.tsx`
  - `firestore.rules`
- Tests:
  - Unit tests for auth service and user profile service
  - Emulator-based validation of rules
- Docs:
  - Updated README setup notes (auth/env)

### Constraints
- Maintain repo conventions and file structure; no breaking changes to baseline startup.
- Follow UI guidelines, accessibility, and tokenized design.
- Ensure idempotent environment setup steps (team-ready).

### Risks & Assumptions
- Assumes Firebase project access and API keys available (staging).
- Network variability; emulator availability for rules testing.
- Risk: misconfigured env keys causing silent auth failures → mitigate with startup validation and explicit runtime checks.

### Testing Plan (Phase-level)
- Unit: `services/auth/authService.ts`, `services/auth/userProfileService.ts`
- Integration: Auth flow with Firebase Emulator (sign-up → language setup → profile read)
- E2E (manual): iOS + Android physical devices for sign-in/out and persistence

### Step-by-Step Implementation (High-level)
1) Confirm env typing and Firebase initialization. 2) Build `authService`. 3) Implement `AuthContext` and route guards. 4) Build `login.tsx` and `signup.tsx` with validation. 5) Implement `language-setup.tsx` and `userProfileService.ts`. 6) Build `profile.tsx`. 7) Write and validate `firestore.rules`. 8) Unit/integration tests. 9) README updates.

### Expected Outcome
- Users can register, log in, persist session, select language, and view/edit basic profile. Unauthorized users are blocked from protected screens. Rules enforce profile self-edit only.

### Checkpoint Readiness Summary
- Dependencies aligned (Firebase project, Expo SDK, env structure). Objectives map directly to Supermodule 1 checklist. Ready to proceed with the Plan loop.

---

## Plan

### Overview
- Phase Goal: Complete Supermodule 1 (Setup & Auth) to MVP-readiness.
- Timebox: 1–1.5 days (P0 focus). 10 tasks spanning setup, UI, services, and rules.

### Task Summary (Effort: S < 2h, M 2–4h, L 4–8h)
- 1.1.4 Create Environment Configuration — S
- 1.2.1 Implement Auth Service — M
- 1.2.2 Create Login Screen — M
- 1.2.3 Create Sign-Up Screen — M
- 1.2.4 Implement Auth State Management — M
- 1.3.1 Create Language Selection Screen — M
- 1.3.2 Implement User Profile Service — M
- 1.3.3 Create Profile Screen — M
- 1.4.1 Write Firestore Security Rules — M
- 1.4.2 Test Security Rules — S

### Dependency Graph (ASCII)
```
Env(1.1.4)
   ↓
AuthSvc(1.2.1) → AuthState(1.2.4)
   ↓                ↓
Login(1.2.2)   SignUp(1.2.3) → Language(1.3.1) → ProfileSvc(1.3.2) → ProfileUI(1.3.3)
                                        ↓
                               Rules(1.4.1) → RulesTest(1.4.2)
```

### Task Breakdown with PRD/Checklist Mapping
- 1.1.4 Environment Configuration (Checklist 1.1.4)
  - Output: `config/env.ts`, `.env.example`
  - Acceptance: typed env; secrets excluded; keys accessible via import
- 1.2.1 Auth Service (Checklist 1.2.1; PRD Auth section)
  - Output: `services/auth/authService.ts`
  - Acceptance: signUp/signIn/signOut; token stored securely; error handling
- 1.2.2 Login Screen (Checklist 1.2.2; PRD Onboarding UI)
  - Output: `app/auth/login.tsx`
  - Acceptance: email/password inputs; validation; loading/error states
- 1.2.3 Sign-Up Screen (Checklist 1.2.3)
  - Output: `app/auth/signup.tsx`
  - Acceptance: email/pw/confirm/displayName; strength meter; nav to language setup
- 1.2.4 Auth State Management (Checklist 1.2.4)
  - Output: `app/contexts/AuthContext.tsx`
  - Acceptance: `user`, `loading`, `signIn`, `signUp`, `signOut`; route protection
- 1.3.1 Language Selection (Checklist 1.3.1)
  - Output: `app/auth/language-setup.tsx`
  - Acceptance: searchable picker (100+ languages); persists selection
- 1.3.2 User Profile Service (Checklist 1.3.2)
  - Output: `services/auth/userProfileService.ts`
  - Acceptance: create/update profile; includes email, displayName, preferredLanguage, profilePictureUrl, createdAt
- 1.3.3 Profile Screen (Checklist 1.3.3)
  - Output: `app/(tabs)/profile.tsx`
  - Acceptance: view/edit name + language; image picker; logout
- 1.4.1 Firestore Rules (Checklist 1.4.1; PRD Security)
  - Output: `firestore.rules`
  - Acceptance: self-profile R/W; conversation access limited to participants; message write constraints
- 1.4.2 Test Rules (Checklist 1.4.2)
  - Output: Emulator tests + notes
  - Acceptance: unauthorized denied; authorized allowed; edge cases covered

### Critical Path
Env → AuthSvc → AuthState → SignUp → Language → ProfileSvc → ProfileUI → Rules/RulesTest

### Risk Mitigation
- Env drift: enforce `.env.example`, runtime validation, and typed `env.ts`.
- Auth persistence bugs: add unit tests for token storage; manual restart tests.
- Rules regressions: use Emulator with scripted cases; least-privilege defaults.
- UI validation errors: centralize validators; display inline errors with clear affordances.

### Regression Plan (per Master Manifest)
- Must preserve Phase 00 baseline:
  - App startup remains crash-free with env correctly loaded.
  - Build/install flows unchanged.
- Areas at risk:
  - Navigation boot flow (auth gate) could affect initial rendering.
  - Firebase initialization; ensure single-app init.
- Regression checks to add:
  - Cold start without network still reaches login screen.
  - Missing/invalid env prompts actionable error state without crash.

### Success Metrics
- Auth flow success rate: 100% for valid credentials across iOS/Android.
- Session persistence: user remains logged in across app restart 100% of attempts.
- Rules: 100% unauthorized attempts denied in emulator tests; authorized pass.

### Checkpoint Schedule
- CP1: Env + Firebase init verified.
- CP2: Auth service + context integrated; login works.
- CP3: Sign-up → language setup → profile saved.
- CP4: Rules validated in emulator; README updated.

### Next Steps
1) Finalize env typing and Firebase init. 2) Build `authService`. 3) Implement `AuthContext` and route guards. 4) Create login/signup screens. 5) Build language setup + profile service + profile screen. 6) Write and test Firestore rules. 7) Tests + docs.

---

## Design

### Phase Context
- Scope: Auth UI (login, signup), onboarding (language selection), profile screen, and core states.
- References: UI tokens and patterns from `/docs/operations/ui-guidelines.md`.

### Visual Objectives
- Clarity-first, calm motion, WCAG AA+, token-driven styling, consistent 8px grid.

### Layout Descriptions (Text Wireframes)

Login (`app/auth/login.tsx`)
```
[Header: WorldChat]                
[Card]
  [Email Input]
  [Password Input  ••••••]
  [Forgot password?]
  [Sign In Button]
  [Divider]
  [Go to Sign Up]
```

Sign Up (`app/auth/signup.tsx`)
```
[Header]
[Card]
  [Email]
  [Password  ••••••  (strength meter)]
  [Confirm Password]
  [Display Name]
  [Create Account]
```

Language Setup (`app/auth/language-setup.tsx`)
```
[Header]
[Search Input]
[Scrollable List of Languages]
[Get Started]
```

Profile (`app/(tabs)/profile.tsx`)
```
[Header]
[Avatar + Change]
[Display Name   (editable)]
[Email (readonly)]
[Preferred Language  (picker)]
[Save]   [Log Out]
```

### Component Specifications (states)
- Inputs: base, focus (accent ring), error (red border/text), disabled.
- Buttons: primary, secondary, subtle; hover/active/focus/disabled states per guidelines.
- Loaders: inline spinners during auth requests; skeleton for profile load.
- Validation: inline error text under fields; password strength meter (weak/ok/strong).
- Accessibility: labels, `aria-*` where applicable, larger hit targets on mobile.

### Color & Typography System (from UI Guidelines)
- Colors: brand primary (dark blue), accent (gold), surface/background, semantic tokens.
- Typography: Inter/Geist; `text-2xl` headers; `text-base` body; `text-sm` muted.
- Spacing: 8px increments; `rounded-md` inputs; `rounded-lg` cards; shadows per tokens.

### Motion & Interaction
- Button hover fade 100ms; active scale 0.97; focus ring gold glow offset 2px.
- Screen transitions: fade/slide 200ms; respect `prefers-reduced-motion`.

### Responsive & Accessibility
- Breakpoints: Tailwind defaults; comfortable touch targets ≥44px.
- Contrast AA+; clear focus states; keyboard navigation for inputs.

### Design Assets Summary
- Components: Button, Input, Card, Modal (if needed), Picker.
- Icons: Lucide for basic actions if needed.
- Tokens: color, spacing, motion as per UI guidelines.

### Open Questions / Confirmation Before Build
- Do we include password reset in MVP? (Proposed: defer.)
- Social login providers? (Proposed: defer; email/pw only now.)

---

## Checkpoint Summary (Readiness)
- Alignment confirmed with PRD, Architecture, Checklist (Supermodule 1).
- Scope and deliverables defined with explicit mappings and tests.
- Regression considerations noted; baseline protected. Ready to begin build execution of Supermodule 1 tasks.


