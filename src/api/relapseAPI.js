import axios from '../configs/axios';

/**
 * Ghi nhận một sự kiện tái nghiện
 * @param {object} data - Dữ liệu về sự kiện tái nghiện.
 * @param {number} data.cigarettes_smoked - Số lượng thuốc đã hút.
 * @param {string} [data.activity] - Hoạt động kích hoạt (tùy chọn).
 * @param {string} [data.emotion] - Cảm xúc lúc đó (tùy chọn).
 */

export const logRelapse = async (data) => {
    return await axios.post('/relapse-events', data); 
};