import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing'
import fs from 'fs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST

if (!emulatorHost) {
    describe.skip('Firestore Security Rules (Setup & Auth) — emulator not running', () => {
        it('skipped', () => {
            expect(true).toBe(true)
        })
    })
} else {
    let testEnv: RulesTestEnvironment
    const [host, portStr] = emulatorHost.split(':')
    const port = Number(portStr || '8080')

    beforeAll(async () => {
        const rules = fs.readFileSync('firestore.rules', 'utf8')
        testEnv = await initializeTestEnvironment({
            projectId: 'worldchat-test',
            firestore: { host, port, rules }
        })
    })

    afterAll(async () => {
        await testEnv.cleanup()
    })

    describe('Firestore Security Rules (Setup & Auth)', () => {
        it('self profile read/write allowed; others denied', async () => {
            const alice = testEnv.authenticatedContext('alice')
            const bob = testEnv.authenticatedContext('bob')

            const aliceDb = alice.firestore()
            const bobDb = bob.firestore()

            await assertSucceeds(aliceDb.doc('users/alice').set({ email: 'a@b.com', displayName: 'Alice', preferredLanguage: 'en' }))
            await assertSucceeds(aliceDb.doc('users/alice').get())
            await assertFails(bobDb.doc('users/alice').update({ displayName: 'Mallory' }))
        })

        it('conversations/messages restricted to participants', async () => {
            const alice = testEnv.authenticatedContext('alice')
            const bob = testEnv.authenticatedContext('bob')
            const charlie = testEnv.authenticatedContext('charlie')

            const aliceDb = alice.firestore()
            const bobDb = bob.firestore()
            const charlieDb = charlie.firestore()

            // Create conversation where alice and bob are participants
            await assertSucceeds(aliceDb.doc('conversations/c1').set({ participants: ['alice', 'bob'] }))
            await assertSucceeds(bobDb.doc('conversations/c1').get())
            await assertFails(charlieDb.doc('conversations/c1').get())

            // Alice can write her own message
            await assertSucceeds(aliceDb.collection('conversations').doc('c1').collection('messages').doc('m1').set({ senderId: 'alice', text: 'hi' }))
            // Bob cannot impersonate alice
            await assertFails(bobDb.collection('conversations').doc('c1').collection('messages').doc('m2').set({ senderId: 'alice', text: 'oops' }))
            // Charlie cannot write at all
            await assertFails(charlieDb.collection('conversations').doc('c1').collection('messages').doc('m3').set({ senderId: 'charlie', text: 'hey' }))
        })
    })
}


