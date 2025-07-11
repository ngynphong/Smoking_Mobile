import { ScrollView, View, Text, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import ProgressSummary from '../../components/home/ProgressSummary';
import MotivationalQuote from '../../components/home/MotivationalQuote';
import RankingPreview from '../../components/home/RankingPreview';
import BlogPreviewList from '../../components/home/BlogPreviewList';
import HeroBanner from '../../components/home/HeroBanner';
import ServiceHighlights from '../../components/home/ServiceHighlights';
import React, { useState } from 'react';
import { getProfile } from '../../api/userApi';
import { getUser } from '../../utils/authStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SubscriptionPackages from '../../components/home/SubscriptionPackages';
import StreakNoSmoke from '../../components/home/StreakNoSmoke';
import FeedbackSlider from '../../components/home/FeedbackSlider';
import FloatingActionButton from '../../components/home/FloatingActionButton';

const quotes = [
  "Nếu bạn muốn thành công, hãy làm những việc bạn không muốn làm.",
  "Mỗi ngày không hút là một chiến thắng.",
  "Mỗi điếu thuốc bạn từ chối hôm nay là một ngày sống khỏe mạnh hơn cho tương lai.",
  "Cai thuốc không dễ, nhưng sống với hậu quả của thuốc lá còn khó hơn.",
  "Không gì mạnh mẽ hơn ý chí muốn sống khỏe vì bản thân và người mình yêu.",
  "Hơi thở không mùi khói – một món quà cho tim, phổi và cả chính bạn.",
  "Bạn xứng đáng với một cuộc sống không bị kiểm soát bởi cơn nghiện.",
  "Mỗi giây bạn không hút thuốc là một bước tiến tới tự do.",
  "Cai thuốc không phải là từ bỏ, mà là bắt đầu một cuộc sống tốt đẹp hơn."
]
export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          const user = await getUser();
          const userData = await getProfile(user.id);
          setUser(userData.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }, [])
  );

  if (!user) {
    return null; // or a loading spinner
  }

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
  return (
    <LinearGradient
      colors={["#f5e9e2", "#e3eafc"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-10 pb-2">
          <View>
            <Text className="text-xl font-bold text-gray-900">Nỗ lực hôm nay nhé {user.name}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3" onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: user.avatar_url }}
                style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#fff' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card: HeroBanner */}
        <View className="mx-4 mb-4 bg-white rounded-2xl shadow-lg overflow-hidden">
          <HeroBanner />
        </View>
        {/* Card: StreakNoSmoke */}
        <View className="mx-4 mt-2 mb-4 bg-white rounded-2xl shadow-lg p-5">
          <StreakNoSmoke />
        </View>
        {/* Card: ProgressSummary */}
        <View className="mx-4 mt-2 mb-4 bg-green-100 rounded-2xl shadow-lg p-5">
          <ProgressSummary />
        </View>

        {/* Card: MotivationalQuote */}
        <View className="mx-4 mb-4 bg-blue-50 rounded-2xl shadow p-5">
          <MotivationalQuote quote={quotes[Math.floor(Math.random() * quotes.length)]} />
        </View>

        {/* Card: ServiceHighlights */}
        <View className="mx-4 mb-4 bg-white rounded-2xl shadow p-5">
          <ServiceHighlights />
        </View>

        {/* Card: RankingPreview */}
        <View className="mx-4 mb-4 bg-white rounded-2xl shadow p-5">
          <RankingPreview />
        </View>

        {/* Card: BlogPreviewList */}
        <View className="mx-4 mb-4 bg-white rounded-2xl shadow p-5">
          <BlogPreviewList />
        </View>

        <SubscriptionPackages />

        <FeedbackSlider />

      </ScrollView>
      <FloatingActionButton />
    </LinearGradient>
  );
}
