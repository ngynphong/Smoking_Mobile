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
    <SafeAreaView className="p-4 h-full bg-blue-300">
      <View className=" my-auto w-[85%] mx-auto bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-4xl text-center font-bold mb-4">Đăng Ký</Text>
        <Text className="mb-4 text-center">Vui lòng nhập thông tin đăng ký của bạn</Text>
        <Text className="mb-2 font-semibold">Name</Text>
        <TextInput
          placeholder="Họ và tên"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          className="border p-2 mb-2 rounded-lg"
        />
        {errors.name ? <Text className="text-red-500 mb-2 text-sm italic">{errors.name}</Text> : null}
        <Text className="mb-2 font-semibold">Email</Text>
        <TextInput
          placeholder="Địa chỉ email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          className="border p-2 mb-2 rounded-lg"
        />
        {errors.email ? <Text className="text-red-500 mb-2 text-sm italic">{errors.email}</Text> : null}
        <View className="relative">
          <Text className="mb-2 font-semibold">Mật khẩu</Text>
          <TextInput
            placeholder='Mật Khẩu'
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            className="border p-2 mb-2 rounded-lg"
          />
          <TouchableOpacity className="absolute right-2 top-10 text-gray-500" onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <Ionicons name="eye-off" size={18} color="gray" /> : <Ionicons name="eye" size={18} color="gray" />}
          </TouchableOpacity>
          {errors.password ? <Text className="text-red-500 mb-2 text-sm italic">{errors.password}</Text> : null}
        </View>
        <View className="relative">
          <Text className="mb-2 font-semibold">Xác nhận Mật khẩu</Text>
          <TextInput
            placeholder='Mật Khẩu'
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            className="border p-2 mb-2 rounded-lg"
          />
          <TouchableOpacity className="absolute right-2 top-10 text-gray-500" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <Ionicons name="eye-off" size={18} color="gray" /> : <Ionicons name="eye" size={18} color="gray" />}
          </TouchableOpacity>
          {errors.confirmPassword ? <Text className="text-red-500 mb-2 text-sm italic">{errors.confirmPassword}</Text> : null}
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-blue-500 rounded-lg py-2 mt-4"
        >
          <Text className="text-white text-center">{loading ? 'Đang xử lý...' : 'Đăng ký'}</Text>
        </TouchableOpacity>

        <Text className="text-blue-500 mt-4 text-center" onPress={() => navigation.navigate('Login')}>Đã có tài khoản? Đăng nhập ngay</Text>
      </View>
    </SafeAreaView>
  );
}
