import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../utils/authStorage';
import Icon from 'react-native-vector-icons/Ionicons';
import { editProfile, getProfile } from '../../api/userApi';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function ProfileDetail({ navigation }) {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar_url: ''
    });

    useEffect(() => {
        const loadUserData = async () => {
            const user = await getUser();
            const userProfile = await getProfile(user.id);
            setUser(userProfile.data.user);
            setFormData({
                name: userProfile.data.user.name || '',
                email: userProfile.data.user.email || '',
                avatar_url: userProfile.data.user.avatar_url || ''
            })
        }
        loadUserData();
    }, []);

    const handleSave = async () => {
        try {           
            await editProfile(formData, user.id);
            Toast.show({
                type: 'success',
                text1: 'Cập nhật thành công',
                text2: 'Thông tin cá nhân đã được cập nhật.',
                position: 'top',
            })
        } catch (error) {
            // console.error("Error updating profile:", error);
            Toast.show({
                type: 'error',
                text1: 'Cập nhật thất bại',
                text2: 'Đã có lỗi xảy ra khi cập nhật thông tin cá nhân.',
                position: 'top',
            });
        }
        setIsEditing(false);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Toast.show({
                type: 'error',
                text1: 'Quyền truy cập ảnh',
                text2: 'Vui lòng cấp quyền truy cập ảnh để thay đổi ảnh đại diện.',
                position: 'top',
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri;
            setFormData({ ...formData, avatar_url: selectedImage });
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-100'>
            {/* Header Section */}
            <View className='bg-white p-4 flex-row items-center justify-between mt-5'>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className='text-xl font-bold'>
                    Thông tin cá nhân
                </Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Icon name={isEditing ? "save" : "create"} size={24} color="#673ab7" />
                </TouchableOpacity>
            </View>
            {/* Avatar Section */}
            <View className='mb-6 items-center mt-4'>
                <TouchableOpacity
                    onPress={isEditing ? pickImage : null}
                    className="relative"
                >
                    <Image
                        source={{ uri: formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.name}&background=random` }}
                        className='w-32 h-32 rounded-full bg-blue-200'
                    />
                    {isEditing && (
                        <View className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full">
                            <Icon name="camera" size={20} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
                {isEditing && (
                    <Text className="text-purple-500 mt-2">
                        Nhấn vào ảnh để thay đổi
                    </Text>
                )}
            </View>
            {/* Name Input */}
            <ScrollView className='flex-1 p-4'>
                <View className='mb-4'>
                    <Text className='text-gray-600 mb-2'>Họ và tên</Text>
                    <TextInput
                        className={`p-2 border rounded-lg ${isEditing ? 'border-purple-500' : 'border-gray-200'}`}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        editable={isEditing}
                    />
                </View>
                {/* Email Input */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Email</Text>
                    <TextInput
                        className="p-2 border border-gray-200 rounded-lg bg-gray-100"
                        value={formData.email}
                        editable={false}
                    />
                </View>

                {isEditing && (
                    <TouchableOpacity onPress={handleSave} className="bg-purple-500 p-2 rounded-lg">
                        <Text className="text-white text-center">Lưu thay đổi</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}