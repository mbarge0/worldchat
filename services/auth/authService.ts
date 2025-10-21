import { getApp } from 'firebase/app'
import { createUserWithEmailAndPassword, signOut as fbSignOut, getAuth, signInWithEmailAndPassword, updateProfile, User } from 'firebase/auth'

export type SignUpResult = {
    user: User
}

export type SignInResult = {
    user: User
}

/**
 * Creates a new Firebase Auth user and sets the display name.
 */
export async function signUp(email: string, password: string, displayName: string): Promise<SignUpResult> {
    const auth = getAuth(getApp())
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName && cred.user) {
        await updateProfile(cred.user, { displayName })
    }
    return { user: cred.user }
}

/**
 * Signs in an existing Firebase Auth user with email and password.
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
    const auth = getAuth(getApp())
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return { user: cred.user }
}

/**
 * Signs out the current Firebase Auth user.
 */
export async function signOut(): Promise<void> {
    const auth = getAuth(getApp())
    await fbSignOut(auth)
}

/**
 * Returns the currently authenticated user, if any.
 */
export function getCurrentUser(): User | null {
    const auth = getAuth(getApp())
    return auth.currentUser
}


