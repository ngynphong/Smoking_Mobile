import axios from '../configs/axios';

export const getTasksbyStageId = async (stageId) => {
    return await axios.get(`/tasks/stage/${stageId}`);
};

export const completeTask = async (task_id) => {
    return await axios.post(`/tasks/${task_id}/complete`);
};

export const getTaskCompleted = async (id) => {
    return await axios.get(`tasks/stage/${id}/completed`);
}