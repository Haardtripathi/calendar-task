import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from '../axiosConfig';

const UpdateEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        title: '',
        time: '',
        description: '',
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`/update-event/${id}`);
                const event = res.data;
                // console.log(event)
                setFormData({
                    date: event.date || new Date().toLocaleDateString('en-CA'),
                    title: event.title || '',
                    time: event.time || '',
                    description: event.description || '',
                });
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/updateEvent/${id}`, formData);
            navigate('/events');
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white border rounded-lg shadow-md p-6 w-full max-w-3xl">
                <h1 className="text-xl font-semibold text-gray-800 text-center mb-6">Update Event</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            min={new Date().toLocaleDateString('en-CA')} // Restrict past dates
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Time</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Update Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateEventPage;
