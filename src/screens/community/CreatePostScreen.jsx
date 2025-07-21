import { View, Text, ScrollView, TextInput, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getTags } from '../../api/tagAPi';
import { ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { createPosts } from '../../api/postApi';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
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
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Bài viết đã được tạo thành công',
                position: 'top',
            })
            navigation.goBack();
        } catch (err) {
            console.log(err);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tạo bài viết',
                position: 'top',
            })
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
                className='border-gray-300 border rounded-lg px-3 py-2 mb-3'
            />
            <Text className='text-lg font-bold mb-2'>Nội dung</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder='Nhập nội dung'
                multiline
                className='border-gray-300 border rounded-lg px-3 py-2 mb-3'
                style={{ minHeight: 80 }}
            />
            <TouchableOpacity
                onPress={async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Lỗi', 'Chúng tôi cần quyền truy cập vào thư viện ảnh của bạn!');
                        return;
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 1,
                    });
                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                    }
                }}
                style={{
                    backgroundColor: '#e0e7ef',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginBottom: 12,
                }}
            >
                <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>
                    {image ? 'Đổi ảnh' : 'Chọn ảnh từ thiết bị'}
                </Text>
            </TouchableOpacity>
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
                    borderRadius: 12,
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