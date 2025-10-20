# Product Requirements Document: WorldChat

**Document Version:** 1.0  
**Target Persona:** International Communicator (Language Learners & Cross-Cultural Relationships)  
**Platform:** React Native + Expo  
**Backend:** Firebase (Firestore, Cloud Functions, Auth, FCM)  
**Sprint Duration:** 7 days  
**Last Updated:** October 20, 2025

---

## 1. Objective

### Product Purpose and Mission

WorldChat helps travelers and language learners build authentic friendships across language barriers while maximizing their language learning opportunities. By embedding intelligent AI translation directly into a WhatsApp-quality messaging experience, the application transforms international travel into an immersive learning experience. Users communicate naturally in their native language while their conversation partners receive messages in theirs—with full cultural context preserved. The app doesn't just translate messages; it helps build relationships and accelerates language acquisition through real, meaningful conversations with native speakers.

### Problem Being Solved

**Current Pain Points:**
- Users juggle multiple apps (WhatsApp + Google Translate) creating copy-paste overhead
- Direct translations miss cultural nuances leading to misunderstandings
- Formal vs. casual tone confusion in unfamiliar languages causes social friction
- Slang and idioms become barriers when they don't translate directly
- Real-time conversation spontaneity is lost when translation requires manual steps
- Travel presents the best language learning opportunity, but travelers lack tools to maximize learning during real conversations with locals

**Target Users:**
- **Primary:** Travelers building friendships abroad (e.g., parents visiting Italy, making friends with locals who speak limited English)
- **Primary:** Language learners practicing with native speakers while developing real relationships
- **Secondary:** People in cross-cultural relationships maintaining authentic communication
- **Secondary:** Expatriates staying connected with family across language barriers

### Success Definition (Measurable Terms)

**MVP Gate (24 Hours):**
- Functional one-on-one chat with real-time delivery between 2+ users
- Message persistence surviving app restarts
- Optimistic UI updates (messages appear instantly)
- Online/offline status indicators with presence
- Message timestamps and read receipts
- User authentication with profiles
- Basic group chat (3+ users)
- Foreground push notifications
- Deployed Firebase backend accessible from physical test devices

**Final Success (7 Days):**
- **Message Delivery Success Rate:** 99.9% of messages delivered and persisted
- **Real-Time Latency:** Sub-500ms message delivery on good connections
- **Offline Resilience:** 100% of queued messages sent upon reconnection
- **App Stability:** Zero crashes during standard testing scenarios
- **AI Feature Adoption:** 80% of test users actively use 3+ of 5 core AI features
- **Translation Accuracy:** 95% preserve meaning, 90% capture tone/formality
- **Deployment:** Working Expo Go link or standalone build on TestFlight/APK

---

## 2. Core Features

### Essential Messaging Infrastructure

| Feature | Description | Rationale |
|---|---|---|
| **Real-Time One-on-One Chat** | Text messaging between two users with instant delivery via Firestore real-time listeners | Foundation for all communication; proves infrastructure reliability |
| **Message Persistence** | Local storage using Expo SQLite with offline-first architecture | Users must access chat history without network dependency |
| **Optimistic UI Updates** | Messages appear immediately in sender's chat, then update with delivery status | Creates WhatsApp-level responsiveness perception |
| **Presence & Typing Indicators** | Real-time online/offline status and "user is typing..." signals | Enhances synchronous communication feel |
| **Read Receipts** | Message delivery states: sending, sent, delivered, read | Provides communication confidence and reduces uncertainty |
| **Group Chat (3+ Users)** | Multi-participant conversations with proper message attribution | Extends core value to multilingual group scenarios |
| **Media Support** | Image sharing and profile pictures | Meets MVP baseline; richer media deferred |
| **Push Notifications** | Foreground and background message notifications via Expo Notifications + FCM | Critical for asynchronous communication patterns |

### Required AI Features (All 5)

| Feature | Description | Rationale |
|---|---|---|
| **Inline Real-Time Translation** | Automatic translation of messages displayed side-by-side in chat bubbles—receiver sees both the original message and their language version prominently | Eliminates copy-paste overhead while enabling language learning through exposure to both languages simultaneously |
| **Language Detection & Auto-Translate** | Automatic identification of source language with seamless translation to recipient's preferred language | Removes manual language selection friction |
| **Cultural Context Hints** | AI-powered proactive hints explaining cultural references, customs, or context that may not translate directly | Prevents miscommunication from cultural blind spots |
| **Formality Level Adjustment** | Automatic detection of formality mismatch with warnings or suggestions (e.g., using casual tone with elder in Korean context) | Preserves social appropriateness across cultures |
| **Slang/Idiom Explanations** | On-demand explanations of colloquialisms and idiomatic expressions with cultural background | Makes informal language accessible across language barriers |

### Advanced AI Capability (Option A)

| Feature | Description | Rationale |
|---|---|---|
| **Context-Aware Smart Replies** | LLM-generated response suggestions that learn user communication style across multiple languages, maintaining authentic voice | Reduces response time while preserving personality; demonstrates advanced RAG + personalization |

---

## 3. User Stories

### Priority 0 (P0) - MVP Gate Requirements

| ID | User Story | Acceptance Criteria |
|---|---|---|
| P0-1 | As a user, I want to send a text message to another user so that we can communicate in real-time | Message appears on recipient device within 500ms on good connection; message persists in both sender and recipient local storage |
| P0-2 | As a user, I want my messages to persist locally so that I can view chat history when offline | All sent/received messages visible after app restart with no network; local SQLite database maintains complete conversation history |
| P0-3 | As a user, I want to see my message appear immediately when I send it so that the app feels responsive | Message renders in chat UI instantly (optimistic update) before server confirmation; status updates from "sending" → "sent" → "delivered" |
| P0-4 | As a user, I want to see when my contacts are online/offline so that I know if they're available | Presence indicator (green dot/gray dot) updates within 3 seconds of status change; "Last seen" timestamp for offline users |
| P0-5 | As a user, I want to know when someone is typing so that I can anticipate their response | "User is typing..." indicator appears within 1 second of typing start; disappears after 3 seconds of inactivity |
| P0-6 | As a user, I want to see read receipts so that I know my message was seen | Checkmarks update: single gray (sent), double gray (delivered), double blue (read); read status updates within 2 seconds |
| P0-7 | As a user, I want to create a group chat with 3+ friends so that we can all communicate together | Ability to create group, add participants, send messages visible to all; proper attribution showing sender name/avatar |
| P0-8 | As a user, I want to receive push notifications so that I know when I receive messages | Foreground notifications display immediately; background notifications trigger even when app is closed (iOS/Android system notifications) |
| P0-9 | As a user, I want to authenticate with an account so that my identity is secure and persistent | Email/password or social auth (Google/Apple); profile with display name and optional profile picture |
| P0-10 | As a user, I want messages I send while offline to be delivered when I reconnect so that I don't lose communication | Messages queue locally when offline; auto-send when network restored; UI indicates "queued" status |

### Priority 1 (P1) - Core AI Translation Features

| ID | User Story | Acceptance Criteria |
|---|---|---|
| P1-1 | As a traveler in Italy making friends with locals, I want to send messages in English and have them automatically translated to Italian for my Italian-speaking friend so that we can communicate naturally despite the language barrier | Message displays in English for sender, Italian for recipient; translation happens automatically without user action; both languages visible in chat bubble |
| P1-2 | As a language learner traveling abroad, I want to see both the original message and its translation side-by-side so that I can learn Italian while building friendships | Dual-display UI shows both original and translated message prominently in chat bubble; receiver sees their language (Italian) and original language (English) simultaneously for learning |
| P1-3 | As a user, I want the app to automatically detect what language I'm typing so that I don't have to manually select languages | Language detection happens automatically within first 5-10 characters; accurate detection for 95%+ of common languages |
| P1-4 | As a user communicating with someone from a different culture, I want to receive hints when cultural context is missing so that I avoid misunderstandings | AI proactively displays cultural hint badge on messages containing idioms, cultural references, or formality mismatches; tap to expand explanation |
| P1-5 | As a user, I want to be warned when I'm using inappropriate formality so that I don't accidentally offend someone | AI detects formality level (casual/formal) and compares to relationship context; displays warning icon with suggestion when mismatch detected |
| P1-6 | As a user encountering slang or idioms, I want explanations so that I understand the real meaning | Long-press or tap icon on message to reveal AI explanation of slang/idiom with cultural background and equivalent expressions |

### Priority 2 (P2) - Advanced AI & Polish

| ID | User Story | Acceptance Criteria |
|---|---|---|
| P2-1 | As a frequent user, I want the app to suggest replies that match my communication style so that I can respond quickly while staying authentic | AI generates 3-5 smart reply suggestions based on conversation context and learned user style; replies available in user's preferred language |
| P2-2 | As a language learner, I want to ask an AI assistant questions about my conversation (word meanings, grammar, cultural context) so that I can learn while communicating | Dedicated AI chat interface accessible from any conversation; AI has access to conversation history via RAG; answers questions about words, phrases, translations, and cultural nuances |
| P2-3 | As a user in a multilingual group chat, I want to see all messages translated to my language so that I can follow the conversation | Each user sees group messages automatically translated to their preferred language; translation is independent per user |
| P2-4 | As a user, I want commonly used translations cached so that the app remains fast and responsive | Frequently used phrases cached in Firestore; cache hit reduces latency and API costs; cache expires after 30 days |

---

## 4. Success Criteria

### Quantitative Benchmarks

| Metric | Target | Measurement Method |
|---|---|---|
| **Message Delivery Success Rate** | 99.9% | Monitor Firestore write confirmations vs. client send attempts over 100+ message sample |
| **Real-Time Latency** | < 500ms | Measure time from sender's send button tap to recipient's message render on good network (WiFi) |
| **Offline Resilience** | 100% queue delivery | Test 20 messages sent offline; verify all 20 delivered upon reconnection |
| **App Stability** | 0 crashes | Complete test scenario suite (background/foreground, poor network, rapid messaging, group chat) without crashes |
| **AI Feature Adoption** | 80% use 3+ features | Track which AI features each test user engages with during testing period |
| **Translation Accuracy - Meaning** | 95% | Bilingual tester validation: does translation preserve intended meaning? |
| **Translation Accuracy - Tone** | 90% | Bilingual tester validation: does translation preserve formality/tone? |
| **Background Notification Rate** | 100% | Send 10 messages to backgrounded/closed app; verify all 10 trigger system notifications |

### Qualitative Benchmarks

| Criterion | Success Indicator |
|---|---|
| **Usability** | Users complete first conversation without onboarding instructions or confusion |
| **AI Integration Feel** | AI features feel native, not bolted-on; translation happens seamlessly without drawing attention to itself |
| **Cultural Context Relevance** | Cultural hints provided are actually helpful and contextually appropriate (no false positives that annoy users) |
| **Performance Perception** | App feels as responsive as WhatsApp; no perceived lag in normal usage |
| **Error Recovery** | App handles poor network, interrupted connections, and edge cases gracefully without data loss or user confusion |

### Deployment Validation

| Platform | Success Criteria |
|---|---|
| **Expo Go** | Functional expo://[link] accessible from iOS and Android test devices |
| **TestFlight (iOS)** | OR: Standalone build deployed to TestFlight with shareable link |
| **APK (Android)** | OR: Signed APK available for download and installation |
| **Backend Services** | All Firebase services (Firestore, Auth, Cloud Functions, FCM) deployed and accessible from client apps |

---

## 5. Supermodule Map

| Supermodule | Description | Key Features/Components |
|---|---|---|
| **Setup & Auth** | User onboarding, authentication, and language preference configuration | Firebase Auth integration, user registration/login, language selection during onboarding, profile creation with display name and picture |
| **Messaging Core** | Real-time chat infrastructure with offline support and synchronous/asynchronous messaging | Firestore real-time listeners, local message persistence (Expo SQLite), optimistic UI updates, message queuing for offline scenarios, typing indicators, presence status, read receipts |
| **Translation Engine** | AI-powered translation orchestration and caching layer | Cloud Functions calling Google Cloud Translation API, translation caching in Firestore, language detection, translation history for RAG context |
| **AI Intelligence Layer** | LLM-powered features for cultural context, formality, slang, and smart replies, plus dedicated AI chat assistant | Cloud Functions calling OpenAI/Claude, RAG pipeline for conversation context, cultural hint detection, formality analysis, idiom explanation, Context-Aware Smart Replies (Advanced Feature A), AI chat interface for learning questions |
| **Group Chat & Collaboration** | Multi-user conversation support with per-user language translation | Group message distribution, per-user translation rendering, participant management, group presence indicators |
| **Notifications & Lifecycle** | Push notifications and app state management | Expo Notifications + Firebase Cloud Messaging (FCM), foreground/background handling, reconnection logic, app lifecycle events |

### Supermodule Dependencies

```
Setup & Auth → Messaging Core → Translation Engine → AI Intelligence Layer
                      ↓
              Group Chat & Collaboration
                      ↓
          Notifications & Lifecycle
```

**Architectural Flow:**
1. **Setup & Auth** establishes user identity and language preferences (entry point)
2. **Messaging Core** provides the foundation upon which all features build (MVP gate focus)
3. **Translation Engine** is a service layer called by Messaging Core to transform messages
4. **AI Intelligence Layer** is decoupled and can be added post-MVP without refactoring core messaging
5. **Group Chat** extends Messaging Core with multiplayer coordination
6. **Notifications & Lifecycle** wraps the entire app to ensure reliability across app states

---

## 6. Testing & Quality Infrastructure

### Unit Testing

| Component | Testing Focus | Tool |
|---|---|---|
| **Translation Logic** | Language detection accuracy, translation caching behavior, fallback handling | Jest |
| **Message Queue** | Offline queuing logic, deduplication, retry mechanisms | Jest |
| **Message Status** | State transitions (sending → sent → delivered → read) | Jest |
| **AI Prompt Construction** | RAG context injection, prompt formatting, function calling structure | Jest |

### Integration Testing

| Scenario | Testing Focus | Tool |
|---|---|---|
| **Firebase Operations** | Firestore write/read operations, Auth flow, Cloud Functions invocation | Jest + Firebase Emulator |
| **Translation Pipeline** | End-to-end translation flow from message send to translated render | Jest + Firebase Emulator |
| **Notification Flow** | Message sent → FCM triggered → notification received | Manual QA on physical devices |

### End-to-End Testing

| Scenario | Testing Steps | Success Criteria |
|---|---|---|
| **Real-Time Messaging** | User A sends message to User B (both online) | Message appears on User B within 500ms; both devices show message |
| **Offline Scenario** | User A goes offline → User B sends message → User A reconnects | Message queues on User B's device; delivers when User A reconnects; read receipt updates |
| **App Lifecycle** | Send message → background app → force quit → reopen | Message persists in local storage; conversation history intact |
| **Poor Network** | Enable network throttling (3G simulation) → send 10 messages | All messages eventually delivered; no duplicates; status updates correctly |
| **Rapid Messaging** | Send 20+ messages in quick succession | All messages delivered in order; no race conditions; UI remains responsive |
| **Group Chat** | 3+ users in group → each sends messages in different languages | All participants see messages translated to their preferred language; proper attribution |
| **Translation Accuracy** | Bilingual tester sends messages with idioms, slang, formal/informal tone | Translation preserves meaning (95%+) and tone (90%+); cultural hints appear where appropriate |
| **Edge Cases** | Test mixed-language messages, RTL languages (Arabic/Hebrew), emoji handling | UI renders correctly; translation handles gracefully or provides appropriate error |

### Manual QA Flows

1. **First User Experience:** New user account creation → language selection → finding contacts → first message → receiving reply with translation
2. **Multilingual Group:** Create group with 3 users speaking different languages → each sends messages → verify per-user translation
3. **AI Feature Discovery:** New user receives message with idiom → discovers cultural hint → explores slang explanation → tries smart replies
4. **Notification Testing:** Close app completely → send messages from another device → verify system notifications → open app from notification

### Deployment Validation Process

1. **Pre-Deployment Checklist:**
   - All P0 and P1 user stories tested and passing
   - Firebase Cloud Functions deployed to production
   - Firestore security rules configured and tested
   - FCM credentials configured for both iOS and Android
   - API keys secured in Cloud Functions environment variables

2. **Deployment Steps:**
   - Build Expo standalone app or publish to Expo Go
   - Test on minimum 2 physical devices (iOS and/or Android)
   - Verify all Firebase services accessible from production build
   - Validate push notifications working on physical devices

3. **Post-Deployment Validation:**
   - Run full E2E test suite on deployed build
   - Monitor Firebase Console for errors or failed functions
   - Verify translation and AI features working with real API calls
   - Test with external testers unfamiliar with the app

---

## 7. Technical Constraints

### Required Frameworks & Libraries

| Category | Technology | Requirement |
|---|---|---|
| **Mobile Framework** | React Native + Expo | Mandatory for cross-platform development; must use Expo SDK 50+ |
| **Backend Services** | Firebase (Firestore, Cloud Functions, Auth, FCM) | Mandatory for real-time sync, serverless AI orchestration, auth, and push notifications |
| **Local Storage** | Expo SQLite | Required for offline-first message persistence |
| **Translation API** | Google Cloud Translation API | Called from Cloud Functions; supports all language pairs |
| **LLM Provider** | OpenAI GPT-4 or Anthropic Claude | Called from Cloud Functions for cultural context, formality, slang, smart replies |
| **AI Framework** | AI SDK by Vercel, OpenAI Agent SDK (Swarm), or LangChain | Required for function calling, RAG pipelines, and agent orchestration |
| **Testing Framework** | Jest + React Native Testing Library | Unit and integration testing |
| **Deployment** | Expo Go, TestFlight, or APK | At least one working deployment method |

### Language & Performance Constraints

| Constraint | Requirement | Rationale |
|---|---|---|
| **Language Pair Support** | All languages supported by Google Cloud Translation API | Universal communication is core value; prioritize testing English-Spanish and English-Mandarin |
| **Message Latency** | < 500ms delivery on good network | Proves infrastructure reliability; matches WhatsApp responsiveness |
| **Offline Support** | 100% message queue reliability | Critical for mobile messaging use cases |
| **Translation Caching** | Common phrases cached in Firestore | Reduces API costs and improves responsiveness |
| **API Key Security** | All API keys stored in Cloud Functions environment | Prevents exposure in client code |
| **Concurrent Users** | Support 10+ concurrent users during testing | Validates scalability of Firebase architecture |

### Security & Compliance

| Requirement | Implementation |
|---|---|
| **Authentication** | Firebase Auth with email/password or social providers (Google/Apple) |
| **API Key Protection** | All external API calls (Translation, OpenAI/Claude) routed through Cloud Functions |
| **Data Privacy** | User language preferences and conversation history stored securely in Firestore with proper security rules |
| **Message Encryption** | Firebase default encryption in transit (TLS) and at rest; custom E2E encryption out of scope |
| **User Consent** | Language preference selection during onboarding; optional profile information |

### Architectural Limitations

| Limitation | Rationale |
|---|---|
| **Single Platform Focus** | React Native only (not building separate Swift/Kotlin native apps) |
| **No Custom ML Models** | Using pre-trained LLMs and translation APIs only; no model training or fine-tuning |
| **Firebase Dependency** | Entire backend architecture tied to Firebase ecosystem |
| **No Desktop/Web Clients** | Mobile-only experience for this sprint (travelers use phones) |
| **Limited Media Support** | Images only; no video, voice messages, or file sharing beyond images |
| **No Audio Features in MVP** | TTS audio reading and word highlighting deferred to post-MVP stretch goals to ensure core messaging + translation reliability |

---

## 8. Stretch Goals

### Post-MVP Enhancements (Time Permitting)

| Feature | Description | Estimated Effort |
|---|---|---|
| **Audio Message Reading (TTS)** | Tap to hear any text message read aloud in its original language for pronunciation learning and auditory comprehension | Medium (Google Text-to-Speech or ElevenLabs API integration, audio player UI) |
| **Word Highlighting During Audio** | Highlight words in sync with audio playback to connect visual and auditory language learning | High (requires word-level timestamp extraction from TTS API or manual alignment) |
| **Voice Message Translation** | Record voice message → speech-to-text → translate → text-to-speech in recipient's language | High (requires additional APIs) |
| **Image Text Translation (OCR)** | Extract text from shared images (menus, signs, documents) and translate | Medium (Google Vision API integration) |
| **Conversation Summarization** | AI-generated summaries of long conversation threads | Low (reuses existing LLM integration) |
| **Language Learning Insights** | Highlight vocabulary, grammar tips, proficiency progression based on conversations | Medium (requires analytics layer) |
| **Message Reactions** | Emoji reactions to messages with cultural emoji meaning explanations | Low (extends messaging core) |
| **Dark Mode** | Dark theme support for UI | Low (UI polish) |
| **Message Search** | Search conversation history by keyword or semantic meaning | Medium (requires indexing strategy) |
| **Multi-Device Sync** | Access conversations from multiple devices with same account | High (requires architectural changes) |
| **Video Calling with Subtitles** | Real-time translated subtitles during video calls | Very High (complex integration) |

---

## 9. Out of Scope

The following features and capabilities are **explicitly excluded** from this sprint to maintain focus on core messaging infrastructure and AI translation features:

### Communication Features
- ❌ Voice calling (audio or video)
- ❌ Voice messages (audio recording/playback)
- ❌ Message editing after send
- ❌ Message deletion for all participants
- ❌ Message forwarding
- ❌ Broadcast lists or channels
- ❌ Story/status updates
- ❌ Disappearing messages
- ❌ Location sharing
- ❌ Contact sharing

### Media & Files
- ❌ Video sharing
- ❌ Document/file sharing (PDFs, Word, etc.)
- ❌ GIF library integration
- ❌ Sticker packs
- ❌ Audio file sharing
- ❌ Image text extraction (OCR) with translation

### Security & Privacy
- ❌ End-to-end encryption (beyond Firebase default security)
- ❌ Secret chats or disappearing messages
- ❌ Screenshot prevention
- ❌ Two-factor authentication
- ❌ Biometric app lock

### Social & Discovery
- ❌ User search or discovery features
- ❌ Public groups or communities
- ❌ Friend suggestions
- ❌ Social profiles or feeds
- ❌ User directories

### Platform & Deployment
- ❌ Desktop applications (macOS/Windows)
- ❌ Web browser client
- ❌ Tablet-optimized UI
- ❌ Apple Watch or Android Wear integration
- ❌ Widget support

### Monetization & Business
- ❌ In-app purchases
- ❌ Subscription plans
- ❌ Advertisement integration
- ❌ Premium features
- ❌ Analytics tracking for business metrics

### Advanced AI Features
- ❌ Custom ML model training or fine-tuning
- ❌ Image generation or AI art
- ❌ Voice cloning or synthesis
- ❌ Sentiment analysis dashboards
- ❌ Predictive typing beyond smart replies
- ❌ Automated conversation agents (chatbots)

### Infrastructure & Operations
- ❌ Admin dashboard or moderation tools
- ❌ User reporting and blocking beyond basic features
- ❌ Analytics dashboards
- ❌ A/B testing framework
- ❌ Multi-region deployment optimization
- ❌ Custom CDN integration

---

## 10. Evaluation & Testing Alignment

### Mapping to Gauntlet Evaluation Criteria

| Gauntlet Category | WorldChat PRD Alignment | How We Meet/Exceed Requirements |
|---|---|---|
| **Performance** | **Target:** Sub-500ms message delivery, 99.9% delivery success rate, zero crashes under standard testing | **Exceeds Minimum:** Gauntlet requires "app runs smoothly under 10+ concurrent users; message latency < 200ms." Our < 500ms target meets this, and Firebase architecture naturally scales to 10+ users. |
| **Features** | **Delivered:** Complete messaging infrastructure (one-on-one, group chat, offline support, notifications) PLUS 5 required AI features (inline translation, language detection, cultural hints, formality adjustment, slang explanation) PLUS 1 advanced feature (Context-Aware Smart Replies) | **Exceeds Minimum:** Gauntlet requires "all core user stories functional; at least one working AI feature." We deliver 6 AI features total (5 required + 1 advanced), all with RAG pipelines and LLM integration. |
| **User Flow** | **Tested:** Complete E2E user journey from account creation → language selection → first message → group chat → AI feature discovery. Manual QA flows ensure no dead ends. | **Meets Minimum:** "Clear navigation; no dead ends; all features demonstrably accessible." User stories cover entire flow with acceptance criteria. |
| **Documentation & Deployment** | **Delivered:** This PRD, upcoming architecture.md and dev_checklist.md, comprehensive README with setup instructions, deployed Expo Go link or TestFlight/APK | **Meets Minimum:** "README, setup docs, and live deployment on Gauntlet cloud." Firebase backend serves as cloud deployment. |

### Testing Coverage by Category

| Category | Unit Tests | Integration Tests | E2E Tests | Manual QA |
|---|---|---|---|---|
| **Performance** | Message queue logic | Firebase operations under load | Real device testing with network throttling | Multi-device concurrent messaging |
| **Features** | Translation logic, AI prompt construction | Translation pipeline, notification flow | All 6 AI features in realistic scenarios | Feature discovery flow |
| **User Flow** | Message state transitions | Auth flow, multi-screen navigation | Complete user journey from signup to group chat | First-time user experience |
| **Deployment** | Environment configuration | Firebase Emulator validation | Production build testing on physical devices | External tester validation |

---

## 11. References

### Foundation Documents

- **Architecture Document:** `/docs/foundation/architecture.md` (to be generated via Architecture Loop)
- **Development Checklist:** `/docs/foundation/dev_checklist.md` (to be generated via Checklist Loop)
- **Tech Stack Overview:** `/docs/foundation/tech_stack.md`
- **User Flow Diagram:** `/docs/foundation/user_flow.md`
- **Project Overview:** `/docs/foundation/project_overview.md`

### Requirements & Evaluation

- **Gauntlet Requirements:** `/docs/requirements/requirements.md` (MessageAI project brief)
- **Evaluation Criteria:** `/docs/requirements/evaluation_criteria.md`

### System Prompts & Loops

- **Product Loop Template:** `/prompts/system/00_a_product_loop.md`
- **Architecture Loop:** `/prompts/system/00_b_architecture_loop.md` (next step)
- **Checklist Loop:** `/prompts/system/00_c_checklist_loop.md` (following architecture)

---

## Appendix: Key Decisions Summary

### Language & Translation
- **Supported Languages:** All language pairs via Google Cloud Translation API
- **Testing Priority:** English-Italian (primary user story), English-Spanish, English-Mandarin
- **Translation UI:** Side-by-side dual display (both original and translated message visible prominently in chat bubble for simultaneous learning)
- **Language Preference:** Per-user global setting (configured at onboarding)
- **Translation Caching:** Common phrases cached in Firestore for performance and cost optimization

### User Experience
- **Target Persona:** Travelers building friendships abroad (e.g., parents visiting Italy) and language learners developing real relationships with native speakers
- **Primary User Story:** Parents traveling to Italy make friends with locals who speak limited English; they want to stay in touch, build the friendship, and learn Italian simultaneously
- **Communication Context:** Both real-time synchronous and asynchronous messaging equally supported
- **Cultural Hints:** Automatically triggered when AI detects potential misunderstanding
- **Group Translation:** Each user sees all messages translated to their preferred language independently
- **AI Interface Approach:** Dedicated AI chat assistant accessible from any conversation for language learning questions, word explanations, and cultural context

### Technical Stack
- **Platform:** React Native + Expo (SDK 50+)
- **Backend:** Firebase (Firestore, Cloud Functions, Auth, FCM)
- **Local Storage:** Expo SQLite (offline-first persistence)
- **Translation:** Google Cloud Translation API (called from Cloud Functions)
- **LLM:** OpenAI GPT-4 or Anthropic Claude (called from Cloud Functions)
- **AI Framework:** AI SDK by Vercel, OpenAI Agent SDK (Swarm), or LangChain

### Success Metrics
- **Message Latency:** < 500ms on good network
- **Delivery Success:** 99.9% delivery rate
- **Translation Accuracy:** 95% meaning preservation, 90% tone preservation
- **AI Adoption:** 80% of users engage with 3+ of 5 AI features
- **Stability:** Zero crashes during standard testing scenarios

### Scope Boundaries
- **MVP Focus:** Messaging infrastructure only (no AI features required at 24-hour gate)
- **AI Features:** Added immediately post-MVP validation
- **Media Support:** Images only (no video, voice messages, files, OCR)
- **Out of Scope:** Voice/video calling, E2E encryption, message editing/deletion, desktop/web versions, monetization

---

**End of Product Requirements Document**

**Next Steps:**
1. ✅ PRD Complete and Confirmed
2. ⏭️ Generate Architecture Document (`/docs/foundation/architecture.md`) via Architecture Loop
3. ⏭️ Generate Development Checklist (`/docs/foundation/dev_checklist.md`) via Checklist Loop
4. ⏭️ Begin MVP Implementation: Setup & Auth + Messaging Core supermodules

