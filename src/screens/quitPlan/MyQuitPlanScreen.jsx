import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { getQuitplanByUserId } from '../../api/quitPlanApi';
import { getUser } from '../../utils/authStorage';
import { getStagebyPlanId } from '../../api/stageApi';
import { completeTask, getTasksbyStageId, getTaskCompleted } from '../../api/taskApi';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import StageItem from '../../components/quitPlan/StageItem';
import Loading from '../../components/Loading';

export default function MyQuitPlanScreen() {
  const [plans, setPlans] = useState([]);
  const [stages, setStages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [expandedStages, setExpandedStages] = useState({});
  const [completedTaskIds, setCompletedTaskIds] = useState([]);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await getUser();
        const planRes = await getQuitplanByUserId(user.id);
        setPlans(planRes.data);

        const planIds = planRes.data.map(p => p._id);

        let allStages = [];
        for (const planId of planIds) {
          const stagesRes = await getStagebyPlanId(planId);
          allStages = allStages.concat(stagesRes.data.map(s => ({ ...s, plan_id: planId })));
        }
        setStages(allStages);

        const stageIds = allStages.map(s => s._id);

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

        let completed = [];
        for (const stageId of stageIds) {
          try {
            const res = await getTaskCompleted(stageId);
            // console.log('getTaskCompleted for', stageId, res.data);
            let arr = [];
            if (Array.isArray(res.data)) {
              arr = res.data;
            } else if (res.data) {
              arr = [res.data];
            }
            const completedIds = arr.filter(item => item.is_completed).map(item => item.task_id);
            completed = completed.concat(completedIds);
          } catch (err) {
            console.log('Error getTaskCompleted', stageId, err);
          }
        }
        setCompletedTaskIds(completed);
        // console.log('Completed task', completed);
      } catch (err) {
        setError('Không thể tải dữ liệu kế hoạch. Vui lòng thử lại sau.');
        console.error('Lỗi khi tải dữ liệu kế hoạch:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      setCompletedTaskIds(prev => [...prev, taskId]);
    } catch (e) {
      // Có thể hiện toast lỗi nếu muốn
    }
  };


  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-xl text-red-500 font-semibold text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-2 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
      <TouchableOpacity className='p-2 absolute top-5 z-20' onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-center  p-6">Kế hoạch cai thuốc của tôi</Text>

      {plans.length === 0 ? (
        <View>
          <Text className="text-center text-gray-500">Không có kế hoạch nào để hiển thị.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateQuitPlanRequest')} className='border border-blue-500 p-2 rounded-lg mx-auto w-1/2 mt-4'>
            <Text className="text-center text-blue-500 py-2">Yêu cầu tạo kế hoạch</Text>
          </TouchableOpacity>
        </View>
      ) : (
        plans.map(plan => (
          <View key={plan._id} className="mb-6 p-2 bg-white rounded-xl shadow border border-gray-100">
            <View className='flex-row'>
              <View className="p-4 rounded-xl">
                <Text className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</Text>
                <Text className="text-sm text-gray-700 mb-1">🎯 Lý do: {plan.reason}</Text>
                <Text className="text-xs text-gray-500">
                  {new Date(plan.start_date).toLocaleDateString()} ➝ {new Date(plan.target_quit_date).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity className='mt-2 left-[-75] border border-blue-500 h-10 rounded-xl' onPress={() => navigation.navigate('Feedback', { planId: plan._id, coachId: plan.coach_id })}>
                <Text className='text-center my-auto text-blue-500 p-2'>Đánh giá</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: plan.image }} className='h-52 w-full mb-2 rounded-xl' />
            {stages
              .filter(stage => stage.plan_id === plan._id)
              .map(stage => (
                <StageItem
                  key={stage._id}
                  stage={stage}
                  tasks={tasks.filter(t => t.stage_id === stage._id).map(task => ({
                    ...task,
                    completed: completedTaskIds.includes(task._id),
                  }))}
                  onCompleteTask={(taskId) => handleCompleteTask(taskId)}
                  expanded={!!expandedStages[stage._id]}
                  onToggle={() => setExpandedStages(prev => ({ ...prev, [stage._id]: !prev[stage._id] }))}
                />
              ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}