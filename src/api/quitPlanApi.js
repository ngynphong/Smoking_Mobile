import axios from "../configs/axios";
const API_BASE_URL = 'http://localhost:8080/api' || process.env.EXPO_BASE_URL;
export const getQuitplanByUserId = async (id) => {
    return await axios.get(`${API_BASE_URL}/quitPlan/user/${id}`);
};

export const getAllQuitplan = async () => {
    return await axios.get(`${API_BASE_URL}/quitPlan`);
};

export const getAllQuitPlanPublic = async () => {
    return await axios.get(`${API_BASE_URL}/quitPlan/public`);
};

export const cloneQuitPlanPublic = async (id) => {
    return await axios.post(`${API_BASE_URL}/quitPlan/user/use/${id}`);
};

export const sendRequestQuitPlan = async (data) => {
    return await axios.post(`${API_BASE_URL}/quitPlan/request`, data);
};

export const getMyQuitPlanRequests = async () => {
    return await axios.get(`${API_BASE_URL}/quitPlan/request/mine`);
};

export const deleteQuitPlanRequest = async (id) => {
    return await axios.delete(`${API_BASE_URL}/quitPlan/request/${id}`);
}