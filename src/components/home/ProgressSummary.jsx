import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { getProgressByPlan } from '../../api/progressApi';
import { getQuitplanByUserId } from '../../api/quitPlanApi';
import { getUser } from '../../utils/authStorage';

export default function ProgressSummary() {

    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchProgress = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const user = await getUser();
                    const id = user.id;
                    const quitPlan = await getQuitplanByUserId(id);
                    const quitPlanId = quitPlan.data && quitPlan.data.length > 0 ? quitPlan.data[0]._id : null;
                    if (!quitPlanId) {
                        setProgress(null);
                        setError('Bạn chưa có kế hoạch cai thuốc nào.');
                        return;
                    }
                    const response = await getProgressByPlan(quitPlanId);
                    setProgress(response.data);
                } catch (error) {
                    setProgress(null);
                    setError('Không thể lấy tiến trình. Vui lòng thử lại sau.');
                    console.log('Faild to fetch progress', error);
                } finally{
                    setIsLoading(false);
                }
            }
            fetchProgress();
        }, [])
    );

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
        <View className="">
            <Text className="text-lg font-semibold text-green-800">🌿 Tiến trình cai thuốc</Text>
            {error ? (
                <Text className="text-red-500 mt-2">{error}</Text>
            ) : progress ? (
                <>
                    <Text>Tên kế hoạch: <Text className="font-bold">{progress.plan_name}</Text></Text>
                    <Text className="mt-1">Giai đoạn đã hoàn thành: <Text className="font-bold">{progress.completed_stages} </Text></Text>
                    <Text>Tiến trình: <Text className="font-bold">{progress.progress_percent}%</Text></Text>
                </>
            ) : (
                <Text className="text-gray-500 mt-2">Chưa có dữ liệu tiến trình.</Text>
            )}
        </View>
    );
}
