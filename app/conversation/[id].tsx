import { useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, LayoutAnimation, Platform, SafeAreaView, UIManager } from 'react-native'
import MessageBubble from '../../components/chat/MessageBubble'
import MessageInput from '../../components/chat/MessageInput'
import TypingIndicator from '../../components/chat/TypingIndicator'
import { pickImage } from '../../services/media/imageService'
import { MessageService } from '../../services/messaging/messageService'
import { setTyping, subscribeToTyping } from '../../services/messaging/typingService'
import { initializeDatabase, openDatabase } from '../../services/storage/schema'
import type { MessageRecord } from '../../services/storage/sqliteService'
function debounce(fn: () => void, wait: number) {
    let t: any
    return () => {
        clearTimeout(t)
        t = setTimeout(fn, wait)
    }
}

const svc = new MessageService()

export default function ConversationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const conversationId = String(id)
    const [messages, setMessages] = useState<MessageRecord[]>([])
    const currentUserId = 'me' // TODO: read from auth context

    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
        let unsubscribe = () => { }
            ; (async () => {
                // ensure DB schema is initialized
                await initializeDatabase(openDatabase())
                const local = await svc.loadMessages(conversationId, 50)
                setMessages(local.sort((a, b) => a.timestamp - b.timestamp))
                unsubscribe = svc.subscribe(conversationId, (records) => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    setMessages(records.sort((a, b) => a.timestamp - b.timestamp))
                })
            })()
        return () => unsubscribe()
    }, [conversationId])

    const [peerTyping, setPeerTyping] = useState(false)
    useEffect(() => {
        const unsub = subscribeToTyping(conversationId, setPeerTyping)
        return () => unsub()
    }, [conversationId])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.messageId}
                renderItem={({ item }) => (
                    <MessageBubble message={item} isOwn={item.senderId === currentUserId} />
                )}
                contentContainerStyle={{ paddingVertical: 8 }}
                onContentSizeChange={() => { }}
                onViewableItemsChanged={useRef(({ viewableItems }) => {
                    const last = [...viewableItems]
                        .map((v: any) => v.item as MessageRecord)
                        .filter((m) => m.senderId !== currentUserId)
                        .sort((a, b) => b.timestamp - a.timestamp)[0]
                    // fire-and-forget (ignore errors for now)
                    if (last) {
                        import('../../services/messaging/readReceiptService').then(({ markAsRead }) => {
                            markAsRead(conversationId, last.messageId, currentUserId).catch(() => { })
                        })
                    }
                }).current}
            />
            {peerTyping && <TypingIndicator />}
            <MessageInput
                onSend={async (text) => {
                    await svc.sendMessage(conversationId, text, currentUserId, 'Me')
                    await setTyping(conversationId, currentUserId, false)
                }}
                onTyping={useMemo(() => debounce(() => setTyping(conversationId, currentUserId, true), 300), [conversationId])}
                onPickImage={async () => {
                    const uri = await pickImage()
                    if (uri) {
                        await svc.sendImage(conversationId, uri, currentUserId, 'Me')
                    }
                }}
            />
        </SafeAreaView>
    )
}


