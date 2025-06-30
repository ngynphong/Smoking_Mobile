import { Text, TouchableOpacity } from "react-native";

export default function TaskItem({ task, completed, onComplete }) {
    return (
        <TouchableOpacity
            className={`mb-2 p-3 rounded-md border ${completed ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-200'}`}
            disabled={completed}
            onPress={() => onComplete(task._id)}
            activeOpacity={0.7}
        >
            <Text className={`font-semibold ${completed ? 'text-green-700' : 'text-gray-800'}`}>• {task.title}</Text>
            <Text className={`text-sm mt-1 ${completed ? 'text-green-600' : 'text-gray-600'}`}>{task.description}</Text>
        </TouchableOpacity>
    );
}
