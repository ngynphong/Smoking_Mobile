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
                    console.log('Faild to fetch blog posts', error);
                }
            }
            fetchBlogPosts();
        }, [])
    )

    return (
        <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">📚 Blog truyền cảm hứng</Text>
            {blogPosts.map((post, index) => (
                <TouchableOpacity key={index} className="mb-3" onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>
                    <Image source={{ uri: post.image }} className="h-36 rounded-xl" />
                    <Text className="font-semibold mt-1">{post.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}