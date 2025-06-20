import axios from 'axios';
import { getToken } from '../utils/authStorage';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const createPosts = async (data) => {
    const token = await getToken();
    return await axios.post(`${API_BASE_URL}/posts/create`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const getPosts = async () => {
    const token = await getToken();
    return await axios.get(`${API_BASE_URL}/posts`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const getPostsById = async (id) => {
    const token = await getToken();
    return await axios.get(`${API_BASE_URL}/posts/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const likePosts = async (id) => {
    const token = await getToken();
    console.log(token);
    return await axios.post(`${API_BASE_URL}/posts/like/${id}`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const editPosts = async (id, data) => {
    const token = await getToken();
    return await axios.put(`${API_BASE_URL}/posts/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const deletePosts = async (id) => {
    const token = await getToken();
    return await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const getPostsByUserId = async (id) => {
    const token = await getToken();
    return await axios.get(`${API_BASE_URL}/posts/user/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};