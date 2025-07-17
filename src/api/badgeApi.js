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

/**
 * Fetches the leaderboard data based on a specific type.
 * @param {('points'|'no_smoke_days'|'money_saved'|'badge_count')} type - The type of leaderboard to fetch.
 */
export const leaderBoard = async (type = 'points') => {
    // The endpoint uses 'leaderboard' for points and 'leaderboards' for others,
    return await axios.get(`/badges/leaderboard?type=${type}`);
}