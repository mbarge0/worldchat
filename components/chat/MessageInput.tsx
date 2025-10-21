import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
    onSend: (text: string) => void
    onTyping?: () => void
    onPickImage?: () => void
}

export const MessageInput: React.FC<Props> = ({ onSend, onTyping, onPickImage }) => {
    const [text, setText] = useState('')
    const canSend = text.trim().length > 0
    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={onPickImage} style={styles.plus}>
                <Text style={{ color: '#111827', fontSize: 18 }}>＋</Text>
            </TouchableOpacity>
            <View style={styles.inputWrap}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={text}
                    onChangeText={(t) => {
                        setText(t)
                        onTyping && onTyping()
                    }}
                />
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (!canSend) return
                    onSend(text.trim())
                    setText('')
                }}
                disabled={!canSend}
                style={[styles.send, !canSend && { opacity: 0.6 }]}
            >
                <Text style={styles.sendGlyph}>➤</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 8,
        backgroundColor: '#FFFFFF'
    },
    inputWrap: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 120
    },
    send: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    plus: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendGlyph: { color: '#FFFFFF', fontSize: 16 }
})

export default MessageInput


