import axios from 'axios';
import { getToken } from '../utils/authStorage';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const editProfile = async (data, id) => {
    const token = await getToken(); // Get token asynchronously
    return await axios.put(`${API_BASE_URL}/user/edit-profile/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const getProfile = async (id) => {
    const token = await getToken(); // Get token asynchronously
    return await axios.get(`${API_BASE_URL}/user/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};