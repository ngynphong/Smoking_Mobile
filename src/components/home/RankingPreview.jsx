// src/components/home/RankingPreview.jsx

import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { leaderBoard } from '../../api/badgeApi';
import { Trophy, Flame, CircleDollarSign, Badge } from 'lucide-react-native';
import clsx from 'clsx';

const leaderboardTabs = [
    { key: 'points', title: 'Điểm Thưởng', icon: Trophy, unit: 'điểm' },
    { key: 'no_smoke_days', title: 'Ngày Cai Thuốc', icon: Flame, unit: 'ngày' },
    { key: 'money_saved', title: 'Tiền Tiết Kiệm', icon: CircleDollarSign, unit: '₫' },
    { key: 'badge_count', title: 'Huy Hiệu', icon: Badge, unit: 'huy hiệu' },
];

export default function RankingPreview() {
    const [leaderboard, setLeaderBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [leaderboardType, setLeaderboardType] = useState('points');

    useFocusEffect(
        useCallback(() => {
            const fetchLeaderboard = async () => {
                try {
                    setIsLoading(true);
                    const response = await leaderBoard(leaderboardType);
                    // The new data structure is { score, user }, so we map it.
                    const formattedData = response.data.map(item => ({
                        _id: item.user._id,
                        name: item.user.name,
                        avatar: item.user.avatar_url,
                        score: item.score
                    }));
                    setLeaderBoard(formattedData.slice(0, 10));
                } catch (error) {
                    console.log(`Failed to fetch ${leaderboardType} leaderboard`, error);
                    setLeaderBoard([]); // Clear leaderboard on error
                } finally {
                    setIsLoading(false);
                }
            }
            fetchLeaderboard();
        }, [leaderboardType])
    );

    const formatScore = (score, type) => {
        if (type === 'money_saved') {
            return score.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }
        const selectedTab = leaderboardTabs.find(t => t.key === type);
        return `${score} ${selectedTab?.unit || ''}`;
    };

    const TopThreePodium = () => {
        if (leaderboard.length < 3) return null;

        const podiumData = [
            { rank: 2, ...leaderboard[1] },
            { rank: 1, ...leaderboard[0] },
            { rank: 3, ...leaderboard[2] }
        ];

        const getPodiumStyle = (rank) => {
            switch (rank) {
                case 1: return { color: 'bg-yellow-400', height: 'h-32', text: 'text-2xl', icon: '👑' };
                case 2: return { color: 'bg-slate-300', height: 'h-24', text: 'text-xl', icon: '🥈' };
                case 3: return { color: 'bg-amber-600', height: 'h-20', text: 'text-lg', icon: '🥉' };
                default: return { color: 'bg-gray-200', height: 'h-16', text: 'text-base' };
            }
        };

        return (
            <View className="flex-row justify-around items-end mt-6 mb-6 h-48">
                {podiumData.map(player => {
                    const style = getPodiumStyle(player.rank);
                    return (
                        <View key={player._id} className="items-center w-1/3 px-1">
                            <Text className={`font-bold text-gray-800 ${style.text}`}>{player.rank} {style.icon}</Text>
                            <Image source={{ uri: player.avatar }} className="w-16 h-16 rounded-full my-1 border-2 border-white" />
                            <View className={`${style.color} ${style.height} w-full rounded-t-lg items-center p-1 justify-end`}>
                                <Text className="text-black font-semibold text-center" numberOfLines={1}>{player.name}</Text>
                                <Text className="text-black font-bold text-center" numberOfLines={1}>{formatScore(player.score, leaderboardType)}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderLeaderboardItem = (player, index) => (
        <View key={player._id} className="flex-row items-center bg-white p-2 rounded-xl mb-2 shadow-sm">
            <Text className="text-lg font-bold text-gray-500 w-8">{index + 1}</Text>
            <Image source={{ uri: player.avatar }} className="w-10 h-10 rounded-full mr-3" />
            <Text className="flex-1 text-base font-medium text-gray-800" numberOfLines={1}>{player.name}</Text>
            <Text className="text-base font-bold text-indigo-600">{formatScore(player.score, leaderboardType)}</Text>
        </View>
    );

    const selectedTabInfo = leaderboardTabs.find(t => t.key === leaderboardType);

    return (
        <SafeAreaView className="flex-1  p-2">
            <View className="items-center mb-4">
                <Text className="text-2xl font-bold text-gray-800">Bảng Xếp Hạng</Text>
                <Text className="text-gray-500">Vinh danh những người nỗ lực nhất</Text>
            </View>

            <View className="mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {leaderboardTabs.map(tab => {
                        const IconComponent = tab.icon;
                        const isSelected = leaderboardType === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setLeaderboardType(tab.key)}
                                className={clsx(
                                    "flex-row items-center px-4 py-2 mr-2 rounded-full border-2",
                                    isSelected ? 'bg-indigo-600 border-indigo-700' : 'bg-white border-gray-200'
                                )}
                            >
                                <IconComponent color={isSelected ? 'white' : '#4f46e5'} size={16} />
                                <Text className={clsx(
                                    "ml-2 font-semibold",
                                    isSelected ? 'text-white' : 'text-indigo-600'
                                )}>{tab.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center h-64">
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : leaderboard.length === 0 ? (
                <View className="flex-1 justify-center items-center bg-white rounded-xl p-8">
                    <Text className="text-gray-500">Chưa có dữ liệu cho bảng xếp hạng này.</Text>
                </View>
            ) : (
                <>
                    <TopThreePodium />
                    <View className="mt-4">
                        <Text className="text-lg font-semibold text-gray-700 mb-2">
                            Top 4-10 {selectedTabInfo?.title}
                        </Text>
                        {leaderboard.slice(3).map((player, index) => renderLeaderboardItem(player, index + 3))}
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}