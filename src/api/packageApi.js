import axios from '../configs/axios';

export const getPackages = async () => {
    return await axios.get(`/packages`);
};