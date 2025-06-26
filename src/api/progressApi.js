import axios from '../configs/axios';

export const getProgressByPlan = async (id) => {
    return await axios.get(`/progress/plan/${id}`);
}