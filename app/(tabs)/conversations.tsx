import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, Text, TextInput, View } from 'react-native'
import ConversationListItem from '../../components/chat/ConversationListItem'
import { ConversationMeta, subscribeToConversations } from '../../services/messaging/conversationService'

export default function ConversationsScreen() {
    const [items, setItems] = useState<ConversationMeta[]>([])
    const [query, setQuery] = useState('')
    const router = useRouter()
    const userId = 'me' // TODO: auth context

    useEffect(() => {
        const unsub = subscribeToConversations(userId, setItems)
        return () => unsub()
    }, [userId])

    const filtered = items.filter((i) =>
        (i.lastMessage?.text || '').toLowerCase().includes(query.toLowerCase())
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: '#0F172A' }}>Messages</Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search messages or users"
                    placeholderTextColor="#9CA3AF"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
                />
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.conversationId}
                renderItem={({ item }) => (
                    <View onTouchEnd={() => router.push(`/conversation/${item.conversationId}`)}>
                        <ConversationListItem item={item} />
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginLeft: 68 }} />
                )}
            />
        </SafeAreaView>
    )
}


