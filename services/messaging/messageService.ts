import { uploadImage } from '../media/imageService'
import { MessageRecord, SQLiteService } from '../storage/sqliteService'
import { updateLastMessage } from './conversationService'
import { sendMessageToFirestore, subscribeToConversation } from './firestoreSync'
import { QueueManager } from './queueManager'

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

export class MessageService {
    private sqlite: SQLiteService
    private queue: QueueManager

    constructor(sqlite = new SQLiteService()) {
        this.sqlite = sqlite
        this.queue = new QueueManager(this.sqlite, sendMessageToFirestore)
    }

    async sendMessage(conversationId: string, text: string, senderId: string, senderName?: string): Promise<MessageRecord> {
        const now = Date.now()
        const message: MessageRecord = {
            messageId: uuidv4(),
            conversationId,
            senderId,
            senderName,
            originalText: text,
            timestamp: now,
            status: 'sending',
            type: 'text'
        }
        // Optimistic insert
        await this.sqlite.insertMessage(message)

        try {
            await sendMessageToFirestore({ ...message, status: 'sent' })
            await this.sqlite.updateMessage(message.messageId, { status: 'sent' })
            await updateLastMessage(conversationId, text, senderId, now)
        } catch (err) {
            // Offline: enqueue for retry
            await this.queue.enqueueMessage(message)
        }

        return message
    }

    async sendImage(conversationId: string, localUri: string, senderId: string, senderName?: string): Promise<MessageRecord> {
        const now = Date.now()
        const uploaded = await uploadImage(localUri, senderId)
        const message: MessageRecord = {
            messageId: uuidv4(),
            conversationId,
            senderId,
            senderName,
            timestamp: now,
            status: 'sending',
            type: 'image',
            imageUrl: uploaded
        }
        await this.sqlite.insertMessage(message)
        try {
            await sendMessageToFirestore({ ...message, status: 'sent' })
            await this.sqlite.updateMessage(message.messageId, { status: 'sent' })
            await updateLastMessage(conversationId, '[image]', senderId, now)
        } catch (err) {
            await this.queue.enqueueMessage(message)
        }
        return message
    }

    async loadMessages(conversationId: string, limit = 50) {
        return this.sqlite.getMessagesByConversation(conversationId, limit)
    }

    subscribe(conversationId: string, onMessages: (records: MessageRecord[]) => void): () => void {
        return subscribeToConversation(conversationId, async (docs) => {
            // Map remote docs into local records and persist
            for (const d of docs) {
                const rec: MessageRecord = {
                    messageId: d.messageId || d.id,
                    conversationId,
                    senderId: d.senderId,
                    senderName: d.senderName,
                    originalText: d.originalText,
                    originalLanguage: d.originalLanguage,
                    translations: d.translations ? JSON.stringify(d.translations) : undefined,
                    timestamp: d.timestamp?.toMillis ? d.timestamp.toMillis() : d.timestamp,
                    status: d.status,
                    readBy: d.readBy ? JSON.stringify(d.readBy) : undefined,
                    type: d.type,
                    imageUrl: d.imageUrl
                }
                await this.sqlite.insertMessage(rec)
            }
            const latest = await this.sqlite.getMessagesByConversation(conversationId, 50)
            onMessages(latest)
        })
    }
}


