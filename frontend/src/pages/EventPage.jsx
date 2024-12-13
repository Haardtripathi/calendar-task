import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/events'); // Adjust endpoint as necessary
                const sortedEvents = res.data.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
                setEvents(sortedEvents);
                setFilteredEvents(sortedEvents); // Initially show all events
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        try {
            // console.log(id)

            await axios.post(`/delete-event/${id}`); // Adjust endpoint as necessary
            const updatedEvents = events.filter(event => event.id !== id);
            setEvents(updatedEvents);
            setFilteredEvents(updatedEvents); // Update the filtered list
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-event/${id}`);
    };

    // Group events by date
    const groupEventsByDate = (events) => {
        return events.reduce((grouped, event) => {
            const date = event.date;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(event);
            return grouped;
        }, {});
    };

    const groupedEvents = groupEventsByDate(filteredEvents);

    // Handle date filter
    const handleFilterChange = (e) => {
        const selectedDate = e.target.value;
        setFilterDate(selectedDate);

        if (selectedDate) {
            const filtered = events.filter(event => event.date === selectedDate);
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events); // Reset filter if no date is selected
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Your Events</h1>
                {/* Filter Section */}
                <div className="mb-8 flex justify-center">
                    <label className="text-gray-700 font-medium mr-4" htmlFor="filterDate">Filter by Date:</label>
                    <input
                        type="date"
                        id="filterDate"
                        value={filterDate}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                {Object.keys(groupedEvents).length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No events available for the selected date.</p>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedEvents).map(([date, events]) => (
                            <div key={date} className="bg-white border rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </h2>
                                <div className="space-y-4">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-lg transition"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Time:</span> {event.time}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Description:</span> {event.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleUpdate(event.id)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
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
