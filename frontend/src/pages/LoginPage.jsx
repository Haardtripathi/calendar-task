import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, isNotAuthenticated } from '../checkAuth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // useEffect to check authentication status and redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const API_URL = "http://localhost:5000"

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            // console.log('Login successful:', response.data);
            // Store the token and userId in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            navigate("/")
        } catch (err) {
            console.error('Error during login:', err);
            setError(err.response?.data?.message || 'An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const pageVariants = {
        initial: { opacity: 0, y: -50 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: 50 }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen bg-gray-900 flex items-center justify-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold mb-6 text-white text-center"
                >
                    Log In
                </motion.h2>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-red-500 text-white p-3 rounded-md mb-4"
                    >
                        {error}
                    </motion.div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            initial="blur"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            initial="blur"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </motion.button>
                </form>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-4 text-center text-gray-400"
                >
                    Don't have an account?{' '}
                    <Link to="/auth/signup" className="text-blue-400 hover:underline">Signup</Link>

                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default LoginPage;