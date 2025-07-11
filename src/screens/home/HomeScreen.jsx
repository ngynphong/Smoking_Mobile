import { ScrollView, View, Text, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import ProgressSummary from '../../components/home/ProgressSummary';
import MotivationalQuote from '../../components/home/MotivationalQuote';
import RankingPreview from '../../components/home/RankingPreview';
import BlogPreviewList from '../../components/home/BlogPreviewList';
import HeroBanner from '../../components/home/HeroBanner';
import ServiceHighlights from '../../components/home/ServiceHighlights';
import React, { useState, useContext, useRef } from 'react';
import { getProfile } from '../../api/userApi';
import { getUser } from '../../utils/authStorage';
import { TabBarContext } from '../../contexts/TabBarContext';
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
  const { setTabBarVisible } = useContext(TabBarContext);
  const lastScrollY = useRef(0);
  useFocusEffect(
    React.useCallback(() => {
      setTabBarVisible(true);
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
      setTabBarVisible(true);
    }, [])
  );

  if (!user) {
    return null; // or a loading spinner
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-200">
        <View className="p-8 rounded-2xl">
          <ActivityIndicator size="large" color="#0062FF" />
          <Text className="mt-4 text-neutral-700 font-semibold">Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-neutral-200">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }} // Add padding for FAB
        showsVerticalScrollIndicator={false}
        className=""
        onScroll={(e) => {
          const currentScrollY = e.nativeEvent.contentOffset.y;
          if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
            setTabBarVisible(false);
          } else {
            setTabBarVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between pt-6 pb-4 px-4">
          <View>
            <Text className="text-2xl font-bold text-primary-dark">Chào, {user.name}!</Text>
            <Text className="text-neutral-600">Hãy tiếp tục nỗ lực nhé.</Text>
          </View>
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={28} color="#2C3642" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={{ uri: user.avatar_url }}
                className="w-12 h-12 rounded-full border-2 border-primary"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View className="space-y-6 px-4">
          {/* Hero Banner */}
          <View className="rounded-2xl shadow-md overflow-hidden">
            <HeroBanner />
          </View>

          {/* Streak & Progress */}
          <View className="flex-row space-x-4 gap-2 my-2">
            <View className="flex-1 bg-neutral-100 rounded-2xl shadow-md p-4 items-center justify-center">
              <StreakNoSmoke />
            </View>
            <View className="flex-1 bg-secondary rounded-2xl shadow-md p-4">
              <ProgressSummary />
            </View>
          </View>

          {/* Motivational Quote */}
          <View className="bg-primary-light/20 rounded-2xl mb-2 p-4">
            <MotivationalQuote quote={quotes[Math.floor(Math.random() * quotes.length)]} />
          </View>

          {/* Service Highlights */}
          <View className="bg-neutral-100 rounded-2xl shadow-md mb-2 p-4">
            <ServiceHighlights />
          </View>

          {/* Ranking Preview */}
          <View className="bg-neutral-100 rounded-2xl shadow-md mb-2 p-4">
            <RankingPreview />
          </View>

          {/* Blog Preview */}
          <View className="bg-neutral-100 rounded-2xl shadow-md p-4">
            <BlogPreviewList />
          </View>

          
        </View>
        {/* Subscription */}
        <SubscriptionPackages />

        {/* Feedback */}
        <FeedbackSlider />
      </ScrollView>
      <FloatingActionButton />
    </SafeAreaView>
  );
}
