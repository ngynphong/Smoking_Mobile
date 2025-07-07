import axios from '../configs/axios';

export const register = async (data) => {
    return await axios.post(`/auth/register/send-otp`, data);
};
    
export const login = async (data) => {
    return await axios.post(`/auth/login`, data);
};

export const verifyEmail = async (data) => {
    return await axios.post(`/auth/verify-otp`, data);
}

export const requestPasswordReset = async (data) => {
    return await axios.post('/auth/request-password-reset', data);
};

export const verifyResetOtp = async (data) => {
    return await axios.post('/auth/verify-reset-otp', data);
};

export const resetPassword = async (data) => {
    return await axios.post('/auth/reset-password', data);
};
