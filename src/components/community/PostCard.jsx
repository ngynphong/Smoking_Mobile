import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MessageCircle, Heart } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile } from '../../api/userApi';

const PostCard = ({ post, onPress }) => {
    const { user_id, title, content, image, tags, reaction_count, comment_count, post_date } = post;
    const time = new Date(post_date).toLocaleDateString('vi-VN');
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const fetchUserInfo = async () => {
                // Kiểm tra nếu user_id là null hoặc không tồn tại
                if (!user_id) {
                    setUserData({
                        name: 'Người dùng ẩn danh',
                        avatar_url: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
                    });
                    return;
                }

                try {
                    setIsLoading(true);
                    
                    const userId = typeof user_id === 'object' ? user_id._id || user_id.id : user_id;
                   
                    const userProfile = await getProfile(userId);
                    if (userProfile.data.user) {
                        setUserData(userProfile.data.user);
                    } else {
                        console.log("No user data found, using default");
                        setUserData({
                            name: 'Người dùng không xác định',
                            avatar_url: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
                        });
                    }
                } catch (error) {
                    setUserData({
                        name: 'Lỗi tải thông tin',
                        avatar_url: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUserInfo();
        }, [user_id])); // Thêm user_id vào dependency array

    // Hiển thị skeleton khi đang loading
    if (isLoading) {
        return (
            <TouchableOpacity className="bg-white p-4 mb-4 rounded-xl shadow-sm">
                <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                    <View>
                        <View className="h-4 bg-gray-200 rounded w-20 mb-1" />
                        <View className="h-3 bg-gray-200 rounded w-16" />
                    </View>
                </View>
                <View className="h-4 bg-gray-200 rounded w-full mb-2" />
                <View className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                {image && <View className="w-full h-48 bg-gray-200 rounded-lg mb-3" />}
            </TouchableOpacity>
        );
    }

    // Hiển thị placeholder nếu không có userData
    if (!userData) {
        return (
            <TouchableOpacity onPress={onPress} className="bg-white p-4 mb-4 rounded-xl shadow-sm">
                <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                    <View>
                        <Text className="font-semibold text-base text-gray-500">Đang tải...</Text>
                        <Text className="text-xs text-gray-500">{time}</Text>
                    </View>
                </View>
                <Text className="text-lg font-bold text-gray-800 mb-1">{title || 'Không có tiêu đề'}</Text>
                <Text className="text-sm text-gray-700 mb-2">{content}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} className="bg-white p-4 mb-4 rounded-xl  shadow-2xl">
            <View className="flex-row items-center mb-2">
                <Image
                    source={{ uri: userData.avatar_url }}
                    className="w-10 h-10 rounded-full mr-3"
                    defaultSource={{ uri: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg' }}
                />
                <View>
                    <Text className="font-semibold text-base">{userData.name}</Text>
                    <Text className="text-xs text-gray-500">{time}</Text>
                </View>
            </View>

            <Text className="text-lg font-bold text-gray-800 mb-1">{title || 'Không có tiêu đề'}</Text>
            <Text className="text-sm text-gray-700 mb-2">{content}</Text>

            {image ? (
                <Image
                    source={{ uri: image }}
                    className="w-full h-48 rounded-lg mb-3"
                    resizeMode="cover"
                />
            ) : null}

            <View className="flex-row flex-wrap gap-1 mb-3">
                {tags?.map((tag, index) => (
                    <Text key={tag._id || index} className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {tag.title || tag.name || tag}
                    </Text>
                ))}
            </View>

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Heart size={18} color="#dc2626" />
                    <Text className="ml-1 text-sm text-gray-600">{reaction_count || 0}</Text>
                </View>
                <View className="flex-row items-center">
                    <MessageCircle size={18} color="#2563eb" />
                    <Text className="ml-1 text-sm text-gray-600">{comment_count || 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PostCard;