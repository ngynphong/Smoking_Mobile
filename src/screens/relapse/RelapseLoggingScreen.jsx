import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X, Plus, Minus } from 'lucide-react-native';
import { logRelapse } from '../../api/relapseAPI'; // API call mới
import Toast from 'react-native-toast-message';

const activities = [
    { label: 'Uống cà phê', value: 'drinking_coffee', icon: '☕️' },
    { label: 'Sau bữa ăn', value: 'after_meal', icon: '🍽️' },
    { label: 'Căng thẳng', value: 'stressful_work', icon: '💼' },
    { label: 'Gặp gỡ', value: 'socializing', icon: '👥' },
    { label: 'Buồn chán', value: 'bored', icon: '😴' },
    { label: 'Lái xe', value: 'driving', icon: '🚗' },
];

const emotions = [
    { label: 'Căng thẳng', value: 'stressed', icon: '😩' },
    { label: 'Lo lắng', value: 'anxious', icon: '😟' },
    { label: 'Buồn', value: 'sad', icon: '😔' },
    { label: 'Vui', value: 'happy', icon: '😊' },
    { label: 'Buồn chán', value: 'bored', icon: '🥱' },
];

const RelapseLoggingScreen = () => {
    const navigation = useNavigation();
    const [quantity, setQuantity] = useState(1);
    const [activity, setActivity] = useState(null);
    const [emotion, setEmotion] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogRelapse = async () => {
        setLoading(true);
        try {
            if (!activity || !emotion) {
                Toast.show({
                    type: 'error',
                    text1: 'Thiếu thông tin',
                    text2: 'Vui lòng chọn hoạt động và cảm xúc',
                    position: 'top',
                });
                return;
            }

            await logRelapse({
                cigarettes_smoked: quantity,
                activity: activity,
                emotion: emotion,
            });

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Cảm ơn bạn đã ghi nhận. Hãy tiếp tục cố gắng!',
                position: 'top',
                onHide: () => navigation.goBack()
            });

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể ghi nhận. Vui lòng thử lại sau.',
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 justify-end">
            <TouchableOpacity className="flex-1" onPress={() => navigation.goBack()} />
            <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">Bạn đang thèm thuốc ?</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                        <X size={24} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                {/* Phần 1: Số lượng */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-700 text-center mb-3">Bạn đã hút bao nhiêu điếu?</Text>
                    <View className="flex-row items-center justify-center">
                        <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 bg-gray-200 rounded-full">
                            <Minus size={28} color="#4b5563" />
                        </TouchableOpacity>
                        <Text className="text-5xl font-bold text-cyan-600 mx-8 w-16 text-center">{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(q => q + 1)} className="p-3 bg-gray-200 rounded-full">
                            <Plus size={28} color="#4b5563" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Phần 2: Ngữ cảnh */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-700 mb-3">Lúc đó bạn đang làm gì?</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {activities.map(act => (
                            <TouchableOpacity
                                key={act.value}
                                onPress={() => setActivity(act.value)}
                                className={`flex-row items-center rounded-full px-4 py-2 mr-2 border-2 ${activity === act.value ? 'bg-cyan-500 border-cyan-600' : 'bg-gray-200 border-gray-200'
                                    }`}
                            >
                                <Text className={`mr-2 ${activity === act.value ? 'text-gray-700' : ''}`}>{act.icon}</Text>
                                <Text className={`font-semibold ${activity === act.value ? 'text-gray-700' : 'text-gray-700'}`}>
                                    {act.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-700 mb-3">Bạn cảm thấy thế nào?</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {emotions.map(emo => (
                            <TouchableOpacity
                                key={emo.value}
                                onPress={() => setEmotion(emo.value)}
                                className={`flex-row items-center rounded-full px-4 py-2 mr-2 border-2 ${emotion === emo.value ? 'bg-cyan-500 border-cyan-600' : 'bg-gray-200 border-gray-200'
                                    }`}
                            >
                                <Text className={`mr-2 ${emotion === emo.value ? 'text-gray-700' : ''}`}>{emo.icon}</Text>
                                <Text className={`font-semibold ${emotion === emo.value ? 'text-gray-700' : 'text-gray-700'}`}>
                                    {emo.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Phần 3: Nút Lưu */}
                <TouchableOpacity
                    onPress={handleLogRelapse}
                    disabled={loading}
                    className="bg-blue-600 w-full py-4 rounded-xl items-center justify-center"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-bold uppercase">Ghi Nhận</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default RelapseLoggingScreen;