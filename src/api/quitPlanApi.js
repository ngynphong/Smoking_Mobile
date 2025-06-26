import axios from "../configs/axios";
export const getQuitplanByUserId = async (id) => {
    return await axios.get(`/quitPlan/user/${id}`);
};

export const getAllQuitplan = async () => {
    return await axios.get(`/quitPlan`);
};

export const getAllQuitPlanPublic = async () => {
    return await axios.get(`/quitPlan/public`);
};

export const cloneQuitPlanPublic = async (id) => {
    return await axios.post(`/quitPlan/user/use/${id}`);
};

export const sendRequestQuitPlan = async (data) => {
    return await axios.post(`/quitPlan/request`, data);
};

export const getMyQuitPlanRequests = async () => {
    return await axios.get(`/quitPlan/request/mine`);
};

export const deleteQuitPlanRequest = async (id) => {
    return await axios.delete(`/quitPlan/request/${id}`);
}