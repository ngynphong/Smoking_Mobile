import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUser, removeToken, removeUser } from '../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setUser(userData);
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // Show loading spinner while fetching user data
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Show error state if no user data
  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Could not load user data</Text>
      </SafeAreaView>
    );
  }


  const menuItems = [
    { icon: 'person-outline', title: 'Thông tin cá nhân' },
    { icon: 'settings-outline', title: 'Cài đặt' },
    { icon: 'shield-outline', title: 'Quyền riêng tư' },
    { icon: 'help-circle-outline', title: 'Trợ giúp & Hỗ trợ' },
    {
      icon: 'log-out-outline', title: 'Đăng xuất',
      onPress: async () => {
        try {
          await removeToken();
          await removeUser(); 
          logout(); 
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại sau.');
        }
      }
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Profile */}
      <View className="bg-white p-4 mb-4">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`
            }}
            className="w-20 h-20 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-xl font-bold">{user.name}</Text>
            <Text className="text-gray-600">{user.email}</Text>
            <Text className="text-gray-500 capitalize">{user.role}</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View className="bg-white">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className={`flex-row items-center p-4 border-b border-gray-200 ${index === menuItems.length - 1 ? 'border-b-0' : ''
              }`}
          >
            <Icon name={item.icon} size={24} color="#4B5563" />
            <Text className="ml-4 text-base text-gray-700">{item.title}</Text>
            <Icon
              name="chevron-forward-outline"
              size={20}
              color="#9CA3AF"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-center text-gray-500 mt-4">
        Version 1.0.0
      </Text>
    </SafeAreaView>
  );
}