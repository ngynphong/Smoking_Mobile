import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { getNotificationByUser, markNotificationsAsRead } from '../../api/notificationApi';
import { AuthContext } from '../../contexts/AuthContext';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import Loading from '../../components/Loading';
import { useFocusEffect } from '@react-navigation/native';

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

    useFocusEffect(
        React.useCallback(() => {
            const fetchNotifications = async () => {
                if (user && user.id) {
                    try {
                        const response = await getNotificationByUser(user.id);
                        setNotifications(response.data);
                    } catch (error) {
                        console.error("Failed to fetch notifications:", error);
                    } finally {
                        setLoading(false);
                    }
                }
            };

            fetchNotifications();
        }, [user])
    );

    useFocusEffect(
        React.useCallback(() => {
            const markAsRead = async () => {
                if (user?.id && notifications.length > 0) {
                    try {
                        await markNotificationsAsRead(user.id);
                    } catch (error) {
                        console.error("Failed to mark notifications as read:", error);
                    }
                }
            };
            markAsRead();
        }, [notifications, user])
    );

    const renderItem = ({ item }) => {
        const { icon, color, iconColor } = getNotificationStyle(item.type);
        return (
            <View
                className={`flex-row items-center p-4 rounded-lg mb-3 shadow-md 
            ${color} ${!item.is_read ? 'border-l-4 border-blue-500' : ''}`}
            >
                <Feather name={icon} size={24} className={iconColor} />
                <View className="ml-4 flex-1">
                    <Text className={`text-base ${!item.is_read ? 'font-bold' : ''} text-gray-800`}>
                        {item.message}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1 text-right">
                        {moment(item.createdAt).fromNow()}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return <Loading />;
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
