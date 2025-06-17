import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
    } catch (e) {
        console.error('Failed to save token', e);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (e) {
        console.error('Failed to get token', e);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
    } catch (e) {
        console.error('Failed to remove token', e);
    }
};

export const saveUser = async (user) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
        console.error('Failed to save user', e);
    }
};

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error('Failed to get user', e);
        return null;
    }
};

export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem('user');
    } catch (e) {
        console.error('Failed to remove user', e);
    }
};

export const isAuthenticated = async () => {
    const token = await getToken();
    return token !== null;
};