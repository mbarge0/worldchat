import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export type ConversationMeta = {
    conversationId: string
    type: 'oneToOne' | 'group'
    participants: string[]
    lastMessage?: { text: string; senderId: string; timestamp: number }
    updatedAt: number
}

export async function createConversation(participants: string[], type: 'oneToOne' | 'group' = 'oneToOne'): Promise<string> {
    const ref = collection(db, 'conversations')
    const res = await addDoc(ref, {
        type,
        participants,
        updatedAt: Date.now()
    })
    return res.id
}

export function subscribeToConversations(userId: string, cb: (items: ConversationMeta[]) => void): () => void {
    const q = query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'))
    return onSnapshot(q, (snap) => {
        const rows: ConversationMeta[] = snap.docs
            .map((d) => ({ conversationId: d.id, ...(d.data() as any) }))
            .filter((c) => c.participants?.includes(userId))
        cb(rows)
    })
}

export async function updateLastMessage(conversationId: string, text: string, senderId: string, timestamp: number): Promise<void> {
    await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: { text, senderId, timestamp },
        updatedAt: timestamp
    })
}


