import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';
import { cloneQuitPlanPublic, getAllQuitPlanPublic } from '../../api/quitPlanApi';
import { getStagebyPlanId } from '../../api/stageApi';
import { getTasksbyStageId } from '../../api/taskApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Loading from '../../components/Loading';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { TabBarContext } from '../../contexts/TabBarContext';
import Toast from 'react-native-toast-message';

const TaskItem = ({ task }) => (
  <View className="mb-2 p-3 bg-gray-100 rounded-md border border-gray-200">
    <Text className="font-semibold text-gray-800">• {task.title}</Text>
    <Text className="text-sm text-gray-600 mt-1">{task.description}</Text>
  </View>
);

const StageItem = ({ stage, tasks, expanded, onToggle }) => (
  <View className="mb-6 p-6 bg-white rounded-xl border border-gray-200">
    <TouchableOpacity className="mb-2 flex-row items-center justify-between" onPress={onToggle} activeOpacity={0.8}>
      <View>
        <Text className="text-lg font-bold text-blue-600">{stage.title}</Text>
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
    {expanded && (
      <View className="mt-2">
        {tasks.map(task => <TaskItem key={task._id} task={task} />)}
      </View>
    )}
  </View>
);

const QuitPlanScreen = () => {
  const [plans, setPlans] = useState([]);
  const [stages, setStages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [expandedPlans, setExpandedPlans] = useState({});
  const [expandedStages, setExpandedStages] = useState({});
  const { setTabBarVisible } = useContext(TabBarContext);
  const lastScrollY = useRef(0);
  useFocusEffect(
    React.useCallback(() => {
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
    }, [])
  );

  const handleCloneQuitPlan = async (id) => {
    try {
      await cloneQuitPlanPublic(id);
      navigation.navigate('MyQuitPlan')
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: err.response.data.message,
        position: 'top',
      });
      // console.log('Lỗi khi clone kế hoạch',err)
    } 
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-xl text-red-500 font-semibold text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className='flex-1'>
      <ScrollView 
      className="flex-1 bg-gray-50 px-2 pt-4"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        onScroll={(e) => {
          const currentScrollY = e.nativeEvent.contentOffset.y;
          if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
            setTabBarVisible(false);
          } else {
            setTabBarVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-center p-6">Kế hoạch cai thuốc</Text>
        {plans.length === 0 ? (
          <View>
            <Text className="text-center text-gray-500">Không có kế hoạch nào để hiển thị.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateQuitPlanRequest')} className='border border-blue-500 p-2 rounded-lg mx-auto w-1/2 mt-4'>
              <Text className="text-center text-blue-500 py-2">Yêu cầu tạo kế hoạch</Text>
            </TouchableOpacity>
          </View>
        ) : (
          plans.map(plan => {
            const isPlanExpanded = !!expandedPlans[plan._id];
            return (
              <View key={plan._id} className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <TouchableOpacity onPress={() => setExpandedPlans(prev => ({ ...prev, [plan._id]: !prev[plan._id] }))} activeOpacity={0.9}>
                  <View className='flex-row justify-between items-center'>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 mb-1">{plan.name}</Text>
                      <Text className="text-sm text-gray-700 mb-2">🎯 Lý do: {plan.reason}</Text>
                      <Text className="text-xs text-gray-500">
                        {new Date(plan.start_date).toLocaleDateString('vi-VN')} ➝ {new Date(plan.target_quit_date).toLocaleDateString('vi-VN')}
                      </Text>                    
                    </View>
                    

                    <View className="flex-row items-center">
                      <TouchableOpacity className='border border-blue-500 h-10 rounded-xl mr-4' onPress={() => handleCloneQuitPlan(plan._id)}>
                        <Text className='text-center my-auto text-blue-500 p-2'>Sử dụng</Text>
                      </TouchableOpacity>
                      {isPlanExpanded ? <ChevronUp size={24} color="#374151" /> : <ChevronDown size={24} color="#374151" />}
                    </View>                   
                  </View>
                  <Image source={{ uri: plan.image }} className='h-52 w-full mb-2 rounded-xl mt-3' />
                </TouchableOpacity>

                {isPlanExpanded && (
                  <View className="mt-4">
                    {stages
                      .filter(stage => stage.plan_id === plan._id)
                      .map(stage => (
                        <StageItem
                          key={stage._id}
                          stage={stage}
                          tasks={tasks.filter(t => t.stage_id === stage._id)}
                          expanded={!!expandedStages[stage._id]}
                          onToggle={() => setExpandedStages(prev => ({ ...prev, [stage._id]: !prev[stage._id] }))}
                        />
                      ))}
                  </View>
                )}
              </View>
            )
          })
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('MyQuitPlan')}
        className="absolute bottom-24 right-2 bg-blue-500 rounded-full px-3 py-2 flex-row items-center shadow-lg shadow-blue-400/40 active:opacity-80"
        activeOpacity={0.85}
      >
        <Ionicons name="person-circle-outline" size={24} color="#fff" style={{ marginRight: 6 }} />
        <Text className="text-white font-bold text-base ml-1">Kế hoạch của tôi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuitPlanScreen;
