import axios from '../configs/axios';
const API_BASE_URL = 'http://localhost:8080/api' || process.env.EXPO_BASE_URL;

export const getSmokingStatus = async (id) => {
    return await axios.get(`${API_BASE_URL}/smoking-status/${id}`);
};

export const createSmokingStatus = async (id, data) => {
    return await axios.post(`${API_BASE_URL}/smoking-status/${id}`, data);
};

export const editSmokingStatus = async (id, data) => {
    return await axios.put(`${API_BASE_URL}/smoking-status/${id}`, data);
};

export const deleteSmokingStatus = async (id, data) => {
    return await axios.delete(`${API_BASE_URL}/smoking-status/${id}`);
};