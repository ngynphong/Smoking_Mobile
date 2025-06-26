import axios from '../configs/axios';

export const getPostComments = async (id) => {
    return await axios.get(`/comments/post/${id}`);
};

export const createComment = async (post_id, comment_text) => {
    return await axios.post(`/comments/create`, { post_id, comment_text } );
};

export const deleteComment = async (id) => {
    return await axios.delete(`/comments/${id}`);
};

export const editComment = async (id, comment_text) => {
    return await axios.put(`/comments/${id}`, { comment_text });
};