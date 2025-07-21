import { Text, TouchableOpacity, View } from "react-native";
import TaskItem from "./TaskItem";
import { ChevronDown, ChevronUp, Lock } from "lucide-react-native";

export default function StageItem({ stage, tasks, expanded, onToggle, onCompleteTask, isLocked }) {
    return (
        <View className={`mb-6 p-6 bg-white rounded-xl border border-gray-200 ${isLocked ? 'opacity-50' : ''}`}>
            <TouchableOpacity className="mb-2 flex-row items-center justify-between" onPress={isLocked ? null : onToggle} activeOpacity={isLocked ? 1 : 0.8}>
                <View>
                    <Text className="text-lg font-bold text-blue-600">{stage.title}</Text>
                    <Text className="text-sm text-gray-700 mt-1">{stage.description}</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        {new Date(stage.start_date).toLocaleDateString('vi-VN')} ➝ {new Date(stage.end_date).toLocaleDateString('vi-VN')}
                    </Text>
                </View>
                {expanded ? <ChevronUp size={22} color="#2563eb" /> : <ChevronDown size={22} color="#2563eb" />}
            </TouchableOpacity>
            {isLocked && (
                <View className="flex-row items-center justify-center p-2 bg-yellow-100 rounded-lg mt-2">
                    <Lock size={16} color="#f59e0b" />
                    <Text className="text-yellow-700 ml-2 text-sm">Hoàn thành giai đoạn trước để mở khóa</Text>
                </View>
            )}
            {expanded && !isLocked && (
                <View className="mt-2">
                    {tasks.map(task => <TaskItem key={task._id} task={task} completed={task.completed} onComplete={onCompleteTask} />)}
                </View>
            )}
        </View>
    );
}
