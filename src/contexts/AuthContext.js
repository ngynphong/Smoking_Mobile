import React, { createContext, useState, useEffect } from 'react';
import { getToken, isAuthenticated, getUser, saveUser, saveToken, removeUser, removeToken } from '../utils/authStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authStatus, setAuthStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const loadAuth = async () => {
        const token = await getToken();
        const status = await isAuthenticated();
        const currentUser = await getUser();

        setAuthStatus(status);
        setUser(currentUser);
        setIsLoading(false);
    };

    useEffect(() => {
        loadAuth();
    }, []);

    const login = async (token, userData) => {
        await saveToken(token);
        await saveUser(userData);
        setAuthStatus(true);
        setUser(userData);
    };

    const logout = async () => {
        await removeToken();
        await removeUser();
        setAuthStatus(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authStatus, isLoading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
