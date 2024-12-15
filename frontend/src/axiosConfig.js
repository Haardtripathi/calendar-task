import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://calendar-task-demo1.onrender.com"
    // baseURL: 'http://localhost:3000', // Backend URL
    // baseURL: "https://calendar-task-6bj8.onrender.com"
});

// Attach token to every request if available
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
