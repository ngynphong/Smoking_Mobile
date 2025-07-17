import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllCoaches } from '../../api/coachApi';
import { ArrowLeft } from 'lucide-react-native';
import { sendRequestQuitPlan } from '../../api/quitPlanApi';
import { useNavigation } from '@react-navigation/native';
import CoachCard from '../../components/CoachCard';

const CreateQuitPlanRequest = () => {
    const [coaches, setCoaches] = useState([]);
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [form, setForm] = useState({ name: '', reason: '', start_date: new Date(), target_quit_date: new Date() });
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const res = await getAllCoaches();
                setCoaches(res.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách huấn luyện viên:', error);
            }
        };
        fetchCoaches();
    }, []);

    const handleChange = (field, value) => setForm({ ...form, [field]: value });

    const handleSubmit = async () => {
        if (!selectedCoachId || !form.name || !form.reason) {
            return Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin và chọn huấn luyện viên.');
        }

        // Check if start date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (form.start_date < today) {
            return Alert.alert('Ngày không hợp lệ', 'Ngày bắt đầu không thể là ngày trong quá khứ.');
        }

        // Check if target date is before start date
        if (form.target_quit_date < form.start_date) {
            return Alert.alert('Ngày không hợp lệ', 'Ngày mục tiêu cai không thể sớm hơn ngày bắt đầu.');
        }

        try {
            const payload = {
                name: form.name,
                reason: form.reason,
                start_date: form.start_date,
                target_quit_date: form.target_quit_date,
                coach_id: selectedCoachId,
            };
            await sendRequestQuitPlan(payload);
            Alert.alert('Thành công', 'Yêu cầu của bạn đã được gửi');
        } catch (error) {
            console.error(error);
            Alert.alert('Thất bại', 'Không thể gửi yêu cầu');
        }
    };

    // Add date validation handlers
    const handleStartDateChange = (e, date) => {
        setShowStartDatePicker(false);
        if (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date < today) {
                Alert.alert('Ngày không hợp lệ', 'Không thể chọn ngày trong quá khứ.');
                return;
            }

            handleChange('start_date', date);
            // If target date is before new start date, update target date
            if (form.target_quit_date < date) {
                handleChange('target_quit_date', date);
            }
        }
    };

    const handleTargetDateChange = (e, date) => {
        setShowTargetDatePicker(false);
        if (date) {
            if (date < form.start_date) {
                Alert.alert('Ngày không hợp lệ', 'Ngày mục tiêu cai không thể sớm hơn ngày bắt đầu.');
                return;
            }
            handleChange('target_quit_date', date);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
            {/* <TouchableOpacity className='p-2 absolute z-20 top-1' onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity> */}
            <Text className="text-2xl font-bold text-center text-gray-800 mb-4 mt-4">Gửi Yêu Cầu Tạo Kế Hoạch</Text>

            <Text className="text-sm text-gray-700 mb-1">Tên kế hoạch:</Text>
            <TextInput className="border rounded-lg border-gray-200 px-3 py-2 mb-4" placeholder="Nhập tên kế hoạch" value={form.name} onChangeText={(v) => handleChange('name', v)} />

            <Text className="text-sm text-gray-700 mb-1">Lý do:</Text>
            <TextInput className="border rounded-lg border-gray-200 px-3 py-2 mb-4" placeholder="Nhập lý do" value={form.reason} onChangeText={(v) => handleChange('reason', v)} />

            <Text className="text-sm text-gray-700 mb-1">Ngày bắt đầu:</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} className="mb-4 border px-3 py-2 rounded-lg border-gray-200 bg-white">
                <Text>{form.start_date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
                <DateTimePicker
                    value={form.start_date}
                    mode="date"
                    minimumDate={new Date()}
                    onChange={handleStartDateChange}
                />
            )}

            <Text className="text-sm text-gray-700 mb-1">Ngày mục tiêu cai:</Text>
            <TouchableOpacity onPress={() => setShowTargetDatePicker(true)} className="mb-4 border px-3 py-2 rounded-lg border-gray-200 bg-white">
                <Text>{form.target_quit_date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showTargetDatePicker && (
                <DateTimePicker
                    value={form.target_quit_date}
                    mode="date"
                    minimumDate={form.start_date}
                    onChange={handleTargetDateChange}
                />
            )}
            
            <Text className="text-lg font-semibold text-gray-800 mb-2">Chọn Huấn Luyện Viên:</Text>
            {coaches.map(coach => (
                <CoachCard key={coach.coach_id._id} coach={coach} selected={coach.coach_id._id === selectedCoachId} onSelect={setSelectedCoachId} />
            ))}

            <TouchableOpacity onPress={handleSubmit} className="mt-1 mb-28 bg-blue-500 py-3 rounded-lg">
                <Text className="text-center text-white font-semibold">Gửi Yêu Cầu</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreateQuitPlanRequest;
