import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../api/authApi';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const { login: loginContext } = useContext(AuthContext);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await login({ email, password });
            console.log(response.data.user);
            if (response.status === 200) {
                loginContext(response.data.user.token, response.data.user);
            } else {
                Alert.alert('Đăng nhập thất bại', response.data.message || 'Sai thông tin');
            }
        } catch (error) {
            Alert.alert('Lỗi hệ thống', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            return false;
        }

        setEmailError('');
        return true;
    };
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = () => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            handleLogin(email, password);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Top curved background */}
            <View className="h-[30%] bg-[#6c63ff] rounded-b-[50px] relative" />

            <View className="w-[85%] absolute top-40 mx-auto right-9">
                <Text className="text-4xl text-center font-bold mb-2 text-white">Đăng Nhập</Text>
                <Text className="text-white text-center mb-8">Đăng nhập để tiếp tục</Text>

                {/* Email Input */}
                <Text className="text-gray-700 my-2 font-semibold">Địa chỉ Email</Text>
                <View className="mb-4">
                    <TextInput
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    />
                    {emailError ? <Text className="text-red-500 text-sm mt-1 italic">{emailError}</Text> : null}
                </View>

                {/* Password Input */}
                <Text className="text-gray-700 mb-2 font-semibold">Mật khẩu</Text>
                <View className="mb-2 relative">
                    <TextInput
                        placeholder="Nhập mật khẩu của bạn"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    />
                    <TouchableOpacity
                        className="absolute right-3 top-3"
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ?
                            <Ionicons name="eye-off" size={24} color="gray" /> :
                            <Ionicons name="eye" size={24} color="gray" />
                        }
                    </TouchableOpacity>
                    {passwordError ? <Text className="text-red-500 text-sm mt-1 italic">{passwordError}</Text> : null}
                </View>

                {/* Remember Me & Forgot Password */}

                <TouchableOpacity className='mb-4 flex-row justify-end'>
                    <Text className="text-gray-600">Quên mật khẩu?</Text>
                </TouchableOpacity>


                {/* Sign In Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-[#6c63ff] py-3 rounded-lg"
                    disabled={isLoading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-600">Chua có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="text-[#6c63ff] font-bold">Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
