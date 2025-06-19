import axios from 'axios';
import { getToken } from '../utils/authStorage';
const API_BASE_URL = process.env.API_BASE_URL || 'https://smokingswp.onrender.com/api';

export const getBadgeUserId = async (id) => {
    const token = await getToken();
    return await axios.get(`${API_BASE_URL}/badges/user/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}
