import { describe, expect, it, vi } from 'vitest'

vi.mock('firebase/app', () => ({ getApp: vi.fn(() => ({})) }))

// Mock before importing the SUT to avoid TDZ issues
vi.mock('firebase/firestore', () => {
    const setDoc = vi.fn(async () => { })
    const updateDoc = vi.fn(async () => { })
    const doc = vi.fn(() => ({}))
    const getFirestore = vi.fn(() => ({}))
    const serverTimestamp = () => ({ '.sv': 'timestamp' }) as any
    return { getFirestore, doc, setDoc, updateDoc, serverTimestamp }
})

import { createUserProfile, updateUserProfile } from '../userProfileService'

describe('userProfileService', () => {
    it('createUserProfile writes document', async () => {
        await createUserProfile('u1', { email: 'a@b.com', displayName: 'A', preferredLanguage: 'en', profilePictureUrl: null })
        // assert via mocked module
        const { setDoc } = await import('firebase/firestore')
        expect((setDoc as any)).toHaveBeenCalled()
    })

    it('updateUserProfile updates fields', async () => {
        await updateUserProfile('u1', { displayName: 'B' })
        const { updateDoc } = await import('firebase/firestore')
        expect((updateDoc as any)).toHaveBeenCalled()
    })
})


