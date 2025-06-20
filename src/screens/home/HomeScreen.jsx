import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import ProgressSummary from '../../components/home/ProgressSummary';
import MotivationalQuote from '../../components/home/MotivationalQuote';
import RankingPreview from '../../components/home/RankingPreview';
import BlogPreviewList from '../../components/home/BlogPreviewList';
import FloatingActionButton from '../../components/home/FloatingActionButton';
import HeroBanner from '../../components/home/HeroBanner';
import ServiceHighlights from '../../components/home/ServiceHighlights';
import { useEffect, useState } from 'react';
import { getProfile } from '../../api/userApi';
import { getUser } from '../../utils/authStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const progressSummary = {
  days: 3,
  moneySaved: 90000,
  healthImproved: 5,
};

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        const userData = await getProfile(user.id);
        setUser(userData.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return null; // or a loading spinner
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
            <Text className="text-2xl font-bold text-gray-900">Be Productive Today</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3">
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

        {/* Card: ProgressSummary */}
        <View className="mx-4 mt-2 mb-4 bg-white rounded-2xl shadow-lg p-5">
          <ProgressSummary {...progressSummary} />
        </View>

        {/* Card: MotivationalQuote */}
        <View className="mx-4 mb-4 bg-white rounded-2xl shadow p-5">
          <MotivationalQuote quote="Mỗi ngày không hút là một chiến thắng." />
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
      </ScrollView>
      <FloatingActionButton />
    </LinearGradient>
  );
}
