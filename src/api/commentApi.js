import axios from 'axios';
import { getToken } from '../utils/authStorage';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getPostComments = async (id) => {
    const token = await getToken();
    return await axios.get(`${API_BASE_URL}/comments/post/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const createComment = async (post_id, comment_text) => {
    const token = await getToken();
    return await axios.post(`${API_BASE_URL}/comments/create`, { post_id, comment_text } , {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const deleteComment = async (id) => {
    const token = await getToken();
    return await axios.delete(`${API_BASE_URL}/comments/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const editComment = async (id, comment_text) => {
    const token = await getToken();
    return await axios.put(`${API_BASE_URL}/comments/${id}`, { comment_text }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};