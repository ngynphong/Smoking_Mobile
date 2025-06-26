import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { getAllQuitPlanPublic } from '../../api/quitPlanApi';
import { getStagebyPlanId } from '../../api/stageApi';
import { getTasksbyStageId } from '../../api/taskApi';

const TaskItem = ({ task }) => (
  <View className="mb-2 p-3 bg-gray-100 rounded-md border border-gray-200">
    <Text className="font-semibold text-gray-800">• {task.title}</Text>
    <Text className="text-sm text-gray-600 mt-1">{task.description}</Text>
  </View>
);

const StageItem = ({ stage, tasks }) => (
  <View className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-200">
    <View className="mb-2">
      <Text className="text-lg font-bold text-blue-600">{stage.title}</Text>
      <Text className="text-sm text-gray-700 mt-1">{stage.description}</Text>
      <Text className="text-xs text-gray-500 mt-1">
        {new Date(stage.start_date).toLocaleDateString()} ➝ {new Date(stage.end_date).toLocaleDateString()}
      </Text>
    </View>
    <View className="mt-2">
      {tasks.map(task => <TaskItem key={task._id} task={task} />)}
    </View>
  </View>
);

const QuitPlanScreen = () => {
  const [plans, setPlans] = useState([]);
  const [stages, setStages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setError(null);
        const response = await getAllQuitPlanPublic();
        setPlans(response.data);

        const planIds = response.data.map(p => p._id);

        let allStages = [];
        for (const planId of planIds) {
          const stagesRes = await getStagebyPlanId(planId);
          allStages = allStages.concat(stagesRes.data.map(s => ({ ...s, plan_id: planId })));
        }
        setStages(allStages);

        const stageIds = allStages.map(s => s._id);

        // Lấy tasks cho từng stageId (nếu API không nhận mảng)
        let allTasks = [];
        for (const stageId of stageIds) {
          const tasksRes = await getTasksbyStageId(stageId);
          if (Array.isArray(tasksRes.data)) {
            allTasks = allTasks.concat(tasksRes.data);
          } else if (tasksRes.data) {
            allTasks.push(tasksRes.data);
          }
        }
        setTasks(allTasks);

      } catch (err) {
        setError('Không thể tải dữ liệu kế hoạch. Vui lòng thử lại sau.');
        console.error('Lỗi khi tải dữ liệu kế hoạch:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanData();
  }, []);

  if (isLoading) {
          return (
              <SafeAreaView className="flex-1 justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <View className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
                      <ActivityIndicator size="large" color="#8B5CF6" />
                      <Text className="mt-4 text-gray-700 font-medium">Đang tải...</Text>
                  </View>
              </SafeAreaView>
          );
      }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-xl text-red-500 font-semibold text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      <Text className="text-2xl font-bold text-center p-6">Kế hoạch cai thuốc</Text>
      {plans.length === 0 ? (
        <Text className="text-center text-gray-500">Không có kế hoạch nào để hiển thị.</Text>
      ) : (
        plans.map(plan => (
          <View key={plan._id} className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-100">
            <View className="p-4 rounded-xl">
              <Text className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</Text>
              <Text className="text-sm text-gray-700 mb-1">🎯 Lý do: {plan.reason}</Text>
              <Text className="text-xs text-gray-500">
                {new Date(plan.start_date).toLocaleDateString()} ➝ {new Date(plan.target_quit_date).toLocaleDateString()}
              </Text>
            </View>
            {stages
              .filter(stage => stage.plan_id === plan._id)
              .map(stage => (
                <StageItem
                  key={stage._id}
                  stage={stage}
                  tasks={tasks.filter(t => t.stage_id === stage._id)}
                />
              ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default QuitPlanScreen;