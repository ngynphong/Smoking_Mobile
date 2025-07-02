import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { createFeedback, deleteFeedback, editFeedback, getFeedbackByCoach, getFeedbackByUser } from '../api/feedbackApi';
import { Picker } from '@react-native-picker/picker';
import { getUser } from '../utils/authStorage';
import { AuthContext } from '../contexts/AuthContext';
import { getAllCoaches } from '../api/coachApi';
import CoachCard from '../components/CoachCard';
import { useFocusEffect } from '@react-navigation/native';

const FeedbackScreen = ({ route }) => {
    // Nếu có truyền sẵn planId, coachId từ màn khác thì lấy ra
    const { user } = useContext(AuthContext);
    const [feedbackType, setFeedbackType] = useState('user_to_coach');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState('');
    const [loading, setLoading] = useState(false);
    const [coachInfo, setCoachInfo] = useState(null);
    const [oldFeedback, setOldFeedback] = useState(null);
    const [coaches, setCoaches] = useState([]);
    const [selectedCoachId, setSelectedCoachId] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const fetchOldFeedback = async () => {
        try {
            let res;

            if (feedbackType === 'user_to_coach' && selectedCoachId) {
                res = await getFeedbackByCoach(selectedCoachId);
            } else if (feedbackType === 'user_to_system' && user?.id) {
                res = await getFeedbackByUser(user.id);
            }

            if (res?.data?.length > 0) {
                // Lọc đúng feedback của user hiện tại
                const myFeedback = res.data.find(fb => fb.user_id?._id === user.id);
                if (myFeedback) {
                    setOldFeedback(myFeedback);
                    setContent(myFeedback.content);
                    setRating(myFeedback.rating.toString());
                    setCoachInfo(myFeedback.coach_id);
                } else {
                    setOldFeedback(null);
                    setContent('');
                    setRating('');
                    setCoachInfo(null);
                }
            } else {
                setOldFeedback(null);
                setContent('');
                setRating('');
                setCoachInfo(null);
            }
        } catch (err) {
            // Xử lý lỗi nếu cần
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if ((feedbackType === 'user_to_coach' && selectedCoachId) || feedbackType === 'user_to_system') {
                fetchOldFeedback();
            }
        }, [feedbackType, selectedCoachId, user]));

    //Lấy danh sách coach
    useFocusEffect(
        React.useCallback(() => {
            if (feedbackType === 'user_to_coach') {
                const fetchCoaches = async () => {
                    try {
                        const res = await getAllCoaches();
                        setCoaches(res.data);
                    } catch (error) {
                        setCoaches([]);
                    }
                };
                fetchCoaches();
            }
        }, [feedbackType])
    )
    //Khi chọn coach set lại coachId và clear feedback cũ
    useFocusEffect(
        React.useCallback(() => {
            // Chỉ reset khi feedbackType là 'user_to_coach' VÀ selectedCoachId thay đổi
            if (feedbackType === 'user_to_coach' && selectedCoachId) {
                setCoachInfo(null);
                setContent('');
                setRating('');
                setOldFeedback(null);
            }
            // KHÔNG reset khi feedbackType là 'user_to_system'
        }, [selectedCoachId])
    )

    const handleSubmit = async () => {
        if (!content || !rating) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ nội dung và điểm đánh giá');
            return;
        }
        setLoading(true);
        try {
            if (isEditing && oldFeedback) {
                await editFeedback(oldFeedback._id, {
                    rating: Number(rating),
                    content,
                });
                Alert.alert('Thành công', 'Cập nhật feedback thành công!');
                setIsEditing(false);
            } else {
                await createFeedback({
                    coach_id: feedbackType === 'user_to_coach' ? selectedCoachId : undefined,
                    rating: Number(rating),
                    feedback_type: feedbackType,
                    content,
                });
                Alert.alert('Thành công', 'Gửi feedback thành công!');
            }
            setContent('');
            setRating('');
            fetchOldFeedback();
        } catch (err) {
            Alert.alert('Lỗi', isEditing ? 'Cập nhật feedback thất bại' : 'Gửi feedback thất bại');
        }
        setLoading(false);
    };

    const renderStars = (rating, setRating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Text style={{ fontSize: 32, color: i <= rating ? '#FFD700' : '#ccc' }}>
                        ★
                    </Text>
                </TouchableOpacity>
            );
        }
        return <View style={{ flexDirection: 'row', marginVertical: 8 }}>{stars}</View>;
    };

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <View className="bg-white shadow-xl p-4 rounded-xl">
                {/* Chọn loại feedback */}
                <Text className="font-bold mb-2">Loại đánh giá:</Text>
                <Picker
                    selectedValue={feedbackType}
                    style={{ height: 50, width: '100%' }}
                    onValueChange={setFeedbackType}
                    className="border border-blue-500 mb-4"
                >
                    <Picker.Item label="Cho Huấn Luyện Viên" value="user_to_coach" />
                    <Picker.Item label="Cho Hệ Thống" value="user_to_system" />
                </Picker>

                {/* UI cho feedback coach */}
                {feedbackType === 'user_to_coach' && oldFeedback && !isEditing && (

                    <View className="bg-white rounded-xl shadow-lg p-4 mb-4">

                        <View className="flex-row items-center mb-2">
                            <Image
                                source={{ uri: oldFeedback.coach_id.avatar_url }}
                                className="w-14 h-14 rounded-full mr-3"
                            />
                            <View>
                                <Text className="font-bold text-lg">{oldFeedback.coach_id.name}</Text>
                                <Text className="text-gray-500">{oldFeedback.coach_id.email}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Text key={i} className={i < oldFeedback.rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</Text>
                            ))}
                        </View>
                        <Text className="mb-2">{oldFeedback.content}</Text>
                        <View className="flex-row space-x-2">
                            <TouchableOpacity
                                className="bg-blue-500 px-4 py-2 rounded-lg mx-2"
                                onPress={() => {
                                    setIsEditing(true);
                                    setContent(oldFeedback.content);
                                    setRating(oldFeedback.rating.toString());
                                }}
                            >
                                <Text className="text-white font-semibold">Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-red-500 px-4 py-2 rounded-lg"
                                onPress={async () => {
                                    try {
                                        await deleteFeedback(oldFeedback._id);
                                        setOldFeedback(null);
                                        setContent('');
                                        setRating('');
                                        setIsEditing(false);
                                        Alert.alert('Thành công', 'Đã xóa feedback');
                                    } catch (err) {
                                        Alert.alert('Lỗi', 'Xóa feedback thất bại');
                                    }
                                }}
                            >
                                <Text className="text-white font-semibold">Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {feedbackType === 'user_to_coach' &&
                    <View>
                        {
                            coaches.map(coach => (
                                <CoachCard key={coach._id} coach={coach} selected={coach.coach_id._id === selectedCoachId} onSelect={setSelectedCoachId} />
                            ))
                        }
                    </View>

                }

                {/* UI cho feedback system */}
                {feedbackType === 'user_to_system' && oldFeedback && !isEditing && (
                    <View className="bg-white rounded-xl shadow-lg p-4 mb-4 items-center">
                        <Image
                            source={require('../../assets/logo.jpg')}
                            className="w-20 h-20 rounded-full mb-2"
                        />
                        <Text className="font-bold text-lg text-blue-700 mb-2">Hệ thống</Text>
                        <View className="flex-row items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Text key={i} className={i < oldFeedback.rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>★</Text>
                            ))}
                        </View>
                        <Text className="mb-2">{oldFeedback.content}</Text>
                        <View className="flex-row space-x-2">
                            <TouchableOpacity
                                className="bg-blue-500 px-4 py-2 rounded-lg mx-2"
                                onPress={() => {
                                    setIsEditing(true);
                                    setContent(oldFeedback.content);
                                    setRating(oldFeedback.rating.toString());
                                }}
                            >
                                <Text className="text-white font-semibold">Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-red-500 px-4 py-2 rounded-lg"
                                onPress={async () => {
                                    try {
                                        await deleteFeedback(oldFeedback._id);
                                        setOldFeedback(null);
                                        setContent('');
                                        setRating('');
                                        setIsEditing(false);
                                        Alert.alert('Thành công', 'Đã xóa feedback');
                                    } catch (err) {
                                        Alert.alert('Lỗi', 'Xóa feedback thất bại');
                                    }
                                }}
                            >
                                <Text className="text-white font-semibold">Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {((feedbackType === 'user_to_system' && (!oldFeedback || isEditing)) ||
                    (feedbackType === 'user_to_coach' && (!oldFeedback || isEditing))) && (
                        <>
                            {/* Rating & Nội dung */}
                            <Text className="font-bold mt-2">Điểm đánh giá (1-5):</Text>
                            {renderStars(Number(rating), setRating)}

                            <Text className="font-bold mt-2">Nội dung đánh giá:</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-2 mt-1 mb-2 bg-white"
                                style={{ height: 80 }}
                                value={content}
                                onChangeText={setContent}
                                placeholder="Nhập nội dung"
                                multiline
                            />

                            <TouchableOpacity
                                className="mt-2 rounded-lg bg-blue-500 p-3"
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                <Text className="text-center text-white font-semibold">
                                    {loading ? "Đang gửi..." : "Gửi feedback"}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
            </View>
        </View >
    );
};

export default FeedbackScreen;
