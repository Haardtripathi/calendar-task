import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Edit2, Trash2, Plus, Filter, Clock, AlertCircle } from 'lucide-react';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get('/events');
                console.log('Fetched events:', res.data); // Log fetched data
                const sortedEvents = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(sortedEvents);
                setFilteredEvents(sortedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to fetch events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.post(`/delete-event/${id}`);
            const updatedEvents = events.filter(event => event.id !== id);
            setEvents(updatedEvents);
            setFilteredEvents(updatedEvents);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event. Please try again.');
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-event/${id}`);
    };

    const groupEventsByDate = (events) => {
        return events.reduce((grouped, event) => {
            const date = event.date;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(event);
            return grouped;
        }, {});
    };

    const groupedEvents = groupEventsByDate(filteredEvents);

    const handleFilterChange = (e) => {
        const selectedDate = e.target.value;
        setFilterDate(selectedDate);

        if (selectedDate) {
            const filtered = events.filter(event => event.date === selectedDate);
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
                <div className="text-2xl font-semibold text-gray-700">Loading events...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <p className="text-red-600 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Events</h1>
                    <button
                        onClick={() => navigate('/add-event')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="mr-2" size={18} />
                        Add Event
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Filter Events</h2>
                            <Filter size={20} className="text-gray-500" />
                        </div>
                        <div className="flex items-center">
                            <label className="text-sm font-medium text-gray-700 mr-4" htmlFor="filterDate">Select Date:</label>
                            <input
                                type="date"
                                id="filterDate"
                                value={filterDate}
                                onChange={handleFilterChange}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
                {Object.keys(groupedEvents).length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">No events available for the selected date.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedEvents).map(([date, events]) => (
                            <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="bg-blue-600 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white">
                                        {new Date(date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <div key={event.id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <Clock className="inline-block mr-1" size={16} />
                                                        {event.time}
                                                    </p>
                                                    <p className="text-gray-700">{event.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdate(event.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-150 ease-in-out"
                                                    >
                                                        <Edit2 size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition duration-150 ease-in-out"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventPage;

