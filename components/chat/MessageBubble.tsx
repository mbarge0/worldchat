import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import type { MessageRecord } from '../../services/storage/sqliteService'

type Props = {
    message: MessageRecord
    isOwn: boolean
}

export const MessageBubble: React.FC<Props> = ({ message, isOwn }) => {
    const bg = isOwn ? styles.sent : styles.received
    const text = isOwn ? styles.sentText : styles.recvText
    return (
        <View style={[styles.row, isOwn ? styles.rowRight : styles.rowLeft]}>
            <View style={[styles.bubble, bg]}>
                {message.type === 'image' && !!message.imageUrl ? (
                    <Image source={{ uri: message.imageUrl }} style={styles.image} />
                ) : (
                    !!message.originalText && (
                        <Text style={[styles.body, text]}>{message.originalText}</Text>
                    )
                )}
                {/* status for sent messages */}
                {isOwn && (
                    <Text style={[styles.status, { color: statusColor(message.status) }]}>
                        {statusToGlyph(message.status)}
                    </Text>
                )}
            </View>
        </View>
    )
}

function statusToGlyph(status: MessageRecord['status']): string {
    switch (status) {
        case 'sending':
            return '✓'
        case 'sent':
            return '✓'
        case 'delivered':
            return '✓✓'
        case 'read':
            return '✓✓'
        default:
            return ''
    }
}

function statusColor(status: MessageRecord['status']): string {
    switch (status) {
        case 'sending':
            return '#9CA3AF' // muted gray
        case 'sent':
            return '#9CA3AF'
        case 'delivered':
            return '#6B7280' // darker gray
        case 'read':
            return '#60A5FA' // blue
        default:
            return '#9CA3AF'
    }
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 16,
        marginVertical: 4
    },
    rowRight: { alignItems: 'flex-end' },
    rowLeft: { alignItems: 'flex-start' },
    bubble: {
        maxWidth: '78%',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    sent: { backgroundColor: '#2563EB' },
    received: { backgroundColor: '#F3F4F6' },
    sentText: { color: '#FFFFFF' },
    recvText: { color: '#111827' },
    body: { fontSize: 16, lineHeight: 22 },
    image: { width: 200, height: 200, borderRadius: 12, backgroundColor: '#E5E7EB' },
    status: { marginTop: 4, alignSelf: 'flex-end', fontSize: 10 }
})

export default MessageBubble


