import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Timestamp
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { MessageRecord } from '../storage/sqliteService'

export async function sendMessageToFirestore(message: MessageRecord): Promise<void> {
    const ref = collection(db, 'conversations', message.conversationId, 'messages')
    const payload = {
        messageId: message.messageId,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: message.senderName ?? null,
        originalText: message.originalText ?? null,
        originalLanguage: message.originalLanguage ?? null,
        translations: message.translations ? JSON.parse(message.translations) : {},
        timestamp: Timestamp.fromMillis(message.timestamp) ?? serverTimestamp(),
        status: message.status,
        readBy: message.readBy ? JSON.parse(message.readBy) : {},
        type: message.type,
        imageUrl: message.imageUrl ?? null
    }
    await setDoc(doc(ref, message.messageId), payload)
}

export function subscribeToConversation(
    conversationId: string,
    callback: (docs: any[]) => void
): () => void {
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp', 'asc')
    )
    return onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callback(data)
    })
}


