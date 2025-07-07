import axios from '../configs/axios';

export const getMyActiveSubscription = async () => {
    return await axios.get('/subscriptions/my-active-subscription');
};
