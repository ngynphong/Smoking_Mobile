import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getBadgeUserId = async (id) => {
    return await axios.get(`${API_BASE_URL}/badges/user/${id}`);
}

export const shareBadge = async (data) => {
    return await axios.post(`${API_BASE_URL}/user-badges/share`, data);
}

export const getBadges = async () => {
    return await axios.get(`${API_BASE_URL}/user-badges`);
}

export const leaderBoard = async () => {
    return await axios.get(`${API_BASE_URL}/badges/leaderboard`);
}