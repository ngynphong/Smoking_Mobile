import axios from "../configs/axios";

export const getNotifications = async () => {
    return await axios.get(`/notifications`);
};

export const getNotificationByUser = async (userId) => {
    return await axios.get(`/notifications/user/${userId}`);
};

export const markNotificationsAsRead = async () => {
    return await axios.put('/notifications/mark-read');
};