import { View, Text, ImageBackground } from 'react-native';

export default function HeroBanner() {
    return (
        <ImageBackground
            source={require('../../../assets/smoking_background.jpg')}
            className="h-44 rounded-2xl overflow-hidden justify-center"
        >
            <View className=" p-4 rounded-2xl">
                <Text className="text-white text-2xl font-bold text-center">Cai thuốc cùng EXHELA</Text>
                <Text className="text-white mt-1 text-center">Theo dõi tiến trình, nhận tư vấn, nhận động lực mỗi ngày!</Text>
            </View>
        </ImageBackground>
    );
}
