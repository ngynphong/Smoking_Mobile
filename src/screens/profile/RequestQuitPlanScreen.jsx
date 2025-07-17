import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { getMyQuitPlanRequests, deleteQuitPlanRequest } from '../../api/quitPlanApi';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const RequestItem = ({ request, onDelete }) => {
    return (
        <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-bold text-blue-700 mb-1">{request.name}</Text>
            <Text className="text-sm text-gray-700">Lý do: {request.reason}</Text>
            <Text className="text-sm text-gray-600">
                Từ: {new Date(request.start_date).toLocaleDateString('vi-VN')} ➝ {new Date(request.target_quit_date).toLocaleDateString('vi-VN')}
            </Text>
            <Text className="text-sm mt-1 text-green-600">Trạng thái: {request.status}</Text>
            {request.status === 'pending' && (
                <View className="flex-row justify-end mt-3">
                    <TouchableOpacity
                        onPress={() => onDelete(request._id)}
                        className="bg-red-500 px-3 py-2 rounded-full"
                    >
                        <Text className="text-white text-sm font-semibold">Xóa</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
};

const RequestQuitPlanScreen = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchRequests = async () => {
        try {
            const res = await getMyQuitPlanRequests();
            setRequests(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách yêu cầu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteQuitPlanRequest(id);
            setRequests(prev => prev.filter(r => r._id !== id));
            alert('Đã xóa yêu cầu thành công');
        } catch (error) {
            alert('Lỗi khi xóa yêu cầu');
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
            <View className="flex-row justify-between items-center my-4">
                <TouchableOpacity className='' onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Yêu Cầu Kế Hoạch Đã Gửi</Text>
                <TouchableOpacity
                    className="bg-blue-600 px-4 py-2 rounded-full"
                    onPress={() => navigation.navigate('CreateQuitPlanRequest')}
                >
                    <Text className="text-white font-semibold">+ Tạo</Text>
                </TouchableOpacity>
            </View>

            {requests.length === 0 ? (
                <Text className="text-gray-600 text-center">Bạn chưa gửi yêu cầu nào.</Text>
            ) : (
                requests.map(req => (
                    <RequestItem key={req._id} request={req} onDelete={handleDelete} />
                ))
            )}
        </ScrollView>
    );
};

export default RequestQuitPlanScreen;
