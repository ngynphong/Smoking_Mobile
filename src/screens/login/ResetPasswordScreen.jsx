import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetPassword } from '../../api/authApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { email, resetToken } = route.params;

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu không khớp.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await resetPassword({ email, newPassword: password, resetToken });
            if (response.status === 200) {
                Alert.alert('Thành công', 'Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập.');
                navigation.navigate('Login');
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
                <Text className="text-3xl font-bold mb-4 text-center text-[#6c63ff]">Đặt lại mật khẩu</Text>
                <Text className="text-center text-gray-600 mb-8">Nhập mật khẩu mới của bạn.</Text>

                <View className="w-full mb-4 relative">
                    <Text className="text-gray-700 mb-2 font-semibold">Mật khẩu mới</Text>
                    <TextInput
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50 w-full"
                    />
                    <TouchableOpacity
                        className="absolute right-3 top-11"
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ?
                            <Ionicons name="eye-off" size={16} color="gray" /> :
                            <Ionicons name="eye" size={16} color="gray" />
                        }
                    </TouchableOpacity>
                </View>

                <View className="w-full relative">
                    <Text className="text-gray-700 mb-2 font-semibold">Xác nhận mật khẩu mới</Text>
                    <TextInput
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50 w-full"
                    />
                    <TouchableOpacity
                        className="absolute right-3 top-11"
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ?
                            <Ionicons name="eye-off" size={16} color="gray" /> :
                            <Ionicons name="eye" size={16} color="gray" />
                        }
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleResetPassword}
                    className="bg-[#6c63ff] py-3 rounded-lg mt-8 w-full"
                    disabled={isLoading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
