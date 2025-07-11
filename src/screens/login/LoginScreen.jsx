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
        <SafeAreaView className="flex-1 bg-neutral-200">
            <View className="flex-1 justify-center items-center p-6">
                {/* Header */}
                <View className="w-full items-center mb-10">
                    <Text className="text-4xl font-bold text-primary-dark">Đăng Nhập</Text>
                    <Text className="text-neutral-600 mt-2">Chào mừng bạn đã quay trở lại!</Text>
                </View>

                {/* Form Container */}
                <View className="w-full bg-neutral-100 p-6 rounded-2xl shadow-md">
                    {/* Email Input */}
                    <View className="mb-4">
                        <Text className="text-neutral-700 mb-2 font-semibold">Địa chỉ Email</Text>
                        <TextInput
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="bg-neutral-200 p-4 rounded-xl border border-neutral-300 focus:border-primary"
                        />
                        {emailError ? <Text className="text-danger mt-1 italic">{emailError}</Text> : null}
                    </View>

                    {/* Password Input */}
                    <View className="mb-4">
                        <Text className="text-neutral-700 mb-2 font-semibold">Mật khẩu</Text>
                        <View className="relative">
                            <TextInput
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                className="bg-neutral-200 p-4 rounded-xl border border-neutral-300 focus:border-primary"
                            />
                            <TouchableOpacity
                                className="absolute right-4 top-4"
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#A9B4C2" />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text className="text-danger mt-1 italic">{passwordError}</Text> : null}
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity className='mb-6 flex-row justify-end' onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text className="text-primary font-semibold">Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-primary py-4 rounded-xl shadow-sm"
                        disabled={isLoading}
                    >
                        <Text className="text-neutral-100 text-center font-bold text-lg">
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Link */}
                <View className="flex-row justify-center mt-8">
                    <Text className="text-neutral-600">Chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text className="text-primary font-bold">Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
