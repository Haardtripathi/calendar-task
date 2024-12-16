import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, PlusCircleIcon, ClockIcon } from 'lucide-react';

const HomePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [recentEvents, setRecentEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentEvents = async () => {
            try {
                const res = await axios.get('/recent-events');
                setRecentEvents(res.data);
            } catch (error) {
                console.error('Error fetching recent events:', error);
                setRecentEvents([]);
            }
        };

        fetchRecentEvents();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleAddEventClick = () => {
        const localDate = selectedDate.toLocaleDateString('en-CA');
        navigate('/add-event', { state: { selectedDate: localDate } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <CalendarIcon className="mr-2" /> Select a Date
                            </h2>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                minDate={new Date()}
                                className="professional-calendar"
                            />
                            <p className="text-center text-gray-600 mt-4">
                                Selected Date: <span className="text-gray-800 font-medium">{selectedDate.toDateString()}</span>
                            </p>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleAddEventClick}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <PlusCircleIcon className="mr-2" />
                                    Add Event
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gray-50 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <ClockIcon className="mr-2" /> Upcoming Events
                            </h2>
                            {recentEvents.length === 0 ? (
                                <p className="text-center text-gray-600">No upcoming events in the next 2 days.</p>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {recentEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-300 ease-in-out"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-700">{event.title}</h3>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Date:</span> {event.date}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Time:</span> {event.startTime} - {event.endTime}
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                <span className="font-medium">Description:</span> {event.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
