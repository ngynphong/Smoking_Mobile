import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUser, removeToken, removeUser } from '../../utils/authStorage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { getProfile } from '../../api/userApi';
import { getPostsByUserId } from '../../api/postApi';
import { getBadgeUserId } from '../../api/badgeApi';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postByUser, setPostByUser] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserInfo = async () => {
        try {
          setIsLoading(true);
          const user = await getUser();
          const userProfile = await getProfile(user.id);
          const post = await getPostsByUserId(user.id);
          const badge = await getBadgeUserId(user.id);
          if (userProfile.data.user) {
            setUserData(userProfile.data.user);
            setPostByUser(post.data.posts);
            setBadgeCount(badge.data);
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
    }, []));

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
        <View className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="mt-4 text-gray-700 font-medium">Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gradient-to-br from-red-400 to-pink-500">
        <View className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
          <Icon name="warning-outline" size={48} color="#EF4444" />
          <Text className="mt-4 text-gray-700 font-medium">Không thể tải dữ liệu người dùng</Text>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Thông tin cá nhân',
      subtitle: 'Xem và chỉnh sửa thông tin',
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      onPress: () => navigation.navigate('ProfileDetail')
    },
    {
      icon: 'diamond-outline',
      title: 'Huy hiệu',
      subtitle: 'Thành tích và phần thưởng',
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      onPress: () => navigation.navigate('Badge')
    },
    {
      icon: 'book-outline',
      title: 'Bài viết của tôi',
      subtitle: 'Quản lý nội dung đã đăng',
      color: '#10B981',
      bgColor: '#ECFDF5',
      onPress: () => navigation.navigate('MyPosts')
    },
    {
      icon: 'document-text-outline',
      title: 'Kế hoạch của tôi',
      subtitle: 'Quản lý kế hoạch',
      color: '#06B6D4',
      bgColor: '#ECFEFF',
      onPress: () => navigation.navigate('MyQuitPlan')
    },
    {
      icon: 'logo-no-smoking',
      title: 'Tình trạng hút thuốc',
      subtitle: 'Ghi nhận tình trạng hút thuốc',
      color: '#6B7280',
      bgColor: '#F9FAFB',
      onPress: () => navigation.navigate('SmokingStatus')
    },
    {
      icon: 'send-outline',
      title: 'Yêu cầu tạo kế hoạch',
      subtitle: 'Gửi yêu cầu cho Coach tạo kế hoạch',
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      onPress: () => navigation.navigate('QuitPlanRequest')
    },
    {
      icon: 'settings-outline',
      title: 'Cài đặt',
      subtitle: 'Tùy chỉnh ứng dụng',
      color: '#6B7280',
      bgColor: '#F9FAFB'
    },

    {
      icon: 'help-circle-outline',
      title: 'Trợ giúp & Hỗ trợ',
      subtitle: 'Liên hệ và câu hỏi thường gặp',
      color: '#06B6D4',
      bgColor: '#ECFEFF'
    },
    {
      icon: 'log-out-outline',
      title: 'Đăng xuất',
      subtitle: 'Thoát khỏi tài khoản',
      color: '#EF4444',
      bgColor: '#FEF2F2',
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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '#EF4444';
      case 'moderator': return '#F59E0B';
      case 'premium': return '#8B5CF6';
      default: return '#10B981';
    }
  };

  const getRoleBadge = (subscriptionType) => {
    switch (subscriptionType?.toLowerCase()) {
      case 'premium': return '👑';
      case 'plus': return '💎';
      default: return '👤';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pt-8 pb-12 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <View className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />

          {/* Profile Info */}
          <View className="flex-row items-center mt-4">
            <View className="relative">
              <Image
                source={{
                  uri: userData.avatar_url || `https://ui-avatars.com/api/?name=${userData.name}&background=random&size=200`
                }}
                className="w-24 h-24 rounded-2xl"
              />
              {/* Online Status Indicator */}
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white" />
            </View>

            <View className="ml-5 flex-1">
              <Text className="text-2xl font-bold text-white mb-1">{userData.name}</Text>
              <Text className="text-white/80 text-base mb-2">{userData.email}</Text>
              <View className="flex-row items-center">
                <View
                  className="px-3 py-1 rounded-full flex-row items-center"
                  style={{ backgroundColor: getRoleColor(userData.role) + '20' }}
                >
                  <Text className="text-xs mr-1">{getRoleBadge(userData.membership.subscriptionType)}</Text>
                  <Text
                    className="text-xs font-semibold capitalize"
                    style={{ color: getRoleColor(userData.role) }}
                  >
                    {userData.role}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View className="px-6 -mt-8 mb-6">
          <View className="bg-white rounded-2xl shadow-lg p-4">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">{postByUser.length}</Text>
                <Text className="text-gray-500 text-sm">Bài viết</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">{postByUser.map((post) => post.reaction_count).reduce((a, b) => a + b, 0)}</Text>
                <Text className="text-gray-500 text-sm">Lượt thích</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">{badgeCount.map((badge) => badge.earned === true).reduce((a, b) => a + b, 0)}</Text>
                <Text className="text-gray-500 text-sm">Huy hiệu</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 space-y-3">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="bg-white rounded-2xl active:scale-95 mt-2"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center p-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Icon name={item.icon} size={24} color={item.color} />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {item.subtitle}
                  </Text>
                </View>

                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                  <Icon name="chevron-forward" size={16} color="#9CA3AF" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View className="px-6 py-8 items-center">
          <View className="flex-row items-center mb-2">
            <Icon name="sparkles" size={16} color="#8B5CF6" />
            <Text className="ml-2 text-purple-600 font-medium">Exhela</Text>
          </View>
          <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}