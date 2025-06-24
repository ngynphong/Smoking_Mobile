import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PostCard from '../../components/community/PostCard';
import React, { useEffect, useState } from 'react';
import { getPosts } from '../../api/postApi';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
      const fetchPosts = async () => {
        try {
          setIsLoading(true);
          const res = await getPosts();
          setPosts(res.data.posts || []);
        } catch (err) {
          console.error('Lỗi fetch posts:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }, [])
  );

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
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <View className="bg-blue-200 py-4">
        <Text className="text-2xl font-bold text-center">Cộng đồng</Text>
      </View>

      {posts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text>Không có bài viết nào</Text>
          <Text className="text-xs text-gray-500 mt-2">
            Debug: Posts array length: {posts.length}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View className="px-4">
              <PostCard
                post={item}
                onPress={() => navigation.navigate('PostDetail', { postId: item._id })}
              />
            </View>
          )}
          keyExtractor={(item, index) => item._id?.toString() || index.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('CreatePost')} // Thêm navigation cho nút tạo post
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CommunityScreen;