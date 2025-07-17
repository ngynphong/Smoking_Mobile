import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getFeedback } from '../../api/feedbackApi';
import { useNavigation } from '@react-navigation/native';

export default function FeedbackSlider() {
    const [feedBacks, setFeedBacks] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFeedBack = async () => {
            try {
                const res = await getFeedback();
                setFeedBacks(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchFeedBack();
    }, [])

    // Render số sao
    const renderStars = (rating) => (
        <View className="flex-row mb-1">
            {[...Array(5)].map((_, i) => (
                <Text key={i} className={i < rating ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>★</Text>
            ))}
        </View>
    );

    return (
        <View>
            <FlatList
                data={feedBacks}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 8 }}
                renderItem={({ item }) => (
                    <View className="bg-white rounded-2xl shadow-sm p-4 mx-2 w-64 items-center">
                        <Image
                            source={{ uri: item.user_id?.avatar_url || 'https://ui-avatars.com/api/?name=User' }}
                            className="w-14 h-14 rounded-full mb-2"
                        />
                        <Text className="font-bold text-base mb-1">{item.user_id?.name || 'Ẩn danh'}</Text>
                        {renderStars(item.rating)}
                        <Text className="text-gray-700 text-center italic mt-1">"{item.content}"</Text>
                        <Text className='text-sm mt-2 text-gray-400'>{item.feedback_type === 'user_to_coach' ? 'Đánh giá huấn luyện viên' : 'Đánh giá hệ thống'}</Text>
                    </View>
                )}
            />

            <View className="mx-4 mb-6 rounded-2xl p-5 items-center">
                <Text className='text-2xl font-bold text-gray-900 text-center'>Hãy đánh giá cho chúng tôi</Text>
                <Text className='text-sm text-gray-500'>Đánh giá của bạn sẽ giúp chúng tôi cải thiện dịch vụ</Text>
                <TouchableOpacity className='bg-blue-500 rounded-lg p-2 mt-2' onPress={() => navigation.navigate('Feedback')}>
                    <Text className='text-white'>Đánh giá</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}