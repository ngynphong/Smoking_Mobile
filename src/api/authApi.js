import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api' || process.env.EXPO_BASE_URL;
export const register = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/register/send-otp`, data);
};
    
export const login = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/login`, data);
};

export const verifyEmail = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/verify-otp`, data);
}
// export const forgotPassword = async (data) => {
//     return await axios.post(`${BASE_URL}/fogot-password`, data);
// };

// export const resetPassword = async (token, data) => {
//     return await axios.post(`${BASE_URL}/resset-password/${token}`, data);
// };
