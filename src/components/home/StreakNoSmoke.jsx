import React, { useEffect, useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { getStreakNumber } from '../../api/progressApi';
import { AuthContext } from '../../contexts/AuthContext';

const MAX_FIRE = 1; // Số icon lửa tối đa hiển thị

const StreakNoSmoke = () => {
    const { user } = useContext(AuthContext);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                if (user?.id) {
                    const res = await getStreakNumber(user.id);
                    setStreak(res.data.streak || 0);
                }
            } catch (err) {
                setStreak(0);
            }
        };
        fetchStreak();
    }, [user]);

    // Tạo mảng icon lửa
    const fireIcons = [];
    const displayCount = Math.min(streak, MAX_FIRE);
    for (let i = 0; i < displayCount; i++) {
        fireIcons.push(
            <Text key={i} className="text-2xl md:text-3xl">{'🔥'}</Text>
        );
    }

    return (
        <View className="items-center">
            <View className="flex-row flex-wrap justify-center mb-2">
               
                {streak > MAX_FIRE && (
                    <Text className="text-2xl font-bold text-orange-500 ml-1">+{streak - MAX_FIRE}</Text>
                )}
                {fireIcons}
            </View>
            <Text className="text-3xl font-bold text-orange-500">{streak}</Text>
            <Text className="text-base text-gray-700 mt-1">Chuỗi ngày không hút thuốc</Text>
        </View>
    );
};

export default StreakNoSmoke;
