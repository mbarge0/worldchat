# Architecture Document: WorldChat

**Document Version:** 1.0  
**Project:** WorldChat  
**Platform:** React Native + Expo + Firebase  
**Last Updated:** October 20, 2025

---

## 1. System Overview

### Purpose and Scope

WorldChat is a cross-platform mobile messaging application built on React Native and Firebase that enables travelers and language learners to build authentic friendships across language barriers. The system combines production-grade real-time messaging infrastructure (comparable to WhatsApp) with intelligent AI translation and cultural context features embedded directly into the chat experience.

### Core Problems Solved

1. **Real-Time Communication:** Instant message delivery with sub-500ms latency, offline support, and 99.9% delivery reliability
2. **Language Translation:** Automatic inline translation with side-by-side display enabling simultaneous communication and learning
3. **Cultural Context:** AI-powered hints for formality, slang, idioms, and cultural references preventing miscommunication
4. **Learning Acceleration:** Dual-language message display and AI chat assistant transform international travel into immersive language learning

### System Scope

**In Scope:**
- One-on-one and group messaging with real-time delivery
- Automatic message translation with caching
- AI features: language detection, cultural hints, formality adjustment, slang explanation, smart replies
- Dedicated AI chat assistant for learning questions
- Offline-first architecture with message queue
- Push notifications (foreground and background)
- Image sharing and profile pictures

**Out of Scope (MVP):**
- Voice/video calling
- Voice message recording with TTS playback
- Message editing/deletion
- End-to-end encryption beyond Firebase defaults
- Desktop/web clients

---

## 2. Supermodule Architecture Map

The architecture directly maps to the six supermodules defined in the PRD, organized as a layered system with clear separation of concerns.

### Supermodule-to-Component Mapping

| Supermodule | Architectural Components | Primary Technologies | Communication Pathways |
|---|---|---|---|
| **Setup & Auth** | • Auth Provider (React Context)<br>• Onboarding Flow Screens<br>• User Profile Service | • Firebase Auth<br>• Expo SecureStore<br>• React Navigation | → Messaging Core (user session)<br>→ Translation Engine (language pref) |
| **Messaging Core** | • Conversation List Screen<br>• Chat Screen<br>• Message Queue Manager<br>• Firestore Sync Service<br>• SQLite Storage Layer | • Firestore real-time listeners<br>• Expo SQLite<br>• React Native FlatList | → Translation Engine (message content)<br>→ Notifications (new messages)<br>← Setup & Auth (user context) |
| **Translation Engine** | • Translation Service (Cloud Function)<br>• Translation Cache Manager<br>• Language Detection Service | • Google Cloud Translation API<br>• Firestore (cache storage)<br>• Cloud Functions | ← Messaging Core (translate requests)<br>→ AI Intelligence Layer (translation context) |
| **AI Intelligence Layer** | • AI Service (Cloud Functions)<br>• Cultural Context Analyzer<br>• Formality Detector<br>• Smart Reply Generator<br>• AI Chat Interface | • OpenAI GPT-4 / Anthropic Claude<br>• AI SDK by Vercel<br>• RAG Pipeline (simple) | ← Messaging Core (conversation context)<br>← Translation Engine (translation data)<br>→ Messaging Core (AI insights) |
| **Group Chat & Collaboration** | • Group Manager Service<br>• Participant Resolver<br>• Per-User Translation Renderer | • Firestore queries<br>• React Context (group state) | ← Messaging Core (extends)<br>← Translation Engine (multi-target) |
| **Notifications & Lifecycle** | • Push Notification Handler<br>• App State Manager<br>• Reconnection Logic<br>• Background Task Coordinator | • Expo Notifications<br>• Firebase Cloud Messaging<br>• React Native AppState | Wraps entire system<br>← Messaging Core (notification triggers) |

### Inter-Supermodule Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    Notifications & Lifecycle                     │
│                     (Wraps Entire System)                        │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
┌───────▼────────┐         ┌──────────────────┐        │
│  Setup & Auth  │────────▶│ Messaging Core   │◀───────┤
└────────────────┘         └─────────┬────────┘        │
                                     │                  │
                           ┌─────────┴─────────┐        │
                           ▼                   ▼        │
                  ┌────────────────┐   ┌───────────────▼────┐
                  │   Translation  │──▶│  AI Intelligence   │
                  │     Engine     │   │       Layer        │
                  └────────────────┘   └────────────────────┘
                           │                   ▲
                           ▼                   │
                  ┌────────────────────────────┘
                  │  Group Chat &   │
                  │  Collaboration  │
                  └─────────────────┘
```

**Key Integration Points:**

1. **Auth → Messaging:** User session token, language preference passed to all message operations
2. **Messaging → Translation:** Message content sent to translation service; translations stored back in message document
3. **Translation → AI:** Translation data used as context for cultural hints and formality detection
4. **Messaging → AI:** Conversation history provided to AI chat assistant via RAG pipeline
5. **Messaging → Notifications:** New message events trigger Cloud Functions that send FCM notifications
6. **Group Chat → Translation:** Each participant's language preference triggers independent translation requests

---

## 3. System Diagram

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         React Native App (Expo)                       │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                        UI Layer                              │    │
│  │  • Conversation List  • Chat Screen  • AI Assistant Modal   │    │
│  │  • Onboarding Flow    • Settings     • Profile              │    │
│  └────────────┬──────────────────────────────┬─────────────────┘    │
│               │                               │                       │
│  ┌────────────▼───────────────┐  ┌───────────▼──────────────┐       │
│  │    State Management        │  │   Navigation Router      │       │
│  │    (React Context/Redux)   │  │   (React Navigation)     │       │
│  └────────────┬───────────────┘  └──────────────────────────┘       │
│               │                                                       │
│  ┌────────────▼────────────────────────────────────────────────┐    │
│  │                    Service Layer                             │    │
│  │                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │    │
│  │  │ Auth Service │  │ Message Svc  │  │ Translation Svc │  │    │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │    │
│  │         │                  │                   │            │    │
│  │  ┌──────▼──────┐  ┌───────▼────────┐  ┌───────▼─────────┐ │    │
│  │  │ Queue Mgr   │  │ Firestore Sync │  │ Cache Manager   │ │    │
│  │  └─────────────┘  └───────┬────────┘  └─────────────────┘ │    │
│  └──────────────────────────┬┴──────────────────────────────┘ │    │
│                             │                                   │    │
│  ┌──────────────────────────▼────────────────────────────────┐ │    │
│  │               Local Storage (Expo SQLite)                  │ │    │
│  │  • messages  • conversations  • users  • queue             │ │    │
│  └────────────────────────────────────────────────────────────┘ │    │
└──────────────────────────────┬────────────────────────────────────┘
                               │
                    HTTPS / WebSocket
                               │
┌──────────────────────────────▼────────────────────────────────────┐
│                       Firebase Backend                             │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Firebase Auth  │  │    Firestore     │  │  Cloud Functions │ │
│  │  • Email/Pass   │  │  • Conversations │  │  • Translation   │ │
│  │  • Google       │  │  • Messages      │  │  • AI Service    │ │
│  │  • Apple        │  │  • Users         │  │  • Notifications │ │
│  └─────────────────┘  │  • Cache         │  └────────┬─────────┘ │
│                       │  • Presence      │           │            │
│                       └──────────────────┘           │            │
│                                                      │            │
│  ┌───────────────────────────────────────────────────▼─────────┐ │
│  │              Firebase Cloud Messaging (FCM)                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬──────────────────────────────────┘
                                │
                     External API Calls
                                │
         ┌──────────────────────┴────────────────────────┐
         │                                                │
┌────────▼──────────────┐              ┌─────────────────▼────────┐
│  Google Cloud APIs    │              │   OpenAI / Anthropic     │
│  • Translation API    │              │   • GPT-4 / Claude       │
│  • Language Detection │              │   • Function Calling     │
│  • (Future: TTS, STT) │              │   • Streaming Responses  │
└───────────────────────┘              └──────────────────────────┘
```

### Message Flow Diagram

```
┌─────────────┐                                        ┌─────────────┐
│   User A    │                                        │   User B    │
│  (Sender)   │                                        │ (Receiver)  │
└──────┬──────┘                                        └──────▲──────┘
       │                                                      │
       │ 1. Type & Send Message                              │
       ▼                                                      │
┌─────────────────────────────────────────┐                  │
│  React Native App (User A)              │                  │
│  • Optimistic UI Update (show message)  │                  │
│  • Write to local SQLite                │                  │
│  • Queue for Firestore sync             │                  │
└──────┬──────────────────────────────────┘                  │
       │                                                      │
       │ 2. HTTPS POST                                        │
       ▼                                                      │
┌────────────────────────────────────────────────┐           │
│  Firestore (Cloud)                             │           │
│  /conversations/{id}/messages/{msgId}          │           │
│  • Write message with originalText             │           │
│  • Status: "sent"                              │           │
└──────┬──────────────────────────────────────┬──┘           │
       │                                      │              │
       │ 3. Firestore Trigger                 │              │
       ▼                                      │              │
┌────────────────────────────────────┐        │              │
│  Cloud Function: onMessageCreated  │        │              │
│  • Trigger FCM notification        │        │              │
│  • Update conversation lastMessage │        │              │
└────────────────────────────────────┘        │              │
                                              │              │
                                              │ 4. Real-time │
                                              │    Listener  │
                                              ▼              │
                                    ┌────────────────────────┴─────┐
                                    │  React Native App (User B)   │
                                    │  • Receive message via        │
                                    │    Firestore listener         │
                                    │  • Check for translation      │
                                    │    in message.translations{}  │
                                    └──────┬───────────────────────┘
                                           │
                                           │ 5. If translation missing
                                           ▼
                                    ┌──────────────────────────────┐
                                    │  Cloud Function:             │
                                    │  translateMessage            │
                                    │  • Check cache first         │
                                    │  • Call Google Translate API │
                                    │  • Store in message doc      │
                                    └──────┬───────────────────────┘
                                           │
                                           │ 6. Translation result
                                           ▼
                                    ┌──────────────────────────────┐
                                    │  User B's App                │
                                    │  • Display dual-language UI  │
                                    │    - Original (top)          │
                                    │    - Translated (below)      │
                                    │  • Write to local SQLite     │
                                    │  • Show notification         │
                                    └──────────────────────────────┘
```

---

## 4. Core Entities and Data Model

### Firestore Collections

#### `/users/{userId}`

Primary user profile and settings document.

```typescript
{
  userId: string;              // Firebase Auth UID
  email: string;
  displayName: string;
  profilePictureUrl?: string;
  preferredLanguage: string;   // ISO 639-1 code (e.g., "en", "it", "es")
  createdAt: Timestamp;
  lastSeen: Timestamp;
  isOnline: boolean;
  fcmTokens: string[];         // Array of FCM device tokens
}
```

**Indexes:**
- `email` (for user lookup)
- `lastSeen` (for presence queries)

**Security Rules:**
- Users can read/write their own document only
- Other users can read displayName, profilePictureUrl, isOnline, lastSeen (public profile info)

---

#### `/conversations/{conversationId}`

Conversation metadata for one-on-one and group chats.

```typescript
{
  conversationId: string;
  type: "oneToOne" | "group";
  participants: string[];      // Array of userIds
  participantDetails: {        // Denormalized for quick access
    [userId: string]: {
      displayName: string;
      profilePictureUrl?: string;
      preferredLanguage: string;
    }
  };
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `participants` (array-contains for user's conversation list)
- `updatedAt` (for sorting conversation list)

**Security Rules:**
- Users can read conversations where `participants` array contains their userId
- Users can write (create/update) conversations where they are a participant

---

#### `/conversations/{conversationId}/messages/{messageId}` (Subcollection)

Individual messages within a conversation.

```typescript
{
  messageId: string;
  conversationId: string;      // Parent reference
  senderId: string;
  senderName: string;          // Denormalized for display
  originalText: string;
  originalLanguage: string;    // Auto-detected ISO code
  translations: {              // Map of language code → translated text
    "it": "Translated text in Italian",
    "es": "Translated text in Spanish",
    // ... other languages as needed
  };
  timestamp: Timestamp;
  status: "sending" | "sent" | "delivered" | "read";
  readBy: {                    // Map of userId → read timestamp
    [userId: string]: Timestamp;
  };
  type: "text" | "image";
  imageUrl?: string;           // If type === "image"
  
  // AI Features (optional fields)
  hasCulturalContext?: boolean;
  culturalHint?: string;
  formalityLevel?: "casual" | "neutral" | "formal";
  formalityWarning?: string;
  containsSlang?: boolean;
  slangExplanations?: {
    [term: string]: string;
  };
}
```

**Indexes:**
- `conversationId + timestamp` (composite for chronological message queries)
- `senderId + timestamp` (for user's message history)

**Security Rules:**
- Users can read messages in conversations where they are a participant
- Users can write (create) messages in conversations where they are a participant
- Users cannot delete or edit messages (MVP restriction)

---

#### `/translationCache/{cacheKey}`

Reusable translation cache for common phrases.

```typescript
{
  cacheKey: string;            // Hash of sourceText + sourceLang + targetLang
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  usageCount: number;
  createdAt: Timestamp;
  lastUsedAt: Timestamp;
  expiresAt: Timestamp;        // TTL = 30 days from lastUsedAt
  visibility: "public" | "private";  // Public for common phrases
}
```

**Indexes:**
- `cacheKey` (primary lookup)
- `expiresAt` (for cleanup Cloud Function)
- `visibility + usageCount` (for popular phrase analytics)

**Security Rules:**
- Public cache: All authenticated users can read
- Private cache: Only conversation participants can read
- Write access: Cloud Functions only

---

#### `/presence/{userId}`

Ephemeral typing indicators and presence state.

```typescript
{
  userId: string;
  conversationId: string;      // Which conversation user is active in
  isTyping: boolean;
  lastTypingAt: Timestamp;     // Client-side TTL = 3 seconds
  updatedAt: Timestamp;
}
```

**Indexes:**
- `conversationId + isTyping` (for querying who's typing in a conversation)

**Security Rules:**
- Users can read presence for conversations they participate in
- Users can write their own presence document only

**TTL Strategy:** Client-side cleanup (remove after 3 seconds of inactivity)

---

### SQLite Schema (Local Storage)

The local SQLite schema mirrors Firestore structure for offline-first architecture.

#### `users` Table

```sql
CREATE TABLE users (
  userId TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  displayName TEXT NOT NULL,
  profilePictureUrl TEXT,
  preferredLanguage TEXT NOT NULL,
  isOnline INTEGER DEFAULT 0,
  lastSeen INTEGER,
  createdAt INTEGER NOT NULL
);
```

---

#### `conversations` Table

```sql
CREATE TABLE conversations (
  conversationId TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('oneToOne', 'group')),
  participants TEXT NOT NULL,  -- JSON array of userIds
  participantDetails TEXT,     -- JSON object of participant info
  lastMessageText TEXT,
  lastMessageSenderId TEXT,
  lastMessageTimestamp INTEGER,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE INDEX idx_conversations_updated 
  ON conversations(updatedAt DESC);
```

---

#### `messages` Table

```sql
CREATE TABLE messages (
  messageId TEXT PRIMARY KEY,
  conversationId TEXT NOT NULL,
  senderId TEXT NOT NULL,
  senderName TEXT NOT NULL,
  originalText TEXT NOT NULL,
  originalLanguage TEXT,
  translations TEXT,           -- JSON object of language → translation
  timestamp INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('sending', 'sent', 'delivered', 'read')),
  readBy TEXT,                 -- JSON object of userId → timestamp
  type TEXT NOT NULL CHECK(type IN ('text', 'image')),
  imageUrl TEXT,
  hasCulturalContext INTEGER DEFAULT 0,
  culturalHint TEXT,
  formalityLevel TEXT,
  formalityWarning TEXT,
  containsSlang INTEGER DEFAULT 0,
  slangExplanations TEXT,      -- JSON object
  FOREIGN KEY (conversationId) REFERENCES conversations(conversationId)
);

CREATE INDEX idx_messages_conversation_timestamp 
  ON messages(conversationId, timestamp ASC);
  
CREATE INDEX idx_messages_sender 
  ON messages(senderId, timestamp DESC);
```

---

#### `messageQueue` Table

Queue for offline messages pending sync to Firestore.

```sql
CREATE TABLE messageQueue (
  queueId TEXT PRIMARY KEY,
  messageId TEXT NOT NULL,
  conversationId TEXT NOT NULL,
  payload TEXT NOT NULL,       -- JSON serialized message object
  retryCount INTEGER DEFAULT 0,
  createdAt INTEGER NOT NULL,
  lastAttemptAt INTEGER
);

CREATE INDEX idx_queue_created 
  ON messageQueue(createdAt ASC);
```

---

### Data Constraints and Validation

| Entity | Constraint | Validation |
|---|---|---|
| User.preferredLanguage | Must be valid ISO 639-1 code | Client-side: Dropdown selection only<br>Server-side: Firestore rules check against allowlist |
| Message.originalText | Max length 5000 characters | Client-side: Input validation<br>Server-side: Cloud Functions check |
| Conversation.participants | Min 2 users, max 50 users | Client-side: UI enforcement<br>Server-side: Firestore rules array length check |
| Translation Cache | sourceText max 1000 chars | Cloud Functions validation before caching |
| Message.status | Must follow state progression | Client-side state machine: sending → sent → delivered → read |

---

## 5. Data Flow

### Primary Flows

#### Flow 1: User Sends Message (Online)

```
1. User types message in Chat Screen
   └─▶ React Native TextInput component

2. User taps Send button
   └─▶ Message Service creates local message object
       └─▶ Generate messageId (UUID)
       └─▶ Set status = "sending"
       └─▶ Detect originalLanguage (client-side basic detection)

3. Optimistic UI Update
   └─▶ Display message in FlatList immediately
   └─▶ Show "sending" indicator (single gray checkmark)

4. Write to Local SQLite
   └─▶ INSERT into messages table
   └─▶ UPDATE conversations.lastMessage

5. Sync to Firestore
   └─▶ Firestore.collection('conversations').doc(id)
       .collection('messages').add(messageObject)
   
6. Firestore Write Success
   └─▶ Update local message status = "sent"
   └─▶ UI shows "sent" indicator (double gray checkmark)
   
7. Firestore Trigger: onMessageCreated Cloud Function
   └─▶ Get conversation participants
   └─▶ For each participant (except sender):
       └─▶ Check if user is online
       └─▶ Send FCM notification via Firebase Admin SDK
   └─▶ Update conversation.lastMessage
   └─▶ Update conversation.updatedAt

8. Recipient's Device Receives Real-Time Update
   └─▶ Firestore listener fires onSnapshot event
   └─▶ Message Service receives new message
   └─▶ Write to local SQLite
   └─▶ Check if translation exists for user's language
       └─▶ If missing, call Cloud Function: translateMessage
   └─▶ Display in Chat Screen with dual-language UI
   └─▶ Trigger local notification if app backgrounded

9. Recipient Reads Message
   └─▶ Update message.readBy[recipientId] = Timestamp
   └─▶ Sync to Firestore
   └─▶ Sender's device receives update via listener
   └─▶ UI shows "read" indicator (double blue checkmark)
```

---

#### Flow 2: User Sends Message (Offline)

```
1. User types and sends message (no network)
   └─▶ Steps 1-4 from Flow 1 (local operations only)

2. Firestore Sync Attempt Fails
   └─▶ Catch network error
   └─▶ Message Service adds to messageQueue table
       └─▶ INSERT INTO messageQueue (messageId, payload, createdAt)
   └─▶ UI shows "queued" indicator (clock icon)

3. App Detects Network Reconnection
   └─▶ AppState listener detects network change
   └─▶ Queue Manager service activates

4. Queue Manager Processes Queue
   └─▶ SELECT * FROM messageQueue ORDER BY createdAt ASC
   └─▶ For each queued message:
       └─▶ Attempt Firestore write
       └─▶ On success:
           └─▶ DELETE FROM messageQueue WHERE queueId = ?
           └─▶ UPDATE messages SET status = "sent"
       └─▶ On failure:
           └─▶ Increment retryCount
           └─▶ Exponential backoff (retry after 2^retryCount seconds)

5. Continue from Step 6 of Flow 1 (Firestore Write Success)
```

---

#### Flow 3: Translation Request (Cache Miss)

```
1. Recipient receives message via Firestore listener
   └─▶ Message object: { originalText: "Hello", originalLanguage: "en" }
   └─▶ Recipient's preferredLanguage: "it"

2. Check for existing translation
   └─▶ if (message.translations["it"]) → Display immediately
   └─▶ else → Translation Cache Miss

3. Generate Cache Key
   └─▶ cacheKey = hash(originalText + "en" + "it")

4. Check Translation Cache Collection
   └─▶ Firestore.collection('translationCache').doc(cacheKey).get()
   
5. If Cache Hit
   └─▶ translatedText = cacheDoc.data().translatedText
   └─▶ Update message document with translation
   └─▶ Display in UI

6. If Cache Miss
   └─▶ Call Cloud Function: translateMessage
       └─▶ HTTPS POST to Cloud Function endpoint
       └─▶ Function calls Google Cloud Translation API
           └─▶ POST to https://translation.googleapis.com/v3/projects/...
           └─▶ Request: { q: "Hello", source: "en", target: "it" }
           └─▶ Response: { translatedText: "Ciao" }
   └─▶ Cloud Function returns translation
   └─▶ Cloud Function writes to translationCache collection
       └─▶ visibility = "public" (if common phrase)
       └─▶ visibility = "private" (if personal message)
   └─▶ Cloud Function updates message.translations["it"] = "Ciao"
   
7. Client receives updated message via listener
   └─▶ Display dual-language UI:
       ┌─────────────────────────────────────┐
       │ Hello                      [Original]│
       │ Ciao                    [Translated] │
       │                              [Hint 🌍]│
       └─────────────────────────────────────┘
```

---

#### Flow 4: AI Cultural Hint Detection

```
1. Message sent with potentially ambiguous cultural content
   └─▶ originalText: "Let's meet for dinner at 9 PM"
   
2. Cloud Function: onMessageCreated trigger
   └─▶ After translation, call AI Service: analyzeCulturalContext
   
3. AI Service Cloud Function
   └─▶ Construct prompt for LLM:
       """
       Analyze if this message contains cultural context that might
       be misunderstood across cultures:
       
       Message: "Let's meet for dinner at 9 PM"
       Sender culture: American (inferred from language)
       Receiver culture: Italian
       
       Return JSON:
       {
         "hasCulturalContext": boolean,
         "hint": string or null,
         "relevance": "high" | "medium" | "low"
       }
       """
   
4. Call OpenAI/Claude API
   └─▶ POST to https://api.openai.com/v1/chat/completions
   └─▶ Model: gpt-4-turbo
   └─▶ Function calling for structured output
   
5. LLM Response:
   ```json
   {
     "hasCulturalContext": true,
     "hint": "In Italy, 9 PM is considered quite early for dinner. Most Italians eat dinner between 8-10 PM, with 9:30 PM being typical. This invitation timing is perfectly normal.",
     "relevance": "medium"
   }
   ```

6. AI Service updates message document
   └─▶ message.hasCulturalContext = true
   └─▶ message.culturalHint = "In Italy, 9 PM is..."
   
7. Recipient's UI displays hint badge
   └─▶ Show 🌍 icon on message bubble
   └─▶ Tap to expand and read full hint in modal
```

---

#### Flow 5: AI Chat Assistant (RAG Pipeline)

```
1. User taps "Ask AI" button from Chat Screen
   └─▶ Navigation opens AI Assistant Modal
   └─▶ Modal displays chat interface with AI "user"

2. User asks question: "What does 'fare una passeggiata' mean?"

3. Client sends message to special AI conversation
   └─▶ conversationId = "ai_assistant_{userId}"
   └─▶ Message stored in Firestore like regular message

4. Cloud Function: onAIMessageCreated trigger
   └─▶ Retrieve conversation history (last 20 messages from actual conversation)
   └─▶ Extract relevant context via simple RAG:
       └─▶ Get messages from past 7 days
       └─▶ Filter for messages containing Italian
       └─▶ Include last 5 exchanges between user and friend

5. Construct LLM Prompt
   ```
   You are a language learning assistant helping a user understand
   their conversation with an Italian friend.
   
   Conversation Context:
   - Friend: "Vuoi fare una passeggiata domani?"
   - User: "Yes, that sounds great!"
   - Friend: "Perfetto! Ci vediamo alle 10."
   
   User Question: "What does 'fare una passeggiata' mean?"
   
   Provide a clear explanation with:
   1. Direct translation
   2. Literal meaning vs. common usage
   3. Example in context
   4. Related phrases they might encounter
   ```

6. Call LLM (OpenAI GPT-4 or Claude)
   └─▶ Stream response back to Cloud Function
   
7. Cloud Function streams response to client
   └─▶ AI SDK by Vercel handles streaming
   └─▶ Client displays response token-by-token in UI
   
8. Response stored as AI message in conversation
   └─▶ senderId = "ai_assistant"
   └─▶ Full response stored for future reference
```

---

### Event Flow and Real-Time Mechanisms

#### Firestore Real-Time Listeners

**Active Conversation Listener (Dedicated):**
```typescript
// Subscribes when user enters Chat Screen
const unsubscribe = firestore
  .collection('conversations')
  .doc(conversationId)
  .collection('messages')
  .orderBy('timestamp', 'asc')
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // New message received
        handleNewMessage(change.doc.data());
      }
      if (change.type === 'modified') {
        // Message status updated (read receipt, translation added)
        updateLocalMessage(change.doc.data());
      }
    });
  });

// Unsubscribes when user leaves Chat Screen
```

**Global Conversation List Listener:**
```typescript
// Subscribes on app launch, maintains throughout session
const unsubscribe = firestore
  .collection('conversations')
  .where('participants', 'array-contains', currentUserId)
  .orderBy('updatedAt', 'desc')
  .onSnapshot((snapshot) => {
    // Update conversation list
    // Show badge count for unread messages
  });
```

**Presence Listener (Per Conversation):**
```typescript
// Subscribes when user enters Chat Screen
const unsubscribe = firestore
  .collection('presence')
  .where('conversationId', '==', conversationId)
  .where('isTyping', '==', true)
  .onSnapshot((snapshot) => {
    // Show "User is typing..." indicator
  });
```

---

## 6. Dependencies and Integrations

### Core Dependencies

#### Firebase Suite

| Service | Version | Purpose |
|---|---|---|
| `firebase` | 10.x | Core Firebase SDK |
| `@react-native-firebase/app` | 18.x | Firebase initialization for React Native |
| `@react-native-firebase/auth` | 18.x | Authentication service |
| `@react-native-firebase/firestore` | 18.x | Real-time database |
| `@react-native-firebase/functions` | 18.x | Cloud Functions client |
| `@react-native-firebase/messaging` | 18.x | Push notifications (FCM) |
| `@react-native-firebase/storage` | 18.x | Image uploads |

**Backend (Cloud Functions):**
```json
{
  "firebase-admin": "^11.x",
  "firebase-functions": "^4.x"
}
```

---

#### React Native & Expo

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~50.x | Expo SDK core |
| `react-native` | 0.73.x | React Native framework |
| `react-navigation` | 6.x | Navigation (stack, tab, modal) |
| `expo-sqlite` | ~13.x | Local database |
| `expo-notifications` | ~0.27.x | Push notification handling |
| `expo-secure-store` | ~12.x | Secure token storage |
| `expo-image-picker` | ~14.x | Camera/gallery access |
| `react-native-gifted-chat` | 2.x | Chat UI components (optional, may customize) |

---

#### AI & Translation

| Service | API Version | Purpose | Cost Model |
|---|---|---|---|
| **Google Cloud Translation API** | v3 | Message translation | $20 per 1M characters |
| **OpenAI GPT-4 Turbo** | gpt-4-turbo | Cultural hints, formality, smart replies | $10/1M input tokens, $30/1M output tokens |
| **Anthropic Claude 3.5 Sonnet** | claude-3-5-sonnet | AI chat assistant (long context) | $3/1M input tokens, $15/1M output tokens |
| **AI SDK by Vercel** | 3.x | LLM orchestration, streaming | Free (client library) |

**Cloud Functions Dependencies:**
```json
{
  "@google-cloud/translate": "^8.x",
  "ai": "^3.x",
  "openai": "^4.x",
  "@anthropic-ai/sdk": "^0.20.x"
}
```

---

#### Development & Testing

| Tool | Purpose |
|---|---|
| `typescript` | Type safety across app and functions |
| `jest` | Unit testing framework |
| `@testing-library/react-native` | Component testing |
| `firebase-tools` | CLI for Firebase deployment |
| `firebase-admin` (emulator) | Local Firebase emulation |
| `prettier` | Code formatting |
| `eslint` | Linting |

---

### Third-Party Integrations

#### Authentication Providers

- **Firebase Email/Password:** Built-in, no additional integration
- **Google Sign-In:** `@react-native-google-signin/google-signin` (3.x)
- **Apple Sign-In:** `expo-apple-authentication` (~6.x)

**Configuration:**
- OAuth redirect URLs configured in Firebase Console
- iOS: Add capabilities in Xcode (Sign in with Apple)
- Android: SHA-256 certificate fingerprints registered

---

#### Push Notifications

**Flow:**
```
1. Expo Notifications generates FCM token on device
2. Client stores token in users.fcmTokens[] array
3. Cloud Function sends notifications via Firebase Admin SDK
4. Expo Notifications receives and displays notification
```

**Permissions:**
- iOS: Request permission on app launch or first message send
- Android: Auto-granted for SDK 33+

---

#### Image Storage

**Firebase Cloud Storage Integration:**
```
1. User selects image via expo-image-picker
2. Upload to Cloud Storage: /users/{userId}/images/{imageId}.jpg
3. Get download URL
4. Store URL in message.imageUrl field
5. Display image using React Native Image component
```

**Image Optimization:**
- Client-side: Compress before upload (reduce dimensions to max 1200px width)
- Server-side: Cloud Function can trigger image resizing (future optimization)

---

### Environment Configuration

#### Client Environment (.env)

```bash
# Firebase Config (from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_CHAT=true
EXPO_PUBLIC_ENABLE_SMART_REPLIES=true
```

#### Cloud Functions Environment

```bash
# Set via Firebase CLI
firebase functions:config:set \
  translation.api_key="xxx" \
  openai.api_key="xxx" \
  anthropic.api_key="xxx"
```

**Security:** All API keys stored server-side only, never in client bundle.

---

## 7. Security and Performance Considerations

### Security

#### Firestore Security Rules

**Users Collection:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read/write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // All authenticated users can read public profile fields
      allow read: if request.auth != null;
    }
  }
}
```

**Conversations Collection:**
```javascript
match /conversations/{conversationId} {
  // Read if user is participant
  allow read: if request.auth != null && 
    request.auth.uid in resource.data.participants;
  
  // Create if user is in participants list
  allow create: if request.auth != null && 
    request.auth.uid in request.resource.data.participants;
  
  // Update if user is participant (for lastMessage, etc.)
  allow update: if request.auth != null && 
    request.auth.uid in resource.data.participants;
}
```

**Messages Subcollection:**
```javascript
match /conversations/{conversationId}/messages/{messageId} {
  // Read if user is conversation participant
  allow read: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
  
  // Create if user is conversation participant and is the sender
  allow create: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants &&
    request.auth.uid == request.resource.data.senderId;
  
  // Update only for read receipts (no editing/deleting)
  allow update: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['readBy', 'status']);
}
```

**Translation Cache:**
```javascript
match /translationCache/{cacheKey} {
  // Public cache readable by all authenticated users
  allow read: if request.auth != null && resource.data.visibility == "public";
  
  // Private cache readable only by specified users (future implementation)
  allow read: if request.auth != null && resource.data.visibility == "private";
  
  // Write access: Cloud Functions only (via Admin SDK, bypasses rules)
  allow write: if false;
}
```

---

#### Authentication & Authorization

**Token Management:**
- Firebase Auth JWT tokens stored in Expo SecureStore
- Tokens automatically refreshed by Firebase SDK
- Token expiration: 1 hour (Firebase default)
- Refresh tokens valid for 30 days

**Cloud Functions Authorization:**
```typescript
// All Cloud Functions verify auth token
export const translateMessage = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }
  
  const userId = context.auth.uid;
  // Verify user is participant in conversation
  // ... business logic
});
```

---

### Performance Considerations

#### Latency Goals

| Operation | Target Latency | Mitigation Strategy |
|---|---|---|
| **Message Send (Local)** | < 50ms | Optimistic UI update, SQLite write |
| **Message Send (Firestore)** | < 200ms | Indexed writes, regional deployment |
| **Message Receive** | < 500ms | Real-time listeners, WebSocket connection |
| **Translation (Cache Hit)** | < 100ms | Firestore indexed query |
| **Translation (Cache Miss)** | < 2s | Google Translation API, async update |
| **AI Feature (Cultural Hint)** | < 3s | Async processing, background update |
| **AI Chat Response** | < 5s | Streaming response, show progress |

---

#### Caching Strategy

**1. Translation Cache (Firestore)**
- Cache key: `hash(sourceText + sourceLang + targetLang)`
- TTL: 30 days from last use
- Visibility: Public for common phrases (< 50 chars), private for longer messages
- Expected hit rate: 40-60% after first week of usage

**2. Image Cache (React Native)**
- Use `expo-image` with built-in caching
- Max cache size: 100 MB
- LRU eviction policy

**3. Message Cache (SQLite)**
- All messages cached locally permanently
- Provides instant load times for conversation history
- Sync strategy: Load from SQLite first, then sync from Firestore

---

#### Firestore Query Optimization

**Indexed Queries:**
```javascript
// Composite indexes defined in firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "conversationId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participants", "arrayConfig": "CONTAINS" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**Pagination Strategy:**
- Conversations list: Load 20 at a time, infinite scroll
- Messages: Load last 50 on conversation open, load more on scroll to top
- Firestore cursor pagination using `.startAfter(lastDoc)`

---

#### Known Trade-offs

| Design Choice | Trade-off | Justification |
|---|---|---|
| **Translations stored in message doc** | Increases document size | Faster reads (no joins), acceptable given Firestore 1MB doc limit |
| **Subcollections for messages** | Harder to query across conversations | Better security isolation, natural hierarchical structure |
| **Client-side language detection** | Less accurate than Google API | Saves API calls; server validates and corrects if needed |
| **Simple RAG (last N messages)** | Less context-aware than vector search | Sufficient for MVP; full RAG adds complexity and cost |
| **Firestore for presence** | Higher latency than RTDB | Simpler architecture (one database), acceptable 1-2s latency |
| **No message editing/deletion** | Less feature parity with WhatsApp | Simplifies sync logic, security rules, and offline handling |

---

## 8. Performance & Scaling

### MVP Targets (Week 1)

| Metric | Target | Measurement Method |
|---|---|---|
| **Concurrent Users** | 10-50 users | Load test via Firestore emulator + multiple devices |
| **Message Delivery Latency** | < 500ms (WiFi) | Monitor Firestore operation timestamps |
| **App Startup Time** | < 3s to conversation list | Performance profiling in Expo |
| **Message Load Time** | < 1s for 50 messages | SQLite query + render profiling |
| **Translation API Latency** | < 2s per message | Cloud Functions execution logs |
| **Offline Queue Processing** | 100% delivery on reconnect | Test with 20 queued messages |
| **Memory Usage** | < 150 MB | React Native memory profiler |

---

### Production Scaling Targets (Post-MVP)

| Metric | Target | Scaling Strategy |
|---|---|---|
| **Concurrent Users** | 1,000-10,000 | Firestore auto-scales; monitor quotas |
| **Messages per Second** | 100-500 | Cloud Functions auto-scale to 1,000 instances |
| **Translation Cache Hit Rate** | 60%+ | Expand cache to include more phrases |
| **Cloud Function Cold Starts** | < 2s | Keep 2-5 min instances warm (production only) |
| **Database Reads** | < 1M per day (free tier) | Optimize listener queries, reduce polling |
| **Database Writes** | < 100K per day | Batch presence updates, debounce typing indicators |

---

### Optimization Strategies

#### Client-Side Optimizations

**1. FlatList Rendering Optimization:**
```typescript
// Virtualized scrolling for message lists
<FlatList
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item) => item.messageId}
  initialNumToRender={20}
  maxToRenderPerBatch={10}
  windowSize={21}
  removeClippedSubviews={true}
  getItemLayout={getItemLayout} // Fixed height optimization
/>
```

**2. Image Lazy Loading:**
- Use `expo-image` with blur hash placeholders
- Load thumbnails first (100px width), full resolution on tap
- Implement progressive JPEG encoding

**3. Debouncing & Throttling:**
- Typing indicators: Throttle to max 1 update per second
- Presence updates: Debounce for 3 seconds of inactivity
- Search queries: Debounce for 300ms

---

#### Server-Side Optimizations

**1. Cloud Functions Optimization:**
```typescript
// Minimize cold start time
// - Use lightweight dependencies
// - Lazy-load heavy libraries
// - Reuse HTTP connections

import * as functions from 'firebase-functions';

const translationClient = null; // Lazy init

export const translateMessage = functions.https.onCall(async (data, context) => {
  // Lazy load only when needed
  if (!translationClient) {
    const { Translate } = require('@google-cloud/translate').v2;
    translationClient = new Translate();
  }
  
  // Reuse client across invocations
  const [translation] = await translationClient.translate(data.text, data.targetLang);
  return translation;
});
```

**2. Batching Strategy:**
- Batch Firestore writes when possible (up to 500 operations per batch)
- Group chat notifications: Single function call, batch FCM sends
- Translation cache updates: Batch write multiple translations

**3. Rate Limiting:**
```typescript
// Prevent API abuse
const rateLimiter = rateLimit({
  tokensPerInterval: 10, // 10 requests
  interval: 'minute',
  firestore: admin.firestore()
});

export const translateMessage = functions.https.onCall(async (data, context) => {
  await rateLimiter.consume(context.auth.uid, 1);
  // ... translation logic
});
```

---

#### Database Optimizations

**1. Denormalization:**
- Store `senderName` and `profilePictureUrl` in message documents
- Avoids joins, enables faster rendering
- Trade-off: Must update if user changes name (acceptable)

**2. Firestore Composite Indexes:**
- Pre-create indexes for all query patterns
- Deploy via `firestore.indexes.json`
- Monitor index usage in Firebase Console

**3. TTL Cleanup:**
```typescript
// Scheduled Cloud Function runs daily
export const cleanupExpiredCache = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const expiredDocs = await admin.firestore()
      .collection('translationCache')
      .where('expiresAt', '<', admin.firestore.Timestamp.now())
      .limit(500)
      .get();
    
    const batch = admin.firestore().batch();
    expiredDocs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  });
```

---

## 9. Risks & Unknowns

### Technical Risks

| Risk | Impact | Probability | Mitigation Strategy |
|---|---|---|---|
| **Firestore Cost Overrun** | High (unexpected billing) | Medium | • Monitor quotas daily<br>• Set billing alerts at $50, $100<br>• Optimize queries to reduce reads<br>• Cache aggressively |
| **Translation API Cost** | Medium (variable costs) | Medium | • Implement translation cache with high hit rate<br>• Character limit (5000 per message)<br>• Monitor usage via Cloud Functions logs |
| **LLM API Latency** | Medium (slow AI features) | Low-Medium | • Set timeout at 10s<br>• Implement async processing (don't block message send)<br>• Graceful degradation if API fails |
| **Cold Start Latency** | Medium (first function slow) | High | • Accept 1-3s delay for MVP<br>• Post-MVP: Keep functions warm via scheduled pings<br>• Optimize bundle size |
| **Offline Sync Conflicts** | High (data loss/duplication) | Low | • Messages are append-only (no edits)<br>• Use Firestore server timestamps<br>• Test extensively with network throttling |
| **React Native Performance** | Medium (UI jank) | Medium | • Use FlatList virtualization<br>• Profile with React DevTools<br>• Implement shouldComponentUpdate |
| **Firebase Quota Limits** | High (app stops working) | Low | • Free tier: 50K reads, 20K writes per day<br>• Monitor in Firebase Console<br>• Upgrade to Blaze plan if approaching limits |

---

### Unvalidated Assumptions

| Assumption | Risk if Wrong | Validation Plan |
|---|---|---|
| **Google Translation API is accurate enough** | Users find translations confusing or incorrect | • Test with bilingual users during MVP<br>• Implement thumbs up/down feedback<br>• Compare with DeepL for quality assessment |
| **Users will accept 1-2s translation latency** | UX feels sluggish, users frustrated | • User testing with prototype<br>• A/B test with/without loading indicators<br>• Monitor analytics for feature abandonment |
| **Cultural hints are helpful, not annoying** | Users disable feature, feel patronized | • Make hints opt-in or easily dismissible<br>• Track engagement metrics (tap rate on hints)<br>• Gather qualitative feedback |
| **Firebase Firestore can handle real-time group chat** | Performance degrades with 10+ participants | • Load test with Firebase Emulator<br>• Stress test with 50-person group<br>• Monitor latency in production |
| **RAG with last N messages provides sufficient context** | AI responses lack relevant context | • User testing of AI chat quality<br>• Compare with full vector search implementation<br>• Iterate on N (10, 20, 50 messages) |
| **Users want AI chat assistant** | Feature unused, wasted development effort | • Analytics: Track modal open rate<br>• Qualitative interviews with test users<br>• Consider removing if < 20% adoption |

---

### Potential Bottlenecks

#### Client-Side Bottlenecks

1. **Large Conversation Rendering:**
   - **Issue:** 1000+ messages in conversation causes slow FlatList
   - **Mitigation:** Pagination (load 50 at a time), virtualization, fixed heights

2. **SQLite Write Performance:**
   - **Issue:** Rapid message sending could block SQLite writes
   - **Mitigation:** Batch writes, use background thread, WAL mode

3. **Image Memory Usage:**
   - **Issue:** Many images in conversation could cause OOM crashes
   - **Mitigation:** Aggressive cache eviction, thumbnail-first loading

#### Server-Side Bottlenecks

1. **Translation API Rate Limits:**
   - **Issue:** Google Translation API has quota limits
   - **Mitigation:** Implement request queuing, exponential backoff

2. **Firestore Listener Connections:**
   - **Issue:** Each listener counts toward concurrent connection limits
   - **Mitigation:** Close listeners when not needed, use global listener for background

3. **Cloud Functions Concurrent Executions:**
   - **Issue:** Free tier limited to 1000 concurrent executions
   - **Mitigation:** Optimize function duration, upgrade to Blaze plan

---

### Fallback & Degradation Strategies

| Failure Scenario | Graceful Degradation |
|---|---|
| **Translation API Down** | Display original message only with "Translation unavailable" notice |
| **LLM API Down** | Disable cultural hints, formality detection; core messaging still works |
| **Firestore Connection Lost** | Full offline mode; queue all operations; sync on reconnect |
| **Cloud Functions Error** | Retry with exponential backoff (3 attempts); show error toast to user |
| **FCM Notification Failure** | Messages still delivered via real-time listener when app opens |
| **SQLite Database Corruption** | Re-sync from Firestore; download last 100 messages per conversation |

---

## 10. Design Notes

### Architectural Principles

1. **Offline-First:** App must function without network; sync when available
2. **Optimistic UI:** Show instant feedback; update status asynchronously
3. **Modularity:** Each supermodule can be developed/tested independently
4. **Security by Default:** Strict Firestore rules; all external APIs server-side
5. **Graceful Degradation:** Core messaging works even if AI features fail
6. **Cost Awareness:** Cache aggressively; monitor API usage; optimize queries

---

### Naming Conventions

#### Firestore Collections & Documents

- **Collections:** Lowercase, plural (e.g., `users`, `conversations`, `messages`)
- **Document IDs:** Auto-generated by Firestore (20-character alphanumeric)
- **Fields:** camelCase (e.g., `displayName`, `originalText`, `createdAt`)

#### React Native Components

- **Components:** PascalCase (e.g., `ChatScreen`, `MessageBubble`, `AIAssistantModal`)
- **Files:** Match component name (e.g., `ChatScreen.tsx`)
- **Folders:** Organized by feature (e.g., `screens/`, `components/`, `services/`)

#### Cloud Functions

- **Functions:** camelCase with verb prefix (e.g., `translateMessage`, `analyzeCulturalContext`)
- **Files:** Grouped by service (e.g., `translationService.ts`, `aiService.ts`)

---

### Code Organization

```
/worldchat
  /app                          # Expo Router screens
    /(tabs)
      conversations.tsx         # Conversation list
      profile.tsx               # User profile
    /conversation
      [id].tsx                  # Chat screen
    /auth
      login.tsx                 # Login screen
      signup.tsx                # Sign-up screen
  /components                   # Reusable components
    /chat
      MessageBubble.tsx
      MessageInput.tsx
      TypingIndicator.tsx
    /ai
      AIAssistantModal.tsx
      CulturalHintBadge.tsx
  /services                     # Business logic
    /auth
      authService.ts
    /messaging
      messageService.ts
      queueManager.ts
    /translation
      translationService.ts
      cacheManager.ts
    /ai
      aiService.ts
    /storage
      sqliteService.ts
      firestoreSync.ts
  /types                        # TypeScript types
    user.ts
    message.ts
    conversation.ts
  /utils                        # Utilities
    dateFormatter.ts
    languageDetector.ts
  /constants                    # App constants
    languages.ts
    colors.ts
  /hooks                        # Custom React hooks
    useMessages.ts
    useConversations.ts
    useAuth.ts

/functions                      # Firebase Cloud Functions
  /src
    index.ts                    # Main entry point
    /services
      translationService.ts
      aiService.ts
      notificationService.ts
    /triggers
      onMessageCreated.ts
      onUserPresenceChanged.ts
    /scheduled
      cleanupCache.ts
  package.json
  tsconfig.json
```

---

### Implementation Guidelines

**React Component Pattern:**
```typescript
// Prefer functional components with hooks
import React, { useState, useEffect } from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onTranslationToggle?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onTranslationToggle
}) => {
  // Component logic
  return (
    // JSX
  );
};
```

**Service Pattern:**
```typescript
// Services as singleton classes with static methods
export class MessageService {
  private static firestoreSync: FirestoreSyncService;
  private static sqliteStore: SQLiteService;
  
  static async sendMessage(
    conversationId: string,
    text: string
  ): Promise<Message> {
    // 1. Create message object
    // 2. Optimistic UI update
    // 3. Write to SQLite
    // 4. Sync to Firestore
    // 5. Handle errors
  }
  
  static subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    // Return unsubscribe function
  }
}
```

**Cloud Function Pattern:**
```typescript
// Grouped by domain, exported from index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const translateMessage = functions.https.onCall(
  async (data: TranslateRequest, context) => {
    // 1. Validate auth
    // 2. Validate input
    // 3. Check cache
    // 4. Call API
    // 5. Update Firestore
    // 6. Return result
  }
);
```

---

## 11. Next Steps

### Immediate Actions (Post-Architecture)

1. **Generate Development Checklist**
   - Use Checklist Loop (`/prompts/system/00_c_checklist_loop.md`)
   - Map architecture to actionable implementation tasks
   - Organize by supermodule and priority
   - Output to `/docs/foundation/dev_checklist.md`

2. **Set Up Development Environment**
   - Initialize Expo project with TypeScript template
   - Install Firebase SDK and configure Firebase project
   - Set up Firebase Emulator for local development
   - Configure ESLint, Prettier, and Git hooks

3. **Implement MVP Foundation (First 24 Hours)**
   - **Setup & Auth Supermodule:** Firebase Auth integration, onboarding flow
   - **Messaging Core (Basic):** Chat screen, message input, Firestore sync
   - **Local Storage:** SQLite schema, basic read/write operations
   - **Goal:** Achieve MVP gate (messages send and persist)

---

### Implementation Sequence (Week 1)

**Day 1 (MVP Gate):**
- Setup & Auth supermodule (4 hours)
- Messaging Core - basic chat (8 hours)
- One-on-one messaging working end-to-end
- **Checkpoint:** MVP gate validation

**Day 2-3:**
- Complete Messaging Core (offline, queue, presence, typing)
- Group Chat & Collaboration supermodule
- Notifications & Lifecycle supermodule
- **Checkpoint:** All messaging features working

**Day 4-5:**
- Translation Engine supermodule
- AI Intelligence Layer (5 required features)
- AI Chat Assistant interface
- **Checkpoint:** All AI features functional

**Day 6:**
- Testing, bug fixes, polish
- Performance optimization
- **Checkpoint:** Early submission (Friday)

**Day 7:**
- Final polish, documentation
- Demo video recording
- Deployment to Expo Go / TestFlight
- **Checkpoint:** Final submission (Sunday)

---

### Reference Documents

| Document | Path | Status |
|---|---|---|
| **Product Requirements Document** | `/docs/foundation/prd.md` | ✅ Complete |
| **Tech Stack Overview** | `/docs/foundation/tech_stack.md` | ✅ Complete |
| **Architecture Document** | `/docs/foundation/architecture.md` | ✅ Complete (this document) |
| **Development Checklist** | `/docs/foundation/dev_checklist.md` | ⏭️ Next step |
| **User Flow Diagram** | `/docs/foundation/user_flow.md` | 📝 To be created |
| **Firestore Schema** | `/docs/schema.sql` | 📝 To be created (SQLite) |

---

### Testing Strategy Reference

Comprehensive testing strategy defined in PRD Section 6 (Testing & Quality Infrastructure). Key testing phases:

1. **Unit Tests:** Services, utilities, data transformations
2. **Integration Tests:** Firestore operations, Cloud Functions, translation pipeline
3. **E2E Tests:** Full user flows (send message, offline sync, group chat)
4. **Manual QA:** Real devices, poor network conditions, edge cases

See PRD for detailed test scenarios and acceptance criteria.

---

**End of Architecture Document**

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Next Action:** Generate Development Checklist via Checklist Loop  
**Status:** Ready for Implementation ✅

