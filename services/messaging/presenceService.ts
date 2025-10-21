import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export async function updatePresence(userId: string, isOnline: boolean): Promise<void> {
    const ref = doc(collection(db, 'presence'), userId)
    await setDoc(ref, {
        userId,
        isOnline,
        updatedAt: serverTimestamp()
    }, { merge: true })
}

export function subscribeToPresence(userId: string, cb: (online: boolean) => void): () => void {
    const ref = doc(db, 'presence', userId)
    return onSnapshot(ref, (snap) => {
        cb(Boolean(snap.data()?.isOnline))
    })
}


