import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { getMeetSessionsUser } from '../../api/meetSessionApi';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { ArrowLeft } from 'lucide-react-native';

const MyMeetingsScreen = () => {
    const [meetings, setMeetings] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchMeetings = async () => {
        try {
            const response = await getMeetSessionsUser();
            setMeetings(response.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchMeetings();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchMeetings().then(() => setRefreshing(false));
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed':
                return 'text-green-500';
            case 'pending':
                return 'text-yellow-500';
            case 'cancelled':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const renderMeeting = ({ item }) => (
        <View className="bg-white p-4 rounded-lg shadow-md mb-4">
            <Text className="text-lg font-bold text-gray-800">Coach: {item.coach_id.name}</Text>
            <Text className="text-base text-gray-600">Mục đích: {item.purpose}</Text>
            <Text className="text-base text-gray-600">Ngày: {moment(item.schedule_at).format('HH:mm DD/MM/YYYY')}</Text>
            <Text className={`text-base font-bold ${getStatusStyle(item.status)}`}>
                Trạng thái: {item.status}
            </Text>
            {item.status === 'accepted' && item.meet_link && (
                <TouchableOpacity onPress={() => Linking.openURL(item.meet_link)}>
                    <Text className="text-blue-500 text-base mt-2">Tham gia buổi gặp</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="p-4">
                <TouchableOpacity className='p-2 absolute z-20 top-2 left-2' onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Các buổi hẹn của tôi</Text>
                <FlatList
                    data={meetings}
                    renderItem={renderMeeting}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">Bạn không có buổi hẹn nào.</Text>}
                />
            </View>
        </SafeAreaView>
    );
};

export default MyMeetingsScreen;
