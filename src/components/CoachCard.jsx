import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAverageFeedbackByCoach } from '../api/feedbackApi';

export default function CoachCard({ coach, selected, onSelect }) {
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        const fetchAvg = async () => {
            try {
                const res = await getAverageFeedbackByCoach(coach.coach_id._id);
                setAvgRating(res.data)
            } catch (error) {
                console.log(error)
            }
        };
        fetchAvg()
    }, []);

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} >
                    <Text style={{ fontSize: 18, color: i <= rating ? '#FFD700' : '#ccc' }}>
                        ★
                    </Text>
                </TouchableOpacity>
            );
        }
        return <View style={{ flexDirection: 'row'}}>{stars}</View>;
    };

    return (
        <TouchableOpacity
            onPress={() => onSelect(coach.coach_id._id)}
            className={`flex-row items-center p-4 mb-3 rounded-xl border ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
            <Image source={{ uri: coach.coach_id.avatar_url }} className="w-16 h-16 rounded-full mr-4" />
            <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{coach.coach_id.name}</Text>
                <Text className="text-sm text-gray-500">{coach.specialization}</Text>
                <Text className="text-xs text-gray-400">Kinh nghiệm: {coach.experience_years} năm</Text>
                {renderStars(Number(avgRating.averageRating))}
            </View>
        </TouchableOpacity>
    )
};
