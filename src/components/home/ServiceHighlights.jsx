import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const services = [
    { icon: "file-document", label: "Tạo kế hoạch" },
    { icon: "account-heart", label: "Tư vấn online" },
    { icon: "emoticon-happy", label: "Truyền cảm hứng" },
];

export default function ServiceHighlights() {
    return (
        <View className="">
            {/* Section Title */}
            <View className="flex-row items-center mb-5">
                <MaterialCommunityIcons name="star-four-points" size={24} color="#FFD700" />
                <Text className="text-2xl font-bold ml-2 text-gray-800">Dịch vụ hỗ trợ</Text>
            </View>

            {/* Services Grid */}
            <View className="flex-row justify-between flex-wrap">
                {services.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className="w-[30%] items-center justify-center p-4 mb-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100 active:bg-blue-100"
                        style={{ aspectRatio: 1 }} // Ensures cards are square
                    >
                        <MaterialCommunityIcons name={item.icon} size={40} color="#4A90E2" />
                        <Text className="text-center mt-2 text-gray-700 font-medium text-sm">
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}