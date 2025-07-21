import axios from '../configs/axios';

export const getProgressByPlan = async (id) => {
    return await axios.get(`/progress/plan/${id}`);
}

export const getStreakNumber = async (id) => {
    return await axios.get(`/progress/consecutive-no-smoke/${id}`);
};

export const createProgress = async (data) => {
    return await axios.post('/progress', data)
};

export const updateProgress = async (id, data) => {
    return await axios.put(`/progress/${id}`, data)
};

export const getProgressByStage = async (id) => {
    return await axios.get(`/progress/stage/${id}`)
};

export const getProgressOneStage = async (id) => {
    return await axios.get(`/progress/stage/${id}/user`)
};

export const getProgressOnePlan = async (id) => {
    return await axios.get(`/progress/plan/${id}`)
};

export const getTotalMoneySaved = async (id) => {
    return await axios.get(`/progress/plan/${id}/money-saved`);
};

export const deleteProgress = async (id) => {
    return await axios.delete(`/progress/${id}`);
}

export const getProgressStat = async (planId) => {
    return await axios.get(`/progress/plan/${planId}/smoking-stats`);
}