import axios from '../configs/axios';

export const createSubscription = async (packageId) => {
    return await axios.post('/subscriptions', { package_id: packageId });
};

export const createPaymentLink = async (subscriptionId) => {
    return await axios.post('/payments/create-payment-link', { subscription_id: subscriptionId });
};
