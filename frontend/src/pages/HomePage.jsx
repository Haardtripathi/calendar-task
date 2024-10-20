import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNotAuthenticated } from '../checkAuth';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isNotAuthenticated()) {
            navigate('/auth/login');
        }
    }, [navigate]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        // console.log('Current Month:', currentMonth);
        // console.log('Selected Date:', selectedDate);
    }, [currentMonth, selectedDate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // console.log('Clicked date:', newDate);
        setSelectedDate(prevDate =>
            prevDate && prevDate.getTime() === newDate.getTime() ? null : newDate
        );
    };

    const handleCreateEvent = () => {
        if (selectedDate) {
            navigate('/create-event', { state: { selectedDate: selectedDate.toISOString() } });
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // console.log('Rendering calendar for:', year, month + 1);

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<td key={`empty-${i}`} className="p-2"></td>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
            // console.log('Day:', day, 'Is Selected:', isSelected);

            days.push(
                <td
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className="p-2 text-center cursor-pointer"
                >
                    <div className={`w-8 h-8 flex items-center justify-center mx-auto rounded-full
            ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}>
                        {day}
                    </div>
                </td>
            );
        }

        const totalSlots = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        for (let i = days.length; i < totalSlots; i++) {
            days.push(<td key={`empty-end-${i}`} className="p-2"></td>);
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
        }

        return weeks;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="container mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Calendar</h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </header>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                            className="text-gray-400 hover:text-white"
                        >
                            &lt;
                        </button>
                        <h2 className="text-xl font-semibold">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                            className="text-gray-400 hover:text-white"
                        >
                            &gt;
                        </button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <th key={day} className="p-2 text-gray-400">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>{renderCalendar()}</tbody>
                    </table>
                </div>
                {selectedDate && (
                    <div className="mt-8 text-center">
                        <p className="text-xl mb-4">
                            Selected date: {selectedDate.toDateString()} ({selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()})
                        </p>
                        <button
                            onClick={handleCreateEvent}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Event
                        </button>

                        <button
                            onClick={handleCreateEvent}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Event
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;