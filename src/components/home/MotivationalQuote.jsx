import { View, Text } from 'react-native';

export default function MotivationalQuote({ quote }) {
    return (
        <View className="bg-blue-50 rounded-xl p-3">
            <Text className="italic text-blue-700 text-center">"{quote}"</Text>
        </View>
    );
}