import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const createPosts = async (data) => {
    return await axios.post(`${API_BASE_URL}/posts/create`, data);
};

export const getPosts = async () => {
    return await axios.get(`${API_BASE_URL}/posts`);
};

export const getPostsById = async (id) => {
    return await axios.get(`${API_BASE_URL}/posts/${id}`);
};

export const likePosts = async (id) => {
    return await axios.post(`${API_BASE_URL}/posts/like/${id}`, {});
};

export const editPosts = async (id, data) => {
    return await axios.put(`${API_BASE_URL}/posts/${id}`, data);
};

export const deletePosts = async (id) => {
    return await axios.delete(`${API_BASE_URL}/posts/${id}`);
};

export const getPostsByUserId = async (id) => {
    return await axios.get(`${API_BASE_URL}/posts/user/${id}`);
};