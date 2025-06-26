import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getTasksbyStageId = async (stageId) => {
    return await axios.get(`${API_BASE_URL}/tasks/stage/${stageId}`);
};