import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const services = [
    { icon: "heart-pulse", label: "Theo dõi tiến trình" },
    { icon: "account-heart", label: "Tư vấn online" },
    { icon: "emoticon-happy", label: "Truyền cảm hứng" },
];

export default function ServiceHighlights() {
    return (
        <View className="my-4">
            <Text className="text-lg font-semibold mb-3 text-purple-800">🌟 Dịch vụ hỗ trợ</Text>
            <View className="flex-row justify-between">
                {services.map((item, index) => (
                    <View key={index} className="items-center flex-1 bg-slate-300 mx-2 rounded-xl py-2">
                        <MaterialCommunityIcons name={item.icon} size={32} color="#7e5bef" />
                        <Text className="text-center mt-1">{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}