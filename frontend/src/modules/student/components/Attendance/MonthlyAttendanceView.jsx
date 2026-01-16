import React, { useState } from 'react';
import { colors } from '../../../../theme/colors';

// Helper to get days in month
const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

const MonthlyAttendanceView = ({ monthlyLog }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Basic Month navigation (Visual only for now since mock data is static)
    // In a real app, this would fetch new data
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Create grid days
    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Map log to day dictionary for O(1) Access
    // assuming mock log is for "this" month.
    const logMap = {};
    monthlyLog.forEach(entry => {
        const day = new Date(entry.date).getDate();
        logMap[day] = entry;
    });

    const getStatusStyle = (day) => {
        const log = logMap[day];
        if (!log) return "bg-gray-50 text-gray-400"; // No data / Weekend not logged

        switch (log.status) {
            case "Present": return "bg-green-100 text-green-700 border-green-200";
            case "Absent": return "bg-red-100 text-red-700 border-red-200 font-bold";
            case "Leave": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Holiday": return "bg-blue-50 text-blue-600 border-blue-100";
            default: return "bg-gray-50 text-gray-400";
        }
    };

    const getStatusLabel = (day) => {
        const log = logMap[day];
        if (!log) return "";
        if (log.status === "Present") return "P";
        if (log.status === "Absent") return "A";
        if (log.status === "Leave") return "L";
        if (log.status === "Holiday") return "H";
        return "";
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Monthly View</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <button onClick={() => { }} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30">
                        &lt;
                    </button>
                    <span className="font-medium min-w-[100px] text-center">{monthName}</span>
                    <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-30" disabled>
                        &gt;
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] text-gray-400 font-medium">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {/* Note: In a real cal, we need empty cells for start day offset. skipping for simplicity here */}
                {daysArray.map(day => (
                    <div
                        key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs border ${getStatusStyle(day)}`}
                    >
                        {getStatusLabel(day) || day}
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Leave</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Holiday</div>
            </div>
        </div>
    );
};

export default MonthlyAttendanceView;
