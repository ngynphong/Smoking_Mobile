import { View, Text, Image } from 'react-native'

export default function HeaderGreeting({ name, avatar_url }) {
    return (
        <View className="flex-row justify-between items-center my-4">
            <Text className="text-xl font-bold">👋 Xin chào, {name}</Text>
            <Image source={{ uri: avatar_url }} className="text-xl font-bold" />
        </View>
    )
}