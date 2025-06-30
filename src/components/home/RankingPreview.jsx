import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { leaderBoard } from '../../api/badgeApi';
import { ActivityIndicator } from 'react-native';

export default function RankingPreview() {
    const [leaderboard, setLeaderBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const fetchLeaderboard = async () => {
                try {
                    setIsLoading(true);
                    const response = await leaderBoard();
                    setLeaderBoard(response.data.slice(0, 10));
                } catch (error) {
                    console.log('Failed to fetch leaderboard', error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchLeaderboard();
        }, [])
    );

    const getRankStyle = (index) => {
        switch (index) {
            case 0: // Top 1
                return {
                    container: 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30',
                    border: 'border-2 border-yellow-300',
                    icon: '👑',
                    textColor: 'text-black',
                    nameColor: 'text-yellow-500 font-bold',
                    pointsColor: 'text-yellow-400 font-bold',
                    rankBg: 'bg-yellow-600'
                };
            case 1: // Top 2
                return {
                    container: 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/30',
                    border: 'border-2 border-green-300',
                    icon: '🥈',
                    textColor: 'text-black',
                    nameColor: 'text-green-500 font-semibold',
                    pointsColor: 'text-green-400 font-semibold',
                    rankBg: 'bg-green-600'
                };
            case 2: // Top 3
                return {
                    container: 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/30',
                    border: 'border-2 border-blue-300',
                    icon: '🥉',
                    textColor: 'text-black',
                    nameColor: 'text-blue-500 font-medium',
                    pointsColor: 'text-blue-400 font-medium',
                    rankBg: 'bg-blue-600'
                };
            default: // Others
                return {
                    container: 'bg-white shadow-sm shadow-gray-200/50',
                    border: 'border border-gray-200',
                    icon: '',
                    textColor: 'text-gray-700',
                    nameColor: 'text-gray-800 font-medium',
                    pointsColor: 'text-gray-600',
                    rankBg: 'bg-gray-100'
                };
        }
    };

    const TopThreePodium = () => {
        if (leaderboard.length < 3) return null;

        return (
            <View className="flex-row justify-center items-end mb-8 px-4">
                {/* First Place */}
                <View className="items-center mx-2 flex-1">
                    <View className="bg-gradient-to-b from-yellow-400 to-orange-500 w-20 h-24 rounded-t-lg mb-2 justify-center items-center shadow-sm">
                        <Text className="text-black font-bold text-xl">1</Text>
                        <Text className="text-2xl">👑</Text>
                    </View>
                    <View className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl  border-2 border-yellow-300 items-center min-h-[90px] justify-center">
                        <Image source={{ uri: leaderboard[0].avatar }} className="w-14 h-14 rounded-full mb-2 border-2 border-white" />
                        <Text className="text-black font-bold text-sm text-center" numberOfLines={1}>{leaderboard[0].name}</Text>
                        <Text className="text-yellow-400 font-bold text-base">{leaderboard[0].totalPoints}</Text>
                    </View>
                </View>

                {/* Second Place */}
                <View className="items-center mx-2 flex-1">
                    <View className="bg-gradient-to-b from-silver-400 to-gray-500 w-16 h-20 rounded-t-lg mb-2 justify-center items-center shadow-sm">
                        <Text className="text-black font-bold text-lg">2</Text>
                    </View>
                    <View className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-xl border-2 border-green-300 items-center min-h-[80px] justify-center">
                        <Image source={{ uri: leaderboard[1].avatar }} className="w-12 h-12 rounded-full mb-2 border-2 border-white" />
                        <Text className="text-black font-semibold text-xs text-center" numberOfLines={1}>{leaderboard[1].name}</Text>
                        <Text className="text-green-400 font-bold text-sm">{leaderboard[1].totalPoints}</Text>
                    </View>
                </View>

                

                {/* Third Place */}
                <View className="items-center mx-2 flex-1">
                    <View className="bg-gradient-to-b from-orange-400 to-red-500 w-14 h-16 rounded-t-lg mb-2 justify-center items-center shadow-sm">
                        <Text className="text-black font-bold text-base">3</Text>
                    </View>
                    <View className="bg-gradient-to-r from-blue-400 to-cyan-500 p-3 rounded-xl border-2 border-blue-300 items-center min-h-[75px] justify-center">
                        <Image source={{ uri: leaderboard[2].avatar }} className="w-10 h-10 rounded-full mb-2 border-2 border-white" />
                        <Text className="text-black font-medium text-xs text-center" numberOfLines={1}>{leaderboard[2].name}</Text>
                        <Text className="text-blue-400 font-semibold text-sm">{leaderboard[2].totalPoints}</Text>
                    </View>
                </View>
            </View>
        );
    };

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
        <ScrollView className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50">
            <SafeAreaView className="px-4 py-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
                        🏆 Bảng Xếp Hạng Huy Hiệu
                    </Text>
                    <Text className="text-center text-gray-600">
                        Top {leaderboard.length} người chơi xuất sắc nhất
                    </Text>
                </View>

                {/* Top 3 Podium */}
                <TopThreePodium />

                {/* Full Leaderboard */}
                <View className="bg-white rounded-2xl shadow-lg mx-2 overflow-hidden">
                    <View className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                        <Text className="text-white font-bold text-lg text-center">
                            Bảng Xếp Hạng Chi Tiết
                        </Text>
                    </View>

                    {leaderboard.map((player, index) => {
                        const style = getRankStyle(index);
                        return (
                            <View key={index} className={`mx-3 my-2 rounded-xl overflow-hidden ${style.border}`}>
                                <View className={`${style.container} p-4`}>
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center flex-1">
                                            {/* Rank Badge */}
                                            <View className={`${style.rankBg} w-8 h-8 rounded-full justify-center items-center mr-3`}>
                                                <Text className="text-white font-bold text-sm">{index + 1}</Text>
                                            </View>

                                            {/* Avatar */}
                                            <View className="relative mr-3">
                                                <Image
                                                    source={{ uri: player.avatar }}
                                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                                />
                                                {style.icon && (
                                                    <View className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 justify-center items-center">
                                                        <Text className="text-xs">{style.icon}</Text>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Name */}
                                            <View className="flex-1">
                                                <Text className={`${style.nameColor} text-base`} numberOfLines={1}>
                                                    {player.name}
                                                </Text>
                                                {index < 3 && (
                                                    <Text className={`${style.textColor} text-xs opacity-80`}>
                                                        {index === 0 ? 'Vô địch' : index === 1 ? 'Á quân' : 'Hạng ba'}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        {/* Points */}
                                        <View className="items-end">
                                            <Text className={`${style.pointsColor} text-lg font-bold`}>
                                                {player.totalPoints}
                                            </Text>
                                            <Text className={`${style.textColor} text-xs opacity-80`}>
                                                điểm
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Footer */}
                <View className="mt-6 p-4 bg-white/80 rounded-xl mx-2">
                    <Text className="text-center text-gray-600 text-sm">
                        🎯 Tiếp tục hoàn thành tiến trình để leo rank cao hơn!
                    </Text>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}