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

