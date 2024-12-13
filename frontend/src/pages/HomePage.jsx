import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [recentEvents, setRecentEvents] = useState([]);
    const navigate = useNavigate();

    // Fetch recent events (today and tomorrow) on component mount
    useEffect(() => {
        const fetchRecentEvents = async () => {
            try {
                const res = await axios.get('/recent-events'); // API call for recent events
                setRecentEvents(res.data);
            } catch (error) {
                console.error('Error fetching recent events:', error);
                setRecentEvents([]); // Clear the list if there's an error
            }
        };

        fetchRecentEvents();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // console.log('Selected Date:', date);
    };

    const handleAddEventClick = () => {
        const localDate = selectedDate.toLocaleDateString('en-CA');
        ('Formatted Local Date:', localDate);
        navigate('/add-event', { state: { selectedDate: localDate } });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-5">
            <div className="bg-white border rounded-lg shadow-md p-6 w-full max-w-3xl">
                <h1 className="text-xl font-semibold text-gray-800 text-center mb-4">Select a Date</h1>
                <div className="mb-6">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={new Date()} // Restrict past dates
                        className="professional-calendar"
                    />
                </div>
                <p className="text-center text-gray-600">
                    Selected Date: <span className="text-gray-800 font-medium">{selectedDate.toDateString()}</span>
                </p>
                <div className="flex justify-center mt-4">
                    <button onClick={handleAddEventClick} className="bg-green-600 text-white px-4 py-2 rounded-md">
                        Add Event
                    </button>
                </div>
            </div>

            {/* Recent Events Section */}
            <div className="bg-white border rounded-lg shadow-md p-6 w-full max-w-3xl mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events in near 2 days.</h2>
                {recentEvents.length === 0 ? (
                    <p className="text-center text-gray-600">No upcoming events.</p>
                ) : (
                    <div className="space-y-4">
                        {recentEvents.map((event) => (
                            <div
                                key={event.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-gray-700">{event.title}</h3>
                                <p className="text-gray-600">
                                    <span className="font-medium">Date:</span> {event.date}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Time:</span> {event.time}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Description:</span> {event.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
