import { View, Text, ScrollView, TextInput, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getTags } from '../../api/tagAPi';
import { ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { createPosts } from '../../api/postApi';

export default function CreatePostScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await getTags();
                setTags(res.data || [])
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể tải danh sách tag')
            }
        }
        fetchTags();
    }, []);
    const handleCreate = async () => {
        if (!title.trim() || !content.trim() || !selectedTag) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
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
            console.log(data)
            await createPosts(data);
            Alert.alert('Thành công', 'Đã tạo bài viết mới');
            navigation.goBack();
        } catch (err) {
            console.log(err);
            Alert.alert('Lỗi', 'Không thể tạo bài viết');
        } finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>

            <TouchableOpacity className='p-2 absolute top-4 left-4 z-20' onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className='text-center text-2xl font-bold mb-4 relative'>Tạo bài viết</Text>

            <Text className='text-lg font-bold mb-2'>Tiêu đề</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder='Nhập tiêu đề'
                className='border rounded px-3 py-2 mb-3'
            />
            <Text className='text-lg font-bold mb-2'>Nội dung</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder='Nhập nội dung'
                multiline
                className='border rounded px-3 py-2 mb-3'
                style={{ minHeight: 80 }}
            />
            <Text className='text-lg font-bold mb-2'>Ảnh (URL)</Text>
            <TextInput
                value={image}
                onChangeText={setImage}
                placeholder='Nhập URL'
                className='border rounded px-3 py-2 mb-3'
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
                onPress={handleCreate}
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
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đăng bài</Text>}
            </TouchableOpacity>
        </ScrollView>
    )
}