import { MessageRecord, SQLiteService } from '../storage/sqliteService'

export type QueueItem = {
    queueId: string
    messageId: string
    conversationId: string
    payload: string // JSON string of MessageRecord
    retryCount: number
    createdAt: number
    lastAttemptAt?: number
}

export type FirestoreSender = (message: MessageRecord) => Promise<void>

export class QueueManager {
    private sqlite: SQLiteService
    private sendToFirestore: FirestoreSender

    constructor(sqlite: SQLiteService, sender: FirestoreSender) {
        this.sqlite = sqlite
        this.sendToFirestore = sender
    }

    async enqueueMessage(message: MessageRecord): Promise<QueueItem> {
        const item: QueueItem = {
            queueId: message.messageId,
            messageId: message.messageId,
            conversationId: message.conversationId,
            payload: JSON.stringify(message),
            retryCount: 0,
            createdAt: Date.now()
        }
        await this.sqlite['db'].transaction((tx) => {
            tx.executeSql(
                `INSERT OR REPLACE INTO messageQueue (queueId, messageId, conversationId, payload, retryCount, createdAt) VALUES (?, ?, ?, ?, 0, ?);`,
                [item.queueId, item.messageId, item.conversationId, item.payload, item.createdAt]
            )
        })
        return item
    }

    async processQueue(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.sqlite['db'].readTransaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM messageQueue ORDER BY createdAt ASC LIMIT 20;`,
                    [],
                    async (_, res) => {
                        const items = res.rows._array as QueueItem[]
                        for (const item of items) {
                            const msg = JSON.parse(item.payload) as MessageRecord
                            try {
                                await this.sendToFirestore(msg)
                                await this.removeFromQueue(item.queueId)
                            } catch (err) {
                                await this.bumpRetry(item)
                            }
                        }
                        resolve()
                    },
                    (_, err) => {
                        reject(err)
                        return false
                    }
                )
            })
        })
    }

    private async removeFromQueue(queueId: string): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.sqlite['db'].transaction((tx) => {
                tx.executeSql(`DELETE FROM messageQueue WHERE queueId = ?;`, [queueId], () => resolve(), (_, err) => {
                    reject(err)
                    return false
                })
            })
        })
    }

    private async bumpRetry(item: QueueItem): Promise<void> {
        const nextRetry = item.retryCount + 1
        if (nextRetry > 3) {
            // give up but keep for inspection; could mark as failed in messages table
            return
        }
        await new Promise<void>((resolve, reject) => {
            this.sqlite['db'].transaction((tx) => {
                tx.executeSql(
                    `UPDATE messageQueue SET retryCount = ?, lastAttemptAt = ? WHERE queueId = ?;`,
                    [nextRetry, Date.now(), item.queueId],
                    () => resolve(),
                    (_, err) => {
                        reject(err)
                        return false
                    }
                )
            })
        })
        // Exponential backoff handled by caller scheduling (e.g., setTimeout with 2^retry)
    }
}


