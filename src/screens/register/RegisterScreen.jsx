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
    <SafeAreaView className="flex-1 bg-neutral-200">
      <View className="flex-1 justify-center items-center p-6">
        {/* Header */}
        <View className="w-full items-center mb-8">
          <Text className="text-4xl font-bold text-primary-dark">Tạo tài khoản</Text>
          <Text className="text-neutral-600 mt-2">Bắt đầu hành trình của bạn ngay hôm nay!</Text>
        </View>

        {/* Form Container */}
        <View className="w-full bg-neutral-100 p-6 rounded-2xl shadow-md">
          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-neutral-700 mb-2 font-semibold">Họ và tên</Text>
            <TextInput
              placeholder="Nhập họ và tên của bạn"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="bg-neutral-200 p-4 rounded-xl border border-neutral-300 focus:border-primary"
            />
            {errors.name ? <Text className="text-danger mt-1 italic">{errors.name}</Text> : null}
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-neutral-700 mb-2 font-semibold">Địa chỉ Email</Text>
            <TextInput
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-neutral-200 p-4 rounded-xl border border-neutral-300 focus:border-primary"
            />
            {errors.email ? <Text className="text-danger mt-1 italic">{errors.email}</Text> : null}
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <Text className="text-neutral-700 mb-2 font-semibold">Mật khẩu</Text>
            <View className="relative">
              <TextInput
                placeholder="Nhập mật khẩu của bạn"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
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
            {errors.password ? <Text className="text-danger mt-1 italic">{errors.password}</Text> : null}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-neutral-700 mb-2 font-semibold">Xác nhận mật khẩu</Text>
            <View className="relative">
              <TextInput
                placeholder="Nhập lại mật khẩu của bạn"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
                className="bg-neutral-200 p-4 rounded-xl border border-neutral-300 focus:border-primary"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#A9B4C2" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text className="text-danger mt-1 italic">{errors.confirmPassword}</Text> : null}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-primary py-4 rounded-xl shadow-sm"
          >
            <Text className="text-neutral-100 text-center font-bold text-lg">
              {loading ? 'Đang xử lý...' : 'Đăng Ký'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-neutral-600">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-bold">Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
