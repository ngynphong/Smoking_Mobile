import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { leaderBoard } from '../../api/badgeApi';

const mockUsers = [
    { name: "Hùng", day: 15 },
    { name: "Mai", day: 13 },
    { name: "Duy", day: 10 },
];

export default function RankingPreview() {
    const [leaderboard, setLeaderBoard] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchLeaderboard = async () => {
                try {
                    const response = await leaderBoard();                 
                    setLeaderBoard(response.data.slice(0, 10));
                } catch (error) {
                    console.log('Faild to fetch leaderboard', error);
                }
            }
            fetchLeaderboard();
        }, [])

    )
    return (
        <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">🏆 Bảng xếp hạng huy hiệu</Text>
            {leaderboard.map((ld, index) => (
                <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-200">
                    <View className="flex-row items-center">
                        <Text>{index + 1}.</Text>
                        <Image source={{ uri: ld.avatar }} className="w-8 h-8 rounded-full mt-1 mx-2" />
                        <Text>{ld.name}</Text>
                        
                    </View>

                    <Text>{ld.totalPoints} Điểm</Text>
                </View>
            ))}
            {/* <TouchableOpacity>
                <Text className="text-blue-500 text-right mt-1">Xem tất cả</Text>
            </TouchableOpacity> */}
        </View>
    );
}
