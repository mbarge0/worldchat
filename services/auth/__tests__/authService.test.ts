import { getAuth } from 'firebase/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentUser, signIn, signOut } from '../authService'

vi.mock('firebase/app', () => ({ getApp: vi.fn(() => ({})) }))

const mockAuth = {
    currentUser: null,
}

vi.mock('firebase/auth', async () => {
    return {
        getAuth: vi.fn(() => mockAuth),
        signInWithEmailAndPassword: vi.fn(async (_auth, email, _pw) => ({ user: { uid: 'u1', email } })),
        signOut: vi.fn(async () => { mockAuth.currentUser = null }),
    }
})

describe('authService', () => {
    beforeEach(() => {
        mockAuth.currentUser = null
    })

    it('signIn returns user', async () => {
        const { user } = await signIn('a@b.com', 'secret')
        expect(user.uid).toBe('u1')
    })

    it('getCurrentUser reflects auth state', async () => {
        const auth = getAuth({} as any)
            ; (auth as any).currentUser = { uid: 'u1' }
        expect(getCurrentUser()!.uid).toBe('u1')
        await signOut()
        expect(getCurrentUser()).toBeNull()
    })
})


