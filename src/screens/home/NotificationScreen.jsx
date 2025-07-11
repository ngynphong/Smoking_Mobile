import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { getNotificationByUser } from '../../api/notificationApi';
import { AuthContext } from '../../contexts/AuthContext';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';

const getNotificationStyle = (type) => {
    switch (type) {
        case 'motivation':
            return {
                icon: 'award',
                color: 'bg-blue-100',
                iconColor: 'text-blue-500',
            };
        case 'progress':
            return {
                icon: 'trending-up',
                color: 'bg-green-100',
                iconColor: 'text-green-500',
            };
        default:
            return {
                icon: 'bell',
                color: 'bg-gray-100',
                iconColor: 'text-gray-500',
            };
    }
};

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user && user._id) {
                try {
                    const response = await getNotificationByUser(user._id);
                    setNotifications(response.data);
                } catch (error) {
                    console.error("Failed to fetch notifications:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotifications();
    }, [user]);

    const renderItem = ({ item }) => {
        const { icon, color, iconColor } = getNotificationStyle(item.type);
        return (
            <View className={`flex-row items-center p-4 rounded-lg mb-3 shadow-md ${color}`}>
                <Feather name={icon} size={24} className={iconColor} />
                <View className="ml-4 flex-1">
                    <Text className="text-base text-gray-800">{item.message}</Text>
                    <Text className="text-xs text-gray-500 mt-1 text-right">{moment(item.createdAt).fromNow()}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#00adef" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white pt-5">
            <Text className="text-2xl font-bold text-center mb-5">Notifications</Text>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                ListEmptyComponent={<Text className="text-center mt-12 text-base text-gray-500">No notifications</Text>}
            />
        </View>
    );
}
