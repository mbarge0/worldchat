import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

const TTL_MS = 3000

export async function setTyping(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    const ref = doc(collection(db, 'presence'), `${conversationId}_${userId}`)
    await setDoc(ref, {
        conversationId,
        userId,
        isTyping,
        lastTypingAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    }, { merge: true })
}

export function subscribeToTyping(conversationId: string, cb: (typing: boolean) => void): () => void {
    const ref = doc(db, 'presence', `${conversationId}_peer`)
    return onSnapshot(ref, (snap) => {
        const data = snap.data() as any
        if (!data) return cb(false)
        const last = data.lastTypingAt?.toMillis ? data.lastTypingAt.toMillis() : 0
        cb(Boolean(data.isTyping && Date.now() - last < TTL_MS))
    })
}


