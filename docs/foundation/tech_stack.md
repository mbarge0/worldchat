# Tech Stack

**Document Version:** 1.0  
**Project:** WorldChat  
**Platform:** React Native + Expo  
**Last Updated:** October 20, 2025

---

## 1. Overview

WorldChat's technology stack prioritizes **real-time performance**, **offline-first reliability**, and **rapid development velocity** within a one-week sprint timeline. The architecture is built on proven Firebase infrastructure for serverless scalability, React Native for cross-platform mobile development, and cloud-based AI services for intelligent translation features. Every technology choice balances three objectives: delivering production-grade messaging reliability comparable to WhatsApp, integrating sophisticated AI capabilities without custom ML infrastructure, and maintaining developer efficiency through managed services and modern tooling. The stack deliberately avoids custom backend servers, container orchestration, and ML model training in favor of Firebase Cloud Functions, managed APIs, and pre-trained LLMs—enabling a small team to build and deploy a complex real-time application within strict time constraints.

---

## 2. Core Frameworks

### Frontend Framework: React Native + Expo

**What it's used for:**  
Cross-platform mobile application development for iOS and Android with a single JavaScript/TypeScript codebase. Expo provides managed workflows, pre-built modules for camera/notifications/SQLite, and streamlined deployment via Expo Go or standalone builds.

**Why it was chosen:**  
React Native offers native performance with web development paradigms, dramatically reducing time-to-market compared to building separate Swift and Kotlin applications. Expo eliminates native build configuration complexity, provides over-the-air updates, and includes essential modules (Expo Notifications, Expo SQLite, Expo SecureStore) without ejecting to bare workflow. The framework's mature ecosystem, comprehensive documentation, and tight integration with Firebase make it ideal for rapid prototyping and production deployment within a one-week timeline.

**Alternative:**  
Flutter with Dart—offers comparable cross-platform capabilities with potentially better performance due to compiled native code and a unified rendering engine, but requires learning Dart and has a smaller AI/Firebase integration ecosystem compared to React Native's JavaScript ecosystem.

### Backend Framework: Firebase Cloud Functions (Node.js)

**What it's used for:**  
Serverless backend logic for AI orchestration, translation API calls, and business logic that must remain secure server-side. Functions respond to Firestore database triggers, handle HTTPS requests from the client, and integrate with external APIs (Google Translation, OpenAI/Claude).

**Why it was chosen:**  
Cloud Functions eliminate infrastructure management, scale automatically with usage, and integrate natively with Firebase services (Firestore, Auth, FCM). By keeping API keys and sensitive logic server-side, the architecture prevents credential exposure in client bundles. Functions deploy in seconds and support TypeScript, enabling rapid iteration without managing servers, load balancers, or container orchestration. The serverless model aligns perfectly with the sprint timeline and Firebase-centric architecture.

**Alternative:**  
Supabase Edge Functions with Deno—provides similar serverless execution with PostgreSQL integration and lower cold start times, but lacks Firebase's real-time Firestore capabilities and has fewer AI framework integrations compared to Node.js ecosystem maturity.

### AI Integration Framework: AI SDK by Vercel

**What it's used for:**  
Abstracting LLM interactions, managing function calling/tool use, streaming responses, and implementing RAG (Retrieval-Augmented Generation) pipelines for context-aware AI features. Handles prompt construction, response parsing, and error recovery for cultural hints, formality detection, and smart replies.

**Why it was chosen:**  
The AI SDK provides a unified interface for multiple LLM providers (OpenAI, Anthropic, Mistral), streamlines tool/function calling with type-safe schemas, and offers React hooks for streaming UI updates. Its lightweight design fits serverless Cloud Functions constraints, and built-in RAG utilities simplify conversation context injection. The framework reduces boilerplate for common AI patterns while maintaining flexibility for custom agents.

**Alternative:**  
LangChain—offers more comprehensive agent orchestration, memory management, and chain-of-thought capabilities with extensive pre-built tools and integrations, but introduces heavier dependencies and steeper learning curve that may slow development in a time-constrained sprint.

---

## 3. Programming Languages

### TypeScript (Primary)

**Role:**  
Primary language for React Native frontend, Firebase Cloud Functions backend, and shared type definitions across client and server. Provides static typing, IntelliSense support, and compile-time error detection for rapid development cycles.

**Rationale:**  
TypeScript's type system catches errors before runtime, improves code maintainability in a fast-paced sprint, and offers superior IDE support. Shared type definitions between frontend and backend ensure API contract consistency. The language's JavaScript compatibility enables seamless integration with the massive npm ecosystem while adding safety guarantees.

### JavaScript (Secondary)

**Role:**  
Supporting role for configuration files, Firebase configuration scripts, and testing utilities where type safety is less critical. Also serves as compilation target for TypeScript.

**Rationale:**  
Certain tooling and configuration patterns (Jest config, Expo config, Firebase config) conventionally use JavaScript. The language's flexibility suits rapid prototyping and scripting tasks where TypeScript's strictness would add friction.

---

## 4. Databases and Storage

### Primary Database: Firebase Firestore

**What it's used for:**  
Real-time NoSQL document database storing user profiles, conversations, messages, presence status, typing indicators, and translation caches. Provides real-time listeners for instant message delivery and offline persistence with automatic sync.

**Why it was chosen:**  
Firestore's real-time subscriptions deliver sub-second message updates without polling or WebSocket management. Offline persistence is built-in, enabling seamless offline-first architecture where writes queue locally and sync when connectivity returns. The document-subcollection model naturally represents conversations with messages, and security rules enforce access control declaratively. Firestore scales automatically, handles concurrent writes with conflict resolution, and integrates natively with Cloud Functions for server-side logic triggers. This eliminates the need for custom real-time infrastructure while meeting the 99.9% delivery reliability requirement.

**Alternative:**  
Supabase with PostgreSQL and Realtime—offers relational database structure with real-time capabilities via PostgreSQL's LISTEN/NOTIFY, providing better support for complex queries and joins, but requires more manual schema management and lacks Firestore's automatic offline sync and conflict resolution mechanisms.

### Local Storage: Expo SQLite

**What it's used for:**  
Client-side message persistence for offline access, enabling users to view conversation history without network connectivity. Stores messages, user metadata, and conversation state locally on the device.

**Why it was chosen:**  
SQLite provides a lightweight relational database embedded in the mobile app with no external dependencies. Expo SQLite offers a promise-based JavaScript API that integrates seamlessly with React Native, supporting complex queries for message search and filtering. The database persists across app restarts, crashes, and OS updates, ensuring the "survives app restart" MVP requirement. SQLite's ACID guarantees prevent data corruption during offline writes, and its battle-tested reliability makes it the de facto standard for mobile offline storage.

**Alternative:**  
WatermelonDB—provides reactive database capabilities with observables for real-time UI updates and better performance for large datasets, but adds architectural complexity and a steeper learning curve that may slow development in a sprint timeline.

### Cache Storage: Firestore (Translation Cache)

**What it's used for:**  
Caching frequently used translations to reduce Google Translation API costs and improve response times. Stores translation pairs (source language + text → target language + translated text) with expiration timestamps.

**Why it was chosen:**  
Reusing Firestore for caching eliminates additional infrastructure and leverages existing security rules and backup systems. The cache is accessible from both Cloud Functions (for server-side translation) and clients (for read-optimized lookups), enabling cache-aside patterns. Firestore's queryability allows efficient cache hit lookups by language pair and source text, and TTL (Time-To-Live) policies can be implemented via Cloud Functions scheduled jobs.

**Alternative:**  
Firebase Cloud Storage with memcached or Redis—offers lower latency for high-frequency cache reads with better cost efficiency at scale, but requires managing separate infrastructure and introduces operational complexity unsuitable for a one-week sprint.

---

## 5. APIs and Integrations

### Firebase Suite

**Components:**  
- **Firebase Authentication:** User registration, login, and session management with email/password, Google Sign-In, and Apple Sign-In providers
- **Firebase Cloud Messaging (FCM):** Push notifications for iOS and Android
- **Firebase Security Rules:** Declarative access control for Firestore and Cloud Functions
- **Firebase Hosting:** Optional static asset hosting (future web client)

**Rationale:**  
Firebase provides a cohesive ecosystem where services integrate natively without custom authentication flows or API gateways. Auth tokens automatically propagate to Firestore and Cloud Functions, enabling seamless authorization. FCM handles cross-platform push notifications through a single API, abstracting iOS APNs and Android GCM differences. The integrated suite reduces integration complexity and accelerates development.

### Google Cloud Translation API

**What it's used for:**  
Real-time message translation supporting all language pairs. Called from Cloud Functions to maintain API key security.

**Rationale:**  
Google Cloud Translation offers industry-leading accuracy, supports 100+ languages including complex scripts (Arabic RTL, Chinese characters), and provides automatic language detection. The API's reliability and low latency (<200ms for typical messages) ensure real-time translation feasibility. Integration with Firebase via Cloud Functions is straightforward, and cost is predictable based on character count.

**Alternative:**  
DeepL API—provides superior translation quality for European languages with better context preservation, but supports fewer language pairs (30 vs. 100+) and lacks the broad language coverage required for universal communication.

### LLM APIs: OpenAI GPT-4 or Anthropic Claude

**What it's used for:**  
AI-powered cultural context hints, formality level detection, slang/idiom explanations, and Context-Aware Smart Replies generation. Models process conversation history via RAG pipelines to provide contextual responses.

**Rationale:**  
GPT-4 and Claude represent state-of-the-art language understanding, offering nuanced cultural awareness and reasoning capabilities essential for detecting formality mismatches and explaining idioms. Function calling (tool use) enables structured outputs for specific AI features (e.g., returning JSON with cultural hint metadata). Cloud Functions orchestration ensures API keys remain secure while enabling flexible prompt engineering and model selection based on task requirements (Claude for long context windows, GPT-4 for tool use reliability).

**Alternative:**  
Google Gemini Pro—offers competitive reasoning and multimodal capabilities with tighter Firebase integration and potentially lower costs, but has less mature function calling and fewer third-party framework integrations compared to OpenAI/Anthropic ecosystem maturity.

### Expo Modules

**Key Modules:**  
- **Expo Notifications:** Push notification handling
- **Expo SQLite:** Local database
- **Expo SecureStore:** Encrypted key-value storage for auth tokens
- **Expo Image Picker:** Camera and gallery access for profile pictures and image sharing

**Rationale:**  
Expo modules abstract platform-specific native APIs (iOS/Android) into unified JavaScript interfaces, eliminating the need to write Swift/Kotlin bridge code. Modules are maintained by the Expo team, ensuring compatibility with React Native updates and providing consistent cross-platform behavior. This dramatically reduces development time and testing surface area.

---

## 6. AI & ML Layer

### Large Language Models (LLMs)

**Primary Options:**  
- **OpenAI GPT-4** (gpt-4-turbo): 128k context window, reliable function calling, strong reasoning
- **Anthropic Claude 3.5 Sonnet**: 200k context window, superior long-context understanding, strong cultural awareness

**Use Cases:**  
- Cultural context detection and explanation generation
- Formality level analysis across different cultural norms
- Slang and idiom interpretation with cultural background
- Smart reply generation matching user communication style

**Rationale:**  
GPT-4 and Claude are chosen for their advanced reasoning capabilities, multilingual fluency, and cultural knowledge spanning global contexts. Function calling enables structured outputs (e.g., `{"hasCulturalContext": true, "hint": "...", "relevance": "high"}`), simplifying integration with UI components. Large context windows (128k–200k tokens) allow RAG pipelines to inject extensive conversation history, ensuring AI features consider full conversational context rather than isolated messages. The models' training on diverse multilingual datasets ensures accurate cultural awareness across language pairs.

**Model Selection Strategy:**  
Use GPT-4 for real-time features requiring fast response times and structured outputs (cultural hints, formality detection). Use Claude for complex analysis tasks benefiting from longer context (smart reply generation considering full conversation history).

### Embedding Models

**Model:** OpenAI text-embedding-3-small  
**Use Case:** Semantic search for RAG context retrieval, enabling AI to find relevant conversation history without exact text matching.

**Rationale:**  
While full RAG implementation with vector databases may be deferred in the one-week sprint, embedding models enable future semantic search capabilities for finding similar conversations or context-relevant messages. The small model variant balances accuracy with inference speed and cost, generating 1536-dimensional embeddings suitable for conversation semantic similarity.

**Alternative:**  
Sentence-Transformers (all-MiniLM-L6-v2)—open-source embedding model with no API costs and offline capability, but requires self-hosting and lacks multilingual performance compared to OpenAI's multilingual embeddings.

### Vector Database

**Approach:** Firestore with Embedding Fields (Simplified RAG)  
**Future Consideration:** Pinecone or Weaviate for production-scale RAG

**Rationale:**  
For the sprint timeline, RAG can be implemented by storing embeddings as array fields in Firestore documents and performing simple nearest-neighbor searches in Cloud Functions. This avoids introducing additional infrastructure while proving AI feature concepts. As message volume scales, migrating to a dedicated vector database (Pinecone for managed service, Weaviate for self-hosted) would enable sub-100ms similarity searches across millions of messages with advanced filtering.

---

## 7. Infrastructure and Deployment

### Hosting Platform: Firebase (Google Cloud Platform)

**Components:**  
- **Cloud Functions:** Serverless compute for backend logic
- **Firestore:** Managed NoSQL database
- **Firebase Authentication:** Managed identity service
- **Firebase Cloud Messaging:** Push notification delivery
- **Firebase Hosting:** Static asset CDN (future use)

**Rationale:**  
Firebase provides a fully managed, serverless infrastructure that scales automatically from zero to millions of concurrent users without capacity planning. Zero-downtime deployments, automatic SSL certificates, and global CDN distribution come standard. The pay-as-you-go pricing model aligns with prototype and MVP stages, avoiding fixed infrastructure costs. Firebase's tight integration with Google Cloud Platform enables future scaling (Cloud Run, GKE) without architectural rewrites.

### CI/CD Approach: GitHub Actions + Expo EAS

**Pipeline:**  
- **Source Control:** GitHub repository with branch protection
- **Continuous Integration:** GitHub Actions for automated testing (Jest unit/integration tests)
- **Continuous Deployment:** Expo Application Services (EAS) for building and publishing iOS/Android builds

**Rationale:**  
GitHub Actions provides free CI/CD for open-source projects with seamless GitHub integration. Automated testing on every pull request catches regressions early. EAS Build handles iOS and Android compilation in the cloud, eliminating the need for local Xcode/Android Studio builds and macOS hardware. EAS Submit automates TestFlight and Google Play deployment, reducing manual submission overhead. This workflow enables continuous delivery without dedicated DevOps infrastructure.

### Deployment Method: Expo Go + Standalone Builds

**Development:** Expo Go app for rapid testing on physical devices during development  
**Production:** EAS Build for standalone iOS (TestFlight) and Android (APK/AAB) binaries

**Rationale:**  
Expo Go enables instant over-the-air updates during development—developers scan a QR code and see changes in seconds without reinstalling. For production, standalone builds provide full native control, custom splash screens, and app store distribution. The dual approach maximizes development velocity while delivering production-quality artifacts for stakeholders and end users.

---

## 8. Developer Tools and Environment

### Integrated Development Environment (IDE)

**Primary:** Visual Studio Code with extensions:
- ESLint + Prettier for code formatting
- TypeScript language server
- React Native Tools for debugging
- Firebase Explorer for Firestore/Functions browsing

**Rationale:**  
VS Code is the de facto standard for JavaScript/TypeScript development, offering best-in-class IntelliSense, debugging, and extension ecosystem. Free, cross-platform, and highly performant, it integrates seamlessly with Git, terminal workflows, and React Native debugging tools.

### AI Coding Assistants

**Tools:** Cursor IDE with Claude Sonnet, GitHub Copilot  
**Use Cases:** Boilerplate generation, test writing, debugging assistance, documentation

**Rationale:**  
AI-powered code completion and generation accelerate development in time-constrained sprints. Cursor provides inline AI suggestions with project context awareness, while Copilot offers real-time code completion. These tools are particularly effective for repetitive patterns (Firebase queries, component boilerplate, test scaffolding) and API integration examples.

### Testing Framework: Jest + React Native Testing Library

**Components:**  
- **Jest:** Test runner and assertion library
- **React Native Testing Library:** Component testing utilities
- **Firebase Emulator Suite:** Local Firebase services for integration testing

**Rationale:**  
Jest is the standard testing framework for React and React Native projects, offering fast parallel test execution, snapshot testing, and built-in mocking. React Native Testing Library encourages testing user behavior rather than implementation details, improving test resilience. Firebase Emulator Suite enables full integration testing of Firestore queries and Cloud Functions without hitting production services or incurring costs.

### Debugging and Monitoring

**Tools:**  
- **React Native Debugger:** Chrome DevTools integration for React Native
- **Flipper:** Native mobile debugging with network inspector
- **Firebase Console:** Real-time database monitoring and Cloud Functions logs
- **Sentry (future):** Error tracking and performance monitoring

**Rationale:**  
React Native Debugger provides standard Chrome DevTools (console, network, elements) for JavaScript debugging. Flipper offers deeper native debugging including SQLite inspection, network traffic analysis, and Redux state inspection. Firebase Console provides real-time visibility into Firestore operations, Cloud Functions execution logs, and API quotas—essential for diagnosing production issues.

### Version Control and Collaboration

**Platform:** GitHub with conventional commit messages  
**Branching Strategy:** Feature branches with pull request reviews  
**Documentation:** Markdown files in `/docs` directory

**Rationale:**  
GitHub provides free unlimited repositories, GitHub Actions CI/CD, and issue tracking in a single platform. Conventional commits enable automated changelog generation. Feature branches with PR reviews ensure code quality even in rapid development cycles. Documentation as code (Markdown in Git) keeps technical specs version-controlled alongside implementation.

---

## 9. Security and Compliance

### Authentication and Authorization

**Mechanism:** Firebase Authentication with JWT tokens  
**Providers:** Email/password, Google Sign-In, Apple Sign-In  
**Authorization:** Firestore Security Rules enforcing user-level data access

**Rationale:**  
Firebase Auth generates cryptographically signed JWT tokens that Firestore and Cloud Functions validate automatically. Security rules declaratively enforce access control (e.g., `allow read, write: if request.auth.uid == resource.data.userId`), preventing unauthorized data access without custom middleware. Multi-provider support (email, Google, Apple) reduces friction for diverse user preferences while maintaining single sign-on consistency.

### Data Protection

**Measures:**  
- **Encryption in Transit:** TLS 1.3 for all client-server communication
- **Encryption at Rest:** Firestore and Cloud Functions automatic encryption
- **API Key Security:** All external API keys stored in Cloud Functions environment variables
- **Token Storage:** Expo SecureStore with device keychain/keystore encryption

**Rationale:**  
Firebase enforces encryption by default, eliminating configuration errors. Cloud Functions environment variables keep API keys out of client bundles, preventing credential leakage via decompilation or network interception. Expo SecureStore uses iOS Keychain and Android Keystore for hardware-backed encryption of authentication tokens.

### Compliance Considerations

**GDPR/Privacy:**  
- User data stored in Firestore with geographic region selection (EU, US)
- User deletion capability via Cloud Functions
- Privacy policy acknowledgment during onboarding

**Data Residency:**  
Firebase allows region-specific Firestore instances (e.g., `europe-west1` for GDPR compliance)

**Rationale:**  
While full GDPR compliance is deferred for the sprint, architectural decisions (regional data storage, deletion capabilities) lay groundwork for future compliance. Firebase's managed infrastructure simplifies compliance as Google handles infrastructure certifications (SOC 2, ISO 27001).

---

## 10. Scalability and Observability

### Scalability Architecture

**Horizontal Scaling:** Cloud Functions auto-scale to thousands of concurrent instances  
**Database Scaling:** Firestore automatically shards and distributes data across servers  
**Caching Strategy:** Translation cache reduces API costs; Firestore query results cached client-side  
**Cost Optimization:** Cloud Functions cold start mitigation via minimum instances (production only)

**Rationale:**  
Firebase's serverless architecture eliminates manual scaling concerns—the platform automatically provisions resources based on demand. Firestore's automatic sharding handles millions of concurrent users without manual rebalancing. Translation caching reduces variable costs (Google Translation charges per character), improving unit economics. The architecture supports growth from MVP (dozens of users) to production scale (millions) without re-platforming.

### Performance Monitoring

**Current:** Firebase Performance Monitoring for app startup time, network latency  
**Future:** Custom metrics via Firebase Analytics for AI feature usage, translation cache hit rates

**Rationale:**  
Firebase Performance Monitoring automatically tracks key mobile metrics (screen rendering time, HTTP request latency, app startup time) without manual instrumentation. Custom traces can measure specific flows (message send → receive latency). This provides baseline performance data for optimization prioritization.

### Logging and Error Tracking

**Logging:** Cloud Functions automatic logging to Google Cloud Logging  
**Error Tracking:** Firebase Crashlytics for crash reports with stack traces  
**Future:** Sentry integration for enhanced error context and alerting

**Rationale:**  
Cloud Functions logs are automatically indexed and searchable in the Firebase Console, enabling real-time debugging. Crashlytics captures unhandled exceptions with device metadata, stack traces, and breadcrumbs. Logs are retained for 30 days in free tier, sufficient for sprint development and early production monitoring.

### Analytics and Usage Metrics

**Platform:** Firebase Analytics for user engagement, feature adoption, retention  
**Custom Events:** Track AI feature usage (translation requests, cultural hint views, smart reply acceptance rate)

**Rationale:**  
Firebase Analytics provides free unlimited event tracking with automatic user properties (device type, OS version, geographic region). Custom events measure AI feature adoption rates (critical success metric: 80% of users use 3+ AI features), translation accuracy feedback (thumbs up/down), and conversation patterns. Analytics data informs product iteration and validates success criteria.

### Alerting and Incident Response

**Current:** Firebase Console alerts for Cloud Functions failures, quota limits  
**Future:** PagerDuty or Opsgenie integration for production incident management

**Rationale:**  
Firebase Console provides email alerts for critical failures (Cloud Functions error rate > 10%, Firestore quota approaching limit). For MVP and early production, manual monitoring via Firebase Console is sufficient. As user base grows, integrating with dedicated incident management platforms enables on-call rotations and automated escalation.

---

## Technology Cohesion Summary

The WorldChat tech stack forms a cohesive ecosystem centered on Firebase's managed infrastructure, React Native's cross-platform efficiency, and cloud-based AI services. Every choice prioritizes:

1. **Developer Velocity:** Managed services (Firebase, Expo) eliminate infrastructure management, enabling focus on feature development
2. **Real-Time Performance:** Firestore real-time listeners, optimistic UI updates, and Cloud Functions deliver sub-500ms message latency
3. **Offline Resilience:** SQLite local persistence and Firestore offline sync ensure 100% message delivery reliability
4. **AI Integration:** Cloud Functions orchestrate secure API calls to Translation and LLM services without exposing credentials
5. **Scalability:** Serverless architecture scales automatically from prototype to production without re-platforming

The stack's tight integration (Firebase Auth → Firestore → Cloud Functions → FCM) minimizes custom glue code, reduces operational complexity, and accelerates time-to-market—critical for delivering a production-grade application within a one-week sprint while maintaining architectural foundations for future growth.

---

**End of Tech Stack Document**

**Document Version:** 1.0  
**Next Steps:** Proceed to Architecture Loop for detailed system design  
**References:**  
- Product Requirements Document: `/docs/foundation/prd.md`
- Architecture Document: `/docs/foundation/architecture.md` (to be generated)
- Development Checklist: `/docs/foundation/dev_checklist.md` (to be generated)
