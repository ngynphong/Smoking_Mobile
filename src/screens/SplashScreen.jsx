import { View, Text, ActivityIndicator, Image } from 'react-native';

export default function SplashScreen() {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            {/* Logo hoặc icon */}
            <Image
                source={require('../../assets/logo.jpg')} // bạn có thể đổi sang hình phù hợp
                style={{ width: 100, height: 100, marginBottom: 20 }}
                resizeMode="contain"
                className='rounded-full'
            />

            <Text className="text-4xl font-bold text-blue-700 mb-4">Exhela</Text>

            {/* Tên ứng dụng */}
            <Text className="text-2xl font-bold text-green-700 mb-4">Quit Smoking App</Text>

            {/* Loading indicator */}
            <ActivityIndicator size="large" color="#22c55e" />
        </View>
    );
}
