import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getUser } from '../../utils/authStorage';
import { createSmokingStatus, deleteSmokingStatus, getSmokingStatus } from '../../api/smokingStatusApi';
import { ArrowLeft } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const SmokingStatusScreen = () => {
    const [form, setForm] = useState({
        frequency: 'daily',
        cigarettes_per_day: '',
        cost_per_pack: '',
        start_date: new Date(),
    });
    const [status, setStatus] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    useFocusEffect(
        React.useCallback(() => {
            const fetchStatus = async () => {
                try {
                    const user = await getUser();
                    const res = await getSmokingStatus(user.id);
                    if (res?.data.smokingStatus) {
                        setStatus(res.data.smokingStatus);
                    } else {
                        setStatus(null);
                    }
                } catch (error) {
                    setStatus(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchStatus();
        }, [])
    )

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        try {
            const user = await getUser();
            const payload = {
                ...form,
                cigarettes_per_day: Number(form.cigarettes_per_day),
                cost_per_pack: Number(form.cost_per_pack),
                start_date: form.start_date.toISOString().split('T')[0],
            };
            const res = await createSmokingStatus(user.id, payload);
            setStatus(res.data);
            setShowModal(false);
            alert('Đã lưu trạng thái hút thuốc thành công');
        } catch (error) {
            alert('Có lỗi xảy ra, vui lòng thử lại.');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            const user = await getUser();
            await deleteSmokingStatus(user.id);
            setStatus(null);
            setShowModal(true);
            alert('Đã xóa trạng thái thành công');
        } catch (error) {
            alert('Xóa thất bại');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Đang tải...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
            <TouchableOpacity className='p-2 absolute z-20 top-2' onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-2xl mt-2 font-bold text-center mb-6 text-gray-800">Tình Trạng Hút Thuốc</Text>

            {status ? (
                <View className="bg-white p-6 rounded-xl shadow">
                    {/* <Text className="text-base mb-2 text-gray-700">Tần suất hút: <Text className="font-semibold">{status.frequency}</Text></Text> */}
                    <Text className="text-base mb-2 text-gray-700">Số điếu hút mỗi ngày: <Text className="font-semibold">{status.cigarettes_per_day}</Text></Text>
                    <Text className="text-base mb-2 text-gray-700">Giá mỗi bao: <Text className="font-semibold">{status.cost_per_pack} VNĐ</Text></Text>
                    <Text className="text-base mb-2 text-gray-700">Ngày bắt đầu cai: <Text className="font-semibold">{new Date(status.start_date).toLocaleDateString('vi-VN')}</Text></Text>

                    <TouchableOpacity
                        onPress={handleDelete}
                        className="mt-4 bg-red-600 rounded-full py-3"
                    >
                        <Text className="text-center text-white font-semibold">Xóa Thông Tin</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="bg-white p-6 rounded-xl shadow items-center">
                    <Text className="text-base text-gray-700 mb-4">Chưa có thông tin tình trạng hút thuốc.</Text>
                    <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        className="bg-blue-500 rounded-lg py-3 px-6"
                    >
                        <Text className="text-white font-semibold">Thêm Thông Tin</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={showModal} animationType="slide">
                <ScrollView className="flex-1 bg-white px-4 py-6">
                    <Text className="text-xl font-bold text-center mb-6 text-gray-800">Thêm Tình Trạng Hút Thuốc</Text>


                    <Text className="text-sm text-gray-700 mb-2">Số điếu mỗi ngày:</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Ví dụ: 20"
                        value={form.cigarettes_per_day.toString()}
                        onChangeText={value => handleChange('cigarettes_per_day', value)}
                        className="mb-4 border border-gray-300 rounded px-3 py-2"
                    />

                    <Text className="text-sm text-gray-700 mb-2">Giá mỗi bao thuốc (VNĐ):</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Ví dụ: 30000"
                        value={form.cost_per_pack.toString()}
                        onChangeText={value => handleChange('cost_per_pack', value)}
                        className="mb-4 border border-gray-300 rounded px-3 py-2"
                    />

                    <Text className="text-sm text-gray-700 mb-2">Ngày bắt đầu hút thuốc:</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="mb-4 border border-gray-300 rounded px-3 py-2 bg-white"
                    >
                        <Text className="text-gray-700">{new Date(form.start_date).toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={form.start_date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) handleChange('start_date', selectedDate);
                            }}
                        />
                    )}

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="mt-4 bg-blue-600 rounded-full py-3"
                    >
                        <Text className="text-center text-white font-semibold">Lưu Thông Tin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        className="mt-3 bg-gray-200 rounded-full py-3"
                    >
                        <Text className="text-center text-gray-700 font-semibold">Huỷ</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
        </ScrollView>
    );
};

export default SmokingStatusScreen;
