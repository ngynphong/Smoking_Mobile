import axios from '../configs/axios';

export const editProfile = async (data, id) => {
    return await axios.put(`/user/edit-profile/${id}`, data);
};

export const getProfile = async (id) => {
    return await axios.get(`/user/${id}`);
};