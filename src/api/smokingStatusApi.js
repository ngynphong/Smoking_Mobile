import axios from '../configs/axios';

export const getSmokingStatus = async (id) => {
    return await axios.get(`/smoking-status/${id}`);
};

export const createSmokingStatus = async (id, data) => {
    return await axios.post(`/smoking-status/${id}`, data);
};

export const editSmokingStatus = async (id, data) => {
    return await axios.put(`/smoking-status/${id}`, data);
};

export const deleteSmokingStatus = async (id, data) => {
    return await axios.delete(`/smoking-status/${id}`);
};