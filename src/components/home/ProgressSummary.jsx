import { View, Text } from 'react-native';

export default function ProgressSummary({ days, moneySaved, healthImproved }) {
    return (
        <View className="bg-green-100 rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-green-800">🌿 Tiến trình cai thuốc</Text>
            <Text className="mt-1">Bạn đã không hút: <Text className="font-bold">{days} ngày</Text></Text>
            <Text>Tiết kiệm: <Text className="font-bold">{moneySaved.toLocaleString()}đ</Text></Text>
            <Text>Sức khỏe: <Text className="font-bold">+{healthImproved}%</Text></Text>
        </View>
    );
}
