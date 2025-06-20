import { View, Text, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Image, TextInput, ActivityIndicator, ScrollView, Alert, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { ArrowLeft, Edit, Heart, MessageCircle, MoreVertical, Send, Trash } from 'lucide-react-native';
import { deletePosts, getPostsById, likePosts } from '../../api/postApi';
import { getProfile } from '../../api/userApi';
import { createComment, deleteComment, editComment, getPostComments } from '../../api/commentApi';
import { getToken, getUser } from '../../utils/authStorage';

export default function PostDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;

  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userPost, setUserPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [postId])
  )
  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPostDetail(),
        fetchComments(),
        fetchUserData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserData = async () => {
    try {
      const user = await getUser();
      const userData = await getProfile(user.id);
      setUserData(userData.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPostDetail = async () => {
    try {
      const response = await getPostsById(postId);
      const postsData = response.data.post;
      setPost(postsData);
      setLikeCount(postsData?.reaction_count || 0);

      // Fetch user data nếu có user_id
      if (postsData.user_id) {
        const userId = typeof postsData.user_id === 'object' ?
          postsData.user_id._id || postsData.user_id.id :
          postsData.user_id;

        if (userId) {
          const userResponse = await getProfile(userId);
          setUserPost(userResponse.data.user);
        }
      }

      // setIsLiked(postsData?.like_user_ids?.includes(userData?.id) || false);
    } catch (error) {
      console.error('Error fetching post:', error);
      Alert.alert('Lỗi', 'Không thể tải bài viết');
    }
  };

  useEffect(() => {
    if (post && userData) {
      setIsLiked(post.like_user_ids?.includes(userData.id) || false);
    }
  }, [post, userData]);

  const fetchComments = async () => {
    try {
      const response = await getPostComments(postId);
      const commentsData = response.data || response.comments || response;
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const token = await getToken();
      if (!token) {
        Alert.alert(
          'Đăng nhập',
          'Vui lòng đăng nhập để thích bài viết',
          [
            {
              text: 'Đăng nhập',
              onPress: () => navigation.navigate('Login')
            },
            {
              text: 'Hủy',
              style: 'cancel'
            }
          ]
        );
        return;
      }

      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);

      await likePosts(postId);
      await fetchPostDetail();
      
    } catch (error) {
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      console.error("Error liking post:", error);
      Alert.alert('Lỗi', 'Không thể thích bài viết');
    } finally {
      setIsLiking(false);
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || isCommenting) return;

    try {
      setIsCommenting(true);
      if (editingCommentId) {
        await editComment(editingCommentId, commentText.trim());
        setComments(prev =>
          prev.map(comment =>
            comment._id === editingCommentId ? { ...comment, comment_text: commentText.trim() } : comment
          )
        )
        setEditingCommentId(null);
      } else {
        const response = await createComment(postId, commentText.trim());

        if (response.data) {
          const newComment = response.data;
          setComments(prevComments => [...prevComments, newComment]);
          setCommentText('');

          // Update post comment count
          setPost(prevPost => ({
            ...prevPost,
            comment_count: (prevPost.comment_count || 0) + 1
          }));
          await fetchComments();
        }
      }
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Lỗi', 'Không thể đăng bình luận');
    } finally {
      setIsCommenting(false);
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Vừa xong';
      if (minutes < 60) return `${minutes} phút trước`;
      if (hours < 24) return `${hours} giờ trước`;
      if (days < 30) return `${days} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Không xác định';
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa bình luận này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(commentId);
              setComments(comments.filter(c => c._id !== commentId));
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa bình luận");
            }
          }
        }
      ]
    );
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.comment_text);
  };

  const renderComment = (comment) => {

    const commentUser = comment.user || {};
    const commentUserName = commentUser?.name || 'Người dùng không xác định';
    const commentUserAvatar = commentUser?.avatar_url || 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';

    return (
      <View key={comment._id} className="flex-row px-4 py-3 border-b border-gray-100">
        <Image
          source={{ uri: commentUserAvatar }}
          className="w-8 h-8 rounded-full mr-3 mt-1"
        />
        <View className="flex-1">
          <View className="bg-gray-100 rounded-2xl px-3 py-2">
            <Text className="font-semibold text-sm text-gray-800">
              {commentUserName}
            </Text>
            <Text className="text-gray-700 mt-1">{comment.content}</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1 ml-3">
            {formatTime(comment.created_at || comment.createdAt)}
          </Text>
        </View>
      </View>
    )
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-2 text-gray-600">Đang tải bài viết...</Text>
        </View>
      </SafeAreaView>
    )
  };

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Không tìm thấy bài viết</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* header */}
        <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-200 mt-4'>
          <TouchableOpacity className='p-2' onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className='text-lg font-semibold'>Chi Tiết Bài Viết</Text>
          <View className='flex-row'>
            <TouchableOpacity>
              {
                post.user_id?._id === userData?.id && <Edit size={18} color="blue" onPress={() => navigation.navigate('EditPost', { postId: post._id })} />
              }
            </TouchableOpacity>
            {userData?.id === post.user_id?._id && (
              <TouchableOpacity
                onPress={async () => {
                  Alert.alert(
                    "Xác nhận",
                    "Bạn có chắc muốn xóa bài viết này?",
                    [
                      { text: "Hủy", style: "cancel" },
                      {
                        text: "Xóa",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await deletePosts(post._id);
                            Alert.alert("Đã xóa bài viết");
                            navigation.goBack();
                          } catch (err) {
                            Alert.alert("Lỗi", "Không thể xóa bài viết");
                          }
                        }
                      }
                    ]
                  );
                }}
                style={{ marginLeft: 12 }}
              >

                <Trash size={18} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View className="p-4">
            {/* User Info */}
            <View className="flex-row items-center mb-3">
              <Image
                source={{ uri: userPost?.avatar_url }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-semibold text-base">{userPost?.name}</Text>
                <Text className="text-xs text-gray-500">
                  {formatTime(post.post_date)}
                </Text>
              </View>

            </View>

            {/* Post Title & Content */}
            <Text className="text-xl font-bold text-gray-800 mb-2">{post.title}</Text>
            <Text className="text-base text-gray-700 mb-3 leading-6">{post.content}</Text>

            {/* Post Image */}
            {post.image && (
              <Image
                source={{ uri: post.image }}
                className="w-full h-64 rounded-lg mb-3"
                resizeMode="cover"
              />
            )}

            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <Text
                  key={tag._id}
                  className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full"
                >
                  {tag.title}
                </Text>
              ))}
            </View>

            {/* Like & Comment Buttons */}
            <View className="flex-row items-center justify-between py-3 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleLike}
                disabled={isLiking}
                className="flex-row items-center flex-1 justify-center py-2"
              >
                <Heart
                  size={20}
                  color={isLiked ? "#dc2626" : "#6b7280"}
                  fill={isLiked ? "#dc2626" : "none"}
                />
                <Text className={`ml-2 ${isLiked ? 'text-red-600' : 'text-gray-600'}`}>
                  {likeCount} Thích
                </Text>
              </TouchableOpacity>

              <View className="w-px h-6 bg-gray-300" />

              <TouchableOpacity className="flex-row items-center flex-1 justify-center py-2">
                <MessageCircle size={20} color="#2563eb" />
                <Text className="ml-2 text-blue-600">{comments.length} Bình luận</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View className="border-t border-gray-200">
            <Text className="text-lg font-semibold p-4 pb-2">
            Bình luận ({Array.isArray(comments) ? comments.length : 0})
            </Text>

            {comments.map((comment) => {
              const isOwner = comment.user_id?._id === userData?.id;
              return (
                <View key={comment._id} className="flex-row px-4 py-3 border-b border-gray-100">
                  <Image
                    source={{ uri: comment.user_id.avatar_url }}
                    className="w-8 h-8 rounded-full mr-3 mt-1"
                  />
                  <View className="flex-1">
                    <View className="bg-gray-100 rounded-2xl px-3 py-2">
                      <View className="flex-row justify-between items-center">
                        <Text className="font-semibold text-sm text-gray-800">
                          {comment.user_id.name}
                        </Text>
                        {isOwner && (
                          <View className="flex-row">
                            <TouchableOpacity
                              onPress={() => handleEditComment(comment)}
                              className="ml-2"
                            >
                              <Text className="text-blue-500 text-xs">Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteComment(comment._id)}
                              className="ml-2"
                            >
                              <Text className="text-red-500 text-xs">Xóa</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-700 mt-1">{comment.comment_text}</Text>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1 ml-3">
                      {formatTime(comment.comment_date)}
                    </Text>
                  </View>
                </View>
              );
            })}
            {comments.length === 0 && (
              <View className="p-8 items-center">
                <MessageCircle size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-2">Chưa có bình luận nào</Text>
                <Text className="text-gray-400 text-sm">Hãy là người đầu tiên bình luận!</Text>
              </View>
            )}
          </View>
        </ScrollView>
        {/* Comment Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-gray-200 bg-white">
          <Image
            source={{ uri: userData.avatar_url }}
            className="w-8 h-8 rounded-full mr-3"
          />
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full">
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Viết bình luận..."
              className="flex-1 px-4 py-2 text-base"
              multiline
              maxLength={500}
            />
            {editingCommentId && (
              <TouchableOpacity
                onPress={() => {
                  setEditingCommentId(null);
                  setCommentText('');
                }}
              >
                <Text className='text-xs text-gray-500'>Hủy</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleComment}
              disabled={!commentText.trim() || isCommenting}
              className={`p-2 mr-2 ${commentText.trim() ? 'opacity-100' : 'opacity-50'}`}
            >
              {isCommenting ? (
                <ActivityIndicator size="small" color="#2563eb" />
              ) : (
                <Send size={20} color="#2563eb" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}