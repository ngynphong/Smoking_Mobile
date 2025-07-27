import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Gift, PaperAirplane, Sparkles, DevicePhoneMobile, AcademicCap, Pencil, Trash2 } from 'lucide-react-native';
import { getMyGoals, createGoal, updateGoal, deleteGoal } from '../api/financialGoalApi';
import Loading from '../components/Loading';
import GoalDashboardCard from '../components/GoalDashboardCard';
import Toast from 'react-native-toast-message';

// Các mục tiêu gợi ý
const suggestedGoals = [
    { title: 'Công nghệ mới', icon: '📱' },
    { title: 'Chuyến du lịch', icon: '✈️' },
    { title: 'Quà tặng', icon: '🎁' },
    { title: 'Khóa học', icon: '🎓' },
    { title: 'Tự thưởng', icon: '✨' },
];

// Thẻ hiển thị mục tiêu trên Dashboard

// Màn hình chính
const FinancialGoalScreen = () => {
    const navigation = useNavigation();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [customGoal, setCustomGoal] = useState({ title: '', target_amount: '', status: 'in-progress' });

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await getMyGoals();
            setGoals(res.data);
        } catch (error) {
            console.error("Lỗi khi tải mục tiêu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleCreateOrUpdateGoal = async () => {
        try {
            if (editingGoal) {
                // Cập nhật mục tiêu
                await updateGoal(editingGoal._id, {
                    title: customGoal.title,
                    target_amount: Number(customGoal.target_amount),
                    status: customGoal.status,
                });
            } else {
                // Tạo mục tiêu mới
                await createGoal({
                    title: customGoal.title,
                    target_amount: Number(customGoal.target_amount),
                });
            }
            setModalVisible(false);
            setEditingGoal(null);
            setCustomGoal({ title: '', target_amount: '', status: 'in-progress' });
            fetchGoals();
        } catch (error) {
            // console.error("Lỗi khi lưu mục tiêu:", error.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: error.response?.data || error.message,
            });
        }
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setCustomGoal({
            title: goal.title,
            target_amount: goal.target_amount.toString(),
            status: goal.status,
        });
        setModalVisible(true);
    };

    const handleDelete = (goalId) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa mục tiêu này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            await deleteGoal(goalId);
                            fetchGoals();
                        } catch (error) {
                            console.error("Lỗi khi xóa mục tiêu:", error);
                            Toast.show({
                                type: 'error',
                                text1: 'Lỗi',
                                text2: 'Không thể xóa mục tiêu. Vui lòng thử lại sau.',
                            });
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="p-6 flex-row items-center justify-center">
                {/* <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft size={24} color="#1f2937" />
                </TouchableOpacity> */}
                <Text className="text-2xl font-bold text-gray-800 ml-4">Mục tiêu Tài chính</Text>
            </View>

            <ScrollView className="p-4">
                {goals.length > 0 ? (
                    goals.map(goal => (
                        <GoalDashboardCard
                            key={goal._id}
                            goal={goal}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <View className="items-center justify-center bg-white p-8 rounded-2xl">
                        <Text className="text-lg text-center text-gray-600">Bạn chưa có mục tiêu nào. Hãy đặt ra một mục tiêu để có thêm động lực!</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                onPress={() => {
                    setEditingGoal(null);
                    setCustomGoal({ title: '', target_amount: '', status: 'in-progress' });
                    setModalVisible(true);
                }}
                className="absolute bottom-8 right-6 bg-cyan-500 rounded-full p-4 shadow-lg"
            >
                <Pencil size={24} color="white" />
            </TouchableOpacity>

            {/* Modal tạo mục tiêu */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setEditingGoal(null);
                    setCustomGoal({ title: '', target_amount: '', status: 'in-progress' });
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row items-center justify-between mb-4">                           
                            <Text className="text-2xl font-bold text-center ">
                                {editingGoal ? 'Chỉnh sửa mục tiêu' : 'Bạn đang tiết kiệm vì điều gì?'}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false);
                                setEditingGoal(null);
                                setCustomGoal({ title: '', target_amount: '', status: 'in-progress' });
                            }} className="">
                                <Text className="text-center text-2xl font-bold text-gray-500">X</Text>
                            </TouchableOpacity>
                        </View>


                        {!editingGoal && (
                            <View className="flex-row flex-wrap justify-center mb-6">
                                {suggestedGoals.map(goal => {
                                    const Icon = goal.icon;
                                    return (
                                        <TouchableOpacity
                                            key={goal.title}
                                            onPress={() => setCustomGoal({ ...customGoal, title: goal.title })}
                                            className="items-center p-3 m-2 bg-slate-100 rounded-xl w-24"
                                        >
                                            <Text className="text-3xl">{Icon}</Text>
                                            <Text className="mt-2 text-center text-xs font-semibold">{goal.title}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        <TextInput
                            placeholder="Tên mục tiêu của bạn (VD: Mua điện thoại mới)"
                            value={customGoal.title}
                            onChangeText={(text) => setCustomGoal({ ...customGoal, title: text })}
                            className="bg-slate-100 text-lg p-4 rounded-lg mb-4"
                        />
                        <TextInput
                            placeholder="Số tiền cần đạt (VNĐ)"
                            value={customGoal.target_amount}
                            onChangeText={(text) => setCustomGoal({ ...customGoal, target_amount: text })}
                            keyboardType="numeric"
                            className="bg-slate-100 text-lg p-4 rounded-lg mb-4"
                        />

                        {editingGoal && (
                            <View className="mb-6">
                                <Text className="text-lg font-semibold mb-2">Trạng thái</Text>
                                <View className="flex-row justify-around">
                                    <TouchableOpacity onPress={() => setCustomGoal({ ...customGoal, status: 'in-progress' })} className={`px-4 py-2 rounded-lg ${customGoal.status === 'in-progress' ? 'bg-teal-500' : 'bg-slate-200'}`}>
                                        <Text className={`${customGoal.status === 'in-progress' ? 'text-white' : 'text-black'}`}>Đang tiến hành</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setCustomGoal({ ...customGoal, status: 'completed' })} className={`px-4 py-2 rounded-lg ${customGoal.status === 'completed' ? 'bg-teal-500' : 'bg-slate-200'}`}>
                                        <Text className={`${customGoal.status === 'completed' ? 'text-white' : 'text-black'}`}>Hoàn thành</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}


                        <TouchableOpacity
                            onPress={handleCreateOrUpdateGoal}
                            className="bg-teal-500 py-4 rounded-xl"
                        >
                            <Text className="text-white text-center font-bold text-lg">
                                {editingGoal ? 'Lưu thay đổi' : 'Bắt đầu tiết kiệm'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false);
                            setEditingGoal(null);
                            setCustomGoal({ title: '', target_amount: '', status: 'in-progress' });
                        }} className="mt-4">
                            <Text className="text-center text-gray-500">Để sau</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default FinancialGoalScreen;
