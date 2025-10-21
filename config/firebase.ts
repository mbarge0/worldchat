/* Firebase initialization for WorldChat (Expo SDK 54, RN 0.76+)
 *
 * - Uses modular Firebase SDK
 * - Reads credentials from environment variables (no secrets in code)
 * - Persistent authentication via AsyncStorage (react-native)
 * - Exports singletons: app, auth, db
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore - getReactNativePersistence is available in RN builds via firebase/auth
import { getReactNativePersistence } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Prefer Expo's public env vars, fall back to NEXT_PUBLIC_ for hybrid setups
const firebaseConfig = {
    apiKey:
        process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        '',
    authDomain:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        '',
    projectId:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
        '',
    storageBucket:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        '',
    messagingSenderId:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
        '',
    appId:
        process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
        '',
} as const;

// Initialize (singleton-safe)
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth with persistent storage (RN AsyncStorage)
let auth: Auth;
try {
    auth = initializeAuth(app, {
        // @ts-ignore - Type definitions may not include RN helper, runtime is valid
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch {
    // Fallback in case auth is already initialized
    auth = getAuth(app);
}

const db: Firestore = getFirestore(app);

console.log('✅ Firebase initialized with iOS config');

export { app, auth, db };

