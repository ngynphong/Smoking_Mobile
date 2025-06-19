import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { register } from '../../api/authApi';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await register(formData);

      if (response.status === 200) {
        Alert.alert('Đăng ký thành công xác nhận email của bạn');
        navigation.navigate('VerifyEmail', { email: formData.email });
      } else {
        Alert.alert('Đăng ký thất bại', response.data.message || 'Sai thông tin');
      }
    } catch (error) {
      Alert.alert('Lỗi hệ thống', error.message);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top curved background */}
      <View className="h-[30%] bg-[#6c63ff] rounded-b-[50px] relative" />

      <View className="w-[85%] absolute top-40 mx-auto right-9">
        <Text className="text-4xl text-center font-bold mb-2 text-white">Đăng Ký</Text>
        <Text className="text-white text-center mb-8">Vui lòng nhập thông tin đăng ký của bạn</Text>

        {/* Name Input */}
        <Text className="text-gray-700 my-2 font-semibold">Họ và tên</Text>
        <View className="mb-4">
          <TextInput
            placeholder="Nhập họ và tên của bạn"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50"
          />
          {errors.name ? <Text className="text-red-500 text-sm mt-1 italic">{errors.name}</Text> : null}
        </View>

        {/* Email Input */}
        <Text className="text-gray-700 my-2 font-semibold">Địa chỉ Email</Text>
        <View className="mb-4">
          <TextInput
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 p-3 rounded-lg bg-gray-50"
          />
          {errors.email ? <Text className="text-red-500 text-sm mt-1 italic">{errors.email}</Text> : null}
        </View>

        {/* Password Input */}
        <Text className="text-gray-700 mb-2 font-semibold">Mật khẩu</Text>
        <View className="mb-4 relative">
          <TextInput
            placeholder="Nhập mật khẩu của bạn"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
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
          {errors.password ? <Text className="text-red-500 text-sm mt-1 italic">{errors.password}</Text> : null}
        </View>

        {/* Confirm Password Input */}
        <Text className="text-gray-700 mb-2 font-semibold">Xác nhận mật khẩu</Text>
        <View className="mb-4 relative">
          <TextInput
            placeholder="Nhập lại mật khẩu của bạn"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50"
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ?
              <Ionicons name="eye-off" size={24} color="gray" /> :
              <Ionicons name="eye" size={24} color="gray" />
            }
          </TouchableOpacity>
          {errors.confirmPassword ? <Text className="text-red-500 text-sm mt-1 italic">{errors.confirmPassword}</Text> : null}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-[#6c63ff] py-3 rounded-lg mt-4"
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-[#6c63ff] font-bold">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
