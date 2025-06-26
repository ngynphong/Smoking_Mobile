import axios from '../configs/axios';
const API_BASE_URL = 'http://localhost:8080/api' || process.env.EXPO_BASE_URL;

export const getProgressByPlan = async (id) => {
    return await axios.get(`${API_BASE_URL}/progress/plan/${id}`);
}