/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(true);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }

        // Axios response interceptor
        const interceptor = axios.interceptors.response.use(
            (response) => response, // Pass through if the response is successful
            (error) => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.error('Token expired or invalid. Logging out...');
                    logout(); // Trigger logout if token is expired
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on component unmount
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (email, password) => {
        // console.log(email, password);
        const response = await axios.post('/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export AuthContext
export default AuthContext;
