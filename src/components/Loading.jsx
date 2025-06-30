import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

export default function Loading() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
            <View className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text className="mt-4 text-gray-700 font-medium">Đang tải...</Text>
            </View>
        </SafeAreaView>
    );

}
