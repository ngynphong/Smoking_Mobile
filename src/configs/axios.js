import axios from 'axios';
import { getToken } from '../utils/authStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL; // hoặc lấy từ biến môi trường nếu có

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 40000,
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

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Đừng show toast ở đây!
        return Promise.reject(error);
    }
);

export const setupAxiosInterceptors = (logout) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Check for 401 Unauthorized error
            if (error.response && error.response.status === 401) {
                // Token is expired or invalid, trigger logout
                if (logout) {
                    logout();
                }
            }
            // console.error('API Error:', error.response?.data || error.message);
            return Promise.reject(error);
        }
    );
};


export default axiosInstance;
