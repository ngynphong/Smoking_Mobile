import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { getProgressByPlan } from '../../api/progressApi';
import { getQuitplanByUserId } from '../../api/quitPlanApi';
import { getUser } from '../../utils/authStorage';

export default function ProgressSummary({ days, moneySaved, healthImproved }) {

    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);


    // const fetchQuitPlan = async () => {
    //     try {
    //         const user = await getUser();
    //         const id = user.id;

    //         const response = await getQuitplanByUserId(id);
    //         setQuitPlan(response.data);
    //         // console.log('Quit Plan',response.data)
    //     } catch (error) {
    //         console.log('Faild to fetch progress', error);
    //     }
    // }

    useFocusEffect(
        React.useCallback(() => {
            const fetchProgress = async () => {
                try {
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
                }
            }
            fetchProgress();
        }, [])
    );

    return (
        <View className="bg-green-100 rounded-2xl p-4 shadow-sm">
            <Text className="text-lg font-semibold text-green-800">🌿 Tiến trình cai thuốc</Text>
            {error ? (
                <Text className="text-red-500 mt-2">{error}</Text>
            ) : progress ? (
                <>
                    <Text>Tên kế hoạch: <Text className="font-bold">{progress.plan_name}</Text></Text>
                    <Text className="mt-1">Giai đoạn: <Text className="font-bold">{progress.completed_stages} </Text></Text>
                    <Text>Tiến trình: <Text className="font-bold">{progress.progress_percent}%</Text></Text>
                </>
            ) : (
                <Text className="text-gray-500 mt-2">Chưa có dữ liệu tiến trình.</Text>
            )}
        </View>
    );
}
