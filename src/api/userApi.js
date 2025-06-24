import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const editProfile = async (data, id) => {
    return await axios.put(`${API_BASE_URL}/user/edit-profile/${id}`, data);
};

export const getProfile = async (id) => {
    return await axios.get(`${API_BASE_URL}/user/${id}`);
};