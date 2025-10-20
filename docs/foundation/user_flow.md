# User Flow Document: WorldChat

**Document Version:** 1.0  
**Project:** WorldChat  
**Platform:** React Native + Expo + Firebase  
**Last Updated:** October 20, 2025

---

## 1. Overview

This document defines the end-to-end user flows for WorldChat, a cross-platform messaging application with AI-powered translation and cultural context features. The flows map user actions, system events, UI state changes, and data operations across six supermodules:

1. **Setup & Auth** — User onboarding and authentication
2. **Messaging Core** — Real-time chat infrastructure with offline support
3. **Translation Engine** — AI-powered translation orchestration
4. **AI Intelligence Layer** — Cultural hints, formality detection, smart replies
5. **Group Chat & Collaboration** — Multi-user conversations
6. **Notifications & Lifecycle** — Push notifications and app state management

Each flow is presented in two formats:
- **Visual Flowcharts (Swimlanes)** — showing actor interactions across system components
- **Step-by-Step Narratives** — numbered sequences with detailed state changes (see Part 2)

---

## 2. Visual Flowcharts (Swimlanes)

### Flow 1: Authentication & Onboarding

```
┌─────────────┬──────────────────┬─────────────────┬──────────────────┬─────────────────┐
│    USER     │   CLIENT APP     │  FIREBASE AUTH  │    FIRESTORE     │  CLOUD FUNCTION │
├─────────────┼──────────────────┼─────────────────┼──────────────────┼─────────────────┤
│             │                  │                 │                  │                 │
│ Opens app   │                  │                 │                  │                 │
│────────────>│ Show splash      │                 │                  │                 │
│             │ Check auth       │                 │                  │                 │
│             │─────────────────>│ Validate token  │                  │                 │
│             │                  │                 │                  │                 │
│             │                  │ [NO TOKEN]      │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ Show login       │                 │                  │                 │
│             │ screen           │                 │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│ Enter email │                  │                 │                  │                 │
│ & password  │                  │                 │                  │                 │
│────────────>│ Validate input   │                 │                  │                 │
│             │                  │                 │                  │                 │
│ Tap "Sign   │                  │                 │                  │                 │
│ In" button  │                  │                 │                  │                 │
│────────────>│ Show loading     │                 │                  │                 │
│             │ spinner          │                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ signInWith       │                 │                  │                 │
│             │ EmailAndPassword │                 │                  │                 │
│             │─────────────────>│ Verify          │                  │                 │
│             │                  │ credentials     │                  │                 │
│             │                  │                 │                  │                 │
│             │                  │ [SUCCESS]       │                  │                 │
│             │                  │ Generate JWT    │                  │                 │
│             │<─────────────────│ Return user obj │                  │                 │
│             │                  │                 │                  │                 │
│             │ Store token      │                 │                  │                 │
│             │ (SecureStore)    │                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ Check user       │                 │                  │                 │
│             │ profile exists   │                 │                  │                 │
│             │─────────────────────────────────────>│ Query users/    │                 │
│             │                  │                 │ {userId}         │                 │
│             │                  │                 │                  │                 │
│             │                  │                 │ [NEW USER]       │                 │
│             │                  │                 │ No document      │                 │
│             │<─────────────────────────────────────│                 │                 │
│             │                  │                 │                  │                 │
│             │ Navigate to      │                 │                  │                 │
│             │ Language Setup   │                 │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│ Select      │                  │                 │                  │                 │
│ preferred   │                  │                 │                  │                 │
│ language(s) │                  │                 │                  │                 │
│────────────>│ Show language    │                 │                  │                 │
│             │ picker UI        │                 │                  │                 │
│             │                  │                 │                  │                 │
│ Tap "Get    │                  │                 │                  │                 │
│ Started"    │                  │                 │                  │                 │
│────────────>│ Create user      │                 │                  │                 │
│             │ profile          │                 │                  │                 │
│             │─────────────────────────────────────>│ Write users/    │                 │
│             │                  │                 │ {userId}         │                 │
│             │                  │                 │ {                │                 │
│             │                  │                 │   email,         │                 │
│             │                  │                 │   displayName,   │                 │
│             │                  │                 │   language,      │                 │
│             │                  │                 │   createdAt      │                 │
│             │                  │                 │ }                │                 │
│             │                  │                 │                  │                 │
│             │                  │                 │ [SUCCESS]        │                 │
│             │<─────────────────────────────────────│                 │                 │
│             │                  │                 │                  │                 │
│             │ Initialize       │                 │                  │                 │
│             │ SQLite DB        │                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ Navigate to      │                 │                  │                 │
│             │ Chat List        │                 │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
└─────────────┴──────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

---

### Flow 2: Send Message (One-on-One Chat)

```
┌─────────────┬──────────────────┬─────────────────┬──────────────────┬─────────────────┐
│    USER     │   CLIENT APP     │  LOCAL SQLITE   │    FIRESTORE     │  CLOUD FUNCTION │
├─────────────┼──────────────────┼─────────────────┼──────────────────┼─────────────────┤
│             │                  │                 │                  │                 │
│ Open        │                  │                 │                  │                 │
│ conversation│                  │                 │                  │                 │
│────────────>│ Load messages    │                 │                  │                 │
│             │ from local DB    │                 │                  │                 │
│             │─────────────────>│ SELECT * FROM   │                  │                 │
│             │                  │ messages WHERE  │                  │                 │
│             │                  │ conversationId  │                  │                 │
│             │<─────────────────│ Return rows     │                  │                 │
│             │                  │                 │                  │                 │
│             │ Render chat UI   │                 │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ Subscribe to     │                 │                  │                 │
│             │ Firestore        │                 │                  │                 │
│             │─────────────────────────────────────>│ onSnapshot(     │                 │
│             │                  │                 │  messages/       │                 │
│             │                  │                 │  {convId}        │                 │
│             │                  │                 │ )                │                 │
│             │                  │                 │                  │                 │
│ Type message│                  │                 │                  │                 │
│────────────>│ Show "typing"    │                 │                  │                 │
│             │ to recipient     │                 │                  │                 │
│             │─────────────────────────────────────>│ Write presence/  │                 │
│             │                  │                 │ {userId}/typing  │                 │
│             │                  │                 │ = true           │                 │
│             │                  │                 │ (TTL: 3 seconds) │                 │
│             │                  │                 │                  │                 │
│ Tap "Send"  │                  │                 │                  │                 │
│────────────>│ Generate         │                 │                  │                 │
│             │ temp message ID  │                 │                  │                 │
│             │ (UUID)           │                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ [OPTIMISTIC UI]  │                 │                  │                 │
│             │ Render message   │                 │                  │                 │
│             │ immediately      │                 │                  │                 │
│             │ Status: sending  │                 │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ Insert to        │                 │                  │                 │
│             │ local DB         │                 │                  │                 │
│             │─────────────────>│ INSERT INTO     │                  │                 │
│             │                  │ messages (...)  │                  │                 │
│             │                  │ status='sending'│                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│             │ Write to         │                 │                  │                 │
│             │ Firestore        │                 │                  │                 │
│             │─────────────────────────────────────>│ Add to messages/│                 │
│             │                  │                 │ {convId}         │                 │
│             │                  │                 │ {                │                 │
│             │                  │                 │   text,          │                 │
│             │                  │                 │   senderId,      │                 │
│             │                  │                 │   timestamp,     │                 │
│             │                  │                 │   status: 'sent' │                 │
│             │                  │                 │ }                │                 │
│             │                  │                 │                  │                 │
│             │                  │                 │ [SUCCESS]        │                 │
│             │                  │                 │ Return messageId │                 │
│             │<─────────────────────────────────────│                 │                 │
│             │                  │                 │                  │                 │
│             │ Update status    │                 │                  │                 │
│             │ to 'sent'        │                 │                  │                 │
│             │─────────────────>│ UPDATE messages │                  │                 │
│             │                  │ status='sent'   │                  │                 │
│             │                  │                 │                  │                 │
│             │ Update UI        │                 │                  │                 │
│             │ checkmark        │                 │                  │                 │
│             │<─────────────────│                 │                  │                 │
│             │                  │                 │                  │                 │
│             │                  │                 │ [FIRESTORE       │                 │
│             │                  │                 │  TRIGGER]        │                 │
│             │                  │                 │─────────────────>│ onMessageCreate │
│             │                  │                 │                  │ Detect language │
│             │                  │                 │                  │ Queue FCM       │
│             │                  │                 │                  │ notification    │
│             │                  │                 │                  │                 │
└─────────────┴──────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

---

### Flow 3: Receive Message with Translation

```
┌─────────────┬──────────────────┬─────────────────┬──────────────────┬─────────────────┬──────────────┐
│    USER     │   CLIENT APP     │  LOCAL SQLITE   │    FIRESTORE     │  CLOUD FUNCTION │ TRANSLATION  │
│  (Receiver) │                  │                 │                  │                 │     API      │
├─────────────┼──────────────────┼─────────────────┼──────────────────┼─────────────────┼──────────────┤
│             │                  │                 │                  │                 │              │
│             │ [BACKGROUND]     │                 │                  │                 │              │
│             │ Firestore        │                 │                  │                 │              │
│             │ listener active  │                 │                  │                 │              │
│             │                  │                 │                  │                 │              │
│             │                  │                 │ [NEW MESSAGE]    │                 │              │
│             │                  │                 │ onSnapshot       │                 │              │
│             │                  │                 │ fires            │                 │              │
│             │<─────────────────────────────────────│ Message data    │                 │              │
│             │                  │                 │ {                │                 │              │
│             │                  │                 │   text,          │                 │              │
│             │                  │                 │   senderId,      │                 │              │
│             │                  │                 │   timestamp      │                 │              │
│             │                  │                 │ }                │                 │              │
│             │                  │                 │                  │                 │              │
│             │ Check if         │                 │                  │                 │              │
│             │ translation      │                 │                  │                 │              │
│             │ needed           │                 │                  │                 │              │
│             │                  │                 │                  │                 │              │
│             │ [IF sender       │                 │                  │                 │              │
│             │  language ≠      │                 │                  │                 │              │
│             │  user language]  │                 │                  │                 │              │
│             │                  │                 │                  │                 │              │
│             │ Check            │                 │                  │                 │              │
│             │ translation      │                 │                  │                 │              │
│             │ cache            │                 │                  │                 │              │
│             │─────────────────────────────────────>│ Query           │                 │              │
│             │                  │                 │ translations/    │                 │              │
│             │                  │                 │ {hash}           │                 │              │
│             │                  │                 │                  │                 │              │
│             │                  │                 │ [CACHE MISS]     │                 │              │
│             │<─────────────────────────────────────│ No document     │                 │              │
│             │                  │                 │                  │                 │              │
│             │ Call             │                 │                  │                 │              │
│             │ translation      │                 │                  │                 │              │
│             │ Cloud Function   │                 │                  │                 │              │
│             │─────────────────────────────────────────────────────────>│ Receive       │              │
│             │                  │                 │                  │ request:        │              │
│             │                  │                 │                  │ {               │              │
│             │                  │                 │                  │   text,         │              │
│             │                  │                 │                  │   sourceLang,   │              │
│             │                  │                 │                  │   targetLang    │              │
│             │                  │                 │                  │ }               │              │
│             │                  │                 │                  │                 │              │
│             │                  │                 │                  │ Call Google     │              │
│             │                  │                 │                  │ Translation API │              │
│             │                  │                 │                  │─────────────────>│ Translate   │
│             │                  │                 │                  │                 │ text        │
│             │                  │                 │                  │<─────────────────│ Return      │
│             │                  │                 │                  │                 │ translation │
│             │                  │                 │                  │                 │              │
│             │                  │                 │                  │ Cache result    │              │
│             │                  │                 │<─────────────────│ Write to        │              │
│             │                  │                 │ translations/    │ Firestore       │              │
│             │                  │                 │ {hash}           │                 │              │
│             │                  │                 │                  │                 │              │
│             │                  │                 │                  │ Return          │              │
│             │<─────────────────────────────────────────────────────────│ translated text│              │
│             │                  │                 │                  │                 │              │
│             │ Insert message   │                 │                  │                 │              │
│             │ to local DB      │                 │                  │                 │              │
│             │─────────────────>│ INSERT INTO     │                  │                 │              │
│             │                  │ messages        │                  │                 │              │
│             │                  │ (text,          │                  │                 │              │
│             │                  │  translation)   │                  │                 │              │
│             │                  │                 │                  │                 │              │
│             │ [IF APP OPEN]    │                 │                  │                 │              │
│             │ Render message   │                 │                  │                 │              │
│             │ with dual        │                 │                  │                 │              │
│             │ display:         │                 │                  │                 │              │
│             │ - Original text  │                 │                  │                 │              │
│             │ - Translation    │                 │                  │                 │              │
│             │<─────────────────│                 │                  │                 │              │
│             │                  │                 │                  │                 │              │
│ See message │                  │                 │                  │                 │              │
│ in chat     │                  │                 │                  │                 │              │
│<────────────│                  │                 │                  │                 │              │
│             │                  │                 │                  │                 │              │
│             │ Update read      │                 │                  │                 │              │
│             │ receipt          │                 │                  │                 │              │
│             │─────────────────────────────────────>│ Update message  │                 │              │
│             │                  │                 │ status='read'    │                 │              │
│             │                  │                 │ readAt=timestamp │                 │              │
│             │                  │                 │                  │                 │              │
└─────────────┴──────────────────┴─────────────────┴──────────────────┴─────────────────┴──────────────┘
```

---

### Flow 4: AI Cultural Context Detection

```
┌─────────────┬──────────────────┬──────────────────┬─────────────────┬──────────────┐
│    USER     │   CLIENT APP     │  CLOUD FUNCTION  │   LLM API       │  FIRESTORE   │
│             │                  │  (AI Intelligence│  (GPT-4/Claude) │              │
│             │                  │   Layer)         │                 │              │
├─────────────┼──────────────────┼──────────────────┼─────────────────┼──────────────┤
│             │                  │                  │                 │              │
│             │ [MESSAGE         │                  │                 │              │
│             │  RECEIVED]       │                  │                 │              │
│             │                  │                  │                 │              │
│             │ Check if AI      │                  │                 │              │
│             │ analysis needed  │                  │                 │              │
│             │                  │                  │                 │              │
│             │ [IF message      │                  │                 │              │
│             │  contains idioms,│                  │                 │              │
│             │  cultural refs,  │                  │                 │              │
│             │  or formality    │                  │                 │              │
│             │  concerns]       │                  │                 │              │
│             │                  │                  │                 │              │
│             │ Call AI          │                  │                 │              │
│             │ analysis         │                  │                 │              │
│             │ function         │                  │                 │              │
│             │─────────────────>│ Receive request: │                 │              │
│             │                  │ {                │                 │              │
│             │                  │   messageId,     │                 │              │
│             │                  │   text,          │                 │              │
│             │                  │   sourceLang,    │                 │              │
│             │                  │   targetLang,    │                 │              │
│             │                  │   conversationId │                 │              │
│             │                  │ }                │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Load             │                 │              │
│             │                  │ conversation     │                 │              │
│             │                  │ history (RAG)    │                 │              │
│             │                  │─────────────────────────────────────>│ Query last  │
│             │                  │                  │                 │ 20 messages │
│             │                  │<─────────────────────────────────────│             │
│             │                  │                  │                 │              │
│             │                  │ Construct prompt │                 │              │
│             │                  │ with context:    │                 │              │
│             │                  │ - Message text   │                 │              │
│             │                  │ - Recent history │                 │              │
│             │                  │ - Language pair  │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Call LLM with    │                 │              │
│             │                  │ function calling │                 │              │
│             │                  │─────────────────>│ Analyze:        │              │
│             │                  │                  │ - Idioms?       │              │
│             │                  │                  │ - Cultural refs?│              │
│             │                  │                  │ - Formality?    │              │
│             │                  │                  │ - Slang?        │              │
│             │                  │                  │                 │              │
│             │                  │                  │ [DETECTED:      │              │
│             │                  │                  │  Idiom found]   │              │
│             │                  │                  │                 │              │
│             │                  │<─────────────────│ Return JSON:    │              │
│             │                  │                  │ {               │              │
│             │                  │                  │   hasCultural   │              │
│             │                  │                  │   Context: true,│              │
│             │                  │                  │   type: "idiom",│              │
│             │                  │                  │   explanation:  │              │
│             │                  │                  │   "...",        │              │
│             │                  │                  │   relevance:    │              │
│             │                  │                  │   "high"        │              │
│             │                  │                  │ }               │              │
│             │                  │                  │                 │              │
│             │                  │ Cache AI result  │                 │              │
│             │                  │─────────────────────────────────────>│ Write to    │
│             │                  │                  │                 │ aiAnalysis/ │
│             │                  │                  │                 │ {messageId} │
│             │                  │                  │                 │              │
│             │                  │ Return analysis  │                 │              │
│             │<─────────────────│                  │                 │              │
│             │                  │                  │                 │              │
│             │ Render cultural  │                  │                 │              │
│             │ hint badge on    │                  │                 │              │
│             │ message bubble   │                  │                 │              │
│             │<─────────────────│                  │                 │              │
│             │                  │                  │                 │              │
│ Tap hint    │                  │                  │                 │              │
│ badge       │                  │                  │                 │              │
│────────────>│ Show modal with  │                  │                 │              │
│             │ explanation:     │                  │                 │              │
│             │ - Idiom meaning  │                  │                 │              │
│             │ - Cultural       │                  │                 │              │
│             │   context        │                  │                 │              │
│             │ - Equivalent     │                  │                 │              │
│             │   in user's      │                  │                 │              │
│             │   language       │                  │                 │              │
│             │<─────────────────│                  │                 │              │
│             │                  │                  │                 │              │
└─────────────┴──────────────────┴──────────────────┴─────────────────┴──────────────┘
```

---

### Flow 5: Push Notification (Background Message)

```
┌─────────────┬──────────────────┬──────────────────┬─────────────────┬──────────────┐
│    USER     │   CLIENT APP     │  CLOUD FUNCTION  │    FIREBASE     │   DEVICE     │
│ (Receiver)  │  (Backgrounded)  │                  │  CLOUD          │   OS         │
│             │                  │                  │  MESSAGING (FCM)│              │
├─────────────┼──────────────────┼──────────────────┼─────────────────┼──────────────┤
│             │                  │                  │                 │              │
│ [APP        │                  │                  │                 │              │
│  CLOSED OR  │                  │                  │                 │              │
│  BACKGROUND]│                  │                  │                 │              │
│             │                  │                  │                 │              │
│             │                  │                  │                 │              │
│             │                  │ [FIRESTORE       │                 │              │
│             │                  │  TRIGGER]        │                 │              │
│             │                  │ onMessageCreate  │                 │              │
│             │                  │ fires            │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Get recipient    │                 │              │
│             │                  │ user data        │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Get recipient    │                 │              │
│             │                  │ FCM token        │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Get sender       │                 │              │
│             │                  │ display name     │                 │              │
│             │                  │                  │                 │              │
│             │                  │ [IF recipient    │                 │              │
│             │                  │  language ≠      │                 │              │
│             │                  │  sender language]│                 │              │
│             │                  │                  │                 │              │
│             │                  │ Translate        │                 │              │
│             │                  │ message text     │                 │              │
│             │                  │ for notification │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Construct        │                 │              │
│             │                  │ notification:    │                 │              │
│             │                  │ {                │                 │              │
│             │                  │   title: "Sarah",│                 │              │
│             │                  │   body:          │                 │              │
│             │                  │   "[translated]",│                 │              │
│             │                  │   data: {        │                 │              │
│             │                  │     convId,      │                 │              │
│             │                  │     messageId    │                 │              │
│             │                  │   }              │                 │              │
│             │                  │ }                │                 │              │
│             │                  │                  │                 │              │
│             │                  │ Send to FCM      │                 │              │
│             │                  │─────────────────>│ Queue           │              │
│             │                  │                  │ notification    │              │
│             │                  │                  │                 │              │
│             │                  │                  │ Route to        │              │
│             │                  │                  │ device (APNs/   │              │
│             │                  │                  │ GCM)            │              │
│             │                  │                  │─────────────────>│ Deliver     │
│             │                  │                  │                 │ notification│
│             │                  │                  │                 │              │
│             │                  │                  │                 │ Show banner │
│             │                  │                  │                 │ + sound     │
│             │<──────────────────────────────────────────────────────────────────────│
│             │                  │                  │                 │              │
│ Tap         │                  │                  │                 │              │
│ notification│                  │                  │                 │              │
│────────────>│                  │                  │                 │              │
│             │ App launches     │                  │                 │              │
│             │ (if closed)      │                  │                 │              │
│             │                  │                  │                 │              │
│             │ Extract          │                  │                 │              │
│             │ notification     │                  │                 │              │
│             │ data             │                  │                 │              │
│             │                  │                  │                 │              │
│             │ Navigate to      │                  │                 │              │
│             │ conversation     │                  │                 │              │
│             │ (convId)         │                  │                 │              │
│             │<─────────────────│                  │                 │              │
│             │                  │                  │                 │              │
│ View        │                  │                  │                 │              │
│ conversation│                  │                  │                 │              │
│<────────────│                  │                  │                 │              │
│             │                  │                  │                 │              │
└─────────────┴──────────────────┴──────────────────┴─────────────────┴──────────────┘
```

---

**End of Part 1: Visual Flowcharts**

**Next:** Part 2 will contain detailed step-by-step narratives with numbered sequences (1.0, 1.1, 1.2...) describing:
- Actor (who/what performs action)
- Action/System Event (what happens)
- System State/UI Change (what changes)
- Data Involved (what data is read/written)

---

**Document Status:** Part 1 Complete ✓  
**Lines:** ~290  
**Ready for Part 2:** Step-by-Step Narratives

---

## 3. Step-by-Step Narratives

### Narrative 1: Authentication & Onboarding

**Scenario:** A new user downloads WorldChat and creates an account to start communicating with friends across language barriers.

**1.0 App Launch & Authentication Check**
- **Actor:** User
- **Action:** Opens WorldChat app for the first time
- **System Event:** App initializes, checks for existing authentication token
- **UI State:** Splash screen displays with WorldChat logo
- **Data Read:** Expo SecureStore → `authToken` (returns null for new user)

**1.1 Navigate to Login Screen**
- **Actor:** Client App
- **Action:** Detects no authentication token present
- **System Event:** Navigation system routes to Login screen
- **UI State:** Login screen displays with email/password fields and "Sign In" button
- **Data:** None

**1.2 User Enters Credentials**
- **Actor:** User
- **Action:** Types email address and password into input fields
- **System Event:** React Native TextInput components capture keystrokes
- **UI State:** Email and password fields populate with masked input (password shows dots)
- **Data:** Local component state stores email and password temporarily

**1.3 Input Validation**
- **Actor:** Client App
- **Action:** User taps "Sign In" button; app validates input format
- **System Event:** Email regex validation and password length check execute
- **UI State:** Loading spinner appears on button; keyboard dismisses
- **Data:** Email and password validated against patterns (email regex, password min 6 chars)

**1.4 Firebase Authentication Request**
- **Actor:** Client App
- **Action:** Calls Firebase Auth `signInWithEmailAndPassword(email, password)`
- **System Event:** Firebase SDK sends HTTPS request to Firebase Auth servers
- **UI State:** Button remains disabled with loading state
- **Data Sent:** `{ email, password }` via TLS to Firebase Auth

**1.5 Credential Verification**
- **Actor:** Firebase Auth
- **Action:** Verifies credentials against user database
- **System Event:** Firebase compares hashed password with stored hash
- **UI State:** No change (still loading)
- **Data Read:** Firebase Auth database queries user record by email

**1.6 JWT Token Generation**
- **Actor:** Firebase Auth
- **Action:** Generates signed JWT token with user ID and claims
- **System Event:** Token includes userId, email, expiration (1 hour default)
- **UI State:** No change
- **Data Created:** JWT token with signature: `{ uid, email, iat, exp }`

**1.7 Authentication Response**
- **Actor:** Firebase Auth
- **Action:** Returns user object and token to client
- **System Event:** SDK receives authentication response
- **UI State:** Loading spinner persists
- **Data Received:** `{ user: { uid, email, emailVerified }, token }`

**1.8 Token Storage**
- **Actor:** Client App
- **Action:** Stores JWT token in Expo SecureStore (device keychain)
- **System Event:** Encrypted storage write to iOS Keychain or Android Keystore
- **UI State:** No visible change
- **Data Written:** SecureStore → `authToken: [JWT string]`

**1.9 Profile Existence Check**
- **Actor:** Client App
- **Action:** Queries Firestore for user profile document
- **System Event:** Firestore SDK sends query with authenticated token
- **UI State:** Loading persists
- **Data Query:** Firestore → `users/{userId}` (returns 404 for new user)

**1.10 New User Detection**
- **Actor:** Client App
- **Action:** Receives "document not found" response
- **System Event:** App determines user needs onboarding
- **UI State:** Navigation prepares for language setup screen
- **Data:** None

**1.11 Navigate to Language Setup**
- **Actor:** Client App
- **Action:** Routes to language preference screen
- **System Event:** Navigation stack pushes LanguageSetup screen
- **UI State:** Language selection UI displays with picker showing 100+ languages
- **Data:** Static language list loaded from app bundle

**1.12 User Selects Language**
- **Actor:** User
- **Action:** Scrolls through language picker and selects preferred language (e.g., "English")
- **System Event:** Picker component fires `onValueChange` callback
- **UI State:** Selected language highlights; "Get Started" button enables
- **Data:** Local state → `selectedLanguage: "en"`

**1.13 Confirm Language Selection**
- **Actor:** User
- **Action:** Taps "Get Started" button
- **System Event:** Form submission triggered
- **UI State:** Button shows loading spinner
- **Data:** Prepare profile object with selected language

**1.14 Create User Profile**
- **Actor:** Client App
- **Action:** Writes user profile document to Firestore
- **System Event:** Firestore SDK sends authenticated write request
- **UI State:** Loading persists
- **Data Written:** Firestore → `users/{userId}`:
  ```json
  {
    "email": "user@example.com",
    "displayName": "User Name",
    "language": "en",
    "createdAt": Timestamp.now(),
    "online": true,
    "fcmToken": null
  }
  ```

**1.15 Profile Creation Confirmation**
- **Actor:** Firestore
- **Action:** Returns write confirmation with document metadata
- **System Event:** Success callback fires in app
- **UI State:** Loading completes
- **Data Received:** `{ id: userId, writeTime: Timestamp }`

**1.16 Initialize Local Database**
- **Actor:** Client App
- **Action:** Opens/creates SQLite database for offline message storage
- **System Event:** Expo SQLite creates `worldchat.db` file with schema
- **UI State:** No visible change (background operation)
- **Data Created:** SQLite tables: `messages`, `conversations`, `users`

**1.17 Navigate to Chat List**
- **Actor:** Client App
- **Action:** Replaces navigation stack with authenticated home screen
- **System Event:** Navigation system clears onboarding stack, shows ChatList
- **UI State:** Empty chat list displays with "Start a conversation" prompt
- **Data Read:** SQLite → `SELECT * FROM conversations` (returns empty array)

**1.18 Onboarding Complete**
- **Actor:** User
- **Action:** Sees main app interface ready to use
- **System Event:** App enters authenticated state
- **UI State:** Chat list screen fully rendered with add button visible
- **Data State:** User authenticated, profile created, local DB initialized

---

### Narrative 2: Send Message (One-on-One Chat)

**Scenario:** User composes and sends a text message to a contact; the message delivers in real-time with optimistic UI updates.

**2.0 Open Conversation**
- **Actor:** User
- **Action:** Taps on a conversation in the chat list
- **System Event:** Navigation pushes ConversationScreen with conversationId parameter
- **UI State:** Conversation screen loads with empty message list
- **Data Read:** Navigation params → `{ conversationId: "conv_123" }`

**2.1 Load Local Messages**
- **Actor:** Client App
- **Action:** Queries SQLite for conversation message history
- **System Event:** SQL SELECT query executes with conversation filter
- **UI State:** Loading indicator appears
- **Data Query:** SQLite → `SELECT * FROM messages WHERE conversationId = 'conv_123' ORDER BY timestamp ASC`

**2.2 Render Message History**
- **Actor:** Client App
- **Action:** Receives message array from SQLite; renders chat bubbles
- **System Event:** FlatList component receives data and renders items
- **UI State:** Previous messages display in chronological order with timestamps
- **Data Received:** Array of message objects with text, senderId, timestamps

**2.3 Subscribe to Firestore Listener**
- **Actor:** Client App
- **Action:** Establishes real-time listener for new messages
- **System Event:** Firestore WebSocket connection opens with onSnapshot subscription
- **UI State:** No visible change (background connection)
- **Data Subscribe:** Firestore → `messages/{conversationId}` collection listener

**2.4 User Types Message**
- **Actor:** User
- **Action:** Focuses text input and begins typing message text
- **System Event:** TextInput component captures keystrokes
- **UI State:** Text input field shows typed content; cursor blinks
- **Data:** Local state → `inputText: "Hey, let's meet for coffee tomorrow!"`

**2.5 Typing Indicator Sent**
- **Actor:** Client App
- **Action:** Detects typing activity; sends typing status to recipient
- **System Event:** Debounced function writes to Firestore presence document
- **UI State:** No visible change for sender
- **Data Written:** Firestore → `presence/{recipientId}/typingUsers/{senderId}`:
  ```json
  {
    "typing": true,
    "timestamp": Timestamp.now(),
    "ttl": 3  // seconds
  }
  ```

**2.6 Send Button Tap**
- **Actor:** User
- **Action:** Taps send button (or presses Enter on keyboard)
- **System Event:** onPress handler fires with message text
- **UI State:** Send button momentarily highlights
- **Data:** `inputText` value captured for processing

**2.7 Generate Message ID**
- **Actor:** Client App
- **Action:** Creates temporary UUID for optimistic UI rendering
- **System Event:** UUID library generates unique identifier
- **UI State:** No visible change yet
- **Data Created:** `tempMessageId: "uuid-abc-123"`

**2.8 Optimistic UI Render**
- **Actor:** Client App
- **Action:** Immediately renders message in chat UI before server confirmation
- **System Event:** Message object added to local React state array
- **UI State:** Message bubble appears instantly at bottom of chat with "sending" status (single gray checkmark)
- **Data State:** Message object added to UI state:
  ```json
  {
    "id": "uuid-abc-123",
    "text": "Hey, let's meet for coffee tomorrow!",
    "senderId": "currentUserId",
    "timestamp": Date.now(),
    "status": "sending"
  }
  ```

**2.9 Clear Input Field**
- **Actor:** Client App
- **Action:** Resets text input to empty state
- **System Event:** TextInput value cleared
- **UI State:** Input field empties; keyboard remains visible
- **Data:** Local state → `inputText: ""`

**2.10 Insert to Local Database**
- **Actor:** Client App
- **Action:** Writes message to SQLite for offline persistence
- **System Event:** SQL INSERT statement executes
- **UI State:** No visible change (message already rendered)
- **Data Written:** SQLite → `INSERT INTO messages (id, conversationId, text, senderId, timestamp, status) VALUES (...)`

**2.11 Write to Firestore**
- **Actor:** Client App
- **Action:** Sends message to Firestore cloud database
- **System Event:** Firestore SDK sends authenticated write request over HTTPS
- **UI State:** Message status remains "sending"
- **Data Sent:** Firestore → `messages/{conversationId}/messages/{tempMessageId}`:
  ```json
  {
    "text": "Hey, let's meet for coffee tomorrow!",
    "senderId": "currentUserId",
    "recipientId": "recipientUserId",
    "conversationId": "conv_123",
    "timestamp": FieldValue.serverTimestamp(),
    "status": "sent",
    "language": "en"
  }
  ```

**2.12 Firestore Write Confirmation**
- **Actor:** Firestore
- **Action:** Successfully writes document; returns confirmation
- **System Event:** Write promise resolves with document reference
- **UI State:** No immediate visible change
- **Data Received:** `{ id: "firestore-generated-id", writeTime: Timestamp }`

**2.13 Update Message Status to Sent**
- **Actor:** Client App
- **Action:** Updates local database and UI with confirmed status
- **System Event:** SQL UPDATE and state update execute
- **UI State:** Message checkmark changes to double gray checkmark ("sent")
- **Data Updated:** 
  - SQLite → `UPDATE messages SET status='sent', id='firestore-generated-id' WHERE id='uuid-abc-123'`
  - UI state updates message status property

**2.14 Firestore Trigger Fires**
- **Actor:** Firestore
- **Action:** New message document creation triggers Cloud Function
- **System Event:** `onMessageCreate` Cloud Function invoked with message data
- **UI State:** No visible change for sender
- **Data Passed:** Message document data sent to Cloud Function

**2.15 Cloud Function Processing**
- **Actor:** Cloud Function (Messaging Core)
- **Action:** Detects message language, prepares notification payload
- **System Event:** Language detection API call, FCM token retrieval
- **UI State:** No sender-side change
- **Data Read:** Firestore → `users/{recipientId}` to get FCM token and language preference

**2.16 Message Delivery Complete**
- **Actor:** System
- **Action:** Message persisted in Firestore, queued for recipient delivery
- **System Event:** Notification queued to FCM
- **UI State:** Sender sees message with "sent" status
- **Data State:** Message successfully delivered to cloud; awaiting recipient delivery confirmation

---

### Narrative 3: Receive Message with Translation

**Scenario:** Recipient receives a message from a sender speaking a different language; the app automatically translates and displays both original and translated text.

**3.0 Firestore Listener Receives Update**
- **Actor:** Client App (Recipient)
- **Action:** Background Firestore listener detects new message document
- **System Event:** onSnapshot callback fires with new message data
- **UI State:** No immediate change (app may be backgrounded)
- **Data Received:** Message document:
  ```json
  {
    "id": "msg_456",
    "text": "Hey, let's meet for coffee tomorrow!",
    "senderId": "senderUserId",
    "timestamp": Timestamp,
    "language": "en"
  }
  ```

**3.1 Language Mismatch Detection**
- **Actor:** Client App
- **Action:** Compares sender's language ("en") with recipient's preferred language ("it" - Italian)
- **System Event:** Conditional logic determines translation needed
- **UI State:** No visible change
- **Data Compared:** Sender language "en" ≠ Recipient language "it" → Translation required

**3.2 Translation Cache Lookup**
- **Actor:** Client App
- **Action:** Generates hash of message text + language pair; queries Firestore cache
- **System Event:** SHA-256 hash generated; Firestore query executed
- **UI State:** No visible change
- **Data Query:** Firestore → `translations/{hash}` where hash = SHA256("Hey, let's meet for coffee tomorrow!|en|it")

**3.3 Cache Miss**
- **Actor:** Firestore
- **Action:** Returns empty result (no cached translation found)
- **System Event:** Query returns null document
- **UI State:** No visible change
- **Data:** Cache miss detected; proceed to live translation

**3.4 Call Translation Cloud Function**
- **Actor:** Client App
- **Action:** Invokes Cloud Function with translation request
- **System Event:** HTTPS POST request sent to Cloud Function endpoint
- **UI State:** No visible change (translation happens in background)
- **Data Sent:** POST `/translateMessage`:
  ```json
  {
    "text": "Hey, let's meet for coffee tomorrow!",
    "sourceLang": "en",
    "targetLang": "it",
    "messageId": "msg_456"
  }
  ```

**3.5 Cloud Function Receives Request**
- **Actor:** Cloud Function (Translation Engine)
- **Action:** Parses request body; validates parameters
- **System Event:** Request validation and API key retrieval from environment
- **UI State:** No visible change
- **Data Read:** Environment variables → `GOOGLE_TRANSLATION_API_KEY`

**3.6 Call Google Translation API**
- **Actor:** Cloud Function
- **Action:** Sends translation request to Google Cloud Translation API
- **System Event:** HTTPS POST to Google API with authenticated request
- **UI State:** No visible change
- **Data Sent:** Google Translation API request:
  ```json
  {
    "q": "Hey, let's meet for coffee tomorrow!",
    "source": "en",
    "target": "it",
    "format": "text"
  }
  ```

**3.7 Translation Processing**
- **Actor:** Google Translation API
- **Action:** Translates text using neural machine translation model
- **System Event:** ML model inference executes
- **UI State:** No visible change
- **Data:** Translation model processes source text

**3.8 Translation Response**
- **Actor:** Google Translation API
- **Action:** Returns translated text to Cloud Function
- **System Event:** HTTPS response received
- **UI State:** No visible change
- **Data Received:**
  ```json
  {
    "data": {
      "translations": [{
        "translatedText": "Ehi, incontriamoci per un caffè domani!",
        "detectedSourceLanguage": "en"
      }]
    }
  }
  ```

**3.9 Cache Translation Result**
- **Actor:** Cloud Function
- **Action:** Writes translation to Firestore cache for future reuse
- **System Event:** Firestore write operation
- **UI State:** No visible change
- **Data Written:** Firestore → `translations/{hash}`:
  ```json
  {
    "sourceText": "Hey, let's meet for coffee tomorrow!",
    "translatedText": "Ehi, incontriamoci per un caffè domani!",
    "sourceLang": "en",
    "targetLang": "it",
    "timestamp": Timestamp.now(),
    "ttl": 2592000  // 30 days
  }
  ```

**3.10 Return Translation to Client**
- **Actor:** Cloud Function
- **Action:** Sends translated text back to client app
- **System Event:** HTTPS response sent
- **UI State:** No visible change yet
- **Data Returned:**
  ```json
  {
    "translatedText": "Ehi, incontriamoci per un caffè domani!",
    "sourceLang": "en",
    "targetLang": "it"
  }
  ```

**3.11 Insert Message to Local Database**
- **Actor:** Client App
- **Action:** Writes message with both original and translated text to SQLite
- **System Event:** SQL INSERT statement executes
- **UI State:** No visible change yet
- **Data Written:** SQLite → `INSERT INTO messages (id, text, translation, senderId, timestamp) VALUES (...)`:
  ```sql
  {
    "text": "Hey, let's meet for coffee tomorrow!",
    "translation": "Ehi, incontriamoci per un caffè domani!"
  }
  ```

**3.12 Render Message with Dual Display**
- **Actor:** Client App
- **Action:** App is in foreground; renders message bubble with both languages
- **System Event:** FlatList component adds new message item
- **UI State:** New message bubble appears at bottom of chat showing:
  - **Primary (large):** "Ehi, incontriamoci per un caffè domani!" (recipient's language)
  - **Secondary (small, gray):** "Hey, let's meet for coffee tomorrow!" (original text)
- **Data Rendered:** Message object with both text fields displayed in chat bubble

**3.13 User Sees Message**
- **Actor:** User (Recipient)
- **Action:** Reads translated message in their native language
- **System Event:** User's eyes focus on chat screen
- **UI State:** Message is visible and readable
- **Data:** Visual information processed by user

**3.14 Update Read Receipt**
- **Actor:** Client App
- **Action:** Marks message as read; updates Firestore
- **System Event:** Firestore update request sent
- **UI State:** No visible change for recipient (sender will see double blue checkmark)
- **Data Updated:** Firestore → `messages/{conversationId}/messages/{msg_456}`:
  ```json
  {
    "status": "read",
    "readAt": Timestamp.now(),
    "readBy": ["recipientUserId"]
  }
  ```

**3.15 Read Receipt Propagated**
- **Actor:** Firestore
- **Action:** Update triggers sender's Firestore listener
- **System Event:** Sender's app receives status update via onSnapshot
- **UI State:** Sender sees message checkmark change to double blue ("read")
- **Data:** Status update propagates through real-time listener

---

### Narrative 4: AI Cultural Context Detection

**Scenario:** A message contains an idiom that doesn't translate directly; the AI Intelligence Layer detects this and provides a cultural context explanation.

**4.0 Message Received with Idiom**
- **Actor:** Client App (Recipient)
- **Action:** Receives message: "Break a leg at your interview tomorrow!"
- **System Event:** Message arrives via Firestore listener
- **UI State:** Message rendered with translation
- **Data Received:** Message text contains English idiom "break a leg"

**4.1 AI Analysis Trigger**
- **Actor:** Client App
- **Action:** Detects message is translated; checks if AI analysis needed
- **System Event:** Heuristic detects potential idiom/cultural content (keyword matching or always-on for translated messages)
- **UI State:** No visible change yet
- **Data:** Message flagged for AI analysis

**4.2 Call AI Analysis Cloud Function**
- **Actor:** Client App
- **Action:** Invokes Cloud Function with AI analysis request
- **System Event:** HTTPS POST to AI Intelligence Layer endpoint
- **UI State:** No visible change (background processing)
- **Data Sent:** POST `/analyzeMessage`:
  ```json
  {
    "messageId": "msg_789",
    "text": "Break a leg at your interview tomorrow!",
    "sourceLang": "en",
    "targetLang": "it",
    "conversationId": "conv_123"
  }
  ```

**4.3 Cloud Function Receives Request**
- **Actor:** Cloud Function (AI Intelligence Layer)
- **Action:** Parses request; prepares RAG context retrieval
- **System Event:** Function begins processing with conversation context
- **UI State:** No visible change
- **Data:** Request validated and prepared for LLM call

**4.4 Load Conversation History (RAG)**
- **Actor:** Cloud Function
- **Action:** Queries Firestore for recent conversation messages
- **System Event:** Firestore query for last 20 messages in conversation
- **UI State:** No visible change
- **Data Query:** Firestore → `messages/{conversationId}/messages ORDER BY timestamp DESC LIMIT 20`

**4.5 Conversation Context Retrieved**
- **Actor:** Firestore
- **Action:** Returns array of recent messages for context
- **System Event:** Query results returned to Cloud Function
- **UI State:** No visible change
- **Data Received:** Array of 20 message objects with text, timestamps, senders

**4.6 Construct LLM Prompt**
- **Actor:** Cloud Function
- **Action:** Builds prompt with system instructions, context, and target message
- **System Event:** Prompt template populated with data
- **UI State:** No visible change
- **Data Created:** Prompt string:
  ```
  System: You are a cultural context analyzer. Detect idioms, cultural references, and formality issues in messages.
  
  Conversation context:
  [Previous 20 messages...]
  
  Analyze this message:
  Text: "Break a leg at your interview tomorrow!"
  Source language: English
  Target language: Italian
  
  Detect: idioms, cultural references, formality mismatches, slang.
  Return JSON with structure: { hasCulturalContext, type, explanation, relevance }
  ```

**4.7 Call LLM API with Function Calling**
- **Actor:** Cloud Function
- **Action:** Sends prompt to OpenAI GPT-4 with function definitions
- **System Event:** HTTPS POST to OpenAI API with authentication
- **UI State:** No visible change
- **Data Sent:** OpenAI API request with functions schema defining expected JSON output structure

**4.8 LLM Analysis Processing**
- **Actor:** LLM API (GPT-4/Claude)
- **Action:** Analyzes message text for cultural elements
- **System Event:** Model inference detects "break a leg" as English idiom
- **UI State:** No visible change
- **Data:** Model identifies:
  - Idiom: "break a leg"
  - Meaning: Good luck (theatrical origin)
  - Direct translation would confuse Italian speaker

**4.9 LLM Returns Analysis**
- **Actor:** LLM API
- **Action:** Returns structured JSON with cultural context explanation
- **System Event:** API response received by Cloud Function
- **UI State:** No visible change
- **Data Received:**
  ```json
  {
    "hasCulturalContext": true,
    "type": "idiom",
    "idiomDetected": "break a leg",
    "explanation": "In English, 'break a leg' is a theatrical idiom meaning 'good luck.' It originated from superstitions in theater where wishing someone 'good luck' was considered bad luck. In Italian, the equivalent expression would be 'In bocca al lupo' (into the wolf's mouth).",
    "relevance": "high",
    "suggestedEquivalent": "In bocca al lupo"
  }
  ```

**4.10 Cache AI Analysis**
- **Actor:** Cloud Function
- **Action:** Writes AI analysis result to Firestore for future reference
- **System Event:** Firestore write to aiAnalysis collection
- **UI State:** No visible change
- **Data Written:** Firestore → `aiAnalysis/{messageId}`:
  ```json
  {
    "messageId": "msg_789",
    "hasCulturalContext": true,
    "type": "idiom",
    "explanation": "In English, 'break a leg' is a theatrical idiom...",
    "timestamp": Timestamp.now()
  }
  ```

**4.11 Return Analysis to Client**
- **Actor:** Cloud Function
- **Action:** Sends AI analysis result back to client app
- **System Event:** HTTPS response completes
- **UI State:** No visible change yet
- **Data Returned:** AI analysis JSON object

**4.12 Render Cultural Hint Badge**
- **Actor:** Client App
- **Action:** Receives AI analysis; adds badge icon to message bubble
- **System Event:** React component re-renders with badge overlay
- **UI State:** Small badge icon (💡 or ℹ️) appears on top-right corner of message bubble
- **Data:** Message component state includes `aiAnalysis` property

**4.13 User Notices Hint Badge**
- **Actor:** User
- **Action:** Sees cultural hint indicator on message
- **System Event:** Visual attention drawn to badge
- **UI State:** Badge is visible and tappable
- **Data:** User perceives hint availability

**4.14 User Taps Hint Badge**
- **Actor:** User
- **Action:** Taps the cultural hint badge icon
- **System Event:** onPress handler fires; modal opens
- **UI State:** Bottom sheet or modal slides up with explanation
- **Data:** AI analysis data passed to modal component

**4.15 Display Cultural Explanation**
- **Actor:** Client App
- **Action:** Renders detailed explanation in modal
- **System Event:** Modal component displays formatted explanation
- **UI State:** Modal shows:
  - **Title:** "Cultural Hint: Idiom Detected"
  - **Original phrase:** "Break a leg"
  - **Meaning:** "Good luck (theatrical origin)"
  - **Full explanation:** "In English, 'break a leg' is a theatrical idiom..."
  - **Equivalent in Italian:** "In bocca al lupo"
  - **Close button**
- **Data Rendered:** AI analysis explanation displayed to user

**4.16 User Understands Context**
- **Actor:** User
- **Action:** Reads explanation; gains cultural understanding
- **System Event:** User comprehends meaning behind idiom
- **UI State:** Modal remains open until dismissed
- **Data:** Cultural knowledge transferred to user

**4.17 User Dismisses Modal**
- **Actor:** User
- **Action:** Taps close button or swipes modal down
- **System Event:** Modal close animation triggered
- **UI State:** Modal slides down; chat view returns to normal
- **Data:** No data changes; UI state resets

---

### Narrative 5: Push Notification (Background Message)

**Scenario:** User receives a message while the app is closed or backgrounded; a push notification alerts them and tapping it opens the conversation.

**5.0 App in Background**
- **Actor:** User (Recipient)
- **Action:** App is closed or backgrounded (user is doing other tasks)
- **System Event:** App lifecycle state is "background" or "inactive"
- **UI State:** App not visible; device shows home screen or another app
- **Data:** App maintains minimal background processes; Firestore listeners inactive

**5.1 Sender Sends Message**
- **Actor:** User (Sender)
- **Action:** Sends message from their device (follows Narrative 2)
- **System Event:** Message written to Firestore
- **UI State:** No change for recipient (app backgrounded)
- **Data Written:** Firestore → `messages/{conversationId}/messages/{newMessageId}`

**5.2 Firestore Trigger Fires**
- **Actor:** Firestore
- **Action:** New message document creation triggers `onMessageCreate` Cloud Function
- **System Event:** Cloud Function invoked with message data snapshot
- **UI State:** No visible change
- **Data Passed:** Full message document data sent to Cloud Function

**5.3 Cloud Function Retrieves Recipient Data**
- **Actor:** Cloud Function (Notifications & Lifecycle)
- **Action:** Queries Firestore for recipient user profile
- **System Event:** Firestore read operation
- **UI State:** No visible change
- **Data Query:** Firestore → `users/{recipientUserId}` to get FCM token and language preference

**5.4 Recipient Data Retrieved**
- **Actor:** Firestore
- **Action:** Returns recipient profile with FCM token and language
- **System Event:** Query resolves with user document
- **UI State:** No visible change
- **Data Received:**
  ```json
  {
    "userId": "recipientUserId",
    "fcmToken": "fcm-device-token-abc123",
    "language": "it",
    "displayName": "Marco"
  }
  ```

**5.5 Retrieve Sender Display Name**
- **Actor:** Cloud Function
- **Action:** Queries Firestore for sender profile to get display name
- **System Event:** Firestore read operation
- **UI State:** No visible change
- **Data Query:** Firestore → `users/{senderId}` to get sender's displayName

**5.6 Check Language Mismatch**
- **Actor:** Cloud Function
- **Action:** Compares sender and recipient languages
- **System Event:** Conditional logic determines if translation needed for notification
- **UI State:** No visible change
- **Data Compared:** Sender language "en" ≠ Recipient language "it" → Translate notification

**5.7 Translate Notification Text**
- **Actor:** Cloud Function
- **Action:** Calls Google Translation API to translate message text for notification body
- **System Event:** Same translation process as Narrative 3
- **UI State:** No visible change
- **Data Sent/Received:** Message text translated from English to Italian

**5.8 Construct Notification Payload**
- **Actor:** Cloud Function
- **Action:** Builds FCM notification object with title, body, and data
- **System Event:** Notification payload assembled
- **UI State:** No visible change
- **Data Created:**
  ```json
  {
    "token": "fcm-device-token-abc123",
    "notification": {
      "title": "Sarah",
      "body": "Ehi, incontriamoci per un caffè domani!",
      "sound": "default"
    },
    "data": {
      "conversationId": "conv_123",
      "messageId": "msg_789",
      "type": "newMessage"
    },
    "apns": {
      "payload": {
        "aps": {
          "badge": 1
        }
      }
    }
  }
  ```

**5.9 Send to Firebase Cloud Messaging**
- **Actor:** Cloud Function
- **Action:** Calls FCM Admin SDK to send notification
- **System Event:** HTTPS POST to FCM servers
- **UI State:** No visible change
- **Data Sent:** Notification payload sent to FCM

**5.10 FCM Queues Notification**
- **Actor:** Firebase Cloud Messaging
- **Action:** Receives notification; queues for delivery
- **System Event:** FCM validates token and queues message
- **UI State:** No visible change
- **Data:** Notification queued in FCM delivery system

**5.11 FCM Routes to Device Platform**
- **Actor:** Firebase Cloud Messaging
- **Action:** Routes notification to appropriate platform service (APNs for iOS, GCM for Android)
- **System Event:** Platform-specific delivery initiated
- **UI State:** No visible change
- **Data Sent:** Notification forwarded to APNs (iOS) or GCM (Android)

**5.12 Device OS Receives Notification**
- **Actor:** Device Operating System
- **Action:** APNs/GCM delivers notification to device
- **System Event:** OS notification handler receives push payload
- **UI State:** No visible change yet
- **Data Received:** Notification payload arrives at device

**5.13 Notification Banner Displays**
- **Actor:** Device OS
- **Action:** Shows notification banner with sound/vibration
- **System Event:** System notification UI rendered
- **UI State:** Notification banner appears at top of screen (iOS) or notification shade (Android) showing:
  - **Title:** "Sarah"
  - **Body:** "Ehi, incontriamoci per un caffè domani!"
  - **Sound:** Default notification sound plays
  - **Badge:** App icon shows "1" unread badge
- **Data Rendered:** Notification title and body displayed

**5.14 User Sees Notification**
- **Actor:** User
- **Action:** Notices notification banner and sound
- **System Event:** User's attention drawn to device
- **UI State:** Notification visible on lock screen or notification center
- **Data:** Visual and audio stimulus received

**5.15 User Taps Notification**
- **Actor:** User
- **Action:** Taps on notification banner
- **System Event:** OS triggers app launch with notification data
- **UI State:** App icon animates; app launches
- **Data Passed:** Notification `data` payload passed to app on launch

**5.16 App Launches from Notification**
- **Actor:** Client App
- **Action:** App initializes from closed/background state
- **System Event:** React Native app lifecycle transitions to "active"
- **UI State:** Splash screen briefly shows; app initializes
- **Data Read:** Notification data extracted: `{ conversationId: "conv_123", messageId: "msg_789" }`

**5.17 Extract Notification Data**
- **Actor:** Client App
- **Action:** Reads notification payload to determine target screen
- **System Event:** Expo Notifications API provides notification object
- **UI State:** App continues loading
- **Data Read:** `notificationData.conversationId = "conv_123"`

**5.18 Navigate to Conversation**
- **Actor:** Client App
- **Action:** Navigation system routes directly to conversation screen
- **System Event:** Navigation stack pushes ConversationScreen with conversationId
- **UI State:** Conversation screen loads with message history
- **Data:** Navigation params: `{ conversationId: "conv_123" }`

**5.19 Load Conversation**
- **Actor:** Client App
- **Action:** Loads messages from SQLite and subscribes to Firestore
- **System Event:** Same as Narrative 2 steps 2.1-2.3
- **UI State:** Message list renders with new message visible at bottom
- **Data Read:** SQLite and Firestore queries execute

**5.20 User Views Conversation**
- **Actor:** User
- **Action:** Sees conversation with new message highlighted
- **System Event:** User reads message
- **UI State:** Conversation fully rendered; new message visible with translated text
- **Data:** Message displayed with dual-language format (follows Narrative 3)

**5.21 Mark Message as Read**
- **Actor:** Client App
- **Action:** Automatically updates message read status (follows Narrative 3 step 3.14)
- **System Event:** Firestore update sent
- **UI State:** Sender receives read receipt (double blue checkmark)
- **Data Updated:** Message status updated to "read" with timestamp

**5.22 Notification Flow Complete**
- **Actor:** System
- **Action:** User successfully received notification and accessed message
- **System Event:** Full notification → open → read cycle completed
- **UI State:** User actively engaged in conversation
- **Data State:** Message delivered, notification shown, app opened, message read

---

**End of Part 2: Step-by-Step Narratives**

---

## 4. Summary

This User Flow Document provides comprehensive coverage of WorldChat's core interactions across five critical flows:

1. **Authentication & Onboarding (18 steps)** — User registration, language selection, profile creation
2. **Send Message (16 steps)** — Optimistic UI, local persistence, Firestore sync, real-time delivery
3. **Receive Message with Translation (15 steps)** — Real-time listening, translation caching, dual-language display
4. **AI Cultural Context Detection (17 steps)** — RAG context loading, LLM analysis, cultural hint rendering
5. **Push Notification (22 steps)** — Background message delivery, FCM routing, notification tap handling

**Total Steps Documented:** 88 detailed sequential steps covering all six supermodules

**Supermodule Coverage:**
- ✅ Setup & Auth (Narrative 1)
- ✅ Messaging Core (Narratives 2, 3, 5)
- ✅ Translation Engine (Narrative 3)
- ✅ AI Intelligence Layer (Narrative 4)
- ✅ Group Chat & Collaboration (patterns extend from one-on-one flows)
- ✅ Notifications & Lifecycle (Narrative 5)

**Data Operations Documented:**
- Firestore reads, writes, listeners, triggers
- SQLite local persistence
- Cloud Function orchestration
- External API calls (Google Translation, OpenAI/Claude)
- Push notification delivery (FCM → APNs/GCM)

---

**Document Version:** 1.0  
**Status:** Complete ✓  
**Total Lines:** ~750  
**Last Updated:** October 20, 2025

**References:**
- Project Overview: `/docs/foundation/project_overview.md`
- PRD: `/docs/foundation/prd.md`
- Tech Stack: `/docs/foundation/tech_stack.md`
- Architecture: `/docs/foundation/architecture.md` (to be generated)
- Dev Checklist: `/docs/foundation/dev_checklist.md` (to be generated)
