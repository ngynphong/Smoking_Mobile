import { View, Text, ImageBackground } from 'react-native';

export default function HeroBanner() {
    return (
        <ImageBackground
            source={{ uri: 'https://cdn.pixabay.com/photo/2017/08/01/08/29/background-2566495_1280.jpg' }}
            className="h-44 rounded-2xl overflow-hidden justify-center mb-5"
        >
            <View className="bg-black/40 p-4 rounded-2xl">
                <Text className="text-white text-2xl font-bold">💪 Cai thuốc cùng EXHELA</Text>
                <Text className="text-white mt-1">Theo dõi tiến trình, nhận tư vấn, nhận động lực mỗi ngày!</Text>
            </View>
        </ImageBackground>
    );
}
