import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Calendar, Target, Heart, Cigarette, TrendingDown, Plus, Edit3, TrashIcon } from 'lucide-react-native';
import { getQuitplanByUserId } from '../../api/quitPlanApi';
import { getStagebyPlanId } from '../../api/stageApi';
import { AuthContext } from '../../contexts/AuthContext';
import { createProgress, getProgressByPlan, getProgressByStage, getProgressOneStage, deleteProgress, updateProgress } from '../../api/progressApi';
import { useFocusEffect } from '@react-navigation/native';
import { TabBarContext } from '../../contexts/TabBarContext';

const ProgressScreen = () => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [stages, setStages] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [progressForm, setProgressForm] = useState({
    cigarettes_smoked: '',
    health_status: '',
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    time: new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) // Format: HH:mm
  });
  const { user } = useContext(AuthContext)
  const [stageProgressPercents, setStageProgressPercents] = useState({});
  const { setTabBarVisible } = useContext(TabBarContext);
  const lastScrollY = useRef(0);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedProgress, setSelectedProgress] = useState(null);

  const healthStatusOptions = [
    'Rất tốt - Không có triệu chứng',
    'Tốt - Ít ho, thở dễ hơn',
    'Ổn - Vẫn còn thèm thuốc nhẹ',
    'Khó khăn - Căng thẳng, thèm thuốc nhiều',
    'Rất khó - Gặp nhiều khó khăn'
  ];

  useFocusEffect(
    React.useCallback(() => {
      const fetchPlans = async () => {
        try {
          const res = await getQuitplanByUserId(user.id);
          setQuitPlans(res.data)
        } catch (error) {
          setQuitPlans([]);
        }
      };
      fetchPlans();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (selectedPlan) {
        const fetchStages = async () => {
          try {
            const res = await getStagebyPlanId(selectedPlan._id)
            setStages(res.data);

          } catch (error) {
            setStages([]);
          }
        };
        fetchStages();
      }
    }, [selectedPlan])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchAllStageProgresses = async () => {
        const progressesObj = {};
        for (const stage of stages) {
          try {
            const res = await getProgressByStage(stage._id);
            progressesObj[stage._id] = res.data; // mỗi stageId là 1 mảng progress
          } catch (err) {
            progressesObj[stage._id] = [];
          }
        }
        setProgresses(progressesObj);
      };
      if (stages.length > 0) fetchAllStageProgresses();
    }, [stages])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchStagePercents = async () => {
        if (stages.length > 0) {
          const percents = {};
          for (const stage of stages) {
            try {
              const res = await getProgressOneStage(stage._id);
              percents[stage._id] = res.data.progress_percent;
            } catch (err) {
              percents[stage._id] = 0;
            }
          }
          setStageProgressPercents(percents);
        }
      };
      fetchStagePercents();
    }, [stages, progresses])
  );

  const getStageStatus = (stage) => {
    const percent = stageProgressPercents[stage._id] || 0;
    if (percent >= 100) return 'completed';
    if (percent > 0) return 'in_progress';
    return 'not_started';
  };

  const getStageCompletion = (stage) => {
    return Math.min(stageProgressPercents[stage._id] || 0, 100);
  };

  const getLatestProgress = (stageId) => {
    const stageProgresses = Array.isArray(progresses[stageId]) ? progresses[stageId] : [];
    if (!stageProgresses.length) return undefined;
    return stageProgresses.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  const handleCreateProgress = async () => {
    if (!currentStage || !progressForm.cigarettes_smoked) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const [hours, minutes] = progressForm.time.split(':');
    const dateTime = new Date(progressForm.date);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const newProgress = {
      stage_id: currentStage._id,
      date: dateTime.toISOString(),
      cigarettes_smoked: parseInt(progressForm.cigarettes_smoked),
      health_status: progressForm.health_status,
      user_id: user.id
    };
    try {
      await createProgress(newProgress);
      const progressesObj = {};
      for (const stage of stages) {
        try {
          const res = await getProgressByStage(stage._id);
          progressesObj[stage._id] = res.data;
        } catch (err) {
          progressesObj[stage._id] = [];
        }
      }
      setProgresses(progressesObj);
      setShowProgressModal(false);
      setProgressForm({
        cigarettes_smoked: '',
        health_status: '',
        date: new Date().toISOString().split('T')[0]
      });
      Alert.alert('Thành công', 'Đã ghi nhận tiến trình hôm nay!');
    } catch (error) {
      let message = 'Không thể ghi nhận tiến trình';
      if (error?.response?.data?.error) message = error.response.data.error;
      if (error?.response?.data?.message) message = error.response.data.message;
      Alert.alert(message);
    }
  };

  const handleUpdateProgress = async () => {
    if (!currentStage || !progressForm.cigarettes_smoked) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      // Đảm bảo selectedProgress có tồn tại khi trong chế độ edit
      if (!selectedProgress?._id) {
        Alert.alert('Lỗi', 'Không tìm thấy tiến trình cần cập nhật');
        return;
      }

      const [hours, minutes] = progressForm.time.split(':');
      const dateTime = new Date(progressForm.date);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const updatedProgress = {
        stage_id: currentStage._id,
        date: dateTime.toISOString(),
        cigarettes_smoked: parseInt(progressForm.cigarettes_smoked),
        health_status: progressForm.health_status
      };

      const res = await updateProgress(selectedProgress._id, updatedProgress);
      // Cập nhật lại danh sách progress
      const progressesObj = {};
      for (const stage of stages) {
        try {
          const res = await getProgressByStage(stage._id);
          progressesObj[stage._id] = res.data;
        } catch (err) {
          progressesObj[stage._id] = [];
        }
      }
      setProgresses(progressesObj);

      setShowProgressModal(false);
      setModalMode('create');
      setSelectedProgress(null);
      Alert.alert('Thành công', 'Đã cập nhật tiến trình!');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật tiến trình');
    }
  };

  const openProgressModal = (stage) => {
    const today = new Date().toISOString().split('T')[0];
    const stageProgressArr = Array.isArray(progresses[stage._id]) ? progresses[stage._id] : [];
    const existingProgress = stageProgressArr.find(
      p => p.stage_id === stage._id && p.date === today
    );
    setCurrentStage(stage);
    setProgressForm({
      cigarettes_smoked: existingProgress?.cigarettes_smoked?.toString() || '',
      health_status: existingProgress?.health_status || '',
      date: today
    });
    // setModalMode('create');
    setShowProgressModal(true);
  };

  // const openEditProgressModal = (progress) => {
  //   setSelectedProgress(progress);
  //   setCurrentStage(stages.find(s => s._id === progress.stage_id));
  //   setProgressForm({
  //     cigarettes_smoked: progress.cigarettes_smoked.toString(),
  //     health_status: progress.health_status,
  //     date: new Date(progress.date).toISOString().split('T')[0]
  //   });
  //   setModalMode('edit');
  //   setShowProgressModal(true);
  // };

  const handleDeleteProgress = async (progressId) => {
    try {
      await deleteProgress(progressId);
      // Cập nhật lại danh sách progress
      const progressesObj = {};
      for (const stage of stages) {
        try {
          const res = await getProgressByStage(stage._id);
          progressesObj[stage._id] = res.data;
        } catch (err) {
          progressesObj[stage._id] = [];
        }
      }
      setProgresses(progressesObj);
      Alert.alert('Thành công', 'Đã xóa tiến trình!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa tiến trình');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-500';
      case 'in_progress': return 'bg-blue-100 border-blue-500';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700';
      case 'in_progress': return 'text-blue-700';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
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
        {/* Header */}
        <View className="bg-white p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Cai thuốc lá thành công
          </Text>
          <Text className="text-gray-600">
            Theo dõi hành trình cai thuốc của bạn
          </Text>
        </View>

        {/* Plans List */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Kế hoạch cai thuốc
          </Text>

          {quitPlans.map(plan => (
            <TouchableOpacity
              key={plan._id}
              className={`mb-4 p-4 rounded-lg border-2 ${selectedPlan?._id === plan._id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
                }`}
              onPress={() => setSelectedPlan(plan)}
            >
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {plan.name}
              </Text>
              <Text className="text-gray-600 mb-3">
                {plan.reason}
              </Text>
              <View className="flex-row text-xs text-gray-500">
                <Text className='text-xs text-gray-500'>Từ {formatDate(plan.start_date)}</Text>
                <Text className='text-xs text-gray-500'> đến {formatDate(plan.target_quit_date)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stages */}
        {selectedPlan && (
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Các giai đoạn: {selectedPlan.name}
            </Text>

            {stages.map((stage, idx) => {
              const status = getStageStatus(stage);
              const completion = getStageCompletion(stage);
              // Giai đoạn đầu luôn mở, các giai đoạn sau chỉ mở nếu tất cả stage trước đã completed
              let isLocked = false;
              if (stage.stage_number > 1) {
                isLocked = stages
                  .filter(s => s.stage_number < stage.stage_number)
                  .some(s => getStageStatus(s) !== 'completed');
              }
              // const avgCigarettes = getAverageCigarettes(stage._id);
              const latestProgress = getLatestProgress(stage._id);
              const duration = Math.round((new Date(stage.end_date) - new Date(stage.start_date)) / (1000 * 60 * 60 * 24)) + 1;

              return (
                <View
                  key={stage._id}
                  className={`mb-4 p-4 rounded-lg border-2 ${getStatusColor(status)} ${isLocked ? 'opacity-60' : ''}`}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800 mb-1">
                        {stage.title}
                      </Text>
                      <Text className='text-sm font-medium'>
                        Giai đoạn {stage.stage_number}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Từ {formatDate(stage.start_date)} đến {formatDate(stage.end_date)}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="mb-3 flex-row justify-center items-center">
                    <Text className='text-sm text-gray-500 mr-2'>{completion} %</Text>
                    <View className="w-[90%] bg-gray-200 rounded-full h-2 ">
                      <View
                        className={`h-2 rounded-full ${status === 'completed' ? 'bg-green-500' :
                          status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                        style={{ width: `${completion}%` }}
                      />

                    </View>

                  </View>

                  {/* Stats */}
                  {status !== 'not_started' && (
                    <View className="flex-row justify-between mb-3">
                      <View className="flex-row items-center">
                        <Cigarette size={16} color="#ef4444" />
                        <Text className="text-sm text-gray-600 ml-1">

                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Latest Status */}
                  {latestProgress && (
                    <View className="mb-3 p-2 bg-gray-50 rounded">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500 mb-1">
                          Cập nhật cuối ({formatDate(latestProgress.date)}):
                        </Text>
                        {status !== 'completed' && (
                          <View className="flex-row">
                            <TouchableOpacity
                              onPress={() => {
                                setModalMode('edit');
                                setSelectedProgress(latestProgress);
                                const date = new Date(latestProgress.date);
                                setProgressForm({
                                  date: date.toISOString().split('T')[0],
                                  time: date.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                  }),
                                  cigarettes_smoked: latestProgress.cigarettes_smoked.toString(),
                                  health_status: latestProgress.health_status
                                });
                                setCurrentStage(stage);
                                setShowProgressModal(true);
                              }}
                              className="mr-2"
                            >
                              <Edit3 size={16} color="#3b82f6" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  'Xác nhận xóa',
                                  'Bạn có chắc muốn xóa tiến trình này?',
                                  [
                                    { text: 'Hủy', style: 'cancel' },
                                    { text: 'Xóa', style: 'destructive', onPress: () => handleDeleteProgress(latestProgress._id) },
                                  ]
                                );
                              }}
                            >
                              <TrashIcon size={16} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-gray-700">
                        {latestProgress.cigarettes_smoked} điếu - {latestProgress.health_status}
                      </Text>
                      {latestProgress.money_saved !== undefined && (
                        <Text className="text-xs text-green-700">Tiền tiết kiệm: {latestProgress.money_saved}đ</Text>
                      )}
                    </View>
                  )}

                  {/* Action Button */}
                  {!isLocked && status !== 'completed' && (
                    <TouchableOpacity
                      className="bg-blue-500 py-2 px-4 rounded-lg flex-row items-center justify-center"
                      onPress={() => openProgressModal(stage)}
                    >
                      <Plus size={16} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        Ghi nhận tiến trình
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isLocked && (
                    <View className="bg-yellow-100 py-2 px-4 rounded-lg">
                      <Text className="text-yellow-700 text-center text-sm">
                        🔒 Hoàn thành giai đoạn trước để mở khóa
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Progress Modal */}
        <Modal
          visible={showProgressModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowProgressModal(false);
            setModalMode('create');
            setSelectedProgress(null);
          }}
        >
          <View className="flex-1 bg-opacity-50 justify-end shadow-md">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  {modalMode === 'create' ? 'Ghi nhận tiến trình' : 'Cập nhật tiến trình'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowProgressModal(false);
                    setModalMode('create');
                    setSelectedProgress(null);
                  }}
                  className="p-2"
                >
                  <Text className="text-gray-500 text-lg">✕</Text>
                </TouchableOpacity>
              </View>

              {currentStage && (
                <View className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <Text className="font-semibold text-blue-800">
                    {currentStage.title}
                  </Text>
                  <Text className="text-blue-600 text-sm">
                    Giai đoạn {currentStage.stage_number}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Từ {formatDate(currentStage.start_date)} đến {formatDate(currentStage.end_date)}
                  </Text>
                </View>
              )}

              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Ngày ghi nhận
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-gray-800"
                  value={progressForm.date}
                  onChangeText={(text) => setProgressForm(prev => ({ ...prev, date: text }))}
                  placeholder="dd/mm/yyyy"
                />
              </View>
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Thời gian
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-gray-800"
                  value={progressForm.time}
                  onChangeText={(text) => setProgressForm(prev => ({ ...prev, time: text }))}
                  placeholder="HH:mm"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">
                  Số điếu thuốc đã hút <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-gray-800"
                  value={progressForm.cigarettes_smoked}
                  onChangeText={(text) => setProgressForm(prev => ({ ...prev, cigarettes_smoked: text }))}
                  placeholder="Nhập số điếu thuốc"
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">
                  Tình trạng sức khỏe
                </Text>
                <ScrollView className="max-h-32">
                  {healthStatusOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 border border-gray-200 rounded-lg mb-2 ${progressForm.health_status === option ? 'bg-blue-50 border-blue-500' : 'bg-white'
                        }`}
                      onPress={() => setProgressForm(prev => ({ ...prev, health_status: option }))}
                    >
                      <Text className={`${progressForm.health_status === option ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
                  onPress={() => {
                    setShowProgressModal(false);
                    setModalMode('create');
                    setSelectedProgress(null);
                  }}
                >
                  <Text className="text-gray-700 text-center font-semibold">
                    Hủy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-blue-500 py-3 rounded-lg"
                  onPress={modalMode === 'create' ? handleCreateProgress : handleUpdateProgress}
                >
                  <Text className="text-white text-center font-semibold">
                    {modalMode === 'create' ? 'Lưu tiến trình' : 'Cập nhật'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressScreen;