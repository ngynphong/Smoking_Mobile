import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../../components/community/PostCard';
import { useEffect, useState } from 'react';
import { getPosts } from '../../api/postApi';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getPosts();
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error('Lỗi fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <View className="bg-blue-100 py-4">
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