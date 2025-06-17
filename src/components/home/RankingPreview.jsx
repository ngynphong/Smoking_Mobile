import { View, Text, TouchableOpacity } from 'react-native';

const mockUsers = [
    { name: "Hùng", day: 15 },
    { name: "Mai", day: 13 },
    { name: "Duy", day: 10 },
];

export default function RankingPreview() {
    return (
        <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">🏆 Bảng xếp hạng</Text>
            {mockUsers.map((user, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-200">
                    <Text>{index + 1}. {user.name}</Text>
                    <Text>{user.day} ngày</Text>
                </View>
            ))}
            <TouchableOpacity>
                <Text className="text-blue-500 text-right mt-1">Xem tất cả</Text>
            </TouchableOpacity>
        </View>
    );
}
