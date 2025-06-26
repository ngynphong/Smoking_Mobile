import axios from '../configs/axios';

export const getAllCoaches = async () => {
    return await axios.get(`/coach`);
}