import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestPasswordReset } from '../../api/authApi';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleRequestOtp = async () => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập email của bạn',
                position: 'top',
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await requestPasswordReset({ email });
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Mã OTP đã được gửi đến email của bạn.',
                    position: 'top',
                });
                navigation.navigate('VerifyOtp', { email });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: response.data.message || 'Đã có lỗi xảy ra.',
                    position: 'top',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi hệ thống',
                text2: error.response?.data?.message || error.message,
                position: 'top',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-200">
            <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-14 left-4 z-10">
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-3xl font-bold mb-4 text-center text-primary-dark">Quên mật khẩu</Text>
                <Text className="text-center text-gray-600 mb-8">Nhập email của bạn để nhận mã OTP và đặt lại mật khẩu.</Text>

                <View className="w-full">
                    <Text className="text-gray-700 mb-2 font-semibold">Địa chỉ Email</Text>
                    <TextInput
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 p-3 rounded-lg bg-neutral-200 w-full"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleRequestOtp}
                    className="bg-primary py-3 rounded-lg mt-8 w-full"
                    disabled={isLoading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
