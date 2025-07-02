import axios from 'axios';
import { getToken } from '../utils/authStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL; // hoặc lấy từ biến môi trường nếu có

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Add request interceptor to automatically add token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Hiện toast hoặc log lỗi
        showToast(error.message);
        // console.error(error)
        return Promise.reject(error);
    }
);
// Nếu muốn xử lý token hết hạn, hãy xử lý ở nơi gọi API hoặc truyền hàm callback điều hướng

export default axiosInstance;