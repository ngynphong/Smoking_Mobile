import { TouchableOpacity, Text } from 'react-native';

export default function FloatingActionButton() {
    return (
        <TouchableOpacity className="absolute bottom-6 right-6 bg-green-600 rounded-full p-4 shadow-lg">
            <Text className="text-white font-bold">+ Cập nhật</Text>
        </TouchableOpacity>
    );
}
