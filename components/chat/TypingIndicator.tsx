import React from 'react'
import { View } from 'react-native'

export const TypingIndicator: React.FC = () => {
    return (
        <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingVertical: 8 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#94A3B8' }} />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#94A3B8' }} />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#94A3B8' }} />
        </View>
    )
}

export default TypingIndicator


