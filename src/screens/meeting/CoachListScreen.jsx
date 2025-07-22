import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { getAllCoaches } from '../../api/coachApi';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

const CoachListScreen = () => {
    const [coaches, setCoaches] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await getAllCoaches();
                setCoaches(response.data);
            } catch (error) {
                console.error('Error fetching coaches:', error);
            }
        };

        fetchCoaches();
    }, []);

    const renderCoach = ({ item }) => (
        <TouchableOpacity
            className="bg-white p-4 rounded-lg shadow-sm mb-4 flex-row items-center"
            onPress={() => navigation.navigate('BookingScreen', { coachId: item.coach_id._id })}
        >
            <Image
                source={{ uri: item.coach_id.avatar_url || 'https://via.placeholder.com/150' }}
                className="w-20 h-20 rounded-full mr-4"
            />
            <View>
                <Text className="text-lg font-bold text-gray-800">{item.coach_id.name}</Text>
                <Text className="text-sm text-gray-600">{item.specialization}</Text>
                <Text className="text-xs text-gray-400">Kinh nghiệm: {item.experience_years} năm</Text>
                <Text className="text-xs text-gray-400">Buổi hỗ trợ: {item.total_sessions} buổi</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="p-4">
                {/* <TouchableOpacity className='p-2 absolute z-20 top-2 left-2' onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity> */}
                <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Chọn một Coach</Text>
                <FlatList
                    data={coaches}
                    renderItem={renderCoach}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default CoachListScreen;
