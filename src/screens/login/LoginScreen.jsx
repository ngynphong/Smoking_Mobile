import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../api/authApi';
import { saveToken, saveUser } from '../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';


export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        <SafeAreaView className="p-4 h-full bg-blue-300">
            <View className=" my-auto w-[85%] mx-auto bg-white p-6 rounded-lg shadow-lg">
                <Text className="text-4xl text-center font-bold mb-4">Đăng nhập</Text>
                <Text className="mb-4 text-center">Vui lòng nhập thông tin đăng nhập của bạn</Text>
                <Text className="mb-2 font-semibold">Email</Text>
                <TextInput
                    placeholder="Địa chỉ email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="border p-2 mb-2 rounded-lg"
                />
                {emailError ? <Text className="text-red-500 mb-2 text-sm italic">{emailError}</Text> : null}
                <Text className="mb-2 font-semibold">Mật khẩu</Text>
                <TextInput
                    placeholder='Mật Khẩu'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="border p-2 mb-2 rounded-lg"
                />
                {passwordError ? <Text className="text-red-500 mb-2 text-sm italic">{passwordError}</Text> : null}
                <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 rounded-lg py-2" disabled={isLoading}>
                    <Text className="text-white text-center">{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}</Text>
                </TouchableOpacity>

                <Text className="text-blue-500 mt-4 text-center" onPress={() => navigation.navigate('Register')}>Chưa có tài khoản? Đăng ký ngay</Text>
            </View>
        </SafeAreaView>
    );
}
