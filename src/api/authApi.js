import axios from 'axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';
export const register = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/register`, data);
};
    
export const login = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/login`, data);
};

// export const forgotPassword = async (data) => {
//     return await axios.post(`${BASE_URL}/fogot-password`, data);
// };

// export const resetPassword = async (token, data) => {
//     return await axios.post(`${BASE_URL}/resset-password/${token}`, data);
// };
