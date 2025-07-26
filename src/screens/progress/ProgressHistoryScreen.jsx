import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { getProgressByStage } from '../../api/progressApi';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

const ProgressHistoryScreen = () => {
  const [progressHistory, setProgressHistory] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { stageId, stageTitle } = route.params;

  useEffect(() => {
    const fetchProgressHistory = async () => {
      try {
        const res = await getProgressByStage(stageId);
        setProgressHistory(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        setProgressHistory([]);
      }
    };
    fetchProgressHistory();
  }, [stageId]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-sm font-semibold text-gray-800 mb-2">
        {formatDate(item.date)}
      </Text>
      <View className="flex-row justify-start">
        <Text className="text-gray-600">Số điếu đã hút: </Text>
        <Text className="font-bold text-red-500">{item.cigarettes_smoked}</Text>
      </View>
      <View className="mt-1">
        <Text className="text-gray-600">Tình trạng sức khỏe:</Text>
        <Text className="font-medium text-blue-600">{item.health_status}</Text>
      </View>
          <View className="flex-row justify-start mt-1">
              <Text className="text-gray-600">Tiết kiệm: </Text>
              <Text className="font-medium text-green-600">{item.money_saved}đ</Text>
          </View>
      <View className="flex-row justify-start mt-1">
        <Text className="text-gray-600">Lần thử lại: </Text>
        <Text className="font-medium text-orange-600">{item.attempt_number}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 shadow-sm flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">
          Lịch sử: {stageTitle}
        </Text>
      </View>
      <FlatList
        data={progressHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500">Chưa có dữ liệu tiến trình.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProgressHistoryScreen;
