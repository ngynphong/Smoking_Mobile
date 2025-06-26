import axios from '../configs/axios';

export const createPosts = async (data) => {
    return await axios.post(`/posts/create`, data);
};

export const getPosts = async () => {
    return await axios.get(`/posts`);
};

export const getPostsById = async (id) => {
    return await axios.get(`/posts/${id}`);
};

export const likePosts = async (id) => {
    return await axios.post(`/posts/like/${id}`, {});
};

export const editPosts = async (id, data) => {
    return await axios.put(`/posts/${id}`, data);
};

export const deletePosts = async (id) => {
    return await axios.delete(`/posts/${id}`);
};

export const getPostsByUserId = async (id) => {
    return await axios.get(`/posts/user/${id}`);
};