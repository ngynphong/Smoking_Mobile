import axios from '../configs/axios';

export const getMeetSessionsCoach = async () => {
    return await axios.get(`/meet-session/coach`);
};

export const getMeetSessionsUser = async () => {
    return await axios.get(`/meet-session/user`);
};

export const bookingMeetSession = async (data) => {
    return await axios.post(`/meet-session`, data);
};

export const updateMeetSession = async (id, data) => {
    return await axios.put(`/meet-session/${id}/status`, data);
};
