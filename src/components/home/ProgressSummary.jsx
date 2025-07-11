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
            <View className="flex-1 justify-center items-center h-24">
                <ActivityIndicator size="small" color="#0062FF" />
            </View>
        );
    }

    return (
        <View className="space-y-2">
            <Text className="text-lg font-bold text-primary-dark">🌿 Tiến Trình Hiện Tại</Text>
            {error ? (
                <Text className="text-danger mt-2">{error}</Text>
            ) : progress ? (
                <View className="space-y-1">
                    <Text className="text-neutral-700">
                        Kế hoạch: <Text className="font-bold text-neutral-900">{progress.plan_name}</Text>
                    </Text>
                    <Text className="text-neutral-700">
                        Giai đoạn: <Text className="font-bold text-neutral-900">{progress.completed_stages}</Text>
                    </Text>
                    <View className="w-full bg-neutral-300 rounded-full h-2.5 mt-2">
                        <View 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${progress.progress_percent}%` }}
                        />
                    </View>
                    <Text className="text-right font-semibold text-primary">{progress.progress_percent}%</Text>
                </View>
            ) : (
                <Text className="text-neutral-500 mt-2">Chưa có dữ liệu tiến trình.</Text>
            )}
        </View>
    );
}
