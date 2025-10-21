import * as SQLite from 'expo-sqlite'

export type SQLiteDatabase = SQLite.WebSQLDatabase

export function openDatabase(): SQLiteDatabase {
    // Use single shared connection; Expo SQLite returns the same instance per name
    return SQLite.openDatabase('worldchat.db')
}

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
    await runInTransaction(db, async (tx) => {
        // PRAGMAs for performance and integrity
        tx.executeSql('PRAGMA journal_mode = WAL;')
        tx.executeSql('PRAGMA foreign_keys = ON;')

        // users
        tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        email TEXT,
        displayName TEXT,
        profilePictureUrl TEXT,
        preferredLanguage TEXT NOT NULL,
        isOnline INTEGER DEFAULT 0,
        lastSeen INTEGER,
        createdAt INTEGER NOT NULL
      );
    `)

        // conversations
        tx.executeSql(`
      CREATE TABLE IF NOT EXISTS conversations (
        conversationId TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        participants TEXT NOT NULL,
        participantDetails TEXT,
        lastMessageText TEXT,
        lastMessageSenderId TEXT,
        lastMessageTimestamp INTEGER,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `)
        tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updatedAt DESC);`)

        // messages
        tx.executeSql(`
      CREATE TABLE IF NOT EXISTS messages (
        messageId TEXT PRIMARY KEY,
        conversationId TEXT NOT NULL,
        senderId TEXT NOT NULL,
        senderName TEXT,
        originalText TEXT,
        originalLanguage TEXT,
        translations TEXT,
        timestamp INTEGER NOT NULL,
        status TEXT NOT NULL,
        readBy TEXT,
        type TEXT NOT NULL,
        imageUrl TEXT,
        hasCulturalContext INTEGER DEFAULT 0,
        culturalHint TEXT,
        formalityLevel TEXT,
        formalityWarning TEXT,
        containsSlang INTEGER DEFAULT 0,
        slangExplanations TEXT,
        FOREIGN KEY (conversationId) REFERENCES conversations(conversationId)
      );
    `)
        tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_messages_conversation_timestamp ON messages(conversationId, timestamp ASC);`)
        tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId, timestamp DESC);`)

        // messageQueue
        tx.executeSql(`
      CREATE TABLE IF NOT EXISTS messageQueue (
        queueId TEXT PRIMARY KEY,
        messageId TEXT NOT NULL,
        conversationId TEXT NOT NULL,
        payload TEXT NOT NULL,
        retryCount INTEGER DEFAULT 0,
        createdAt INTEGER NOT NULL,
        lastAttemptAt INTEGER
      );
    `)
        tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_queue_created ON messageQueue(createdAt ASC);`)
    })
}

export async function runInTransaction(
    db: SQLiteDatabase,
    fn: (tx: SQLite.SQLTransaction) => void | Promise<void>
): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        db.transaction(
            async (tx) => {
                try {
                    await fn(tx)
                    resolve()
                } catch (err) {
                    reject(err)
                }
            },
            (err) => reject(err)
        )
    })
}


