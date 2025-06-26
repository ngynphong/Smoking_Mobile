import axios from '../configs/axios';


export const getTags = async () => {
    return await axios.get(`/tags`);
};