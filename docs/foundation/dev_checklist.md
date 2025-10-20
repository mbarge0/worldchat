# Development Checklist: WorldChat

**Document Version:** 1.0  
**Project:** WorldChat  
**Platform:** React Native + Expo + Firebase  
**Sprint Duration:** 7 days  
**Last Updated:** October 20, 2025

---

## 1. Overview

This development checklist translates the WorldChat PRD and Architecture into a structured, actionable execution plan. Every task is independently verifiable and mapped to specific acceptance criteria, dependencies, and testing expectations.

### Checklist Scope

**Total Tasks:** 94 actionable items  
**Organization:** 6 Supermodules → Modules → Phases → Tasks  
**Phases:**
- `[Plan]` — Planning, setup, and configuration
- `[Build]` — Implementation of features and functionality
- `[Debug]` — Bug fixing and issue resolution
- `[Validate]` — Testing and quality assurance

### Foundation Documents

- **PRD:** `/docs/foundation/prd.md`
- **Architecture:** `/docs/foundation/architecture.md`
- **Tech Stack:** `/docs/foundation/tech_stack.md`
- **User Flow:** `/docs/foundation/user_flow.md`
- **Project Overview:** `/docs/foundation/project_overview.md`

### MVP Gate (24 Hours)

The first checkpoint validates core messaging infrastructure:
- ✅ One-on-one chat with real-time delivery
- ✅ Message persistence (survives app restart)
- ✅ Optimistic UI updates
- ✅ Online/offline presence indicators
- ✅ Read receipts and timestamps
- ✅ User authentication
- ✅ Basic group chat (3+ users)
- ✅ Foreground push notifications
- ✅ Deployed Firebase backend

---

## 2. Structure (Supermodule Overview)

| Supermodule | Tasks | Priority | Dependencies |
|---|---|---|---|
| **Setup & Auth** | 12 tasks | P0 (MVP Gate) | None |
| **Messaging Core** | 24 tasks | P0 (MVP Gate) | Setup & Auth |
| **Translation Engine** | 14 tasks | P1 | Messaging Core |
| **AI Intelligence Layer** | 18 tasks | P1 | Translation Engine |
| **Group Chat & Collaboration** | 10 tasks | P0/P1 | Messaging Core |
| **Notifications & Lifecycle** | 16 tasks | P0/P1 | Messaging Core |

**Total:** 94 tasks across 6 supermodules

---

## 3. Supermodule 1: Setup & Auth

**Purpose:** User onboarding, authentication, and language preference configuration  
**Dependencies:** None (entry point)  
**Milestone:** Users can register, log in, and configure language preferences

### Module 1.1: Project Initialization

#### [Plan] Task 1.1.1: Initialize Expo Project

**Description:** Create new Expo project with TypeScript template  
**Acceptance Criteria:**
- Expo SDK 50+ initialized
- TypeScript configured with strict mode
- Project structure matches architecture (`/app`, `/components`, `/services`, `/types`)
- Git repository initialized with `.gitignore`

**Dependencies:** None  
**Testing:** Run `npx expo start` and verify app launches with default screen

**Command:**
```bash
npx create-expo-app worldchat --template expo-template-blank-typescript
```

---

#### [Plan] Task 1.1.2: Install Core Dependencies

**Description:** Install Firebase SDK, navigation, and essential libraries  
**Acceptance Criteria:**
- Firebase SDK (10.x) installed and configured
- React Navigation (6.x) installed
- Expo SQLite, SecureStore, Notifications installed
- All dependencies in `package.json` with locked versions

**Dependencies:** Task 1.1.1  
**Testing:** Run `npm install` without errors; verify imports work

**Packages:**
```json
{
  "firebase": "^10.x",
  "@react-navigation/native": "^6.x",
  "@react-navigation/stack": "^6.x",
  "expo-sqlite": "~13.x",
  "expo-secure-store": "~12.x",
  "expo-notifications": "~0.27.x",
  "expo-image-picker": "~14.x"
}
```

---

#### [Plan] Task 1.1.3: Configure Firebase Project

**Description:** Set up Firebase project and enable required services  
**Acceptance Criteria:**
- Firebase project created in Firebase Console
- Firestore, Auth, Cloud Functions, FCM, Storage enabled
- iOS and Android apps registered
- `firebase.json` and `firebaserc` configured

**Dependencies:** Task 1.1.2  
**Testing:** Deploy test Cloud Function; verify Firebase Console shows services active

---

#### [Plan] Task 1.1.4: Create Environment Configuration

**Description:** Set up environment variables for Firebase and feature flags  
**Acceptance Criteria:**
- `.env` file created with Firebase config
- `config/env.ts` module exports typed environment variables
- `.env.example` documented for team setup
- Secrets excluded from Git via `.gitignore`

**Dependencies:** Task 1.1.3  
**Testing:** Import `env.ts`; verify all Firebase keys accessible

**File:** `config/env.ts`

---

### Module 1.2: Firebase Authentication

#### [Build] Task 1.2.1: Implement Auth Service

**Description:** Create authentication service with Firebase Auth integration  
**Acceptance Criteria:**
- `services/auth/authService.ts` implements sign up, log in, log out
- JWT token stored in Expo SecureStore
- Auth state persists across app restarts
- Error handling for network failures, invalid credentials

**Dependencies:** Task 1.1.4  
**Testing:** Unit test auth methods; verify token storage with SecureStore

**File:** `services/auth/authService.ts`

---

#### [Build] Task 1.2.2: Create Login Screen

**Description:** Build login UI with email/password input  
**Acceptance Criteria:**
- Login screen with email and password TextInputs
- Input validation (email regex, password min 6 chars)
- Loading spinner during authentication
- Error messages displayed for failed login

**Dependencies:** Task 1.2.1  
**Testing:** Manual QA on iOS/Android; test invalid credentials

**File:** `app/auth/login.tsx`

---

#### [Build] Task 1.2.3: Create Sign-Up Screen

**Description:** Build registration UI with email, password, display name  
**Acceptance Criteria:**
- Sign-up form with email, password, confirm password, display name
- Client-side validation before submission
- Navigation to language setup after successful registration
- Password strength indicator

**Dependencies:** Task 1.2.1  
**Testing:** Create test account; verify user document in Firestore

**File:** `app/auth/signup.tsx`

---

#### [Build] Task 1.2.4: Implement Auth State Management

**Description:** Create React Context for global auth state  
**Acceptance Criteria:**
- `AuthContext` provides `user`, `loading`, `signIn`, `signUp`, `signOut`
- Auth state syncs with Firebase `onAuthStateChanged`
- Protected routes redirect to login when unauthenticated
- Token refresh handled automatically

**Dependencies:** Task 1.2.1  
**Testing:** Navigate app while logged in/out; verify route protection

**File:** `app/contexts/AuthContext.tsx`

---

### Module 1.3: User Profile & Onboarding

#### [Build] Task 1.3.1: Create Language Selection Screen

**Description:** Build onboarding screen for preferred language selection  
**Acceptance Criteria:**
- Picker displaying 100+ languages (ISO 639-1 codes)
- Search/filter functionality for languages
- "Get Started" button enabled after selection
- Language stored in user profile

**Dependencies:** Task 1.2.3  
**Testing:** Select language; verify written to Firestore `users/{userId}.preferredLanguage`

**File:** `app/auth/language-setup.tsx`

---

#### [Build] Task 1.3.2: Implement User Profile Service

**Description:** Service for creating and updating user profiles in Firestore  
**Acceptance Criteria:**
- `createUserProfile(userId, data)` writes to Firestore
- `updateUserProfile(userId, updates)` updates fields
- Profile includes: email, displayName, preferredLanguage, profilePictureUrl, createdAt
- Profile creation integrated into sign-up flow

**Dependencies:** Task 1.3.1  
**Testing:** Create profile; query Firestore; verify all fields present

**File:** `services/auth/userProfileService.ts`

---

#### [Build] Task 1.3.3: Create Profile Screen

**Description:** User profile view with display name, email, language, profile picture  
**Acceptance Criteria:**
- Display user information
- Edit display name and preferred language
- Upload profile picture via Expo Image Picker
- Log out button

**Dependencies:** Task 1.3.2  
**Testing:** Update profile; verify changes sync to Firestore

**File:** `app/(tabs)/profile.tsx`

---

#### [Validate] Task 1.3.4: Test Complete Auth Flow

**Description:** End-to-end testing of authentication and onboarding  
**Acceptance Criteria:**
- New user can sign up → select language → reach conversation list
- Returning user can log in directly
- Auth persists across app restarts
- Profile data accessible throughout app

**Dependencies:** Tasks 1.2.1-1.3.3  
**Testing:** E2E test with fresh install; verify all steps complete

---

### Module 1.4: Firestore Security Rules

#### [Build] Task 1.4.1: Write Firestore Security Rules

**Description:** Implement security rules for users, conversations, messages  
**Acceptance Criteria:**
- Users can read/write their own profile
- Users can read conversations where they're participants
- Users can create messages only in conversations they're in
- Translation cache readable by authenticated users

**Dependencies:** Task 1.1.3  
**Testing:** Test unauthorized access; verify denied

**File:** `firestore.rules`

---

#### [Validate] Task 1.4.2: Test Security Rules

**Description:** Validate security rules with Firebase Emulator  
**Acceptance Criteria:**
- Rules tested for all collections
- Unauthorized read/write operations blocked
- Authorized operations succeed
- Edge cases tested (user leaving group, etc.)

**Dependencies:** Task 1.4.1  
**Testing:** Run `firebase emulators:start` with test suite

---

---

## 4. Supermodule 2: Messaging Core

**Purpose:** Real-time chat infrastructure with offline support  
**Dependencies:** Setup & Auth  
**Milestone:** MVP Gate - One-on-one messaging works end-to-end

### Module 2.1: Local Storage (SQLite)

#### [Build] Task 2.1.1: Create SQLite Database Schema

**Description:** Define SQLite schema for messages, conversations, queue  
**Acceptance Criteria:**
- Tables: `users`, `conversations`, `messages`, `messageQueue`
- Indexes for performance (`conversationId`, `timestamp`)
- Foreign key constraints between conversations and messages
- Schema matches architecture document

**Dependencies:** Task 1.1.2  
**Testing:** Initialize DB; verify tables created with correct columns

**File:** `services/storage/schema.ts`

---

#### [Build] Task 2.1.2: Implement SQLite Service

**Description:** Service for SQLite CRUD operations  
**Acceptance Criteria:**
- `insertMessage(message)`, `getMessagesByConversation(id)`, `updateMessage(id, updates)`
- `insertConversation(conversation)`, `getConversations()`, `updateConversation(id, updates)`
- Transactions for atomic operations
- Error handling for database failures

**Dependencies:** Task 2.1.1  
**Testing:** Unit test all CRUD operations; verify data persistence

**File:** `services/storage/sqliteService.ts`

---

#### [Build] Task 2.1.3: Create Message Queue Manager

**Description:** Service for offline message queue management  
**Acceptance Criteria:**
- `enqueueMessage(message)` adds to `messageQueue` table
- `processQueue()` attempts Firestore writes for queued messages
- Retry logic with exponential backoff (max 3 attempts)
- Deduplication prevents duplicate messages

**Dependencies:** Task 2.1.2  
**Testing:** Test offline scenario; verify queue persists and processes on reconnect

**File:** `services/messaging/queueManager.ts`

---

### Module 2.2: Firestore Sync

#### [Build] Task 2.2.1: Implement Firestore Sync Service

**Description:** Service managing Firestore write/read operations for messages  
**Acceptance Criteria:**
- `sendMessageToFirestore(message)` writes to `/conversations/{id}/messages`
- `subscribeToConversation(id, callback)` sets up real-time listener
- Returns unsubscribe function to clean up listeners
- Handles network errors gracefully

**Dependencies:** Task 2.1.2  
**Testing:** Send message; verify appears in Firestore Console

**File:** `services/messaging/firestoreSync.ts`

---

#### [Build] Task 2.2.2: Create Message Service

**Description:** High-level message service coordinating local and cloud storage  
**Acceptance Criteria:**
- `sendMessage(conversationId, text)` handles full send flow (optimistic UI, SQLite, Firestore)
- `loadMessages(conversationId)` loads from SQLite first, then syncs from Firestore
- Message status transitions: sending → sent → delivered → read
- Updates local DB when remote changes detected

**Dependencies:** Tasks 2.1.2, 2.2.1, 2.1.3  
**Testing:** Send messages; verify optimistic UI, local storage, Firestore sync

**File:** `services/messaging/messageService.ts`

---

### Module 2.3: Chat UI

#### [Build] Task 2.3.1: Create Message Bubble Component

**Description:** Reusable message bubble component for chat display  
**Acceptance Criteria:**
- Different styling for sent vs. received messages
- Displays message text, timestamp, status (checkmarks)
- Support for dual-language display (original + translation)
- Long-press menu for message actions

**Dependencies:** Task 1.1.2  
**Testing:** Render component with various message types; verify styling

**File:** `components/chat/MessageBubble.tsx`

---

#### [Build] Task 2.3.2: Create Message Input Component

**Description:** Text input component for composing messages  
**Acceptance Criteria:**
- TextInput with multiline support
- Send button (disabled when empty)
- Character counter (max 5000 chars)
- Auto-focus on conversation open

**Dependencies:** Task 1.1.2  
**Testing:** Type and send messages; verify input clears after send

**File:** `components/chat/MessageInput.tsx`

---

#### [Build] Task 2.3.3: Create Chat Screen

**Description:** Main conversation screen with message list and input  
**Acceptance Criteria:**
- FlatList rendering messages in chronological order
- Auto-scroll to bottom on new messages
- Virtualized scrolling for performance (initialNumToRender: 20)
- Load more messages on scroll to top (pagination)
- Header shows conversation name, participant status

**Dependencies:** Tasks 2.3.1, 2.3.2, 2.2.2  
**Testing:** Open conversation; send/receive messages; verify UI updates

**File:** `app/conversation/[id].tsx`

---

### Module 2.4: Conversation List

#### [Build] Task 2.4.1: Create Conversation Service

**Description:** Service managing conversation metadata and list  
**Acceptance Criteria:**
- `getConversations(userId)` queries conversations where user is participant
- `createConversation(participants)` creates new conversation document
- `updateLastMessage(conversationId, message)` updates conversation metadata
- Real-time listener for conversation list updates

**Dependencies:** Task 2.2.1  
**Testing:** Create conversations; verify list updates in real-time

**File:** `services/messaging/conversationService.ts`

---

#### [Build] Task 2.4.2: Create Conversation List Item Component

**Description:** Component displaying conversation preview in list  
**Acceptance Criteria:**
- Shows participant name/avatar
- Last message text (truncated to 50 chars)
- Timestamp formatted (e.g., "10:30 AM", "Yesterday", "May 15")
- Unread badge count
- Online/offline presence indicator

**Dependencies:** Task 1.1.2  
**Testing:** Render with various conversation states; verify formatting

**File:** `components/chat/ConversationListItem.tsx`

---

#### [Build] Task 2.4.3: Create Conversation List Screen

**Description:** Main screen displaying all user conversations  
**Acceptance Criteria:**
- FlatList of conversations sorted by `updatedAt` (most recent first)
- Pull-to-refresh functionality
- Empty state: "No conversations yet" with "Start Chat" button
- Navigation to Chat Screen on tap

**Dependencies:** Tasks 2.4.1, 2.4.2  
**Testing:** View list; create conversations; verify sorting and navigation

**File:** `app/(tabs)/conversations.tsx`

---

### Module 2.5: Presence & Typing Indicators

#### [Build] Task 2.5.1: Implement Presence Service

**Description:** Service managing user online/offline status  
**Acceptance Criteria:**
- `updatePresence(status)` writes to Firestore `/presence/{userId}`
- Updates presence on app foreground/background
- Last seen timestamp updated on disconnect
- `subscribeToPresence(userId, callback)` for real-time status

**Dependencies:** Task 2.2.1  
**Testing:** Foreground/background app; verify presence updates in Firestore

**File:** `services/messaging/presenceService.ts`

---

#### [Build] Task 2.5.2: Implement Typing Indicators

**Description:** Service managing "user is typing..." indicators  
**Acceptance Criteria:**
- `setTyping(conversationId, isTyping)` writes to Firestore presence document
- Debounced updates (throttle to 1 update/second)
- Auto-resets after 3 seconds of inactivity
- `subscribeToTyping(conversationId, callback)` for real-time updates

**Dependencies:** Task 2.5.1  
**Testing:** Type in conversation; verify typing indicator appears for recipient

**File:** `services/messaging/typingService.ts`

---

#### [Build] Task 2.5.3: Create Typing Indicator Component

**Description:** UI component displaying "User is typing..." message  
**Acceptance Criteria:**
- Animated dots (…) indicating typing activity
- Shows user's display name
- Appears at bottom of message list
- Fades out after 3 seconds of no typing

**Dependencies:** Task 2.5.2  
**Testing:** Type in one device; verify indicator appears on other device

**File:** `components/chat/TypingIndicator.tsx`

---

### Module 2.6: Read Receipts

#### [Build] Task 2.6.1: Implement Read Receipt Service

**Description:** Service managing message read status  
**Acceptance Criteria:**
- `markAsRead(messageId, userId)` updates Firestore message document
- Updates `message.readBy[userId]` with timestamp
- Batches read receipt updates (every 2 seconds max)
- `message.status` updates: sent → delivered → read

**Dependencies:** Task 2.2.2  
**Testing:** Open conversation; verify messages marked as read in Firestore

**File:** `services/messaging/readReceiptService.ts`

---

#### [Build] Task 2.6.2: Display Read Receipt Checkmarks

**Description:** Visual indicators for message delivery status  
**Acceptance Criteria:**
- Single gray checkmark: "sent"
- Double gray checkmark: "delivered"
- Double blue checkmark: "read"
- Updates in real-time via Firestore listener

**Dependencies:** Tasks 2.6.1, 2.3.1  
**Testing:** Send message; observe checkmark progression

**Component:** Updated in `MessageBubble.tsx`

---

### Module 2.7: Optimistic UI

#### [Build] Task 2.7.1: Implement Optimistic UI Updates

**Description:** Instant message rendering before server confirmation  
**Acceptance Criteria:**
- Message appears in UI immediately on send (status: "sending")
- Local message ID (UUID) generated client-side
- UI updates to "sent" when Firestore write confirms
- Failed messages show retry button

**Dependencies:** Task 2.2.2  
**Testing:** Send message with network disconnected; verify queued state

**Implementation:** Integrated in `messageService.ts`

---

#### [Validate] Task 2.7.2: Test Optimistic UI Edge Cases

**Description:** Validate optimistic UI behavior in error scenarios  
**Acceptance Criteria:**
- Message shows "failed" if Firestore write fails after 3 retries
- User can tap to retry failed messages
- Duplicate messages prevented (UUID deduplication)
- Status indicators accurate throughout lifecycle

**Dependencies:** Task 2.7.1  
**Testing:** Simulate network failures, race conditions, rapid sends

---

### Module 2.8: Image Sharing

#### [Build] Task 2.8.1: Implement Image Upload Service

**Description:** Service handling image selection and upload to Firebase Storage  
**Acceptance Criteria:**
- `pickImage()` uses Expo Image Picker for camera/gallery access
- `uploadImage(uri)` uploads to `/users/{userId}/images/{imageId}.jpg`
- Compresses images to max 1200px width before upload
- Returns public download URL

**Dependencies:** Task 1.1.2  
**Testing:** Select image; verify uploaded to Firebase Storage

**File:** `services/media/imageService.ts`

---

#### [Build] Task 2.8.2: Add Image Support to Message Bubble

**Description:** Render image messages in chat  
**Acceptance Criteria:**
- Message bubble displays image thumbnail (200px width)
- Tap to view full-screen image
- Loading indicator while image downloads
- Cached images for performance

**Dependencies:** Tasks 2.8.1, 2.3.1  
**Testing:** Send image message; verify displays and opens full-screen

**Component:** Updated `MessageBubble.tsx`

---

### Module 2.9: MVP Validation

#### [Validate] Task 2.9.1: MVP Gate Validation

**Description:** Comprehensive testing of MVP requirements  
**Acceptance Criteria:**
- ✅ One-on-one chat: Messages send and receive in real-time (< 500ms latency)
- ✅ Persistence: Messages survive app restart (SQLite + Firestore)
- ✅ Optimistic UI: Messages appear instantly on send
- ✅ Presence: Online/offline indicators update within 3 seconds
- ✅ Read receipts: Checkmarks update correctly (sent → delivered → read)
- ✅ Typing indicators: "User is typing..." appears within 1 second
- ✅ Offline queue: Messages sent offline deliver on reconnect
- ✅ Push notifications (foreground): Notification appears for new messages

**Dependencies:** All Module 2.1-2.8 tasks  
**Testing:** E2E test on 2+ physical devices; verify all criteria pass

**Checkpoint:** MVP GATE (24 Hours)

---

---

## 5. Supermodule 3: Translation Engine

**Purpose:** AI-powered translation orchestration and caching  
**Dependencies:** Messaging Core  
**Milestone:** Messages automatically translate with dual-language display

### Module 3.1: Translation Cloud Function

#### [Build] Task 3.1.1: Set Up Cloud Functions Project

**Description:** Initialize Firebase Cloud Functions with TypeScript  
**Acceptance Criteria:**
- `/functions` directory with TypeScript config
- Firebase Admin SDK initialized
- `index.ts` exports Cloud Functions
- Deployed to Firebase project

**Dependencies:** Task 1.1.3  
**Testing:** Deploy test function; invoke via client; verify response

**Command:**
```bash
cd functions && npm init && npm install firebase-functions firebase-admin
```

---

#### [Build] Task 3.1.2: Implement Google Translation API Integration

**Description:** Service calling Google Cloud Translation API  
**Acceptance Criteria:**
- API key stored in Cloud Functions environment
- `translateText(text, sourceLang, targetLang)` calls Google API
- Error handling for API failures (timeout, quota exceeded)
- Supports all ISO 639-1 language codes

**Dependencies:** Task 3.1.1  
**Testing:** Call function with test text; verify translation returned

**File:** `functions/src/services/translationService.ts`

---

#### [Build] Task 3.1.3: Create Translation Cloud Function

**Description:** Callable Cloud Function for message translation  
**Acceptance Criteria:**
- `translateMessage(data, context)` HTTP callable function
- Validates authenticated user
- Checks translation cache before API call
- Writes result to cache
- Returns translated text

**Dependencies:** Tasks 3.1.2, 3.2.1  
**Testing:** Invoke function from client; verify translation returned

**File:** `functions/src/index.ts`

---

### Module 3.2: Translation Cache

#### [Build] Task 3.2.1: Implement Translation Cache Service

**Description:** Firestore-based cache for translations  
**Acceptance Criteria:**
- Cache key: `hash(sourceText + sourceLang + targetLang)`
- `getCachedTranslation(key)` queries Firestore
- `cacheTranslation(key, data)` writes to Firestore
- TTL: 30 days (cleanup via scheduled function)

**Dependencies:** Task 3.1.1  
**Testing:** Translate text; verify cached in Firestore; re-translate hits cache

**File:** `functions/src/services/cacheService.ts`

---

#### [Build] Task 3.2.2: Create Cache Cleanup Cloud Function

**Description:** Scheduled function removing expired cache entries  
**Acceptance Criteria:**
- Runs daily via Cloud Scheduler
- Deletes entries where `expiresAt < now`
- Batch deletes (max 500 per execution)
- Logs deleted count

**Dependencies:** Task 3.2.1  
**Testing:** Manually trigger function; verify expired entries deleted

**File:** `functions/src/scheduled/cleanupCache.ts`

---

### Module 3.3: Client Translation Service

#### [Build] Task 3.3.1: Implement Client Translation Service

**Description:** Client-side service managing translation requests  
**Acceptance Criteria:**
- `requestTranslation(messageId, text, targetLang)` calls Cloud Function
- Checks if translation exists in message document first
- Updates message document with translation
- Handles network errors gracefully

**Dependencies:** Task 3.1.3  
**Testing:** Send message; verify translation requested and received

**File:** `services/translation/translationService.ts`

---

#### [Build] Task 3.3.2: Implement Language Detection

**Description:** Service detecting source language of message text  
**Acceptance Criteria:**
- Client-side basic detection using `franc` library
- Server-side validation via Google Translation API
- Stores detected language in `message.originalLanguage`
- Accuracy: 95%+ for common languages

**Dependencies:** Task 3.3.1  
**Testing:** Send messages in various languages; verify detected correctly

**File:** `services/translation/languageDetector.ts`

---

### Module 3.4: Dual-Language UI

#### [Build] Task 3.4.1: Update Message Bubble for Translation

**Description:** Modify MessageBubble component to display both languages  
**Acceptance Criteria:**
- Shows translated text prominently (larger font)
- Shows original text below (smaller, gray font)
- "Show original" / "Show translation" toggle button
- Loading indicator while translation in progress

**Dependencies:** Tasks 3.3.1, 2.3.1  
**Testing:** Receive translated message; verify both languages visible

**Component:** Updated `MessageBubble.tsx`

---

#### [Build] Task 3.4.2: Add Translation Settings

**Description:** Settings screen for translation preferences  
**Acceptance Criteria:**
- Toggle auto-translation on/off
- Change preferred language
- Toggle showing original text by default
- Settings persist in user profile

**Dependencies:** Task 3.3.1  
**Testing:** Change settings; verify translations behavior updates

**File:** `app/settings/translation.tsx`

---

### Module 3.5: Translation Integration

#### [Build] Task 3.5.1: Integrate Translation into Message Flow

**Description:** Wire translation into end-to-end message flow  
**Acceptance Criteria:**
- Sender's language detected and stored in message
- Receiver's preferred language read from profile
- Translation requested if languages differ
- Message updates in real-time when translation completes

**Dependencies:** Tasks 3.3.1, 2.2.2  
**Testing:** Send message between users with different languages

**Implementation:** Updated in `messageService.ts`

---

#### [Validate] Task 3.5.2: Test Translation Accuracy

**Description:** Validate translation quality with bilingual testers  
**Acceptance Criteria:**
- 95%+ accuracy in meaning preservation
- 90%+ accuracy in tone preservation
- Common phrases (greetings, questions) translate correctly
- No major mistranslations that change meaning

**Dependencies:** Task 3.5.1  
**Testing:** Bilingual test users validate 50+ translations

---

#### [Validate] Task 3.5.3: Test Translation Performance

**Description:** Measure translation latency and cache hit rate  
**Acceptance Criteria:**
- Cache hit: < 100ms translation response
- Cache miss: < 2s translation response
- Cache hit rate: 40-60% after first day of usage
- No failed translations (100% success rate)

**Dependencies:** Task 3.5.1  
**Testing:** Send 100 messages; measure latency; check cache hit rate in Firestore

---

### Module 3.6: Translation Edge Cases

#### [Debug] Task 3.6.1: Handle Translation Failures

**Description:** Graceful degradation when translation API fails  
**Acceptance Criteria:**
- Display original message with "Translation unavailable" notice
- Retry button for failed translations
- Logs error to Firebase Console
- User can still read original message

**Dependencies:** Task 3.5.1  
**Testing:** Simulate API failure; verify error handling

---

#### [Validate] Task 3.6.2: Test Mixed-Language Messages

**Description:** Test messages containing multiple languages  
**Acceptance Criteria:**
- English + Spanish in same message translated correctly
- Emojis preserved in translation
- URLs and numbers not translated
- Code snippets preserved

**Dependencies:** Task 3.5.1  
**Testing:** Send mixed-language messages; verify translation quality

---

---

## 6. Supermodule 4: AI Intelligence Layer

**Purpose:** LLM-powered cultural context, formality, slang, and smart replies  
**Dependencies:** Translation Engine  
**Milestone:** All 5 required AI features functional + AI chat assistant

### Module 4.1: AI Service Foundation

#### [Build] Task 4.1.1: Set Up OpenAI/Claude Integration

**Description:** Initialize LLM API clients in Cloud Functions  
**Acceptance Criteria:**
- OpenAI SDK or Anthropic SDK installed in Cloud Functions
- API keys stored in environment variables
- Test function calls OpenAI GPT-4 or Claude 3.5 Sonnet
- Error handling for API failures

**Dependencies:** Task 3.1.1  
**Testing:** Call LLM API with test prompt; verify response

**File:** `functions/src/services/aiService.ts`

---

#### [Build] Task 4.1.2: Implement RAG Context Loader

**Description:** Service loading conversation history for RAG context  
**Acceptance Criteria:**
- `loadConversationContext(conversationId)` queries last 20 messages
- Formats messages for LLM prompt injection
- Includes sender names, timestamps, language metadata
- Handles large conversations (pagination if > 20 messages)

**Dependencies:** Task 4.1.1  
**Testing:** Load context; verify last 20 messages retrieved and formatted

**File:** `functions/src/services/ragService.ts`

---

### Module 4.2: Cultural Context Hints

#### [Build] Task 4.2.1: Implement Cultural Hint Detection

**Description:** Cloud Function analyzing messages for cultural context  
**Acceptance Criteria:**
- `analyzeCulturalContext(message, conversationContext)` callable function
- LLM detects idioms, cultural references, formality mismatches
- Returns JSON: `{ hasCulturalContext, type, explanation, relevance }`
- Async processing (doesn't block message send)

**Dependencies:** Tasks 4.1.1, 4.1.2  
**Testing:** Send message with idiom; verify cultural hint generated

**File:** `functions/src/services/culturalAnalyzer.ts`

---

#### [Build] Task 4.2.2: Create Cultural Hint Badge Component

**Description:** UI badge indicating cultural context available  
**Acceptance Criteria:**
- Icon (💡 or 🌍) appears on message bubble corner
- Tappable to open hint modal
- Badge only visible when `message.hasCulturalContext === true`
- Badge style matches app design system

**Dependencies:** Task 4.2.1  
**Testing:** Receive message with hint; verify badge appears and opens modal

**File:** `components/chat/CulturalHintBadge.tsx`

---

#### [Build] Task 4.2.3: Create Cultural Hint Modal

**Description:** Modal displaying cultural context explanation  
**Acceptance Criteria:**
- Shows hint title, explanation, equivalent phrase
- Includes cultural background information
- "Got it" button to dismiss
- Markdown rendering for formatted text

**Dependencies:** Task 4.2.2  
**Testing:** Tap badge; verify modal displays hint correctly

**File:** `components/chat/CulturalHintModal.tsx`

---

### Module 4.3: Formality Detection

#### [Build] Task 4.3.1: Implement Formality Analyzer

**Description:** LLM-based formality level detection  
**Acceptance Criteria:**
- Detects formality: casual, neutral, formal
- Compares to relationship context (inferred from conversation history)
- Returns warning if mismatch detected
- Suggestion for appropriate formality

**Dependencies:** Tasks 4.1.1, 4.1.2  
**Testing:** Send formal message to friend; verify warning generated

**File:** `functions/src/services/formalityAnalyzer.ts`

---

#### [Build] Task 4.3.2: Display Formality Warnings

**Description:** UI component showing formality mismatch warnings  
**Acceptance Criteria:**
- Warning icon (⚠️) appears on message before sending
- Tap to view formality suggestion
- Option to adjust message or send anyway
- Warning persists on sent messages (recipient sees it)

**Dependencies:** Task 4.3.1  
**Testing:** Type formal message; verify warning appears before send

**Component:** Integrated in `MessageInput.tsx`

---

### Module 4.4: Slang & Idiom Explanations

#### [Build] Task 4.4.1: Implement Slang Detector

**Description:** LLM service detecting slang and idioms in messages  
**Acceptance Criteria:**
- Identifies slang terms and idiomatic expressions
- Provides plain-language explanations
- Includes cultural context and equivalent expressions
- Stores in `message.slangExplanations` map

**Dependencies:** Tasks 4.1.1, 4.1.2  
**Testing:** Send message with slang; verify explanations generated

**File:** `functions/src/services/slangAnalyzer.ts`

---

#### [Build] Task 4.4.2: Create Slang Explanation UI

**Description:** Interactive UI for viewing slang explanations  
**Acceptance Criteria:**
- Slang terms underlined or highlighted in message
- Tap term to view explanation in popover
- Explanation includes meaning, cultural context, equivalent phrase
- Multiple terms in one message supported

**Dependencies:** Task 4.4.1  
**Testing:** Receive message with slang; tap terms; verify explanations display

**Component:** Updated in `MessageBubble.tsx`

---

### Module 4.5: Context-Aware Smart Replies

#### [Build] Task 4.5.1: Implement Smart Reply Generator

**Description:** LLM generating context-aware response suggestions  
**Acceptance Criteria:**
- `generateSmartReplies(message, conversationContext, userStyle)` Cloud Function
- Generates 3-5 reply suggestions
- Maintains user's communication style (learned from history)
- Replies in user's preferred language

**Dependencies:** Tasks 4.1.1, 4.1.2  
**Testing:** Receive message; verify smart replies generated

**File:** `functions/src/services/smartReplyGenerator.ts`

---

#### [Build] Task 4.5.2: Display Smart Reply Chips

**Description:** UI chips displaying smart reply suggestions above input  
**Acceptance Criteria:**
- 3-5 chips displayed horizontally scrollable
- Tap to insert reply into message input
- Auto-refresh when new message received
- "Regenerate" button for new suggestions

**Dependencies:** Task 4.5.1  
**Testing:** Receive message; tap smart reply chip; verify inserts into input

**File:** `components/chat/SmartReplyChips.tsx`

---

### Module 4.6: AI Chat Assistant

#### [Build] Task 4.6.1: Create AI Assistant Cloud Function

**Description:** Cloud Function handling AI chat assistant queries  
**Acceptance Criteria:**
- `aiChatAssistant(query, conversationId)` callable function
- Loads conversation context via RAG
- Streams response back to client
- Handles language learning questions (word meanings, grammar, culture)

**Dependencies:** Tasks 4.1.1, 4.1.2  
**Testing:** Ask AI question about conversation; verify response

**File:** `functions/src/services/aiChatAssistant.ts`

---

#### [Build] Task 4.6.2: Create AI Assistant Modal

**Description:** Modal interface for AI chat assistant  
**Acceptance Criteria:**
- Accessible from chat screen header button
- Chat interface with message history
- Typing indicator while AI generates response
- Streaming response display (token-by-token)
- Close button returns to conversation

**Dependencies:** Task 4.6.1  
**Testing:** Open AI assistant; ask question; verify response displays

**File:** `components/ai/AIAssistantModal.tsx`

---

#### [Build] Task 4.6.3: Integrate AI Assistant with Conversations

**Description:** Wire AI assistant to have context of current conversation  
**Acceptance Criteria:**
- AI assistant loads last 20 messages from conversation
- Questions reference specific messages ("What does that phrase mean?")
- AI provides language learning insights
- Conversation context updates when new messages arrive

**Dependencies:** Tasks 4.6.1, 4.6.2  
**Testing:** Send message with complex phrase; ask AI about it; verify understands context

---

### Module 4.7: AI Feature Integration

#### [Build] Task 4.7.1: Orchestrate AI Analysis Pipeline

**Description:** Coordinate multiple AI features for each message  
**Acceptance Criteria:**
- Single Cloud Function trigger on message creation
- Calls cultural hint, formality, slang analyzers in parallel
- Updates message document with all AI metadata
- Graceful degradation if any analyzer fails

**Dependencies:** Tasks 4.2.1, 4.3.1, 4.4.1  
**Testing:** Send message; verify all AI analyses complete and stored

**File:** `functions/src/triggers/onMessageCreated.ts`

---

#### [Validate] Task 4.7.2: Test AI Feature Adoption

**Description:** Validate AI feature discoverability and usage  
**Acceptance Criteria:**
- 80%+ of test users engage with 3+ AI features
- Cultural hints tapped by users who receive them
- Formality warnings acknowledged
- Slang explanations viewed
- Smart replies used in conversations

**Dependencies:** All Module 4.1-4.6 tasks  
**Testing:** User testing with 10+ participants; track engagement metrics

---

#### [Validate] Task 4.7.3: Test AI Performance & Cost

**Description:** Measure AI feature latency and API costs  
**Acceptance Criteria:**
- Cultural hint analysis: < 3s
- Formality detection: < 2s
- Slang explanation: < 3s
- Smart replies: < 4s
- Total AI cost per message: < $0.01

**Dependencies:** Task 4.7.1  
**Testing:** Monitor Cloud Functions logs; calculate API costs

---

---

## 7. Supermodule 5: Group Chat & Collaboration

**Purpose:** Multi-user conversation support with per-user translation  
**Dependencies:** Messaging Core, Translation Engine  
**Milestone:** Group chats (3+ users) work with multilingual support

### Module 5.1: Group Conversation Management

#### [Build] Task 5.1.1: Extend Conversation Service for Groups

**Description:** Add group chat support to existing conversation service  
**Acceptance Criteria:**
- `createGroupConversation(participants, name)` creates group document
- `addParticipant(conversationId, userId)` adds user to group
- `removeParticipant(conversationId, userId)` removes user
- Group metadata includes: name, avatar, createdBy, participantCount

**Dependencies:** Task 2.4.1  
**Testing:** Create group with 3+ users; verify all participants see it

**File:** Updated `services/messaging/conversationService.ts`

---

#### [Build] Task 5.1.2: Create Group Creation Screen

**Description:** UI for creating new group chats  
**Acceptance Criteria:**
- Select multiple participants from contact list
- Set group name and optional avatar
- Minimum 2 participants (3 total including creator)
- "Create Group" button enabled when valid

**Dependencies:** Task 5.1.1  
**Testing:** Create group; verify all participants receive notification

**File:** `app/conversation/new-group.tsx`

---

#### [Build] Task 5.1.3: Create Group Settings Screen

**Description:** Settings for managing group participants and metadata  
**Acceptance Criteria:**
- View participant list with online/offline status
- Add/remove participants
- Change group name and avatar
- Leave group option

**Dependencies:** Task 5.1.1  
**Testing:** Add participant; verify they receive group messages

**File:** `app/conversation/[id]/settings.tsx`

---

### Module 5.2: Group Message Distribution

#### [Build] Task 5.2.1: Implement Group Message Sync

**Description:** Message distribution logic for group chats  
**Acceptance Criteria:**
- Messages written to `/conversations/{id}/messages` (same as one-on-one)
- Firestore listener updates all group participants
- Message includes `senderName` for attribution
- Handles participants with different languages

**Dependencies:** Tasks 5.1.1, 2.2.2  
**Testing:** Send group message; verify all participants receive it

**Implementation:** Updated in `messageService.ts`

---

#### [Build] Task 5.2.2: Implement Per-User Translation

**Description:** Each group participant receives messages translated to their language  
**Acceptance Criteria:**
- Translation requested for each unique target language in group
- Message document stores translations in map: `translations[lang]`
- Participants see their language version
- Original language always visible

**Dependencies:** Tasks 5.2.1, 3.3.1  
**Testing:** Create group with users speaking 3 different languages; verify translations

---

### Module 5.3: Group Chat UI

#### [Build] Task 5.3.1: Update Chat Screen for Groups

**Description:** Modify Chat Screen to display group message attribution  
**Acceptance Criteria:**
- Shows sender name above message bubble (not needed in one-on-one)
- Sender avatar displayed next to message
- Group name in header instead of participant name
- Participant count indicator

**Dependencies:** Tasks 5.2.1, 2.3.3  
**Testing:** View group chat; verify sender names display correctly

**Component:** Updated `ChatScreen.tsx`

---

#### [Build] Task 5.3.2: Display Group Typing Indicators

**Description:** Show multiple typing indicators in group chats  
**Acceptance Criteria:**
- "Alice and Bob are typing..." when 2 users typing
- "Alice, Bob, and 2 others are typing..." when 4+ users typing
- Updates in real-time as users start/stop typing
- Handles edge cases (user leaves while typing)

**Dependencies:** Tasks 5.2.1, 2.5.2  
**Testing:** Multiple users type simultaneously; verify indicator updates

**Component:** Updated `TypingIndicator.tsx`

---

### Module 5.4: Group Read Receipts

#### [Build] Task 5.4.1: Implement Group Read Receipts

**Description:** Read receipt logic for group messages  
**Acceptance Criteria:**
- Message status: "read" when all participants have read
- Show "Read by 5 of 8" count in message details
- Tap checkmark to view list of who read message
- Updates in real-time as participants read

**Dependencies:** Tasks 5.2.1, 2.6.1  
**Testing:** Send group message; verify read counts update

**File:** `components/chat/ReadReceiptDetails.tsx`

---

### Module 5.5: Group Notifications

#### [Build] Task 5.5.1: Implement Group Message Notifications

**Description:** Push notifications for group messages  
**Acceptance Criteria:**
- Notification shows group name and sender name
- Translated message body in recipient's language
- Badge count includes group messages
- Mute/unmute group option

**Dependencies:** Tasks 5.2.1, 6.2.1  
**Testing:** Send group message; verify all participants receive notification

**Implementation:** Updated in notification Cloud Function

---

#### [Validate] Task 5.5.2: Test Group Chat Performance

**Description:** Validate group chat performance with large groups  
**Acceptance Criteria:**
- 10-person group: Messages deliver within 1 second
- 20-person group: Messages deliver within 2 seconds
- No race conditions with simultaneous messages
- Firestore quota not exceeded with group activity

**Dependencies:** All Module 5 tasks  
**Testing:** Create 20-person group; send rapid messages; measure latency

---

---

## 8. Supermodule 6: Notifications & Lifecycle

**Purpose:** Push notifications and app state management  
**Dependencies:** Messaging Core  
**Milestone:** Background notifications work; app handles all lifecycle states

### Module 6.1: Push Notification Setup

#### [Build] Task 6.1.1: Configure Firebase Cloud Messaging

**Description:** Set up FCM for iOS and Android  
**Acceptance Criteria:**
- APNs key uploaded to Firebase Console (iOS)
- `google-services.json` configured (Android)
- FCM permissions requested on app launch
- Device token registered in Firestore `users.fcmTokens[]`

**Dependencies:** Task 1.1.3  
**Testing:** Grant notification permission; verify token saved in Firestore

---

#### [Build] Task 6.1.2: Implement Notification Service

**Description:** Service managing push notification registration and handling  
**Acceptance Criteria:**
- `registerForNotifications()` requests permission and gets token
- `updateFCMToken(token)` writes to user document
- Handles token refresh events
- Multiple device tokens supported (array in Firestore)

**Dependencies:** Task 6.1.1  
**Testing:** Install on 2 devices; verify both tokens in Firestore

**File:** `services/notifications/notificationService.ts`

---

### Module 6.2: Notification Cloud Function

#### [Build] Task 6.2.1: Create Notification Cloud Function

**Description:** Firestore trigger sending FCM notifications on new messages  
**Acceptance Criteria:**
- Triggers on `/conversations/{id}/messages/{msgId}` document creation
- Gets recipient FCM tokens from user document
- Translates message for notification body
- Sends via Firebase Admin SDK `messaging().send()`

**Dependencies:** Tasks 6.1.1, 3.1.3  
**Testing:** Send message with app closed; verify notification received

**File:** `functions/src/triggers/onMessageCreated.ts`

---

#### [Build] Task 6.2.2: Format Notification Payload

**Description:** Construct notification with proper format for iOS/Android  
**Acceptance Criteria:**
- Notification title: Sender name or group name
- Body: Translated message text (truncated to 100 chars)
- Data payload includes: `conversationId`, `messageId`, `type`
- Sound and badge configured
- APNs-specific fields (iOS): `aps.alert`, `aps.badge`

**Dependencies:** Task 6.2.1  
**Testing:** Receive notification; verify displays correctly on lock screen

---

### Module 6.3: Notification Handling

#### [Build] Task 6.3.1: Handle Foreground Notifications

**Description:** Display notifications when app is in foreground  
**Acceptance Criteria:**
- In-app notification banner appears at top
- Tap to navigate to conversation
- Option to reply directly from banner
- Auto-dismisses after 5 seconds

**Dependencies:** Task 6.1.2  
**Testing:** Receive message while app open; verify banner appears

**File:** `services/notifications/foregroundHandler.ts`

---

#### [Build] Task 6.3.2: Handle Background Notifications

**Description:** App behavior when notification tapped while backgrounded  
**Acceptance Criteria:**
- App opens to specific conversation (from `conversationId` in data payload)
- Unread badge count updates
- Notification removed from system tray
- Handles cold start (app not running) and warm start (app backgrounded)

**Dependencies:** Task 6.1.2  
**Testing:** Force quit app; send message; tap notification; verify opens to conversation

**File:** `services/notifications/backgroundHandler.ts`

---

### Module 6.4: App Lifecycle Management

#### [Build] Task 6.4.1: Implement App State Manager

**Description:** Service managing app foreground/background state  
**Acceptance Criteria:**
- Subscribes to React Native `AppState` events
- Updates user presence on state change
- Pauses/resumes Firestore listeners appropriately
- Processes message queue on foreground

**Dependencies:** Task 2.5.1  
**Testing:** Background/foreground app; verify presence updates

**File:** `services/app/appStateManager.ts`

---

#### [Build] Task 6.4.2: Implement Reconnection Logic

**Description:** Handle network reconnection and sync  
**Acceptance Criteria:**
- Detects network state changes via `NetInfo`
- Processes offline message queue on reconnect
- Re-establishes Firestore listeners
- Syncs missed messages from Firestore
- UI indicates "Connecting..." state

**Dependencies:** Tasks 6.4.1, 2.1.3  
**Testing:** Disconnect network; send messages; reconnect; verify all deliver

**File:** `services/app/reconnectionService.ts`

---

### Module 6.5: Badge & Unread Counts

#### [Build] Task 6.5.1: Implement Unread Count Service

**Description:** Track unread message counts per conversation  
**Acceptance Criteria:**
- `conversation.unreadCount` incremented on new message
- Reset to 0 when conversation opened
- Total unread count displayed on app icon badge
- Efficient Firestore queries (indexed on unreadCount)

**Dependencies:** Task 2.4.1  
**Testing:** Receive messages; verify unread counts update; open conversation; verify resets

**File:** `services/messaging/unreadService.ts`

---

#### [Build] Task 6.5.2: Update App Icon Badge

**Description:** Sync app icon badge with total unread count  
**Acceptance Criteria:**
- Badge number updates when messages received
- Badge clears when all conversations read
- Works on both iOS and Android
- Updates in real-time via Firestore listener

**Dependencies:** Tasks 6.5.1, 6.1.2  
**Testing:** Receive messages; verify badge count increases; read all; verify clears

**Implementation:** Integrated in `notificationService.ts`

---

### Module 6.6: Notification Preferences

#### [Build] Task 6.6.1: Create Notification Settings Screen

**Description:** UI for configuring notification preferences  
**Acceptance Criteria:**
- Toggle push notifications on/off
- Toggle notification sound
- Mute specific conversations
- Notification preview (show message text vs. "New message")

**Dependencies:** Task 6.1.2  
**Testing:** Change settings; verify notifications behavior updates

**File:** `app/settings/notifications.tsx`

---

#### [Build] Task 6.6.2: Implement Conversation Muting

**Description:** Mute/unmute individual conversations  
**Acceptance Criteria:**
- Mute button in conversation settings
- Muted conversations don't send notifications
- Muted indicator on conversation list item
- Unmute button to restore notifications

**Dependencies:** Task 6.6.1  
**Testing:** Mute conversation; send message; verify no notification

**Implementation:** Updated in `conversationService.ts`

---

### Module 6.7: Performance Optimization

#### [Build] Task 6.7.1: Optimize Firestore Listener Management

**Description:** Efficiently manage Firestore real-time listeners  
**Acceptance Criteria:**
- Listeners unsubscribed when screens unmounted
- Only active conversation has message listener
- Global conversation list listener persists
- No memory leaks from forgotten listeners

**Dependencies:** Task 6.4.1  
**Testing:** Navigate between screens; verify listeners cleaned up via memory profiler

**Implementation:** Enforced in all service hooks

---

#### [Build] Task 6.7.2: Implement FlatList Optimization

**Description:** Optimize message and conversation list rendering  
**Acceptance Criteria:**
- `getItemLayout` for fixed-height items
- `initialNumToRender: 20` for message lists
- `removeClippedSubviews: true` on Android
- Memoized message components with `React.memo`

**Dependencies:** Task 2.3.3  
**Testing:** Scroll through 1000+ message conversation; verify no lag

**Implementation:** Updated in `ChatScreen.tsx` and `ConversationListScreen.tsx`

---

### Module 6.8: Error Handling & Resilience

#### [Build] Task 6.8.1: Implement Global Error Boundary

**Description:** React Error Boundary catching unhandled errors  
**Acceptance Criteria:**
- Error boundary wraps entire app
- Displays user-friendly error screen
- Logs errors to Firebase Console
- "Try again" button reloads app

**Dependencies:** Task 1.1.2  
**Testing:** Trigger error; verify error screen displays and logs sent

**File:** `components/ErrorBoundary.tsx`

---

#### [Build] Task 6.8.2: Implement Network Error Handling

**Description:** Graceful handling of network failures  
**Acceptance Criteria:**
- Toast notifications for network errors
- Automatic retry with exponential backoff
- "No internet connection" banner when offline
- Offline mode works seamlessly (queued messages)

**Dependencies:** Task 6.4.2  
**Testing:** Disconnect network; interact with app; verify error handling

**Implementation:** Integrated in all service files

---

#### [Validate] Task 6.8.3: Test App Lifecycle Edge Cases

**Description:** Validate app behavior in edge case scenarios  
**Acceptance Criteria:**
- Force quit → reopen: Messages persist
- Low memory: App resumes without data loss
- Background 24+ hours: Syncs correctly on reopen
- Multiple backgrounding: No duplicate messages

**Dependencies:** All Module 6 tasks  
**Testing:** Execute edge case scenarios; verify app resilient

---

---

## 9. Cross-Module & Shared Tasks

### Module 9.1: Testing Infrastructure

#### [Build] Task 9.1.1: Set Up Jest Testing Framework

**Description:** Configure Jest for unit and integration testing  
**Acceptance Criteria:**
- Jest configured in `package.json`
- `@testing-library/react-native` installed
- Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
- Coverage reports generated

**Dependencies:** Task 1.1.2  
**Testing:** Run `npm test`; verify tests execute

---

#### [Build] Task 9.1.2: Set Up Firebase Emulator

**Description:** Configure Firebase Emulator Suite for local testing  
**Acceptance Criteria:**
- Emulator configured in `firebase.json`
- Firestore, Auth, Cloud Functions emulators enabled
- Test data seeding scripts
- `npm run emulators` starts local environment

**Dependencies:** Task 1.1.3  
**Testing:** Run emulators; connect app to local endpoints; verify works

---

#### [Build] Task 9.1.3: Write Unit Tests for Services

**Description:** Unit test coverage for all service files  
**Acceptance Criteria:**
- 80%+ code coverage for services
- Tests for auth, messaging, translation, notification services
- Mocked Firebase and API calls
- Tests run in CI pipeline

**Dependencies:** Tasks 9.1.1, 9.1.2  
**Testing:** Run `npm run test:coverage`; verify 80%+ coverage

---

#### [Build] Task 9.1.4: Write Integration Tests

**Description:** Integration tests for Firebase operations  
**Acceptance Criteria:**
- Test Firestore write/read operations
- Test Cloud Function invocations
- Test authentication flow
- Use Firebase Emulator for tests

**Dependencies:** Task 9.1.2  
**Testing:** Run integration test suite; verify all tests pass

---

### Module 9.2: Documentation

#### [Build] Task 9.2.1: Create README.md

**Description:** Comprehensive README for project setup  
**Acceptance Criteria:**
- Installation instructions
- Firebase setup steps
- Running locally (Expo Go and emulators)
- Environment variable configuration
- Troubleshooting common issues

**Dependencies:** All Module 1 tasks  
**Testing:** New developer follows README; successfully runs app

**File:** `README.md`

---

#### [Build] Task 9.2.2: Document API Endpoints

**Description:** Document all Cloud Functions API endpoints  
**Acceptance Criteria:**
- Endpoint list with request/response schemas
- Authentication requirements
- Example requests
- Error codes and meanings

**Dependencies:** Tasks 3.1.3, 4.6.1  
**Testing:** Developer uses docs to call endpoints

**File:** `functions/API.md`

---

### Module 9.3: Deployment

#### [Build] Task 9.3.1: Deploy Cloud Functions to Production

**Description:** Deploy all Cloud Functions to Firebase  
**Acceptance Criteria:**
- All functions deployed via `firebase deploy --only functions`
- Environment variables set via Firebase CLI
- Functions accessible from production URLs
- Logs viewable in Firebase Console

**Dependencies:** All Module 3-4 Cloud Function tasks  
**Testing:** Invoke production endpoints; verify responses

---

#### [Build] Task 9.3.2: Deploy Firestore Indexes and Rules

**Description:** Deploy database indexes and security rules  
**Acceptance Criteria:**
- Firestore indexes from `firestore.indexes.json` deployed
- Security rules from `firestore.rules` deployed
- Rules tested with Emulator rules unit testing
- All queries use indexes (no warnings in Console)

**Dependencies:** Tasks 1.4.1, 9.1.2  
**Testing:** Run app; check Firebase Console for missing index warnings

---

#### [Build] Task 9.3.3: Build Expo Standalone App

**Description:** Build standalone app for iOS/Android  
**Acceptance Criteria:**
- Expo Application Services (EAS) configured
- Build profiles for development, preview, production
- iOS build uploaded to TestFlight OR
- Android APK generated and downloadable

**Dependencies:** All supermodule tasks complete  
**Testing:** Install build on physical device; verify fully functional

**Command:**
```bash
eas build --platform all --profile production
```

---

#### [Build] Task 9.3.4: Publish to Expo Go

**Description:** Publish app to Expo Go for testing  
**Acceptance Criteria:**
- `expo publish` generates QR code link
- Link works on iOS and Android Expo Go apps
- App accessible without installing from stores
- Updates instantly via OTA

**Dependencies:** All supermodule tasks complete  
**Testing:** Scan QR code; verify app opens and works

---

### Module 9.4: Demo & Submission

#### [Build] Task 9.4.1: Record Demo Video

**Description:** Record comprehensive demo video showing all features  
**Acceptance Criteria:**
- 3-5 minute video
- Shows user registration, language selection, messaging, translation, AI features, group chat, notifications
- Demonstrates on physical devices
- High-quality screen recording with voiceover

**Dependencies:** All features complete and tested  
**Testing:** Review video; verify all requirements demonstrated

---

#### [Build] Task 9.4.2: Prepare Final Submission

**Description:** Package all deliverables for submission  
**Acceptance Criteria:**
- GitHub repository with all code
- Demo video uploaded
- README with setup instructions
- Expo Go link or TestFlight/APK download link
- All documentation complete

**Dependencies:** All tasks complete  
**Testing:** External reviewer can access and run app

---

---

## 10. Testing Coverage Map

| Supermodule | Unit Tests | Integration Tests | E2E Tests | Manual QA |
|---|---|---|---|---|
| **Setup & Auth** | Auth service, profile service | Firebase Auth flow | Sign up → login → language setup → chat list | Test on iOS and Android |
| **Messaging Core** | Message service, queue manager, SQLite service | Firestore sync, message flow | Send message → receive → read receipt → offline queue | Multi-device testing |
| **Translation Engine** | Language detector, cache service | Translation pipeline | Send message → translate → display dual-language | Bilingual testers validate accuracy |
| **AI Intelligence Layer** | Prompt construction, RAG loader | LLM API calls, AI pipeline | Receive idiom → see hint → tap explanation → ask AI | Feature adoption tracking |
| **Group Chat** | Group service logic | Group message distribution | Create group → send messages → verify all receive | 10-person group stress test |
| **Notifications** | Notification service, badge logic | FCM trigger → notification delivery | Background app → receive → tap notification → open chat | Physical device testing |

**Coverage Goals:**
- Unit test coverage: 80%+
- Integration tests: All critical paths
- E2E tests: All user stories (P0, P1, P2)
- Manual QA: Every feature on physical devices

---

## 11. Validation Mapping

| Task | Regression ID | Test Type | Status |
|---|---|---|---|
| One-on-one messaging (P0-1) | MVP-001 | Functional | ☐ |
| Message persistence (P0-2) | MVP-002 | Functional | ☐ |
| Optimistic UI (P0-3) | MVP-003 | Functional | ☐ |
| Presence indicators (P0-4) | MVP-004 | Functional | ☐ |
| Typing indicators (P0-5) | MVP-005 | Functional | ☐ |
| Read receipts (P0-6) | MVP-006 | Functional | ☐ |
| Group chat (P0-7) | MVP-007 | Functional | ☐ |
| Push notifications (P0-8) | MVP-008 | Integration | ☐ |
| Authentication (P0-9) | MVP-009 | Functional | ☐ |
| Offline queue (P0-10) | MVP-010 | Integration | ☐ |
| Inline translation (P1-1) | AI-001 | Integration | ☐ |
| Dual-language display (P1-2) | AI-002 | Functional | ☐ |
| Language detection (P1-3) | AI-003 | Functional | ☐ |
| Cultural hints (P1-4) | AI-004 | Integration | ☐ |
| Formality detection (P1-5) | AI-005 | Integration | ☐ |
| Slang explanation (P1-6) | AI-006 | Integration | ☐ |
| Smart replies (P2-1) | AI-007 | Integration | ☐ |
| AI chat assistant (P2-2) | AI-008 | Integration | ☐ |
| Group translation (P2-3) | AI-009 | Integration | ☐ |
| Translation cache (P2-4) | PERF-001 | Performance | ☐ |

---

## 12. Completion Definition

### MVP Gate Completion (24 Hours)

**Criteria:**
- ✅ All 10 P0 user stories functional
- ✅ Messaging Core supermodule 100% complete
- ✅ Setup & Auth supermodule 100% complete
- ✅ Firebase backend deployed and accessible
- ✅ Tested on 2+ physical devices
- ✅ Messages send, persist, sync in real-time
- ✅ 0 critical bugs

### Final Submission Completion (7 Days)

**Criteria:**
- ✅ All 6 supermodules 100% complete (94 tasks)
- ✅ All P0, P1, P2 user stories functional
- ✅ 5 required AI features + 1 advanced feature working
- ✅ Unit test coverage ≥ 80%
- ✅ All E2E tests passing
- ✅ Demo video recorded
- ✅ Expo Go link OR TestFlight/APK available
- ✅ Documentation complete

**Qualitative Goals:**
- App feels as responsive as WhatsApp
- AI features feel native, not bolted-on
- Translations preserve meaning and tone
- No crashes during standard testing
- Handles poor network gracefully

---

## 13. References

- **PRD:** `/docs/foundation/prd.md`
- **Architecture:** `/docs/foundation/architecture.md`
- **Tech Stack:** `/docs/foundation/tech_stack.md`
- **User Flow:** `/docs/foundation/user_flow.md`
- **Project Overview:** `/docs/foundation/project_overview.md`
- **Firestore Schema:** `/docs/schema.sql` (SQLite schema in architecture)
- **Testing Strategy:** PRD Section 6

**Next Phase:** Begin implementation starting with Supermodule 1 (Setup & Auth)

---

**End of Development Checklist**

**Document Version:** 1.0  
**Status:** Complete ✅  
**Total Tasks:** 94 across 6 supermodules  
**Last Updated:** October 20, 2025

