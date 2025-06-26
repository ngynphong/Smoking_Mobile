import axios from '../configs/axios';

export const getStagebyPlanId = async (id) => {
    return await axios.get(`/stages/plan/${id}`);
}