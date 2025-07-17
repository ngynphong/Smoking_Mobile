import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRoute, useNavigation } from '@react-navigation/native';
import { bookingMeetSession } from '../../api/meetSessionApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

const BookingScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { coachId } = route.params;

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [purpose, setPurpose] = useState('');

    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedTime(''); // Reset time when a new date is selected
    };

    const handleBooking = async () => {
        if (!selectedDate) {
            Alert.alert('Lỗi', 'Vui lòng chọn một ngày.');
            return;
        }
        if (!selectedTime) {
            Alert.alert('Lỗi', 'Vui lòng chọn một giờ hẹn.');
            return;
        }
        if (!purpose) {
            Alert.alert('Lỗi', 'Vui lòng nhập mục đích cuộc hẹn.');
            return;
        }

        try {
            // Combine date and time and convert to ISO string in UTC
            const scheduleDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

            const data = {
                coach_id: coachId,
                schedule_at: scheduleDateTime.toISOString(),
                purpose: purpose,
            };
            await bookingMeetSession(data);
            Alert.alert('Thành công', 'Yêu cầu đặt lịch của bạn đã được gửi đi.');
            navigation.goBack();
        } catch (error) {
            console.error('Error booking meet session:', error);
            Alert.alert('Lỗi', 'Không thể đặt lịch. Vui lòng thử lại.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* <TouchableOpacity className='p-2 absolute z-20 top-2 left-2' onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity> */}
                <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Đặt lịch hẹn</Text>
                <Calendar
                    onDayPress={handleDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: '#3B82F6' },
                    }}
                    minDate={new Date().toISOString().split('T')[0]}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#3B82F6',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#3B82F6',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                    }}
                    className="mb-6 rounded-lg shadow-md"
                />

                {selectedDate && (
                    <View className="mb-6">
                        <Text className="text-lg font-semibold text-gray-700 mb-3">Chọn giờ hẹn</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {timeSlots.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    className={`w-[23%] items-center justify-center p-3 mb-2 rounded-lg ${selectedTime === time ? 'bg-blue-500' : 'bg-white'}`}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text className={`${selectedTime === time ? 'text-white' : 'text-blue-500'} font-semibold`}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <TextInput
                    className="bg-white p-4 rounded-lg shadow-sm mb-4 text-base mt-2"
                    placeholder="Mục đích cuộc hẹn"
                    value={purpose}
                    onChangeText={setPurpose}
                />
                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-lg shadow-sm items-center"
                    onPress={handleBooking}
                >
                    <Text className="text-white text-lg font-bold">Đặt lịch</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookingScreen;
