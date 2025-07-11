import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const services = [
    { icon: "file-document", label: "Tạo kế hoạch" },
    { icon: "account-heart", label: "Tư vấn online" },
    { icon: "emoticon-happy", label: "Truyền cảm hứng" },
];

export default function ServiceHighlights() {
    const navigation = useNavigation();
    return (
        <View>
            {/* Section Title */}
            <View className="flex-row items-center mb-4">
                <MaterialCommunityIcons name="star-four-points-outline" size={24} className="text-accent" />
                <Text className="text-xl font-bold ml-2 text-primary-dark">Dịch Vụ Hỗ Trợ</Text>
            </View>

            {/* Services Grid */}
            <View className="flex-row justify-around">
                {services.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className="items-center justify-center p-4 space-y-2 bg-secondary rounded-2xl w-28 h-28"
                        onPress={() => item.label === "Tạo kế hoạch" ? navigation.navigate('CreateQuitPlanRequest') : navigation.navigate('MyMeetings')}
                    >
                        <MaterialCommunityIcons name={item.icon} size={40} className="text-primary" />
                        <Text className="text-center text-neutral-700 font-semibold text-sm">
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
