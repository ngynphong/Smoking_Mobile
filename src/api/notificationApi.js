import axios from "../configs/axios";

export const getNotifications = async () => {
    return await axios.get(`/notifications`);
};

export const getNotificationByUser = async (userId) => {
    return await axios.get(`/notifications/user/${userId}`);
}