import axios from '../configs/axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';


export const getTags = async () => {
    return await axios.get(`${API_BASE_URL}/tags`);
};