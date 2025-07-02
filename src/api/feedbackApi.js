import axios from '../configs/axios';

export const createFeedback  = async (data) => {
    return await axios.post('/feedback', data);
};

export const getFeedback = async () => {
    return await axios.get('/feedback');
};

export const getFeedbackByUser = async (id) => {
    return await axios.get(`/feedback/user/${id}`);
};

export const getFeedbackByCoach = async (id) => {
    return await axios.get(`/feedback/coach/${id}`);
};

export const getAverageFeedbackByCoach = async (id) => {
    return await axios.get(`/feedback/coach/${id}/average-rating`);
};

export const editFeedback =  async (id, data) => {
    return await axios.put(`feedback/${id}`, data);
};

export const deleteFeedback = async (id) => {
    return await axios.delete(`feedback/${id}`);
};