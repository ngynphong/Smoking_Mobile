import axios from '../configs/axios';

export const getTasksbyStageId = async (stageId) => {
    return await axios.get(`/tasks/stage/${stageId}`);
};