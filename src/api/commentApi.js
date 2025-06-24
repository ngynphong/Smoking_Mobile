import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getPostComments = async (id) => {
    return await axios.get(`${API_BASE_URL}/comments/post/${id}`);
};

export const createComment = async (post_id, comment_text) => {
    return await axios.post(`${API_BASE_URL}/comments/create`, { post_id, comment_text } );
};

export const deleteComment = async (id) => {
    return await axios.delete(`${API_BASE_URL}/comments/${id}`);
};

export const editComment = async (id, comment_text) => {
    return await axios.put(`${API_BASE_URL}/comments/${id}`, { comment_text });
};