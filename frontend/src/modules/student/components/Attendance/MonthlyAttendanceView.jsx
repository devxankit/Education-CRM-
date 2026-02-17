import React, { useState } from 'react';
import { colors } from '../../../../theme/colors';

// Helper to get days in month
const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

const MonthlyAttendanceView = ({ monthlyLog = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Calculate calendar grid
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)

    // Create arrays for the grid
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Filter log for current month and build O(1) map
    const logMap = {};
    monthlyLog.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getMonth() === month && entryDate.getFullYear() === year) {
            logMap[entryDate.getDate()] = entry;
        }
    });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(year, month + 1, 1);
        if (nextMonth <= new Date()) {
            setCurrentDate(nextMonth);
        }
    };

    const isNextDisabled = new Date(year, month + 1, 1) > new Date();

    const getStatusStyle = (day) => {
        const log = logMap[day];
        if (!log) return "bg-gray-50/50 text-gray-400 border-gray-100";

        switch (log.status) {
            case "Present": return "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold";
            case "Absent": return "bg-rose-50 text-rose-700 border-rose-100 font-bold";
            case "Late": return "bg-amber-50 text-amber-700 border-amber-100 font-bold";
            case "Leave": return "bg-blue-50 text-blue-700 border-blue-100 font-bold";
            case "Holiday": return "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold underline";
            default: return "bg-gray-50 text-gray-400 border-gray-100";
        }
    };

    const getStatusLabel = (day) => {
        const log = logMap[day];
        if (!log) return day;
        // Optional: Return a dot or letter. Keeping numbers as per screenshot.
        return day;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Monthly View</h3>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-sm font-bold text-gray-700 min-w-[120px] text-center">
                        {monthName}
                    </span>
                    <button
                        onClick={handleNextMonth}
                        disabled={isNextDisabled}
                        className={`p-2 rounded-full transition-colors ${isNextDisabled ? 'text-gray-200' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Weekday Headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                        {d}
                    </div>
                ))}

                {/* Empty Days Offset */}
                {emptyDays.map(i => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {dayNumbers.map(day => (
                    <div
                        key={day}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xs border transition-all ${getStatusStyle(day)}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6 pt-4 border-t border-gray-50 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5 font-medium text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Present
                </div>
                <div className="flex items-center gap-1.5 font-medium text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Absent
                </div>
                <div className="flex items-center gap-1.5 font-medium text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Late
                </div>
                <div className="flex items-center gap-1.5 font-medium text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Leave
                </div>
                <div className="flex items-center gap-1.5 font-medium text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Holiday
                </div>
            </div>
        </div>
    );
};

export default MonthlyAttendanceView;
