import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { editPosts, getPostsById } from '../../api/postApi';
import { getTags } from '../../api/tagAPi';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function EditPostScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { postId } = route.params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPostsById(postId);
                const post = res.data.post || res.data;
                setTitle(post.title);
                setContent(post.content);
                setImage(post.image);
                setSelectedTag(post.tags?.[0]?._id || '');
            } catch (err) {
                Alert.alert('Lỗi', 'Không thể tải bài viết');
            }
        };
        fetchData();
        const fetchTags = async () => {
            try {
                const res = await getTags();
                setTags(res.data || []);
            } catch (err) { }
        };
        fetchTags();
    }, [postId]);

    const handleEdit = async () => {
        if (!title.trim() || !content.trim() || !selectedTag) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập đày đủ thông tin',
                position: 'top',
            })
            return;
        }
        setLoading(true);
        try {
            const data = {
                title,
                content,
                image,
                tags: selectedTag,
            }

            await editPosts(postId, data);
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Đã sửa bài viết',
                position: 'top',
            });
            navigation.goBack();
        } catch (err) {
            console.log(err);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể sửa bài viết',
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <TouchableOpacity className='p-2 absolute top-4 left-4 z-20' onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className='text-center text-2xl font-bold mb-4 relative'>Sửa bài viết</Text>
            <Text className="text-lg font-bold mb-2">Tiêu đề</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề"
                className="border rounded px-3 py-2 mb-3"
            />
            <Text className="text-lg font-bold mb-2">Nội dung</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Nhập nội dung"
                multiline
                className="border rounded px-3 py-2 mb-3"
                style={{ minHeight: 80 }}
            />
            <Text className="text-lg font-bold mb-2">Ảnh (URL)</Text>
            <TextInput
                value={image}
                onChangeText={setImage}
                placeholder="Nhập link ảnh"
                className="border rounded px-3 py-2 mb-3"
            />
            {image ? (
                <Image source={{ uri: image }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 12 }} />
            ) : null}
            <Text className="text-lg font-bold mb-2">Tag</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {tags.map(tag => (
                    <TouchableOpacity
                        key={tag._id}
                        onPress={() => setSelectedTag(tag._id)}
                        style={{
                            backgroundColor: selectedTag === tag._id ? '#2563eb' : '#e0e7ef',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginRight: 8,
                        }}
                    >
                        <Text style={{ color: selectedTag === tag._id ? '#fff' : '#2563eb' }}>{tag.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity
                onPress={handleEdit}
                disabled={loading}
                style={{
                    backgroundColor: '#2563eb',
                    padding: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 12,
                    opacity: loading ? 0.7 : 1,
                }}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu thay đổi</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}