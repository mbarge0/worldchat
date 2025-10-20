import { getApp } from 'firebase/app'
import { doc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

export type UserProfile = {
    email: string
    displayName: string
    preferredLanguage: string
    profilePictureUrl?: string | null
    createdAt?: unknown
}

export async function createUserProfile(userId: string, data: Omit<UserProfile, 'createdAt'>): Promise<void> {
    const db = getFirestore(getApp())
    const ref = doc(db, 'users', userId)
    await setDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const db = getFirestore(getApp())
    const ref = doc(db, 'users', userId)
    await updateDoc(ref, { ...updates })
}


