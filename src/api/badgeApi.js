import axios from '../configs/axios';

export const getBadgeUserId = async (id) => {
    return await axios.get(`/badges/user/${id}`);
}

export const shareBadge = async (data) => {
    return await axios.post(`/user-badges/share`, data);
}

export const getBadges = async () => {
    return await axios.get(`/user-badges`);
}

export const leaderBoard = async () => {
    return await axios.get(`/badges/leaderboard`);
}