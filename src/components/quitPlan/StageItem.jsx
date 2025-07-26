import { Text, TouchableOpacity, View } from "react-native";
import TaskItem from "./TaskItem";
import { ChevronDown, ChevronUp, Lock } from "lucide-react-native";

export default function StageItem({ stage, tasks, expanded, onToggle, onCompleteTask, isLocked, isCompleted }) {
    const containerClasses = `
    mb-6 p-6 rounded-xl border
    ${isLocked ? 'opacity-50 bg-gray-100 border-gray-200' :
    isCompleted ? 'bg-green-50 border-green-200' :
    'bg-white border-gray-200'
    }
  `;
    const titleClasses = `
    text-lg font-bold
    ${isCompleted ? 'text-green-700' : 'text-blue-600'}
  `;
    return (
        <View className={containerClasses}>
            <TouchableOpacity className="mb-2 flex-row items-center justify-between" onPress={isLocked ? null : onToggle} activeOpacity={isLocked ? 1 : 0.8}>
                <View>
                    <Text className={titleClasses}>{stage.title}</Text>
                    <Text className="text-sm text-gray-700 mt-1">{stage.description}</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        {new Date(stage.start_date).toLocaleDateString('vi-VN')} ➝ {new Date(stage.end_date).toLocaleDateString('vi-VN')}
                    </Text>
                    <View className="mt-2 flex-row flex-wrap">
                        <Text className="text-xs text-gray-600 mr-4">Giới hạn: <Text className="font-bold">{stage.cigarette_limit} điếu</Text></Text>
                        <Text className="text-xs text-gray-600 mr-4">Số lần thử lại: <Text className="font-bold">{stage.attempt_number}</Text></Text>
                        <Text className="text-xs text-gray-600">Đã hút: <Text className="font-bold">{stage.total_cigarettes_smoked} điếu</Text></Text>
                    </View>
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
