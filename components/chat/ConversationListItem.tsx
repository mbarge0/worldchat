import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { ConversationMeta } from '../../services/messaging/conversationService'

type Props = {
    item: ConversationMeta
}

export const ConversationListItem: React.FC<Props> = ({ item }) => {
    return (
        <View style={styles.row}>
            <View style={styles.avatar}>
                <View style={styles.presence} />
            </View>
            <View style={styles.body}>
                <View style={styles.headerLine}>
                    <Text style={styles.name}>Conversation</Text>
                    <Text style={styles.time}>{formatTime(item.updatedAt)}</Text>
                </View>
                <Text numberOfLines={1} style={styles.preview}>
                    {item.lastMessage?.text ?? 'Start a conversation'}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    presence: {
        position: 'absolute',
        right: -2,
        bottom: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    body: { flex: 1 },
    headerLine: { flexDirection: 'row', justifyContent: 'space-between' },
    name: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
    time: { fontSize: 12, color: '#94A3B8' },
    preview: { fontSize: 14, color: '#475569' }
})

export default ConversationListItem

function formatTime(ts: number | undefined): string {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}


