import axios from '../configs/axios';

/**
 * Lấy tất cả mục tiêu tài chính của người dùng hiện tại.
 */
export const getMyGoals = () => {
    return axios.get('/financial-goals/me');
};

// /**
//  * Lấy tiến độ của một mục tiêu tài chính cụ thể.
//  * @param {string} goalId - ID của mục tiêu.
//  */
export const getGoalProgress = (goalId) => {
    return axios.get(`/financial-goals/progress/${goalId}`);
};

// /**
//  * Tạo một mục tiêu tài chính mới.
//  * @param {object} data - Dữ liệu mục tiêu.
//  * @param {string} data.title - Tên mục tiêu.
//  * @param {number} data.target_amount - Số tiền cần đạt.
//  */
export const createGoal = (data) => {
    return axios.post('/financial-goals', data);
};

// /**
//  * Cập nhật một mục tiêu tài chính.
//  * @param {string} goalId - ID của mục tiêu.
//  * @param {object} data - Dữ liệu cập nhật.
//  */
export const updateGoal = (goalId, data) => {
    return axios.put(`/financial-goals/${goalId}`, data);
};

// /**
//  * Xóa một mục tiêu tài chính.
//  * @param {string} goalId - ID của mục tiêu.
//  */
export const deleteGoal = (goalId) => {
    return axios.delete(`/financial-goals/${goalId}`);
};