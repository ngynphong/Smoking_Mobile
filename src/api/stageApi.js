import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getStagebyPlanId = async(id) => {
    return await axios.get(`${API_BASE_URL}/stages/plan/${id}`);
}