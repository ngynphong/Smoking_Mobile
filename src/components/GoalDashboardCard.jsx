import { useEffect, useState } from "react";
import { getGoalProgress } from "../api/financialGoalApi";
import { Text, View, TouchableOpacity } from "react-native";
import * as Progress from 'react-native-progress';
import { Pencil, Trash2 } from "lucide-react-native";

export default function GoalDashboardCard({ goal, onEdit, onDelete }) {
    const [progress, setProgress] = useState(0);
    const [moneySaved, setMoneySaved] = useState(0);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await getGoalProgress(goal._id);
                setProgress(res.data.percentage || 0);
                setMoneySaved(res.data.money_saved || 0);
            } catch (error) {
                console.error("Lỗi khi lấy tiến độ mục tiêu:", error);
            }
        };
        fetchProgress();
    }, [goal]);

    return (
        <View className="bg-white p-5 rounded-2xl shadow-md mb-6">
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="text-xl font-bold text-gray-800">{goal.title}</Text>
                    <Text className="text-gray-500">Mục tiêu của bạn</Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => onEdit(goal)} className="p-2">
                        <Pencil size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(goal._id)} className="p-2 ml-2">
                        <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="my-4">
                <Progress.Bar
                    progress={progress / 100}
                    width={null}
                    height={12}
                    color={'#14b8a6'}
                    unfilledColor={'#f1f5f9'}
                    borderWidth={0}
                    borderRadius={10}
                />
            </View>
            <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-teal-600">{moneySaved.toLocaleString('vi-VN')}đ</Text>
                <Text className="text-lg font-semibold text-gray-500">{goal.target_amount.toLocaleString('vi-VN')}đ</Text>
            </View>
            <Text className="text-center text-gray-500 mt-4 italic">Bạn đã gần hơn với mục tiêu rồi!</Text>
        </View>
    );
};
