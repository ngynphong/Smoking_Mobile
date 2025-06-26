import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getProgressByPlan = async (id) => {
    return await axios.get(`${API_BASE_URL}/progress/plan/${id}`);
}