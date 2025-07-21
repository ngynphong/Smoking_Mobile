import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { createFeedback } from '../../api/feedbackApi';
import { Star } from 'lucide-react-native';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const FeedbackCoachScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { coachId, planId } = route.params;
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const {user} = useContext(AuthContext);
  const [feedback_type, setFeedbackType] = useState('user_to_coach');
  const handleRating = (rate) => {
    setRating(rate);
  };
  const handleSubmit = async () => {
    if (rating === 0) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập số sao để đánh giá',
        position: 'top'
      });
      return;
    }
    try {
     
      await createFeedback({
        user_id: user.id,
        coach_id: coachId._id,
        plan_id: planId,
        feedback_type,
        rating,
        content,
      });
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đánh giá thành công!',
        position: 'top'
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể gửi đánh giá. Vui lòng thử lại.',
        position: 'top'
      });
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Đánh giá huấn luyện viên</Text>
        <View className='p-4 border border-gray-200 rounded-lg mb-4 flex-row items-center'>
          <Image source={{ uri: coachId.avatar_url }} className="w-16 h-16 rounded-full mr-4" />
          <View className="">
            <Text className="text-lg font-semibold text-gray-800">{coachId.name}</Text>
            <Text className="text-sm text-gray-500">{coachId.email}</Text>
          </View>
        </View>
        <View className="flex-row mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <Star
                size={36}
                color={rating >= star ? '#f59e0b' : '#d1d5db'}
                fill={rating >= star ? '#f59e0b' : 'none'}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg p-4 h-32 text-lg"
          placeholder="Viết bình luận của bạn..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 mt-6"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-bold text-lg">Gửi đánh giá</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackCoachScreen;
