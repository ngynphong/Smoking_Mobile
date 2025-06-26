import axios from '../configs/axios';
const API_BASE_URL = 'http://localhost:8080/api' || process.env.EXPO_BASE_URL;

export const editProfile = async (data, id) => {
    return await axios.put(`${API_BASE_URL}/user/edit-profile/${id}`, data);
};

export const getProfile = async (id) => {
    return await axios.get(`${API_BASE_URL}/user/${id}`);
};