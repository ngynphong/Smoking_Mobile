import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { getPosts } from '../../api/postApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function BlogPreviewList() {
    const [blogPosts, setBlogPosts] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchBlogPosts = async () => {
                try {
                    const response = await getPosts();
                    const sortedPosts = response.data.posts
                        .sort((a, b) => (b.reaction_count || 0) - (a.reaction_count || 0))
                        .slice(0, 2);
                    setBlogPosts(sortedPosts);
                } catch (error) {
                    console.log('Failed to fetch blog posts', error);
                }
            }
            fetchBlogPosts();
        }, [])
    );

    return (
        <View className="mb-6">
            {/* Modern Header */}
            <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center">
                    <View className="w-1 h-7 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"
                        style={{ backgroundColor: '#8B5CF6' }} />
                    <Text className="text-xl font-bold text-gray-900">
                        ✨ Blog truyền cảm hứng
                    </Text>
                </View>
                <TouchableOpacity
                    className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100"
                    onPress={() => navigation.navigate('Community')}
                >
                    <Text className="text-blue-600 text-sm font-semibold">Xem tất cả</Text>
                </TouchableOpacity>
            </View>

            {/* Blog Posts Grid */}
            <View className="space-y-5">
                {blogPosts.map((post, index) => (
                    <TouchableOpacity
                        key={index}
                        className="bg-white rounded-3xl overflow-hidden mt-4 border border-gray-100"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.12,
                            shadowRadius: 16,
                            elevation: 8,
                        }}
                        onPress={() => navigation.navigate('PostDetail', { postId: post._id })}
                        activeOpacity={0.92}
                    >
                        {/* Image Container with Overlay Elements */}
                        <View className="relative">
                            <Image
                                source={{ uri: post.image }}
                                className="w-full h-52 bg-gray-100"
                                resizeMode="cover"
                            />

                            {/* Top badges container */}
                            <View className="absolute top-4 left-4 right-4 flex-row justify-between items-start">
                                {/* Trending badge */}
                                {index === 0 && (
                                    <View className="bg-red-500 px-3 py-1.5 rounded-full flex-row items-center">
                                        <Text className="text-white text-xs font-bold mr-1">🔥</Text>
                                        <Text className="text-white text-xs font-bold">Hot</Text>
                                    </View>
                                )}

                                {/* Reaction count */}
                                <View className="bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    <Text className="text-white text-xs font-semibold">
                                        ❤️ {post.reaction_count || 0}
                                    </Text>
                                </View>
                            </View>

                            {/* Bottom overlay for title */}
                            <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                                <Text
                                    className="text-white text-lg font-bold leading-6"
                                    numberOfLines={2}
                                >
                                    {post.title}
                                </Text>
                            </View>
                        </View>

                        {/* Content Footer */}
                        <View className="p-5">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <View className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2" />
                                    <Text className="text-gray-600 text-sm font-medium">Bài viết mới</Text>
                                </View>

                                <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
                                    <Text className="text-blue-600 text-sm font-semibold mr-1">
                                        Đọc ngay
                                    </Text>
                                    <Text className="text-blue-600 text-lg">→</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Enhanced Loading State */}
            {blogPosts.length === 0 && (
                <View className="space-y-5">
                    {[1, 2].map((item) => (
                        <View key={item} className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                            {/* Skeleton Image */}
                            <View className="w-full h-52 bg-gray-200">
                                <View className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                            </View>

                            {/* Skeleton Content */}
                            <View className="p-5">
                                <View className="h-5 bg-gray-200 rounded-lg mb-3 animate-pulse" />
                                <View className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}