import axios from '../configs/axios';

export const getChatBot = async (chatId) => {
    return await axios.get(`/chat/${chatId}`);
};

export const postChatBot = async (userId) => {
    return await axios.post(`/chat`, userId)
};

export const postChatMessage = async (chatId, data) => {
    return await axios.post(`/chat/${chatId}/message`, data)
};

export const getChatSessions = async (userId) => {
    return await axios.get(`/chat/sessions/${userId}`);
};
