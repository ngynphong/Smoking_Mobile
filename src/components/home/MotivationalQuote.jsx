import { View, Text } from 'react-native';

export default function MotivationalQuote({ quote }) {
    return (
        <View className="items-center">
            <Text className="text-5xl text-primary-light opacity-50 -mb-2">“</Text>
            <Text className="italic text-base text-primary-dark text-center font-medium">
                {quote}
            </Text>
        </View>
    );
}
