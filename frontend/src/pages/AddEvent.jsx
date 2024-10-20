import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isNotAuthenticated } from '../checkAuth';

const AddEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({
        title: '',
        dateAndTime: '',
        description: ''
    });
    const API_URL = "http://localhost:5000"
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        // Check for authentication
        if (isNotAuthenticated()) {
            navigate('/auth/login');
        }

        // Set the selected date without modifying it
        if (location.state && location.state.selectedDate) {
            const originalDate = new Date(location.state.selectedDate);
            setSelectedDate(originalDate); // Directly use the original date
        }
    }, [location.state, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Submitted event details:', eventDetails);
        const response = await axios.post(`${API_URL}/create-event`, { eventDetails, id: localStorage.getItem('userId') });
        // console.log('Add successful:', response.data);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="container mx-auto max-w-md">
                <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block mb-2">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={eventDetails.title}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="dateAndTime" className="block mb-2">Date and Time</label>
                        <input
                            type="datetime-local"
                            id="dateAndTime"
                            name="dateAndTime"
                            value={eventDetails.dateAndTime}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={eventDetails.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        ></textarea>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEvent