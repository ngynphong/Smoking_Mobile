import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyResetOtp } from '../../api/authApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function VerifyOtpScreen() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã OTP gồm 6 chữ số.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await verifyResetOtp({ email, otp });
            if (response.status === 200) {
                Alert.alert('Thành công', 'Xác thực OTP thành công.');
                navigation.navigate('ResetPassword', { email, resetToken: response.data.resetToken });
            } else {
                Alert.alert('Lỗi', response.data.message || 'Đã có lỗi xảy ra.');
            }
        } catch (error) {
            Alert.alert('Lỗi hệ thống', error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-14 left-4 z-10">
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-3xl font-bold mb-4 text-center text-[#6c63ff]">Xác thực OTP</Text>
                <Text className="text-center text-gray-600 mb-8">Một mã OTP đã được gửi đến {email}. Vui lòng nhập mã vào bên dưới.</Text>

                <View className="w-full">
                    <Text className="text-gray-700 mb-2 font-semibold">Mã OTP</Text>
                    <TextInput
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50 w-full text-center text-lg tracking-[10px]"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleVerifyOtp}
                    className="bg-[#6c63ff] py-3 rounded-lg mt-8 w-full"
                    disabled={isLoading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
