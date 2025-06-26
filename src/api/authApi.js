import axios from 'axios';
export const register = async (data) => {
    return await axios.post(`/auth/register/send-otp`, data);
};
    
export const login = async (data) => {
    return await axios.post(`/auth/login`, data);
};

export const verifyEmail = async (data) => {
    return await axios.post(`/auth/verify-otp`, data);
}
// export const forgotPassword = async (data) => {
//     return await axios.post(`${BASE_URL}/fogot-password`, data);
// };

// export const resetPassword = async (token, data) => {
//     return await axios.post(`${BASE_URL}/resset-password/${token}`, data);
// };
