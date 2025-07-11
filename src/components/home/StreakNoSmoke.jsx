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

    return (
        <View className="items-center justify-center space-y-1">
            <Text className="text-4xl font-bold text-primary-dark">{streak} 🔥</Text>
            <Text className="text-base text-neutral-600 font-semibold">Ngày không khói thuốc</Text>
        </View>
    );
};

export default StreakNoSmoke;
