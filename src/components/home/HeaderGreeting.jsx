import { View, Text, Image } from 'react-native'

export default function HeaderGreeting({ name, avatar_url }) {
    return (
        <View className=" bg-blue-300 p-4">
            <View className='flex-row items-center justify-center mt-6'>
                <Text className="text-xl font-bold mx-4"> {name}</Text>
                <Image source={{ uri: avatar_url }} className="text-xl font-bold bg-blue-300 w-12 h-12 rounded-full" />
            </View>
        </View>
    )
}