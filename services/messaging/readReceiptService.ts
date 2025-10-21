import { collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

export async function markAsRead(conversationId: string, messageId: string, userId: string): Promise<void> {
    const ref = doc(collection(db, 'conversations', conversationId, 'messages'), messageId)
    await updateDoc(ref, {
        status: 'read',
        [`readBy.${userId}`]: serverTimestamp()
    } as any)
}

export async function markDelivered(conversationId: string, messageId: string): Promise<void> {
    const ref = doc(collection(db, 'conversations', conversationId, 'messages'), messageId)
    await updateDoc(ref, { status: 'delivered' } as any)
}


