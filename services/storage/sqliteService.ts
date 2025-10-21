import { openDatabase, runInTransaction, SQLiteDatabase } from './schema'

export type ConversationRecord = {
    conversationId: string
    type: 'oneToOne' | 'group'
    participants: string // JSON string array
    participantDetails?: string // JSON map
    lastMessageText?: string
    lastMessageSenderId?: string
    lastMessageTimestamp?: number
    createdAt: number
    updatedAt: number
}

export type MessageRecord = {
    messageId: string
    conversationId: string
    senderId: string
    senderName?: string
    originalText?: string
    originalLanguage?: string
    translations?: string // JSON object
    timestamp: number
    status: 'sending' | 'sent' | 'delivered' | 'read'
    readBy?: string // JSON map
    type: 'text' | 'image'
    imageUrl?: string
}

export class SQLiteService {
    private db: SQLiteDatabase

    constructor(db: SQLiteDatabase = openDatabase()) {
        this.db = db
    }

    async insertConversation(record: ConversationRecord): Promise<void> {
        await runInTransaction(this.db, (tx) => {
            tx.executeSql(
                `INSERT OR REPLACE INTO conversations (
          conversationId, type, participants, participantDetails,
          lastMessageText, lastMessageSenderId, lastMessageTimestamp,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    record.conversationId,
                    record.type,
                    record.participants,
                    record.participantDetails ?? null,
                    record.lastMessageText ?? null,
                    record.lastMessageSenderId ?? null,
                    record.lastMessageTimestamp ?? null,
                    record.createdAt,
                    record.updatedAt
                ]
            )
        })
    }

    async getConversations(): Promise<ConversationRecord[]> {
        return new Promise((resolve, reject) => {
            this.db.readTransaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM conversations ORDER BY updatedAt DESC;`,
                    [],
                    (_, res) => resolve(res.rows._array as ConversationRecord[]),
                    (_, err) => {
                        reject(err)
                        return false
                    }
                )
            })
        })
    }

    async updateConversation(
        conversationId: string,
        updates: Partial<ConversationRecord>
    ): Promise<void> {
        const fields: string[] = []
        const values: any[] = []
        Object.entries(updates).forEach(([key, value]) => {
            fields.push(`${key} = ?`)
            values.push(value)
        })
        values.push(conversationId)
        await runInTransaction(this.db, (tx) => {
            tx.executeSql(
                `UPDATE conversations SET ${fields.join(', ')} WHERE conversationId = ?;`,
                values
            )
        })
    }

    async insertMessage(record: MessageRecord): Promise<void> {
        await runInTransaction(this.db, (tx) => {
            tx.executeSql(
                `INSERT OR REPLACE INTO messages (
          messageId, conversationId, senderId, senderName,
          originalText, originalLanguage, translations,
          timestamp, status, readBy, type, imageUrl
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    record.messageId,
                    record.conversationId,
                    record.senderId,
                    record.senderName ?? null,
                    record.originalText ?? null,
                    record.originalLanguage ?? null,
                    record.translations ?? null,
                    record.timestamp,
                    record.status,
                    record.readBy ?? null,
                    record.type,
                    record.imageUrl ?? null
                ]
            )
            // update conversation last message metadata
            tx.executeSql(
                `UPDATE conversations SET lastMessageText = ?, lastMessageSenderId = ?, lastMessageTimestamp = ?, updatedAt = ? WHERE conversationId = ?;`,
                [
                    record.originalText ?? '[media]',
                    record.senderId,
                    record.timestamp,
                    record.timestamp,
                    record.conversationId
                ]
            )
        })
    }

    async getMessagesByConversation(conversationId: string, limit = 50, beforeTimestamp?: number): Promise<MessageRecord[]> {
        const where = beforeTimestamp ? `AND timestamp < ?` : ''
        const params = beforeTimestamp ? [conversationId, beforeTimestamp, limit] : [conversationId, limit]
        return new Promise((resolve, reject) => {
            this.db.readTransaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM messages WHERE conversationId = ? ${where} ORDER BY timestamp DESC LIMIT ?;`,
                    params,
                    (_, res) => resolve(res.rows._array as MessageRecord[]),
                    (_, err) => {
                        reject(err)
                        return false
                    }
                )
            })
        })
    }

    async updateMessage(messageId: string, updates: Partial<MessageRecord>): Promise<void> {
        const fields: string[] = []
        const values: any[] = []
        Object.entries(updates).forEach(([key, value]) => {
            fields.push(`${key} = ?`)
            values.push(value)
        })
        values.push(messageId)
        await runInTransaction(this.db, (tx) => {
            tx.executeSql(
                `UPDATE messages SET ${fields.join(', ')} WHERE messageId = ?;`,
                values
            )
        })
    }
}


